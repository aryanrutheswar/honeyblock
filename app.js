/**
 * HONEYCHAIN - ENTERPRISE BLOCKCHAIN TRACEABILITY & BIO-ACOUSTIC PLATFORM
 * Core Application Controller & State Engine
 */

// Application State
const state = {
  currentPortal: 'all', // 'all', 'beekeeper', 'lab', 'consumer'
  currentHive: 'alpha',
  acousticMode: 'calm', // 'calm' or 'stress'
  audioPlaying: false,
  blockHeight: 4819,
  activeSample: 'jar1',
  blocks: [
    {
      height: 4819,
      txHash: '0x7c99f821a003bb4c5e21941df089bc21a8d052b6e51aa749102c98d0092f1',
      prevHash: '0x3d4ee3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852',
      merkleRoot: '0x5fa1098e21a7bb02187cc899a710eecb08a1',
      type: 'RETAIL_NFC_DISPATCH',
      title: 'Retail NFC Jar Sealed',
      batchId: 'HC-NZ-8829',
      timestamp: '2 mins ago',
      details: {
        channel: 'honey-provenance-mainnet',
        contract: 'HoneychainProvenanceChaincode_v2',
        batchId: 'HC-NZ-8829',
        origin: 'Canterbury Alpine Forest (-43.14, 171.71)',
        adulteration: '0.00%',
        nmrScore: 'Pass (Authentic Manuka)',
        hmfFreshness: '8.2 mg/kg',
        bioAcousticHealth: 'Queen Right (218 Hz)',
        zkProofVerified: true,
        endorsingPeers: ['peer0.beekeeper.org', 'peer0.labcert.org']
      }
    },
    {
      height: 4818,
      txHash: '0x3d4ee3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852',
      prevHash: '0x8a1b44c192f00a87612c481977bca88921e540198ca11082bbca7100e4810284',
      merkleRoot: '0x22c98fa10b91e77102938caa9012bbfa',
      type: 'NMR_LAB_CERTIFICATION',
      title: 'Lab NMR Spectrum Verified',
      batchId: 'HC-NZ-8829',
      timestamp: '14 mins ago',
      details: {
        channel: 'honey-provenance-mainnet',
        contract: 'LabInspectionChaincode',
        batchId: 'HC-NZ-8829',
        labCertId: 'EUROLINK-NZ-2026-991',
        c4SugarIsotopeDelta: '-26.8‰ (Natural)',
        c3SyrupUndetected: true,
        hmfLevel: '8.2 mg/kg',
        diastaseActivity: '16.4 DN',
        mgoContent: '562 mg/kg',
        signature: 'ECDSA_SECP256K1_VALID'
      }
    },
    {
      height: 4817,
      txHash: '0x8a1b44c192f00a87612c481977bca88921e540198ca11082bbca7100e4810284',
      prevHash: '0x4f81902a77cc19283bb90192e48220019fae881024bbac7108920192ea018281',
      merkleRoot: '0x9910ba7ca1102938caa9012bbfa22c98',
      type: 'HARVEST_LOG',
      title: 'Cold Harvest Extraction',
      batchId: 'HC-NZ-8829',
      timestamp: '1 hour ago',
      details: {
        channel: 'honey-provenance-mainnet',
        contract: 'HarvestLedgerChaincode',
        batchId: 'HC-NZ-8829',
        grossWeightHarvestedKg: 42.5,
        cappingsRefractometerMoisture: '16.2%',
        extractionTempC: 32.4,
        hiveId: 'HIVE-NZ-ALPINE-01'
      }
    },
    {
      height: 4816,
      txHash: '0x4f81902a77cc19283bb90192e48220019fae881024bbac7108920192ea018281',
      prevHash: '0x12a90098fca8819024bbac7108920192ea0182819910ba7ca1102938caa9012b',
      merkleRoot: '0x77cc19283bb90192e48220019fae8810',
      type: 'IOT_BIOACOUSTIC_TELEMETRY',
      title: 'Bio-Acoustic Health Sync',
      batchId: 'HIVE-NZ-014',
      timestamp: '3 hours ago',
      details: {
        channel: 'honey-provenance-mainnet',
        contract: 'IoTHiveChaincode',
        sensorNode: 'IOT-HIVE-NZ-014',
        coreBroodTempC: 34.8,
        ambientHumidityPercent: 58.4,
        dominantAcousticFrequencyHz: 218,
        queenStatus: 'Queen Right & Active Brood'
      }
    }
  ]
};

