import React, { useEffect } from 'react';
import { soundManager } from '../utils/audio';
import {
  Sparkles,
  ArrowRight
} from 'lucide-react';

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
  // Lock body scroll while on landing page so no scrollbars or page scrolling occur
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleEnter = () => {
    soundManager.playEnterChime();
    if (onEnterApp) {
      onEnterApp();
    } else if (onEnterDemo) {
      onEnterDemo();
    }
  };

  return (
    <div className="relative w-full h-screen max-h-screen overflow-hidden bg-[#faf8ff] text-[#1e1035] flex flex-col items-center justify-between select-none">
      
      {/* Glowing Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-tr from-purple-200/40 via-yellow-200/35 to-transparent blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[400px] -left-40 w-[450px] h-[450px] bg-purple-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[400px] -right-40 w-[450px] h-[450px] bg-yellow-200/25 blur-[120px] rounded-full pointer-events-none" />

      {/* Invisible spacer to balance top */}
      <div className="h-4 sm:h-6 shrink-0" />

      {/* =========================================================================
          HERO SECTION (Centered vertically in viewport)
          ========================================================================= */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 space-y-6 sm:space-y-7 my-auto flex flex-col items-center justify-center">
        
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
        <p className="text-lg sm:text-2xl font-extrabold text-purple-950 leading-snug max-w-2xl mx-auto">
          "AI-Powered Smart Beekeeping. IoT-Driven Hive Intelligence. Blockchain-Backed Provenance."
        </p>

        {/* Primary Action Button */}
        <div className="pt-2 sm:pt-4 flex items-center justify-center">
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

      </section>

      {/* Compact Pinned Bottom Footer */}
      <footer className="relative z-10 w-full border-t border-purple-100/90 bg-white/80 backdrop-blur-md py-3 px-4 sm:px-8 text-center text-xs text-purple-900/60 font-medium shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-purple-950 text-yellow-300 flex items-center justify-center font-black text-[9px]">
              🐝
            </div>
            <span className="font-black text-purple-950 text-xs sm:text-sm">
              HONEY<span className="text-amber-500">CHAIN</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-purple-700/60">
              • Cryptographic Provenance Platform
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-purple-900/70 font-semibold">
            <span>NABL ISO/IEC 17025 Certified</span>
            <span>•</span>
            <span>Zero-Knowledge Proofs</span>
            <span>•</span>
            <span>Hyperledger Fabric Immutable Ledger</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
