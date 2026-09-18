const http = require('http');

function request(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting HoneyChain End-to-End Verification Suite...\n');
  const results = [];

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      results.push({ name, passed: true });
    } catch (err) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      results.push({ name, passed: false, error: err.message });
    }
  }

  // 1. Health & Status
  await test('Server Health Endpoint', async () => {
    const res = await request('/api/health');
    if (res.status !== 200 || res.data.status !== 'ONLINE') throw new Error(`Status ${res.status}`);
  });

  // 2. Stats & KVIC KPIs
  await test('KVIC KPIs and Cluster Metrics', async () => {
    const res = await request('/api/stats');
    if (res.status !== 200 || res.data.totalHives < 50 || res.data.totalBatches < 20) {
      throw new Error(`Unexpected stats: ${JSON.stringify(res.data)}`);
    }
  });

  // 3. 12 Telangana Clusters
  await test('12 Telangana Clusters Loaded', async () => {
    const res = await request('/api/clusters');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length < 12) {
      throw new Error(`Cluster count: ${res.data?.length}`);
    }
  });

  // 4. Hero Hive Telemetry
  await test('Hero Hive HIVE-TG-017 Telemetry & Health', async () => {
    const res = await request('/api/hives/HIVE-TG-017');
    if (res.status !== 200 || !res.data.id || res.data.acousticFrequencyHz !== 240) {
      throw new Error(`Telemetry missing or frequency mismatch: ${JSON.stringify(res.data)}`);
    }
  });

  // 5. Hero Batch Detail & Lab Data
  await test('Hero Batch HNY-TG-2026-0001 Detail & Lab Data', async () => {
    const res = await request('/api/batches/HNY-TG-2026-0001');
    if (res.status !== 200 || !res.data.inspection) {
      throw new Error(`Batch or lab inspection missing`);
    }
    if (res.data.beekeeper !== 'Ravi Kumar') {
      throw new Error(`Beekeeper mismatch: ${res.data.beekeeper}`);
    }
    if (res.data.inspection.isotopeDelta13C !== -26.8) {
      throw new Error(`Isotope delta mismatch: ${res.data.inspection.isotopeDelta13C}`);
    }
  });

  // 6. Traceability Genealogy Tree
  await test('Genealogy Tree for Batch HNY-TG-2026-0001', async () => {
    const res = await request('/api/genealogy/HNY-TG-2026-0001');
    if (res.status !== 200 || !res.data.genealogy || !res.data.genealogy.nodes || res.data.genealogy.nodes.length < 5) {
      throw new Error(`Invalid genealogy tree: ${JSON.stringify(res.data)}`);
    }
  });

  // 7. Blockchain Verification Initial State
  await test('Blockchain PoA Ledger Initial Verification (100% Valid)', async () => {
    const res = await request('/api/blockchain/verify');
    if (res.status !== 200 || !res.data.isValid) {
      throw new Error(`Ledger invalid initially: ${res.data.failureReason}`);
    }
  });

  // 8. Blockchain Tamper Simulation
  await test('Simulate Malicious Ledger Tampering -> Tamper Detected', async () => {
    const tamperRes = await request('/api/blockchain/tamper', 'POST', { blockIndex: 2 });
    if (tamperRes.status !== 200) throw new Error('Tamper request failed');
    
    // Now verify blockchain detects it
    const verifyRes = await request('/api/blockchain/verify');
    if (verifyRes.data.isValid !== false) {
      throw new Error('Blockchain failed to detect malicious tampering!');
    }
    console.log(`   🚨 Tamper successfully detected on block #${verifyRes.data.corruptedBlock}: ${verifyRes.data.failureReason}`);
  });

  // 9. Blockchain Byzantine Restore
  await test('Restore Consensus & Re-verify Ledger Integrity', async () => {
    const restoreRes = await request('/api/blockchain/restore', 'POST');
    if (restoreRes.status !== 200) throw new Error('Restore request failed');

    const verifyRes = await request('/api/blockchain/verify');
    if (!verifyRes.data.isValid) {
      throw new Error(`Blockchain still invalid after restore: ${verifyRes.data.failureReason}`);
    }
  });

  // 10. What-If Yield Simulation
  await test('What-If Yield Forecast Simulation Engine', async () => {
    const res = await request('/api/yield/forecast', 'POST', {
      baseWeightKg: 42.7,
      temperatureDelta: 1.5,
      rainfallMm: 14,
      flowerBloomPct: 90,
      colonyHealth: 88
    });
    if (res.status !== 200 || !res.data.forecast || !res.data.forecast.days7) {
      throw new Error(`Yield simulation error: ${JSON.stringify(res.data)}`);
    }
  });

  // 11. Alerts Feed & Acknowledgement
  await test('Alerts Lifecycle (Ack & Fetch)', async () => {
    const alertsRes = await request('/api/alerts');
    if (alertsRes.status !== 200 || !Array.isArray(alertsRes.data)) throw new Error('Alerts fetch failed');
    if (alertsRes.data.length > 0) {
      const alertId = alertsRes.data[0].id;
      const ackRes = await request(`/api/alerts/${alertId}/ack`, 'POST', { notes: 'Automated test ack' });
      if (ackRes.status !== 200) throw new Error('Alert ack failed');
    }
  });

  // 12. Marketplace Batches & Order Placement
  await test('Marketplace Verified Batches & Fair Trade Procurement', async () => {
    const lotsRes = await request('/api/marketplace/batches');
    if (lotsRes.status !== 200 || !Array.isArray(lotsRes.data) || lotsRes.data.length === 0) {
      throw new Error('No marketplace batches found');
    }
    const lot = lotsRes.data[0];
    const orderRes = await request('/api/marketplace/order', 'POST', {
      buyerName: 'Organic India Enterprise Ltd',
      buyerOrg: 'Organic India Pvt Ltd',
      batchId: lot.id,
      quantityKg: 25.0,
      offeredPricePerKgInr: 750.0
    });
    if (orderRes.status !== 200 || !orderRes.data.orderId || orderRes.data.producerDirectShareInr <= 0) {
      throw new Error(`Order placement failed: ${JSON.stringify(orderRes.data)}`);
    }
  });

  // 13. Customer QR Passport Verification
  await test('Consumer QR Passport Endpoint for Hero Batch', async () => {
    const res = await request('/api/customer/scan/HNY-TG-2026-0001');
    if (res.status !== 200 || !res.data.passport || !res.data.passport.labVerification) {
      throw new Error(`Passport data missing: ${JSON.stringify(res.data)}`);
    }
  });

  // 14. Frontend SPA Root Serving
  await test('Frontend Dist HTML Index Serving', async () => {
    const res = await request('/');
    if (res.status !== 200 || typeof res.data !== 'string' || (!res.data.includes('HoneyChain') && !res.data.includes('Honeychain'))) {
      throw new Error('Frontend bundle index.html not served properly');
    }
  });

  console.log('\n========================================');
  const passed = results.filter(r => r.passed).length;
  console.log(`Results: ${passed} / ${results.length} tests PASSED.`);
  console.log('========================================');
  
  if (passed === results.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
