// Web Crypto API helper for Honeychain
export async function computeSHA256(data: string | object): Promise<string> {
  const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateBatchId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `HC-2026-NIL-${num}`;
}

export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function generateZkProofHash(batchId: string): string {
  return `zk_snark_purity_c4c3_0x${batchId.replace(/[^0-9a-f]/gi, '').toLowerCase().padEnd(16, 'a')}_verified`;
}
