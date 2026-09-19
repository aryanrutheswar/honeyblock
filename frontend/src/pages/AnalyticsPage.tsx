import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  ShieldCheck,
  Activity,
  Filter
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  const floralBreakdown = [
    { name: 'Kashmir Acacia', percentage: 38, volume: '1,480 kg', color: '#f59e0b' },
    { name: 'Royal Hadramout Sidr', percentage: 26, volume: '1,014 kg', color: '#10b981' },
    { name: 'Alpine Wildflower', percentage: 22, volume: '858 kg', color: '#6366f1' },
    { name: 'Highland Clover', percentage: 14, volume: '546 kg', color: '#ec4899' }
  ];

  const labTestPassRates = [
    { test: 'NMR Spectral Fingerprint', pass: 98.4, flagged: 1.6, total: 340 },
    { test: 'Botanical Pollen Melissopalynology', pass: 96.1, flagged: 3.9, total: 340 },
    { test: 'C4/C3 Isotope Mass Spec', pass: 99.1, flagged: 0.9, total: 340 },
    { test: 'Moisture Refractometry', pass: 94.7, flagged: 5.3, total: 340 },
    { test: 'Thermal Freshness (HMF & Diastase)', pass: 97.2, flagged: 2.8, total: 340 }
  ];

  const monthlyProduction = [
    { month: 'Apr', harvested: 420, verified: 410 },
    { month: 'May', harvested: 580, verified: 560 },
    { month: 'Jun', harvested: 810, verified: 790 },
    { month: 'Jul', harvested: 940, verified: 920 },
    { month: 'Aug', harvested: 1120, verified: 1090 },
    { month: 'Sep', harvested: 1350, verified: 1310 }
  ];

  const maxProd = 1500;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Yield Reports</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              Live Telemetry
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated supply chain throughput, purity benchmarks, and apiary harvest intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Filter */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            {(['7D', '30D', '90D', '1Y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  timeRange === range
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              window.print();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Total Honey Tracked</span>
            <span className="inline-flex items-center text-emerald-600 font-semibold gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">3,898 kg</div>
          <p className="text-xs text-slate-400 mt-1">Across 4 active apiaries</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Authenticity Pass Rate</span>
            <span className="inline-flex items-center text-emerald-600 font-semibold gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +2.1%
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600">98.4%</div>
          <p className="text-xs text-slate-400 mt-1">Industry avg is ~71%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Avg Hive Health Score</span>
            <span className="inline-flex items-center text-slate-500 font-semibold gap-0.5">
              Stable
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">92 / 100</div>
          <p className="text-xs text-slate-400 mt-1">Bio-acoustic vibrational score</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Adulteration Intercepted</span>
            <span className="inline-flex items-center text-rose-600 font-semibold gap-0.5">
              1 Flagged
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600">450 kg</div>
          <p className="text-xs text-slate-400 mt-1">Blocked before consumer packaging</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Production vs Verified Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Harvest Volume vs Blockchain Verified</h2>
              <p className="text-xs text-slate-500">Kilograms of honey logged vs digitally signed across 2026</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-amber-400" /> Harvested
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-emerald-500" /> Verified
              </span>
            </div>
          </div>

          {/* SVG Bar Visualization */}
          <div className="h-64 flex items-end justify-between gap-4 pt-6 border-b border-slate-100">
            {monthlyProduction.map((item) => {
              const harvestH = Math.round((item.harvested / maxProd) * 100);
              const verifiedH = Math.round((item.verified / maxProd) * 100);

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="relative w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Harvest Bar */}
                    <div
                      style={{ height: `${harvestH}%` }}
                      className="w-5 sm:w-8 bg-amber-400 hover:bg-amber-500 rounded-t-lg transition-all duration-300 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-md pointer-events-none whitespace-nowrap z-10 transition">
                        {item.harvested} kg
                      </div>
                    </div>

                    {/* Verified Bar */}
                    <div
                      style={{ height: `${verifiedH}%` }}
                      className="w-5 sm:w-8 bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-all duration-300 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-md pointer-events-none whitespace-nowrap z-10 transition">
                        {item.verified} kg
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
            <span>Base: Apiaries HIVE-01 through HIVE-04</span>
            <span className="font-semibold text-emerald-600">97.8% Overall Conversion Rate</span>
          </div>
        </div>

        {/* Botanical / Floral Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Floral Variety Mix</h2>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-6">Volume share by botanical blossom origin</p>

            {/* Floral Stacked Progress */}
            <div className="h-4 w-full rounded-full overflow-hidden flex mb-6">
              {floralBreakdown.map((f) => (
                <div
                  key={f.name}
                  style={{ width: `${f.percentage}%`, backgroundColor: f.color }}
                  title={`${f.name}: ${f.percentage}%`}
                />
              ))}
            </div>

            {/* Floral Legend & Rows */}
            <div className="space-y-3">
              {floralBreakdown.map((f) => (
                <div key={f.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className="font-medium text-slate-700">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{f.volume}</span>
                    <span className="font-bold text-slate-900 w-8 text-right">{f.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 text-xs text-amber-900 mt-6">
            <span className="font-bold">Market Insight:</span> Kashmir Acacia demands +34% price premium due to ultra-low moisture rating (&le;16.8%).
          </div>
        </div>
      </div>

      {/* Lab Authenticity Test Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Lab Diagnostic Pass Rates</h2>
            <p className="text-xs text-slate-500">Benchmark results across ISO/IEC 17025 certified laboratory testing methods</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Sample Size: 340 Batches</span>
        </div>

        <div className="space-y-4 pt-2">
          {labTestPassRates.map((test) => (
            <div key={test.test} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{test.test}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{test.flagged > 0 ? `${test.flagged}% Flagged` : '0% Flagged'}</span>
                  <span className="font-bold text-emerald-600">{test.pass}% Pass</span>
                </div>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${test.pass}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${test.flagged}%` }} className="bg-rose-500 h-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