// =========================================================================
// 1. PORTAL SWITCHER & NAVIGATION LOGIC
// =========================================================================
function switchPortal(portal) {
  state.currentPortal = portal;
  
  // Desktop Tab Buttons
  const tabIds = ['all', 'beekeeper', 'lab', 'consumer'];
  tabIds.forEach(id => {
    const btn = document.getElementById(`btn-portal-${id}`);
    if (btn) {
      if (id === portal) {
        btn.className = 'portal-tab-btn active-tab px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2';
      } else {
        btn.className = 'portal-tab-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all flex items-center gap-2';
      }
    }
  });

  // Sections visibility & focus
  const secBeekeeper = document.getElementById('section-beekeeper');
  const secLab = document.getElementById('section-lab');
  const secConsumer = document.getElementById('section-consumer');
  const heroBanner = document.getElementById('hero-overview-banner');

  if (portal === 'all') {
    secBeekeeper.classList.remove('hidden');
    secLab.classList.remove('hidden');
    secConsumer.classList.remove('hidden');
    if (heroBanner) heroBanner.classList.remove('hidden');
    showToast('Switched to Live Overview (All 3 Portals)', 'info');
  } else if (portal === 'beekeeper') {
    secBeekeeper.classList.remove('hidden');
    secLab.classList.add('hidden');
    secConsumer.classList.add('hidden');
    if (heroBanner) heroBanner.classList.add('hidden');
    secBeekeeper.scrollIntoView({ behavior: 'smooth' });
    showToast('Switched to 🐝 Beekeeper Smart Hive Portal', 'success');
  } else if (portal === 'lab') {
    secBeekeeper.classList.add('hidden');
    secLab.classList.remove('hidden');
    secConsumer.classList.add('hidden');
    if (heroBanner) heroBanner.classList.add('hidden');
    secLab.scrollIntoView({ behavior: 'smooth' });
    showToast('Switched to 🧪 Lab Inspector Spectral Portal', 'success');
  } else if (portal === 'consumer') {
    secBeekeeper.classList.add('hidden');
    secLab.classList.add('hidden');
    secConsumer.classList.remove('hidden');
    if (heroBanner) heroBanner.classList.add('hidden');
    secConsumer.scrollIntoView({ behavior: 'smooth' });
    showToast('Switched to 📱 Consumer ZK-Proof Passport View', 'success');
  }
}

// =========================================================================
// 2. HIVE TELEMETRY DATA SWITCHER
// =========================================================================
const hiveProfiles = {
  alpha: {
    name: 'Hive Alpha-01 (Canterbury Alpine Forest)',
    temp: 34.8,
    weight: 42.5,
    saturation: 82,
    calmFreq: 218,
    flowNote: '+1.4 kg Nectar Flow',
    lastTx: '0x9a8f...3e12'
  },
  beta: {
    name: 'Hive Beta-04 (Waikato Manuka Range)',
    temp: 35.1,
    weight: 46.2,
    saturation: 91,
    calmFreq: 224,
    flowNote: '+2.1 kg Manuka Inflow',
    lastTx: '0x4e21...8b09'
  },
  gamma: {
    name: 'Hive Gamma-09 (Central Otago Thyme)',
    temp: 34.6,
    weight: 38.0,
    saturation: 68,
    calmFreq: 212,
    flowNote: '+0.8 kg Steady Yield',
    lastTx: '0x7f11...0a22'
  }
};

function changeHive(hiveKey) {
  state.currentHive = hiveKey;
  const h = hiveProfiles[hiveKey];
  if (!h) return;

  document.getElementById('hive-temp-val').innerText = h.temp;
  document.getElementById('hive-weight-val').innerText = h.weight;
  document.getElementById('weight-progress-bar').style.width = `${h.saturation}%`;
  document.getElementById('dominant-freq').innerText = `${h.calmFreq} Hz`;
  document.getElementById('beekeeper-last-tx').innerText = h.lastTx;

  showToast(`Switched active telemetry to ${h.name}`, 'info');
}

