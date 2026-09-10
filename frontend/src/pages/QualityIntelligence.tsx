import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchSpectralReferences, fetchBatches, approveBatch, quarantineBatch } from '../services/api';
import { SpectralReference, HoneyBatch } from '../types';
import { 
  Cpu, 
  BookOpen, 
  FlaskConical, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const QualityIntelligence: React.FC = () => {
  const { refreshStats } = useApp();
  const [references, setReferences] = useState<SpectralReference[]>([]);
  const [batches, setBatches] = useState<HoneyBatch[]>([]);
  const [selectedRef, setSelectedRef] = useState<SpectralReference | null>(null);
  const [loading, setLoading] = useState(true);

  // Lab Action State
  const [selectedBatchId, setSelectedBatchId] = useState('HC-2026-AP-004823');
  const [labCertId, setLabCertId] = useState('C-LAB-NABL-2026-9988');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [refs, bList] = await Promise.all([
        fetchSpectralReferences(),
        fetchBatches()
      ]);
      setReferences(refs);
      if (refs.length > 0) setSelectedRef(refs[0]);
      setBatches(bList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveBatch = async () => {
    try {
      await approveBatch(selectedBatchId, labCertId);
      setActionMessage(`Batch ${selectedBatchId} officially approved and certified under ${labCertId}.`);
      await loadData();
      await refreshStats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuarantineBatch = async () => {
    try {
      await quarantineBatch(selectedBatchId, 'Secondary lab verification failed: C4 carbon isotope deviation confirmed.');
      setActionMessage(`Batch ${selectedBatchId} placed in regulatory quarantine.`);
      await loadData();
      await refreshStats();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
            <FlaskConical className="h-5 w-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Quality Intelligence & Confirmatory Testing
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Botanical Reference Spectral Library & Laboratory Officer Decision Portal
        </p>
      </div>

      {/* Confirmatory Testing & Reference Data Module (Section 22) */}
      <div className="rounded-2xl border border-purple-500/40 bg-slate-900/90 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">
              Confirmatory Testing & Lab Certification Gate
            </h3>
          </div>
          <span className="text-xs font-mono text-purple-300 font-semibold">
            NABL / FSSAI Accredited
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Spectroscopy provides instant field-level screening. Accredited laboratory officers can attach confirmatory EA-IRMS (Elemental Analyzer - Isotope Ratio Mass Spectrometry) or LC-HRMS certificates to anchor permanent verification on the blockchain.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Select Batch for Review
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-purple-400 focus:outline-none font-mono"
            >
              {batches.map((b) => (
                <option key={b.digitalId} value={b.digitalId}>
                  {b.digitalId} — {b.name} ({b.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              NABL Certificate ID / Token
            </label>
            <input
              type="text"
              value={labCertId}
              onChange={(e) => setLabCertId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-purple-400 focus:outline-none"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleApproveBatch}
              className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow"
            >
              Approve & Release
            </button>
            <button
              onClick={handleQuarantineBatch}
              className="flex-1 rounded-xl bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-500 transition shadow"
            >
              Quarantine Batch
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-300 flex items-center justify-between">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Reference Spectral Library (Section 21) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>Reference Botanical Spectral Library</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated NIR/NMR absorbance benchmarks across recognized Indian honey floral types
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            6 Reference Profiles
          </span>
        </div>

        {/* References Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {references.map((r) => {
            const isSelected = selectedRef?.id === r.id;
            const isAdulterant = r.id.includes('ADULTERANT');

            return (
              <button
                key={r.id}
                onClick={() => setSelectedRef(r)}
                className={`rounded-xl p-3 text-left border transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 text-white shadow-md'
                    : isAdulterant
                    ? 'border-red-500/40 bg-red-950/20 text-red-300'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-bold truncate">{r.floralSource}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{r.region}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Reference Profile Details */}
        {selectedRef && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400">{selectedRef.id}</span>
                <h4 className="text-base font-bold text-white mt-0.5">{selectedRef.name}</h4>
                <p className="text-xs text-slate-400">{selectedRef.region}</p>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400">Sample Dataset:</span>
                <p className="font-bold text-emerald-400">{selectedRef.sampleCount} Authentic Spectra</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 text-[10px]">Fructose Mean</span>
                <p className="text-base font-bold text-white">{selectedRef.fructoseMean}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 text-[10px]">Glucose Mean</span>
                <p className="text-base font-bold text-white">{selectedRef.glucoseMean}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 text-[10px]">Moisture Optimum</span>
                <p className="text-base font-bold text-white">{selectedRef.moistureOptimum}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 text-[10px]">AI Model</span>
                <p className="text-xs font-bold text-amber-300 font-mono mt-0.5">{selectedRef.modelVersion}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs">
              <span className="text-slate-400 font-bold block mb-1">Key Diagnostic Wavelength Peaks:</span>
              <p className="font-mono text-amber-300">
                {selectedRef.wavelengthPeaks.map(p => `${p}nm`).join(' • ')}
              </p>
            </div>
          </div>
        )}
      </div>

      <DisclaimerBanner type="spectral" />

    </div>
  );
};
