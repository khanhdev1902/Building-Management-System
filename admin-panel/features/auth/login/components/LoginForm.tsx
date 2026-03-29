"use client";
import LoginTabs from "../../../../app/(auth)/login/components/LoginTabs";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";

import { itemVariants } from "../../../../app/(auth)/login/constants/animation";
import PasswordInput from "../../../../shared/components/forms/PasswordInput";
import { LoginFormValues, loginSchema } from "../schemas/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { authApi } from "../../apis/auth.api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

export default function LoginForm() {
  const [loginMethod, setLoginMethod] = useState("email");

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginMethod: "email" },
  });

  // Hàm xử lý khi đổi tab
  const handleTabChange = (value: string) => {
    setLoginMethod(value);
    setValue("loginMethod", value as "email" | "phone");
    clearErrors(["email", "phone"]); // Chuyển tab thì xóa lỗi cũ đi cho đẹp
  };

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      console.log("Đang xác thực...", data);

      // Giả lập gọi API trong 1.5s
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(data)
      const req = await authApi.login(data);
      console.log(req)

      // Giả sử đăng nhập thành công
      // 1. Lưu token vào Cookie hoặc LocalStorage ở đây (nếu có)

      // 2. Chuyển hướng sang trang Dashboard
      router.push("/dashboard");

      // Hoặc dùng router.replace("/dashboard") nếu không muốn user
      // nhấn nút Back quay lại trang Login sau khi đã đăng nhập
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) => {
    console.log("Vẫn còn lỗi này Khánh ơi: ", errors);
  };
  // Hiệu ứng trượt riêng cho phần Input khi chuyển tab
  const tabContentVariants = {
    initial: { x: loginMethod === "email" ? -20 : 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: loginMethod === "email" ? 20 : -20, opacity: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-sm space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">
          Chào mừng trở lại!
        </h1>
        <p className="text-muted-foreground mt-2">
          Đăng nhập để quản lý Danjin của bạn.
        </p>
      </motion.div>

      {/* Tabs */}
      <LoginTabs setLoginMethod={handleTabChange} />

      {/*Form */}
      <motion.form
        variants={itemVariants}
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        <div className="space-y-4 overflow-hidden px-4 py-2">
          {/* Email / Phone */}
          <div className="space-y-2 relative min-h-20">
            <Label>
              {loginMethod === "email" ? "Email quản trị" : "Số điện thoại"}
            </Label>
            <AnimatePresence mode="wait">
              <motion.div
                key={loginMethod}
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative group"
              >
                {loginMethod === "email" ? (
                  <>
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="admin@danjin.vn"
                      className="pl-9 h-11 focus-visible:ring-primary/10"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      {...register("phone")}
                      id="phone"
                      type="tel"
                      placeholder="09xx xxx xxx"
                      className="pl-9 h-11 focus-visible:ring-primary/10"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <a
                href="/forgot-password"
                className="text-xs text-primary hover:underline transition-all"
              >
                Quên mật khẩu?
              </a>
            </div>
            <PasswordInput register={register("password")} />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Remember */}
        <motion.div
          variants={itemVariants}
          className="flex items-center space-x-2"
        >
          <Checkbox {...register("remember")} id="remember" />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Ghi nhớ đăng nhập
          </label>
        </motion.div>

        {/* Submit */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            className="w-full h-11 text-base font-semibold group shadow-lg shadow-primary/20 transition-all active:scale-95"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Đang kết nối...
              </div>
            ) : (
              <>
                Đăng nhập
                <ArrowRight className="ml-2 h-4 w-4 ..." />
              </>
            )}
            {/* <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /> */}
          </Button>
        </motion.div>
      </motion.form>

      {/*Footer */}
      <motion.div variants={itemVariants} className="pt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Hỗ trợ kỹ thuật:{" "}
          <span className="text-primary font-medium hover:underline cursor-pointer">
            Liên hệ ngay
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