// =========================================================================
// 3. REAL-TIME BIO-ACOUSTIC FREQUENCY CANVAS & SYNTHESIZER
// =========================================================================
let audioCtx = null;
let oscillator = null;
let gainNode = null;
let canvasAnimId = null;

function setAcousticState(mode) {
  state.acousticMode = mode;
  const btnCalm = document.getElementById('btn-sound-calm');
  const btnStress = document.getElementById('btn-sound-stress');
  const statusVal = document.getElementById('hive-acoustic-val');
  const dominantFreq = document.getElementById('dominant-freq');
  const swarmProb = document.getElementById('swarm-prob');
  const overlay = document.getElementById('stress-indicator-overlay');

  if (mode === 'calm') {
    btnCalm.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-honey-100 text-honey-900 border border-honey-300 shadow-sm transition-all hover:bg-honey-200';
    btnStress.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:border-red-300 hover:text-red-600 transition-all';
    statusVal.className = 'text-xl sm:text-2xl font-extrabold text-emerald-600 tracking-tight';
    statusVal.innerText = 'Queen Right & Calm';
    dominantFreq.innerText = '218 Hz';
    swarmProb.className = 'font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded';
    swarmProb.innerText = '0.02% Swarm Risk';
    overlay.classList.add('hidden');

    if (oscillator) {
      oscillator.frequency.setTargetAtTime(218, audioCtx.currentTime, 0.1);
    }
    showToast('Acoustic Spectrum normalized: Queen Right (218 Hz)', 'info');
  } else {
    btnCalm.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 transition-all';
    btnStress.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500 text-white border border-rose-600 shadow-sm transition-all animate-pulse';
    statusVal.className = 'text-xl sm:text-2xl font-extrabold text-rose-600 tracking-tight';
    statusVal.innerText = '⚠️ Swarm Warning Detected';
    dominantFreq.innerText = '460 Hz (Piping)';
    swarmProb.className = 'font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded';
    swarmProb.innerText = '89.4% Swarm Probability';
    overlay.classList.remove('hidden');

    if (oscillator) {
      oscillator.frequency.setTargetAtTime(460, audioCtx.currentTime, 0.1);
    }
    showToast('⚠️ Bio-Acoustic Alert: High Frequency Queen Piping (460 Hz)', 'warning');
  }
}

function toggleAudioSynth() {
  const btn = document.getElementById('global-audio-btn');
  const icon = document.getElementById('audio-icon');

  if (!state.audioPlaying) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      oscillator.type = 'sawtooth';
      const targetFreq = state.acousticMode === 'calm' ? 218 : 460;
      oscillator.frequency.setValueAtTime(targetFreq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime); // Soft gentle volume

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();

      state.audioPlaying = true;
      btn.classList.add('bg-honey-500', 'text-white');
      btn.classList.remove('bg-honey-100', 'text-honey-800');
      icon.className = 'fa-solid fa-volume-high text-sm animate-pulse';
      showToast('🔊 Bio-Acoustic Audio Synthesizer: ON', 'info');
    } catch (e) {
      console.error('Web Audio error:', e);
    }
  } else {
    if (gainNode) {
      gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      setTimeout(() => {
        if (oscillator) oscillator.stop();
        if (audioCtx) audioCtx.close();
        audioCtx = null;
        oscillator = null;
        gainNode = null;
      }, 100);
    }
    state.audioPlaying = false;
    btn.classList.remove('bg-honey-500', 'text-white');
    btn.classList.add('bg-honey-100', 'text-honey-800');
    icon.className = 'fa-solid fa-volume-xmark text-sm';
    showToast('🔇 Bio-Acoustic Audio Synthesizer: OFF', 'info');
  }
}

