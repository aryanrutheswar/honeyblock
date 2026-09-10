// Knowledge Base & RAG Retrieval Engine for HoneyChain / BeeGuard AI

export const KNOWLEDGE_CHUNKS = [
  {
    id: 'platform_overview',
    title: 'HoneyChain Platform Overview & Architecture',
    keywords: ['honeychain', 'overview', 'how it works', 'platform', 'what is', 'architecture', 'features', 'website', 'system'],
    content: `HoneyChain is a decentralized, blockchain-powered traceability and smart beekeeping platform.
Key Pillars:
1. Smart Hives & Acoustic Bio-Sensors: Real-time hive telemetry monitoring colony frequency, queen status, and swarming alerts.
2. SpectraSeal™ Quality Gate: AI-assisted NIR/NMR spectroscopy and EA-IRMS isotopic screening to detect adulteration before bottling.
3. Immutable Blockchain Ledger: Permissioned ledger with PBFT consensus and SHA-256 cryptographic chain preventing retroactive record tampering.
4. POLLINATE™ Escrow Economy: Smart contracts linking commercial growers and beekeepers, minting Pollination Service Credits (POL-CRD) upon verified deployment.
5. Consumer Digital Honey Passport: QR code on every bottle allowing consumers to verify botanical origin, harvest date, lab certificates, and blockchain proof.`
  },
  {
    id: 'smart_hives',
    title: 'Smart Hives & Acoustic Bio-Monitoring',
    keywords: ['hive', 'hives', 'acoustic', 'sound', 'queen', 'piping', 'swarm', 'swarming', 'telemetry', 'frequency', 'sensor', 'health score', 'inspection'],
    content: `Smart Hives utilize audio sensors and machine learning inference to monitor honeybee colony dynamics:
- Normal Hive Frequency: 150-250 Hz indicates healthy foraging and brood maintenance.
- Swarming Pre-Indicators: Shift towards 400-500 Hz buzzing amplitude suggests imminent swarming within 24-48 hours.
- Queenless Piping: High-pitched periodic 300-450 Hz pulses or sudden drop in harmonic density indicates absent queen or queen cell emergence.
- Telemetry Metrics: Ambient & internal temperature (34-36°C brood nest ideal), relative humidity (50-65%), colony weight, and acoustic health score (0-100).
- Automatic Inspection Prioritization: Flags hives as URGENT (e.g. H-017 imminent swarm), HIGH (e.g. H-015 suspected queenlessness), or NOMINAL.`
  },
  {
    id: 'spectraseal_testing',
    title: 'SpectraSeal™ Screening & Adulteration Detection',
    keywords: ['spectraseal', 'spectroscopy', 'nir', 'nmr', 'adulteration', 'purity', 'testing', 'fake honey', 'sugar syrup', 'c4', 'c3', 'c-13', 'irms', 'hmf', 'lab'],
    content: `SpectraSeal™ is HoneyChain's multi-tier quality gate for honey authenticity:
- Near-Infrared (NIR) & NMR Fingerprinting: Scans honey samples (1000nm-2500nm) and compares spectral curves against certified unifloral reference libraries.
- EA-IRMS (Elemental Analyzer - Isotope Ratio Mass Spectrometry): Measures carbon stable isotope ratio (δ13C). Pure C3 plant floral honey ranges from -23.5‰ to -27.5‰. C4 sugars (corn/cane syrup) measure -10‰ to -16‰ and trigger an instant adulteration alert.
- HMF (Hydroxymethylfurfural) & Diastase Activity: HMF above 40 mg/kg indicates thermal damage, excessive heating, or artificial inversion of sugar syrup.
- Smart Contract Quarantine Gate: Any sample with spectral divergence > 15% or isotope anomaly is automatically frozen on-chain (status QUARANTINED/BLOCKED), preventing packaging and distribution.`
  },
  {
    id: 'blockchain_ledger',
    title: 'Blockchain Ledger & Tamper Resistance',
    keywords: ['blockchain', 'ledger', 'smart contract', 'merkle', 'sha256', 'tamper', 'break the ledger', 'consensus', 'block', 'hash', 'security'],
    content: `HoneyChain utilizes a permissioned distributed ledger with PBFT consensus:
- Cryptographic Proof: Every batch creation, spectral test, lab report, and custody transfer is hashed with SHA-256 and linked into an immutable block sequence.
- Anti-Tampering Engine: If any record (harvest quantity, floral source, lab result) is modified in the database, the cryptographic hash verification fails immediately.
- Zero-Knowledge Proofs (ZKP): Enables beekeepers to prove regulatory compliance and yield verification to buyers without exposing private commercial trade secrets.
- Smart Contract Gates: Programmatic rules govern status transitions (PENDING_LAB -> APPROVED -> DISTRIBUTED). Batches cannot proceed without verified cryptographic lab signatures.`
  },
  {
    id: 'pollination_economy',
    title: 'POLLINATE™ Escrow & Biodiversity Credits',
    keywords: ['pollinate', 'pollination', 'credit', 'credits', 'pol-crd', 'escrow', 'farmer', 'grower', 'contract', 'tokens', 'deployment'],
    content: `The POLLINATE™ framework connects agricultural farmers with commercial beekeepers:
- Acoustically Verified Deployment: BeeGuard hive sensors record flight hours and acoustic foraging activity in target orchards (e.g. apple, almond, mustard).
- Automated Escrow: Farmers lock funds in a smart escrow contract. Upon sensor verification of contracted hive-hours, funds are automatically disbursed to the beekeeper.
- Service Credits Minted: Successfully fulfilled pollination contracts mint digital Pollination Service Credits (POL-CRD) with cryptographic proof of ecosystem service, tradable or verifiable for sustainability disclosures.`
  },
  {
    id: 'consumer_passport',
    title: 'Consumer Honey Passport & QR Bottle Verification',
    keywords: ['qr', 'passport', 'bottle', 'jar', 'consumer', 'scan', 'traceability', 'provenance', 'certificate', 'origin', 'nilgiri', 'kashmir', 'sunderbans'],
    content: `Every retail honey jar features a unique encrypted QR code:
- Instant Traceability: Consumers scan the QR code to view the complete lifecycle: apiary GPS coordinates, beekeeper identity, harvest date, and batch digital ID.
- Lab Accreditation Badges: Displays ISO/IEC 17025, NABL, and FSSAI accredited laboratory certificates with confirmatory isotope & pollen analysis.
- Purity Guarantee: Shows exact floral source (e.g., Nilgiri Wildflower, Kashmiri White Acacia, Sunderbans Mangrove) with verified 0.0% C4/C3 exogenous sugar adulteration.
- Interactive Verification: Users can verify the live block number and cryptographic transaction hash on the HoneyChain block explorer.`
  }
];

// Lightweight BM25 / Keyword Retrieval for RAG context selection
export function retrieveRelevantKnowledge(query = '', maxChunks = 2) {
  if (!query || typeof query !== 'string') return [];
  
  const tokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 2);
  if (tokens.length === 0) return KNOWLEDGE_CHUNKS.slice(0, maxChunks);

  const scored = KNOWLEDGE_CHUNKS.map(chunk => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    const titleLower = chunk.title.toLowerCase();

    tokens.forEach(token => {
      // Keyword exact matches have high weight
      if (chunk.keywords.some(k => k.includes(token) || token.includes(k))) {
        score += 8;
      }
      // Title match
      if (titleLower.includes(token)) {
        score += 5;
      }
      // Content occurrence
      const regex = new RegExp(`\\b${token}\\b`, 'g');
      const matches = contentLower.match(regex);
      if (matches) {
        score += Math.min(matches.length * 1.5, 6);
      }
    });

    return { ...chunk, score };
  });

  return scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}
