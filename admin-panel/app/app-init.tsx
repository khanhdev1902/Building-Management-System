"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { authApi } from "@/features/auth/apis/auth.api";

export default function AppInit() {
  const { setAccessToken, setLoading } = useAuthStore();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const initAuth = async () => {
      setLoading(true);

      try {
        const res = await authApi.refreshToken();
        setAccessToken(res.data.accessToken);
      } catch {
        // chưa login → bỏ qua
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
