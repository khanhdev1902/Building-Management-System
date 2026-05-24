"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("TENANT" | "ADMIN" | "STAFF")[]; // Các role được phép vào
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { accessToken, isAuthLoading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 1. Đợi load xong auth state
    if (isAuthLoading) return;

    // 2. Chưa đăng nhập -> đá về login
    if (!accessToken) {
      router.replace("/login");
      return;
    }

    // 3. Đã đăng nhập nhưng chưa có thông tin user (đang fetch hoặc lỗi)
    if (!user) return;

    // 4. Kiểm tra phân quyền (Role-based Authorization)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Nếu sai role, đá về trang chủ tương ứng của role đó (tránh loop)
      if (user.role === "ADMIN" || user.role === "STAFF") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [accessToken, isAuthLoading, user, allowedRoles, router]);

  // Trong lúc loading hoặc chưa đủ điều kiện data thì không hiện gì (hoặc hiện Loading Spinner)
  if (isAuthLoading || !accessToken || !user) {
    return null; // Hoặc <LoadingSkeleton />
  }

  // Nếu có yêu cầu role cụ thể mà user hiện tại không khớp -> chặn render children
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
