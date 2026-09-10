import React, { useState } from 'react';
import { useHoneychain, UserRole } from '../context/HoneychainContext';
import { soundManager } from '../utils/audio';
import {
  Hexagon,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  Fingerprint,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Cpu,
  UserCheck,
  Eye as CustomerEye,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { setAppScreen, setCurrentRole } = useHoneychain();

  // Mode: Sign In vs Sign Up
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Selected Role for authentication
  const [selectedRole, setSelectedRole] = useState<'beekeeper' | 'inspector' | 'customer' | 'admin'>('beekeeper');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    licenseId: '',
    rememberMe: true,
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Select role without exposing or auto-filling credentials on screen
  const applyPreset = (role: 'beekeeper' | 'inspector' | 'customer' | 'admin') => {
    setSelectedRole(role);
    soundManager.playClick();
    setFormData(prev => ({
      ...prev,
      email: '',
      password: ''
    }));
  };

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const strengthScore = calculatePasswordStrength(formData.password);

  const getStrengthLabel = () => {
    if (strengthScore <= 25) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (strengthScore <= 50) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
    if (strengthScore <= 75) return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' };
    return { label: 'Strong (Cryptographic)', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email || !formData.password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (authMode === 'signup' && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Strict Admin verification
    const isAdminEmail = formData.email.trim().toLowerCase() === 'aryanrutheswar1823@gmail.com';
    if (selectedRole === 'admin' || isAdminEmail) {
      if (formData.email.trim().toLowerCase() !== 'aryanrutheswar1823@gmail.com' || formData.password !== 'honey@123') {
        setErrorMessage('Access Denied: Invalid Administrator Credentials. Only authorized admin (aryanrutheswar1823@gmail.com) can access the System Admin Portal.');
        return;
      }
    }

    // Strict Lab Inspector password verification
    if (selectedRole === 'inspector') {
      if (formData.password !== 'honey@123') {
        setErrorMessage('Access Denied: Invalid Lab Inspector password.');
        return;
      }
    }

    setIsSubmitting(true);
    soundManager.playEnterChime();

    // Simulate cryptographic authentication
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      soundManager.playMintSuccess();

      setTimeout(() => {
        // Log in and route directly into that role's portal
        const finalRole = (selectedRole === 'admin' || isAdminEmail) ? 'admin' : selectedRole;
        setCurrentRole(finalRole as UserRole);
        setAppScreen('portal');
      }, 1200);
    }, 1000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-amber-50/40 via-white to-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header Bar */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6 relative z-30">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setCurrentRole(null);
            setAppScreen('role_select');
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-400 px-4 py-2 rounded-2xl shadow-md transition-all cursor-pointer active:scale-95 z-30"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" />
          <span>Back to Role Selection</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-amber-50/80 border border-amber-200/60 px-3 py-1 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>TLS 1.3 • WebAuthn Ready</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl border border-amber-200/70 rounded-3xl shadow-xl shadow-amber-900/5 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Subtle decorative top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400" />

        {/* Brand & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/25 mb-3">
            <Hexagon className="w-8 h-8 stroke-[2.2]" />
            <span className="absolute text-xs font-black tracking-tight">HC</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {authMode === 'signin' ? 'Welcome to Honeychain' : 'Create Honeychain Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {authMode === 'signin' 
              ? 'Enter your credentials or use hardware passkey to access your portal' 
              : 'Register your apiary, testing laboratory, or consumer identity on-chain'}
          </p>
        </div>

        {/* Sign In / Sign Up Mode Switcher Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role Selection Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Workspace Role
            </label>
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Role-Based Access
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => applyPreset('beekeeper')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col items-center sm:items-start transition-all cursor-pointer ${
                selectedRole === 'beekeeper'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Cpu className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold">Beekeeper</span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline">Apiary & Harvest</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('inspector')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col items-center sm:items-start transition-all cursor-pointer ${
                selectedRole === 'inspector'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold">Lab Analyst</span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline">EA-IRMS Testing</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('customer')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col items-center sm:items-start transition-all cursor-pointer ${
                selectedRole === 'customer'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <CustomerEye className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold">Consumer</span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline">QR Scan & Verify</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('admin')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col items-center sm:items-start transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'border-red-500 bg-red-50/80 text-red-950 ring-2 ring-red-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Lock className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold">System Admin</span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline">Governance & Security</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {submitSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Authenticated successfully! Redirecting to {selectedRole} workspace...</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sign Up extra fields */}
          {authMode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Rajeshwari Kumar"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {selectedRole === 'beekeeper' ? 'Apiary / Farm Entity' : (selectedRole === 'inspector' ? 'Certified Testing Laboratory' : 'Cooperative / Organization')}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Western Ghats Natural Honey Producer Co."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email or Digital Identity</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@honeychain.io"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              {authMode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength meter on sign up */}
            {authMode === 'signup' && formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Security Strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${strength.color}`} 
                    style={{ width: `${strengthScore}%` }} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (only in sign up) */}
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
                />
              </div>
            </div>
          )}

          {/* Checkboxes & Preferences */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={e => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded-md text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <span>Remember this workstation</span>
            </label>

            {authMode === 'signup' && (
              <span className="text-[11px] text-slate-400">
                Encrypted via SHA-256
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating with Ledger...</span>
              </>
            ) : (
              <>
                <span>{authMode === 'signin' ? 'Authorize & Enter Portal' : 'Register Cryptographic Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>


      </div>

      {/* Forgot Password Modal Reference */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-amber-200 relative">
            <button
              onClick={() => { setForgotPasswordOpen(false); setResetEmailSent(false); }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Reset Credentials</h3>
                <p className="text-xs text-slate-500">Self-sovereign identity recovery protocol</p>
              </div>
            </div>

            {resetEmailSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs">
                <div className="font-bold flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Recovery Link Dispatched
                </div>
                Cryptographic recovery link sent to <strong>{formData.email}</strong>. Check your inbox to verify ownership.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered account or organization email. We will issue an ephemeral ECDSA signed challenge to authorize password renewal.
                </p>
                <input
                  type="email"
                  defaultValue={formData.email}
                  placeholder="registered@honeychain.io"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setResetEmailSent(true)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Send Cryptographic Reset Token
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Notes */}
      <div className="mt-8 text-center text-xs text-slate-400 max-w-sm">
        <p>Honeychain Enterprise Security & Trust Layer</p>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">Protected by Zero-Knowledge SNARKs • ISO 27001 Certified</p>
      </div>

    </div>
  );
};
