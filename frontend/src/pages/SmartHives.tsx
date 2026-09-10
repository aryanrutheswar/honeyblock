import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchHives, fetchHive, simulateHiveCondition } from '../services/api';
import { Hive } from '../types';
import { 
  Radio, 
  Activity, 
  Thermometer, 
  Droplets, 
  Scale, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Bot, 
  Waves,
  RefreshCw,
  Info
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const SmartHives: React.FC = () => {
  const { selectedHiveId, setSelectedHiveId, setIsAssistantOpen } = useApp();
  const [hives, setHives] = useState<Hive[]>([]);
  const [currentHive, setCurrentHive] = useState<Hive | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    async function loadHives() {
      try {
        const list = await fetchHives();
        setHives(list);
        const active = list.find(h => h.id === selectedHiveId) || list[0];
        if (active) {
          const detailed = await fetchHive(active.id);
          setCurrentHive(detailed);
        }
      } catch (e) {
        console.error('Failed to load hives', e);
      } finally {
        setLoading(false);
      }
    }
    loadHives();
  }, [selectedHiveId]);

  const handleConditionChange = async (newCondition: string) => {
    if (!currentHive) return;
    setSimulating(true);
    try {
      const res = await simulateHiveCondition(currentHive.id, newCondition);
      setCurrentHive({ ...res.hive, acoustic: res.acousticData });
      // Update in list
      setHives(prev => prev.map(h => h.id === res.hive.id ? res.hive : h));
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  if (loading || !currentHive) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-2 text-amber-400">
          <span className="text-3xl animate-bounce">🐝</span>
          <p className="text-sm font-semibold">Connecting to Edge Microphones & Hive Telemetry...</p>
        </div>
      </div>
    );
  }

  const conditions = [
    { id: 'Healthy Colony', label: 'Healthy Colony', icon: '🌿', desc: 'Harmonic 220Hz hum, active foraging' },
    { id: 'Queenlessness Risk', label: 'Queenlessness Risk', icon: '👑❌', desc: 'Piping absent, 360Hz distressed roaring' },
    { id: 'Swarming Risk', label: 'Swarming Risk', icon: '🌪️', desc: '480Hz high energy flight preparation' },
    { id: 'Heat Stress', label: 'Heat Stress', icon: '🔥', desc: '315Hz continuous thermal fanning' },
    { id: 'Environmental Stress', label: 'Environmental Stress', icon: '⚠️', desc: 'Suppressed activity, pesticide drift indicator' },
    { id: 'Food Shortage', label: 'Food Shortage', icon: '🍯❌', desc: 'Depleted stores, negative daily gradient' },
  ];

  const waveformData = currentHive.acoustic?.waveform || [];
  const spectrogramData = currentHive.acoustic?.spectrogram || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Title & Hive Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
              <Radio className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              BeeGuard™ Bio-Acoustic Hive Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Autonomous Acoustic Telemetry, Queen Health Inference & Colony Digital Twin
          </p>
        </div>

        {/* Hive Selector Dropdown / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {hives.slice(0, 5).map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHiveId(h.id)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                h.id === currentHive.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-mono">{h.id}</span>
              <span className={`h-2 w-2 rounded-full ${
                h.inspectionPriority === 'LOW' ? 'bg-emerald-400' : h.inspectionPriority === 'URGENT' ? 'bg-red-500 animate-ping' : 'bg-amber-400'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Control Section: Select Hive Condition */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              BeeGuard Condition Simulator (Judge Interaction)
            </h3>
          </div>
          <span className="text-xs text-amber-400/90 font-medium">
            Select a condition to trigger acoustic frequency shifts & digital twin updates
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {conditions.map((c) => {
            const isSelected = currentHive.condition === c.id;
            return (
              <button
                key={c.id}
                disabled={simulating}
                onClick={() => handleConditionChange(c.id)}
                className={`rounded-xl p-3 text-left border transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 text-white ring-1 ring-amber-400 shadow-md'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="text-lg mb-1">{c.icon}</div>
                <div className="text-xs font-bold truncate">{c.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                  {c.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hive Digital Twin + Acoustic Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Hive Digital Twin */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400">{currentHive.id}</span>
              <h3 className="text-base font-bold text-white">{currentHive.name}</h3>
              <p className="text-xs text-slate-400">{currentHive.species}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Colony Health</span>
              <p className={`text-2xl font-black ${
                currentHive.healthScore >= 85 ? 'text-emerald-400' : currentHive.healthScore >= 70 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {currentHive.healthScore}<span className="text-xs text-slate-400 font-normal">/100</span>
              </p>
            </div>
          </div>

          {/* Digital Twin Sensor Gauge Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                <span>Brood Temp</span>
              </div>
              <p className="text-base font-bold text-white">{currentHive.tempC}°C</p>
              <p className="text-[10px] text-slate-500">Optimum: 34.5°C - 35.5°C</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Droplets className="h-3.5 w-3.5 text-blue-400" />
                <span>Humidity</span>
              </div>
              <p className="text-base font-bold text-white">{currentHive.humidityPct}%</p>
              <p className="text-[10px] text-slate-500">Optimum: 55% - 65%</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Scale className="h-3.5 w-3.5 text-emerald-400" />
                <span>Hive Weight</span>
              </div>
              <p className="text-base font-bold text-white">{currentHive.weightKg} kg</p>
              <p className="text-[10px] text-slate-500">Food: {currentHive.foodStores}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Waves className="h-3.5 w-3.5 text-purple-400" />
                <span>Acoustic Peak</span>
              </div>
              <p className="text-base font-bold text-white">{currentHive.acousticFrequencyHz} Hz</p>
              <p className="text-[10px] text-slate-500">RMS Power: {currentHive.soundRms}</p>
            </div>

          </div>

          {/* Biological State Overview */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Queen Status:</span>
              <span className="font-semibold text-amber-300">{currentHive.queenStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Colony Strength:</span>
              <span className="font-semibold text-white">{currentHive.colonyStrength}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Brood Development:</span>
              <span className="font-semibold text-white">{currentHive.broodEstimate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Swarming Probability:</span>
              <span className={`font-bold ${currentHive.swarmingRisk > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                {currentHive.swarmingRisk}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Inspection Priority:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                currentHive.inspectionPriority === 'LOW'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : currentHive.inspectionPriority === 'URGENT'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {currentHive.inspectionPriority}
              </span>
            </div>
          </div>

          {/* AI Yield Prediction Card */}
          <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-slate-950 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-amber-400">Harvest Yield Forecast</span>
              <span className="text-[10px] text-slate-400 font-mono">Confidence: {currentHive.aiConfidence}%</span>
            </div>
            <p className="text-2xl font-black text-white">
              {currentHive.yieldPredictionKg} kg <span className="text-xs text-amber-400 font-normal">Estimated Extract</span>
            </p>
          </div>

        </div>

        {/* Right 2 Columns: Real-Time Waveform, 2D Spectrogram & AI Explanation */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Waveform Stream */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Live Colony Acoustic Audio Waveform (Time Domain)</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Sampling Rate: 48kHz
              </span>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waveformData}>
                  <defs>
                    <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="sampleIndex" hide />
                  <YAxis domain={[-1, 1]} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                    formatter={(val: any) => [`${val} V`, 'Amplitude']}
                  />
                  <Area type="monotone" dataKey="amplitude" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#waveGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2D Frequency Spectrogram Heatmap */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">2D Acoustic Frequency Spectrogram (100 Hz — 1,000 Hz)</h3>
              </div>
              <span className="text-[10px] text-slate-400">Power Spectral Density (dB)</span>
            </div>

            {/* Spectrogram Grid */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
              {spectrogramData.slice(0, 8).map((slice, tIdx) => (
                <div key={tIdx} className="flex items-center gap-1">
                  <span className="w-10 text-[9px] font-mono text-slate-500 text-right pr-1">{slice.timeLabel}</span>
                  <div className="flex-1 flex gap-1 h-3.5">
                    {slice.frequencies.map((f, fIdx) => {
                      // Color mapping by intensity
                      const heatColor = f.intensity > 0.8
                        ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                        : f.intensity > 0.6
                        ? 'bg-amber-600'
                        : f.intensity > 0.35
                        ? 'bg-emerald-600'
                        : 'bg-slate-800';

                      return (
                        <div
                          key={fIdx}
                          title={`${f.frequencyHz}Hz: Intensity ${(f.intensity * 100).toFixed(0)}%`}
                          className={`flex-1 rounded-sm ${heatColor} transition-all`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1 pt-1 border-t border-slate-800 text-[8px] font-mono text-slate-500 pl-11 justify-between">
                <span>100Hz</span>
                <span>250Hz (Base Hum)</span>
                <span>350Hz (Queen)</span>
                <span>480Hz (Swarm)</span>
                <span>1000Hz</span>
              </div>
            </div>
          </div>

          {/* AI Explanation & Diagnostic Rationale Panel */}
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Bot className="h-4 w-4" />
                <span>Why This Prediction? (Edge AI Diagnostic Rationale)</span>
              </h4>
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="text-xs text-amber-400 hover:underline"
              >
                Ask BeeGuard AI
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{currentHive.whyPrediction}"
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="rounded-md bg-slate-950 px-2 py-1 border border-slate-800 font-mono">
                Model: BeeGuard-Acoustic-v3.8
              </span>
              <span className="rounded-md bg-slate-950 px-2 py-1 border border-slate-800 font-mono">
                Inference Latency: 18ms
              </span>
            </div>
          </div>

        </div>

      </div>

      <DisclaimerBanner type="bioacoustic" />

    </div>
  );
};
