/**
 * 10 Unique Honey Bottle Barcodes & Smart Labels for testing the scanner.
 * Includes mathematically compliant EAN-13 barcodes with distinct botanical flora,
 * geographic origins, and cryptographic smart seal designs.
 */

export interface SampleBottleBarcode {
  id: string;
  batchId: string;
  barcodeNumber: string;
  format: 'EAN-13' | 'CODE-128' | 'QR-CODE';
  title: string;
  subtitle: string;
  flora: string;
  origin: string;
  elevation: string;
  colorAccent: string;
  batchTag: string;
  purityScore: string;
  companyName?: string;
  ingredients?: string;
  dataUrl: string;
}

// EAN-13 Encoding Specifications (95 modules total)
const L_PATTERNS = [
  '0001101', '0011001', '0010011', '0111101', '0100011',
  '0110001', '0101111', '0111011', '0110111', '0001011'
];
const G_PATTERNS = [
  '0100111', '0110011', '0011011', '0100001', '0011101',
  '0111001', '0000101', '0010001', '0001001', '0010111'
];
const R_PATTERNS = [
  '1110010', '1100110', '1101100', '1000010', '1011100',
  '1001110', '1010000', '1000100', '1001000', '1110100'
];
const FIRST_DIGIT_PARITY = [
  'LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG',
  'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'
];

/**
 * Computes standard GS1 EAN-13 Modulo-10 check digit for a 12-digit string.
 */
