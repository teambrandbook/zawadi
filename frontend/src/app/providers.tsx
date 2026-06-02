"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "sonner";
import { useEffect } from "react";
import api from "@/services/api";
import { setCredentials, fetchCartCount, drainGuestCart, setRehydrated } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import PushNotificationManager from "@/components/notifications/PushNotificationManager";

// Restores auth state from cookies on every page load.
// AuthGuard only runs on protected pages — this covers public pages like /products.
function AuthRehydrator() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Call /account/me/ unconditionally on mount. The httpOnly cookie will be sent
    // automatically via axios' withCredentials: true. Success populates Redux auth state;
    // 401/error leaves Redux empty (user appears logged out). This fixes cold page load
    // where getAccessToken() is null but the httpOnly cookie is still valid.
    api
      .get<{
        user_id?: string;
        email?: string;
        role?: string;
        full_name?: string;
        photo?: string;
        user_type?: string;
      }>("/account/me/")
      .then(({ data }) => {
        dispatch(
          setCredentials({
            userId: data.user_id,
            role: data.role,
            email: data.email,
            fullName: data.full_name,
            photo: data.photo ?? null,
            userType: (data.user_type as "guest" | "member") ?? null,
          })
        );
        dispatch(drainGuestCart()).then(() => {
          dispatch(fetchCartCount());
        });
      })
      .catch(() => {
        // Cookie expired or invalid — stay logged out, no action needed
      })
      .finally(() => {
        // Signal that rehydration is complete so auth guards can make routing decisions.
        dispatch(setRehydrated());
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthRehydrator />
      <PushNotificationManager />
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </Provider>
  );
}
