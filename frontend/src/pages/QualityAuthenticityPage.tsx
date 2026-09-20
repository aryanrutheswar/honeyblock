import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Dna,
  Activity,
  Droplets,
  Thermometer,
  Award,
  Sparkles,
  Download,
  FileText,
  QrCode,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Check,
  Copy,
  ExternalLink,
  Scale
} from 'lucide-react';
import {
  saveInspectedBatch,
  getLatestInspectedBatch,
  InspectedBatchRecord,
  DEFAULT_INSPECTOR_BATCH
} from '../utils/inspectorStore';
import { soundManager } from '../utils/audio';

interface QualityAuthenticityPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const QualityAuthenticityPage: React.FC<QualityAuthenticityPageProps> = ({ onNavigateTab }) => {
  // Form State initialized with latest or default
  const [formData, setFormData] = useState<InspectedBatchRecord>(() => getLatestInspectedBatch());
  const [isGenerated, setIsGenerated] = useState(true);
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  // Generate a random unique batch ID
  const handleGenerateNewId = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({
      ...prev,
      batchId: `HC-2026-INSP-${randomSuffix}`,
      blockchainHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }));
  };

  // Presets
  const applyPreset = (preset: 'nilgiri' | 'kashmir' | 'warangal') => {
    if (preset === 'nilgiri') {
      setFormData({
        ...DEFAULT_INSPECTOR_BATCH,
        batchId: `HC-2026-NIL-${Math.floor(1000 + Math.random() * 9000)}`
      });
    } else if (preset === 'kashmir') {
      setFormData({
        batchId: `HC-2026-KSH-${Math.floor(1000 + Math.random() * 9000)}`,
        productName: 'Kashmir High-Altitude White Acacia Reserve',
        floralSource: 'Wild White Acacia Blossom (Robinia Pseudoacacia)',
        apiaryLocation: 'Pahalgam Valley Alpine Apiary Node #08 (1,850m)',
        beekeeperName: 'Farooq Ahmad Mir (Kashmir Tribal Apiary #14)',
        harvestWeightKg: 120.5,
        harvestDate: '12 Sep 2026',
        inspectorName: 'Dr. Bashir Qureshi, Lead Chromatographer',
        laboratoryName: 'NABL High-Altitude Testing Enclave #KSH-01',
        purityScore: 99.9,
        c4Syrups: '0.00% (EA-IRMS Negative)',
        hmfMgKg: 6.4,
        diastaseUnits: 28.2,
        moisturePct: 16.2,
        carbonDelta: -27.2,
        verdict: 'Grade A Ultra-Pure Raw Honey Certified',
        blockchainHash: '0x3f4a2104c89e24f8d689b741e29851720a4b73a8f9d4e21074bb9420bfa47289',
        blockNumber: 8426,
        timestamp: new Date().toLocaleDateString('en-GB') + ', 11:30 AM IST',
        qrPayloadString: ''
      });
    } else if (preset === 'warangal') {
      setFormData({
        batchId: `HC-2026-TG-${Math.floor(1000 + Math.random() * 9000)}`,
        productName: 'Warangal Forest Multiflora Pure Reserve',
        floralSource: 'Wild Forest Multiflora, Jamun & Neem Flora',
        apiaryLocation: 'Warangal Rural Cluster Apiary Node AP-TG-01',
        beekeeperName: 'Ravi Kumar (KVIC-BK-91)',
        harvestWeightKg: 68.5,
        harvestDate: '14 Sep 2026',
        inspectorName: 'Dr. Ananya Iyer, Chief Spectroscopist',
        laboratoryName: 'NABL Certified Testing Node #TN-02 (ISO/IEC 17025)',
        purityScore: 99.6,
        c4Syrups: '0.00% (EA-IRMS Negative)',
        hmfMgKg: 8.2,
        diastaseUnits: 24.8,
        moisturePct: 17.2,
        carbonDelta: -26.8,
        verdict: 'Grade A 100% Pure Raw Honey Certified',
        blockchainHash: '0x9b7f4a2104c89e24f8d689b741e29851720a4b73a8f9d4e21074bb9420bfa472',
        blockNumber: 8421,
        timestamp: new Date().toLocaleDateString('en-GB') + ', 04:55 PM IST',
        qrPayloadString: ''
      });
    }
    soundManager.playClick();
    setIsGenerated(true);
  };

  // Encoded payload to put in QR
  const qrPayload = JSON.stringify({
    app: 'HoneyChain',
    protocol: 'honeychain-v1',
    batchId: formData.batchId,
    name: formData.productName,
    beekeeper: formData.beekeeperName,
    location: formData.apiaryLocation,
    inspector: formData.inspectorName,
    lab: formData.laboratoryName,
    purity: formData.purityScore,
    c4: formData.c4Syrups,
    hmf: formData.hmfMgKg,
    diastase: formData.diastaseUnits,
    moisture: formData.moisturePct,
    weight: formData.harvestWeightKg,
    date: formData.harvestDate,
    verdict: formData.verdict,
    hash: formData.blockchainHash,
    block: formData.blockNumber
  });

  // Handle Generate QR
  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecord: InspectedBatchRecord = {
      ...formData,
      qrPayloadString: qrPayload,
      timestamp: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    saveInspectedBatch(updatedRecord);
    setFormData(updatedRecord);
    setIsGenerated(true);
    soundManager.playSuccess();
  };

  // Download QR as PNG Image
  const handleDownloadQR = () => {
    soundManager.playClick();
    const sourceCanvas = document.getElementById('inspector-qr-canvas') as HTMLCanvasElement;
    if (!sourceCanvas) return;

    // Create a beautifully branded printable label canvas
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = 460;
    downloadCanvas.height = 540;
    const ctx = downloadCanvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 460, 540);

    // Border & bumblebee yellow banner
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 0, 460, 48);
    ctx.fillStyle = '#1e1035';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐝 HONEYCHAIN DIGITAL TRUST PASSPORT', 230, 30);

    // Batch ID Header
    ctx.fillStyle = '#1e1035';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(formData.batchId, 230, 80);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#581c87';
    ctx.fillText(formData.productName, 230, 100);

    // Draw QR Code centered
    ctx.drawImage(sourceCanvas, 100, 115, 260, 260);

    // Inspector Stamp & Metrics below QR
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`✓ ${formData.purityScore}% Pure • C4 Syrups: ${formData.c4Syrups}`, 230, 405);

    ctx.fillStyle = '#475569';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Certified By: ${formData.inspectorName}`, 230, 430);
    ctx.fillText(formData.laboratoryName, 230, 448);
    ctx.fillText(`HMF: ${formData.hmfMgKg} mg/kg • Diastase: ${formData.diastaseUnits} DN • Moisture: ${formData.moisturePct}%`, 230, 468);

    // Footer instructions
    ctx.fillStyle = '#7e22ce';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`SHA-256: ${formData.blockchainHash.slice(0, 32)}...`, 230, 498);
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 10px sans-serif';
    ctx.fillText('Scan this QR code with the HoneyChain Customer Scanner', 230, 520);

    // Trigger PNG Download
    const dataUrl = downloadCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `HoneyChain-QR-${formData.batchId}.png`;
    a.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  // Copy hash helper
  const handleCopyHash = () => {
    navigator.clipboard.writeText(formData.blockchainHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 bumble-border-top">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black text-purple-900 bg-yellow-300 px-2.5 py-1 rounded-full border border-yellow-400 uppercase tracking-wider inline-flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-purple-900" />
              Inspector Portal
            </span>
            <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
              NABL ISO/IEC 17025 Accredited
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
            Quality Certification & QR Code Notary
          </h1>
          <p className="text-xs sm:text-sm text-purple-900/70 mt-1 max-w-2xl font-medium">
            Fill in official laboratory inspection assays, generate a cryptographic QR code, and download the verified label. Consumers can immediately scan this downloaded QR code in the Customer Portal.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-purple-50/80 p-2 rounded-2xl border border-purple-200">
          <span className="text-xs font-bold text-purple-900 px-1">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('nilgiri')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-yellow-100 text-purple-950 text-xs font-bold transition border border-purple-200 cursor-pointer"
          >
            Nilgiri Kurinji
          </button>
          <button
            type="button"
            onClick={() => applyPreset('kashmir')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-yellow-100 text-purple-950 text-xs font-bold transition border border-purple-200 cursor-pointer"
          >
            Kashmir Acacia
          </button>
          <button
            type="button"
            onClick={() => applyPreset('warangal')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-yellow-100 text-purple-950 text-xs font-bold transition border border-purple-200 cursor-pointer"
          >
            Warangal Forest
          </button>
        </div>
      </div>

      {/* Main 2-Column Interface: Inspector Form (Left) vs Generated QR & Seal (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* =========================================================================
            LEFT: INSPECTOR VERIFICATION FORM
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleGenerateQR} className="space-y-6">
            
            {/* Card 1: Batch Identification */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-700" />
                  <h3 className="text-base font-black text-purple-950">1. Batch & Apiary Identification</h3>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateNewId}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> New Batch ID
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-purple-900 mb-1">Batch ID</label>
                  <input
                    type="text"
                    value={formData.batchId}
                    onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-mono font-bold focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Product / Honey Name</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={e => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-bold focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Floral Botanical Origin</label>
                  <input
                    type="text"
                    value={formData.floralSource}
                    onChange={e => setFormData({ ...formData, floralSource: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Apiary Forest Location</label>
                  <input
                    type="text"
                    value={formData.apiaryLocation}
                    onChange={e => setFormData({ ...formData, apiaryLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Registered Beekeeper</label>
                  <input
                    type="text"
                    value={formData.beekeeperName}
                    onChange={e => setFormData({ ...formData, beekeeperName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-purple-900 mb-1">Tare Net (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.harvestWeightKg}
                      onChange={e => setFormData({ ...formData, harvestWeightKg: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-mono focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-purple-900 mb-1">Harvest Date</label>
                    <input
                      type="text"
                      value={formData.harvestDate}
                      onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Chemical & Laboratory Assays */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-purple-100">
                <FlaskConical className="w-4 h-4 text-purple-700" />
                <h3 className="text-base font-black text-purple-950">2. Laboratory Assays & Purity Results</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-purple-900 mb-1">Certified Inspector Name</label>
                  <input
                    type="text"
                    value={formData.inspectorName}
                    onChange={e => setFormData({ ...formData, inspectorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-semibold focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Accredited Testing Laboratory</label>
                  <input
                    type="text"
                    value={formData.laboratoryName}
                    onChange={e => setFormData({ ...formData, laboratoryName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Overall Purity Score (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    max="100"
                    value={formData.purityScore}
                    onChange={e => setFormData({ ...formData, purityScore: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-emerald-700 font-mono font-black focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">C4 Sugar Syrups (EA-IRMS)</label>
                  <input
                    type="text"
                    value={formData.c4Syrups}
                    onChange={e => setFormData({ ...formData, c4Syrups: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-bold focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">HMF Freshness (mg/kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hmfMgKg}
                    onChange={e => setFormData({ ...formData, hmfMgKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-mono focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Diastase Enzymes (DN / Schade)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.diastaseUnits}
                    onChange={e => setFormData({ ...formData, diastaseUnits: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-mono focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Moisture Content (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.moisturePct}
                    onChange={e => setFormData({ ...formData, moisturePct: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-mono focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Isotope Ratio δ13C (‰)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.carbonDelta}
                    onChange={e => setFormData({ ...formData, carbonDelta: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-mono focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-purple-900 mb-1">Certification Verdict</label>
                  <input
                    type="text"
                    value={formData.verdict}
                    onChange={e => setFormData({ ...formData, verdict: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-emerald-800 font-bold focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Primary Action Button: Create & Generate QR */}
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-sm sm:text-base shadow-xl shadow-yellow-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer border-2 border-yellow-200"
              >
                <QrCode className="w-5 h-5 text-purple-950" />
                <span>Create & Generate Certified QR Code</span>
                <Sparkles className="w-4 h-4 text-purple-950" />
              </button>
            </div>

          </form>
        </div>

        {/* =========================================================================
            RIGHT: GENERATED QR CODE & DOWNLOAD SECTION
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Branded Certified QR Card */}
          <div className="bg-white rounded-3xl border-2 border-purple-200 p-6 sm:p-7 shadow-xl shadow-purple-900/10 bumble-border-top space-y-5 text-center">
            
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Officially Notarized & Ready
              </span>
              <h3 className="text-xl font-black text-purple-950 pt-1">
                Certified Inspection QR Code
              </h3>
              <p className="text-xs text-purple-900/70">
                Contains cryptographically signed chemical & origin specifications
              </p>
            </div>

            {/* Rendered QR Canvas */}
            <div
              ref={qrCanvasRef}
              className="p-5 bg-purple-50/50 rounded-2xl border-2 border-purple-200 inline-block mx-auto shadow-sm"
            >
              <QRCodeCanvas
                id="inspector-qr-canvas"
                value={qrPayload}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Summary Highlights */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch ID:</span>
                <span className="font-mono font-bold text-purple-950">{formData.batchId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Purity Score:</span>
                <span className="font-bold text-emerald-700">{formData.purityScore}% Raw Honey</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">C4 Adulteration:</span>
                <span className="font-bold text-emerald-700">{formData.c4Syrups}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Inspector Stamp:</span>
                <span className="font-bold text-purple-900 truncate max-w-[180px]">{formData.inspectorName}</span>
              </div>
            </div>

            {/* Download Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadQR}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-purple-950 hover:bg-purple-900 text-yellow-300 font-black text-sm shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer border border-purple-800"
              >
                <Download className="w-4 h-4 text-yellow-300" />
                <span>Download QR Code (PNG)</span>
              </button>

              {downloadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold animate-fadeIn flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>QR Code Image Downloaded! Ready to scan in Customer Portal.</span>
                </div>
              )}

              {/* Shortcut: Jump directly to Customer Portal */}
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('qr-verify')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-200 transition cursor-pointer"
                >
                  <span>Open Customer Scanner to Test →</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              )}
            </div>

            {/* Blockchain Notary Seal Info */}
            <div className="pt-3 border-t border-purple-100 text-[11px] text-purple-900/60 text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold">SHA-256 Digest:</span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="text-purple-700 hover:text-purple-950 flex items-center gap-1 font-mono cursor-pointer"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
              <span className="font-mono text-[10px] text-purple-900 block break-all">
                {formData.blockchainHash}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default QualityAuthenticityPage;
