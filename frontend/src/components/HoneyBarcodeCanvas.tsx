import React, { useEffect, useRef } from 'react';
import { encodeEan13Bits, getEan13FromBatchId } from '../utils/sampleBarcodes';

interface HoneyBarcodeCanvasProps {
  batchId: string;
  barcodeNumber?: string;
  productName?: string;
  purityScore?: number | string;
  id?: string;
  className?: string;
  width?: number;
  height?: number;
  showScanBeam?: boolean;
}

export const HoneyBarcodeCanvas: React.FC<HoneyBarcodeCanvasProps> = ({
  batchId,
  barcodeNumber,
  productName,
  purityScore,
  id = 'inspector-barcode-canvas',
  className = '',
  width = 320,
  height = 190,
  showScanBeam = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Derive 13-digit EAN-13 number
  const ean13 = barcodeNumber || getEan13FromBatchId(batchId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use Device Pixel Ratio for crisp retina rendering
    const dpr = window.devicePixelRatio || 2;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 1. Clear background - clean white smart sticker
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Subtle sticker border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    // 2. Top Header Strip inside sticker
    ctx.fillStyle = '#fef3c7'; // warm amber tint
    ctx.fillRect(4, 4, width - 8, 26);

    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 9.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('HONEYCHAIN™ CERTIFIED AUTHENTIC', 14, 20);

    // Format badge
    ctx.fillStyle = '#1e1035';
    ctx.fillRect(width - 76, 8, 64, 18);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 8.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GS1 EAN-13', width - 44, 20);

    // 3. EAN-13 Barcode Calculation
    const bits = encodeEan13Bits(ean13);
    const startX = 36;
    const baseBarY = 44;
    const moduleWidth = (width - 74) / 95; // perfectly fits 95 modules
    const standardHeight = 72;
    const guardHeight = 84;

    // Draw module bars
    ctx.fillStyle = '#09090b';
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] === '1') {
        const isGuard = i < 3 || (i >= 45 && i < 50) || i >= 92;
        const h = isGuard ? guardHeight : standardHeight;
        const x = startX + i * moduleWidth;
        ctx.fillRect(x, baseBarY, moduleWidth + 0.1, h);
      }
    }

    // 4. Human-Readable EAN-13 Digits (Retail standard placement)
    const digits = ean13.padEnd(13, '0').slice(0, 13);
    const firstDigit = digits[0];
    const left6 = digits.slice(1, 7).split('').join(' ');
    const right6 = digits.slice(7, 13).split('').join(' ');

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "Courier New", Courier, monospace';

    // First digit (outside left guard)
    ctx.textAlign = 'right';
    ctx.fillText(firstDigit, startX - 7, baseBarY + standardHeight + 12);

    // Left group (under left data bars)
    const leftGroupCenterX = startX + (3 + 21) * moduleWidth;
    ctx.textAlign = 'center';
    ctx.fillText(left6, leftGroupCenterX, baseBarY + standardHeight + 12);

    // Right group (under right data bars)
    const rightGroupCenterX = startX + (50 + 21) * moduleWidth;
    ctx.textAlign = 'center';
    ctx.fillText(right6, rightGroupCenterX, baseBarY + standardHeight + 12);

    // Right chevron (outside right guard)
    ctx.textAlign = 'left';
    ctx.fillText('>', startX + 95 * moduleWidth + 5, baseBarY + standardHeight + 12);

    // 5. Digital Batch Subtitle & Status
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`BATCH: ${batchId}`, 14, height - 14);

    ctx.fillStyle = '#047857';
    ctx.textAlign = 'right';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('✓ NABL LAB NOTARIZED', width - 14, height - 14);

  }, [batchId, barcodeNumber, ean13, width, height]);

  return (
    <div className={`relative inline-block select-none overflow-hidden rounded-2xl bg-white shadow-md border-2 border-purple-200/80 ${className}`}>
      <canvas
        ref={canvasRef}
        id={id}
        style={{ width: `${width}px`, height: `${height}px`, display: 'block' }}
        className="rounded-2xl"
      />

      {/* Subtle Laser Scan Beam Effect */}
      {showScanBeam && (
        <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-75 shadow-xs shadow-amber-400 animate-pulse"
             style={{
               top: '40%',
               animation: 'scanLine 2.8s ease-in-out infinite alternate'
             }}
        />
      )}
    </div>
  );
};

export const BarcodeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5v14M6 5v14M9 5v10M12 5v14M15 5v10M18 5v14M21 5v14" />
  </svg>
);
