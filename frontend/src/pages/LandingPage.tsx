import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  QrCode,
  Scan,
  TrendingUp,
  MapPin,
  FlaskConical,
  Scale,
  Package,
  Truck,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  Flower2,
  TreePine,
  Coins,
  ShieldAlert,
  GitBranch,
  Calendar,
  Users
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface LandingPageProps {
  onEnterDemo?: () => void;
  onSelectRole?: (role: string) => void;
  onOpenScanner?: () => void;
  onOpenProvenanceGraph?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDemo,
  onSelectRole,
  onOpenScanner,
  onOpenProvenanceGraph
}) => {
  // Active Interactive Stage in "One Batch — Complete Story"
  const [activeStage, setActiveStage] = useState<number>(0);

  const batchStages = [
    {
      stage: '01. SMART HIVE',
      title: 'Smart Hive HIVE-TG-017',
      location: 'Warangal Rural Cluster Apiary AP-TG-01',
      actor: 'Beekeeper Ravi Kumar (FIDO2 Biometric)',
      evidence: 'IoT sensors continuously stream 240 Hz queen harmonic hum, 34.2°C brood thermoregulation, and 42.7 kg scale weight.',
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      tag: 'IoT Telemetry'
    },
    {
      stage: '02. FLORAL SOURCE',
      title: 'Multiflora & Teak Forest Bloom',
      location: 'Mulugu Buffer Forest, Warangal (302m Altitude)',
      actor: 'Apis cerana indica Foraging Bees',
      evidence: 'Bees foraged across 3.2 km wild forest canopy; yellow mustard and teak blossom nectar with zero pesticide residues.',
      icon: <Flower2 className="w-5 h-5 text-emerald-400" />,
      tag: 'Botanical Origin'
    },
    {
      stage: '03. HARVEST',
      title: 'Tare Scale Harvest (68.5 kg)',
      location: 'Apiary Extraction Shed, Warangal',
      actor: 'Beekeeper Ravi Kumar',
      evidence: '68.5 kg super frame harvest registered. Calibrated tare scale signature #TG-SCAL-8812 sealed to local flash memory.',
      icon: <Scale className="w-5 h-5 text-amber-400" />,
      tag: 'Scale Weight'
    },
    {
      stage: '04. LAB TESTING',
      title: 'ISO/IEC 17025 EA-IRMS Isotope Clearance',
      location: 'National Honey Quality Lab, Hyderabad',
      actor: 'Dr. Ananya Iyer, Chief Chromatographer',
      evidence: 'EA-IRMS confirmed δ13C = -26.8‰ (Pure C3 Nectar). Diastase 22.4 DN, HMF 8.4 mg/kg. C4 synthetic syrup = 0.00%.',
      icon: <FlaskConical className="w-5 h-5 text-cyan-400" />,
      tag: 'Chemical Proof'
    },
    {
      stage: '05. BLOCKCHAIN',
      title: 'Hyperledger Fabric Block #002 Notarization',
      location: 'PoA Consensus Consortial Network',
      actor: 'KVIC National Trust Validator Node 01',
      evidence: 'Transaction hash 0x99aBEE42... anchored to permissioned ledger. Immutable Merkle root notarizes all laboratory records.',
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      tag: 'SHA-256 Ledger'
    },
    {
      stage: '06. PROCESSING',
      title: 'Cold Micro-Filtration (38°C)',
      location: 'KVIC Warangal Agro-Processing Unit #02',
      actor: 'Processing Technician K. Naresh',
      evidence: 'Centrifugal extraction at 38°C max preserves natural enzymes and microscopic pollen grains. Zero artificial heat degradation.',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      tag: 'Enzyme Safe'
    },
    {
      stage: '07. PACKAGING',
      title: 'Packaging Lot Split PKG-TG-0001-A',
      location: 'KVIC Bottling Facility, Warangal',
      actor: 'Automated Bottling Line 04',
      evidence: 'Divided into 50 octagonal 500g glass jars with individual cryptographic holographic tamper-evident QR security seals.',
      icon: <Package className="w-5 h-5 text-emerald-400" />,
      tag: 'Batch Split'
    },
    {
      stage: '08. DISTRIBUTION',
      title: 'Cold-Chain Transit Fleet TL-09',
      location: 'Transit: Warangal to Hyderabad Hub',
      actor: 'Telangana State Agro Logistics',
      evidence: 'Continuous thermal tracking verified average 21.4°C in transit. Zero seal violations or shock anomalies detected.',
      icon: <Truck className="w-5 h-5 text-indigo-400" />,
      tag: 'Cold Chain'
    },
    {
      stage: '09. QR VERIFICATION',
      title: 'Cryptographic Jar Serialization (QR/NFC)',
      location: 'Khadi Gramodyog Bhavan Hyderabad',
      actor: 'Retail Node #14 Manager',
      evidence: 'Public verification gateway activated: /verify/HNY-TG-2026-0001. Anti-cloning spatiotemporal velocity check live.',
      icon: <QrCode className="w-5 h-5 text-amber-400" />,
      tag: 'Anti-Clone QR'
    },
    {
      stage: '10. CONSUMER',
      title: 'Public "From Hive to Home" Passport',
      location: 'Consumer Smartphone Scan',
      actor: 'Verified Retail Consumer',
      evidence: 'Consumer sees 98% Traceability Confidence, meets Beekeeper Ravi Kumar, verifies NABL report, and views genuine provenance.',
      icon: <ShoppingBag className="w-5 h-5 text-emerald-400" />,
      tag: 'Trust Passport'
    }
  ];

  const currentStageData = batchStages[activeStage];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* 1. Top Hackathon Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 px-4 py-2 text-center text-xs font-black text-slate-950 tracking-wider flex items-center justify-center gap-2 shadow-md">
        <span>🏆 SMART INDIA HACKATHON 2026 — KVIC HONEY MISSION DIGITAL PLATFORM</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">NATIONAL TRUST INFRASTRUCTURE</span>
      </div>

      {/* 2. Hero Section */}
      <section className="relative px-6 pt-16 pb-24 max-w-7xl mx-auto text-center">
        
        {/* Glowing Honey Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-transparent blur-[140px] rounded-full pointer-events-none" />

        {/* Hero Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400 mb-6 shadow-lg shadow-amber-500/10">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>From Hive to Home — Every Drop Has a Digital Identity</span>
        </div>

        {/* Grand Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-none">
          HONEY<span className="text-amber-400">CHAIN</span>
        </h1>
        <p className="mt-4 text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 bg-clip-text text-transparent">
          "AI-Powered Smart Beekeeping. IoT-Driven Hive Intelligence. Blockchain-Backed Provenance."
        </p>

        {/* Mission Statement */}
        <p className="mt-6 max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
          Supporting the KVIC Honey Mission by unifying rural beekeeping hardware, bio-acoustic disease prediction, ISO/IEC 17025 isotopic testing, tamper-evident SHA-256 blockchain provenance, and consumer trust into one continuous digital identity.
        </p>

        {/* Primary Action Buttons (Hero CTA) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onEnterDemo}
            className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-7 py-4 text-sm sm:text-base font-black text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-xl shadow-amber-500/30 hover:scale-103 active:scale-98 cursor-pointer"
          >
            <Sparkles className="h-5 w-5 text-slate-950" />
            <span>🎬 Launch 3-Min Judge Demo</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2.5 rounded-2xl border-2 border-amber-500/40 bg-slate-900/90 px-6 py-4 text-sm sm:text-base font-bold text-amber-300 hover:bg-slate-800 hover:border-amber-400 transition-all shadow-lg hover:scale-102 active:scale-98 cursor-pointer"
          >
            <Scan className="h-5 w-5 text-amber-400" />
            <span>Scan a Honey Jar</span>
          </button>

          <button
            onClick={onOpenProvenanceGraph}
            className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-4 text-sm sm:text-base font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <GitBranch className="h-5 w-5 text-slate-400" />
            <span>Provenance Graph</span>
          </button>
        </div>

        {/* 3 Core Messages (Requirement 50) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto text-left">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
              PILLAR 01 • IOT BIO-ACOUSTICS
            </span>
            <h4 className="font-extrabold text-base text-white">
              We See Inside the Hive.
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Non-invasive 240Hz FFT acoustic frequency analysis & temperature equilibrium sensing detects colony distress days before inspection.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
              PILLAR 02 • CRYPTOGRAPHIC PROVENANCE
            </span>
            <h4 className="font-extrabold text-base text-white">
              We Trace What Happened to the Honey.
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              From calibrated tare harvest scales to ISO/IEC 17025 EA-IRMS carbon isotope testing (δ13C -26.8‰), anchored immutably to Hyperledger Fabric.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
              PILLAR 03 • CONSUMER VERIFICATION
            </span>
            <h4 className="font-extrabold text-base text-white">
              The Consumer Verifies the Story.
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Instant smartphone QR scan reveals full floral origins, meets the tribal beekeeper, and detects counterfeit QR cloning anomalies in real time.
            </p>
          </div>
        </div>

      </section>

      {/* 3. "ONE BATCH — COMPLETE STORY" Interactive Stage Viewer (Requirement 41) */}
      <section className="px-6 py-20 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Interactive Batch Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              One Batch — Complete Story
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Follow Batch #HNY-TG-2026-0001 through all 10 stages from the Warangal forest canopy to the consumer kitchen table. Click each stage to inspect live demo data.
            </p>
          </div>

          {/* 10-Stage Horizontal Stepper */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3">
            {batchStages.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border cursor-pointer ${
                  activeStage === idx
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/25 scale-105 font-black'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {s.icon}
                <span>{s.stage}</span>
              </button>
            ))}
          </div>

          {/* Active Stage Data Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fadeIn">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                  STAGE {activeStage + 1} OF 10 • {currentStageData.tag}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Batch: HNY-TG-2026-0001
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {currentStageData.title}
              </h3>

              <div className="space-y-1 text-xs text-slate-300">
                <p><strong className="text-slate-400">Location:</strong> {currentStageData.location}</p>
                <p><strong className="text-slate-400">Authenticated Actor:</strong> {currentStageData.actor}</p>
              </div>

              <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed pt-1">
                <strong>Cryptographic Evidence Log:</strong> {currentStageData.evidence}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3 shrink-0 w-full md:w-64">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {currentStageData.icon}
              </div>
              <p className="text-xs font-bold text-white">
                Recorded on Ledger Block #{activeStage + 1}
              </p>
              <button
                onClick={onOpenProvenanceGraph}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                View in Provenance Graph
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. THE 5-LEVEL "TRUST STACK" PYRAMID (Requirement 42) */}
      <section className="px-6 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Multi-Layer Trust Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            The Honey Chain Trust Stack
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Blockchain alone cannot guarantee that honey is pure. We construct an unbroken hierarchy of physical, chemical, and digital evidence.
          </p>
        </div>

        {/* 5-Level Pyramid Visual */}
        <div className="space-y-3 max-w-3xl mx-auto">
          
          {/* Level 5: Consumer Access */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-slate-900 to-emerald-500/20 border-2 border-emerald-400 flex items-center justify-between shadow-lg shadow-emerald-500/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                L5
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">LEVEL 5 • CONSUMER ACCESS</span>
                <h4 className="font-extrabold text-sm sm:text-base text-white">Smartphone QR Verification & Holographic Tamper Seals</h4>
                <p className="text-xs text-slate-400">Zero-login public consumer portal with spatiotemporal anti-cloning sentinel.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
              QR / NFC
            </span>
          </div>

          {/* Level 4: Digital Evidence */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-slate-900 to-indigo-500/20 border-2 border-indigo-400 flex items-center justify-between shadow-lg shadow-indigo-500/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                L4
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400">LEVEL 4 • DIGITAL EVIDENCE</span>
                <h4 className="font-extrabold text-sm sm:text-base text-white">Hyperledger Fabric SHA-256 Append-Only Consortium Ledger</h4>
                <p className="text-xs text-slate-400">Tamper-evident hash chaining with Proof-of-Authority validator quorum.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300">
              BLOCKCHAIN
            </span>
          </div>

          {/* Level 3: Intelligence */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-500/20 via-slate-900 to-purple-500/20 border-2 border-purple-400 flex items-center justify-between shadow-lg shadow-purple-500/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                L3
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400">LEVEL 3 • INTELLIGENCE</span>
                <h4 className="font-extrabold text-sm sm:text-base text-white">AI Colony Health, Yield Forecasting & Anomaly Scoring</h4>
                <p className="text-xs text-slate-400">Explainable SHAP factor attribution and bio-acoustic FFT spectrogram analysis.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300">
              AI ENGINE
            </span>
          </div>

          {/* Level 2: Scientific Evidence */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-slate-900 to-cyan-500/20 border-2 border-cyan-400 flex items-center justify-between shadow-lg shadow-cyan-500/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                L2
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">LEVEL 2 • SCIENTIFIC EVIDENCE</span>
                <h4 className="font-extrabold text-sm sm:text-base text-white">ISO/IEC 17025 EA-IRMS Isotope Mass Spectrometry</h4>
                <p className="text-xs text-slate-400">δ13C carbon isotope detection, HMF thermal degradation, and diastase enzyme activity.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300">
              LAB TEST
            </span>
          </div>

          {/* Level 1: Physical Evidence */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border-2 border-amber-400 flex items-center justify-between shadow-lg shadow-amber-500/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                L1
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">LEVEL 1 • PHYSICAL EVIDENCE</span>
                <h4 className="font-extrabold text-sm sm:text-base text-white">IoT Smart Hive Micro-Sensors & Calibrated Tare Scales</h4>
                <p className="text-xs text-slate-400">Real-time internal hive temperature, brood humidity, queen acoustic vibrations & weight.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">
              PHYSICAL IOT
            </span>
          </div>

        </div>
      </section>

      {/* 5. "WHY HONEY CHAIN?" BEFORE VS AFTER (Requirement 43) */}
      <section className="px-6 py-20 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Ecosystem Transformation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Why Honey Chain?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Addressing systemic structural weaknesses in rural beekeeping through auditable digital infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BEFORE */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                  BEFORE HONEY CHAIN (STATUS QUO)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                  Fragile Ecosystem
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Fragmented paper records:</strong> High vulnerability to counterfeit syrup dilution in transit.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Unknown origin:</strong> Blended commodity honey with zero traceability back to rural beekeepers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Manual monitoring:</strong> Beekeepers discover colony collapse or queen loss weeks too late.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Weak bargaining power:</strong> Intermediaries pay as little as ₹120/kg while retail sells for ₹800/kg.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Opaque supply chain:</strong> Institutional buyers cannot verify authentic floral source or harvest date.</span>
                </li>
              </ul>
            </div>

            {/* AFTER */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-emerald-500/40 space-y-4 shadow-xl shadow-emerald-500/10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  AFTER HONEY CHAIN (DEPLOYABLE FUTURE)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Verified Trust Stack
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Digital Hive Identity:</strong> Every bee box, harvest tare, and lot has an immutable cryptographic hash.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Traceable Batch Genealogy:</strong> Full parent-child tracking when bulk lots split into individual retail jars.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>AI-Assisted Early Warning:</strong> Continuous 240Hz acoustic FFT analysis detects stress before collapse.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Fair Producer Wallet:</strong> 45% direct fair-trade value guarantee + 5% ongoing resale royalties.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Auditable Provenance:</strong> NABL ISO-17025 lab tests verifiable by any consumer via smartphone QR.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Footer Call To Action */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Ready to Witness the Complete 14-Step Presentation?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Experience the guided demonstration designed for hackathon evaluators, KVIC directors, and agricultural technologists.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onEnterDemo}
            className="flex items-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-4 text-sm sm:text-base shadow-xl shadow-amber-500/30 transition cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Launch Interactive Judge Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
