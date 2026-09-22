import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Truck,
  CheckCircle2,
  Calendar,
  Layers,
  Thermometer,
  Wind,
  Droplets,
  ShieldCheck,
  ChevronRight,
  Info,
  Flower,
  Radar,
  Radio,
  Sliders,
  ExternalLink,
  X
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export interface FlowerBloomData {
  id: string;
  name: string;
  botanicalName: string;
  category: 'Wild Forest' | 'Agricultural' | 'Medicinal' | 'High Altitude';
  bloomPct: number; // 0 - 100
  status: 'Peak Bloom' | 'Active Flow' | 'Budding / Opening' | 'Ending Soon';
  distanceKm: number;
  direction: 'East' | 'North' | 'North-East' | 'South' | 'South-East' | 'South-West' | 'West' | 'North-West';
  nectarRating: 'Exceptional' | 'High' | 'Moderate';
  nectarFlowRateKgDay: number; // kg/day/colony
  pollenQuality: string;
  sugarBrix: string;
  honeyType: string;
  bestHarvestWindow: string;
  recommendedHiveCount: number;
  migrationFeasibility: 'Highly Recommended' | 'Recommended' | 'Optimal Stays Here';
  yieldBoostKg: number;
  projectedBonusEarnings: number;
  description: string;
  coordinates: { x: number; y: number }; // Radar relative coordinates (-100 to 100)
}

export interface RegionalBloomZone {
  id: string;
  regionName: string;
  state: string;
  intensity: 'peak' | 'moderate' | 'sparse'; // peak = green, moderate = yellow, sparse = amber/orange
  primaryFlora: string;
  bloomCoveragePct: number;
  foragingStatus: string;
  activeApiariesCount: number;
  hotspotCoords: { cx: number; cy: number }; // SVG coordinates on India map
}

const REGIONAL_ZONES: RegionalBloomZone[] = [
  {
    id: 'zone-tg',
    regionName: 'Warangal & Mulugu Teak Forests',
    state: 'Telangana',
    intensity: 'peak',
    primaryFlora: 'Wild Multiflora & Teak Blossom',
    bloomCoveragePct: 94,
    foragingStatus: 'Peak Nectar Flow (Surplus Inflow)',
    activeApiariesCount: 42,
    hotspotCoords: { cx: 280, cy: 380 }
  },
  {
    id: 'zone-nil',
    regionName: 'Nilgiri Biosphere Shola Reserve',
    state: 'Tamil Nadu',
    intensity: 'peak',
    primaryFlora: 'Wild Kurinji & Forest Jamun',
    bloomCoveragePct: 91,
    foragingStatus: 'Rare High-Potency Nectar Run',
    activeApiariesCount: 28,
    hotspotCoords: { cx: 245, cy: 500 }
  },
  {
    id: 'zone-ksh',
    regionName: 'Pahalgam Alpine Valley',
    state: 'Jammu & Kashmir',
    intensity: 'peak',
    primaryFlora: 'White Acacia (Robinia) & Wild Thyme',
    bloomCoveragePct: 88,
    foragingStatus: 'High Altitude Water-Clear Flow',
    activeApiariesCount: 19,
    hotspotCoords: { cx: 185, cy: 110 }
  },
  {
    id: 'zone-ka',
    regionName: 'Coorg & Western Ghats Canopy',
    state: 'Karnataka',
    intensity: 'peak',
    primaryFlora: 'Arabica Coffee Blossom & Cardamom',
    bloomCoveragePct: 86,
    foragingStatus: 'Rapid 4-Day Super Blossom',
    activeApiariesCount: 34,
    hotspotCoords: { cx: 225, cy: 465 }
  },
  {
    id: 'zone-rj',
    regionName: 'Shekhawati Semi-Arid Organic Belt',
    state: 'Rajasthan',
    intensity: 'moderate',
    primaryFlora: 'Yellow Mustard (Brassica) & Kikar',
    bloomCoveragePct: 76,
    foragingStatus: 'Steady Agricultural Pollen & Nectar',
    activeApiariesCount: 65,
    hotspotCoords: { cx: 180, cy: 240 }
  },
  {
    id: 'zone-wb',
    regionName: 'Sundarbans Coastal Mangrove',
    state: 'West Bengal',
    intensity: 'moderate',
    primaryFlora: 'Khalisa & Goran Wild Mangrove',
    bloomCoveragePct: 72,
    foragingStatus: 'Seasonal Wild Mangrove Inflow',
    activeApiariesCount: 31,
    hotspotCoords: { cx: 400, cy: 340 }
  },
  {
    id: 'zone-hp',
    regionName: 'Kullu Apple & Wild Flora Belt',
    state: 'Himachal Pradesh',
    intensity: 'peak',
    primaryFlora: 'Apple Blossom & Wild Rhododendron',
    bloomCoveragePct: 89,
    foragingStatus: 'Spring High-Sugar Nectar',
    activeApiariesCount: 22,
    hotspotCoords: { cx: 215, cy: 150 }
  },
  {
    id: 'zone-up',
    regionName: 'Indo-Gangetic Terai Belt',
    state: 'Uttar Pradesh',
    intensity: 'moderate',
    primaryFlora: 'Eucalyptus & Wild Blackberry',
    bloomCoveragePct: 68,
    foragingStatus: 'Moderate Inflow / Brood Expansion',
    activeApiariesCount: 48,
    hotspotCoords: { cx: 275, cy: 235 }
  }
];

