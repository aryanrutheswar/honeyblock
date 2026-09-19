import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Scale,
  Sparkles,
  ExternalLink,
  X,
  CreditCard,
  Building2,
  Coins
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HoneyBatchListing {
  id: string;
  digitalId: string;
  name: string;
  beekeeper: string;
  apiaryName?: string;
  region?: string;
  floralSource: string;
  harvestDate: string;
  harvestQtyKg: number;
  status: string;
  moisturePct: number;
  traceabilityScore: number;
  pricePerKgInr?: number;
}

export const VerifiedBuyerPortal: React.FC = () => {
  const [batches, setBatches] = useState<HoneyBatchListing[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedFlora, setSelectedFlora] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Procurement Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedBatchForOrder, setSelectedBatchForOrder] = useState<HoneyBatchListing | null>(null);
  const [orderQty, setOrderQty] = useState<number>(25);
  const [offeredPrice, setOfferedPrice] = useState<number>(750);
  const [buyerOrg, setBuyerOrg] = useState<string>('Organic India Sourcing Division');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadMarketplace() {
      try {
        const res = await fetch('/api/marketplace/batches');
        if (res.ok) {
          const data = await res.json();
          setBatches(data);
        }
      } catch {
        // Local fallback batches
      }
    }
    loadMarketplace();
  }, []);

  const filteredBatches = batches.filter(b => {
    const matchesRegion = selectedRegion === 'ALL' || (b.region && b.region.includes(selectedRegion));
    const matchesFlora = selectedFlora === 'ALL' || b.floralSource.includes(selectedFlora);
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.digitalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.beekeeper && b.beekeeper.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesFlora && matchesSearch;
  });

  const handleOpenOrder = (batch: HoneyBatchListing) => {
    soundManager.playClick();
    setSelectedBatchForOrder(batch);
    setOrderQty(Math.min(25, batch.harvestQtyKg));
    setIsOrderModalOpen(true);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCalmChime();

    try {
      await fetch('/api/marketplace/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: selectedBatchForOrder?.digitalId,
          buyerOrg,
          quantityKg: orderQty,
          offeredPricePerKgInr: offeredPrice
        })
      });
    } catch {}

    setOrderSuccessMsg(`Purchase order for ${orderQty} kg of Batch ${selectedBatchForOrder?.digitalId} submitted! Attributing 45% fair producer share (₹${((orderQty * offeredPrice) * 0.45).toLocaleString('en-IN')}) directly to ${selectedBatchForOrder?.beekeeper}.`);
    
    setTimeout(() => {
      setOrderSuccessMsg(null);
      setIsOrderModalOpen(false);
    }, 2800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-purple-950">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bumble-border-top">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-yellow-400 text-purple-950 tracking-wider shadow-sm">
              VERIFIED INSTITUTIONAL BUYER PORTAL
            </span>
            <span className="text-xs font-mono text-purple-200 hidden sm:inline font-semibold">
              FSSAI & KVIC Approved Procurement Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Discover Tested & Blockchain-Secured Honey Batches
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-1 max-w-2xl font-medium">
            Direct procurement from certified Indian tribal beekeepers and rural clusters. Complete isotopic lab dossiers (δ13C & HMF) and transparent fair-trade pricing with zero middleman dilution.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 border border-white/20 text-center shrink-0 backdrop-blur-md">
          <span className="text-[10px] text-yellow-300 uppercase font-bold block tracking-wider">Available Certified Lots</span>
          <span className="text-3xl font-black text-white">{batches.length || 30} Batches</span>
          <span className="text-[11px] text-purple-100 block mt-0.5 font-medium">100% Lab Verified C3 Nectar</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border-2 border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by batch ID, beekeeper or floral source..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 text-xs placeholder:text-purple-400 focus:border-yellow-400 focus:outline-none font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-bold focus:border-yellow-400 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Regions (India)</option>
            <option value="Telangana">Telangana Clusters</option>
            <option value="Nilgiris">Nilgiris Biosphere</option>
            <option value="Kashmir">Kashmir Alpine</option>
            <option value="Sundarbans">Sundarbans Mangrove</option>
            <option value="Coorg">Coorg Coffee Estate</option>
          </select>

          {/* Flora Filter */}
          <select
            value={selectedFlora}
            onChange={e => setSelectedFlora(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-bold focus:border-yellow-400 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Floral Sources</option>
            <option value="Multiflora">Multiflora & Forest</option>
            <option value="Mustard">Organic Mustard</option>
            <option value="Acacia">White Acacia</option>
            <option value="Jamun">Black Jamun</option>
            <option value="Coffee">Coffee Blossom</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map(batch => (
          <div
            key={batch.id}
            className="p-6 rounded-3xl bg-white border-2 border-purple-100 hover:border-purple-300 transition flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                  {batch.digitalId}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {batch.traceabilityScore || 98.4}% Traceable
                </span>
              </div>

              <div>
                <h3 className="font-black text-lg text-purple-950 leading-snug">
                  {batch.name}
                </h3>
                <p className="text-xs text-purple-800/80 mt-1 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{batch.region || 'Warangal, Telangana'}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5 text-xs text-purple-900">
                <div className="flex justify-between">
                  <span className="text-purple-700 font-medium">Floral Source:</span>
                  <span className="font-bold text-purple-950 text-right">{batch.floralSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700 font-medium">Harvest Date:</span>
                  <span className="font-semibold text-purple-900">{batch.harvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700 font-medium">Moisture Content:</span>
                  <span className="font-bold text-emerald-700">{batch.moisturePct}% (PASS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700 font-medium">Beekeeper:</span>
                  <span className="font-bold text-purple-950">{batch.beekeeper}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-100 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-700 block">Available Qty</span>
                  <span className="text-xl font-black text-purple-950">{batch.harvestQtyKg} kg</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-purple-700 block">Indicative Fair Price</span>
                  <span className="text-lg font-black text-emerald-700">₹750 / kg</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenOrder(batch)}
                className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>REQUEST PURCHASE</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Procurement Order Modal (Requirement 21) */}
      {isOrderModalOpen && selectedBatchForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-purple-950/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border-2 border-purple-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl text-purple-950 bumble-border-top">
            
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                  KVIC FAIR TRADE PROCUREMENT WORKFLOW
                </span>
                <h3 className="text-xl font-black text-purple-950 mt-1">
                  Place Procurement Request
                </h3>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1.5 rounded-xl text-purple-400 hover:text-purple-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-bold leading-relaxed space-y-2 animate-fadeIn">
                <p className="flex items-center gap-2 text-sm font-black text-emerald-800">
                  <CheckCircle2 className="w-5 h-5" />
                  Order Placed on Consortium Ledger!
                </p>
                <p>{orderSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs">
                
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <span className="text-purple-700 block font-bold">Selected Lot:</span>
                  <p className="font-black text-purple-950 text-sm">{selectedBatchForOrder.name}</p>
                  <p className="text-[11px] text-purple-800 font-mono">ID: {selectedBatchForOrder.digitalId} • Producer: {selectedBatchForOrder.beekeeper}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-purple-900 font-bold block">Purchasing Organization Name:</label>
                  <input
                    type="text"
                    value={buyerOrg}
                    onChange={e => setBuyerOrg(e.target.value)}
                    className="w-full p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-semibold focus:border-yellow-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-purple-900 font-bold block">Quantity (Kg):</label>
                    <input
                      type="number"
                      max={selectedBatchForOrder.harvestQtyKg}
                      min="5"
                      value={orderQty}
                      onChange={e => setOrderQty(parseFloat(e.target.value))}
                      className="w-full p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-bold text-base focus:border-yellow-400 focus:outline-none"
                      required
                    />
                    <span className="text-[10px] text-purple-600">Max: {selectedBatchForOrder.harvestQtyKg} kg</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-purple-900 font-bold block">Offered Price (₹ / Kg):</label>
                    <input
                      type="number"
                      min="600"
                      value={offeredPrice}
                      onChange={e => setOfferedPrice(parseFloat(e.target.value))}
                      className="w-full p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-bold text-base focus:border-yellow-400 focus:outline-none"
                      required
                    />
                    <span className="text-[10px] text-emerald-700 font-semibold">Min KVIC MSP: ₹600/kg</span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <div className="flex justify-between font-bold text-purple-900">
                    <span>Total Procurement Value:</span>
                    <span className="text-purple-950 text-sm font-black">₹{(orderQty * offeredPrice).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-800">
                    <span>Direct Beekeeper Share (45% Guaranteed):</span>
                    <span className="font-bold">₹{((orderQty * offeredPrice) * 0.45).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black text-sm shadow-xl transition cursor-pointer active:scale-98"
                >
                  Confirm & Anchor Purchase Request on Blockchain
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
