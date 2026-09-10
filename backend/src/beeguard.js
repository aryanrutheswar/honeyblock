import { DB } from './db.js';

// Frequency bands for spectrogram representation (Hz)
const FREQ_BINS = [100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000];

export function generateAcousticSpectrogram(condition = 'Healthy Colony') {
  const timeSlices = 16; // 16 time steps
  const spectrogram = [];

  for (let t = 0; t < timeSlices; t++) {
    const slice = {
      timeIndex: t,
      timeLabel: `-${(timeSlices - t) * 0.5}s`,
      frequencies: FREQ_BINS.map(f => {
        let intensity = 0.1; // Baseline ambient noise

        if (condition === 'Healthy Colony') {
          // Dominant healthy foraging & nurse bee hum around 200-250Hz
          if (f >= 200 && f <= 250) {
            intensity = 0.85 + 0.1 * Math.sin(t * 0.8);
          } else if (f >= 150 && f <= 300) {
            intensity = 0.45 + 0.08 * Math.cos(t * 0.5);
          } else {
            intensity = 0.12 + 0.05 * Math.random();
          }
        } else if (condition === 'Queenlessness Risk') {
          // Distressed roaring spread out in 300-450Hz, absence of queen rhythm
          if (f >= 300 && f <= 450) {
            intensity = 0.88 + 0.08 * Math.sin(t * 1.2);
          } else if (f >= 200 && f <= 250) {
            intensity = 0.30; // Depressed normal hum
          } else {
            intensity = 0.20 + 0.05 * Math.random();
          }
        } else if (condition === 'Swarming Risk') {
          // Sharp energetic spikes in 450-600Hz (pre-swarm flight preparation & high vibration)
          if (f >= 450 && f <= 600) {
            intensity = 0.95 + 0.05 * Math.sin(t * 1.5);
          } else if (f >= 200 && f <= 300) {
            intensity = 0.70;
          } else {
            intensity = 0.25 + 0.06 * Math.random();
          }
        } else if (condition === 'Heat Stress') {
          // Continuous aggressive fanning frequency around 280-340Hz
          if (f >= 250 && f <= 350) {
            intensity = 0.92 + 0.06 * Math.sin(t * 2.0);
          } else {
            intensity = 0.20;
          }
        } else if (condition === 'Environmental Stress') {
          // Muffled, low energy response, suppression across all bands
          if (f >= 150 && f <= 250) {
            intensity = 0.38 + 0.04 * Math.random();
          } else {
            intensity = 0.10 + 0.03 * Math.random();
          }
        } else if (condition === 'Food Shortage') {
          // Intermittent low buzzing, erratic bursts
          if (f >= 180 && f <= 250) {
            intensity = (t % 3 === 0) ? 0.65 : 0.25;
          } else {
            intensity = 0.15;
          }
        }

        return {
          frequencyHz: f,
          intensity: parseFloat(Math.min(1.0, Math.max(0.05, intensity)).toFixed(2))
        };
      })
    };
    spectrogram.push(slice);
  }

  // Generate 32-point raw waveform
  const waveform = [];
  for (let i = 0; i < 32; i++) {
    let val = 0;
    if (condition === 'Healthy Colony') {
      val = 0.5 * Math.sin(i * 0.45) + 0.2 * Math.sin(i * 0.9);
    } else if (condition === 'Swarming Risk') {
      val = 0.85 * Math.sin(i * 0.95) + 0.4 * Math.sin(i * 1.9);
    } else if (condition === 'Queenlessness Risk') {
      val = 0.7 * Math.sin(i * 0.75) + 0.3 * Math.cos(i * 1.3);
    } else if (condition === 'Heat Stress') {
      val = 0.75 * Math.sin(i * 0.6) + 0.15 * (Math.random() - 0.5);
    } else {
      val = 0.35 * Math.sin(i * 0.3) + 0.1 * (Math.random() - 0.5);
    }
    waveform.push({
      sampleIndex: i,
      amplitude: parseFloat(val.toFixed(2))
    });
  }

  return { spectrogram, waveform };
}