const LOCAL_FLOWERS: FlowerBloomData[] = [
  {
    id: 'fl-01',
    name: 'Teak Forest Blossom & Multiflora',
    botanicalName: 'Tectona grandis & Forest Mix',
    category: 'Wild Forest',
    bloomPct: 94,
    status: 'Peak Bloom',
    distanceKm: 1.8,
    direction: 'East',
    nectarRating: 'Exceptional',
    nectarFlowRateKgDay: 4.8,
    pollenQuality: 'Abundant golden protein pollen (29%)',
    sugarBrix: '24.5° Brix',
    honeyType: 'Dark Amber, rich polyphenols & enzymes',
    bestHarvestWindow: 'Next 5 - 7 Days',
    recommendedHiveCount: 10,
    migrationFeasibility: 'Highly Recommended',
    yieldBoostKg: 45.0,
    projectedBonusEarnings: 17100,
    description: 'High-density natural teak forest flowering along the northern riverbank. Nectar secretion is at peak between 08:30 AM and 01:00 PM.',
    coordinates: { x: 55, y: -20 }
  },
  {
    id: 'fl-02',
    name: 'Yellow Mustard Blossom',
    botanicalName: 'Brassica campestris',
    category: 'Agricultural',
    bloomPct: 89,
    status: 'Peak Bloom',
    distanceKm: 2.6,
    direction: 'North',
    nectarRating: 'High',
    nectarFlowRateKgDay: 4.2,
    pollenQuality: 'Very high lipid pollen, rapid brood boosting',
    sugarBrix: '22.8° Brix',
    honeyType: 'Pale Cream, rapid silky granulation',
    bestHarvestWindow: 'Next 10 Days',
    recommendedHiveCount: 8,
    migrationFeasibility: 'Highly Recommended',
    yieldBoostKg: 38.0,
    projectedBonusEarnings: 14440,
    description: 'Organic agricultural mustard plantation. Dense yellow canopy offering high forage efficiency with short bee transit loops.',
    coordinates: { x: 10, y: -65 }
  },
  {
    id: 'fl-03',
    name: 'Wild Kurinji & Black Jamun',
    botanicalName: 'Syzygium cumini & Strobilanthes',
    category: 'Medicinal',
    bloomPct: 82,
    status: 'Active Flow',
    distanceKm: 3.5,
    direction: 'South-East',
    nectarRating: 'Exceptional',
    nectarFlowRateKgDay: 3.9,
    pollenQuality: 'Deep purple medicinal antioxidant pollen',
    sugarBrix: '23.4° Brix',
    honeyType: 'Deep Mahogany, low glycemic index, therapeutic',
    bestHarvestWindow: 'Next 12 Days',
    recommendedHiveCount: 6,
    migrationFeasibility: 'Recommended',
    yieldBoostKg: 31.5,
    projectedBonusEarnings: 13860,
    description: 'Ancient deciduous ridge grove. Jamun trees are fully loaded with nectar-rich florets that bees prefer during warm afternoons.',
    coordinates: { x: 60, y: 50 }
  },
  {
    id: 'fl-04',
    name: 'Neem & Herbal Wildflowers',
    botanicalName: 'Azadirachta indica',
    category: 'Medicinal',
    bloomPct: 78,
    status: 'Active Flow',
    distanceKm: 1.2,
    direction: 'West',
    nectarRating: 'High',
    nectarFlowRateKgDay: 3.1,
    pollenQuality: 'Rich antibacterial bioflavonoids',
    sugarBrix: '21.9° Brix',
    honeyType: 'Amber with mild bitter undertone, high diastase',
    bestHarvestWindow: 'Next 8 Days',
    recommendedHiveCount: 6,
    migrationFeasibility: 'Optimal Stays Here',
    yieldBoostKg: 24.0,
    projectedBonusEarnings: 9600,
    description: 'Immediate buffer zone around apiary. Protects hive immunity and supplies consistent daily nectar inflow.',
    coordinates: { x: -45, y: -10 }
  },
  {
    id: 'fl-05',
    name: 'White Acacia & Wild Thyme',
    botanicalName: 'Robinia pseudoacacia',
    category: 'Wild Forest',
    bloomPct: 91,
    status: 'Peak Bloom',
    distanceKm: 4.1,
    direction: 'North-West',
    nectarRating: 'Exceptional',
    nectarFlowRateKgDay: 4.6,
    pollenQuality: 'Light white aromatic pollen',
    sugarBrix: '25.2° Brix',
    honeyType: 'Water-White, delicate vanilla aroma, zero crystallization',
    bestHarvestWindow: 'Next 6 Days',
    recommendedHiveCount: 12,
    migrationFeasibility: 'Highly Recommended',
    yieldBoostKg: 48.0,
    projectedBonusEarnings: 22080,
    description: 'Sun-facing rocky hillside with intense acacia blossoming. Commands highest export and fair-trade organic price.',
    coordinates: { x: -55, y: -55 }
  },
  {
    id: 'fl-06',
    name: 'Coffee Blossom & Wild Cardamom',
    botanicalName: 'Coffea canephora & Elettaria',
    category: 'High Altitude',
    bloomPct: 86,
    status: 'Peak Bloom',
    distanceKm: 4.8,
    direction: 'South',
    nectarRating: 'High',
    nectarFlowRateKgDay: 3.7,
    pollenQuality: 'Aromatic high protein pollen',
    sugarBrix: '23.0° Brix',
    honeyType: 'Golden with jasmine floral notes',
    bestHarvestWindow: 'Next 3 Days (Short Window)',
    recommendedHiveCount: 8,
    migrationFeasibility: 'Recommended',
    yieldBoostKg: 32.0,
    projectedBonusEarnings: 12800,
    description: 'Sublime blossom triggered by recent light shower. Immediate hive relocation captures intense 3-day nectar surge.',
    coordinates: { x: -5, y: 70 }
  }
];

