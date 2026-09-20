import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { NavTabId } from './HoneychainSidebar';

interface HoneychainHeaderProps {
  onToggleMobileNav: () => void;
  onNavigateTab: (tab: NavTabId) => void;
  onGoBack?: () => void;
  onOpenMintModal?: () => void;
  currentRole: string;
  onChangeRole: (role: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  alertCount?: number;
}

export const HoneychainHeader: React.FC<HoneychainHeaderProps> = ({
  onToggleMobileNav,
  onNavigateTab,
  onGoBack,
  currentRole,
  onChangeRole,
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
      {/* Left: Go Back Button & Mobile Menu Toggle */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Prominent Go Back Button */}
        <button
          type="button"
          onClick={onGoBack || (() => onNavigateTab('portals'))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-black text-xs border border-purple-200 shadow-2xs hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
          title="Go back to previous page or Role Portals"
        >
          <ArrowLeft className="w-4 h-4 text-purple-700" />
          <span>Go Back</span>
        </button>

        <button
          type="button"
          onClick={onToggleMobileNav}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Alerts Bell & Role Selector */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Alerts Bell */}
        <button
          type="button"
          onClick={() => onNavigateTab('alerts')}
          className="relative p-2 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-50 transition cursor-pointer"
          title="View Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-yellow-400 ring-2 ring-white" />
          )}
        </button>

        <div className="h-6 w-px bg-purple-100 hidden sm:block" />

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-purple-50 border border-transparent hover:border-purple-200 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center text-xs font-bold">
              <User className="w-4 h-4 text-purple-700" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-purple-950 leading-tight">
                {currentRoleObj.label}
              </span>
              <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">
                {currentRoleObj.tag}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-purple-400 hidden sm:block" />
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
