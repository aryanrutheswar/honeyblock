import React, { useState } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  Server,
  RefreshCw,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Database,
  Info
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { resetHiveHealth } = useHoneychain();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [peerNode, setPeerNode] = useState('Nilgiri-Gateway-Peer-01');
  const [resetting, setResetting] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setResetting(true);
    resetHiveHealth();
    setTimeout(() => {
      setResetting(false);
      alert('HoneyChain network state synchronized with Nilgiri Enterprise Genesis Ledger.');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-amber-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Platform Settings</h3>
              <p className="text-xs text-slate-500">Node preferences & network telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="py-4 space-y-4 text-xs">
          
          {/* Audio Synthesizer Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <div className="font-bold text-slate-900">Bio-Acoustic Synthesizer Audio</div>
                <div className="text-[11px] text-slate-500">240Hz / 550Hz Web Audio API tone synthesis</div>
              </div>
            </div>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                audioEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {audioEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Active Blockchain Peer Node */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-amber-600" /> Active Fabric Endorsing Peer
              </span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 12ms Latency
              </span>
            </div>
            <select
              value={peerNode}
              onChange={e => setPeerNode(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-900 outline-none"
            >
              <option value="Nilgiri-Gateway-Peer-01">Nilgiri-Gateway-Peer-01 (Apiary IoT)</option>
              <option value="FSSAI-Lab-Validator-02">FSSAI-Lab-Validator-02 (Mass Spec Lab)</option>
              <option value="Regulator-Audit-Peer-03">Regulator-Audit-Peer-03 (National Registry)</option>
              <option value="Consumer-Gateway-04">Consumer-Gateway-04 (Zero-Knowledge EVM)</option>
            </select>
          </div>

          {/* Ledger Architecture Info */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Cryptographic Spec
            </div>
            <div className="text-[11px] text-slate-700 space-y-0.5">
              <div>Consensus: <strong>Raft Crash Fault Tolerant (CFT)</strong></div>
              <div>Digest Algorithm: <strong>SHA-256 Web Crypto API</strong></div>
              <div>ZK-SNARK Prover: <strong>Groth16 on BN254 Curve</strong></div>
            </div>
          </div>

          {/* Reset Baseline Action */}
          <div className="pt-2">
            <button
              onClick={handleReset}
              disabled={resetting}
              className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin text-amber-600' : ''}`} />
              <span>{resetting ? 'Synchronizing Genesis State...' : 'Sync with Genesis Ledger Baseline'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