// Canvas Visualizer Loop
function initAcousticCanvas() {
  const canvas = document.getElementById('acoustic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio || 600;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio || 200;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let phase = 0;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += width / 8) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += height / 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Dynamic wave spectrum
    const isStress = state.acousticMode === 'stress';
    const primaryFreq = isStress ? 460 : 218;

    // Draw FFT Background Fill
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x < width; x += 3) {
      const normX = x / width; // 0 to 1
      const freq = 100 + normX * 500; // 100Hz to 600Hz

      // Peak calculation
      const distFromPeak = Math.abs(freq - primaryFreq);
      const peakAmp = Math.exp(-Math.pow(distFromPeak / (isStress ? 25 : 35), 2)) * (height * 0.75);

      // Noise & Harmonic overtones
      const harmonic2 = Math.exp(-Math.pow(Math.abs(freq - primaryFreq * 2) / 30, 2)) * (height * 0.25);
      const subHarmonic = Math.exp(-Math.pow(Math.abs(freq - 140) / 20, 2)) * (height * 0.15);
      const noise = Math.sin(phase + x * 0.05) * 4 + (Math.random() - 0.5) * 6;

      const yVal = height - (peakAmp + harmonic2 + subHarmonic + noise + 10);
      ctx.lineTo(x, Math.max(10, Math.min(height - 5, yVal)));
    }

    ctx.lineTo(width, height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    if (isStress) {
      grad.addColorStop(0, 'rgba(244, 63, 94, 0.7)');
      grad.addColorStop(1, 'rgba(244, 63, 94, 0.05)');
    } else {
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.7)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0.05)');
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw Crisp Top Contour Line
    ctx.beginPath();
    for (let x = 0; x < width; x += 3) {
      const normX = x / width;
      const freq = 100 + normX * 500;
      const distFromPeak = Math.abs(freq - primaryFreq);
      const peakAmp = Math.exp(-Math.pow(distFromPeak / (isStress ? 25 : 35), 2)) * (height * 0.75);
      const harmonic2 = Math.exp(-Math.pow(Math.abs(freq - primaryFreq * 2) / 30, 2)) * (height * 0.25);
      const subHarmonic = Math.exp(-Math.pow(Math.abs(freq - 140) / 20, 2)) * (height * 0.15);
      const noise = Math.sin(phase + x * 0.05) * 4 + (Math.random() - 0.5) * 6;

      const yVal = height - (peakAmp + harmonic2 + subHarmonic + noise + 10);
      if (x === 0) ctx.moveTo(x, yVal);
      else ctx.lineTo(x, yVal);
    }
    ctx.strokeStyle = isStress ? '#fb7185' : '#f97316';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = isStress ? '#f43f5e' : '#ea580c';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    phase += 0.08;
    canvasAnimId = requestAnimationFrame(render);
  }

  render();
}

// =========================================================================
// 4. LAB SPECTRAL NMR ANALYSIS & CHART.JS
// =========================================================================
let nmrChart = null;

function initNMRChart() {
  const ctx = document.getElementById('nmr-chart');
  if (!ctx) return;

  const labels = [];
  const sampleData = [];
  const referenceData = [];

  // Generate 400 MHz resonance spectrum points (ppm 1.0 to 5.5)
  for (let ppm = 1.0; ppm <= 5.5; ppm += 0.05) {
    const p = parseFloat(ppm.toFixed(2));
    labels.push(`${p} ppm`);

    // Natural honey peaks at Glucose (3.2-3.8), Fructose (3.6-4.1), and Leptosperin marker (5.2 ppm)
    let peak1 = Math.exp(-Math.pow((p - 3.4) / 0.15, 2)) * 85;
    let peak2 = Math.exp(-Math.pow((p - 3.8) / 0.18, 2)) * 95;
    let peak3 = Math.exp(-Math.pow((p - 5.2) / 0.08, 2)) * 60; // Leptosperin biomarker
    let baseNoise = Math.sin(p * 15) * 2 + 5;

    let refVal = peak1 + peak2 + peak3 + baseNoise;
    let sampleVal = refVal + (Math.random() - 0.5) * 3;

    referenceData.push(parseFloat(refVal.toFixed(1)));
    sampleData.push(parseFloat(sampleVal.toFixed(1)));
  }

  nmrChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Batch Sample NMR (HC-NZ-8829)',
          data: sampleData,
          borderColor: '#556c22',
          backgroundColor: 'rgba(85, 108, 34, 0.12)',
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        },
        {
          label: 'Authentic Reference Benchmark',
          data: referenceData,
          borderColor: '#94a3b8',
          borderWidth: 1.5,
          borderDash: [4, 4],
          fill: false,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
          bodyFont: { family: 'JetBrains Mono', size: 10 },
          padding: 8,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(241, 245, 249, 0.8)' },
          ticks: {
            maxTicksLimit: 8,
            font: { family: 'JetBrains Mono', size: 10 }
          }
        },
        y: {
          grid: { color: 'rgba(241, 245, 249, 0.8)' },
          ticks: {
            font: { family: 'JetBrains Mono', size: 10 }
          }
        }
      }
    }
  });
}

