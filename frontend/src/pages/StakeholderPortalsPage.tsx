import React, { useState } from 'react';
import {
  Radio,
  FlaskConical,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Cpu,
  Package,
  Eye,
  ShieldCheck,
  Scale,
  Activity,
  Layers,
  Award,
  ChevronRight,
  ExternalLink,
  X,
  Home,
  Lock,
  KeyRound
} from 'lucide-react';
import { BarcodeIcon } from '../components/HoneyBarcodeCanvas';
import { soundManager } from '../utils/audio';

export interface DemoBatchDetail {
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

interface StakeholderPortalsPageProps {
  onSelectRole: (role: string) => void;
  onBackHome: () => void;
}

export const StakeholderPortalsPage: React.FC<StakeholderPortalsPageProps> = ({
  onSelectRole,
  onBackHome
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
      moisturePct: 16.2,
      purityScore: 99.9,
      pollenMatchPct: 98.6,
      c4SyrupAdulteration: '0.00%',
      hmfMgKg: 6.4,
      diastaseNumber: 28.2,
      fairTradePricePerKg: 460,
      totalEarnings: 55430,
      status: 'Grade A Ultra Pure',
      blockchainTx: '0x3f4a2104c89e24f8d689b741e29851720a4b73a8',
      blockNumber: 8426,
      calibratedTareSignature: 'KSH-SCALE-8831-CAL',
      labAuditor: 'Dr. Bashir Qureshi (NABL Node #KSH-01)',
      floralSource: 'Robinia Pseudoacacia (White Acacia)',
      apiaryLocation: 'Pahalgam Alpine Apiary Node AP-KSH-04',
      broodTempAtHarvest: 34.6,
      queenAcousticFreqAtHarvest: 241.1
    }
  ];

