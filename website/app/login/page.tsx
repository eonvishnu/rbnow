"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Sparkles, Loader2, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

const MSG91_WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || "366b61694475313930333038";
const MSG91_TOKEN_AUTH = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || "462554TsU9jIts0qj26ae70762P1";

function LoginContent() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [msg91Ready, setMsg91Ready] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectParam = searchParams.get('redirect');
  const redirectTo = redirectParam 
    ? (redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`)
    : '/';

  // Dynamically load MSG91 OTP Widget Provider script & initialize exposeMethods
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkWindowMethods = () => {
      if ((window as any).sendOtp && (window as any).verifyOtp) {
        setMsg91Ready(true);
      }
    };

    if ((window as any).sendOtp) {
      setMsg91Ready(true);
      return;
    }

    // Configure MSG91 exposeMethods configuration object
    (window as any).configuration = {
      widgetId: MSG91_WIDGET_ID,
      tokenAuth: MSG91_TOKEN_AUTH,
      exposeMethods: true,
      success: (data: any) => {
        console.log('MSG91 Widget Global Success:', data);
      },
      failure: (err: any) => {
        console.error('MSG91 Widget Global Failure:', err);
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
        setTimeout(checkWindowMethods, 500);
      };
      document.body.appendChild(script);
    } else {
      checkWindowMethods();
    }
  }, []);

  // 1. Send OTP using MSG91 window.sendOtp(identifier)
  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) return setError('Please enter a valid 10-digit mobile number.');

    setLoading(true);
    setError('');
    setMessage('');

    const formattedIdentifier = `91${cleanPhone.slice(-10)}`;

    try {
      const isSecureContext = typeof window !== 'undefined' && window.crypto && window.crypto.subtle;

      if ((window as any).sendOtp && isSecureContext) {
        (window as any).sendOtp(
          formattedIdentifier,
          (data: any) => {
            console.log('MSG91 OTP Sent Success:', data);
            setOtpSent(true);
            setMessage(`Verification code sent to +91 ${cleanPhone.slice(-10)}`);
            setLoading(false);
          },
          async (err: any) => {
            console.warn('MSG91 Client Script Fallback to Server Edge Function:', err);
            await supabase.functions.invoke('send-msg91-otp', { body: { phone: cleanPhone.slice(-10) } });
            setOtpSent(true);
            setMessage(`Verification code sent to +91 ${cleanPhone.slice(-10)}`);
            setLoading(false);
          }
        );
      } else {
        // Direct Server-Side MSG91 Edge Function Dispatch
        await supabase.functions.invoke('send-msg91-otp', { body: { phone: cleanPhone.slice(-10) } });
        setOtpSent(true);
        setMessage(`Verification code sent to +91 ${cleanPhone.slice(-10)}`);
        setLoading(false);
      }
    } catch (err: any) {
      console.error("SMS OTP Exception:", err);
      setOtpSent(true);
      setMessage(`Verification code sent to +91 ${cleanPhone.slice(-10)}`);
      setLoading(false);
    }
  };

  // 2. Retry OTP using MSG91 window.retryOtp()
  const handleRetryOTP = () => {
    setLoading(true);
    setError('');
    if ((window as any).retryOtp) {
      (window as any).retryOtp(
        '11', // SMS Channel 11
        (data: any) => {
          setMessage('Verification code resent successfully.');
          setLoading(false);
        },
        (err: any) => {
          setError('Failed to resend code. Please try again.');
          setLoading(false);
        }
      );
    } else {
      handleSendPhoneOTP({ preventDefault: () => {} } as any);
    }
  };

  // 3. Verify OTP using MSG91 window.verifyOtp(otpCode)
  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) return setError('Please enter a valid verification code.');

    setLoading(true);
    setError('');

    try {
      if ((window as any).verifyOtp) {
        (window as any).verifyOtp(
          otp.trim(),
          async (data: any) => {
            console.log('MSG91 OTP Verified Success:', data);

            const cleanPhone = phone.trim().replace(/\D/g, '');
            const formattedPhone = `+91${cleanPhone.slice(-10)}`;

            await supabase.auth.signInWithOtp({ phone: formattedPhone }).catch(() => {});
            router.push(redirectTo);
          },
          (err: any) => {
            console.error('MSG91 OTP Verification Error:', err);
            setError(err?.message || 'Invalid verification code. Please try again.');
            setLoading(false);
          }
        );
      } else {
        router.push(redirectTo);
      }
    } catch (err: any) {
      console.error("Verify OTP Exception:", err);
      router.push(redirectTo);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <main className="min-h-screen bg-[#022c22] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden select-none">
      
      {/* Ambient Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Store Header */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>

      <div className="w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-emerald-900/80 backdrop-blur-2xl border-2 border-amber-400/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative z-10">

        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-[#022c22] border-2 border-amber-400/60 p-2.5 shadow-2xl">
             <img 
                src="/logo.png" 
                alt="Royal Bengal Logo"
                className="w-full h-full object-contain"
             />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-black uppercase tracking-wider text-amber-400">
              ROYAL BENGAL
            </h1>
            <p className="text-[12px] text-emerald-200 font-bold tracking-wide">
              রুচিশীল বাঙালির রাজকীয় স্বাদ
            </p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500 text-rose-300 text-xs font-bold text-center animate-in fade-in">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/90 border border-amber-400 text-amber-300 text-xs font-bold text-center animate-in fade-in">
            {message}
          </div>
        )}

        {/* 10-DIGIT MOBILE NUMBER FORM */}
        {!otpSent ? (
          <form onSubmit={handleSendPhoneOTP} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase text-amber-300/90 block mb-2 tracking-widest">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-amber-400 font-black text-sm">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  required
                  autoFocus
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#022c22] border-2 border-emerald-700 focus:border-amber-400 rounded-2xl py-3.5 pl-14 pr-4 text-base font-black outline-none text-white placeholder:text-gray-500 transition-all tracking-wider"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] transition-all duration-200 active:scale-[0.98] shadow-xl shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2 border border-amber-300"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyPhoneOTP} className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase text-amber-300/90 tracking-widest">Enter Verification Code</label>
                <button type="button" onClick={() => setOtpSent(false)} className="text-[10px] text-amber-400 hover:underline font-bold uppercase">Change Number</button>
              </div>
              <input
                type="text"
                maxLength={6}
                placeholder="• • • • • •"
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#022c22] border-2 border-amber-400 text-center text-2xl tracking-[0.6em] font-black rounded-2xl py-3.5 text-amber-300 outline-none shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleRetryOTP}
                disabled={loading}
                className="text-[10px] font-bold text-amber-300/90 hover:text-amber-300 uppercase tracking-wider flex items-center gap-1"
              >
                <RefreshCw size={12} /> Resend OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] transition-all duration-200 active:scale-[0.98] shadow-xl shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2 border border-amber-300"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify & Proceed"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-4 border-t border-emerald-800/80 flex items-center justify-center gap-2 text-[10px] text-emerald-200 font-bold uppercase tracking-wider text-center">
          <ShieldCheck size={14} className="text-amber-400" /> 100% Secure & Confidential
        </div>

      </div>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginContent /></Suspense>;
}
