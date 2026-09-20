export interface InspectedBatchRecord {
  batchId: string;
  productName: string;
  floralSource: string;
  apiaryLocation: string;
  beekeeperName: string;
  harvestWeightKg: number;
  harvestDate: string;
  inspectorName: string;
  laboratoryName: string;
  purityScore: number;
  c4Syrups: string;
  hmfMgKg: number;
  diastaseUnits: number;
  moisturePct: number;
  carbonDelta: number;
  verdict: string;
  blockchainHash: string;
  blockNumber: number;
  timestamp: string;
  qrPayloadString: string;
}

const STORAGE_KEY = 'HONEYCHAIN_INSPECTED_BATCHES';
const LATEST_KEY = 'HONEYCHAIN_LATEST_INSPECTED';

export const DEFAULT_INSPECTOR_BATCH: InspectedBatchRecord = {
  batchId: 'HC-2026-INSP-8821',
  productName: 'Nilgiri Mountain Wild Kurinji Reserve',
  floralSource: 'Wild Kurinji (Strobilanthes) & Blue Mountain Acacia',
  apiaryLocation: 'Nilgiris Biosphere Reserve Node #AP-NIL-01 (2,240m)',
  beekeeperName: 'Ravi Kumar (KVIC Tribal Apiary #91)',
  harvestWeightKg: 68.5,
  harvestDate: '14 Sep 2026',
  inspectorName: 'Dr. Ananya Iyer, Chief Chromatographer',
  laboratoryName: 'NABL Certified Testing Node #TN-02 (ISO/IEC 17025)',
  purityScore: 99.8,
  c4Syrups: '0.00% (EA-IRMS Negative)',
  hmfMgKg: 8.2,
  diastaseUnits: 24.8,
  moisturePct: 17.2,
  carbonDelta: -26.8,
  verdict: 'Grade A 100% Pure Raw Honey Certified',
  blockchainHash: '0x9b7f4a2104c89e24f8d689b741e29851720a4b73a8f9d4e21074bb9420bfa472',
  blockNumber: 8421,
  timestamp: '14 Sep 2026, 04:55 PM IST',
  qrPayloadString: ''
};

export function saveInspectedBatch(batch: InspectedBatchRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY);
    const list: InspectedBatchRecord[] = existingStr ? JSON.parse(existingStr) : [];
    
    // Replace or prepend
    const filtered = list.filter(b => b.batchId !== batch.batchId);
    filtered.unshift(batch);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    localStorage.setItem(LATEST_KEY, JSON.stringify(batch));

    // Register into barcode resolver map
    const mapStr = localStorage.getItem('HONEYCHAIN_DYNAMIC_BARCODE_MAP') || '{}';
    const map = JSON.parse(mapStr);
    map[batch.batchId] = batch.batchId;
    localStorage.setItem('HONEYCHAIN_DYNAMIC_BARCODE_MAP', JSON.stringify(map));
  } catch (err) {
    console.warn('Error saving inspected batch:', err);
  }
}

export function getInspectedBatch(batchId: string): InspectedBatchRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY);
    if (existingStr) {
      const list: InspectedBatchRecord[] = JSON.parse(existingStr);
      const found = list.find(b => b.batchId.toLowerCase() === batchId.toLowerCase());
      if (found) return found;
    }
  } catch {}

  // Check default if matches
  if (DEFAULT_INSPECTOR_BATCH.batchId.toLowerCase() === batchId.toLowerCase()) {
    return DEFAULT_INSPECTOR_BATCH;
  }

  return null;
}

export function getLatestInspectedBatch(): InspectedBatchRecord {
  if (typeof window !== 'undefined') {
    try {
      const latestStr = localStorage.getItem(LATEST_KEY);
      if (latestStr) {
        return JSON.parse(latestStr);
      }
      const existingStr = localStorage.getItem(STORAGE_KEY);
      if (existingStr) {
        const list: InspectedBatchRecord[] = JSON.parse(existingStr);
        if (list.length > 0) return list[0];
      }
    } catch {}
  }
  return DEFAULT_INSPECTOR_BATCH;
}

export function getAllInspectedBatches(): InspectedBatchRecord[] {
  if (typeof window !== 'undefined') {
    try {
      const existingStr = localStorage.getItem(STORAGE_KEY);
      if (existingStr) {
        return JSON.parse(existingStr);
      }
    } catch {}
  }
  return [DEFAULT_INSPECTOR_BATCH];
}