  const handleEnterPortal = (role: string) => {
    soundManager.playEnterChime();
    onSelectRole(role);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#faf8ff] text-[#1e1035] flex flex-col items-center overflow-x-hidden select-none animate-fadeIn">
      
      {/* Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-tr from-purple-200/40 via-yellow-200/35 to-transparent blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[600px] -left-40 w-[500px] h-[500px] bg-purple-200/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[800px] -right-40 w-[500px] h-[500px] bg-yellow-200/25 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full border-b border-purple-100/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs font-black transition border border-purple-200 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-purple-700" />
            <span>Back to Home</span>
          </button>
          
          <div className="h-5 w-px bg-purple-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-950 text-yellow-300 flex items-center justify-center font-black text-xs shadow-xs">
              🐝
            </div>
            <span className="font-black text-purple-950 text-base tracking-tight">
              HONEY<span className="text-amber-500">CHAIN</span>
            </span>
          </div>
        </div>

        {/* Direct portal pills in header */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleEnterPortal('beekeeper')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-200 transition cursor-pointer"
          >
            <Lock className="w-3 h-3 text-amber-700" />
            <span>Beekeeper</span>
          </button>
          <button
            type="button"
            onClick={() => handleEnterPortal('inspector')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold border border-purple-200 transition cursor-pointer"
          >
            <Lock className="w-3 h-3 text-purple-700" />
            <span>Inspector</span>
          </button>
          <button
            type="button"
            onClick={() => handleEnterPortal('customer')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold border border-emerald-200 transition cursor-pointer"
          >
            <BarcodeIcon className="w-3 h-3 text-emerald-600" />
            <span>Customer</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 flex-1">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200 shadow-xs">
            <span>🐝</span>
            <span>THREE STAKEHOLDER WORKSPACES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-purple-950 tracking-tight">
            Tailored Sections for Every Role
          </h1>
          <p className="text-sm sm:text-base text-purple-900/70 leading-relaxed max-w-2xl mx-auto font-medium">
            Select your portal to explore dedicated interfaces for field beekeeping, accredited chemical analysis, and public consumer verification.
          </p>
        </div>

        {/* 3 Role Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* ===================== ROLE 1: BEEKEEPER ===================== */}
          <div
            onClick={() => handleEnterPortal('beekeeper')}
            className="group relative bg-white border-2 border-amber-200/90 hover:border-amber-400 rounded-3xl p-7 sm:p-8 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-300 flex flex-col justify-between bumble-border-top cursor-pointer hover:scale-[1.015]"
          >
            <div className="space-y-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  <Radio className="w-3.5 h-3.5 text-amber-600" /> Beekeeper Portal
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Lock className="w-3 h-3 text-amber-700" /> Password Protected
                </span>
              </div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-purple-950 flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                <Radio className="w-7 h-7" />
              </div>

              {/* Content */}
              <div>
                <h2 className="text-2xl font-black text-purple-950 group-hover:text-amber-700 transition-colors">Beekeeper Workspace</h2>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">Smart Apiary, Flora Map & Harvest Batches</p>
                <p className="text-xs sm:text-sm text-purple-900/75 mt-3 leading-relaxed">
                  Real-time internal hive temperature monitoring, 240 Hz queen bee acoustic telemetry, satellite floral bloom maps, and verifiable batch harvest details.
                </p>
              </div>

              {/* Feature Points */}
              <ul className="space-y-2.5 text-xs text-purple-950 font-medium pt-2 border-t border-purple-50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-950">🌸 Beekeeper's Flora Map & Nearby Blooming Flowers</span>
                </li>
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
                  <span>Tare scale harvest logs & certified telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Fair-trade payout guarantee (₹380/kg) & wallet</span>
                </li>
              </ul>
            </div>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-purple-100/80 space-y-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterPortal('beekeeper');
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer border border-amber-300"
              >
                <span>Enter HoneyChain: Beekeeper Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-amber-700/80 mt-1 font-semibold flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Password Protected • Click anywhere to unlock portal</span>
              </p>
            </div>
          </div>

          {/* ===================== ROLE 2: INSPECTOR ===================== */}
          <div
            onClick={() => handleEnterPortal('inspector')}
            className="group relative bg-white border-2 border-purple-200/90 hover:border-purple-400 rounded-3xl p-7 sm:p-8 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-purple-500/15 transition-all duration-300 flex flex-col justify-between bumble-border-top cursor-pointer hover:scale-[1.015]"
          >
            <div className="space-y-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
                  <FlaskConical className="w-3.5 h-3.5 text-purple-700" /> Inspector Portal
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  <Lock className="w-3 h-3 text-purple-600" /> Password Protected
                </span>
              </div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-900 text-yellow-300 flex items-center justify-center shadow-md shadow-purple-900/25 group-hover:scale-105 transition-transform">
                <FlaskConical className="w-7 h-7" />
              </div>

              {/* Content */}
              <div>
                <h2 className="text-2xl font-black text-purple-950 group-hover:text-purple-700 transition-colors">Inspector Workspace</h2>
                <p className="text-xs font-semibold text-purple-700 mt-0.5">Accredited Lab Chemical Assays</p>
                <p className="text-xs sm:text-sm text-purple-900/75 mt-3 leading-relaxed">
                  Laboratory analytical assays testing for C4 sugar syrup adulteration (EA-IRMS), HMF enzyme freshness, pollen microscopy, and smart retail barcode notary.
                </p>
              </div>

              {/* Feature Points */}
              <ul className="space-y-2.5 text-xs text-purple-950 font-medium pt-2 border-t border-purple-50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>C4 sugar syrup adulteration check (0.00% EA-IRMS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>HMF enzymatic freshness assay (&lt; 10 mg/kg)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Diastase activity enzyme analysis (&gt; 8 DN)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Cryptographic EAN-13 Barcode Smart Seal</span>
                </li>
              </ul>
            </div>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-purple-100/80 space-y-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterPortal('inspector');
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-purple-950 hover:bg-purple-900 text-yellow-300 font-black text-sm shadow-lg shadow-purple-950/25 transition-all hover:scale-102 active:scale-98 cursor-pointer border border-purple-800"
              >
                <Lock className="w-4 h-4 text-yellow-300" />
                <span>Enter HoneyChain: Inspector Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-purple-600/70 mt-1 font-semibold flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-purple-600" />
                <span>Protected Console • Password Required</span>
              </p>
            </div>
          </div>

          {/* ===================== ROLE 3: CUSTOMER ===================== */}
          <div
            onClick={() => handleEnterPortal('customer')}
            className="group relative bg-white border-2 border-emerald-200/90 hover:border-emerald-400 rounded-3xl p-7 sm:p-8 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between bumble-border-top cursor-pointer hover:scale-[1.015]"
          >
            <div className="space-y-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <BarcodeIcon className="w-3.5 h-3.5 text-emerald-600" /> Customer Barcode Portal
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Live Retail Barcode Scan
                </span>
              </div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                <BarcodeIcon className="w-7 h-7" />
              </div>

              {/* Content */}
              <div>
                <h2 className="text-2xl font-black text-purple-950 group-hover:text-emerald-700 transition-colors">Customer Portal</h2>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">Consumer Trust & Traceability</p>
                <p className="text-xs sm:text-sm text-purple-900/75 mt-3 leading-relaxed">
                  Instantly verify honey authenticity by scanning retail jar GS1 EAN-13 barcodes to view immutable hive origins, lab assays, and harvest timestamps.
                </p>
              </div>

              {/* Feature Points */}
              <ul className="space-y-2.5 text-xs text-purple-950 font-medium pt-2 border-t border-purple-50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Working smartphone camera retail barcode scanner</span>
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
            <div className="mt-8 pt-6 border-t border-purple-100/80 space-y-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterPortal('customer');
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-102 active:scale-98 cursor-pointer border border-emerald-400"
              >
                <span>Enter HoneyChain: Customer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-purple-600/70 mt-1 font-semibold">
                Instant Access • Click anywhere on card to enter portal
              </p>
            </div>
          </div>

        </div>

      </main>

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
                className="p-2 rounded-full hover:bg-purple-100 text-purple-950 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-purple-100 px-6 sm:px-8 bg-purple-50/40 gap-2 sm:gap-6 text-xs font-bold text-purple-900/70 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveModalTab('tare')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  activeModalTab === 'tare'
                    ? 'border-amber-500 text-purple-950 font-black'
                    : 'border-transparent hover:text-purple-950'
                }`}
              >
                <Scale className="w-4 h-4 text-amber-500" />
                <span>1. Calibrated Tare Scale</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('quality')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  activeModalTab === 'quality'
                    ? 'border-purple-600 text-purple-950 font-black'
                    : 'border-transparent hover:text-purple-950'
                }`}
              >
                <FlaskConical className="w-4 h-4 text-purple-600" />
                <span>2. Laboratory Quality</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('blockchain')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  activeModalTab === 'blockchain'
                    ? 'border-yellow-500 text-purple-950 font-black'
                    : 'border-transparent hover:text-purple-950'
                }`}
              >
                <Layers className="w-4 h-4 text-yellow-600" />
                <span>3. Fabric PoA Ledger</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('payout')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  activeModalTab === 'payout'
                    ? 'border-emerald-500 text-purple-950 font-black'
                    : 'border-transparent hover:text-purple-950'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span>4. Fair-Trade Settlement</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {activeModalTab === 'tare' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-800 uppercase block">Gross Weight</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        {selectedBatchModal.grossWeightKg.toFixed(1)} kg
                      </span>
                      <span className="text-xs text-amber-800/80 mt-1 block">Full Super Comb & Hive Box</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                      <span className="text-[11px] font-bold text-purple-800 uppercase block">Calibrated Tare Weight</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        - {selectedBatchModal.tareWeightKg.toFixed(1)} kg
                      </span>
                      <span className="text-xs text-purple-800/80 mt-1 block">{selectedBatchModal.superFramesCount} Super Frame Hardware</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">Certified Net Honey</span>
                      <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                        = {selectedBatchModal.netWeightKg.toFixed(1)} kg
                      </span>
                      <span className="text-xs text-emerald-800/80 mt-1 block">100% Pure Raw Yield</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 font-mono text-slate-700">
                    <div className="flex justify-between">
                      <span>Tare Scale Hardware ID:</span>
                      <span className="font-bold text-purple-950">{selectedBatchModal.calibratedTareSignature}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brood Temperature at Extraction:</span>
                      <span className="font-bold text-purple-950">{selectedBatchModal.broodTempAtHarvest}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Queen Bee Acoustic Frequency:</span>
                      <span className="font-bold text-purple-950">{selectedBatchModal.queenAcousticFreqAtHarvest} Hz (Healthy Colony)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'quality' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">Purity Score</span>
                      <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">{selectedBatchModal.purityScore}%</span>
                      <span className="text-[10px] text-emerald-800 mt-1 block">Raw Unadulterated</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">C4 Syrup</span>
                      <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">{selectedBatchModal.c4SyrupAdulteration}</span>
                      <span className="text-[10px] text-emerald-800 mt-1 block">EA-IRMS Negative</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                      <span className="text-[11px] font-bold text-purple-800 uppercase block">HMF Freshness</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">{selectedBatchModal.hmfMgKg} mg/kg</span>
                      <span className="text-[10px] text-purple-800 mt-1 block">Max Allowed: 40 mg/kg</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-800 uppercase block">Diastase Number</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">{selectedBatchModal.diastaseNumber} DN</span>
                      <span className="text-[10px] text-amber-800 mt-1 block">Active Live Enzymes</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs space-y-1.5">
                    <div className="font-bold text-purple-950">Laboratory Accreditation Details</div>
                    <div className="text-purple-900/80">Certified By: <span className="font-bold">{selectedBatchModal.labAuditor}</span></div>
                    <div className="text-purple-900/80">Floral Micro-Spectroscopy Match: <span className="font-bold text-emerald-700">{selectedBatchModal.pollenMatchPct}% {selectedBatchModal.floralSource}</span></div>
                  </div>
                </div>
              )}

              {activeModalTab === 'blockchain' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-emerald-400 font-bold">● Hyperledger Fabric Channel: 'honeychannel'</span>
                      <span className="text-slate-400 text-[11px]">
                        Status: Confirmed (12 Peer Validations)
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

      {/* Page Footer */}
      <footer className="relative z-10 w-full border-t border-purple-100/90 bg-white/80 py-8 px-4 sm:px-6 text-center text-xs text-purple-900/60 font-medium mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-purple-950 text-yellow-300 flex items-center justify-center font-black text-[10px]">
              🐝
            </div>
            <span className="font-black text-purple-950 text-sm">
              HONEY<span className="text-amber-500">CHAIN</span>
            </span>
            <span className="text-[11px] text-purple-700/60">
              • Cryptographic Provenance Platform
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-purple-900/70 font-semibold">
            <span>NABL ISO/IEC 17025 Certified</span>
            <span>•</span>
            <span>Zero-Knowledge Proofs</span>
            <span>•</span>
            <span>Hyperledger Fabric Immutable Ledger</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default StakeholderPortalsPage;
