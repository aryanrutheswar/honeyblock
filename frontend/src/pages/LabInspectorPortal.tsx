import React, { useState, useEffect } from 'react';
import { useHoneychain, BatchItem } from '../context/HoneychainContext';
import {
  FlaskConical,
  CheckCircle2,
  Award,
  Flame,
  Check,
  SlidersHorizontal,
  AlertOctagon,
  Barcode,
  PlusCircle,
  Download,
  X,
  RefreshCw,
  Eye,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createBarcodeSvgDataUrl, createBarcodeSvgString, downloadBarcodeSvg, downloadBarcodePng } from '../utils/sampleBarcodes';

export const LabInspectorPortal: React.FC = () => {
  const { batches, selectedBatchId, addInspectedBarcodeBatch, scanBatchById, setCurrentRole } = useHoneychain();

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  // Interactive Isotope Mass Spec Simulator
  const [testMode, setTestMode] = useState<'pure_natural' | 'corn_cane' | 'rice_beet'>('pure_natural');
  const [c4Purity, setC4Purity] = useState('0.00% Pure ✓');
  const [c3Purity, setC3Purity] = useState('0.00% Pure ✓');
  const [isotopeDeltaC13, setIsotopeDeltaC13] = useState('-26.8‰ Natural');
  const [hmfScore, setHmfScore] = useState('8.2 mg/kg (PASS)');
  const [diastaseActivity, setDiastaseActivity] = useState('24.8 Schade Units (Grade A)');

  // Update test parameters when testMode changes
  useEffect(() => {
    if (testMode === 'pure_natural') {
      setC4Purity('0.00% Pure ✓');
      setC3Purity('0.00% Pure ✓');
      setIsotopeDeltaC13('-26.8‰ Natural');
      setHmfScore('8.2 mg/kg (PASS)');
      setDiastaseActivity('24.8 Schade Units (Grade A)');
    } else if (testMode === 'corn_cane') {
      setC4Purity('18.4% Adulterated (FAIL)');
      setC3Purity('0.00%');
      setIsotopeDeltaC13('-18.2‰ (Corn Syrup Alert)');
      setHmfScore('16.4 mg/kg');
      setDiastaseActivity('14.2 Schade Units');
    } else if (testMode === 'rice_beet') {
      setC4Purity('0.00%');
      setC3Purity('22.8% Adulterated (FAIL)');
      setIsotopeDeltaC13('-21.4‰ (Exceeds Limit)');
      setHmfScore('19.8 mg/kg');
      setDiastaseActivity('12.0 Schade Units');
    }
  }, [testMode]);

  const isTestPassed = testMode === 'pure_natural';

  // "Add the Inspected Bar" modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('8901030099881');
  const [bottleName, setBottleName] = useState('Nilgiri Wild Mountain Honey (Grade A Raw)');
  const [companyName, setCompanyName] = useState('Nilgiri Mountain Honey Co.');
  const [purityScore, setPurityScore] = useState('pure honey 100%');
  const [ingredientsInput, setIngredientsInput] = useState('100% Pure Raw Kurinji Honey, Wild Forest Flora Nectar, Active Enzymes (Diastase). No added sugars, no syrups.');
  const [floraInput, setFloraInput] = useState('Wild Kurinji & Acacia Nectar');
  const [originInput, setOriginInput] = useState('Nilgiris Biosphere Reserve, Tamil Nadu');
  const [addedSuccessBatch, setAddedSuccessBatch] = useState<BatchItem | null>(null);

  const generateRandomEan13 = () => {
    const prefix = '89010300';
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const code12 = prefix + suffix;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(code12[i], 10) * (i % 2 === 0 ? 1 : 3);
    }
    const checksum = (10 - (sum % 10)) % 10;
    setBarcodeInput(code12 + checksum);
  };

  // Dynamically generated Bar Pic raw SVG string (rendered directly into DOM)
  const currentBarPicSvg = React.useMemo(() => {
    return createBarcodeSvgString({
      batchId: `HC-2026-INSP-${barcodeInput.slice(-6)}`,
      barcodeNumber: barcodeInput || '8901030099881',
      title: bottleName || 'Nilgiri Wild Mountain Honey',
      companyName: companyName || 'Nilgiri Mountain Honey Co.',
      purityScore: purityScore || 'pure honey 100%',
      ingredients: ingredientsInput || '100% Pure Raw Kurinji Honey',
      batchTag: 'ISO-17025 CERTIFIED',
      origin: originInput || 'Nilgiris Biosphere Reserve',
      flora: floraInput || 'Wild Kurinji & Acacia Nectar',
      colorAccent: '#d97706'
    });
  }, [barcodeInput, bottleName, companyName, purityScore, ingredientsInput, originInput, floraInput]);

  // Dynamically generated Bar Pic (Barcode Picture Data URL)
  const currentBarPicUrl = React.useMemo(() => {
    return createBarcodeSvgDataUrl({
      batchId: `HC-2026-INSP-${barcodeInput.slice(-6)}`,
      barcodeNumber: barcodeInput || '8901030099881',
      title: bottleName || 'Nilgiri Wild Mountain Honey',
      companyName: companyName || 'Nilgiri Mountain Honey Co.',
      purityScore: purityScore || 'pure honey 100%',
      ingredients: ingredientsInput || '100% Pure Raw Kurinji Honey',
      batchTag: 'ISO-17025 CERTIFIED',
      origin: originInput || 'Nilgiris Biosphere Reserve',
      flora: floraInput || 'Wild Kurinji & Acacia Nectar',
      colorAccent: '#d97706'
    });
  }, [barcodeInput, bottleName, companyName, purityScore, ingredientsInput, originInput, floraInput]);

  const generateNewBarPic = () => {
    generateRandomEan13();
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {}
  };

  const handleSaveInspectedBar = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch = addInspectedBarcodeBatch({
      barcodeNumber: barcodeInput.trim(),
      name: bottleName.trim(),
      companyName: companyName.trim(),
      purityScore: purityScore.trim(),
      ingredients: ingredientsInput.trim(),
      flora: floraInput.trim(),
      origin: originInput.trim(),
      elevation: '2,240m',
      moisturePct: 16.5,
      c4SugarPct: testMode === 'pure_natural' ? 0.0 : 18.4,
      c3SugarPct: testMode === 'pure_natural' ? 0.0 : 22.8,
      isotopeDeltaC13: testMode === 'pure_natural' ? -26.8 : -18.2,
      hmfMgKg: 8.2,
      diastaseUnits: 24.8
    });

    setAddedSuccessBatch(newBatch);
    try {
      confetti({ particleCount: 80, spread: 90 });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

      {/* ACTION BAR: ADD THE INSPECTED BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
            <Barcode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">Lab Inspection Notary</h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-white/25 rounded-md text-white">ISO-17025 Certified</span>
            </div>
            <p className="text-xs text-amber-100 font-medium mt-0.5">Record newly analyzed honey bottle barcodes so customers can scan and verify authenticity</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setAddedSuccessBatch(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Add the Inspected Bar</span>
        </button>
      </div>

      {/* Interactive Test Simulator Controls */}
      <div className="bg-white border-2 border-amber-100 rounded-3xl p-6 shadow-sm space-y-4">
        {/* Live EA-IRMS Sample Test Simulator Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Interactive Mass Spec Test Mode:</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            <button
              onClick={() => setTestMode('pure_natural')}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                testMode === 'pure_natural'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              ✓ Pure Honey 100%
            </button>

            <button
              onClick={() => setTestMode('corn_cane')}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                testMode === 'corn_cane'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Corn Syrup
            </button>

            <button
              onClick={() => setTestMode('rice_beet')}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                testMode === 'rice_beet'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Rice Syrup
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED TEST PARAMETERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PARAMETER 1: SUGAR ADULTERATION (EA-IRMS / MASS SPEC) */}
        <div className="bg-white border-2 border-amber-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  EA-IRMS Carbon Isotope
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Sugar Adulteration Analysis</h3>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
              isTestPassed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {isTestPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <AlertOctagon className="w-3.5 h-3.5" />}
              {isTestPassed ? '0.00% Pure ✓' : 'ADULTERATION DETECTED'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Measures stable carbon isotopic ratio (δ13C) to detect exogenous sugars derived from C4 plants 
            (Corn syrup, High-Fructose Corn Syrup, Cane sugar) and C3 plants (Rice syrup, Beet syrup).
          </p>

          <div className="space-y-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-100 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-slate-600 font-medium">C4 Sugar Syrups (Corn / Cane):</span>
              <span className={`font-extrabold ${c4Purity.includes('FAIL') ? 'text-red-600 font-bold' : 'text-emerald-700'}`}>
                {c4Purity}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-slate-600 font-medium">C3 Sugar Syrups (Rice / Beet):</span>
              <span className={`font-extrabold ${c3Purity.includes('FAIL') ? 'text-red-600 font-bold' : 'text-emerald-700'}`}>
                {c3Purity}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-slate-600 font-medium">Isotope δ13C Delta Value:</span>
              <span className="font-mono font-bold text-slate-900">{isotopeDeltaC13}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Codex / FSSAI Adulteration Limit:</span>
              <span className="text-slate-600 font-semibold">&lt; 7.0‰ (Max Tolerance)</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-2.5 ${
            isTestPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            {isTestPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
            <div>
              <span className="font-bold">
                {isTestPassed ? 'Natural Bio-Signature Confirmed:' : 'Isotopic Discrepancy Alert:'}
              </span>{' '}
              {isTestPassed
                ? 'Sample isotopic ratio exactly matches pure floral nectar from Western Ghats botanical reference libraries. Zero foreign syrup markers detected.'
                : 'Exogenous C4/C3 sugars detected exceeding Codex Alimentarius limits. Smart contract will quarantine this batch from consumer sale.'}
            </div>
          </div>
        </div>

        {/* PARAMETER 2: FRESHNESS SCORE (HMF THERMAL TEST) */}
        <div className="bg-white border-2 border-amber-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Spectrophotometric Assay
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Freshness Score (HMF)</h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> PASS (8.2 mg/kg)
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Hydroxymethylfurfural (HMF) measures thermal degradation, overheating, and aging. Raw unheated honey 
            exhibits HMF levels below 15 mg/kg, ensuring all natural enzymes and antimicrobial bioactives remain intact.
          </p>

          <div className="space-y-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-100 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-slate-600 font-medium">HMF Thermal Content:</span>
              <span className="font-extrabold text-emerald-700">{hmfScore}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-slate-600 font-medium">Codex Global Standard:</span>
              <span className="text-slate-600 font-semibold">&lt; 40.0 mg/kg Max</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-slate-600 font-medium">Diastase Enzyme Activity:</span>
              <span className="font-bold text-slate-900">{diastaseActivity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Moisture Content:</span>
              <span className="font-bold text-slate-900">{selectedBatch.moisturePct}% (Codex Max 20%)</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Raw Cold-Filtered Certification:</span> Low HMF and high diastase activity confirm the sample was never subjected to thermal pasteurization or excessive heat.
            </div>
          </div>
        </div>

      </div>

      {/* NUTRITIONAL FACTS & INGREDIENTS BREAKDOWN */}
      <div className="bg-white border-2 border-amber-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Official Laboratory Assay
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Nutritional Facts & Ingredients</h3>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Certified 100% Pure Natural Honey
          </span>
        </div>

        {/* Nutritional Facts Container Styled Like Physical Label */}
        <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-yellow-50 border-2 border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          
          <div className="text-base sm:text-lg font-black text-amber-950 mb-3 flex items-center gap-1.5">
            <span className="text-slate-700 font-bold">Ingredient:</span>
            <span className="text-amber-800 font-extrabold">Honey (100%)</span>
          </div>

          <div className="border-2 border-amber-300 rounded-xl overflow-hidden bg-white shadow-xs">
            {/* Table Header Strip */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2.5 flex items-center justify-between font-black text-xs sm:text-sm tracking-wide">
              <span>NUTRITIONAL FACTS*</span>
              <span className="bg-white/25 px-2.5 py-0.5 rounded-md font-mono text-xs font-extrabold">Per 100g</span>
            </div>

            {/* 3 Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-amber-200 text-xs sm:text-sm">
              
              {/* Column 1: Energy & Carbohydrates */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-bold">Energy</span>
                  <span className="font-extrabold text-slate-900 font-mono">320kcal</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-100/80 pt-2">
                  <span className="text-slate-700 font-bold">Carbohydrate</span>
                  <span className="font-extrabold text-slate-900 font-mono">80g</span>
                </div>
                <div className="flex items-center justify-between pl-3 text-xs">
                  <span className="text-slate-600 font-medium">Natural Sugars</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {testMode === 'pure_natural' ? '80g' : testMode === 'corn_cane' ? '61.6g' : '57.2g'}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-3 text-xs">
                  <span className="text-slate-600 font-medium">Added Sugar</span>
                  <span className={`font-mono font-bold ${testMode === 'pure_natural' ? 'text-emerald-700' : 'text-red-600 font-black'}`}>
                    {testMode === 'pure_natural' ? '0g' : testMode === 'corn_cane' ? '18.4g (Adulterated)' : '22.8g (Adulterated)'}
                  </span>
                </div>
              </div>

              {/* Column 2: Protein, Fat, Electrolytes */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-bold">Protein</span>
                  <span className="font-extrabold text-slate-900 font-mono">0g</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-100/80 pt-2">
                  <span className="text-slate-700 font-bold">Fat</span>
                  <span className="font-extrabold text-slate-900 font-mono">0g</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-100/80 pt-2">
                  <span className="text-slate-700 font-bold">Sodium</span>
                  <span className="font-extrabold text-slate-900 font-mono">17mg</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-100/80 pt-2">
                  <span className="text-slate-700 font-bold">Potassium</span>
                  <span className="font-extrabold text-slate-900 font-mono">138mg</span>
                </div>
              </div>

              {/* Column 3: Minerals */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-bold">Calcium</span>
                  <span className="font-extrabold text-slate-900 font-mono">13mg</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-100/80 pt-2">
                  <span className="text-slate-700 font-bold">Iron</span>
                  <span className="font-extrabold text-slate-900 font-mono">1.5mg</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-100/80 pt-2">
                  <span className="text-slate-700 font-bold">Phosphorus</span>
                  <span className="font-extrabold text-slate-900 font-mono">5mg</span>
                </div>
              </div>

            </div>
          </div>
          
          <div className="text-[11px] text-slate-500 italic mt-2">
            *Certified via ISO/IEC 17025 laboratory spectrophotometric and elemental mineral assay. Zero synthetic additives, zero preservatives, 100% natural raw honey.
          </div>
        </div>

      </div>

      {/* MODAL: ADD THE INSPECTED BAR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white border border-amber-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {addedSuccessBatch ? (
              /* Success View with Barcode Preview & Download */
              <div className="text-center space-y-5 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">Inspected Bar Registered!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Batch <strong className="text-slate-800 font-mono">{addedSuccessBatch.id}</strong> is now certified and live in the public scanner registry.
                  </p>
                </div>

                {/* SVG Barcode Sticker Preview */}
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 inline-block max-w-full overflow-hidden">
                  <div
                    className="mx-auto rounded-lg shadow-sm"
                    dangerouslySetInnerHTML={{
                      __html: createBarcodeSvgString({
                        batchId: addedSuccessBatch.id,
                        barcodeNumber: barcodeInput,
                        title: addedSuccessBatch.name,
                        companyName: addedSuccessBatch.companyName || companyName,
                        purityScore: addedSuccessBatch.purityScore || purityScore,
                        ingredients: addedSuccessBatch.ingredients || ingredientsInput,
                        batchTag: 'ISO-17025 CERTIFIED',
                        origin: addedSuccessBatch.region,
                        flora: addedSuccessBatch.floralSource,
                        colorAccent: '#d97706'
                      })
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      downloadBarcodePng({
                        svgString: createBarcodeSvgString({
                          batchId: addedSuccessBatch.id,
                          barcodeNumber: barcodeInput,
                          title: addedSuccessBatch.name,
                          companyName: addedSuccessBatch.companyName || companyName,
                          purityScore: addedSuccessBatch.purityScore || purityScore,
                          ingredients: addedSuccessBatch.ingredients || ingredientsInput,
                          batchTag: 'ISO-17025 CERTIFIED',
                          origin: addedSuccessBatch.region,
                          flora: addedSuccessBatch.floralSource,
                          colorAccent: '#d97706'
                        }),
                        barcodeNumber: barcodeInput,
                        batchId: addedSuccessBatch.id
                      });
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Bar Pic (PNG)</span>
                  </button>

                  <button
                    onClick={() => {
                      downloadBarcodeSvg({
                        id: addedSuccessBatch.id,
                        batchId: addedSuccessBatch.id,
                        barcodeNumber: barcodeInput,
                        format: 'EAN-13',
                        title: addedSuccessBatch.name,
                        companyName: addedSuccessBatch.companyName || companyName,
                        purityScore: addedSuccessBatch.purityScore || purityScore,
                        ingredients: addedSuccessBatch.ingredients || ingredientsInput,
                        subtitle: `${addedSuccessBatch.apiary} • ${addedSuccessBatch.elevation}`,
                        flora: addedSuccessBatch.floralSource,
                        origin: addedSuccessBatch.region,
                        elevation: addedSuccessBatch.elevation,
                        colorAccent: '#d97706',
                        batchTag: 'ISO-17025 CERTIFIED',
                        dataUrl: createBarcodeSvgDataUrl({
                          batchId: addedSuccessBatch.id,
                          barcodeNumber: barcodeInput,
                          title: addedSuccessBatch.name,
                          companyName: addedSuccessBatch.companyName || companyName,
                          purityScore: addedSuccessBatch.purityScore || purityScore,
                          ingredients: addedSuccessBatch.ingredients || ingredientsInput,
                          batchTag: 'ISO-17025 CERTIFIED',
                          origin: addedSuccessBatch.region,
                          flora: addedSuccessBatch.floralSource,
                          colorAccent: '#d97706'
                        })
                      });
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-600" />
                    <span>Download Bar Pic (SVG)</span>
                  </button>

                  <button
                    onClick={() => {
                      scanBatchById(addedSuccessBatch.id);
                      setCurrentRole('customer');
                      setIsAddModalOpen(false);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Test in Customer Portal</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Add Form */
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                    <Barcode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Add the Inspected Bar</h3>
                    <p className="text-xs text-slate-500">Record an inspected honey bottle barcode into the provenance ledger</p>
                  </div>
                </div>

                <form onSubmit={handleSaveInspectedBar} className="space-y-4">
                  {/* HERO: GENERATED BAR PIC (BARCODE PICTURE) PREVIEW & ACTIONS */}
                  <div className="p-4 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/50 rounded-2xl border-2 border-amber-200/90 shadow-sm space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black uppercase text-slate-800 tracking-wide">
                          Generated Bar Pic (Smart Seal Sticker)
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Live Bar Pic
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={generateNewBarPic}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-500/25 cursor-pointer transition-all hover:scale-103 active:scale-97"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-100" />
                          <span>Generate Code</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            downloadBarcodePng({
                              svgString: currentBarPicSvg,
                              barcodeNumber: barcodeInput,
                              batchId: `HC-2026-INSP-${barcodeInput.slice(-6)}`
                            });
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                          title="Download Bar Pic as PNG"
                        >
                          <Download className="w-3.5 h-3.5 text-white" />
                          <span>Download PNG</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            downloadBarcodeSvg({
                              id: `insp-${barcodeInput}`,
                              batchId: `HC-2026-INSP-${barcodeInput.slice(-6)}`,
                              barcodeNumber: barcodeInput,
                              format: 'EAN-13',
                              title: bottleName,
                              companyName,
                              purityScore,
                              ingredients: ingredientsInput,
                              subtitle: originInput,
                              flora: floraInput,
                              origin: originInput,
                              elevation: '2,240m',
                              colorAccent: '#d97706',
                              batchTag: 'ISO-17025 CERTIFIED',
                              dataUrl: currentBarPicUrl
                            });
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                          title="Download Bar Pic as vector SVG"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-600" />
                          <span>SVG</span>
                        </button>
                      </div>
                    </div>

                    {/* Visual Barcode Picture Display */}
                    <div className="bg-white rounded-xl p-2.5 border border-amber-200/80 shadow-xs flex flex-col items-center justify-center overflow-hidden">
                      <div
                        className="w-full flex items-center justify-center p-1"
                        dangerouslySetInnerHTML={{ __html: currentBarPicSvg }}
                      />
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between w-full px-1 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold text-slate-700">Code:</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-900 font-bold">{barcodeInput}</span>
                        </div>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> High-Density Barcode Seal
                        </span>
                      </div>
                    </div>

                    {/* Optional Custom Barcode Number Toggle */}
                    <details className="text-[11px] text-slate-500 pt-1">
                      <summary className="cursor-pointer hover:text-slate-800 font-semibold select-none flex items-center gap-1">
                        <span>Manually edit barcode number (Optional)</span>
                      </summary>
                      <div className="mt-2 pt-2 border-t border-amber-100">
                        <input
                          type="text"
                          value={barcodeInput}
                          onChange={(e) => setBarcodeInput(e.target.value)}
                          placeholder="8901030099881"
                          maxLength={13}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none font-mono text-xs text-slate-900 bg-white"
                        />
                      </div>
                    </details>
                  </div>

                  {/* BOTTLE COMPANY NAME & PURITY LEVEL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Bottle Company / Brand Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Nilgiri Mountain Honey Co."
                        required
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">How Much Purity (Purity Level)</label>
                      <input
                        type="text"
                        value={purityScore}
                        onChange={(e) => setPurityScore(e.target.value)}
                        placeholder="pure honey 100%"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Honey Bottle / Product Name</label>
                    <input
                      type="text"
                      value={bottleName}
                      onChange={(e) => setBottleName(e.target.value)}
                      placeholder="Nilgiri Wild Mountain Honey (Grade A Raw)"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Ingredients Description <span className="text-slate-400 font-normal">(Included directly on Barcode Seal)</span>
                    </label>
                    <textarea
                      value={ingredientsInput}
                      onChange={(e) => setIngredientsInput(e.target.value)}
                      rows={2}
                      placeholder="100% Pure Raw Kurinji Honey, Wild Forest Flora Nectar, Active Enzymes (Diastase). No added sugars, no syrups."
                      required
                      className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-xs text-slate-900 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Botanical Floral Source</label>
                      <input
                        type="text"
                        value={floraInput}
                        onChange={(e) => setFloraInput(e.target.value)}
                        placeholder="Wild Kurinji & Acacia Nectar"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Geographic Origin & Region</label>
                      <input
                        type="text"
                        value={originInput}
                        onChange={(e) => setOriginInput(e.target.value)}
                        placeholder="Nilgiris, Tamil Nadu"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Certified Lab Parameters Snapshot */}
                  <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs space-y-2">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span>Lab Test Results Attached to this Barcode:</span>
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                        {testMode === 'pure_natural' ? '100% PURE ✓' : 'ADULTERATED ⚠'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-700">
                      <div>Isotope: <strong className="text-slate-900">{isotopeDeltaC13}</strong></div>
                      <div>HMF: <strong className="text-slate-900">{hmfScore}</strong></div>
                      <div>Diastase: <strong className="text-slate-900">{diastaseActivity.split(' ')[0]}</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 cursor-pointer transition-all hover:scale-102 active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Save & Register Inspected Bar</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
