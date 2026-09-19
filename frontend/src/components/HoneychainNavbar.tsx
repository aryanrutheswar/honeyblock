import React, { useState } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import { soundManager } from '../utils/audio';
import { stopAllCameraHardware } from '../utils/mediaManager';

import {
  Hexagon,
  Sparkles,
  Cpu,
  UserCheck,
  Eye,
  ShieldAlert,
  Building2,
  GitBranch,
  TrendingUp,
  Coins,
  Scale,
  Wifi,
  WifiOff,
  Globe,
  Lock,
  ArrowRight,
  Menu,
  X,
  Play,
  Layers,
  ShoppingBag,
  Award
} from 'lucide-react';

interface HoneychainNavbarProps {
  onOpenJudgeDemo?: () => void;
  onOpenProvenanceGraph?: () => void;
  onOpenIoTSimulator?: () => void;
  onOpenExplainableAi?: () => void;
  onOpenYieldSimulator?: () => void;
  onOpenRuralMode?: () => void;
  onOpenWallet?: () => void;
  onOpenQrDetector?: () => void;
  onOpenCertificate?: () => void;
  currentActiveView?: string;
  onNavigateView?: (view: string) => void;
}

export const HoneychainNavbar: React.FC<HoneychainNavbarProps> = ({
  onOpenJudgeDemo,
  onOpenProvenanceGraph,
  onOpenIoTSimulator,
  onOpenExplainableAi,
  onOpenYieldSimulator,
  onOpenRuralMode,
  onOpenWallet,
  onOpenQrDetector,
  onOpenCertificate,
  currentActiveView = 'landing',
  onNavigateView
}) => {
  const { appScreen, currentRole, goToRoleSelect, enterApp, setAppScreen, setCurrentRole } = useHoneychain();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const navigateTo = (view: string) => {
    soundManager.playClick();
    stopAllCameraHardware();
    if (onNavigateView) {
      onNavigateView(view);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0517]/95 backdrop-blur-md border-b border-purple-500/30 shadow-2xl select-none">
      
      {/* Signature Purple & Yellow Top Accent Line */}
      <div className="h-1 w-full bumble-stripes opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo: Glowing Royal Purple & Yellow Hexagon Badge */}
        <div 
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-3 cursor-pointer select-none hover:opacity-95 transition-opacity shrink-0 group"
          title="HoneyChain — Royal Purple & Gold"
        >
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-yellow-400 text-slate-950 shadow-lg shadow-purple-900/50 border-2 border-yellow-300 group-hover:scale-105 transition-transform overflow-hidden">
            {/* Internal micro stripes */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bumble-stripes-slim" />
            
            {/* Animated Mascot */}
            <span className="text-2xl select-none animate-bee-hover relative z-10">🐝</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                HONEY<span className="text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]">CHAIN</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-900/90 text-yellow-300 border border-purple-400/50 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                ROYAL HIVE • PURPLE & GOLD
              </span>
            </div>
            <p className="text-[11px] font-medium text-purple-200/70 hidden sm:block">
              From Hive to Home — Every Drop Has a Digital Identity
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <button
            onClick={() => navigateTo('landing')}
            className={`px-3 py-2 rounded-xl transition ${
              currentActiveView === 'landing'
                ? 'bg-purple-600/30 text-yellow-300 border border-purple-400/50 shadow-xs shadow-purple-500/20 font-black'
                : 'hover:bg-[#160d2c] hover:text-yellow-200 text-purple-200/80'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              setCurrentRole('beekeeper');
              setAppScreen('portal');
              navigateTo('beekeeper');
            }}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              currentActiveView === 'beekeeper'
                ? 'bg-purple-600/30 text-yellow-300 border border-purple-400/50 shadow-xs shadow-purple-500/20 font-black'
                : 'hover:bg-[#160d2c] hover:text-yellow-200 text-purple-200/80'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-yellow-400" />
            <span>Beekeeper</span>
          </button>

          <button
            onClick={() => {
              setCurrentRole('admin');
              setAppScreen('portal');
              navigateTo('admin');
            }}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              currentActiveView === 'admin'
                ? 'bg-purple-600/30 text-yellow-300 border border-purple-400/50 shadow-xs shadow-purple-500/20 font-black'
                : 'hover:bg-[#160d2c] hover:text-yellow-200 text-purple-200/80'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-300" />
            <span>KVIC Admin</span>
          </button>

          <button
            onClick={() => {
              setCurrentRole('inspector');
              setAppScreen('portal');
              navigateTo('inspector');
            }}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              currentActiveView === 'inspector'
                ? 'bg-purple-600/30 text-yellow-300 border border-purple-400/50 shadow-xs shadow-purple-500/20 font-black'
                : 'hover:bg-[#160d2c] hover:text-yellow-200 text-purple-200/80'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lab</span>
          </button>

          <button
            onClick={() => {
              setCurrentRole('customer');
              setAppScreen('portal');
              navigateTo('customer');
            }}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              currentActiveView === 'customer'
                ? 'bg-purple-600/30 text-yellow-300 border border-purple-400/50 shadow-xs shadow-purple-500/20 font-black'
                : 'hover:bg-[#160d2c] hover:text-yellow-200 text-purple-200/80'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Consumer QR</span>
          </button>

          <button
            onClick={() => navigateTo('blockchain')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              currentActiveView === 'blockchain'
                ? 'bg-purple-600/30 text-yellow-300 border border-purple-400/50 shadow-xs shadow-purple-500/20 font-black'
                : 'hover:bg-[#160d2c] hover:text-yellow-200 text-purple-200/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-yellow-400" />
            <span>Ledger</span>
          </button>

          <button
            onClick={() => navigateTo('marketplace')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              currentActiveView === 'marketplace'
                ? 'bg-purple-600/30 text-yellow-300 border border-purple-400/50 shadow-xs shadow-purple-500/20 font-black'
                : 'hover:bg-[#160d2c] hover:text-yellow-200 text-purple-200/80'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Buyer</span>
          </button>
        </nav>

        {/* Right Actions: Prominent Judge Mode Button & Indicators */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* PWA Online/Offline Status Indicator */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
              isOnline
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
            }`}
            title="Click to simulate going offline in remote rural areas"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-yellow-400" />}
            <span>{isOnline ? 'ONLINE 🟢' : 'OFFLINE 🟠'}</span>
          </button>

          {/* Rural Beekeeper Touch Mode Modal Trigger */}
          {onOpenRuralMode && (
            <button
              onClick={onOpenRuralMode}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#140b28] hover:bg-[#1d1038] text-yellow-300 border border-purple-500/40 transition"
              title="Open Simplified Rural Beekeeper Touch UI with Telugu & Hindi"
            >
              <Globe className="w-3.5 h-3.5 text-yellow-400" />
              <span>తెలుగు | हिन्दी</span>
            </button>
          )}

          {/* Crown Jewel: 🎬 ENTER JUDGE DEMO MODE */}
          <button
            onClick={() => {
              soundManager.playClick();
              if (onOpenJudgeDemo) {
                onOpenJudgeDemo();
              } else {
                navigateTo('judge-demo');
              }
            }}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-xs sm:text-sm shadow-xl shadow-purple-900/50 border-2 border-purple-200 hover:shadow-2xl hover:scale-104 active:scale-96 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-purple-950 animate-spin" style={{ animationDuration: '3.5s' }} />
            <span>🎬 JUDGE DEMO MODE</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#160d2c] border border-purple-500/40 text-yellow-300 xl:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden px-4 py-4 border-t border-slate-800 bg-slate-950 text-xs font-bold space-y-2 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('landing')}
              className="p-2.5 rounded-xl bg-slate-900 text-left hover:bg-slate-800 text-slate-200"
            >
              Home Page
            </button>
            <button
              onClick={() => {
                setCurrentRole('beekeeper');
                setAppScreen('portal');
                navigateTo('beekeeper');
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-left hover:bg-slate-800 text-amber-400"
            >
              🐝 Beekeeper Portal
            </button>
            <button
              onClick={() => {
                setCurrentRole('admin');
                setAppScreen('portal');
                navigateTo('admin');
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-left hover:bg-slate-800 text-indigo-400"
            >
              🏛 KVIC Admin
            </button>
            <button
              onClick={() => {
                setCurrentRole('inspector');
                setAppScreen('portal');
                navigateTo('inspector');
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-left hover:bg-slate-800 text-cyan-400"
            >
              🧪 Lab Inspector
            </button>
            <button
              onClick={() => {
                setCurrentRole('customer');
                setAppScreen('portal');
                navigateTo('customer');
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-left hover:bg-slate-800 text-emerald-400"
            >
              🔍 Consumer Scanner
            </button>
            <button
              onClick={() => navigateTo('blockchain')}
              className="p-2.5 rounded-xl bg-slate-900 text-left hover:bg-slate-800 text-amber-300"
            >
              ⛓ Blockchain Ledger
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
            {onOpenProvenanceGraph && (
              <button
                onClick={() => { onOpenProvenanceGraph(); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 text-[11px]"
              >
                Provenance Graph
              </button>
            )}
            {onOpenRuralMode && (
              <button
                onClick={() => { onOpenRuralMode(); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 text-[11px]"
              >
                తెలుగు / हिन्दी
              </button>
            )}
            {onOpenWallet && (
              <button
                onClick={() => { onOpenWallet(); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 text-[11px]"
              >
                My Honey Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
