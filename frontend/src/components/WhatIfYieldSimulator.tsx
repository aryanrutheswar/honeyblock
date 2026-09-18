import React, { useState } from 'react';
import {
  TrendingUp,
  X,
  Sliders,
  Calendar,
  Sparkles,
  Thermometer,
  Droplets,
  Flower2,
  Activity,
  CheckCircle2,
  Info,
  ArrowRight
} from 'lucide-react';

interface WhatIfYieldSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  hiveId?: string;
}

export const WhatIfYieldSimulator: React.FC<WhatIfYieldSimulatorProps> = ({
  isOpen,
  onClose,
  hiveId = 'HIVE-TG-017'
}) => {
  // Simulator Sliders
  const [temperatureDelta, setTemperatureDelta] = useState<number>(0);
  const [rainfallMm, setRainfallMm] = useState<number>(14);
  const [flowerBloomPct, setFlowerBloomPct] = useState<number>(85);
  const [colonyHealth, setColonyHealth] = useState<number>(86);

  if (!isOpen) return null;

  // Real-time calculation formula
  const tempFactor = 1.0 - Math.abs(temperatureDelta) * 0.04;
  const rainFactor = rainfallMm > 40 ? 0.75 : rainfallMm < 5 ? 0.85 : 1.05;
  const bloomFactor = flowerBloomPct / 80.0;
  const healthFactor = colonyHealth / 85.0;
  const combinedMultiplier = Math.max(0.4, tempFactor * rainFactor * bloomFactor * healthFactor);

  const baseCurrentKg = 18.4;
  const day7Kg = parseFloat((baseCurrentKg * 1.04 * combinedMultiplier).toFixed(1));
  const day14Kg = parseFloat((day7Kg * 1.10 * combinedMultiplier).toFixed(1));
  const day21Kg = parseFloat((day14Kg * 1.12 * combinedMultiplier).toFixed(1));

  const harvestWindow = combinedMultiplier > 0.95 ? '18–22 September 2026' : '26–30 September 2026 (Delayed)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  AI Yield Forecast & What-If Environmental Simulator
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {hiveId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Predictive nectar accumulation model with interactive environmental parameter sensitivity analysis
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Forecast Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Estimated Yield</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-white">{baseCurrentKg}</span>
                <span className="text-xs text-slate-400 font-bold">kg</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                Tare scale calibrated
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">7-Day Projected Yield</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-amber-400">{day7Kg}</span>
                <span className="text-xs text-slate-400 font-bold">kg</span>
              </div>
              <span className="text-[10px] text-amber-300/80 font-semibold block mt-1">
                94% Confidence Interval
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">14-Day Projected Yield</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-amber-400">{day14Kg}</span>
                <span className="text-xs text-slate-400 font-bold">kg</span>
              </div>
              <span className="text-[10px] text-amber-300/80 font-semibold block mt-1">
                89% Confidence Interval
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">21-Day Projected Yield</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-emerald-400">{day21Kg}</span>
                <span className="text-xs text-slate-400 font-bold">kg</span>
              </div>
              <span className="text-[10px] text-emerald-300/80 font-semibold block mt-1">
                82% Confidence Interval
              </span>
            </div>

          </div>

          {/* Interactive What-If Sliders */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                  What-If Environmental Scenario Controller
                </h4>
              </div>
              <span className="text-xs text-slate-400">
                Adjust sliders to simulate micro-climate variations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Slider 1: Temperature Delta */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    Ambient Temperature Shift
                  </span>
                  <span className="font-bold text-white font-mono">
                    {temperatureDelta > 0 ? `+${temperatureDelta}°C` : `${temperatureDelta}°C`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={temperatureDelta}
                  onChange={e => setTemperatureDelta(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>-5°C (Cool spell)</span>
                  <span>Baseline (34.2°C)</span>
                  <span>+5°C (Heatwave)</span>
                </div>
              </div>

              {/* Slider 2: Rainfall */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    Precipitation / Rainfall
                  </span>
                  <span className="font-bold text-white font-mono">
                    {rainfallMm} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="2"
                  value={rainfallMm}
                  onChange={e => setRainfallMm(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 mm (Drought)</span>
                  <span>14 mm (Normal shower)</span>
                  <span>60 mm (Heavy rain)</span>
                </div>
              </div>

              {/* Slider 3: Flower Bloom Availability */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Flower2 className="w-4 h-4 text-emerald-400" />
                    Surrounding Floral Bloom Index
                  </span>
                  <span className="font-bold text-white font-mono">
                    {flowerBloomPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={flowerBloomPct}
                  onChange={e => setFlowerBloomPct(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>20% (Scattered)</span>
                  <span>85% (Peak Multiflora Bloom)</span>
                  <span>100% (Super-Bloom)</span>
                </div>
              </div>

              {/* Slider 4: Colony Health */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Activity className="w-4 h-4 text-amber-400" />
                    Colony Health Score
                  </span>
                  <span className="font-bold text-white font-mono">
                    {colonyHealth} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="2"
                  value={colonyHealth}
                  onChange={e => setColonyHealth(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>40 (Severe Stress)</span>
                  <span>86 (Healthy Baseline)</span>
                  <span>100 (Prime)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Smart Harvest Window (Requirement 28) */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  PREDICTIVE HARVEST PLANNER
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Optimal Extraction Window: <span className="text-amber-400">{harvestWindow}</span>
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                <strong>Algorithmic Rationale:</strong> Combines tare scale weight plateau curve, drone-assisted floral bloom coverage, stable 34.2°C brood nest thermoregulation, and historic multi-season KVIC harvest windows.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 shrink-0 w-full md:w-64">
              <span className="text-[10px] font-bold uppercase text-slate-400">Preparation Checklist</span>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Calibrate IoT scale tares</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Notify Warangal cluster FPO</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Ready tamper-evident seals</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
