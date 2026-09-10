import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchConsumerPassport, fetchBatches } from '../services/api';
import { ConsumerPassport, HoneyBatch } from '../types';
import { 
  Award, 
  QrCode, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  Scan, 
  Link2, 
  Truck, 
  MapPin, 
  Calendar, 
  Share2, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const ConsumerPassportPage: React.FC = () => {
  const { selectedBatchId, setSelectedBatchId, setQrModalBatch } = useApp();
  const [passport, setPassport] = useState<ConsumerPassport | null>(null);
  const [batchesList, setBatchesList] = useState<HoneyBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPassport() {
      setLoading(true);
      try {
        const [bData, bList] = await Promise.all([
          fetchConsumerPassport(selectedBatchId || 'HC-2026-AP-004821'),
          fetchBatches()
        ]);
        setPassport(bData.passport);
        setBatchesList(bList);
      } catch (e) {
        console.error('Failed to load consumer passport', e);
      } finally {
        setLoading(false);
      }
    }
    loadPassport();
  }, [selectedBatchId]);

  if (loading || !passport) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-2 text-amber-400">
          <span className="text-3xl animate-bounce">🍯</span>
          <p className="text-xs font-semibold">Retrieving Cryptographic Honey Passport from Blockchain...</p>
        </div>
      </div>
    );
  }

  const isApproved = passport.status === 'APPROVED';
  const isQuarantined = passport.status === 'QUARANTINED' || passport.status === 'BLOCKED';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Batch Switcher Bar for Demo Presentation */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Inspecting Honey Passport:</span>
          <select
            value={passport.digitalId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono font-bold text-amber-400 focus:border-amber-400 focus:outline-none"
          >
            {batchesList.map((b) => (
              <option key={b.digitalId} value={b.digitalId}>
                {b.digitalId} — {b.name} ({b.status})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setQrModalBatch(passport.digitalId)}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition"
        >
          <QrCode className="h-3.5 w-3.5" />
          <span>Show QR Code</span>
        </button>
      </div>

      {/* Main Passport Certificate Header Card */}
      <div className={`rounded-3xl border p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all ${
        isApproved
          ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950'
          : 'border-red-500/50 bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-950'
      }`}>
        
        {/* Decorative Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300 font-mono">
                {passport.digitalId}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                isApproved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {passport.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {passport.name}
            </h1>

            <p className="text-sm text-slate-300 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span>{passport.origin.apiary} — {passport.origin.region}</span>
            </p>
            <p className="text-xs text-slate-400">
              Master Beekeeper: <strong className="text-slate-200">{passport.origin.beekeeper}</strong> | Harvest Date: {passport.harvestDate}
            </p>
          </div>

          {/* Transparency Score Dial */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950/90 border border-slate-800 p-5 min-w-[150px] shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Transparency Score
            </span>
            <div className="my-1 flex items-baseline">
              <span className={`text-4xl font-black ${
                passport.transparencyScore >= 85 ? 'text-emerald-400' : passport.transparencyScore >= 60 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {passport.transparencyScore}
              </span>
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <span className="text-[9px] text-slate-400 text-center">
              Machine Evidence + Lab Audit
            </span>
          </div>

        </div>

        {/* Quarantine notice if flagged */}
        {passport.quarantineReason && (
          <div className="mt-6 rounded-2xl border border-red-500 bg-red-950/60 p-4 text-xs text-red-200 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-300">CONSUMER SAFETY NOTICE:</p>
              <p className="mt-0.5 leading-relaxed">{passport.quarantineReason}</p>
            </div>
          </div>
        )}

      </div>

      {/* "MEET YOUR BEES" Emotional Connection Card */}
      <div className="rounded-3xl border border-amber-500/30 bg-slate-900/80 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐝</span>
          <div>
            <h3 className="text-lg font-bold text-white">Meet Your Bees & Apiary Colony</h3>
            <p className="text-xs text-slate-400">
              The biological origin behind your jar of honey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-500 text-[10px] block">Species & Hive</span>
            <p className="text-sm font-bold text-white mt-0.5">{passport.hiveStory.species}</p>
            <p className="text-[10px] text-amber-400 font-mono mt-0.5">Hive: {passport.hiveStory.hiveId}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-500 text-[10px] block">Colony Health</span>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">{passport.hiveStory.healthScore}/100 Health</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{passport.hiveStory.hiveCondition}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-500 text-[10px] block">Colony Strength</span>
            <p className="text-sm font-bold text-white mt-0.5">{passport.hiveStory.colonyStrength}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Foraging Active</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-500 text-[10px] block">Bio-Acoustics</span>
            <p className="text-sm font-bold text-amber-300 mt-0.5">BeeGuard Verified</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Harmonic 220Hz hum</p>
          </div>
        </div>
      </div>

      {/* "YOUR HONEY'S JOURNEY" 8-Stage Timeline */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Your Honey's Journey</h3>
            <p className="text-xs text-slate-400">
              Unbroken cryptographic chain of custody from mountain hive to retail
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Immutable Ledger</span>
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-emerald-500 before:to-blue-500">
          
          {passport.journey.map((evt, idx) => (
            <div key={evt.id || idx} className="relative space-y-1 text-xs">
              <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[9px] font-bold ring-4 ring-slate-900">
                {idx + 1}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-white">{evt.stage}</h4>
                <span className="text-[11px] font-mono text-slate-400">{evt.timestamp}</span>
              </div>
              
              <p className="text-slate-300">{evt.details}</p>
              
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-400">
                <span>Actor: <strong className="text-slate-300">{evt.actor}</strong></span>
                <span>Location: <strong className="text-slate-300">{evt.location}</strong></span>
                <span className="font-mono text-blue-400">Tx: {evt.txHash?.substring(0, 16)}...</span>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Quality Proof & Blockchain Integrity Verification Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Scan className="h-4 w-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              SpectraSeal Physical Quality Screen
            </h4>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Fingerprint ID:</span>
              <span className="font-mono text-amber-400">{passport.qualityScreen.spectralFingerprintId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Spectral Match:</span>
              <span className="font-bold text-emerald-400">{passport.spectralSimilarity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Moisture Content:</span>
              <span className="font-bold text-white">{passport.moisturePct}% (Standard &lt;20%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Confirmatory Lab:</span>
              <span className="font-semibold text-slate-200">{passport.qualityScreen.labConfirmation}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Blockchain Ledger Verification
            </h4>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Block Number:</span>
              <span className="text-blue-400 font-bold">Block #{passport.blockchainProof.blockNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Consensus State:</span>
              <span className="text-emerald-400 font-bold">VALID / IMMUTABLE</span>
            </div>
            <div className="truncate text-[10px] text-slate-500 pt-1">
              Tx: {passport.blockchainProof.txHash}
            </div>
          </div>
        </div>

      </div>

      <DisclaimerBanner type="general" />

    </div>
  );
};
