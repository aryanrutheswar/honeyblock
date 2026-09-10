import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { X, ExternalLink, Check, Copy, ShieldCheck, Sparkles } from 'lucide-react';

export const QRCodeModal: React.FC = () => {
  const { qrModalBatch, setQrModalBatch, navigateToBatch } = useApp();
  const [copied, setCopied] = useState(false);

  if (!qrModalBatch) return null;

  const origin = window.location.origin;
  const fullUrl = `${origin}/verify/${qrModalBatch}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-md rounded-2xl border border-amber-500/30 bg-slate-900 shadow-2xl p-6 text-center">
        
        {/* Close Button */}
        <button
          onClick={() => setQrModalBatch(null)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
          <ShieldCheck className="h-6 w-6" />
        </div>

        <h3 className="text-base font-bold text-white">
          Cryptographic Honey Passport QR
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4 font-mono">
          Batch: {qrModalBatch}
        </p>

        {/* Dynamic QR Code Container */}
        <div className="mx-auto my-2 rounded-2xl bg-white p-4 shadow-xl border-4 border-amber-500/30">
          <QRCodeSVG
            value={fullUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
          Scan with any mobile camera to view the full tamper-evident journey from hive bio-acoustics to NIR spectral screen.
        </p>

        {/* Link and Action buttons */}
        <div className="mt-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-slate-950 border border-slate-800 p-2 text-left">
            <span className="truncate text-[11px] text-slate-400 font-mono flex-1">
              {fullUrl}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              setQrModalBatch(null);
              navigateToBatch(qrModalBatch);
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open Honey Passport Directly</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
