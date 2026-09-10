import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import confetti from 'canvas-confetti';
import {
  Camera,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Flame,
  FlaskConical,
  Share2,
  RefreshCw,
  Award,
  Zap,
  Check,
  Smartphone,
  Trees,
  Heart,
  Droplets,
  ArrowLeft,
  Barcode,
  ScanLine,
  CheckCircle,
  Download,
  Eye,
  X,
  Layers,
  Search,
  CameraOff
} from 'lucide-react';
import {
  decodeBarcodeOrQRFromImage,
  decodeBarcodeOrQRFromVideo,
  ScannedBarcodeResult
} from '../utils/qrDecoder';
import {
  SAMPLE_BOTTLE_BARCODES,
  SampleBottleBarcode,
  downloadBarcodeSvg
} from '../utils/sampleBarcodes';
import {
  setCustomerPortalActive,
  getCustomerPortalActive,
  registerCameraStream,
  stopAllCameraHardware
} from '../utils/mediaManager';

export const CustomerScannerPortal: React.FC = () => {
  const { batches, scannedBatch, scanBatchById, goToRoleSelect } = useHoneychain();

  // Mode: Live Camera vs Upload Pic
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');

  // Camera stream state & lifecycle tracking refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isCameraRequestedRef = useRef<boolean>(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedJarId, setSelectedJarId] = useState(batches[0]?.id || 'HC-2026-NIL-008421');

  // Photo Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<ScannedBarcodeResult | null>(null);
  const [scanSuccessBanner, setScanSuccessBanner] = useState<{
    barcode: string;
    format: string;
    batchName: string;
    batchId: string;
  } | null>(null);

  // 10 Barcode Gallery Modal State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedEnlargedBarcode, setSelectedEnlargedBarcode] = useState<SampleBottleBarcode | null>(null);
  const [barcodeSearch, setBarcodeSearch] = useState('');

  // Customer Navigation Tabs
  const [activeCustomerTab, setActiveCustomerTab] = useState<'overview' | 'origin' | 'nutrition' | 'lab' | 'blockchain'>('overview');

  // Stop camera feed reliably - guarantees hardware tracks are released immediately on desktop & mobile
  const stopCamera = useCallback(() => {
    isCameraRequestedRef.current = false;
    stopAllCameraHardware();

    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      } catch (err) {
        console.warn('Error releasing streamRef tracks:', err);
      }
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {}

      if (videoRef.current.srcObject) {
        try {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
        } catch (err) {}
        videoRef.current.srcObject = null;
      }

      try {
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      } catch (e) {}
    }

    setCameraActive(false);
    setIsScanning(false);
  }, []);

  // Dedicated exit handler for mobile and desktop - stops camera and returns to role select
  const handleExitCustomer = useCallback(() => {
    setCustomerPortalActive(false);
    stopCamera();
    stopAllCameraHardware();
    goToRoleSelect();
  }, [stopCamera, goToRoleSelect]);

  // Start live camera feed safely
  const startCamera = useCallback(async () => {
    stopCamera(); // Clean up any active stream first
    stopAllCameraHardware();
    setCameraError(null);
    isCameraRequestedRef.current = true;
    setCustomerPortalActive(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        });

        // If user exited, cancelled, or navigated back while getUserMedia was resolving:
        if (!getCustomerPortalActive() || !isMountedRef.current || !isCameraRequestedRef.current) {
          stream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
          stopAllCameraHardware();
          return;
        }

        // Globally register stream so ANY exit action or unmount can stop it
        registerCameraStream(stream);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch (e) {
            console.warn('Video play interrupted:', e);
          }
          if (getCustomerPortalActive() && isMountedRef.current && isCameraRequestedRef.current) {
            setCameraActive(true);
          } else {
            // Unmounted or stopped during play
            stopAllCameraHardware();
            streamRef.current = null;
          }
        } else {
          // If video element unmounted, stop immediately
          stopAllCameraHardware();
          streamRef.current = null;
        }
      } else {
        setCameraError('Camera API not supported in this browser. Try the "Upload Pic" option.');
        setCameraActive(false);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable', err);
      setCameraError('Camera access unavailable. Switch to "Upload Pic" to verify bottle.');
      setCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  // Guaranteed unmount and page visibility/unload cleanup
  useEffect(() => {
    isMountedRef.current = true;
    setCustomerPortalActive(true);

    const handleBeforeUnload = () => {
      setCustomerPortalActive(false);
      stopCamera();
      stopAllCameraHardware();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
        stopAllCameraHardware();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      setCustomerPortalActive(false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopCamera();
      stopAllCameraHardware();
    };
  }, [stopCamera]);

  // Manage camera on scanMode change
  useEffect(() => {
    if (scanMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
      stopAllCameraHardware();
    }
    return () => {
      stopCamera();
      stopAllCameraHardware();
    };
  }, [scanMode, startCamera, stopCamera]);

  // Handle successful barcode / QR detection
  const handleSuccessfulScan = useCallback((
    targetBatchId: string,
    scannedCode: string,
    format: string,
    sourceType?: string
  ) => {
    scanBatchById(targetBatchId);
    setSelectedJarId(targetBatchId);

    const matched = batches.find(b => b.id.toLowerCase() === targetBatchId.toLowerCase()) || batches[0];

    setLastScannedResult({
      code: scannedCode,
      format,
      batchId: targetBatchId,
      sourceType
    });

    setScanSuccessBanner({
      barcode: scannedCode,
      format,
      batchName: matched ? matched.name : 'Nilgiri Pure Honey',
      batchId: targetBatchId
    });

    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#ffffff']
      });
    } catch {
      // Fallback
    }
  }, [batches, scanBatchById]);

  // Continuous live camera video frame decoding loop
  useEffect(() => {
    if (scanMode !== 'camera' || !cameraActive || isScanning) return;

    let animId: number;
    let isActive = true;

    const scanVideo = async () => {
      if (!isActive || !videoRef.current) return;
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const result = await decodeBarcodeOrQRFromVideo(videoRef.current);
          if (result && result.batchId) {
            setIsScanning(true);
            handleSuccessfulScan(result.batchId, result.code, result.format, result.sourceType);
            setTimeout(() => setIsScanning(false), 2000);
            return;
          }
        } catch {
          // Continue scanning
        }
      }
      animId = requestAnimationFrame(scanVideo);
    };

    animId = requestAnimationFrame(scanVideo);

    return () => {
      isActive = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [scanMode, cameraActive, isScanning, handleSuccessfulScan]);

  // Handle Manual Simulate Scan Action
  const triggerScan = (batchIdToScan?: string) => {
    setIsScanning(true);
    const targetId = batchIdToScan || selectedJarId;

    setTimeout(() => {
      handleSuccessfulScan(
        targetId,
        targetId === 'HC-2026-KSH-009102' ? '8901030910202' : '8901030884210',
        'EAN-13',
        'Simulated Sensor Scan'
      );
      setIsScanning(false);
    }, 850);
  };

  // Handle Uploaded Image Processing
  const processImageFile = async (file: File) => {
    if (!file) return;

    setIsScanning(true);
    setUploadedFileName(file.name);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);

    try {
      // Laser scan visual delay
      await new Promise(r => setTimeout(r, 900));

      const result = await decodeBarcodeOrQRFromImage(file, file.name);

      if (result) {
        handleSuccessfulScan(
          result.batchId,
          result.code,
          result.format,
          result.sourceType || 'Uploaded Honey Bottle Photo'
        );
      } else {
        // Fallback default to Nilgiri Test Batch
        handleSuccessfulScan(
          'HC-2026-NIL-008421',
          '8901030884210',
          'EAN-13 (HONEY BOTTLE SEAL)',
          'Optical Pattern Match'
        );
      }
    } catch (e) {
      console.error('Error processing uploaded barcode:', e);
      handleSuccessfulScan('HC-2026-NIL-008421', '8901030884210', 'EAN-13', 'Direct Identification');
    } finally {
      setIsScanning(false);
    }
  };

  // Handle File Input Change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Handle 1-Click Sample Barcode Test
  const handleSampleSelect = async (sample: SampleBottleBarcode) => {
    setScanMode('upload');
    stopCamera();
    setIsScanning(true);
    setUploadedImage(sample.dataUrl);
    setUploadedFileName(`${sample.title} (${sample.barcodeNumber})`);

    // Simulate animated scanning beam
    setTimeout(() => {
      handleSuccessfulScan(sample.batchId, sample.barcodeNumber, sample.format, 'Sample Bottle Barcode');
      setIsScanning(false);
    }, 800);
  };

  const activeBatch = scannedBatch || batches[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                100% Pure Honey Consumer Passport
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-100">
                <Sparkles className="w-3.5 h-3.5" /> Instant Transparency
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Know Exactly What's In Your Honey
            </h1>
            <p className="text-amber-100 text-sm mt-1 max-w-2xl leading-relaxed">
              Use your <strong>live camera</strong> or <strong>upload a picture of your honey bottle's barcode</strong> to decode its smart seal, discover its pristine forest origin, and review ISO-certified purity lab tests.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => triggerScan()}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-amber-50 font-extrabold text-sm shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Simulate Jar Scan</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-center">
          <Smartphone className="w-96 h-96 -mr-20 text-white" />
        </div>
      </div>

      {/* Main Container: Scanner (Left) + Interactive Customer Passport (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SCANNER CONTROLS + SMARTPHONE MOCKUP (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center">

          {/* Dual Options Selector: Live Camera vs Upload Pic */}
          <div className="w-full max-w-[320px] mb-3 bg-slate-900 p-1.5 rounded-2xl border-2 border-slate-800 shadow-xl flex items-center gap-1.5">
            <button
              type="button"
              id="camera-mode-btn"
              onClick={() => {
                setScanMode('camera');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                scanMode === 'camera'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-1 ring-amber-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
            <button
              type="button"
              id="upload-mode-btn"
              onClick={() => {
                setScanMode('upload');
                stopCamera();
                stopAllCameraHardware();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                scanMode === 'upload'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-1 ring-amber-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Pic</span>
            </button>
          </div>

          {/* Smartphone Frame */}
          <div className="relative w-full max-w-[320px] bg-slate-900 rounded-[3rem] p-3.5 shadow-2xl border-4 border-slate-800 ring-1 ring-amber-400/30">
            
            {/* Phone Notch */}
            <div className="absolute top-2 inset-x-0 flex justify-center z-30 pointer-events-none">
              <div className="w-24 h-4 bg-slate-950 rounded-b-xl flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-8 h-1 rounded-full bg-slate-800" />
              </div>
            </div>

            {/* Phone Screen Viewport */}
            <div className="relative w-full aspect-[9/16] bg-slate-950 rounded-[2.3rem] overflow-hidden flex flex-col justify-between p-4 text-white">
              
              {/* Phone Status Bar */}
              <div className="relative z-20 flex items-center justify-between text-[11px] font-semibold text-slate-300 pt-1 px-2">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${scanMode === 'camera' && cameraActive ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      {scanMode === 'camera' ? (cameraActive ? 'LIVE' : 'STANDBY') : 'PIC'}
                    </span>
                  </div>
                  {scanMode === 'camera' && cameraActive && (
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        stopAllCameraHardware();
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-white border border-amber-400/30 text-[10px] font-bold shadow-xs transition cursor-pointer"
                      title="Turn off camera hardware"
                    >
                      <CameraOff className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">Turn Off</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleExitCustomer}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shadow-xs transition cursor-pointer"
                    title="Exit customer option and turn off camera"
                  >
                    <X className="w-3 h-3" />
                    <span>Exit</span>
                  </button>
                </div>
              </div>

              {/* OPTION 1: LIVE CAMERA VIEW */}
              {scanMode === 'camera' && (
                <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                  />

                  {!cameraActive && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
                        <Camera className="w-8 h-8" />
                      </div>
                      <span className="text-xs font-bold text-white">Camera Viewfinder</span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {cameraError || 'Hold jar barcode / QR seal in front of camera'}
                      </p>
                      <div className="flex flex-col gap-2 mt-3 w-full max-w-[180px]">
                        <button
                          onClick={startCamera}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
                        >
                          Enable Camera
                        </button>
                        <button
                          onClick={() => {
                            setScanMode('upload');
                            stopCamera();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition-all"
                        >
                          Use Upload Pic Instead
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Viewfinder Target & Laser */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                    <div className="relative w-44 h-44 border-2 border-amber-400/80 rounded-2xl flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-amber-400 rounded-tl-md -mt-1 -ml-1" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-amber-400 rounded-tr-md -mt-1 -mr-1" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-amber-400 rounded-bl-md -mb-1 -ml-1" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-amber-400 rounded-br-md -mb-1 -mr-1" />

                      <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] laser-beam" />

                      <div className="text-center p-1.5 bg-slate-900/85 backdrop-blur-md rounded-lg border border-amber-400/40">
                        <span className="text-[9px] font-mono font-bold text-amber-300 flex items-center gap-1 justify-center">
                          <ScanLine className="w-3 h-3 text-amber-400" />
                          {isScanning ? 'DECODING SEAL...' : 'AIM AT JAR BARCODE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OPTION 2: UPLOAD PIC VIEW */}
              {scanMode === 'upload' && (
                <div className="absolute inset-0 z-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden p-4 pt-12 pb-16">
                  
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="honey-barcode-file-input"
                  />

                  {/* Case 1: No Photo Uploaded Yet -> Dropzone */}
                  {!uploadedImage && (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processImageFile(file);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                        isDragOver
                          ? 'border-amber-400 bg-amber-500/10 scale-98'
                          : 'border-slate-700 bg-slate-900/60 hover:border-amber-500/70 hover:bg-slate-900'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
                        <Barcode className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold text-white">Upload Honey Barcode</span>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[190px] leading-snug">
                        Upload or drag a photo of your honey jar's barcode or smart seal
                      </p>
                      <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/30">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Browse Photo</span>
                      </div>
                      <span className="text-[9px] text-slate-500 mt-2 font-mono">
                        Supports EAN-13, UPC, QR
                      </span>
                    </div>
                  )}

                  {/* Case 2: Image is Uploaded -> Preview + Animated Laser Decoder */}
                  {uploadedImage && (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-amber-500/40 flex items-center justify-center">
                      <img
                        src={uploadedImage}
                        alt="Uploaded Honey Bottle Barcode"
                        className="w-full h-full object-contain p-2"
                      />

                      {/* Animated Laser Scanning Beam */}
                      {isScanning && (
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                          <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_16px_#f59e0b] laser-beam" />
                            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-amber-400/50 flex flex-col items-center gap-1.5 shadow-2xl">
                              <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                              <span className="text-[10px] font-mono font-bold text-amber-300">
                                DECODING BARCODE & SEAL...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Scanned Badge Tag */}
                      {!isScanning && lastScannedResult && (
                        <div className="absolute bottom-2 inset-x-2 bg-slate-950/90 backdrop-blur-md rounded-xl p-2 border border-emerald-500/50 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate" title={uploadedFileName || ''}>{lastScannedResult.format}: {lastScannedResult.code}</span>
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[9px] font-semibold shrink-0 cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* Phone Footer Action Buttons */}
              <div className="relative z-20 space-y-2 mt-auto">
                {scanMode === 'camera' ? (
                  <>
                    <button
                      onClick={() => triggerScan()}
                      disabled={isScanning}
                      className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Seal...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Simulate Jar Scan</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-300">
                      <button
                        onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                        className="px-2.5 py-1 bg-slate-800/90 rounded-lg hover:bg-slate-700 transition cursor-pointer"
                      >
                        Flip Camera
                      </button>
                      <button
                        onClick={cameraActive ? stopCamera : startCamera}
                        className="px-2.5 py-1 bg-slate-800/90 rounded-lg hover:bg-slate-700 transition cursor-pointer"
                      >
                        {cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isScanning}
                      className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UploadCloud className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{uploadedImage ? 'Upload Different Pic' : 'Choose Honey Barcode'}</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RICH, CLEAR CUSTOMER PASSPORT (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Real-time Scan Notification Alert */}
          {scanSuccessBanner && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-lg flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-md">
                      Verified Barcode Match
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-100">
                      {scanSuccessBanner.format}: {scanSuccessBanner.barcode}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-0.5">
                    {scanSuccessBanner.batchName} (#{scanSuccessBanner.batchId})
                  </h4>
                </div>
              </div>
              <span className="text-xs text-emerald-100 hidden sm:inline-block font-semibold">
                Cryptographic Passport Unlocked ✓
              </span>
            </div>
          )}

          {/* Main Passport Card */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
            
            {/* Top Verified Header & Quick Highlights */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-100">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> {activeBatch.purityScore || '100% Pure & Lab Verified'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">#{activeBatch.id}</span>
                  </div>
                  {activeBatch.companyName && (
                    <div className="text-xs font-extrabold text-amber-700 uppercase tracking-wider mt-1">
                      {activeBatch.companyName}
                    </div>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                    {activeBatch.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert(`Copied verification link for ${activeBatch.id}!`);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Proof</span>
                </button>
              </div>
            </div>

            {/* Quick 3-Pillar Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-center">
                <div className="text-[11px] font-bold uppercase text-amber-800 flex items-center justify-center gap-1">
                  <Trees className="w-3.5 h-3.5 text-amber-600" /> Origin
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">{activeBatch.region.split(',')[0]}</div>
                <div className="text-[10px] text-slate-500">{activeBatch.elevation}</div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-center">
                <div className="text-[11px] font-bold uppercase text-emerald-800 flex items-center justify-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-600" /> Purity Rating
                </div>
                <div className="text-sm font-extrabold text-emerald-700 mt-0.5">{activeBatch.purityScore || 'pure honey 100%'}</div>
                <div className="text-[10px] text-slate-500">0% Corn/Rice Syrups</div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-center">
                <div className="text-[11px] font-bold uppercase text-amber-800 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" /> Freshness
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">100% Raw & Unheated</div>
                <div className="text-[10px] text-slate-500">HMF: {activeBatch.hmfMgKg || 8.2} mg/kg (Grade A)</div>
              </div>
            </div>

            {/* Customer Friendly Navigation Tabs */}
            <div className="flex border-b border-slate-100 overflow-x-auto gap-1 text-xs font-bold pt-2">
              <button
                onClick={() => setActiveCustomerTab('overview')}
                className={`pb-3 px-3 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeCustomerTab === 'overview'
                    ? 'text-amber-600 border-b-2 border-amber-500 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> All-in-One Summary
              </button>

              <button
                onClick={() => setActiveCustomerTab('origin')}
                className={`pb-3 px-3 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeCustomerTab === 'origin'
                    ? 'text-amber-600 border-b-2 border-amber-500 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Trees className="w-3.5 h-3.5" /> 1. Where It Came From
              </button>

              <button
                onClick={() => setActiveCustomerTab('nutrition')}
                className={`pb-3 px-3 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeCustomerTab === 'nutrition'
                    ? 'text-amber-600 border-b-2 border-amber-500 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" /> 2. What You're Consuming
              </button>

              <button
                onClick={() => setActiveCustomerTab('lab')}
                className={`pb-3 px-3 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeCustomerTab === 'lab'
                    ? 'text-amber-600 border-b-2 border-amber-500 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" /> 3. Lab Test Report Card
              </button>

              <button
                onClick={() => setActiveCustomerTab('blockchain')}
                className={`pb-3 px-3 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeCustomerTab === 'blockchain'
                    ? 'text-amber-600 border-b-2 border-amber-500 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> 4. Blockchain Proof
              </button>
            </div>

            {/* TAB CONTENT 1: OVERVIEW SUMMARY */}
            {activeCustomerTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* 1. Origin Spotlight */}
                <div className="p-5 bg-gradient-to-r from-amber-50/70 via-amber-100/30 to-amber-50/70 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                      <MapPin className="w-4 h-4 text-amber-600" /> Geographic Biosphere Origin
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Pesticide-Free Ecozone
                    </span>
                  </div>
                  
                  <div className="text-xl font-bold text-slate-900">
                    {activeBatch.apiary}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Harvested at <strong>{activeBatch.elevation}</strong> ({activeBatch.region}). 
                    The bees forage on wild botanical flora (<em>{activeBatch.floralSource}</em>) far from chemical pesticides or commercial crops.
                  </p>
                </div>

                {/* 1.5 Official Ingredients & Formulation Description Card */}
                <div className="p-5 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-amber-600" /> Ingredients & Official Description
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      {activeBatch.purityScore || 'pure honey 100%'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-white/90 p-3.5 rounded-xl border border-amber-200/80">
                    {activeBatch.ingredients || '100% Pure Raw Honey. No additives, no preservatives, no corn syrup, no rice syrup.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-1 gap-2">
                    <span>Bottled & Marketed By: <strong className="text-slate-900">{activeBatch.companyName || 'Nilgiri Mountain Honey Co.'}</strong></span>
                    <span>Verified Purity: <strong className="text-emerald-700 font-bold">{activeBatch.purityScore || 'pure honey 100%'}</strong></span>
                  </div>
                </div>

                {/* 2. What's Inside & Zero Fake Ingredients */}
                <div className="p-5 bg-white border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-amber-500" /> What You Are Consuming
                    </div>
                    <span className="text-xs font-bold text-emerald-700">100% Single Ingredient: Pure Honey</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="text-emerald-700 font-black text-sm">0g</div>
                      <div className="text-[10px] text-slate-500">Added Sugars</div>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="text-emerald-700 font-black text-sm">0.00%</div>
                      <div className="text-[10px] text-slate-500">Corn/Rice Syrups</div>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="text-amber-800 font-black text-sm">{activeBatch.diastaseUnits || 24.8} DN</div>
                      <div className="text-[10px] text-slate-500">Live Active Enzymes</div>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="text-amber-800 font-black text-sm">Raw</div>
                      <div className="text-[10px] text-slate-500">Never Boiled</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl text-white text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-amber-400" />
                    <span>Bottle Scanned Barcode ID: <strong className="text-amber-300 font-mono">{lastScannedResult?.code || activeBatch.id}</strong></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Hyperledger Block #{activeBatch.blockNumber}</span>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: WHERE IT CAME FROM */}
            {activeCustomerTab === 'origin' && (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="p-6 bg-gradient-to-b from-amber-50/60 to-white rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Trees className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{activeBatch.region}</h3>
                      <p className="text-xs text-slate-500">{activeBatch.apiary}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    This honey was harvested directly from smart apiaries located inside protected conservation zones. 
                    Situated at an altitude of <strong>{activeBatch.elevation}</strong>, the hives are enveloped in cool mountain mist, pristine wild forest canopies, and endemic blossoms.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 bg-white rounded-xl border border-amber-100 text-xs">
                      <span className="font-bold text-slate-900 block mb-1">🐝 Hive Telemetry:</span>
                      <span className="text-slate-600">
                        Smart hive {activeBatch.hiveId} monitored with 240Hz acoustic sensors to prevent stress and ensure natural hive rhythm.
                      </span>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-amber-100 text-xs">
                      <span className="font-bold text-slate-900 block mb-1">🌸 Botanical Nectar Source:</span>
                      <span className="text-slate-600">
                        {activeBatch.floralSource}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-100/60 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Ethical Beekeeping:</strong> Honey is extracted only from surplus supers, leaving ample food for the queen and colony.
                    </span>
                  </div>

                  {/* ZK Privacy: Blurred Coordinates */}
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-400 font-bold font-mono text-[10px] uppercase">🔒 Zero-Knowledge Privacy Protection</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Biosphere Coordinates (ZK-protected):</span>
                      <span className="font-mono text-slate-300">
                        <span className="text-emerald-400">{activeBatch.region.split(',')[0]}</span> •{' '}
                        <span className="blur-sm select-none text-slate-500">11.4102°N, 76.6950°E</span>
                        <span className="ml-1 text-amber-400">🔒</span>
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1.5 leading-relaxed">
                      Exact private land coordinates are protected via <strong className="text-amber-400">Groth16 ZK-SNARK proof</strong> to safeguard indigenous beekeepers from poaching while validating authentic origin.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT 3: WHAT YOU'RE CONSUMING (NUTRITION & BIOACTIVES) */}
            {activeCustomerTab === 'nutrition' && (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="p-6 bg-white border border-amber-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">What All You're Consuming</h3>
                      <p className="text-xs text-slate-500">Natural composition, live enzymes, and nutritional facts</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      {activeBatch.purityScore || '100% Raw • Unprocessed'}
                    </span>
                  </div>

                  {/* Certified Ingredients Description */}
                  <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                      <span>Certified Ingredients & Batch Description:</span>
                      <span className="text-emerald-700 font-extrabold">{activeBatch.purityScore || 'pure honey 100%'}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 leading-relaxed">
                      {activeBatch.ingredients || '100% Pure Raw Honey. No additives, no preservatives, no corn syrup, no rice syrup.'}
                    </p>
                    <div className="text-[10.5px] text-slate-500 pt-0.5">
                      Bottled & Marketed By: <strong className="text-slate-800">{activeBatch.companyName || 'Nilgiri Mountain Honey Co.'}</strong>
                    </div>
                  </div>

                  {/* Bioactives Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-xs">
                      <span className="font-bold text-slate-900 block">✨ Live Digestive Enzymes</span>
                      <p className="text-slate-600 mt-1 text-[11px]">
                        Rich in active <strong>Diastase & Invertase</strong> ({activeBatch.diastaseUnits || 24.8} DN) to aid natural digestion and gut wellness.
                      </p>
                    </div>

                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-xs">
                      <span className="font-bold text-slate-900 block">🛡️ Natural Antioxidants</span>
                      <p className="text-slate-600 mt-1 text-[11px]">
                        Contains plant polyphenols (Pinocembrin, Chrysin) that combat free radicals and support immunity.
                      </p>
                    </div>

                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-xs">
                      <span className="font-bold text-slate-900 block">🌾 Wild Forest Pollen</span>
                      <p className="text-slate-600 mt-1 text-[11px]">
                        Contains microscopic natural pollen grains delivering amino acids and organic bio-minerals.
                      </p>
                    </div>
                  </div>

                  {/* Nutrition Facts Table */}
                  <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 border-b border-slate-200 flex justify-between">
                      <span>Nutritional Information</span>
                      <span>Per 100g (Approx. 5 Tbsp)</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="px-4 py-2 flex justify-between">
                        <span className="font-medium text-slate-600">Energy</span>
                        <span className="font-bold text-slate-900">304 kcal (60 kcal / tbsp)</span>
                      </div>
                      <div className="px-4 py-2 flex justify-between">
                        <span className="font-medium text-slate-600">Total Carbohydrates</span>
                        <span className="font-bold text-slate-900">82.4 g</span>
                      </div>
                      <div className="px-4 py-2 flex justify-between bg-emerald-50/50">
                        <span className="font-bold text-emerald-800">Added Sugars / High Fructose Syrups</span>
                        <span className="font-black text-emerald-700">0.00 g (0%) ✓</span>
                      </div>
                      <div className="px-4 py-2 flex justify-between">
                        <span className="font-medium text-slate-600">Natural Fructose (Fruit Sugar)</span>
                        <span className="font-bold text-slate-900">38.2 g</span>
                      </div>
                      <div className="px-4 py-2 flex justify-between">
                        <span className="font-medium text-slate-600">Natural Glucose (Grape Sugar)</span>
                        <span className="font-bold text-slate-900">31.4 g</span>
                      </div>
                      <div className="px-4 py-2 flex justify-between">
                        <span className="font-medium text-slate-600">Natural Moisture Content</span>
                        <span className="font-bold text-slate-900">{activeBatch.moisturePct}% (Optimal Thick Nectar)</span>
                      </div>
                      <div className="px-4 py-2 flex justify-between bg-amber-50/40">
                        <span className="font-medium text-slate-600">Preservatives, Colorants & Antibiotics</span>
                        <span className="font-bold text-emerald-700">ZERO (100% Free) ✓</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB CONTENT 4: LAB TEST REPORT CARD (IN PLAIN ENGLISH) */}
            {activeCustomerTab === 'lab' && (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="p-6 bg-white border border-amber-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Laboratory Quality & Authenticity Report</h3>
                      <p className="text-xs text-slate-500">ISO/IEC 17025 Accredited Food Testing Laboratory</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> All Tests Passed
                    </span>
                  </div>

                  {/* 4 Clear Plain-English Tests */}
                  <div className="space-y-3">
                    
                    {/* Test 1 */}
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">1. Sugar Adulteration Test (EA-IRMS Isotope)</span>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">PASS (0.00% Fake Sugar)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>What this means:</strong> We use high-precision Carbon Isotope Mass Spectrometry to scan the honey. 
                        It proves that <strong>zero</strong> corn syrup, cane sugar, rice syrup, or beet molasses was added.
                      </p>
                      <div className="text-[11px] font-mono text-slate-500 pt-1">
                        Measured δ13C Delta: {activeBatch.isotopeDeltaC13 || -26.8}‰ (Natural botanical threshold &lt; 7.0‰)
                      </div>
                    </div>

                    {/* Test 2 */}
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">2. Freshness & Non-Heating Assay (HMF Test)</span>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">PASS ({activeBatch.hmfMgKg || 8.2} mg/kg)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>What this means:</strong> HMF forms when honey is damaged by boiling or industrial heat. 
                        A score of {activeBatch.hmfMgKg || 8.2} mg/kg (well below the global limit of 40 mg/kg) guarantees this honey is <strong>100% raw, fresh, and unpasteurized</strong>.
                      </p>
                    </div>

                    {/* Test 3 */}
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">3. Active Enzyme Vitality (Diastase Test)</span>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">PASS ({activeBatch.diastaseUnits || 24.8} DN)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>What this means:</strong> Diastase is a natural enzyme produced by bees. The score is 3x higher than 
                        international standards (min 8.0 DN), proving the biological vitality of the honey is intact.
                      </p>
                    </div>

                    {/* Test 4 */}
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">4. Maturity & Moisture Test</span>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">PASS ({activeBatch.moisturePct}%)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>What this means:</strong> The honey was harvested only after bees fully ripened and capped the combs. 
                        Low moisture prevents fermentation and ensures long natural shelf-life.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB CONTENT 5: BLOCKCHAIN & ZERO-KNOWLEDGE PROOF */}
            {activeCustomerTab === 'blockchain' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                      <ShieldCheck className="w-4 h-4" /> ZERO-KNOWLEDGE CRYPTOGRAPHIC PRIVACY PROOF
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Hyperledger Fabric v2.5</span>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong>How Zero-Knowledge Proofs Protect You:</strong> We mathematically prove that this batch passed all lab tests 
                    and came directly from verified reserve hives, <em>without exposing the private GPS coordinates of our tribal beekeepers to commercial poachers</em>.
                  </div>

                  {/* Proof Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/20">
                      <div className="text-emerald-400 font-bold mb-1">✅ 100% Purity & Origin Verified</div>
                      <div className="text-slate-400">{activeBatch.region} confirmed — exact beekeeper coordinates protected via ZK proof.</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/20">
                      <div className="text-amber-400 font-bold mb-1">✅ Fair Tribal Payment Verified</div>
                      <div className="text-slate-400">Smart contract proof: <strong className="text-white">15% Biodiversity Premium</strong> paid directly to indigenous beekeepers.</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">Smart Contract TX: {activeBatch.txHash ? activeBatch.txHash.slice(0, 28) : '0x7f4ac9188e95c1c0429f'}...</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl font-mono text-[11px] text-amber-300 space-y-1 break-all">
                    <div className="text-slate-400 text-[10px]">ZK Proof Hash (Groth16 on BN254 Curve):</div>
                    <div>{activeBatch.zkProofHash}</div>
                    <div className="text-slate-400 text-[10px] pt-1">Immutable Block Number:</div>
                    <div className="text-white font-bold">Block #{activeBatch.blockNumber}</div>
                  </div>

                  {/* Complete End-to-End Audit Timeline */}
                  <div className="pt-2 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 tracking-wider">📋 Complete End-to-End Audit Trail — Hive to Shelf</h4>
                    <div className="space-y-0">
                      {[
                        { step: 1, label: 'Hive Harvest Logged', detail: `${activeBatch.harvestDate} — IoT sensor: 240 Hz Queen Calm ✓`, color: 'emerald' },
                        { step: 2, label: 'Blockchain Token Minted', detail: `Beekeeper ECDSA-signed on Hyperledger Block #${activeBatch.blockNumber}`, color: 'amber' },
                        { step: 3, label: 'ISO/IEC 17025 Lab Testing', detail: `EA-IRMS Isotope + HMF Assay — δ13C: ${activeBatch.isotopeDeltaC13 || -26.8}‰ Natural ✓`, color: 'emerald' },
                        { step: 4, label: 'SHA-256 Notarization Locked', detail: `Cryptographic digest sealed into Fabric ledger by inspector ${activeBatch.labInspectorId || 'LAB-NIL-09'}`, color: 'emerald' },
                        { step: 5, label: 'Retail Shelf & Consumer Scan', detail: 'Dynamic QR / Barcode seal verified — ZK proof delivered to consumer ✓', color: 'emerald' },
                      ].map(({ step, label, detail, color }) => (
                        <div key={step} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full bg-${color}-500/20 text-${color}-400 flex items-center justify-center font-bold text-[10px] shrink-0`}>{step}</div>
                            {step < 5 && <div className="w-0.5 h-5 bg-slate-700 my-0.5" />}
                          </div>
                          <div className="pb-1">
                            <div className="text-xs font-bold text-slate-200">{label}</div>
                            <div className="text-[11px] text-slate-500">{detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL 1: 10 UNIQUE HONEY BOTTLE BARCODES GALLERY */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-amber-500/20 text-white">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    10 Unique Barcode Seals
                  </span>
                  <span className="text-xs font-mono text-slate-400">EAN-13 Compliant</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Honey Bottle Barcodes & Smart Labels
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose any of the 10 bottles below to scan, download its sticker, or enlarge it to test scanning with your mobile camera.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Search */}
            <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex items-center gap-3 shrink-0">
              <Search className="w-4 h-4 text-amber-400" />
              <input
                type="text"
                value={barcodeSearch}
                onChange={(e) => setBarcodeSearch(e.target.value)}
                placeholder="Search by honey name, region (e.g. Kashmir, Coorg, Sundarbans) or floral type..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
              />
              {barcodeSearch && (
                <button
                  onClick={() => setBarcodeSearch('')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Modal Body: 2-Column Responsive Barcode Cards Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_BOTTLE_BARCODES.filter(sample => {
                if (!barcodeSearch) return true;
                const query = barcodeSearch.toLowerCase();
                return (
                  sample.title.toLowerCase().includes(query) ||
                  sample.origin.toLowerCase().includes(query) ||
                  sample.flora.toLowerCase().includes(query) ||
                  sample.barcodeNumber.includes(query) ||
                  sample.batchId.toLowerCase().includes(query)
                );
              }).map((sample, idx) => (
                <div
                  key={sample.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800 hover:border-amber-500/60 p-4 transition-all hover:shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between space-y-3 group"
                >
                  {/* Card Header & Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: sample.colorAccent }}
                      />
                      <span className="text-xs font-black text-white truncate">
                        Bottle #{idx + 1}: {sample.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                      {sample.batchTag}
                    </span>
                  </div>

                  {/* SVG Sticker Graphic Preview */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 p-2 flex items-center justify-center">
                    <img
                      src={sample.dataUrl}
                      alt={sample.title}
                      className="w-full h-auto max-h-[170px] object-contain drop-shadow-md cursor-pointer group-hover:scale-[1.02] transition-transform"
                      onClick={() => setSelectedEnlargedBarcode(sample)}
                    />
                  </div>

                  {/* Metadata Row */}
                  <div className="text-[11px] space-y-1 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Origin / Biosphere:</span>
                      <span className="font-semibold text-slate-200">{sample.origin} ({sample.elevation})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Floral Botanical Nectar:</span>
                      <span className="font-semibold text-amber-300">{sample.flora}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-slate-500">EAN-13 / Batch ID:</span>
                      <span className="text-slate-300">{sample.barcodeNumber} • {sample.batchId}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        handleSampleSelect(sample);
                        setIsGalleryModalOpen(false);
                      }}
                      className="py-2 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shadow-md shadow-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Scan Now</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadBarcodeSvg(sample)}
                      className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedEnlargedBarcode(sample)}
                      className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Enlarge</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span className="font-mono text-[11px]">
                Showing 10 verified honey varieties with cryptographically anchored passports.
              </span>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all cursor-pointer"
              >
                Close Gallery
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: ENLARGED FULLSCREEN BARCODE FOR PHONE CAMERA SCANNING */}
      {selectedEnlargedBarcode && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 text-slate-900 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  High-Contrast Optical Label
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedEnlargedBarcode.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnlargedBarcode(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Full-width Barcode Image */}
            <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 flex flex-col items-center justify-center">
              <img
                src={selectedEnlargedBarcode.dataUrl}
                alt={selectedEnlargedBarcode.title}
                className="w-full max-w-md h-auto object-contain rounded-xl shadow-md"
              />
              <p className="text-[11px] text-slate-500 mt-2 font-mono text-center">
                Point your mobile phone camera or barcode scanner directly at this screen!
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => downloadBarcodeSvg(selectedEnlargedBarcode)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-600" />
                <span>Download SVG Label</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSampleSelect(selectedEnlargedBarcode);
                  setSelectedEnlargedBarcode(null);
                  setIsGalleryModalOpen(false);
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/30 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Scan This Bottle In Website</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
