"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ fixed

const SIGNUP_BACKGROUND =
  "https://www.figma.com/api/mcp/asset/4804ac51-5a50-48be-b3c6-1a9b2f636148";

export default function SignupComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // your signup logic here (API call etc)

    // redirect to login page
    router.push("/login");
  };

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:pt-30">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${SIGNUP_BACKGROUND}")` }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 w-full max-w-[460px] rounded-[24px] bg-white px-8 py-6 text-[#1f2937] shadow-[0_24px_80px_rgba(15,23,42,0.28)] sm:max-w-[500px] ">

        <div className="text-center">
          <h1 className="text-[20px] font-bold leading-none text-[#111827]">
            Create your account
          </h1>
          <p className="mt-1.5 text-[11px] text-[#6b7280]">
            Start building proposals in minutes
          </p>
        </div>

        <button
          type="button"
          className="mt-4 flex h-[38px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-white text-[12px] font-medium text-[#374151] transition hover:bg-[#fafafa]"
        >
          <span className="text-[14px] font-semibold text-[#ef4444]">G</span>
          Continue with Google
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#e5e7eb]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[10px] text-[#9ca3af]">
              or sign up with email
            </span>
          </div>
        </div>

        {/* ✅ Added onSubmit here */}
        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <label className="mb-1 block text-[10px] text-[#374151]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="h-[38px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[12px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#0f5b43]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] text-[#374151]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="h-[38px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[12px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#0f5b43]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] text-[#374151]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="h-[38px] w-full rounded-[8px] border border-[#e5e7eb] px-3 pr-10 text-[12px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#0f5b43]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="h-[3px] flex-1 rounded-full bg-[#e5e7eb]" />
              <div className="h-[3px] flex-1 rounded-full bg-[#e5e7eb]" />
              <div className="h-[3px] flex-1 rounded-full bg-[#e5e7eb]" />
              <div className="h-[3px] flex-1 rounded-full bg-[#e5e7eb]" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] text-[#374151]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="h-[38px] w-full rounded-[8px] border border-[#e5e7eb] px-3 pr-10 text-[12px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#0f5b43]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 pt-1 text-[10px] text-[#6b7280]">
            <input type="checkbox" className="mt-[1px] h-3 w-3 accent-[#0f5b43]" />
            <span>
              I agree to the{" "}
              <Link href="#" className="text-[#2563eb] hover:underline">
                Terms and Conditions
              </Link>{" "}
              &{" "}
              <Link href="#" className="text-[#2563eb] hover:underline">
                Privacy policy
              </Link>
            </span>
          </label>

          <button
            type="submit"
            className="mt-1 h-[40px] w-full rounded-[8px] bg-[#0f5b43] text-[12px] font-medium text-white transition hover:bg-[#0c4a36]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-[#6b7280]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0f5b43] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}