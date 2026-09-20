import {
  Home,
  Package,
  SearchCheck,
  Radio,
  FlaskConical,
  Database,
  AlertTriangle,
  BarChart3,
  QrCode,
  Sparkles,
  Settings,
  ChevronRight,
  ShieldCheck,
  Hexagon,
  ArrowLeft
} from 'lucide-react';
import { BarcodeIcon } from './HoneyBarcodeCanvas';

export type NavTabId =
  | 'landing'
  | 'portals'
  | 'batches'
  | 'traceability'
  | 'smart-hive'
  | 'quality'
  | 'blockchain'
  | 'alerts'
  | 'analytics'
  | 'qr-verify'
  | 'ai-assistant'
  | 'settings';

interface NavItem {
  id: NavTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  highlight?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

interface HoneychainSidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  currentRole?: string;
  onSelectRole?: (role: string) => void;
  activeAlertCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const HoneychainSidebar: React.FC<HoneychainSidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole = 'beekeeper',
  onSelectRole,
  activeAlertCount = 2,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navSections: NavSection[] = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'landing' as NavTabId, label: 'Home Page', icon: Home },
        { id: 'portals' as NavTabId, label: 'Role Portals', icon: Hexagon },
        { id: 'batches' as NavTabId, label: 'Honey Batches', icon: Package },
        { id: 'traceability' as NavTabId, label: 'Traceability', icon: SearchCheck },
        { id: 'smart-hive' as NavTabId, label: 'Smart Hive', icon: Radio },
        { id: 'quality' as NavTabId, label: 'Quality & Authenticity', icon: FlaskConical }
      ]
    },
    {
      group: 'GOVERNANCE & AUDIT',
      items: [
        { id: 'blockchain' as NavTabId, label: 'Blockchain Ledger', icon: Database },
        { id: 'alerts' as NavTabId, label: 'Alerts', icon: AlertTriangle, badge: activeAlertCount },
        { id: 'analytics' as NavTabId, label: 'Analytics', icon: BarChart3 },
        { id: 'qr-verify' as NavTabId, label: 'Barcode Verification', icon: BarcodeIcon }
      ]
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { id: 'ai-assistant' as NavTabId, label: 'HoneyAI Assistant', icon: Sparkles, highlight: true },
        { id: 'settings' as NavTabId, label: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleNavClick = (id: NavTabId) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-purple-100/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-purple-50 flex items-center justify-between">
          <div
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 border border-purple-400/30 flex items-center justify-center text-yellow-300 shadow-md shadow-purple-900/15 group-hover:scale-105 transition-transform">
              <Hexagon className="w-5 h-5 fill-yellow-400/20 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-purple-950 leading-none">
                HONEY<span className="text-amber-500">CHAIN</span>
              </span>
              <span className="text-[10px] font-bold text-purple-700/60 tracking-wider mt-0.5">
                ENTERPRISE SAAS
              </span>
            </div>
          </div>
        </div>

        {/* Active Stakeholder Portal Indicator */}
        <div className="mx-3 mt-3 p-3 rounded-2xl bg-gradient-to-br from-purple-50/90 via-yellow-50/50 to-purple-50/80 border border-purple-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-purple-900/60">
              Active Portal
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-white border border-purple-200 shadow-xs">
              {currentRole === 'beekeeper' ? '🐝' : currentRole === 'inspector' ? '🔬' : currentRole === 'customer' ? '📱' : currentRole === 'processor' ? '📦' : '⛓️'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-purple-950 truncate">
                {currentRole === 'beekeeper'
                  ? 'Beekeeper Portal'
                  : currentRole === 'inspector'
                  ? 'Lab Inspector Portal'
                  : currentRole === 'customer'
                  ? 'Customer Portal'
                  : currentRole === 'processor'
                  ? 'Processor Portal'
                  : 'Regulator Portal'}
              </div>
              <div className="text-[10px] text-purple-700/75 font-semibold truncate">
                {currentRole === 'beekeeper'
                  ? 'Apiary IoT & Batches'
                  : currentRole === 'inspector'
                  ? 'Chemical Assays & QR'
                  : currentRole === 'customer'
                  ? 'Scanner & Passport'
                  : 'Enterprise Access'}
              </div>
            </div>
          </div>

          {/* Quick Return to Portal Selection */}
          <button
            type="button"
            onClick={() => handleNavClick('portals')}
            className="w-full mt-2.5 py-1.5 px-2 rounded-xl text-[11px] font-extrabold text-purple-950 bg-white hover:bg-purple-100 border border-purple-200 hover:border-purple-300 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-purple-700" />
            <span>Go Back to Portals</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navSections.map(section => (
            <div key={section.group} className="space-y-1">
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-purple-900/50 select-none">
                {section.group}
              </div>
              <div className="space-y-0.5 pt-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-50 text-purple-950 font-bold border border-purple-200 shadow-xs'
                          : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-purple-700 stroke-[2.4]'
                              : item.highlight
                              ? 'text-yellow-500'
                              : 'text-purple-400 group-hover:text-purple-700'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-yellow-400 text-purple-950 leading-none shadow-xs">
                          {item.badge}
                        </span>
                      )}

                      {item.highlight && !isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Consortium Node Footnote */}
        <div className="p-3 m-3 rounded-2xl bg-purple-50/60 border border-purple-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-purple-950 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-500" />
              Consortium Cluster
            </span>
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          </div>
          <p className="text-[10px] text-purple-900/60 leading-tight font-medium">
            4/4 PBFT Nodes Online &bull; Ledger Block #8424
          </p>
        </div>
      </aside>
    </>
  );
};
