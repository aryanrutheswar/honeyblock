import React, { useEffect } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import { soundManager } from '../utils/audio';
import { stopAllCameraHardware } from '../utils/mediaManager';
import {
  Radio,
  FlaskConical,
  Camera,
  Fingerprint,
  Lock,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  UserCheck,
  Eye,
  Trees
} from 'lucide-react';

export const RoleSelectionScreen: React.FC = () => {
  const { selectRole, setAppScreen } = useHoneychain();

  // Force stop any lingering camera streams as soon as role selection is visible
  useEffect(() => {
    stopAllCameraHardware();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Back button & Header */}
      <div className="flex items-center justify-between gap-4 relative z-30">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setAppScreen('intro');
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-400 px-4 py-2 rounded-2xl shadow-md transition-all cursor-pointer active:scale-95 w-fit z-30"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" />
          <span>Back to App Welcome</span>
        </button>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Who Are You?
        </h1>
        <p className="text-sm text-slate-600">
          Select your verified identity to enter your isolated platform workspace
        </p>
      </div>

      {/* 3 Identity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        
        {/* IDENTITY 1: BEEKEEPER */}
        <div className="group relative bg-white border-2 border-amber-100 hover:border-amber-400 rounded-3xl p-7 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                <Radio className="w-3.5 h-3.5 text-amber-600" /> Apiary Workspace
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                <Lock className="w-3.5 h-3.5" /> Biometric Token
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-500/30 mb-5">
              <Radio className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">I am a Beekeeper</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Monitor your Nilgiri apiary smart hives in real time (34.8°C temp, 42.5kg scale weight, 240Hz queen acoustic frequency) and mint harvest tokens directly onto Hyperledger Fabric.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Real-time IoT Brood Telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Bio-Acoustic Health & Stress Test</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Hyperledger Fabric Harvest Minting</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => selectRole('beekeeper')}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all active:scale-98 cursor-pointer"
            >
              <Fingerprint className="w-5 h-5" />
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
              FIDO2 Biometric authorization required
            </p>
          </div>
        </div>

        {/* IDENTITY 2: LAB INSPECTOR */}
        <div className="group relative bg-white border-2 border-amber-100 hover:border-amber-400 rounded-3xl p-7 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" /> ISO/IEC 17025
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                <KeyRound className="w-3.5 h-3.5 text-indigo-500" /> Password Protected
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-purple-900 text-yellow-300 flex items-center justify-center shadow-md shadow-purple-900/20 mb-5">
              <FlaskConical className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">I am a Lab Inspector</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Verify pending honey batches using EA-IRMS carbon isotope mass spectrometry (C3/C4 syrups 0.00%), HMF thermal freshness tests (8.2 mg/kg), and lock SHA-256 notary certificates on-chain.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>C4/C3 Sugar Isotope Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>HMF Freshness & Enzyme Assay</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>ISO-17025 Certified Reporting</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => selectRole('inspector')}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-purple-900 hover:bg-purple-950 text-yellow-300 font-bold text-sm shadow-md shadow-purple-900/20 transition-all active:scale-98 cursor-pointer hover:scale-102"
            >
              <KeyRound className="w-5 h-5 text-yellow-300" />
              <span>Authenticate with Password</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
              Authorized lab personnel access only
            </p>
          </div>
        </div>

        {/* IDENTITY 3: CUSTOMER */}
        <div className="group relative bg-gradient-to-b from-white to-amber-50/60 border-2 border-amber-300 hover:border-amber-500 rounded-3xl p-7 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ring-2 ring-amber-400/20">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Camera className="w-3.5 h-3.5 text-emerald-600" /> Public Scanner
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Instant Access
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-600/30 mb-5">
              <Camera className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">I am a Customer</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Scan your honey jar using the live camera scanner to discover where your honey came from in the Nilgiri forest, what natural nutrients you are consuming, and verified lab test reports.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live Working Camera Scanner</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nilgiri Forest Origin Story</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Active Enzymes, Nutrition & Lab Report</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-amber-200/80">
            <button
              onClick={() => selectRole('customer')}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/30 transition-all active:scale-98 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Launch Customer Scanner</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
              Instant access • No login credentials required
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
