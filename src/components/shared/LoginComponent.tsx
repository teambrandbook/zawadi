"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="relative isolate overflow-hidden bg-[#d9d1c5] h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        aria-hidden="true"
      >
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
        <div className="overflow-hidden rounded-[34px] border-[5px] border-white bg-whit ">

          <div className="grid min-h-[500px] grid-cols-1 lg:grid-cols-2 relative">
            {/* ✅ LEFT SIDE (UPDATED ONLY THIS) */}
            <div className="relative min-h-[280px] hidden lg:block">
              <div className="absolute inset-y-0 left-0 w-[110%] overflow-hidden rounded-[34px] bg-transparent z-10">
                {/* Background video will be visible */}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center bg-white px-6 py-7 sm:px-10 lg:px-14 lg:py-9 col-span-1 lg:col-span-1">              <div className="w-full max-w-[420px]">

              <div className="mb-8 flex justify-center">
                <div className="rounded-b-[20px] bg-[#f3e8c8] px-3 pb-3 pt-2 shadow-[0_8px_20px_rgba(140,112,48,0.14)]">
                  <div className="relative h-[60px] w-[50px]">
                    <Image
                      src="/logo/zawadi-logo.webp"
                      alt="Zewadi"
                      fill
                      className="object-contain"
                      sizes="50px"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h1 className="font-sans text-[30px] font-medium tracking-[-0.03em] text-[#0a4833] sm:text-[34px]">
                  Welcome Back
                </h1>
                <p className="mt-2 font-sans text-sm tracking-[-0.02em] text-[#3b3b3b]">
                  Enter your email and password to access your account
                </p>
              </div>

              <form className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="h-[50px] w-full rounded-[12px] border border-[#d1d5db] px-4 bg-white text-black placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-[50px] w-full rounded-[12px] border border-[#d1d5db] px-4 pr-12 bg-white text-black placeholder:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa3af]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-[#4b5563] sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" />
                    <span>Remember me</span>
                  </label>
                  <button className="font-semibold text-[#9f8151] hover:text-[#0a4833]">
                    Forgot Password?
                  </button>
                </div>

                <button className="h-[50px] w-full rounded-[12px] bg-[#0a4833] text-white">
                  Sign In
                </button>

                <button
                  type="button"
                  className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[12px] border border-[#d1d5db] bg-white px-4 text-base font-medium tracking-[-0.02em] text-[#646b76] transition hover:bg-[#f8faf8]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.32-2.04 3.03l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.48 0-.71-.06-1.39-.19-2.05H12Z" />
                    <path fill="#4285F4" d="M12 21.5c2.73 0 5.03-.9 6.7-2.43l-3.3-2.56c-.91.61-2.08.97-3.4.97-2.61 0-4.82-1.76-5.61-4.12H2.98v2.65A10.12 10.12 0 0 0 12 21.5Z" />
                    <path fill="#FBBC05" d="M6.39 13.36a6.08 6.08 0 0 1 0-3.86V6.85H2.98a10.12 10.12 0 0 0 0 9.16l3.41-2.65Z" />
                    <path fill="#34A853" d="M12 8.52c1.48 0 2.81.51 3.86 1.5l2.89-2.89C17.02 5.52 14.72 4.5 12 4.5A10.12 10.12 0 0 0 2.98 6.85l3.41 2.65C7.18 10.28 9.39 8.52 12 8.52Z" />
                  </svg>
                  <span>Sign in with google</span>
                </button>

                <div className="mt-4 flex justify-center items-center gap-8 text-sm text-[#0a4834]">
                  <Link href="#" className="hover:underline">privacy policy</Link>
                  <Link href="#" className="hover:underline">tearms & condition</Link>
                  <Link href="#" className="hover:underline">help & support</Link>
                </div>
              </form>

            </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}