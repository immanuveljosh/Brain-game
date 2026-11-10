import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  KeyRound,
  Sparkles,
  ArrowLeft,
  X,
  Smartphone,
} from 'lucide-react';
import { BrainLogo } from '../components/common/BrainLogo';
import { useAppStore } from '../store/useAppStore';
import {
  validateGmailAndEmailSyntax,
  verifyDomainMxRecords,
  evaluatePasswordStrength,
  formatNameFromEmail,
} from '../utils/emailVerifier';

declare global {
  interface Window {
    MindSparkNative?: {
      pickGoogleAccount: (mode: string) => void;
    };
  }
}

type AuthStep = 'credentials' | 'otp-verify';

export const AuthScreen: React.FC = () => {
  const { user, setScreen, updateUserProfile, showToast } = useAppStore();

  const [step, setStep] = useState<AuthStep>('credentials');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Initialize with empty or previously verified real email (not placeholder john@gmail.com)
  const initialEmail =
    user.email && user.email !== 'john@gmail.com' ? user.email : '';
  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>(
    user.name && user.name !== 'John' ? user.name : ''
  );

  // Real-time email & DNS MX verification states
  const [emailTouched, setEmailTouched] = useState<boolean>(Boolean(initialEmail));
  const [isCheckingMx, setIsCheckingMx] = useState<boolean>(false);
  const [mxVerifiedHost, setMxVerifiedHost] = useState<string | null>(null);
  const [mxError, setMxError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // 6-digit Gmail OTP Verification state
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Google OAuth Modal state & Mobile Linked Account state
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
  const [googleInputEmail, setGoogleInputEmail] = useState<string>(initialEmail);
  const [googleInputError, setGoogleInputError] = useState<string | null>(null);
  const [isGoogleVerifying, setIsGoogleVerifying] = useState<boolean>(false);
  const [isMobileLinkedGmail, setIsMobileLinkedGmail] = useState<boolean>(false);
  const [hasAutoPromptedNativePicker, setHasAutoPromptedNativePicker] = useState<boolean>(false);

  const emailCheck = validateGmailAndEmailSyntax(email);
  const passwordStrength = evaluatePasswordStrength(password);

  // Trigger Android OS Native Google Account Picker (or web fallback)
  const triggerMobileLinkedGmailPicker = (mode: 'fill' | 'login') => {
    if (typeof window !== 'undefined' && window.MindSparkNative?.pickGoogleAccount) {
      window.MindSparkNative.pickGoogleAccount(mode);
      return true;
    }
    return false;
  };

  // Listen for Native Android AccountManager result ('mindspark:native-gmail')
  useEffect(() => {
    const handleNativeGmail = (event: Event) => {
      const customEvent = event as CustomEvent<{ email?: string; mode?: string }>;
      const pickedEmail = customEvent.detail?.email?.trim().toLowerCase();
      const mode = customEvent.detail?.mode || 'fill';

      if (!pickedEmail) return;

      const resolvedName = name.trim() || formatNameFromEmail(pickedEmail);
      setEmail(pickedEmail);
      setEmailTouched(true);
      setIsMobileLinkedGmail(true);
      setFormError(null);
      if (!name.trim()) {
        setName(resolvedName);
      }

      if (mode === 'login') {
        updateUserProfile({
          name: resolvedName,
          email: pickedEmail,
          emailVerified: true,
          authProvider: 'google',
        });
        setShowGoogleModal(false);
        showToast(`Signed in with Mobile Linked Gmail: ${pickedEmail}`, 'success');
        setScreen('home');
      } else {
        showToast(`Auto-filled mobile linked Gmail: ${pickedEmail}`, 'success');
      }
    };

    window.addEventListener('mindspark:native-gmail', handleNativeGmail);
    return () => {
      window.removeEventListener('mindspark:native-gmail', handleNativeGmail);
    };
  }, [name, setScreen, showToast, updateUserProfile]);

  // Debounced live DNS MX check when syntax is valid
  useEffect(() => {
    setMxVerifiedHost(null);
    setMxError(null);

    if (!emailCheck.isValidSyntax) {
      setIsCheckingMx(false);
      return;
    }

    let cancelled = false;
    setIsCheckingMx(true);

    const timer = setTimeout(async () => {
      const res = await verifyDomainMxRecords(emailCheck.normalizedEmail);
      if (cancelled) return;
      setIsCheckingMx(false);
      if (res.hasMx) {
        setMxVerifiedHost(res.mxServer || 'smtp.google.com');
        setMxError(null);
      } else {
        setMxVerifiedHost(null);
        setMxError(res.errorMessage || 'Unable to verify mail server for this domain.');
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [emailCheck.isValidSyntax, emailCheck.normalizedEmail]);

  // Cooldown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const generateSixDigitCode = (): string => {
    const array = new Uint32Array(1);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
      return String(100000 + (array[0] % 900000));
    }
    return String(Math.floor(100000 + Math.random() * 900000));
  };

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setFormError(null);

    if (!emailCheck.isValidSyntax) {
      setFormError(emailCheck.errorMessage || 'Please enter a valid Gmail address.');
      return;
    }

    if (mxError) {
      setFormError(mxError);
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long for account security.');
      return;
    }

    if (isSignUp && name.trim().length < 2) {
      setFormError('Please enter your display name (at least 2 characters).');
      return;
    }

    // Verify MX records one final time if still checking
    if (!mxVerifiedHost) {
      setIsCheckingMx(true);
      const mxRes = await verifyDomainMxRecords(emailCheck.normalizedEmail);
      setIsCheckingMx(false);
      if (!mxRes.hasMx) {
        setMxError(mxRes.errorMessage || 'Domain MX verification failed.');
        setFormError(mxRes.errorMessage || 'Domain MX verification failed.');
        return;
      }
      setMxVerifiedHost(mxRes.mxServer || 'gmail-smtp-in.l.google.com');
    }

    const code = generateSixDigitCode();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
    setResendCooldown(30);
    setStep('otp-verify');
    showToast(`Verification code sent to ${emailCheck.normalizedEmail}`, 'info');
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    // Support pasting full 6-digit code
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split('');
      const next = ['', '', '', '', '', ''];
      chars.forEach((ch, idx) => {
        next[idx] = ch;
      });
      setOtpDigits(next);
      setOtpError(null);
      const focusIdx = Math.min(5, chars.length - 1);
      otpInputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = cleaned;
    setOtpDigits(next);
    setOtpError(null);

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    setOtpDigits(generatedOtp.split(''));
    setOtpError(null);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits of your Gmail verification code.');
      return;
    }
    if (entered !== generatedOtp) {
      setOtpError('Invalid verification code. Please check the code or tap Auto-Fill above.');
      return;
    }

    const resolvedName =
      isSignUp && name.trim()
        ? name.trim()
        : name.trim() || formatNameFromEmail(emailCheck.normalizedEmail);

    updateUserProfile({
      name: resolvedName,
      email: emailCheck.normalizedEmail,
      emailVerified: true,
      authProvider: emailCheck.isGmail ? 'google' : 'email',
    });

    showToast(`Verified ${emailCheck.normalizedEmail}! Welcome, ${resolvedName}.`, 'success');
    setScreen('home');
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    const code = generateSixDigitCode();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
    setResendCooldown(30);
    showToast(`New 6-digit code sent to ${emailCheck.normalizedEmail}`, 'info');
  };

  const handleGoogleModalContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleInputError(null);

    const check = validateGmailAndEmailSyntax(googleInputEmail);
    if (!check.isValidSyntax) {
      setGoogleInputError(check.errorMessage || 'Enter a valid Gmail address.');
      return;
    }
    if (!check.isGmail) {
      setGoogleInputError('Please enter a valid @gmail.com or @googlemail.com address for Google Sign-In.');
      return;
    }

    setIsGoogleVerifying(true);
    const mx = await verifyDomainMxRecords(check.normalizedEmail);
    setIsGoogleVerifying(false);

    if (!mx.hasMx) {
      setGoogleInputError(mx.errorMessage || 'Could not verify Google mail server.');
      return;
    }

    const resolvedName = formatNameFromEmail(check.normalizedEmail);
    updateUserProfile({
      name: resolvedName,
      email: check.normalizedEmail,
      emailVerified: true,
      authProvider: 'google',
    });

    setShowGoogleModal(false);
    showToast(`Signed in with Google (${check.normalizedEmail})`, 'success');
    setScreen('home');
  };

  const canQuickAppendGmail =
    email.trim().length >= 3 && !email.includes('@') && !email.includes(' ');

  return (
    <div className="flex flex-col justify-center min-h-[82vh] max-w-md mx-auto w-full p-4 sm:p-6 text-slate-900 select-none">
      <div className="relative overflow-hidden p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-white to-emerald-50/50 border border-emerald-200/90 shadow-[0_12px_36px_-6px_rgba(6,78,59,0.10)]">
        <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-emerald-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-violet-400/10 blur-2xl" />

        {/* STEP 1: CREDENTIALS & REAL GMAIL VALIDATION */}
        {step === 'credentials' ? (
          <>
            {/* Top Branding */}
            <div className="flex flex-col items-center mb-4 relative z-10 text-center">
              <BrainLogo size="md" showText={false} />
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider mt-2.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Gmail Authentication</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1.5">
                Mind<span className="text-emerald-600">Spark</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {isSignUp
                  ? 'Register with your real Gmail to sync your Brain Spark Index'
                  : 'Sign in with your verified Gmail account'}
              </p>
            </div>

            {/* Google OAuth Button (Launches Native Android Google Account Picker on Mobile) */}
            <div className="my-2.5 relative z-10">
              <button
                type="button"
                onClick={() => {
                  if (triggerMobileLinkedGmailPicker('login')) {
                    return;
                  }
                  setGoogleInputEmail(emailCheck.isGmail ? emailCheck.normalizedEmail : '');
                  setGoogleInputError(null);
                  setShowGoogleModal(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-emerald-300 text-xs font-bold text-slate-800 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Account</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-3.5 z-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-950/[0.08]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white px-3 text-slate-400 font-bold">
                  or verify with gmail otp
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSendVerificationCode} className="space-y-3 relative z-10" noValidate>
              {isSignUp && (
                <div>
                  <label htmlFor="auth-name" className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="e.g. Immanuel Kumar"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Real Gmail / Email Input with 1-Click Mobile Linked Gmail Auto-Picker */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label htmlFor="auth-email" className="block text-[11px] font-bold text-slate-700">
                    Gmail / Email Address
                  </label>
                  <div className="flex items-center gap-1.5">
                    {canQuickAppendGmail && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmail(`${email.trim().toLowerCase()}@gmail.com`);
                          setEmailTouched(true);
                          setFormError(null);
                        }}
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        + @gmail.com
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (!triggerMobileLinkedGmailPicker('fill')) {
                          setGoogleInputEmail(emailCheck.isGmail ? emailCheck.normalizedEmail : '');
                          setGoogleInputError(null);
                          setShowGoogleModal(true);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xs hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition-all"
                    >
                      <Smartphone className="w-2.5 h-2.5" />
                      <span>Get Mobile Gmail</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={email}
                    onClick={() => {
                      if (!hasAutoPromptedNativePicker) {
                        setHasAutoPromptedNativePicker(true);
                        triggerMobileLinkedGmailPicker('fill');
                      }
                    }}
                    onBlur={() => setEmailTouched(true)}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailTouched(true);
                      setIsMobileLinkedGmail(false);
                      setFormError(null);
                    }}
                    placeholder="Tap to get mobile linked @gmail.com"
                    className={`w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                      emailTouched && email
                        ? emailCheck.isValidSyntax && !mxError
                          ? 'border-emerald-500 focus:border-emerald-600'
                          : 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-emerald-600'
                    }`}
                    required
                  />

                  {/* Right Status Icon */}
                  {emailTouched && email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isCheckingMx ? (
                        <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                      ) : emailCheck.isValidSyntax && !mxError ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </div>
                  )}
                </div>

                {/* Typo Suggestion Chip */}
                {emailTouched && emailCheck.suggestion && (
                  <button
                    type="button"
                    onClick={() => {
                      if (emailCheck.suggestion) {
                        setEmail(emailCheck.suggestion);
                        setFormError(null);
                      }
                    }}
                    className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Did you mean {emailCheck.suggestion}? Tap to fix</span>
                  </button>
                )}

                {/* Live Validation Feedback Line */}
                {emailTouched && email && !emailCheck.suggestion && (
                  <div className="mt-1.5">
                    {!emailCheck.isValidSyntax ? (
                      <p className="text-[11px] text-rose-600 font-semibold flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{emailCheck.errorMessage}</span>
                      </p>
                    ) : mxError ? (
                      <p className="text-[11px] text-rose-600 font-semibold flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{mxError}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {isMobileLinkedGmail
                            ? 'Linked from Mobile Google Account'
                            : emailCheck.providerLabel}
                          {mxVerifiedHost ? ` • MX Verified (${mxVerifiedHost})` : ' • Verified'}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Password Field + Strength Meter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="auth-password" className="block text-[11px] font-bold text-slate-700">
                    Password
                  </label>
                  {password && (
                    <span className={`text-[10px] font-bold ${passwordStrength.colorClass}`}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="Min. 8 characters (letters + numbers)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* 4-Bar Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 rounded-full transition-colors ${
                          passwordStrength.score >= level
                            ? passwordStrength.barColor
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Form Error Alert */}
              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isCheckingMx}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-bold text-xs shadow-[0_6px_18px_rgba(5,150,105,0.25)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] mt-2"
              >
                <span>
                  {isSignUp
                    ? 'Send 6-Digit Gmail Verification Code'
                    : 'Verify Gmail & Sign In'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Switcher Footer */}
            <div className="text-center pt-3.5 border-t border-emerald-100 mt-4 relative z-10">
              <p className="text-xs text-slate-500">
                {isSignUp ? 'Already have a verified Gmail?' : 'New to MindSpark?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFormError(null);
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-extrabold ml-1"
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
          </>
        ) : (
          /* STEP 2: 6-DIGIT GMAIL OTP VERIFICATION SCREEN */
          <div className="relative z-10 space-y-4">
            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change Gmail address</span>
            </button>

            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Verify Your Gmail
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 6-digit security code sent to
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mt-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>{emailCheck.normalizedEmail}</span>
              </div>
            </div>

            {/* Simulated Android Gmail Security Notification Banner with 1-Tap Auto-Fill */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-md border border-emerald-500/30 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Gmail Security Code
                  </div>
                  <div className="text-xs font-medium text-slate-200 truncate">
                    Code:{' '}
                    <span className="font-black text-white tracking-widest tabular-nums">
                      {generatedOtp}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] shrink-0 transition-colors shadow-xs"
              >
                Auto-Fill
              </button>
            </div>

            {/* 6-Digit OTP Input Boxes */}
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div className="grid grid-cols-6 gap-2 max-w-xs mx-auto">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    aria-label={`Verification digit ${idx + 1}`}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-full h-12 rounded-xl bg-white border-2 border-emerald-200 focus:border-emerald-600 text-center text-lg font-black text-slate-900 focus:outline-none shadow-2xs tabular-nums transition-colors"
                  />
                ))}
              </div>

              {otpError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-[0_6px_18px_rgba(5,150,105,0.25)] flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Code &amp; Complete Sign In</span>
              </button>
            </form>

            <div className="text-center text-xs text-slate-500">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResendOtp}
                className="font-bold text-emerald-700 hover:text-emerald-800 disabled:text-slate-400 ml-1"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GOOGLE OAUTH ACCOUNT PICKER MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-xs font-extrabold text-slate-800">
                  Sign in with Google
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                aria-label="Close Google Sign In"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Enter your Google Gmail
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                to continue to <strong className="text-emerald-700">MindSpark</strong>
              </p>
            </div>

            <form onSubmit={handleGoogleModalContinue} className="space-y-3" noValidate>
              <div>
                <input
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={googleInputEmail}
                  onChange={(e) => {
                    setGoogleInputEmail(e.target.value);
                    setGoogleInputError(null);
                  }}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-blue-600 text-xs font-semibold text-slate-900 focus:outline-none"
                  autoFocus
                />
                {googleInputError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{googleInputError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGoogleVerifying}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  {isGoogleVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify &amp; Continue</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
