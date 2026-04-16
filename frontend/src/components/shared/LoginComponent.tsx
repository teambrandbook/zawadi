"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"guest" | "member">("member");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:8000/api/account/login/",
      {
        email,
        password,
      },
      {
        withCredentials: true, // ⭐ MUST
      }
    );

    const data = res.data.data;

    // ✅ redirect only
    if (data.role === "admin") {
      router.push("/admindashboard");
    } else if (data.role === "consultant") {
      router.push("/communityDashBorde");
    } else {
      router.push("/communityDashBorde");
    }

  } catch (error: unknown) {
    console.log("Login error:", error);
    alert("Login failed");
  }
};

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center bg-[#d9d1c5] px-4 sm:px-6 lg:px-8">
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

      <div className="mx-auto w-full max-w-[1300px] pb-10 pt-30 md:pt-12 lg:pt-45">
        <div className="overflow-hidden rounded-[34px] border-[4px] border-white/95 bg-transparent shadow-2xl">
          <div className="grid min-h-[680px] grid-cols-1 lg:grid-cols-2">
            <div className="relative hidden lg:block">
              <div className="absolute inset-y-0 left-0 w-[110%] rounded-[34px] bg-transparent z-10" />
            </div>

            <div className="relative flex items-center justify-center bg-white px-6 py-10 sm:px-8 lg:px-12">
              <div className="w-full max-w-[360px]">
                <div className="text-center mb-6">
                  <h1 className="text-[24px] font-bold tracking-tight text-[#0a4833]">
                    Welcome Back
                  </h1>
                  <p className="text-xs text-[#4b5563]">
                    Access your account details below
                  </p>
                </div>

                <div className="flex flex-col items-center mb-6 font-sans">
                  <h2 className="text-[#0a4833] text-xs font-bold uppercase tracking-widest mb-2">
                    Login as
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setLoginType("guest")}
                      className={`w-[130px] h-[42px] rounded-lg border-2 text-sm font-semibold transition-all ${loginType === "guest"
                          ? "border-[#9f8151] bg-[#fdfaf3] text-[#9f8151]"
                          : "border-gray-200 bg-white text-gray-400 opacity-60"
                        }`}
                    >
                      Guest
                    </button>
                    <span className="text-[#0a4833] text-lg font-bold italic">or</span>
                    <button
                      type="button"
                      onClick={() => setLoginType("member")}
                      className={`w-[130px] h-[42px] rounded-lg text-sm font-semibold transition-all ${loginType === "member"
                          ? "bg-[#0a4833] text-white shadow-md"
                          : "bg-gray-100 text-gray-400 opacity-60"
                        }`}
                    >
                      Member
                    </button>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-[#374151]">
                      Email Address
                    </label>
                    <input
                      required
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      type="email"
                      placeholder="name@company.com"
                      className="h-[44px] w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-[#0a4833] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-[#374151]">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="h-[44px] w-full rounded-lg border border-gray-300 px-4 pr-10 text-sm focus:border-[#0a4833] outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded accent-[#0a4833]" />
                      Remember me
                    </label>
                    <button type="button" className="font-bold text-[#9f8151]">
                      Forgot?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="h-[46px] w-full rounded-lg bg-[#0a4833] text-sm font-bold text-white shadow-lg hover:bg-[#0c5a40] transition active:scale-[0.98]"
                  >
                    Sign In
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-100"></span>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-white px-2 text-gray-400">Social Login</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4">
                      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.32-2.04 3.03l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.48 0-.71-.06-1.39-.19-2.05H12Z" />
                      <path fill="#4285F4" d="M12 21.5c2.73 0 5.03-.9 6.7-2.43l-3.3-2.56c-.91.61-2.08.97-3.4.97-2.61 0-4.82-1.76-5.61-4.12H2.98v2.65A10.12 10.12 0 0 0 12 21.5Z" />
                      <path fill="#FBBC05" d="M6.39 13.36a6.08 6.08 0 0 1 0-3.86V6.85H2.98a10.12 10.12 0 0 0 0 9.16l3.41-2.65Z" />
                      <path fill="#34A853" d="M12 8.52c1.48 0 2.81.51 3.86 1.5l2.89-2.89C17.02 5.52 14.72 4.5 12 4.5A10.12 10.12 0 0 0 2.98 6.85l3.41 2.65C7.18 10.28 9.39 8.52 12 8.52Z" />
                    </svg>
                    Google
                  </button>

                  <div className="pt-4 flex justify-center gap-4 text-[9px] font-bold uppercase text-[#0a4834]/60">
                    <Link href="#" className="hover:underline">Privacy</Link>
                    <Link href="#" className="hover:underline">Terms</Link>
                    <Link href="#" className="hover:underline">Support</Link>
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
