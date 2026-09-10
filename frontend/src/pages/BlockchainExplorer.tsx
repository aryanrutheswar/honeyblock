import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchBlockchainState, verifyBlockchain, simulateTampering, restoreBlockchain } from '../services/api';
import { BlockchainState, Block } from '../types';
import { 
  Link2, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Lock,
  Layers,
  ChevronRight,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const BlockchainExplorer: React.FC = () => {
  const { refreshStats } = useApp();
  const [chainState, setChainState] = useState<BlockchainState | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [tamperedQty, setTamperedQty] = useState<number>(101.7);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const loadChain = async () => {
    try {
      const state = await fetchBlockchainState();
      setChainState(state);
      if (state.blocks.length > 0 && !selectedBlock) {
        setSelectedBlock(state.blocks[state.blocks.length - 1]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChain();
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await verifyBlockchain();
      setVerifyResult(res);
      await loadChain();
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const handleTamper = async () => {
    try {
      await simulateTampering('HC-2026-AP-004821', tamperedQty);
      await loadChain();
      await handleVerify();
      await refreshStats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreBlockchain();
      await loadChain();
      await handleVerify();
      await refreshStats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (loading || !chainState) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-2 text-blue-400">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
          <p className="text-xs font-semibold">Connecting to Hyperledger Fabric Consortium Peers...</p>
        </div>
      </div>
    );
  }

  const isChainValid = chainState.isValid;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
              <Link2 className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              HoneyChain Permissioned Ledger Explorer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            PBFT Consensus, SHA-256 Merkle Chaining & Smart Contract State Machine
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={verifying}
            onClick={handleVerify}
            className="flex items-center gap-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 px-4 py-2 text-xs font-bold text-blue-300 hover:bg-blue-500/25 transition"
          >
            {verifying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            <span>Re-Verify Full Chain</span>
          </button>
        </div>
      </div>

      {/* Break the Ledger: Anti-Tampering Demonstration Box */}
      <div className={`rounded-2xl border p-6 transition-all ${
        isChainValid
          ? 'border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-slate-900 to-slate-950'
          : 'border-red-500 bg-red-950/40 ring-2 ring-red-400 animate-pulse shadow-2xl'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-xs font-bold text-purple-300">
              <Flame className="h-3.5 w-3.5" />
              <span>SIH DEMO — "BREAK THE LEDGER" (ANTI-TAMPERING PROOF)</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Simulate Database Record Tampering vs Cryptographic Immutability
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In traditional databases, an insider can secretly alter harvest quantity. On HoneyChain, any alteration changes the computed SHA-256 block hash, causing instant mathematical rejection across all network nodes.
            </p>
          </div>

          {/* Tamper Control Panel */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 min-w-[280px]">
            <div className="text-xs">
              <span className="text-slate-400">Target Batch: </span>
              <span className="font-mono font-bold text-amber-400">HC-2026-AP-004821</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Legitimate Harvest Qty: </span>
              <span className="font-mono font-bold text-emerald-400">81.7 kg</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={tamperedQty}
                onChange={(e) => setTamperedQty(parseFloat(e.target.value) || 0)}
                className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white font-mono focus:border-purple-400 focus:outline-none"
              />
              <span className="text-xs text-slate-400">kg (Fraudulent)</span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleTamper}
                className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500 transition shadow"
              >
                Inject Tamper
              </button>
              <button
                onClick={handleRestore}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1"
                title="Restore Pristine Ledger"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Restore</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tamper Warning Banner if compromised */}
        {!isChainValid && (
          <div className="mt-4 rounded-xl border border-red-500 bg-red-950/80 p-4 text-xs text-red-200 flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-extrabold text-red-300">
                🚨 DATA ALTERED — BLOCKCHAIN RECORD INTEGRITY: FAILED
              </p>
              <p className="mt-1 leading-relaxed">
                Cryptographic mismatch detected on Block #{chainState.brokenBlockIndex}. The computed SHA-256 hash does not match the immutable block header signed by peer consensus nodes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Network Health & Consortium Participants */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <span className="text-slate-400 text-[10px]">Ledger State</span>
          <p className={`text-base font-bold ${isChainValid ? 'text-emerald-400' : 'text-red-400'}`}>
            {isChainValid ? 'VERIFIED (IMMUTABLE)' : 'INTEGRITY FAILED'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">SHA-256 Hash Chain</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <span className="text-slate-400 text-[10px]">Total Blocks Mined</span>
          <p className="text-base font-bold text-white">{chainState.chainLength}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Genesis + 8 Anchors</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <span className="text-slate-400 text-[10px]">Consensus Engine</span>
          <p className="text-base font-bold text-blue-400">PBFT + Smart Gate</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Zero-gas permissioned</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <span className="text-slate-400 text-[10px]">Consortium Validators</span>
          <p className="text-base font-bold text-amber-400">4 Active Nodes</p>
          <p className="text-[10px] text-slate-500 mt-0.5">NABL / Govt / Coop</p>
        </div>
      </div>

      {/* Blocks List & Detailed Block Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Blocks Feed */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Chronological Block Height</h3>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {chainState.blocks.map((b) => {
              const isSelected = selectedBlock?.index === b.index;
              const isBlockValid = b.isHashValid !== false;

              return (
                <div
                  key={b.index}
                  onClick={() => setSelectedBlock(b)}
                  className={`rounded-xl border p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/30 shadow-md'
                      : !isBlockValid
                      ? 'border-red-500/50 bg-red-950/20'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-400">Block #{b.index}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isBlockValid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500 text-white'
                    }`}>
                      {isBlockValid ? 'VALID' : 'HASH MISMATCH'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-1">
                    {b.payload?.event || 'BLOCK_TRANSACTION'}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                    Hash: {b.hash}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Block Detail Inspector */}
        {selectedBlock && (
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400">
                  BLOCK #{selectedBlock.index}
                </span>
                <h3 className="text-base font-bold text-white">
                  {selectedBlock.payload?.event || 'Ledger Record'}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {selectedBlock.timestamp}
              </span>
            </div>

            {/* Hashes */}
            <div className="space-y-2 text-xs font-mono">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Current Block Hash (SHA-256):</span>
                  <button
                    onClick={() => handleCopy(selectedBlock.hash)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    {copiedHash === selectedBlock.hash ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-blue-300 break-all">{selectedBlock.hash}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-slate-400 text-[10px] block mb-1">Previous Block Hash (prevHash):</span>
                <p className="text-slate-400 break-all">{selectedBlock.prevHash}</p>
              </div>
            </div>

            {/* Payload JSON Inspector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300">Block Payload State:</span>
              <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-[11px] font-mono text-amber-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(selectedBlock.payload, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Validated By: <strong className="text-slate-200">{selectedBlock.validator}</strong></span>
              <span>Tx Count: {selectedBlock.txCount}</span>
            </div>
          </div>
        )}

      </div>

      <DisclaimerBanner type="general" />

    </div>
  );
};
