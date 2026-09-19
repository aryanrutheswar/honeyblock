import React, { useState } from 'react';
import {
  Settings,
  Server,
  ShieldCheck,
  Key,
  Bell,
  RefreshCw,
  CheckCircle2,
  Copy,
  Check,
  Cpu,
  Globe,
  Lock,
  Radio,
  Sliders,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Form State
  const [quorumThreshold, setQuorumThreshold] = useState('3/4 (Fault Tolerance f=1)');
  const [blockTime, setBlockTime] = useState('2.4s');
  const [webhookUrl, setWebhookUrl] = useState('https://api.honeychain.org/v1/telemetry/webhook');
  const [iotSecret, setIotSecret] = useState('hc_live_9f83a001bc384210e7b8');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoFlagCounterfeit, setAutoFlagCounterfeit] = useState(true);

  const consortiumNodes = [
    { id: 'Node-1', region: 'Srinagar (Asia-South)', role: 'Leader / Validator', status: 'ONLINE', latency: '42ms', blocks: 12480 },
    { id: 'Node-2', region: 'Hadramout (MENA)', role: 'Validator', status: 'ONLINE', latency: '78ms', blocks: 12479 },
    { id: 'Node-3', region: 'Zurich (EU-Central)', role: 'Validator', status: 'ONLINE', latency: '112ms', blocks: 12480 },
    { id: 'Node-4', region: 'Canterbury (Oceania)', role: 'Validator', status: 'ONLINE', latency: '145ms', blocks: 12478 }
  ];

  const handleCopyKey = () => {
    navigator.clipboard.writeText(iotSecret);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleResetDemo = () => {
    setResetting(true);
    setTimeout(() => {
      setResetting(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Consortium Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage PBFT consensus validators, API keys, automated lab policies, and demo environment configuration.
        </p>
      </div>

      {/* Consortium Validator Nodes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Server className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Consortium Validator Network</h2>
              <p className="text-xs text-slate-500">Permissioned Byzantine Fault Tolerant (PBFT) proof cluster</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            4/4 Nodes Synced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Node ID</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Consortium Role</th>
                <th className="py-2.5 px-3">Blocks Validated</th>
                <th className="py-2.5 px-3">Round-Trip Latency</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consortiumNodes.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{n.id}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{n.region}</td>
                  <td className="py-3 px-3 text-slate-600">{n.role}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{n.blocks.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-emerald-600 font-semibold">{n.latency}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {n.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PBFT Consensus & Cryptographic Parameters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
            <Cpu className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Consensus & Policy Configuration</h2>
            <p className="text-xs text-slate-500">Tune block execution interval and fault tolerance rules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">PBFT Quorum Threshold</label>
            <select
              value={quorumThreshold}
              onChange={(e) => setQuorumThreshold(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option>3/4 (Fault Tolerance f=1)</option>
              <option>4/4 (Strict Unanimous Consensus)</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">Requires minimum 3 signatures to commit batch</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Block Time</label>
            <input
              type="text"
              value={blockTime}
              onChange={(e) => setBlockTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Adaptive sub-second batch finality</span>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
            <input
              type="checkbox"
              checked={autoFlagCounterfeit}
              onChange={(e) => setAutoFlagCounterfeit(e.target.checked)}
              className="rounded-md text-amber-500 focus:ring-amber-400 h-4 w-4"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">Auto-Quarantine Suspect Adulterated Honey</div>
              <div className="text-[11px] text-slate-500">
                Instantly revoke cryptographic retail tokens if lab tests detect C4 sugar or high HMF.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* API Ingestion & Webhooks */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
            <Key className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">API Keys & IoT Ingest Gateway</h2>
            <p className="text-xs text-slate-500">Credentials for LoRaWAN gateway and laboratory mass-spec instruments</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Telemetry Webhook URL</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Active Secret Token</label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                readOnly
                value={iotSecret}
                className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-600"
              />
              <button
                onClick={handleCopyKey}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey ? 'Copied' : 'Copy Key'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Sentinel Alerts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <Bell className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Notification Channels</h2>
            <p className="text-xs text-slate-500">Direct notifications dispatched when Sentinel triggers an alert</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-900">SMS Alerts for Beekeepers</div>
              <div className="text-[11px] text-slate-500">Emergency swarm frequency or brood temperature heat spikes</div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="rounded-md text-amber-500 focus:ring-amber-400 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-900">Lab Inspection Dispatch Emails</div>
              <div className="text-[11px] text-slate-500">Automated PDF lab certificates sent to retail purchasing auditors</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded-md text-amber-500 focus:ring-amber-400 h-4 w-4"
            />
          </label>
        </div>
      </div>

      {/* Demo Reset Zone */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Demonstration Reset</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset all batch states, mock IoT telemetry, and consensus transactions back to the original baseline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {resetSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Reset Completed!
            </span>
          )}
          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            {resetting ? 'Resetting...' : 'Reset Demo State'}
          </button>
        </div>
      </div>
    </div>
  );
};
