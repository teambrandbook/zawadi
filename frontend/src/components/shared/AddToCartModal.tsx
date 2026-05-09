"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setCredentials, setCartCount } from "@/redux/userSlice";

type AddToCartModalProps = {
  isOpen: boolean;
  productId: number;
  variantId?: number;
  quantity?: number;
  onClose: () => void;
  onSuccess: (cartCount: number) => void;
};

export default function AddToCartModal({
  isOpen,
  productId,
  variantId,
  quantity = 1,
  onClose,
  onSuccess,
}: AddToCartModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [tab, setTab] = useState<"guest" | "signin">("guest");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Fix 4: Reset state when modal closes (must be before the early return)
  React.useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setInlineError(null);
      setTab("guest");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function switchTab(next: "guest" | "signin") {
    setTab(next);
    setInlineError(null);
  }

  async function handleGuest() {
    setLoading(true);
    setInlineError(null);
    // Fix 3: Trim email before API calls
    const trimmedEmail = email.trim();
    if (password.trim().length < 8) {
      setInlineError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    try {
      const emailPrefix = trimmedEmail.split("@")[0];
      const suffix = Math.floor(1000 + Math.random() * 9000);

      // 1. Register
      try {
        await api.post("/account/register/", {
          email: trimmedEmail,
          password,
          user_type: "guest",
          full_name: emailPrefix,
          user_name: `${emailPrefix}_${suffix}`,
        });
      } catch (err: unknown) {
        const errData = (err as { response?: { data?: { email?: string[] } } }).response?.data;
        if (errData?.email) {
          setTab("signin");
          setInlineError("Account exists — sign in instead");
          setLoading(false);
          return;
        }
        throw err;
      }

      // 2. Login
      const loginRes = await api.post("/account/login/", { email: trimmedEmail, password });
      // Fix 1: Response is nested under .data — { message, data: { user_id, email, role }, access }
      const { user_id, role, email: userEmail } = loginRes.data.data ?? loginRes.data;

      // 3. GET /me/
      const meRes = await api.get<{
        full_name: string;
        user_type: string;
      }>("/account/me/");
      const { full_name, user_type } = meRes.data;

      // 4. POST cart
      const cartRes = await api.post("/orders/cart/items/", {
        product_id: productId,
        ...(variantId ? { variant_id: variantId } : {}),
        quantity,
      });
      const count: number = cartRes.data.summary?.item_count ?? 0;

      // 5. Dispatch auth + cart
      dispatch(
        setCredentials({
          userId: user_id,
          role,
          email: userEmail,
          fullName: full_name || emailPrefix,
          userType: user_type === "guest" ? "guest" : "member",
        })
      );
      dispatch(setCartCount(count));

      // 6. Close
      toast.success("Added to cart!");
      onSuccess(count);
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setLoading(true);
    setInlineError(null);
    // Fix 3: Trim email before API calls
    const trimmedEmail = email.trim();
    if (password.trim().length < 8) {
      setInlineError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    try {
      // 1. Login — Fix 2: narrow wrong-password error to this step only
      let loginData: { user_id: string; role: string; email: string };
      try {
        const loginRes = await api.post("/account/login/", { email: trimmedEmail, password });
        // Fix 1: Response is nested under .data — { message, data: { user_id, email, role }, access }
        loginData = loginRes.data.data ?? loginRes.data;
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } }).response?.status;
        if (status === 400 || status === 401) {
          setInlineError("Incorrect password");
          setLoading(false);
          return;
        }
        throw err;
      }
      const { user_id, role, email: userEmail } = loginData;

      // 2. GET /me/
      const meRes = await api.get<{
        full_name: string;
        user_type: string;
      }>("/account/me/");
      const { full_name, user_type } = meRes.data;

      // 3. POST cart
      const cartRes = await api.post("/orders/cart/items/", {
        product_id: productId,
        ...(variantId ? { variant_id: variantId } : {}),
        quantity,
      });
      const count: number = cartRes.data.summary?.item_count ?? 0;

      // 4. Dispatch auth + cart
      dispatch(
        setCredentials({
          userId: user_id,
          role,
          email: userEmail,
          fullName: full_name,
          userType: user_type === "guest" ? "guest" : "member",
        })
      );
      dispatch(setCartCount(count));

      // 5. Close
      toast.success("Added to cart!");
      onSuccess(count);
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
          Sign in to add to cart
        </h2>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => switchTab("guest")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              tab === "guest"
                ? "bg-[#1f4d3a] text-white"
                : "text-[#6b7280] hover:bg-gray-50"
            }`}
          >
            New here?
          </button>
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
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
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
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
            />
          </div>

          {inlineError && (
            <p className="text-sm font-medium text-red-600">{inlineError}</p>
          )}

          {tab === "guest" && !inlineError && (
            <p className="text-xs text-[#6b7280]">
              You can complete your profile details later
            </p>
          )}

          <button
            type="button"
            onClick={tab === "guest" ? handleGuest : handleSignIn}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full rounded-lg bg-[#1f4d3a] py-3 text-sm font-bold text-white transition hover:bg-[#1f4d3a]/90 disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : tab === "guest"
              ? "Continue as Guest"
              : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
