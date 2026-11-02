"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { hasAdminStaffRole } from "@/features/auth/services/auth.service";

const field =
  "w-full min-h-11 py-2 rounded-lg bg-white px-3 text-base sm:text-sm text-[#1a1a1a] placeholder:text-[#8a8a8a] shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow disabled:bg-[#f7f7f7] disabled:text-[#616161]";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const emailRef = useRef<HTMLInputElement>(null);

  // Already signed in as staff? Skip the form.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const ok = await hasAdminStaffRole(data.session.user.id);
        if (active && ok !== false) {
          router.replace("/");
          return;
        }
      }
      if (active) {
        setCheckingSession(false);
        setTimeout(() => emailRef.current?.focus(), 0);
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError || !data?.user) {
      setLoading(false);
      // Wrong credentials get a deliberately generic message; other failures are likely network or server related.
      setError(
        authError && authError.status && authError.status >= 500
          ? "We couldn't reach the server. Please try again in a moment."
          : authError?.message?.toLowerCase().includes("fetch")
          ? "Check your internet connection and try again."
          : "Incorrect email or password."
      );
      setPassword("");
      return;
    }

    // Stop non-staff accounts here instead of leaving them on a blank screen
    const ok = await hasAdminStaffRole(data.user.id);
    if (ok === false) {
      await supabase.auth.signOut();
      setLoading(false);
      setPassword("");
      setError("This account doesn't have staff access. Ask a super admin to grant you a role.");
      return;
    }

    router.replace("/");
    router.refresh();
  };

  if (checkingSession) {
    return (
      <main className="min-h-dvh grid place-items-center bg-[#f1f1f1]">
        <Loader2 size={24} className="animate-spin text-[#616161]" aria-label="Loading" />
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-[#f1f1f1] px-4 py-8 text-[#303030] antialiased">
      <div className="w-full max-w-[400px]">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center p-2 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            <img src="/logo.png" alt="Royal Bengal" className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-[#1a1a1a]">Royal Bengal</p>
            <p className="text-xs text-[#616161]">Store admin</p>
          </div>
        </div>

        <form
          onSubmit={signIn}
          noValidate={false}
          className="space-y-4 rounded-xl bg-white p-5 sm:p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_12px_rgba(0,0,0,0.06)]"
        >
          <header>
            <h1 className="text-xl font-semibold text-[#1a1a1a]">Log in</h1>
            <p className="mt-1 text-sm sm:text-[13px] text-[#616161]">Use your staff account to continue.</p>
          </header>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex gap-2 rounded-lg bg-[#fed1d7] px-3 py-2.5 text-sm sm:text-[13px] text-[#8e0b21]"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <label className="block space-y-1.5">
            <span className="text-sm sm:text-[13px] font-medium">Email</span>
            <input
              ref={emailRef}
              required
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              value={email}
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className={field}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm sm:text-[13px] font-medium">Password</span>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                disabled={loading}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onKeyUp={(e) => setCapsOn(e.getModifierState("CapsLock"))}
                onBlur={() => setCapsOn(false)}
                className={`${field} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 rounded-lg text-[#616161] hover:text-[#1a1a1a] hover:bg-black/5"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {capsOn && <p className="text-xs text-[#5e4200] bg-[#ffd6a4] rounded-md px-2 py-1 w-fit">Caps Lock is on</p>}
          </label>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full min-h-11 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Signing in…
              </>
            ) : (
              "Log in"
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-[#616161] text-center pt-1">
            <ShieldCheck size={13} className="shrink-0" />
            Only authorized staff accounts can sign in.
          </p>
        </form>

        <p className="mt-5 text-center text-xs text-[#8a8a8a]">
          Forgot your password? Ask a super admin to reset it for you.
        </p>
      </div>
    </main>
  );
}