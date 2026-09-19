import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnterApp?: () => void;
  onEnterDemo?: () => void;
  onSelectRole?: (role: string) => void;
  onOpenScanner?: () => void;
  onOpenProvenanceGraph?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onEnterDemo
}) => {
  const handleEnter = () => {
    if (onEnterApp) {
      onEnterApp();
    } else if (onEnterDemo) {
      onEnterDemo();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#faf8ff] text-[#1e1035] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden select-none">
      
      {/* Top Right Royal Bumblebee Sentinel Badge */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2.5 p-3 rounded-2xl bg-white/95 border border-purple-200 shadow-xl shadow-purple-900/10 select-none">
        <span className="text-3xl select-none">🐝</span>
        <div className="text-left">
          <span className="block text-[11px] font-black text-purple-950">Royal Bumblebee Sentinel</span>
          <span className="text-[9px] text-purple-700/80 font-mono">240 Hz Lavender Resonance</span>
        </div>
      </div>

      {/* Glowing Royal Purple & Yellow Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] bg-gradient-to-tr from-purple-200/40 via-yellow-200/35 to-transparent blur-[130px] rounded-full pointer-events-none" />

      {/* Center Content Stage */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        
        {/* Top Badge */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100/80 px-4 py-1.5 text-xs font-bold text-purple-900 shadow-xs">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>From Hive to Home — Every Drop Has a Digital Identity</span>
          </div>
        </div>

        {/* Grand Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-purple-950 leading-none">
          HONEY<span className="text-amber-500 drop-shadow-[0_0_24px_rgba(245,158,11,0.35)]">CHAIN</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-purple-950 leading-snug max-w-3xl mx-auto">
          "AI-Powered Smart Beekeeping. IoT-Driven Hive Intelligence. Blockchain-Backed Provenance."
        </p>

        {/* Single Yellow Action Button */}
        <div className="pt-4 flex items-center justify-center">
          <button
            type="button"
            onClick={handleEnter}
            className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 px-8 py-4 text-base font-black text-purple-950 transition-all shadow-xl shadow-yellow-500/30 hover:scale-105 active:scale-95 cursor-pointer border-2 border-yellow-200"
          >
            <Sparkles className="h-5 w-5 text-purple-950" />
            <span>Enter HoneyChain Platform</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default LandingPage;
