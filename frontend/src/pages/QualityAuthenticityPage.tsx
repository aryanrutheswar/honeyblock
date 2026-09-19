import React, { useState } from 'react';
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
  Search,
  Download,
  FileText,
  HelpCircle,
  XCircle
} from 'lucide-react';

export const QualityAuthenticityPage: React.FC = () => {
  // Test simulation state
  const [testMode, setTestMode] = useState<'pure' | 'adulterated'>('pure');
  const [selectedBatch, setSelectedBatch] = useState('HC-2026-00124');

  const isVerified = testMode === 'pure';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black text-purple-900 bg-yellow-300/80 px-2.5 py-1 rounded-full border border-yellow-400 uppercase tracking-wider inline-block mb-2">
            ISO/IEC 17025 Certified Laboratory Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight">
            Quality & Authenticity Verification
          </h1>
          <p className="text-xs sm:text-sm text-purple-900/60 mt-1 max-w-xl font-medium">
            Molecular NMR spectral profiling, Pollen-DNA metagenomics, and EA-IRMS carbon isotope mass spectrometry.
          </p>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center gap-2 bg-purple-50/60 p-1.5 rounded-xl border border-purple-200">
          <span className="text-xs font-black text-purple-900/70 px-2">Sample Test:</span>
          <button
            type="button"
            onClick={() => setTestMode('pure')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              testMode === 'pure'
                ? 'bg-yellow-400 text-purple-950 font-black shadow-xs border border-yellow-500/50'
                : 'text-purple-900/70 hover:text-purple-950'
            }`}
          >
            Pure Honey Sample
          </button>
          <button
            type="button"
            onClick={() => setTestMode('adulterated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              testMode === 'adulterated'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'text-purple-900/70 hover:text-purple-950'
            }`}
          >
            Adulterated Sample
          </button>
        </div>
      </div>

      {/* Main Authenticity Status Card */}
      <div className={`p-6 sm:p-7 rounded-2xl border shadow-xs transition-all ${
        isVerified
          ? 'bg-emerald-50/40 border-emerald-200 ring-1 ring-emerald-300/40'
          : 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-300/50'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              isVerified ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              {isVerified ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Overall Authenticity Status:
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  isVerified
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-100 text-rose-900 border border-rose-200 animate-pulse'
                }`}>
                  {isVerified ? '✓ VERIFIED AUTHENTIC' : '⚠ NEEDS REVIEW / QUARANTINED'}
                </span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black mt-1 ${isVerified ? 'text-emerald-950' : 'text-rose-950'}`}>
                {isVerified
                  ? 'Grade A 100% Pure Raw Honey Certified'
                  : 'Potential Adulteration Detected — Exogenous Sugars Found'}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Batch #{selectedBatch} • Analyzed at NABL Testing Enclave TN-99824 • Notarized on Block #8421
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Full Lab Dossier (PDF)</span>
            </button>
          </div>
        </div>

        {/* Clear Adulteration Warning Card if failed */}
        {!isVerified && (
          <div className="mt-5 p-4 rounded-xl bg-white border border-rose-200 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-rose-800 flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Reason for Quality Flag:</span>
            </div>
            <p className="leading-relaxed">
              EA-IRMS isotope mass spectrometry detected a <strong>carbon ratio deviation (δ¹³C -18.2‰)</strong>, indicating approximately <strong>18.4% added C4 sugar syrup (corn or sugar cane syrup)</strong>. In accordance with FSSAI/KVIC regulations, this batch is automatically locked from distribution and barred from token minting.
            </p>
          </div>
        )}
      </div>

      {/* 6 Organised Testing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Pollen DNA Analysis */}
        <div className="saas-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                <Dna className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Pollen DNA Analysis</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              99.8% Match
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Metagenomic barcode sequencing of microscopic botanical pollen grains confirms authentic floral origin.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Primary Flora:</span>
              <span className="font-bold text-slate-800">Wild Kurinji (Strobilanthes)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Secondary Flora:</span>
              <span className="font-semibold text-slate-700">Acacia & Forest Blossom</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pollen Density:</span>
              <span className="font-semibold text-slate-700">42,000 grains / 10g (High)</span>
            </div>
          </div>
        </div>

        {/* 2. NMR Spectral Analysis */}
        <div className="saas-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">NMR Spectral Analysis</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {isVerified ? 'Spectrum Normal' : 'Anomaly Detected'}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Nuclear Magnetic Resonance molecular fingerprint verifying botanical authenticity and absence of artificial sugars.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Fructose / Glucose:</span>
              <span className="font-bold text-slate-800">1.24 (Natural Sweetness)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sucrose Content:</span>
              <span className="font-semibold text-slate-700">1.8% (Below 5% limit)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Spectral Similarity:</span>
              <span className={`font-bold ${isVerified ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isVerified ? '98.7% Authentic' : '72.4% (Failed)'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Adulteration Detection */}
        <div className="saas-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <FlaskConical className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Adulteration Detection</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {isVerified ? '0.00% Syrups' : '18.4% Corn Syrup'}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            EA-IRMS isotope ratio mass spec detecting C4 cane/corn syrups and C3 rice/beet sugar adulterants.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">C4 Sugar Syrups:</span>
              <span className={`font-bold ${isVerified ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isVerified ? '0.00% (Pass)' : '18.4% (FAIL)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">C3 Rice/Beet Syrups:</span>
              <span className="font-bold text-emerald-700">0.00% (Pass)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Carbon δ¹³C Ratio:</span>
              <span className="font-mono font-semibold text-slate-800">
                {isVerified ? '-26.8‰ (Natural)' : '-18.2‰ (Altered)'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Moisture Level */}
        <div className="saas-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Droplets className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Moisture Level</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              16.5% (Safe)
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Refractometer moisture measurement to ensure stability and prevent yeast fermentation. Safe threshold is below 20%.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Reading:</span>
              <span className="font-bold text-emerald-700">16.5% Moisture</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Permissible Limit:</span>
              <span className="font-semibold text-slate-700">&le; 20.0% (FSSAI)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fermentation Risk:</span>
              <span className="font-bold text-emerald-700">Zero / Sterile</span>
            </div>
          </div>
        </div>

        {/* 5. Thermal Freshness (HMF) */}
        <div className="saas-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <Thermometer className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Thermal Freshness (HMF)</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              8.2 mg/kg (Raw)
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Hydroxymethylfurfural test measures heat exposure. Low HMF proves the honey is unpasteurized, unheated, and fresh.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">HMF Value:</span>
              <span className="font-bold text-emerald-700">8.2 mg/kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Codex Limit:</span>
              <span className="font-semibold text-slate-700">&lt; 40.0 mg/kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Thermal State:</span>
              <span className="font-bold text-slate-800">100% Unheated Cold-Extracted</span>
            </div>
          </div>
        </div>

        {/* 6. Quality Grade & Living Enzymes */}
        <div className="saas-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-yellow-50 text-yellow-700 rounded-xl">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Enzyme Activity & Grade</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Grade A Premium
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Diastase and invertase enzyme activity tests demonstrate biological vitality and intact antioxidants.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Diastase Activity:</span>
              <span className="font-bold text-slate-800">24.8 Schade Units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Minimum Standard:</span>
              <span className="font-semibold text-slate-700">&ge; 8.0 Schade Units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Overall Grade:</span>
              <span className="font-bold text-amber-700">Grade A Raw Virgin</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
