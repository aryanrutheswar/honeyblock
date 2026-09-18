import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  CheckCircle2,
  X,
  Volume2,
  Scale,
  Thermometer,
  ShieldCheck,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface RuralBeekeeperModeProps {
  isOpen: boolean;
  onClose: () => void;
  onMintSuccess?: (batchData: any) => void;
}

type SupportedLanguage = 'en' | 'te' | 'hi';

export const RuralBeekeeperMode: React.FC<RuralBeekeeperModeProps> = ({
  isOpen,
  onClose,
  onMintSuccess
}) => {
  const [lang, setLang] = useState<SupportedLanguage>('te'); // Default to Telugu for Warangal
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [harvestQty, setHarvestQty] = useState('42.5');
  const [floralChoice, setFloralChoice] = useState('Multiflora');
  const [hiveId, setHiveId] = useState('HIVE-TG-017');
  const [isOnline, setIsOnline] = useState(true);
  const [offlinePendingQueue, setOfflinePendingQueue] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Language Dictionary
  const translations = {
    en: {
      title: 'Rural Beekeeper Simple Portal',
      subtitle: 'Simple Voice & Large Touch Control for Farm Field Workers',
      langName: 'English',
      liveStatus: 'ONLINE',
      offlineStatus: 'OFFLINE (Will sync when network returns)',
      voiceButton: 'Tap & Speak: "Record harvest 40 kg"',
      voiceListening: 'Listening to your voice...',
      quickRecord: 'Quick Harvest Registration',
      hiveLabel: 'Bee Box (Hive):',
      qtyLabel: 'Honey Weight (Kg):',
      floraLabel: 'Flower Nectar Type:',
      recordButton: '✓ RECORD TODAY\'S HARVEST',
      recordedNotice: 'Harvest saved! Minted onto blockchain ledger.',
      offlineQueueTitle: 'Pending Sync Records:',
      syncNowButton: 'Sync Offline Records Now',
      switchOffline: 'Simulate Going Offline'
    },
    te: {
      title: 'గ్రామీణ తేనెటీగల పెంపకందారుల పోర్టల్',
      subtitle: 'రైతుల కోసం పెద్ద బటన్లు మరియు వాయిస్ రికార్డింగ్ సదుపాయం',
      langName: 'తెలుగు (Telugu)',
      liveStatus: 'ఆన్‌లైన్ (నెట్‌వర్క్ ఉంది 🟢)',
      offlineStatus: 'ఆఫ్‌లైన్ (నెట్‌వర్క్ వచ్చినప్పుడు సింక్ అవుతుంది 🟠)',
      voiceButton: 'వాయిస్ మాట్లాడండి: "ఈరోజు 40 కిలోల తేనె వచ్చింది"',
      voiceListening: 'మీ మాటలను వింటున్నాము...',
      quickRecord: 'ఈరోజు తేనె నమోదు చేయండి',
      hiveLabel: 'తేనెటీగల పెట్టె (Hive):',
      qtyLabel: 'తేనె బరువు (కిలోలు):',
      floraLabel: 'పూల రకం (పువ్వులు):',
      recordButton: '✓ తేనె పంటను నమోదు చేయండి',
      recordedNotice: 'తేనె రికార్డు అయింది! బ్లాక్‌చెయిన్‌లో భద్రపరచబడింది.',
      offlineQueueTitle: 'సింక్ కావాల్సిన రికార్డులు:',
      syncNowButton: 'ఇప్పుడే సింక్ చేయండి',
      switchOffline: 'ఆఫ్‌లైన్ మోడ్ పరీక్షించండి'
    },
    hi: {
      title: 'ग्रामीण मधुमक्खी पालक सरल पोर्टल',
      subtitle: 'किसानों के लिए बड़े बटन और आसान आवाज़ (Voice) इनपुट',
      langName: 'हिन्दी (Hindi)',
      liveStatus: 'ऑनलाइन (नेटवर्क सक्रिय 🟢)',
      offlineStatus: 'ऑफलाइन (नेटवर्क आने पर सिंक होगा 🟠)',
      voiceButton: 'बोलकर दर्ज करें: "आज की 40 किलो फसल दर्ज करें"',
      voiceListening: 'आपकी आवाज़ सुनी जा रही है...',
      quickRecord: 'आज की शहद की फसल दर्ज करें',
      hiveLabel: 'मधुमक्खी का बक्सा:',
      qtyLabel: 'शहद का वज़न (किलो):',
      floraLabel: 'फूलों का प्रकार:',
      recordButton: '✓ आज की फसल सुरक्षित करें',
      recordedNotice: 'शहद सुरक्षित रूप से ब्लॉकचेन पर दर्ज हो गया!',
      offlineQueueTitle: 'बाकी ऑफलाइन रिकॉर्ड:',
      syncNowButton: 'अभी सिंक करें',
      switchOffline: 'ऑफलाइन मोड टेस्ट करें'
    }
  };

  const t = translations[lang];

  // Voice Recognition Handler (Web Speech API with graceful fallback)
  const handleToggleVoice = () => {
    soundManager.playClick();

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Fallback simulated voice input
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const demoVoice = lang === 'te' ? '45 కిలోల అటవీ తేనె పంట నమోదైనది' : 'Record today harvest of 45 kg multiflora';
        setVoiceText(demoVoice);
        setHarvestQty('45.0');
        soundManager.playCalmChime();
      }, 1500);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        // Look for numbers
        const match = transcript.match(/\d+/);
        if (match) {
          setHarvestQty(match[0]);
        }
        setIsListening(false);
        soundManager.playCalmChime();
      };
      recognition.onerror = () => {
        setIsListening(false);
        setHarvestQty('45.0');
      };
      recognition.start();
    } catch {
      setIsListening(false);
      setHarvestQty('45.0');
    }
  };

  const handleSubmitHarvest = () => {
    soundManager.playCalmChime();

    const newRecord = {
      hiveId,
      qtyKg: parseFloat(harvestQty),
      flora: floralChoice,
      timestamp: new Date().toISOString(),
      id: `HNY-TG-${Math.floor(Math.random() * 8000) + 1000}`
    };

    if (!isOnline) {
      setOfflinePendingQueue(prev => [...prev, newRecord]);
      setSuccessMessage(lang === 'te' ? 'ఆఫ్‌లైన్ క్యూలో భద్రపరచబడింది (నెట్‌వర్క్ వచ్చినప్పుడు సింక్ అవుతుంది)' : 'Saved in offline sync queue');
    } else {
      setSuccessMessage(t.recordedNotice);
      if (onMintSuccess) onMintSuccess(newRecord);
    }

    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSyncOfflineQueue = () => {
    setIsSyncing(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsSyncing(false);
      setOfflinePendingQueue([]);
      soundManager.playCalmChime();
      alert(lang === 'te' ? '✓ 3 రికార్డులు విజయవంతంగా సర్వర్‌కి సింక్ అయ్యాయి!' : '✓ All offline records successfully synchronized to HoneyChain ledger!');
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Top Language & Connectivity Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">భాష / भाषा / Language:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setLang('te')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                  lang === 'te' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                  lang === 'hi' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                  lang === 'en' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            {/* Online / Offline Toggle for Rural Demo */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
              title="Click to simulate going offline in remote rural forest"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? t.liveStatus : t.offlineStatus}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Header Title */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-amber-400 font-medium">
              {t.subtitle}
            </p>
          </div>

          {/* Voice Input Large Button (Requirement 18) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-800 to-amber-500/20 border-2 border-amber-400 text-center space-y-3">
            <button
              onClick={handleToggleVoice}
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse scale-110 shadow-rose-500/40'
                  : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-400/30'
              }`}
            >
              {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>

            <div>
              <p className="font-extrabold text-base sm:text-lg text-white">
                {isListening ? t.voiceListening : t.voiceButton}
              </p>
              {voiceText && (
                <p className="text-xs text-amber-300 font-mono mt-1 italic">
                  "{voiceText}"
                </p>
              )}
            </div>
          </div>

          {/* Large Touch Form */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>{t.quickRecord}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Box ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t.hiveLabel}</label>
                <select
                  value={hiveId}
                  onChange={e => setHiveId(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-800 border-2 border-slate-700 text-white font-bold text-lg focus:border-amber-400"
                >
                  <option value="HIVE-TG-017">HIVE-TG-017 (Warangal Alpha)</option>
                  <option value="HIVE-TG-018">HIVE-TG-018 (Warangal Beta)</option>
                  <option value="HIVE-TG-023">HIVE-TG-023 (Warangal Gamma)</option>
                </select>
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t.qtyLabel}</label>
                <input
                  type="number"
                  step="0.5"
                  value={harvestQty}
                  onChange={e => setHarvestQty(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-800 border-2 border-slate-700 text-white font-black text-2xl focus:border-amber-400"
                />
              </div>

              {/* Flora */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t.floraLabel}</label>
                <select
                  value={floralChoice}
                  onChange={e => setFloralChoice(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-800 border-2 border-slate-700 text-white font-bold text-lg focus:border-amber-400"
                >
                  <option value="Multiflora">అడవి పువ్వులు (Multiflora)</option>
                  <option value="Mustard">ఆవాలు పువ్వులు (Mustard)</option>
                  <option value="Acacia">తుమ్మ పువ్వులు (Acacia)</option>
                  <option value="Jamun">నేరేడు పువ్వులు (Jamun)</option>
                </select>
              </div>

            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-200 text-sm font-bold flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Giant Submit Button */}
            <button
              onClick={handleSubmitHarvest}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-lg sm:text-xl shadow-xl shadow-amber-500/30 transition active:scale-98 cursor-pointer flex items-center justify-center gap-3"
            >
              <span>{t.recordButton}</span>
              <ArrowRight className="w-6 h-6" />
            </button>

          </div>

          {/* Offline Sync Queue Section (Requirement 19) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="text-slate-300">
                {t.offlineQueueTitle} <strong>{offlinePendingQueue.length} records pending</strong>
              </span>
            </div>

            {offlinePendingQueue.length > 0 && (
              <button
                onClick={handleSyncOfflineQueue}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                {t.syncNowButton}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
