"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // đợi AppInit chạy xong
    if (loading) return;

    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, loading, router]);

  // đang loading → chưa render gì
  if (loading) return null;

  // chưa có token → không render
  if (!accessToken) return null;

  return <>{children}</>;
}