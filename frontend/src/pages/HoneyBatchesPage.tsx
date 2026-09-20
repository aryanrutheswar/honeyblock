import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  Download,
  Calendar,
  Scale,
  MapPin,
  Clock,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';

export interface BatchItem {
  id: string;
  name: string;
  beekeeper: string;
  location: string;
  floralSource: string;
  harvestDate: string;
  quantityKg: number;
  status: 'Raw Harvest' | 'Lab Passed' | 'In Processing' | 'In Transit' | 'Verified for Retail' | 'Flagged';
  purityScore: number;
  moisturePercent: number;
  pollenMatchPercent: number;
  txHash: string;
  blockNumber: number;
  hiveId: string;
}

const INITIAL_BATCHES: BatchItem[] = [
  {
    id: 'HB-2026-0891',
    name: 'Kashmir Acacia Gold #0891',
    beekeeper: 'Farooq Ahmad Mir & Sons',
    location: 'Srinagar Valley, Kashmir, India',
    floralSource: 'Robinia Pseudoacacia (Acacia)',
    harvestDate: '12 Sep 2026',
    quantityKg: 120.5,
    status: 'Verified for Retail',
    purityScore: 99.4,
    moisturePercent: 16.8,
    pollenMatchPercent: 94.2,
    txHash: '0x8f3c...9a41',
    blockNumber: 489210,
    hiveId: 'HIVE-01'
  },
  {
    id: 'HB-2026-0892',
    name: 'Royal Sidr Reserve Batch #0892',
    beekeeper: 'Hadramout Heritage Apiaries',
    location: 'Wadi Doan, Hadramout, Yemen',
    floralSource: 'Ziziphus Spina-Christi (Sidr)',
    harvestDate: '14 Sep 2026',
    quantityKg: 85.0,
    status: 'Lab Passed',
    purityScore: 99.8,
    moisturePercent: 15.4,
    pollenMatchPercent: 96.5,
    txHash: '0x2a71...e91b',
    blockNumber: 489234,
    hiveId: 'HIVE-02'
  },
  {
    id: 'HB-2026-0893',
    name: 'Alpine Wildflower Harvest #0893',
    beekeeper: 'Valais Alpine Cooperative',
    location: 'Zermatt Foothills, Switzerland',
    floralSource: 'Alpine Rhododendron & Clover',
    harvestDate: '16 Sep 2026',
    quantityKg: 210.0,
    status: 'In Processing',
    purityScore: 98.2,
    moisturePercent: 17.2,
    pollenMatchPercent: 91.0,
    txHash: '0x5d14...33c9',
    blockNumber: 489255,
    hiveId: 'HIVE-03'
  },
  {
    id: 'HB-2026-0894',
    name: 'Highland Clover Batch #0894',
    beekeeper: 'Canterbury Plains Apiary Ltd',
    location: 'Canterbury Plains, New Zealand',
    floralSource: 'Trifolium Repens (White Clover)',
    harvestDate: '17 Sep 2026',
    quantityKg: 165.0,
    status: 'In Transit',
    purityScore: 97.9,
    moisturePercent: 17.5,
    pollenMatchPercent: 89.8,
    txHash: '0x1c8b...44a7',
    blockNumber: 489280,
    hiveId: 'HIVE-04'
  },
  {
    id: 'HB-2026-0895',
    name: 'Coorg Multifloral Blossom #0895',
    beekeeper: 'Western Ghats Bio-Reserve Coop',
    location: 'Madikeri, Karnataka, India',
    floralSource: 'Syzygium, Coffee Blossom & Jamun',
    harvestDate: '18 Sep 2026',
    quantityKg: 95.0,
    status: 'Raw Harvest',
    purityScore: 96.5,
    moisturePercent: 18.2,
    pollenMatchPercent: 88.0,
    txHash: '0x7b93...6f10',
    blockNumber: 489312,
    hiveId: 'HIVE-01'
  },
  {
    id: 'HB-2026-0896',
    name: 'Suspect Commercial Blend #0896',
    beekeeper: 'Euro-East Bulk Trade LLC',
    location: 'Constanța Port, Romania',
    floralSource: 'Blended Sunflower & Polyfloral',
    harvestDate: '10 Sep 2026',
    quantityKg: 450.0,
    status: 'Flagged',
    purityScore: 42.1,
    moisturePercent: 21.4,
    pollenMatchPercent: 32.0,
    txHash: '0x99e2...bb04',
    blockNumber: 489180,
    hiveId: 'HIVE-03'
  }
];

interface HoneyBatchesPageProps {
  onNavigateTab?: (tab: string, batchId?: string) => void;
}

