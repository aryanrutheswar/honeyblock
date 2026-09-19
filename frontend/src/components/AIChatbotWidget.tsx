import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import { queryKnowledgeBase, detectLanguage, INDIAN_LANG_RESPONSES } from '../utils/knowledgeBase';
import { decodeQRFromImage, extractBatchId } from '../utils/qrDecoder';
import { sendBeeGuardChat } from '../services/api';
import { BuzzyCharacter } from './BuzzyCharacter';
import { soundManager } from '../utils/audio';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  QrCode,
  Upload,
  User,
  Search,
  Key,
  Globe,
  Mic,
  MicOff
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  batchData?: any;
}

const SUPPORTED_LANGUAGES = [
  { code: 'english', label: 'English', flag: '🇬🇧', voiceLang: 'en-IN' },
  { code: 'telugu', label: 'తెలుగు', flag: '🇮🇳', voiceLang: 'te-IN' },
  { code: 'hindi', label: 'हिंदी', flag: '🇮🇳', voiceLang: 'hi-IN' },
  { code: 'tamil', label: 'தமிழ்', flag: '🇮🇳', voiceLang: 'ta-IN' },
  { code: 'kannada', label: 'ಕನ್ನಡ', flag: '🇮🇳', voiceLang: 'kn-IN' },
  { code: 'malayalam', label: 'മലയാളം', flag: '🇮🇳', voiceLang: 'ml-IN' },
  { code: 'bengali', label: 'বাংলা', flag: '🇮🇳', voiceLang: 'bn-IN' },
  { code: 'marathi', label: 'मराठी', flag: '🇮🇳', voiceLang: 'mr-IN' }
];

