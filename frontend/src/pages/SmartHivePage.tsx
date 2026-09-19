import React, { useState } from 'react';
import {
  Radio,
  Thermometer,
  Droplets,
  Scale,
  Mic,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useHoneychain } from '../context/HoneychainContext';

export const SmartHivePage: React.FC = () => {
  const {
    hiveTemp,
    hiveWeight,
    hiveAcousticFreq,
    isAcousticStress,
    toggleAcousticStress,
    resetHiveHealth
  } = useHoneychain();

  const hives = [
    {
      id: 'HIVE-01',
      name: 'Hive 01 — Nilgiri Kurinji Colony',
      location: 'Nilgiri Biosphere Apiary Node AP-NIL-01',
      tempC: hiveTemp,
      humidityPct: 58,
      weightKg: hiveWeight,
      acousticHz: hiveAcousticFreq,
      queenStatus: isAcousticStress ? 'Queen Agitated / Piping' : 'Active & Laying (Healthy)',
      status: isAcousticStress ? 'ALERT' : 'HEALTHY',
      statusText: isAcousticStress ? 'Bio-Acoustic Stress' : 'Colony Calm & Productive',
      batteryPct: 94,
      lastSync: '12s ago',
      tempHistory: [34.2, 34.4, 34.5, 34.7, 34.8, hiveTemp],
      weightHistory: [41.2, 41.5, 41.8, 42.1, 42.3, hiveWeight]
    },
    {
      id: 'HIVE-02',
      name: 'Hive 02 — Warangal Multiflora Colony',
      location: 'Warangal Apiary Node AP-TG-01',
      tempC: 34.5,
      humidityPct: 56,
      weightKg: 46.2,
      acousticHz: 235,
      queenStatus: 'Active & Laying',
      status: 'HEALTHY',
      statusText: 'Optimal Nectar Inflow',
      batteryPct: 88,
      lastSync: '45s ago',
      tempHistory: [34.1, 34.3, 34.5, 34.4, 34.5, 34.5],
      weightHistory: [44.0, 44.5, 45.0, 45.5, 45.8, 46.2]
    },
    {
      id: 'HIVE-03',
      name: 'Hive 03 — Pahalgam Alpine Acacia',
      location: 'Kashmir Valley Apiary Node AP-KSH-04',
      tempC: 38.2,
      humidityPct: 64,
      weightKg: 39.8,
      acousticHz: 480,
      queenStatus: 'High Swarming Risk',
      status: 'ALERT',
      statusText: 'Temperature & Acoustic Anomaly',
      batteryPct: 91,
      lastSync: '2m ago',
      tempHistory: [34.6, 35.2, 36.4, 37.1, 37.8, 38.2],
      weightHistory: [42.0, 41.8, 41.2, 40.5, 40.1, 39.8]
    },
    {
      id: 'HIVE-04',
      name: 'Hive 04 — Coorg Forest Reserve',
      location: 'Coorg Estate Apiary Node AP-KA-02',
      tempC: 34.7,
      humidityPct: 60,
      weightKg: 51.4,
      acousticHz: 242,
      queenStatus: 'Active & Mated',
      status: 'HEALTHY',
      statusText: 'Peak Honeycomb Cap',
      batteryPct: 96,
      lastSync: '1m ago',
      tempHistory: [34.3, 34.5, 34.6, 34.6, 34.7, 34.7],
      weightHistory: [48.5, 49.2, 49.8, 50.4, 51.0, 51.4]
    }
  ];

  // Helper to render mini SVG trend line
  const renderSparkline = (data: number[], color: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 110;
    const height = 28;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black text-purple-900 bg-yellow-300/80 px-2.5 py-1 rounded-full border border-yellow-400 uppercase tracking-wider inline-block mb-2">
            Real-Time Edge IoT Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight">
            Smart Hive Monitoring Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-purple-900/60 mt-1 max-w-xl font-medium">
            Live environmental sensing, scale weight telemetry, and bio-acoustic queen calmness diagnostics across your smart apiaries.
          </p>
        </div>

        {/* Action Controls for Demo Testing */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={toggleAcousticStress}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              isAcousticStress
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            <span>{isAcousticStress ? 'Simulating Acoustic Stress' : 'Simulate Hive Stress'}</span>
          </button>

          <button
            type="button"
            onClick={resetHiveHealth}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition cursor-pointer"
            title="Reset to Normal Baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
            <span>Reset Telemetry</span>
          </button>
        </div>
      </div>

      {/* Grid of Smart Hives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hives.map((hive) => {
          const isAlert = hive.status === 'ALERT';
          return (
            <div
              key={hive.id}
              className={`saas-card p-6 space-y-6 transition-all ${
                isAlert ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-purple-100 hover:border-purple-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-purple-50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-black text-purple-950 px-2.5 py-0.5 rounded-md bg-yellow-300/80 border border-yellow-400">
                      {hive.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                      isAlert
                        ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                        : 'bg-purple-50 text-purple-900 border-purple-200'
                    }`}>
                      {isAlert ? <AlertTriangle className="w-3 h-3 text-rose-600" /> : <CheckCircle2 className="w-3 h-3 text-yellow-500" />}
                      <span>{hive.statusText}</span>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-purple-950">
                    {hive.name}
                  </h3>
                  <p className="text-xs text-purple-900/60 mt-0.5 font-medium">
                    {hive.location}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-purple-900/40 block">Battery / Gateway</span>
                  <span className="text-xs font-mono font-bold text-purple-700">{hive.batteryPct}% (Online)</span>
                </div>
              </div>

              {/* 4 Core Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Temperature */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase mb-1">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-500" /> Temp
                    </span>
                  </div>
                  <div className={`text-lg font-extrabold ${isAlert && hive.tempC > 36 ? 'text-rose-700' : 'text-slate-900'}`}>
                    {hive.tempC.toFixed(1)}°C
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Normal: 34.5°C</span>
                </div>

                {/* Humidity */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase mb-1">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" /> Humidity
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {hive.humidityPct}%
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Ideal: 55-65%</span>
                </div>

                {/* Scale Weight */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase mb-1">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3 h-3 text-emerald-500" /> Weight
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {hive.weightKg.toFixed(1)} kg
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">+1.8 kg this week</span>
                </div>

                {/* Bio-Acoustics */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase mb-1">
                    <span className="flex items-center gap-1">
                      <Mic className="w-3 h-3 text-purple-500" /> Acoustics
                    </span>
                  </div>
                  <div className={`text-lg font-extrabold ${isAlert && hive.acousticHz > 400 ? 'text-rose-700' : 'text-slate-900'}`}>
                    {hive.acousticHz} Hz
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{hive.acousticHz > 400 ? 'Stress Warning' : 'Queen Calm'}</span>
                </div>
              </div>

              {/* Trend Graphs & Queen Status */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Queen Status:</span>
                  <span className={`font-bold ${isAlert ? 'text-rose-700' : 'text-slate-800'}`}>
                    {hive.queenStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      24h Temp Trend
                    </span>
                    {renderSparkline(hive.tempHistory, isAlert && hive.tempC > 36 ? '#e11d48' : '#f59e0b')}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      24h Weight Inflow
                    </span>
                    {renderSparkline(hive.weightHistory, '#10b981')}
                  </div>
                </div>
              </div>

              {/* Alert Warning Notification if active */}
              {isAlert && (
                <div className="p-3 rounded-xl bg-rose-100/60 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Abnormal Activity Alert Detected</strong>
                    <span className="text-[11px] leading-tight">
                      Elevated brood heat and acoustic pitch detected over the last 6 hours. Physical apiary inspection recommended.
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
