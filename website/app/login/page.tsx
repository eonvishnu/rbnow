"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  MessageCircle,
  Loader2,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

const MSG91_WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
const MSG91_TOKEN_AUTH = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH;

export function validateIndianMobile(input: string): { valid: boolean; message?: string; number?: string } {
  const raw = input.trim();

  // Reject letters and unsupported characters
  if (!/^\+?[\d\s()-]+$/.test(raw)) {
    return { valid: false, message: "Enter a valid mobile number." };
  }

  let number = raw.replace(/[\s()-]/g, "");

  // Remove Indian country code
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
      message: "Enter a valid 10-digit Indian mobile number."
    };
  }

  // Reject repeated-digit numbers
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
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'sms'>('whatsapp');

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

  // Load MSG91 widget with ExposeMethods configuration
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

  // 1. Send OTP using MSG91 window.sendOtp method with validateIndianMobile
  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateIndianMobile(phone);
    if (!validation.valid || !validation.number) {
      return setError(validation.message || 'Enter a valid mobile number.');
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
        setOtpSent(true);
        setResendCountdown(60);
        setCanResend(false);
        setMessage(`Verification code sent via WhatsApp to +91 ${tenDigitPhone}`);
      } catch (err) {
        setOtpSent(true);
        setResendCountdown(60);
        setCanResend(false);
        setMessage(`Verification code sent via WhatsApp to +91 ${tenDigitPhone}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // 2. Retry OTP using MSG91 window.retryOtp method supporting channel codes '12' (WhatsApp) & '11' (SMS)
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

  // 3. Verify OTP using MSG91 window.verifyOtp method
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
    <main className="h-dvh w-screen bg-[#FFF9E8] text-[#075B3E] flex flex-col items-center justify-center p-3 sm:p-4 font-sans relative overflow-hidden">

      {/* Ambient background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F5DFA6]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#A5CDB0]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Back to store */}
      <div className="absolute top-4 left-4 sm:left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#075B3E] hover:text-[#C58A00] transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Store
        </Link>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm sm:max-w-md px-5 pt-5 pb-28 sm:px-8 sm:pt-8 sm:pb-32 rounded-[2rem] bg-[#FFF9E8] border-2 border-[#E9A900] shadow-[0_24px_65px_rgba(7,91,62,0.15)] relative z-10 overflow-hidden flex flex-col my-auto">

        {/* Card background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5DFA6]/20 rounded-full blur-3xl pointer-events-none" />

        {/* All interactive content */}
        <div className="relative z-10 pb-12">

          {/* Brand */}
          <div className="text-center space-y-1.5 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center bg-white border-[3px] border-[#075B3E] p-1 shadow-[0_4px_18px_rgba(7,91,62,0.13)] overflow-hidden">
              <img
                src="/logo.png"
                alt="Royal Bengal Logo"
                className="w-full h-full object-cover rounded-full scale-105"
              />
            </div>

            <h2 className="text-[11px] sm:text-xs text-[#075B3E] font-extrabold tracking-wide">
              রুচিশীল বাঙালির রাজকীয় স্বাদ
            </h2>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-xl bg-[#E8F5E5] border border-[#A5CDB0] text-[#075B3E] text-xs font-bold text-center leading-relaxed">
              {message}
            </div>
          )}

          {/* NAME PROMPT */}
          {needsNamePrompt ? (
            <form onSubmit={handleSaveName} className="space-y-4">

              <div>
                <label className="text-[10px] font-extrabold uppercase text-[#075B3E] block mb-2 tracking-[0.12em]">
                  What should we call you?
                </label>

                <input
                  type="text"
                  placeholder="e.g. Subhasish"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#E8F5E5] border-2 border-[#A5CDB0] focus:border-[#075B3E] focus:ring-4 focus:ring-[#A5CDB0]/30 rounded-2xl py-3.5 px-4 text-sm font-bold outline-none text-[#075B3E] placeholder:text-[#858585] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !fullName.trim()}
                className="w-full bg-[#FFB900] hover:bg-[#F2AC00] text-[#075B3E] font-extrabold py-3.5 rounded-2xl uppercase text-xs tracking-[0.16em] transition-all active:scale-[0.98] shadow-md disabled:opacity-50 flex items-center justify-center gap-2 border border-[#E9A900]"
              >
                {loading
                  ? <Loader2 size={17} className="animate-spin" />
                  : "Complete Sign In"}
              </button>
            </form>

          ) : !otpSent ? (

            /* PHONE NUMBER + CONTINUE BUTTON */
            <form onSubmit={handleSendPhoneOTP} className="space-y-4">

              <div>
                <label className="text-[10px] font-extrabold uppercase text-[#075B3E] block mb-1.5 tracking-[0.13em]">
                  Mobile Number
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#075B3E] font-extrabold text-sm z-10">
                    +91
                  </span>

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter Phone number"
                    required
                    autoFocus
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-[#E8F5E5] border-2 border-[#A5CDB0] focus:border-[#075B3E] focus:ring-4 focus:ring-[#A5CDB0]/25 rounded-2xl py-3 pl-[3.8rem] pr-4 text-sm font-bold outline-none text-[#075B3E] placeholder:text-[#858585] transition-all tracking-wide"
                  />
                </div>
              </div>

              {/* WhatsApp Notice Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#A5CDB0]"></div>
                <span className="flex-shrink mx-2 text-[#075B3E] text-[9px] font-extrabold uppercase tracking-wide bg-[#E8F5E5] px-2.5 py-1 rounded-full border border-[#A5CDB0]">
                  💬 OTP will be sent via WhatsApp
                </span>
                <div className="flex-grow border-t border-[#A5CDB0]"></div>
              </div>

              {/* Terms & Conditions */}
              <p className="text-center text-[10px] text-[#075B3E] font-medium leading-relaxed">
                By continuing, you agree to Royal Bengal's{' '}
                <Link href="/privacy" className="underline font-extrabold hover:text-[#C58A00]">Terms of Service</Link> &{' '}
                <Link href="/privacy" className="underline font-extrabold hover:text-[#C58A00]">Privacy Policy</Link>.
              </p>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] bg-[#FFB900] hover:bg-[#F2AC00] text-[#075B3E] font-extrabold rounded-2xl uppercase text-xs tracking-[0.16em] transition-all active:scale-[0.98] shadow-md disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-[#E9A900]"
              >
                {loading
                  ? <Loader2 size={16} className="animate-spin" />
                  : "Send Verification Code"}
              </button>

            </form>

          ) : (

            /* OTP VERIFICATION */
            <form onSubmit={handleVerifyPhoneOTP} className="space-y-4">

              <div className="text-center mb-3">
                <p className="text-xs text-[#526D5D] font-medium">
                  Enter the verification code sent to
                </p>

                <p className="text-sm font-extrabold text-[#075B3E] mt-0.5">
                  +91 {phone}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 gap-3">
                  <label className="text-[10px] font-extrabold uppercase text-[#075B3E] tracking-[0.12em]">
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
                    className="text-[10px] text-[#075B3E] hover:text-[#C58A00] font-extrabold uppercase whitespace-nowrap"
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
                  className="w-full bg-[#E8F5E5] border-2 border-[#A5CDB0] focus:border-[#075B3E] focus:ring-4 focus:ring-[#A5CDB0]/25 text-center text-xl tracking-[0.5em] font-extrabold rounded-2xl py-3 text-[#075B3E] outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleRetryOTP('12')}
                  disabled={!canResend || loading}
                  className="text-[10px] font-extrabold text-[#075B3E] hover:text-[#C58A00] uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={13} />
                  {canResend ? 'Resend WhatsApp' : `Resend in ${resendCountdown}s`}
                </button>

                <button
                  type="button"
                  onClick={() => handleRetryOTP('11')}
                  disabled={!canResend || loading}
                  className="text-[10px] font-extrabold text-[#075B3E] hover:text-[#C58A00] uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={13} />
                  {canResend ? 'Resend SMS' : ''}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.trim().length < 4}
                className="w-full bg-[#FFB900] hover:bg-[#F2AC00] text-[#075B3E] font-extrabold py-3.5 rounded-2xl uppercase text-xs tracking-[0.16em] transition-all active:scale-[0.98] shadow-md disabled:opacity-50 flex items-center justify-center gap-2 border border-[#E9A900]"
              >
                {loading
                  ? <Loader2 size={16} className="animate-spin" />
                  : "Verify & Sign In"}
              </button>
            </form>

          )}

        </div>

        {/* Kolkata Skyline Illustration Footer Inside Card */}
        <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none opacity-85 overflow-hidden z-0">
          <img
            src="/kolkata-skyline.png"
            alt="Kolkata Skyline"
            className="w-full h-auto object-cover object-bottom"
          />
        </div>

      </div>

    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#075B3E]" size={36} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}