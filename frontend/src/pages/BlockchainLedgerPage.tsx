import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  ShieldCheck,
  Link2,
  CheckCircle2,
  Copy,
  Check,
  Info,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

interface BlockRecord {
  blockNumber: number;
  txId: string;
  timestamp: string;
  batchId: string;
  batchName: string;
  verifiedBy: string;
  event: string;
  status: 'CONFIRMED' | 'VALIDATED';
  sha256Hash: string;
  prevHash: string;
  payload: any;
}

export const BlockchainLedgerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValidator, setSelectedValidator] = useState('ALL');
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [selectedBlockForModal, setSelectedBlockForModal] = useState<BlockRecord | null>(null);

  const ledgerBlocks: BlockRecord[] = [
    {
      blockNumber: 8421,
      txId: '0x9b7f4a2104c89e24f8d689b741e29851720a4b73',
      timestamp: '14 Sep 2026, 04:55 PM',
      batchId: 'HC-2026-00124',
      batchName: 'Warangal Forest Multiflora Pure Reserve',
      verifiedBy: 'NABL Certified Testing Node #TN-02',
      event: 'LAB_QUALITY_CERTIFIED',
      status: 'CONFIRMED',
      sha256Hash: 'a8f9d4e21074bb9420bfa4721950d871329b7f4a2104c89e24f8d689b741e298',
      prevHash: '7c4210a4b739b7f4a2104c89e24f8d689b741e29851720a8f9d4e21074bb9420',
      payload: {
        batchId: 'HC-2026-00124',
        c4Syrups: '0.00%',
        isotopeDeltaC13: -26.8,
        hmfMgKg: 8.2,
        diastase: 24.8,
        status: 'CERTIFIED_RAW'
      }
    },
    {
      blockNumber: 8422,
      txId: '0x4e21a8f940bb174205a9173f4019b7f4a2104c89',
      timestamp: '14 Sep 2026, 08:30 PM',
      batchId: 'HC-2026-00124',
      batchName: 'Warangal Forest Multiflora Pure Reserve',
      verifiedBy: 'KVIC Processing Enclave Node #01',
      event: 'COLD_FILTRATION_LOGGED',
      status: 'CONFIRMED',
      sha256Hash: '51720a8f9d4e21074bb9420bfa4721950d871329b7f4a2104c89e24f8d689b74',
      prevHash: 'a8f9d4e21074bb9420bfa4721950d871329b7f4a2104c89e24f8d689b741e298',
      payload: {
        filterMeshMicron: 200,
        maxTempCelsius: 32.5,
        enzymesPreserved: true
      }
    },
    {
      blockNumber: 8425,
      txId: '0x3c8a92714ef0182490bb9420bfa4721950d87132',
      timestamp: '15 Sep 2026, 10:14 AM',
      batchId: 'HC-2026-00125',
      batchName: 'Nilgiri Kurinji Wild Blossom Lot #4',
      verifiedBy: 'Nilgiri Beekeepers Cooperative Node #14',
      event: 'HARVEST_MINTED',
      status: 'CONFIRMED',
      sha256Hash: '9420bfa4721950d871329b7f4a2104c89e24f8d689b741e298a8f9d4e21074bb',
      prevHash: '51720a8f9d4e21074bb9420bfa4721950d871329b7f4a2104c89e24f8d689b74',
      payload: {
        hiveId: 'HIVE-NILGIRI-014',
        harvestQtyKg: 42.0,
        moisturePct: 17.1,
        fido2Verified: true
      }
    },
    {
      blockNumber: 8429,
      txId: '0x8192a4bc0891d4e21a8f940bb174205a9173f401',
      timestamp: '16 Sep 2026, 01:20 PM',
      batchId: 'HC-2026-00126',
      batchName: 'Kashmir White Acacia Single-Flora',
      verifiedBy: 'FSSAI Regulatory Oversight Node #01',
      event: 'EXPORT_PERMIT_SEALED',
      status: 'CONFIRMED',
      sha256Hash: '721950d871329b7f4a2104c89e24f8d689b741e298a8f9d4e21074bb9420bfa4',
      prevHash: '9420bfa4721950d871329b7f4a2104c89e24f8d689b741e298a8f9d4e21074bb',
      payload: {
        fssaiLicenseNumber: '10018042000842',
        consignmentQtyKg: 85.0,
        phytosanitaryCheck: 'PASSED'
      }
    }
  ];

  const handleCopy = (tx: string) => {
    navigator.clipboard.writeText(tx);
    setCopiedTx(tx);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const filteredBlocks = ledgerBlocks.filter(b => {
    const matchesSearch =
      searchQuery === '' ||
      b.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.batchName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesValidator =
      selectedValidator === 'ALL' || b.verifiedBy.includes(selectedValidator);
    return matchesSearch && matchesValidator;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            Consortium Immutability & Audit Trail
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Blockchain Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            A transparent, permissioned audit log recording every verified milestone in the life of each honey batch.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Consensus Health: 100% Cryptographic Integrity</span>
        </div>
      </div>

      {/* Simple Visual Explanation Box */}
      <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-950">
            How the HoneyChain Ledger Works
          </h3>
          <p className="text-xs text-amber-900/80 leading-relaxed max-w-4xl font-medium">
            Every important honey transaction—such as beekeeper harvesting, lab isotope testing, and packaging—is securely recorded and cannot be secretly altered. Each milestone is cryptographically sealed across multiple independent consortium peers (KVIC, NABL labs, and regulators).
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by batch ID, transaction hash, or lot name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedValidator}
            onChange={e => setSelectedValidator(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">All Consortium Validators</option>
            <option value="NABL">NABL Testing Enclaves</option>
            <option value="KVIC">KVIC Processing Units</option>
            <option value="Nilgiri">Nilgiri Cooperative</option>
            <option value="FSSAI">FSSAI Regulatory Node</option>
          </select>
        </div>
      </div>

      {/* Professional Ledger Table */}
      <div className="saas-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="py-3.5 px-4 sm:px-6">Block ID</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Honey Batch</th>
                <th className="py-3.5 px-4">Verified By</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBlocks.map(block => (
                <tr key={block.blockNumber} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-4 sm:px-6 font-mono font-bold text-amber-700">
                    Block #{block.blockNumber}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span>{block.txId.slice(0, 10)}...{block.txId.slice(-6)}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(block.txId)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                        title="Copy Full Transaction Hash"
                      >
                        {copiedTx === block.txId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {block.timestamp}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    <div>{block.batchId}</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate max-w-[160px]">
                      {block.batchName}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {block.verifiedBy}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{block.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedBlockForModal(block)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 text-xs font-semibold transition cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Inspector Modal */}
      {selectedBlockForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">
                  Block #{selectedBlockForModal.blockNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedBlockForModal.event}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBlockForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block mb-0.5">SHA-256 Current Block Digest:</span>
                <p className="text-slate-800 break-all">{selectedBlockForModal.sha256Hash}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block mb-0.5">Previous Block Hash (prevHash):</span>
                <p className="text-slate-500 break-all">{selectedBlockForModal.prevHash}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700">Signed State Payload:</span>
              <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-800 overflow-x-auto">
                {JSON.stringify(selectedBlockForModal.payload, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedBlockForModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
