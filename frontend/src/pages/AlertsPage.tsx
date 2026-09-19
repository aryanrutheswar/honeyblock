import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  Filter,
  Search,
  SlidersHorizontal,
  Bell,
  Radio,
  FlaskConical,
  Database,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Clock,
  Settings
} from 'lucide-react';

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  category: 'Adulteration' | 'Hive Health' | 'Consortium Node' | 'Supply Chain';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  sourceId: string;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-2026-0041',
    title: 'Adulteration Flag: Exogenous C4 Sugar Marker Detected',
    description: 'Batch HB-2026-0896 NMR isotopic mass spec indicates -13.2‰ delta 13C deviation, consistent with high-fructose corn syrup addition (42% purity score).',
    category: 'Adulteration',
    severity: 'CRITICAL',
    timestamp: '18 minutes ago',
    status: 'ACTIVE',
    sourceId: 'HB-2026-0896'
  },
  {
    id: 'ALT-2026-0040',
    title: 'Pre-Swarm Acoustic Anomaly Detected',
    description: 'HIVE-03 frequency spiked to 480 Hz with queen piping signatures. 85% probability of colony swarm within 24–48 hours unless super room is expanded.',
    category: 'Hive Health',
    severity: 'WARNING',
    timestamp: '1 hour ago',
    status: 'ACTIVE',
    sourceId: 'HIVE-03'
  },
  {
    id: 'ALT-2026-0039',
    title: 'Brood Temperature Elevated Above Normal Limit',
    description: 'HIVE-04 internal brood core reached 37.1°C (normal range 34.5°C - 35.5°C). Colony active fanning cooling detected.',
    category: 'Hive Health',
    severity: 'WARNING',
    timestamp: '3 hours ago',
    status: 'ACKNOWLEDGED',
    sourceId: 'HIVE-04'
  },
  {
    id: 'ALT-2026-0038',
    title: 'Consortium Validator Node Latency Warning',
    description: 'Node-3 (EU-Central Zurich) reported block propagation round-trip time of 420ms (> 300ms SLA). PBFT consensus remains operational with 4/4 nodes.',
    category: 'Consortium Node',
    severity: 'INFO',
    timestamp: '6 hours ago',
    status: 'RESOLVED',
    sourceId: 'NODE-03'
  },
  {
    id: 'ALT-2026-0037',
    title: 'Harvest Seal Verification Completed',
    description: 'Batch HB-2026-0891 passed multi-spectral cryptoseal verification at processing depot. Retail packaging authorization granted.',
    category: 'Supply Chain',
    severity: 'INFO',
    timestamp: '1 day ago',
    status: 'RESOLVED',
    sourceId: 'HB-2026-0891'
  }
];

interface AlertsPageProps {
  onNavigateTab?: (tab: string, id?: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigateTab }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  // Thresholds state
  const [tempMax, setTempMax] = useState('36.5');
  const [swarmHz, setSwarmHz] = useState('450');
  const [moistureMax, setMoistureMax] = useState('19.0');
  const [purityMin, setPurityMin] = useState('90.0');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = filterSeverity === 'ALL' || alert.severity === filterSeverity;
    const matchesCategory = filterCategory === 'ALL' || alert.category === filterCategory;
    const matchesSearch =
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.description.toLowerCase().includes(search.toLowerCase()) ||
      alert.sourceId.toLowerCase().includes(search.toLowerCase());

    return matchesSeverity && matchesCategory && matchesSearch;
  });

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
  };

  const handleResolve = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'RESOLVED' } : a));
  };

  const getSeverityBadge = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            WARNING
          </span>
        );
      case 'INFO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            INFO
          </span>
        );
    }
  };

  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sentinel Early Warnings</h1>
            {activeCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                {activeCount} Active Issues
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                All Clear
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time biometric anomaly alerts, laboratory adulteration flags, and validator node health monitor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              showConfig
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {showConfig ? 'Hide Thresholds' : 'Alert Thresholds'}
          </button>
        </div>
      </div>

      {/* Threshold Configuration Drawer (if toggled) */}
      {showConfig && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Configured Warning Triggers</h2>
              <p className="text-xs text-slate-500">Autonomous Sentinel will broadcast an incident when telemetry breaches these parameters</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Active Sentinel v2.4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <label className="block font-semibold text-slate-700 mb-1">Max Brood Temperature</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  className="w-20 px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-mono font-semibold text-slate-800"
                />
                <span className="text-slate-500 font-medium">&deg;C</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Trigger cooling / heatwave warning</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <label className="block font-semibold text-slate-700 mb-1">Pre-Swarm Acoustic Freq</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={swarmHz}
                  onChange={(e) => setSwarmHz(e.target.value)}
                  className="w-20 px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-mono font-semibold text-slate-800"
                />
                <span className="text-slate-500 font-medium">Hz</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Trigger queen piping / departure risk</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <label className="block font-semibold text-slate-700 mb-1">Max Moisture Allowance</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={moistureMax}
                  onChange={(e) => setMoistureMax(e.target.value)}
                  className="w-20 px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-mono font-semibold text-slate-800"
                />
                <span className="text-slate-500 font-medium">%</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Codex Alimentarius limit &le; 20.0%</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <label className="block font-semibold text-slate-700 mb-1">Min Authenticity Purity</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={purityMin}
                  onChange={(e) => setPurityMin(e.target.value)}
                  className="w-20 px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-mono font-semibold text-slate-800"
                />
                <span className="text-slate-500 font-medium">%</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Auto-reject batch below threshold</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by batch, hive, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {sev === 'ALL' ? 'All Severities' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition-all ${
              alert.status === 'RESOLVED'
                ? 'bg-slate-50/60 border-slate-200 opacity-75'
                : alert.severity === 'CRITICAL'
                ? 'bg-white border-rose-200 hover:border-rose-300 shadow-xs'
                : alert.severity === 'WARNING'
                ? 'bg-white border-amber-200 hover:border-amber-300 shadow-xs'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getSeverityBadge(alert.severity)}
                  <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {alert.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    Source: <strong className="text-slate-900">{alert.sourceId}</strong>
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.timestamp}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">{alert.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Resolved
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                )}

                {/* Inspect Target link */}
                <button
                  onClick={() => {
                    if (onNavigateTab) {
                      if (alert.sourceId.startsWith('HIVE')) {
                        onNavigateTab('smart-hive', alert.sourceId);
                      } else if (alert.sourceId.startsWith('HB')) {
                        onNavigateTab('quality', alert.sourceId);
                      } else {
                        onNavigateTab('blockchain');
                      }
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  title="Inspect Source Record"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800">No alerts match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">All apiaries, sensor streams, and batches are performing within normal thresholds.</p>
          </div>
        )}
      </div>
    </div>
  );
};
