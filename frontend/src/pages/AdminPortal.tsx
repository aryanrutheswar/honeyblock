import React, { useState } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import { soundManager } from '../utils/audio';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Database,
  Cpu,
  UserCheck,
  Lock,
  Activity,
  RefreshCw,
  Sliders,
  Flame,
  Search,
  Key,
  Users,
  Award,
  Unlock,
  Radio,
  ArrowLeft
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { batches, setAppScreen, setCurrentRole } = useHoneychain();

  const [activeTab, setActiveTab] = useState<'overview' | 'batches' | 'attack_sim' | 'users'>('overview');
  const [localBatches, setLocalBatches] = useState(batches);
  const [searchQuery, setSearchQuery] = useState('');
  const [attackLoading, setAttackLoading] = useState(false);
  const [attackMsg, setAttackMsg] = useState<string | null>(null);

  // Toggle quarantine for a batch
  const handleToggleQuarantine = (batchId: string) => {
    soundManager.playClick();
    setLocalBatches(prev =>
      prev.map(b => {
        if (b.id === batchId) {
          const isCurrentlyQuarantined = b.status === 'QUARANTINED';
          const newStatus = isCurrentlyQuarantined ? 'CERTIFIED_AUTHENTIC' : 'QUARANTINED';
          return {
            ...b,
            status: newStatus,
            tampered: !isCurrentlyQuarantined
          };
        }
        return b;
      })
    );
  };

  // Simulate C4 Adulteration Attack
  const handleSimulateAttack = async () => {
    setAttackLoading(true);
    soundManager.playStressAlarm();
    
    try {
      await fetch('/api/simulate/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: 'HC-2026-NIL-008421' })
      });
    } catch {
      // local fallback simulation
    }

    setTimeout(() => {
      setLocalBatches(prev =>
        prev.map(b => {
          if (b.id === 'HC-2026-NIL-008421') {
            return {
              ...b,
              status: 'QUARANTINED',
              isotopeDeltaC13: -14.2,
              c4SugarPct: 38.4,
              tampered: true
            };
          }
          return b;
        })
      );
      setAttackLoading(false);
      setAttackMsg('ALERT: EA-IRMS Isotope Anomaly Triggered! Smart Contract locked batch #HC-2026-NIL-008421 automatically.');
    }, 1000);
  };

  // Restore Batch
  const handleRestoreBatch = async () => {
    soundManager.playCalmChime();
    try {
      await fetch('/api/simulate/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: 'HC-2026-NIL-008421' })
      });
    } catch {}

    setLocalBatches(prev =>
      prev.map(b => {
        if (b.id === 'HC-2026-NIL-008421') {
          return {
            ...b,
            status: 'CERTIFIED_AUTHENTIC',
            isotopeDeltaC13: -26.8,
            c4SugarPct: 0.0,
            tampered: false
          };
        }
        return b;
      })
    );
    setAttackMsg(null);
  };

  const filteredBatches = localBatches.filter(
    b => b.id.toLowerCase().includes(searchQuery.toLowerCase()) || b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-950/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setCurrentRole(null);
                  setAppScreen('role_select');
                }}
                className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 hover:bg-amber-100 flex items-center gap-1 shadow-sm transition-all cursor-pointer z-30"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-600" />
                <span>Switch Role</span>
              </button>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> System Administrator Console
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Authorized: <strong className="text-amber-400">aryanrutheswar1823@gmail.com</strong>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Honeychain Security & Ledger Governance
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Superuser access to node telemetry, smart contract quarantine overrides, EA-IRMS isotope fraud monitoring, and user governance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentRole(null);
                setAppScreen('auth');
              }}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              Sign Out Admin
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex border-b border-amber-200 bg-white p-1 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('batches')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'batches'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Batch Quarantine Center</span>
        </button>

        <button
          onClick={() => setActiveTab('attack_sim')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'attack_sim'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-red-500" />
          <span>Attack Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Node & User Governance</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Batches Minted</span>
              <div className="text-3xl font-black text-slate-900">{localBatches.length}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">100% Notarized on-chain</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Quarantined Batches</span>
              <div className="text-3xl font-black text-red-600">
                {localBatches.filter(b => b.status === 'QUARANTINED').length}
              </div>
              <span className="text-[11px] text-red-500 font-semibold">Smart Contract Locked</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Hyperledger Nodes</span>
              <div className="text-3xl font-black text-slate-900">14 / 14</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Raft Consensus Synced</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Database Engine</span>
              <div className="text-xl font-black text-slate-900">SQLite 3 (Local)</div>
              <span className="text-[11px] text-amber-600 font-semibold">`honeychain.db` Active</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Active Blockchain Validator Peers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>Node-01 (Nilgiri Trust)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] text-slate-500 font-mono">MSP: Org1BeekeeperMSP</div>
                <div className="text-[10px] text-emerald-700 font-bold">Latency: 12ms • Block #184920</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>Node-02 (NABL Lab Chennai)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] text-slate-500 font-mono">MSP: Org2LabInspectorMSP</div>
                <div className="text-[10px] text-emerald-700 font-bold">Latency: 18ms • ISO 17025 Verifier</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>Node-03 (FSSAI Anchor Node)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] text-slate-500 font-mono">MSP: Org3NationalRegulatoryMSP</div>
                <div className="text-[10px] text-emerald-700 font-bold">Latency: 15ms • Public Passport Notary</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATCH QUARANTINE CENTER */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search batch ID or floral name..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 grid grid-cols-6 gap-2">
              <div className="col-span-2">Batch Name / Digital ID</div>
              <div>Status</div>
              <div>&delta;¹³C Isotope</div>
              <div>Block #</div>
              <div className="text-right">Admin Override</div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {filteredBatches.map(b => (
                <div key={b.id} className="p-4 grid grid-cols-6 gap-2 items-center hover:bg-slate-50/50">
                  <div className="col-span-2">
                    <div className="font-bold text-slate-900">{b.name}</div>
                    <div className="font-mono text-[11px] text-slate-400">{b.id}</div>
                  </div>

                  <div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'QUARANTINED'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="font-mono">{b.isotopeDeltaC13}‰</div>
                  <div className="font-mono">#{b.blockNumber}</div>

                  <div className="text-right">
                    <button
                      onClick={() => handleToggleQuarantine(b.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        b.status === 'QUARANTINED'
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {b.status === 'QUARANTINED' ? 'Unquarantine & Release' : 'Quarantine Batch'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ATTACK SIMULATOR */}
      {activeTab === 'attack_sim' && (
        <div className="bg-white p-6 rounded-3xl border border-red-200 shadow-md space-y-6">
          <div className="flex items-center gap-3 text-red-700">
            <div className="p-3 rounded-2xl bg-red-100">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">1-Click C4 Sugar Adulteration Attack Simulator</h3>
              <p className="text-xs text-slate-500">Test how Hyperledger Smart Contracts automatically quarantine fraudulent honey batches.</p>
            </div>
          </div>

          {attackMsg && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-red-800 text-xs font-bold flex items-center justify-between">
              <span>{attackMsg}</span>
              <button
                onClick={handleRestoreBatch}
                className="px-3 py-1 rounded-xl bg-white border border-red-300 text-red-900 font-bold hover:bg-red-100"
              >
                Restore Pristine State
              </button>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 uppercase">Target Batch: #HC-2026-NIL-008421</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clicking below injects 38.4% C4 high-fructose corn syrup into the batch record. The automated smart contract triggers an EA-IRMS isotopic anomaly (&delta;¹³C shifts from -26.8‰ to -14.2‰) and locks the digital passport on-chain.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSimulateAttack}
                disabled={attackLoading}
                className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-500/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {attackLoading ? 'Injecting Fraud Payload...' : '🚀 Trigger 1-Click Adulteration Attack'}
              </button>

              <button
                onClick={handleRestoreBatch}
                className="px-5 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                Reset Ledger to Pure Baseline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4 text-xs">
          <h3 className="text-lg font-bold text-slate-900">Registered Enterprise Identities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>System Administrator</span>
                <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-bold text-[10px]">Superuser</span>
              </div>
              <div className="text-slate-600 font-mono mt-1">aryanrutheswar1823@gmail.com</div>
              <div className="text-[10px] text-amber-800 mt-2 font-semibold">WebAuthn Hardware Token Activated</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Beekeeper Partner</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">Apiary</span>
              </div>
              <div className="text-slate-600 font-mono mt-1">ramanathan.apiary@honeychain.io</div>
              <div className="text-[10px] text-slate-500 mt-2 font-semibold">Apiary Cluster AP-01 • Nilgiris</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Chief Lab Analyst</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[10px]">Inspector</span>
              </div>
              <div className="text-slate-600 font-mono mt-1">ananya.iyer@nabl-honeycert.gov.in</div>
              <div className="text-[10px] text-slate-500 mt-2 font-semibold">ISO/IEC 17025 Certified</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