export const HoneyBatchesPage: React.FC<HoneyBatchesPageProps> = ({ onNavigateTab }) => {
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  // New Batch Form State
  const [newHiveId, setNewHiveId] = useState('HIVE-01');
  const [newName, setNewName] = useState('');
  const [newFloralSource, setNewFloralSource] = useState('Robinia Pseudoacacia (Acacia)');
  const [newQuantity, setNewQuantity] = useState(75);
  const [newBeekeeper, setNewBeekeeper] = useState('Farooq Ahmad Mir & Sons');
  const [newLocation, setNewLocation] = useState('Srinagar Valley, Kashmir, India');

  const filteredBatches = batches.filter(batch => {
    const matchesSearch =
      batch.id.toLowerCase().includes(search.toLowerCase()) ||
      batch.name.toLowerCase().includes(search.toLowerCase()) ||
      batch.beekeeper.toLowerCase().includes(search.toLowerCase()) ||
      batch.floralSource.toLowerCase().includes(search.toLowerCase()) ||
      batch.hiveId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = batches.length + 891;
    const newBatchId = `HB-2026-${nextNum < 1000 ? '0' + nextNum : nextNum}`;
    const newBlock = 489312 + batches.length;
    const newTx = '0x' + Math.random().toString(16).substring(2, 6) + '...' + Math.random().toString(16).substring(2, 6);

    const item: BatchItem = {
      id: newBatchId,
      name: newName.trim() || `Harvest Batch #${nextNum}`,
      beekeeper: newBeekeeper,
      location: newLocation,
      floralSource: newFloralSource,
      harvestDate: 'Today',
      quantityKg: Number(newQuantity),
      status: 'Raw Harvest',
      purityScore: 98.6,
      moisturePercent: 16.9,
      pollenMatchPercent: 93.0,
      txHash: newTx,
      blockNumber: newBlock,
      hiveId: newHiveId
    };

    setBatches([item, ...batches]);
    setIsMintModalOpen(false);
    setSelectedBatch(item);
  };

  const getStatusBadge = (status: BatchItem['status']) => {
    switch (status) {
      case 'Verified for Retail':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified for Retail
          </span>
        );
      case 'Lab Passed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Lab Passed
          </span>
        );
      case 'In Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            In Processing
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            In Transit
          </span>
        );
      case 'Raw Harvest':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Package className="w-3.5 h-3.5 text-slate-500" />
            Raw Harvest
          </span>
        );
      case 'Flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Flagged (Adulterated)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-purple-950 tracking-tight">Honey Batches</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-yellow-300/90 text-purple-950 border border-yellow-400 shadow-2xs">
              {batches.length} Registered
            </span>
          </div>
          <p className="text-sm text-purple-900/60 mt-1 font-medium">
            Tamper-evident batch registry with cryptographic provenance, lab test signatures, and retail passports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const rows = batches.map(b => `${b.id},"${b.name}","${b.floralSource}",${b.quantityKg},${b.purityScore}%,${b.status}`);
              const csvContent = 'data:text/csv;charset=utf-8,Batch ID,Name,Floral Source,Quantity (kg),Purity,Status\n' + rows.join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `honeychain-batches-${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 border border-purple-200 text-purple-900 hover:bg-purple-100 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export CSV
          </button>
          <button
            onClick={() => setIsMintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-yellow-400 hover:bg-yellow-500 text-purple-950 shadow-sm shadow-yellow-400/30 border border-yellow-500/50 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Honey Batch
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search by Batch ID, Beekeeper, Floral type, or Hive ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-purple-50/40 hover:bg-purple-50/70 focus:bg-white text-purple-950 placeholder:text-purple-400 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['ALL', 'Raw Harvest', 'Lab Passed', 'In Processing', 'In Transit', 'Verified for Retail', 'Flagged'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                statusFilter === status
                  ? 'bg-purple-700 text-white shadow-xs font-black'
                  : 'bg-purple-50/70 text-purple-900/80 hover:bg-purple-100 border border-purple-100'
              }`}
            >
              {status === 'ALL' ? 'All Batches' : status}
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-end md:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
              viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Cards
          </button>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-purple-50/50 border-b border-purple-100 text-xs font-bold text-purple-900/70 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Batch ID & Origin</th>
                  <th className="py-3.5 px-4">Floral Source</th>
                  <th className="py-3.5 px-4">Harvest Details</th>
                  <th className="py-3.5 px-4">Quality Score</th>
                  <th className="py-3.5 px-4">Lifecycle Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {filteredBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    onClick={() => setSelectedBatch(batch)}
                    className="hover:bg-purple-50/40 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center font-mono font-black text-xs shrink-0">
                          {batch.hiveId}
                        </div>
                        <div>
                          <div className="font-extrabold text-purple-950 flex items-center gap-1.5">
                            {batch.id}
                            <span className="text-[10px] font-mono font-bold text-purple-900/40">
                              #{batch.blockNumber}
                            </span>
                          </div>
                          <div className="text-xs text-purple-900/60 flex items-center gap-1 mt-0.5 font-medium">
                            <MapPin className="w-3 h-3 text-purple-400" />
                            {batch.beekeeper}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-sm font-medium text-slate-800">{batch.floralSource}</div>
                      <div className="text-xs text-slate-400">Pollen Match: {batch.pollenMatchPercent}%</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs text-slate-800 font-semibold flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-slate-400" />
                        {batch.quantityKg.toFixed(1)} kg
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {batch.harvestDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              batch.purityScore > 90 ? 'bg-emerald-500' : batch.purityScore > 70 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${batch.purityScore}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${
                          batch.purityScore > 90 ? 'text-emerald-700' : batch.purityScore > 70 ? 'text-amber-700' : 'text-rose-700'
                        }`}>
                          {batch.purityScore}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Moisture: {batch.moisturePercent}%
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(batch.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBatch(batch);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigateTab) onNavigateTab('traceability', batch.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-amber-100/70 text-amber-700 transition"
                          title="View Traceability Journey"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBatches.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No honey batches matched your query</p>
              <p className="text-xs text-slate-400 mt-1">Try relaxing your filter or search keywords.</p>
            </div>
          )}
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              onClick={() => setSelectedBatch(batch)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold text-xs flex items-center justify-center">
                      {batch.hiveId}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{batch.id}</div>
                      <div className="text-[11px] font-mono text-slate-400">Block #{batch.blockNumber}</div>
                    </div>
                  </div>
                  {getStatusBadge(batch.status)}
                </div>

                <div className="text-sm font-semibold text-slate-800 line-clamp-1 mb-1">{batch.name}</div>
                <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {batch.beekeeper}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 mb-4 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Floral Species:</span>
                    <span className="font-medium text-slate-900">{batch.floralSource.split('(')[0]}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Harvest Volume:</span>
                    <span className="font-bold text-slate-900">{batch.quantityKg} kg</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Purity Rating:</span>
                    <span className={`font-bold ${batch.purityScore > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {batch.purityScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  TX: {batch.txHash}
                </span>
                <span className="text-amber-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                  Details &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Batch Details Drawer / Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-mono text-xs font-bold">
                    {selectedBatch.id}
                  </span>
                  {getStatusBadge(selectedBatch.status)}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedBatch.name}</h2>
                <p className="text-xs text-slate-500">{selectedBatch.location}</p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[11px] text-slate-400 font-medium">Purity Score</div>
                <div className="text-lg font-bold text-emerald-600 mt-0.5">{selectedBatch.purityScore}%</div>
                <div className="text-[10px] text-slate-400">NMR Verified</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[11px] text-slate-400 font-medium">Moisture</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">{selectedBatch.moisturePercent}%</div>
                <div className="text-[10px] text-emerald-600">&le; 20% Standard</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[11px] text-slate-400 font-medium">Harvest Weight</div>
                <div className="text-lg font-bold text-amber-600 mt-0.5">{selectedBatch.quantityKg} kg</div>
                <div className="text-[10px] text-slate-400">{selectedBatch.hiveId}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[11px] text-slate-400 font-medium">Pollen Match</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">{selectedBatch.pollenMatchPercent}%</div>
                <div className="text-[10px] text-slate-400">Botanical DNA</div>
              </div>
            </div>

            {/* Cryptographic & Ledger Proof */}
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Immutable Consortium Ledger Record
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400">TX Hash:</span> {selectedBatch.txHash}
                </div>
                <div>
                  <span className="text-slate-400">Block Height:</span> #{selectedBatch.blockNumber}
                </div>
                <div>
                  <span className="text-slate-400">Consensus:</span> PBFT 4/4 Signed
                </div>
                <div>
                  <span className="text-slate-400">Smart Contract:</span> 0x8a92...honeychain
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onNavigateTab) {
                      onNavigateTab('traceability', selectedBatch.id);
                      setSelectedBatch(null);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  View Traceability Journey
                </button>
                <button
                  onClick={() => {
                    if (onNavigateTab) {
                      onNavigateTab('qr-verify', selectedBatch.id);
                      setSelectedBatch(null);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-slate-500" />
                  Generate Consumer QR
                </button>
              </div>

              <button
                onClick={() => alert(`Certificate exported for batch ${selectedBatch.id}`)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Lab Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Honey Batch Modal */}
      {isMintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Package className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Mint New Honey Batch</h3>
                  <p className="text-xs text-slate-500">Record a new verified harvest to the ledger</p>
                </div>
              </div>
              <button
                onClick={() => setIsMintModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Commercial Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Kashmir Acacia Harvest #0897"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin Smart Hive</label>
                  <select
                    value={newHiveId}
                    onChange={(e) => setNewHiveId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  >
                    <option value="HIVE-01">HIVE-01 (Kashmir Alpine)</option>
                    <option value="HIVE-02">HIVE-02 (Hadramout Sidr)</option>
                    <option value="HIVE-03">HIVE-03 (Valais Mountain)</option>
                    <option value="HIVE-04">HIVE-04 (Canterbury Plains)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harvest Quantity (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Botanical Floral Source</label>
                <input
                  type="text"
                  value={newFloralSource}
                  onChange={(e) => setNewFloralSource(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Beekeeper / Producer</label>
                  <input
                    type="text"
                    value={newBeekeeper}
                    onChange={(e) => setNewBeekeeper(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Geographic Region</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMintModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition cursor-pointer"
                >
                  Sign & Mint Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
