import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  ShieldAlert, 
  Bot, 
  Sparkles, 
  RotateCcw, 
  User, 
  QrCode,
  Layers,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery, 
    setIsAssistantOpen, 
    stats, 
    resetSystem,
    navigateToBatch,
    navigateToHive,
    setQrModalBatch,
    selectedBatchId
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const rolesList: { id: UserRole; name: string; icon: string; desc: string }[] = [
    { id: 'regulator', name: 'Regulator / FSSAI', icon: '🏛️', desc: 'Full audit trails, alerts & batch freeze' },
    { id: 'lab', name: 'Quality Lab / NABL', icon: '🔬', desc: 'SpectraSeal screening & lab certificates' },
    { id: 'beekeeper', name: 'Beekeeper / Apiary', icon: '🐝', desc: 'Hive bio-acoustics & pollination credits' },
    { id: 'processor', name: 'Processor / Logistics', icon: '🏭', desc: 'Batch intake, bottling & cold-chain' },
    { id: 'consumer', name: 'Consumer / Public', icon: '🍯', desc: 'Honey Passport & QR verification' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toUpperCase().trim();
    if (!q) return;

    if (q.startsWith('H-') || q.includes('HIVE')) {
      navigateToHive(q.startsWith('H-') ? q : 'H-014');
    } else if (q.startsWith('HC-') || q.includes('00482')) {
      navigateToBatch(q.startsWith('HC-') ? q : 'HC-2026-AP-004821');
    } else if (q.includes('BLOCK') || q.includes('TX')) {
      setActiveTab('blockchain');
    } else if (q.includes('POLLIN') || q.includes('FARM')) {
      setActiveTab('pollinate');
    } else {
      setActiveTab('honey-batches');
    }
    setSearchOpen(false);
  };

  const unreadAlerts = stats?.summary?.unreadAlerts || 0;
  const isLedgerTampered = stats?.summary?.isLedgerTampered;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/20">
            <span className="text-xl">🍯</span>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 border border-amber-400 text-[9px] font-bold text-amber-400">
              ⛓️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                HONEY<span className="text-amber-400">CHAIN</span>
              </span>
              <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                SIH 2026
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Every Drop Has a Digital Identity.
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Batch ID, Hive ID, Apiary, Farmer, Tx Hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-1.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* SIH Judge Mode Primary CTA */}
          <button
            onClick={() => setActiveTab('judge-mode')}
            className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-lg transition-all ${
              activeTab === 'judge-mode'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 glow-amber'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-bold">JUDGE MODE</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
            </span>
          </button>

          {/* QR Code Quick Generator */}
          <button
            onClick={() => setQrModalBatch(selectedBatchId || 'HC-2026-AP-004821')}
            title="Scan / Show Honey Passport QR"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition"
          >
            <QrCode className="h-4 w-4" />
          </button>

          {/* BeeGuard AI Assistant Button */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            title="BeeGuard AI Assistant"
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition"
          >
            <Bot className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">BeeGuard AI</span>
          </button>

          {/* Tamper Warning Indicator if Active */}
          {isLedgerTampered && (
            <button
              onClick={() => setActiveTab('blockchain')}
              className="flex items-center gap-1 rounded-xl border border-red-500/40 bg-red-500/20 px-2.5 py-1.5 text-xs font-bold text-red-400 animate-pulse"
              title="Ledger Tampering Simulation Active"
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">TAMPER DETECTED</span>
            </button>
          )}

          {/* Alerts Bell */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition"
          >
            <ShieldAlert className="h-4 w-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700"
            >
              <span className="text-sm">
                {rolesList.find(r => r.id === role)?.icon}
              </span>
              <span className="hidden md:inline font-medium capitalize">
                {rolesList.find(r => r.id === role)?.name}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Switch Active Role (RBAC)
                </div>
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-start gap-2.5 rounded-lg p-2 text-left transition ${
                      role === r.id ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-base">{r.icon}</span>
                    <div>
                      <p className="text-xs font-semibold">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo State Button */}
          <button
            onClick={resetSystem}
            title="Reset to Baseline Demo State"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

        </div>
      </div>
    </header>
  );
};
