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
  RotateCcw,
  Package,
  Calendar,
  MapPin,
  ShieldCheck,
  Eye,
  X,
  ExternalLink,
  FileCheck,
  Coins,
  Cpu,
  Layers,
  Search,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  QrCode
} from 'lucide-react';
import { useHoneychain } from '../context/HoneychainContext';

export interface BeekeeperBatch {
  id: string;
  name: string;
  hiveOrigin: string;
  harvestDate: string;
  tareWeightKg: number;
  grossWeightKg: number;
  netWeightKg: number;
  superFramesCount: number;
  moisturePct: number;
  purityScore: number;
  pollenMatchPct: number;
  c4SyrupAdulteration: string;
  hmfMgKg: number;
  diastaseNumber: number;
  fairTradePricePerKg: number;
  totalEarnings: number;
  status: 'Certified Pure' | 'Lab Verified' | 'Ready for Bottling';
  blockchainTx: string;
  blockNumber: number;
  calibratedTareSignature: string;
  labAuditor: string;
  floralSource: string;
  apiaryLocation: string;
  broodTempAtHarvest: number;
  queenAcousticFreqAtHarvest: number;
}

interface SmartHivePageProps {
  onNavigateTab?: (tab: string, batchId?: string) => void;
}

export const SmartHivePage: React.FC<SmartHivePageProps> = ({ onNavigateTab }) => {
  const {
    hiveTemp,
    hiveWeight,
    hiveAcousticFreq,
    isAcousticStress,
    toggleAcousticStress,
    resetHiveHealth
  } = useHoneychain();

  const [activeView, setActiveView] = useState<'hives' | 'batches'>('hives');
  const [selectedBatchForDetails, setSelectedBatchForDetails] = useState<BeekeeperBatch | null>(null);
  const [batchSearchQuery, setBatchSearchQuery] = useState('');
  const [activeBatchModalTab, setActiveBatchModalTab] = useState<'overview' | 'quality' | 'blockchain' | 'payout'>('overview');

  const beekeeperBatches: BeekeeperBatch[] = [
    {
      id: 'HB-2026-0891',
      name: 'Warangal Forest Multiflora Pure Reserve',
      hiveOrigin: 'HIVE-01 (Nilgiri Kurinji Colony)',
      harvestDate: '14 Sep 2026, 09:30 AM',
      tareWeightKg: 12.5,
      grossWeightKg: 81.0,
      netWeightKg: 68.5,
      superFramesCount: 18,
      moisturePct: 17.2,
      purityScore: 99.6,
      pollenMatchPct: 95.4,
      c4SyrupAdulteration: '0.00%',
      hmfMgKg: 8.2,
      diastaseNumber: 24.8,
      fairTradePricePerKg: 380,
      totalEarnings: 26030,
      status: 'Certified Pure',
      blockchainTx: '0x9b7f4a2104c89e24f8d689b741e29851720a4b73',
      blockNumber: 8421,
      calibratedTareSignature: 'TG-SCAL-8812-CAL',
      labAuditor: 'Dr. Ananya Iyer (NABL Node #TN-02)',
      floralSource: 'Wild Multiflora, Neem & Jamun',
      apiaryLocation: 'Warangal Rural Apiary Node AP-TG-01',
      broodTempAtHarvest: 34.8,
      queenAcousticFreqAtHarvest: 240.2
    },
    {
      id: 'HB-2026-0892',
      name: 'Nilgiri Kurinji High-Altitude Blossom',
      hiveOrigin: 'HIVE-02 (Nilgiri High-Altitude)',
      harvestDate: '11 Sep 2026, 11:15 AM',
      tareWeightKg: 14.0,
      grossWeightKg: 99.0,
      netWeightKg: 85.0,
      superFramesCount: 22,
      moisturePct: 16.4,
      purityScore: 99.8,
      pollenMatchPct: 97.1,
      c4SyrupAdulteration: '0.00%',
      hmfMgKg: 6.9,
      diastaseNumber: 26.4,
      fairTradePricePerKg: 420,
      totalEarnings: 35700,
      status: 'Certified Pure',
      blockchainTx: '0x4e21a8f940bb174205a9173f4019b7f4a2104c89',
      blockNumber: 8422,
      calibratedTareSignature: 'NIL-SCALE-9901-CAL',
      labAuditor: 'Dr. Rajesh Nair (NABL Node #TN-01)',
      floralSource: 'Strobilanthes Kunthiana (Kurinji)',
      apiaryLocation: 'Nilgiri Biosphere Apiary Node AP-NIL-01',
      broodTempAtHarvest: 34.5,
      queenAcousticFreqAtHarvest: 238.5
    },
    {
      id: 'HB-2026-0893',
      name: 'Kashmir Alpine White Acacia Harvest',
      hiveOrigin: 'HIVE-04 (Coorg & Kashmir Clustered)',
      harvestDate: '08 Sep 2026, 08:45 AM',
      tareWeightKg: 18.5,
      grossWeightKg: 139.0,
      netWeightKg: 120.5,
      superFramesCount: 28,
      moisturePct: 16.8,
      purityScore: 99.4,
      pollenMatchPct: 94.8,
      c4SyrupAdulteration: '0.00%',
      hmfMgKg: 9.1,
      diastaseNumber: 23.2,
      fairTradePricePerKg: 352,
      totalEarnings: 42416,
      status: 'Lab Verified',
      blockchainTx: '0x1720a4b739b7f4a2104c89e24f8d689b741e2985',
      blockNumber: 8419,
      calibratedTareSignature: 'KSH-SCALE-4412-CAL',
      labAuditor: 'Dr. Farooq Mir (KVIC Testing Node #09)',
      floralSource: 'Robinia Pseudoacacia (Acacia)',
      apiaryLocation: 'Pahalgam Alpine Apiary Node AP-KSH-04',
      broodTempAtHarvest: 34.7,
      queenAcousticFreqAtHarvest: 242.0
    }
  ];

  const filteredBatches = beekeeperBatches.filter(b =>
    b.id.toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
    b.name.toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
    b.hiveOrigin.toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
    b.floralSource.toLowerCase().includes(batchSearchQuery.toLowerCase())
  );

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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      
      {/* Top Banner with Beekeeper View Switcher */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black text-purple-900 bg-yellow-300/90 px-2.5 py-1 rounded-full border border-yellow-400 uppercase tracking-wider inline-flex items-center gap-1">
              <Radio className="w-3 h-3 text-amber-700" />
              Beekeeper Portal
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              KVIC Apiary #AP-TG-01
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight">
            Beekeeper Apiary & Batch Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-purple-900/60 mt-1 max-w-xl font-medium">
            Monitor real-time smart hive telemetry, manage tare scale harvest records, and inspect certified honey batches with full cryptographic provenance.
          </p>
        </div>

        {/* View Switcher: Live Hives vs Harvest Batches */}
        <div className="flex items-center gap-2 bg-purple-50/80 p-1.5 rounded-2xl border border-purple-200 self-start md:self-center">
          <button
            type="button"
            onClick={() => setActiveView('hives')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'hives'
                ? 'bg-purple-950 text-yellow-300 shadow-md shadow-purple-950/20'
                : 'text-purple-900 hover:text-purple-950 hover:bg-white/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Smart Hives ({hives.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('batches')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'batches'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-950 shadow-md shadow-amber-500/25 border border-amber-300'
                : 'text-purple-900 hover:text-purple-950 hover:bg-white/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Harvest Batches ({beekeeperBatches.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: LIVE SMART HIVES
          ========================================================================= */}
      {activeView === 'hives' && (
        <div className="space-y-6">
          {/* Action Controls for Demo Testing */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-purple-100">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              4 Active Micro-Sensors Transmitting
            </span>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={toggleAcousticStress}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition cursor-pointer"
                title="Reset to Normal Baseline"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                <span>Reset Telemetry</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('batches')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-purple-950 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Go to Harvest Batches & Details →</span>
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
      )}

      {/* =========================================================================
          VIEW 2: HARVEST BATCHES & DETAILED SPECIFICATIONS (THE BATCH OPTION)
          ========================================================================= */}
      {activeView === 'batches' && (
        <div className="space-y-6">
          
          {/* Beekeeper Cumulative Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-xs text-purple-900/60 font-semibold block uppercase">Total Net Harvested</span>
              <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">274.0 kg</span>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 3 Batches Sealed
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-xs text-purple-900/60 font-semibold block uppercase">Average Purity Score</span>
              <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">99.6%</span>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 0.00% C4 Syrups
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-xs text-purple-900/60 font-semibold block uppercase">Total Direct Payout</span>
              <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">₹1,04,146</span>
              <span className="text-[11px] text-purple-900/70 font-medium mt-1 flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-500" /> Fair-Trade Guarantee
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-xs text-purple-900/60 font-semibold block uppercase">Fabric Consensus</span>
              <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">100%</span>
              <span className="text-[11px] text-purple-700 font-medium mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-600" /> On-Chain Notarized
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={batchSearchQuery}
                onChange={(e) => setBatchSearchQuery(e.target.value)}
                placeholder="Search batch ID, floral source, or hive..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 placeholder:text-purple-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <span className="text-xs font-bold text-purple-900">
              Showing {filteredBatches.length} of {beekeeperBatches.length} Verified Batches
            </span>
          </div>

          {/* Batch Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-3xl border-2 border-amber-200/90 hover:border-amber-400 p-6 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between bumble-border-top"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-purple-950 px-2.5 py-1 rounded-md bg-yellow-300 border border-yellow-400">
                      {batch.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {batch.status}
                    </span>
                  </div>

                  {/* Batch Title & Floral Origin */}
                  <div>
                    <h3 className="text-lg font-black text-purple-950 leading-tight">
                      {batch.name}
                    </h3>
                    <p className="text-xs text-amber-800 font-semibold mt-1">
                      🌺 {batch.floralSource}
                    </p>
                    <p className="text-[11px] text-purple-900/60 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-400" />
                      {batch.hiveOrigin}
                    </p>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-50">
                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] uppercase font-bold text-purple-800 block">Net Tare Weight</span>
                      <span className="text-base font-black text-purple-950 font-mono">{batch.netWeightKg} kg</span>
                      <span className="text-[9px] text-purple-700 block mt-0.5">{batch.superFramesCount} super frames</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] uppercase font-bold text-purple-800 block">Lab Purity</span>
                      <span className="text-base font-black text-emerald-700 font-mono">{batch.purityScore}%</span>
                      <span className="text-[9px] text-emerald-700 block mt-0.5">0.00% C4 Syrup</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] uppercase font-bold text-purple-800 block">Moisture Ratio</span>
                      <span className="text-base font-black text-purple-950 font-mono">{batch.moisturePct}%</span>
                      <span className="text-[9px] text-purple-700 block mt-0.5">Standard: &lt;20%</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] uppercase font-bold text-purple-800 block">Beekeeper Earnings</span>
                      <span className="text-base font-black text-emerald-700 font-mono">₹{batch.totalEarnings.toLocaleString()}</span>
                      <span className="text-[9px] text-purple-700 block mt-0.5">₹{batch.fairTradePricePerKg}/kg</span>
                    </div>
                  </div>

                  {/* Tare Scale Signature */}
                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-950 flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-amber-700" /> Tare Scale ID:
                    </span>
                    <span className="font-mono font-bold text-amber-900">{batch.calibratedTareSignature}</span>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-5 pt-4 border-t border-purple-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchForDetails(batch);
                      setActiveBatchModalTab('overview');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-950 hover:bg-purple-900 text-yellow-300 font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-yellow-300" />
                    <span>View Full Batch Details</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
          BATCH DETAILS MODAL (ALL DETAILS FOR THE SELECTED BATCH)
          ========================================================================= */}
      {selectedBatchForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl border-2 border-purple-200 shadow-2xl overflow-hidden my-8 bumble-border-top">
            
            {/* Modal Header */}
            <div className="bg-purple-50/80 px-6 sm:px-8 py-5 border-b border-purple-200 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black text-purple-950 px-2.5 py-0.5 rounded-md bg-yellow-300 border border-yellow-400">
                    {selectedBatchForDetails.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {selectedBatchForDetails.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Block #{selectedBatchForDetails.blockNumber}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-purple-950">
                  {selectedBatchForDetails.name}
                </h2>
                <p className="text-xs text-purple-900/70 mt-0.5">
                  Harvested on {selectedBatchForDetails.harvestDate} • {selectedBatchForDetails.apiaryLocation}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBatchForDetails(null)}
                className="p-2 rounded-xl text-purple-600 hover:text-purple-950 hover:bg-purple-200 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-purple-100 px-6 sm:px-8 bg-white gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveBatchModalTab('overview')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeBatchModalTab === 'overview'
                    ? 'border-purple-900 text-purple-950 font-black'
                    : 'border-transparent text-purple-700/70 hover:text-purple-950'
                }`}
              >
                📦 Tare & Harvest
              </button>
              <button
                type="button"
                onClick={() => setActiveBatchModalTab('quality')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeBatchModalTab === 'quality'
                    ? 'border-purple-900 text-purple-950 font-black'
                    : 'border-transparent text-purple-700/70 hover:text-purple-950'
                }`}
              >
                🧪 Chemical & Purity Assays
              </button>
              <button
                type="button"
                onClick={() => setActiveBatchModalTab('blockchain')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeBatchModalTab === 'blockchain'
                    ? 'border-purple-900 text-purple-950 font-black'
                    : 'border-transparent text-purple-700/70 hover:text-purple-950'
                }`}
              >
                ⛓️ Blockchain Ledger Hash
              </button>
              <button
                type="button"
                onClick={() => setActiveBatchModalTab('payout')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeBatchModalTab === 'payout'
                    ? 'border-purple-900 text-purple-950 font-black'
                    : 'border-transparent text-purple-700/70 hover:text-purple-950'
                }`}
              >
                💰 Direct Fair-Trade Payout
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              
              {/* TAB A: OVERVIEW & TARE SCALE */}
              {activeBatchModalTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-800 uppercase block">Gross Scale Reading</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        {selectedBatchForDetails.grossWeightKg} kg
                      </span>
                      <span className="text-xs text-amber-800/80 mt-1 block">Loaded Super Frames</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                      <span className="text-[11px] font-bold text-purple-800 uppercase block">Tare Box Tare</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        {selectedBatchForDetails.tareWeightKg} kg
                      </span>
                      <span className="text-xs text-purple-800/80 mt-1 block">Calibrated Tare Tare</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">Net Honey Yield</span>
                      <span className="text-2xl font-black text-emerald-800 font-mono mt-1 block">
                        {selectedBatchForDetails.netWeightKg} kg
                      </span>
                      <span className="text-xs text-emerald-800/80 mt-1 block">Pure Extractable Honey</span>
                    </div>
                  </div>

                  {/* Harvesting & Hive Origin Spec List */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-700" />
                      Physical Extraction & Hive IoT Data At Time of Harvest
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-purple-900/80 pt-2">
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Origin Hive ID:</span>
                        <span className="font-mono font-bold text-purple-950">{selectedBatchForDetails.hiveOrigin}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Brood Temp at Harvest:</span>
                        <span className="font-mono font-bold text-purple-950">{selectedBatchForDetails.broodTempAtHarvest}°C (Optimal)</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Queen Acoustic Resonance:</span>
                        <span className="font-mono font-bold text-purple-950">{selectedBatchForDetails.queenAcousticFreqAtHarvest} Hz</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Super Frames Harvested:</span>
                        <span className="font-bold text-purple-950">{selectedBatchForDetails.superFramesCount} Langstroth Frames</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Calibrated Scale Seal:</span>
                        <span className="font-mono font-bold text-amber-900">{selectedBatchForDetails.calibratedTareSignature}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="font-semibold text-purple-700">Floral Source Profile:</span>
                        <span className="font-bold text-purple-950">{selectedBatchForDetails.floralSource}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB B: CHEMICAL & LAB QUALITY */}
              {activeBatchModalTab === 'quality' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-purple-800 uppercase block">NABL Accredited Laboratory</span>
                      <span className="text-base font-black text-purple-950">{selectedBatchForDetails.labAuditor}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ISO/IEC 17025 COMPLIANT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">C4 Sugar Adulteration</span>
                      <span className="text-xl font-black text-emerald-700 font-mono mt-1 block">
                        {selectedBatchForDetails.c4SyrupAdulteration}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">EA-IRMS Negative</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">HMF Freshness</span>
                      <span className="text-xl font-black text-purple-950 font-mono mt-1 block">
                        {selectedBatchForDetails.hmfMgKg} mg/kg
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Max limit: 40 mg/kg</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Diastase Enzymes</span>
                      <span className="text-xl font-black text-purple-950 font-mono mt-1 block">
                        {selectedBatchForDetails.diastaseNumber} DN
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Min required: 8 DN</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Pollen Match</span>
                      <span className="text-xl font-black text-emerald-700 font-mono mt-1 block">
                        {selectedBatchForDetails.pollenMatchPct}%
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Microscopy Verified</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <strong className="block font-black text-emerald-900">Official Quality Certification Result</strong>
                    <p>
                      Batch meets all mandatory FSSAI, Codex Alimentarius, and AGMARK Grade A standards. Zero industrial syrups (corn, sugarcane, or inverted beet sugar) detected. Moisture content measured at {selectedBatchForDetails.moisturePct}% (within strict 20.0% statutory threshold).
                    </p>
                  </div>
                </div>
              )}

              {/* TAB C: BLOCKCHAIN LEDGER HASH */}
              {activeBatchModalTab === 'blockchain' && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs space-y-4 shadow-inner">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-amber-400 font-bold flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Hyperledger Fabric State Commitment
                      </span>
                      <span className="bg-emerald-900/80 text-emerald-300 px-2.5 py-0.5 rounded text-[10px] font-bold">
                        STATUS: COMMITTED & IMMUTABLE
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Transaction Hash (TxId):</span>
                        <span className="text-yellow-300 font-bold break-all">{selectedBatchForDetails.blockchainTx}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Block Height:</span>
                          <span className="text-white font-bold font-mono">#{selectedBatchForDetails.blockNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Consensus Validator:</span>
                          <span className="text-white font-bold">KVIC Node 01 & NABL Lab #TN-02</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900/80 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-purple-950">Cryptographic Non-Repudiation Guaranteed</strong>
                      <span>
                        The harvest weight ({selectedBatchForDetails.netWeightKg} kg), calibrated tare scale key ({selectedBatchForDetails.calibratedTareSignature}), and chemical assay were irreversibly hashed together at creation. Any retail jar bearing this batch ID can be cross-verified against this on-chain hash.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB D: FAIR TRADE PAYOUT */}
              {activeBatchModalTab === 'payout' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-800 uppercase block">Base Price Guaranteed</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        ₹320.00 / kg
                      </span>
                      <span className="text-xs text-amber-800/80 mt-1 block">KVIC Minimum Support Price</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">High-Purity Bonus</span>
                      <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                        +₹{selectedBatchForDetails.fairTradePricePerKg - 320}.00 / kg
                      </span>
                      <span className="text-xs text-emerald-800/80 mt-1 block">Purity &gt; 99% Incentive</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                      <span className="text-[11px] font-bold text-purple-800 uppercase block">Total Beekeeper Settlement</span>
                      <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">
                        ₹{selectedBatchForDetails.totalEarnings.toLocaleString()}
                      </span>
                      <span className="text-xs text-purple-800/80 mt-1 block">Disbursed to Smart Wallet</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-purple-900/80 space-y-2">
                    <span className="font-black text-purple-950 uppercase tracking-wider block">
                      Direct Fair-Trade Remittance Proof
                    </span>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-purple-700">Beneficiary Beekeeper:</span>
                      <span className="font-bold text-purple-950">Ravi Kumar (Apiary #AP-TG-01)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-purple-700">Smart Contract Auto-Disbursement:</span>
                      <span className="font-mono text-emerald-700 font-bold">SETTLED IN FULL (IMPS / UPI)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-purple-700">Retail Profit Share Entitlement:</span>
                      <span className="font-bold text-purple-950">5% Ongoing Royalties on Bottled Jars</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="bg-purple-50/60 px-6 sm:px-8 py-4 border-t border-purple-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-purple-800/70 font-medium">
                Batch <span className="font-mono font-bold text-purple-950">{selectedBatchForDetails.id}</span> is actively trackable across the supply chain.
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBatchForDetails(null)}
                  className="px-5 py-2.5 rounded-xl border border-purple-200 bg-white text-purple-900 text-xs font-bold hover:bg-purple-100 transition cursor-pointer"
                >
                  Close Batch Inspector
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SmartHivePage;
