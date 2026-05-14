"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import api from "@/services/api";

type Step = "request" | "otp" | "confirm";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStep = (searchParams.get("step") as Step) ?? "request";
  const initialEmail = searchParams.get("email") ?? "";
  const initialResetToken = searchParams.get("reset_token") ?? "";

  const [step, setStep] = useState<Step>(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8 space-y-6">
          {step === "request" && (
            <form onSubmit={handleRequest} className="space-y-4">
              <h1 className="text-2xl font-semibold">Forgot password</h1>
              <p className="text-sm text-gray-600">Enter your email and we will send you a reset code.</p>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <button type="submit" disabled={loading} className="w-full bg-green-800 text-white rounded py-2 text-sm font-medium disabled:opacity-50">
                {loading ? "Sending..." : "Send reset code"}
              </button>
              <p className="text-center text-sm">
                <a href="/login" className="text-green-800 hover:underline">Back to login</a>
              </p>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <h1 className="text-2xl font-semibold">Enter reset code</h1>
              <p className="text-sm text-gray-600">A 6-digit code was sent to {email}.</p>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <input
                type="text"
                required
                maxLength={6}
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full border rounded px-3 py-2 text-sm text-center tracking-widest text-lg"
              />
              <button type="submit" disabled={loading} className="w-full bg-green-800 text-white rounded py-2 text-sm font-medium disabled:opacity-50">
                {loading ? "Verifying..." : "Verify code"}
              </button>
              <button type="button" onClick={() => setStep("request")} className="w-full text-sm text-gray-500 hover:underline">
                Use a different email
              </button>
            </form>
          )}

          {step === "confirm" && (
            <form onSubmit={handleConfirm} className="space-y-4">
              <h1 className="text-2xl font-semibold">Set new password</h1>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <input
                type="password"
                required
                minLength={8}
                placeholder="New password (min 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                type="password"
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <button type="submit" disabled={loading} className="w-full bg-green-800 text-white rounded py-2 text-sm font-medium disabled:opacity-50">
                {loading ? "Saving..." : "Reset password"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
