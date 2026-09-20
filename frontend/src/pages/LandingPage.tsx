import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Radio,
  FlaskConical,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Cpu,
  Scale,
  KeyRound,
  Camera,
  ShoppingBag,
  SearchCheck,
  FileCheck,
  Award,
  Trees,
  Lock,
  ChevronRight,
  ExternalLink,
  Package,
  Eye,
  X,
  Layers,
  Coins,
  MapPin,
  Calendar
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp?: () => void;
  onEnterDemo?: () => void;
  onSelectRole?: (role: string) => void;
  onOpenScanner?: () => void;
  onOpenProvenanceGraph?: () => void;
}

interface DemoBatchDetail {
  id: string;
  name: string;
  hiveOrigin: string;
  harvestDate: string;
  tareWeightKg: number;
  grossWeightKg: number;
  netWeightKg: number;
  superFramesCount: number;
  moisturePct: number;
  purityScore: number;
  pollenMatchPct: number;
  c4SyrupAdulteration: string;
  hmfMgKg: number;
  diastaseNumber: number;
  fairTradePricePerKg: number;
  totalEarnings: number;
  status: string;
  blockchainTx: string;
  blockNumber: number;
  calibratedTareSignature: string;
  labAuditor: string;
  floralSource: string;
  apiaryLocation: string;
  broodTempAtHarvest: number;
  queenAcousticFreqAtHarvest: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onEnterDemo,
  onSelectRole,
  onOpenScanner,
  onOpenProvenanceGraph
}) => {
  const [selectedBatchModal, setSelectedBatchModal] = useState<DemoBatchDetail | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'tare' | 'quality' | 'blockchain' | 'payout'>('tare');

  const demoBatches: DemoBatchDetail[] = [
    {
      id: 'HB-2026-0891',
      name: 'Warangal Forest Multiflora Pure Reserve',
      hiveOrigin: 'HIVE-01 (Nilgiri Kurinji Colony)',
      harvestDate: '14 Sep 2026, 09:30 AM',
      tareWeightKg: 12.5,
      grossWeightKg: 81.0,
      netWeightKg: 68.5,
      superFramesCount: 18,
      moisturePct: 17.2,
      purityScore: 99.6,
      pollenMatchPct: 95.4,
      c4SyrupAdulteration: '0.00%',
      hmfMgKg: 8.2,
      diastaseNumber: 24.8,
      fairTradePricePerKg: 380,
      totalEarnings: 26030,
      status: 'Certified Pure',
      blockchainTx: '0x9b7f4a2104c89e24f8d689b741e29851720a4b73',
      blockNumber: 8421,
      calibratedTareSignature: 'TG-SCAL-8812-CAL',
      labAuditor: 'Dr. Ananya Iyer (NABL Node #TN-02)',
      floralSource: 'Wild Multiflora, Neem & Jamun',
      apiaryLocation: 'Warangal Rural Apiary Node AP-TG-01',
      broodTempAtHarvest: 34.8,
      queenAcousticFreqAtHarvest: 240.2
    },
    {
      id: 'HB-2026-0892',
      name: 'Nilgiri Kurinji High-Altitude Blossom',
      hiveOrigin: 'HIVE-02 (Nilgiri High-Altitude)',
      harvestDate: '11 Sep 2026, 11:15 AM',
      tareWeightKg: 14.0,
      grossWeightKg: 99.0,
      netWeightKg: 85.0,
      superFramesCount: 22,
      moisturePct: 16.4,
      purityScore: 99.8,
      pollenMatchPct: 97.1,
      c4SyrupAdulteration: '0.00%',
      hmfMgKg: 6.9,
      diastaseNumber: 26.4,
      fairTradePricePerKg: 420,
      totalEarnings: 35700,
      status: 'Certified Pure',
      blockchainTx: '0x4e21a8f940bb174205a9173f4019b7f4a2104c89',
      blockNumber: 8422,
      calibratedTareSignature: 'NIL-SCALE-9901-CAL',
      labAuditor: 'Dr. Rajesh Nair (NABL Node #TN-01)',
      floralSource: 'Strobilanthes Kunthiana (Kurinji)',
      apiaryLocation: 'Nilgiri Biosphere Apiary Node AP-NIL-01',
      broodTempAtHarvest: 34.5,
      queenAcousticFreqAtHarvest: 238.5
    },
    {
      id: 'HB-2026-0893',
      name: 'Kashmir Alpine White Acacia Harvest',
      hiveOrigin: 'HIVE-04 (Coorg & Kashmir Clustered)',
      harvestDate: '08 Sep 2026, 08:45 AM',
      tareWeightKg: 18.5,
      grossWeightKg: 139.0,
      netWeightKg: 120.5,
      superFramesCount: 28,
      moisturePct: 16.8,
      purityScore: 99.4,
      pollenMatchPct: 94.8,
      c4SyrupAdulteration: '0.00%',
      hmfMgKg: 9.1,
      diastaseNumber: 23.2,
      fairTradePricePerKg: 352,
      totalEarnings: 42416,
      status: 'Lab Verified',
      blockchainTx: '0x1720a4b739b7f4a2104c89e24f8d689b741e2985',
      blockNumber: 8419,
      calibratedTareSignature: 'KSH-SCALE-4412-CAL',
      labAuditor: 'Dr. Farooq Mir (KVIC Testing Node #09)',
      floralSource: 'Robinia Pseudoacacia (Acacia)',
      apiaryLocation: 'Pahalgam Alpine Apiary Node AP-KSH-04',
      broodTempAtHarvest: 34.7,
      queenAcousticFreqAtHarvest: 242.0
    }
  ];

  const handleEnter = () => {
    if (onEnterApp) {
      onEnterApp();
    } else if (onEnterDemo) {
      onEnterDemo();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#faf8ff] text-[#1e1035] flex flex-col items-center overflow-x-hidden select-none">
      
      {/* Glowing Ambient Glows */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-purple-200/40 via-yellow-200/35 to-transparent blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[800px] -left-40 w-[500px] h-[500px] bg-purple-200/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[1300px] -right-40 w-[500px] h-[500px] bg-yellow-200/25 blur-[130px] rounded-full pointer-events-none" />

      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 space-y-6">
        
        {/* Top Badge */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100/80 px-4 py-1.5 text-xs font-bold text-purple-900 shadow-xs">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>From Hive to Home — Every Drop Has a Digital Identity</span>
          </div>
        </div>

        {/* Grand Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-purple-950 leading-none">
          HONEY<span className="text-amber-500 drop-shadow-[0_0_24px_rgba(245,158,11,0.35)]">CHAIN</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-purple-950 leading-snug max-w-3xl mx-auto">
          "AI-Powered Smart Beekeeping. IoT-Driven Hive Intelligence. Blockchain-Backed Provenance."
        </p>

        {/* Mission Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-purple-900/80 leading-relaxed font-medium">
          A tamper-proof digital trust ecosystem unifying field beekeepers, certified quality testing laboratories, and retail consumers into one continuous verifiable chain of custody.
        </p>

        {/* Single Yellow Primary Action Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleEnter}
            className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 px-8 py-4 text-base font-black text-purple-950 transition-all shadow-xl shadow-yellow-500/30 hover:scale-105 active:scale-95 cursor-pointer border-2 border-yellow-200"
          >
            <Sparkles className="h-5 w-5 text-purple-950" />
            <span>Enter HoneyChain Platform</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

      </section>

      {/* =========================================================================
          STAKEHOLDER WORKSPACES SECTION (INSPECTOR, BEEKEEPER, CUSTOMER)
          ========================================================================= */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
            <span>🐝</span>
            <span>THREE STAKEHOLDER WORKSPACES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-950 tracking-tight">
            Tailored Sections for Every Role
          </h2>
          <p className="text-sm sm:text-base text-purple-900/70 leading-relaxed">
            Select your portal to explore dedicated interfaces for field beekeeping, accredited chemical analysis, and public consumer verification.
          </p>
        </div>

        {/* 3 Role Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* ===================== ROLE 1: BEEKEEPER ===================== */}
          <div className="group relative bg-white border-2 border-amber-200/90 hover:border-amber-400 rounded-3xl p-7 sm:p-8 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between bumble-border-top">
            <div className="space-y-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  <Radio className="w-3.5 h-3.5 text-amber-600" /> Beekeeper
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Cpu className="w-3 h-3 text-amber-600" /> IoT Hardware
                </span>
              </div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-purple-950 flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                <Radio className="w-7 h-7" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-black text-purple-950">Beekeeper Workspace</h3>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">Smart Apiary & Harvest Batches</p>
                <p className="text-xs sm:text-sm text-purple-900/75 mt-3 leading-relaxed">
                  Real-time internal hive temperature monitoring, 240 Hz queen bee acoustic telemetry, calibrated tare scale weights, and verifiable batch harvest details.
                </p>
              </div>

              {/* Feature Points */}
              <ul className="space-y-2.5 text-xs text-purple-950 font-medium pt-2 border-t border-purple-50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>240 Hz Queen acoustic disease prediction</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Brood temperature equilibrium (34.8°C)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>Batch Option:</strong> Tare scale harvest logs & details</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Fair-trade payout guarantee (₹380/kg) & wallet</span>
                </li>
              </ul>
            </div>

            {/* Action CTAs: Enter Workspace + Batch Option */}
            <div className="mt-8 pt-6 border-t border-purple-100/80 space-y-2.5">
              <button
                type="button"
                onClick={() => onSelectRole ? onSelectRole('beekeeper') : handleEnter()}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer border border-amber-300"
              >
                <span>Enter as Beekeeper</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedBatchModal(demoBatches[0]);
                  setActiveModalTab('tare');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-extrabold text-xs transition border border-amber-300 cursor-pointer shadow-xs"
              >
                <Package className="w-3.5 h-3.5 text-amber-700" />
                <span>Batch Option: View Harvest Details</span>
                <Eye className="w-3.5 h-3.5 text-amber-700" />
              </button>

              <p className="text-[10px] text-center text-purple-600/70 mt-1 font-semibold">
                Nilgiri Apiary • Live Telemetry & Batches
              </p>
            </div>
          </div>

          {/* ===================== ROLE 2: INSPECTOR ===================== */}
          <div className="group relative bg-white border-2 border-purple-300 hover:border-purple-500 rounded-3xl p-7 sm:p-8 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between bumble-border-top ring-2 ring-purple-400/20">
            <div className="space-y-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-100 text-purple-950 border border-purple-300">
                  <FlaskConical className="w-3.5 h-3.5 text-purple-700" /> Lab Inspector
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  <ShieldCheck className="w-3 h-3 text-purple-600" /> ISO/IEC 17025
                </span>
              </div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-800 to-purple-950 text-yellow-300 flex items-center justify-center shadow-md shadow-purple-900/20 group-hover:scale-105 transition-transform">
                <FlaskConical className="w-7 h-7" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-black text-purple-950">Inspector Workspace</h3>
                <p className="text-xs font-semibold text-purple-700 mt-0.5">Chemical Testing & Authenticity</p>
                <p className="text-xs sm:text-sm text-purple-900/75 mt-3 leading-relaxed">
                  Verify honey batches using EA-IRMS carbon isotope spectrometry (0.00% C4 syrups), HMF thermal degradation assays, and notarize cryptographic SHA-256 certificates.
                </p>
              </div>

              {/* Feature Points */}
              <ul className="space-y-2.5 text-xs text-purple-950 font-medium pt-2 border-t border-purple-50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>EA-IRMS C3/C4 sugar isotope mass spectrometry</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>HMF freshness & invertase enzyme assay</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Tamper-evident SHA-256 certificate sealing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>NABL ISO-17025 certified laboratory audit trail</span>
                </li>
              </ul>
            </div>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-purple-100/80">
              <button
                type="button"
                onClick={() => onSelectRole ? onSelectRole('inspector') : handleEnter()}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-purple-950 hover:bg-purple-900 text-yellow-300 font-black text-sm shadow-md shadow-purple-950/20 transition-all hover:scale-102 active:scale-98 cursor-pointer border border-purple-800"
              >
                <span>Enter as Inspector</span>
                <ArrowRight className="w-4 h-4 text-yellow-300" />
              </button>
              <p className="text-[10px] text-center text-purple-600/70 mt-2 font-semibold">
                NABL Testing Node #TN-02 • Authenticity Console
              </p>
            </div>
          </div>

          {/* ===================== ROLE 3: CUSTOMER ===================== */}
          <div className="group relative bg-white border-2 border-emerald-200 hover:border-emerald-400 rounded-3xl p-7 sm:p-8 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between bumble-border-top">
            <div className="space-y-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" /> Customer
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Camera className="w-3 h-3 text-emerald-600" /> Live QR Scan
                </span>
              </div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
                <QrCode className="w-7 h-7" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-black text-purple-950">Customer Portal</h3>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">Consumer QR Scanner & Trust</p>
                <p className="text-xs sm:text-sm text-purple-900/75 mt-3 leading-relaxed">
                  Scan any retail honey jar to verify full floral origins, meet the tribal beekeeper, inspect certified laboratory reports, and guarantee zero syrup adulteration.
                </p>
              </div>

              {/* Feature Points */}
              <ul className="space-y-2.5 text-xs text-purple-950 font-medium pt-2 border-t border-purple-50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Working smartphone camera QR code scanner</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>"From Hive to Home" verified digital passport</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Anti-counterfeit spatiotemporal velocity check</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct tribal beekeeper bio & forest geolocation</span>
                </li>
              </ul>
            </div>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-purple-100/80">
              <button
                type="button"
                onClick={() => onSelectRole ? onSelectRole('customer') : (onOpenScanner ? onOpenScanner() : handleEnter())}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98 cursor-pointer border border-emerald-400"
              >
                <span>Enter as Customer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-purple-600/70 mt-2 font-semibold">
                Instant Access • No Login Required
              </p>
            </div>
          </div>

        </div>

      </section>



      {/* =========================================================================
          BATCH DETAILS MODAL (ACCESSIBLE FROM BEEKEEPER OPTION)
          ========================================================================= */}
      {selectedBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl border-2 border-purple-200 shadow-2xl overflow-hidden my-8 bumble-border-top">
            
            {/* Modal Header */}
            <div className="bg-purple-50/90 px-6 sm:px-8 py-5 border-b border-purple-200 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black text-purple-950 px-2.5 py-0.5 rounded-md bg-yellow-300 border border-yellow-400">
                    {selectedBatchModal.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {selectedBatchModal.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Fabric Block #{selectedBatchModal.blockNumber}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-purple-950">
                  {selectedBatchModal.name}
                </h2>
                <p className="text-xs text-purple-900/70 mt-0.5">
                  Harvested on {selectedBatchModal.harvestDate} • {selectedBatchModal.apiaryLocation}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBatchModal(null)}
                className="p-2 rounded-xl text-purple-600 hover:text-purple-950 hover:bg-purple-200 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-purple-100 px-6 sm:px-8 bg-white gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalTab('tare')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeModalTab === 'tare'
                    ? 'border-purple-900 text-purple-950 font-black'
                    : 'border-transparent text-purple-700/70 hover:text-purple-950'
                }`}
              >
                📦 Tare & Harvest Scales
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('quality')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeModalTab === 'quality'
                    ? 'border-purple-900 text-purple-950 font-black'
                    : 'border-transparent text-purple-700/70 hover:text-purple-950'
                }`}
              >
                🧪 Chemical Assays & Purity
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('blockchain')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeModalTab === 'blockchain'
                    ? 'border-purple-900 text-purple-950 font-black'
                    : 'border-transparent text-purple-700/70 hover:text-purple-950'
                }`}
              >
                ⛓️ Blockchain Notary Proof
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('payout')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeModalTab === 'payout'
                    ? 'border-purple-900 text-purple-950 font-black'
                    : 'border-transparent text-purple-700/70 hover:text-purple-950'
                }`}
              >
                💰 Direct Fair-Trade Payout
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              {activeModalTab === 'tare' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-800 uppercase block">Gross Scale Reading</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        {selectedBatchModal.grossWeightKg} kg
                      </span>
                      <span className="text-xs text-amber-800/80 mt-1 block">Loaded Super Frames</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                      <span className="text-[11px] font-bold text-purple-800 uppercase block">Tare Box Weight</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        {selectedBatchModal.tareWeightKg} kg
                      </span>
                      <span className="text-xs text-purple-800/80 mt-1 block">Tare Tare Calibration</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">Net Pure Honey</span>
                      <span className="text-2xl font-black text-emerald-800 font-mono mt-1 block">
                        {selectedBatchModal.netWeightKg} kg
                      </span>
                      <span className="text-xs text-emerald-800/80 mt-1 block">Extraction Tare</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-600" />
                      Physical Tare Scale Calibration & Hive IoT Metadata
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-purple-900/80 pt-2">
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Origin Hive ID:</span>
                        <span className="font-mono font-bold text-purple-950">{selectedBatchModal.hiveOrigin}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Brood Temp at Harvest:</span>
                        <span className="font-mono font-bold text-purple-950">{selectedBatchModal.broodTempAtHarvest}°C</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Queen Acoustic Hum:</span>
                        <span className="font-mono font-bold text-purple-950">{selectedBatchModal.queenAcousticFreqAtHarvest} Hz</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Super Frames Harvested:</span>
                        <span className="font-bold text-purple-950">{selectedBatchModal.superFramesCount} Frames</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Calibrated Scale Seal:</span>
                        <span className="font-mono font-bold text-amber-900">{selectedBatchModal.calibratedTareSignature}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Floral Profile:</span>
                        <span className="font-bold text-purple-950">{selectedBatchModal.floralSource}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'quality' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-purple-800 uppercase block">NABL Accredited Laboratory</span>
                      <span className="text-base font-black text-purple-950">{selectedBatchModal.labAuditor}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ISO/IEC 17025 CERTIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">C4 Sugar Adulteration</span>
                      <span className="text-xl font-black text-emerald-700 font-mono mt-1 block">
                        {selectedBatchModal.c4SyrupAdulteration}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">EA-IRMS 100% Pure</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">HMF Freshness</span>
                      <span className="text-xl font-black text-purple-950 font-mono mt-1 block">
                        {selectedBatchModal.hmfMgKg} mg/kg
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Unheated Honey (&lt;40)</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Diastase Activity</span>
                      <span className="text-xl font-black text-purple-950 font-mono mt-1 block">
                        {selectedBatchModal.diastaseNumber} DN
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Active Raw Enzymes</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Pollen Match</span>
                      <span className="text-xl font-black text-emerald-700 font-mono mt-1 block">
                        {selectedBatchModal.pollenMatchPct}%
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Native Flora Confirmed</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'blockchain' && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs space-y-4 shadow-inner">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-amber-400 font-bold flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Hyperledger Fabric State Commitment
                      </span>
                      <span className="bg-emerald-900/80 text-emerald-300 px-2.5 py-0.5 rounded text-[10px] font-bold">
                        STATUS: COMMITTED & IMMUTABLE
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Transaction Hash (TxId):</span>
                        <span className="text-yellow-300 font-bold break-all">{selectedBatchModal.blockchainTx}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Block Height:</span>
                          <span className="text-white font-bold font-mono">#{selectedBatchModal.blockNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Consensus Validator:</span>
                          <span className="text-white font-bold">KVIC Node 01 & NABL Lab #TN-02</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'payout' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-800 uppercase block">Base Price Guaranteed</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        ₹320.00 / kg
                      </span>
                      <span className="text-xs text-amber-800/80 mt-1 block">KVIC Minimum Support Price</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">Quality Bonus</span>
                      <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                        +₹{selectedBatchModal.fairTradePricePerKg - 320}.00 / kg
                      </span>
                      <span className="text-xs text-emerald-800/80 mt-1 block">High Purity Incentive</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                      <span className="text-[11px] font-bold text-purple-800 uppercase block">Total Net Settlement</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        ₹{selectedBatchModal.totalEarnings.toLocaleString()}
                      </span>
                      <span className="text-xs text-purple-800/80 mt-1 block">Disbursed to Smart Wallet</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-purple-50/70 px-6 sm:px-8 py-4 border-t border-purple-200 flex items-center justify-between">
              <span className="text-xs font-mono text-purple-900 font-bold">
                Batch ID: {selectedBatchModal.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedBatchModal(null)}
                className="px-5 py-2.5 rounded-xl border border-purple-200 bg-white text-purple-950 text-xs font-black hover:bg-purple-100 transition cursor-pointer"
              >
                Close Batch Inspector
              </button>
            </div>

          </div>
        </div>
      )}



    </div>
  );
};

export default LandingPage;
