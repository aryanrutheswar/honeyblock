export interface KnowledgeItem {
  id: string;
  topic: string;
  keywords: string[];
  question: string;
  answer: string;
  category: 'blockchain' | 'quality_testing' | 'apiary_iot' | 'zero_knowledge' | 'general';
}

export const HONEYCHAIN_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'kb-01',
    topic: 'Platform Overview',
    keywords: ['honeychain', 'what is', 'overview', 'platform', 'system', 'about', 'kya hai', 'yenti'],
    question: 'What is Honeychain?',
    category: 'general',
    answer: `Bzzz! 🐝 **Honeychain** is an enterprise-grade blockchain platform for honey traceability and smart apiary management! It anchors real-time IoT hive sensor telemetry (temperature, scale weight, queen acoustic frequency) to a Hyperledger Fabric v2.5 ledger and notarizes ISO/IEC 17025 EA-IRMS carbon isotope lab testing with Zero-Knowledge SNARK purity proofs.`
  },
  {
    id: 'kb-02',
    topic: 'EA-IRMS Isotope Testing',
    keywords: ['ea-irms', 'isotope', 'delta 13c', 'c4 sugar', 'c3 sugar', 'adulteration', 'corn syrup', 'cane syrup', 'testing', 'shuddhata', 'purification', 'purity'],
    question: 'What is EA-IRMS Carbon Isotope Testing?',
    category: 'quality_testing',
    answer: `Bzzz! 🔬 **EA-IRMS (Elemental Analysis - Isotope Ratio Mass Spectrometry)** measures the ratio of Carbon-13 to Carbon-12 ($\delta^{13}\text{C}$) in honey. Pure C3 plant nectar (like Kurinji or Jamun) has a baseline $\delta^{13}\text{C}$ between -24‰ and -28‰. If C4 industrial sugars (corn or cane syrup) are added, the $\delta^{13}\text{C}$ shifts above -20‰, immediately triggering an automated Hyperledger Smart Contract quarantine!`
  },
  {
    id: 'kb-03',
    topic: 'Zero-Knowledge Proofs',
    keywords: ['zero knowledge', 'zk proof', 'zk-snark', 'snark', 'privacy', 'purity constraint'],
    question: 'How do Zero-Knowledge SNARK proofs work in Honeychain?',
    category: 'zero_knowledge',
    answer: `Bzzz! 🔐 **Zero-Knowledge SNARKs (zk-SNARKs)** allow testing laboratories to mathematically prove that a batch of honey satisfies strict purity constraints (0.00% C4/C3 synthetic sugars, HMF < 40 mg/kg) on the public blockchain **without exposing confidential lab formulations or proprietary Beekeeper operational secrets**!`
  },
  {
    id: 'kb-04',
    topic: 'IoT Hive Telemetry',
    keywords: ['iot', 'sensors', 'acoustic', 'frequency', 'queen', 'temperature', 'weight', 'swarming', 'hives', 'bees', 'makkhi'],
    question: 'How do IoT Hive Sensors monitor bee colony health?',
    category: 'apiary_iot',
    answer: `Bzzz! 🐝 Smart hives are equipped with edge IoT sensor arrays:
- **Acoustic Spectrum (240 Hz)**: Monitors queen bee acoustic frequencies; shifts above 500 Hz signal swarming stress.
- **Precision Load Cell Scale (42.5 kg)**: Tracks daily nectar flow and honey accumulation.
- **Brood Thermistor (34.8°C)**: Ensures optimum internal brood temperature.`
  },
  {
    id: 'kb-05',
    topic: 'Hyperledger Fabric Ledger',
    keywords: ['hyperledger', 'fabric', 'blockchain', 'poa', 'raft', 'blocks', 'consensus', 'transaction'],
    question: 'What blockchain technology powers Honeychain?',
    category: 'blockchain',
    answer: `Bzzz! ⚡ Honeychain uses **Hyperledger Fabric v2.5** running Byzantine Fault Tolerant Proof-of-Authority (PoA) / Raft consensus. Every harvest registration, lab notarization, and transit event generates an immutable cryptographic block hash anchored with Secp256k1 ECDSA validator signatures.`
  },
  {
    id: 'kb-06',
    topic: 'HMF & Diastase Quality',
    keywords: ['hmf', 'hydroxymethylfurfural', 'diastase', 'enzymes', 'freshness', 'heat'],
    question: 'What are HMF and Diastase Activity?',
    category: 'quality_testing',
    answer: `Bzzz! 🍯
- **HMF (Hydroxymethylfurfural)**: A marker of thermal degradation. Pure raw honey has HMF < 15 mg/kg (Codex limit < 40 mg/kg). Excessive heat or adulteration causes HMF to spike.
- **Diastase Activity**: A natural enzyme in raw honey. High diastase activity (> 8 Schade Units) confirms the honey has not been overheated or ultra-processed.`
  },
  {
    id: 'kb-07',
    topic: 'Nilgiri Biosphere Reserve',
    keywords: ['nilgiri', 'apiary', 'kurinji', 'jamun', 'wildflower', 'tamil nadu', 'forest', 'jungle'],
    question: 'Where is the honey sourced from?',
    category: 'general',
    answer: `Bzzz! 🌸 Honeychain tracks high-altitude organic reserves in the **Nilgiri Biosphere Reserve, Tamil Nadu** (elevation 2,240m), featuring rare wild flora such as **Wild Kurinji** (*Strobilanthes kunthiana*) and **Forest Jamun** (*Syzygium cumini*).`
  }
];

