import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Sparkles } from 'lucide-react';

interface BuzzyCharacterProps {
  isSpeaking: boolean;
  isListening: boolean;
  speechText: string;
  isVoiceMuted: boolean;
  onToggleVoiceMute: () => void;
  onStartListening: () => void;
}

export const BuzzyCharacter: React.FC<BuzzyCharacterProps> = ({
  isSpeaking,
  isListening,
  speechText,
  isVoiceMuted,
  onToggleVoiceMute,
  onStartListening
}) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [wingFlap, setWingFlap] = useState(false);

  // Animated mouth movement while speaking
  useEffect(() => {
    let mouthInterval: ReturnType<typeof setInterval>;
    if (isSpeaking) {
      mouthInterval = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 160);
    } else {
      setMouthOpen(false);
    }
    return () => clearInterval(mouthInterval);
  }, [isSpeaking]);

  // Animated wings flapping
  useEffect(() => {
    const wingInterval = setInterval(() => {
      setWingFlap(prev => !prev);
    }, 220);
    return () => clearInterval(wingInterval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-3 bg-gradient-to-b from-amber-100/90 via-yellow-50 to-amber-100/70 border-b border-amber-200 select-none">
      
      {/* Voice & Microphone Quick Controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
        <button
          onClick={onStartListening}
          className={`p-1.5 rounded-full transition-all cursor-pointer shadow-xs ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-white hover:bg-amber-200 text-slate-800 border border-amber-300'
          }`}
          title={isListening ? 'Listening to your voice...' : 'Speak with your Microphone'}
        >
          {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onToggleVoiceMute}
          className={`p-1.5 rounded-full transition-all cursor-pointer shadow-xs ${
            isVoiceMuted
              ? 'bg-slate-200 text-slate-500'
              : 'bg-amber-500 text-white shadow-amber-500/30'
          }`}
          title={isVoiceMuted ? 'Voice output Muted' : 'Voice output Active (Speaking out loud)'}
        >
          {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Animated 2D Mascot Graphic */}
      <div className="relative flex items-center justify-center py-1 group">
        
        {/* Left Translucent Wing */}
        <div
          className={`absolute -left-5 top-1 w-7 h-9 rounded-full bg-white/70 border-2 border-amber-300 shadow-sm transition-transform duration-100 origin-bottom-right ${
            wingFlap ? '-rotate-25 scale-y-110' : '-rotate-5 scale-y-95'
          }`}
        />

        {/* Right Translucent Wing */}
        <div
          className={`absolute -right-5 top-1 w-7 h-9 rounded-full bg-white/70 border-2 border-amber-300 shadow-sm transition-transform duration-100 origin-bottom-left ${
            wingFlap ? 'rotate-25 scale-y-110' : 'rotate-5 scale-y-95'
          }`}
        />

        {/* Round Cute Bee Body */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-yellow-400 via-amber-400 to-amber-500 border-3 border-slate-900 shadow-lg flex flex-col items-center justify-center overflow-hidden animate-bounce">
          
          {/* Cute Stripes */}
          <div className="absolute top-4 w-full h-2 bg-slate-900" />
          <div className="absolute top-8 w-full h-2.5 bg-slate-900" />

          {/* Cute Antennae */}
          <div className="absolute -top-3 left-3 w-1.5 h-4 bg-slate-900 rounded-full flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900" />
          </div>
          <div className="absolute -top-3 right-3 w-1.5 h-4 bg-slate-900 rounded-full flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900" />
          </div>

          {/* Cute Eyes */}
          <div className="relative z-10 flex items-center justify-center gap-3.5 mt-2">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white -mt-1 -ml-1" />
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white -mt-1 -ml-1" />
            </div>
          </div>

          {/* Cute Rosy Cheeks */}
          <div className="relative z-10 flex items-center justify-between w-11 mt-0.5">
            <div className="w-2 h-1.5 rounded-full bg-red-400/80" />
            <div className="w-2 h-1.5 rounded-full bg-red-400/80" />
          </div>

          {/* Animated Mouth (talking effect) */}
          <div className="relative z-10 mt-0.5 flex justify-center">
            {mouthOpen ? (
              <div className="w-3 h-2.5 rounded-b-full bg-slate-900 animate-pulse border-t border-slate-700" />
            ) : (
              <div className="w-2.5 h-1 rounded-full bg-slate-900" />
            )}
          </div>

        </div>

      </div>

      {/* Buzzy Status Badge */}
      <div className="mt-1 flex items-center gap-1.5 text-[11px] font-black text-amber-950">
        <span>Buzzy the HoneyBee</span>
        {isSpeaking && (
          <span className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full font-mono animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-600" /> Speaking out loud...
          </span>
        )}
        {isListening && (
          <span className="flex items-center gap-1 text-[10px] text-red-700 bg-red-100 px-2 py-0.5 rounded-full font-mono animate-pulse">
            <Mic className="w-3 h-3 text-red-600" /> Listening...
          </span>
        )}
      </div>

      {/* Active Speech Bubble */}
      {speechText && (
        <div className="mt-2 max-w-full px-3 py-1.5 rounded-2xl bg-white border border-amber-300 text-[11px] text-slate-800 font-medium shadow-xs text-center line-clamp-2 animate-fadeIn">
          💬 "{speechText}"
        </div>
      )}

    </div>
  );
};
