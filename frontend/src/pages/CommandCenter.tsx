import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchBatches, fetchHives, fetchBlockchainState, fetchAlerts } from '../services/api';
import { HoneyBatch, Hive, QualityAlert, Block } from '../types';
import { 
  Activity, 
  Package, 
  Link2, 
  ShieldAlert, 
  Flower2, 
  Scan, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  QrCode,
  Radio
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const CommandCenter: React.FC = () => {
  const { 
    setActiveTab, 
    setSelectedBatchId, 
    setQrModalBatch
  } = useApp();

  const [batches, setBatches] = useState<HoneyBatch[]>([]);
  const [hives, setHives] = useState<Hive[]>([]);
  const [alerts, setAlerts] = useState<QualityAlert[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [bList, hList, bState, aList] = await Promise.all([
          fetchBatches(),
          fetchHives(),
          fetchBlockchainState(),
          fetchAlerts()
        ]);
        setBatches(bList);
        setHives(hList);
        setLatestBlocks(bState.blocks.slice(-4).reverse());
        setAlerts(aList.slice(0, 4));
      } catch (e) {
        console.error('Failed to load command center data', e);
      }
    }
    loadData();
  }, []);

  const atRiskHives = hives.filter(h => h.inspectionPriority === 'URGENT' || h.inspectionPriority === 'HIGH');
  const quarantinedBatches = batches.filter(b => b.status === 'QUARANTINED' || b.status === 'BLOCKED');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              HoneyChain Command Center
            </h1>
            <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
              Live Consortium
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-Time Physical Evidence, Bio-Acoustics & Blockchain Provenance Monitor
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('judge-mode')}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:from-amber-300 hover:to-amber-400 transition shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Launch Judge Mode</span>
          </button>
          <button
            onClick={() => setActiveTab('spectraseal')}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition"
          >
            <Scan className="h-3.5 w-3.5" />
            <span>SpectraSeal Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('break-the-batch')}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Break the Batch</span>
          </button>
        </div>
      </div>

      {/* Top Level KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div 
          onClick={() => setActiveTab('smart-hives')}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 cursor-pointer hover:border-amber-400/50 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Monitored Hives</span>
            <Radio className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{hives.length || 10}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">100% Active</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Across 5 bio-reserves</p>
        </div>

        <div 
          onClick={() => setActiveTab('smart-hives')}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 cursor-pointer hover:border-amber-400/50 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>At-Risk Hives</span>
            <Activity className="h-4 w-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-400">{atRiskHives.length}</span>
            <span className="text-[10px] text-amber-400/80 font-semibold">Acoustic Flags</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Queen / Swarm alerts</p>
        </div>

        <div 
          onClick={() => setActiveTab('honey-batches')}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 cursor-pointer hover:border-amber-400/50 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Honey Batches</span>
            <Package className="h-4 w-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{batches.length || 8}</span>
            <span className="text-[10px] text-amber-400 font-semibold">Digital IDs</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Total 873.9 kg traced</p>
        </div>

        <div 
          onClick={() => setActiveTab('spectraseal')}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 cursor-pointer hover:border-amber-400/50 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Quarantined</span>
            <AlertTriangle className="h-4 w-4 text-red-400 group-hover:scale-110 transition" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-red-400">{quarantinedBatches.length}</span>
            <span className="text-[10px] text-red-400 font-semibold">Intercepted</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Exogenous syrup stopped</p>
        </div>

        <div 
          onClick={() => setActiveTab('blockchain')}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 cursor-pointer hover:border-amber-400/50 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Blockchain Blocks</span>
            <Link2 className="h-4 w-4 text-blue-400 group-hover:scale-110 transition" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{latestBlocks.length > 0 ? latestBlocks[0].index + 1 : 9}</span>
            <span className="text-[10px] text-blue-400 font-semibold">PBFT Valid</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Tamper-evident ledger</p>
        </div>

        <div 
          onClick={() => setActiveTab('pollinate')}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 cursor-pointer hover:border-amber-400/50 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Pollination Credits</span>
            <Flower2 className="h-4 w-4 text-pink-400 group-hover:scale-110 transition" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-pink-400">745</span>
            <span className="text-[10px] text-pink-400 font-semibold">Minted</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">4 certified farms</p>
        </div>

      </div>

      {/* Visual Supply Chain Pipeline Animation */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Autonomous Supply Chain Flow Pipeline
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any stage to inspect live layer</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[
            { step: '01', title: 'Smart Hive', role: 'Bio-Acoustics', tab: 'smart-hives', color: 'border-emerald-500/30' },
            { step: '02', title: 'Harvest', role: 'Calibrated Scale', tab: 'honey-batches', color: 'border-amber-500/30' },
            { step: '03', title: 'SpectraSeal', role: 'NIR Scan', tab: 'spectraseal', color: 'border-amber-500/40' },
            { step: '04', title: 'AI Quality', role: 'Reference Model', tab: 'quality', color: 'border-purple-500/30' },
            { step: '05', title: 'Blockchain', role: 'Smart Gate', tab: 'blockchain', color: 'border-blue-500/30' },
            { step: '06', title: 'Processing', role: 'Cold Bottling', tab: 'supply-chain', color: 'border-slate-700' },
            { step: '07', title: 'Distribution', role: 'Smart Seals', tab: 'supply-chain', color: 'border-slate-700' },
            { step: '08', title: 'Consumer', role: 'Honey Passport', tab: 'consumer-passport', color: 'border-emerald-500/40' },
          ].map((st, sIdx) => (
            <div
              key={sIdx}
              onClick={() => setActiveTab(st.tab)}
              className={`rounded-xl border ${st.color} bg-slate-950/80 p-3 text-center cursor-pointer hover:bg-slate-850 hover:border-amber-400 transition`}
            >
              <div className="text-[10px] font-mono text-amber-400 font-bold">STEP {st.step}</div>
              <div className="text-xs font-bold text-white mt-1">{st.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{st.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Honey Batches Live Registry */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-400" />
              <span>Honey Batches & Quality Provenance</span>
            </h3>
            <button
              onClick={() => setActiveTab('honey-batches')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All Batches</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {batches.slice(0, 5).map((b) => {
              const isApproved = b.status === 'APPROVED';
              const isQuarantined = b.status === 'QUARANTINED' || b.status === 'BLOCKED';
              const isReview = b.status === 'REVIEW';

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isQuarantined
                      ? 'border-red-500/40 bg-red-950/15'
                      : isReview
                      ? 'border-amber-500/40 bg-amber-950/15'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {b.digitalId}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isQuarantined
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-1">{b.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Hive: <span className="text-slate-300 font-mono">{b.hiveId}</span> | Floral: {b.floralSource} | Qty: {b.harvestQtyKg} kg
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right sm:mr-3">
                        <p className="text-[11px] text-slate-400">Spectral Match</p>
                        <p className="text-xs font-bold text-slate-200">{b.spectralSimilarity}%</p>
                      </div>
                      <button
                        onClick={() => setQrModalBatch(b.digitalId)}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition"
                        title="Show QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBatchId(b.digitalId);
                          setActiveTab('consumer-passport');
                        }}
                        className="flex items-center gap-1 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition"
                      >
                        <span>Passport</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {b.quarantineReason && (
                    <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-300 flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="leading-snug">{b.quarantineReason}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live Alerts & Blockchain Anchor Stream */}
        <div className="space-y-6">
          
          {/* Live Alerts Panel */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span>Active Quality & Hive Alerts</span>
              </h3>
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-[11px] text-amber-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className={`rounded-xl p-3 border text-xs ${
                    al.severity === 'CRITICAL' || al.severity === 'URGENT'
                      ? 'border-red-500/30 bg-red-950/20 text-red-200'
                      : 'border-amber-500/30 bg-amber-950/20 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{al.title}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 font-mono">
                      {al.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">{al.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain Ledger Stream */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Link2 className="h-4 w-4 text-blue-400" />
                <span>Recent Blockchain Blocks</span>
              </h3>
              <button
                onClick={() => setActiveTab('blockchain')}
                className="text-[11px] text-blue-400 hover:underline"
              >
                Explorer
              </button>
            </div>

            <div className="space-y-2">
              {latestBlocks.map((blk) => (
                <div
                  key={blk.index}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 font-mono text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-blue-400 font-bold">Block #{blk.index}</span>
                    <span>{blk.payload?.event || 'BLOCK_RECORD'}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Hash: {blk.hash}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <DisclaimerBanner type="general" />

    </div>
  );
};
