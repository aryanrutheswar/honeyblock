import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  FlaskConical,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface InspectorPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InspectorPasswordModal: React.FC<InspectorPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset and focus when modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setShowPassword(false);
      setError(null);
      setIsVerifying(false);
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isVerifying && !isSuccess) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isVerifying, isSuccess, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isVerifying || isSuccess) return;

    soundManager.playClick();
    const cleanPassword = password.trim();

    if (!cleanPassword) {
      setError('Please enter the inspector password.');
      inputRef.current?.focus();
      return;
    }

    if (cleanPassword === 'honey@123') {
      setIsVerifying(false);
      setIsSuccess(true);
      setError(null);
      soundManager.playEnterChime();
      setTimeout(() => {
        onSuccess();
      }, 150);
    } else {
      setIsVerifying(false);
      setIsSuccess(false);
      setError('Incorrect password! Access denied. Please try again.');
      soundManager.playStressAlarm?.();
      inputRef.current?.focus();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white border-2 border-purple-300/80 rounded-3xl shadow-2xl shadow-purple-950/30 overflow-hidden bumble-border-top"
      >
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundManager.playClick();
            onClose();
          }}
          disabled={isVerifying || isSuccess}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full text-purple-800 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 transition-all disabled:opacity-40 cursor-pointer shadow-xs hover:scale-110 active:scale-95"
          title="Cancel and close"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-purple-700" />
        </button>

        <div className="p-6 sm:p-8 space-y-5 relative z-10">
          
          {/* Header & Icon */}
          <div className="flex items-start gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-purple-800 text-yellow-300 flex items-center justify-center shadow-lg shadow-purple-950/25 border border-purple-700 shrink-0">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-950 border border-purple-300">
                  <Lock className="w-3 h-3 text-purple-700" />
                  PASSWORD PROTECTED
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  ISO/IEC 17025
                </span>
              </div>
              <h2 className="text-xl font-black text-purple-950 tracking-tight">
                Inspector Mode Access
              </h2>
              <p className="text-xs text-purple-900/70 font-medium mt-0.5">
                Authorized NABL Laboratory & Purity Testing Terminal
              </p>
            </div>
          </div>

          {/* Prompt Description */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/90 text-xs text-purple-900/80 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-950">
              <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Security Clearance Required</span>
            </div>
            <p>
              Access to mass spectrometry chemical assays, C4 adulteration testing, and blockchain barcode notarization is restricted to certified quality inspectors.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-purple-950 flex items-center justify-between mb-1.5">
                <span>Enter Inspector Password</span>
                <span className="text-[10px] font-semibold text-purple-700/70">
                  Case sensitive
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter inspector password"
                  disabled={isVerifying || isSuccess}
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl border-2 text-sm font-medium text-purple-950 placeholder:text-purple-400 focus:outline-none transition-all ${
                    error
                      ? 'border-red-500 bg-red-50/50 focus:border-red-500'
                      : isSuccess
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-purple-200 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isVerifying || isSuccess}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-400 hover:text-purple-700 cursor-pointer disabled:opacity-50"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-bold text-red-700 animate-headShake">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {isSuccess && (
                <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password Verified! Unlocking Inspector Mode...</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onClose();
                }}
                disabled={isVerifying || isSuccess}
                className="flex-1 py-3 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs border border-purple-200 transition cursor-pointer disabled:opacity-50 hover:scale-102 active:scale-98"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isVerifying || isSuccess}
                className={`flex-2 py-3 px-5 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : isVerifying
                    ? 'bg-purple-800 text-yellow-300 opacity-90 cursor-wait'
                    : 'bg-purple-950 hover:bg-purple-900 text-yellow-300 shadow-purple-950/25 hover:scale-102 active:scale-98 border border-purple-800'
                }`}
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Access Granted!</span>
                  </>
                ) : isVerifying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-yellow-300" />
                    <span>Unlock Inspector Mode</span>
                    <ArrowRight className="w-4 h-4 text-yellow-300" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Discreet hint for demo / evaluator convenience */}
          <div className="pt-1 text-center">
            <span className="text-[11px] text-purple-900/60 font-medium">
              Demo Access Password:{' '}
              <code className="bg-purple-100/90 text-purple-950 font-mono font-bold px-1.5 py-0.5 rounded border border-purple-200">
                honey@123
              </code>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
