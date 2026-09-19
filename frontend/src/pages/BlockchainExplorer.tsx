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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="rounded-xl bg-purple-100 border border-purple-200 p-2 text-purple-700">
              <Link2 className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
              HoneyChain Permissioned Ledger Explorer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-purple-800/80 font-medium mt-1">
            PBFT Consensus, SHA-256 Merkle Chaining & Smart Contract State Machine
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={verifying}
            onClick={handleVerify}
            className="flex items-center gap-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 border border-purple-300 px-4 py-2.5 text-xs font-bold text-purple-950 transition cursor-pointer shadow-sm active:scale-95"
          >
            {verifying ? <RefreshCw className="h-4 w-4 animate-spin text-purple-700" /> : <ShieldCheck className="h-4 w-4 text-purple-700" />}
            <span>Re-Verify Full Chain</span>
          </button>
        </div>
      </div>

      {/* Break the Ledger: Anti-Tampering Demonstration Box */}
      <div className={`rounded-3xl border-2 p-6 sm:p-8 transition-all ${
        isChainValid
          ? 'border-purple-200 bg-white shadow-md bumble-border-top'
          : 'border-red-500 bg-red-50 ring-2 ring-red-400 animate-pulse shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 text-purple-950 border border-yellow-500 px-3.5 py-1 text-xs font-black tracking-wide shadow-sm">
              <Flame className="h-3.5 w-3.5 text-purple-950" />
              <span>SIH DEMO — "BREAK THE LEDGER" (ANTI-TAMPERING PROOF)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950">
              Simulate Database Record Tampering vs Cryptographic Immutability
            </h3>
            <p className="text-xs sm:text-sm text-purple-900/80 leading-relaxed font-medium">
              In traditional databases, an insider can secretly alter harvest quantity. On HoneyChain, any alteration changes the computed SHA-256 block hash, causing instant mathematical rejection across all network nodes.
            </p>
          </div>

          {/* Tamper Control Panel */}
          <div className="rounded-2xl border-2 border-purple-200 bg-purple-50/60 p-5 space-y-3 min-w-[280px] shadow-inner">
            <div className="text-xs">
              <span className="text-purple-800 font-medium">Target Batch: </span>
              <span className="font-mono font-black text-purple-950">HC-2026-AP-004821</span>
            </div>
            <div className="text-xs">
              <span className="text-purple-800 font-medium">Legitimate Harvest Qty: </span>
              <span className="font-mono font-black text-emerald-700">81.7 kg</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={tamperedQty}
                onChange={(e) => setTamperedQty(parseFloat(e.target.value) || 0)}
                className="w-28 rounded-xl border-2 border-purple-300 bg-white px-3 py-1.5 text-xs text-purple-950 font-mono font-bold focus:border-yellow-400 focus:outline-none"
              />
              <span className="text-xs text-purple-900 font-semibold">kg (Fraudulent)</span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleTamper}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 px-3.5 py-2.5 text-xs font-extrabold text-white transition shadow cursor-pointer active:scale-95"
              >
                Inject Tamper
              </button>
              <button
                onClick={handleRestore}
                className="rounded-xl border-2 border-purple-300 bg-white hover:bg-purple-100 px-3.5 py-2.5 text-xs font-bold text-purple-900 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Restore Pristine Ledger"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restore</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tamper Warning Banner if compromised */}
        {!isChainValid && (
          <div className="mt-5 rounded-2xl border-2 border-red-500 bg-red-100/90 p-4 text-xs text-red-900 flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-red-700">
                🚨 DATA ALTERED — BLOCKCHAIN RECORD INTEGRITY: FAILED
              </p>
              <p className="mt-1 leading-relaxed font-medium">
                Cryptographic mismatch detected on Block #{chainState.brokenBlockIndex}. The computed SHA-256 hash does not match the immutable block header signed by peer consensus nodes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Network Health & Consortium Participants */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border-2 border-purple-100 bg-white p-4 shadow-sm">
          <span className="text-purple-800 text-[10px] font-bold uppercase tracking-wider">Ledger State</span>
          <p className={`text-base font-black ${isChainValid ? 'text-emerald-700' : 'text-red-600'}`}>
            {isChainValid ? 'VERIFIED (IMMUTABLE)' : 'INTEGRITY FAILED'}
          </p>
          <p className="text-[10px] text-purple-700 font-medium mt-0.5">SHA-256 Hash Chain</p>
        </div>

        <div className="rounded-2xl border-2 border-purple-100 bg-white p-4 shadow-sm">
          <span className="text-purple-800 text-[10px] font-bold uppercase tracking-wider">Total Blocks Mined</span>
          <p className="text-base font-black text-purple-950">{chainState.chainLength}</p>
          <p className="text-[10px] text-purple-700 font-medium mt-0.5">Genesis + 8 Anchors</p>
        </div>

        <div className="rounded-2xl border-2 border-purple-100 bg-white p-4 shadow-sm">
          <span className="text-purple-800 text-[10px] font-bold uppercase tracking-wider">Consensus Engine</span>
          <p className="text-base font-black text-purple-900">PBFT + Smart Gate</p>
          <p className="text-[10px] text-purple-700 font-medium mt-0.5">Zero-gas permissioned</p>
        </div>

        <div className="rounded-2xl border-2 border-purple-100 bg-white p-4 shadow-sm">
          <span className="text-purple-800 text-[10px] font-bold uppercase tracking-wider">Consortium Validators</span>
          <p className="text-base font-black text-amber-700">4 Active Nodes</p>
          <p className="text-[10px] text-purple-700 font-medium mt-0.5">NABL / Govt / Coop</p>
        </div>
      </div>

      {/* Blocks List & Detailed Block Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Blocks Feed */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-purple-950">Chronological Block Height</h3>
          
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {chainState.blocks.map((b) => {
              const isSelected = selectedBlock?.index === b.index;
              const isBlockValid = b.isHashValid !== false;

              return (
                <div
                  key={b.index}
                  onClick={() => setSelectedBlock(b)}
                  className={`rounded-2xl border-2 p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-100 shadow-md ring-1 ring-purple-500'
                      : !isBlockValid
                      ? 'border-red-400 bg-red-50'
                      : 'border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-black text-purple-900">Block #{b.index}</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isBlockValid ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-600 text-white'
                    }`}>
                      {isBlockValid ? 'VALID' : 'HASH MISMATCH'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-purple-950 mt-1.5">
                    {b.payload?.event || 'BLOCK_TRANSACTION'}
                  </p>
                  <p className="text-[10px] font-mono text-purple-700 truncate mt-0.5">
                    Hash: {b.hash}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Block Detail Inspector */}
        {selectedBlock && (
          <div className="lg:col-span-2 rounded-3xl border-2 border-purple-200 bg-white p-6 space-y-5 shadow-md">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-black text-purple-700 uppercase tracking-wider">
                  BLOCK #{selectedBlock.index}
                </span>
                <h3 className="text-lg font-black text-purple-950">
                  {selectedBlock.payload?.event || 'Ledger Record'}
                </h3>
              </div>
              <span className="text-xs text-purple-700 font-mono font-semibold">
                {selectedBlock.timestamp}
              </span>
            </div>

            {/* Hashes */}
            <div className="space-y-3 text-xs font-mono">
              <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-3.5">
                <div className="flex items-center justify-between text-purple-800 text-[10px] font-bold mb-1">
                  <span>Current Block Hash (SHA-256):</span>
                  <button
                    onClick={() => handleCopy(selectedBlock.hash)}
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-950 cursor-pointer font-sans"
                  >
                    {copiedHash === selectedBlock.hash ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-purple-950 font-bold break-all">{selectedBlock.hash}</p>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-3.5">
                <span className="text-purple-800 text-[10px] font-bold block mb-1">Previous Block Hash (prevHash):</span>
                <p className="text-purple-800 break-all">{selectedBlock.prevHash}</p>
              </div>
            </div>

            {/* Payload JSON Inspector */}
            <div className="space-y-2">
              <span className="text-xs font-black text-purple-950">Block Payload State:</span>
              <pre className="rounded-2xl border border-purple-200 bg-purple-50/80 p-4 text-[11px] font-mono text-purple-950 overflow-x-auto leading-relaxed shadow-inner">
                {JSON.stringify(selectedBlock.payload, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-between text-[11px] text-purple-800 pt-3 border-t border-purple-100 font-medium">
              <span>Validated By: <strong className="text-purple-950 font-black">{selectedBlock.validator}</strong></span>
              <span>Tx Count: {selectedBlock.txCount}</span>
            </div>
          </div>
        )}

      </div>

      <DisclaimerBanner type="general" />

    </div>
  );
};
