import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Radio, 
  Package, 
  Scan, 
  Link2, 
  Truck, 
  QrCode, 
  Flower2, 
  CheckSquare,
  Award,
  Play,
  RotateCcw
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const JudgeModePage: React.FC = () => {
  const { setActiveTab, setSelectedBatchId, setSelectedHiveId } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const demoSteps = [
    {
      step: 1,
      title: 'DEMO 1 — Smart Hive Baseline Telemetry',
      summary: 'Show how Edge IoT microphones & temperature sensors track healthy colony equilibrium without invasive physical intrusion.',
      actionLabel: 'Open Hive H-014 in BeeGuard',
      targetTab: 'smart-hives',
      targetHive: 'H-014',
      keyPoint: 'Continuous 220Hz colony hum confirms queen laying and optimal brood temperature (34.8°C).'
    },
    {
      step: 2,
      title: 'DEMO 2 — BeeGuard AI Detects Hive Distress',
      summary: 'Demonstrate live bio-acoustic anomaly detection. When a hive loses its queen or prepares to swarm, frequency spectrogram shifts instantly.',
      actionLabel: 'Inspect Hive H-015 (Queenlessness)',
      targetTab: 'smart-hives',
      targetHive: 'H-015',
      keyPoint: 'Frequency spikes to 360Hz roaring; AI flags "HIGH" inspection priority.'
    },
    {
      step: 3,
      title: 'DEMO 3 — Super Frame Honey Harvest',
      summary: 'Honey is harvested on calibrated IoT tare scales and registered with an immutable Honey Digital ID (HC-2026-AP-004821).',
      actionLabel: 'View Harvest Registry',
      targetTab: 'honey-batches',
      keyPoint: 'Harvest metadata, beekeeper identity, and geo-coordinates are minted.'
    },
    {
      step: 4,
      title: 'DEMO 4 — SpectraSeal™ Physical Spectral Scan',
      summary: 'Portable NIR/NMR spectrometer scans honey cuvette, generating a 25-point absorbance curve and SHA-256 evidence hash.',
      actionLabel: 'Run Virtual Spectrometer Scan',
      targetTab: 'spectraseal',
      keyPoint: 'Sample spectrum matched against 1,420+ authentic botanical reference profiles.'
    },
    {
      step: 5,
      title: 'DEMO 5 — Blockchain Anchoring & Smart Gate',
      summary: 'Consensus rules evaluate spectral match. High similarity triggers APPROVED gate; down-stream transit token is minted on the ledger.',
      actionLabel: 'Inspect Permissioned Ledger',
      targetTab: 'blockchain',
      keyPoint: 'Zero-gas permissioned blockchain consensus anchors the measurement evidence.'
    },
    {
      step: 6,
      title: 'DEMO 6 — Cold-Chain Supply Movement',
      summary: 'Trace the unbroken chain of custody through collection centers, micro-filtration bottling, and thermal logistics monitoring.',
      actionLabel: 'Open Supply Chain Tower',
      targetTab: 'supply-chain',
      keyPoint: 'Every handover requires cryptographic signatures and smart seal verification.'
    },
    {
      step: 7,
      title: 'DEMO 7 — Consumer Honey Passport QR',
      summary: 'Retail consumer scans the jar QR code to discover the entire journey from mountain hive to bottle with an authentic Transparency Score.',
      actionLabel: 'Open Honey Passport (HC-2026-AP-004821)',
      targetTab: 'consumer-passport',
      keyPoint: 'Includes "Meet Your Bees", NABL lab certificates, and blockchain proof.'
    }
  ];

  const current = demoSteps[currentStep - 1];

  const handleStepAction = (stepObj: typeof current) => {
    if (stepObj.targetHive) {
      setSelectedHiveId(stepObj.targetHive);
    }
    setActiveTab(stepObj.targetTab);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* SIH Judge Mode Banner */}
      <div className="rounded-3xl border-2 border-amber-400 bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-slate-950 font-black px-3 py-1 text-xs mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SIH 2026 OFFICIAL EVALUATION MODE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              HoneyChain Interactive Demonstration Suite
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Step through the complete end-to-end HoneyChain story, or trigger our signature live stress-test moments: <strong>"Break the Batch"</strong> (adulteration) and <strong>"Break the Ledger"</strong> (tampering).
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <button
              onClick={() => setActiveTab('break-the-batch')}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 transition glow-amber"
            >
              <Flame className="h-4 w-4" />
              <span>1-Click: Break the Batch</span>
            </button>

            <button
              onClick={() => setActiveTab('break-the-ledger')}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-purple-500 transition"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>1-Click: Break the Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Step Interactive Story Stepper */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6">
        
        {/* Stepper Progress Badges */}
        <div className="flex items-center justify-between overflow-x-auto pb-3 gap-2">
          {demoSteps.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex-shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                currentStep === s.step
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : currentStep > s.step
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <span className="font-mono">#{s.step}</span>
              <span className="hidden sm:inline">{s.title.split('—')[1]}</span>
            </button>
          ))}
        </div>

        {/* Current Active Step Showcase Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Step {current.step} of 7
            </span>
            <span className="text-xs text-slate-400">SIH 60-Second Story</span>
          </div>

          <h3 className="text-xl font-bold text-white">{current.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{current.summary}</p>

          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
            <strong className="text-white mr-1">Judge Evaluation Highlight:</strong>
            {current.keyPoint}
          </div>

          <div className="flex items-center justify-between pt-3">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous Demo</span>
            </button>

            <button
              onClick={() => handleStepAction(current)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
            >
              <Play className="h-3.5 w-3.5 fill-slate-950" />
              <span>{current.actionLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              disabled={currentStep === 7}
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
            >
              <span>Next Demo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* SIH Evaluation Matrix / Scorecard Checklist */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          <span>SIH 2026 Evaluation Criteria Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Physical Evidence vs Software-Only Claim</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              SpectraSeal NIR/NMR optical screening captures actual machine absorbance profiles rather than trusting manual paper entries.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Bio-Acoustic Hive Health Intelligence</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              BeeGuard AI analyzes frequency spectrograms (220Hz vs 360Hz vs 480Hz) to safeguard queen fecundity and pre-empt colony loss.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Automated Smart Contract Quality Gates</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Adulterated or deviant batches are automatically quarantined, revoking downstream tokens without human delay.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Tokenized Pollination Service Economy</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              POLLINATE™ creates new revenue streams for beekeepers with acoustically verified flight proof certificates.
            </p>
          </div>

        </div>
      </div>

      <DisclaimerBanner type="general" />

    </div>
  );
};
