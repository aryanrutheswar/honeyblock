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
      // 1. Clusters Table (KVIC Administrative Clusters)
      db.run(`
        CREATE TABLE IF NOT EXISTS clusters (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          state TEXT NOT NULL,
          region TEXT NOT NULL,
          coordinates TEXT NOT NULL,
          leadOfficer TEXT NOT NULL,
          beekeepersCount INTEGER DEFAULT 1,
          hivesCount INTEGER DEFAULT 1,
          annualProductionKg REAL DEFAULT 0,
          riskStatus TEXT DEFAULT 'HEALTHY',
          activeAlertsCount INTEGER DEFAULT 0
        )
      `);

      // 2. Beekeepers Table
      db.run(`
        CREATE TABLE IF NOT EXISTS beekeepers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          clusterId TEXT NOT NULL,
          apiaryName TEXT NOT NULL,
          contactPhone TEXT,
          experienceYears INTEGER,
          boxesAllotted INTEGER,
          totalHarvestKg REAL DEFAULT 0,
          walletBalanceInr REAL DEFAULT 0,
          pendingRoyaltyInr REAL DEFAULT 0,
          fidoEnrolled BOOLEAN DEFAULT 1,
          FOREIGN KEY (clusterId) REFERENCES clusters (id)
        )
      `);

      // 3. Apiaries Table
      db.run(`
        CREATE TABLE IF NOT EXISTS apiaries (
          id TEXT PRIMARY KEY,
          clusterId TEXT,
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

      // 4. Hives & IoT Sensors Table
      db.run(`
        CREATE TABLE IF NOT EXISTS hives (
          id TEXT PRIMARY KEY,
          apiaryId TEXT,
          clusterId TEXT,
          beekeeperId TEXT,
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
          whyPrediction TEXT,
          FOREIGN KEY (apiaryId) REFERENCES apiaries (id)
        )
      `);

      // 5. Batches Table
      db.run(`
        CREATE TABLE IF NOT EXISTS batches (
          id TEXT PRIMARY KEY,
          digitalId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          parentBatchId TEXT,
          hiveId TEXT,
          apiaryId TEXT,
          clusterId TEXT,
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
          traceabilityScore REAL DEFAULT 98.4,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 6. Packaging Lots (Batch Split & Merge Genealogy)
      db.run(`
        CREATE TABLE IF NOT EXISTS packaging_lots (
          id TEXT PRIMARY KEY,
          parentBatchId TEXT NOT NULL,
          lotNumber TEXT NOT NULL,
          packageType TEXT NOT NULL,
          unitCount INTEGER NOT NULL,
          unitSizeGram REAL NOT NULL,
          qrBatchCode TEXT NOT NULL,
          processingUnit TEXT NOT NULL,
          dispatchStatus TEXT DEFAULT 'PACKAGED',
          FOREIGN KEY (parentBatchId) REFERENCES batches (id)
        )
      `);

      // 7. Lab Inspections (ISO/IEC 17025) Table
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
          certificateUrl TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (batchId) REFERENCES batches (id)
        )
      `);

      // 8. Blockchain Blocks Table
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

      // 9. Supply Chain Custody Events Table
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

      // 10. Early Warning Alerts Table
      db.run(`
        CREATE TABLE IF NOT EXISTS alerts (
          id TEXT PRIMARY KEY,
          clusterId TEXT,
          hiveId TEXT,
          batchId TEXT,
          severity TEXT NOT NULL,
          title TEXT NOT NULL,
          whyReason TEXT NOT NULL,
          recommendedAction TEXT NOT NULL,
          assignedTo TEXT,
          status TEXT DEFAULT 'PENDING',
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 11. Consumer Scans & Counterfeit Detection Table
      db.run(`
        CREATE TABLE IF NOT EXISTS consumer_scans (
          id TEXT PRIMARY KEY,
          batchId TEXT NOT NULL,
          scanLocation TEXT NOT NULL,
          ipAddress TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          isAnomaly BOOLEAN DEFAULT 0,
          anomalyReason TEXT
        )
      `);

      // 12. Marketplace Orders Table
      db.run(`
        CREATE TABLE IF NOT EXISTS marketplace_orders (
          id TEXT PRIMARY KEY,
          buyerName TEXT NOT NULL,
          buyerOrg TEXT NOT NULL,
          batchId TEXT NOT NULL,
          quantityKg REAL NOT NULL,
          offeredPricePerKgInr REAL NOT NULL,
          totalAmountInr REAL NOT NULL,
          producerRoyaltyInr REAL NOT NULL,
          status TEXT DEFAULT 'REQUESTED',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 13. Audit Logs Table
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY,
          action TEXT NOT NULL,
          actor TEXT NOT NULL,
          entityId TEXT NOT NULL,
          details TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Check if upgrade/reseed is needed
      db.get('SELECT COUNT(*) as count FROM batches', (err, row) => {
        if (err || !row || row.count < 25) {
          seedDatabase().then(resolve).catch(reject);
        } else {
          resolve(true);
        }
      });
    });
  });
}

export async function seedDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('🌱 Seeding rich Indian Honeychain dataset (Telangana & National Clusters)...');

      // Clear existing to ensure clean seed
      db.run('DELETE FROM clusters');
      db.run('DELETE FROM beekeepers');
      db.run('DELETE FROM apiaries');
      db.run('DELETE FROM hives');
      db.run('DELETE FROM batches');
      db.run('DELETE FROM packaging_lots');
      db.run('DELETE FROM lab_inspections');
      db.run('DELETE FROM blockchain_blocks');
      db.run('DELETE FROM supply_chain_events');
      db.run('DELETE FROM alerts');
      db.run('DELETE FROM consumer_scans');
      db.run('DELETE FROM marketplace_orders');

      // 1. Clusters
      const clusters = [
        ['CL-TG-01', 'Warangal Rural Cluster', 'Telangana', 'Warangal & Mulugu Forest Belt', '17.9689° N, 79.5941° E', 'Dr. V. Prasad, KVIC Officer', 18, 64, 840.5, 'HEALTHY', 1],
        ['CL-TG-02', 'Hyderabad Peri-Urban Cluster', 'Telangana', 'Shamshabad & Vikarabad Belt', '17.3850° N, 78.4867° E', 'M. Narsing Rao, Cluster Lead', 12, 42, 510.0, 'MODERATE_RISK', 1],
        ['CL-TG-03', 'Nizamabad Organic Agro Belt', 'Telangana', 'Armoor & Bodhan Organic Valley', '18.6725° N, 78.0941° E', 'K. Sunitha Devi, FPO Director', 15, 58, 790.0, 'HEALTHY', 0],
        ['CL-TG-04', 'Karimnagar Forest Fringe', 'Telangana', 'Manair River & Jagtial Agro Belt', '18.4386° N, 79.1288° E', 'P. Ram Mohan, Field Supervisor', 11, 38, 460.0, 'MODERATE_RISK', 1],
        ['CL-TG-05', 'Khammam Agro-Forestry Belt', 'Telangana', 'Bhadrachalam Tribal Reserve Area', '17.2473° N, 80.1514° E', 'T. Gopal Krishna, KVIC Nodal', 14, 48, 620.0, 'HEALTHY', 0],
        ['CL-TG-06', 'Adilabad Tribal Forest Reserve', 'Telangana', 'Kawal Wildlife Sanctuary Buffer', '19.6641° N, 78.5320° E', 'S. Manikyam, Tribal Coop Lead', 9, 32, 380.0, 'HIGH_RISK', 2],
        ['CL-NAT-01', 'Nilgiris Biosphere Hill Range', 'Tamil Nadu', 'Ooty & Mudumalai Sub-Alpine', '11.4102° N, 76.6950° E', 'M. Ramanathan, Senior Apiarist', 16, 52, 690.0, 'HEALTHY', 0],
        ['CL-NAT-02', 'Kashmir Alpine Organic Belt', 'Jammu & Kashmir', 'Anantnag & Dachigam Acacia Reserve', '34.0837° N, 74.7973° E', 'Farooq Ahmad Mir, State Lead', 20, 70, 920.0, 'HEALTHY', 0],
        ['CL-NAT-03', 'Sundarbans Mangrove Conservation Belt', 'West Bengal', 'Sajnekhali & Gosaba Tidal Forests', '21.9497° N, 89.1833° E', 'Subhash Mondal, Mouli Coop', 14, 44, 580.0, 'MODERATE_RISK', 1],
        ['CL-NAT-04', 'Coorg Single-Estate Coffee Canopy', 'Karnataka', 'Madikeri & Virajpet Agro-Forest', '12.4244° N, 75.7382° E', 'K. B. Bopanna, Estate Director', 12, 46, 610.0, 'HEALTHY', 0],
        ['CL-NAT-05', 'Thar Desert Organic Mustard Belt', 'Rajasthan', 'Bharatpur & Shekhawati Arid Belt', '27.4800° N, 75.1200° E', 'Rao Jai Singh, Cooperative Head', 15, 50, 710.0, 'HEALTHY', 0],
        ['CL-NAT-06', 'Kullu Glacial Valley Orchards', 'Himachal Pradesh', 'Naggar & Manali Mountain Orchards', '31.9579° N, 77.1095° E', 'Suresh Thakur, Himalayan Coop', 14, 48, 640.0, 'HEALTHY', 0]
      ];

      const clusterStmt = db.prepare(`
        INSERT INTO clusters (id, name, state, region, coordinates, leadOfficer, beekeepersCount, hivesCount, annualProductionKg, riskStatus, activeAlertsCount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const c of clusters) clusterStmt.run(...c);
      clusterStmt.finalize();

      // 2. Beekeepers (20+ Indian Beekeepers)
      const beekeepers = [
        ['BK-TG-001', 'Ravi Kumar', 'CL-TG-01', 'Warangal Rural Cluster Apiary', '+91 98480 12345', 8, 12, 185.0, 48500, 4200, 1],
        ['BK-TG-002', 'Suresh Goud', 'CL-TG-01', 'Mulugu Teak Forest Apiary', '+91 98480 23456', 5, 8, 120.0, 31200, 1800, 1],
        ['BK-TG-003', 'Rajeshwari Devi', 'CL-TG-01', 'Jangaon Mahila Honey SHG', '+91 98480 34567', 6, 10, 145.0, 37800, 2400, 1],
        ['BK-TG-004', 'Mohammad Farhan', 'CL-TG-02', 'Shamshabad Horticultural Apiary', '+91 94400 45678', 4, 8, 98.0, 25600, 1100, 1],
        ['BK-TG-005', 'K. Srinivas Rao', 'CL-TG-03', 'Armoor Turmeric Floral Apiary', '+91 94400 56789', 9, 14, 210.0, 54600, 5200, 1],
        ['BK-TG-006', 'V. Thirupathi', 'CL-TG-04', 'Jagtial Mango Blossom Apiary', '+91 94400 67890', 5, 8, 115.0, 29900, 1500, 1],
        ['BK-TG-007', 'B. Ramulu', 'CL-TG-05', 'Bhadrachalam Forest Reserve Apiary', '+91 94400 78901', 7, 10, 150.0, 39000, 2800, 1],
        ['BK-TG-008', 'S. Maruthi', 'CL-TG-06', 'Kawal Tribal Beekeeping Enclave', '+91 94400 89012', 3, 6, 75.0, 19500, 900, 1],
        ['BK-NAT-001', 'M. Ramanathan', 'CL-NAT-01', 'Nilgiris Biosphere Apiary AP-01', '+91 94430 11223', 14, 16, 260.0, 68000, 7500, 1],
        ['BK-NAT-002', 'Farooq Ahmad Mir', 'CL-NAT-02', 'Kashmir Alpine Organic Reserve', '+91 94190 22334', 16, 20, 320.0, 84000, 9200, 1],
        ['BK-NAT-003', 'Subhash Mondal', 'CL-NAT-03', 'Sundarbans Mouli Tidal Apiary', '+91 94340 33445', 12, 12, 190.0, 49500, 3800, 1],
        ['BK-NAT-004', 'K. B. Bopanna', 'CL-NAT-04', 'Coorg Shaded Coffee Apiary', '+91 94480 44556', 10, 14, 215.0, 56000, 4800, 1],
        ['BK-NAT-005', 'Rao Jai Singh', 'CL-NAT-05', 'Thar Desert Organic Belt Apiary', '+91 94140 55667', 11, 15, 230.0, 60000, 5600, 1],
        ['BK-NAT-006', 'Suresh Thakur', 'CL-NAT-06', 'Kullu Valley Orchard Apiary', '+91 94180 66778', 8, 12, 180.0, 47000, 3900, 1],
        ['BK-NAT-007', 'Vasantrao Shinde', 'CL-NAT-01', 'Mahabaleshwar Jamun Apiary', '+91 94220 77889', 9, 12, 175.0, 45500, 3600, 1],
        ['BK-NAT-008', 'Sivadasan K.', 'CL-NAT-01', 'Silent Valley Canopy Apiary', '+91 94470 88990', 13, 16, 245.0, 64000, 6800, 1],
        ['BK-NAT-009', 'D. Lyngdoh', 'CL-NAT-02', 'Cherrapunji Living Root Apiary', '+91 94360 99001', 7, 10, 135.0, 35000, 2100, 1],
        ['BK-NAT-010', 'Harish Rawat', 'CL-NAT-06', 'Gangotri Glacial Valley Apiary', '+91 94120 10112', 10, 14, 205.0, 53500, 4600, 1],
        ['BK-NAT-011', 'Anjali Sharma', 'CL-NAT-06', 'Kangra Valley Wildflower Apiary', '+91 94180 21223', 6, 8, 110.0, 28600, 1600, 1],
        ['BK-NAT-012', 'Balwinder Singh', 'CL-NAT-05', 'Ludhiana Mustard Belt Apiary', '+91 98140 32334', 12, 16, 255.0, 66500, 6200, 1]
      ];

      const bkStmt = db.prepare(`
        INSERT INTO beekeepers (id, name, clusterId, apiaryName, contactPhone, experienceYears, boxesAllotted, totalHarvestKg, walletBalanceInr, pendingRoyaltyInr, fidoEnrolled)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const b of beekeepers) bkStmt.run(...b);
      bkStmt.finalize();

      // 3. Apiaries
      const apiaries = [
        ['AP-TG-01', 'CL-TG-01', 'Warangal Rural Cluster Apiary', 'Warangal, Telangana', '17.9689° N, 79.5941° E', 'Wild Multiflora & Teak Blossom', 'Ravi Kumar', 12, '302m', '2021'],
        ['AP-TG-02', 'CL-TG-02', 'Hyderabad Peri-Urban Apiary', 'Shamshabad, Telangana', '17.2403° N, 78.4294° E', 'Neem & Sunflower Nectar', 'Mohammad Farhan', 8, '545m', '2022'],
        ['AP-TG-03', 'CL-TG-03', 'Nizamabad Organic Turmeric Apiary', 'Armoor, Telangana', '18.7900° N, 78.2900° E', 'Turmeric, Mustard & Guava Blossom', 'K. Srinivas Rao', 14, '395m', '2020'],
        ['AP-TG-04', 'CL-TG-04', 'Karimnagar Forest Apiary', 'Jagtial, Telangana', '18.7933° N, 78.9133° E', 'Sesamum & Wild Forest Berry', 'V. Thirupathi', 8, '264m', '2022'],
        ['AP-TG-05', 'CL-TG-05', 'Khammam Bhadrachalam Apiary', 'Bhadrachalam, Telangana', '17.6688° N, 80.8936° E', 'Forest Mahua & Terminalia Blossom', 'B. Ramulu', 10, '82m', '2021'],
        ['AP-TG-06', 'CL-TG-06', 'Adilabad Kawal Wildlife Apiary', 'Jannaram, Telangana', '19.1417° N, 79.0167° E', 'Wild Tamarind & Teak Forest Flora', 'S. Manikyam', 6, '240m', '2023'],
        ['AP-01', 'CL-NAT-01', 'Nilgiri Biosphere High-Altitude Apiary', 'Nilgiris, Tamil Nadu', '11.4102° N, 76.6950° E', 'Wild Kurinji & Forest Jamun', 'M. Ramanathan', 16, '2,240m', '2019'],
        ['AP-02', 'CL-NAT-02', 'Kashmir Valley Alpine Organic Reserve', 'Srinagar, Jammu & Kashmir', '34.0837° N, 74.7973° E', 'Acacia & Kashmiri Wildflower', 'Farooq Ahmad Mir', 20, '1,730m', '2018'],
        ['AP-03', 'CL-NAT-03', 'Sundarbans Mangrove Reserve', 'Sundarbans, West Bengal', '21.9497° N, 89.1833° E', 'Khalisa & Goran Wild Mangrove', 'Subhash Mondal', 12, '6m', '2021'],
        ['AP-04', 'CL-NAT-04', 'Coorg Shaded Forest Coffee Estate', 'Coorg, Karnataka', '12.4244° N, 75.7382° E', 'Robusta & Arabica Coffee Blossom', 'K. B. Bopanna', 14, '1,150m', '2020'],
        ['AP-05', 'CL-NAT-05', 'Thar Desert Organic Floral Belt', 'Shekhawati, Rajasthan', '27.4800° N, 75.1200° E', 'Yellow Mustard & Wild Kikar', 'Rao Jai Singh', 15, '210m', '2022'],
        ['AP-06', 'CL-NAT-06', 'Kullu Valley High-Altitude Orchards', 'Kullu, Himachal Pradesh', '31.9579° N, 77.1095° E', 'Organic Apple Blossom & Rhododendron', 'Suresh Thakur', 12, '2,050m', '2019']
      ];

      const apiaryStmt = db.prepare(`
        INSERT INTO apiaries (id, clusterId, name, region, coordinates, flora, beekeeper, hivesCount, altitude, established)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const a of apiaries) apiaryStmt.run(...a);
      apiaryStmt.finalize();

      // 4. Hives (50+ Hives across Telangana and National clusters)
      const hives = [
        // Hero Hive
        ['HIVE-TG-017', 'AP-TG-01', 'CL-TG-01', 'BK-TG-001', 'Warangal Hive Delta-17 (HERO)', 'Apis cerana indica', 'Optimal Equilibrium', 86, 'Queen Active & Laying (240Hz)', 8, 'Optimal (44,000 bees)', 42.7, 34.2, 61.0, 240, 'LOW', 18.4, 96.8, 'Stable thermal brood regulation (34.2°C), steady daily weight gain (+380g), 240Hz harmonic hum.'],
        ['HIVE-TG-018', 'AP-TG-01', 'CL-TG-01', 'BK-TG-001', 'Warangal Hive Delta-18', 'Apis cerana indica', 'Healthy Colony', 92, 'Queen Active', 6, 'High (46,000 bees)', 44.2, 34.5, 59.5, 242, 'LOW', 19.8, 97.2, 'Excellent nectar inflow from wild forest blossom.'],
        ['HIVE-TG-019', 'AP-TG-01', 'CL-TG-01', 'BK-TG-002', 'Mulugu Forest Alpha-01', 'Apis cerana indica', 'Healthy Colony', 88, 'Queen Active', 7, 'Optimal (42,000 bees)', 41.5, 34.0, 62.0, 238, 'LOW', 17.5, 95.5, 'Normal foraging rhythm.'],
        ['HIVE-TG-023', 'AP-TG-01', 'CL-TG-01', 'BK-TG-001', 'Warangal Hive Gamma-23', 'Apis cerana indica', 'High Humidity Anomaly', 68, 'Queen Active', 24, 'Moderate (35,000 bees)', 37.8, 33.1, 74.5, 255, 'HIGH', 13.2, 91.0, 'ALERT: Elevated nest humidity (74.5%) increases chalkbrood/fungal vulnerability.'],
        ['HIVE-TG-031', 'AP-TG-02', 'CL-TG-02', 'BK-TG-004', 'Shamshabad Hive Beta-31', 'Apis cerana', 'Yield Decline Detected', 71, 'Queen Active', 18, 'Moderate (34,000 bees)', 35.2, 35.1, 54.0, 260, 'MEDIUM', 11.5, 89.4, 'Weight plateau for 6 consecutive days indicates local floral nectar depletion.'],
        ['HIVE-TG-045', 'AP-TG-06', 'CL-TG-06', 'BK-TG-008', 'Adilabad Kawal Hive-45', 'Apis cerana indica', 'Colony Stress & Varroa Risk', 58, 'Queen Laying Depressed', 48, 'Low (28,000 bees)', 31.0, 36.8, 48.0, 340, 'URGENT', 9.0, 84.5, 'CRITICAL: High frequency distress hum (340Hz) and comb temperature spike.'],
        ['HIVE-084', 'AP-01', 'CL-NAT-01', 'BK-NAT-001', 'Nilgiri Hive Alpha-84', 'Apis cerana indica', 'Optimal Thermoregulation', 98, 'Queen Verified Active', 5, 'High (45,000 bees)', 42.5, 34.8, 56.4, 240, 'LOW', 18.2, 98.4, 'Pristine mountain nectar gathering.'],
        ['HIVE-092', 'AP-02', 'CL-NAT-02', 'BK-NAT-002', 'Kashmir Alpine Alpha-92', 'Apis mellifera', 'Stable Colony', 94, 'Queen Active', 8, 'High (42,000 bees)', 44.0, 34.6, 54.2, 242, 'LOW', 19.5, 96.0, 'Acacia nectar flow optimal.'],
        ['HIVE-033', 'AP-03', 'CL-NAT-03', 'BK-NAT-003', 'Sundarbans Mangrove Hive-33', 'Apis dorsata', 'High Saline Resilience', 92, 'Queen Active', 10, 'Very High (52,000 bees)', 36.0, 32.4, 78.2, 238, 'LOW', 22.0, 94.5, 'Tidal mangrove foraging resilience confirmed.'],
        ['HIVE-041', 'AP-04', 'CL-NAT-04', 'BK-NAT-004', 'Coorg Blossom Hive-41', 'Apis cerana', 'Optimal Foraging', 95, 'Queen Active', 7, 'High (41,000 bees)', 45.0, 28.5, 62.0, 245, 'LOW', 20.4, 98.1, 'Single-estate coffee shade canopy active.'],
        ['HIVE-052', 'AP-05', 'CL-NAT-05', 'BK-NAT-005', 'Thar Arid Hive-52', 'Apis florea / cerana', 'Desert Adapted', 91, 'Queen Active', 12, 'Moderate (36,000 bees)', 55.0, 35.8, 38.4, 240, 'LOW', 16.8, 93.7, 'Mustard bloom intake high.'],
        ['HIVE-067', 'AP-06', 'CL-NAT-06', 'BK-NAT-006', 'Kullu Orchard Hive-67', 'Apis mellifera', 'High Altitude Resilient', 96, 'Queen Active', 5, 'High (46,000 bees)', 38.0, 24.2, 52.1, 244, 'LOW', 21.0, 98.5, 'Organic apple blossom pollination in progress.']
      ];

      // Generate additional hives to bring total to 52 hives
      for (let i = 1; i <= 40; i++) {
        const hId = `HIVE-IND-${String(i).padStart(3, '0')}`;
        const clusterId = clusters[i % clusters.length][0];
        const apiaryId = apiaries[i % apiaries.length][0];
        const bkId = beekeepers[i % beekeepers.length][0];
        const health = 80 + Math.floor(Math.sin(i) * 15);
        hives.push([
          hId,
          apiaryId,
          clusterId,
          bkId,
          `Sensor Hive Node #${i + 10}`,
          i % 3 === 0 ? 'Apis mellifera' : 'Apis cerana indica',
          health > 85 ? 'Healthy Colony' : health > 70 ? 'Moderate Alert' : 'Inspection Required',
          health,
          health > 75 ? 'Queen Active' : 'Queen Stress Suspected',
          Math.max(5, Math.floor(40 - health * 0.3)),
          health > 85 ? 'High (40k+ bees)' : 'Moderate (30k bees)',
          parseFloat((35.0 + (i % 10) * 1.2).toFixed(1)),
          parseFloat((33.5 + (i % 5) * 0.4).toFixed(1)),
          parseFloat((52.0 + (i % 8) * 2.5).toFixed(1)),
          220 + (i % 6) * 8,
          health < 75 ? 'HIGH' : health < 85 ? 'MEDIUM' : 'LOW',
          parseFloat((15.0 + (i % 8) * 1.1).toFixed(1)),
          parseFloat((92.0 + (i % 7) * 1.0).toFixed(1)),
          'Autonomous periodic IoT edge telemetry sync verified.'
        ]);
      }

      const hiveStmt = db.prepare(`
        INSERT INTO hives (id, apiaryId, clusterId, beekeeperId, name, species, condition, healthScore, queenStatus, swarmingRisk, colonyStrength, weightKg, tempC, humidityPct, acousticFrequencyHz, inspectionPriority, yieldPredictionKg, aiConfidence, whyPrediction)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const h of hives) hiveStmt.run(...h);
      hiveStmt.finalize();

      // 5. Batches (30+ Batches including Hero Batch HNY-TG-2026-0001)
      const batches = [
        // Hero Batch
        [
          'HNY-TG-2026-0001', 'HNY-TG-2026-0001', 'Warangal Forest Multiflora Pure Reserve (HERO)', null,
          'HIVE-TG-017', 'AP-TG-01', 'CL-TG-01', 'Ravi Kumar', '2026-09-12', 68.5,
          'Multiflora & Wild Forest Nectar', 17.2, 8.4, -26.8, 22.4, 99.4,
          '0.00% (Pure Natural Botanical C3 Nectar)', 'APPROVED', `0x${sha256('tg-0001-tx')}`, 1,
          '/verify/HNY-TG-2026-0001', null, 'NABL-ISO17025-TG-88102', 99.2
        ],
        [
          'HC-2026-NIL-008421', 'HC-2026-NIL-008421', 'Nilgiri Wild Kurinji Pure Raw Reserve', null,
          'HIVE-084', 'AP-01', 'CL-NAT-01', 'M. Ramanathan', '2026-09-02', 42.5,
          'Wild Kurinji & Forest Jamun', 16.8, 8.2, -26.8, 24.8, 99.4,
          '0.00% (Natural Botanical C3 Nectar)', 'APPROVED', `0x${sha256('nil-8421-tx')}`, 2,
          '/verify/HC-2026-NIL-008421', null, 'NABL-ISO17025-TN-99824', 98.8
        ],
        [
          'HC-2026-KSH-009102', 'HC-2026-KSH-009102', 'Kashmir Alpine White Acacia', null,
          'HIVE-092', 'AP-02', 'CL-NAT-02', 'Farooq Ahmad Mir', '2026-08-28', 50.0,
          'Acacia & Kashmiri Wildflower', 15.9, 6.4, -27.1, 26.2, 99.8,
          '0.00% (Pure Alpine Reserve)', 'APPROVED', `0x${sha256('ksh-9102-tx')}`, 3,
          '/verify/HC-2026-KSH-009102', null, 'NABL-ISO17025-JK-44102', 99.5
        ],
        [
          'HC-2026-SUN-003319', 'HC-2026-SUN-003319', 'Sundarbans Deep Mangrove Wild Honey', null,
          'HIVE-033', 'AP-03', 'CL-NAT-03', 'Subhash Mondal', '2026-08-19', 36.0,
          'Khalisa & Goran Wild Mangrove', 18.2, 9.1, -26.2, 22.4, 98.9,
          '0.00% (Tidal Mangrove Bioreserve)', 'APPROVED', `0x${sha256('sun-3319-tx')}`, 4,
          '/verify/HC-2026-SUN-003319', null, 'NABL-ISO17025-WB-33109', 97.9
        ],
        [
          'HC-2026-COF-004128', 'HC-2026-COF-004128', 'Coorg Single-Estate Coffee Blossom', null,
          'HIVE-041', 'AP-04', 'CL-NAT-04', 'K. B. Bopanna', '2026-08-25', 45.0,
          'Robusta & Arabica Coffee Blossom', 17.1, 7.8, -26.5, 25.1, 99.2,
          '0.00% (Highland Shade Canopy)', 'APPROVED', `0x${sha256('cof-4128-tx')}`, 5,
          '/verify/HC-2026-COF-004128', null, 'NABL-ISO17025-KA-41288', 98.6
        ],
        [
          'HC-2026-RAJ-005234', 'HC-2026-RAJ-005234', 'Thar Desert Golden Mustard & Kikar', null,
          'HIVE-052', 'AP-05', 'CL-NAT-05', 'Rao Jai Singh', '2026-09-01', 55.0,
          'Yellow Mustard & Wild Kikar', 17.4, 8.6, -25.9, 23.7, 99.0,
          '0.00% (Organic Arid Floral Belt)', 'APPROVED', `0x${sha256('raj-5234-tx')}`, 6,
          '/verify/HC-2026-RAJ-005234', null, 'NABL-ISO17025-RJ-52340', 98.2
        ],
        [
          'HC-2026-HIM-006789', 'HC-2026-HIM-006789', 'Himachal Mountain Apple Blossom', null,
          'HIVE-067', 'AP-06', 'CL-NAT-06', 'Suresh Thakur', '2026-08-30', 38.0,
          'Organic Apple Blossom & Rhododendron', 16.2, 5.8, -27.4, 27.4, 99.7,
          '0.00% (Glacial Valley Nectar)', 'APPROVED', `0x${sha256('him-6789-tx')}`, 7,
          '/verify/HC-2026-HIM-006789', null, 'NABL-ISO17025-HP-67892', 99.1
        ],
        [
          'HNY-TG-2026-0002', 'HNY-TG-2026-0002', 'Nizamabad Organic Turmeric & Mustard Honey', null,
          'HIVE-TG-018', 'AP-TG-03', 'CL-TG-03', 'K. Srinivas Rao', '2026-09-08', 52.0,
          'Turmeric & Organic Mustard Blossom', 16.9, 7.5, -26.7, 23.5, 99.5,
          '0.00% (Pure Botanical Nectar)', 'APPROVED', `0x${sha256('tg-0002-tx')}`, 8,
          '/verify/HNY-TG-2026-0002', null, 'NABL-ISO17025-TG-88103', 98.9
        ],
        [
          'HNY-TG-2026-0003', 'HNY-TG-2026-0003', 'Shamshabad Sunflower & Neem Monofloral', null,
          'HIVE-TG-031', 'AP-TG-02', 'CL-TG-02', 'Mohammad Farhan', '2026-09-05', 40.0,
          'Neem & Wild Sunflower', 17.5, 9.2, -26.3, 21.8, 98.8,
          '0.00% (Sub-Urban Pure Floral)', 'APPROVED', `0x${sha256('tg-0003-tx')}`, 9,
          '/verify/HNY-TG-2026-0003', null, 'NABL-ISO17025-TG-88104', 97.8
        ],
        [
          'HNY-TG-2026-0004', 'HNY-TG-2026-0004', 'Bhadrachalam Forest Mahua Wild Nectar', null,
          'HIVE-TG-019', 'AP-TG-05', 'CL-TG-05', 'B. Ramulu', '2026-09-10', 48.0,
          'Wild Mahua & Forest Terminalia', 17.8, 8.8, -26.6, 22.0, 99.1,
          '0.00% (Tribal Forest Reserve)', 'APPROVED', `0x${sha256('tg-0004-tx')}`, 10,
          '/verify/HNY-TG-2026-0004', null, 'NABL-ISO17025-TG-88105', 98.4
        ]
      ];

      // Add 20 more batches to reach 30+ total batches
      for (let i = 5; i <= 24; i++) {
        const bId = `HNY-TG-2026-${String(i).padStart(4, '0')}`;
        const isQuarantined = i === 14; // Demo quarantine batch
        batches.push([
          bId,
          bId,
          `Telangana Reserve Harvest Lot #${i}`,
          null,
          `HIVE-TG-0${(i % 5) + 1}7`,
          `AP-TG-0${(i % 6) + 1}`,
          `CL-TG-0${(i % 6) + 1}`,
          beekeepers[i % beekeepers.length][1],
          `2026-09-0${Math.min(9, (i % 9) + 1)}`,
          parseFloat((35.0 + (i % 7) * 3.5).toFixed(1)),
          i % 2 === 0 ? 'Wild Multiflora & Teak' : 'Forest Jamun & Acacia',
          isQuarantined ? 21.5 : parseFloat((16.2 + (i % 5) * 0.4).toFixed(1)),
          isQuarantined ? 48.2 : parseFloat((6.5 + (i % 6) * 0.7).toFixed(1)),
          isQuarantined ? -14.2 : -26.8,
          isQuarantined ? 8.2 : 23.4,
          isQuarantined ? 62.4 : 99.2,
          isQuarantined ? '38.4% (Exogenous C4 Industrial Syrup Detected)' : '0.00% (Pure Natural Botanical C3)',
          isQuarantined ? 'QUARANTINED' : 'APPROVED',
          `0x${sha256(`batch-${bId}-hash`)}`,
          10 + i,
          `/verify/${bId}`,
          isQuarantined ? 'Smart contract blocked batch: EA-IRMS δ13C threshold violated (-14.2‰ exceeds baseline).' : null,
          isQuarantined ? null : `NABL-ISO17025-TG-${90000 + i}`,
          isQuarantined ? 62.0 : 98.5
        ]);
      }

      const batchStmt = db.prepare(`
        INSERT INTO batches (id, digitalId, name, parentBatchId, hiveId, apiaryId, clusterId, beekeeper, harvestDate, harvestQtyKg, floralSource, moisturePct, hpmFuranMgKg, isotopeDelta13C, diastaseActivity, spectralSimilarity, adulterationRisk, status, blockchainTx, blockNumber, qrCodeUrl, quarantineReason, labCertificateId, traceabilityScore)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const b of batches) batchStmt.run(...b);
      batchStmt.finalize();

      // 6. Packaging Lots (Batch Split & Merge Genealogy for HNY-TG-2026-0001)
      const packagingLots = [
        ['PKG-TG-0001-A', 'HNY-TG-2026-0001', 'LOT-01-JAR500', 'Glass Honey Jar 500g', 50, 500, 'QR-TG-JAR-001-50', 'KVIC Warangal Agro-Processing Unit #02', 'RETAIL_READY'],
        ['PKG-TG-0001-B', 'HNY-TG-2026-0001', 'LOT-02-SQZ250', 'Squeeze Bottle 250g', 100, 250, 'QR-TG-SQZ-001-100', 'KVIC Warangal Agro-Processing Unit #02', 'RETAIL_READY'],
        ['PKG-TG-0001-C', 'HNY-TG-2026-0001', 'LOT-03-CRK1000', 'Earthen Ceramic Crock 1kg', 18, 1000, 'QR-TG-CRK-001-18', 'KVIC Warangal Agro-Processing Unit #02', 'DISPATCHED_TO_DISTRIBUTOR']
      ];

      const pkgStmt = db.prepare(`
        INSERT INTO packaging_lots (id, parentBatchId, lotNumber, packageType, unitCount, unitSizeGram, qrBatchCode, processingUnit, dispatchStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const p of packagingLots) pkgStmt.run(...p);
      pkgStmt.finalize();

      // 7. Lab Inspections (ISO/IEC 17025 & NABL)
      const labStmt = db.prepare(`
        INSERT INTO lab_inspections (id, batchId, inspectorName, labName, isoAccreditation, isotopeDelta13C, hmfMgKg, diastaseUnits, pollenPurityPct, c4SugarAdulterationPct, sha256Digest, zkProofHash, status, certificateUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < batches.length; i++) {
        const b = batches[i];
        const isQuarantined = b[17] === 'QUARANTINED';
        labStmt.run(
          `LAB-INS-2026-TG-${String(i + 1).padStart(4, '0')}`,
          b[0],
          'Dr. Ananya Iyer, Chief Chromatographer',
          'National Honey Quality & Isotope Mass Spectrometry Laboratory',
          'ISO/IEC 17025:2017 & FSSAI Accredited Testing Facility',
          b[13], // isotope
          b[12], // hmf
          b[14], // diastase
          isQuarantined ? 48.5 : 96.8, // pollen purity
          isQuarantined ? 38.4 : 0.0, // c4 adulteration
          sha256(`CERT_${b[0]}_SHA256`),
          sha256(`ZK_SNARK_PROOF_${b[0]}`),
          isQuarantined ? 'FAILED_QUARANTINE' : 'VERIFIED_AND_NOTARIZED',
          `/certificates/${b[0]}`
        );
      }
      labStmt.finalize();

      // 8. Blockchain Blocks (Visual SHA-256 Chaining)
      let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
      const blockStmt = db.prepare(`
        INSERT INTO blockchain_blocks (blockIndex, timestamp, previousHash, currentHash, merkleRoot, nonce, validatorSignature, transactionCount, payloadJson)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // Genesis Block
      const genesisPayload = JSON.stringify({
        event: 'GENESIS_HYPERLEDGER_FABRIC_ANCHOR',
        network: 'HoneyChain National Trust Network',
        authority: 'Khadi and Village Industries Commission (KVIC)',
        consensus: 'Proof-of-Authority (PoA) Byzantine Fault Tolerant'
      });
      const genesisHash = sha256(`0-${prevHash}-${genesisPayload}`);
      blockStmt.run(
        0,
        '2026-08-01T00:00:00.000Z',
        prevHash,
        genesisHash,
        sha256('merkle-root-genesis'),
        1001,
        'ECDSA_KVIC_NATIONAL_ROOT_KEY_01',
        1,
        genesisPayload
      );
      prevHash = genesisHash;

      // Real 7 Sequential Blocks for Hero Batch HNY-TG-2026-0001
      const heroFlowBlocks = [
        {
          event: 'BLOCK #001: HARVEST_REGISTERED',
          batchId: 'HNY-TG-2026-0001',
          actor: 'Beekeeper Ravi Kumar (FIDO2 Biometric Verified)',
          location: 'Warangal Rural Cluster Apiary (17.9689° N, 79.5941° E)',
          details: 'Harvested 68.5 kg Multiflora honey from Hive HIVE-TG-017 on IoT precision scale.'
        },
        {
          event: 'BLOCK #002: LAB_TEST_NOTARIZED',
          batchId: 'HNY-TG-2026-0001',
          actor: 'Dr. Ananya Iyer, National Isotope Testing Lab',
          location: 'ISO/IEC 17025 Accredited Laboratory Node 02',
          details: 'EA-IRMS confirmed δ13C = -26.8‰, HMF = 8.4 mg/kg, Diastase = 22.4 DN. C3/C4 syrup adulteration = 0.00%.'
        },
        {
          event: 'BLOCK #003: PROCESSING_AND_FILTRATION',
          batchId: 'HNY-TG-2026-0001',
          actor: 'KVIC Agro-Processing Unit #02',
          location: 'Warangal Central Processing Enclave',
          details: 'Cold micro-filtration at 38°C conducted to retain active enzymes and natural pollen grains.'
        },
        {
          event: 'BLOCK #004: QUALITY_APPROVAL_SMART_GATE',
          batchId: 'HNY-TG-2026-0001',
          actor: 'HoneyChain Automated Smart Contract Sentinel',
          location: 'National Consortial Ledger Gateway',
          details: 'Automated consensus evaluation passed: Rule-01 satisfied. Digital Quality Certificate NABL-ISO17025-TG-88102 minted.'
        },
        {
          event: 'BLOCK #005: PACKAGING_LOT_SPLIT',
          batchId: 'HNY-TG-2026-0001',
          actor: 'Automated Bottling Line 04',
          location: 'Warangal Bottling Facility',
          details: 'Divided into Packaging Lots PKG-TG-0001-A (50x 500g), PKG-TG-0001-B (100x 250g), PKG-TG-0001-C (18x 1kg).'
        },
        {
          event: 'BLOCK #006: COLD_CHAIN_DISPATCH',
          batchId: 'HNY-TG-2026-0001',
          actor: 'Telangana State Agro Logistics Fleet TL-09',
          location: 'Transit: Warangal to Hyderabad Central Distribution Hub',
          details: 'IoT temperature sensors logged average 21.4°C transit condition. Zero thermal shock events.'
        },
        {
          event: 'BLOCK #007: RETAIL_ARRIVAL_AND_QR_ACTIVATION',
          batchId: 'HNY-TG-2026-0001',
          actor: 'Khadi Gramodyog Bhavan Hyderabad / Retail Node 14',
          location: 'Hyderabad Retail Outlet',
          details: 'Cryptographic public QR verification activated. Ready for consumer smartphone scans.'
        }
      ];

      for (let i = 0; i < heroFlowBlocks.length; i++) {
        const b = heroFlowBlocks[i];
        const blockIndex = i + 1;
        const payloadStr = JSON.stringify(b);
        const currHash = sha256(`${blockIndex}-${prevHash}-${payloadStr}`);
        blockStmt.run(
          blockIndex,
          `2026-09-${String(12 + i).padStart(2, '0')}T11:00:00.000Z`,
          prevHash,
          currHash,
          sha256(`merkle-${blockIndex}`),
          1200 + i,
          `ECDSA_VALIDATOR_NODE_TG_0${blockIndex}`,
          1,
          payloadStr
        );
        prevHash = currHash;
      }

      // Add remaining blocks for other batches to bring height to 35+
      for (let i = 8; i <= 35; i++) {
        const payload = JSON.stringify({
          batchId: batches[(i - 1) % batches.length][0],
          event: 'CONSORTIAL_NOTARIZATION',
          producer: batches[(i - 1) % batches.length][7]
        });
        const currHash = sha256(`${i}-${prevHash}-${payload}`);
        blockStmt.run(
          i,
          `2026-09-18T${String(10 + (i % 10)).padStart(2, '0')}:00:00.000Z`,
          prevHash,
          currHash,
          sha256(`merkle-${i}`),
          1500 + i,
          `ECDSA_VALIDATOR_NODE_${i}`,
          2,
          payload
        );
        prevHash = currHash;
      }
      blockStmt.finalize();

      // 9. Supply Chain Events (for visual timeline)
      const supplyChainEvents = [
        ['EVT-01', 'HNY-TG-2026-0001', 'Smart Hive Harvest Registered', 'Beekeeper Ravi Kumar', 'Warangal Rural Apiary AP-TG-01', '2026-09-12 08:30:00 IST', 'Harvested 68.5 kg from HIVE-TG-017. Calibrated tare scale telemetry notarized.', 'Sig #TG-SCAL-8812', `0x${sha256('evt1')}`, 'VERIFIED'],
        ['EVT-02', 'HNY-TG-2026-0001', 'Extraction & Filtered', 'Warangal FPO Processing Unit', 'Warangal Cluster Enclave', '2026-09-12 14:15:00 IST', 'Centrifugal extraction at 38°C. Retained natural pollen grains.', 'Sensor Sig #TEMP-38C', `0x${sha256('evt2')}`, 'VERIFIED'],
        ['EVT-03', 'HNY-TG-2026-0001', 'ISO/IEC 17025 Quality Testing', 'Dr. Ananya Iyer', 'National Isotope Lab Hyderabad', '2026-09-13 11:20:00 IST', 'EA-IRMS confirmed pure botanical origin (δ13C = -26.8‰). HMF = 8.4 mg/kg.', 'Lab Digest #EA-IRMS-26.8', `0x${sha256('evt3')}`, 'VERIFIED'],
        ['EVT-04', 'HNY-TG-2026-0001', 'Automated Quality Approval', 'Smart Contract Sentinel', 'Hyperledger Consortial Node', '2026-09-13 16:45:00 IST', 'Rules passed. Quality certificate issued on-chain.', 'Contract 0x99aBEE42F5594', `0x${sha256('evt4')}`, 'VERIFIED'],
        ['EVT-05', 'HNY-TG-2026-0001', 'Micro-Lot Bottling & Tamper-Sealing', 'Bottling Operator K. Naresh', 'Warangal Packaging Line', '2026-09-14 09:10:00 IST', 'Divided into packaging lots. NFC & QR cryptographic tamper seal applied.', 'Lot PKG-TG-0001-A', `0x${sha256('evt5')}`, 'VERIFIED'],
        ['EVT-06', 'HNY-TG-2026-0001', 'Cold-Chain Transit to Distribution Hub', 'Driver R. Laxman', 'En Route to Hyderabad Hub', '2026-09-15 13:00:00 IST', 'Temperature monitored in transit (avg 21.4°C). Zero seal violations.', 'Transit Logger #TL-902', `0x${sha256('evt6')}`, 'VERIFIED'],
        ['EVT-07', 'HNY-TG-2026-0001', 'Retail Placement & Public Scan Ready', 'Store Manager P. Vani', 'Khadi Gramodyog Bhavan Hyderabad', '2026-09-16 10:00:00 IST', 'Available on shelf for verified consumer purchase and traceability scan.', 'Shelf Code #SHLF-TG-01', `0x${sha256('evt7')}`, 'VERIFIED']
      ];

      const scStmt = db.prepare(`
        INSERT INTO supply_chain_events (id, batchId, stage, actor, location, timestamp, details, sensorSignature, txHash, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const s of supplyChainEvents) scStmt.run(...s);
      scStmt.finalize();

      // 10. Early Warning Alerts (Requirement 15)
      const alerts = [
        ['ALT-TG-01', 'CL-TG-01', 'HIVE-TG-017', null, 'CRITICAL', 'Colony Stress & High Frequency Buzzing Detected', 'Acoustic sensor detected 340Hz roaring frequency (normal: 240Hz), comb temperature rose +2.1°C.', 'Inspect hive within 24 hours. Check for queen piping or pre-swarm congestion.', 'Ravi Kumar (Lead Beekeeper)', 'ACKNOWLEDGED'],
        ['ALT-TG-02', 'CL-TG-01', 'HIVE-TG-023', null, 'HIGH', 'Abnormal High Brood Nest Humidity (74.5%)', 'Prolonged high humidity detected in bottom board sensor; elevates fungal chalkbrood susceptibility.', 'Improve bottom hive ventilation and elevate hive stand 15cm from damp ground.', 'Field Officer T. Ramesh', 'ASSIGNED'],
        ['ALT-TG-03', 'CL-TG-02', 'HIVE-TG-031', null, 'MEDIUM', 'Abnormal Hive Weight Plateau Detected', 'Weight steady for 6 days with no nectar increment during peak flowering window.', 'Conduct field check on surrounding 3km foraging flora and assess pollen trap clogging.', 'Mohammad Farhan', 'PENDING'],
        ['ALT-REP-01', 'CL-TG-01', null, 'HNY-TG-2026-0001', 'WARNING', 'Potential QR Code Replication Detected', 'Simulated anomaly: Identical jar QR scanned in Warangal (10:00 AM) and Delhi (10:15 AM).', 'Trigger anti-counterfeit sentinel and alert retailer to verify holographic physical seal.', 'KVIC Security Compliance Cell', 'INVESTIGATING']
      ];

      const alertStmt = db.prepare(`
        INSERT INTO alerts (id, clusterId, hiveId, batchId, severity, title, whyReason, recommendedAction, assignedTo, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const a of alerts) alertStmt.run(...a);
      alertStmt.finalize();

      // 11. Consumer Scans (Requirement 23 for QR Cloning Simulation)
      const scans = [
        ['SCN-001', 'HNY-TG-2026-0001', 'Khadi Gramodyog Bhavan, Hyderabad', '49.205.12.84', '2026-09-17 14:30:12', 0, 'Legitimate initial consumer scan at verified retail store.'],
        ['SCN-002', 'HNY-TG-2026-0001', 'Warangal Retail Partner, Hanamkonda', '115.112.44.19', '2026-09-18 10:00:24', 0, 'Authorized inventory scan.'],
        ['SCN-003', 'HNY-TG-2026-0001', 'Chandni Chowk Market, New Delhi', '182.74.88.102', '2026-09-18 10:15:40', 1, 'FLAGGED ANOMALY: Scanned 1,450 km away in New Delhi 15 minutes after Warangal scan. Impossible physical transit speed. Potential counterfeit clone.']
      ];

      const scanStmt = db.prepare(`
        INSERT INTO consumer_scans (id, batchId, scanLocation, ipAddress, timestamp, isAnomaly, anomalyReason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const s of scans) scanStmt.run(...s);
      scanStmt.finalize();

      // 12. Marketplace Orders (Requirement 21)
      const orders = [
        ['ORD-2026-01', 'Aditi Mukherjee', 'Organic India Procurement Div', 'HNY-TG-2026-0001', 25.0, 750.0, 18750.0, 8437.5, 'VERIFIED_ACCEPTED'],
        ['ORD-2026-02', 'Vikas Singhal', 'FabIndia Naturals Sourcing', 'HC-2026-KSH-009102', 30.0, 1200.0, 36000.0, 16200.0, 'DISPATCH_IN_TRANSIT'],
        ['ORD-2026-03', 'Dr. Ramesh Iyer', 'Dabur Pure Bio-Botanical Cell', 'HNY-TG-2026-0002', 20.0, 820.0, 16400.0, 7380.0, 'REQUESTED']
      ];

      const orderStmt = db.prepare(`
        INSERT INTO marketplace_orders (id, buyerName, buyerOrg, batchId, quantityKg, offeredPricePerKgInr, totalAmountInr, producerRoyaltyInr, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const o of orders) orderStmt.run(...o);
      orderStmt.finalize();

      console.log('✅ SQLite Database successfully populated with 12 Clusters, 20 Beekeepers, 52 Hives, 30+ Batches, and complete blockchain hash chain.');
      resolve(true);
    });
  });
}
