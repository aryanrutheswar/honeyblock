import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../honeychain.db');

export const db = new sqlite3.Database(DB_PATH);

export function sha256(data) {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Apiaries Table
      db.run(`
        CREATE TABLE IF NOT EXISTS apiaries (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          region TEXT NOT NULL,
          coordinates TEXT NOT NULL,
          flora TEXT NOT NULL,
          beekeeper TEXT NOT NULL,
          hivesCount INTEGER DEFAULT 1,
          altitude TEXT,
          established TEXT
        )
      `);

      // 2. Hives & IoT Sensors Table
      db.run(`
        CREATE TABLE IF NOT EXISTS hives (
          id TEXT PRIMARY KEY,
          apiaryId TEXT,
          name TEXT NOT NULL,
          species TEXT NOT NULL,
          condition TEXT NOT NULL,
          healthScore INTEGER NOT NULL,
          queenStatus TEXT NOT NULL,
          swarmingRisk INTEGER NOT NULL,
          colonyStrength TEXT NOT NULL,
          weightKg REAL NOT NULL,
          tempC REAL NOT NULL,
          humidityPct REAL NOT NULL,
          acousticFrequencyHz INTEGER NOT NULL,
          inspectionPriority TEXT NOT NULL,
          yieldPredictionKg REAL NOT NULL,
          aiConfidence REAL NOT NULL,
          FOREIGN KEY (apiaryId) REFERENCES apiaries (id)
        )
      `);

      // 3. Honey Batches & Digital IDs Table
      db.run(`
        CREATE TABLE IF NOT EXISTS batches (
          id TEXT PRIMARY KEY,
          digitalId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          hiveId TEXT,
          apiaryId TEXT,
          beekeeper TEXT NOT NULL,
          harvestDate TEXT NOT NULL,
          harvestQtyKg REAL NOT NULL,
          floralSource TEXT NOT NULL,
          moisturePct REAL NOT NULL,
          hpmFuranMgKg REAL NOT NULL,
          isotopeDelta13C REAL NOT NULL,
          diastaseActivity REAL NOT NULL,
          spectralSimilarity REAL NOT NULL,
          adulterationRisk TEXT NOT NULL,
          status TEXT NOT NULL,
          blockchainTx TEXT NOT NULL,
          blockNumber INTEGER NOT NULL,
          qrCodeUrl TEXT,
          quarantineReason TEXT,
          labCertificateId TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 4. Lab Inspections (ISO/IEC 17025) Table
      db.run(`
        CREATE TABLE IF NOT EXISTS lab_inspections (
          id TEXT PRIMARY KEY,
          batchId TEXT NOT NULL,
          inspectorName TEXT NOT NULL,
          labName TEXT NOT NULL,
          isoAccreditation TEXT NOT NULL,
          isotopeDelta13C REAL NOT NULL,
          hmfMgKg REAL NOT NULL,
          diastaseUnits REAL NOT NULL,
          pollenPurityPct REAL NOT NULL,
          c4SugarAdulterationPct REAL NOT NULL,
          sha256Digest TEXT NOT NULL,
          zkProofHash TEXT NOT NULL,
          status TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (batchId) REFERENCES batches (id)
        )
      `);

      // 5. Blockchain Blocks Table
      db.run(`
        CREATE TABLE IF NOT EXISTS blockchain_blocks (
          blockIndex INTEGER PRIMARY KEY,
          timestamp TEXT NOT NULL,
          previousHash TEXT NOT NULL,
          currentHash TEXT NOT NULL,
          merkleRoot TEXT NOT NULL,
          nonce INTEGER NOT NULL,
          validatorSignature TEXT NOT NULL,
          transactionCount INTEGER NOT NULL,
          payloadJson TEXT NOT NULL
        )
      `);

      // 6. Supply Chain Custody Events
      db.run(`
        CREATE TABLE IF NOT EXISTS supply_chain_events (
          id TEXT PRIMARY KEY,
          batchId TEXT NOT NULL,
          stage TEXT NOT NULL,
          actor TEXT NOT NULL,
          location TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          details TEXT NOT NULL,
          sensorSignature TEXT NOT NULL,
          txHash TEXT NOT NULL,
          status TEXT NOT NULL
        )
      `);

      // Seed Initial Data or upgrade if fewer than 10 batches
      db.get('SELECT COUNT(*) as count FROM batches', (err, row) => {
        if (err || !row || row.count < 10) {
          seedDatabase().then(resolve).catch(reject);
        } else {
          resolve(true);
        }
      });
    });
  });
}

async function seedDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Apiaries
      const apiaries = [
        ['AP-01', 'Nilgiri Biosphere High-Altitude Apiary', 'Nilgiris, Tamil Nadu', '11°24\'40" N, 76°41\'30" E', 'Wild Kurinji & Forest Jamun', 'M. Ramanathan', 6, '2,240m', '2019'],
        ['AP-02', 'Kashmir Valley Alpine Organic Reserve', 'Srinagar, Jammu & Kashmir', '34°05\'24" N, 74°47\'50" E', 'Acacia & Kashmiri Wildflower', 'Farooq Ahmad Mir', 8, '1,730m', '2018'],
        ['AP-03', 'Sundarbans Mangrove Reserve', 'Sundarbans, West Bengal', '21°56\'58" N, 89°11\'00" E', 'Khalisa & Goran Wild Mangrove', 'Subhash Mondal', 4, '6m', '2021'],
        ['AP-04', 'Coorg Shaded Forest Coffee Estate', 'Coorg (Kodagu), Karnataka', '12°25\'18" N, 75°44\'16" E', 'Robusta & Arabica Coffee Blossom', 'K. B. Bopanna', 7, '1,150m', '2020'],
        ['AP-05', 'Thar Desert Organic Floral Belt', 'Bharatpur & Shekhawati, Rajasthan', '27°48\'00" N, 75°12\'00" E', 'Yellow Mustard & Wild Kikar', 'Rao Jai Singh', 5, '210m', '2022'],
        ['AP-06', 'Kullu Valley High-Altitude Orchards', 'Kullu Valley, Himachal Pradesh', '31°57\'36" N, 77°06\'36" E', 'Organic Apple Blossom & Rhododendron', 'Suresh Thakur', 6, '2,050m', '2019'],
        ['AP-07', 'Mahabaleshwar UNESCO Hotspot Sanctuary', 'Mahabaleshwar, Maharashtra', '17°55\'18" N, 73°39\'36" E', 'Black Jamun (Syzygium cumini)', 'Vasantrao Shinde', 5, '1,372m', '2020'],
        ['AP-08', 'Silent Valley Rainforest Buffer', 'Silent Valley, Kerala', '11°05\'00" N, 76°27\'00" E', 'Cardamom, Forest Acacia & Neelakurinji', 'Sivadasan K.', 8, '1,450m', '2017'],
        ['AP-09', 'Cherrapunji Living Root Forest Apiary', 'East Khasi Hills, Meghalaya', '25°16\'48" N, 91°43\'48" E', 'Wild Citrus, Khasi Cinnamon & Orchid', 'D. Lyngdoh', 4, '1,480m', '2021'],
        ['AP-10', 'Bhagirathi Glacial Alpine Valley', 'Garhwal Himalayas, Uttarakhand', '30°59\'24" N, 78°56\'24" E', 'Himalayan Cedar, Wild Thyme & Pine', 'Harish Rawat', 6, '2,580m', '2018']
      ];

      const apiaryStmt = db.prepare(`
        INSERT OR REPLACE INTO apiaries (id, name, region, coordinates, flora, beekeeper, hivesCount, altitude, established)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const a of apiaries) {
        apiaryStmt.run(...a);
      }
      apiaryStmt.finalize();

      // 2. Hives
      const hives = [
        ['HIVE-084', 'AP-01', 'Nilgiri Hive Alpha-84', 'Apis cerana indica', 'Optimal Brood Thermoregulation', 98, 'Queen Verified & Active (240Hz)', 6, 'High (45,000 bees)', 42.5, 34.8, 56.4, 240, 'NORMAL', 18.2, 97.8],
        ['HIVE-092', 'AP-02', 'Kashmir Alpine Alpha-92', 'Apis mellifera', 'Stable Colony', 94, 'Queen Active', 8, 'High (42,000 bees)', 44.0, 34.6, 54.2, 242, 'NORMAL', 19.5, 96.0],
        ['HIVE-033', 'AP-03', 'Sundarbans Mangrove Tidal Hive-33', 'Apis dorsata', 'High Saline Resilience', 92, 'Queen Active', 10, 'Very High (52,000 bees)', 36.0, 32.4, 78.2, 238, 'NORMAL', 22.0, 94.5],
        ['HIVE-041', 'AP-04', 'Coorg Blossom Hive-41', 'Apis cerana', 'Optimal Foraging', 95, 'Queen Active', 7, 'High (41,000 bees)', 45.0, 28.5, 62.0, 245, 'NORMAL', 20.4, 98.1],
        ['HIVE-052', 'AP-05', 'Thar Arid Hive-52', 'Apis florea / cerana', 'Desert Adapted', 91, 'Queen Active', 12, 'Moderate (36,000 bees)', 55.0, 35.8, 38.4, 240, 'NORMAL', 16.8, 93.7],
        ['HIVE-067', 'AP-06', 'Kullu Orchard Hive-67', 'Apis mellifera', 'High Altitude Resilient', 96, 'Queen Active', 5, 'High (46,000 bees)', 38.0, 24.2, 52.1, 244, 'NORMAL', 21.0, 98.5],
        ['HIVE-078', 'AP-07', 'Mahabaleshwar Jamun Hive-78', 'Apis cerana indica', 'Monofloral Flow', 95, 'Queen Active', 8, 'High (43,000 bees)', 40.0, 26.8, 64.5, 239, 'NORMAL', 17.5, 96.4],
        ['HIVE-048', 'AP-08', 'Silent Valley Canopy Hive-48', 'Apis cerana indica', 'Pristine Bioreserve Status', 99, 'Queen Active', 4, 'Very High (48,000 bees)', 48.0, 27.4, 71.0, 241, 'NORMAL', 23.5, 99.2],
        ['HIVE-089', 'AP-09', 'Cherrapunji Mist Hive-89', 'Apis dorsata laboriosa', 'Cloud Forest Adaptation', 93, 'Queen Active', 9, 'High (44,000 bees)', 32.0, 22.0, 84.0, 236, 'NORMAL', 15.0, 95.0],
        ['HIVE-099', 'AP-10', 'Gangotri Glacial Hive-99', 'Apis mellifera', 'Sub-Zero Winterized', 97, 'Queen Active', 6, 'High (47,000 bees)', 35.0, 20.5, 48.0, 246, 'NORMAL', 18.0, 98.8]
      ];

      const hiveStmt = db.prepare(`
        INSERT OR REPLACE INTO hives (id, apiaryId, name, species, condition, healthScore, queenStatus, swarmingRisk, colonyStrength, weightKg, tempC, humidityPct, acousticFrequencyHz, inspectionPriority, yieldPredictionKg, aiConfidence)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const h of hives) {
        hiveStmt.run(...h);
      }
      hiveStmt.finalize();

      // 3. Batches (10 unique Honeychain batches)
      const batches = [
        [
          'HC-2026-NIL-008421', 'HC-2026-NIL-008421', 'Nilgiri Wild Kurinji Pure Raw Reserve', 'HIVE-084', 'AP-01',
          'M. Ramanathan', '2026-09-02', 42.5, 'Wild Kurinji & Forest Jamun', 16.8, 8.2, -26.8, 24.8, 99.4,
          '0.00% (Natural Botanical C3 Nectar)', 'APPROVED', `0x${sha256('nil-8421-tx')}`, 1,
          '/verify/HC-2026-NIL-008421', null, 'NABL-ISO17025-TN-99824'
        ],
        [
          'HC-2026-KSH-009102', 'HC-2026-KSH-009102', 'Kashmir Alpine White Acacia', 'HIVE-092', 'AP-02',
          'Farooq Ahmad Mir', '2026-08-28', 50.0, 'Acacia & Kashmiri Wildflower', 15.9, 6.4, -27.1, 26.2, 99.8,
          '0.00% (Pure Alpine Reserve)', 'APPROVED', `0x${sha256('ksh-9102-tx')}`, 2,
          '/verify/HC-2026-KSH-009102', null, 'NABL-ISO17025-JK-44102'
        ],
        [
          'HC-2026-SUN-003319', 'HC-2026-SUN-003319', 'Sundarbans Deep Mangrove Wild Honey', 'HIVE-033', 'AP-03',
          'Subhash Mondal', '2026-08-19', 36.0, 'Khalisa & Goran Wild Mangrove', 18.2, 9.1, -26.2, 22.4, 98.9,
          '0.00% (Tidal Mangrove Bioreserve)', 'APPROVED', `0x${sha256('sun-3319-tx')}`, 3,
          '/verify/HC-2026-SUN-003319', null, 'NABL-ISO17025-WB-33109'
        ],
        [
          'HC-2026-COF-004128', 'HC-2026-COF-004128', 'Coorg Single-Estate Coffee Blossom', 'HIVE-041', 'AP-04',
          'K. B. Bopanna', '2026-08-25', 45.0, 'Robusta & Arabica Coffee Blossom', 17.1, 7.8, -26.5, 25.1, 99.2,
          '0.00% (Highland Shade Canopy)', 'APPROVED', `0x${sha256('cof-4128-tx')}`, 4,
          '/verify/HC-2026-COF-004128', null, 'NABL-ISO17025-KA-41288'
        ],
        [
          'HC-2026-RAJ-005234', 'HC-2026-RAJ-005234', 'Thar Desert Golden Mustard & Kikar', 'HIVE-052', 'AP-05',
          'Rao Jai Singh', '2026-09-01', 55.0, 'Yellow Mustard & Wild Kikar', 17.4, 8.6, -25.9, 23.7, 99.0,
          '0.00% (Organic Arid Floral Belt)', 'APPROVED', `0x${sha256('raj-5234-tx')}`, 5,
          '/verify/HC-2026-RAJ-005234', null, 'NABL-ISO17025-RJ-52340'
        ],
        [
          'HC-2026-HIM-006789', 'HC-2026-HIM-006789', 'Himachal Mountain Apple Blossom', 'HIVE-067', 'AP-06',
          'Suresh Thakur', '2026-08-30', 38.0, 'Organic Apple Blossom & Rhododendron', 16.2, 5.8, -27.4, 27.4, 99.7,
          '0.00% (Glacial Valley Nectar)', 'APPROVED', `0x${sha256('him-6789-tx')}`, 6,
          '/verify/HC-2026-HIM-006789', null, 'NABL-ISO17025-HP-67892'
        ],
        [
          'HC-2026-MHA-007845', 'HC-2026-MHA-007845', 'Mahabaleshwar Wild Forest Jamun', 'HIVE-078', 'AP-07',
          'Vasantrao Shinde', '2026-08-22', 40.0, 'Black Jamun (Syzygium cumini)', 17.0, 7.2, -26.7, 24.0, 99.3,
          '0.00% (Western Ghats Monofloral)', 'APPROVED', `0x${sha256('mha-7845-tx')}`, 7,
          '/verify/HC-2026-MHA-007845', null, 'NABL-ISO17025-MH-78451'
        ],
        [
          'HC-2026-AP-004821', 'HC-2026-AP-004821', 'Western Ghats Rainforest Multifloral', 'HIVE-048', 'AP-08',
          'Sivadasan K.', '2026-09-03', 48.0, 'Cardamom, Forest Acacia & Neelakurinji', 16.5, 6.9, -26.9, 28.1, 99.6,
          '0.00% (Silent Valley Protected Buffer)', 'APPROVED', `0x${sha256('ap-4821-tx')}`, 8,
          '/verify/HC-2026-AP-004821', null, 'NABL-ISO17025-KL-48217'
        ],
        [
          'HC-2026-MEG-008912', 'HC-2026-MEG-008912', 'Meghalaya Khasi Hills Rock Bee Honey', 'HIVE-089', 'AP-09',
          'D. Lyngdoh', '2026-08-15', 32.0, 'Wild Citrus, Khasi Cinnamon & Orchid', 17.8, 8.0, -26.4, 23.2, 98.8,
          '0.00% (Living Root Bridge Canopy)', 'APPROVED', `0x${sha256('meg-8912-tx')}`, 9,
          '/verify/HC-2026-MEG-008912', null, 'NABL-ISO17025-ML-89125'
        ],
        [
          'HC-2026-UTT-009951', 'HC-2026-UTT-009951', 'Uttarakhand Gangotri Cedar & Pine Nectar', 'HIVE-099', 'AP-10',
          'Harish Rawat', '2026-08-27', 35.0, 'Himalayan Cedar, Wild Thyme & Pine', 15.5, 5.2, -27.6, 29.0, 99.9,
          '0.00% (Glacial Alpine Conifer)', 'APPROVED', `0x${sha256('utt-9951-tx')}`, 10,
          '/verify/HC-2026-UTT-009951', null, 'NABL-ISO17025-UK-99513'
        ]
      ];

      const batchStmt = db.prepare(`
        INSERT OR REPLACE INTO batches (id, digitalId, name, hiveId, apiaryId, beekeeper, harvestDate, harvestQtyKg, floralSource, moisturePct, hpmFuranMgKg, isotopeDelta13C, diastaseActivity, spectralSimilarity, adulterationRisk, status, blockchainTx, blockNumber, qrCodeUrl, quarantineReason, labCertificateId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const b of batches) {
        batchStmt.run(...b);
      }
      batchStmt.finalize();

      // 4. Lab Inspections
      const labStmt = db.prepare(`
        INSERT OR REPLACE INTO lab_inspections (id, batchId, inspectorName, labName, isoAccreditation, isotopeDelta13C, hmfMgKg, diastaseUnits, pollenPurityPct, c4SugarAdulterationPct, sha256Digest, zkProofHash, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (let i = 0; i < batches.length; i++) {
        const b = batches[i];
        labStmt.run(
          `LAB-INS-2026-00${i + 1}`,
          b[0],
          'Dr. Ananya Iyer, Chief Chromatographer',
          'Central Honey Quality & Isotope Testing Laboratory',
          'ISO/IEC 17025:2017 & FSSAI Accredited',
          b[11], // isotope
          b[10], // hmf
          b[12], // diastase
          b[13], // spectral / purity
          0.0,
          sha256(`CERT_${b[0]}`),
          sha256(`ZK_SNARK_${b[0]}`),
          'VERIFIED_AND_NOTARIZED'
        );
      }
      labStmt.finalize();

      // 5. Blockchain Blocks
      let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
      const blockStmt = db.prepare(`
        INSERT OR REPLACE INTO blockchain_blocks (blockIndex, timestamp, previousHash, currentHash, merkleRoot, nonce, validatorSignature, transactionCount, payloadJson)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let idx = 0; idx <= 10; idx++) {
        const payload = idx === 0 
          ? JSON.stringify({ event: 'GENESIS_HYPERLEDGER_FABRIC_ANCHOR', network: 'Honeychain National Trust Network' })
          : JSON.stringify({ batchId: batches[idx - 1][0], event: 'LAB_CERTIFIED_AUTHENTIC', producer: batches[idx - 1][5] });
        const currHash = sha256(`${idx}-${prevHash}-${payload}-${idx * 1000}`);
        blockStmt.run(
          idx,
          `2026-08-${String(Math.min(idx + 1, 28)).padStart(2, '0')}T10:00:00.000Z`,
          prevHash,
          currHash,
          sha256(`merkle-${idx}`),
          1000 + idx,
          `ECDSA_VALIDATOR_NODE_0${idx}`,
          idx === 0 ? 1 : 3,
          payload
        );
        prevHash = currHash;
      }
      blockStmt.finalize();

      console.log('✅ SQLite Database initialized and seeded with all 10 Honeychain batches.');
      resolve(true);
    });
  });
}

