"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Mail, ShieldCheck } from "lucide-react";
import api from "@/services/api";

type Step = "request" | "otp" | "confirm";

const STEPS: Step[] = ["request", "otp", "confirm"];
const STEP_LABELS = ["Email", "Verify", "Reset"];

const OTP_LENGTH = 6;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStep = (searchParams.get("step") as Step) ?? "request";
  const initialEmail = searchParams.get("email") ?? "";
  const initialResetToken = searchParams.get("reset_token") ?? "";

  const [step, setStep] = useState<Step>(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const currentIndex = STEPS.indexOf(step);
  const code = otp.join("");

  /* ── OTP box helpers ── */
  const focusBox = (i: number) => {
    inputRefs.current[i]?.focus();
    inputRefs.current[i]?.select();
  };

  const handleOtpChange = (i: number, val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) {
      const next = [...otp];
      next[i] = "";
      setOtp(next);
      return;
    }
    if (digits.length > 1) {
      const next = [...otp];
      digits.slice(0, OTP_LENGTH).split("").forEach((d, offset) => {
        if (i + offset < OTP_LENGTH) next[i + offset] = d;
      });
      setOtp(next);
      focusBox(Math.min(i + digits.length, OTP_LENGTH - 1));
      return;
    }
    const next = [...otp];
    next[i] = digits;
    setOtp(next);
    if (i < OTP_LENGTH - 1) focusBox(i + 1);
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[i]) { const n = [...otp]; n[i] = ""; setOtp(n); return; }
      if (i > 0) { const n = [...otp]; n[i - 1] = ""; setOtp(n); focusBox(i - 1); }
    }
    if (e.key === "ArrowLeft" && i > 0) focusBox(i - 1);
    if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) focusBox(i + 1);
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (!pasted.length) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    focusBox(Math.min(pasted.length - 1, OTP_LENGTH - 1));
  };

  /* ── API handlers ── */
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/account/password-reset/request/", { email });
      setStep("otp");
    } catch {
      setError("Could not send reset code. Check the email address and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/account/password-reset/verify/", { email, code });
      setResetToken(data.reset_token);
      setStep("confirm");
    } catch {
      setError("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await api.post("/account/password-reset/confirm/", { reset_token: resetToken, new_password: newPassword });
      router.replace("/login?reset=success");
    } catch {
      setError("Could not reset password. The reset link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center bg-[#d9d1c5] px-4 py-8 sm:px-6 lg:px-8">
      {/* Background video */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay muted loop playsInline preload="metadata"
          poster="/loginimages/loginBg.webp"
        >
          <source src="/home/heroBg.webm" type="video/webm" />
        </video>
      </div>

      <div className="mx-auto w-full max-w-[1000px]">
        <div className="overflow-hidden rounded-[34px] shadow-2xl">
          <div className="grid min-h-[550px] grid-cols-1 lg:grid-cols-2">

            {/* ── Left decorative panel ── */}
            <div className="relative hidden lg:flex flex-col items-start justify-between overflow-hidden bg-[#0a4833] px-10 py-10">
              {/* Radial glow overlays */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(159,129,81,0.22)_0%,transparent_60%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_90%,rgba(255,255,255,0.05)_0%,transparent_55%)]" />

              {/* Decorative rings */}
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full border border-[#9f8151]/15" />
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full border border-[#9f8151]/10" />
              <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full border border-white/5" />

              {/* Logo */}
              <div className="relative z-10">
                <div className="inline-block rounded-b-[14px] bg-[#f3e8c8]/15 px-3 pb-2 pt-1 backdrop-blur-sm border border-white/10">
                  <Image
                    src="/logo/zewadi-logo.webp"
                    alt="Zawadi"
                    width={32}
                    height={40}
                    className="h-10 w-8 object-contain brightness-0 invert"
                  />
                </div>
              </div>

              {/* Center content */}
              <div className="relative z-10 flex flex-col gap-5">
                {/* Lock icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#9f8151]/30 bg-white/5 backdrop-blur-sm">
                  <ShieldCheck className="h-7 w-7 text-[#9f8151]" strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9f8151]">
                    Account Security
                  </p>
                  <h2 className="mt-2 text-[26px] font-bold leading-tight text-white">
                    Reset your<br />password safely
                  </h2>
                  <p className="mt-3 max-w-[200px] text-[12px] leading-relaxed text-white/50">
                    We&apos;ll verify your identity with a secure code before resetting.
                  </p>
                </div>

                {/* Step progress */}
                <div className="flex flex-col gap-2.5 pt-1">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300 ${
                        i < currentIndex
                          ? "bg-[#9f8151] text-white"
                          : i === currentIndex
                          ? "bg-white text-[#0a4833] shadow-lg"
                          : "border border-white/20 text-white/30"
                      }`}>
                        {i < currentIndex ? (
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : i + 1}
                      </div>

                      <div className="flex-1">
                        <p className={`text-[11px] font-semibold transition-colors ${
                          i === currentIndex ? "text-white" : i < currentIndex ? "text-[#9f8151]" : "text-white/25"
                        }`}>
                          {STEP_LABELS[i]}
                        </p>
                        <p className={`text-[10px] transition-colors ${
                          i === currentIndex ? "text-white/60" : "text-white/20"
                        }`}>
                          {i === 0 ? "Enter your email" : i === 1 ? "Enter 6-digit code" : "Choose new password"}
                        </p>
                      </div>

                      {i < STEPS.length - 1 && (
                        <div className={`absolute ml-3.5 mt-7 h-5 w-px translate-x-[-50%] transition-all duration-300 ${
                          i < currentIndex ? "bg-[#9f8151]/60" : "bg-white/10"
                        }`} style={{ marginLeft: "13px", marginTop: "28px", position: "relative", left: "-100%" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom trust badge */}
              <div className="relative z-10 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]" />
                <p className="text-[10px] font-medium text-white/60">
                  Secure · Encrypted · HTTPS
                </p>
              </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="relative flex items-center justify-center bg-white px-6 py-8 sm:px-8 lg:px-12">
              <div className="w-full max-w-[360px]">

                {/* Logo (mobile) + step dots (mobile) */}
                <div className="mb-5 flex items-center justify-between lg:hidden">
                  <div className="rounded-b-[12px] bg-[#f3e8c8] px-2.5 pb-1.5 pt-1">
                    <Image src="/logo/zewadi-logo.webp" alt="Zawadi" width={28} height={34} className="h-[34px] w-[28px] object-contain" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {STEPS.map((s, i) => (
                      <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex ? "w-6 bg-[#0a4833]" : i < currentIndex ? "w-3 bg-[#9f8151]" : "w-3 bg-gray-200"
                      }`} />
                    ))}
                  </div>
                </div>

                {/* ── Step 1: Email ── */}
                {step === "request" && (
                  <form onSubmit={handleRequest} className="space-y-4">
                    <div className="mb-1">
                      <div className="mb-3 hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a4833]/8">
                        <Mail className="h-5 w-5 text-[#0a4833]" strokeWidth={1.8} />
                      </div>
                      <h1 className="text-[22px] font-bold tracking-tight text-[#0a4833]">
                        Forgot password?
                      </h1>
                      <p className="mt-1 text-[12px] text-[#4b5563]">
                        Enter your email and we&apos;ll send a secure reset code.
                      </p>
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#374151]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-[42px] w-full rounded-lg border border-gray-300 px-4 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition focus:border-[#0a4833]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0a4833] text-sm font-bold text-white shadow-lg transition hover:bg-[#0c5a40] active:scale-[0.98] disabled:opacity-60"
                    >
                      {loading ? "Sending…" : (
                        <>Send reset code <ArrowRight className="h-4 w-4" strokeWidth={2.4} /></>
                      )}
                    </button>

                    <p className="text-center text-[12px] text-gray-400">
                      Remembered it?{" "}
                      <Link href="/login" className="font-semibold text-[#0a4833] hover:underline">
                        Back to login
                      </Link>
                    </p>
                  </form>
                )}

                {/* ── Step 2: OTP ── */}
                {step === "otp" && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="mb-1">
                      <div className="mb-3 hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a4833]/8">
                        <ShieldCheck className="h-5 w-5 text-[#0a4833]" strokeWidth={1.8} />
                      </div>
                      <h1 className="text-[22px] font-bold tracking-tight text-[#0a4833]">
                        Check your email
                      </h1>
                      <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-[#ebe1cf]/50 px-2.5 py-1 text-[11px] text-[#374151]">
                        <Mail className="h-3 w-3 text-[#9f8151]" strokeWidth={2} />
                        <span>Sent to <span className="font-semibold text-[#0a4833]">{email}</span></span>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="mb-3 block text-[10px] font-bold uppercase tracking-wide text-[#374151]">
                        6-Digit Reset Code
                      </label>
                      <div className="flex items-center justify-between gap-2">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el; }}
                            inputMode="numeric"
                            autoComplete={i === 0 ? "one-time-code" : "off"}
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            onPaste={handleOtpPaste}
                            className="h-[52px] w-[46px] rounded-lg border-2 border-gray-200 bg-white text-center text-[20px] font-semibold text-[#0a4833] outline-none transition focus:border-[#0a4833] focus:bg-[#0a4833]/5"
                            aria-label={`Code digit ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || code.length !== OTP_LENGTH}
                      className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0a4833] text-sm font-bold text-white shadow-lg transition hover:bg-[#0c5a40] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Verifying…" : (
                        <>Verify code <ArrowRight className="h-4 w-4" strokeWidth={2.4} /></>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setStep("request"); setError(""); setOtp(Array(OTP_LENGTH).fill("")); }}
                      className="w-full cursor-pointer text-center text-[12px] text-gray-400 transition-colors hover:text-gray-600"
                    >
                      Use a different email
                    </button>
                  </form>
                )}

                {/* ── Step 3: New password ── */}
                {step === "confirm" && (
                  <form onSubmit={handleConfirm} className="space-y-4">
                    <div className="mb-1">
                      <div className="mb-3 hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a4833]/8">
                        <ShieldCheck className="h-5 w-5 text-[#0a4833]" strokeWidth={1.8} />
                      </div>
                      <h1 className="text-[22px] font-bold tracking-tight text-[#0a4833]">
                        Set new password
                      </h1>
                      <p className="mt-1 text-[12px] text-[#4b5563]">
                        Choose a strong password of at least 8 characters.
                      </p>
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#374151]">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          required
                          minLength={8}
                          placeholder="Min. 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-[42px] w-full rounded-lg border border-gray-300 px-4 pr-10 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition focus:border-[#0a4833]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {/* Strength bar */}
                      {newPassword.length > 0 && (
                        <div className="mt-1.5 flex gap-1">
                          {[1, 2, 3, 4].map((lvl) => {
                            const strength = newPassword.length >= 12 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword) ? 4
                              : newPassword.length >= 10 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword) ? 3
                              : newPassword.length >= 8 ? 2 : 1;
                            return (
                              <div key={lvl} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                lvl <= strength
                                  ? strength === 1 ? "bg-red-400"
                                  : strength === 2 ? "bg-yellow-400"
                                  : strength === 3 ? "bg-blue-400"
                                  : "bg-[#0a4833]"
                                  : "bg-gray-200"
                              }`} />
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#374151]">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          required
                          placeholder="Repeat password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`h-[42px] w-full rounded-lg border px-4 pr-10 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition focus:border-[#0a4833] ${
                            confirmPassword && confirmPassword !== newPassword ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className="mt-1 text-[11px] text-red-500">Passwords don&apos;t match</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0a4833] text-sm font-bold text-white shadow-lg transition hover:bg-[#0c5a40] active:scale-[0.98] disabled:opacity-60"
                    >
                      {loading ? "Saving…" : (
                        <>Reset password <ArrowRight className="h-4 w-4" strokeWidth={2.4} /></>
                      )}
                    </button>
                  </form>
                )}

                {/* Footer links */}
                <div className="mt-6 flex justify-center gap-4 text-[9px] font-bold uppercase text-[#0a4834]/50">
                  <Link href="/privacy-policy" className="hover:text-[#0a4834] transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-[#0a4834] transition-colors">Terms & Conditions</Link>
                  <Link href="/helpandsupport" className="hover:text-[#0a4834] transition-colors">Help & Support</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