// Multilingual Greetings & Responses for Indian Languages
export const INDIAN_LANG_RESPONSES: Record<string, { greeting: string; fallback: string }> = {
  telugu: {
    greeting: "Bzzz! నమస్కారం! 🙏 నేను మీ ముద్దుల HoneyBee Buzzy ని! 🐝 తేనె శుద్ధత (Honey Purity), lab reports లేదా QR scan గురించి ఏమైనా అడగండి, తియ్యగా సమాధానం చెప్తాను! 🍯",
    fallback: "Bzzz! 🐝 ఈ తేనె బ్యాచ్ గురించి నేను వివరాలు కనుగొన్నాను: EA-IRMS Isotope test దారిన 100% అసలైన C3 Botanical Honey! QR Code scan చేసి లేదా Batch ID ఇచ్చి కూడా చూడవచ్చు!"
  },
  hindi: {
    greeting: "Bzzz! नमस्ते दोस्त! 🙏 मैं हूँ आपका प्यारा Buzzy Bee! 🐝 शहद की शुद्धता (Honey Purity), Isotope test या QR Code scan के बारे में मुझसे कुछ भी पूछें! 🍯",
    fallback: "Bzzz! 🐝 Honeychain पर असली शहद की जाँच: 100% शुद्ध Botanical C3 Nectar! आप QR Code स्कैन करके या Batch ID (जैसे HC-2026-NIL-008421) डालकर भी देख सकते हैं!"
  },
  tamil: {
    greeting: "Bzzz! வணக்கம் நண்பா! 🙏 நான் உங்கள் செல்ல Buzzy Bee! 🐝 தேனின் தூய்மை (Honey Purity), லேப் ரிப்போர்ட் அல்லது QR scan பற்றி என்னிடம் கேட்கலாம்! 🍯",
    fallback: "Bzzz! 🐝 100% தூய்மையான நீலகிரி தேன் சான்றிதழ்! EA-IRMS Carbon Isotope சோதனை மூலமாக C4 சர்க்கரை கலப்படம் 0.00% என நிரூபிக்கப்பட்டுள்ளது!"
  },
  kannada: {
    greeting: "Bzzz! ನಮಸ್ಕಾರ ಗೆಳೆಯ! 🙏 ನಾನು ನಿಮ್ಮ ಪ್ರೀತಿಯ Buzzy Bee! 🐝 ಜೇನುತುಪ್ಪದ ಶುದ್ಧತೆ (Honey Purity) ಮತ್ತು QR Scan ಬಗ್ಗೆ ಉಚಿತವಾಗಿ ಕೇಳಿ! 🍯",
    fallback: "Bzzz! 🐝 ಶುದ್ಧ ನೀಲಗಿರಿ ಜೇನುತುಪ್ಪ! EA-IRMS ಪರೀಕ್ಷೆಯಲ್ಲಿ C4 ಸಕ್ಕರೆ ಕಲಬೆರಕೆ 0.00% ಎಂದು ದೃಢೀಕರಿಸಲಾಗಿದೆ!"
  },
  malayalam: {
    greeting: "Bzzz! നമസ്കാരം കൂട്ടുകാരാ! 🙏 ഞാൻ നിങ്ങളുടെ പ്യാരി Buzzy Bee! 🐝 തേനിന്റെ വിശുദ്ധിയും (Honey Purity) QR കോഡും എന്നോട് ചോദിക്കൂ! 🍯",
    fallback: "Bzzz! 🐝 100% ശുദ്ധമായ നീലഗിരി വനതേൻ! EA-IRMS പരിശോധനയിൽ കൃത്രിമ പഞ്ചസാരകൾ 0.00% എന്ന് തെളിഞ്ഞു!"
  },
  bengali: {
    greeting: "Bzzz! নমস্কার বন্ধু! 🙏 আমি আপনার মিষ্টি Buzzy Bee! 🐝 মধুর খাঁটি গুণমান (Honey Purity) এবং QR Scan সম্পর্কে আমাকে যেকোনো প্রশ্ন করুন! 🍯",
    fallback: "Bzzz! 🐝 খাঁটি মধুর গ্যারান্টি! EA-IRMS টেস্ট দ্বারা প্রমাণিত ১০০% প্রাকৃতিক সি৩ মধু।"
  },
  marathi: {
    greeting: "Bzzz! नमस्कार मित्रा! 🙏 मी आहे तुमचा गोड Buzzy Bee! 🐝 मधाची शुद्धता (Honey Purity), लॅब रिपोर्ट आणि QR Scan बद्दल काहीही विचारा! 🍯",
    fallback: "Bzzz! 🐝 १००% शुद्ध नीलगिरी मध! EA-IRMS Carbon Isotope टेस्टने C4 भेसळ ०.००% सिद्ध केली आहे!"
  },
  english: {
    greeting: "Bzzz! Hey friend! 🙏 I'm Buzzy, your cute HoneyBee assistant! 🐝 Ask me anything about honey purity (EA-IRMS), ZK-SNARK proofs, or scan a honey jar QR code! 🍯",
    fallback: "Bzzz! 🐝 Here is what I found: Honeychain verifies pure C3 Botanical Nectar ($\delta^{13}\\text{C}$ baseline -26.8‰) anchored on Hyperledger Fabric!"
  }
};

