"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import OtpComponent from "@/components/shared/OtpComponent";
import api from "@/services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/userSlice";
import type { AppDispatch } from "@/redux/store";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const email = searchParams.get("email") ?? "";
  const purpose = searchParams.get("purpose") ?? "EMAIL_VERIFICATION";

  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) router.replace("/register");
  }, [email, router]);

  const handleVerify = async (code: string) => {
    setError("");
    try {
      const { data } = await api.post("/account/otp/verify/", { email, code, purpose });

      if (purpose === "EMAIL_VERIFICATION") {
        dispatch(setCredentials({
          userId: data.data.user_id,
          role: data.data.role,
          email: data.data.email,
        }));
        router.replace("/communityDashBoard");
      } else {
        router.replace(`/forgot-password?step=confirm&reset_token=${data.reset_token}&email=${encodeURIComponent(email)}`);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? "Invalid or expired code. Please try again.");
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await api.post("/account/otp/resend/", { email, purpose });
    } catch {
      setError("Could not resend code. Please wait a moment and try again.");
    }
  };

  return (
    <div>
      <Navbar />
      {error && (
        <p className="text-center text-red-600 text-sm mt-4">{error}</p>
      )}
      <OtpComponent
        destination={maskEmail(email)}
        onVerify={handleVerify}
        onResend={handleResend}
        onBackToLogin={() => router.replace("/login")}
        onUseAnotherMethod={() => router.replace("/register")}
        onContactSupport={() => window.open("mailto:support@zawadi.com")}
      />
      <Footer />
    </div>
  );
}
