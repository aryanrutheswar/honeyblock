import React, { useEffect } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import { CornerTechLines } from '../components/CornerTechLines';
import { stopAllCameraHardware } from '../utils/mediaManager';

import {
  Hexagon,
  ArrowRight,
  Lock
} from 'lucide-react';

export const AppIntroScreen: React.FC = () => {
  const { enterApp, setAppScreen } = useHoneychain();

  useEffect(() => {
    stopAllCameraHardware();
  }, []);



  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-transparent text-[#183018] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto overflow-hidden select-none">
      
      {/* Corner Technical Lines, Coordinates & Registration Marks */}
      <CornerTechLines />

      {/* Center Hero: Heading Alone + Get Started Button */}
      <div className="my-auto py-12 text-center max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Sleek Minimal Hexagon Monogram: Golden Amber to Pistachio Green */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#eab308] via-[#facc15] to-[#8da981] text-slate-950 shadow-2xl shadow-yellow-600/30">
          <Hexagon className="w-14 h-14 stroke-[2.2]" />
          <span className="absolute text-xl font-black tracking-tighter">HC</span>
        </div>

        {/* Crisp, Bold Heading Alone */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#183018] leading-none">
            HONEY<span className="text-amber-600">CHAIN</span>
          </h1>
          <p className="text-base sm:text-xl font-semibold text-[#233e22] max-w-2xl mx-auto tracking-tight leading-snug">
            A Blockchain-Based System for Honey Traceability & Smart Beekeeping Management
          </p>
          <div className="text-xs text-[#3e623c] font-mono tracking-wider pt-1">
            NILGIRI BIOSPHERE RESERVE • HYPERLEDGER FABRIC V2.5 • ZERO-KNOWLEDGE SNARKS
          </div>
        </div>

        {/* Center Prominent CTA Buttons */}
        <div className="pt-4 flex flex-col items-center justify-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={enterApp}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-yellow-500/30 hover:shadow-2xl hover:scale-103 transition-all active:scale-98 cursor-pointer"
            >
              <span>Explore Portals</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>

            <button
              onClick={() => setAppScreen('auth')}
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-[#d1e2cb] hover:bg-[#dbe8d5] text-[#183018] border border-[#8da981] hover:border-amber-500 font-bold text-base shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Sign In / Register</span>
            </button>
          </div>
          
          <span className="text-[11px] font-medium text-[#3e623c]">
            Click to choose your role • Beekeeper, Lab Inspector, or Customer
          </span>
        </div>

      </div>



      {/* Live Modals */}



    </div>
  );
};
