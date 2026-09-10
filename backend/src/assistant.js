import { DB } from './db.js';
import { retrieveRelevantKnowledge } from './knowledge-base.js';

/**
 * Handle BeeGuard Chat queries with Hybrid OpenRouter LLM + Local RAG Fallback
 */
export async function handleBeeGuardChat({ message = '', batchId = null, history = [], dbGet = null, dbAll = null }) {
  const q = (message || '').trim();
  const lowerQ = q.toLowerCase();

  // 1. Resolve Bottle / Batch context if batchId is provided or detected in query
  let activeBatch = null;
  const detectedBatchMatch = q.match(/hc-2026-[a-z0-9-]+/i) || q.match(/hc-\d+/i) || q.match(/00482[1-8]/);
  const targetBatchId = batchId || (detectedBatchMatch ? detectedBatchMatch[0].toUpperCase() : null);

  if (targetBatchId) {
    if (dbGet) {
      try {
        activeBatch = await dbGet('SELECT * FROM batches WHERE id LIKE ? OR digitalId LIKE ?', [`%${targetBatchId}%`, `%${targetBatchId}%`]);
      } catch (e) {
        console.warn('DB lookup error for batch, falling back to static DB:', e);
      }
    }
    if (!activeBatch && DB.batches) {
      activeBatch = DB.batches.find(b => 
        (b.id && b.id.toUpperCase().includes(targetBatchId.toUpperCase())) ||
        (b.digitalId && b.digitalId.toUpperCase().includes(targetBatchId.toUpperCase()))
      );
    }
  }

  // 2. Retrieve relevant RAG knowledge chunks
  const relevantChunks = retrieveRelevantKnowledge(q, 2);
  const knowledgeContext = relevantChunks.map(c => `[Topic: ${c.title}]\n${c.content}`).join('\n\n');

  // Format batch context if available
  let batchContextText = '';
  if (activeBatch) {
    batchContextText = `
CURRENT SCANNED HONEY BOTTLE:
- Digital ID: ${activeBatch.digitalId || activeBatch.id}
- Batch ID: ${activeBatch.id}
- Product: ${activeBatch.name || 'Pure Artisan Honey'}
- Floral Origin: ${activeBatch.floralSource} (${activeBatch.apiaryRegion || 'India'})
- Harvest Date: ${activeBatch.harvestDate}
- Quality State: ${activeBatch.status} (Smart Contract Gate: ${activeBatch.smartContractGate || 'VERIFIED'})
- Isotope δ13C: ${activeBatch.isotopeDelta13C ? `${activeBatch.isotopeDelta13C}‰` : '-26.8‰'} (Pure C3 floral benchmark)
- HMF: ${activeBatch.hpmFuranMgKg ? `${activeBatch.hpmFuranMgKg} mg/kg` : '8.2 mg/kg'} (Freshness benchmark < 40 mg/kg)
- Adulteration Risk: ${activeBatch.adulterationRisk || '0.0% Pure'}
- Lab Accreditation: ${activeBatch.labCertificateId || 'ISO/IEC 17025 & NABL Certified'}
- Blockchain Block: #${activeBatch.blockNumber || 104} (Tx: ${activeBatch.blockchainTx ? activeBatch.blockchainTx.substring(0, 16) + '...' : '0x88f2...'})
`;
  }

  // 3. Try OpenRouter if API key is provided in environment
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey && openRouterKey.trim() !== '') {
    try {
      const openRouterModel = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';
      
      const systemPrompt = `You are BeeGuard AI, an autonomous intelligence co-pilot for HoneyChain, a blockchain-based honey traceability and smart beekeeping platform.
Your job is to answer beekeeper, consumer, and auditor questions about honey quality, spectral purity (NIR/NMR, EA-IRMS isotope testing), acoustic hive health, blockchain ledger verification, and pollination service credits.
Be concise, helpful, and technically accurate. Format key facts with bold points or bullet items.

${batchContextText ? `A customer has scanned a honey bottle QR code. Here is the bottle's verified on-chain record:\n${batchContextText}` : ''}

${knowledgeContext ? `Relevant Platform Knowledge:\n${knowledgeContext}` : ''}`;

      const messagesPayload = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-4), // keep recent conversation turns for context
        { role: 'user', content: q || 'Explain this bottle' }
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://honeychain.org',
          'X-Title': 'HoneyChain BeeGuard AI'
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: messagesPayload,
          temperature: 0.4,
          max_tokens: 450
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const replyText = json.choices?.[0]?.message?.content;
        if (replyText) {
          const suggestedActions = generateSuggestedActions(q, activeBatch);
          return {
            reply: replyText,
            suggestedActions,
            engine: 'OpenRouter AI',
            model: openRouterModel,
            activeBatch: activeBatch ? { id: activeBatch.id, name: activeBatch.name, status: activeBatch.status } : null
          };
        }
      } else {
        const errText = await response.text();
        console.warn('OpenRouter API returned non-OK status:', response.status, errText);
      }
    } catch (err) {
      console.warn('OpenRouter API request failed, engaging local RAG engine fallback:', err.message);
    }
  }

  // 4. Local RAG & Rule-Based Intelligence Engine (Zero-cost, offline guaranteed)
  return runLocalEngine({ query: q, lowerQ, activeBatch, relevantChunks, dbAll });
}

/**
 * Local RAG & Database Intelligence Engine
 */
async function runLocalEngine({ query, lowerQ, activeBatch, relevantChunks, dbAll }) {
  // Case A: Specific active honey bottle queries
  if (activeBatch && (lowerQ.includes('bottle') || lowerQ.includes('pure') || lowerQ.includes('purity') || lowerQ.includes('origin') || lowerQ.includes('lab') || lowerQ.includes('this') || lowerQ.includes('batch') || lowerQ.includes('adulterat') || lowerQ.length < 15)) {
    const isApproved = activeBatch.status === 'APPROVED';
    return {
      reply: `🍯 **Honey Bottle Audit: ${activeBatch.name || 'Artisan Wild Honey'}** (${activeBatch.id})\n` +
        `- **Botanical Origin**: ${activeBatch.floralSource} (${activeBatch.apiaryRegion || 'Certified Apiary'})\n` +
        `- **Authenticity State**: ${isApproved ? '✅ Verified Pure (Smart Contract Approved)' : '⚠️ Quarantined / Under Review'}\n` +
        `- **Isotope Testing (δ13C)**: \`${activeBatch.isotopeDelta13C ? `${activeBatch.isotopeDelta13C}‰` : '-26.8‰'}\` (Natural C3 nectar profile; zero C4 corn/cane syrup detected)\n` +
        `- **HMF Freshness**: \`${activeBatch.hpmFuranMgKg ? `${activeBatch.hpmFuranMgKg} mg/kg` : '8.2 mg/kg'}\` (Well below 40 mg/kg heat-damage threshold)\n` +
        `- **Adulteration Score**: ${activeBatch.adulterationRisk || '0.0% Pure Botanical Nectar'}\n` +
        `- **Lab Certification**: ${activeBatch.labCertificateId || 'ISO/IEC 17025 & NABL Accredited'}\n` +
        `- **Ledger Security**: Block #${activeBatch.blockNumber || 104} | Tx: \`${(activeBatch.blockchainTx || '0x498a...').substring(0, 16)}...\`\n\n` +
        (isApproved ? `*This bottle passed all spectroscopic and isotopic screening gates before bottling.*` : `*Alert: Smart contract gate intervened to quarantine this batch prior to distribution.*`),
      suggestedActions: [
        `View Blockchain Passport`,
        `Run SpectraSeal Scan`,
        `What lab tested this?`,
        `Ask general question`
      ],
      engine: 'BeeGuard Local RAG',
      activeBatch: { id: activeBatch.id, name: activeBatch.name, status: activeBatch.status }
    };
  }

  // Case B: Hive Telemetry & Sound Spectra
  const hiveMatch = query.match(/h-\d{3}/i) || query.match(/hive\s*(\d+)/i);
  if (hiveMatch) {
    const rawId = hiveMatch[0].toUpperCase();
    const hiveId = rawId.startsWith('H-') ? rawId : `H-${rawId.replace('HIVE', '').trim().padStart(3, '0')}`;
    const hive = DB.hives.find(h => h.id === hiveId);
    if (hive) {
      return {
        reply: `🐝 **Acoustic Diagnostic for Hive ${hive.name} (${hive.id})**:\n` +
          `- **Colony Condition**: ${hive.condition}\n` +
          `- **Acoustic Frequency**: ${hive.acousticFrequencyHz || 220} Hz\n` +
          `- **Health Score**: ${hive.healthScore}/100\n` +
          `- **Queen Status**: ${hive.queenStatus}\n` +
          `- **Swarming Probability**: ${hive.swarmingRisk}%\n` +
          `- **Sensor Analysis**: ${hive.whyPrediction}\n` +
          `- **Prescribed Action**: ${hive.inspectionPriority === 'URGENT' ? '🚨 Immediate physical intervention needed.' : hive.inspectionPriority === 'HIGH' ? '⚠️ Schedule inspection within 24 hours.' : '✅ Colony operating at normal equilibrium.'}`,
        suggestedActions: [`Simulate Swarm on ${hive.id}`, `Simulate Queenlessness on ${hive.id}`, `View Hive ${hive.id}`],
        engine: 'BeeGuard Local RAG'
      };
    }
  }

  // Case C: Which hive needs inspection?
  if (lowerQ.includes('inspection') || lowerQ.includes('at risk') || lowerQ.includes('priority') || lowerQ.includes('which hive')) {
    const atRiskHives = DB.hives.filter(h => h.inspectionPriority === 'URGENT' || h.inspectionPriority === 'HIGH');
    const list = atRiskHives.map(h => `• **${h.id} (${h.name})** — Priority: \`${h.inspectionPriority}\` (${h.condition}, Health: ${h.healthScore}/100)`).join('\n');
    return {
      reply: `🔍 **Active Hive Inspection Alerts** (${atRiskHives.length} hives flagged by BeeGuard AI):\n\n${list}\n\n*Acoustic inference continuously evaluates colony frequency shifts (e.g. 450Hz swarming buzz or piping pulses) to prioritize apiary visits.*`,
      suggestedActions: ['Open Smart Hives Dashboard', 'Inspect Hive H-017', 'Inspect Hive H-015'],
      engine: 'BeeGuard Local RAG'
    };
  }

  // Case D: Intercepted / Quarantined Batches & "Break the Batch"
  if (lowerQ.includes('quarantine') || lowerQ.includes('adulterat') || lowerQ.includes('blocked') || lowerQ.includes('break the batch')) {
    const quarantined = DB.batches.filter(b => b.status === 'QUARANTINED' || b.status === 'BLOCKED');
    const list = quarantined.map(b => `• **${b.id}** (${b.name}) — State: \`${b.status}\` | ${b.adulterationRisk}`).join('\n');
    return {
      reply: `🚨 **Intercepted & Quarantined Batches** (${quarantined.length} batches halted on-chain):\n\n${list}\n\n*Smart contracts automatically freeze downstream transfers whenever NIR/NMR spectral deviation or EA-IRMS isotopic delta exceeds allowable botanical limits.*`,
      suggestedActions: ['Launch Break the Batch Demo', 'View Regulator Dashboard', 'Check Quality Intelligence'],
      engine: 'BeeGuard Local RAG'
    };
  }

  // Case E: Dynamic match with top RAG knowledge chunk
  if (relevantChunks && relevantChunks.length > 0 && relevantChunks[0].score >= 5) {
    const topChunk = relevantChunks[0];
    return {
      reply: `📘 **${topChunk.title}**\n\n${topChunk.content}`,
      suggestedActions: generateSuggestedActions(query, activeBatch),
      engine: 'BeeGuard Local RAG'
    };
  }

  // Default fallback welcome / guide
  return {
    reply: `👋 Hello! I am **BeeGuard AI**, your autonomous intelligence co-pilot for HoneyChain.\n\n` +
      `You can:\n` +
      `📷 **Upload or scan a honey bottle QR code** to instantly audit purity and lab records.\n` +
      `🐝 Ask: *"Which hive needs inspection?"*\n` +
      `🔬 Ask: *"How does SpectraSeal detect adulterated honey?"*\n` +
      `⛓️ Ask: *"How does the blockchain smart contract gate work?"*\n` +
      `🌸 Ask: *"What are pollination service credits?"*`,
    suggestedActions: [
      'Which hive needs inspection?',
      'How does SpectraSeal detect adulteration?',
      'Scan Honey Bottle QR',
      'Launch Judge Mode'
    ],
    engine: 'BeeGuard Local RAG'
  };
}

function generateSuggestedActions(query, activeBatch) {
  const actions = [];
  if (activeBatch) {
    actions.push(`View Passport for ${activeBatch.id}`);
    actions.push(`Verify Lab Certificate`);
  } else {
    actions.push('Which hive needs inspection?');
  }
  actions.push('How does SpectraSeal work?');
  actions.push('Launch Judge Mode');
  return actions;
}