export function simulateHiveCondition(hiveId, condition) {
  const hive = DB.hives.find(h => h.id === hiveId);
  if (!hive) throw new Error(`Hive ${hiveId} not found`);

  hive.condition = condition;

  if (condition === 'Healthy Colony') {
    hive.healthScore = 95;
    hive.queenStatus = 'Queen Active & Laying (Inferred)';
    hive.swarmingRisk = 12;
    hive.tempC = 34.7;
    hive.humidityPct = 58.0;
    hive.vibrationHz = 195;
    hive.soundRms = 0.60;
    hive.acousticFrequencyHz = 220;
    hive.inspectionPriority = 'LOW';
    hive.yieldPredictionKg = 15.2;
    hive.aiConfidence = 96.5;
    hive.whyPrediction = 'Stable brood thermoregulation (34.7°C), harmonious 220Hz colony hum, steady weight gain.';
  } else if (condition === 'Queenlessness Risk') {
    hive.healthScore = 58;
    hive.queenStatus = 'Queen Absent / Inactive (Piping Absent)';
    hive.swarmingRisk = 25;
    hive.tempC = 32.0;
    hive.humidityPct = 67.5;
    hive.vibrationHz = 310;
    hive.soundRms = 0.89;
    hive.acousticFrequencyHz = 360;
    hive.inspectionPriority = 'HIGH';
    hive.yieldPredictionKg = 5.8;
    hive.aiConfidence = 89.4;
    hive.whyPrediction = 'High-frequency distressed roaring (360Hz), missing queen piping harmonic, brood nest temperature drop.';
    
    // Create Alert
    DB.alerts.unshift({
      id: `ALT-HQ-${Math.floor(100 + Math.random() * 900)}`,
      title: `Queenlessness Risk in Hive ${hive.id}`,
      hiveId: hive.id,
      severity: 'HIGH',
      category: 'HIVE_DISTRESS',
      timestamp: new Date().toISOString(),
      message: `Acoustic inference model identified absence of queen harmonics with confidence 89.4%.`,
      action: 'Schedule physical hive inspection to confirm queen presence.',
      resolved: false
    });
  } else if (condition === 'Swarming Risk') {
    hive.healthScore = 72;
    hive.queenStatus = 'Queen Cells Detected (Inferred)';
    hive.swarmingRisk = 88;
    hive.tempC = 35.8;
    hive.humidityPct = 65.0;
    hive.vibrationHz = 280;
    hive.soundRms = 0.95;
    hive.acousticFrequencyHz = 485;
    hive.inspectionPriority = 'URGENT';
    hive.yieldPredictionKg = 8.1;
    hive.aiConfidence = 92.0;
    hive.whyPrediction = 'Sharp power surge in 450-500Hz band (pre-swarm excitement) + congestion weight plateau.';

    // Create Alert
    DB.alerts.unshift({
      id: `ALT-SW-${Math.floor(100 + Math.random() * 900)}`,
      title: `URGENT: Swarming Risk Detected in ${hive.id}`,
      hiveId: hive.id,
      severity: 'URGENT',
      category: 'HIVE_DISTRESS',
      timestamp: new Date().toISOString(),
      message: `Swarming probability spiked to 88% based on acoustic flight preparation vibrations.`,
      action: 'Perform immediate hive split or provide additional super boxes.',
      resolved: false
    });
  } else if (condition === 'Heat Stress') {
    hive.healthScore = 67;
    hive.queenStatus = 'Queen Active (Stressed)';
    hive.swarmingRisk = 30;
    hive.tempC = 38.2;
    hive.humidityPct = 81.0;
    hive.vibrationHz = 240;
    hive.soundRms = 0.84;
    hive.acousticFrequencyHz = 315;
    hive.inspectionPriority = 'MEDIUM';
    hive.yieldPredictionKg = 7.0;
    hive.aiConfidence = 88.5;
    hive.whyPrediction = 'Persistent thermal fanning acoustics (315Hz) as colony combats overheating (38.2°C).';
  } else if (condition === 'Environmental Stress') {
    hive.healthScore = 62;
    hive.queenStatus = 'Queen Laying Reduced';
    hive.swarmingRisk = 10;
    hive.tempC = 33.1;
    hive.humidityPct = 47.0;
    hive.vibrationHz = 160;
    hive.soundRms = 0.40;
    hive.acousticFrequencyHz = 170;
    hive.inspectionPriority = 'HIGH';
    hive.yieldPredictionKg = 4.2;
    hive.aiConfidence = 87.0;
    hive.whyPrediction = 'Subdued acoustic signature, reduced flight activity, localized environmental stress.';
  } else if (condition === 'Food Shortage') {
    hive.healthScore = 60;
    hive.queenStatus = 'Queen Present';
    hive.swarmingRisk = 5;
    hive.foodStores = '1.0 kg Honey (Emergency)';
    hive.weightKg = 23.5;
    hive.inspectionPriority = 'HIGH';
    hive.yieldPredictionKg = 1.9;
    hive.aiConfidence = 93.0;
    hive.whyPrediction = 'Accelerated weight loss (-410g/day) and low energy acoustic pattern indicate starvation risk.';
  }

  const acousticData = generateAcousticSpectrogram(condition);

  return {
    hive,
    acousticData,
    disclaimer: 'Research-grade prototype inference; acoustic patterns should be validated with physical hive inspection.'
  };
}