export function computeEan13Checksum(first12: string): number {
  const digits = first12.replace(/\D/g, '').padEnd(12, '0').slice(0, 12);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const d = parseInt(digits[i], 10) || 0;
    sum += (i % 2 === 0) ? d : d * 3;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

/**
 * Derives a valid 13-digit EAN-13 barcode number from any HoneyChain Batch ID.
 * Standard format: 890 (GS1 India) + 1030 (HoneyChain) + 5 digits batch suffix + Mod-10 Checksum.
 */
export function getEan13FromBatchId(batchId: string): string {
  const digits = batchId.replace(/\D/g, '');
  const suffix = (digits.slice(-5) || '08821').padStart(5, '0');
  const first12 = `8901030${suffix}`;
  const checksum = computeEan13Checksum(first12);
  return `${first12}${checksum}`;
}

/**
 * Encodes a 13-digit barcode string into a 95-bit array of module widths.
 */
export function encodeEan13Bits(code: string): string {
  const digits = code.replace(/\D/g, '').padEnd(13, '0').slice(0, 13);
  const first = parseInt(digits[0], 10) || 0;
  const parity = FIRST_DIGIT_PARITY[first] || 'LLLLLL';

  let bits = '101'; // Left Guard Bar

  // Digits 2 to 7 (Left Hand)
  for (let i = 0; i < 6; i++) {
    const digit = parseInt(digits[i + 1], 10);
    bits += parity[i] === 'L' ? L_PATTERNS[digit] : G_PATTERNS[digit];
  }

  bits += '01010'; // Center Guard Bar

  // Digits 8 to 13 (Right Hand)
  for (let i = 7; i < 13; i++) {
    const digit = parseInt(digits[i], 10);
    bits += R_PATTERNS[digit];
  }

  bits += '101'; // Right Guard Bar

  return bits;
}

function xmlEscape(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Function to generate raw SVG string for an authentic honey bottle barcode sticker
export function createBarcodeSvgString(params: {
  batchId: string;
  barcodeNumber: string;
  title: string;
  companyName?: string;
  purityScore?: string;
  ingredients?: string;
  batchTag?: string;
  origin: string;
  flora: string;
  colorAccent?: string;
}): string {
  const {
    batchId,
    barcodeNumber,
    title,
    companyName = 'Nilgiri Honey Producers Cooperative',
    purityScore = '100% Pure Natural Honey',
    ingredients = '100% Pure Raw Natural Honey, Wild Botanical Floral Nectar, Active Enzymes (Diastase), Natural Pollen. 0% Added Sugar.',
    batchTag = 'ISO-17025 CERTIFIED',
    origin,
    flora,
    colorAccent = '#d97706'
  } = params;

  const bits = encodeEan13Bits(barcodeNumber);
  const moduleWidth = 2.4;
  const startX = 42;
  const baseBarY = 152;
  const standardHeight = 52;
  const guardHeight = 60;

  // Build SVG bars
  const barRects: string[] = [];
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') {
      const isGuard = (i < 3) || (i >= 45 && i < 50) || (i >= 92);
      const h = isGuard ? guardHeight : standardHeight;
      const x = startX + (i * moduleWidth);
      barRects.push(`<rect x="${x.toFixed(1)}" y="${baseBarY}" width="${moduleWidth.toFixed(1)}" height="${h}" fill="#0f172a" />`);
    }
  }

  const digits = barcodeNumber.padEnd(13, '0').slice(0, 13);
  const firstDigit = digits[0];
  const leftGroup = digits.slice(1, 7);
  const rightGroup = digits.slice(7, 13);
  const safeId = barcodeNumber.replace(/[^a-zA-Z0-9]/g, '') || 'default';

  const safeCompany = xmlEscape(companyName.length > 38 ? companyName.substring(0, 36) + '...' : companyName);
  const safeTitle = xmlEscape(title.length > 36 ? title.substring(0, 34) + '...' : title);
  const safePurity = xmlEscape(purityScore.length > 24 ? purityScore.substring(0, 22) + '...' : purityScore);
  const safeIngredients = xmlEscape(ingredients.length > 56 ? ingredients.substring(0, 53) + '...' : ingredients);
  const safeOrigin = xmlEscape(origin);
  const safeFlora = xmlEscape(flora);
  const safeBatchTag = xmlEscape(batchTag);
  const safeBatchId = xmlEscape(batchId);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 286" width="100%" height="100%" style="max-width: 380px; height: auto; display: block; margin: 0 auto;">
  <defs>
    <linearGradient id="bgGrad_${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dbe8d5"/>
      <stop offset="100%" stop-color="#d1e2cb"/>
    </linearGradient>
    <filter id="shadow_${safeId}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.15"/>
    </filter>
  </defs>

  <metadata id="hc_meta" data-batch-id="${safeBatchId}" data-barcode="${barcodeNumber}" data-company="${safeCompany}" data-purity="${safePurity}" data-ingredients="${safeIngredients}"/>

  <!-- Card Body with Rounded Edges -->
  <rect x="8" y="8" width="364" height="270" rx="16" fill="url(#bgGrad_${safeId})" stroke="#8da981" stroke-width="2" filter="url(#shadow_${safeId})"/>

  <!-- Top Decorative Header Strip: Warm Honey Amber -->
  <rect x="8" y="8" width="364" height="40" rx="16" fill="#eab308"/>
  <rect x="8" y="32" width="364" height="16" fill="#eab308"/>
  
  <text x="22" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="900" fill="#183018" letter-spacing="0.8">HONEYCHAIN&#8482; SMART SEAL</text>
  <rect x="245" y="17" width="112" height="20" rx="10" fill="#183018"/>
  <text x="301" y="31" font-family="monospace" font-size="9" font-weight="bold" fill="#bdd2b3" text-anchor="middle">${safeBatchTag}</text>

  <!-- Bottle Company / Producer -->
  <text x="20" y="64" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="#a16207" letter-spacing="0.5">${safeCompany.toUpperCase()}</text>

  <!-- Honey Product Name -->
  <text x="20" y="81" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#183018">${safeTitle}</text>

  <!-- Purity Badge: Pistachio Accent & Biosphere Origin -->
  <rect x="20" y="89" width="138" height="18" rx="5" fill="#bdd2b3" stroke="#8da981" stroke-width="1"/>
  <text x="89" y="102" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8.5" font-weight="800" fill="#183018" text-anchor="middle">PURITY: ${safePurity}</text>
  <text x="166" y="102" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="600" fill="#2f482d">${safeOrigin} &#8226; ${safeFlora}</text>

  <!-- Ingredients Description -->
  <text x="20" y="122" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8.5" font-weight="600" fill="#2f482d">Ingredients: <tspan fill="#183018" font-weight="700">${safeIngredients}</tspan></text>

  <!-- Digital Batch ID -->
  <text x="20" y="139" font-family="monospace" font-size="9" font-weight="700" fill="#a16207">Digital Batch ID: <tspan fill="#183018">${safeBatchId}</tspan></text>

  <!-- Barcode Enclosure Panel: user requested Pistachio swatch #bdd2b3 -->
  <rect x="18" y="146" width="344" height="88" rx="8" fill="#bdd2b3" stroke="#8da981" stroke-width="1.5"/>

  <!-- EAN-13 Barcode Module Bars -->
  <g>
    ${barRects.join('\n    ')}
  </g>

  <!-- Digits Display (EAN-13 Human Readable Format) -->
  <text x="28" y="218" font-family="monospace" font-size="12" font-weight="bold" fill="#183018">${firstDigit}</text>
  <text x="96" y="218" font-family="monospace" font-size="12" font-weight="bold" fill="#183018" letter-spacing="3">${leftGroup}</text>
  <text x="204" y="218" font-family="monospace" font-size="12" font-weight="bold" fill="#183018" letter-spacing="3">${rightGroup}</text>

  <!-- Security Verified Badge / Check (Pistachio Accent) -->
  <g transform="translate(328, 154)">
    <circle cx="12" cy="12" r="11" fill="#8da981" fill-opacity="0.3" stroke="#527a50" stroke-width="1.5"/>
    <path d="M7 12 L10 15 L17 8" stroke="#183018" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Footer Verification Guarantee -->
  <text x="22" y="252" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="700" fill="#2f482d">100% PURE BOTANICAL &#8226; ISO/IEC 17025 TESTED &#8226; HYPERLEDGER SECURED</text>
  <text x="22" y="264" font-family="monospace" font-size="8" font-weight="600" fill="#3e623c">SCAN VIA CAMERA OR UPLOAD PIC TO UNLOCK PASSPORT</text>
</svg>`.trim();
}

// Function to generate an SVG data URL for an authentic honey bottle barcode sticker
export function createBarcodeSvgDataUrl(params: {
  batchId: string;
  barcodeNumber: string;
  title: string;
  companyName?: string;
  purityScore?: string;
  ingredients?: string;
  batchTag?: string;
  origin: string;
  flora: string;
  colorAccent?: string;
}): string {
  const svg = createBarcodeSvgString(params);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_BOTTLE_BARCODES: SampleBottleBarcode[] = [
  {
    id: 'sample-nilgiri-1',
    batchId: 'HC-2026-NIL-008421',
    barcodeNumber: '8901030884214',
    format: 'EAN-13',
    title: 'Nilgiri Wild Kurinji Pure Raw Reserve',
    subtitle: 'Nilgiri Biosphere AP-01 • 2,240m Elevation',
    flora: 'Wild Kurinji & Forest Jamun',
    origin: 'Nilgiris, Tamil Nadu',
    elevation: '2,240m',
    colorAccent: '#d97706',
    batchTag: '100% RAW',
    purityScore: '100% Pure (0.0% Fake Sugar)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-NIL-008421',
      barcodeNumber: '8901030884214',
      title: 'Nilgiri Wild Kurinji Pure Raw Reserve',
      batchTag: '100% RAW',
      origin: 'Nilgiris, Tamil Nadu (2,240m)',
      flora: 'Wild Kurinji & Forest Jamun',
      colorAccent: '#d97706'
    })
  },
  {
    id: 'sample-kashmir-2',
    batchId: 'HC-2026-KSH-009102',
    barcodeNumber: '8901030910203',
    format: 'EAN-13',
    title: 'Kashmir Alpine White Acacia Honey',
    subtitle: 'Srinagar Alpine Valley Reserve • 1,730m',
    flora: 'White Acacia & Kashmiri Wildflower',
    origin: 'Srinagar, Jammu & Kashmir',
    elevation: '1,730m',
    colorAccent: '#0284c7',
    batchTag: 'GRADE A RAW',
    purityScore: '100% Pure (HMF 6.4 mg/kg)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-KSH-009102',
      barcodeNumber: '8901030910203',
      title: 'Kashmir Alpine White Acacia Honey',
      batchTag: 'GRADE A RAW',
      origin: 'Srinagar, Jammu & Kashmir (1,730m)',
      flora: 'White Acacia & Wildflower',
      colorAccent: '#0284c7'
    })
  },
  {
    id: 'sample-sundarbans-3',
    batchId: 'HC-2026-SUN-003319',
    barcodeNumber: '8901030033193',
    format: 'EAN-13',
    title: 'Sundarbans Deep Mangrove Wild Honey',
    subtitle: 'UNESCO Tiger Reserve Mangroves • 6m Tidal Canopy',
    flora: 'Khalisa & Goran Wild Mangrove',
    origin: 'Sundarbans, West Bengal',
    elevation: '6m',
    colorAccent: '#059669',
    batchTag: 'MANGROVE WILD',
    purityScore: '100% Pure (Wild Mangrove Nectar)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-SUN-003319',
      barcodeNumber: '8901030033193',
      title: 'Sundarbans Deep Mangrove Wild Honey',
      batchTag: 'MANGROVE WILD',
      origin: 'Sundarbans, West Bengal (6m)',
      flora: 'Khalisa & Goran Mangrove',
      colorAccent: '#059669'
    })
  },
  {
    id: 'sample-coorg-4',
    batchId: 'HC-2026-COF-004128',
    barcodeNumber: '8901030041280',
    format: 'EAN-13',
    title: 'Coorg Single-Estate Coffee Blossom',
    subtitle: 'Madikeri Shaded Hill Estate • 1,150m Elevation',
    flora: 'Robusta & Arabica Coffee Blossom',
    origin: 'Coorg (Kodagu), Karnataka',
    elevation: '1,150m',
    colorAccent: '#92400e',
    batchTag: 'ESTATE CRU',
    purityScore: '100% Pure (Single Estate Monofloral)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-COF-004128',
      barcodeNumber: '8901030041280',
      title: 'Coorg Single-Estate Coffee Blossom',
      batchTag: 'ESTATE CRU',
      origin: 'Coorg (Kodagu), Karnataka (1,150m)',
      flora: 'Robusta & Arabica Coffee Blossom',
      colorAccent: '#92400e'
    })
  },
  {
    id: 'sample-rajasthan-5',
    batchId: 'HC-2026-RAJ-005234',
    barcodeNumber: '8901030052347',
    format: 'EAN-13',
    title: 'Thar Desert Golden Mustard & Kikar',
    subtitle: 'Shekhawati Arid Floral Belt • 210m Elevation',
    flora: 'Yellow Mustard & Wild Kikar (Acacia)',
    origin: 'Bharatpur & Shekhawati, Rajasthan',
    elevation: '210m',
    colorAccent: '#ca8a04',
    batchTag: 'DESERT GOLD',
    purityScore: '100% Pure (Zero Adulterants)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-RAJ-005234',
      barcodeNumber: '8901030052347',
      title: 'Thar Desert Golden Mustard & Kikar',
      batchTag: 'DESERT GOLD',
      origin: 'Shekhawati, Rajasthan (210m)',
      flora: 'Yellow Mustard & Wild Kikar',
      colorAccent: '#ca8a04'
    })
  },
  {
    id: 'sample-himachal-6',
    batchId: 'HC-2026-HIM-006789',
    barcodeNumber: '8901030067891',
    format: 'EAN-13',
    title: 'Himachal Mountain Apple Blossom',
    subtitle: 'Kullu Valley High Orchards • 2,050m Elevation',
    flora: 'Organic Apple Blossom & Rhododendron',
    origin: 'Kullu Valley, Himachal Pradesh',
    elevation: '2,050m',
    colorAccent: '#dc2626',
    batchTag: 'ALPINE BLOSSOM',
    purityScore: '100% Pure (High Altitude Diastase 27.4)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-HIM-006789',
      barcodeNumber: '8901030067891',
      title: 'Himachal Mountain Apple Blossom',
      batchTag: 'ALPINE BLOSSOM',
      origin: 'Kullu Valley, Himachal (2,050m)',
      flora: 'Apple Blossom & Rhododendron',
      colorAccent: '#dc2626'
    })
  },
  {
    id: 'sample-mahabaleshwar-7',
    batchId: 'HC-2026-MHA-007845',
    barcodeNumber: '8901030078453',
    format: 'EAN-13',
    title: 'Mahabaleshwar Wild Forest Jamun',
    subtitle: 'Western Ghats UNESCO Sanctuary • 1,372m',
    flora: 'Black Jamun (Syzygium cumini)',
    origin: 'Mahabaleshwar, Maharashtra',
    elevation: '1,372m',
    colorAccent: '#7c3aed',
    batchTag: 'JAMUN RESERVE',
    purityScore: '100% Pure (Monofloral Wild Jamun)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-MHA-007845',
      barcodeNumber: '8901030078453',
      title: 'Mahabaleshwar Wild Forest Jamun',
      batchTag: 'JAMUN RESERVE',
      origin: 'Mahabaleshwar, Maharashtra (1,372m)',
      flora: 'Black Jamun Blossom',
      colorAccent: '#7c3aed'
    })
  },
  {
    id: 'sample-silentvalley-8',
    batchId: 'HC-2026-AP-004821',
    barcodeNumber: '8901030048210',
    format: 'EAN-13',
    title: 'Western Ghats Rainforest Multifloral',
    subtitle: 'Silent Valley Rainforest Buffer • 1,450m',
    flora: 'Cardamom, Forest Acacia & Neelakurinji',
    origin: 'Silent Valley, Kerala',
    elevation: '1,450m',
    colorAccent: '#0d9488',
    batchTag: 'RAINFOREST BIO',
    purityScore: '100% Pure (Bio-Diverse Rainforest)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-AP-004821',
      barcodeNumber: '8901030048210',
      title: 'Western Ghats Rainforest Multifloral',
      batchTag: 'RAINFOREST BIO',
      origin: 'Silent Valley, Kerala (1,450m)',
      flora: 'Cardamom & Forest Acacia',
      colorAccent: '#0d9488'
    })
  },
  {
    id: 'sample-meghalaya-9',
    batchId: 'HC-2026-MEG-008912',
    barcodeNumber: '8901030089121',
    format: 'EAN-13',
    title: 'Meghalaya Khasi Hills Rock Bee Honey',
    subtitle: 'Cherrapunji Living Root Forest • 1,480m',
    flora: 'Wild Citrus, Khasi Cinnamon & Orchid',
    origin: 'East Khasi Hills, Meghalaya',
    elevation: '1,480m',
    colorAccent: '#ea580c',
    batchTag: 'ROCK BEE WILD',
    purityScore: '100% Pure (Apis dorsata laboriosa)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-MEG-008912',
      barcodeNumber: '8901030089121',
      title: 'Meghalaya Khasi Hills Rock Bee Honey',
      batchTag: 'ROCK BEE WILD',
      origin: 'East Khasi Hills, Meghalaya (1,480m)',
      flora: 'Wild Citrus, Cinnamon & Orchid',
      colorAccent: '#ea580c'
    })
  },
  {
    id: 'sample-gangotri-10',
    batchId: 'HC-2026-UTT-009951',
    barcodeNumber: '8901030099519',
    format: 'EAN-13',
    title: 'Uttarakhand Gangotri Cedar & Pine Nectar',
    subtitle: 'Bhagirathi Glacial Alpine Valley • 2,580m Elevation',
    flora: 'Himalayan Cedar, Wild Thyme & Pine',
    origin: 'Garhwal Himalayas, Uttarakhand',
    elevation: '2,580m',
    colorAccent: '#4f46e5',
    batchTag: 'GLACIAL ALPINE',
    purityScore: '100% Pure (Ultra High Altitude Enzyme 29.0)',
    dataUrl: createBarcodeSvgDataUrl({
      batchId: 'HC-2026-UTT-009951',
      barcodeNumber: '8901030099519',
      title: 'Uttarakhand Gangotri Cedar & Pine Nectar',
      batchTag: 'GLACIAL ALPINE',
      origin: 'Garhwal Himalayas, Uttarakhand (2,580m)',
      flora: 'Himalayan Cedar, Thyme & Pine',
      colorAccent: '#4f46e5'
    })
  }
];

/**
 * Downloads a sample barcode SVG sticker to the customer's machine.
 */
export function downloadBarcodeSvg(sample: SampleBottleBarcode): void {
  let blob: Blob;
  if (sample.dataUrl.startsWith('data:image/svg+xml')) {
    const rawSvg = decodeURIComponent(sample.dataUrl.split(',')[1]);
    blob = new Blob([rawSvg], { type: 'image/svg+xml;charset=utf-8' });
  } else if (sample.dataUrl.startsWith('<svg')) {
    blob = new Blob([sample.dataUrl], { type: 'image/svg+xml;charset=utf-8' });
  } else {
    blob = new Blob([sample.dataUrl], { type: 'image/svg+xml;charset=utf-8' });
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `honeychain-barcode-${sample.barcodeNumber || sample.batchId}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Downloads a sample barcode PNG image sticker to the customer's machine.
 */
export function downloadBarcodePng(params: {
  svgString: string;
  barcodeNumber: string;
  batchId?: string;
  filename?: string;
}): Promise<void> {
  return new Promise((resolve) => {
    try {
      const svg = params.svgString;
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 760;
        canvas.height = 572;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve();
          return;
        }
        ctx.fillStyle = '#bdd2b3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        canvas.toBlob((pngBlob) => {
          if (!pngBlob) {
            resolve();
            return;
          }
          const pngUrl = URL.createObjectURL(pngBlob);
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = params.filename || `honeychain-barcode-${params.barcodeNumber}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
          resolve();
        }, 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      img.src = url;
    } catch {
      resolve();
    }
  });
}

/**
 * Dynamically register a newly inspected honey bottle barcode into the sample collection
 */
export function registerNewSampleBarcode(newSample: SampleBottleBarcode): void {
  // Prevent duplicate insertion
  const exists = SAMPLE_BOTTLE_BARCODES.some(b => b.barcodeNumber === newSample.barcodeNumber);
  if (!exists) {
    SAMPLE_BOTTLE_BARCODES.unshift(newSample);
  }
}
