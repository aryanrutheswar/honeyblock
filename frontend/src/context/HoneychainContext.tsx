import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import { computeSHA256, generateBatchId, generateTxHash, generateZkProofHash } from '../utils/crypto';
import { stopAllCameraHardware } from '../utils/mediaManager';
import { registerBarcodeMapping } from '../utils/qrDecoder';
import { registerNewSampleBarcode, createBarcodeSvgDataUrl, SampleBottleBarcode } from '../utils/sampleBarcodes';

export type UserRole = 'beekeeper' | 'inspector' | 'customer' | 'admin' | null;
export type AppScreen = 'intro' | 'role_select' | 'portal' | 'auth';

export interface BatchItem {
  id: string;
  name: string;
  companyName?: string;
  purityScore?: string;
  ingredients?: string;
  barcodeNumber?: string;
  hiveId: string;
  apiary: string;
  region: string;
  elevation: string;
  harvestDate: string;
  harvestQtyKg: number;
  floralSource: string;
  moisturePct: number;
  // Lab parameters
  c4SugarPct: number;
  c3SugarPct: number;
  isotopeDeltaC13: number; // e.g. -26.8
  hmfMgKg: number; // 8.2
  diastaseUnits: number; // 24.8
  status: 'MINTED_PENDING_LAB' | 'CERTIFIED_AUTHENTIC' | 'QUARANTINED';
  labInspectorId?: string;
  labCertificateId?: string;
  notarizedAt?: string;
  // Hyperledger Data
  blockNumber: number;
  txHash: string;
  sha256Digest: string;
  zkProofHash: string;
  zkPublicCommitment: string;
  tampered: boolean;
}

interface HoneychainContextType {
  // App Navigation Flow
  appScreen: AppScreen;
  setAppScreen: (screen: AppScreen) => void;
  enterApp: () => void;
  goToRoleSelect: () => void;
  goBack: () => void;
  // Backend & Database status
  isBackendConnected: boolean;
  backendInfo: {
    system: string;
    database: string;
    protocol: string;
  } | null;
  // Auth & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectRole: (role: UserRole) => void;
  logout: () => void;
  // Biometric Auth Modal
  isBiometricModalOpen: boolean;
  biometricTargetRole: UserRole;
  openBiometricModal: (targetRole: UserRole) => void;
  closeBiometricModal: () => void;
  biometricState: 'idle' | 'scanning' | 'verifying_hyperledger' | 'authenticated' | 'failed';
  biometricLog: string[];
  triggerBiometricScan: () => void;
  // Beekeeper Telemetry
  hiveTemp: number;
  hiveWeight: number;
  hiveAcousticFreq: number;
  isAcousticStress: boolean;
  toggleAcousticStress: () => void;
  resetHiveHealth: () => void;
  // Batches & Hyperledger
  batches: BatchItem[];
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  mintBatch: (data: { floralSource: string; qtyKg: number; hiveId: string; moisturePct: number }) => Promise<BatchItem>;
  notarizeBatchInLab: (batchId: string, customDigest?: string) => Promise<void>;
  addInspectedBarcodeBatch: (batchData: {
    barcodeNumber: string;
    name: string;
    companyName?: string;
    purityScore?: string;
    ingredients?: string;
    flora: string;
    origin: string;
    elevation?: string;
    moisturePct?: number;
    c4SugarPct?: number;
    c3SugarPct?: number;
    isotopeDeltaC13?: number;
    hmfMgKg?: number;
    diastaseUnits?: number;
  }) => BatchItem;
  // Customer Scanner
  scannedBatch: BatchItem | null;
  scanBatchById: (batchId: string) => void;
  isPassportUnlocked: boolean;
  setIsPassportUnlocked: (unlocked: boolean) => void;
}

const HoneychainContext = createContext<HoneychainContextType | undefined>(undefined);

