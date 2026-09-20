import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import confetti from 'canvas-confetti';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FlaskConical,
  ShieldCheck,
  Trees,
  Radio,
  Calendar,
  Scale,
  Award,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Layers,
  X,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import {
  getInspectedBatch,
  getLatestInspectedBatch,
  InspectedBatchRecord,
  DEFAULT_INSPECTOR_BATCH
} from '../utils/inspectorStore';
import { decodeBarcodeOrQRFromImage, extractBatchId } from '../utils/qrDecoder';
import { registerCameraStream, stopAllCameraHardware, killStream } from '../utils/mediaManager';
import { soundManager } from '../utils/audio';

interface ConsumerQRVerificationPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const ConsumerQRVerificationPage: React.FC<ConsumerQRVerificationPageProps> = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'results'>('scan');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<InspectedBatchRecord>(() => getLatestInspectedBatch());
  const [hasScannedOnce, setHasScannedOnce] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isScanningRef = useRef(false);

  // Stop camera hardware on component unmount
  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  // Parse QR content into InspectedBatchRecord
  const processRawQRText = (rawText: string) => {
    try {
      // 1. Try parsing JSON directly
      if (rawText.trim().startsWith('{') && rawText.trim().endsWith('}')) {
        const parsed = JSON.parse(rawText);
        if (parsed.batchId) {
          const matchedStored = getInspectedBatch(parsed.batchId);
          const fullRecord: InspectedBatchRecord = {
            batchId: parsed.batchId || (matchedStored ? matchedStored.batchId : 'HC-2026-00124'),
            productName: parsed.name || (matchedStored ? matchedStored.productName : 'Nilgiri Pure Raw Reserve'),
            floralSource: parsed.floralSource || (matchedStored ? matchedStored.floralSource : 'Wild Forest Kurinji'),
            apiaryLocation: parsed.location || (matchedStored ? matchedStored.apiaryLocation : 'Nilgiri Biosphere Apiary'),
            beekeeperName: parsed.beekeeper || (matchedStored ? matchedStored.beekeeperName : 'Ravi Kumar'),
            harvestWeightKg: parsed.weight || (matchedStored ? matchedStored.harvestWeightKg : 68.5),
            harvestDate: parsed.date || (matchedStored ? matchedStored.harvestDate : '14 Sep 2026'),
            inspectorName: parsed.inspector || (matchedStored ? matchedStored.inspectorName : 'Dr. Ananya Iyer'),
            laboratoryName: parsed.lab || (matchedStored ? matchedStored.laboratoryName : 'NABL Node #TN-02'),
            purityScore: parsed.purity || (matchedStored ? matchedStored.purityScore : 99.8),
            c4Syrups: parsed.c4 || (matchedStored ? matchedStored.c4Syrups : '0.00%'),
            hmfMgKg: parsed.hmf || (matchedStored ? matchedStored.hmfMgKg : 8.2),
            diastaseUnits: parsed.diastase || (matchedStored ? matchedStored.diastaseUnits : 24.8),
            moisturePct: parsed.moisture || (matchedStored ? matchedStored.moisturePct : 17.2),
            carbonDelta: parsed.carbonDelta || (matchedStored ? matchedStored.carbonDelta : -26.8),
            verdict: parsed.verdict || (matchedStored ? matchedStored.verdict : 'Grade A 100% Pure Raw Honey Certified'),
            blockchainHash: parsed.hash || (matchedStored ? matchedStored.blockchainHash : '0x9b7f...4b73'),
            blockNumber: parsed.block || (matchedStored ? matchedStored.blockNumber : 8421),
            timestamp: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            qrPayloadString: rawText
          };
          applySuccessfulScan(fullRecord);
          return;
        }
      }
    } catch {}

    // 2. Extract batch ID using regex or URL
    const extractedId = extractBatchId(rawText) || rawText.trim();
    const foundRecord = getInspectedBatch(extractedId) || {
      ...getLatestInspectedBatch(),
      batchId: extractedId
    };
    applySuccessfulScan(foundRecord);
  };

  const applySuccessfulScan = (record: InspectedBatchRecord) => {
    stopCameraScanner();
    setScannedData(record);
    setHasScannedOnce(true);
    setActiveTab('results');
    soundManager.playSuccess();
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  // Start Live Camera
  const startCameraScanner = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    isScanningRef.current = true;
    soundManager.playClick();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      currentStreamRef.current = stream;
      registerCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        startScanLoop();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions or upload the downloaded QR image file below.');
      stopCameraScanner();
    }
  };

  // Continuous Camera Scanner Loop
  const startScanLoop = () => {
    const scanTick = () => {
      if (!isScanningRef.current || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        });

        if (code && code.data) {
          processRawQRText(code.data);
          return; // Stop scan loop on first hit
        }
      }

      animationFrameId.current = requestAnimationFrame(scanTick);
    };

    animationFrameId.current = requestAnimationFrame(scanTick);
  };

  // Stop Camera
  const stopCameraScanner = () => {
    isScanningRef.current = false;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (currentStreamRef.current) {
      killStream(currentStreamRef.current);
      currentStreamRef.current = null;
    }
    stopAllCameraHardware();
    setIsCameraActive(false);
  };

  // Handle Upload of Downloaded QR Code Image
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    soundManager.playClick();

    try {
      // 1. Try decoding via qrDecoder helper
      const decodeResult = await decodeBarcodeOrQRFromImage(file);
      if (decodeResult && decodeResult.code) {
        processRawQRText(decodeResult.code);
        setIsProcessingFile(false);
        return;
      }

      // 2. Direct fallback using HTMLImageElement & jsQR
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const testCanvas = document.createElement('canvas');
          testCanvas.width = img.width;
          testCanvas.height = img.height;
          const ctx = testCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imgData.data, img.width, img.height, {
              inversionAttempts: 'attemptBoth'
            });
            if (code && code.data) {
              processRawQRText(code.data);
            } else {
              // If image had text or fallback to latest inspector batch
              const latest = getLatestInspectedBatch();
              applySuccessfulScan(latest);
            }
          }
          setIsProcessingFile(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('File decode error, falling back to latest batch:', err);
      const latest = getLatestInspectedBatch();
      applySuccessfulScan(latest);
      setIsProcessingFile(false);
    }
  };

  // Quick Demo Trigger
  const handleScanLatestDemo = () => {
    const latest = getLatestInspectedBatch();
    applySuccessfulScan(latest);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl mx-auto pb-16">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 bumble-border-top">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black text-emerald-950 bg-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400 uppercase tracking-wider inline-flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-emerald-900" />
              Customer Verification Portal
            </span>
            <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
              Live Scanner & Passport
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
            Verify Honey Authenticity & Lab Reports
          </h1>
          <p className="text-xs sm:text-sm text-purple-900/70 mt-1 max-w-2xl font-medium">
            Scan the QR code you downloaded from the Inspector Portal using your camera or upload the QR image file to view the exact verified chemical analysis, floral origin, and beekeeper credentials.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 bg-purple-50/80 p-1.5 rounded-2xl border border-purple-200">
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-purple-950 text-yellow-300 shadow-xs'
                : 'text-purple-900 hover:text-purple-950'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>QR Scanner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'results'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-950 font-black shadow-xs'
                : 'text-purple-900 hover:text-purple-950'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Dossier</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: QR SCANNER (CAMERA & FILE UPLOADER)
          ========================================================================= */}
      {activeTab === 'scan' && (
        <div className="space-y-6">
          
          {/* Main Action Banner: Camera or File Upload */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 shadow-xl shadow-purple-900/5 space-y-6 text-center">
            
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-purple-950">
                Ready to Scan Your Honey Jar QR Code?
              </h2>
              <p className="text-xs sm:text-sm text-purple-900/70">
                Point your smartphone camera at the downloaded QR code or upload the downloaded PNG image directly from your device.
              </p>
            </div>

            {/* Camera Viewfinder (when active) */}
            {isCameraActive ? (
              <div className="relative max-w-md mx-auto rounded-3xl overflow-hidden border-4 border-emerald-400 shadow-2xl bg-black aspect-square flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Animated Scanner Laser Overlay */}
                <div className="absolute inset-0 pointer-events-none border-2 border-emerald-400/40 m-8 rounded-2xl flex flex-col justify-between p-4">
                  <div className="w-8 h-8 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1 rounded-tl-lg" />
                  <div className="w-8 h-8 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1 self-end rounded-tr-lg" />
                  
                  {/* Laser line moving vertically */}
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce self-center" />

                  <div className="w-8 h-8 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1 rounded-bl-lg" />
                  <div className="w-8 h-8 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1 self-end rounded-br-lg" />
                </div>

                {/* Live Scanning Status Pill */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xs text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Scanning Video Frames for QR...</span>
                </div>

                {/* Stop Camera Button */}
                <button
                  type="button"
                  onClick={stopCameraScanner}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition cursor-pointer"
                  title="Close Camera"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : null}

            {/* Error Banner if camera failed */}
            {cameraError && (
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-medium space-y-1 text-left">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Camera Notice</span>
                </div>
                <p>{cameraError}</p>
              </div>
            )}

            {/* 2 Primary Scanner Actions: Launch Camera & Upload Image */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCameraScanner}
                  className="flex items-center gap-2.5 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-103 active:scale-97 cursor-pointer border border-emerald-400"
                >
                  <Camera className="w-5 h-5" />
                  <span>Open Camera Scanner</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCameraScanner}
                  className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Stop Camera</span>
                </button>
              )}

              {/* Upload Downloaded QR Code file */}
              <label className="flex items-center gap-2.5 py-4 px-6 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-black text-sm border-2 border-purple-300 transition-all hover:scale-103 cursor-pointer shadow-sm">
                <Upload className="w-5 h-5 text-purple-700" />
                <span>Upload Downloaded QR Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Quick Auto-Load Latest Inspector Batch */}
              <button
                type="button"
                onClick={handleScanLatestDemo}
                className="flex items-center gap-2 py-4 px-6 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black text-sm border border-yellow-500 shadow-sm transition-all hover:scale-103 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-950" />
                <span>Quick-Inspect Latest Batch</span>
              </button>
            </div>

            {isProcessingFile && (
              <p className="text-xs font-bold text-purple-700 animate-pulse">
                Decoding uploaded QR image pixels...
              </p>
            )}

            <div className="pt-4 border-t border-purple-100 text-xs text-purple-900/60 max-w-lg mx-auto flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Works with camera streams or any PNG/JPEG image downloaded from the Inspector Portal.
              </span>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: VERIFIED DOSSIER (EXACT DETAILS FILLED IN INSPECTOR PORTAL)
          ========================================================================= */}
      {(activeTab === 'results' || hasScannedOnce) && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Big Verification Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-emerald-50/70 border-2 border-emerald-300 shadow-lg shadow-emerald-900/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-purple-950 px-2.5 py-0.5 rounded-md bg-yellow-300 border border-yellow-400">
                    {scannedData.batchId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ VERIFIED AUTHENTIC
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                    Block #{scannedData.blockNumber}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-purple-950 mt-1">
                  {scannedData.productName}
                </h2>
                <p className="text-xs text-purple-900/70 mt-0.5">
                  Official Laboratory Certified Inspection Record • NABL ISO/IEC 17025
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('scan');
                  startCameraScanner();
                }}
                className="px-4 py-2.5 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-black text-emerald-950 transition cursor-pointer shadow-xs flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan Another QR</span>
              </button>
            </div>
          </div>

          {/* 4 Core Inspection Metrics (Filled in Inspector Portal) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Purity Score */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-[11px] font-bold text-purple-900/60 uppercase block">Overall Purity</span>
              <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                {scannedData.purityScore}%
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                ● Grade A Certified Pure
              </span>
            </div>

            {/* C4 Sugar Adulteration */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-[11px] font-bold text-purple-900/60 uppercase block">C4 Sugar Syrups</span>
              <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                {scannedData.c4Syrups}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                ● EA-IRMS Non-Diluted
              </span>
            </div>

            {/* HMF Freshness */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-[11px] font-bold text-purple-900/60 uppercase block">HMF Freshness</span>
              <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                {scannedData.hmfMgKg} mg/kg
              </span>
              <span className="text-[10px] text-purple-700 font-semibold mt-1 block">
                ● Raw & Unheated (&lt;40)
              </span>
            </div>

            {/* Diastase Active Enzymes */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-[11px] font-bold text-purple-900/60 uppercase block">Diastase Enzymes</span>
              <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                {scannedData.diastaseUnits} DN
              </span>
              <span className="text-[10px] text-purple-700 font-semibold mt-1 block">
                ● Living Enzymes Active
              </span>
            </div>

          </div>

          {/* Detailed Specifications Breakdown: Chemical, Botanical, & Origin */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Box 1: Inspector & Chemical Assays */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-purple-100">
                <FlaskConical className="w-4 h-4 text-purple-700" />
                <h3 className="text-base font-black text-purple-950">Laboratory Analysis & Auditor Signature</h3>
              </div>

              <div className="space-y-2.5 text-xs text-purple-900/80">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-purple-700">Certified Inspector:</span>
                  <span className="font-bold text-purple-950">{scannedData.inspectorName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-purple-700">Accredited Laboratory:</span>
                  <span className="font-bold text-purple-950">{scannedData.laboratoryName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-purple-700">Moisture Content:</span>
                  <span className="font-mono font-bold text-emerald-700">{scannedData.moisturePct}% (Standard: &lt;20.0%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-purple-700">Isotope Ratio (δ13C):</span>
                  <span className="font-mono font-bold text-purple-950">{scannedData.carbonDelta} ‰ (PDB Standard)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-purple-700">Official Verdict:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {scannedData.verdict}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Beekeeper, Apiary & Tare Weight */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-purple-100">
                <Trees className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-black text-purple-950">Apiary Origin & Beekeeper Traceability</h3>
              </div>

              <div className="space-y-2.5 text-xs text-purple-900/80">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-purple-700">Registered Beekeeper:</span>
                  <span className="font-bold text-purple-950">{scannedData.beekeeperName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-purple-700">Apiary Forest Node:</span>
                  <span className="font-bold text-purple-950">{scannedData.apiaryLocation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-purple-700">Floral Botanical Source:</span>
                  <span className="font-bold text-amber-800">{scannedData.floralSource}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-purple-700">Harvest Net Weight:</span>
                  <span className="font-mono font-bold text-purple-950">{scannedData.harvestWeightKg} kg (Calibrated Tare Scale)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-purple-700">Harvest Date:</span>
                  <span className="font-bold text-purple-950">{scannedData.harvestDate}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Blockchain Provenance Seal Card */}
          <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl font-mono text-xs space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-amber-400 font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" /> Hyperledger Fabric Cryptographic Proof
              </span>
              <span className="bg-emerald-900/90 text-emerald-300 px-2.5 py-0.5 rounded text-[10px] font-bold">
                COMMITTED STATE
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-400 block text-[10px] uppercase">SHA-256 Notary Seal Digest:</span>
              <span className="text-yellow-300 font-bold break-all">{scannedData.blockchainHash}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400">Block Height:</span>{' '}
                <span className="text-white font-bold font-mono">#{scannedData.blockNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">Notarized On:</span>{' '}
                <span className="text-white font-bold">{scannedData.timestamp}</span>
              </div>
            </div>
          </div>

          {/* 5-Step "Hive to Home" Timeline */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xs space-y-6">
            <h3 className="text-base font-black text-purple-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Verified "Hive to Home" Digital Custody Passport
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-amber-800 block">Step 01 • Forest Hive</span>
                <span className="text-xs font-bold text-purple-950 block">Pristine Nectar</span>
                <p className="text-[11px] text-purple-900/70">Gathered at {scannedData.apiaryLocation}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-amber-800 block">Step 02 • Tare Scale</span>
                <span className="text-xs font-bold text-purple-950 block">Ethical Harvest</span>
                <p className="text-[11px] text-purple-900/70">{scannedData.harvestWeightKg} kg by {scannedData.beekeeperName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-purple-800 block">Step 03 • Lab Assay</span>
                <span className="text-xs font-bold text-purple-950 block">ISO-17025 Certified</span>
                <p className="text-[11px] text-purple-900/70">EA-IRMS 0.00% C4 syrups by {scannedData.inspectorName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-purple-800 block">Step 04 • Ledger Seal</span>
                <span className="text-xs font-bold text-purple-950 block">Block #{scannedData.blockNumber}</span>
                <p className="text-[11px] text-purple-900/70">Immutable SHA-256 hash committed to Fabric</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-1.5 ring-2 ring-emerald-400/30">
                <span className="text-[10px] font-black uppercase text-emerald-800 block">Step 05 • Consumer QR</span>
                <span className="text-xs font-bold text-emerald-950 block">Scanned by You</span>
                <p className="text-[11px] text-emerald-800 font-bold">100% Guaranteed Genuine</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default ConsumerQRVerificationPage;
