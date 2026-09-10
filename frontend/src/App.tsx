import React from 'react';
import { HoneychainProvider, useHoneychain } from './context/HoneychainContext';
import { HoneychainNavbar } from './components/HoneychainNavbar';
import { BiometricModal } from './components/BiometricModal';

// Screens
import { AppIntroScreen } from './pages/AppIntroScreen';
import { RoleSelectionScreen } from './pages/RoleSelectionScreen';
import { BeekeeperPortal } from './pages/BeekeeperPortal';
import { LabInspectorPortal } from './pages/LabInspectorPortal';
import { CustomerScannerPortal } from './pages/CustomerScannerPortal';
import { AdminPortal } from './pages/AdminPortal';
import { AuthPage } from './pages/AuthPage';

import { ShieldCheck, Sparkles } from 'lucide-react';

const HoneychainMainLayout: React.FC = () => {
  const { appScreen, currentRole } = useHoneychain();

  const renderActiveScreen = () => {
    if (appScreen === 'intro') {
      return <AppIntroScreen />;
    }

    if (appScreen === 'role_select') {
      return <RoleSelectionScreen />;
    }

    if (appScreen === 'auth') {
      return <AuthPage />;
    }

    // Portal Screen with Strict Role Isolation
    switch (currentRole) {
      case 'beekeeper':
        return <BeekeeperPortal />;
      case 'inspector':
        return <LabInspectorPortal />;
      case 'customer':
        return <CustomerScannerPortal />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <RoleSelectionScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#bdd2b3] text-[#183018] selection:bg-yellow-400 selection:text-slate-950">
      
      {/* Top App Navbar */}
      <HoneychainNavbar />

      {/* Main Dynamic Screen */}
      <main className="flex-1 w-full">
        {renderActiveScreen()}
      </main>

      {/* Biometric Verification Modal */}
      <BiometricModal />

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
