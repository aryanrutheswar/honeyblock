import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Radio,
  Package,
  Scan,
  Flame,
  ShieldAlert,
  Sparkles,
  Link2,
  Truck,
  Flower2,
  QrCode,
  BellRing,
  FileSpreadsheet,
  Network,
  HelpCircle,
  Cpu
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, stats } = useApp();

  const navGroups = [
    {
      group: 'Core Platform',
      items: [
        { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, badge: null },
        { id: 'smart-hives', label: 'Smart Hives (BeeGuard™)', icon: Radio, badge: stats?.summary?.atRiskHives ? `${stats.summary.atRiskHives} At-Risk` : null, badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'honey-batches', label: 'Honey Batches', icon: Package, badge: stats?.summary?.totalBatches || 8, badgeColor: 'bg-slate-800 text-slate-300' },
        { id: 'spectraseal', label: 'SpectraSeal™ Scanner', icon: Scan, badge: 'NIR/NMR', badgeColor: 'bg-amber-500/20 text-amber-300' },
      ]
    },
    {
      group: 'Live SIH Demonstrations',
      items: [
        { id: 'judge-mode', label: 'SIH Judge Mode', icon: Sparkles, badge: 'HOT', badgeColor: 'bg-amber-400 text-slate-950 font-bold' },
        { id: 'break-the-batch', label: 'Break the Batch', icon: Flame, badge: 'Adulteration', badgeColor: 'bg-red-500/20 text-red-300' },
        { id: 'break-the-ledger', label: 'Break the Ledger', icon: ShieldAlert, badge: 'Anti-Tamper', badgeColor: 'bg-purple-500/20 text-purple-300' },
      ]
    },
    {
      group: 'Intelligence & Trust',
      items: [
        { id: 'quality', label: 'Quality Intelligence', icon: Cpu, badge: null },
        { id: 'blockchain', label: 'Blockchain Explorer', icon: Link2, badge: `${stats?.summary?.totalBlocks || 9} Blocks`, badgeColor: 'bg-blue-500/20 text-blue-300' },
        { id: 'supply-chain', label: 'Supply Chain Tower', icon: Truck, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { id: 'pollinate', label: 'Pollinate™ Economy', icon: Flower2, badge: 'Tokens', badgeColor: 'bg-pink-500/20 text-pink-300' },
        { id: 'consumer-passport', label: 'Consumer Passport', icon: QrCode, badge: null },
      ]
    },
    {
      group: 'Audit & System',
      items: [
        { id: 'alerts', label: 'Alert Center', icon: BellRing, badge: stats?.summary?.unreadAlerts || null, badgeColor: 'bg-red-500 text-white' },
        { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet, badge: null },
        { id: 'architecture', label: 'Architecture & Tech', icon: Network, badge: null },
      ]
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-950/60 p-4 hidden lg:flex flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        {navGroups.map((grp, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              {grp.group}
            </p>
            <div className="space-y-1">
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 mt-6">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>SIH 2026 Ready</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Physical Evidence + Bio-Acoustics + Permissioned Blockchain.
        </p>
      </div>
    </aside>
  );
};
