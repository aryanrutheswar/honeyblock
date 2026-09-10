import { DB, sha256 } from './db.js';

export function getBlockchainState() {
  const blocks = DB.blocks;
  const isTampered = DB.tamperedState !== null;
  const validation = verifyChainIntegrity();

  return {
    chainLength: blocks.length,
    latestBlockIndex: blocks.length - 1,
    isValid: validation.isValid,
    brokenBlockIndex: validation.brokenBlockIndex,
    tamperedState: DB.tamperedState,
    blocks: blocks.map(b => ({
      index: b.index,
      timestamp: b.timestamp,
      prevHash: b.prevHash,
      hash: b.hash,
      computedHash: sha256({ index: b.index, prevHash: b.prevHash, payload: b.payload }),
      isHashValid: b.hash === sha256({ index: b.index, prevHash: b.prevHash, payload: b.payload }),
      payload: b.payload,
      txCount: b.txCount || 1,
      validator: b.validator
    }))
  };
}

export function verifyChainIntegrity() {
  const blocks = DB.blocks;
  for (let i = 0; i < blocks.length; i++) {
    const current = blocks[i];
    const computedCurrentHash = sha256({ index: current.index, prevHash: current.prevHash, payload: current.payload });
    
    // Check if block payload was tampered
    if (current.hash !== computedCurrentHash) {
      return {
        isValid: false,
        brokenBlockIndex: i,
        reason: `Hash Mismatch on Block #${i}: Recorded Hash (${current.hash.substring(0, 16)}...) != Computed Hash (${computedCurrentHash.substring(0, 16)}...)`
      };
    }

    // Check link to previous block
    if (i > 0) {
      const prev = blocks[i - 1];
      if (current.prevHash !== prev.hash) {
        return {
          isValid: false,
          brokenBlockIndex: i,
          reason: `Broken Link on Block #${i}: Recorded prevHash does not match Block #${i - 1} Hash.`
        };
      }
    }
  }

  return {
    isValid: true,
    brokenBlockIndex: null,
    reason: 'Cryptographic ledger integrity verified across all blocks. All SHA-256 hashes and previous-block links are valid.'
  };
}

// Add a transaction block to the ledger
export function anchorEventToBlockchain(eventTitle, payload, validator = 'HoneyChain Smart Contract Node') {
  const latestBlock = DB.blocks[DB.blocks.length - 1];
  const newIndex = DB.blocks.length;
  const prevHash = latestBlock.hash;
  const timestamp = new Date().toISOString();

  const blockPayload = {
    event: eventTitle,
    ...payload,
    timestamp
  };

  const blockHash = sha256({ index: newIndex, prevHash, payload: blockPayload });

  const newBlock = {
    index: newIndex,
    timestamp,
    prevHash,
    hash: blockHash,
    payload: blockPayload,
    txCount: 1,
    validator
  };

  DB.blocks.push(newBlock);
  DB.metrics.blockchainRecordsSecured += 1;
  return newBlock;
}

// Smart Contract Quality Gate logic
export function executeSmartContractQualityGate(spectralScan) {
  // Input: { batchId, sampleId, similarity, adulterantDetected, moisturePct, anomalyScore }
  const { similarity, adulterantDetected, moisturePct } = spectralScan;
  
  let gateStatus = 'APPROVED';
  let ruleTriggered = 'RULE-01: Spectral Similarity >= 95% & Moisture <= 20% -> PASS';
  let canTransferDownstream = true;

  if (adulterantDetected || similarity < 70) {
    gateStatus = 'BLOCKED';
    ruleTriggered = 'RULE-04: Exogenous Syrup / Severe Anomaly Detected (Similarity < 70%) -> BLOCKED';
    canTransferDownstream = false;
  } else if (similarity < 90 || moisturePct > 19.5) {
    gateStatus = 'QUARANTINED';
    ruleTriggered = 'RULE-03: Significant Spectral Deviation (Similarity < 90%) or High Moisture (>19.5%) -> QUARANTINED';
    canTransferDownstream = false;
  } else if (similarity < 95) {
    gateStatus = 'REVIEW';
    ruleTriggered = 'RULE-02: Minor Deviation (Similarity 90-95%) -> SECONDARY LAB REVIEW REQUIRED';
    canTransferDownstream = false;
  }

  return {
    gateStatus,
    ruleTriggered,
    canTransferDownstream,
    contractAddress: '0x99aBEE42F559483A610992310b8C1E0A892F73C1',
    executionTimestamp: new Date().toISOString()
  };
}

// Tamper simulation for Judge Demonstration
export function simulateLedgerTampering(targetBatchId = 'HC-2026-AP-004821', modifiedQuantity = 101.7) {
  const targetBlock = DB.blocks.find(b => b.payload && b.payload.batchId === targetBatchId);
  const targetBatch = DB.batches.find(b => b.id === targetBatchId);

  if (!targetBlock || !targetBatch) {
    throw new Error('Target batch/block not found for tampering demonstration.');
  }

  // Save original backup state
  DB.tamperedState = {
    targetBatchId,
    targetBlockIndex: targetBlock.index,
    originalHarvestQty: targetBatch.harvestQtyKg,
    modifiedHarvestQty: modifiedQuantity,
    originalBlockHash: targetBlock.hash,
    tamperedAt: new Date().toISOString()
  };

  // Mutate the local block payload without re-mining/re-signing hash
  targetBlock.payload.harvestQtyKg = modifiedQuantity;
  targetBlock.payload.evidenceHash = sha256({ batch: targetBatchId, qty: modifiedQuantity, spectral: targetBlock.payload.spectralSimilarity });
  targetBatch.harvestQtyKg = modifiedQuantity;
  targetBatch.tampered = true;

  return {
    message: 'Tamper injected successfully: Local database record altered, but cryptographic SHA-256 hash was NOT updated.',
    tamperedState: DB.tamperedState,
    verification: verifyChainIntegrity()
  };
}

// Restore ledger to pristine cryptographic state
export function restoreLedgerPristine() {
  if (!DB.tamperedState) {
    return { message: 'Ledger was not in tampered state.', verification: verifyChainIntegrity() };
  }

  const { targetBatchId, originalHarvestQty } = DB.tamperedState;
  const targetBlock = DB.blocks.find(b => b.payload && b.payload.batchId === targetBatchId);
  const targetBatch = DB.batches.find(b => b.id === targetBatchId);

  if (targetBlock && targetBatch) {
    targetBlock.payload.harvestQtyKg = originalHarvestQty;
    targetBlock.payload.evidenceHash = sha256({ batch: targetBatchId, qty: originalHarvestQty, spectral: targetBlock.payload.spectralSimilarity });
    targetBatch.harvestQtyKg = originalHarvestQty;
    targetBatch.tampered = false;
  }

  DB.tamperedState = null;

  return {
    message: 'Cryptographic ledger restored to verified pristine state.',
    verification: verifyChainIntegrity()
  };
}

