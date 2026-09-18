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
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo: Glowing Golden Amber Hexagon */}
        <div 
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-3 cursor-pointer select-none hover:opacity-95 transition-opacity shrink-0"
          title="HoneyChain Home"
        >
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25">
            <Hexagon className="w-7 h-7 stroke-[2.3]" />
            <span className="absolute text-xs font-black tracking-tighter">HC</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                HONEY<span className="text-amber-400">CHAIN</span>
              </span>
              <span className="hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                KVIC MISSION
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'hover:bg-slate-900 hover:text-white'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'hover:bg-slate-900 hover:text-white'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Consumer QR</span>
          </button>

          <button
            onClick={() => navigateTo('blockchain')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              currentActiveView === 'blockchain'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Ledger</span>
          </button>

          <button
            onClick={() => navigateTo('marketplace')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              currentActiveView === 'marketplace'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Buyer</span>
          </button>
        </nav>

        {/* Right Actions: Prominent Judge Mode Button & Indicators */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* PWA Online/Offline Status Indicator (Requirement 19) */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
              isOnline
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}
            title="Click to simulate going offline in remote rural areas"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isOnline ? 'ONLINE 🟢' : 'OFFLINE 🟠'}</span>
          </button>

          {/* Rural Beekeeper Touch Mode Modal Trigger */}
          {onOpenRuralMode && (
            <button
              onClick={onOpenRuralMode}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 transition"
              title="Open Simplified Rural Beekeeper Touch UI with Telugu & Hindi"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>తెలుగు | हिन्दी</span>
            </button>
          )}

          {/* Crown Jewel: 🎬 ENTER JUDGE DEMO MODE (Requirement 34) */}
          <button
            onClick={() => {
              soundManager.playClick();
              if (onOpenJudgeDemo) {
                onOpenJudgeDemo();
              } else {
                navigateTo('judge-demo');
              }
            }}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:scale-103 active:scale-98 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
            <span>🎬 JUDGE DEMO MODE</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 xl:hidden"
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