function runLabNMRScan() {
  const btn = document.getElementById('btn-run-nmr');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Acquiring FID Signals...</span>';

  showToast('Acquiring 400 MHz FID Signal from portable NMR probe...', 'info');

  setTimeout(() => {
    // Regenerate random slight variation
    if (nmrChart) {
      const newSampleData = nmrChart.data.datasets[1].data.map(v => Math.max(2, v + (Math.random() - 0.5) * 2));
      nmrChart.data.datasets[0].data = newSampleData;
      nmrChart.update();
    }

    // Generate fresh SHA256 digest
    const newHash = generatePseudoHash('NMR-SCAN-PASS-' + Date.now());
    document.getElementById('lab-sha256-hash').innerText = newHash;

    btn.disabled = false;
    btn.innerHTML = originalHtml;
    showToast('✓ NMR Scan Complete: 100% Match with Certified Benchmark Standard', 'success');
  }, 1200);
}

function commitLabCert() {
  const btn = document.getElementById('btn-commit-cert');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Minting ZK-Cert...</span>';

  // Confetti celebration
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#556c22', '#68822d', '#f97316', '#fb923c', '#bdd29b']
    });
  }

  setTimeout(() => {
    state.blockHeight += 1;
    document.getElementById('current-block-height').innerText = state.blockHeight.toLocaleString();

    const newTxHash = generatePseudoHash('ZK-LAB-CERT-' + state.blockHeight);
    const newBlock = {
      height: state.blockHeight,
      txHash: newTxHash,
      prevHash: state.blocks[0].txHash,
      merkleRoot: generatePseudoHash('MERKLE-' + state.blockHeight).substring(0, 34),
      type: 'ZK_LAB_CERT_MINTED',
      title: 'Zero-Knowledge Lab Certificate',
      batchId: 'HC-NZ-8829',
      timestamp: 'Just now',
      details: {
        channel: 'honey-provenance-mainnet',
        contract: 'HoneychainZKCert_v2',
        batchId: 'HC-NZ-8829',
        zkProofStatus: 'VERIFIED_GROTH16',
        purityConfidence: '99.98%',
        hmfGrade: 'Grade A (< 10 mg/kg)',
        validatorNode: 'peer0.eurofins-lab.nz'
      }
    };

    state.blocks.unshift(newBlock);
    renderBlockStream();

    btn.disabled = false;
    btn.innerHTML = originalHtml;
    showToast(`✓ Block #${state.blockHeight} Minted: ZK Lab Certificate appended to Hyperledger Fabric!`, 'success');
  }, 1000);
}

// =========================================================================
// 5. CONSUMER QR SCANNER & TIMELINE INTERACTIONS
// =========================================================================
function triggerMobileScan() {
  showToast('📷 Camera scanner activated. Reading tamper-proof QR code...', 'info');

  // Haptic feedback & flash effect
  const phone = document.querySelector('.scanner-laser');
  if (phone) {
    phone.style.boxShadow = '0 0 20px #10b981';
  }

  setTimeout(() => {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7, x: 0.25 },
        colors: ['#556c22', '#f97316', '#68822d']
      });
    }
    showToast('✓ Cryptographic Passport Verified: 100% Authentic Manuka Honey!', 'success');
    if (phone) {
      phone.style.boxShadow = '0 0 12px #556c22';
    }
  }, 900);
}