export function detectLanguage(text: string): string {
  const t = text.toLowerCase();
  
  // Telugu script / keywords
  if (/[\u0C00-\u0C7F]/.test(text) || /\b(namaskaram|yenti|ela|telugu|namaskara|teene|theene)\b/i.test(t)) {
    return 'telugu';
  }
  // Hindi script / keywords
  if (/[\u0900-\u097F]/.test(text) || /\b(namaste|kaise|kya|shuddhata|hindi|bhai|shahat)\b/i.test(t)) {
    return 'hindi';
  }
  // Tamil script / keywords
  if (/[\u0B80-\u0BFF]/.test(text) || /\b(vanakkam|epdi|nandri|tamil|thaen)\b/i.test(t)) {
    return 'tamil';
  }
  // Kannada script / keywords
  if (/[\u0C80-\u0CFF]/.test(text) || /\b(namaskara|hegide|kannada|jenu)\b/i.test(t)) {
    return 'kannada';
  }
  // Malayalam script / keywords
  if (/[\u0D00-\u0D7F]/.test(text) || /\b(namaskaram|evide|malayalam|then)\b/i.test(t)) {
    return 'malayalam';
  }
  // Bengali script / keywords
  if (/[\u0980-\u09FF]/.test(text) || /\b(nomoskar|kemon|bengali|modhu)\b/i.test(t)) {
    return 'bengali';
  }
  // Marathi script / keywords
  if (/\b(namaskar|kasa|marathi|madh)\b/i.test(t)) {
    return 'marathi';
  }
  
  return 'english';
}

export function queryKnowledgeBase(query: string, langOverride?: string): string {
  const lang = langOverride || detectLanguage(query);
  const langPack = INDIAN_LANG_RESPONSES[lang] || INDIAN_LANG_RESPONSES.english;
  
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) {
    return langPack.greeting;
  }

  let bestMatch: KnowledgeItem | null = null;
  let maxScore = 0;

  for (const item of HONEYCHAIN_KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (cleanQuery.includes(keyword)) {
        score += 2;
      }
    }
    if (cleanQuery.includes(item.topic.toLowerCase())) {
      score += 3;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore >= 2) {
    return `Bzzz! 🐝 ${bestMatch.answer}`;
  }

  return `${langPack.fallback}

- **EA-IRMS Isotope Mass Spectrometry**: $\delta^{13}\text{C}$ pure baseline of -26.8‰
- **Zero-Knowledge SNARK Purity Proofs**: 0.00% C4/C3 synthetic syrup
- **Smart Hive Edge IoT Telemetry**: 34.8°C temp, 42.5kg weight, 240Hz queen acoustic frequency
- **Hyperledger Fabric v2.5**: Immutable Blockchain Ledger

Bzzz! Try entering a Batch ID like **HC-2026-NIL-008421** to inspect live provenance! 🍯`;
}
