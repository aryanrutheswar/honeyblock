import React from 'react';
import { Info } from 'lucide-react';

interface DisclaimerProps {
  type?: 'spectral' | 'bioacoustic' | 'pollination' | 'general';
  customText?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerProps> = ({ type = 'general', customText }) => {
  const messages = {
    spectral: 'Machine-captured evidence & prototype AI-assisted screening; performance depends on calibration, reference datasets and device optics. Confirmatory laboratory testing (NABL/EA-IRMS) may be required for statutory certification.',
    bioacoustic: 'Research-grade bio-acoustic prototype inference. Colony frequency shifts indicate relative stress indicators and should be correlated with scheduled physical hive inspections.',
    pollination: 'Prototype digital pollination-service records. Designed for verified ecosystem activity and future integration with recognized carbon/biodiversity credit frameworks.',
    general: 'HoneyChain captures physical evidence, bio-acoustic intelligence, and preserves cryptographic provenance across permissioned ledger nodes.'
  };

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-slate-400">
      <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="leading-relaxed">
        <span className="font-semibold text-amber-300 mr-1">Technical Transparency Note:</span>
        {customText || messages[type]}
      </p>
    </div>
  );
};
