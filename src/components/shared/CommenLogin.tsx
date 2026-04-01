"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function CommenLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="relative isolate overflow-hidden bg-[#f5f2ec] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div
        className="absolute inset-0 -z-20 bg-[url('/loginimages/loginBg.webp')] bg-cover bg-center"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(32,24,14,0.42),rgba(32,24,14,0.38))]"
        aria-hidden="true"
      />

      {/* ✅ HEIGHT REDUCED ONLY HERE */}
      <div className="mx-auto flex min-h-[450px] max-w-[1400px] items-center justify-center pt-20">
        <div className="w-full max-w-[00px] rounded-[25px] bg-white px-6 py-8 shadow-[0_24px_70px_rgba(20,20,20,0.18)] sm:px-10 sm:py-12">
          <div className="text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.03em] text-[#111827]">
              Create your account
            </h1>
            <p className="mt-2 text-sm tracking-[-0.02em] text-[#4b5563]">
              Start building proposals in minutes
            </p>
          </div>

          <div className="mt-7">
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-4 text-base font-medium tracking-[-0.02em] text-[#374151] transition hover:bg-[#f9fafb]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.32-2.04 3.03l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.48 0-.71-.06-1.39-.19-2.05H12Z"/>
                <path fill="#4285F4" d="M12 21.5c2.73 0 5.03-.9 6.7-2.43l-3.3-2.56c-.91.61-2.08.97-3.4.97-2.61 0-4.82-1.76-5.61-4.12H2.98v2.65A10.12 10.12 0 0 0 12 21.5Z"/>
                <path fill="#FBBC05" d="M6.39 13.36a6.08 6.08 0 0 1 0-3.86V6.85H2.98a10.12 10.12 0 0 0 0 9.16l3.41-2.65Z"/>
                <path fill="#34A853" d="M12 8.52c1.48 0 2.81.51 3.86 1.5l2.89-2.89C17.02 5.52 14.72 4.5 12 4.5A10.12 10.12 0 0 0 2.98 6.85l3.41 2.65C7.18 10.28 9.39 8.52 12 8.52Z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative mt-5">
            <div className="border-t border-[#e5e7eb]" />
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm tracking-[-0.02em] text-[#6b7280]">
              or sign up with email
            </span>
          </div>

          <form className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium tracking-[-0.02em] text-[#374151]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="h-12 w-full rounded-[12px] border border-[#e5e7eb] px-4 text-base text-black outline-none placeholder:text-gray-400:text-black focus:border-[#0a4834] focus:ring-2 focus:ring-[#0a4834]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium tracking-[-0.02em] text-[#374151]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 w-full rounded-[12px] border border-[#e5e7eb] px-4 text-base text-black outline-none placeholder:text-gray-400:text-black focus:border-[#0a4834] focus:ring-2 focus:ring-[#0a4834]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium tracking-[-0.02em] text-[#374151]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="h-12 w-full rounded-[12px] border border-[#e5e7eb] px-4 pr-12 text-base text-black outline-none placeholder:text-gray-400:text-black focus:border-[#0a4834] focus:ring-2 focus:ring-[#0a4834]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] transition hover:text-[#0a4834]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mt-2 grid grid-cols-4 gap-1">
                <span className="h-1 rounded-full bg-[#e5e7eb]" />
                <span className="h-1 rounded-full bg-[#e5e7eb]" />
                <span className="h-1 rounded-full bg-[#e5e7eb]" />
                <span className="h-1 rounded-full bg-[#e5e7eb]" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium tracking-[-0.02em] text-[#374151]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="h-12 w-full rounded-[12px] border border-[#e5e7eb] px-4 pr-12 text-base text-black outline-none placeholder:text-gray-400:text-black focus:border-[#0a4834] focus:ring-2 focus:ring-[#0a4834]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] transition hover:text-[#0a4834]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-1 text-sm tracking-[-0.02em] text-[#4b5563]">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded-[2px] border border-[#9ca3af] accent-[#0a4834]"
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="text-[#3b82f6] hover:underline">
                  Terms and Conditions
                </Link>{" "}
                &{" "}
                <Link href="#" className="text-[#3b82f6] hover:underline">
                  Privacy policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#0a4834] text-base font-medium text-white transition hover:bg-[#083a2b]"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-base text-[#4b5563]">
              Already have an account?
            </p>
            <Link
              href="#"
              className="mt-1 inline-block text-base font-medium text-[#0a4834] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}