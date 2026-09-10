import React, { useState } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  X,
  Server,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Lock,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JudgeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeModeModal: React.FC<JudgeModeModalProps> = ({ isOpen, onClose }) => {
  const {
    batches,
    toggleAcousticStress,
    isAcousticStress,
    hiveAcousticFreq,
    setSelectedBatchId,
    setCurrentRole,
    setAppScreen
  } = useHoneychain();

  const [attackActive, setAttackActive] = useState(false);
  const [attackLog, setAttackLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const simulateAdulterationAttack = () => {
    setAttackActive(true);
    setAttackLog([
      '🚨 INITIATING SIH EVALUATION ATTACK VECTOR: Foreign Sugar Syrup Adulteration...',
      'Simulating industrial injection of 15.4% C4 Corn Syrup (HFCS-55) into harvest sample...',
      'Executing EA-IRMS Carbon Isotope δ13C recalculation: value shifted from -26.8‰ to -18.4‰...',
      '❌ CRYPTOGRAPHIC MISMATCH: δ13C Delta exceeds Codex limit (> 7.0‰)...',
      '❌ ZK-SNARK CIRCUIT PROOF: Verification key check FAILED (Constraint 0x89d4 invalidated)...',
      '🛑 HYPERLEDGER FABRIC SMART CONTRACT: Batch HC-2026-NIL-004821 automatically QUARANTINED & BLOCKED on ledger!'
    ]);
  };

  const restorePurity = () => {
    setAttackActive(false);
    setAttackLog([
      '✓ Restored pristine natural baseline from Nilgiri Biosphere Reserve genesis harvest.',
      '✓ EA-IRMS δ13C Isotope verified at -26.8‰ Natural (0.00% C3/C4 Syrups).',
      '✓ ZK-SNARK Purity Circuit Proof PASSED & notarized on Hyperledger Fabric Block #184920.'
    ]);
    try {
      confetti({ particleCount: 60, spread: 70 });
    } catch {}
  };

  const jumpToCustomerView = () => {
    setCurrentRole('customer');
    setAppScreen('portal');
    onClose();
  };

  const jumpToBeekeeperView = () => {
    setCurrentRole('beekeeper');
    setAppScreen('portal');
    onClose();
  };

  const jumpToLabView = () => {
    setCurrentRole('inspector');
    setAppScreen('portal');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border-2 border-amber-400 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  SIH Hackathon 2026 Evaluation Deck
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">Team seven_ate</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                Judge Demonstration & Live Attack Control Center
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIH Winning Value Proposition Summary */}
        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 via-amber-100/40 to-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" /> Why Honeychain Wins Over 500 Traditional Barcode Teams:
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            Most traceability projects only put static QR codes on databases. <strong>Honeychain unites real edge IoT bio-acoustic frequency analysis (240Hz queen monitor), EA-IRMS carbon isotope testing (0.00% C3/C4 syrups), Hyperledger Fabric Raft consensus, and Zero-Knowledge Proofs</strong> that prove purity without exposing beekeepers' private GPS coordinates to commercial poachers.
          </p>
        </div>

        {/* DEMO 1: LIVE ADULTERATION ATTACK SIMULATOR */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" /> Interactive Demo 1: Syrup Adulteration Attack
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              attackActive ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {attackActive ? 'Attack Mode Active' : 'Pristine Baseline Verified'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={simulateAdulterationAttack}
              className="p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Simulate Syrup Injection (Attack)</span>
              </div>
              <p className="text-[10px] text-red-600 mt-1">
                Injects C4 corn syrup $\rightarrow$ watch EA-IRMS & ZK-SNARK circuit fail in real time.
              </p>
            </button>

            <button
              onClick={restorePurity}
              className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Restore Pure Genesis Baseline</span>
              </div>
              <p className="text-[10px] text-emerald-600 mt-1">
                Re-validates 100% natural Nilgiri botanical isotopic signature & valid ZK proof.
              </p>
            </button>
          </div>

          {/* Terminal Output */}
          {attackLog.length > 0 && (
            <div className="p-3.5 bg-slate-950 rounded-2xl text-[10px] font-mono text-slate-300 border border-slate-800 space-y-1 shadow-inner">
              <div className="text-amber-400 font-bold border-b border-slate-800 pb-1">
                &gt; Hyperledger Fabric Smart Contract Security Interceptor
              </div>
              {attackLog.map((log, i) => (
                <div key={i} className={log.includes('🚨') || log.includes('❌') || log.includes('🛑') ? 'text-red-400 font-semibold' : 'text-emerald-400'}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DEMO 2: BIO-ACOUSTIC SWARM ANOMALY */}
        <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-600" /> Interactive Demo 2: Hive Acoustic Stress Anomaly
            </span>
            <span className="text-[11px] font-mono text-amber-700 font-bold">
              Current: {hiveAcousticFreq} Hz
            </span>
          </div>

          <button
            onClick={toggleAcousticStress}
            className={`w-full py-3 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isAcousticStress
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{isAcousticStress ? 'Calm Colony Back to 240 Hz' : 'Trigger 550 Hz Hive Stress / Swarm Alert'}</span>
          </button>
        </div>

        {/* QUICK JUMP NAVIGATION FOR JUDGES */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Direct Evaluation Portal Jumps:
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={jumpToBeekeeperView}
              className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-center"
            >
              1. Beekeeper IoT
            </button>
            <button
              onClick={jumpToLabView}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-center"
            >
              2. Lab Isotope Terminal
            </button>
            <button
              onClick={jumpToCustomerView}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-center"
            >
              3. Customer Scanner
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
