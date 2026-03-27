"use client";

import { useState } from "react";

export default function LoginComponent() {
  return (
    /* h-screen + overflow-hidden ensures no scrolling and perfect centering */
    <section className="relative flex h-[900px] w-full items-center justify-center overflow-hidden bg-gray-100 px-4 pt-10 ">

      {/* Background Image Layer */}
      <div
        className="absolute inset-0 z-0 bg-[url('/loginimages/loginBg.webp')] bg-cover bg-center"
        aria-hidden="true"
      />

      {/* Main Card: z-10 puts it above the background */}
      <div className="z-10 w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header - Reduced margin */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Create your account
          </h1>
          <p className="mt-0.5 text-sm text-[#64748B]">
            Start building proposals in minutes
          </p>
        </div>

        {/* Google Button */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E2E8F0] py-2 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Continue with Google
        </button>

        {/* Divider - Reduced margin */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E2E8F0]"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-3 text-[#64748B]">or sign up with email</span>
          </div>
        </div>

        {/* Form - Space-y reduced to 3 */}
        <form className="space-y-3">
          {/* Grid Container to place Name and Email side-by-side to save height */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 ml-1 block text-xs font-semibold text-[#334155]">Full Name</label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#10402E] focus:ring-1 focus:ring-[#10402E]"
              />
            </div>
            <div>
              <label className="mb-1 ml-1 block text-xs font-semibold text-[#334155]">Email Address</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#10402E] focus:ring-1 focus:ring-[#10402E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 ml-1 block text-xs font-semibold text-[#334155]">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#10402E] focus:ring-1 focus:ring-[#10402E]"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div className="mt-1.5 flex gap-1">
                <div className="h-1 flex-1 rounded-full bg-[#E2E8F0]"></div>
                <div className="h-1 flex-1 rounded-full bg-[#E2E8F0]"></div>
                <div className="h-1 flex-1 rounded-full bg-[#E2E8F0]"></div>
                <div className="h-1 flex-1 rounded-full bg-[#E2E8F0]"></div>
              </div>
            </div>

            <div>
              <label className="mb-1 ml-1 block text-xs font-semibold text-[#334155]">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm"
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#10402E] focus:ring-1 focus:ring-[#10402E]"
              />
            </div>
            <div className="flex items-start gap-3 px-1 py-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-[#E2E8F0] text-[#10402E] focus:ring-[#10402E] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs leading-relaxed text-[#64748B] cursor-pointer">
                I agree to the <span className="font-bold text-[#4e86ff] hover:underline cursor-pointer">Terms and Conditions</span> & <span className="font-bold text-[#4e86ff] hover:underline cursor-pointer">Privacy policy</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-[#10402E] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b2e21] active:scale-[0.99]"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link - Reduced margin */}
        <div className="mt-4 text-center text-sm font-medium">
          <span className="text-[#64748B]">Already have an account? </span>
          <button className="text-[#10402E] hover:underline underline-offset-4 font-bold">Sign in</button>
        </div>
      </div>
    </section>
  );
}