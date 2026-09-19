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
    <div className="relative flex flex-col items-center justify-center p-3 bg-gradient-to-b from-purple-50 via-white to-purple-50 border-b border-purple-200 select-none">
      
      {/* Bumblebee Striped Micro-Trim */}
      <div className="absolute top-0 left-0 right-0 h-1 bumble-stripes opacity-70" />

      {/* Voice & Microphone Quick Controls */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
        <button
          onClick={onStartListening}
          className={`p-1.5 rounded-full transition-all cursor-pointer shadow-xs ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-purple-100 hover:bg-yellow-400 hover:text-purple-950 text-purple-900 border border-purple-200'
          }`}
          title={isListening ? 'Listening to your voice...' : 'Speak with your Microphone'}
        >
          {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onToggleVoiceMute}
          className={`p-1.5 rounded-full transition-all cursor-pointer shadow-xs ${
            isVoiceMuted
              ? 'bg-purple-100 text-purple-400 border border-purple-200'
              : 'bg-yellow-400 text-purple-950 shadow-yellow-400/30 font-bold border border-yellow-300'
          }`}
          title={isVoiceMuted ? 'Voice output Muted' : 'Voice output Active (Speaking out loud)'}
        >
          {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Animated 2D Fluffy Bumblebee Graphic */}
      <div className="relative flex items-center justify-center py-2 group">
        
        {/* Left Shimmering Translucent Wing */}
        <div
          className={`absolute -left-6 top-1 w-8 h-10 rounded-full bg-gradient-to-tr from-white/90 via-yellow-100/70 to-cyan-100/40 border border-yellow-300/80 shadow-md shadow-yellow-400/20 transition-transform duration-100 origin-bottom-right ${
            wingFlap ? '-rotate-35 scale-y-115' : '-rotate-10 scale-y-95'
          }`}
        >
          {/* Wing Vein Detail */}
          <div className="absolute inset-1 rounded-full border-t border-r border-yellow-400/30 opacity-60" />
        </div>

        {/* Right Shimmering Translucent Wing */}
        <div
          className={`absolute -right-6 top-1 w-8 h-10 rounded-full bg-gradient-to-tl from-white/90 via-yellow-100/70 to-cyan-100/40 border border-yellow-300/80 shadow-md shadow-yellow-400/20 transition-transform duration-100 origin-bottom-left ${
            wingFlap ? 'rotate-35 scale-y-115' : 'rotate-10 scale-y-95'
          }`}
        >
          {/* Wing Vein Detail */}
          <div className="absolute inset-1 rounded-full border-t border-l border-yellow-400/30 opacity-60" />
        </div>

        {/* Plump Fuzzy Bumblebee Body */}
        <div className="relative w-18 h-18 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 border-3 border-purple-950 shadow-xl shadow-yellow-500/25 flex flex-col items-center justify-center overflow-hidden animate-bee-hover">
          
          {/* Fluffy Pollen Head Collar */}
          <div className="absolute top-0 w-full h-3 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 opacity-90" />

          {/* Bumblebee Royal Purple Stripe 1 */}
          <div className="absolute top-4.5 w-full h-2.5 bg-purple-950 shadow-inner" />
          
          {/* Bumblebee Bright Yellow Pollen Stripe */}
          <div className="absolute top-7 w-full h-2.5 bg-yellow-400" />

          {/* Bumblebee Royal Purple Stripe 2 */}
          <div className="absolute top-9.5 w-full h-3 bg-purple-950 shadow-inner" />

          {/* Cute Little Bumblebee Stinger at Bottom */}
          <div className="absolute -bottom-1 w-2.5 h-2.5 bg-purple-950 rotate-45 rounded-xs" />

          {/* Cute Fuzzy Antennae */}
          <div className="absolute -top-3.5 left-3 w-1.5 h-4.5 bg-purple-950 rounded-full flex flex-col items-center rotate-[-12deg]">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 border border-purple-950 shadow-xs animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -top-3.5 right-3 w-1.5 h-4.5 bg-purple-950 rounded-full flex flex-col items-center rotate-[12deg]">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 border border-purple-950 shadow-xs animate-ping" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
          </div>

          {/* Big Expressive Bumblebee Eyes with starry highlights */}
          <div className="relative z-10 flex items-center justify-center gap-3 mt-1.5">
            <div className="w-4 h-4 rounded-full bg-purple-950 border border-yellow-300/40 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-white -mt-1.5 -ml-1 shadow-sm" />
              <div className="w-0.5 h-0.5 rounded-full bg-yellow-200 mt-1 ml-1" />
            </div>
            <div className="w-4 h-4 rounded-full bg-purple-950 border border-yellow-300/40 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-white -mt-1.5 -ml-1 shadow-sm" />
              <div className="w-0.5 h-0.5 rounded-full bg-yellow-200 mt-1 ml-1" />
            </div>
          </div>

          {/* Sweet Rosy Cheeks */}
          <div className="relative z-10 flex items-center justify-between w-12 mt-0.5">
            <div className="w-2.5 h-1.5 rounded-full bg-rose-500/80 blur-[0.4px]" />
            <div className="w-2.5 h-1.5 rounded-full bg-rose-500/80 blur-[0.4px]" />
          </div>

          {/* Talking Mouth */}
          <div className="relative z-10 mt-0.5 flex justify-center">
            {mouthOpen ? (
              <div className="w-3.5 h-2.5 rounded-b-full bg-purple-950 border-t border-amber-600 animate-pulse" />
            ) : (
              <div className="w-2.5 h-1 rounded-full bg-purple-950" />
            )}
          </div>

        </div>

      </div>

      {/* Bumblebee Mascot Status Badge */}
      <div className="mt-1 flex items-center gap-1.5 text-[11px] font-black text-purple-950">
        <span className="flex items-center gap-1">
          <span>🐝</span> Buzzy the Bumblebee
        </span>
        {isSpeaking && (
          <span className="flex items-center gap-1 text-[10px] text-purple-950 bg-yellow-400 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse shadow-xs border border-yellow-500">
            <Sparkles className="w-3 h-3 text-purple-950" /> Buzzing...
          </span>
        )}
        {isListening && (
          <span className="flex items-center gap-1 text-[10px] text-white bg-red-600 px-2 py-0.5 rounded-full font-mono animate-pulse">
            <Mic className="w-3 h-3 text-white" /> Listening...
          </span>
        )}
      </div>

      {/* Active Speech Bubble */}
      {speechText && (
        <div className="mt-2 max-w-full px-3 py-1.5 rounded-2xl bg-yellow-400 text-purple-950 font-black border border-yellow-300 text-[11px] shadow-md text-center line-clamp-2 animate-fadeIn">
          💬 "{speechText}"
        </div>
      )}

    </div>
  );
};
