import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchSupplyChain, logSupplyChainEvent, fetchBatches } from '../services/api';
import { SupplyChainEvent, HoneyBatch } from '../types';
import { 
  Truck, 
  MapPin, 
  Thermometer, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  RefreshCw,
  X,
  Package
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const SupplyChainTower: React.FC = () => {
  const { setSelectedBatchId, setActiveTab } = useApp();
  const [events, setEvents] = useState<SupplyChainEvent[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [batches, setBatches] = useState<HoneyBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // New Event Form
  const [targetBatchId, setTargetBatchId] = useState('HC-2026-AP-004821');
  const [stage, setStage] = useState('Cold Storage Arrival');
  const [actor, setActor] = useState('Central Cold Hub Quality Manager');
  const [location, setLocation] = useState('Delhi NCR Warehouse (28.6139° N, 77.2090° E)');
  const [details, setDetails] = useState('Intact digital tamper seal verified. Pallet core temperature 19.4°C.');
  const [logging, setLogging] = useState(false);

  const loadData = async () => {
    try {
      const [scData, bList] = await Promise.all([
        fetchSupplyChain(),
        fetchBatches()
      ]);
      setEvents(scData.events);
      setShipments(scData.activeShipments);
      setBatches(bList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogging(true);
    try {
      await logSupplyChainEvent({
        batchId: targetBatchId,
        stage,
        actor,
        location,
        details
      });
      await loadData();
      setIsEventModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
              <Truck className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Supply Chain Control Tower
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-Time Logistics Telemetry, Cold-Chain Temperature Sensors & Custody Tracking
          </p>
        </div>

        <button
          onClick={() => setIsEventModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:opacity-90 transition shadow-lg shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Log Custody Handover Event</span>
        </button>
      </div>

      {/* Active Shipments Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shipments.map((shp) => {
          const isQuarantined = shp.status === 'QUARANTINE_HOLD';
          return (
            <div
              key={shp.id}
              className={`rounded-2xl border p-5 space-y-3 ${
                isQuarantined
                  ? 'border-red-500/50 bg-red-950/20'
                  : 'border-slate-800 bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">{shp.id}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                  isQuarantined ? 'bg-red-500 text-white' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {shp.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400">Target Batch:</p>
                <p className="font-mono text-xs font-bold text-white">{shp.batchId}</p>
              </div>

              <div className="text-xs space-y-1">
                <p className="text-slate-300">From: <span className="text-white">{shp.from}</span></p>
                <p className="text-slate-300">To: <span className="text-white">{shp.to}</span></p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-300">
                  <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                  <span>{shp.temperatureC}°C (Cold Chain)</span>
                </span>
                <span className={`font-mono font-bold text-[10px] ${
                  shp.tamperSealStatus === 'SECURE' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  Seal: {shp.tamperSealStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custody Handover Audit Feed */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Immutable Chain of Custody Event Ledger</span>
        </h3>

        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">{evt.batchId}</span>
                  <span className="font-bold text-white">{evt.stage}</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">{evt.timestamp}</span>
              </div>

              <p className="text-slate-300">{evt.details}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span>Actor: <strong className="text-slate-200">{evt.actor}</strong></span>
                <span>Location: <strong className="text-slate-200">{evt.location}</strong></span>
                <span className="font-mono text-blue-400">Tx: {evt.txHash?.substring(0, 16)}...</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Handover Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-400" />
                <span>Record Supply Chain Custody Handover</span>
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLogEvent} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Target Batch</label>
                <select
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-400 focus:outline-none font-mono"
                >
                  {batches.map((b) => (
                    <option key={b.digitalId} value={b.digitalId}>
                      {b.digitalId} — {b.name} ({b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Stage Name</label>
                <input
                  type="text"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Authorized Actor</label>
                <input
                  type="text"
                  value={actor}
                  onChange={(e) => setActor(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Physical Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Inspection & Verification Details</label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="rounded-xl border border-slate-800 px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={logging}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition"
                >
                  {logging ? <RefreshCw className="h-4 w-4 animate-spin text-slate-950" /> : <Sparkles className="h-4 w-4" />}
                  <span>Sign & Anchor Event</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <DisclaimerBanner type="general" />

    </div>
  );
};
