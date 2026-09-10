import { DB, sha256 } from './db.js';
import { anchorEventToBlockchain, executeSmartContractQualityGate } from './blockchain.js';

const WAVELENGTHS = [
  1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1440, 
  1500, 1550, 1600, 1650, 1700, 1720, 1800, 1850, 1900, 1930, 
  2000, 2100, 2200, 2260, 2350, 2450, 2500
];

export function runSpectraSealScan(params) {
  const {
    sampleId = `SMP-${Math.floor(100000 + Math.random() * 900000)}`,
    batchId = 'HC-2026-AP-004821',
    deviceId = 'SSP-9042-NIR-PORTABLE',
    sampleType = 'pure', // 'pure', 'rice_syrup', 'sugar_syrup', 'unknown_anomaly'
    floralType = 'Acacia',
    moistureOverride = null
  } = params;

  let similarity = 98.4;
  let modelConfidence = 95.2;
  let adulterationRisk = 'LOW';
  let adulterantDetected = false;
  let detectedAdulterantName = null;
  let anomalyScore = 0.04;
  let moisturePct = moistureOverride || 17.2;
  let deviationZones = [];
  let aiExplanation = '';

  // Generate baseline reference and sample spectral absorbance curves
  const spectralData = WAVELENGTHS.map((wl, idx) => {
    // Normal floral peak curve
    let refAbs = 0.2 + 0.5 * Math.sin((wl - 1000) / 450) + 0.3 * Math.cos((wl - 1200) / 300);
    refAbs = Math.max(0.08, parseFloat(refAbs.toFixed(3)));

    let sampleAbs = refAbs;
    let deviation = 0;

    if (sampleType === 'pure') {
      // Minor realistic noise
      const noise = (Math.random() - 0.5) * 0.03;
      sampleAbs = parseFloat(Math.max(0.05, (refAbs + noise)).toFixed(3));
      deviation = parseFloat(Math.abs(sampleAbs - refAbs).toFixed(3));
    } else if (sampleType === 'rice_syrup') {
      // Prominent absorption spike around 1440-1500nm and 1900-2000nm (C3 rice oligosaccharides)
      if (wl >= 1400 && wl <= 1550) {
        sampleAbs += 0.48;
      } else if (wl >= 1900 && wl <= 2100) {
        sampleAbs += 0.62;
      } else {
        sampleAbs += 0.15;
      }
      sampleAbs = parseFloat(sampleAbs.toFixed(3));
      deviation = parseFloat(Math.abs(sampleAbs - refAbs).toFixed(3));
    } else if (sampleType === 'sugar_syrup') {
      // Invert sugar C4 characteristic deviation across carbohydrate vibration bands
      if (wl >= 1150 && wl <= 1350) {
        sampleAbs += 0.55;
      } else if (wl >= 1700 && wl <= 1850) {
        sampleAbs += 0.42;
      } else if (wl >= 2200) {
        sampleAbs += 0.58;
      }
      sampleAbs = parseFloat(sampleAbs.toFixed(3));
      deviation = parseFloat(Math.abs(sampleAbs - refAbs).toFixed(3));
    } else if (sampleType === 'unknown_anomaly') {
      // Fluctuating anomaly
      const offset = 0.22 + 0.18 * Math.sin(idx);
      sampleAbs = parseFloat(Math.max(0.05, (refAbs + offset)).toFixed(3));
      deviation = parseFloat(Math.abs(sampleAbs - refAbs).toFixed(3));
    }

    return {
      wavelength: wl,
      referenceAbsorbance: refAbs,
      sampleAbsorbance: sampleAbs,
      deviation: deviation
    };
  });

  if (sampleType === 'pure') {
    similarity = 98.2;
    modelConfidence = 96.1;
    adulterationRisk = 'LOW';
    adulterantDetected = false;
    anomalyScore = 0.03;
    moisturePct = 17.2;
    aiExplanation = 'Sample spectrum closely aligns with reference profile across key carbohydrate, moisture (1440nm, 1930nm) and floral phenolic bands. No exogenous syrup signatures detected.';
  } else if (sampleType === 'rice_syrup') {
    similarity = 63.8;
    modelConfidence = 97.4;
    adulterationRisk = 'HIGH_ADULTERATION_RICE_SYRUP';
    adulterantDetected = true;
    detectedAdulterantName = 'Exogenous C3 Rice Starch Syrup';
    anomalyScore = 0.89;
    moisturePct = 21.4;
    deviationZones = [
      { band: '1440nm - 1550nm', description: 'O-H stretch overtone deviation (Oligosaccharide excess)' },
      { band: '1900nm - 2000nm', description: 'C-H combination overtone characteristic of industrial rice hydrolysate' }
    ];
    aiExplanation = 'CRITICAL: Severe spectral mismatch detected. Strong absorption anomalies in the 1440nm and 1930nm carbohydrate bands indicate presence of foreign rice starch/syrup markers.';
  } else if (sampleType === 'sugar_syrup') {
    similarity = 54.9;
    modelConfidence = 98.1;
    adulterationRisk = 'HIGH_ADULTERATION_CANE_SUGAR';
    adulterantDetected = true;
    detectedAdulterantName = 'Cane Sugar / Acid Invert Syrup';
    anomalyScore = 0.94;
    moisturePct = 23.1;
    deviationZones = [
      { band: '1150nm - 1350nm', description: 'Sucrose C-H overtone distortion' },
      { band: '2200nm - 2450nm', description: 'Industrial invert conversion byproduct peak' }
    ];
    aiExplanation = 'CRITICAL: Signature of C4 cane sugar and synthetic invert syrup identified. Low Fructose/Glucose ratio and unnatural sucrose absorption peaks.';
  } else if (sampleType === 'unknown_anomaly') {
    similarity = 76.5;
    modelConfidence = 88.5;
    adulterationRisk = 'MODERATE_UNVERIFIED_ANOMALY';
    adulterantDetected = false;
    anomalyScore = 0.46;
    moisturePct = 19.8;
    deviationZones = [
      { band: '1800nm - 2100nm', description: 'Uncalibrated baseline shift / moisture irregularity' }
    ];
    aiExplanation = 'WARNING: Irregular baseline deviation from reference library. Possible moisture excursion or uncharacterized floral blend. Confirmatory lab testing required.';
  }

  const fingerprintId = `FP-SPEC-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toISOString();

  // Create raw measurement record & cryptographic hash
  const rawMeasurementRecord = {
    fingerprintId,
    sampleId,
    batchId,
    deviceId,
    floralType,
    sampleType,
    timestamp,
    moisturePct,
    similarity,
    modelConfidence,
    adulterationRisk,
    anomalyScore,
    spectralDataSummary: {
      pointsCount: spectralData.length,
      meanSampleAbsorbance: parseFloat((spectralData.reduce((a, b) => a + b.sampleAbsorbance, 0) / spectralData.length).toFixed(3)),
      maxDeviation: Math.max(...spectralData.map(d => d.deviation))
    }
  };

  const cryptographicHash = sha256(rawMeasurementRecord);

  // Execute smart contract quality gate
  const gateResult = executeSmartContractQualityGate({
    batchId,
    sampleId,
    similarity,
    adulterantDetected,
    moisturePct,
    anomalyScore
  });

  // Blockchain Transaction Creation
  const block = anchorEventToBlockchain(`SPECTRASEAL_SCREEN_${sampleType.toUpperCase()}`, {
    fingerprintId,
    batchId,
    sampleId,
    similarity,
    gateStatus: gateResult.gateStatus,
    adulterationRisk,
    cryptographicHash,
    ruleTriggered: gateResult.ruleTriggered
  });

  // Mutate matching batch in Database if exists
  const targetBatch = DB.batches.find(b => b.id === batchId);
  if (targetBatch) {
    targetBatch.spectralSimilarity = similarity;
    targetBatch.modelConfidence = modelConfidence;
    targetBatch.adulterationRisk = adulterationRisk;
    targetBatch.spectralStatus = gateResult.gateStatus === 'APPROVED' ? 'PASS' : (gateResult.gateStatus === 'REVIEW' ? 'REVIEW' : 'FAIL');
    targetBatch.smartContractGate = gateResult.gateStatus;
    targetBatch.status = gateResult.gateStatus;
    targetBatch.moisturePct = moisturePct;
    targetBatch.spectralFingerprintId = fingerprintId;
    targetBatch.blockchainTx = block.hash;
    targetBatch.blockNumber = block.index;

    if (gateResult.gateStatus === 'QUARANTINED' || gateResult.gateStatus === 'BLOCKED') {
      targetBatch.quarantineReason = aiExplanation;
      targetBatch.currentStage = 'Quarantined / Supply Chain Frozen by Smart Contract';
      targetBatch.transparencyScore = Math.min(25, targetBatch.transparencyScore);

      // Create high-priority quality alert
      const alertId = `ALT-${Math.floor(100 + Math.random() * 900)}`;
      DB.alerts.unshift({
        id: alertId,
        title: `CRITICAL: ${sampleType.toUpperCase().replace('_', ' ')} Intercepted on Batch ${batchId}`,
        batchId: batchId,
        severity: 'CRITICAL',
        category: 'SPECTRAL_ANOMALY',
        timestamp,
        message: aiExplanation,
        action: 'Batch quarantined instantly. Downstream smart contract transfer blocked.',
        resolved: false
      });
      DB.metrics.anomaliesDetected += 1;
      DB.metrics.interceptedAdulterationEvents += 1;
    }
  }

  return {
    fingerprintId,
    sampleId,
    batchId,
    deviceId,
    timestamp,
    floralType,
    sampleType,
    similarity,
    modelConfidence,
    adulterationRisk,
    adulterantDetected,
    detectedAdulterantName,
    anomalyScore,
    moisturePct,
    spectralStatus: gateResult.gateStatus === 'APPROVED' ? 'PASS' : (gateResult.gateStatus === 'REVIEW' ? 'REVIEW' : 'FAIL'),
    smartContractGate: gateResult.gateStatus,
    ruleTriggered: gateResult.ruleTriggered,
    canTransferDownstream: gateResult.canTransferDownstream,
    cryptographicHash,
    blockchainTx: block.hash,
    blockNumber: block.index,
    spectralData,
    deviationZones,
    aiExplanation,
    disclaimer: 'Prototype AI-assisted screening; performance depends on calibration, reference datasets, device quality and validation. Confirmatory laboratory testing may be required.'
  };
}