function changeJarSample(val) {
  state.activeSample = val;
  if (val === 'jar1') {
    showToast('Loaded Batch #HC-NZ-8829 (Canterbury Alpine Manuka)', 'info');
  } else {
    showToast('Loaded Batch #HC-OT-4102 (Central Otago Thyme & Clover)', 'info');
  }
}

function showTxDetail(stepIndex) {
  const stepsData = [
    {
      title: 'Step 1: Smart Hive Bio-Acoustics & IoT Telemetry',
      block: 4810,
      hash: '0x4f81902a77cc19283bb90192e48220019fae881024bbac7108920192ea018281',
      payload: {
        step: 'SMART_HIVE_MONITORING',
        hiveId: 'HIVE-NZ-ALPINE-01',
        gps: '-43.1415, 171.7120',
        coreBroodTempC: 34.8,
        ambientHumidity: '58.4%',
        dominantFrequency: '218 Hz (Calm Queen Right)',
        solarVoltage: '4.18 V',
        sensorSignature: 'ECDSA_MEMS_NODE_014_VALID'
      }
    },
    {
      title: 'Step 2: Sustainable Harvest & Cold Centrifuge Extraction',
      block: 4814,
      hash: '0x8a1b44c192f00a87612c481977bca88921e540198ca11082bbca7100e4810284',
      payload: {
        step: 'HARVEST_EXTRACTION',
        beekeeperCert: 'NZ-BEEKEEPER-REG-552',
        batchGrossWeightKg: 42.5,
        cappingsMoisture: '16.2%',
        extractionTemperatureC: 32.4,
        unheatedRawStatus: true
      }
    },
    {
      title: 'Step 3: Portable NMR Spectral & Isotope Lab Certification',
      block: 4818,
      hash: '0x3d4ee3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852',
      payload: {
        step: 'LAB_SPECTRAL_VERIFICATION',
        spectrometerModel: 'Magritek Spinsolve 400 MHz',
        c4SugarIsotopeDelta: '-26.8‰ (Natural Plant Isotope)',
        adulterationPercentage: '0.00%',
        hmfFreshness: '8.2 mg/kg (< 40 Codex limit)',
        mgoPotencyMgKg: 562,
        leptosperinMarkerPpm: 5.2
      }
    },
    {
      title: 'Step 4: Tamper-Evident NFC Cryptographic Bottling',
      block: 4819,
      hash: '0x7c99f821a003bb4c5e21941df089bc21a8d052b6e51aa749102c98d0092f1',
      payload: {
        step: 'NFC_BOTTLING_SEAL',
        nfcChipId: 'NTAG424-DNA-098273',
        merkleRoot: '0x5fa1098e21a7bb02187cc899a710eecb08a1',
        zkProofType: 'Groth16_Zero_Knowledge_Authenticity',
        retailDestination: 'Auckland & International Organic Direct'
      }
    }
  ];

  const data = stepsData[stepIndex - 1];
  if (!data) return;

  document.getElementById('modal-title').innerText = data.title;
  document.getElementById('modal-subtitle').innerText = `Block #${data.block}`;
  document.getElementById('modal-hash').innerText = data.hash;
  document.getElementById('modal-payload').innerText = JSON.stringify(data.payload, null, 2);
  openLedgerModal();
}

