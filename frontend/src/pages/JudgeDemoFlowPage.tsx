import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Activity,
  ShieldCheck,
  Scale,
  FlaskConical,
  Link2,
  QrCode,
  Smartphone,
  Eye,
  Building2,
  AlertOctagon,
  Award,
  ChevronRight,
  Layers,
  Clock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { soundManager } from '../utils/audio';

interface JudgeDemoFlowPageProps {
  onNavigateToTab?: (tabName: string) => void;
  onOpenProvenanceGraph?: () => void;
  onOpenCertificate?: () => void;
}

interface StepInfo {
  step: number;
  title: string;
  category: 'HIVE_IOT' | 'AI_ALERT' | 'HARVEST_BATCH' | 'LAB_LEDGER' | 'QR_CONSUMER' | 'ADMIN_BLOCKCHAIN';
  narrative: string;
  systemAction: string;
  badge: string;
}

export const JudgeDemoFlowPage: React.FC<JudgeDemoFlowPageProps> = ({
  onNavigateToTab,
  onOpenProvenanceGraph,
  onOpenCertificate
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [tamperState, setTamperState] = useState<'clean' | 'tampered'>('clean');
  const [stepExecuted, setStepExecuted] = useState<boolean>(false);
  const [simulatedAcoustic, setSimulatedAcoustic] = useState<number>(240);
  const [simulatedTemp, setSimulatedTemp] = useState<number>(34.2);
  const [simulatedHealth, setSimulatedHealth] = useState<number>(86);
  const [blockchainBlocksCount, setBlockchainBlocksCount] = useState<number>(8);

  const steps: StepInfo[] = [
    {
      step: 1,
      title: 'STEP 1: Smart Hive Micro-Climate Detection',
      category: 'HIVE_IOT',
      badge: 'Edge IoT Hardware',
      narrative: 'Smart Hive H-017 in Warangal Rural Cluster continuously monitors colony equilibrium with internal temperature (34.2°C) and acoustic sensors without invasive disturbance.',
      systemAction: 'Baseline 240 Hz queen harmonic hum recorded by ESP32 edge microcontroller.'
    },
    {
      step: 2,
      title: 'STEP 2: IoT Sensor Telemetry Shifts',
      category: 'HIVE_IOT',
      badge: 'Live Telemetry',
      narrative: 'Pre-harvest floral surge or localized brood nest heat elevation causes temperature to shift to 36.8°C and acoustic vibration to spike to 345 Hz.',
      systemAction: 'Telemetry data streams into KVIC edge MQTT broker with lightweight CBOR packaging.'
    },
    {
      step: 3,
      title: 'STEP 3: AI Colony Risk Scoring Escalates',
      category: 'AI_ALERT',
      badge: 'Explainable AI Engine',
      narrative: 'Explainable AI health model processes the high-frequency roaring pattern. Colony health index shifts from 86% to 54% due to brood thermal deviation.',
      systemAction: 'AI Decision Support flags "URGENT INSPECTION" with transparent factor attribution.'
    },
    {
      step: 4,
      title: 'STEP 4: Central Early Warning Alert Generated',
      category: 'AI_ALERT',
      badge: 'Centralized Alert Engine',
      narrative: 'System automatically dispatches Alert #ALT-TG-01 to both the Warangal cluster dashboard and the beekeeper\'s SMS/PWA mobile app.',
      systemAction: 'KVIC Central Command Center logs critical alert with recommended action.'
    },
    {
      step: 5,
      title: 'STEP 5: Beekeeper Acknowledges Alert',
      category: 'AI_ALERT',
      badge: 'Field Operations',
      narrative: 'Beekeeper Ravi Kumar receives the audio notification, opens Rural Beekeeper Mode, and confirms physical comb inspection within 24 hours.',
      systemAction: 'Alert state transitions from PENDING to ACKNOWLEDGED with digital timestamp.'
    },
    {
      step: 6,
      title: 'STEP 6: Super Frame Harvest Recorded',
      category: 'HARVEST_BATCH',
      badge: 'IoT Precision Scale',
      narrative: 'Optimal capped honey super frames are weighed on tare-calibrated digital scale. Exactly 68.5 kg of pure Multiflora honey is registered.',
      systemAction: 'Cryptographic scale tare signature #TG-SCAL-8812 notarized to local device cache.'
    },
    {
      step: 7,
      title: 'STEP 7: Digital Batch Created (HNY-TG-2026-0001)',
      category: 'HARVEST_BATCH',
      badge: 'Batch Minting',
      narrative: 'Hero Batch HNY-TG-2026-0001 is minted with complete metadata: Apiary AP-TG-01, Beekeeper Ravi Kumar, botanical origin, and geo-coordinates.',
      systemAction: 'Batch metadata compiled into Merkle leaf and prepared for lab testing.'
    },
    {
      step: 8,
      title: 'STEP 8: ISO/IEC 17025 Lab Test Entered',
      category: 'LAB_LEDGER',
      badge: 'Chemical Evidence',
      narrative: 'Sample tested at National Isotope Lab Hyderabad via EA-IRMS carbon isotope mass spectrometry. Confirms δ13C = -26.8‰ (pure C3 botanical nectar, 0.00% C4 cane/corn syrup, HMF 8.4 mg/kg).',
      systemAction: 'Lab Inspector Dr. Ananya Iyer signs digital certificate NABL-ISO17025-TG-88102.'
    },
    {
      step: 9,
      title: 'STEP 9: Blockchain Event Anchored (Block #002)',
      category: 'LAB_LEDGER',
      badge: 'Hyperledger Fabric Ledger',
      narrative: 'Lab test results and quality smart contract approval are cryptographically hashed and anchored into Block #002 of the SHA-256 permissioned ledger.',
      systemAction: 'PoA Consensus validator nodes execute automated Smart Gate: RULE-01 APPROVED.'
    },
    {
      step: 10,
      title: 'STEP 10: Cryptographic QR Code Generated',
      category: 'QR_CONSUMER',
      badge: 'Dynamic Serialization',
      narrative: 'Tamper-evident holographic QR code linking to digital passport /verify/HNY-TG-2026-0001 is printed onto the jar packaging lots (PKG-TG-0001-A).',
      systemAction: 'Digital passport activated on public gateway for zero-login consumer verification.'
    },
    {
      step: 11,
      title: 'STEP 11: Consumer Scans Jar at Retail',
      category: 'QR_CONSUMER',
      badge: 'Public Mobile Scanner',
      narrative: 'A consumer at Khadi Gramodyog Bhavan Hyderabad scans the jar with a smartphone camera or opens the HoneyChain scanner portal.',
      systemAction: 'Consumer portal queries public immutable ledger node in 32ms.'
    },
    {
      step: 12,
      title: 'STEP 12: Consumer Explores "From Hive to Home"',
      category: 'QR_CONSUMER',
      badge: 'Consumer Trust Passport',
      narrative: 'Consumer sees verified green status: "VERIFIED TRACEABLE BATCH", meets Beekeeper Ravi Kumar, inspects NABL test metrics, and views the 7-stage custody timeline.',
      systemAction: 'Composite Traceability Confidence displays 98% (distinguished from chemical lab status).'
    },
    {
      step: 13,
      title: 'STEP 13: KVIC Admin Sees Cluster Analytics',
      category: 'ADMIN_BLOCKCHAIN',
      badge: 'Institutional Command',
      narrative: 'KVIC institutional officials monitor the Telangana Cluster Heatmap: Warangal production metrics increase by 68.5 kg with zero unresolved fraud alerts.',
      systemAction: 'Cluster decision support aggregate charts update automatically from database.'
    },
    {
      step: 14,
      title: 'STEP 14: Tamper Simulation Demonstrates Blockchain Defense',
      category: 'ADMIN_BLOCKCHAIN',
      badge: 'Judge Security Demo',
      narrative: 'Judge clicks "SIMULATE TAMPERING". An attacker secretly alters Block #002 harvest weight. The system recomputes the SHA-256 chain, triggers an immediate "INTEGRITY BREACH DETECTED" alert, isolates the corrupted block, and restores verified state!',
      systemAction: 'Mathematical proof of immutability is visibly demonstrated to the judging panel.'
    }
  ];

  const current = steps[currentStep - 1];

  // Auto-play timer (12 seconds per step for 3-minute pitch)
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 14) {
          setIsAutoPlaying(false);
          return 14;
        }
        return prev + 1;
      });
    }, 12000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleStepAction = async (stepNum: number) => {
    soundManager.playClick();
    setStepExecuted(true);

    if (stepNum === 2) {
      setSimulatedTemp(36.8);
      setSimulatedAcoustic(345);
      soundManager.playStressAlarm();
    } else if (stepNum === 3) {
      setSimulatedHealth(54);
    } else if (stepNum === 5) {
      soundManager.playCalmChime();
    } else if (stepNum === 8) {
      soundManager.playCalmChime();
    } else if (stepNum === 14) {
      // Simulate blockchain tamper
      setTamperState('tampered');
      soundManager.playStressAlarm();
    }
  };

  const handleRestoreTamper = () => {
    setTamperState('clean');
    soundManager.playCalmChime();
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#1e1035] p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner with Bumblebee Styling */}
      <div className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-purple-950 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bumble-border-top border-2 border-yellow-200">
        <div className="absolute inset-0 opacity-10 pointer-events-none bumble-stripes" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-purple-900 text-yellow-300 tracking-wider flex items-center gap-1.5 border border-yellow-300/40 shadow-xs">
              <span>🐝</span> 🎬 3-MINUTE JUDGE DEMO MODE
            </span>
            <span className="text-xs font-black text-purple-950 hidden sm:inline">
              Smart India Hackathon • KVIC Honey Mission
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-purple-950">
            From Hive to Home — End-to-End Walkthrough
          </h1>
          <p className="text-xs sm:text-sm font-bold text-purple-900/90 mt-1 max-w-2xl">
            Live working prototype demonstrating physical IoT hive intelligence, AI decision support, ISO-17025 lab testing, cryptographic blockchain ledger, and consumer QR verification.
          </p>
        </div>

        {/* Auto Play & Controls */}
        <div className="relative z-10 flex items-center gap-2.5 shrink-0 bg-white/40 p-2 rounded-2xl backdrop-blur-sm border border-yellow-300">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsAutoPlaying(!isAutoPlaying);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition shadow-md cursor-pointer ${
              isAutoPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-purple-900 text-yellow-300 hover:bg-purple-800 border border-yellow-400/30'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAutoPlaying ? 'Pause Auto Pitch' : 'Auto Play (3-Min Pitch)'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setCurrentStep(1);
              setTamperState('clean');
              setSimulatedTemp(34.2);
              setSimulatedAcoustic(240);
              setSimulatedHealth(86);
            }}
            className="p-2.5 rounded-xl bg-purple-900/10 text-purple-950 hover:bg-purple-900/20 transition cursor-pointer"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 14-Step Horizontal Navigation Bar */}
      <div className="bg-white border border-purple-200 p-3 rounded-2xl overflow-x-auto shadow-xs">
        <div className="flex items-center gap-1.5 min-w-[760px]">
          {steps.map(s => {
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;

            return (
              <button
                key={s.step}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentStep(s.step);
                }}
                className={`flex-1 min-w-[48px] py-2 px-1 rounded-xl text-xs font-black transition flex flex-col items-center gap-1 cursor-pointer ${
                  isCurrent
                    ? 'bg-yellow-400 text-purple-950 shadow-md shadow-yellow-500/25 scale-105 border border-yellow-300'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    : 'bg-purple-50/60 text-purple-700/70 hover:bg-purple-100 border border-purple-100'
                }`}
                title={s.title}
              >
                <span className="text-[10px]">#{s.step}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Step Narrative & Interactive Simulation Playground */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-purple-200 bumble-border-top space-y-6 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
                {current.badge}
              </span>
              <span className="text-xs font-mono font-bold text-purple-600">
                Step {currentStep} of 14 • KVIC Honey Mission Flow
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
                {current.title}
              </h2>
              <p className="text-sm sm:text-base text-purple-900/80 mt-3 leading-relaxed font-medium">
                {current.narrative}
              </p>
            </div>

            {/* System Action Log */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-black text-amber-700 tracking-wider">
                Autonomous System Action
              </span>
              <p className="text-purple-950 font-mono">
                {current.systemAction}
              </p>
            </div>

            {/* Step-Specific Live Interactive Demonstrations */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-4">
              
              {/* Step 1 & 2: IoT Sensors */}
              {(currentStep === 1 || currentStep === 2) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-950">Live Hive H-017 Sensor Telemetry:</span>
                    <span className="text-emerald-600 font-mono font-bold">ESP32 Online 🟢</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-xs">
                      <span className="text-[10px] text-purple-600 block font-semibold">Temperature</span>
                      <span className="text-lg font-black text-purple-950">{simulatedTemp}°C</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-xs">
                      <span className="text-[10px] text-purple-600 block font-semibold">Acoustic Freq</span>
                      <span className={`text-lg font-black ${simulatedAcoustic > 300 ? 'text-rose-600' : 'text-amber-600'}`}>
                        {simulatedAcoustic} Hz
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-xs">
                      <span className="text-[10px] text-purple-600 block font-semibold">Scale Weight</span>
                      <span className="text-lg font-black text-emerald-600">42.7 kg</span>
                    </div>
                  </div>
                  {currentStep === 2 && (
                    <button
                      onClick={() => handleStepAction(2)}
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Trigger Acoustic Spike (Inject 345 Hz Roaring Stress)
                    </button>
                  )}
                </div>
              )}

              {/* Step 3 & 4: AI Risk & Alerts */}
              {(currentStep === 3 || currentStep === 4) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-950">Explainable AI Risk Engine:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      simulatedHealth < 60 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Health: {simulatedHealth}%
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-purple-200 text-xs space-y-1 shadow-xs">
                    <p className="text-purple-950">
                      <strong>AI Factor Analysis:</strong> Temperature (+18 pts) - Anomaly (-4 pts) - Acoustic shift (-28 pts)
                    </p>
                    <p className="text-amber-800 font-semibold">
                      Alert Dispatched: "Inspect hive within 24 hours. Pre-swarm distress hum detected."
                    </p>
                  </div>
                </div>
              )}

              {/* Step 6 & 7: Harvest & Batch */}
              {(currentStep === 6 || currentStep === 7) && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white border border-purple-200 text-xs flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-purple-600 block font-medium">Harvest Lot ID:</span>
                      <span className="font-black text-amber-600 text-sm font-mono">HNY-TG-2026-0001</span>
                    </div>
                    <div>
                      <span className="text-purple-600 block font-medium">Net Volume:</span>
                      <span className="font-black text-emerald-600 text-sm">68.5 kg Multiflora</span>
                    </div>
                    <div>
                      <span className="text-purple-600 block font-medium">Beekeeper:</span>
                      <span className="font-bold text-purple-950 text-sm">Ravi Kumar</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8 & 9: Lab Test & Blockchain */}
              {(currentStep === 8 || currentStep === 9) && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-xs">
                      <span className="text-purple-600 block font-medium">EA-IRMS Isotope δ13C:</span>
                      <span className="font-bold text-emerald-600 text-sm">-26.8‰ (Natural C3 Nectar)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-xs">
                      <span className="text-purple-600 block font-medium">C4 Sugar Adulteration:</span>
                      <span className="font-bold text-emerald-600 text-sm">0.00% Pure Botanical ✓</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-purple-200 text-xs font-mono text-purple-950 shadow-xs">
                    Notarized to Blockchain Block #002 • Tx: 0x99aBEE42F559483A610992310b8C1E0A892F73C1
                  </div>
                </div>
              )}

              {/* Step 10, 11, 12: QR Code Consumer View */}
              {(currentStep === 10 || currentStep === 11 || currentStep === 12) && (
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-white border border-purple-200 shadow-xs">
                  <div className="p-3 bg-purple-50 rounded-2xl shrink-0 shadow-sm border border-purple-100">
                    <QRCodeSVG
                      value="https://honeychain.gov.in/verify/HNY-TG-2026-0001"
                      size={110}
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      VERIFIED TRACEABLE BATCH
                    </span>
                    <h4 className="text-base font-bold text-purple-950">
                      Warangal Forest Multiflora Pure Reserve
                    </h4>
                    <p className="text-purple-800/80">
                      Consumer passport unlocked: Origin story, Beekeeper Ravi Kumar, ISO-17025 certificates, and 98% Traceability Confidence.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 14: Tamper Defense Demonstration (Hero Requirement 5) */}
              {currentStep === 14 && (
                <div className="space-y-4">
                  {tamperState === 'clean' ? (
                    <div className="p-4 rounded-2xl bg-white border border-emerald-300 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-700 font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Ledger Status: 100% Cryptographic Integrity Verified
                        </span>
                        <span className="font-mono text-purple-600">All 35 Blocks Valid</span>
                      </div>
                      <p className="text-xs text-purple-900/80">
                        Every block's SHA-256 hash perfectly matches its transaction payload and the previous block's hash.
                      </p>
                      <button
                        onClick={() => handleStepAction(14)}
                        className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition cursor-pointer"
                      >
                        SIMULATE MALICIOUS LEDGER TAMPERING
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-400 space-y-4 shadow-md">
                      <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
                        <AlertOctagon className="w-6 h-6 text-rose-600 animate-pulse" />
                        <span>⚠ CRITICAL INTEGRITY BREACH DETECTED BY CONSENSUS NODES</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-white border border-rose-200 shadow-xs">
                          <span className="text-[10px] text-rose-600 block uppercase font-bold">Compromised Block</span>
                          <span className="text-rose-950 font-bold">BLOCK #002 (Lab Notary)</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-rose-200 shadow-xs">
                          <span className="text-[10px] text-rose-600 block uppercase font-bold">Hash Mismatch</span>
                          <span className="text-rose-950 font-bold">0xDEADBEEF... != Computed</span>
                        </div>
                      </div>

                      <p className="text-xs text-rose-900">
                        <strong>Chain Connection Broken:</strong> Downstream Block #003 rejects Block #002 as fraudulent. Consensus nodes isolate the compromised record immediately.
                      </p>

                      <button
                        onClick={handleRestoreTamper}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                      >
                        ✓ RESTORE VERIFIED LEDGER STATE
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-purple-100">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentStep(prev => Math.max(1, prev - 1));
                }}
                disabled={currentStep === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-950 disabled:opacity-40 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentStep(prev => Math.min(14, prev + 1));
                }}
                disabled={currentStep === 14}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-purple-950 shadow-md transition disabled:opacity-40 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Col: Quick Differentiators & Jump Shortcuts */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-white border-2 border-purple-200 bumble-border-top space-y-4 shadow-xl">
            <h3 className="font-black text-sm uppercase tracking-wider text-purple-950">
              Key Hackathon Differentiators
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <span className="font-bold text-purple-950 block">1. Bio-Acoustic Intelligence</span>
                <p className="text-purple-800/80 mt-1">Continuous 240Hz FFT spectrogram detects queen distress before colony collapse.</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <span className="font-bold text-purple-950 block">2. Batch Split & Merge Genealogy</span>
                <p className="text-purple-800/80 mt-1">Preserves parent batch attribution when 68.5kg bulk harvest divides into 150 retail jars.</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <span className="font-bold text-purple-950 block">3. Scientific Transparency</span>
                <p className="text-purple-800/80 mt-1">Clearly distinguishes Laboratory Verification from AI Risk Signals and Blockchain Ledger.</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <span className="font-bold text-purple-950 block">4. Rural Beekeeper Accessibility</span>
                <p className="text-purple-800/80 mt-1">Simplified touch UI with Telugu/Hindi language switcher and Web Speech API voice harvest input.</p>
              </div>
            </div>
          </div>

          {/* Direct Interactive Modal Launchers */}
          <div className="p-6 rounded-3xl bg-white border border-purple-200 space-y-3 shadow-md">
            <h3 className="font-bold text-xs uppercase tracking-wider text-purple-700">
              Explore Specialized Modals
            </h3>

            {onOpenProvenanceGraph && (
              <button
                onClick={onOpenProvenanceGraph}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs font-bold flex items-center justify-between border border-purple-200 transition cursor-pointer"
              >
                <span>Dynamic Provenance Node Graph</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              </button>
            )}

            {onOpenCertificate && (
              <button
                onClick={onOpenCertificate}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs font-bold flex items-center justify-between border border-purple-200 transition cursor-pointer"
              >
                <span>Digital Certificate of Provenance</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
