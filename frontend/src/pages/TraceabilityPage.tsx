import React, { useState } from 'react';
import {
  SearchCheck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  ShieldCheck,
  Radio,
  Package,
  FlaskConical,
  Cpu,
  Database,
  QrCode,
  Download,
  Share2,
  FileCheck,
  ChevronDown
} from 'lucide-react';

interface TraceabilityPageProps {
  initialBatchId?: string;
  onOpenCertificateModal?: () => void;
}

export const TraceabilityPage: React.FC<TraceabilityPageProps> = ({
  initialBatchId = 'HC-2026-00124',
  onOpenCertificateModal
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);
  const [searchQuery, setSearchQuery] = useState('');

  const batches = [
    {
      id: 'HC-2026-00124',
      name: 'Warangal Forest Multiflora Pure Reserve',
      apiary: 'Warangal Rural Apiary Node AP-TG-01',
      beekeeper: 'Master Beekeeper Rameshwar Rao',
      harvestDate: '12 Sep 2026',
      totalWeightKg: 68.5,
      floralSource: 'Wild Multiflora & Teak Forest Blossom',
      moisturePct: 16.5,
      c4SyrupPct: 0.00,
      c3SyrupPct: 0.00,
      hmfMgKg: 8.2,
      diastaseUnits: 24.8,
      status: 'VERIFIED & CERTIFIED',
      blockNumber: 8421,
      txHash: '0x9b7f4a2104c89e24f8d689b741e29851720a4b73'
    },
    {
      id: 'HC-2026-00125',
      name: 'Nilgiri Kurinji Wild Blossom Lot #4',
      apiary: 'Nilgiri Biosphere Apiary Node AP-NIL-01',
      beekeeper: 'Nilgiri Beekeepers Federation',
      harvestDate: '14 Sep 2026',
      totalWeightKg: 42.0,
      floralSource: 'Wild Kurinji & Acacia Blossom',
      moisturePct: 17.1,
      c4SyrupPct: 0.00,
      c3SyrupPct: 0.00,
      hmfMgKg: 9.4,
      diastaseUnits: 22.1,
      status: 'PROCESSING',
      blockNumber: 8425,
      txHash: '0x3c8a92714ef0182490bb9420bfa4721950d87132'
    },
    {
      id: 'HC-2026-00126',
      name: 'Kashmir White Acacia Single-Flora',
      apiary: 'Pahalgam Alpine Valley Apiary',
      beekeeper: 'Himalayan Organic Honey Collective',
      harvestDate: '16 Sep 2026',
      totalWeightKg: 85.0,
      floralSource: 'Pure White Acacia Blossom',
      moisturePct: 16.2,
      c4SyrupPct: 0.00,
      c3SyrupPct: 0.00,
      hmfMgKg: 6.8,
      diastaseUnits: 28.4,
      status: 'QUALITY_TESTING',
      blockNumber: 8429,
      txHash: '0x8192a4bc0891d4e21a8f940bb174205a9173f401'
    }
  ];

  const currentBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  // 7 Connected Stages
  const journeyStages = [
    {
      step: 1,
      id: 'hive',
      title: 'Hive Origin & Bio-Acoustics',
      icon: Radio,
      date: '10 Sep 2026 • 06:30 AM',
      location: 'Nilgiri Biosphere Reserve (11.41° N, 76.69° E, 2,240m)',
      entity: 'Smart Hive H-NILGIRI-014 (LoRaWAN Node)',
      status: 'Normal & Stable',
      verification: 'IoT Hardware Enclave Telemetry ✓',
      details: 'Brood temperature steady at 34.8°C. Scale weight 42.5 kg. Queen acoustic frequency 240 Hz indicating calm, stress-free colony state.'
    },
    {
      step: 2,
      id: 'harvest',
      title: 'Harvest & Beemaster Notarization',
      icon: Package,
      date: '12 Sep 2026 • 09:15 AM',
      location: 'Apiary Field Processing Station #3',
      entity: currentBatch.beekeeper,
      status: 'Harvest Recorded (68.5 kg)',
      verification: 'FIDO2 Biometric Hardware Sign-off ✓',
      details: 'Raw comb honey gently harvested without smoke contamination. Initial refractometer reading indicated 16.5% moisture content.'
    },
    {
      step: 3,
      id: 'quality',
      title: 'NABL Certified Quality Testing',
      icon: FlaskConical,
      date: '13 Sep 2026 • 02:40 PM',
      location: 'NABL Accredited Facility #TN-99824',
      entity: 'Lead Chemist Dr. K. Ramanathan',
      status: '100% Pure Raw Grade A Passed',
      verification: 'ISO/IEC 17025 Certificate Locked ✓',
      details: 'EA-IRMS carbon isotope mass spec: δ¹³C -26.8‰ (0.00% C4 cane/corn syrup, 0.00% C3 rice syrup). Thermal freshness HMF: 8.2 mg/kg. Diastase: 24.8 Schade Units.'
    },
    {
      step: 4,
      id: 'processing',
      title: 'Cold Micro-Filtration & Settling',
      icon: Cpu,
      date: '14 Sep 2026 • 11:20 AM',
      location: 'KVIC Honey Processing Facility #02',
      entity: 'KVIC Processing Team',
      status: 'Processing Complete',
      verification: 'GMP & FSSAI Standards Compliant ✓',
      details: 'Cold micro-filtered through fine stainless steel mesh to preserve active enzymes, botanical pollen grains, and natural volatile aromas.'
    },
    {
      step: 5,
      id: 'blockchain',
      title: 'Hyperledger Consortium Record',
      icon: Database,
      date: '14 Sep 2026 • 04:55 PM',
      location: 'Hyperledger Fabric Consortium Network',
      entity: 'PBFT Consensus Peers (4/4 Nodes)',
      status: `Committed on Block #${currentBatch.blockNumber}`,
      verification: 'SHA-256 Merkle Proof Verified ✓',
      details: `Signed state anchor anchored on-chain with transaction hash ${currentBatch.txHash}. Immutable and tamper-evident.`
    },
    {
      step: 6,
      id: 'packaging',
      title: 'Packaging & Serialized Barcode Seal',
      icon: Package,
      date: '15 Sep 2026 • 08:30 AM',
      location: 'Certified Packaging Facility',
      entity: 'Quality Packaging Supervisor',
      status: 'Sealed & Serialized',
      verification: 'Tamper-Evident Seal Attached ✓',
      details: 'Bottled in food-grade UV-protective amber glass jars with serialized tamper-evident barcode seal EAN-13: 8901030084210.'
    },
    {
      step: 7,
      id: 'consumer',
      title: 'Consumer Verification Active',
      icon: QrCode,
      date: '16 Sep 2026 • Present',
      location: 'Retail Distribution & Public Scanners',
      entity: 'End Consumers & Verifiers',
      status: 'Public Verification Ready',
      verification: 'Instant Smartphone Passport ✓',
      details: 'Public verifiers and retail customers can scan the bottle barcode with any smartphone camera to inspect the immutable journey.'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Header & Batch Selector */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            End-to-End Honey Provenance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Honey Batch Traceability
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Track every verifiable milestone from hive bio-acoustics and beekeeper harvesting to ISO lab testing and retail verification.
          </p>
        </div>

        {/* Batch Dropdown & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[240px]">
            <select
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white cursor-pointer"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.id} — {b.name}
                </option>
              ))}
            </select>
          </div>

          {onOpenCertificateModal && (
            <button
              type="button"
              onClick={onOpenCertificateModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition cursor-pointer shrink-0"
            >
              <FileCheck className="w-4 h-4 text-amber-600" />
              <span>Digital Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Batch Summary Card */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {currentBatch.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {currentBatch.status}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {currentBatch.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentBatch.apiary}</span>
              <span className="text-slate-300">•</span>
              <span>Producer: {currentBatch.beekeeper}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Harvest Qty</span>
              <span className="text-base font-extrabold text-slate-900">{currentBatch.totalWeightKg} kg</span>
            </div>
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Moisture</span>
              <span className="text-base font-extrabold text-emerald-700">{currentBatch.moisturePct}% (PASS)</span>
            </div>
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Isotope δ¹³C</span>
              <span className="text-base font-extrabold text-slate-900">-26.8‰</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <span className="text-slate-400 text-[11px] block">Botanical Floral Source:</span>
            <span className="font-semibold text-slate-800">{currentBatch.floralSource}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Thermal Freshness (HMF):</span>
            <span className="font-semibold text-emerald-700">{currentBatch.hmfMgKg} mg/kg (Grade A Raw)</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Active Diastase Units:</span>
            <span className="font-semibold text-slate-800">{currentBatch.diastaseUnits} Schade</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Consortium Ledger Block:</span>
            <span className="font-mono font-semibold text-amber-700">Block #{currentBatch.blockNumber}</span>
          </div>
        </div>
      </div>

      {/* 7-Stage Connected Timeline */}
      <div className="saas-card p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <SearchCheck className="w-4 h-4 text-amber-600" />
            <span>Complete 7-Stage Verified Honey Lifecycle</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every step is signed by authorized hardware, certified personnel, or consensus nodes
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-amber-200">
          {journeyStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div key={stage.step} className="relative group">
                {/* Node Dot / Icon */}
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white border-2 border-amber-500 text-amber-600 flex items-center justify-center text-xs font-bold shadow-xs group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  {stage.step}
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-slate-50/50 transition space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {stage.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {stage.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stage.details}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{stage.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{stage.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-800 font-semibold sm:text-right sm:justify-end">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{stage.verification}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
