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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            Enterprise Honey Management System
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}
            <span className="text-slate-700 font-semibold block sm:inline sm:ml-2">
              Welcome to HoneyChain
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Consortium-verified honey provenance, real-time IoT hive biometrics, and ISO-17025 lab authenticity monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('qr-verify')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            <span>Consumer Passport</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenMintModal) onOpenMintModal();
              else onNavigateTab('batches');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs hover:shadow-sm transition cursor-pointer active:scale-95"
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
              className="saas-card p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:border-amber-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                {kpi.trend === 'up' && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                  </span>
                )}
                {kpi.trend === 'down' && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <AlertTriangle className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">
                  {kpi.value}
                </span>
                <span className="text-xs font-semibold text-slate-600 block mt-0.5">
                  {kpi.label}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>Honey Supply Chain Overview</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time batch lifecycle from apiary harvest to retail delivery
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('batches')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>View All Batches</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lifecycle Stages Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 text-center">
              {supplyStages.map((stage, idx) => (
                <div
                  key={stage.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Stage {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">
                    {stage.label}
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-600 mt-1">
                    {stage.count} Lots
                  </span>
                </div>
              ))}
            </div>

            {/* Active Batches Table */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
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
                    className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-slate-50/60 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                          {batch.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                          {batch.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{batch.apiary}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Stage</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-0.5">
                          {batch.stageLabel}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Quantity</span>
                        <span className="text-xs font-bold text-slate-800 block mt-0.5">{batch.qtyKg} kg</span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-transform group-hover:translate-x-1 hidden sm:block" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="saas-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Recent System Alerts</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Early warning notifications from hives, lab gates & ledger
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('alerts')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <span>All Alerts</span>
                <ChevronRight className="w-3.5 h-3.5" />
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
