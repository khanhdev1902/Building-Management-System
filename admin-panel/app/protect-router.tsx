"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, isAuthLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // đợi AppInit chạy xong
    console.log("ProtectedRoute check accessToken:", accessToken, "isAuthLoading:", isAuthLoading);
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, isAuthLoading, router]);

  // đang loading → chưa render gì
  if (isAuthLoading) return null;

  // chưa có token → không render
  if (!accessToken) return null;

  return <>{children}</>;
}