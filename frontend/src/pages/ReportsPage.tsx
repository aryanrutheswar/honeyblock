import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Scan, 
  Radio, 
  Truck, 
  Flower2, 
  Link2,
  X,
  ExternalLink
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportTemplates = [
    {
      id: 'batch_provenance',
      title: 'Batch Provenance Dossier (HC-2026-AP-004821)',
      category: 'SUPPLY CHAIN & HONEY PASSPORT',
      desc: 'Complete harvest metadata, beekeeper identity, cold-chain events, and blockchain transaction proofs.',
      icon: FileText
    },
    {
      id: 'spectral_screen',
      title: 'SpectraSeal™ NIR Quality Screening Certificate',
      category: 'OPTICAL QUALITY EVIDENCE',
      desc: '25-point wavelength absorbance curve, reference delta scores, C3/C4 syrup exclusion results, and SHA-256 fingerprint.',
      icon: Scan
    },
    {
      id: 'hive_health',
      title: 'BeeGuard™ Bio-Acoustic Health Audit',
      category: 'COLONY TELEMETRY',
      desc: '16-interval frequency spectrogram analysis, queen presence harmonics, swarming risk curves, and yield forecast.',
      icon: Radio
    },
    {
      id: 'logistics_audit',
      title: 'Cold-Chain Logistics & Custody Handover Report',
      category: 'DISTRIBUTION INTEGRITY',
      desc: 'Pallet thermal sensor time-series, transit GPS stamps, and digital tamper seal verification log.',
      icon: Truck
    },
    {
      id: 'pollination_proof',
      title: 'Pollination Service Ecosystem Credit Certificate',
      category: 'TOKENIZED POLLINATION',
      desc: 'Acoustic flight hour proof (412 hours), grower sign-off, fruit set estimate (+28.4%), and 185 POL-CRD mint record.',
      icon: Flower2
    },
    {
      id: 'blockchain_ledger',
      title: 'Consortium Permissioned Blockchain Audit',
      category: 'CRYPTOGRAPHIC IMMUTABILITY',
      desc: 'Complete block header hashes, prevHash Merkle verification, validator PBFT signatures, and tamper integrity proof.',
      icon: Link2
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
            <FileSpreadsheet className="h-5 w-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Reports & Regulatory Audit Generator
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Export Verified Batch Dossiers, Optical Spectra, Bio-Acoustic Logs & Blockchain Proofs
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTemplates.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-lg bg-amber-500/15 p-2 text-amber-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-slate-950 px-2.5 py-0.5 text-[9px] font-bold text-slate-400 font-mono">
                    {rep.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{rep.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedReport(rep.id)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Preview & Generate Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl border border-amber-500/30 bg-slate-900 shadow-2xl p-6 overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Official Cryptographic Document Preview
                </h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Sheet Preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 text-xs font-mono text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white font-sans">HONEYCHAIN VERIFIED AUDIT DOSSIER</h4>
                  <p className="text-[10px] text-amber-400">SMART INDIA HACKATHON 2026 EDITION</p>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <p>Document Ref: HC-DOC-8921</p>
                  <p>Date: {new Date().toISOString().split('T')[0]}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><strong className="text-slate-400">Batch Target:</strong> HC-2026-AP-004821</div>
                <div><strong className="text-slate-400">Floral Origin:</strong> Acacia Reserve (Kashmir)</div>
                <div><strong className="text-slate-400">SpectraSeal Match:</strong> 98.4% (PASS)</div>
                <div><strong className="text-slate-400">Ledger Block:</strong> Block #1042 (Immutable)</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[10px] space-y-1">
                <p className="text-emerald-400 font-bold">CRYPTOGRAPHIC CERTIFICATION STATEMENT:</p>
                <p>The undersigned consortium consensus nodes certify that physical optical measurements and bio-acoustic telemetry for this batch were recorded autonomously and anchored without post-harvest tampering.</p>
                <p className="text-slate-500 truncate pt-1">Evidence Hash: sha256:8f2d6199a4c84be7a7a10243bfa993e0b2e811c0989f6d483e0c031ef09c3e12</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close Preview
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow"
              >
                <Printer className="h-4 w-4 text-slate-950" />
                <span>Print / Save PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      <DisclaimerBanner type="general" />

    </div>
  );
};
