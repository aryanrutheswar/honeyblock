import React from 'react';
import {
  LayoutDashboard,
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
  Hexagon
} from 'lucide-react';

export type NavTabId =
  | 'dashboard'
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
  activeAlertCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const HoneychainSidebar: React.FC<HoneychainSidebarProps> = ({
  activeTab,
  onSelectTab,
  activeAlertCount = 2,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navSections: NavSection[] = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard' as NavTabId, label: 'Dashboard', icon: LayoutDashboard },
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
        { id: 'qr-verify' as NavTabId, label: 'QR Verification', icon: QrCode }
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Hexagon className="w-5 h-5 fill-white/20 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
                HONEY<span className="text-amber-600">CHAIN</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider mt-0.5">
                ENTERPRISE SAAS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navSections.map(section => (
            <div key={section.group} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
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
                          ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/80 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-amber-600 stroke-[2.4]'
                              : item.highlight
                              ? 'text-amber-500'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white leading-none">
                          {item.badge}
                        </span>
                      )}

                      {item.highlight && !isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Network & Node Status Footer */}
        <div className="p-3.5 m-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Nilgiri Node #014
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500">18ms</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            PBFT Consortium Consensus • Block #8421
          </p>
        </div>
      </aside>
    </>
  );
};
