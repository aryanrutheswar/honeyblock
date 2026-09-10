import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchBatches, harvestBatch } from '../services/api';
import { HoneyBatch } from '../types';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  QrCode, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles,
  CheckCircle2,
  X,
  Scan,
  RefreshCw
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const HoneyBatches: React.FC = () => {
  const { setSelectedBatchId, setActiveTab, setQrModalBatch, refreshStats } = useApp();
  const [batches, setBatches] = useState<HoneyBatch[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);

  // New Harvest Form
  const [hiveId, setHiveId] = useState('H-014');
  const [harvestQty, setHarvestQty] = useState(65.0);
  const [floralSource, setFloralSource] = useState('Kashmir Acacia Gold');
  const [harvesting, setHarvesting] = useState(false);

  const loadBatches = async () => {
    try {
      const list = await fetchBatches();
      setBatches(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleCreateHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setHarvesting(true);
    try {
      const res = await harvestBatch({
        hiveId,
        harvestQtyKg: harvestQty,
        floralSource
      });
      await loadBatches();
      await refreshStats();
      setIsHarvestModalOpen(false);
      setSelectedBatchId(res.batch.digitalId);
      setActiveTab('consumer-passport');
    } catch (err) {
      console.error(err);
    } finally {
      setHarvesting(false);
    }
  };

  const filteredBatches = batches.filter(b => {
    const matchesFilter = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesSearch = search === '' || 
      b.digitalId.toLowerCase().includes(search.toLowerCase()) ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.floralSource.toLowerCase().includes(search.toLowerCase()) ||
      b.beekeeper.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
              <Package className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Honey Digital ID Registry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tamper-Evident Honey Batches, Floral Fingerprints & Permissioned Custody Tokens
          </p>
        </div>

        <button
          onClick={() => setIsHarvestModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Harvest</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'APPROVED', 'REVIEW', 'QUARANTINED', 'BLOCKED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, flora, beekeeper..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBatches.map((b) => {
          const isApproved = b.status === 'APPROVED';
          const isQuarantined = b.status === 'QUARANTINED' || b.status === 'BLOCKED';
          const isReview = b.status === 'REVIEW';

          return (
            <div
              key={b.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isQuarantined
                  ? 'border-red-500/40 bg-red-950/15'
                  : isReview
                  ? 'border-amber-500/40 bg-amber-950/15'
                  : 'border-slate-800 bg-slate-900/80 hover:border-amber-400/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {b.digitalId}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    isApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isQuarantined
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{b.name}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Floral: <span className="text-slate-200 font-medium">{b.floralSource}</span>
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 text-[11px]">
                  <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">Quantity</span>
                    <span className="font-bold text-white">{b.harvestQtyKg} kg</span>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">Moisture</span>
                    <span className="font-bold text-white">{b.moisturePct}%</span>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">Match</span>
                    <span className="font-bold text-emerald-400">{b.spectralSimilarity}%</span>
                  </div>
                </div>

                {b.quarantineReason && (
                  <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-[10px] text-red-300 leading-tight">
                    {b.quarantineReason}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setQrModalBatch(b.digitalId)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Show QR</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedBatchId(b.digitalId);
                    setActiveTab('consumer-passport');
                  }}
                  className="flex items-center gap-1 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition"
                >
                  <span>View Journey</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Register New Harvest Modal */}
      {isHarvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-400" />
                <span>Register Super Frame Honey Harvest</span>
              </h3>
              <button
                onClick={() => setIsHarvestModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHarvest} className="space-y-4 text-xs">
              
              <div>
                <label className="text-slate-300 block mb-1">Source Hive</label>
                <select
                  value={hiveId}
                  onChange={(e) => setHiveId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                >
                  <option value="H-014">Hive H-014 — Kashmir Alpha-14 (Apis mellifera)</option>
                  <option value="H-016">Hive H-016 — Kashmir Mountain-16 (Apis cerana)</option>
                  <option value="H-031">Hive H-031 — Punjab Mustard Gold-01</option>
                  <option value="H-051">Hive H-051 — Coorg Blossom-01</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Harvest Quantity (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={harvestQty}
                  onChange={(e) => setHarvestQty(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Floral Source / Variety</label>
                <input
                  type="text"
                  value={floralSource}
                  onChange={(e) => setFloralSource(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-300 flex items-start gap-2">
                <Scan className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  Submitting will automatically trigger a calibrated SpectraSeal™ NIR screening scan, mint a unique Honey Digital ID, and anchor the measurement evidence to the blockchain ledger.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHarvestModalOpen(false)}
                  className="rounded-xl border border-slate-800 px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={harvesting}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition"
                >
                  {harvesting ? <RefreshCw className="h-4 w-4 animate-spin text-slate-950" /> : <Sparkles className="h-4 w-4 text-slate-950" />}
                  <span>Mint Digital ID & Anchor</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <DisclaimerBanner type="spectral" />

    </div>
  );
};
