import React, { useState, useEffect } from 'react';
import { HoneychainProvider, useHoneychain } from './context/HoneychainContext';
import { AppProvider, useApp } from './context/AppContext';

// SaaS Navigation & Shell
import { HoneychainSidebar, NavTabId } from './components/HoneychainSidebar';
import { HoneychainHeader } from './components/HoneychainHeader';
import { HoneyAIAssistant } from './components/HoneyAIAssistant';

// Core Application Pages
import { HoneyBatchesPage } from './pages/HoneyBatchesPage';
import { TraceabilityPage } from './pages/TraceabilityPage';
import { SmartHivePage } from './pages/SmartHivePage';
import { QualityAuthenticityPage } from './pages/QualityAuthenticityPage';
import { BlockchainLedgerPage } from './pages/BlockchainLedgerPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ConsumerQRVerificationPage } from './pages/ConsumerQRVerificationPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { StakeholderPortalsPage } from './pages/StakeholderPortalsPage';
import { JudgeDemoFlowPage } from './pages/JudgeDemoFlowPage';

// Specialized Deep-Dive Modals (Interactive Demonstrators)
import { TraceabilityGraphModal } from './components/TraceabilityGraphModal';
import { IoTSensorSimulatorModal } from './components/IoTSensorSimulatorModal';
import { ExplainableAiModal } from './components/ExplainableAiModal';
import { WhatIfYieldSimulator } from './components/WhatIfYieldSimulator';
import { RuralBeekeeperMode } from './components/RuralBeekeeperMode';
import { BeekeeperWalletModal } from './components/BeekeeperWalletModal';
import { QrCounterfeitDetectorModal } from './components/QrCounterfeitDetectorModal';
import { DigitalCertificateModal } from './components/DigitalCertificateModal';
import { BiometricModal } from './components/BiometricModal';
import { InspectorPasswordModal } from './components/InspectorPasswordModal';
import { BeekeeperPasswordModal } from './components/BeekeeperPasswordModal';

