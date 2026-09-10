import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAlerts, resolveAlert } from '../services/api';
import { QualityAlert } from '../types';
import { 
  BellRing, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Clock, 
  Check, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const AlertCenter: React.FC = () => {
  const { setSelectedBatchId, setSelectedHiveId, setActiveTab, refreshStats } = useApp();
  const [alerts, setAlerts] = useState<QualityAlert[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const list = await fetchAlerts();
      setAlerts(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await resolveAlert(id);
      await loadAlerts();
      await refreshStats();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'UNRESOLVED') return !a.resolved;
    if (filter === 'RESOLVED') return a.resolved;
    if (filter === 'CRITICAL') return a.severity === 'CRITICAL' || a.severity === 'URGENT';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-red-500/20 p-2 text-red-400">
              <BellRing className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Incident & Quality Alert Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-Time Bio-Acoustic Distress, Spectral Anomalies, and Smart Contract Quarantine Triggers
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['ALL', 'UNRESOLVED', 'CRITICAL', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                filter === f
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((al) => {
          const isCritical = al.severity === 'CRITICAL' || al.severity === 'URGENT';

          return (
            <div
              key={al.id}
              className={`rounded-2xl border p-5 transition-all ${
                al.resolved
                  ? 'border-slate-800 bg-slate-950/60 opacity-60'
                  : isCritical
                  ? 'border-red-500/40 bg-red-950/20'
                  : 'border-amber-500/40 bg-amber-950/15'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{al.id}</span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    al.resolved
                      ? 'bg-slate-800 text-slate-400'
                      : isCritical
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {al.severity}
                  </span>
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                    {al.category}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-400">
                  {al.timestamp}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2">{al.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{al.message}</p>

              <div className="mt-3 rounded-xl bg-slate-950/80 p-2.5 border border-slate-800 text-xs text-amber-300 flex items-center justify-between">
                <div>
                  <strong className="text-slate-400 mr-1">Recommended Action:</strong>
                  {al.action}
                </div>
              </div>

              {/* Action Handlers */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {al.hiveId && (
                    <button
                      onClick={() => {
                        setSelectedHiveId(al.hiveId!);
                        setActiveTab('smart-hives');
                      }}
                      className="text-xs text-amber-400 hover:underline font-mono"
                    >
                      Inspect Hive {al.hiveId} →
                    </button>
                  )}
                  {al.batchId && (
                    <button
                      onClick={() => {
                        setSelectedBatchId(al.batchId!);
                        setActiveTab('consumer-passport');
                      }}
                      className="text-xs text-amber-400 hover:underline font-mono"
                    >
                      Audit Batch {al.batchId} →
                    </button>
                  )}
                </div>

                {!al.resolved && (
                  <button
                    onClick={() => handleResolve(al.id)}
                    className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Acknowledge / Resolve</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DisclaimerBanner type="general" />

    </div>
  );
};
