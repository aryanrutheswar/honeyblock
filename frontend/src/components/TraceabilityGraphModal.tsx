import React, { useState } from 'react';
import {
  GitBranch,
  X,
  Layers,
  MapPin,
  Cpu,
  Package,
  Truck,
  ShoppingBag,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Scale
} from 'lucide-react';

interface TraceabilityGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId?: string;
}

interface NodeData {
  id: string;
  type: 'cluster' | 'apiary' | 'hive' | 'batch' | 'processing' | 'package_lot' | 'jar' | 'retailer';
  title: string;
  subtitle: string;
  status: string;
  actor: string;
  location: string;
  timestamp: string;
  hash: string;
  details: Record<string, string | number>;
}

export const TraceabilityGraphModal: React.FC<TraceabilityGraphModalProps> = ({
  isOpen,
  onClose,
  batchId = 'HNY-TG-2026-0001'
}) => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [viewMode, setViewMode] = useState<'provenance_graph' | 'split_genealogy'>('provenance_graph');

  if (!isOpen) return null;

  const nodes: NodeData[] = [
    {
      id: 'node-cluster',
      type: 'cluster',
      title: 'KVIC Warangal Cluster',
      subtitle: 'Cluster Governance Node CL-TG-01',
      status: 'VERIFIED_ACTIVE',
      actor: 'Dr. V. Prasad, KVIC Officer',
      location: 'Warangal & Mulugu Forest Belt, Telangana',
      timestamp: '2026-08-01 09:00:00 IST',
      hash: '0x8f2c3d19b4e6a8d7e0f1c2b3a4e5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
      details: {
        'Cluster Region': 'Warangal Rural Belt',
        'Registered Beekeepers': '18',
        'Active Hives': '64',
        'Annual Capacity': '840.5 kg',
        'Audit Status': '100% Compliant'
      }
    },
    {
      id: 'node-apiary',
      type: 'apiary',
      title: 'Warangal Rural Apiary AP-TG-01',
      subtitle: 'Wild Multiflora & Teak Reserve',
      status: 'GPS_VERIFIED',
      actor: 'Beekeeper Ravi Kumar',
      location: '17.9689° N, 79.5941° E (Altitude 302m)',
      timestamp: '2026-08-15 06:30:00 IST',
      hash: '0x3c99a80e15b2210e719df6b49912c0199182a472c10928bb1892019ab9281a',
      details: {
        'Geo-Coordinates': '17.9689° N, 79.5941° E',
        'Foraging Range': '3.2 km Radius',
        'Primary Flora': 'Teak Blossom & Wild Forest Multiflora',
        'Micro-Climate': 'Semi-Arid Forest Fringe'
      }
    },
    {
      id: 'node-hive',
      type: 'hive',
      title: 'Smart Hive HIVE-TG-017',
      subtitle: 'IoT Telemetry Edge Enclave',
      status: 'EQUILIBRIUM_OPTIMAL',
      actor: 'ESP32 Bio-Acoustic Sentinel',
      location: 'Brood Box #04, Hive Stand A-17',
      timestamp: '2026-09-12 07:15:00 IST',
      hash: '0x7f4ac9188e95c1c0429f635c9118c7e920d3f2095bf8915e8b4e78a2d3e1104a',
      details: {
        'Colony Species': 'Apis cerana indica',
        'Queen Frequency': '240 Hz (Resonant & Active)',
        'Brood Thermoregulation': '34.2°C (Optimal)',
        'Pre-Harvest Scale Weight': '42.7 kg',
        'Health Index': '86 / 100'
      }
    },
    {
      id: 'node-batch',
      type: 'batch',
      title: 'Harvest Batch HNY-TG-2026-0001',
      subtitle: '68.5 kg Multiflora Pure Reserve',
      status: 'BLOCKCHAIN_MINTED',
      actor: 'Beekeeper Ravi Kumar',
      location: 'Tare Scale Station, Warangal Apiary',
      timestamp: '2026-09-12 08:30:00 IST',
      hash: '0x99aBEE42F559483A610992310b8C1E0A892F73C14882199042bcee81944a10',
      details: {
        'Batch Digital ID': 'HNY-TG-2026-0001',
        'Harvest Quantity': '68.5 kg',
        'Moisture Content': '17.2%',
        'EA-IRMS Carbon δ13C': '-26.8‰ (Natural C3 Botanical)',
        'Diastase Enzyme Activity': '22.4 DN (Grade A Active)'
      }
    },
    {
      id: 'node-processing',
      type: 'processing',
      title: 'Processing Lot P-001',
      subtitle: 'Cold Micro-Filtration at 38°C',
      status: 'ENZYMES_PRESERVED',
      actor: 'KVIC Agro-Processing Unit #02',
      location: 'Warangal Central Processing Enclave',
      timestamp: '2026-09-13 14:00:00 IST',
      hash: '0x55dca81944a10e0f1c2b3a4e5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4',
      details: {
        'Process Method': 'Centrifugal Extraction & Raw Filter',
        'Thermal Exposure': '38°C Max (Raw Unpasteurized)',
        'Pollen Grain Integrity': '96.8% Preserved',
        'Batch Yield': '67.2 kg Net Pure Honey'
      }
    },
    {
      id: 'node-pkg-a',
      type: 'package_lot',
      title: 'Lot PKG-TG-0001-A (500g)',
      subtitle: '50 Glass Jars with Tamper Seals',
      status: 'SPLIT_CHILD_BATCH',
      actor: 'Automated Bottling Line 04',
      location: 'KVIC Bottling Facility, Warangal',
      timestamp: '2026-09-14 10:15:00 IST',
      hash: '0x12a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4',
      details: {
        'Parent Batch ID': 'HNY-TG-2026-0001',
        'Package Spec': '500g Octagonal Glass Jar',
        'Unit Count': '50 Units',
        'Seal Mechanism': 'NFC Tag + Holographic Cryptographic QR',
        'Serial Range': 'HNY-JAR-TG-001 .. HNY-JAR-TG-050'
      }
    },
    {
      id: 'node-pkg-b',
      type: 'package_lot',
      title: 'Lot PKG-TG-0001-B (250g)',
      subtitle: '100 Squeeze Bottles with Anti-Drip',
      status: 'SPLIT_CHILD_BATCH',
      actor: 'Automated Bottling Line 04',
      location: 'KVIC Bottling Facility, Warangal',
      timestamp: '2026-09-14 11:30:00 IST',
      hash: '0x44c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
      details: {
        'Parent Batch ID': 'HNY-TG-2026-0001',
        'Package Spec': '250g Squeeze Bottle',
        'Unit Count': '100 Units',
        'Serial Range': 'HNY-SQZ-TG-001 .. HNY-SQZ-TG-100'
      }
    },
    {
      id: 'node-retail',
      type: 'retailer',
      title: 'Khadi Gramodyog Bhavan Hyderabad',
      subtitle: 'Verified Retail Node #14',
      status: 'ON_SHELF_PUBLIC_SCAN',
      actor: 'Store Compliance Manager',
      location: 'Banjara Hills, Hyderabad, Telangana',
      timestamp: '2026-09-16 10:00:00 IST',
      hash: '0x77e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
      details: {
        'Retailer ID': 'KVIC-RET-HYD-014',
        'Cold Storage Temp': '21.4°C Monitored',
        'Shelf Stock': '32 Jars Available',
        'Consumer Price': '₹390 / 500g Jar',
        'Producer Benefit Share': '₹175.50 (45% Direct Fair Trade)'
      }
    }
  ];

  const activeNode = selectedNode || nodes[3]; // Default to harvest batch

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Dynamic Provenance & Batch Genealogy Graph
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {batchId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive cryptographic lineage from apiary floral source to consumer retail jar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setViewMode('provenance_graph')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'provenance_graph'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Full Provenance Flow
              </button>
              <button
                onClick={() => setViewMode('split_genealogy')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'split_genealogy'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Batch Split & Merge Genealogy
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Graph Canvas + Details Drawer */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left / Center: Interactive Node Canvas */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-950/60 honeycomb-pattern-subtle">
            
            {viewMode === 'provenance_graph' ? (
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                    Click Any Node To Inspect On-Chain Evidence
                  </span>
                </div>

                {nodes.map((node, index) => {
                  const isSelected = activeNode.id === node.id;
                  return (
                    <div key={node.id} className="relative">
                      {/* Connector Line */}
                      {index < nodes.length - 1 && (
                        <div className="absolute left-6 top-14 w-0.5 h-8 bg-gradient-to-b from-amber-500 to-amber-500/20 -z-0" />
                      )}

                      <div
                        onClick={() => setSelectedNode(node)}
                        className={`relative z-10 flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/90 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                              : 'bg-slate-800 text-amber-400 border-slate-700'
                          }`}>
                            {node.type === 'cluster' && <MapPin className="w-6 h-6" />}
                            {node.type === 'apiary' && <Layers className="w-6 h-6" />}
                            {node.type === 'hive' && <Cpu className="w-6 h-6" />}
                            {node.type === 'batch' && <Scale className="w-6 h-6" />}
                            {node.type === 'processing' && <Sparkles className="w-6 h-6" />}
                            {node.type === 'package_lot' && <Package className="w-6 h-6" />}
                            {node.type === 'retailer' && <ShoppingBag className="w-6 h-6" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm sm:text-base text-white">
                                {node.title}
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                                {node.type.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {node.subtitle} • {node.location}
                            </p>
                          </div>
                        </div>

                        <div className="text-right hidden sm:block">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            node.status.includes('VERIFIED') || node.status.includes('OPTIMAL') || node.status.includes('MINTED')
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            {node.status}
                          </span>
                          <p className="text-[10px] text-slate-500 font-mono mt-1">
                            {node.timestamp.split(' ')[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Batch Split / Merge Genealogy Tree View */
              <div className="p-4 space-y-6 max-w-3xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Real-World Batch Genealogy Architecture</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    In industrial beekeeping, a single large raw harvest batch (e.g. 68.5 kg from HNY-TG-2026-0001) is divided into specialized packaging lots. Every individual child jar retains an immutable cryptographic pointer back to its parent batch and smart hive source.
                  </p>
                </div>

                {/* Tree Visualization */}
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
                  {/* Root Parent Batch */}
                  <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-500/10 max-w-md mx-auto text-center shadow-lg shadow-amber-500/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                      Parent Harvest Batch (Root)
                    </span>
                    <h3 className="font-extrabold text-lg text-white mt-1">
                      HNY-TG-2026-0001
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Total Volume: 68.5 kg Multiflora Raw Nectar • Hive H-017
                    </p>
                  </div>

                  {/* Fork Connector Arrow */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-amber-400" />
                  </div>

                  {/* Children Split Lots */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-700 bg-slate-800 hover:border-amber-400 transition cursor-pointer">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Child Lot A (500g)
                      </span>
                      <h4 className="font-bold text-white mt-2 text-sm">PKG-TG-0001-A</h4>
                      <p className="text-xs text-slate-400 mt-1">50 Octagonal Jars</p>
                      <p className="text-[10px] text-amber-300/80 font-mono mt-2">Parent: HNY-TG-2026-0001</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-700 bg-slate-800 hover:border-amber-400 transition cursor-pointer">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Child Lot B (250g)
                      </span>
                      <h4 className="font-bold text-white mt-2 text-sm">PKG-TG-0001-B</h4>
                      <p className="text-xs text-slate-400 mt-1">100 Squeeze Bottles</p>
                      <p className="text-[10px] text-amber-300/80 font-mono mt-2">Parent: HNY-TG-2026-0001</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-700 bg-slate-800 hover:border-amber-400 transition cursor-pointer">
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                        Child Lot C (1kg)
                      </span>
                      <h4 className="font-bold text-white mt-2 text-sm">PKG-TG-0001-C</h4>
                      <p className="text-xs text-slate-400 mt-1">18 Ceramic Crocks</p>
                      <p className="text-[10px] text-amber-300/80 font-mono mt-2">Parent: HNY-TG-2026-0001</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right: Selected Node Details Drawer */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/95 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {activeNode.type.toUpperCase()} EVIDENCE NODE
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  {activeNode.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {activeNode.subtitle}
                </p>
              </div>

              {/* Status Banner */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">Ledger Status:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {activeNode.status}
                </span>
              </div>

              {/* Node Attribute Table */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Node Telemetry & Parameters
                </h5>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2 text-xs">
                  {Object.entries(activeNode.details).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-slate-400">{key}</span>
                      <span className="font-semibold text-white text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actor & Timestamp */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Actor: <strong className="text-slate-200">{activeNode.actor}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Timestamp: <strong className="text-slate-200">{activeNode.timestamp}</strong></span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Cryptographic SHA-256 Hash
                </span>
                <p className="text-[11px] font-mono text-slate-300 break-all select-all leading-tight">
                  {activeNode.hash}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Close Provenance Viewer
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
