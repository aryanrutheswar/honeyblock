import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  MapPin,
  Clock,
  AlertOctagon,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface QrCounterfeitDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId?: string;
}

export const QrCounterfeitDetectorModal: React.FC<QrCounterfeitDetectorModalProps> = ({
  isOpen,
  onClose,
  batchId = 'HNY-TG-2026-0001'
}) => {
  const [anomalyActive, setAnomalyActive] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  QR Replication & Counterfeit Clone Detection Sentinel
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {batchId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Spatiotemporal scan velocity analysis detecting impossible physical transport speeds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Anomaly Detection Banner */}
          {anomalyActive ? (
            <div className="p-5 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="w-6 h-6 text-rose-400 animate-pulse" />
                  <h3 className="text-base font-extrabold text-white">
                    ⚠ POSSIBLE QR REPLICATION DETECTED
                  </h3>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-500 text-white">
                  FRAUD RISK SCORE: 88%
                </span>
              </div>

              <p className="text-xs text-rose-200 leading-relaxed">
                <strong>Spatiotemporal Velocity Violation:</strong> Identical QR cryptographic token scanned from two distinct IP addresses and GPS geofences separated by 1,450 km within an impossible 15-minute timeframe.
              </p>

              <div className="flex items-center gap-2 text-[11px] text-rose-300 font-mono">
                <span>Expected Speed: &gt; 5,800 km/h (Physically Impossible)</span>
                <span>•</span>
                <span>Status: Flagged for Physical Forensic Inspection</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Normal Spatiotemporal Scan Velocity • Zero Replica Signals Detected
              </span>
              <button
                onClick={() => setAnomalyActive(true)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-bold hover:bg-slate-700"
              >
                Re-Inject Anomaly Demo
              </button>
            </div>
          )}

          {/* Simulated Multi-Location Scan Timeline */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Simulated Chronological Scan Telemetry
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Scan 1 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> First Scan (Legitimate Origin)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">10:00:24 AM IST</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Location: <strong>Warangal Retail Partner, Hanamkonda</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-slate-400 text-[11px]">
                    IP Address: 115.112.44.19 (BSNL Broadband Telangana)
                  </p>
                </div>
              </div>

              {/* Scan 2 (Anomalous) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" /> Second Scan (Clone Suspected)
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono font-bold">10:15:40 AM IST (+15 min)</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Location: <strong>Chandni Chowk Market, New Delhi</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-slate-400 text-[11px]">
                    IP Address: 182.74.88.102 (Airtel Enterprise North)
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Consumer Traceability Confidence Score Breakdown (Requirement 24) */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                  Traceability Confidence Composite Score
                </h4>
                <p className="text-xs text-slate-400">
                  Separately evaluated from chemical laboratory test metrics
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">98%</span>
                <span className="text-xs text-slate-400 font-bold">Traceability Confidence</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Blockchain Continuity</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">100%</span>
                <span className="text-[10px] text-slate-500">Unbroken SHA-256</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Batch Completeness</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">100%</span>
                <span className="text-[10px] text-slate-500">All 7 Stages</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Lab Test Record</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">95%</span>
                <span className="text-[10px] text-slate-500">ISO-17025 Certified</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Supply Coverage</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">98%</span>
                <span className="text-[10px] text-slate-500">Tare to Retail</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">QR Consistency</span>
                <span className="text-lg font-black text-amber-400 mt-1 block">99%</span>
                <span className="text-[10px] text-slate-500">Geofence Validated</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
              <span className="font-bold text-slate-300">Scientific Distinction:</span> This composite score evaluates digital traceability coverage across data handovers. The honey's chemical authenticity is certified separately under <strong>Laboratory Authenticity Status: PASS (0.00% C4 Syrup)</strong>.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
