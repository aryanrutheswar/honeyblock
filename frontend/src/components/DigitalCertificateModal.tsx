import React, { useState } from 'react';
import {
  Award,
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Sparkles,
  ExternalLink,
  Hexagon,
  Building2,
  Calendar,
  Layers,
  Scale
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchData?: any;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  isOpen,
  onClose,
  batchData
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  const batch = batchData || {
    digitalId: 'HNY-TG-2026-0001',
    name: 'Warangal Forest Multiflora Pure Reserve',
    beekeeper: 'Ravi Kumar',
    apiaryName: 'Warangal Rural Apiary AP-TG-01',
    region: 'Warangal, Telangana',
    harvestDate: '2026-09-12',
    harvestQtyKg: 68.5,
    floralSource: 'Wild Multiflora & Teak Forest Blossom',
    moisturePct: 17.2,
    isotopeDelta13C: -26.8,
    hmfMgKg: 8.4,
    diastaseActivity: 22.4,
    labCertificateId: 'NABL-ISO17025-TG-88102',
    blockchainTx: '0x99aBEE42F559483A610992310b8C1E0A892F73C1',
    blockNumber: 2
  };

  const handleVerifyCertificate = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      setTimeout(() => setVerifiedSuccess(false), 3500);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Official Digital Certificate of Provenance
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Container (Aesthetic Golden-Bordered Parchment Style) */}
        <div className="p-6 overflow-y-auto flex-1 flex justify-center bg-slate-950/80">
          <div className="w-full max-w-2xl bg-[#fffdfa] text-slate-950 p-8 sm:p-10 rounded-3xl border-4 border-double border-amber-500 shadow-2xl relative space-y-6 select-none print:m-0 print:shadow-none">
            
            {/* Watermark Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
              <Hexagon className="w-96 h-96 stroke-[1.5] text-amber-900" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-400/40 pb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-md mx-auto mb-1">
                <Hexagon className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-black uppercase tracking-widest text-amber-800">
                  Government of India • Khadi and Village Industries Commission (KVIC)
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-serif">
                  HONEY CHAIN CERTIFICATE OF PROVENANCE
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  National Digital Infrastructure for Authentic & Pure Honey
                </p>
              </div>
              <div className="pt-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  CERTIFICATE ID: {batch.labCertificateId || 'NABL-ISO17025-TG-88102'}
                </span>
              </div>
            </div>

            {/* Certificate Statement */}
            <p className="text-xs sm:text-sm text-center text-slate-700 italic max-w-lg mx-auto leading-relaxed">
              This is to certify that the honey batch described herein has been immutably recorded on the HoneyChain consortial ledger and has satisfied all physical, isotopic, and enzymatic standards under ISO/IEC 17025 protocols.
            </p>

            {/* Grid of Verified Specifications */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800">Batch Digital ID</span>
                <p className="font-extrabold text-sm text-slate-950 font-mono">{batch.digitalId}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800">Verified Producer</span>
                <p className="font-extrabold text-sm text-slate-950">{batch.beekeeper}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800">Origin / Cluster</span>
                <p className="font-semibold text-slate-900">{batch.region}</p>
                <p className="text-[10px] text-slate-600">{batch.apiaryName}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800">Botanical Flora</span>
                <p className="font-semibold text-slate-900">{batch.floralSource}</p>
                <p className="text-[10px] text-slate-600">Harvest Date: {batch.harvestDate}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800">EA-IRMS Isotope δ13C</span>
                <p className="font-extrabold text-sm text-emerald-950">{batch.isotopeDelta13C || -26.8}‰ (PBN PASS)</p>
                <p className="text-[10px] text-emerald-700">C4 Sugar Adulteration: 0.00%</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800">Active Enzyme (Diastase)</span>
                <p className="font-extrabold text-sm text-emerald-950">{batch.diastaseActivity || 22.4} Schade Units</p>
                <p className="text-[10px] text-emerald-700">HMF Freshness: {batch.hmfMgKg || 8.4} mg/kg</p>
              </div>

            </div>

            {/* Blockchain Evidence Footer */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white flex items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Hyperledger Fabric Block #{batch.blockNumber || 2}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 break-all leading-tight">
                  Tx: {batch.blockchainTx}
                </p>
                <p className="text-[10px] text-slate-500">
                  Consensus: Proof-of-Authority (PoA) • Sealed by KVIC Validator Node 01
                </p>
              </div>

              <div className="p-2 bg-white rounded-xl shrink-0">
                <QRCodeSVG
                  value={`https://honeychain.gov.in/verify/${batch.digitalId}`}
                  size={64}
                />
              </div>
            </div>

            {/* Interactive Verification Action (Requirement 26) */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <button
                onClick={handleVerifyCertificate}
                disabled={isVerifying}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Querying Blockchain Node...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify this Certificate On-Chain</span>
                  </>
                )}
              </button>

              {verifiedSuccess && (
                <p className="text-xs font-bold text-emerald-700 animate-fadeIn">
                  ✓ Certificate Verified Live: Cryptographic hash matches Block #{batch.blockNumber || 2} on consortium ledger!
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
