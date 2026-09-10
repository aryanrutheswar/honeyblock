import React, { useState } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import {
  Thermometer,
  Scale,
  Activity,
  AlertTriangle,
  PlusCircle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Radio,
  Cpu,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ArrowLeft,
  Droplets,
  Layers,
  Clock,
  MapPin,
  RefreshCw,
  Sliders,
  Flower2,
  Coins
} from 'lucide-react';

export const BeekeeperPortal: React.FC = () => {
  const {
    hiveTemp,
    hiveWeight,
    hiveAcousticFreq,
    isAcousticStress,
    toggleAcousticStress,
    resetHiveHealth,
    batches,
    mintBatch,
    goToRoleSelect
  } = useHoneychain();

  // Mint modal state
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [floralSource, setFloralSource] = useState('Wild Acacia & Nilgiri Forest Blossom');
  const [qtyKg, setQtyKg] = useState(42.5);
  const [moisturePct, setMoisturePct] = useState(16.8);
  const [hiveId, setHiveId] = useState('HIVE-NILGIRI-014');
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccessMsg, setMintSuccessMsg] = useState<string | null>(null);

  // Pollination credits
  const [creditsBalance, setCreditsBalance] = useState(1450);

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);
    try {
      const newBatch = await mintBatch({
        floralSource,
        qtyKg: Number(qtyKg),
        moisturePct: Number(moisturePct),
        hiveId
      });
      setCreditsBalance(prev => prev + 120);
      setMintSuccessMsg(`Batch #${newBatch.id} successfully minted on Hyperledger Fabric Block #${newBatch.blockNumber}! Earned +120 Biodiversity Credits.`);
      setTimeout(() => {
        setIsMinting(false);
        setIsMintModalOpen(false);
        setMintSuccessMsg(null);
      }, 1800);
    } catch {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <button
                type="button"
                onClick={goToRoleSelect}
                className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 hover:bg-amber-100 flex items-center gap-1 shadow-sm transition-all cursor-pointer z-30"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-600" />
                <span>Switch Role</span>
              </button>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                Apiary Node: Nilgiri Biosphere Reserve
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-100">
                <ShieldCheck className="w-3.5 h-3.5" /> FIDO2 Biometric Hardware Enclave
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Beekeeper Precision IoT Enclave
            </h1>
            <p className="text-amber-100 text-sm mt-1 max-w-2xl">
              Edge IoT bio-acoustic spectrum telemetry, queen calmness diagnostics, and direct Hyperledger Fabric harvest token minting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-white">
              <div className="text-[10px] text-amber-200">Biodiversity Credits</div>
              <div className="font-bold flex items-center gap-1 text-sm">
                <Coins className="w-4 h-4 text-amber-300" /> {creditsBalance} ECO-TOKENS
              </div>
            </div>

            <button
              onClick={() => setIsMintModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-amber-50 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              <span>Mint Harvest Batch</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-15 pointer-events-none flex items-center justify-center">
          <Radio className="w-96 h-96 -mr-20 text-white" />
        </div>
      </div>

      {/* Real-Time IoT Hive Health Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" /> Real-Time IoT Hive Health Telemetry
            </h2>
            <p className="text-xs text-slate-500">LoRaWAN Edge Gateway Node • Hive ID: H-NILGIRI-014</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Edge Gateway Connected (14ms)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. TEMPERATURE METRIC */}
          <div className={`p-6 bg-white border-2 rounded-3xl shadow-sm transition-all ${
            isAcousticStress ? 'border-red-300 bg-red-50/30' : 'border-amber-100 hover:border-amber-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Core Brood Nest Temperature
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Thermometer className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <span className={`text-4xl font-black ${isAcousticStress ? 'text-red-600' : 'text-slate-900'}`}>
                {hiveTemp.toFixed(1)}°C
              </span>
              <span className="text-xs font-semibold text-slate-500">
                (Baseline: 34.8°C)
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Brood Incubation</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                isAcousticStress ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isAcousticStress ? 'Thermal Elevation (Stress)' : 'Optimal Incubation ✓'}
              </span>
            </div>
          </div>

          {/* 2. HIVE WEIGHT METRIC */}
          <div className="p-6 bg-white border-2 border-amber-100 hover:border-amber-300 rounded-3xl shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Gross Hive Scale Weight
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">
                {hiveWeight.toFixed(1)} kg
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                +1.8 kg / 24h Flow
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Foraging Nectar Flow</span>
              <span className="font-bold text-amber-700">Active Shola Forest Bloom</span>
            </div>
          </div>

          {/* 3. BIO-ACOUSTIC FREQUENCY METRIC */}
          <div className={`p-6 bg-white border-2 rounded-3xl shadow-sm transition-all ${
            isAcousticStress ? 'border-red-400 bg-red-50/40 ring-2 ring-red-400/20' : 'border-amber-200 bg-gradient-to-b from-white to-amber-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Bio-Acoustic Spectrum
              </span>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isAcousticStress ? 'bg-red-100 text-red-600 border border-red-300' : 'bg-amber-100 text-amber-700 border border-amber-300'
              }`}>
                <Radio className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <span className={`text-4xl font-black ${isAcousticStress ? 'text-red-600' : 'text-slate-900'}`}>
                {hiveAcousticFreq} Hz
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                isAcousticStress ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-100 text-amber-800'
              }`}>
                {isAcousticStress ? '550 Hz Swarm Agitation' : 'Queen Right & Calm State'}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Colony Health Index</span>
              <span className={`font-bold ${isAcousticStress ? 'text-red-600' : 'text-emerald-700'}`}>
                {isAcousticStress ? 'Swarm Departure Alert: HIGH' : 'Stable Colony State ✓'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* INTERACTIVE FFT AUDIO SPECTRUM SYNTHESIZER */}
      <div className={`rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 shadow-md ${
        isAcousticStress ? 'bg-gradient-to-r from-red-50 via-white to-red-50 border-red-400' : 'bg-white border-amber-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isAcousticStress ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`} />
              <h3 className="text-lg font-bold text-slate-900">
                Bio-Acoustic Frequency Synthesizer & Stress Diagnostics
              </h3>
            </div>
            <p className="text-sm text-slate-600 max-w-2xl">
              Queen bee acoustics provide early warning signals. When calm, the brood nest hums harmonically at <strong className="text-slate-900">240 Hz</strong>. 
              Under environmental stress or swarming preparation, the frequency spikes sharply to <strong className="text-red-600">550 Hz</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleAcousticStress}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
                isAcousticStress
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
              }`}
            >
              {isAcousticStress ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              <span>{isAcousticStress ? '✓ Calm Queen State (240 Hz)' : '⚠ Simulate Hive Alert'}</span>
            </button>

            {isAcousticStress && (
              <button
                onClick={resetHiveHealth}
                className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Warning Notice if stress is active */}
        {isAcousticStress && (
          <div className="mt-6 p-4 rounded-2xl bg-red-600 border border-red-400 text-white animate-fadeIn">
            <div className="flex items-start gap-3.5">
              <AlertTriangle className="w-7 h-7 text-white shrink-0 mt-0.5 animate-bounce" />
              <div className="space-y-1">
                <div className="font-black text-base">
                  ⚠ Edge AI Warning: Varroa Mite Stress or Swarming Frequency Detected in Hive #08!
                </div>
                <p className="text-sm text-red-100 leading-relaxed">
                  Acoustic spectrum shifted from baseline <strong className="text-white">240 Hz</strong> to <strong className="text-yellow-300">550 Hz</strong>. 
                  Indicative of Varroa mite infestation, queen piping, or imminent swarm departure. 
                  Audio alert triggered through Web Audio API. Immediate on-site apiary inspection recommended before honey supers extraction.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
                  <span className="bg-white/20 px-2.5 py-1 rounded-full">🔴 CRITICAL ALERT</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-full">550 Hz Swarm Agitation</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-full">Edge AI: Varroa Detection Model v3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FFT Audio Spectrum Analyzer */}
        <div className="mt-6 p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-amber-400">
              Live FFT Audio Spectrum Analyzer ({hiveAcousticFreq} Hz)
            </span>
            <span className="text-[10px] font-mono">Sampling: 44.1 kHz • PCM 16-bit</span>
          </div>
          
          <div className="h-20 flex items-end gap-0.5 overflow-hidden px-1">
            {Array.from({ length: 56 }).map((_, i) => {
              const baseHeight = isAcousticStress
                ? 20 + Math.abs(Math.sin(i * 0.7 + i * 0.3)) * 55 + (i % 2 === 0 ? 20 : 5) + (i % 5 === 0 ? 15 : 0)
                : 10 + Math.abs(Math.sin(i * 0.4)) * 18 + (i % 4 === 0 ? 12 : 3);
              return (
                <div
                  key={i}
                  style={{ height: `${Math.min(98, Math.max(8, baseHeight))}%` }}
                  className={`flex-1 rounded-t-sm transition-all duration-300 ${
                    isAcousticStress
                      ? i % 3 === 0 ? 'bg-red-400' : 'bg-red-500'
                      : i % 3 === 0 ? 'bg-amber-300' : 'bg-amber-400'
                  }`}
                />
              );
            })}
          </div>

          {/* Frequency marker labels */}
          <div className="flex justify-between text-[9px] font-mono text-slate-600 mt-1 px-1">
            <span>0 Hz</span>
            <span className={isAcousticStress ? 'text-red-400 font-bold' : 'text-amber-500 font-bold'}>{hiveAcousticFreq} Hz PEAK</span>
            <span>1 kHz</span>
          </div>
        </div>
      </div>

      {/* Minted Harvest Batches on Hyperledger Fabric */}
      <div className="bg-white border-2 border-amber-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" /> Minted Harvest Batches on Hyperledger Fabric
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable chain-of-custody tokens registered with cryptographic timestamps
            </p>
          </div>

          <button
            onClick={() => setIsMintModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mint New Batch Token</span>
          </button>
        </div>

        {/* Batches Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Batch ID & Token</th>
                <th className="py-3 px-4 font-semibold">Hive Origin</th>
                <th className="py-3 px-4 font-semibold">Floral Source</th>
                <th className="py-3 px-4 font-semibold">Harvest Qty</th>
                <th className="py-3 px-4 font-semibold">Moisture</th>
                <th className="py-3 px-4 font-semibold">Block Number</th>
                <th className="py-3 px-4 font-semibold">Fabric Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {batches.map(batch => (
                <tr key={batch.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 font-mono">{batch.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{batch.txHash}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 font-sans">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      {batch.hiveId}
                    </div>
                    <div className="text-[10px] text-slate-400">{batch.apiary}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 font-sans">{batch.floralSource}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{batch.harvestQtyKg} kg</td>
                  <td className="py-3.5 px-4 text-slate-700">{batch.moisturePct}%</td>
                  <td className="py-3.5 px-4 font-mono text-amber-700 font-bold">#{batch.blockNumber}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      batch.status === 'CERTIFIED_AUTHENTIC'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {batch.status === 'CERTIFIED_AUTHENTIC' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Certified Authentic
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Lab
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MINT BATCH MODAL */}
      {isMintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-amber-200 rounded-3xl shadow-2xl p-6 sm:p-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Mint Harvest Batch Token</h3>
                  <p className="text-xs text-slate-500">Record harvest directly to Hyperledger Fabric</p>
                </div>
              </div>
              <button
                onClick={() => setIsMintModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {mintSuccessMsg ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Token Minted Successfully!</h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">{mintSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleMintSubmit} className="mt-5 space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hive Identifier</label>
                  <input
                    type="text"
                    value={hiveId}
                    onChange={e => setHiveId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs font-medium text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Floral Source / Botanicals</label>
                  <input
                    type="text"
                    value={floralSource}
                    onChange={e => setFloralSource(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs font-medium text-slate-900 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Harvest Quantity (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={qtyKg}
                      onChange={e => setQtyKg(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs font-medium text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Moisture Level (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={moisturePct}
                      onChange={e => setMoisturePct(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs font-medium text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Automatic Blockchain Payload Binding
                  </div>
                  <div>Location: Nilgiri Biosphere Reserve (1,850m elevation)</div>
                  <div>ECDSA Token Signer: BK-NILGIRI-8832</div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMintModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isMinting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isMinting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                    <span>{isMinting ? 'Minting onto Fabric...' : 'Mint Batch Token'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
