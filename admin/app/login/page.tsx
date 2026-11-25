"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { hasAdminStaffRole } from "@/features/auth/services/auth.service";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [error, setError] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [reasonAlert, setReasonAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  // Read URL reason parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get("reason");
    if (reason === "idle_timeout") {
      setReasonAlert("You were signed out due to inactivity.");
    } else if (reason === "session_expired") {
      setReasonAlert("Your 8-hour admin session has expired. Please sign in again.");
    }
  }, []);

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
        setTimeout(() => emailRef.current?.focus(), 50);
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || success) return;
    setLoading(true);
    setError("");
    setReasonAlert("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError || !data?.user) {
      setLoading(false);
      setError(
        authError && authError.status && authError.status >= 500
          ? "We couldn't reach the authentication server. Please try again shortly."
          : authError?.message?.toLowerCase().includes("fetch")
          ? "Network error. Check your internet connection and try again."
          : "Incorrect email or password. Please verify your credentials."
      );
      setPassword("");
      return;
    }

    // Verify staff role before granting access
    const ok = await hasAdminStaffRole(data.user.id);
    if (ok === false) {
      await supabase.auth.signOut();
      setLoading(false);
      setPassword("");
      setError(
        "Access denied. This account does not have staff privileges assigned."
      );
      return;
    }

    // Record login timestamp & activity for session guard
    localStorage.setItem("rb_admin_login_ts", String(Date.now()));
    localStorage.setItem("rb_admin_last_activity", String(Date.now()));

    setSuccess(true);
    router.replace("/");
    router.refresh();
  };

  if (checkingSession) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-[#f6f6f7] px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#18181b] flex items-center justify-center p-2 shadow-sm animate-pulse">
            <img
              src="/logo.png"
              alt="Royal Bengal"
              className="w-full h-full object-contain opacity-90"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#616161]">
            <Loader2 size={14} className="animate-spin text-[#18181b]" />
            <span>Verifying session…</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center bg-[#f6f6f7] px-4 py-10 text-[#18181b] antialiased selection:bg-[#18181b] selection:text-white">
      {/* Subtle architectural background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:20px_20px] opacity-45"
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="relative mb-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#18181b] flex items-center justify-center p-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.14)] ring-1 ring-black/10">
              <img
                src="/logo.png"
                alt="Royal Bengal"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              title="Secure Admin Environment"
              className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/10"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-[#18181b]">
              Royal Bengal
            </span>
            <span className="inline-flex items-center rounded-md bg-black/[0.06] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#52525b]">
              Admin
            </span>
          </div>
          <p className="mt-1 text-xs text-[#71717a]">
            Store Operations &amp; Management Console
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.07]">
          <header className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-[#18181b]">
              Sign in to dashboard
            </h1>
            <p className="mt-1 text-[13px] text-[#71717a]">
              Enter your authorized staff credentials to continue.
            </p>
          </header>

          {reasonAlert && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/90 px-3.5 py-3 text-[13px] leading-snug text-amber-900"
            >
              <Clock
                size={16}
                className="mt-0.5 shrink-0 text-amber-600"
              />
              <span>{reasonAlert}</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200/80 bg-red-50/90 px-3.5 py-3 text-[13px] leading-snug text-red-900"
            >
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0 text-red-600"
              />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={signIn} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-[13px] font-medium text-[#27272a]"
              >
                Staff email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a1a1aa]"
                />
                <input
                  id="admin-email"
                  ref={emailRef}
                  required
                  type="email"
                  inputMode="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="name@royalbengal.com"
                  value={email}
                  disabled={loading || success}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full h-11 rounded-xl bg-white pl-10 pr-3.5 text-sm text-[#18181b] placeholder:text-[#a1a1aa] ring-1 ring-inset ring-[#d4d4d8] outline-none transition-all focus:ring-2 focus:ring-[#18181b] disabled:bg-[#f4f4f5] disabled:text-[#71717a]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-[13px] font-medium text-[#27272a]"
                >
                  Password
                </label>
                {capsOn && (
                  <span className="inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-800">
                    Caps Lock on
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a1a1aa]"
                />
                <input
                  id="admin-password"
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  disabled={loading || success}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyUp={(e) => setCapsOn(e.getModifierState("CapsLock"))}
                  onBlur={() => setCapsOn(false)}
                  className="w-full h-11 rounded-xl bg-white pl-10 pr-11 text-sm text-[#18181b] placeholder:text-[#a1a1aa] ring-1 ring-inset ring-[#d4d4d8] outline-none transition-all focus:ring-2 focus:ring-[#18181b] disabled:bg-[#f4f4f5] disabled:text-[#71717a]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-black/[0.04] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Session Persistence Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                id="keep-signed-in"
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#18181b] focus:ring-[#18181b] cursor-pointer"
              />
              <label htmlFor="keep-signed-in" className="text-xs text-[#52525b] select-none cursor-pointer">
                Keep me signed in for 8 hours
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading || success || !email.trim() || !password}
                className="group relative w-full h-11 rounded-xl bg-[#18181b] hover:bg-[#27272a] active:scale-[0.99] text-sm font-medium text-white shadow-sm disabled:opacity-45 disabled:pointer-events-none transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                {success ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Authenticated, redirecting…</span>
                  </>
                ) : loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying credentials…</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Card Footer Security Notice */}
          <div className="mt-6 pt-5 border-t border-[#f4f4f5] flex items-center justify-between text-xs text-[#71717a]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              Role-verified access
            </span>

            <button
              type="button"
              onClick={() => setShowHelp((prev) => !prev)}
              className="inline-flex items-center gap-1 font-medium text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer"
            >
              <HelpCircle size={13} />
              <span>Need help?</span>
            </button>
          </div>

          {/* Expandable Access / Reset Help Drawer */}
          {showHelp && (
            <div className="mt-3 rounded-xl bg-[#fafafa] p-3.5 text-xs leading-relaxed text-[#52525b] ring-1 ring-inset ring-black/[0.06]">
              <p className="font-medium text-[#18181b] mb-1">
                Account &amp; Password Recovery
              </p>
              <p>
                Self-service password resets are disabled for staff security.
                Contact your store <strong>Super Admin</strong> to issue a
                temporary password or provision staff permissions.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Legal / Audit Footer */}
        <p className="mt-6 text-center text-[11px] text-[#a1a1aa]">
          Protected workspace. All administrative sign-ins are logged.
        </p>
      </div>
    </main>
  );
}
