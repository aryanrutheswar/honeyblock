import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scan, 
  Radio, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Activity, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  HeartHandshake
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, stats } = useApp();

  const metrics = stats?.metrics || {
    hivesMonitored: 10,
    honeyBatchesTraced: 8,
    anomaliesDetected: 2,
    interceptedAdulterationEvents: 2,
    blockchainRecordsSecured: 48,
    pollinationServicesVerified: 4,
    farmersConnected: 128,
    beekeepersSupported: 42
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden honeycomb-pattern-subtle">
      
      {/* Top Banner SIH 2026 */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-4 py-1.5 text-center text-xs font-bold text-slate-950 tracking-wide">
        🏆 SMART INDIA HACKATHON 2026 — TRACK: AGRI-TECH & BLOCKCHAIN PROVENANCE
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-20 max-w-7xl mx-auto text-center">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Honey Traceability & Bio-Acoustic Intelligence</span>
        </div>

        {/* Product Title & Taglines */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
          HONEY<span className="text-amber-400">CHAIN</span>
        </h1>
        <p className="mt-3 text-xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
          "Every Drop Has a Digital Identity."
        </p>
        <p className="mt-2 text-sm sm:text-base font-medium text-slate-400">
          Pure Honey. Healthy Bees. Trusted Supply Chains.
        </p>

        {/* Value Proposition */}
        <p className="mt-6 max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
          From the acoustic resonance of the hive to the physical spectral fingerprint of nectar — HoneyChain creates a tamper-evident chain of trust connecting beekeepers, laboratories, regulators, and consumers on a permissioned ledger.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('judge-mode')}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300 transition shadow-xl shadow-amber-500/25 glow-amber"
          >
            <Sparkles className="h-4 w-4" />
            <span>Launch SIH Judge Mode</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setActiveTab('command-center')}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-amber-400/50 hover:bg-slate-800 transition"
          >
            <span>Enter Command Center</span>
          </button>

          <button
            onClick={() => setActiveTab('spectraseal')}
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-400 hover:bg-amber-500/20 transition"
          >
            <Scan className="h-4 w-4" />
            <span>Scan Honey Sample</span>
          </button>
        </div>

        {/* Signature Statement Banner */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 p-6 backdrop-blur-xl shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            The HoneyChain Paradigm
          </p>
          <blockquote className="text-base sm:text-lg font-medium text-slate-200 italic leading-snug">
            "Most traceability systems record what happened. HoneyChain captures machine-generated evidence of what the honey looked like, what the hive was experiencing, and preserves that evidence across the supply chain."
          </blockquote>
        </div>

      </section>

      {/* Visual Supply Chain Pipeline Animation */}
      <section className="py-12 px-6 border-y border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              End-to-End Cryptographic Flow
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">
              PHYSICAL EVIDENCE → AI INTELLIGENCE → CRYPTOGRAPHIC IDENTITY → BLOCKCHAIN PROVENANCE → TRUST
            </p>
          </div>

          {/* Flow Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { step: '01', title: 'Smart Hive', desc: 'Acoustic & climate IoT', icon: '🐝', tab: 'smart-hives' },
              { step: '02', title: 'Harvest', desc: 'Calibrated scale registration', icon: '🍯', tab: 'honey-batches' },
              { step: '03', title: 'SpectraSeal™', desc: 'NIR/NMR spectroscopy scan', icon: '🔬', tab: 'spectraseal' },
              { step: '04', title: 'AI Screening', desc: 'Floral model comparison', icon: '🧠', tab: 'quality' },
              { step: '05', title: 'Blockchain', desc: 'Smart contract quality gate', icon: '⛓️', tab: 'blockchain' },
              { step: '06', title: 'Processing', desc: 'Cold-chain bottling unit', icon: '🏭', tab: 'supply-chain' },
              { step: '07', title: 'Distribution', desc: 'Anti-tamper smart seals', icon: '🚚', tab: 'supply-chain' },
              { step: '08', title: 'Consumer', desc: 'Public Honey Passport QR', icon: '📱', tab: 'consumer-passport' },
            ].map((s, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab(s.tab)}
                className="group relative flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 text-center cursor-pointer hover:border-amber-400/50 hover:bg-slate-850 hover:scale-[1.02] transition-all"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition">{s.icon}</div>
                <span className="text-[10px] font-bold text-amber-400 font-mono">STEP {s.step}</span>
                <h4 className="text-xs font-bold text-white mt-0.5">{s.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Three Game-Changing Innovations */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
            Pioneering AgriTech IP
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            The Three Game-Changing Innovations
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Engineered to eliminate adulteration, preserve bee colony health, and incentivize regenerative pollination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Innovation 1: SpectraSeal */}
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-amber-400 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-lg bg-amber-500/20 border border-amber-500/30 p-2.5 text-amber-400">
                  <Scan className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-300 uppercase">
                  Innovation 1
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">SPECTRASEAL™</h3>
              <p className="text-xs font-medium text-amber-400 mt-0.5">
                Blockchain-Native Spectral Fingerprint
              </p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Portable NIR/NMR spectroscopy scans harvest samples, extracting carbohydrate absorbance profiles. An AI screening model compares against floral libraries, computing a cryptographic SHA-256 fingerprint anchored to the ledger.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Rice & Cane Sugar adulteration detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Automated Smart Contract Quarantine Gate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Confirmatory NABL lab linkage</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('spectraseal')}
              className="mt-6 flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition"
            >
              <span>Explore SpectraSeal Scanner</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Innovation 2: BeeGuard */}
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-amber-400 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-2.5 text-emerald-400">
                  <Radio className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300 uppercase">
                  Innovation 2
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">BEEGUARD™</h3>
              <p className="text-xs font-medium text-emerald-400 mt-0.5">
                AI Bio-Acoustic Hive Health
              </p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Edge microphones capture internal colony acoustics. Frequency spectrogram analysis infers queen presence, swarming probability, thermal stress, and foraging vigour without invasive manual hive disturbance.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Real-time audio waveform & 2D spectrogram</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Interactive Hive Digital Twin simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Acoustic flight verification for pollination</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('smart-hives')}
              className="mt-6 flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
            >
              <span>Explore Smart Hives</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Innovation 3: Pollinate */}
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-amber-400 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-lg bg-pink-500/20 border border-pink-500/30 p-2.5 text-pink-400">
                  <Coins className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-pink-400/10 px-2.5 py-1 text-[10px] font-bold text-pink-300 uppercase">
                  Innovation 3
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">POLLINATE™</h3>
              <p className="text-xs font-medium text-pink-400 mt-0.5">
                Tokenized Pollination Economy
              </p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Connects commercial growers with certified beekeepers. Smart contracts disburse funds upon acoustically verified hive deployment hours and mint digital Pollination Service Credits.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-pink-400" />
                  <span>Automated farmer escrow contracts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-pink-400" />
                  <span>Cryptographic Pollination Proof certificates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-pink-400" />
                  <span>Future biodiversity credit alignment</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('pollinate')}
              className="mt-6 flex items-center justify-between rounded-xl bg-pink-500/10 border border-pink-500/30 p-2.5 text-xs font-semibold text-pink-400 hover:bg-pink-500/20 transition"
            >
              <span>Explore Pollinate Economy</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Live Impact Dashboard Counters */}
      <section className="py-16 px-6 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              National Footprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              HoneyChain Live Impact Dashboard
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">{metrics.hivesMonitored}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Hives Acoustically Monitored</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">{metrics.honeyBatchesTraced}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Honey Batches Fingerprinted</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-red-400">{metrics.interceptedAdulterationEvents}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Adulterations Intercepted</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">{metrics.blockchainRecordsSecured}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Blockchain Records Secured</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
