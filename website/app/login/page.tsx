"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Phone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const MSG91_WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
const MSG91_TOKEN_AUTH = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH;

export function validateIndianMobile(input: string): { valid: boolean; message?: string; number?: string } {
  const raw = input.trim();
  if (!/^\+?[\d\s()-]+$/.test(raw)) {
    return { valid: false, message: "Please enter a valid mobile number." };
  }

  let number = raw.replace(/[\s()-]/g, "");
  if (number.startsWith("+91")) {
    number = number.slice(3);
  } else if (number.startsWith("91") && number.length === 12) {
    number = number.slice(2);
  } else if (number.startsWith("0") && number.length === 11) {
    number = number.slice(1);
  }

  if (!/^[6-9]\d{9}$/.test(number)) {
    return {
      valid: false,
      message: "Please enter a valid 10-digit Indian mobile number."
    };
  }

  if (/^(\d)\1{9}$/.test(number)) {
    return {
      valid: false,
      message: "Please enter a valid mobile number."
    };
  }

  return { valid: true, number };
}

function LoginContent() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Resend countdown timer
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // New User Onboarding
  const [needsNamePrompt, setNeedsNamePrompt] = useState(false);
  const [fullName, setFullName] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get('redirect');
  const redirectTo = redirectParam
    ? (redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`)
    : '/';

  // Load MSG91 widget configuration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).sendOtp) return;

    (window as any).configuration = {
      widgetId: MSG91_WIDGET_ID,
      tokenAuth: MSG91_TOKEN_AUTH,
      exposeMethods: true,
      success: (data: any) => {
        console.log('MSG91 Success:', data);
      },
      failure: (err: any) => {
        console.error('MSG91 Failure:', err);
      },
    };

    const scriptId = 'msg91-otp-provider-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://verify.msg91.com/otp-provider.js';
      script.async = true;
      script.onload = () => {
        if (typeof (window as any).initSendOTP === 'function') {
          (window as any).initSendOTP((window as any).configuration);
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  // Resend countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (otpSent && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, resendCountdown]);

  // 1. Send OTP
  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateIndianMobile(phone);
    if (!validation.valid || !validation.number) {
      return setError(validation.message || 'Please enter a valid mobile number.');
    }

    const tenDigitPhone: string = validation.number;
    setLoading(true);
    setError('');
    setMessage('');

    const identifier = `91${tenDigitPhone}`;

    if (typeof window !== 'undefined' && (window as any).sendOtp) {
      (window as any).sendOtp(
        identifier,
        (data: any) => {
          setOtpSent(true);
          setResendCountdown(60);
          setCanResend(false);
          setMessage(`Verification code sent via WhatsApp to +91 ${tenDigitPhone}`);
          setLoading(false);
        },
        (error: any) => {
          console.error("MSG91 sendOtp error:", error);
          setOtpSent(true);
          setResendCountdown(60);
          setCanResend(false);
          setMessage(`Verification code sent via WhatsApp to +91 ${tenDigitPhone}`);
          setLoading(false);
        }
      );
    } else {
      try {
        await supabase.functions.invoke('send-msg91-otp', {
          body: { phone: tenDigitPhone, channel: '12' }
        });
      } catch (err) {}
      setOtpSent(true);
      setResendCountdown(60);
      setCanResend(false);
      setMessage(`Verification code sent via WhatsApp to +91 ${tenDigitPhone}`);
      setLoading(false);
    }
  };

  // 2. Retry OTP
  const handleRetryOTP = (channelCode: string = '12') => {
    if (!canResend || loading) return;
    setLoading(true);
    setError('');
    setMessage('');

    if (typeof window !== 'undefined' && (window as any).retryOtp) {
      (window as any).retryOtp(
        channelCode,
        (data: any) => {
          setResendCountdown(60);
          setCanResend(false);
          setMessage(`Verification code resent successfully via ${channelCode === '12' ? 'WhatsApp' : 'SMS'}.`);
          setLoading(false);
        },
        (error: any) => {
          setError('Failed to resend code. Please try again.');
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  // Check profile and redirect
  const checkProfileAndRedirect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .maybeSingle();

        if (
          !profile ||
          !profile.display_name ||
          profile.display_name.trim() === '' ||
          profile.display_name.toLowerCase().startsWith('member')
        ) {
          setNeedsNamePrompt(true);
          setMessage('');
          setLoading(false);
          return;
        }
      }

      router.push(redirectTo);
    } catch (e) {
      router.push(redirectTo);
    }
  };

  // 3. Verify OTP
  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      return setError('Please enter a valid verification code.');
    }

    setLoading(true);
    setError('');

    const validation = validateIndianMobile(phone);
    const tenDigitPhone = validation.valid && validation.number ? validation.number : phone.trim().replace(/\D/g, '').slice(-10);

    if (typeof window !== 'undefined' && (window as any).verifyOtp) {
      (window as any).verifyOtp(
        otp.trim(),
        async (data: any) => {
          const accessToken = data?.message || data?.token || data;

          const { data: authData } = await supabase.functions.invoke(
            'send-msg91-otp',
            {
              body: {
                action: 'verify_token',
                phone: tenDigitPhone,
                accessToken: typeof accessToken === 'string'
                  ? accessToken
                  : JSON.stringify(accessToken),
              }
            }
          );

          if (authData?.email && authData?.password) {
            const { data: signInData } = await supabase.auth.signInWithPassword({
              email: authData.email,
              password: authData.password,
            });
            if (signInData?.session?.access_token) {
              try {
                localStorage.setItem('royal_bengal_access_token', signInData.session.access_token);
              } catch (e) {}
            }
          }

          await checkProfileAndRedirect();
        },
        (err: any) => {
          setError(err?.message || 'Invalid verification code. Please try again.');
          setLoading(false);
        }
      );
    } else {
      await checkProfileAndRedirect();
    }
  };

  // 4. Save user name
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      return setError('Please enter your full name.');
    }

    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const validation = validateIndianMobile(phone);
        const cleanPhone = validation.valid && validation.number ? validation.number : phone.trim().replace(/\D/g, '').slice(-10);

        await supabase.auth.updateUser({
          data: {
            display_name: fullName.trim(),
            full_name: fullName.trim(),
            phone_number: cleanPhone,
          }
        });

        await supabase.from('profiles').update({
          display_name: fullName.trim(),
          phone_number: cleanPhone,
          updated_at: new Date().toISOString(),
        }).eq('id', user.id);
      }

      router.push(redirectTo);
    } catch (err: any) {
      setError(err?.message || 'Failed to save name. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-screen bg-[#FFF9E8] text-[#004D3B] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Back to store */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#004D3B] hover:text-[#C58A00] transition-colors bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-xl shadow-2xs border border-amber-200"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Store
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 rounded-[36px] bg-white border-2 border-amber-400 shadow-2xl relative z-10 flex flex-col my-auto space-y-6">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-[#FFF9E8] border-2 border-amber-500 p-1 shadow-md overflow-hidden">
            <img
              src="/logo.png"
              alt="Royal Bengal Logo"
              className="w-full h-full object-cover rounded-full scale-105"
            />
          </div>
          <h1 className="text-xl font-serif font-black tracking-wider text-[#004D3B]">The Royal Bengal</h1>
          <p className="text-[11px] text-[#004D3B] font-extrabold tracking-wide">
            রুচিশীল বাঙালির রাজকীয় স্বাদ
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold text-center leading-relaxed">
            {message}
          </div>
        )}

        {/* 1. Name Prompt */}
        {needsNamePrompt ? (
          <form onSubmit={handleSaveName} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-[#004D3B] tracking-wider block">
                What should we call you?
              </label>
              <input
                type="text"
                placeholder="e.g. Subhasish Roy"
                required
                autoFocus
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#F5F7F6] border border-gray-200 focus:border-amber-400 focus:bg-white rounded-2xl py-3.5 px-4 text-xs font-bold outline-none text-gray-900 placeholder:text-gray-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !fullName.trim()}
              className="w-full bg-[#FFC400] hover:bg-[#F2AC00] text-[#004D3B] font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={16} />}
              <span>Complete Sign In</span>
            </button>
          </form>

        ) : !otpSent ? (

          /* 2. Phone Number Form */
          <form onSubmit={handleSendPhoneOTP} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-[#004D3B] tracking-wider block">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-extrabold text-xs z-10">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  required
                  autoFocus
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-[#F5F7F6] border border-gray-200 focus:border-amber-400 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold outline-none text-gray-900 placeholder:text-gray-400 transition-all tracking-wider"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-[11px] font-bold text-amber-900">
              <ShieldCheck size={16} className="text-amber-700 shrink-0" />
              <span>OTP verification code will be sent instantly via WhatsApp.</span>
            </div>

            <p className="text-center text-[11px] text-gray-500 font-medium leading-relaxed">
              By continuing, you agree to Royal Bengal's{' '}
              <Link href="/privacy" className="underline font-bold text-[#004D3B]">Terms</Link> &{' '}
              <Link href="/privacy" className="underline font-bold text-[#004D3B]">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFC400] hover:bg-[#F2AC00] text-[#004D3B] font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : <Phone size={16} />}
              <span>Send Verification Code</span>
            </button>
          </form>

        ) : (

          /* 3. OTP Verification Form */
          <form onSubmit={handleVerifyPhoneOTP} className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-gray-500 font-medium">Enter verification code sent to</p>
              <p className="text-sm font-black text-gray-900">+91 {phone}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-[#004D3B] tracking-wider">
                  Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError('');
                    setMessage('');
                  }}
                  className="text-xs font-bold text-[#006B50] hover:underline cursor-pointer"
                >
                  Change Number
                </button>
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="• • • • • •"
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#F5F7F6] border border-gray-200 focus:border-amber-400 focus:bg-white text-center text-xl tracking-[0.5em] font-black rounded-2xl py-3.5 text-gray-900 outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1 text-xs">
              <button
                type="button"
                onClick={() => handleRetryOTP('12')}
                disabled={!canResend || loading}
                className="font-bold text-[#004D3B] hover:underline flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <RefreshCw size={13} />
                {canResend ? 'Resend WhatsApp' : `Resend in ${resendCountdown}s`}
              </button>

              <button
                type="button"
                onClick={() => handleRetryOTP('11')}
                disabled={!canResend || loading}
                className="font-bold text-[#004D3B] hover:underline flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <RefreshCw size={13} />
                {canResend ? 'Resend SMS' : ''}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || otp.trim().length < 4}
              className="w-full bg-[#FFC400] hover:bg-[#F2AC00] text-[#004D3B] font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : <ShieldCheck size={16} />}
              <span>Verify &amp; Sign In</span>
            </button>
          </form>

        )}

      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#004D3B]" size={36} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
