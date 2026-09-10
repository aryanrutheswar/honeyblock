import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { fetchStats, resetDemoState } from '../services/api';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  selectedHiveId: string;
  setSelectedHiveId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isJudgeMode: boolean;
  setIsJudgeMode: (active: boolean) => void;
  qrModalBatch: string | null;
  setQrModalBatch: (batchId: string | null) => void;
  stats: any;
  refreshStats: () => Promise<void>;
  resetSystem: () => Promise<void>;
  navigateToBatch: (batchId: string) => void;
  navigateToHive: (hiveId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('regulator');
  const [activeTab, setActiveTab] = useState<string>('command-center');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('HC-2026-AP-004821');
  const [selectedHiveId, setSelectedHiveId] = useState<string>('H-014');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isJudgeMode, setIsJudgeMode] = useState<boolean>(false);
  const [qrModalBatch, setQrModalBatch] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const refreshStats = async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  };

  useEffect(() => {
    refreshStats();
    // Check initial URL params for verify link
    const path = window.location.pathname;
    if (path.startsWith('/verify/')) {
      const batchId = path.replace('/verify/', '');
      if (batchId) {
        setSelectedBatchId(batchId);
        setActiveTab('consumer-passport');
      }
    }
  }, []);

  const resetSystem = async () => {
    try {
      await resetDemoState();
      await refreshStats();
      alert('HoneyChain state has been reset to pristine demonstration baseline.');
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveTab('consumer-passport');
  };

  const navigateToHive = (hiveId: string) => {
    setSelectedHiveId(hiveId);
    setActiveTab('smart-hives');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        selectedBatchId,
        setSelectedBatchId,
        selectedHiveId,
        setSelectedHiveId,
        searchQuery,
        setSearchQuery,
        isAssistantOpen,
        setIsAssistantOpen,
        isJudgeMode,
        setIsJudgeMode,
        qrModalBatch,
        setQrModalBatch,
        stats,
        refreshStats,
        resetSystem,
        navigateToBatch,
        navigateToHive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
