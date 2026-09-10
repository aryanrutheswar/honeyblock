import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { runSpectraScan, verifySpectralFingerprint } from '../services/api';
import { SpectralScanResult } from '../types';
import { 
  Scan, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Link2, 
  Cpu, 
  Flame, 
  ArrowRight,
  Fingerprint,
  RefreshCw,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const SpectraSealPage: React.FC = () => {
  const { setActiveTab, selectedBatchId } = useApp();
  const [scanType, setScanType] = useState<'pure' | 'rice_syrup' | 'sugar_syrup' | 'unknown_anomaly'>('pure');
  const [floralType, setFloralType] = useState<string>('Acacia');
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<SpectralScanResult | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<any>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Auto-run initial pure scan on load
  useEffect(() => {
    handleExecuteScan('pure');
  }, []);

  const handleExecuteScan = async (selectedType = scanType) => {
    setScanning(true);
    setVerifyStatus(null);
    try {
      // Simulate physical optical scanning delay
      await new Promise(r => setTimeout(r, 1200));
      const res = await runSpectraScan({
        batchId: selectedBatchId || 'HC-2026-AP-004821',
        sampleType: selectedType,
        floralType
      });
      setScanResult(res);
    } catch (e) {
      console.error('Scan error', e);
    } finally {
      setScanning(false);
    }
  };

  const handleVerifyHash = async () => {
    if (!scanResult) return;
    try {
      const res = await verifySpectralFingerprint(
        {
          fingerprintId: scanResult.fingerprintId,
          sampleId: scanResult.sampleId,
          batchId: scanResult.batchId,
          deviceId: scanResult.deviceId,
          floralType: scanResult.floralType,
          sampleType: scanResult.sampleType,
          timestamp: scanResult.timestamp,
          moisturePct: scanResult.moisturePct,
          similarity: scanResult.similarity,
          modelConfidence: scanResult.modelConfidence,
          adulterationRisk: scanResult.adulterationRisk,
          anomalyScore: scanResult.anomalyScore
        },
        scanResult.cryptographicHash
      );
      setVerifyStatus(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyHash = () => {
    if (scanResult?.cryptographicHash) {
      navigator.clipboard.writeText(scanResult.cryptographicHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
              <Scan className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              SpectraSeal™ Virtual Spectrometer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Blockchain-Native Optical Fingerprinting & Machine-Captured Evidence Engine
          </p>
        </div>

        {/* Quick link to Break the Batch */}
        <button
          onClick={() => setActiveTab('break-the-batch')}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-600 px-4 py-2 text-xs font-bold text-white hover:opacity-95 transition shadow-lg shadow-red-500/20 glow-amber"
        >
          <Flame className="h-4 w-4 text-amber-200" />
          <span>Launch "Break the Batch" Demo</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Optical Scan Setup Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            1. Spectrometer Target Sample & Calibration Profile
          </h3>
          <span className="text-xs text-slate-400 font-mono">Device: SSP-9042-NIR-PORTABLE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Sample Type Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Sample Condition Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'pure', label: 'Pure Honey', desc: 'Baseline Flora' },
                { id: 'rice_syrup', label: 'Rice Syrup', desc: 'C3 Adulterant' },
                { id: 'sugar_syrup', label: 'Cane Invert', desc: 'C4 Adulterant' },
                { id: 'unknown_anomaly', label: 'Anomaly', desc: 'Moisture/Drift' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setScanType(t.id as any);
                    handleExecuteScan(t.id as any);
                  }}
                  className={`rounded-xl p-2 text-left border text-xs transition ${
                    scanType === t.id
                      ? 'border-amber-400 bg-amber-500/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="font-semibold">{t.label}</p>
                  <p className="text-[10px] text-slate-400">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Floral Reference Library */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Reference Floral Profile
            </label>
            <select
              value={floralType}
              onChange={(e) => {
                setFloralType(e.target.value);
                handleExecuteScan(scanType);
              }}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="Acacia">Acacia (Robinia pseudoacacia) — Kashmir</option>
              <option value="Mustard">Mustard Blossom (Brassica campestris) — Punjab</option>
              <option value="Mangrove">Sundarbans Wild Mangrove Khalisa — Bengal</option>
              <option value="Eucalyptus">Nilgiris Blue Gum Eucalyptus — Tamil Nadu</option>
              <option value="Coffee">Coorg Coffee Blossom & Wild Jamun — Karnataka</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1.5">
              Calibrated against 1,420+ authentic botanical reference models.
            </p>
          </div>

          {/* Trigger Scan Button */}
          <div className="flex flex-col justify-end">
            <button
              disabled={scanning}
              onClick={() => handleExecuteScan(scanType)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition shadow-lg shadow-amber-500/20"
            >
              {scanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Optical Beam Sweeping Cuvette...</span>
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 text-slate-950" />
                  <span>Trigger Laser Spectral Scan</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Visual Spectrometer Scanning Chamber (Animated Laser) */}
      <div className="relative rounded-2xl border border-amber-500/30 bg-slate-950 p-6 overflow-hidden shadow-2xl">
        
        {/* Animated Laser Beam */}
        {scanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#f59e0b] laser-beam z-10" />
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Virtual Cuvette Graphic */}
          <div className="relative flex flex-col items-center justify-center w-40 h-48 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/20 via-amber-600/30 to-amber-700/40 p-4 shadow-inner">
            <span className="text-3xl mb-1">🍯</span>
            <div className="text-[10px] font-mono font-bold text-amber-300">CUVETTE CHAMBER</div>
            <div className="text-[9px] text-slate-400 mt-1">Optical Path: 10mm</div>
            {scanning && (
              <span className="mt-2 text-[9px] font-bold text-emerald-400 animate-pulse">
                SCATTERING SCAN ACTIVE
              </span>
            )}
          </div>

          {/* Telemetry Readouts */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full">
            
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[11px]">Spectral Match</span>
              <p className={`text-xl font-bold ${
                scanResult && scanResult.similarity >= 95 ? 'text-emerald-400' : scanResult && scanResult.similarity >= 85 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {scanResult ? `${scanResult.similarity}%` : '—'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Reference Benchmark</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[11px]">Model Confidence</span>
              <p className="text-xl font-bold text-white">
                {scanResult ? `${scanResult.modelConfidence}%` : '—'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">SpectraSeal-v4.2</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[11px]">Adulteration Risk</span>
              <p className={`text-base font-bold truncate ${
                scanResult?.adulterationRisk === 'LOW' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {scanResult ? scanResult.adulterationRisk.replace('HIGH_ADULTERATION_', '') : '—'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Exogenous marker</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[11px]">Smart Contract Gate</span>
              <p className={`text-base font-bold ${
                scanResult?.smartContractGate === 'APPROVED' ? 'text-emerald-400' : scanResult?.smartContractGate === 'REVIEW' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {scanResult ? scanResult.smartContractGate : '—'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Automated Rule Gate</p>
            </div>

          </div>

        </div>
      </div>

      {/* 25-Point Wavelength Spectral Absorbance Chart */}
      {scanResult && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-amber-400" />
                <span>Near-Infrared (NIR) Spectral Signature (1,000nm — 2,500nm)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Sample Absorbance vs Authenticated Floral Baseline Profile
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Sample Spectrum
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Floral Reference
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scanResult.spectralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="wavelength" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickFormatter={(v) => `${v}nm`} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  domain={[0, 2.0]}
                  tickFormatter={(v) => `${v.toFixed(1)}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                  formatter={(val: any, name: any) => [`${val} AU`, name === 'sampleAbsorbance' ? 'Sample Absorbance' : 'Reference Baseline']}
                  labelFormatter={(lbl) => `Wavelength: ${lbl} nm`}
                />
                <Line 
                  type="monotone" 
                  dataKey="referenceAbsorbance" 
                  stroke="#64748b" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="sampleAbsorbance" 
                  stroke={scanResult.similarity >= 90 ? '#f59e0b' : '#ef4444'} 
                  strokeWidth={3} 
                  dot={{ r: 3, fill: scanResult.similarity >= 90 ? '#f59e0b' : '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Explanation & Deviation Callouts */}
          <div className={`rounded-xl p-4 border text-xs leading-relaxed ${
            scanResult.adulterantDetected
              ? 'border-red-500/30 bg-red-950/20 text-red-200'
              : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
          }`}>
            <p className="font-bold flex items-center gap-1.5 mb-1">
              {scanResult.adulterantDetected ? <AlertTriangle className="h-4 w-4 text-red-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              <span>AI Anomaly Diagnostic Analysis:</span>
            </p>
            <p>{scanResult.aiExplanation}</p>
          </div>

        </div>
      )}

      {/* Cryptographic Fingerprint & Blockchain Anchoring */}
      {scanResult && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Cryptographic Spectral Fingerprint & Ledger Anchor
              </h3>
            </div>
            <span className="font-mono text-xs text-amber-400 font-bold">
              {scanResult.fingerprintId}
            </span>
          </div>

          {/* Hash Display */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>SHA-256 Measurement Evidence Hash:</span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition font-mono"
              >
                {copiedHash ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-amber-300 break-all">
              {scanResult.cryptographicHash}
            </p>
          </div>

          {/* Blockchain & Verification Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400 font-mono">
              Anchored on Block #{scanResult.blockNumber} (Tx: {scanResult.blockchainTx.substring(0, 16)}...)
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleVerifyHash}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Verify Fingerprint Integrity</span>
              </button>

              <button
                onClick={() => setActiveTab('blockchain')}
                className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 hover:text-white transition"
              >
                <Link2 className="h-4 w-4" />
                <span>View on Explorer</span>
              </button>
            </div>
          </div>

          {/* Verification Status Result */}
          {verifyStatus && (
            <div className={`mt-3 rounded-xl p-3 border text-xs flex items-start gap-2 ${
              verifyStatus.matches
                ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                : 'border-red-500/30 bg-red-950/20 text-red-200'
            }`}>
              {verifyStatus.matches ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{verifyStatus.status}</p>
                <p className="mt-0.5">{verifyStatus.message}</p>
              </div>
            </div>
          )}

        </div>
      )}

      <DisclaimerBanner type="spectral" />

    </div>
  );
};
