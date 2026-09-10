import React, { useState, useEffect } from 'react';
import { useHoneychain } from '../context/HoneychainContext';
import {
  Fingerprint,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  X,
  ScanLine,
  ScanFace,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  FlaskConical
} from 'lucide-react';

export const BiometricModal: React.FC = () => {
  const {
    isBiometricModalOpen,
    biometricTargetRole,
    closeBiometricModal,
    biometricState,
    triggerBiometricScan
  } = useHoneychain();

  const [inspectorPassword, setInspectorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Clear inputs when modal opens or target role changes
  useEffect(() => {
    setInspectorPassword('');
    setShowPassword(false);
    setPasswordError(null);
  }, [biometricTargetRole, isBiometricModalOpen]);

  if (!isBiometricModalOpen || !biometricTargetRole) return null;

  const isInspector = biometricTargetRole === 'inspector';

  const handleInspectorPasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inspectorPassword.trim() === 'honey@123') {
      setPasswordError(null);
      triggerBiometricScan();
    } else {
      setPasswordError('Invalid password! Access denied.');
    }
  };

  // Role-specific configuration
  const roleConfig: Record<string, {
    title: string; subtitle: string; badge: string;
    icon: React.ReactNode;
    scanIcon: (scanning: boolean) => React.ReactNode;
    scanLabel: string; scanningLabel: string; verifyingLabel: string; authenticatedLabel: string;
    bgColor: string; borderColor: string; textColor: string; ringColor: string;
  }> = {
    beekeeper: {
      title: 'Beekeeper Apiary Enclave',
      subtitle: 'Biometric WebAuthn FIDO2 authorization — Fingerprint + RFID Hive IoT access',
      badge: 'FIDO2 / WebAuthn',
      icon: <Fingerprint className="w-7 h-7" />,
      scanIcon: (s) => <Fingerprint className={`w-12 h-12 ${s ? 'animate-pulse' : ''}`} />,
      scanLabel: 'Place finger on biometric sensor',
      scanningLabel: 'Scanning ridge points & minutiae...',
      verifyingLabel: 'Verifying Hyperledger MSP Identity...',
      authenticatedLabel: 'Apiary Enclave Access Granted!',
      bgColor: 'bg-amber-100', borderColor: 'border-amber-300', textColor: 'text-amber-600', ringColor: 'border-amber-400',
    },
    inspector: {
      title: 'ISO-17025 Lab Inspector Terminal',
      subtitle: 'Password authentication required for mass spectrometry and purity notary access',
      badge: 'PASSWORD PROTECTED',
      icon: <FlaskConical className="w-7 h-7" />,
      scanIcon: (s) => <ScanLine className={`w-12 h-12 ${s ? 'animate-pulse' : ''}`} />,
      scanLabel: 'Enter inspector security password',
      scanningLabel: 'Validating password with Hyperledger Fabric MSP...',
      verifyingLabel: 'Validating ISO-17025 Lab Certificate...',
      authenticatedLabel: 'Lab Terminal Access Granted!',
      bgColor: 'bg-indigo-100', borderColor: 'border-indigo-300', textColor: 'text-indigo-600', ringColor: 'border-indigo-400',
    },
    customer: {
      title: 'Consumer ZK Passport — Face ID',
      subtitle: 'Face ID simulation for public zero-knowledge honey verification passport',
      badge: 'ZK-SNARK / Face ID',
      icon: <ScanFace className="w-7 h-7" />,
      scanIcon: (s) => <ScanFace className={`w-12 h-12 ${s ? 'animate-pulse' : ''}`} />,
      scanLabel: 'Look at camera to verify face ID',
      scanningLabel: 'Mapping facial geometry (68 points)...',
      verifyingLabel: 'Generating ZK-SNARK Proof...',
      authenticatedLabel: 'ZK Passport Unlocked!',
      bgColor: 'bg-emerald-100', borderColor: 'border-emerald-300', textColor: 'text-emerald-600', ringColor: 'border-emerald-400',
    },
    admin: {
      title: 'System Admin Console',
      subtitle: 'Enterprise admin multi-factor authentication required',
      badge: 'MFA / Admin',
      icon: <ShieldCheck className="w-7 h-7" />,
      scanIcon: (s) => <ShieldCheck className={`w-12 h-12 ${s ? 'animate-pulse' : ''}`} />,
      scanLabel: 'Complete multi-factor authentication',
      scanningLabel: 'Verifying admin credentials...',
      verifyingLabel: 'Validating enterprise governance token...',
      authenticatedLabel: 'Admin Console Access Granted!',
      bgColor: 'bg-red-100', borderColor: 'border-red-300', textColor: 'text-red-600', ringColor: 'border-red-400',
    },
  };

  const cfg = roleConfig[biometricTargetRole] ?? roleConfig['beekeeper'];
  const isAuthenticating = biometricState === 'scanning' || biometricState === 'verifying_hyperledger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-amber-200 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={closeBiometricModal}
          disabled={isAuthenticating}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl ${cfg.bgColor} border ${cfg.borderColor} flex items-center justify-center ${cfg.textColor} shadow-sm`}>
            {cfg.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{cfg.title}</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {cfg.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500">{cfg.subtitle}</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE A: LAB INSPECTOR PASSWORD AUTHENTICATION */}
        {/* ========================================================================= */}
        {isInspector ? (
          <div className="my-5 space-y-4">
            <form onSubmit={handleInspectorPasswordSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Inspector Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={inspectorPassword}
                    onChange={(e) => {
                      setInspectorPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Enter inspector password"
                    disabled={isAuthenticating || biometricState === 'authenticated'}
                    autoFocus
                    className={`w-full pl-10 pr-10 py-3 rounded-2xl border-2 text-sm font-medium text-slate-900 focus:outline-none transition ${
                      passwordError
                        ? 'border-red-500 bg-red-50/40 focus:border-red-500'
                        : 'border-slate-200 focus:border-indigo-500 bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-[11px] font-bold text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isAuthenticating || biometricState === 'authenticated'}
                className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-102 active:scale-98 disabled:opacity-50"
              >
                {biometricState === 'authenticated' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Password Verified — Access Granted!</span>
                  </>
                ) : isAuthenticating ? (
                  <>
                    <ScanLine className="w-4 h-4 animate-pulse" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-indigo-200" />
                    <span>Authenticate & Enter Lab Terminal</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE B: BEEKEEPER / OTHER BIOMETRIC FINGERPRINT SCANNER */
          /* ========================================================================= */
          <div className="my-6 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50/70 to-amber-100/40 rounded-3xl border border-amber-200/80">
            <div className="relative flex items-center justify-center">
              
              {/* Outer Pulsing Rings */}
              {biometricState === 'scanning' && (
                <>
                  <div className={`absolute w-32 h-32 rounded-full border-2 ${cfg.ringColor} animate-ping opacity-30`} />
                  <div className={`absolute w-28 h-28 rounded-full border-2 ${cfg.ringColor} animate-pulse opacity-40`} />
                </>
              )}

              {biometricState === 'authenticated' && (
                <div className="absolute w-32 h-32 rounded-full bg-emerald-100/80 border-2 border-emerald-500 animate-scaleUp" />
              )}

              {/* Fingerprint Button / Target */}
              <button
                onClick={triggerBiometricScan}
                disabled={biometricState !== 'idle'}
                className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
                  biometricState === 'idle'
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:from-amber-600 text-white shadow-amber-400/40 hover:scale-105 cursor-pointer active:scale-95'
                    : biometricState === 'scanning' || biometricState === 'verifying_hyperledger'
                    ? 'bg-amber-500 text-white shadow-amber-500/50 cursor-wait'
                    : 'bg-emerald-500 text-white shadow-emerald-500/40 cursor-default'
                }`}
              >
                {biometricState === 'authenticated'
                  ? <CheckCircle2 className="w-12 h-12 text-white animate-bounce" />
                  : cfg.scanIcon(biometricState === 'scanning')
                }
              </button>
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-700">
              {biometricState === 'idle' && cfg.scanLabel}
              {biometricState === 'scanning' && cfg.scanningLabel}
              {biometricState === 'verifying_hyperledger' && cfg.verifyingLabel}
              {biometricState === 'authenticated' && cfg.authenticatedLabel}
            </p>

            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Cpu className="w-3.5 h-3.5 text-amber-600" />
              <span>Cryptographic ECDSA secp256k1 signature challenge</span>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Secure Enclave Active
          </span>
          <span>Zero-Knowledge Authenticator</span>
        </div>

      </div>
    </div>
  );
};
