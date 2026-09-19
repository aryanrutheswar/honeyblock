import React, { useState } from 'react';
import { HoneychainProvider, useHoneychain } from './context/HoneychainContext';
import { HoneychainNavbar } from './components/HoneychainNavbar';
import { BiometricModal } from './components/BiometricModal';
import { AIChatbotWidget } from './components/AIChatbotWidget';

// Pages
import { LandingPage } from './pages/LandingPage';
import { JudgeDemoFlowPage } from './pages/JudgeDemoFlowPage';
import { BeekeeperPortal } from './pages/BeekeeperPortal';
import { AdminPortal } from './pages/AdminPortal';
import { LabInspectorPortal } from './pages/LabInspectorPortal';
import { CustomerScannerPortal } from './pages/CustomerScannerPortal';
import { BlockchainExplorer } from './pages/BlockchainExplorer';
import { VerifiedBuyerPortal } from './pages/VerifiedBuyerPortal';
import { RoleSelectionScreen } from './pages/RoleSelectionScreen';
import { AuthPage } from './pages/AuthPage';

// Specialized Interactive Modals
import { TraceabilityGraphModal } from './components/TraceabilityGraphModal';
import { IoTSensorSimulatorModal } from './components/IoTSensorSimulatorModal';
import { ExplainableAiModal } from './components/ExplainableAiModal';
import { WhatIfYieldSimulator } from './components/WhatIfYieldSimulator';
import { RuralBeekeeperMode } from './components/RuralBeekeeperMode';
import { BeekeeperWalletModal } from './components/BeekeeperWalletModal';
import { QrCounterfeitDetectorModal } from './components/QrCounterfeitDetectorModal';
import { DigitalCertificateModal } from './components/DigitalCertificateModal';

const HoneychainMainLayout: React.FC = () => {
  const { appScreen, currentRole, setAppScreen, setCurrentRole } = useHoneychain();
  const [activeView, setActiveView] = useState<string>('landing');

  // Specialized Modals State
  const [isProvenanceGraphOpen, setIsProvenanceGraphOpen] = useState(false);
  const [isIoTSimulatorOpen, setIsIoTSimulatorOpen] = useState(false);
  const [isExplainableAiOpen, setIsExplainableAiOpen] = useState(false);
  const [isYieldSimulatorOpen, setIsYieldSimulatorOpen] = useState(false);
  const [isRuralModeOpen, setIsRuralModeOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isQrDetectorOpen, setIsQrDetectorOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const handleNavigateView = (view: string) => {
    setActiveView(view);
    if (view === 'beekeeper') {
      setCurrentRole('beekeeper');
      setAppScreen('portal');
    } else if (view === 'admin') {
      setCurrentRole('admin');
      setAppScreen('portal');
    } else if (view === 'inspector') {
      setCurrentRole('inspector');
      setAppScreen('portal');
    } else if (view === 'customer') {
      setCurrentRole('customer');
      setAppScreen('portal');
    } else if (view === 'auth') {
      setAppScreen('auth');
    } else if (view === 'role_select') {
      setAppScreen('role_select');
    }
  };

  const renderActiveView = () => {
    // Direct modal/page overrides
    if (activeView === 'judge-demo') {
      return (
        <JudgeDemoFlowPage
          onNavigateToTab={handleNavigateView}
          onOpenProvenanceGraph={() => setIsProvenanceGraphOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
        />
      );
    }

    if (activeView === 'blockchain') {
      return <BlockchainExplorer />;
    }

    if (activeView === 'marketplace') {
      return <VerifiedBuyerPortal />;
    }

    if (activeView === 'beekeeper') {
      return <BeekeeperPortal />;
    }

    if (activeView === 'admin') {
      return <AdminPortal />;
    }

    if (activeView === 'inspector') {
      return <LabInspectorPortal />;
    }

    if (activeView === 'customer') {
      return <CustomerScannerPortal />;
    }

    if (appScreen === 'auth' || activeView === 'auth') {
      return <AuthPage />;
    }

    if (appScreen === 'role_select' || activeView === 'role_select') {
      return <RoleSelectionScreen />;
    }

    // Default Landing Page
    return (
      <LandingPage
        onEnterDemo={() => setActiveView('judge-demo')}
        onSelectRole={(role) => handleNavigateView(role)}
        onOpenScanner={() => handleNavigateView('customer')}
        onOpenProvenanceGraph={() => setIsProvenanceGraphOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#1e1035] selection:bg-yellow-300 selection:text-purple-950">
      
      {/* Universal Top App Navbar */}
      <HoneychainNavbar
        currentActiveView={activeView}
        onNavigateView={handleNavigateView}
        onOpenJudgeDemo={() => setActiveView('judge-demo')}
        onOpenProvenanceGraph={() => setIsProvenanceGraphOpen(true)}
        onOpenIoTSimulator={() => setIsIoTSimulatorOpen(true)}
        onOpenExplainableAi={() => setIsExplainableAiOpen(true)}
        onOpenYieldSimulator={() => setIsYieldSimulatorOpen(true)}
        onOpenRuralMode={() => setIsRuralModeOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenQrDetector={() => setIsQrDetectorOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Floating Innovation Toolbar (Quick Modals Launch for Judges) */}
      <aside aria-label="Demo tools" className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-30 items-center gap-1.5 p-2 rounded-2xl bg-white/95 border-2 border-purple-200 shadow-xl shadow-purple-900/10 backdrop-blur-md text-xs font-bold text-purple-950 bumble-border-top">
        <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 px-2 flex items-center gap-1">
          <span>🐝</span> Tools:
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
          IoT Simulator
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
          Rural Voice Mode
        </button>
        <button
          type="button"
          onClick={() => setIsWalletOpen(true)}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 hover:text-purple-950 transition cursor-pointer text-purple-900/80 font-semibold"
        >
          Beekeeper Wallet
        </button>
        <button
          type="button"
          onClick={() => setIsQrDetectorOpen(true)}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 hover:text-purple-950 transition cursor-pointer text-purple-900/80 font-semibold"
        >
          QR Clone Detector
        </button>
        <button
          type="button"
          onClick={() => setIsCertificateOpen(true)}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 hover:text-purple-950 transition cursor-pointer text-purple-900/80 font-semibold"
        >
          Digital Certificate
        </button>
      </aside>

      {/* Main Dynamic Screen View */}
      <main className="flex-1 w-full pb-16 lg:pb-24">
        {renderActiveView()}
      </main>

      {/* Universal Specialized Modals */}
      <TraceabilityGraphModal
        isOpen={isProvenanceGraphOpen}
        onClose={() => setIsProvenanceGraphOpen(false)}
        batchId="HNY-TG-2026-0001"
      />

      <IoTSensorSimulatorModal
        isOpen={isIoTSimulatorOpen}
        onClose={() => setIsIoTSimulatorOpen(false)}
        hiveId="HIVE-TG-017"
      />

      <ExplainableAiModal
        isOpen={isExplainableAiOpen}
        onClose={() => setIsExplainableAiOpen(false)}
        hiveId="HIVE-TG-017"
      />

      <WhatIfYieldSimulator
        isOpen={isYieldSimulatorOpen}
        onClose={() => setIsYieldSimulatorOpen(false)}
        hiveId="HIVE-TG-017"
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
        batchId="HNY-TG-2026-0001"
      />

      <DigitalCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      <BiometricModal />

      {/* Interactive Bumblebee AI Companion Widget */}
      <AIChatbotWidget />

    </div>
  );
};

export function App() {
  return (
    <HoneychainProvider>
      <HoneychainMainLayout />
    </HoneychainProvider>
  );
}

export default App;