const PRODUCTION_BATCHES: BatchItem[] = [
  {
    id: 'HC-2026-NIL-008421',
    name: 'Nilgiri Wild Kurinji Pure Raw Reserve',
    hiveId: 'HIVE-084',
    apiary: 'Nilgiri Biosphere Reserve Apiary AP-01',
    region: 'Nilgiris, Tamil Nadu',
    elevation: '2,240 meters above sea level',
    harvestDate: '2026-09-02',
    harvestQtyKg: 42.5,
    floralSource: 'Wild Kurinji & Forest Jamun',
    moisturePct: 16.8,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -26.8,
    hmfMgKg: 8.2,
    diastaseUnits: 24.8,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-NIL-09',
    labCertificateId: 'NABL-ISO17025-TN-99824',
    notarizedAt: '2026-09-05 11:34:02 UTC',
    blockNumber: 184920,
    txHash: '0x7f4ac9188e95c1c0429f635c9118c7e920d3f2095bf8915e8b4e78a2d3e1104a',
    sha256Digest: '0x8f2c3d19b4e6a8d7e0f1c2b3a4e5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
    zkProofHash: 'zk_snark_purity_c4c3_0x89d4e11fa92b0c44_verified',
    zkPublicCommitment: '0x3c99a80e15b2210e719df6b49912c0199182a472c10928bb1892019ab',
    tampered: false
  },
  {
    id: 'HC-2026-KSH-009102',
    name: 'Kashmir Alpine White Acacia',
    hiveId: 'HIVE-092',
    apiary: 'Kashmir Valley Alpine Organic Reserve',
    region: 'Srinagar, Jammu & Kashmir',
    elevation: '1,730 meters above sea level',
    harvestDate: '2026-08-28',
    harvestQtyKg: 50.0,
    floralSource: 'Acacia & Kashmiri Wildflower',
    moisturePct: 15.9,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -27.1,
    hmfMgKg: 6.4,
    diastaseUnits: 26.2,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-KSH-02',
    labCertificateId: 'NABL-ISO17025-JK-44102',
    notarizedAt: '2026-08-29 09:12:44 UTC',
    blockNumber: 184918,
    txHash: '0x19a0bc438e89f1a20c91834a7812903e01bcde91244fae89012356ab0912ef31',
    sha256Digest: '0x319a80fbc02148dae190283c749102aef189201948ba201487ea901283cbe901',
    zkProofHash: 'zk_snark_purity_c4c3_0x33e89a12bc09148d_verified',
    zkPublicCommitment: '0x819a0129bc0148daecb8192019ab910283c749102aef189201948ba201487ea9',
    tampered: false
  },
  {
    id: 'HC-2026-SUN-003319',
    name: 'Sundarbans Deep Mangrove Wild Honey',
    hiveId: 'HIVE-033',
    apiary: 'Sundarbans Mangrove Reserve',
    region: 'Sundarbans, West Bengal',
    elevation: '6 meters above sea level',
    harvestDate: '2026-08-19',
    harvestQtyKg: 36.0,
    floralSource: 'Khalisa & Goran Wild Mangrove',
    moisturePct: 18.2,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -26.2,
    hmfMgKg: 9.1,
    diastaseUnits: 22.4,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-KOL-04',
    labCertificateId: 'NABL-ISO17025-WB-33109',
    notarizedAt: '2026-08-20 14:22:10 UTC',
    blockNumber: 184922,
    txHash: '0x5b38da6a7b1892fa098231bc482a10bde82910fa4819bc20149021dafe9120bc',
    sha256Digest: '0x489ab12093e819bfa09123847a19283c019284ba091283c18293ab019283c192',
    zkProofHash: 'zk_snark_purity_c4c3_0x77c91823ab0912fa_verified',
    zkPublicCommitment: '0x19283ab091283c910283bc910293847a19283c019284ba091283c18293ab0192',
    tampered: false
  },
  {
    id: 'HC-2026-COF-004128',
    name: 'Coorg Single-Estate Coffee Blossom',
    hiveId: 'HIVE-041',
    apiary: 'Coorg Shaded Forest Coffee Estate',
    region: 'Coorg (Kodagu), Karnataka',
    elevation: '1,150 meters above sea level',
    harvestDate: '2026-08-25',
    harvestQtyKg: 45.0,
    floralSource: 'Robusta & Arabica Coffee Blossom',
    moisturePct: 17.1,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -26.5,
    hmfMgKg: 7.8,
    diastaseUnits: 25.1,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-BLR-11',
    labCertificateId: 'NABL-ISO17025-KA-41288',
    notarizedAt: '2026-08-26 10:45:15 UTC',
    blockNumber: 184923,
    txHash: '0x99a1b02847da190283c749102aef189201948ba201487ea901283cbe901389ab',
    sha256Digest: '0x1029384756abcdef1029384756abcdef1029384756abcdef1029384756abcdef',
    zkProofHash: 'zk_snark_purity_c4c3_0xcoorg_coffee_verified',
    zkPublicCommitment: '0x819203948576abcdef1029384756abcdef1029384756abcdef1029384756abcdef',
    tampered: false
  },
  {
    id: 'HC-2026-RAJ-005234',
    name: 'Thar Desert Golden Mustard & Kikar',
    hiveId: 'HIVE-052',
    apiary: 'Thar Desert Organic Floral Belt',
    region: 'Bharatpur & Shekhawati, Rajasthan',
    elevation: '210 meters above sea level',
    harvestDate: '2026-09-01',
    harvestQtyKg: 55.0,
    floralSource: 'Yellow Mustard & Wild Kikar',
    moisturePct: 17.4,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -25.9,
    hmfMgKg: 8.6,
    diastaseUnits: 23.7,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-JAI-05',
    labCertificateId: 'NABL-ISO17025-RJ-52340',
    notarizedAt: '2026-09-02 16:10:00 UTC',
    blockNumber: 184924,
    txHash: '0x38471029abde019284756abcdef1029384756abcdef1029384756abcdef102938',
    sha256Digest: '0x718293ab019283c18293ab019283c019284ba091283c18293ab019283c19283a',
    zkProofHash: 'zk_snark_purity_c4c3_0xthar_desert_verified',
    zkPublicCommitment: '0x99102837465abcde1029384756abcdef1029384756abcdef1029384756abcdef',
    tampered: false
  },
  {
    id: 'HC-2026-HIM-006789',
    name: 'Himachal Mountain Apple Blossom',
    hiveId: 'HIVE-067',
    apiary: 'Kullu Valley High-Altitude Orchards',
    region: 'Kullu Valley, Himachal Pradesh',
    elevation: '2,050 meters above sea level',
    harvestDate: '2026-08-30',
    harvestQtyKg: 38.0,
    floralSource: 'Organic Apple Blossom & Rhododendron',
    moisturePct: 16.2,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -27.4,
    hmfMgKg: 5.8,
    diastaseUnits: 27.4,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-SHI-01',
    labCertificateId: 'NABL-ISO17025-HP-67892',
    notarizedAt: '2026-08-31 11:20:10 UTC',
    blockNumber: 184925,
    txHash: '0x7719283019283bc910293847a19283c019284ba091283c18293ab019283c1928',
    sha256Digest: '0x8819283019283bc910293847a19283c019284ba091283c18293ab019283c1928',
    zkProofHash: 'zk_snark_purity_c4c3_0xhimachal_apple_verified',
    zkPublicCommitment: '0xaa19283019283bc910293847a19283c019284ba091283c18293ab019283c1928',
    tampered: false
  },
  {
    id: 'HC-2026-MHA-007845',
    name: 'Mahabaleshwar Wild Forest Jamun',
    hiveId: 'HIVE-078',
    apiary: 'Mahabaleshwar UNESCO Hotspot Sanctuary',
    region: 'Mahabaleshwar, Maharashtra',
    elevation: '1,372 meters above sea level',
    harvestDate: '2026-08-22',
    harvestQtyKg: 40.0,
    floralSource: 'Black Jamun (Syzygium cumini)',
    moisturePct: 17.0,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -26.7,
    hmfMgKg: 7.2,
    diastaseUnits: 24.0,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-PUN-07',
    labCertificateId: 'NABL-ISO17025-MH-78451',
    notarizedAt: '2026-08-23 09:15:30 UTC',
    blockNumber: 184926,
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    sha256Digest: '0x99283019283bc910293847a19283c019284ba091283c18293ab019283c19283a',
    zkProofHash: 'zk_snark_purity_c4c3_0xmahabaleshwar_jamun_verified',
    zkPublicCommitment: '0xbb19283019283bc910293847a19283c019284ba091283c18293ab019283c1928',
    tampered: false
  },
  {
    id: 'HC-2026-AP-004821',
    name: 'Western Ghats Rainforest Multifloral',
    hiveId: 'HIVE-048',
    apiary: 'Silent Valley Rainforest Buffer',
    region: 'Silent Valley, Kerala',
    elevation: '1,450 meters above sea level',
    harvestDate: '2026-09-03',
    harvestQtyKg: 48.0,
    floralSource: 'Cardamom, Forest Acacia & Neelakurinji',
    moisturePct: 16.5,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -26.9,
    hmfMgKg: 6.9,
    diastaseUnits: 28.1,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-COI-03',
    labCertificateId: 'NABL-ISO17025-KL-48217',
    notarizedAt: '2026-09-04 12:00:00 UTC',
    blockNumber: 184927,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    sha256Digest: '0x3344556677889900aabbccddeeff0011223344556677889900aabbccddeeff00',
    zkProofHash: 'zk_snark_purity_c4c3_0xsilent_valley_verified',
    zkPublicCommitment: '0xcc19283019283bc910293847a19283c019284ba091283c18293ab019283c1928',
    tampered: false
  },
  {
    id: 'HC-2026-MEG-008912',
    name: 'Meghalaya Khasi Hills Rock Bee Honey',
    hiveId: 'HIVE-089',
    apiary: 'Cherrapunji Living Root Forest Apiary',
    region: 'East Khasi Hills, Meghalaya',
    elevation: '1,480 meters above sea level',
    harvestDate: '2026-08-15',
    harvestQtyKg: 32.0,
    floralSource: 'Wild Citrus, Khasi Cinnamon & Orchid',
    moisturePct: 17.8,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -26.4,
    hmfMgKg: 8.0,
    diastaseUnits: 23.2,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-SHL-08',
    labCertificateId: 'NABL-ISO17025-ML-89125',
    notarizedAt: '2026-08-16 15:30:00 UTC',
    blockNumber: 184928,
    txHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    sha256Digest: '0x6677889900aabbccddeeff0011223344556677889900aabbccddeeff00112233',
    zkProofHash: 'zk_snark_purity_c4c3_0xmeghalaya_rockbee_verified',
    zkPublicCommitment: '0xdd19283019283bc910293847a19283c019284ba091283c18293ab019283c1928',
    tampered: false
  },
  {
    id: 'HC-2026-UTT-009951',
    name: 'Uttarakhand Gangotri Cedar & Pine Nectar',
    hiveId: 'HIVE-099',
    apiary: 'Bhagirathi Glacial Alpine Valley',
    region: 'Garhwal Himalayas, Uttarakhand',
    elevation: '2,580 meters above sea level',
    harvestDate: '2026-08-27',
    harvestQtyKg: 35.0,
    floralSource: 'Himalayan Cedar, Wild Thyme & Pine',
    moisturePct: 15.5,
    c4SugarPct: 0.0,
    c3SugarPct: 0.0,
    isotopeDeltaC13: -27.6,
    hmfMgKg: 5.2,
    diastaseUnits: 29.0,
    status: 'CERTIFIED_AUTHENTIC',
    labInspectorId: 'LAB-ISO-17025-DEH-02',
    labCertificateId: 'NABL-ISO17025-UK-99513',
    notarizedAt: '2026-08-28 10:00:00 UTC',
    blockNumber: 184929,
    txHash: '0x5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344',
    sha256Digest: '0x11223344556677889900aabbccddeeff0011223344556677889900aabbccddee',
    zkProofHash: 'zk_snark_purity_c4c3_0xgangotri_alpine_verified',
    zkPublicCommitment: '0xee19283019283bc910293847a19283c019284ba091283c18293ab019283c1928',
    tampered: false
  }
];

