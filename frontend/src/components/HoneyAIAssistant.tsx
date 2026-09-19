import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Search,
  Radio,
  FlaskConical,
  AlertTriangle,
  QrCode,
  Database,
  BarChart3,
  Bot,
  User,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  metaCard?: {
    type: 'batch' | 'hive' | 'alert' | 'blockchain';
    title: string;
    subtitle: string;
    status: string;
    details: Array<{ label: string; value: string }>;
  };
}

interface HoneyAIAssistantProps {
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const HoneyAIAssistant: React.FC<HoneyAIAssistantProps> = ({
  isOpenExternal,
  onCloseExternal,
  onNavigateTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync external open state if provided
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello! I am HoneyAI, your intelligent HoneyChain assistant. How can I help you manage your honey batches, monitor hives, or inspect lab authenticity today?',
      timestamp: 'Just now'
    }
  ]);

  const quickActions = [
    { label: 'Track my honey batch', query: 'Track my honey batch HC-2026-00124', icon: Search },
    { label: 'Check hive health', query: 'Why is Hive 03 showing an alert?', icon: Radio },
    { label: 'Explain quality results', query: 'Is my honey authentic? Explain NMR and isotope testing', icon: FlaskConical },
    { label: 'Show active alerts', query: 'What active alerts need my attention right now?', icon: AlertTriangle },
    { label: 'Verify a QR code', query: 'How does consumer QR verification prevent counterfeit honey?', icon: QrCode },
    { label: 'Explain blockchain record', query: 'How does the PBFT consensus ledger guarantee immutability?', icon: Database },
    { label: 'Summarise my analytics', query: 'Summarise current month honey production and quality pass rates', icon: BarChart3 }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = (text: string) => {
    if (isVoiceMuted || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    soundManager.playClick();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      let metaCard: ChatMessage['metaCard'] = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('hive 03') || (lower.includes('hive') && lower.includes('alert'))) {
        botResponse = 'Hive 03 has shown an unusual temperature increase (38.2°C) during the last 6 hours along with bio-acoustic frequencies rising to 480 Hz. I recommend checking the apiary ventilation and reviewing latest LoRaWAN telemetry.';
        metaCard = {
          type: 'hive',
          title: 'Hive 03: Temperature Spike',
          subtitle: 'Nilgiri Biosphere Apiary Node AP-NIL-01',
          status: 'INSPECTION RECOMMENDED',
          details: [
            { label: 'Current Temp', value: '38.2°C (High)' },
            { label: 'Acoustic Frequency', value: '480 Hz (Stress)' },
            { label: 'Scale Weight', value: '39.8 kg' },
            { label: 'Queen Status', value: 'Active' }
          ]
        };
      } else if (lower.includes('authentic') || lower.includes('hc-2026-00124') || lower.includes('track')) {
        botResponse = 'Batch HC-2026-00124 has passed all available authenticity checks! EA-IRMS carbon isotope mass spectrometry confirmed δ¹³C of -26.8‰ (0.00% C4 cane/corn syrup, 0.00% C3 rice syrup). Thermal freshness HMF is unheated at 8.2 mg/kg.';
        metaCard = {
          type: 'batch',
          title: 'Batch HC-2026-00124: Pure Raw Reserve',
          subtitle: 'Warangal Forest Multiflora & Teak Blossom',
          status: '100% CERTIFIED AUTHENTIC',
          details: [
            { label: 'Harvest Date', value: '12 Sep 2026' },
            { label: 'Moisture', value: '16.5% (Safe)' },
            { label: 'Isotope δ¹³C', value: '-26.8‰ (Natural)' },
            { label: 'Block Number', value: '#8421' }
          ]
        };
      } else if (lower.includes('explain quality') || lower.includes('nmr') || lower.includes('isotope')) {
        botResponse = 'HoneyChain applies two international gold-standard purity tests: \n\n1. **EA-IRMS Isotope Mass Spectrometry**: Detects C4 sugars (corn/sugar cane syrups) and C3 sugars (rice/beet syrups) by measuring carbon isotope ratio δ¹³C.\n\n2. **NMR Spectroscopy**: Creates a molecular magnetic resonance fingerprint to verify botanical floral origin and prove absence of synthetic thermal manipulation.';
      } else if (lower.includes('alert') || lower.includes('attention')) {
        botResponse = 'There are currently 2 active early warning alerts:\n\n• **Hive 03**: Temperature anomaly (38.2°C) at Nilgiri Apiary.\n• **Batch HC-2026-00127**: Moisture verification pending lab rerun.\n\nAll critical consensus peer nodes remain synchronized and 100% operational.';
        metaCard = {
          type: 'alert',
          title: 'Consortium Health: 2 Actionable Alerts',
          subtitle: 'Early Warning Sentinel Network',
          status: 'ATTENTION REQUIRED',
          details: [
            { label: 'High Priority', value: 'Hive 03 Temp' },
            { label: 'Medium Priority', value: 'Moisture Rerun' },
            { label: 'Consensus Peers', value: '4/4 Active' },
            { label: 'Ledger State', value: 'Verified' }
          ]
        };
      } else if (lower.includes('blockchain') || lower.includes('pbft') || lower.includes('ledger')) {
        botResponse = 'Every important honey transaction is securely recorded on our permissioned Hyperledger Fabric ledger using PBFT consensus. Records cannot be secretly altered, deleted, or backdated by any single participant.';
      } else if (lower.includes('analytics') || lower.includes('production') || lower.includes('summarise')) {
        botResponse = 'Current Analytics Summary:\n\n• **Total Production**: 4,280 kg harvested across 12 apiaries this month (+14% YoY).\n• **Quality Verification Rate**: 98.4% passed on first lab inspection.\n• **Active Smart Hives**: 52 hives transmitting bio-acoustic and environmental telemetry.';
      } else if (lower.includes('qr') || lower.includes('verify')) {
        botResponse = 'When a consumer scans the QR code or barcode on their honey bottle, HoneyChain fetches the immutable ledger record and displays the genuine floral nectar origin, harvest timestamp, and certified purity report with zero PII exposure.';
      } else {
        botResponse = `I understand you are asking about: "${query}". I can help track your batch, review IoT hive sensors, explain lab chemistry results, or display your blockchain audit trail. Which would you like to explore?`;
      }

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metaCard
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      speakText(botResponse);
    }, 600);
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 hover:from-purple-800 hover:to-purple-950 text-yellow-300 font-extrabold text-xs shadow-xl shadow-purple-950/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-yellow-400/80"
        >
          <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center text-xs">
            🍯
          </div>
          <span className="tracking-tight text-white">Ask HoneyAI</span>
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        </button>
      </div>

      {/* Slide-Over Drawer / Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] h-[min(600px,calc(100vh-6.5rem))] bg-white border border-purple-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn select-none">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800 text-white flex items-center justify-between shadow-xs shrink-0 border-b border-purple-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-800/80 border border-yellow-400/40 flex items-center justify-center text-lg shadow-xs text-yellow-300">
                🍯
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold tracking-tight text-white leading-none">
                    HoneyAI
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-yellow-400 text-purple-950">
                    Smart Assistant
                  </span>
                </div>
                <p className="text-[11px] text-purple-200 font-medium mt-0.5">
                  Your HoneyChain AI Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsVoiceMuted(!isVoiceMuted);
                }}
                className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title={isVoiceMuted ? 'Unmute Speech Output' : 'Mute Speech Output'}
              >
                {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Row */}
          <div className="px-3 py-2 bg-purple-50/50 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleSendMessage(action.query)}
                  className="px-2.5 py-1 rounded-full bg-white border border-purple-200 text-purple-950 hover:border-purple-400 hover:bg-purple-50 text-[11px] font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
                >
                  <Icon className="w-3 h-3 text-purple-600" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* Message List */}
          <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto bg-purple-50/20">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-purple-700 text-white'
                      : 'bg-white border border-purple-200 text-purple-900'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-yellow-500" />}
                </div>

                <div className={`max-w-[85%] space-y-1.5 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white font-medium rounded-tr-xs shadow-xs'
                        : 'bg-white text-purple-950 border border-purple-100 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Rich Meta Card if attached */}
                  {msg.metaCard && (
                    <div className="p-3 bg-white border border-purple-200 rounded-xl space-y-2 text-left shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-purple-950">{msg.metaCard.title}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-900 border border-yellow-300">
                          {msg.metaCard.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-purple-700/70">{msg.metaCard.subtitle}</p>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {msg.metaCard.details.map((d, idx) => (
                          <div key={idx} className="bg-purple-50/50 p-1.5 rounded-lg text-[10px]">
                            <span className="text-purple-900/60 block">{d.label}</span>
                            <span className="font-bold text-purple-950">{d.value}</span>
                          </div>
                        ))}
                      </div>

                      {onNavigateTab && (
                        <button
                          type="button"
                          onClick={() => {
                            if (msg.metaCard?.type === 'hive') onNavigateTab('smart-hive');
                            else if (msg.metaCard?.type === 'batch') onNavigateTab('traceability');
                            else if (msg.metaCard?.type === 'alert') onNavigateTab('alerts');
                          }}
                          className="w-full mt-1 py-1 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-[10px] font-bold text-purple-800 flex items-center justify-center gap-1 transition cursor-pointer border border-purple-100"
                        >
                          <span>Open in {msg.metaCard.type === 'hive' ? 'Smart Hives' : msg.metaCard.type === 'batch' ? 'Traceability' : 'Alerts'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-purple-900/40 font-mono px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-2 text-xs text-purple-700 bg-white border border-purple-100 rounded-xl w-fit">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium ml-1">HoneyAI is reasoning...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Voice Controls Footer */}
          <div className="p-3 bg-white border-t border-purple-100 shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isListening
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                    : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to speak'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask HoneyAI about batches, hives, or quality..."
                className="flex-1 px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-purple-950 placeholder:text-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-purple-950 font-bold disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
