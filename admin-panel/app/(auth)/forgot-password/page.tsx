"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, Send, Building2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập gửi mail
    if (email) setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Logo phía trên card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-2"
      >
        <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center">
          <Building2 className="text-white h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">Danjin BMS</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-112.5 bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            // FORM NHẬP EMAIL
            <motion.div
              key="request-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Quên mật khẩu?
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Đừng lo lắng, hãy nhập email quản trị của bạn. Chúng tôi sẽ
                  gửi hướng dẫn đặt lại mật khẩu trong giây lát.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 group">
                  <Label
                    htmlFor="email"
                    className="text-slate-700 dark:text-slate-300"
                  >
                    Email hệ thống
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@danjin.vn"
                      className="pl-10 h-12 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 rounded-xl"
                    />
                  </div>
                </div>

                <Button className="w-full h-12 font-bold bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 group transition-all">
                  Gửi mã xác nhận
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
                </Link>
              </div>
            </motion.div>
          ) : (
            // THÔNG BÁO THÀNH CÔNG (SUCCESS STATE)
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Kiểm tra hộp thư!</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến <br />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {email}
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl"
                  onClick={() => setIsSubmitted(false)}
                >
                  Dùng email khác
                </Button>
                <p className="text-xs text-slate-400">
                  Không nhận được email? Check hòm thư Spam hoặc{" "}
                  <button className="text-primary hover:underline">
                    Thử lại
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer nhỏ */}
      <p className="mt-8 text-sm text-slate-400">
        Hỗ trợ kỹ thuật:{" "}
        <span className="font-medium text-slate-600 dark:text-slate-300">
          0988.xxx.xxx
        </span>
      </p>
    </div>
  );
}
