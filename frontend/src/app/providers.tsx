"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "sonner";
import { useEffect } from "react";
import api, { getAccessToken } from "@/services/api";
import { setCredentials, fetchCartCount, drainGuestCart } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";

// Restores auth state from cookies on every page load.
// AuthGuard only runs on protected pages — this covers public pages like /products.
function AuthRehydrator() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!getAccessToken()) return;

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
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </Provider>
  );
}
