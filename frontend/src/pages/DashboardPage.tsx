import React, { useState } from 'react';
import {
  Package,
  Radio,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  PlusCircle,
  Download,
  Filter,
  Layers,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { NavTabId } from '../components/HoneychainSidebar';

interface DashboardPageProps {
  onNavigateTab: (tab: NavTabId) => void;
  onSelectBatchForTraceability: (batchId: string) => void;
  onOpenMintModal?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateTab,
  onSelectBatchForTraceability,
  onOpenMintModal
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');

  // Greeting based on actual time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 18) return 'Good Afternoon ☀️';
    return 'Good Evening 🌙';
  };

  const kpis = [
    {
      id: 'batches',
      label: 'Total Honey Batches',
      value: '124',
      unit: 'Batches',
      subtext: '+12% from last month',
      trend: 'up',
      icon: Package,
      color: 'amber'
    },
    {
      id: 'hives',
      label: 'Active Smart Hives',
      value: '52',
      unit: 'Monitored',
      subtext: '4 apiary clusters online',
      trend: 'neutral',
      icon: Radio,
      color: 'emerald'
    },
    {
      id: 'quality',
      label: 'Quality Verified Rate',
      value: '98.4%',
      unit: 'ISO-17025',
      subtext: '0.00% C4 syrups confirmed',
      trend: 'up',
      icon: ShieldCheck,
      color: 'blue'
    },
    {
      id: 'processing',
      label: 'In Processing',
      value: '18',
      unit: 'Lots',
      subtext: 'Extraction & packaging',
      trend: 'neutral',
      icon: Cpu,
      color: 'purple'
    },
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: '2',
      unit: 'Actionable',
      subtext: '1 urgent temperature spike',
      trend: 'down',
      icon: AlertTriangle,
      color: 'rose'
    }
  ];

  // Pipeline stages
  const supplyStages = [
    { id: 'HIVE', label: 'Hive Origin', count: 12 },
    { id: 'HARVESTED', label: 'Harvested', count: 8 },
    { id: 'QUALITY_CHECK', label: 'Quality Check', count: 6 },
    { id: 'PROCESSING', label: 'Processing', count: 18 },
    { id: 'VERIFIED', label: 'Verified', count: 48 },
    { id: 'MARKET', label: 'Market / Sold', count: 32 }
  ];

  // Active honey batches sample data
  const sampleBatches = [
    {
      id: 'HC-2026-00124',
      name: 'Warangal Forest Multiflora Pure Reserve',
      apiary: 'Warangal Apiary Node AP-TG-01',
      stage: 'VERIFIED',
      stageLabel: 'Verified & Certified',
      stageStep: 5,
      qtyKg: 68.5,
      moisturePct: 16.5,
      date: '12 Sep 2026',
      status: 'AUTHENTIC'
    },
    {
      id: 'HC-2026-00125',
      name: 'Nilgiri Kurinji Wild Blossom Lot #4',
      apiary: 'Nilgiri Reserve Apiary Node AP-NIL-01',
      stage: 'PROCESSING',
      stageLabel: 'Cold Micro-Filtering',
      stageStep: 4,
      qtyKg: 42.0,
      moisturePct: 17.1,
      date: '14 Sep 2026',
      status: 'IN_PROCESS'
    },
    {
      id: 'HC-2026-00126',
      name: 'Kashmir White Acacia Single-Flora',
      apiary: 'Pahalgam Alpine Valley Apiary',
      stage: 'QUALITY_CHECK',
      stageLabel: 'EA-IRMS Isotope Testing',
      stageStep: 3,
      qtyKg: 85.0,
      moisturePct: 16.2,
      date: '16 Sep 2026',
      status: 'TESTING'
    },
    {
      id: 'HC-2026-00127',
      name: 'Coorg Coffee Blossom Natural Honey',
      apiary: 'Coorg Estate Apiary Node AP-KA-02',
      stage: 'HARVESTED',
      stageLabel: 'Harvest Notarized',
      stageStep: 2,
      qtyKg: 54.5,
      moisturePct: 18.2,
      date: '18 Sep 2026',
      status: 'PENDING_LAB'
    }
  ];

  const recentAlerts = [
    {
      id: 'alt-1',
      type: 'warning',
      title: 'Hive 03: Temperature Spike',
      description: 'Internal brood temperature reached 38.2°C (normal: 34.5°C). Bio-acoustic frequency elevated to 480 Hz.',
      location: 'Nilgiri Biosphere Apiary Node AP-NIL-01',
      time: '24 mins ago',
      actionLabel: 'Inspect Hive',
      targetTab: 'smart-hive' as NavTabId
    },
    {
      id: 'alt-2',
      type: 'critical',
      title: 'Adulteration Alert: Test Lot #092',
      description: 'Incoming test sample showed 18.4% C4 corn syrup deviation on EA-IRMS. Lot quarantined by smart contract.',
      location: 'NABL Central Laboratory Hyderabad',
      time: '1 hour ago',
      actionLabel: 'View Lab Dossier',
      targetTab: 'quality' as NavTabId
    },
    {
      id: 'alt-3',
      type: 'success',
      title: 'Quality Verification Completed',
      description: 'Batch HC-2026-00124 passed EA-IRMS (δ¹³C -26.8‰) and NMR spectral scanning. 100% Raw Certified.',
      location: 'Regional Testing Enclave',
      time: '3 hours ago',
      actionLabel: 'View Certificate',
      targetTab: 'traceability' as NavTabId
    },
    {
      id: 'alt-4',
      type: 'info',
      title: 'Swarm Prevention Warning',
      description: 'Hive 01 scale weight plateaued at 42.5 kg with queen piping acoustics detected.',
      location: 'Warangal Apiary Node AP-TG-01',
      time: '5 hours ago',
      actionLabel: 'Monitor Hive 01',
      targetTab: 'smart-hive' as NavTabId
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-purple-100 shadow-xs">
        <div>
          <span className="text-[11px] font-black text-purple-900 bg-yellow-300/80 px-2.5 py-1 rounded-full border border-yellow-400 uppercase tracking-wider inline-block mb-2">
            Enterprise Honey Management System
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight">
            {getGreeting()}
            <span className="text-purple-900/75 font-semibold block sm:inline sm:ml-2">
              Welcome to HoneyChain
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-900/60 mt-1 max-w-2xl leading-relaxed font-medium">
            Consortium-verified honey provenance, real-time IoT hive biometrics, and ISO-17025 lab authenticity monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('qr-verify')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-bold text-purple-900 transition cursor-pointer"
          >
            <span>Consumer Passport</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-500" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenMintModal) onOpenMintModal();
              else onNavigateTab('batches');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-purple-950 text-xs font-black shadow-sm shadow-yellow-400/30 border border-yellow-500/50 transition cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mint New Harvest</span>
          </button>
        </div>
      </div>

      {/* 5 Clean KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => {
                if (kpi.id === 'batches') onNavigateTab('batches');
                else if (kpi.id === 'hives') onNavigateTab('smart-hive');
                else if (kpi.id === 'quality') onNavigateTab('quality');
                else if (kpi.id === 'alerts') onNavigateTab('alerts');
                else onNavigateTab('batches');
              }}
              className="saas-card p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:border-purple-300 hover:shadow-md hover:shadow-purple-900/5 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/70 flex items-center justify-center text-purple-700 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                {kpi.trend === 'up' && (
                  <span className="text-[10px] font-bold text-purple-800 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3 text-purple-700" />
                  </span>
                )}
                {kpi.trend === 'down' && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <AlertTriangle className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight block">
                  {kpi.value}
                </span>
                <span className="text-xs font-bold text-purple-900/80 block mt-0.5">
                  {kpi.label}
                </span>
                <span className="text-[11px] text-purple-900/50 mt-1 block font-medium">
                  {kpi.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* LEFT COLUMN: Honey Supply Overview (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="saas-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
              <div>
                <h2 className="text-base font-extrabold text-purple-950 flex items-center gap-2">
                  <Package className="w-4 h-4 text-yellow-500" />
                  <span>Honey Supply Chain Overview</span>
                </h2>
                <p className="text-xs text-purple-900/60 mt-0.5 font-medium">
                  Real-time batch lifecycle from apiary harvest to retail delivery
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('batches')}
                className="text-xs font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>View All Batches</span>
                <ChevronRight className="w-3.5 h-3.5 text-yellow-500" />
              </button>
            </div>

            {/* Stage Pipeline Horizontal Track */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
              {supplyStages.map((stage, idx) => (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStageFilter(selectedStageFilter === stage.id ? 'ALL' : stage.id)}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    selectedStageFilter === stage.id
                      ? 'bg-purple-50 border-purple-400 shadow-xs'
                      : 'bg-white border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <span className="text-[10px] font-black text-purple-900/50 block uppercase">
                    Stage {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-purple-950 mt-1 line-clamp-1">
                    {stage.label}
                  </span>
                  <span className="text-[11px] font-black text-amber-600 mt-1 block">
                    {stage.count} Lots
                  </span>
                </div>
              ))}
            </div>

            {/* Active Batches Table */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900/50 block">
                Recently Updated Batches
              </span>

              <div className="space-y-2.5">
                {sampleBatches.map(batch => (
                  <div
                    key={batch.id}
                    onClick={() => {
                      onSelectBatchForTraceability(batch.id);
                      onNavigateTab('traceability');
                    }}
                    className="p-4 rounded-xl border border-purple-100 hover:border-purple-300 bg-white hover:bg-purple-50/40 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-purple-950 bg-yellow-300/80 px-2.5 py-0.5 rounded-md border border-yellow-400">
                          {batch.id}
                        </span>
                        <span className="text-xs font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
                          {batch.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-900/60 flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-purple-400" />
                        <span>{batch.apiary}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-50">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-purple-900/40 block">Current Stage</span>
                        <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 inline-block mt-0.5">
                          {batch.stageLabel}
                        </span>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-purple-950 transition">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Early Warnings & Sentinel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="saas-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-800 border border-purple-200">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-purple-950">Recent Sentinel Alerts</h2>
                  <p className="text-xs text-purple-900/60 font-medium">Early Warning Biometrics & Flags</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('alerts')}
                className="text-xs font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1 cursor-pointer"
              >
                <span>All Alerts</span>
                <ChevronRight className="w-3.5 h-3.5 text-yellow-500" />
              </button>
            </div>

            <div className="space-y-3">
              {recentAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alert.type === 'critical'
                      ? 'bg-rose-50/40 border-rose-200'
                      : alert.type === 'warning'
                      ? 'bg-amber-50/40 border-amber-200'
                      : alert.type === 'success'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`text-xs font-bold ${
                      alert.type === 'critical' ? 'text-rose-900' : alert.type === 'warning' ? 'text-amber-900' : 'text-slate-900'
                    }`}>
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{alert.time}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {alert.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[190px]">
                      {alert.location}
                    </span>

                    <button
                      type="button"
                      onClick={() => onNavigateTab(alert.targetTab)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>{alert.actionLabel}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
