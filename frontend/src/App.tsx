import React, { useState } from 'react';
import { HoneychainProvider, useHoneychain } from './context/HoneychainContext';
import { AppProvider, useApp } from './context/AppContext';

// SaaS Navigation & Shell
import { HoneychainSidebar, NavTabId } from './components/HoneychainSidebar';
import { HoneychainHeader } from './components/HoneychainHeader';
import { HoneyAIAssistant } from './components/HoneyAIAssistant';

// Core Application Pages
import { DashboardPage } from './pages/DashboardPage';
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

  // Handle Tab Switch
  const handleSelectTab = (tab: string | NavTabId, batchId?: string) => {
    if (batchId) {
      setSelectedBatchId(batchId);
    }

    if (tab === 'ai-assistant') {
      setIsAiDrawerOpen(true);
      return;
    }

    if (
      tab === 'landing' ||
      tab === 'dashboard' ||
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
      setActiveTab(tab as NavTabId);
    }
  };

  const handleSelectBatchForTraceability = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveTab('traceability');
  };

  // Render Main Page Content
  const renderContentPage = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            onEnterApp={() => handleSelectTab('dashboard')}
            onEnterDemo={() => handleSelectTab('dashboard')}
            onSelectRole={(role) => {
              if (role === 'beekeeper') {
                setCurrentRole('beekeeper');
                handleSelectTab('smart-hive');
              } else if (role === 'inspector') {
                setCurrentRole('inspector');
                handleSelectTab('quality');
              } else if (role === 'customer') {
                setCurrentRole('customer');
                handleSelectTab('qr-verify');
              } else if (role === 'processor') {
                setCurrentRole('admin');
                handleSelectTab('batches');
              } else {
                handleSelectTab('dashboard');
              }
            }}
            onOpenScanner={() => handleSelectTab('qr-verify')}
            onOpenProvenanceGraph={() => setIsProvenanceGraphOpen(true)}
          />
        );

      case 'dashboard':
        return (
          <DashboardPage
            onNavigateTab={handleSelectTab}
            onSelectBatchForTraceability={handleSelectBatchForTraceability}
            onOpenMintModal={() => handleSelectTab('batches')}
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
        return <SmartHivePage />;

      case 'quality':
        return <QualityAuthenticityPage />;

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
        return <ConsumerQRVerificationPage />;

      case 'settings':
        return <SettingsPage />;

      default:
        return (
          <DashboardPage
            onNavigateTab={handleSelectTab}
            onSelectBatchForTraceability={handleSelectBatchForTraceability}
          />
        );
    }
  };

  // If on landing entrance screen, render pure focused Home Page gateway
  if (activeTab === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => handleSelectTab('dashboard')}
        onEnterDemo={() => handleSelectTab('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#1e1035] flex font-sans selection:bg-yellow-300 selection:text-purple-950">
      
      {/* Left Application Sidebar */}
      <HoneychainSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
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
          onOpenMintModal={() => handleSelectTab('batches')}
          currentRole={currentRole || 'beekeeper'}
          onChangeRole={(r) => setCurrentRole(r as any)}
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
