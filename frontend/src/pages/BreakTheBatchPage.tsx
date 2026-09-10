import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { runSpectraScan } from '../services/api';
import { SpectralScanResult } from '../types';
import { 
  Flame, 
  Scan, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertOctagon, 
  Link2, 
  Lock, 
  Truck, 
  QrCode, 
  Bot, 
  ArrowRight,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const BreakTheBatchPage: React.FC = () => {
  const { setActiveTab, setSelectedBatchId, setQrModalBatch, refreshStats } = useApp();
  const [selectedAdulterant, setSelectedAdulterant] = useState<'rice_syrup' | 'sugar_syrup' | 'unknown_anomaly' | 'pure'>('rice_syrup');
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<SpectralScanResult | null>(null);

  const testSamples = [
    {
      id: 'rice_syrup',
      name: 'Exogenous C3 Rice Syrup Adulteration',
      tag: 'RECOMMENDED SIH DEMO',
      badge: 'bg-red-500 text-white',
      desc: 'Simulates industrial high-maltose rice hydrolysate blended into organic honey.'
    },
    {
      id: 'sugar_syrup',
      name: 'Cane Sugar / Acid Invert Syrup (C4)',
      tag: 'HEAVY ADULTERATION',
      badge: 'bg-orange-500 text-white',
      desc: 'Simulates sucrose inversion and commercial cane syrup dilution.'
    },
    {
      id: 'unknown_anomaly',
      name: 'Uncharacterized Botanical / High Moisture Anomaly',
      tag: 'SECONDARY REVIEW',
      badge: 'bg-amber-500 text-slate-950',
      desc: 'Elevated moisture (>21%) triggering secondary lab review quarantine.'
    },
    {
      id: 'pure',
      name: 'Pure Kashmir Acacia Reserve (Control)',
      tag: 'BENCHMARK PASS',
      badge: 'bg-emerald-500 text-slate-950',
      desc: 'Authentic pure floral nectar passing all spectral gates.'
    }
  ];

  const stepsList = [
    { title: 'Sample Insertion & Optical Scan', icon: Scan, desc: 'Portable NIR beam sweeps sample cuvette across 1000nm-2500nm.' },
    { title: 'AI Feature Extraction & Library Matching', icon: Bot, desc: 'SpectraSeal AI compares spectral curve against 1,420+ authentic botanical profiles.' },
    { title: 'Spectral Deviation & Anomaly Detected', icon: AlertOctagon, desc: 'Exogenous carbohydrate absorption peaks identified at 1440nm & 1930nm.' },
    { title: 'Smart Contract Quality Gate Triggered', icon: Lock, desc: 'Automated consensus rule #0x99a revokes downstream transfer token.' },
    { title: 'Batch Status: QUARANTINED / BLOCKED', icon: ShieldAlert, desc: 'State updated atomically in database and permissioned blockchain ledger.' },
    { title: 'Supply Chain Frozen & Alerts Dispatched', icon: Truck, desc: 'Logistics hubs blocked; regulatory notification dispatched to FSSAI portal.' },
  ];

  const handleRunDemo = async () => {
    setIsProcessing(true);
    setStepIndex(0);
    setScanResult(null);

    // Step 1: Laser Scan
    setStepIndex(1);
    await new Promise(r => setTimeout(r, 800));

    // Fetch Scan Result from backend (mutates batch state in backend DB)
    const result = await runSpectraScan({
      batchId: 'HC-2026-AP-004824',
      sampleType: selectedAdulterant,
      floralType: 'Acacia'
    });
    setScanResult(result);

    // Step 2: AI Feature Extraction
    setStepIndex(2);
    await new Promise(r => setTimeout(r, 800));

    // Step 3: Anomaly Detected
    setStepIndex(3);
    await new Promise(r => setTimeout(r, 800));

    // Step 4: Smart Contract
    setStepIndex(4);
    await new Promise(r => setTimeout(r, 800));

    // Step 5: Quarantined
    setStepIndex(5);
    await new Promise(r => setTimeout(r, 800));

    // Step 6: Complete
    setStepIndex(6);
    setIsProcessing(false);
    await refreshStats();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Title & SIH High-Impact Header */}
      <div className="rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900 to-red-950/40 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-400 mb-2">
              <Flame className="h-3.5 w-3.5" />
              <span>SIH 2026 SIGNATURE MOMENT — "BREAK THE BATCH"</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Adulteration Interception & Automated Smart Contract Freeze
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Demonstrate live to the judges how machine-captured spectral evidence instantly triggers automated smart contract quarantine, locking the batch and preventing counterfeit honey from entering the retail market.
            </p>
          </div>

          <button
            disabled={isProcessing}
            onClick={handleRunDemo}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-amber-600 px-6 py-3.5 text-sm font-extrabold text-white hover:opacity-95 disabled:opacity-50 transition shadow-xl shadow-red-500/30 glow-amber"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Interception Sequence Executing...</span>
              </>
            ) : (
              <>
                <Flame className="h-4 w-4 text-amber-300" />
                <span>EXECUTE "BREAK THE BATCH"</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selectable Test Samples Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {testSamples.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedAdulterant(s.id as any)}
            className={`rounded-2xl p-4 text-left border transition-all ${
              selectedAdulterant === s.id
                ? 'border-red-500 bg-red-950/30 ring-1 ring-red-400 shadow-lg'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${s.badge}`}>
                {s.tag}
              </span>
              <span className="text-xl">
                {s.id === 'pure' ? '🍯' : s.id === 'rice_syrup' ? '🌾' : s.id === 'sugar_syrup' ? '🍬' : '⚠️'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white leading-snug">{s.name}</h4>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* 6-Step Visual Execution Sequence */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Interception Progression Pipeline</span>
            {stepIndex > 0 && (
              <span className="text-xs font-mono text-amber-400">
                [Step {stepIndex} of {stepsList.length}]
              </span>
            )}
          </h3>
          <span className="text-xs text-slate-400">Batch Target: HC-2026-AP-004824</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stepsList.map((st, sIdx) => {
            const Icon = st.icon;
            const isCompleted = stepIndex > sIdx;
            const isCurrent = stepIndex === sIdx + 1;

            return (
              <div
                key={sIdx}
                className={`rounded-xl border p-4 transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                    : isCurrent
                    ? 'border-red-500 bg-red-950/40 text-red-200 ring-2 ring-red-400 animate-pulse'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono">
                      {sIdx + 1}
                    </span>
                    <Icon className={`h-4 w-4 ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-red-400' : 'text-slate-500'}`} />
                  </div>
                  {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </div>

                <h4 className="text-xs font-bold text-white">{st.title}</h4>
                <p className="text-[10px] text-slate-300 mt-1 leading-snug">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interception Results Card (When sequence completes) */}
      {scanResult && stepIndex >= 5 && (
        <div className="rounded-2xl border border-red-500/50 bg-slate-950 p-6 space-y-6 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-red-400">
                  SMART CONTRACT TRIGGERED #0x99a
                </span>
                <h3 className="text-lg font-black text-white">
                  BATCH STATUS: {scanResult.smartContractGate}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBatchId('HC-2026-AP-004824');
                  setActiveTab('consumer-passport');
                }}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition"
              >
                <QrCode className="h-4 w-4" />
                <span>Inspect Consumer Passport</span>
              </button>

              <button
                onClick={() => setActiveTab('blockchain')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-300 hover:text-white transition"
              >
                <Link2 className="h-4 w-4" />
                <span>View Blockchain Audit</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[10px]">Spectral Similarity</span>
              <p className="text-xl font-bold text-red-400">{scanResult.similarity}%</p>
              <p className="text-[10px] text-slate-500">Threshold: &gt;95%</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[10px]">Detected Adulterant</span>
              <p className="text-sm font-bold text-white truncate">
                {scanResult.detectedAdulterantName || 'Severe Anomaly'}
              </p>
              <p className="text-[10px] text-slate-500">NIR Carbohydrate Peak</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[10px]">Downstream Transfer</span>
              <p className="text-sm font-bold text-red-400">DISABLED (FROZEN)</p>
              <p className="text-[10px] text-slate-500">Logistics custody locked</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[10px]">Regulator Alert</span>
              <p className="text-sm font-bold text-amber-400">DISPATCHED (FSSAI)</p>
              <p className="text-[10px] text-slate-500">Incident #INC-2026-883</p>
            </div>
          </div>

          {/* Rule and Explanation */}
          <div className="rounded-xl bg-red-950/20 border border-red-500/30 p-4 text-xs text-red-200 leading-relaxed">
            <p className="font-bold text-red-400 mb-1">Triggered Rule:</p>
            <p className="font-mono">{scanResult.ruleTriggered}</p>
            <p className="mt-2 text-slate-300">{scanResult.aiExplanation}</p>
          </div>

        </div>
      )}

      <DisclaimerBanner type="spectral" />

    </div>
  );
};
