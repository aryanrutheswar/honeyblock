import {
  Hive,
  HoneyBatch,
  SpectralScanResult,
  SpectralReference,
  BlockchainState,
  SupplyChainEvent,
  PollinationContract,
  QualityAlert,
  ConsumerPassport
} from '../types';

const API_BASE = '/api';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchHives(): Promise<Hive[]> {
  const res = await fetch(`${API_BASE}/hives`);
  if (!res.ok) throw new Error('Failed to fetch hives');
  return res.json();
}

export async function fetchHive(id: string): Promise<Hive> {
  const res = await fetch(`${API_BASE}/hives/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch hive ${id}`);
  return res.json();
}

export async function simulateHiveCondition(id: string, condition: string): Promise<{ hive: Hive; acousticData: any; disclaimer: string }> {
  const res = await fetch(`${API_BASE}/hives/${id}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ condition })
  });
  if (!res.ok) throw new Error('Failed to simulate hive condition');
  return res.json();
}

export async function fetchBatches(): Promise<HoneyBatch[]> {
  const res = await fetch(`${API_BASE}/batches`);
  if (!res.ok) throw new Error('Failed to fetch batches');
  return res.json();
}

export async function fetchBatch(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/batches/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch batch ${id}`);
  return res.json();
}

export async function harvestBatch(data: { hiveId: string; harvestQtyKg: number; floralSource?: string; beekeeperName?: string }): Promise<{ batch: HoneyBatch; scan: SpectralScanResult }> {
  const res = await fetch(`${API_BASE}/batches/harvest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to register harvest');
  return res.json();
}

export async function quarantineBatch(id: string, reason: string): Promise<any> {
  const res = await fetch(`${API_BASE}/batches/${id}/quarantine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  if (!res.ok) throw new Error('Failed to quarantine batch');
  return res.json();
}

export async function approveBatch(id: string, labCertificateId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/batches/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ labCertificateId })
  });
  if (!res.ok) throw new Error('Failed to approve batch');
  return res.json();
}

export async function fetchSpectralReferences(): Promise<SpectralReference[]> {
  const res = await fetch(`${API_BASE}/spectral/references`);
  if (!res.ok) throw new Error('Failed to fetch spectral references');
  return res.json();
}

export async function runSpectraScan(params: {
  sampleId?: string;
  batchId?: string;
  sampleType: 'pure' | 'rice_syrup' | 'sugar_syrup' | 'unknown_anomaly';
  floralType?: string;
}): Promise<SpectralScanResult> {
  const res = await fetch(`${API_BASE}/spectral/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to run spectral scan');
  return res.json();
}

export async function verifySpectralFingerprint(rawData: any, recordedHash: string): Promise<any> {
  const res = await fetch(`${API_BASE}/spectral/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawData, recordedHash })
  });
  if (!res.ok) throw new Error('Failed to verify spectral fingerprint');
  return res.json();
}

export async function fetchBlockchainState(): Promise<BlockchainState> {
  const res = await fetch(`${API_BASE}/blockchain`);
  if (!res.ok) throw new Error('Failed to fetch blockchain state');
  return res.json();
}

export async function verifyBlockchain(): Promise<any> {
  const res = await fetch(`${API_BASE}/blockchain/verify`);
  if (!res.ok) throw new Error('Failed to verify blockchain');
  return res.json();
}

export async function simulateTampering(batchId = 'HC-2026-AP-004821', modifiedQuantity = 101.7): Promise<any> {
  const res = await fetch(`${API_BASE}/blockchain/tamper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ batchId, modifiedQuantity })
  });
  if (!res.ok) throw new Error('Failed to simulate tampering');
  return res.json();
}

export async function restoreBlockchain(): Promise<any> {
  const res = await fetch(`${API_BASE}/blockchain/restore`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to restore blockchain');
  return res.json();
}

export async function fetchSupplyChain(): Promise<{ events: SupplyChainEvent[]; activeShipments: any[] }> {
  const res = await fetch(`${API_BASE}/supply-chain`);
  if (!res.ok) throw new Error('Failed to fetch supply chain');
  return res.json();
}

export async function logSupplyChainEvent(data: { batchId: string; stage: string; actor: string; location: string; details: string }): Promise<SupplyChainEvent> {
  const res = await fetch(`${API_BASE}/supply-chain/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to log supply chain event');
  return res.json();
}

export async function fetchPollination(): Promise<{ contracts: PollinationContract[]; totalCreditsMinted: number; activeDeployments: number; disclaimer: string }> {
  const res = await fetch(`${API_BASE}/pollination`);
  if (!res.ok) throw new Error('Failed to fetch pollination contracts');
  return res.json();
}

export async function createPollinationContract(data: any): Promise<PollinationContract> {
  const res = await fetch(`${API_BASE}/pollination/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create pollination contract');
  return res.json();
}

export async function verifyPollinationContract(contractId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/pollination/${contractId}/verify`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to verify pollination contract');
  return res.json();
}

export async function fetchAlerts(): Promise<QualityAlert[]> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function resolveAlert(alertId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to resolve alert');
  return res.json();
}

export async function fetchConsumerPassport(batchId: string): Promise<{ passport: ConsumerPassport }> {
  const res = await fetch(`${API_BASE}/consumer/${batchId}`);
  if (!res.ok) throw new Error(`Batch ${batchId} not found`);
  return res.json();
}

export async function sendBeeGuardChat(params: {
  message: string;
  batchId?: string | null;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<{
  reply: string;
  suggestedActions?: string[];
  engine?: string;
  model?: string;
  activeBatch?: { id: string; name: string; status: string } | null;
}> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to send chat message');
  return res.json();
}

export async function resetDemoState(): Promise<any> {
  const res = await fetch(`${API_BASE}/demo/reset`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset demo state');
  return res.json();
}
