import { DB, sha256 } from './db.js';
import { anchorEventToBlockchain } from './blockchain.js';

export function createPollinationContract(data) {
  const {
    farmerName,
    farmerContact = '+91-98000XXXXX',
    farmName,
    crop,
    acreage,
    location,
    hivesCount = 10,
    startDate,
    durationDays = 30,
    ratePerHive = 3000
  } = data;

  const id = `POL-2026-${String(DB.pollinationContracts.length + 1).padStart(3, '0')}`;
  const totalPayoutInr = `₹${(hivesCount * ratePerHive).toLocaleString('en-IN')}`;

  const contract = {
    id,
    farmerName,
    farmerContact,
    farmName,
    crop,
    acreage: `${acreage} Acres`,
    location,
    hivesContracted: hivesCount,
    hivesDeployed: ['H-014', 'H-016', 'H-031'].slice(0, Math.min(3, hivesCount)),
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + durationDays * 24 * 3600 * 1000).toISOString().split('T')[0],
    durationDays,
    status: 'ACTIVE_DEPLOYMENT',
    verifiedActivityHours: 0,
    acousticFlightScore: 92.0,
    fruitSetEstimatedIncrease: '+22.5% (Projected)',
    serviceCreditsMinted: 0,
    creditTokenId: 'PENDING_DEPLOYMENT',
    beekeeperPayoutInr: `${totalPayoutInr} (In Escrow)`,
    blockchainTx: 'PENDING_VERIFICATION',
    certificateHash: 'PENDING_VERIFICATION'
  };

  DB.pollinationContracts.unshift(contract);
  DB.metrics.farmersConnected += 1;

  return contract;
}

export function verifyAndCompletePollination(contractId) {
  const contract = DB.pollinationContracts.find(c => c.id === contractId);
  if (!contract) throw new Error(`Contract ${contractId} not found`);

  contract.status = 'COMPLETED_VERIFIED';
  contract.verifiedActivityHours = Math.floor(contract.durationDays * 16.5);
  contract.acousticFlightScore = 96.8;
  contract.fruitSetEstimatedIncrease = '+26.8% Verified Fruit Set';
  
  const credits = Math.floor(contract.hivesContracted * 10.5);
  contract.serviceCreditsMinted = credits;
  contract.creditTokenId = `POL-CRD-${Math.floor(800000 + Math.random() * 100000)}`;
  contract.beekeeperPayoutInr = contract.beekeeperPayoutInr.replace(' (In Escrow)', ' (Disbursed via Smart Contract)');

  const certificatePayload = {
    contractId: contract.id,
    farmer: contract.farmerName,
    farm: contract.farmName,
    crop: contract.crop,
    hives: contract.hivesContracted,
    hours: contract.verifiedActivityHours,
    creditsMinted: credits,
    verifiedAt: new Date().toISOString()
  };

  const certificateHash = `sha256:${sha256(certificatePayload)}`;
  contract.certificateHash = certificateHash;

  const block = anchorEventToBlockchain('POLLINATION_SERVICE_VERIFIED', {
    contractId: contract.id,
    farmerName: contract.farmerName,
    crop: contract.crop,
    creditsMinted: credits,
    certificateHash
  });

  contract.blockchainTx = block.hash;
  DB.metrics.pollinationServicesVerified += 1;

  return {
    contract,
    certificateHash,
    blockchainTx: block.hash,
    disclaimer: 'Prototype digital pollination-service records; not automatically equivalent to certified government carbon credits.'
  };
}
