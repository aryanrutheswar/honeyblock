import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Check,
  Copy,
  ExternalLink,
  Scale,
  ArrowLeft,
  PlusCircle,
  Wand2,
  Lock,
  X
} from 'lucide-react';
import {
  saveInspectedBatch,
  getLatestInspectedBatch,
  InspectedBatchRecord,
  DEFAULT_INSPECTOR_BATCH
} from '../utils/inspectorStore';
import { getEan13FromBatchId, computeEan13Checksum } from '../utils/sampleBarcodes';
import { registerBarcodeMapping } from '../utils/qrDecoder';
import { HoneyBarcodeCanvas, BarcodeIcon } from '../components/HoneyBarcodeCanvas';
import { soundManager } from '../utils/audio';

interface QualityAuthenticityPageProps {
  onNavigateTab?: (tab: string) => void;
  onLockInspector?: () => void;
}

export const QualityAuthenticityPage: React.FC<QualityAuthenticityPageProps> = ({
  onNavigateTab,
  onLockInspector
}) => {
  // Form State initialized with latest or default
  const [formData, setFormData] = useState<InspectedBatchRecord>(() => getLatestInspectedBatch());
  const [isGenerated, setIsGenerated] = useState(true);
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [barcodeToast, setBarcodeToast] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Custom modal builder state
  const [modalBatchId, setModalBatchId] = useState('');
  const [modalProductName, setModalProductName] = useState('Sundarbans Wild Mangrove Certified Reserve');
  const [modalFlora, setModalFlora] = useState('Aegiceras & Ceriops Mangrove Flora');
  const [modalLocation, setModalLocation] = useState('Sundarbans Biosphere Reserve Apiary Node #09');
  const [modalBeekeeper, setModalBeekeeper] = useState('Subrata Mondal (KVIC-WB-77)');
  const [modalPurity, setModalPurity] = useState(99.8);
  const [modalWeight, setModalWeight] = useState(85.0);

  // Derive standard EAN-13 barcode number
  const ean13Number = formData.barcodeNumber || getEan13FromBatchId(formData.batchId);

  // Synchronize dynamic barcode registration
  useEffect(() => {
    registerBarcodeMapping(ean13Number, formData.batchId);
  }, [ean13Number, formData.batchId]);

  // Generate an instant new unique batch ID & certified EAN-13 barcode
  const handleCreateNewBarcode = (overrides?: Partial<InspectedBatchRecord>) => {
    soundManager.playEnterChime();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBatchId = overrides?.batchId || `HC-2026-INSP-${randomSuffix}`;
    const newBarcode = overrides?.barcodeNumber || getEan13FromBatchId(newBatchId);
    const newHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newRecord: InspectedBatchRecord = {
      ...formData,
      batchId: newBatchId,
      barcodeNumber: newBarcode,
      blockchainHash: newHash,
      timestamp: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ...overrides
    };

    saveInspectedBatch(newRecord);
    registerBarcodeMapping(newBarcode, newBatchId);
    setFormData(newRecord);
    setIsGenerated(true);
    setBarcodeToast(`Created New Barcode ${newBarcode} for Batch ${newBatchId}`);
    setTimeout(() => setBarcodeToast(null), 4500);
  };

  // Preset templates for quick testing
  const applyPreset = (preset: 'nilgiri' | 'kashmir' | 'warangal' | 'sundarbans') => {
    if (preset === 'nilgiri') {
      const bId = `HC-2026-NIL-${Math.floor(1000 + Math.random() * 9000)}`;
      handleCreateNewBarcode({
        ...DEFAULT_INSPECTOR_BATCH,
        batchId: bId,
        barcodeNumber: getEan13FromBatchId(bId),
        productName: 'Nilgiri Kurinji Blue Blossom Honey',
        floralSource: 'Strobilanthes Kunthiana (Neelakurinji)',
        apiaryLocation: 'Ooty High-Altitude Apiary Cluster Node #03',
        beekeeperName: 'Muthuvel Karunanidhi (Nilgiri Tribal Node #12)',
        purityScore: 99.8,
        c4Syrups: '0.00% (EA-IRMS Negative)',
        hmfMgKg: 5.8,
        diastaseUnits: 29.1,
        moisturePct: 16.5,
        verdict: 'Grade A 100% Pure Raw Honey Certified'
      });
    } else if (preset === 'kashmir') {
      const bId = `HC-2026-KSH-${Math.floor(1000 + Math.random() * 9000)}`;
      handleCreateNewBarcode({
        batchId: bId,
        barcodeNumber: getEan13FromBatchId(bId),
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
        verdict: 'Grade A Ultra-Pure Raw Honey Certified'
      });
    } else if (preset === 'warangal') {
      const bId = `HC-2026-TG-${Math.floor(1000 + Math.random() * 9000)}`;
      handleCreateNewBarcode({
        batchId: bId,
        barcodeNumber: getEan13FromBatchId(bId),
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
        verdict: 'Grade A 100% Pure Raw Honey Certified'
      });
    } else if (preset === 'sundarbans') {
      const bId = `HC-2026-SBN-${Math.floor(1000 + Math.random() * 9000)}`;
      handleCreateNewBarcode({
        batchId: bId,
        barcodeNumber: getEan13FromBatchId(bId),
        productName: 'Sundarbans Wild Mangrove Certified Reserve',
        floralSource: 'Aegiceras & Ceriops Mangrove Flora',
        apiaryLocation: 'Sundarbans Biosphere Reserve Apiary Node #09',
        beekeeperName: 'Subrata Mondal (KVIC-WB-77)',
        harvestWeightKg: 94.0,
        harvestDate: '10 Sep 2026',
        inspectorName: 'Dr. Alok Sen, Senior Analytical Chemist',
        laboratoryName: 'NABL Certified Lab #WB-01 (ISO/IEC 17025)',
        purityScore: 99.7,
        c4Syrups: '0.00% (EA-IRMS Negative)',
        hmfMgKg: 7.1,
        diastaseUnits: 26.5,
        moisturePct: 17.0,
        carbonDelta: -27.0,
        verdict: 'Grade A 100% Pure Raw Mangrove Honey'
      });
    }
  };

  // Open modal with new batch ID ready
  const handleOpenCustomBuilder = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setModalBatchId(`HC-2026-CUSTOM-${randomSuffix}`);
    setIsCreateModalOpen(true);
    soundManager.playClick();
  };

  // Handle Submission from Custom Modal
  const handleCustomModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = modalBatchId.trim() || `HC-2026-INSP-${Math.floor(1000 + Math.random() * 9000)}`;
    const barcode = getEan13FromBatchId(cleanId);
    
    handleCreateNewBarcode({
      batchId: cleanId,
      barcodeNumber: barcode,
      productName: modalProductName,
      floralSource: modalFlora,
      apiaryLocation: modalLocation,
      beekeeperName: modalBeekeeper,
      purityScore: modalPurity,
      harvestWeightKg: modalWeight
    });

    setIsCreateModalOpen(false);
  };

  // Save changes from main form
  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecord: InspectedBatchRecord = {
      ...formData,
      barcodeNumber: ean13Number,
      timestamp: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    saveInspectedBatch(updatedRecord);
    registerBarcodeMapping(ean13Number, updatedRecord.batchId);
    setFormData(updatedRecord);
    setIsGenerated(true);
    soundManager.playSuccess();
    setBarcodeToast(`Barcode ${ean13Number} Updated & Notarized on Blockchain!`);
    setTimeout(() => setBarcodeToast(null), 4000);
  };

  // Download High-Resolution Barcode Label PNG
  const handleDownloadCode = () => {
    soundManager.playClick();

    const sourceCanvas = document.getElementById('inspector-barcode-canvas') as HTMLCanvasElement;
    if (!sourceCanvas) return;

    // Create a printable barcode certificate label canvas
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = 540;
    downloadCanvas.height = 620;
    const ctx = downloadCanvas.getContext('2d');
    if (!ctx) return;

    // Clean white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 540, 620);

    // Top decorative header strip: Bumblebee Golden Amber
    ctx.fillStyle = '#fde047';
    ctx.fillRect(0, 0, 540, 56);
    ctx.fillStyle = '#1e1035';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐝 HONEYCHAIN DIGITAL TRUST BARCODE PASSPORT', 270, 35);

    // Batch ID & Product Name
    ctx.fillStyle = '#1e1035';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(formData.batchId, 270, 95);

    ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#581c87';
    ctx.fillText(formData.productName, 270, 118);

    // Draw Barcode Canvas centered
    ctx.drawImage(sourceCanvas, 70, 138, 400, 238);

    // Inspector Stamp & Metrics below Barcode
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`✓ ${formData.purityScore}% Pure • C4 Syrups: ${formData.c4Syrups}`, 270, 420);

    ctx.fillStyle = '#475569';
    ctx.font = '11.5px sans-serif';
    ctx.fillText(`Certified By: ${formData.inspectorName}`, 270, 448);
    ctx.fillText(formData.laboratoryName, 270, 468);
    ctx.fillText(`HMF: ${formData.hmfMgKg} mg/kg • Diastase: ${formData.diastaseUnits} DN • Moisture: ${formData.moisturePct}%`, 270, 490);

    // Footer instructions
    ctx.fillStyle = '#7e22ce';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`SHA-256: ${formData.blockchainHash.slice(0, 36)}...`, 270, 530);
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 11px sans-serif';
    ctx.fillText('Scan this Barcode with the HoneyChain Customer Scanner or POS Scanner', 270, 560);

    // Trigger PNG Download
    const dataUrl = downloadCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `HoneyChain-Barcode-${formData.batchId}.png`;
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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16 relative">
      
      {/* Toast Notification when a new barcode is created */}
      {barcodeToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-purple-950 text-yellow-300 border-2 border-yellow-400 shadow-2xl animate-bounce flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-xs font-black">{barcodeToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 bumble-border-top">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => onNavigateTab ? onNavigateTab('portals') : undefined}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black text-purple-950 bg-white hover:bg-purple-100 border border-purple-300 shadow-2xs transition cursor-pointer hover:scale-105 active:scale-95"
              title="Go Back to Role Portals"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-700" />
              <span>Go Back</span>
            </button>
            {onLockInspector && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onLockInspector();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black text-purple-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 shadow-2xs transition cursor-pointer hover:scale-105 active:scale-95"
                title="Lock Inspector Console (requires password honey@123 to re-enter)"
              >
                <Lock className="w-3.5 h-3.5 text-purple-800" />
                <span>Lock Console</span>
              </button>
            )}
            <span className="text-[11px] font-black text-purple-900 bg-yellow-300 px-2.5 py-1 rounded-full border border-yellow-400 uppercase tracking-wider inline-flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-purple-900" />
              Inspector Portal
            </span>
            <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
              NABL ISO/IEC 17025 Accredited
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
            Quality Certification & Retail Barcode Notary
          </h1>
          <p className="text-xs sm:text-sm text-purple-900/70 mt-1 max-w-2xl font-medium">
            Generate certified GS1 EAN-13 barcodes for retail honey jars, certify laboratory assays, and download printable high-resolution barcode passport labels.
          </p>
        </div>

        {/* Action Controls: Create New Barcode + Presets */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Main Hero Create Barcode Button */}
          <button
            type="button"
            onClick={() => handleCreateNewBarcode()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-xs sm:text-sm shadow-md shadow-yellow-500/25 border-2 border-yellow-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Generate a brand new unique batch and certified barcode"
          >
            <PlusCircle className="w-4 h-4 text-purple-950" />
            <span>+ Create New Barcode</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCustomBuilder}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs border border-purple-200 transition cursor-pointer"
            title="Open custom barcode configuration builder"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-700" />
            <span>Custom Builder</span>
          </button>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 bg-purple-50/80 p-1.5 rounded-2xl border border-purple-200">
            <button
              type="button"
              onClick={() => applyPreset('nilgiri')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-yellow-100 text-purple-950 text-[11px] font-bold transition border border-purple-200 cursor-pointer"
            >
              Nilgiri
            </button>
            <button
              type="button"
              onClick={() => applyPreset('kashmir')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-yellow-100 text-purple-950 text-[11px] font-bold transition border border-purple-200 cursor-pointer"
            >
              Kashmir
            </button>
            <button
              type="button"
              onClick={() => applyPreset('warangal')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-yellow-100 text-purple-950 text-[11px] font-bold transition border border-purple-200 cursor-pointer"
            >
              Warangal
            </button>
            <button
              type="button"
              onClick={() => applyPreset('sundarbans')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-yellow-100 text-purple-950 text-[11px] font-bold transition border border-purple-200 cursor-pointer"
            >
              Sundarbans
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Interface: Inspector Form (Left) vs Generated Barcode Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* =========================================================================
            LEFT: INSPECTOR VERIFICATION FORM
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleGenerateCode} className="space-y-6">
            
            {/* Card 1: Batch Identification */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-700" />
                  <h3 className="text-base font-black text-purple-950">1. Batch & Barcode Identification</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleCreateNewBarcode()}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-purple-950 bg-yellow-300 hover:bg-yellow-400 px-3 py-1 rounded-xl border border-yellow-400 cursor-pointer transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Barcode</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-purple-900">Batch ID</label>
                    <span className="text-[10px] font-mono text-purple-600 bg-purple-100/70 px-1.5 py-0.5 rounded font-bold">
                      EAN-13: {ean13Number}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.batchId}
                    onChange={e => {
                      const newId = e.target.value;
                      const newBc = getEan13FromBatchId(newId);
                      setFormData({ ...formData, batchId: newId, barcodeNumber: newBc });
                    }}
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

                <div>
                  <label className="block font-bold text-purple-900 mb-1">Harvest Net Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.harvestWeightKg}
                    onChange={e => setFormData({ ...formData, harvestWeightKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-mono focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Chemical & Spectroscopic Assays */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-purple-100">
                <Dna className="w-4 h-4 text-purple-700" />
                <h3 className="text-base font-black text-purple-950">2. NABL Laboratory Chemical Assays</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

            {/* Primary Action Button: Save & Update Barcode */}
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-sm sm:text-base shadow-xl shadow-yellow-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer border-2 border-yellow-200"
              >
                <BarcodeIcon className="w-5 h-5 text-purple-950" />
                <span>Update & Register Certified Barcode</span>
                <Sparkles className="w-4 h-4 text-purple-950" />
              </button>
            </div>

          </form>
        </div>

        {/* =========================================================================
            RIGHT: GENERATED BARCODE & DOWNLOAD SECTION
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Branded Certified Barcode Card (Barcode Only!) */}
          <div className="bg-white rounded-3xl border-2 border-purple-200 p-6 sm:p-7 shadow-xl shadow-purple-900/10 bumble-border-top space-y-5 text-center">
            
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                GS1 EAN-13 Scannable Retail Barcode
              </span>
              <h3 className="text-xl font-black text-purple-950 pt-1">
                Certified Inspection Barcode
              </h3>
              <p className="text-xs text-purple-900/70">
                Mathematically compliant GS1 retail barcode linked to cryptographic ledger
              </p>
            </div>

            {/* Rendered Barcode Box with Laser Animation */}
            <div className="p-3 sm:p-4 bg-purple-50/50 rounded-2xl border-2 border-purple-200 inline-block mx-auto shadow-sm max-w-full overflow-hidden">
              <HoneyBarcodeCanvas
                id="inspector-barcode-canvas"
                batchId={formData.batchId}
                barcodeNumber={ean13Number}
                productName={formData.productName}
                purityScore={formData.purityScore}
                width={320}
                height={190}
                showScanBeam={true}
              />
            </div>

            {/* Summary Highlights */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch ID:</span>
                <span className="font-mono font-bold text-purple-950">{formData.batchId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Barcode (EAN-13):</span>
                <span className="font-mono font-bold text-purple-950">{ean13Number}</span>
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

            {/* Action Buttons: Create New, Download Label, Test in Scanner */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => handleCreateNewBarcode()}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-sm shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer border-2 border-yellow-200"
              >
                <PlusCircle className="w-4 h-4 text-purple-950" />
                <span>+ Create Another New Barcode</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCode}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-purple-950 hover:bg-purple-900 text-yellow-300 font-black text-sm shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer border border-purple-800"
              >
                <Download className="w-4 h-4 text-yellow-300" />
                <span>Download Barcode Label (PNG)</span>
              </button>

              {downloadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold animate-fadeIn flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Barcode Label Downloaded! Ready to scan in Customer Portal.</span>
                </div>
              )}

              {/* Shortcut: Jump directly to Customer Portal */}
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('qr-verify')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-200 transition cursor-pointer"
                >
                  <BarcodeIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Open Customer Scanner to Test →</span>
                </button>
              )}
            </div>

          </div>

          {/* Blockchain Notary Block */}
          <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-yellow-500" />
                Blockchain Seal Proof
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                Block #{formData.blockNumber}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-[11px] font-mono break-all text-purple-950 flex items-center justify-between gap-2">
              <span className="truncate">{formData.blockchainHash}</span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="p-1 rounded hover:bg-purple-200 text-purple-800 shrink-0 cursor-pointer"
                title="Copy Hash"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          CUSTOM BARCODE BUILDER MODAL
          ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-purple-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-yellow-400 text-purple-950 flex items-center justify-center font-black">
                  <BarcodeIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-purple-950">Create New Certified Barcode</h3>
                  <p className="text-[11px] text-purple-800/70 font-semibold">Mint a new batch identity with GS1 EAN-13 barcode</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl hover:bg-purple-100 text-purple-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomModalSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-purple-950">Batch ID</label>
                  <button
                    type="button"
                    onClick={() => setModalBatchId(`HC-2026-INSP-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[10px] text-purple-700 font-bold hover:underline cursor-pointer"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={modalBatchId}
                  onChange={e => setModalBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-950 font-mono font-bold"
                  placeholder="e.g. HC-2026-NIL-4421"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Barcode Generated: <span className="font-mono font-bold text-purple-900">{getEan13FromBatchId(modalBatchId || 'HC-2026')}</span>
                </p>
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">Product Name</label>
                <input
                  type="text"
                  value={modalProductName}
                  onChange={e => setModalProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-950 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Floral Origin</label>
                  <input
                    type="text"
                    value={modalFlora}
                    onChange={e => setModalFlora(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-950"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Apiary Location</label>
                  <input
                    type="text"
                    value={modalLocation}
                    onChange={e => setModalLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-950"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Beekeeper</label>
                  <input
                    type="text"
                    value={modalBeekeeper}
                    onChange={e => setModalBeekeeper(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-950"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Purity Score (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    max="100"
                    value={modalPurity}
                    onChange={e => setModalPurity(parseFloat(e.target.value) || 99)}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/60 border border-purple-200 text-emerald-700 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-purple-200 text-purple-900 font-bold hover:bg-purple-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-950 font-black shadow-md hover:scale-103 active:scale-97 transition cursor-pointer border border-amber-300"
                >
                  Create & Register Barcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default QualityAuthenticityPage;
