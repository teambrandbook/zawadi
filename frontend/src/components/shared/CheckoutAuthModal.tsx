"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setCredentials, drainGuestCart } from "@/redux/userSlice";
import api from "@/services/api";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CheckoutAuthModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function switchTab(t: "signin" | "signup") {
    setTab(t);
    setError(null);
  }

  async function loginAndDrain(trimmedEmail: string) {
    const loginRes = await api.post("/account/login/", {
      email: trimmedEmail,
      password,
    });
    const data = loginRes.data.data ?? loginRes.data;
    const meRes = await api.get<{ full_name: string; user_type: string }>(
      "/account/me/"
    );
    dispatch(
      setCredentials({
        userId: data.user_id,
        role: data.role,
        email: data.email,
        fullName: meRes.data.full_name,
        userType: meRes.data.user_type === "guest" ? "guest" : "member",
      })
    );
    await dispatch(drainGuestCart());
    router.push("/checkout");
    onClose();
  }

  async function handleSignIn() {
    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await loginAndDrain(email.trim());
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 400 || status === 401) {
        setError("Incorrect email or password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);
    const trimmedEmail = email.trim();
    try {
      const prefix =
        trimmedEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 15) ||
        "User";
      const suffix = Math.floor(1000 + Math.random() * 9000);
      try {
        const regRes = await api.post("/account/register/", {
          email: trimmedEmail,
          password,
          full_name: prefix,
          user_name: `${prefix}_${suffix}`,
        });
        if (regRes.data?.requires_otp) {
          window.location.href = `/otp?email=${encodeURIComponent(trimmedEmail)}&purpose=EMAIL_VERIFICATION`;
          return;
        }
      } catch (err: unknown) {
        const errData = (
          err as { response?: { data?: { email?: string[] } } }
        ).response?.data;
        if (errData?.email) {
          setError("Account already exists — sign in instead");
          setTab("signin");
          return;
        }
        throw err;
      }
      await loginAndDrain(trimmedEmail);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="mb-5 text-lg font-bold text-[#0a4833]">
          Sign in to checkout
        </h2>

        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => switchTab("signin")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              tab === "signin"
                ? "bg-[#1f4d3a] text-white"
                : "text-[#6b7280] hover:bg-gray-50"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchTab("signup")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              tab === "signup"
                ? "bg-[#1f4d3a] text-white"
                : "text-[#6b7280] hover:bg-gray-50"
            }`}
          >
            New here?
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600">{error}</p>
          )}

          <button
            type="button"
            onClick={tab === "signin" ? handleSignIn : handleSignUp}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full rounded-lg bg-[#1f4d3a] py-3 text-sm font-bold text-white transition hover:bg-[#1f4d3a]/90 disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : tab === "signin"
              ? "Sign In & Checkout"
              : "Create Account & Checkout"}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = `${API_BASE_URL}/account/google/login/`;
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.32-2.04 3.03l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.48 0-.71-.06-1.39-.19-2.05H12Z" />
              <path fill="#4285F4" d="M12 21.5c2.73 0 5.03-.9 6.7-2.43l-3.3-2.56c-.91.61-2.08.97-3.4.97-2.61 0-4.82-1.76-5.61-4.12H2.98v2.65A10.12 10.12 0 0 0 12 21.5Z" />
              <path fill="#FBBC05" d="M6.39 13.36a6.08 6.08 0 0 1 0-3.86V6.85H2.98a10.12 10.12 0 0 0 0 9.16l3.41-2.65Z" />
              <path fill="#34A853" d="M12 8.52c1.48 0 2.81.51 3.86 1.5l2.89-2.89C17.02 5.52 14.72 4.5 12 4.5A10.12 10.12 0 0 0 2.98 6.85l3.41 2.65C7.18 10.28 9.39 8.52 12 8.52Z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-[#9ca3af]">
            Your cart items will be saved after sign in
          </p>
        </div>
      </div>
    </div>
  );
}
