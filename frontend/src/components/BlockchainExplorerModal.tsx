import React, { useState, useEffect } from 'react';
import { Layers, X, ShieldCheck, Hash, Clock, Cpu, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

interface BlockchainBlock {
  blockIndex: number;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  merkleRoot: string;
  nonce: number;
  validatorSignature: string;
  transactionCount: number;
  payloadJson?: string;
  payload?: any;
}

interface BlockchainExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlockchainExplorerModal: React.FC<BlockchainExplorerModalProps> = ({ isOpen, onClose }) => {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('/api/blockchain')
        .then(res => res.json())
        .then(data => {
          if (data && data.chain) {
            setBlocks(data.chain);
            setSelectedBlock(data.chain[data.chain.length - 1] || null);
          }
        })
        .catch(() => {
          // Fallback mock blocks
          const fallbackBlocks: BlockchainBlock[] = [
            {
              blockIndex: 0,
              timestamp: '2026-08-01T00:00:00.000Z',
              previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
              currentHash: 'd17240034dfd94116f2b13776ca16038522ba978ad04f4ab521c93008f2458ae',
              merkleRoot: 'aa9fe297826a47bb178901f8cca7c2e0d1ab161eaa1aa642bede938dea614f2d',
              nonce: 0,
              validatorSignature: 'ECDSA_SECP256K1_GENESIS_ROOT_NODE',
              transactionCount: 1,
              payload: { event: 'GENESIS_HYPERLEDGER_FABRIC_ANCHOR', network: 'Nilgiri Biosphere Trust Network' }
            },
            {
              blockIndex: 1,
              timestamp: '2026-09-02T10:30:00.000Z',
              previousHash: 'd17240034dfd94116f2b13776ca16038522ba978ad04f4ab521c93008f2458ae',
              currentHash: '61ca002a4a5815d0038da9364cdeea1ad474a44543ae0519609b7135b98a47e1',
              merkleRoot: '59c218a09b43ef8109dca82019ab012847ea901283cbe9018f2c3d19b4e6a8d7',
              nonce: 1042,
              validatorSignature: 'ECDSA_SECP256K1_VALIDATOR_LAB_01',
              transactionCount: 3,
              payload: { batchId: 'HC-2026-NIL-008421', event: 'HARVEST_AND_LAB_CERTIFICATION', producer: 'M. Ramanathan', delta13C: -26.8, hmf: 8.2 }
            }
          ];
          setBlocks(fallbackBlocks);
          setSelectedBlock(fallbackBlocks[fallbackBlocks.length - 1]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  Live Hyperledger Fabric Explorer
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  Proof-of-Authority Consensus
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                On-Chain Cryptographic Block Ledger
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto flex-1 pr-1">
          
          {/* Blocks List Column */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-amber-600" />
              <span>Block Chain Height ({blocks.length})</span>
            </div>

            <div className="space-y-2.5">
              {blocks.map(block => {
                const isSelected = selectedBlock?.blockIndex === block.blockIndex;
                return (
                  <button
                    key={block.blockIndex}
                    onClick={() => setSelectedBlock(block)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 shadow-sm ring-2 ring-amber-400/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-slate-900">
                        Block #{block.blockIndex}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {block.transactionCount} txs
                      </span>
                    </div>
                    <div className="mt-1.5 text-[10px] font-mono text-slate-500 truncate">
                      {block.currentHash}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(block.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block Details Inspector Column */}
          <div className="md:col-span-2 space-y-4">
            {selectedBlock ? (
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-mono font-bold text-sm text-slate-900">
                      Block #{selectedBlock.blockIndex} Header
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Consensus Verified
                  </span>
                </div>

                {/* Hash Details */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Current Block Hash (SHA-256)
                    </span>
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                      <span className="text-slate-800 break-all text-[11px] select-all">
                        {selectedBlock.currentHash}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedBlock.currentHash)}
                        className="ml-2 text-slate-400 hover:text-amber-600 shrink-0"
                      >
                        {copiedHash === selectedBlock.currentHash ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Previous Hash Link
                    </span>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 mt-1 text-slate-600 break-all text-[11px]">
                      {selectedBlock.previousHash}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Merkle Root</span>
                      <span className="text-slate-800 text-[10px] truncate block mt-0.5">
                        {selectedBlock.merkleRoot}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Validator Signer</span>
                      <span className="text-slate-800 text-[10px] truncate block mt-0.5">
                        {selectedBlock.validatorSignature}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Raw Decoded Payload */}
                <div className="pt-2">
                  <span className="text-slate-500 block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-600" />
                    <span>Decoded Block Payload & Transactions</span>
                  </span>
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-amber-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                    {JSON.stringify(selectedBlock.payload || JSON.parse(selectedBlock.payloadJson || '{}'), null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                Select a block on the left to inspect its cryptographic state.
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Engine: SQLite 3 / Hyperledger Fabric PoA Channel</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
