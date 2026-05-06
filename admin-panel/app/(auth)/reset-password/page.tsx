/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  ShieldCheck,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Logic kiểm tra độ mạnh mật khẩu
  const strengthChecks = useMemo(() => {
    const p = formData.password;
    return [
      { label: "Ít nhất 8 ký tự", met: p.length >= 8 },
      { label: "Có chữ cái & chữ số", met: /[A-Za-z]/.test(p) && /\d/.test(p) },
      { label: "Có ký tự đặc biệt (@,!,#...)", met: /[^A-Za-z0-9]/.test(p) },
    ];
  }, [formData.password]);

  const isPasswordMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";
  const isAllValid = strengthChecks.every((c) => c.met) && isPasswordMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAllValid) {
      // Giả lập API update mật khẩu
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Hiệu ứng nền mờ (Gia vị UI) */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-2"
      >
        <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
          <Building2 className="text-white h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">Danjin BMS</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 z-10"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="reset-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-bold tracking-tight">
                  Thiết lập mật khẩu mới
                </h1>
                <p className="text-slate-500 text-sm">
                  Vui lòng nhập mật khẩu mới đảm bảo tính bảo mật cao nhất cho
                  hệ thống.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mật khẩu mới */}
                <div className="space-y-2 group">
                  <Label htmlFor="password">Mật khẩu mới</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10 h-12 rounded-xl focus-visible:ring-indigo-500/20 transition-all"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Check độ mạnh mật khẩu (UX ăn tiền) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2">
                  {strengthChecks.map((check, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs font-medium"
                    >
                      {check.met ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-200" />
                      )}
                      <span
                        className={
                          check.met ? "text-emerald-600" : "text-slate-400"
                        }
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Nhập lại mật khẩu */}
                <div className="space-y-2 group">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <ShieldCheck
                      className={`absolute left-3.5 top-3.5 h-4 w-4 transition-colors ${isPasswordMatch ? "text-emerald-500" : "text-slate-400"}`}
                    />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-10 h-12 rounded-xl focus-visible:ring-indigo-500/20"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  {formData.confirmPassword && !isPasswordMatch && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                      <XCircle className="h-3 w-3" /> Mật khẩu xác nhận không
                      khớp
                    </p>
                  )}
                </div>

                <Button
                  disabled={!isAllValid}
                  className="w-full h-12 font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-50 transition-all mt-2"
                >
                  Cập nhật mật khẩu
                </Button>
              </form>
            </motion.div>
          ) : (
            // TRẠNG THÁI THÀNH CÔNG
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Thành công!</h2>
                <p className="text-slate-500 text-sm">
                  Mật khẩu của bạn đã được thay đổi. Hãy sử dụng mật khẩu mới để
                  đăng nhập.
                </p>
              </div>
              <Link href="/login" className="block">
                <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 rounded-xl font-bold gap-2 group">
                  Đăng nhập ngay
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