// =========================================================================
// 6. BLOCKCHAIN LEDGER STREAM & MODAL INSPECTOR
// =========================================================================
function renderBlockStream() {
  const container = document.getElementById('blockchain-stream');
  if (!container) return;

  container.innerHTML = '';
  state.blocks.forEach((blk, idx) => {
    const card = document.createElement('div');
    card.className = 'p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 transition-all cursor-pointer group shadow-sm flex flex-col justify-between';
    card.onclick = () => openBlockDetail(idx);

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="font-mono font-bold text-slate-900 flex items-center gap-1.5">
            <i class="fa-solid fa-cube text-honey-500 text-[10px]"></i>
            Block #${blk.height}
          </span>
          <span class="text-[10px] text-slate-400 font-medium">${blk.timestamp}</span>
        </div>
        <h5 class="font-bold text-slate-800 text-xs truncate group-hover:text-honey-700 transition-colors">${blk.title}</h5>
        <div class="mt-2 text-[10px] font-mono text-slate-500 truncate">
          ${blk.txHash.substring(0, 18)}...${blk.txHash.substring(blk.txHash.length - 6)}
        </div>
      </div>
      <div class="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
        <span class="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">✓ Confirmed</span>
        <span class="text-slate-400 group-hover:text-slate-700 font-semibold">Inspect <i class="fa-solid fa-arrow-right text-[8px]"></i></span>
      </div>
    `;
    container.appendChild(card);
  });
}

function openBlockDetail(index) {
  const blk = state.blocks[index];
  if (!blk) return;

  document.getElementById('modal-title').innerText = blk.title;
  document.getElementById('modal-subtitle').innerText = `Block #${blk.height} • Channel: honey-provenance-mainnet`;
  document.getElementById('modal-hash').innerText = blk.txHash;
  document.getElementById('modal-prev-hash').innerText = blk.prevHash;
  document.getElementById('modal-merkle').innerText = blk.merkleRoot;
  document.getElementById('modal-payload').innerText = JSON.stringify(blk.details, null, 2);

  openLedgerModal();
}

function openLedgerModal() {
  document.getElementById('ledger-modal').classList.remove('hidden');
}

function closeLedgerModal() {
  document.getElementById('ledger-modal').classList.add('hidden');
}

function logBeekeeperTelemetryBlock() {
  state.blockHeight += 1;
  document.getElementById('current-block-height').innerText = state.blockHeight.toLocaleString();

  const newHash = generatePseudoHash('HIVE-IOT-BLOCK-' + state.blockHeight);
  const newBlock = {
    height: state.blockHeight,
    txHash: newHash,
    prevHash: state.blocks[0].txHash,
    merkleRoot: generatePseudoHash('ROOT-' + state.blockHeight).substring(0, 34),
    type: 'IOT_TELEMETRY_LOG',
    title: 'Smart Hive Telemetry Logged',
    batchId: state.currentHive,
    timestamp: 'Just now',
    details: {
      channel: 'honey-provenance-mainnet',
      contract: 'IoTHiveChaincode',
      hiveId: `HIVE-${state.currentHive.toUpperCase()}`,
      temperature: document.getElementById('hive-temp-val').innerText + '°C',
      weight: document.getElementById('hive-weight-val').innerText + ' kg',
      acousticStatus: document.getElementById('hive-acoustic-val').innerText,
      dominantFreq: document.getElementById('dominant-freq').innerText,
      minerNode: 'peer0.beekeeper-union.nz'
    }
  };

  state.blocks.unshift(newBlock);
  renderBlockStream();

  showToast(`✓ Telemetry Signed & Block #${state.blockHeight} Minted to Hyperledger Fabric`, 'success');
}

function simulateNewBlockEvent() {
  logBeekeeperTelemetryBlock();
}

// =========================================================================
// 7. UTILITY & HELPERS
// =========================================================================
function generatePseudoHash(seed) {
  let hash = '';
  const hexChars = '0123456789abcdef';
  for (let i = 0; i < 64; i++) {
    hash += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }
  return '0x' + hash;
}

function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied SHA-256 Hash to clipboard!', 'info');
  }).catch(() => {
    showToast('Hash copied', 'info');
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-slate-900 text-white border-emerald-500' :
                  type === 'warning' ? 'bg-rose-900 text-white border-rose-500' :
                  'bg-slate-900 text-white border-orange-500';

  toast.className = `p-3.5 rounded-2xl border-l-4 shadow-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto ${bgClass}`;
  
  let icon = 'fa-circle-info text-orange-400';
  if (type === 'success') icon = 'fa-circle-check text-emerald-400';
  if (type === 'warning') icon = 'fa-triangle-exclamation text-rose-400';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLedgerModal();
});

// INITIALIZATION ON DOM READY
document.addEventListener('DOMContentLoaded', () => {
  initAcousticCanvas();
  initNMRChart();
  renderBlockStream();
});
