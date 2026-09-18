import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Activity,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  ShieldCheck,
  UserCheck,
  Info,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ExplainableAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiveId?: string;
}

export const ExplainableAiModal: React.FC<ExplainableAiModalProps> = ({
  isOpen,
  onClose,
  hiveId = 'HIVE-TG-017'
}) => {
  const [activeTab, setActiveTab] = useState<'health_engine' | 'bio_acoustics' | 'pest_detection'>('health_engine');
  
  // Image Pest Detection State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<{
    pestType: string;
    confidence: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    evidence: string[];
    recommendedAction: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleAnalyzeSample = (type: 'varroa' | 'healthy') => {
    setIsAnalyzing(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsAnalyzing(false);
      if (type === 'varroa') {
        setSelectedImage('https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80');
        setDetectionResult({
          pestType: 'Varroa Destructor Mite Infestation',
          confidence: 78.4,
          severity: 'HIGH',
          evidence: [
            'Micro-scale oval mite body patterns detected on 4 pupal brood caps.',
            'Acoustic sensor telemetry corroborates queen piping rhythm suppression.',
            'Worker bee grooming frequency reduction noted in last 48 hours.'
          ],
          recommendedAction: 'Apply organic oxalic acid vapor or thymol strip treatment within 48 hours. Assign cluster field officer for verification inspection.'
        });
      } else {
        setSelectedImage('https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=600&q=80');
        setDetectionResult({
          pestType: 'Healthy Brood Comb Pattern',
          confidence: 94.2,
          severity: 'LOW',
          evidence: [
            'Concentric circular laying pattern with zero punctured cappings.',
            'Uniform nurse bee density over open larval cells.',
            'Brood temperature stability recorded at 34.2°C.'
          ],
          recommendedAction: 'No intervention required. Continue routine periodic sensor telemetry monitoring.'
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Explainable AI Hive Health & Bio-Acoustics Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Decision-Support Prototype
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent factor attribution and acoustic pattern risk signals for beekeepers & entomologists
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/50">
          <button
            onClick={() => setActiveTab('health_engine')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'health_engine'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            01. Explainable Health Score (Why?)
          </button>
          <button
            onClick={() => setActiveTab('bio_acoustics')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'bio_acoustics'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            02. Bio-Acoustic Spectrogram (240 Hz)
          </button>
          <button
            onClick={() => setActiveTab('pest_detection')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'pest_detection'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            03. AI Vision Varroa / Pest Detection
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: EXPLAINABLE HEALTH SCORE */}
          {activeTab === 'health_engine' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Score Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                    COMPOSITE COLONY HEALTH SCORE
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-5xl font-black text-white">82</span>
                    <span className="text-lg text-slate-400 font-bold">/ 100</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      STABLE EQUILIBRIUM
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
                    <strong>AI Decision Interpretation:</strong> Hive appears stable with optimal brood thermoregulation (34.2°C). Steady positive weight trajectory (+380g/day) indicates active multiflora nectar accumulation without robbing or swarming stress.
                  </p>
                </div>

                <div className="w-full md:w-64 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 shrink-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Operational Recommendation
                  </span>
                  <p className="text-emerald-300 font-semibold leading-snug">
                    ✓ Next scheduled physical check in 7 days.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Super frames reaching 85% capping. Prepare extraction tare scale.
                  </p>
                </div>
              </div>

              {/* Factor Contribution Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Factor Contribution Breakdown (Why is the score 82?)
                  </h4>
                  <span className="text-xs text-slate-400">
                    Transparent SHAP-style attribution weights
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-white">Brood Temperature Stability</span>
                      <p className="text-xs text-slate-400">Target 34.0–35.5°C maintained for 98.4% of past 7 days</p>
                    </div>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                      +18 pts
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-white">Humidity Regulation</span>
                      <p className="text-xs text-slate-400">Nest humidity average 61% (safely below 72% chalkbrood risk)</p>
                    </div>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                      +12 pts
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-white">Weight Gain Trajectory</span>
                      <p className="text-xs text-slate-400">Consistent daily accumulation (+380g daily) confirms floral flow</p>
                    </div>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                      +20 pts
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-white">Queen Acoustic Resonance</span>
                      <p className="text-xs text-slate-400">240 Hz dominant hum with stable diurnal harmonic distribution</p>
                    </div>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                      +16 pts
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between sm:col-span-2">
                    <div>
                      <span className="font-bold text-sm text-white">Recent Micro-Vibration Anomaly</span>
                      <p className="text-xs text-slate-400">Minor nighttime vibration spike detected on September 16 (03:15 AM)</p>
                    </div>
                    <span className="text-sm font-black text-rose-400 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
                      -4 pts
                    </span>
                  </div>

                </div>
              </div>

              {/* Scientific Honesty Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Scientific Responsibility Notice:</strong> This score represents an AI-assisted decision-support prototype derived from edge telemetry heuristics. It does not replace physical inspection by certified apiculturists or laboratory diagnosis.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: BIO-ACOUSTIC SPECTROGRAM */}
          {activeTab === 'bio_acoustics' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                    HIVE BIO-ACOUSTIC INTELLIGENCE
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    Continuous FFT Frequency Spectrogram
                  </h3>
                  <p className="text-xs text-slate-400">
                    Microphone edge sampling: 100 Hz to 1,000 Hz spectral density analysis
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Activity Score</span>
                    <span className="text-xl font-black text-amber-400">72 / 100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Dominant Peak</span>
                    <span className="text-xl font-black text-emerald-400">240 Hz</span>
                  </div>
                </div>
              </div>

              {/* Simulated Waveform / Spectrogram Graphic */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Frequency Spectrum (Hz)</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE EDGE TELEMETRY
                  </span>
                </div>

                {/* Simulated Spectrogram Bars */}
                <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  {[
                    { hz: '100Hz', height: '24%', color: 'bg-indigo-500/40' },
                    { hz: '150Hz', height: '42%', color: 'bg-indigo-500/60' },
                    { hz: '200Hz', height: '78%', color: 'bg-amber-400' },
                    { hz: '240Hz', height: '96%', color: 'bg-emerald-400 shadow-lg shadow-emerald-500/40' },
                    { hz: '280Hz', height: '64%', color: 'bg-amber-400/80' },
                    { hz: '320Hz', height: '38%', color: 'bg-indigo-500/50' },
                    { hz: '360Hz', height: '26%', color: 'bg-indigo-500/40' },
                    { hz: '400Hz', height: '20%', color: 'bg-indigo-500/30' },
                    { hz: '500Hz', height: '16%', color: 'bg-indigo-500/20' },
                    { hz: '600Hz', height: '14%', color: 'bg-indigo-500/20' },
                    { hz: '800Hz', height: '10%', color: 'bg-indigo-500/10' },
                    { hz: '1kHz', height: '8%', color: 'bg-indigo-500/10' }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        className={`w-full rounded-t-md transition-all duration-700 ${bar.color}`}
                        style={{ height: bar.height }}
                      />
                      <span className="text-[9px] font-mono text-slate-400 select-none">
                        {bar.hz}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 block uppercase">200–250 Hz Band</span>
                    <p className="font-semibold text-white mt-0.5">Healthy Queen & Brood Hum</p>
                    <p className="text-slate-400 text-[11px] mt-1">Normal active laying and thermoregulatory ventilation.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-rose-400 block uppercase">300–450 Hz Band</span>
                    <p className="font-semibold text-white mt-0.5">Queenlessness / Roaring Alert</p>
                    <p className="text-slate-400 text-[11px] mt-1">Distress piping signal when queen is absent or injured.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-purple-400 block uppercase">450–600 Hz Band</span>
                    <p className="font-semibold text-white mt-0.5">Pre-Swarm Flight Preparation</p>
                    <p className="text-slate-400 text-[11px] mt-1">High vibration energy preceding reproductive colony departure.</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic text-center">
                * Wording protocol: Classified as "AI Risk Signal" — Requires beekeeper/lab confirmation before intervention.
              </p>

            </div>
          )}

          {/* TAB 3: AI VISION PEST DETECTION */}
          {activeTab === 'pest_detection' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                    AI VISION INSPECTION (DECISION SUPPORT)
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    Varroa Mite & Comb Disease Detection
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload a high-resolution close-up photo of the brood comb or select a benchmark demonstration specimen
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAnalyzeSample('varroa')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition"
                  >
                    Test Varroa Specimen
                  </button>
                  <button
                    onClick={() => handleAnalyzeSample('healthy')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition"
                  >
                    Test Healthy Comb
                  </button>
                </div>
              </div>

              {/* Upload Zone / Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-amber-400/50 transition flex flex-col items-center justify-center text-center space-y-3 min-h-[260px]">
                  {selectedImage ? (
                    <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-700">
                      <img
                        src={selectedImage}
                        alt="Comb Sample"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-slate-950/80 px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-400 border border-amber-500/30">
                        Comb Sample Active
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-white">Upload Hive Comb Photo</h5>
                        <p className="text-xs text-slate-400 mt-1">
                          PNG, JPG up to 10MB • Or click the test sample buttons above
                        </p>
                      </div>
                      <button
                        onClick={() => handleAnalyzeSample('varroa')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                      >
                        Select Demonstration Photo
                      </button>
                    </>
                  )}
                </div>

                {/* Analysis Output */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  {isAnalyzing ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-3 text-center py-10">
                      <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
                      <p className="text-xs font-bold text-amber-400">
                        Running CNN inference & cross-referencing IoT sensor telemetry...
                      </p>
                    </div>
                  ) : detectionResult ? (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-semibold uppercase">Inference Result</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          detectionResult.severity === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {detectionResult.confidence}% Confidence
                        </span>
                      </div>

                      <h4 className="text-lg font-black text-white">
                        {detectionResult.pestType}
                      </h4>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Supporting Evidence
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {detectionResult.evidence.map((ev, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{ev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="text-[10px] font-bold text-amber-400 block uppercase mb-1">
                          Recommended Action
                        </span>
                        <p className="text-slate-300">{detectionResult.recommendedAction}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => alert('Alert registered on KVIC Central Command Center.')}
                          className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
                        >
                          Create Priority Alert
                        </button>
                        <button
                          onClick={() => alert('Field Officer T. Ramesh assigned to inspect Hive H-017.')}
                          className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
                        >
                          Assign Field Officer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-10">
                      <FileSearch className="w-10 h-10 text-slate-600 mb-2" />
                      <p className="text-xs font-semibold">Select or upload an image to run AI diagnostic inference</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
