import React, { useState } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import { soundManager } from '../utils/audio';
import { stopAllCameraHardware } from '../utils/mediaManager';

import {
  ShieldCheck,
  ShieldAlert,
  Hexagon,
  Cpu,
  UserCheck,
  Eye,
  ArrowLeft,
  ArrowRight,
  Database,
  Lock,
  X
} from 'lucide-react';

export const HoneychainNavbar: React.FC = () => {
  const { appScreen, currentRole, goToRoleSelect, goBack, enterApp, isBackendConnected, setAppScreen } = useHoneychain();


  const getRoleBadge = () => {
    switch (currentRole) {
      case 'beekeeper':
        return {
          title: 'Beekeeper Portal',
          subtitle: 'Apiary IoT Telemetry & Minting',
          icon: <Cpu className="w-3.5 h-3.5 text-amber-600" />
        };
      case 'inspector':
        return {
          title: 'Lab Inspector Terminal',
          subtitle: 'EA-IRMS Isotope & HMF Analysis',
          icon: <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
        };
      case 'customer':
        return {
          title: 'Customer Verification',
          subtitle: 'Live Camera & ZK-Passport',
          icon: <Eye className="w-3.5 h-3.5 text-emerald-600" />
        };
      case 'admin':
        return {
          title: 'System Admin Console',
          subtitle: 'Enterprise Governance & Security',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
        };
      default:
        return null;
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#bdd2b3]/95 backdrop-blur-md border-b border-[#8da981] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left Side: Exit Camera (placed at far-left corner per diagram) + Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4 relative z-30">
          {currentRole === 'customer' && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                stopAllCameraHardware();
                goToRoleSelect();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-extrabold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/30 border border-rose-400/40 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              title="Exit camera mode and return to role selection"
            >
              <X className="w-4 h-4 text-white" />
              <span>Exit Camera</span>
            </button>
          )}

          {/* Brand Logo: Golden Amber blending into Pistachio Green */}
          <div 
            onClick={() => {
              soundManager.playClick();
              stopAllCameraHardware();
              goToRoleSelect();
            }}
            className="flex items-center gap-3 cursor-pointer select-none hover:opacity-90 transition-opacity"
            title="Go to Role Selection"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#eab308] via-[#facc15] to-[#8da981] text-slate-950 shadow-md shadow-yellow-600/30">
              <Hexagon className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute text-[11px] font-black tracking-tighter">HC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#183018]">
                  HONEY<span className="text-amber-600">CHAIN</span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#2f482d] hidden sm:block">
                Zero-Knowledge Provenance & Pure Honey Cryptographic Ledger
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 relative z-30">
          
          {/* Universal Back Button */}
          {appScreen !== 'intro' && currentRole !== 'customer' && (
            <button
              type="button"
              onClick={() => {
                stopAllCameraHardware();
                goBack();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all shadow-xs active:scale-95 cursor-pointer z-30 bg-[#d1e2cb] hover:bg-[#dbe8d5] text-[#183018] border border-[#8da981]"
              title="Go back to previous screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {/* Always Accessible Home Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              stopAllCameraHardware();
              goToRoleSelect();
              setAppScreen('intro');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              appScreen === 'intro'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-md shadow-yellow-500/25'
                : 'bg-[#d1e2cb] hover:bg-[#dbe8d5] text-[#183018] hover:text-black border border-[#8da981] shadow-xs'
            }`}
          >
            <span>Welcome Home</span>
          </button>

          {/* Sign In / Auth Reference Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              stopAllCameraHardware();
              goToRoleSelect();
              setAppScreen('auth');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              appScreen === 'auth'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-md shadow-yellow-500/25'
                : 'bg-[#d1e2cb] hover:bg-[#dbe8d5] text-[#183018] hover:text-black border border-[#8da981] shadow-xs'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Sign In</span>
          </button>

          {/* Inside a Specific Portal Dashboard */}
          {appScreen === 'portal' && currentRole && badge && (
            <>
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#8da981]">
                <div className="flex flex-col text-right">
                  <span className="font-bold text-[#183018] flex items-center gap-1.5">
                    {badge.icon} {badge.title}
                  </span>
                  <span className="text-[10px] text-[#2f482d]">{badge.subtitle}</span>
                </div>
              </div>

              {/* Right Role Switch (only when NOT customer, since Exit Camera is on far-left corner per diagram) */}
              {currentRole !== 'customer' && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    stopAllCameraHardware();
                    goToRoleSelect();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer bg-[#d1e2cb] hover:bg-[#dbe8d5] hover:text-black text-[#183018] border border-[#8da981]"
                  title="Switch role"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Switch Role</span>
                </button>
              )}
            </>
          )}

          {/* On Intro Screen */}
          {appScreen === 'intro' && (
            <button
              onClick={enterApp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-md shadow-yellow-500/30 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </div>


    </header>
  );
};
