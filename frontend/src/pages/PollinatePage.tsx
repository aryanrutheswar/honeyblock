import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchPollination, createPollinationContract, verifyPollinationContract } from '../services/api';
import { PollinationContract } from '../types';
import { 
  Flower2, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Radio, 
  ExternalLink,
  Award,
  RefreshCw,
  X,
  FileCheck
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const PollinatePage: React.FC = () => {
  const { refreshStats } = useApp();
  const [contracts, setContracts] = useState<PollinationContract[]>([]);
  const [totalCredits, setTotalCredits] = useState<number>(745);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<PollinationContract | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // New Contract Form State
  const [farmerName, setFarmerName] = useState('Balwant Singh');
  const [farmName, setFarmName] = useState('Amritsar Sunflower & Mustard Agro');
  const [crop, setCrop] = useState('Sunflowers (Helianthus annuus)');
  const [acreage, setAcreage] = useState('20.0');
  const [location, setLocation] = useState('Amritsar, Punjab');
  const [hivesCount, setHivesCount] = useState(15);
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetchPollination();
      setContracts(res.contracts);
      setTotalCredits(res.totalCreditsMinted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createPollinationContract({
        farmerName,
        farmName,
        crop,
        acreage,
        location,
        hivesCount
      });
      await loadData();
      await refreshStats();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleVerifyContract = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await verifyPollinationContract(id);
      await loadData();
      await refreshStats();
      setSelectedProof(res.contract);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-pink-500/20 p-2 text-pink-400">
              <Flower2 className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              POLLINATE™ Tokenized Pollination Economy
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Acoustically Verified Hive Deployment, Smart Escrow Contracts & Pollination Service Credits
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-2.5 text-xs font-bold text-white hover:from-pink-400 hover:to-pink-500 transition shadow-lg shadow-pink-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Create Pollination Contract</span>
        </button>
      </div>

      {/* Top Level Token Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-950/20 to-slate-900 p-5">
          <div className="flex items-center justify-between text-xs text-pink-300 font-medium mb-1">
            <span>Pollination Service Credits</span>
            <Coins className="h-4 w-4 text-pink-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalCredits} <span className="text-xs text-pink-400 font-normal">POL-CRD</span></p>
          <p className="text-[10px] text-slate-400 mt-1">Minted against verified acoustic flight hours</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Active Deployments</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">
            {contracts.filter(c => c.status === 'ACTIVE_DEPLOYMENT').length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Hives currently pollinating crops</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Verified Payouts</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">₹2,23,500</p>
          <p className="text-[10px] text-slate-400 mt-1">Disbursed automatically to beekeepers</p>
        </div>

      </div>

      {/* Pollination Contracts List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Active & Completed Farmer Pollination Contracts</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((c) => {
            const isCompleted = c.status === 'COMPLETED_VERIFIED';
            const isVerifying = verifyingId === c.id;

            return (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5 flex flex-col justify-between space-y-4 hover:border-pink-500/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-pink-400">{c.id}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{c.farmName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Farmer: <strong className="text-slate-200">{c.farmerName}</strong> | Crop: {c.crop}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">Hives Deployed</span>
                      <span className="font-bold text-white">{c.hivesContracted} Hives</span>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">Acoustic Flight</span>
                      <span className="font-bold text-emerald-400">{c.acousticFlightScore}% Active</span>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">Yield Increase</span>
                      <span className="font-bold text-pink-400">{c.fruitSetEstimatedIncrease}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-300">{c.beekeeperPayoutInr}</span>

                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <button
                        onClick={() => setSelectedProof(c)}
                        className="flex items-center gap-1 rounded-xl bg-pink-500/15 border border-pink-500/30 px-3 py-1.5 text-xs font-semibold text-pink-300 hover:bg-pink-500/25 transition"
                      >
                        <FileCheck className="h-3.5 w-3.5" />
                        <span>View Proof Certificate</span>
                      </button>
                    ) : (
                      <button
                        disabled={isVerifying}
                        onClick={() => handleVerifyContract(c.id)}
                        className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1.5 text-xs font-bold text-slate-950 hover:opacity-90 transition"
                      >
                        {isVerifying ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                        <span>Verify & Mint Credits</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Pollination Proof Certificate Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-pink-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl text-center space-y-5">
            
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/20 border border-pink-500/30 text-pink-400 text-2xl">
              🌸
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-400">
                OFFICIAL VERIFIED ECOSYSTEM CERTIFICATE
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                DIGITAL POLLINATION PROOF
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Certificate ID: {selectedProof.certificateHash?.substring(0, 24)}...
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Grower / Farmer:</span>
                <span className="font-bold text-white">{selectedProof.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Farm Location:</span>
                <span className="font-medium text-slate-300">{selectedProof.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pollinated Crop:</span>
                <span className="font-medium text-pink-300">{selectedProof.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verified Hive Flight Time:</span>
                <span className="font-bold text-emerald-400">{selectedProof.verifiedActivityHours} Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service Credits Minted:</span>
                <span className="font-bold text-pink-400">{selectedProof.serviceCreditsMinted} POL-CRD</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Blockchain Block Tx:</span>
                <span className="font-mono text-blue-400 text-[10px] truncate max-w-[200px]">{selectedProof.blockchainTx}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Acoustically Verified & Cryptographically Anchored</span>
            </div>

            <button
              onClick={() => setSelectedProof(null)}
              className="w-full rounded-xl bg-pink-500 py-2.5 text-xs font-bold text-white hover:bg-pink-400 transition"
            >
              Close Certificate
            </button>

          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-pink-500/30 bg-slate-900 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flower2 className="h-4 w-4 text-pink-400" />
                <span>Initiate Farmer Pollination Service Escrow</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-pink-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Farm Name & Location</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-pink-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Target Crop</label>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-pink-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Acreage</label>
                  <input
                    type="text"
                    value={acreage}
                    onChange={(e) => setAcreage(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-pink-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Hives Contracted</label>
                <input
                  type="number"
                  value={hivesCount}
                  onChange={(e) => setHivesCount(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-pink-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-slate-800 px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-1.5 rounded-xl bg-pink-500 px-5 py-2 font-bold text-white hover:bg-pink-400 disabled:opacity-50 transition"
                >
                  {creating ? <RefreshCw className="h-4 w-4 animate-spin text-white" /> : <Sparkles className="h-4 w-4" />}
                  <span>Deploy Contract</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <DisclaimerBanner type="pollination" />

    </div>
  );
};
