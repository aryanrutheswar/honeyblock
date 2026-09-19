import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  MapPin,
  Trees,
  Award,
  Calendar,
  Radio,
  FlaskConical,
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';

export const ConsumerQRVerificationPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState('NILGIRI-RAW');

  const products = [
    {
      id: 'NILGIRI-RAW',
      name: 'Nilgiri Mountain Wild Kurinji Reserve',
      tagline: '100% Pure Raw Forest Honey • Cold-Filtered',
      brand: 'Nilgiri Mountain Honey Co.',
      floralSource: 'Wild Kurinji (Strobilanthes) & Acacia Blossom',
      origin: 'Nilgiris Biosphere Reserve, Tamil Nadu (2,240m elevation)',
      hiveInfo: 'Smart Apiary Node #014 • Organic Forest Reserve',
      harvestDate: '12 September 2026',
      qualityStatus: '100% Pure Raw Honey (Passed ISO-17025)',
      hmfFreshness: '8.2 mg/kg (Raw & Unheated)',
      diastaseEnzyme: '24.8 Schade Units (Active Enzymes)',
      purityRating: '100% Natural • 0.00% Added Syrups',
      batchNumber: 'HC-2026-00124',
      eanBarcode: '8901030084210'
    },
    {
      id: 'KASHMIR-ACACIA',
      name: 'Kashmir High-Altitude White Acacia',
      tagline: 'Single-Flora Organic Honey • Ultra-Light Gold',
      brand: 'Himalayan Blossom Apiaries',
      floralSource: 'Wild White Acacia Blossom (Robinia)',
      origin: 'Pahalgam Valley, Kashmir (1,850m elevation)',
      hiveInfo: 'Smart Apiary Node #008 • Alpine Reserve',
      harvestDate: '16 September 2026',
      qualityStatus: 'Certified Pure (Passed EA-IRMS Isotope Test)',
      hmfFreshness: '6.8 mg/kg (Raw & Unheated)',
      diastaseEnzyme: '28.4 Schade Units',
      purityRating: '100% Natural • 0.00% Added Syrups',
      batchNumber: 'HC-2026-00126',
      eanBarcode: '8901030091020'
    }
  ];

  const currentProduct = products.find(p => p.id === selectedProduct) || products[0];

  const consumerTimeline = [
    {
      step: 1,
      title: 'Pristine Forest Nectar Gathered',
      desc: 'Bees foraged in protected biosphere forests with zero pesticide exposure.',
      date: '10–12 Sep 2026',
      icon: Trees
    },
    {
      step: 2,
      title: 'Ethically Harvested & Biometrically Signed',
      desc: 'Cold harvested by certified local beekeepers preserving living enzymes.',
      date: '12 Sep 2026',
      icon: Radio
    },
    {
      step: 3,
      title: 'NABL Certified Quality Lab Tested',
      desc: 'EA-IRMS isotope testing confirmed zero C4 corn/cane syrups or inverted rice sugars.',
      date: '13 Sep 2026',
      icon: FlaskConical
    },
    {
      step: 4,
      title: 'Cryptographic Guarantee Anchored on Ledger',
      desc: 'Immutable certificate locked onto the consortium ledger for public verification.',
      date: '14 Sep 2026',
      icon: ShieldCheck
    },
    {
      step: 5,
      title: 'Verified Authentic By You',
      desc: 'Digital passport scanned and cryptographically validated on your screen.',
      date: 'Today • Real-time',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Consumer Trust Verification Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Honey Bottle Verification Passport
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified origin, laboratory test dossier, and complete journey for your bottle of honey.
          </p>
        </div>

        {/* Sample Bottle Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="NILGIRI-RAW">Sample 1: Nilgiri Kurinji</option>
            <option value="KASHMIR-ACACIA">Sample 2: Kashmir Acacia</option>
          </select>
        </div>
      </div>

      {/* Main Verified Passport Card */}
      <div className="saas-card p-6 sm:p-8 space-y-6">
        
        {/* Verification Badge & Bottle Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>✓ Authenticity Verified</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                Batch #{currentProduct.batchNumber}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentProduct.name}
            </h2>
            <p className="text-xs font-semibold text-amber-700">
              {currentProduct.brand} • {currentProduct.tagline}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Barcode Seal</span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 inline-block mt-0.5">
              {currentProduct.eanBarcode}
            </span>
          </div>
        </div>

        {/* Essential Honey Transparency Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Trees className="w-4 h-4 text-amber-600" />
              <span>Floral Source & Forest Origin</span>
            </div>
            <div className="space-y-1 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Botanical Nectar:</span>
                <span className="font-semibold text-slate-900">{currentProduct.floralSource}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block text-[11px]">Geographic Origin:</span>
                <span className="font-semibold text-slate-900">{currentProduct.origin}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              <span>Quality & Purity Certification</span>
            </div>
            <div className="space-y-1 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Purity Standard:</span>
                <span className="font-bold text-emerald-700">{currentProduct.purityRating}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block text-[11px]">Thermal Freshness (HMF):</span>
                <span className="font-semibold text-slate-900">{currentProduct.hmfFreshness}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>Smart Hive Information</span>
            </div>
            <div className="space-y-1 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Hive Telemetry Node:</span>
                <span className="font-semibold text-slate-900">{currentProduct.hiveInfo}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block text-[11px]">Harvest Date:</span>
                <span className="font-semibold text-slate-900">{currentProduct.harvestDate}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Cryptographic Seal</span>
            </div>
            <div className="space-y-1 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Consortium Ledger:</span>
                <span className="font-mono text-slate-900 font-semibold">Block #8421 (Verified PBFT)</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block text-[11px]">Public Inspection Status:</span>
                <span className="font-bold text-emerald-700">100% Genuine Certified</span>
              </div>
            </div>
          </div>

        </div>

        {/* Consumer Honey Journey Timeline */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>The Journey of Your Honey</span>
          </h3>

          <div className="space-y-3">
            {consumerTimeline.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3.5"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
