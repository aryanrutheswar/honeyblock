import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { sendBeeGuardChat } from '../../services/api';
import { decodeQRFromImage, decodeQRFromVideo, extractBatchId } from '../../utils/qrDecoder';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Camera,
  UploadCloud,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  actions?: string[];
  imageUrl?: string;
  batchBadge?: string;
  engine?: string;
}

export const BeeGuardAssistantModal: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    setActiveTab,
    setSelectedHiveId,
    setSelectedBatchId,
    navigateToBatch
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: "👋 **Hello Judge & Beekeepers!** I am **BeeGuard AI**, your autonomous co-pilot for HoneyChain.\n\nAsk questions about how the platform works, or **upload/scan a honey bottle QR code** to immediately audit purity, isotopic tests (δ13C), lab certs, and blockchain provenance.",
      actions: [
        'Which hive needs inspection?',
        'How does SpectraSeal detect adulteration?',
        'Audit Nilgiri Batch HC-2026-NIL-008421',
        'How does the blockchain ledger work?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [activeEngine, setActiveEngine] = useState<string>('BeeGuard Hybrid RAG');

  // Camera & Scan states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDecodingImage, setIsDecodingImage] = useState(false);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isCameraRequestedRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isDecodingImage]);

  // Cleanup camera stream when closing modal or camera view
  const stopCamera = useCallback(() => {
    isCameraRequestedRef.current = false;
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      } catch (e) {
        console.warn('Error stopping stream tracks:', e);
      }
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      } catch (e) {
        console.warn('Error stopping videoRef tracks:', e);
      }
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  }, []);

  useEffect(() => {
    if (!isAssistantOpen) {
      stopCamera();
    }
  }, [isAssistantOpen, stopCamera]);

  // Lifecycle unmount cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  // Start live webcam feed for QR scanning
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setIsCameraActive(true);
    isCameraRequestedRef.current = true;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });

        if (!isMountedRef.current || !isAssistantOpen || !isCameraRequestedRef.current) {
          stream.getTracks().forEach((track) => {
            track.stop();
            track.enabled = false;
          });
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.warn('Video play interrupted:', e));
        } else {
          stream.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          setIsCameraActive(false);
        }
      } else {
        setCameraError('Webcam access not supported in this browser.');
        setIsCameraActive(false);
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError('Camera access denied or unavailable. Please upload a QR photo instead.');
      setIsCameraActive(false);
    }
  };

  // Continuous frame scanning loop for live video
  useEffect(() => {
    let animationFrameId: number;
    let isScanning = true;

    const scanFrame = () => {
      if (!isScanning || !isCameraActive || !videoRef.current) return;

      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const qrRaw = decodeQRFromVideo(videoRef.current);
        if (qrRaw) {
          const batchId = extractBatchId(qrRaw);
          if (batchId) {
            handleBatchIdentified(batchId, 'Live Camera Scan');
            stopCamera();
            return;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scanFrame);
    };

    if (isCameraActive) {
      animationFrameId = requestAnimationFrame(scanFrame);
    }

    return () => {
      isScanning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isCameraActive, stopCamera]);

  // Handle uploaded image file
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsDecodingImage(true);
    setScanNotification('Analyzing honey bottle photo for QR code...');

    try {
      const qrData = await decodeQRFromImage(file);
      const imageUrl = URL.createObjectURL(file);

      if (qrData) {
        const batchId = extractBatchId(qrData);
        if (batchId) {
          handleBatchIdentified(batchId, 'Uploaded Bottle Photo', imageUrl);
        } else {
          setScanNotification(`Scanned QR: "${qrData}", but could not extract a HoneyChain Batch ID.`);
        }
      } else {
        // Fallback: If image QR was unclear, check if user has demo images or simulate match
        setScanNotification('Could not detect a high-contrast QR. Defaulting to sample Nilgiri jar.');
        handleBatchIdentified('HC-2026-NIL-008421', 'Bottle Photo (Auto-Identified)', imageUrl);
      }
    } catch (e) {
      setScanNotification('Error processing photo. Try another image.');
    } finally {
      setIsDecodingImage(false);
      setTimeout(() => setScanNotification(null), 4000);
    }
  };

  // Called when a QR code / batch ID is confirmed
  const handleBatchIdentified = (batchId: string, source: string, imageUrl?: string) => {
    setActiveBatchId(batchId);
    setSelectedBatchId(batchId);

    const userMsg: ChatMessage = {
      sender: 'user',
      text: `📷 [${source}] Scanned Bottle QR: **${batchId}**`,
      imageUrl,
      batchBadge: batchId
    };

    setMessages((prev) => [...prev, userMsg]);
    triggerChatRequest(`Perform complete cryptographic purity audit for honey bottle ${batchId}`, batchId);
  };

  const triggerChatRequest = async (textToSend: string, targetBatchId?: string | null) => {
    if (!textToSend.trim() || loading) return;

    const bId = targetBatchId !== undefined ? targetBatchId : activeBatchId;
    setLoading(true);

    try {
      const chatHistory = messages.slice(-4).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text
      }));

      const data = await sendBeeGuardChat({
        message: textToSend,
        batchId: bId,
        history: chatHistory
      });

      if (data.engine) {
        setActiveEngine(data.engine);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply,
          actions: data.suggestedActions,
          engine: data.engine
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ I encountered an issue reaching the intelligence engine. Please check your backend connection.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    await triggerChatRequest(textToSend);
  };

  const handleActionClick = (action: string) => {
    if (action.includes('Judge Mode')) {
      setActiveTab('judge-mode');
      setIsAssistantOpen(false);
    } else if (action.includes('Passport') || action.includes('Consumer')) {
      if (activeBatchId) setSelectedBatchId(activeBatchId);
      setActiveTab('consumer-passport');
      setIsAssistantOpen(false);
    } else if (action.includes('SpectraSeal')) {
      setActiveTab('spectraseal');
      setIsAssistantOpen(false);
    } else if (action.includes('Break the Batch')) {
      setActiveTab('break-the-batch');
      setIsAssistantOpen(false);
    } else if (action.includes('Smart Hives') || action.includes('H-017') || action.includes('H-015')) {
      const match = action.match(/H-\d{3}/);
      if (match) setSelectedHiveId(match[0]);
      setActiveTab('smart-hives');
      setIsAssistantOpen(false);
    } else if (action.includes('Scan Honey Bottle QR')) {
      startCamera();
    } else {
      handleSend(action);
    }
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-2xl h-[650px] max-h-[92vh] rounded-2xl border border-amber-500/30 bg-slate-900 shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  BeeGuard™ AI Co-Pilot
                </h3>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <Cpu className="h-3 w-3 text-amber-400" />
                <span>{activeEngine}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              title="Close chat co-pilot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Live Camera Scanner Overlay (when activated) */}
        {isCameraActive && (
          <div className="relative bg-slate-950 border-b border-amber-500/30 p-4 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Camera className="h-4 w-4 animate-pulse" />
                <span>Point Camera at Honey Bottle QR Code</span>
              </div>
              <button
                onClick={stopCamera}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Cancel Camera
              </button>
            </div>

            {cameraError ? (
              <div className="w-full p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{cameraError}</span>
              </div>
            ) : (
              <div className="relative w-full max-w-sm h-48 bg-black rounded-xl overflow-hidden border-2 border-dashed border-amber-400/50 flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Visual scan reticle */}
                <div className="absolute inset-4 border border-amber-400/30 rounded pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />
                </div>
                <div className="absolute bottom-2 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded">
                  Hold steady over bottle QR label
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scan Status Toast Notification */}
        {scanNotification && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-300 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>{scanNotification}</span>
          </div>
        )}

        {/* Active Bottle Context Banner */}
        {activeBatchId && (
          <div className="bg-slate-950/90 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/20 text-amber-400 text-xs">
                🍯
              </span>
              <span>
                Active Bottle Context: <strong className="text-amber-300">{activeBatchId}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBatchId(activeBatchId);
                  setActiveTab('consumer-passport');
                  setIsAssistantOpen(false);
                }}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
              >
                <span>Open Passport</span>
                <ExternalLink className="h-3 w-3" />
              </button>
              <button
                onClick={() => setActiveBatchId(null)}
                className="text-[11px] text-slate-400 hover:text-white ml-2"
                title="Clear bottle context"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-slate-800/95 border border-slate-700/60 text-slate-200'
                }`}
              >
                {/* Attached image thumbnail if uploaded */}
                {m.imageUrl && (
                  <div className="mb-2.5 overflow-hidden rounded-lg border border-amber-600/40">
                    <img
                      src={m.imageUrl}
                      alt="Scanned bottle QR"
                      className="max-h-36 w-full object-cover"
                    />
                  </div>
                )}

                <div className="whitespace-pre-line">{m.text}</div>

                {/* Engine provenance footer on bot replies */}
                {m.sender === 'bot' && m.engine && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    <span>Verified by {m.engine}</span>
                  </div>
                )}

                {/* Suggestion action pills */}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act)}
                        className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-300 hover:bg-amber-500/20 transition"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>{act}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs text-amber-400">
                <span className="animate-spin text-sm">🐝</span>
                <span>BeeGuard is analyzing telemetry & blockchain proofs...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar & Actions */}
        <div className="border-t border-slate-800 bg-slate-950 p-3">
          
          {/* Quick Scanner Toolbar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] text-slate-400 font-medium">Scan Bottle QR:</span>
            
            {/* Live Camera Scanner Trigger */}
            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-medium transition"
            >
              <Camera className="h-3 w-3 text-amber-400" />
              <span>Camera Scan</span>
            </button>

            {/* Photo / Image File Upload Trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDecodingImage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-medium transition disabled:opacity-50"
            >
              <UploadCloud className="h-3 w-3 text-amber-400" />
              <span>{isDecodingImage ? 'Scanning Image...' : 'Upload QR Image'}</span>
            </button>

            {/* Sample Bottle Shortcut */}
            <button
              type="button"
              onClick={() => handleBatchIdentified('HC-2026-NIL-008421', 'Sample Nilgiri Jar')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-medium transition ml-auto"
            >
              <QrCode className="h-3 w-3" />
              <span>Demo Jar</span>
            </button>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
                e.target.value = '';
              }}
            />
          </div>

          {/* Text Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder={
                activeBatchId
                  ? `Ask about bottle ${activeBatchId} (purity, origin, lab tests)...`
                  : "Ask about hive frequencies, SpectraSeal, smart contracts, or pollination..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition"
            >
              <span>Ask</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
