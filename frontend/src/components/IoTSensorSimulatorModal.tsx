import React, { useState, useEffect } from 'react';
import {
  Cpu,
  X,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  Thermometer,
  Scale,
  Activity,
  Droplets,
  Wind,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface IoTSensorSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiveId?: string;
  onTelemetryUpdate?: (telemetry: any) => void;
}

export const IoTSensorSimulatorModal: React.FC<IoTSensorSimulatorModalProps> = ({
  isOpen,
  onClose,
  hiveId = 'HIVE-TG-017',
  onTelemetryUpdate
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [tempC, setTempC] = useState(34.2);
  const [weightKg, setWeightKg] = useState(42.7);
  const [humidityPct, setHumidityPct] = useState(61.0);
  const [acousticFrequencyHz, setAcousticFrequencyHz] = useState(240);
  const [vibrationIndex, setVibrationIndex] = useState(195);
  const [co2Ppm, setCo2Ppm] = useState(680);
  const [healthScore, setHealthScore] = useState(86);
  const [swarmingRisk, setSwarmingRisk] = useState(8);
  const [currentPattern, setCurrentPattern] = useState<'normal' | 'stress' | 'disease'>('normal');
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  // Live simulation tick
  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const interval = setInterval(() => {
      // Natural subtle jitter
      const jitter = (Math.random() - 0.5) * 0.15;
      const weightJitter = (Math.random() - 0.5) * 0.05;

      if (currentPattern === 'normal') {
        setTempC(prev => parseFloat((34.2 + jitter).toFixed(2)));
        setHumidityPct(prev => parseFloat((61.0 + jitter * 2).toFixed(1)));
        setWeightKg(prev => parseFloat((prev + (Math.random() > 0.6 ? 0.01 : 0)).toFixed(2)));
        setAcousticFrequencyHz(prev => Math.round(238 + (Math.random() - 0.5) * 6));
        setVibrationIndex(prev => Math.round(195 + (Math.random() - 0.5) * 8));
        setHealthScore(86);
        setSwarmingRisk(8);
      } else if (currentPattern === 'stress') {
        setTempC(prev => parseFloat((36.8 + jitter).toFixed(2)));
        setHumidityPct(prev => parseFloat((68.5 + jitter * 3).toFixed(1)));
        setAcousticFrequencyHz(prev => Math.round(345 + (Math.random() - 0.5) * 12));
        setVibrationIndex(prev => Math.round(280 + (Math.random() - 0.5) * 15));
        setHealthScore(54);
        setSwarmingRisk(65);
      } else if (currentPattern === 'disease') {
        setTempC(prev => parseFloat((32.4 + jitter).toFixed(2)));
        setHumidityPct(prev => parseFloat((78.0 + jitter * 3).toFixed(1)));
        setAcousticFrequencyHz(prev => Math.round(190 + (Math.random() - 0.5) * 8));
        setHealthScore(48);
        setSwarmingRisk(22);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isRunning, isOpen, currentPattern]);

  if (!isOpen) return null;

  const handleInjectStress = async () => {
    setCurrentPattern('stress');
    soundManager.playStressAlarm();
    setAlertNotice('CRITICAL ALERT: Acoustic roaring frequency 345Hz detected! Comb temperature elevated to 36.8°C. Colony stress alert created.');

    try {
      await fetch(`/api/hives/${hiveId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: 'stress' })
      });
    } catch {}

    if (onTelemetryUpdate) {
      onTelemetryUpdate({ tempC: 36.8, acousticFrequencyHz: 345, healthScore: 54, swarmingRisk: 65 });
    }
  };

  const handleInjectDisease = async () => {
    setCurrentPattern('disease');
    soundManager.playStressAlarm();
    setAlertNotice('WARNING: Varroa destructor activity suspected! Brood nest hypothermia (32.4°C) and depressed flight hum.');

    try {
      await fetch(`/api/hives/${hiveId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: 'disease' })
      });
    } catch {}
  };

  const handleReset = async () => {
    setCurrentPattern('normal');
    soundManager.playCalmChime();
    setTempC(34.2);
    setWeightKg(42.7);
    setHumidityPct(61.0);
    setAcousticFrequencyHz(240);
    setVibrationIndex(195);
    setHealthScore(86);
    setSwarmingRisk(8);
    setAlertNotice(null);

    try {
      await fetch(`/api/hives/${hiveId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: 'RESET' })
      });
    } catch {}

    if (onTelemetryUpdate) {
      onTelemetryUpdate({ tempC: 34.2, acousticFrequencyHz: 240, healthScore: 86, swarmingRisk: 8 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Edge IoT Sensor & Bio-Acoustic Simulator
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {hiveId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Software edge telemetry testbed for hackathon live hardware demonstration
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

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Simulation Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isRunning
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-emerald-500 text-slate-950 shadow-md'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause Simulation' : 'Start Simulation'}</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset to Baseline</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInjectStress}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition active:scale-95"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Inject Stress Event</span>
              </button>

              <button
                onClick={handleInjectDisease}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition active:scale-95"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Inject Disease Pattern</span>
              </button>
            </div>
          </div>

          {/* Active Alert Banner */}
          {alertNotice && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-3 text-rose-200 text-xs animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">{alertNotice}</p>
                <p className="text-[11px] text-rose-300/80">
                  Real-time alert transmitted to KVIC Central Early Warning Dashboard.
                </p>
              </div>
            </div>
          )}

          {/* 6 Real-Time IoT Sensor Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            
            {/* 1. Temperature */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  Brood Nest Temp
                </span>
                <span className="text-[10px] font-bold text-amber-400">34.0–35.5°C</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{tempC}°C</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tempC > 36.0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {tempC > 36.0 ? 'ELEVATED' : 'EQUILIBRIUM'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${tempC > 36 ? 'bg-rose-500' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, (tempC / 42) * 100)}%` }}
                />
              </div>
            </div>

            {/* 2. Weight Scale */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Hive Tare Weight
                </span>
                <span className="text-[10px] font-bold text-emerald-400">+380g / day</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{weightKg} kg</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  HARVEST READY
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (weightKg / 55) * 100)}%` }}
                />
              </div>
            </div>

            {/* 3. Acoustic Frequency */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-amber-400" />
                  Queen Acoustic Hum
                </span>
                <span className="text-[10px] font-bold text-amber-400">220–250 Hz</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{acousticFrequencyHz} Hz</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  acousticFrequencyHz > 300 ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {acousticFrequencyHz > 300 ? 'ROARING ALARM' : 'HARMONIC'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${acousticFrequencyHz > 300 ? 'bg-rose-500' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, (acousticFrequencyHz / 450) * 100)}%` }}
                />
              </div>
            </div>

            {/* 4. Humidity */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Brood Humidity
                </span>
                <span className="text-[10px] font-bold text-cyan-400">55–65% RH</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{humidityPct}%</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  humidityPct > 72 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {humidityPct > 72 ? 'HUMID' : 'OPTIMAL'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${humidityPct}%` }}
                />
              </div>
            </div>

            {/* 5. Vibration Index */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Wind className="w-4 h-4 text-indigo-400" />
                  Comb Vibration
                </span>
                <span className="text-[10px] font-bold text-indigo-400">180–210 Hz</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{vibrationIndex} Hz</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  NORMAL
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-indigo-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (vibrationIndex / 320) * 100)}%` }}
                />
              </div>
            </div>

            {/* 6. AI Colony Health */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AI Health Score
                </span>
                <span className="text-[10px] font-bold text-amber-400">Out of 100</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-3xl font-extrabold ${healthScore < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {healthScore}%
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  healthScore < 60 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {healthScore < 60 ? 'ACTION NEEDED' : 'HEALTHY'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${healthScore < 60 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>

          </div>

          {/* Explainable Decision Support Note */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Edge IoT Protocol:</strong> MQTT over TLS 1.3 to KVIC Gateway with lightweight CBOR payload serialization.
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Sample Interval: 1.2s • Latency: 24ms
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
