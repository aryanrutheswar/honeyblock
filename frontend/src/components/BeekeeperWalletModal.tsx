import React, { useState } from 'react';
import {
  Coins,
  X,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building2,
  Truck,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BeekeeperWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  beekeeperName?: string;
}

export const BeekeeperWalletModal: React.FC<BeekeeperWalletModalProps> = ({
  isOpen,
  onClose,
  beekeeperName = 'Ravi Kumar (Warangal Cluster)'
}) => {
  const [walletBalance, setWalletBalance] = useState(48500);
  const [royaltyBalance, setRoyaltyBalance] = useState(4200);
  const [isSimulatingResale, setIsSimulatingResale] = useState(false);
  const [resaleSuccess, setResaleSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateResaleRoyalty = () => {
    setIsSimulatingResale(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsSimulatingResale(false);
      setRoyaltyBalance(prev => prev + 375); // +5% royalty on a ₹7,500 bulk resale
      setResaleSuccess(true);
      soundManager.playCalmChime();
      setTimeout(() => setResaleSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  My Honey Economy & Transparent Value Flow
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DBT Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Beekeeper direct compensation, fair-trade earnings & cryptographic resale royalty ledger
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Wallet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-slate-950 border border-amber-500/30">
              <span className="text-xs font-bold text-amber-400 uppercase">Direct Harvest Earnings</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-white">₹{walletBalance.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Direct to Bank Account (SBI Mulugu Branch)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase">Resale Royalty Balance</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-emerald-400">₹{royaltyBalance.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Preserved producer attribution reward (5%)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 uppercase">Biodiversity Credits</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-indigo-300">1,570</span>
                <span className="text-xs text-slate-400">CR</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Telangana Agro-Pollination Impact Index
              </span>
            </div>

          </div>

          {/* Transparent Value Chain Visualization (Requirement 20) */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                  Transparent ₹100 Value-Chain Distribution
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Eliminating predatory middlemen by encoding fair producer compensation into smart contracts
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                45% Producer Direct Share
              </span>
            </div>

            {/* Visual Value Chain Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              
              <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-400">
                <div className="flex items-center justify-between text-xs text-amber-300 mb-1">
                  <span className="font-bold">Stage 1: Producer</span>
                  <Coins className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-white">₹45.00</span>
                <p className="text-[11px] text-slate-300 mt-1">Rural Beekeeper (Raw Harvest & Hive Care)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold">Stage 2: Processing</span>
                  <Building2 className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-2xl font-black text-white">₹20.00</span>
                <p className="text-[11px] text-slate-400 mt-1">KVIC Cold Micro-Filtration & Testing</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold">Stage 3: Logistics</span>
                  <Truck className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-2xl font-black text-white">₹15.00</span>
                <p className="text-[11px] text-slate-400 mt-1">Cold-Chain Fleet & Regional Distribution</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold">Stage 4: Retail</span>
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-2xl font-black text-white">₹20.00</span>
                <p className="text-[11px] text-slate-400 mt-1">Store Placement, Packaging & Shelf Service</p>
              </div>

            </div>
          </div>

          {/* Demo Resale Royalty Rule Simulator */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-950 to-emerald-500/10 border border-emerald-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  DEMO ROYALTY RULE TESTER (FOR JUDGES)
                </span>
                <h4 className="text-lg font-black text-white mt-1">
                  Batch Resale Attribution Simulation
                </h4>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed mt-1">
                  When a verified batch is resold by an institutional distributor or exporter, HoneyChain's smart contract preserves producer attribution and automatically triggers an ongoing +5% royalty payment back to the original rural beekeeper.
                </p>
              </div>

              <button
                onClick={handleSimulateResaleRoyalty}
                disabled={isSimulatingResale}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition active:scale-95 shrink-0 flex items-center gap-2"
              >
                {isSimulatingResale ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Simulate Secondary Batch Resale</span>
              </button>
            </div>

            {resaleSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  ✓ Resale Event Logged on Hyperledger Fabric! Attributed to Beekeeper Ravi Kumar. +₹375.00 credited to digital royalty balance.
                </span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