const HoneychainMainLayout: React.FC = () => {
  const { currentRole, setCurrentRole } = useHoneychain();
  const [activeTab, setActiveTab] = useState<NavTabId>('landing');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('HC-2026-00124');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Specialized Modals State
  const [isProvenanceGraphOpen, setIsProvenanceGraphOpen] = useState(false);
  const [isIoTSimulatorOpen, setIsIoTSimulatorOpen] = useState(false);
  const [isExplainableAiOpen, setIsExplainableAiOpen] = useState(false);
  const [isYieldSimulatorOpen, setIsYieldSimulatorOpen] = useState(false);
  const [isRuralModeOpen, setIsRuralModeOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isQrDetectorOpen, setIsQrDetectorOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Inspector & Beekeeper Password Authentication State
  const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);
  const [isBeekeeperModalOpen, setIsBeekeeperModalOpen] = useState(false);

  // Clear any old stored tokens on mount so it always prompts on fresh access
  useEffect(() => {
    try {
      sessionStorage.removeItem('honeychain_inspector_unlocked');
      sessionStorage.removeItem('honeychain_beekeeper_unlocked');
    } catch {}
  }, []);

  // Navigation History Stack for Go Back
  const [tabHistory, setTabHistory] = useState<NavTabId[]>(['portals']);

  const handleInspectorUnlockSuccess = () => {
    setIsInspectorModalOpen(false);
    setCurrentRole('inspector');
    performTabSwitch('quality');
  };

  const handleBeekeeperUnlockSuccess = () => {
    setIsBeekeeperModalOpen(false);
    setCurrentRole('beekeeper');
    performTabSwitch('smart-hive');
  };

  const handleLockInspector = () => {
    setCurrentRole('beekeeper');
    performTabSwitch('portals');
  };

  const performTabSwitch = (tab: string | NavTabId, batchId?: string) => {
    if (batchId) {
      setSelectedBatchId(batchId);
    }

    if (
      tab === 'landing' ||
      tab === 'portals' ||
      tab === 'batches' ||
      tab === 'traceability' ||
      tab === 'smart-hive' ||
      tab === 'quality' ||
      tab === 'blockchain' ||
      tab === 'alerts' ||
      tab === 'analytics' ||
      tab === 'qr-verify' ||
      tab === 'settings'
    ) {
      setTabHistory(prev => {
        if (prev[prev.length - 1] === tab) return prev;
        return [...prev, tab as NavTabId];
      });
      setActiveTab(tab as NavTabId);
    }
  };

  // Handle Tab Switch with Inspector Interception
  const handleSelectTab = (tab: string | NavTabId, batchId?: string) => {
    if (batchId) {
      setSelectedBatchId(batchId);
    }

    if (tab === 'ai-assistant') {
      setIsAiDrawerOpen(true);
      return;
    }

    // Intercept Beekeeper / Smart Hive tab if not already on it
    if (tab === 'smart-hive' && activeTab !== 'smart-hive') {
      setIsBeekeeperModalOpen(true);
      return;
    }

    // Intercept Quality / Inspector tab if not already on it
    if (tab === 'quality' && activeTab !== 'quality') {
      setIsInspectorModalOpen(true);
      return;
    }

    performTabSwitch(tab, batchId);
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const updated = [...tabHistory];
      updated.pop();
      const prev = updated[updated.length - 1];
      setTabHistory(updated);
      setActiveTab(prev);
    } else {
      setActiveTab('portals');
    }
  };

  const handleSelectBatchForTraceability = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveTab('traceability');
  };

  const handleSelectRole = (role: string) => {
    if (role === 'beekeeper') {
      // Always prompt for password when pressing HoneyChain beekeeper option
      setIsBeekeeperModalOpen(true);
    } else if (role === 'inspector') {
      // Always prompt for password when pressing HoneyChain inspector option
      setIsInspectorModalOpen(true);
    } else if (role === 'customer') {
      setCurrentRole('customer');
      performTabSwitch('qr-verify');
    } else if (role === 'processor') {
      setCurrentRole('admin');
      performTabSwitch('batches');
    } else if (role === 'regulator') {
      setCurrentRole('admin');
      performTabSwitch('blockchain');
    } else {
      performTabSwitch('portals');
    }
  };

  // Render Main Page Content
  const renderContentPage = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            onEnterApp={() => handleSelectTab('portals')}
            onEnterDemo={() => handleSelectTab('portals')}
            onSelectRole={handleSelectRole}
            onOpenScanner={() => {
              setCurrentRole('customer');
              handleSelectTab('qr-verify');
            }}
            onOpenProvenanceGraph={() => setIsProvenanceGraphOpen(true)}
          />
        );

      case 'portals':
        return (
          <StakeholderPortalsPage
            onSelectRole={handleSelectRole}
            onBackHome={() => handleSelectTab('landing')}
          />
        );

      case 'batches':
        return (
          <HoneyBatchesPage
            onNavigateTab={(tab, batchId) => handleSelectTab(tab as NavTabId, batchId)}
          />
        );

      case 'traceability':
        return (
          <TraceabilityPage
            initialBatchId={selectedBatchId}
            onOpenCertificateModal={() => setIsCertificateOpen(true)}
          />
        );

      case 'smart-hive':
        return <SmartHivePage onNavigateTab={(tab, batchId) => handleSelectTab(tab as NavTabId, batchId)} />;

      case 'quality':
        return (
          <QualityAuthenticityPage
            onNavigateTab={(tab) => handleSelectTab(tab as NavTabId)}
            onLockInspector={handleLockInspector}
          />
        );

      case 'blockchain':
        return <BlockchainLedgerPage />;

      case 'alerts':
        return (
          <AlertsPage
            onNavigateTab={(tab, id) => handleSelectTab(tab as NavTabId, id)}
          />
        );

      case 'analytics':
        return <AnalyticsPage />;

      case 'qr-verify':
        return <ConsumerQRVerificationPage onNavigateTab={(tab) => handleSelectTab(tab as NavTabId)} />;

      case 'settings':
        return <SettingsPage />;

      default:
        return (
          <StakeholderPortalsPage
            onSelectRole={handleSelectRole}
            onBackHome={() => handleSelectTab('landing')}
          />
        );
    }
  };

  // If on landing entrance screen, render pure focused Home Page gateway
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={() => handleSelectTab('portals')}
          onEnterDemo={() => handleSelectTab('portals')}
          onSelectRole={handleSelectRole}
          onOpenScanner={() => {
            setCurrentRole('customer');
            handleSelectTab('qr-verify');
          }}
          onOpenProvenanceGraph={() => setIsProvenanceGraphOpen(true)}
        />
        <InspectorPasswordModal
          isOpen={isInspectorModalOpen}
          onClose={() => setIsInspectorModalOpen(false)}
          onSuccess={handleInspectorUnlockSuccess}
        />
        <BeekeeperPasswordModal
          isOpen={isBeekeeperModalOpen}
          onClose={() => setIsBeekeeperModalOpen(false)}
          onSuccess={handleBeekeeperUnlockSuccess}
        />
      </>
    );
  }

  // If on dedicated stakeholder portal selection screen, render full-screen gateway
  if (activeTab === 'portals') {
    return (
      <>
        <StakeholderPortalsPage
          onSelectRole={handleSelectRole}
          onBackHome={() => handleSelectTab('landing')}
        />
        <InspectorPasswordModal
          isOpen={isInspectorModalOpen}
          onClose={() => setIsInspectorModalOpen(false)}
          onSuccess={handleInspectorUnlockSuccess}
        />
        <BeekeeperPasswordModal
          isOpen={isBeekeeperModalOpen}
          onClose={() => setIsBeekeeperModalOpen(false)}
          onSuccess={handleBeekeeperUnlockSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#1e1035] flex font-sans selection:bg-yellow-300 selection:text-purple-950">
      
      {/* Left Application Sidebar */}
      <HoneychainSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        currentRole={currentRole || 'beekeeper'}
        onSelectRole={handleSelectRole}
        activeAlertCount={2}
        isOpenMobile={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
        
        {/* Top Sticky Header */}
        <HoneychainHeader
          onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
          onNavigateTab={handleSelectTab}
          onGoBack={handleGoBack}
          onOpenMintModal={() => handleSelectTab('batches')}
          currentRole={currentRole || 'beekeeper'}
          onChangeRole={(r) => handleSelectRole(r)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alertCount={2}
        />

        {/* Dynamic Page Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-28">
          {renderContentPage()}
        </main>
      </div>

      {/* Floating HoneyAI Assistant Drawer & Trigger */}
      <HoneyAIAssistant
        isOpenExternal={isAiDrawerOpen}
        onCloseExternal={() => setIsAiDrawerOpen(false)}
        onNavigateTab={handleSelectTab}
      />

      {/* Floating Bottom Quick Action Bar for Judges & Evaluators */}
      <aside
        aria-label="Interactive Simulator Tools"
        className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-30 items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 border border-purple-200/90 shadow-xl shadow-purple-950/10 backdrop-blur-md text-xs font-bold text-purple-950"
      >
        <span className="text-[10px] font-black uppercase tracking-wider text-purple-950 bg-yellow-400 px-2 py-1 rounded-xl flex items-center gap-1 shadow-2xs">
          <span>⚡</span> Simulators:
        </span>
        <button
          type="button"
          onClick={() => setIsProvenanceGraphOpen(true)}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 hover:text-purple-950 transition cursor-pointer text-purple-900/80 font-semibold"
        >
          Genealogy Graph
        </button>
        <button
          type="button"
          onClick={() => setIsIoTSimulatorOpen(true)}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 hover:text-purple-950 transition cursor-pointer text-purple-900/80 font-semibold"
        >
          IoT Sensor
        </button>
        <button
          type="button"
          onClick={() => setIsExplainableAiOpen(true)}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 hover:text-purple-950 transition cursor-pointer text-purple-900/80 font-semibold"
        >
          Explainable AI
        </button>
        <button
          type="button"
          onClick={() => setIsYieldSimulatorOpen(true)}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 hover:text-purple-950 transition cursor-pointer text-purple-900/80 font-semibold"
        >
          Yield What-If
        </button>
        <button
          type="button"
          onClick={() => setIsRuralModeOpen(true)}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 hover:text-purple-950 transition cursor-pointer text-purple-900/80 font-semibold"
        >
          Rural Mode
        </button>
        <button
          type="button"
          onClick={() => setIsQrDetectorOpen(true)}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 hover:text-purple-950 transition cursor-pointer text-purple-900/80 font-semibold"
        >
          Clone Detector
        </button>
        <button
          type="button"
          onClick={() => setIsCertificateOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-yellow-400 text-purple-950 border border-yellow-500 hover:bg-yellow-300 transition cursor-pointer font-black shadow-xs"
        >
          Digital Certificate
        </button>
      </aside>

      {/* Universal Specialized Modals */}
      <TraceabilityGraphModal
        isOpen={isProvenanceGraphOpen}
        onClose={() => setIsProvenanceGraphOpen(false)}
        batchId={selectedBatchId}
      />

      <IoTSensorSimulatorModal
        isOpen={isIoTSimulatorOpen}
        onClose={() => setIsIoTSimulatorOpen(false)}
        hiveId="HIVE-01"
      />

      <ExplainableAiModal
        isOpen={isExplainableAiOpen}
        onClose={() => setIsExplainableAiOpen(false)}
        hiveId="HIVE-01"
      />

      <WhatIfYieldSimulator
        isOpen={isYieldSimulatorOpen}
        onClose={() => setIsYieldSimulatorOpen(false)}
        hiveId="HIVE-01"
      />

      <RuralBeekeeperMode
        isOpen={isRuralModeOpen}
        onClose={() => setIsRuralModeOpen(false)}
      />

      <BeekeeperWalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />

      <QrCounterfeitDetectorModal
        isOpen={isQrDetectorOpen}
        onClose={() => setIsQrDetectorOpen(false)}
        batchId={selectedBatchId}
      />

      <DigitalCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      <BiometricModal />
      <InspectorPasswordModal
        isOpen={isInspectorModalOpen}
        onClose={() => setIsInspectorModalOpen(false)}
        onSuccess={handleInspectorUnlockSuccess}
      />
      <BeekeeperPasswordModal
        isOpen={isBeekeeperModalOpen}
        onClose={() => setIsBeekeeperModalOpen(false)}
        onSuccess={handleBeekeeperUnlockSuccess}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <HoneychainProvider>
        <HoneychainMainLayout />
      </HoneychainProvider>
    </AppProvider>
  );
}

export default App;