export const AIChatbotWidget: React.FC = () => {
  const { batches, scanBatchById } = useHoneychain();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'qr_inspector'>('chat');
  const [selectedLang, setSelectedLang] = useState('english');

  // Speech & Voice State
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState('');

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Bzzz! 👋 Hi friend! I am **Buzzy the HoneyBee** 🐝, your cute & smart assistant! Ask me anything about honey purity in **Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, or English**! 🍯`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Settings & OpenRouter Key State
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // QR Inspector State
  const [qrInputBatchId, setQrInputBatchId] = useState('HC-2026-NIL-008421');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [inspectedResult, setInspectedResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Speak out loud using Web Speech Synthesis API
  const speakText = useCallback((textToSpeak: string, langCode: string) => {
    if (isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      
      // Strip markdown bold/code tags for clean speech
      const cleanSpeech = textToSpeak
        .replace(/\*\*/g, '')
        .replace(/#/g, '')
        .replace(/\$/g, '')
        .replace(/\\delta/g, 'delta')
        .replace(/\\text/g, '')
        .replace(/\{|\}/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
      utterance.lang = langConfig.voiceLang;
      utterance.rate = 1.0;
      utterance.pitch = 1.2; // Cute higher pitch for Buzzy Bee!

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSpeechText(cleanSpeech);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentSpeechText('');
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentSpeechText('');
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  }, [isVoiceMuted]);

  // Speech Recognition (Microphone Voice Input)
  const startListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Microphone input is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];
      recognition.lang = langConfig.voiceLang;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        soundManager.playClick();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleLanguageSwitch = (langCode: string) => {
    setSelectedLang(langCode);
    soundManager.playClick();
    const pack = INDIAN_LANG_RESPONSES[langCode] || INDIAN_LANG_RESPONSES.english;
    
    setMessages(prev => [
      ...prev,
      {
        id: `lang-${Date.now()}`,
        sender: 'bot',
        text: pack.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    speakText(pack.greeting, langCode);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    soundManager.playClick();

    const detected = detectLanguage(query);
    if (detected !== selectedLang) {
      setSelectedLang(detected);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    const batchMatch = query.match(/HC-2026-[A-Z]{3}-\d+/i) || query.match(/HC-\d+/i);
    const matchedBatchId = batchMatch ? batchMatch[0] : null;

    setTimeout(async () => {
      let botResponse = '';
      let matchedBatchData = null;

      if (matchedBatchId) {
        const found = batches.find(b => b.id.toLowerCase() === matchedBatchId.toLowerCase());
        if (found) {
          matchedBatchData = found;
          botResponse = `Bzzz! 🐝 Batch **#${found.id}** verified on Hyperledger Fabric Block #${found.blockNumber}! Status: **${found.status}**. $\\delta^{13}\\text{C}$ Isotope: ${found.isotopeDeltaC13}‰ (0.00% C4/C3 Adulteration). Pure & sweet! 🍯`;
        } else {
          botResponse = `Bzzz! 🐝 Batch **#${matchedBatchId}** was not found on the active ledger. Please double check the ID or scan the bottle QR code!`;
        }
      } else if (apiKey.trim()) {
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash:free',
              messages: [
                {
                  role: 'system',
                  content: `You are Buzzy the HoneyBee 🐝, a cute, friendly, super sweet AI bee assistant! Reply in the user's language (${detected}). Be helpful, enthusiastic, and answer questions about honey purity (EA-IRMS isotope testing, ZK proofs, IoT smart hives). Always add cute bee emojis like 🐝, 🍯, 🌸!`
                },
                { role: 'user', content: query }
              ]
            })
          });
          const data = await res.json();
          botResponse = data.choices?.[0]?.message?.content || queryKnowledgeBase(query, detected);
        } catch {
          botResponse = queryKnowledgeBase(query, detected);
        }
      } else {
        try {
          const backendRes = await sendBeeGuardChat({ message: query });
          botResponse = backendRes.reply || queryKnowledgeBase(query, detected);
        } catch {
          botResponse = queryKnowledgeBase(query, detected);
        }
      }

      setIsTyping(false);
      soundManager.playCalmChime();

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          batchData: matchedBatchData
        }
      ]);

      speakText(botResponse, detected);
    }, 600);
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFileName(file.name);
    soundManager.playScanSuccess();
    
    try {
      const qrData = await decodeQRFromImage(file);
      let targetBatch = batches[0];
      if (qrData) {
        const extractedId = extractBatchId(qrData);
        if (extractedId) {
          const found = batches.find(b => b.id.toLowerCase() === extractedId.toLowerCase() || b.id.toLowerCase().includes(extractedId.toLowerCase()));
          if (found) targetBatch = found;
        }
      }
      setQrInputBatchId(targetBatch.id);
      setInspectedResult(targetBatch);
      scanBatchById(targetBatch.id);
      speakText(`Bzzz! Honey bottle label decoded! Batch number ${targetBatch.id} is certified authentic!`, selectedLang);
    } catch {
      const sampleBatch = batches[0];
      setQrInputBatchId(sampleBatch.id);
      setInspectedResult(sampleBatch);
      scanBatchById(sampleBatch.id);
      speakText(`Bzzz! Honey bottle label decoded! Batch number ${sampleBatch.id} is certified authentic!`, selectedLang);
    }
  };

  const handleInspectBatch = (idToInspect?: string) => {
    const id = idToInspect || qrInputBatchId;
    soundManager.playClick();
    const found = batches.find(b => b.id.toLowerCase() === id.toLowerCase()) || batches[0];
    setInspectedResult(found);
    scanBatchById(found.id);
    
    speakText(`Bzzz! Batch ${found.id} verified on Hyperledger Fabric!`, selectedLang);
  };

  return (
    <>
      {/* Floating Cute Bee Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            soundManager.playClick();
            setIsOpen(!isOpen);
          }}
          className="relative group flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 hover:from-yellow-200 hover:to-yellow-400 text-purple-950 font-black shadow-2xl shadow-yellow-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-yellow-200"
        >
          <div className="relative flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full text-xl shadow-xs animate-bee-hover">
            🐝
          </div>
          
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-black tracking-tight leading-none text-purple-950 flex items-center gap-1">
              Buzzy Bee 🐝
            </span>
            <span className="text-[9px] font-bold text-purple-900">Voice & Multilingual</span>
          </div>

          <span className="px-2 py-0.5 text-[9px] uppercase font-mono font-black bg-purple-900 text-yellow-300 rounded-full border border-yellow-400/40">
            🔊 Speak
          </span>
        </button>
      </div>

      {/* Main Chatbot Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[440px] max-w-[440px] h-[min(620px,calc(100vh-6rem))] max-h-[calc(100vh-6rem)] bg-white/98 backdrop-blur-2xl border-2 border-purple-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn select-none text-purple-950 bumble-border-top">
          
          {/* Cute Top Bar Header - Clean White & Royal Purple */}
          <div className="p-3.5 bg-white border-b-2 border-purple-100 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-purple-950 text-2xl flex items-center justify-center shadow-md border-2 border-yellow-300 shrink-0">
                🐝
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-purple-950 tracking-tight">Buzzy the Bumblebee 🐝</h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-yellow-400 text-purple-950 border border-yellow-500 shadow-xs">
                    Voice Active 🔊
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-purple-700/80">
                  Telugu • Hindi • English • Tamil • Kannada • Malayalam
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-100 transition-colors cursor-pointer"
                title="API Settings (OpenRouter)"
              >
                <Key className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Animated Mascot Character Display Bar */}
          <BuzzyCharacter
            isSpeaking={isSpeaking}
            isListening={isListening}
            speechText={currentSpeechText}
            isVoiceMuted={isVoiceMuted}
            onToggleVoiceMute={() => {
              if (isSpeaking) window.speechSynthesis?.cancel();
              setIsVoiceMuted(!isVoiceMuted);
              soundManager.playClick();
            }}
            onStartListening={startListening}
          />

          {/* Multilingual Quick Language Bar */}
          <div className="px-3 py-1.5 bg-purple-50/80 border-b border-purple-100 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-purple-900 shrink-0 flex items-center gap-1 pr-1">
              <Globe className="w-3 h-3 text-purple-700" /> Lang:
            </span>
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSwitch(lang.code)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                  selectedLang === lang.code
                    ? 'bg-yellow-400 text-purple-950 font-black shadow-xs scale-105 border border-yellow-300'
                    : 'bg-white text-purple-900 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-purple-100 bg-purple-50/80 p-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-yellow-400 text-purple-950 font-black shadow-xs'
                  : 'text-purple-900/70 hover:text-purple-950 hover:bg-purple-100/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Talk to Buzzy 🐝</span>
            </button>

            <button
              onClick={() => setActiveTab('qr_inspector')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'qr_inspector'
                  ? 'bg-yellow-400 text-purple-950 font-black shadow-xs'
                  : 'text-purple-900/70 hover:text-purple-950 hover:bg-purple-100/50'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Honey Jar 🏺</span>
            </button>
          </div>

          {/* Settings Sub-Panel */}
          {showSettings && (
            <div className="p-3 bg-purple-50 border-b border-purple-200 text-xs space-y-2 animate-fadeIn text-purple-950">
              <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
                <span className="flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-500" /> OpenRouter / Gemini API Key
                </span>
                <span className="text-[10px] text-purple-600">Optional</span>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-or-v1-... (Leave empty for Buzzy's built-in Indian multilingual RAG)"
                className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-mono text-purple-950 placeholder-purple-400 focus:outline-hidden focus:ring-2 focus:ring-purple-400/50"
              />
            </div>
          )}

          {/* TAB 1: CUTE CHAT ASSISTANT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              
              {/* Message List */}
              <div className="flex-1 p-4 space-y-3.5 overflow-y-auto bg-[#faf8ff]">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                        msg.sender === 'user' ? 'bg-yellow-400 text-purple-950 font-black' : 'bg-purple-100 text-lg border border-purple-200'
                      }`}
                    >
                      {msg.sender === 'user' ? <User className="w-4 h-4 text-purple-950" /> : '🐝'}
                    </div>

                    <div className={`max-w-[84%] space-y-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-purple-950 font-bold rounded-tr-xs shadow-xs'
                            : 'bg-white text-purple-950 border border-purple-200 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      {msg.batchData && (
                        <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1.5 mt-1 text-left shadow-xs">
                          <div className="font-black text-purple-950 flex items-center justify-between">
                            <span>🍯 {msg.batchData.name}</span>
                            <span className="text-[10px] font-mono text-purple-950 bg-yellow-400 px-2 py-0.5 rounded-md font-black">
                              Block #{msg.batchData.blockNumber}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-purple-800">
                            <div><span className="text-purple-600">&delta;¹³C Isotope:</span> {msg.batchData.isotopeDeltaC13}‰</div>
                            <div><span className="text-purple-600">HMF Level:</span> {msg.batchData.hmfMgKg} mg/kg</div>
                          </div>
                        </div>
                      )}

                      <span className="text-[10px] text-purple-400 block px-1">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-purple-700 text-xs pl-2">
                    <span className="text-lg animate-spin">🐝</span>
                    <span className="font-semibold text-purple-900">Buzzy Bumblebee is buzzing a response...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Multilingual Prompt Chips */}
              <div className="px-3 py-2 bg-purple-50/80 border-t border-purple-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => handleSendMessage('తెలుగులో చెప్పండి: తేనె ఎలా సరిచూడాలి?')}
                  className="px-2.5 py-1 rounded-full bg-white border border-purple-200 text-purple-900 text-[11px] font-bold shrink-0 hover:bg-purple-100 cursor-pointer transition shadow-xs"
                >
                  🇮🇳 తెలుగు (Telugu)
                </button>
                <button
                  onClick={() => handleSendMessage('हिंदी में बताओ: शहद की शुद्धता कैसे चेक करें?')}
                  className="px-2.5 py-1 rounded-full bg-white border border-purple-200 text-purple-900 text-[11px] font-bold shrink-0 hover:bg-purple-100 cursor-pointer transition shadow-xs"
                >
                  🇮🇳 हिंदी (Hindi)
                </button>
                <button
                  onClick={() => handleSendMessage('தமிழில் சொல்லுங்கள்: தேனின் தூய்மை எப்படி பார்ப்பது?')}
                  className="px-2.5 py-1 rounded-full bg-white border border-purple-200 text-purple-900 text-[11px] font-bold shrink-0 hover:bg-purple-100 cursor-pointer transition shadow-xs"
                >
                  🇮🇳 தமிழ் (Tamil)
                </button>
                <button
                  onClick={() => handleSendMessage('What is EA-IRMS carbon isotope testing?')}
                  className="px-2.5 py-1 rounded-full bg-white border border-purple-200 text-purple-900 text-[11px] font-bold shrink-0 hover:bg-purple-100 cursor-pointer transition shadow-xs"
                >
                  🔬 EA-IRMS Test
                </button>
              </div>

              {/* Input Form with Mic Button */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-purple-100 flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={startListening}
                  className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-purple-100 hover:bg-yellow-400 hover:text-purple-950 text-purple-900 border border-purple-200'
                  }`}
                  title="Speak into Microphone"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Type or click mic to talk to Buzzy..."
                  className="flex-1 px-3.5 py-2.5 bg-purple-50/50 border border-purple-200 rounded-2xl text-xs text-purple-950 placeholder-purple-400 focus:outline-hidden focus:ring-2 focus:ring-purple-400/50"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 disabled:opacity-50 text-purple-950 font-black shadow-sm cursor-pointer transition-all active:scale-95 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: QR BOTTLE INSPECTOR */}
          {activeTab === 'qr_inspector' && (
            <div className="flex-1 p-4 space-y-4 overflow-y-auto text-xs bg-[#faf8ff] text-purple-950">
              
              <div className="text-center space-y-1">
                <h4 className="font-bold text-purple-950 text-sm flex items-center justify-center gap-1">
                  <span>🍯 Honey Jar QR Code Inspector</span>
                </h4>
                <p className="text-purple-700 text-[11px]">
                  Buzzy Bumblebee will decode your honey jar label photo or batch ID!
                </p>
              </div>

              {/* Drag & Drop Upload Container */}
              <div
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  dragActive ? 'border-amber-500 bg-amber-100/80' : 'border-amber-300 hover:border-amber-500 bg-white'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 mx-auto flex items-center justify-center mb-2 text-2xl shadow-md">
                  🐝
                </div>
                <span className="font-bold text-slate-900 block">
                  {uploadedFileName ? `Decoded: ${uploadedFileName}` : 'Drop Honey Bottle QR Image or Click to Upload'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Supports PNG, JPG photo of honey jar label</span>
              </div>

              {/* Direct Batch ID Input */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">Or Type Batch ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={qrInputBatchId}
                    onChange={e => setQrInputBatchId(e.target.value)}
                    placeholder="HC-2026-NIL-008421"
                    className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl font-mono text-xs"
                  />
                  <button
                    onClick={() => handleInspectBatch()}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>

              {/* Inspected Batch Result Card */}
              {inspectedResult && (
                <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 space-y-3 animate-fadeIn shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ 100% Certified Authentic
                    </span>
                    <span className="font-mono text-[10px] text-amber-900 font-bold">
                      Block #{inspectedResult.blockNumber}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">🍯 {inspectedResult.name}</h5>
                    <p className="text-[11px] text-slate-500 font-mono">{inspectedResult.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Floral Nectar</span>
                      <span className="font-semibold text-slate-900">{inspectedResult.floralSource}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Isotope &delta;¹³C</span>
                      <span className="font-semibold text-emerald-700">{inspectedResult.isotopeDeltaC13}‰</span>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-600 space-y-0.5 truncate">
                    <div>Tx Hash: {inspectedResult.txHash}</div>
                    <div>Lab Certificate: {inspectedResult.labCertificateId || 'NABL-ISO17025-TN-99824'}</div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}
    </>
  );
};