export const BeekeeperFloraMap: React.FC = () => {
  const [mapMode, setMapMode] = useState<'regional' | 'radar'>('regional');
  const [selectedZone, setSelectedZone] = useState<RegionalBloomZone>(REGIONAL_ZONES[0]);
  const [selectedFlower, setSelectedFlower] = useState<FlowerBloomData>(LOCAL_FLOWERS[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Wild Forest' | 'Agricultural' | 'Medicinal' | 'High Altitude'>('all');
  const [migrationSimModalOpen, setMigrationSimModalOpen] = useState(false);
  const [isSimulatingMigration, setIsSimulatingMigration] = useState(false);
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const [selectedHivesCount, setSelectedHivesCount] = useState(10);

  const filteredFlowers = LOCAL_FLOWERS.filter(
    (f) => activeFilter === 'all' || f.category === activeFilter
  );

  const handleSelectZone = (zone: RegionalBloomZone) => {
    soundManager.playClick();
    setSelectedZone(zone);
  };

  const handleSelectFlower = (flower: FlowerBloomData) => {
    soundManager.playClick();
    setSelectedFlower(flower);
  };

  const handleOpenMigrationSim = (flower: FlowerBloomData) => {
    soundManager.playEnterChime();
    setSelectedFlower(flower);
    setMigrationCompleted(false);
    setMigrationSimModalOpen(true);
  };

  const handleConfirmMigration = () => {
    setIsSimulatingMigration(true);
    soundManager.playClick();
    setTimeout(() => {
      setIsSimulatingMigration(false);
      setMigrationCompleted(true);
      soundManager.playSuccess();
    }, 1200);
  };

  return (
    <div id="flora-map-section" className="saas-card p-6 sm:p-8 space-y-8 bumble-border-top relative overflow-hidden bg-gradient-to-b from-white via-[#faf7ff] to-white">
      
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar matching the video's "Beekeeper's Flora Map" */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-purple-100 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Live Satellite & Drone Nectar Radar</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-purple-600" />
              <span>Flow Season: Sep – Nov 2026</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-purple-950 flex items-center justify-center font-black shadow-sm text-lg border border-yellow-300">
              🌸
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight flex items-center gap-2">
                <span>Beekeeper's Flora Map</span>
              </h2>
              <p className="text-xs sm:text-sm text-purple-900/70 font-medium mt-0.5">
                Telling beekeepers where flowers are blooming nearby and when it's the right time to move hives for maximum harvest yield.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Regional India Map vs 5km Foraging Radar */}
        <div className="flex items-center gap-2 bg-purple-50 p-1.5 rounded-2xl border border-purple-200 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setMapMode('regional');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mapMode === 'regional'
                ? 'bg-purple-950 text-yellow-300 shadow-md shadow-purple-950/20'
                : 'text-purple-900 hover:text-purple-950 hover:bg-white/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Regional Bloom Map (India)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setMapMode('radar');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mapMode === 'radar'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-purple-900 hover:text-purple-950 hover:bg-white/60'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Nearby Apiary Radar (5 km)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          FEATURE 1: THE MAP VIEW (REGIONAL INDIA BLOOM MAP OR 5KM RADAR)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        
        {/* Left 7 Columns: Visual Map Display */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-purple-200/80 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          
          {/* Map Top Bar */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-purple-950 uppercase tracking-wider">
                {mapMode === 'regional'
                  ? 'All-India Nectar Corridors (Video Reproduction)'
                  : 'Micro-Apiary Foraging Radar (1 km – 5 km Range)'}
              </span>
            </div>

            {/* Video-Accurate Legend */}
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-2xs inline-block" />
                <span className="text-slate-700">Good Bloom (80–100%)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-amber-400 shadow-2xs inline-block" />
                <span className="text-slate-700">Moderate (50–79%)</span>
              </div>
            </div>
          </div>

          {/* MODE A: REGIONAL INDIA BLOOM MAP (As shown in video) */}
          {mapMode === 'regional' && (
            <div className="relative w-full flex items-center justify-center py-4 select-none">
              <svg
                viewBox="0 0 520 600"
                className="w-full max-h-[440px] drop-shadow-sm transition-all duration-300"
              >
                {/* SVG Definitions for Gradients & Glows */}
                <defs>
                  <linearGradient id="grad-green-zone" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="grad-yellow-zone" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                  </linearGradient>
                  <radialGradient id="pulse-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Simplified Stylized India Map Outlines Matching Video Graphic */}
                <g className="india-base">
                  {/* Northern Himalayan Region */}
                  <path
                    d="M 170 80 Q 210 40 250 80 L 260 110 L 240 140 L 190 140 Z"
                    fill={selectedZone.id === 'zone-ksh' ? '#059669' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:opacity-90 transition"
                    onClick={() => handleSelectZone(REGIONAL_ZONES[2])}
                  />

                  {/* Western / Rajasthan / Desert Belt */}
                  <path
                    d="M 130 190 Q 180 180 210 230 L 190 300 L 140 290 L 110 240 Z"
                    fill={selectedZone.id === 'zone-rj' ? '#d97706' : '#fbbf24'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:opacity-90 transition"
                    onClick={() => handleSelectZone(REGIONAL_ZONES[4])}
                  />

                  {/* Central Northern / Gangetic Plains */}
                  <path
                    d="M 210 160 L 320 180 L 340 250 L 230 250 Z"
                    fill="#fde047"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:opacity-90 transition"
                    onClick={() => handleSelectZone(REGIONAL_ZONES[7])}
                  />

                  {/* Central & Deccan Plateau / Telangana Green Bloom Belt */}
                  <path
                    d="M 190 300 L 310 280 L 340 370 L 260 430 L 180 390 Z"
                    fill={selectedZone.id === 'zone-tg' ? '#047857' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:opacity-90 transition filter drop-shadow-md"
                    onClick={() => handleSelectZone(REGIONAL_ZONES[0])}
                  />

                  {/* Eastern / Bengal / Sundarbans */}
                  <path
                    d="M 340 250 L 430 260 L 420 360 L 340 340 Z"
                    fill={selectedZone.id === 'zone-wb' ? '#d97706' : '#facc15'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:opacity-90 transition"
                    onClick={() => handleSelectZone(REGIONAL_ZONES[5])}
                  />

                  {/* Southern Peninsula / Nilgiris / Karnataka Green Bloom Corridor */}
                  <path
                    d="M 180 390 L 260 430 L 270 510 L 240 560 L 210 510 Z"
                    fill={selectedZone.id === 'zone-nil' || selectedZone.id === 'zone-ka' ? '#047857' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:opacity-90 transition filter drop-shadow-md"
                    onClick={() => handleSelectZone(REGIONAL_ZONES[1])}
                  />
                </g>

                {/* Hotspot Pulse Dots and Floral Marker Pins */}
                {REGIONAL_ZONES.map((zone) => {
                  const isSelected = selectedZone.id === zone.id;
                  const isPeak = zone.intensity === 'peak';
                  return (
                    <g
                      key={zone.id}
                      transform={`translate(${zone.hotspotCoords.cx}, ${zone.hotspotCoords.cy})`}
                      className="cursor-pointer group"
                      onClick={() => handleSelectZone(zone)}
                    >
                      {/* Pulse Ring */}
                      <circle
                        r={isSelected ? 22 : 14}
                        fill={isPeak ? '#10b981' : '#f59e0b'}
                        opacity="0.25"
                        className="animate-ping"
                      />
                      {/* Outer Ring */}
                      <circle
                        r={isSelected ? 14 : 9}
                        fill={isPeak ? '#059669' : '#d97706'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="transition-all duration-200 group-hover:scale-125"
                      />
                      {/* Center Core */}
                      <circle
                        r={isSelected ? 6 : 4}
                        fill="#ffffff"
                      />
                      {/* Zone Label Badge */}
                      <g transform="translate(16, -10)">
                        <rect
                          x="0"
                          y="0"
                          width={zone.state.length * 7 + 34}
                          height="20"
                          rx="10"
                          fill="#ffffff"
                          stroke={isSelected ? '#3b0764' : '#e2e8f0'}
                          strokeWidth={isSelected ? '2' : '1'}
                          className="drop-shadow-xs"
                        />
                        <text
                          x="10"
                          y="14"
                          fontSize="10"
                          fontWeight="bold"
                          fill="#1e1b4b"
                        >
                          {zone.state} ({zone.bloomCoveragePct}%)
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Bottom Card for Selected Region */}
              <div className="absolute bottom-2 left-2 right-2 bg-purple-950/95 text-white p-3.5 rounded-2xl backdrop-blur-md border border-purple-800 shadow-xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-300 font-black text-xs">
                      {selectedZone.regionName}
                    </span>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-400/40">
                      {selectedZone.bloomCoveragePct}% Peak Bloom
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200">
                    Flora: <strong className="text-white">{selectedZone.primaryFlora}</strong> • {selectedZone.foragingStatus}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setMapMode('radar');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 text-xs font-black shrink-0 transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>Zoom to 5km Radar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* MODE B: 5KM LOCAL APIARY RADAR (Interactive nearby flowers) */}
          {mapMode === 'radar' && (
            <div className="relative w-full flex items-center justify-center py-6 select-none">
              <svg viewBox="0 0 500 500" className="w-full max-h-[440px]">
                {/* Radar Background & Grid Rings */}
                <defs>
                  <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.08" />
                    <stop offset="70%" stopColor="#10b981" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#3b0764" stopOpacity="0.01" />
                  </radialGradient>
                </defs>

                <rect width="500" height="500" rx="30" fill="#faf5ff" />
                <circle cx="250" cy="250" r="230" fill="url(#radar-glow)" />

                {/* Distance Rings: 1 km, 2.5 km, 4 km, 5 km */}
                <circle cx="250" cy="250" r="60" fill="none" stroke="#d8b4fe" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="250" cy="250" r="120" fill="none" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="5 5" />
                <circle cx="250" cy="250" r="180" fill="none" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="6 6" />
                <circle cx="250" cy="250" r="230" fill="none" stroke="#7e22ce" strokeWidth="1.5" />

                {/* Radar Crosshairs */}
                <line x1="250" y1="20" x2="250" y2="480" stroke="#e9d5ff" strokeWidth="1.5" />
                <line x1="20" y1="250" x2="480" y2="250" stroke="#e9d5ff" strokeWidth="1.5" />

                {/* Compass Direction Labels */}
                <text x="250" y="38" textAnchor="middle" fontSize="12" fontWeight="900" fill="#6b21a8">N (Mustard Belt)</text>
                <text x="465" y="254" textAnchor="end" fontSize="12" fontWeight="900" fill="#6b21a8">E (Teak Forest)</text>
                <text x="250" y="475" textAnchor="middle" fontSize="12" fontWeight="900" fill="#6b21a8">S (Coffee & Kurinji)</text>
                <text x="35" y="254" textAnchor="start" fontSize="12" fontWeight="900" fill="#6b21a8">W (Neem Grove)</text>

                {/* Ring distance labels */}
                <text x="254" y="195" fontSize="9" fontWeight="bold" fill="#9333ea">1.0 km</text>
                <text x="254" y="135" fontSize="9" fontWeight="bold" fill="#9333ea">2.5 km (Optimal Flight)</text>
                <text x="254" y="75" fontSize="9" fontWeight="bold" fill="#9333ea">4.0 km</text>
                <text x="254" y="28" fontSize="9" fontWeight="bold" fill="#9333ea">5.0 km Max</text>

                {/* Flight Path Lines from Hive Center to Flowers */}
                {filteredFlowers.map((flower) => {
                  const flowerX = 250 + flower.coordinates.x * 2.1;
                  const flowerY = 250 + flower.coordinates.y * 2.1;
                  const isSelected = selectedFlower.id === flower.id;
                  return (
                    <g key={`path-${flower.id}`}>
                      <line
                        x1="250"
                        y1="250"
                        x2={flowerX}
                        y2={flowerY}
                        stroke={isSelected ? '#059669' : '#d8b4fe'}
                        strokeWidth={isSelected ? '2.5' : '1'}
                        strokeDasharray={isSelected ? 'none' : '3 3'}
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}

                {/* Center Apiary Hive Node */}
                <g transform="translate(250, 250)">
                  <circle r="22" fill="#3b0764" opacity="0.15" className="animate-ping" />
                  <circle r="14" fill="#3b0764" stroke="#fde047" strokeWidth="3" />
                  <text y="4" textAnchor="middle" fontSize="12" fill="#ffffff">🐝</text>
                  <g transform="translate(0, 28)">
                    <rect x="-45" y="-9" width="90" height="18" rx="9" fill="#3b0764" />
                    <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fde047">
                      ACTIVE APIARY
                    </text>
                  </g>
                </g>

                {/* Nearby Flower Nodes */}
                {filteredFlowers.map((flower) => {
                  const flowerX = 250 + flower.coordinates.x * 2.1;
                  const flowerY = 250 + flower.coordinates.y * 2.1;
                  const isSelected = selectedFlower.id === flower.id;
                  const isPeak = flower.bloomPct >= 85;

                  return (
                    <g
                      key={flower.id}
                      transform={`translate(${flowerX}, ${flowerY})`}
                      className="cursor-pointer group"
                      onClick={() => handleSelectFlower(flower)}
                    >
                      {/* Pulse Ring for Peak Blooms */}
                      {isPeak && (
                        <circle
                          r={isSelected ? 24 : 16}
                          fill="#10b981"
                          opacity="0.3"
                          className="animate-ping"
                        />
                      )}

                      {/* Main Flower Node */}
                      <circle
                        r={isSelected ? 16 : 12}
                        fill={isPeak ? '#059669' : '#f59e0b'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="transition-all duration-200 group-hover:scale-125"
                      />
                      <circle r="5" fill="#ffffff" />

                      {/* Flower Icon / Emoji */}
                      <text y="3" textAnchor="middle" fontSize="10">🌸</text>

                      {/* Callout Label */}
                      <g transform="translate(18, -8)">
                        <rect
                          x="0"
                          y="0"
                          width={flower.name.length * 6.2 + 20}
                          height="18"
                          rx="9"
                          fill={isSelected ? '#3b0764' : '#ffffff'}
                          stroke={isSelected ? '#fde047' : '#cbd5e1'}
                          strokeWidth={isSelected ? '2' : '1'}
                          className="drop-shadow-xs"
                        />
                        <text
                          x="8"
                          y="12"
                          fontSize="9"
                          fontWeight="bold"
                          fill={isSelected ? '#ffffff' : '#1e1b4b'}
                        >
                          {flower.name.split(' ')[0]} ({flower.distanceKm}km • {flower.bloomPct}%)
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Selected Flower Detail & Hive Migration Advisor */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Optimal Hive Migration Advisor Card (Directly reflecting the video narration) */}
          <div className="bg-gradient-to-br from-purple-950 via-[#2d084e] to-[#1e0535] text-white p-6 rounded-3xl border-2 border-yellow-400/60 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-purple-950 flex items-center gap-1.5 shadow-xs">
                <Truck className="w-3 h-3" />
                <span>Optimal Hive Move Window</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">
                +42% Yield Boost
              </span>
            </div>

            <h3 className="text-lg font-black text-yellow-300 leading-tight">
              Recommended: Relocate Hives to {selectedFlower.name}
            </h3>

            <p className="text-xs text-purple-200 mt-2 leading-relaxed">
              Based on satellite NDVI spectral bloom indexing, <strong>{selectedFlower.name}</strong> is currently at <strong className="text-emerald-300">{selectedFlower.bloomPct}% peak flowering</strong> with nectar secretion running at {selectedFlower.nectarFlowRateKgDay} kg/colony/day.
            </p>

            {/* Weather & Transport Readiness */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-purple-800/80 text-center">
              <div className="bg-purple-900/50 p-2 rounded-xl border border-purple-700/50">
                <Thermometer className="w-3.5 h-3.5 text-amber-400 mx-auto mb-0.5" />
                <span className="text-[10px] text-purple-300 block">Flight Temp</span>
                <span className="text-xs font-black text-white">28°C Optimal</span>
              </div>

              <div className="bg-purple-900/50 p-2 rounded-xl border border-purple-700/50">
                <Wind className="w-3.5 h-3.5 text-cyan-300 mx-auto mb-0.5" />
                <span className="text-[10px] text-purple-300 block">Wind Speed</span>
                <span className="text-xs font-black text-white">7 km/h Calm</span>
              </div>

              <div className="bg-purple-900/50 p-2 rounded-xl border border-purple-700/50">
                <Calendar className="w-3.5 h-3.5 text-emerald-300 mx-auto mb-0.5" />
                <span className="text-[10px] text-purple-300 block">Window</span>
                <span className="text-xs font-black text-emerald-300">Next 48 Hrs</span>
              </div>
            </div>

            {/* Call to action button */}
            <button
              type="button"
              onClick={() => handleOpenMigrationSim(selectedFlower)}
              className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Truck className="w-4 h-4" />
              <span>Simulate Hive Migration ({selectedFlower.distanceKm} km) →</span>
            </button>
          </div>

          {/* Selected Flower Detailed Spec Card */}
          <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 uppercase">
                  {selectedFlower.category}
                </span>
                <h4 className="text-base font-black text-purple-950 mt-1">
                  {selectedFlower.name}
                </h4>
                <p className="text-[11px] text-slate-500 italic">
                  {selectedFlower.botanicalName}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-black text-purple-950 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 block">
                  {selectedFlower.bloomPct}% Bloom
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {selectedFlower.distanceKm} km {selectedFlower.direction}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {selectedFlower.description}
            </p>

            {/* Quality Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                <span className="text-[10px] font-bold uppercase text-purple-900/60 block">Nectar Flow Rate</span>
                <span className="font-mono font-black text-purple-950">{selectedFlower.nectarFlowRateKgDay} kg / day</span>
              </div>

              <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                <span className="text-[10px] font-bold uppercase text-purple-900/60 block">Sugar Density</span>
                <span className="font-mono font-black text-purple-950">{selectedFlower.sugarBrix}</span>
              </div>

              <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                <span className="text-[10px] font-bold uppercase text-purple-900/60 block">Expected Honey</span>
                <span className="font-semibold text-purple-950 truncate block">{selectedFlower.honeyType.split(',')[0]}</span>
              </div>

              <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                <span className="text-[10px] font-bold uppercase text-purple-900/60 block">Est. Payout Boost</span>
                <span className="font-mono font-black text-emerald-700">+₹{selectedFlower.projectedBonusEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FEATURE 2: NEARBY FLOWERS LIST (WHERE BLOOMING) & FILTERS
          ========================================================================= */}
      <div className="space-y-4 pt-4 border-t border-purple-100">
        
        {/* Category Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flower className="w-4 h-4 text-purple-700" />
            <span className="text-sm font-black text-purple-950">
              Nearby Flowering Species ({filteredFlowers.length} Active Groves)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {(['all', 'Wild Forest', 'Agricultural', 'Medicinal', 'High Altitude'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveFilter(cat);
                }}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-purple-950 text-yellow-300 font-black shadow-xs'
                    : 'bg-white hover:bg-purple-50 text-purple-900 border border-purple-200'
                }`}
              >
                {cat === 'all' ? 'All Flora' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Flowers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlowers.map((flower) => {
            const isSelected = selectedFlower.id === flower.id;
            const isPeak = flower.bloomPct >= 85;

            return (
              <div
                key={flower.id}
                onClick={() => handleSelectFlower(flower)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-purple-600 ring-2 ring-purple-600/10 shadow-md'
                    : 'border-purple-100 hover:border-purple-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-100">
                      {flower.category}
                    </span>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isPeak
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isPeak ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                      <span>{flower.bloomPct}% Bloom</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-purple-950">
                    {flower.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    {flower.botanicalName}
                  </p>
                </div>

                {/* Progress Bar of Bloom */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Flowering Maturity</span>
                    <span className="text-purple-950">{flower.status}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPeak
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                          : 'bg-gradient-to-r from-yellow-400 to-amber-500'
                      }`}
                      style={{ width: `${flower.bloomPct}%` }}
                    />
                  </div>
                </div>

                {/* Distance & Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>{flower.distanceKm} km {flower.direction}</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenMigrationSim(flower);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-300 hover:bg-yellow-400 text-purple-950 font-black text-[11px] transition cursor-pointer"
                  >
                    <span>Plan Move</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          FEATURE 3: HIVE MIGRATION SIMULATOR MODAL
          ========================================================================= */}
      {migrationSimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-purple-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-yellow-400 text-purple-950 flex items-center justify-center text-base font-black shadow-xs">
                  🚚
                </div>
                <div>
                  <h3 className="text-lg font-black text-purple-950">
                    Plan Hive Relocation
                  </h3>
                  <p className="text-xs text-purple-900/60 font-medium">
                    Target Flora: <strong className="text-purple-950">{selectedFlower.name}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMigrationSimModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-purple-100 text-purple-900 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {!migrationCompleted ? (
              <div className="space-y-4 text-xs">
                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-amber-950">
                  <strong className="block font-bold mb-1">
                    🌾 Bloom Timing Window Confirmed:
                  </strong>
                  <span>
                    Moving hives during the early morning hours (04:30 AM – 06:00 AM) ensures low bee flight disturbance and rapid orientation flight upon arrival.
                  </span>
                </div>

                {/* Hive Count Slider */}
                <div className="space-y-2 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                  <div className="flex justify-between font-bold text-purple-950">
                    <span>Number of Hives to Move:</span>
                    <span className="font-mono text-sm text-purple-900">{selectedHivesCount} Colonies</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="2"
                    value={selectedHivesCount}
                    onChange={(e) => setSelectedHivesCount(Number(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>2 Hives (Micro)</span>
                    <span>10 Hives (Standard Cluster)</span>
                    <span>20 Hives (Full Apiary)</span>
                  </div>
                </div>

                {/* Projected Benefits */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Est. Yield Gain</span>
                    <span className="font-mono font-black text-emerald-950 text-base">
                      +{(selectedFlower.yieldBoostKg * (selectedHivesCount / 10)).toFixed(1)} kg
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">High purity unadulterated flow</span>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <span className="text-[10px] font-bold text-purple-800 uppercase block">Fair-Trade Revenue</span>
                    <span className="font-mono font-black text-purple-950 text-base">
                      +₹{Math.round(selectedFlower.projectedBonusEarnings * (selectedHivesCount / 10)).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-purple-700 block mt-0.5">Direct MSP guaranteed payout</span>
                  </div>
                </div>

                {/* Confirm Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmMigration}
                    disabled={isSimulatingMigration}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-950 to-indigo-950 hover:from-purple-900 hover:to-indigo-900 text-yellow-300 font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSimulatingMigration ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-yellow-300 border-t-transparent animate-spin" />
                        <span>Notarizing Relocation Request on Blockchain...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                        <span>Confirm & Dispatch Relocation Advice</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="space-y-4 text-center py-2 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-black">
                  ✓
                </div>
                <div>
                  <h4 className="text-base font-black text-purple-950">
                    Relocation Plan Scheduled!
                  </h4>
                  <p className="text-xs text-purple-900/70 mt-1 max-w-sm mx-auto">
                    {selectedHivesCount} hives scheduled for transport to <strong>{selectedFlower.name}</strong> ({selectedFlower.distanceKm} km {selectedFlower.direction}). Hive telemetry calibrated for new forage corridor.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-left text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Smart Contract Ref:</span>
                    <span className="font-mono text-purple-950 font-bold">0x71a9...c482</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Departure Window:</span>
                    <span className="text-emerald-700 font-bold">Tomorrow, 05:00 AM IST</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMigrationSimModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-purple-950 text-white font-bold text-xs hover:bg-purple-900 transition cursor-pointer"
                >
                  Return to Flora Map
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