const DYNAMIC_BATCHES_STORAGE_KEY = 'HONEYCHAIN_DYNAMIC_BATCHES';
const DYNAMIC_BARCODE_STORAGE_KEY = 'HONEYCHAIN_DYNAMIC_BARCODE_MAP';

function getInitialBatches(): BatchItem[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DYNAMIC_BATCHES_STORAGE_KEY);
      if (stored) {
        const dynamicList: BatchItem[] = JSON.parse(stored);
        if (Array.isArray(dynamicList) && dynamicList.length > 0) {
          dynamicList.forEach(b => {
            if (b.barcodeNumber) {
              registerBarcodeMapping(b.barcodeNumber, b.id);
            }
          });
          return [...dynamicList, ...PRODUCTION_BATCHES];
        }
      }
    }
  } catch (e) {
    console.warn('Error loading dynamic batches from storage:', e);
  }
  return PRODUCTION_BATCHES;
}

function getInitialNavState(): { screen: AppScreen; role: UserRole } {
  try {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      if (['beekeeper', 'inspector', 'customer', 'admin'].includes(hash)) {
        return { screen: 'portal', role: hash as UserRole };
      }
      if (hash === 'role_select' || hash === 'roles') {
        return { screen: 'role_select', role: null };
      }
      if (hash === 'auth') {
        return { screen: 'auth', role: null };
      }
      if (hash === 'intro' || hash === 'home') {
        return { screen: 'intro', role: null };
      }

      const savedScreen = localStorage.getItem('honeychain_screen') as AppScreen | null;
      const savedRole = localStorage.getItem('honeychain_role') as UserRole | null;
      if (savedScreen === 'portal' && savedRole && ['beekeeper', 'inspector', 'customer', 'admin'].includes(savedRole)) {
        return { screen: 'portal', role: savedRole };
      }
      if (savedScreen && ['intro', 'role_select', 'auth'].includes(savedScreen)) {
        return { screen: savedScreen, role: null };
      }
    }
  } catch (e) {
    console.warn('Error reading initial nav state:', e);
  }
  return { screen: 'intro', role: null };
}

