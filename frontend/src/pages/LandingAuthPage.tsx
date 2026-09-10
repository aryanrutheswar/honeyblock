import React from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import {
  Fingerprint,
  Camera,
  Shield,
  ShieldCheck,
  Radio,
  FlaskConical,
  Sparkles,
  ArrowRight,
  Hexagon,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';

export const LandingAuthPage: React.FC = () => {
  const { openBiometricModal, setCurrentRole } = useHoneychain();

  return (
    <div className="min-h-full bg-white text-slate-900 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Subtle Decorative Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-200/40 via-yellow-100/30 to-amber-300/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>FSSAI & Codex Alimentarius Cryptographic Verification Standard</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight sm:leading-none">
          Cryptographic Provenance for <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-clip-text text-transparent">
            100% Pure, Unadulterated Honey
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal">
          From high-altitude Nilgiri biosphere hives to your table. Powered by IoT bio-acoustic sensors, 
          EA-IRMS isotope testing, Hyperledger Fabric immutable ledger, and Zero-Knowledge Proofs.
        </p>

        {/* Global Security Metrics Banner */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-white border border-amber-100 rounded-3xl p-4 shadow-sm text-center">
            <div className="text-2xl font-black text-amber-600">0.00%</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">C4/C3 Syrup Adulteration</div>
          </div>
          <div className="bg-white border border-amber-100 rounded-3xl p-4 shadow-sm text-center">
            <div className="text-2xl font-black text-slate-900">240 Hz</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">IoT Queen Calm Frequency</div>
          </div>
          <div className="bg-white border border-amber-100 rounded-3xl p-4 shadow-sm text-center">
            <div className="text-2xl font-black text-amber-600">8.2 mg/kg</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">HMF Raw Freshness Score</div>
          </div>
          <div className="bg-white border border-amber-100 rounded-3xl p-4 shadow-sm text-center">
            <div className="text-2xl font-black text-slate-900">ZK-SNARK</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Zero-Knowledge Privacy</div>
          </div>
        </div>
      </section>

      {/* 3 SECURE LOGIN PORTALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Select Your Access Portal
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Strict role-based isolation with biometric cryptographic authorization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* PORTAL 1: BEEKEEPER PORTAL */}
          <div className="group relative bg-white border-2 border-amber-100 hover:border-amber-400 rounded-3xl p-7 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Badge */}
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  <Radio className="w-3.5 h-3.5 text-amber-600" /> Portal 1
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                  <Lock className="w-3.5 h-3.5" /> Biometric Secured
                </span>
              </div>

              {/* Icon & Title */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-500/30 mb-5">
                <Radio className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900">Beekeeper Portal</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Access real-time IoT hive health metrics (34.8°C temp, 42.5kg weight, 240Hz bio-acoustics), 
                test acoustic stress responses, and mint new harvest batch tokens onto Hyperledger Fabric.
              </p>

              {/* Key Features List */}
              <ul className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Real-time IoT Telemetry (Temp, Weight, Sound)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Interactive 550Hz Bio-Acoustic Stress Alarm</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Direct Hyperledger Fabric Harvest Token Minting</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => openBiometricModal('beekeeper')}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <Fingerprint className="w-5 h-5" />
                <span>Biometric Scan to Login</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                Simulates FIDO2 hardware challenge
              </p>
            </div>
          </div>

          {/* PORTAL 2: LAB INSPECTOR PORTAL */}
          <div className="group relative bg-white border-2 border-amber-100 hover:border-amber-400 rounded-3xl p-7 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Badge */}
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-600" /> Portal 2
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                  <Lock className="w-3.5 h-3.5" /> Biometric Secured
                </span>
              </div>

              {/* Icon & Title */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-amber-400 flex items-center justify-center shadow-md shadow-slate-900/20 mb-5">
                <FlaskConical className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900">Lab Inspector Portal</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Dedicated certification terminal for EA-IRMS isotopic sugar adulteration tests (C3/C4 0.00%), 
                HMF freshness scoring (8.2 mg/kg PASS), and live SHA-256 cryptographic notarization.
              </p>

              {/* Key Features List */}
              <ul className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>C4/C3 Sugar Adulteration (δ13C: -26.8‰)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>HMF Freshness & Enzyme Thermal Profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Live Web Crypto SHA-256 Digest Locking</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => openBiometricModal('inspector')}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md shadow-slate-900/20 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <Fingerprint className="w-5 h-5 text-amber-400" />
                <span>Biometric Scan to Login</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                ISO/IEC 17025 certified laboratory signature
              </p>
            </div>
          </div>

          {/* PORTAL 3: CUSTOMER SCANNER PORTAL */}
          <div className="group relative bg-gradient-to-b from-white to-amber-50/60 border-2 border-amber-300 hover:border-amber-500 rounded-3xl p-7 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ring-2 ring-amber-400/20">
            <div>
              {/* Badge */}
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Portal 3
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Public Instant Access
                </span>
              </div>

              {/* Icon & Title */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-600/30 mb-5">
                <Camera className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900">Customer Scanner</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Scan your honey jar using a live camera feed inside an interactive smartphone container. 
                Instantly unlocks the Zero-Knowledge Proof Passport verifying purity and Nilgiri Reserve origin.
              </p>

              {/* Key Features List */}
              <ul className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live Working WebRTC Camera Feed Mockup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nilgiri Biosphere Reserve Origin Story</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero-Knowledge Proof (No supplier leaks)</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t border-amber-200/80">
              <button
                onClick={() => setCurrentRole('customer')}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/30 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>Launch Live Camera Scanner</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
                Instant access • No login required
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Architecture Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/40 to-amber-50 border border-amber-200 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Bio-Acoustic IoT Gateways</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Real-time 240Hz sound spectrum monitors queen bee calmness and hive stress directly at the Nilgiri apiary.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Hyperledger Fabric Ledger</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Decentralized permissioned blockchain records immutable SHA-256 test hashes with cryptographic consensus.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Zero-Knowledge Proofs</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Verify 100% purity and unbroken chain-of-custody without exposing proprietary beekeeper supply coordinates.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
