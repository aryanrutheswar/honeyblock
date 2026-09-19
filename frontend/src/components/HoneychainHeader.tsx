import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  PlusCircle,
  QrCode,
  ShieldCheck,
  ChevronDown,
  User,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { NavTabId } from './HoneychainSidebar';

interface HoneychainHeaderProps {
  onToggleMobileNav: () => void;
  onNavigateTab: (tab: NavTabId) => void;
  onOpenMintModal?: () => void;
  currentRole: string;
  onChangeRole: (role: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  alertCount?: number;
}

export const HoneychainHeader: React.FC<HoneychainHeaderProps> = ({
  onToggleMobileNav,
  onNavigateTab,
  onOpenMintModal,
  currentRole,
  onChangeRole,
  searchQuery,
  onSearchChange,
  alertCount = 2
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles = [
    { id: 'beekeeper', label: 'Nilgiri Apiary Beekeeper', tag: 'Producer' },
    { id: 'inspector', label: 'NABL Quality Lab Inspector', tag: 'Auditor' },
    { id: 'processor', label: 'KVIC Honey Processing Unit', tag: 'Processor' },
    { id: 'regulator', label: 'FSSAI Food Safety Regulator', tag: 'Govt' },
    { id: 'customer', label: 'End Consumer / Buyer', tag: 'Public' }
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden cursor-pointer"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search batch ID, hive, or blockchain hash... (e.g. HC-2026-00124)"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Right: Actions, Alerts, Role Selector */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        
        {/* Network Consensus Badge (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PBFT Consensus: 4 Nodes Sync</span>
        </div>

        {/* Quick Action: Scan Bottle QR */}
        <button
          type="button"
          onClick={() => onNavigateTab('qr-verify')}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-slate-500" />
          <span>Scan Bottle</span>
        </button>

        {/* Quick Action: Mint Batch */}
        <button
          type="button"
          onClick={() => {
            if (onOpenMintModal) onOpenMintModal();
            else onNavigateTab('batches');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs hover:shadow-sm transition cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Mint Harvest</span>
        </button>

        {/* Alerts Bell */}
        <button
          type="button"
          onClick={() => onNavigateTab('alerts')}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          title="View Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
              <User className="w-4 h-4 text-amber-700" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentRoleObj.label}
              </span>
              <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider">
                {currentRoleObj.tag}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {roleMenuOpen && (
            <>
              <div
                onClick={() => setRoleMenuOpen(false)}
                className="fixed inset-0 z-30"
              />
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-40 space-y-1 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Persona
                </div>
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      onChangeRole(r.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      currentRole === r.id
                        ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span>{r.label}</span>
                      <span className="text-[10px] text-slate-400">{r.tag} Workspace</span>
                    </div>
                    {currentRole === r.id && (
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