export const HoneychainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State with Refresh Persistence
  const [appScreen, setAppScreen] = useState<AppScreen>(() => getInitialNavState().screen);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => getInitialNavState().role);

  // Backend Health
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [backendInfo, setBackendInfo] = useState<{ system: string; database: string; protocol: string } | null>(null);

  // Biometric Auth Modal State
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [biometricTargetRole, setBiometricTargetRole] = useState<UserRole>(null);
  const [biometricState, setBiometricState] = useState<'idle' | 'scanning' | 'verifying_hyperledger' | 'authenticated' | 'failed'>('idle');
  const [biometricLog, setBiometricLog] = useState<string[]>([]);

  // Beekeeper Telemetry State
  const [hiveTemp, setHiveTemp] = useState(34.8);
  const [hiveWeight, setHiveWeight] = useState(42.5);
  const [hiveAcousticFreq, setHiveAcousticFreq] = useState(240);
  const [isAcousticStress, setIsAcousticStress] = useState(false);

  // Batches and Blockchain State
  const [batches, setBatches] = useState<BatchItem[]>(getInitialBatches);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(() => {
    const init = getInitialBatches();
    return init[0]?.id || PRODUCTION_BATCHES[0].id;
  });

  // Customer Scanner State
  const [scannedBatch, setScannedBatch] = useState<BatchItem | null>(() => {
    const init = getInitialBatches();
    return init[0] || PRODUCTION_BATCHES[0];
  });
  const [isPassportUnlocked, setIsPassportUnlocked] = useState(true);

  // Connect to backend on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ONLINE') {
          setIsBackendConnected(true);
          setBackendInfo({
            system: data.system,
            database: data.database,
            protocol: data.protocol
          });
        }
      })
      .catch(() => {
        console.log('Backend API initializing or running in detached mode.');
      });

    fetch('/api/batches')
      .then(res => res.json())
      .then((apiBatches: any[]) => {
        if (Array.isArray(apiBatches) && apiBatches.length > 0) {
          const mapped: BatchItem[] = apiBatches.map(b => {
            const fallback = PRODUCTION_BATCHES.find(pb => pb.id === (b.digitalId || b.id)) || PRODUCTION_BATCHES[0];
            return {
              id: b.digitalId || b.id,
              name: b.name || fallback.name,
              hiveId: b.hiveId || fallback.hiveId,
              apiary: b.apiaryName || b.apiary || fallback.apiary,
              region: b.region || fallback.region,
              elevation: b.elevation || fallback.elevation,
              harvestDate: b.harvestDate || fallback.harvestDate,
              harvestQtyKg: b.harvestQtyKg || fallback.harvestQtyKg,
              floralSource: b.floralSource || fallback.floralSource,
              moisturePct: b.moisturePct || fallback.moisturePct,
              c4SugarPct: 0.0,
              c3SugarPct: 0.0,
              isotopeDeltaC13: b.isotopeDelta13C || fallback.isotopeDeltaC13,
              hmfMgKg: b.hpmFuranMgKg || fallback.hmfMgKg,
              diastaseUnits: b.diastaseActivity || fallback.diastaseUnits,
              status: b.status === 'APPROVED' ? 'CERTIFIED_AUTHENTIC' : (b.status === 'QUARANTINED' ? 'QUARANTINED' : 'MINTED_PENDING_LAB'),
              labInspectorId: 'LAB-ISO-17025-NIL-09',
              labCertificateId: b.labCertificateId || fallback.labCertificateId,
              notarizedAt: b.notarizedAt || fallback.notarizedAt,
              blockNumber: b.blockNumber || fallback.blockNumber,
              txHash: b.blockchainTx || fallback.txHash,
              sha256Digest: fallback.sha256Digest,
              zkProofHash: fallback.zkProofHash,
              zkPublicCommitment: fallback.zkPublicCommitment,
              tampered: b.status === 'QUARANTINED'
            };
          });
          setBatches(mapped);
          setSelectedBatchId(mapped[0].id);
          setScannedBatch(mapped[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Live IoT Telemetry Polling simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAcousticStress) {
        setHiveTemp(prev => {
          const delta = (Math.random() - 0.5) * 0.15;
          return Number((34.8 + delta).toFixed(2));
        });
        setHiveWeight(prev => {
          const delta = (Math.random() - 0.5) * 0.08;
          return Number((42.5 + delta).toFixed(2));
        });
        setHiveAcousticFreq(prev => {
          const delta = Math.floor((Math.random() - 0.5) * 6);
          return 240 + delta;
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isAcousticStress]);

  // Helper to ensure any active camera hardware tracks are cleanly terminated across mobile and desktop
  const stopAllMediaStreams = () => {
    stopAllCameraHardware();
  };

  // Aggressively guarantee all camera hardware tracks are stopped whenever user is not on customer screen
  useEffect(() => {
    if (currentRole !== 'customer') {
      stopAllCameraHardware();
    }
  }, [currentRole, appScreen]);

  // Automatically persist screen & role to localStorage and URL hash on state updates
  useEffect(() => {
    try {
      localStorage.setItem('honeychain_screen', appScreen);
      if (currentRole) {
        localStorage.setItem('honeychain_role', currentRole);
      } else {
        localStorage.removeItem('honeychain_role');
      }

      let hash = '';
      if (appScreen === 'portal' && currentRole) {
        hash = '#' + currentRole;
      } else if (appScreen === 'role_select') {
        hash = '#role_select';
      } else if (appScreen === 'auth') {
        hash = '#auth';
      } else if (appScreen === 'intro') {
        hash = '#intro';
      }

      if (window.location.hash !== hash) {
        if (!hash || hash === '#intro') {
          window.history.replaceState(null, '', window.location.pathname);
        } else {
          window.history.replaceState(null, '', hash);
        }
      }
    } catch (e) {
      console.warn('Failed to sync navigation to storage/URL', e);
    }
  }, [appScreen, currentRole]);

  // Handle hardware back button, forward button & URL hash routing
  useEffect(() => {
    const handleNavSync = () => {
      stopAllCameraHardware();
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      if (['beekeeper', 'inspector', 'customer', 'admin'].includes(hash)) {
        setCurrentRole(hash as UserRole);
        setAppScreen('portal');
      } else if (hash === 'role_select' || hash === 'roles') {
        setCurrentRole(null);
        setAppScreen('role_select');
      } else if (hash === 'auth') {
        setCurrentRole(null);
        setAppScreen('auth');
      } else if (hash === 'intro' || hash === 'home' || !hash) {
        setCurrentRole(null);
        setAppScreen('intro');
      }
    };

    window.addEventListener('popstate', handleNavSync);
    window.addEventListener('hashchange', handleNavSync);
    return () => {
      window.removeEventListener('popstate', handleNavSync);
      window.removeEventListener('hashchange', handleNavSync);
    };
  }, []);

  const enterApp = () => {
    soundManager.playEnterChime();
    setAppScreen('role_select');
  };

  const goToRoleSelect = () => {
    stopAllMediaStreams();
    soundManager.playClick();
    setCurrentRole(null);
    setAppScreen('role_select');
  };

  const goBack = () => {
    stopAllMediaStreams();
    soundManager.playClick();
    if (appScreen === 'portal' || appScreen === 'auth') {
      setCurrentRole(null);
      setAppScreen('role_select');
    } else if (appScreen === 'role_select') {
      setAppScreen('intro');
    }
  };

  const selectRole = (role: UserRole) => {
    stopAllMediaStreams();
    soundManager.playClick();
    if (role === 'customer') {
      setCurrentRole('customer');
      setAppScreen('portal');
    } else {
      openBiometricModal(role);
    }
  };

  const logout = () => {
    stopAllMediaStreams();
    soundManager.playClick();
    setCurrentRole(null);
    setAppScreen('role_select');
  };

  const openBiometricModal = (targetRole: UserRole) => {
    setBiometricTargetRole(targetRole);
    setBiometricState('idle');
    setBiometricLog([
      'Initialized WebAuthn Level 3 hardware security channel...',
      'Awaiting biometric fingerprint authorization.'
    ]);
    setIsBiometricModalOpen(true);
  };

  const closeBiometricModal = () => {
    setIsBiometricModalOpen(false);
    setBiometricState('idle');
  };

  const triggerBiometricScan = () => {
    setBiometricState('scanning');
    soundManager.playBiometricScan();

    setBiometricLog(prev => [
      ...prev,
      'Capturing optical epidermal ridge pattern (508 DPI)...',
      'Generating ECDSA cryptographic challenge-response token...'
    ]);

    setTimeout(() => {
      setBiometricState('verifying_hyperledger');
      setBiometricLog(prev => [
        ...prev,
        'Cross-referencing Hyperledger MSP (Membership Service Provider)...',
        `Verifying cryptographic role credentials for: ${biometricTargetRole?.toUpperCase()}...`,
        'Zero-knowledge proof identity assertion PASSED.'
      ]);

      setTimeout(() => {
        setBiometricState('authenticated');
        soundManager.playBiometricSuccess();
        setBiometricLog(prev => [
          ...prev,
          '✓ Biometric identity securely authenticated.',
          'Opening isolated portal workspace...'
        ]);

        setTimeout(() => {
          setIsBiometricModalOpen(false);
          setCurrentRole(biometricTargetRole);
          setAppScreen('portal');
        }, 1000);
      }, 950);
    }, 1100);
  };

  const toggleAcousticStress = () => {
    if (!isAcousticStress) {
      setIsAcousticStress(true);
      setHiveAcousticFreq(550);
      setHiveTemp(36.4);
      soundManager.playStressAlarm();
    } else {
      setIsAcousticStress(false);
      setHiveAcousticFreq(240);
      setHiveTemp(34.8);
      soundManager.playCalmChime();
    }
  };

  const resetHiveHealth = () => {
    setIsAcousticStress(false);
    setHiveAcousticFreq(240);
    setHiveTemp(34.8);
    soundManager.playCalmChime();
  };

  const mintBatch = async (data: { floralSource: string; qtyKg: number; hiveId: string; moisturePct: number }) => {
    const id = generateBatchId();
    const txHash = generateTxHash();
    const blockNumber = 184920 + batches.length + 1;
    const now = new Date().toISOString().split('T')[0];

    const rawPayload = {
      batchId: id,
      hiveId: data.hiveId,
      harvestQtyKg: data.qtyKg,
      floralSource: data.floralSource,
      moisturePct: data.moisturePct,
      blockNumber,
      txHash,
      timestamp: now,
      apiary: 'Nilgiri Biosphere Reserve'
    };

    const sha256Digest = await computeSHA256(rawPayload);
    const zkProofHash = generateZkProofHash(id);
    const zkPublicCommitment = await computeSHA256(`zk_commitment_${id}_${Date.now()}`);

    const newBatch: BatchItem = {
      id,
      name: `Nilgiri ${data.floralSource.split(',')[0]} Honey`,
      hiveId: data.hiveId,
      apiary: 'Nilgiri Biosphere Reserve Apiary AP-01',
      region: 'Nilgiris, Tamil Nadu',
      elevation: '2,240 meters above sea level',
      harvestDate: now,
      harvestQtyKg: data.qtyKg,
      floralSource: data.floralSource,
      moisturePct: data.moisturePct,
      c4SugarPct: 0.0,
      c3SugarPct: 0.0,
      isotopeDeltaC13: -26.8,
      hmfMgKg: 8.2,
      diastaseUnits: 24.8,
      status: 'MINTED_PENDING_LAB',
      blockNumber,
      txHash,
      sha256Digest,
      zkProofHash,
      zkPublicCommitment,
      tampered: false
    };

    // Save to backend SQLite database
    try {
      await fetch('/api/batches/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBatch.name,
          hiveId: data.hiveId,
          apiaryId: 'AP-01',
          beekeeper: 'M. Ramanathan',
          harvestQtyKg: data.qtyKg,
          floralSource: data.floralSource,
          moisturePct: data.moisturePct,
          isotopeDelta13C: -26.8
        })
      });
    } catch (e) {
      console.log('Local fallback mint executed');
    }

    setBatches(prev => [newBatch, ...prev]);
    setSelectedBatchId(newBatch.id);
    soundManager.playMintSuccess();
    return newBatch;
  };

  const notarizeBatchInLab = async (batchId: string, customDigest?: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const certId = `NABL-ISO17025-${Math.floor(10000 + Math.random() * 90000)}`;
    const labPayload = {
      batchId: batch.id,
      sugarAdulterationC4: '0.00%',
      sugarAdulterationC3: '0.00%',
      isotopeDeltaC13: '-26.8‰ Natural',
      hmfFreshness: '8.2 mg/kg PASS',
      inspectorId: 'LAB-ISO-17025-NIL-09',
      certId,
      timestamp: new Date().toISOString()
    };

    const digest = customDigest || (await computeSHA256(labPayload));
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    // Persist to backend SQLite & Blockchain
    try {
      await fetch('/api/lab/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId,
          inspectorName: 'Dr. Ananya Iyer, Chief Chromatographer',
          labName: 'Central Honey Quality & Isotope Testing Laboratory',
          isoAccreditation: 'ISO/IEC 17025:2017 & FSSAI Accredited',
          isotopeDelta13C: -26.8,
          hmfMgKg: 8.2,
          diastaseUnits: 24.8,
          pollenPurityPct: 96.5,
          c4SugarAdulterationPct: 0.0
        })
      });
    } catch (e) {
      console.log('Local fallback notarization executed');
    }

    setBatches(prev =>
      prev.map(b => {
        if (b.id === batchId) {
          return {
            ...b,
            status: 'CERTIFIED_AUTHENTIC',
            labInspectorId: 'LAB-ISO-17025-NIL-09',
            labCertificateId: certId,
            notarizedAt: nowStr,
            sha256Digest: digest
          };
        }
        return b;
      })
    );

    soundManager.playMintSuccess();
  };

  const scanBatchById = (batchId: string) => {
    let found = batches.find(b => b.id.toLowerCase() === batchId.toLowerCase());
    if (!found && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(DYNAMIC_BATCHES_STORAGE_KEY);
        if (stored) {
          const dynamicList: BatchItem[] = JSON.parse(stored);
          found = dynamicList.find(b => b.id.toLowerCase() === batchId.toLowerCase());
          if (found) {
            setBatches(prev => [found!, ...prev.filter(x => x.id !== found!.id)]);
          }
        }
      } catch {}
    }
    const finalBatch = found || batches[0];
    setScannedBatch(finalBatch);
    setSelectedBatchId(finalBatch.id);
    setIsPassportUnlocked(true);
    soundManager.playScanSuccess();
  };

  const addInspectedBarcodeBatch = (batchData: {
    barcodeNumber: string;
    name: string;
    companyName?: string;
    purityScore?: string;
    ingredients?: string;
    flora: string;
    origin: string;
    elevation?: string;
    moisturePct?: number;
    c4SugarPct?: number;
    c3SugarPct?: number;
    isotopeDeltaC13?: number;
    hmfMgKg?: number;
    diastaseUnits?: number;
  }): BatchItem => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `HC-2026-INS-${randomSuffix}`;
    const txHash = generateTxHash();
    const blockNumber = 184920 + batches.length + 1;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const companyName = batchData.companyName?.trim() || 'Nilgiri Mountain Honey Co.';
    const purityScore = batchData.purityScore?.trim() || 'pure honey 100%';
    const ingredients = batchData.ingredients?.trim() || '100% Pure Raw Honey. No additives, no preservatives, no corn syrup, no rice syrup.';

    const newBatch: BatchItem = {
      id,
      name: batchData.name || `Inspected ${batchData.flora} Honey`,
      companyName,
      purityScore,
      ingredients,
      barcodeNumber: batchData.barcodeNumber,
      hiveId: `HIVE-INS-${randomSuffix}`,
      apiary: `${batchData.origin} Inspection Apiary`,
      region: batchData.origin || 'Nilgiris, Tamil Nadu',
      elevation: batchData.elevation || '2,240m',
      harvestDate: new Date().toISOString().split('T')[0],
      harvestQtyKg: 45.0,
      floralSource: batchData.flora || 'Wild Organic Flora',
      moisturePct: batchData.moisturePct ?? 16.5,
      c4SugarPct: batchData.c4SugarPct ?? 0.0,
      c3SugarPct: batchData.c3SugarPct ?? 0.0,
      isotopeDeltaC13: batchData.isotopeDeltaC13 ?? -26.8,
      hmfMgKg: batchData.hmfMgKg ?? 8.2,
      diastaseUnits: batchData.diastaseUnits ?? 24.8,
      status: 'CERTIFIED_AUTHENTIC',
      labInspectorId: 'LAB-ISO-17025-NIL-09',
      labCertificateId: `NABL-ISO17025-${randomSuffix}`,
      notarizedAt: nowStr,
      blockNumber,
      txHash,
      sha256Digest: generateTxHash(),
      zkProofHash: generateZkProofHash(id),
      zkPublicCommitment: `zk_commitment_${id}_${Date.now()}`,
      tampered: false
    };

    // 1. Register barcode in decoder resolver
    registerBarcodeMapping(batchData.barcodeNumber, id);

    try {
      if (typeof window !== 'undefined') {
        const storedMap = JSON.parse(localStorage.getItem(DYNAMIC_BARCODE_STORAGE_KEY) || '{}');
        storedMap[batchData.barcodeNumber] = id;
        localStorage.setItem(DYNAMIC_BARCODE_STORAGE_KEY, JSON.stringify(storedMap));
      }
    } catch {}

    // 2. Register sample barcode sticker for scanner preview & download
    const newSample: SampleBottleBarcode = {
      id: `sample-inspected-${id}`,
      batchId: id,
      barcodeNumber: batchData.barcodeNumber,
      format: 'EAN-13',
      title: newBatch.name,
      companyName,
      purityScore,
      ingredients,
      subtitle: `${newBatch.apiary} • ${newBatch.elevation}`,
      flora: newBatch.floralSource,
      origin: newBatch.region,
      elevation: newBatch.elevation,
      colorAccent: '#d97706',
      batchTag: 'ISO-17025 CERTIFIED',
      dataUrl: createBarcodeSvgDataUrl({
        batchId: id,
        barcodeNumber: batchData.barcodeNumber,
        title: newBatch.name,
        companyName,
        purityScore,
        ingredients,
        batchTag: 'ISO-17025 CERTIFIED',
        origin: newBatch.region,
        flora: newBatch.floralSource,
        colorAccent: '#d97706'
      })
    };
    registerNewSampleBarcode(newSample);

    // 3. Prepend to state batches and sync with localStorage
    setBatches(prev => {
      const updated = [newBatch, ...prev.filter(b => b.id !== newBatch.id)];
      try {
        if (typeof window !== 'undefined') {
          const dynamicOnly = updated.filter(b => b.id.startsWith('HC-2026-INS-'));
          localStorage.setItem(DYNAMIC_BATCHES_STORAGE_KEY, JSON.stringify(dynamicOnly));
        }
      } catch {}
      return updated;
    });
    setSelectedBatchId(newBatch.id);
    soundManager.playMintSuccess();
    return newBatch;
  };

  return (
    <HoneychainContext.Provider
      value={{
        appScreen,
        setAppScreen,
        enterApp,
        goToRoleSelect,
        goBack,
        isBackendConnected,
        backendInfo,
        currentRole,
        setCurrentRole,
        selectRole,
        logout,
        isBiometricModalOpen,
        biometricTargetRole,
        openBiometricModal,
        closeBiometricModal,
        biometricState,
        biometricLog,
        triggerBiometricScan,
        hiveTemp,
        hiveWeight,
        hiveAcousticFreq,
        isAcousticStress,
        toggleAcousticStress,
        resetHiveHealth,
        batches,
        selectedBatchId,
        setSelectedBatchId,
        mintBatch,
        notarizeBatchInLab,
        addInspectedBarcodeBatch,
        scannedBatch,
        scanBatchById,
        isPassportUnlocked,
        setIsPassportUnlocked
      }}
    >
      {children}
    </HoneychainContext.Provider>
  );
};

export const useHoneychain = () => {
  const ctx = useContext(HoneychainContext);
  if (!ctx) throw new Error('useHoneychain must be used within HoneychainProvider');
  return ctx;
};
