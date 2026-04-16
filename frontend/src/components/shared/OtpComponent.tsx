"use client";

import Link from "next/link";
import Image from "next/image";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

const OTP_LENGTH = 6;

type OtpComponentProps = {
  destination?: string;
  onVerify?: (code: string) => void;
  onResend?: () => void;
  onBackToLogin?: () => void;
  onUseAnotherMethod?: () => void;
  onContactSupport?: () => void;
};

export default function OtpComponent({
  destination = "sa***@mail.com",
  onVerify,
  onResend,
  onBackToLogin,
  onUseAnotherMethod,
  onContactSupport,
}: OtpComponentProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const code = otp.join("");

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const updateOtp = (index: number, value: string) => {
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
  };

  const handleChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "");

    if (!sanitized) {
      updateOtp(index, "");
      return;
    }

    if (sanitized.length > 1) {
      const nextOtp = [...otp];
      sanitized.slice(0, OTP_LENGTH).split("").forEach((digit, offset) => {
        if (index + offset < OTP_LENGTH) {
          nextOtp[index + offset] = digit;
        }
      });
      setOtp(nextOtp);
      focusInput(Math.min(index + sanitized.length, OTP_LENGTH - 1));
      return;
    }

    updateOtp(index, sanitized);

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      if (otp[index]) {
        updateOtp(index, "");
        return;
      }

      if (index > 0) {
        updateOtp(index - 1, "");
        focusInput(index - 1);
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!pasted.length) {
      return;
    }

    const nextOtp = Array(OTP_LENGTH).fill("");
    pasted.forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);
    focusInput(Math.min(pasted.length - 1, OTP_LENGTH - 1));
  };

  const handleVerify = () => {
    if (code.length === OTP_LENGTH) {
      onVerify?.(code);
    }
  };

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#d9d1c5] px-4 py-4 sm:px-6 lg:px-8">
      {/* Background elements remain same */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),linear-gradient(180deg,rgba(10,72,51,0.08),rgba(10,72,51,0.18))]" />
      <div className="absolute inset-0 -z-20 bg-cover bg-center" aria-hidden="true">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/loginimages/loginBg.webp"
        >
          <source src="/home/homepage-herosection.webm" type="video/webm" />
        </video>
      </div>

      <div className="mx-auto w-full max-w-[1300px]">
        <div className="overflow-hidden rounded-[34px] border-[4px] border-white/95 bg-transparent">
          {/* Reduced min-height from 760px to 600px */}
          <div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
            <div className="relative hidden lg:block">
              <div className="absolute inset-y-0 left-0 w-[110%] overflow-hidden rounded-[34px] bg-transparent z-10" />
            </div>

            {/* Reduced vertical padding from py-10 to py-6 */}
            <div className="relative flex items-center justify-center bg-white px-6 py-6 sm:px-10 lg:px-14">
              <div className="w-full max-w-[400px]">
                {/* Reduced margin-bottom */}
                <div className="mb-4 flex justify-center">
                  <div className="rounded-b-[16px] bg-[#f3e8c8] px-3 pb-2 pt-1 shadow-[0_8px_16px_rgba(159,129,81,0.12)]">
                    <Image
                      src="/logo/zawadi-logo.webp"
                      alt="Zawadi"
                      width={40}
                      height={48}
                      className="h-[48px] w-[40px] object-contain"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a4833]/10 text-[#0a4833]">
                      <Lock className="h-4 w-4 fill-current" strokeWidth={2.2} />
                    </div>
                    <h1 className="text-[24px] font-bold tracking-tight text-[#0a4833]">
                      Enter Verification Code
                    </h1>
                  </div>

                  <p className="mx-auto max-w-[340px] text-[14px] leading-relaxed text-[#4b5563]">
                    We&apos;ve sent a secure verification code to your registered
                    email or phone.
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#ebe1cf]/60 px-3 py-1.5 text-xs text-[#374151]">
                    <Mail className="h-3 w-3 text-[#9f8151]" strokeWidth={2.2} />
                    <span>Sent to <span className="font-semibold">{destination}</span></span>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-3 block text-center text-xs font-semibold uppercase tracking-wider text-[#0a4833]">
                    6-Digit Verification Code
                  </label>

                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={digit}
                        onChange={(event) => handleChange(index, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        onPaste={handlePaste}
                        // Slightly smaller inputs: h-14 instead of h-[72px]
                        className="h-[52px] w-[42px] rounded-lg border-2 border-[#dfdfdf] bg-white text-center text-[20px] font-semibold text-[#0a4833] outline-none transition focus:border-[#0a4833] sm:h-[64px] sm:w-[52px]"
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={onResend}
                    className="mt-4 block w-full text-center text-xs font-semibold text-[#0a4833]/60 hover:text-[#0a4833]"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={code.length !== OTP_LENGTH}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#0a4833] px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0c5a40]  disabled:cursor-not-allowed"
                >
                  <span>Verify Code</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </button>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#dfdfdf]/40 px-4 text-xs font-medium text-[#374151] hover:bg-[#dfdfdf]/60"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
                    <span>Back to Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={onUseAnotherMethod}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#dfdfdf]/40 px-4 text-xs font-medium text-[#374151] hover:bg-[#dfdfdf]/60"
                  >
                    <Phone className="h-3.5 w-3.5" strokeWidth={2.2} />
                    <span>Other Method</span>
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-[#ebe1cf]/30 p-3">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#9f8151] mt-0.5" strokeWidth={2.2} />
                    <p className="text-[12px] leading-snug text-[#374151]">
                      This helps us keep your ZEWADI account secure. Please enter
                      the code exactly as received.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onContactSupport}
                  className="mt-4 flex w-full items-center justify-center gap-2 text-xs font-semibold text-[#0a4833] hover:underline"
                >
                  <Headphones className="h-3.5 w-3.5" strokeWidth={2.2} />
                  <span>Contact Support</span>
                </button>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-[10px] text-[#0a4833]/70">
                  <Link href="#" className="hover:text-[#0a4833]">Privacy Policy</Link>
                  <Link href="#" className="hover:text-[#0a4833]">Terms</Link>
                  <Link href="#" className="hover:text-[#0a4833]">Help</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}