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
  onEnterApp?: () => void;
  onEnterDemo?: () => void;
  onSelectRole?: (role: string) => void;
  onOpenScanner?: () => void;
  onOpenProvenanceGraph?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
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
    <div className="min-h-screen bg-[#faf8ff] text-[#1e1035] overflow-hidden select-none honeycomb-pattern">
      
      {/* 1. Top Hackathon Bar with Purple & Yellow Accent */}
      <div className="relative bg-purple-100/90 border-b border-purple-200 px-4 py-2 text-center text-xs font-black text-purple-950 tracking-wider flex items-center justify-center gap-2 shadow-xs overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bumble-stripes-slim" />
        <span className="relative z-10 flex items-center gap-2">
          <span>🐝</span>
          <span>🏆 SMART INDIA HACKATHON 2026 — KVIC HONEY MISSION DIGITAL PLATFORM</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-amber-600 font-extrabold">ROYAL HIVE PURPLE & GOLD EDITION</span>
        </span>
      </div>

      {/* 2. Hero Section */}
      <section className="relative px-6 pt-16 pb-24 max-w-7xl mx-auto text-center">
        
        {/* Floating Bumblebee Ambient Drone Indicator */}
        <div className="absolute top-12 right-6 hidden xl:flex items-center gap-2.5 p-3 rounded-2xl bg-white/95 border border-purple-200 shadow-xl shadow-purple-900/10 animate-bee-hover select-none">
          <span className="text-3xl select-none">🐝</span>
          <div className="text-left">
            <span className="block text-[11px] font-black text-purple-950">Royal Bumblebee Sentinel</span>
            <span className="text-[9px] text-purple-700/80 font-mono">240 Hz Lavender Resonance</span>
          </div>
        </div>

        {/* Glowing Royal Purple & Yellow Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] bg-gradient-to-tr from-purple-200/40 via-yellow-200/35 to-transparent blur-[130px] rounded-full pointer-events-none" />

        {/* Hero Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100/80 px-4 py-1.5 text-xs font-bold text-purple-900 mb-6 shadow-xs">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>From Hive to Home — Every Drop Has a Digital Identity</span>
        </div>

        {/* Grand Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-purple-950 max-w-5xl mx-auto leading-none">
          HONEY<span className="text-amber-500 drop-shadow-[0_0_24px_rgba(245,158,11,0.35)]">CHAIN</span>
        </h1>
        <p className="mt-4 text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-800 via-purple-900 to-amber-600 bg-clip-text text-transparent">
          "AI-Powered Smart Beekeeping. IoT-Driven Hive Intelligence. Blockchain-Backed Provenance."
        </p>

        {/* Mission Statement */}
        <p className="mt-6 max-w-3xl mx-auto text-sm sm:text-base text-purple-900/80 leading-relaxed font-medium">
          Supporting the KVIC Honey Mission by unifying rural beekeeping hardware, bio-acoustic disease prediction, ISO/IEC 17025 isotopic testing, tamper-evident SHA-256 blockchain provenance, and consumer trust into one continuous digital identity.
        </p>

        {/* Primary Action Buttons (Hero CTA) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => onEnterApp ? onEnterApp() : onEnterDemo?.()}
            className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 px-8 py-4 text-base font-black text-purple-950 hover:from-yellow-300 hover:to-amber-400 transition-all shadow-xl shadow-yellow-500/30 hover:scale-105 active:scale-95 cursor-pointer border-2 border-yellow-200"
          >
            <Sparkles className="h-5 w-5 text-purple-950" />
            <span>Enter HoneyChain Platform</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={onEnterDemo}
            className="flex items-center gap-2.5 rounded-2xl border-2 border-purple-300 bg-white px-6 py-4 text-sm sm:text-base font-bold text-purple-900 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-md shadow-purple-900/5 hover:scale-102 active:scale-98 cursor-pointer"
          >
            <span>🎬 3-Min Judge Demo</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2.5 rounded-2xl border-2 border-purple-200 bg-purple-50/80 px-6 py-4 text-sm sm:text-base font-bold text-purple-900 hover:bg-purple-100 transition-all shadow-md shadow-purple-900/5 hover:scale-102 active:scale-98 cursor-pointer"
          >
            <Scan className="h-5 w-5 text-yellow-600" />
            <span>Scan a Honey Jar</span>
          </button>

          <button
            onClick={onOpenProvenanceGraph}
            className="flex items-center gap-2 rounded-2xl border border-purple-200 bg-white px-6 py-4 text-sm sm:text-base font-bold text-purple-900 hover:bg-purple-50 transition cursor-pointer"
          >
            <GitBranch className="h-5 w-5 text-purple-700" />
            <span>Provenance Graph</span>
          </button>
        </div>

        {/* 3 Core Messages */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto text-left">
          <div className="p-5 rounded-2xl bg-white border-2 border-purple-100 bumble-border-top hover:border-yellow-400/70 shadow-lg shadow-purple-900/5 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block mb-1">
              PILLAR 01 • IOT BIO-ACOUSTICS
            </span>
            <h4 className="font-extrabold text-base text-purple-950">
              We See Inside the Hive.
            </h4>
            <p className="text-xs text-purple-800/80 mt-1">
              Non-invasive 240Hz FFT acoustic frequency analysis & temperature equilibrium sensing detects colony distress days before inspection.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-purple-100 bumble-border-top hover:border-yellow-400/70 shadow-lg shadow-purple-900/5 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block mb-1">
              PILLAR 02 • CRYPTOGRAPHIC PROVENANCE
            </span>
            <h4 className="font-extrabold text-base text-purple-950">
              We Trace What Happened to the Honey.
            </h4>
            <p className="text-xs text-purple-800/80 mt-1">
              From calibrated tare harvest scales to ISO/IEC 17025 EA-IRMS carbon isotope testing (δ13C -26.8‰), anchored immutably to Hyperledger Fabric.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-purple-100 bumble-border-top hover:border-yellow-400/70 shadow-lg shadow-purple-900/5 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block mb-1">
              PILLAR 03 • CONSUMER VERIFICATION
            </span>
            <h4 className="font-extrabold text-base text-purple-950">
              The Consumer Verifies the Story.
            </h4>
            <p className="text-xs text-purple-800/80 mt-1">
              Instant smartphone QR scan reveals full floral origins, meets the tribal beekeeper, and detects counterfeit QR cloning anomalies in real time.
            </p>
          </div>
        </div>

      </section>

      {/* 3. "ONE BATCH — COMPLETE STORY" Interactive Stage Viewer */}
      <section className="px-6 py-20 bg-purple-50/50 border-y border-purple-100">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200 shadow-xs">
              Interactive Batch Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-purple-950">
              One Batch — Complete Story
            </h2>
            <p className="text-xs sm:text-sm text-purple-800/75 max-w-xl mx-auto">
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
                    ? 'bg-yellow-400 text-purple-950 border-yellow-300 shadow-md shadow-yellow-500/25 scale-105 font-black'
                    : 'bg-white text-purple-900/80 border-purple-200 hover:border-purple-400 hover:text-purple-950 shadow-xs'
                }`}
              >
                {s.icon}
                <span>{s.stage}</span>
              </button>
            ))}
          </div>

          {/* Active Stage Data Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-purple-200 bumble-border-top shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fadeIn">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-yellow-400 text-purple-950 shadow-xs">
                  STAGE {activeStage + 1} OF 10 • {currentStageData.tag}
                </span>
                <span className="text-xs text-purple-600 font-mono font-bold">
                  Batch: HNY-TG-2026-0001
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-purple-950">
                {currentStageData.title}
              </h3>

              <div className="space-y-1 text-xs text-purple-900 font-medium">
                <p><strong className="text-purple-950">Location:</strong> {currentStageData.location}</p>
                <p><strong className="text-purple-950">Authenticated Actor:</strong> {currentStageData.actor}</p>
              </div>

              <div className="text-xs sm:text-sm text-purple-950 leading-relaxed pt-1 bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
                <strong className="text-amber-700">Cryptographic Evidence Log:</strong> {currentStageData.evidence}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 text-center space-y-3 shrink-0 w-full md:w-64 shadow-xs">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 border border-purple-200 shadow-xs">
                {currentStageData.icon}
              </div>
              <p className="text-xs font-bold text-purple-950">
                Recorded on Ledger Block #{activeStage + 1}
              </p>
              <button
                onClick={onOpenProvenanceGraph}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-purple-950 font-black text-xs shadow-md transition cursor-pointer border border-yellow-300"
              >
                View in Provenance Graph
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. THE 5-LEVEL "TRUST STACK" PYRAMID */}
      <section className="px-6 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200 shadow-xs">
            Multi-Layer Trust Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-purple-950">
            The Honey Chain Trust Stack
          </h2>
          <p className="text-xs sm:text-sm text-purple-800/75 max-w-xl mx-auto">
            Blockchain alone cannot guarantee that honey is pure. We construct an unbroken hierarchy of physical, chemical, and digital evidence.
          </p>
        </div>

        {/* 5-Level Pyramid Visual */}
        <div className="space-y-3 max-w-3xl mx-auto">
          
          {/* Level 5: Consumer Access */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-emerald-300/80 flex items-center justify-between shadow-md shadow-emerald-500/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                L5
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-emerald-700">LEVEL 5 • CONSUMER ACCESS</span>
                <h4 className="font-extrabold text-sm sm:text-base text-purple-950">Smartphone QR Verification & Holographic Tamper Seals</h4>
                <p className="text-xs text-purple-800/75">Zero-login public consumer portal with spatiotemporal anti-cloning sentinel.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              QR / NFC
            </span>
          </div>

          {/* Level 4: Digital Evidence */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-purple-300 flex items-center justify-between shadow-md shadow-purple-500/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                L4
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-purple-800">LEVEL 4 • DIGITAL EVIDENCE</span>
                <h4 className="font-extrabold text-sm sm:text-base text-purple-950">Hyperledger Fabric SHA-256 Append-Only Consortium Ledger</h4>
                <p className="text-xs text-purple-800/75">Tamper-evident hash chaining with Proof-of-Authority validator quorum.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
              BLOCKCHAIN
            </span>
          </div>

          {/* Level 3: Intelligence */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-purple-400/80 flex items-center justify-between shadow-md shadow-purple-500/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                L3
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-purple-800">LEVEL 3 • INTELLIGENCE</span>
                <h4 className="font-extrabold text-sm sm:text-base text-purple-950">AI Colony Health, Yield Forecasting & Anomaly Scoring</h4>
                <p className="text-xs text-purple-800/75">Explainable SHAP factor attribution and bio-acoustic FFT spectrogram analysis.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
              AI ENGINE
            </span>
          </div>

          {/* Level 2: Scientific Evidence */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-cyan-300 flex items-center justify-between shadow-md shadow-cyan-500/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                L2
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-cyan-800">LEVEL 2 • SCIENTIFIC EVIDENCE</span>
                <h4 className="font-extrabold text-sm sm:text-base text-purple-950">ISO/IEC 17025 EA-IRMS Isotope Mass Spectrometry</h4>
                <p className="text-xs text-purple-800/75">δ13C carbon isotope detection, HMF thermal degradation, and diastase enzyme activity.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
              LAB TEST
            </span>
          </div>

          {/* Level 1: Physical Evidence */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-yellow-400 flex items-center justify-between shadow-md shadow-yellow-500/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-purple-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                L1
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-amber-800">LEVEL 1 • PHYSICAL EVIDENCE</span>
                <h4 className="font-extrabold text-sm sm:text-base text-purple-950">IoT Smart Hive Micro-Sensors & Calibrated Tare Scales</h4>
                <p className="text-xs text-purple-800/75">Real-time internal hive temperature, brood humidity, queen acoustic vibrations & weight.</p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-amber-900 border border-yellow-300">
              PHYSICAL IOT
            </span>
          </div>

        </div>
      </section>

      {/* 5. "WHY HONEY CHAIN?" BEFORE VS AFTER */}
      <section className="px-6 py-20 bg-purple-50/50 border-y border-purple-100">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200 shadow-xs">
              Ecosystem Transformation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-purple-950">
              Why Honey Chain?
            </h2>
            <p className="text-xs sm:text-sm text-purple-800/75 max-w-xl mx-auto">
              Addressing systemic structural weaknesses in rural beekeeping through auditable digital infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BEFORE */}
            <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/80 border-2 border-rose-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-rose-200">
                <span className="text-xs font-black uppercase tracking-wider text-rose-700">
                  BEFORE HONEY CHAIN (STATUS QUO)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                  Fragile Ecosystem
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-rose-950">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>Fragmented paper records:</strong> High vulnerability to counterfeit syrup dilution in transit.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>Unknown origin:</strong> Blended commodity honey with zero traceability back to rural beekeepers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>Manual monitoring:</strong> Beekeepers discover colony collapse or queen loss weeks too late.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>Weak bargaining power:</strong> Intermediaries pay as little as ₹120/kg while retail sells for ₹800/kg.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>Opaque supply chain:</strong> Institutional buyers cannot verify authentic floral source or harvest date.</span>
                </li>
              </ul>
            </div>

            {/* AFTER */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-purple-200 bumble-border-top space-y-4 shadow-xl shadow-purple-900/5 hover:border-yellow-400/80 transition">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <span className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                  <span>🐝</span> AFTER HONEY CHAIN (DEPLOYABLE FUTURE)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-100 text-amber-900 font-black border border-yellow-300">
                  Verified Trust Stack
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-purple-950 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Digital Hive Identity:</strong> Every bee box, harvest tare, and lot has an immutable cryptographic hash.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Traceable Batch Genealogy:</strong> Full parent-child tracking when bulk lots split into individual retail jars.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>AI-Assisted Early Warning:</strong> Continuous 240Hz acoustic FFT analysis detects stress before collapse.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Fair Producer Wallet:</strong> 45% direct fair-trade value guarantee + 5% ongoing resale royalties.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Auditable Provenance:</strong> NABL ISO-17025 lab tests verifiable by any consumer via smartphone QR.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Footer Call To Action */}
      <section className="px-6 py-20 max-w-5xl mx-auto text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-purple-200 bumble-border-top shadow-xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-purple-950">
            Ready to Experience the HoneyChain Ecosystem?
          </h2>
          <p className="text-xs sm:text-base text-purple-800/80 max-w-2xl mx-auto leading-relaxed">
            Experience the complete end-to-end guided demonstration tailored for evaluators, KVIC directors, beekeepers, and food integrity auditors.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onEnterDemo}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black px-8 py-4 text-sm sm:text-base shadow-lg shadow-yellow-500/25 hover:scale-104 active:scale-96 transition cursor-pointer border-2 border-yellow-200"
            >
              <Sparkles className="w-5 h-5 text-purple-950" />
              <span>Launch Guided Judge Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenScanner}
              className="flex items-center gap-2 rounded-2xl border-2 border-purple-300 bg-purple-50 hover:bg-purple-600 hover:text-white hover:border-purple-600 px-6 py-4 text-sm sm:text-base font-bold text-purple-900 transition cursor-pointer shadow-sm"
            >
              <Scan className="w-5 h-5 text-amber-500" />
              <span>Consumer QR Scanner</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
