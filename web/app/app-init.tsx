"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { authApi } from "@/features/auth/apis/auth.api";

export default function AppInit() {
  const { setAccessToken, setLoading, accessToken, setUser } = useAuthStore();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const initAuth = async () => {
      setLoading(true);

      try {
        const res = await authApi.refreshToken();
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);

      } catch {
        // chưa login → bỏ qua
      } finally {
        setLoading(false);
        console.log(accessToken, "đã refresh token thành công trong AppInit"); 
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
