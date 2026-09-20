import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Radio,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BeekeeperPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BeekeeperPasswordModal: React.FC<BeekeeperPasswordModalProps> = ({
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
      setError('Please enter the beekeeper password.');
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
        className="relative w-full max-w-md bg-white border-2 border-amber-300/80 rounded-3xl shadow-2xl shadow-purple-950/30 overflow-hidden bumble-border-top"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
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
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full text-amber-900 hover:text-purple-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 transition-all disabled:opacity-40 cursor-pointer shadow-xs hover:scale-110 active:scale-95"
          title="Cancel and close"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-amber-800" />
        </button>

        <div className="p-6 sm:p-8 space-y-5 relative z-10">
          {/* Header & Icon */}
          <div className="flex items-start gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 text-purple-950 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-400 shrink-0">
              <Radio className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                  <Lock className="w-3 h-3 text-amber-700" />
                  PASSWORD PROTECTED
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Apiary IoT Node
                </span>
              </div>
              <h2 className="text-xl font-black text-purple-950 tracking-tight">
                Beekeeper Mode Access
              </h2>
              <p className="text-xs text-purple-900/65 mt-0.5 font-medium">
                Enter your authorized credentials to access Smart Hive telemetry, acoustic sensor data, and batch minting.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-purple-950 flex items-center justify-between">
                <span>Enter Beekeeper Password</span>
                <span className="text-[10px] text-amber-700 font-semibold">
                  Default: honey@123
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-600">
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
                  placeholder="Enter honey@123"
                  disabled={isVerifying || isSuccess}
                  className={`w-full pl-10 pr-11 py-3 bg-purple-50/40 border-2 rounded-2xl text-sm font-semibold text-purple-950 placeholder:text-purple-300 focus:outline-none transition-all ${
                    error
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : isSuccess
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-400 hover:text-purple-700 transition cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Access Granted! Opening Beekeeper Workspace...</span>
              </div>
            )}

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isVerifying || isSuccess}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isVerifying || isSuccess}
                className="flex-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 border border-amber-300"
              >
                {isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-purple-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-purple-950" />
                    <span>Unlocked!</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Beekeeper Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Helper Hint */}
          <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-[11px] text-purple-900/60 font-medium">
            <span>Authentication Requirement</span>
            <span className="font-mono font-bold text-amber-700">honey@123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
