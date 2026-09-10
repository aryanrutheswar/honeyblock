import React from 'react';
import { 
  Network, 
  Cpu, 
  Database, 
  Link2, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  Scan, 
  Server, 
  Lock, 
  Smartphone,
  ChevronDown
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const ArchitecturePage: React.FC = () => {
  const layers = [
    {
      level: 'LAYER 06',
      title: 'TRUST & CONSUMER LAYER',
      icon: ShieldCheck,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      components: [
        { name: 'Honey Passport (/verify/:id)', desc: 'Mobile-responsive public consumer transparency portal' },
        { name: 'Dynamic QR Engine', desc: 'Tamper-evident batch-linked QR codes' },
        { name: 'Transparency Scorecard', desc: 'Autonomous rating algorithm (0-100)' },
        { name: 'Meet Your Bees', desc: 'Consumer bio-connection & apiary provenance' },
      ]
    },
    {
      level: 'LAYER 05',
      title: 'APPLICATION & RBAC LAYER',
      icon: Users,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      components: [
        { name: 'Beekeeper Command Center', desc: 'Hive telemetry, harvest minting & pollination payouts' },
        { name: 'NABL Quality Lab Portal', desc: 'Confirmatory testing sign-off & certificate anchoring' },
        { name: 'Regulator Oversight Tower', desc: 'Instant batch quarantine & supply-chain freeze' },
        { name: 'Processor Logistics Desk', desc: 'Cold-chain intake, filtration & bottling tracking' },
      ]
    },
    {
      level: 'LAYER 04',
      title: 'BLOCKCHAIN & SMART CONTRACT LAYER',
      icon: Link2,
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
      components: [
        { name: 'Permissioned Ledger Engine', desc: 'Hyperledger Fabric compatible architecture' },
        { name: 'Smart Contract Quality Gate (#0x99a)', desc: 'Automated PASS / REVIEW / QUARANTINE rules' },
        { name: 'SHA-256 Merkle Chaining', desc: 'Mathematical evidence anchoring & anti-tamper validation' },
        { name: 'POLLINATE™ Escrow Token', desc: 'Pollination Service Credit minting & disbursement' },
      ]
    },
    {
      level: 'LAYER 03',
      title: 'DATA & STORAGE LAYER',
      icon: Database,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
      components: [
        { name: 'Botanical Reference Library', desc: '1,420+ curated NIR/NMR authentic floral profiles' },
        { name: 'Bio-Acoustic Time Series', desc: 'Colony audio waveforms & 2D spectrogram buffers' },
        { name: 'Chain of Custody Events', desc: 'Sensor-stamped custody handover audit trail' },
        { name: 'Incident & Alert Logs', desc: 'Real-time FSSAI regulatory incident registry' },
      ]
    },
    {
      level: 'LAYER 02',
      title: 'EDGE & AI INFERENCE LAYER',
      icon: Cpu,
      color: 'border-pink-500/40 bg-pink-950/20 text-pink-300',
      components: [
        { name: 'SpectraSeal™ Anomaly Engine', desc: 'C3/C4 exogenous syrup detection & feature extraction' },
        { name: 'BeeGuard™ Bio-Acoustic AI', desc: 'Colony health, queen piping & swarming risk inference' },
        { name: 'Harvest Yield Predictor', desc: 'Dynamic weight & thermal development forecast' },
        { name: 'BeeGuard AI Assistant', desc: 'Autonomous contextual copilot for SIH judges' },
      ]
    },
    {
      level: 'LAYER 01',
      title: 'PHYSICAL SENSING LAYER',
      icon: Radio,
      color: 'border-slate-700 bg-slate-900/60 text-slate-300',
      components: [
        { name: 'Edge Hive Microphones', desc: '48kHz audio capture of internal colony resonance' },
        { name: 'Portable NIR/NMR Cuvette', desc: '1000nm-2500nm optical absorbance spectrometer' },
        { name: 'Calibrated Tare Scales', desc: 'Precision digital weight monitoring (±5g)' },
        { name: 'Cold-Chain IoT Seals', desc: 'Continuous thermal & GPS transit tracking' },
      ]
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
            <Network className="h-5 w-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            HoneyChain System Architecture
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Full 6-Tier Architecture: Physical Evidence → Edge AI → Blockchain Consensus → Consumer Trust
        </p>
      </div>

      {/* 6-Layer Stack Diagram */}
      <div className="space-y-4">
        {layers.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl border p-5 transition-all shadow-lg ${layer.color}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-slate-950/80 border border-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest opacity-80 block">
                      {layer.level}
                    </span>
                    <h3 className="text-base font-bold text-white font-sans">
                      {layer.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {layer.components.map((comp, cIdx) => (
                  <div
                    key={cIdx}
                    className="rounded-xl bg-slate-950/80 border border-white/10 p-3 space-y-1"
                  >
                    <h4 className="text-xs font-bold text-white">{comp.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">{comp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Technology Stack & Deployment Blueprint */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Production Tech Stack & Open Standards</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <span className="text-slate-500 text-[10px] block">Frontend</span>
            <p className="font-bold text-white">React 18 + Vite</p>
            <p className="text-[10px] text-slate-400">TailwindCSS, Recharts, Lucide</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <span className="text-slate-500 text-[10px] block">Backend API</span>
            <p className="font-bold text-white">Node.js + Express</p>
            <p className="text-[10px] text-slate-400">REST, Crypto SHA-256 Engine</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <span className="text-slate-500 text-[10px] block">Blockchain</span>
            <p className="font-bold text-blue-400">Permissioned Ledger</p>
            <p className="text-[10px] text-slate-400">PBFT, Smart Contract Gates</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <span className="text-slate-500 text-[10px] block">AI Models</span>
            <p className="font-bold text-amber-400">SpectraSeal + BeeGuard</p>
            <p className="text-[10px] text-slate-400">Edge Bio-Acoustics & NIR AI</p>
          </div>
        </div>
      </div>

      <DisclaimerBanner type="general" />

    </div>
  );
};
