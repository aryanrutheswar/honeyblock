export type UserRole = 'consumer' | 'beekeeper' | 'lab' | 'processor' | 'regulator';

export interface Hive {
  id: string;
  apiaryId: string;
  name: string;
  species: string;
  condition: string;
  healthScore: number;
  queenStatus: string;
  swarmingRisk: number;
  colonyStrength: string;
  broodEstimate: string;
  foodStores: string;
  weightKg: number;
  tempC: number;
  humidityPct: number;
  co2Ppm: number;
  vibrationHz: number;
  soundRms: number;
  acousticFrequencyHz: number;
  inspectionPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  yieldPredictionKg: number;
  aiConfidence: number;
  whyPrediction: string;
  acoustic?: {
    spectrogram: Array<{
      timeIndex: number;
      timeLabel: string;
      frequencies: Array<{ frequencyHz: number; intensity: number }>;
    }>;
    waveform: Array<{ sampleIndex: number; amplitude: number }>;
  };
}

export interface Apiary {
  id: string;
  name: string;
  region: string;
  coordinates: string;
  flora: string;
  beekeeper: string;
  hivesCount: number;
  altitude: string;
  established: string;
}

export interface HoneyBatch {
  id: string;
  digitalId: string;
  name: string;
  hiveId: string;
  apiaryId: string;
  beekeeper: string;
  harvestDate: string;
  harvestQtyKg: number;
  remainingQtyKg: number;
  floralSource: string;
  moisturePct: number;
  fructoseGlucoseRatio: number;
  hpmFuranMgKg: number;
  spectralFingerprintId: string;
  spectralSimilarity: number;
  modelConfidence: number;
  adulterationRisk: string;
  spectralStatus: 'PASS' | 'REVIEW' | 'FAIL';
  smartContractGate: 'APPROVED' | 'REVIEW' | 'QUARANTINED' | 'BLOCKED';
  status: 'APPROVED' | 'REVIEW' | 'QUARANTINED' | 'BLOCKED';
  processingUnit: string;
  labConfirmation: string;
  labConfirmedAt: string | null;
  currentStage: string;
  transparencyScore: number;
  tampered: boolean;
  quarantineReason: string | null;
  blockchainTx: string;
  blockNumber: number;
  qrUrl: string;
}

export interface SpectralPoint {
  wavelength: number;
  referenceAbsorbance: number;
  sampleAbsorbance: number;
  deviation: number;
}

export interface SpectralScanResult {
  fingerprintId: string;
  sampleId: string;
  batchId: string;
  deviceId: string;
  timestamp: string;
  floralType: string;
  sampleType: string;
  similarity: number;
  modelConfidence: number;
  adulterationRisk: string;
  adulterantDetected: boolean;
  detectedAdulterantName: string | null;
  anomalyScore: number;
  moisturePct: number;
  spectralStatus: 'PASS' | 'REVIEW' | 'FAIL';
  smartContractGate: 'APPROVED' | 'REVIEW' | 'QUARANTINED' | 'BLOCKED';
  ruleTriggered: string;
  canTransferDownstream: boolean;
  cryptographicHash: string;
  blockchainTx: string;
  blockNumber: number;
  spectralData: SpectralPoint[];
  deviationZones: Array<{ band: string; description: string }>;
  aiExplanation: string;
  disclaimer: string;
}

export interface SpectralReference {
  id: string;
  name: string;
  floralSource: string;
  region: string;
  sampleCount: number;
  modelVersion: string;
  fructoseMean: string;
  glucoseMean: string;
  moistureOptimum: string;
  wavelengthPeaks: number[];
  baselineAbsorbance: number[];
}

export interface Block {
  index: number;
  timestamp: string;
  prevHash: string;
  hash: string;
  computedHash?: string;
  isHashValid?: boolean;
  payload: any;
  txCount: number;
  validator: string;
}

export interface BlockchainState {
  chainLength: number;
  latestBlockIndex: number;
  isValid: boolean;
  brokenBlockIndex: number | null;
  tamperedState: any;
  blocks: Block[];
}

export interface SupplyChainEvent {
  id: string;
  batchId: string;
  stage: string;
  actor: string;
  location: string;
  timestamp: string;
  details: string;
  sensorSignature: string;
  txHash: string;
  status: string;
}

export interface PollinationContract {
  id: string;
  farmerName: string;
  farmerContact: string;
  farmName: string;
  crop: string;
  acreage: string;
  location: string;
  hivesContracted: number;
  hivesDeployed: string[];
  startDate: string;
  endDate: string;
  durationDays: number;
  status: 'ACTIVE_DEPLOYMENT' | 'COMPLETED_VERIFIED';
  verifiedActivityHours: number;
  acousticFlightScore: number;
  fruitSetEstimatedIncrease: string;
  serviceCreditsMinted: number;
  creditTokenId: string;
  beekeeperPayoutInr: string;
  blockchainTx: string;
  certificateHash: string;
}

export interface QualityAlert {
  id: string;
  title: string;
  hiveId?: string;
  batchId?: string;
  severity: 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  category: 'HIVE_DISTRESS' | 'SPECTRAL_ANOMALY' | 'QUALITY_REVIEW' | 'TAMPERING';
  timestamp: string;
  message: string;
  action: string;
  resolved: boolean;
}

export interface ConsumerPassport {
  digitalId: string;
  name: string;
  status: string;
  transparencyScore: number;
  floralSource: string;
  harvestDate: string;
  harvestQtyKg: number;
  moisturePct: number;
  spectralSimilarity: number;
  spectralStatus: string;
  modelConfidence: number;
  adulterationRisk: string;
  tampered: boolean;
  quarantineReason: string | null;
  origin: {
    apiary: string;
    region: string;
    coordinates: string;
    altitude: string;
    beekeeper: string;
  };
  hiveStory: {
    hiveId: string;
    species: string;
    hiveCondition: string;
    healthScore: number;
    colonyStrength: string;
    beeGuardStatus: string;
  };
  qualityScreen: {
    spectralFingerprintId: string;
    labConfirmation: string;
    labConfirmedAt: string | null;
    processingUnit: string;
  };
  blockchainProof: {
    blockNumber: number;
    txHash: string;
    evidenceHash: string;
    isLedgerValid: boolean;
  };
  journey: SupplyChainEvent[];
}
