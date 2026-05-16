"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/userSlice";
import api from "@/services/api";
import { z } from "zod";
import { API_BASE_URL } from "@/lib/config";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const normalizeRole = (role?: string) => String(role ?? "").toLowerCase();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      const res = await api.post("/account/login/", { email, password });
      const data = res.data.data;
      const role = normalizeRole(data.role);

      // Fetch user_type — non-blocking; if it fails, route by role alone
      let userType: "guest" | "member" | null =
        data.user_type === "guest" || data.user_type === "member" ? data.user_type : null;
      try {
        const meRes = await api.get("/account/me/");
        userType = (meRes.data.user_type as "guest" | "member") ?? null;
      } catch {
        // /me/ failed after successful login — proceed without userType
      }

      dispatch(setCredentials({
        userId: data.user_id,
        role,
        email: data.email,
        userType,
      }));

      if (role === "admin" || role === "internal_staff") {
        router.push("/admindashboard");
      } else if (role === "consultant") {
        router.push("/consultant");
      } else if (role === "community_user" && userType === "guest") {
        router.push("/products");
      } else {
        router.push("/communityDashBoard");
      }
    } catch (error: unknown) {
      console.log("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/account/google/login/`;
  };

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center bg-[#d9d1c5] px-4 py-8 sm:px-6 lg:px-8">
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
          <source src="/home/heroBg.webm" type="video/webm" />
        </video>
      </div>

      <div className="mx-auto w-full max-w-[1000px]">
        <div className="overflow-hidden rounded-[34px] bg-transparent shadow-2xl">
          <div className="grid min-h-[550px] grid-cols-1 lg:grid-cols-2">
            <div className="relative hidden lg:block overflow-hidden">
              <div className="absolute inset-[4px] rounded-[30px] shadow-[0_0_0_1000px_white] z-10 pointer-events-none" />
            </div>

            <div className="relative flex items-center justify-center bg-white px-6 py-8 sm:px-8 lg:px-12 z-20">
              <div className="w-full max-w-[360px]">
                <div className="text-center mb-4">
                  <h1 className="text-[24px] font-bold tracking-tight text-[#0a4833]">
                    Welcome Back
                  </h1>
                  <p className="text-xs text-[#4b5563]">
                    Access your account details below
                  </p>
                </div>

                <form className="space-y-3" onSubmit={handleLogin}>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-[#374151]">
                      Email Address
                    </label>
                    <input
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="name@company.com"
                      className="h-[42px] w-full rounded-lg border border-gray-300 px-4 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#0a4833] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-[#374151]">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="h-[42px] w-full rounded-lg border border-gray-300 px-4 pr-10 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#0a4833] outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <a href="/forgot-password" className="text-xs text-gray-400 hover:text-gray-600 transition-colors block text-right">
                    Forgot password?
                  </a>

                  <button
                    type="submit"
                    className="flex h-[44px] w-full items-center justify-center rounded-lg bg-[#0a4833] text-sm font-bold text-white shadow-lg hover:bg-[#0c5a40] transition active:scale-[0.98]"
                  >
                    Sign In
                  </button>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-100"></span>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <Link
                        href="/signup"
                        className="bg-white px-2 font-bold text-[#0a4833] transition hover:text-[#9f8151] hover:underline"
                      >
                        Create an Account
                      </Link>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4">
                      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.32-2.04 3.03l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.48 0-.71-.06-1.39-.19-2.05H12Z" />
                      <path fill="#4285F4" d="M12 21.5c2.73 0 5.03-.9 6.7-2.43l-3.3-2.56c-.91.61-2.08.97-3.4.97-2.61 0-4.82-1.76-5.61-4.12H2.98v2.65A10.12 10.12 0 0 0 12 21.5Z" />
                      <path fill="#FBBC05" d="M6.39 13.36a6.08 6.08 0 0 1 0-3.86V6.85H2.98a10.12 10.12 0 0 0 0 9.16l3.41-2.65Z" />
                      <path fill="#34A853" d="M12 8.52c1.48 0 2.81.51 3.86 1.5l2.89-2.89C17.02 5.52 14.72 4.5 12 4.5A10.12 10.12 0 0 0 2.98 6.85l3.41 2.65C7.18 10.28 9.39 8.52 12 8.52Z" />
                    </svg>
                    Google
                  </button>

                  <div className="pt-2 flex justify-center gap-4 text-[9px] font-bold uppercase text-[#0a4834]/60">
                    <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                    <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
                    <Link href="/helpandsupport" className="hover:underline">Help & Support</Link>
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
