"use client";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/40 to-slate-950 z-10" />

          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
              alt="Modern Office"
              className="object-cover"
              sizes="50vh"
              fill
            />
          </div>
        </motion.div>

        <div className="relative z-20 flex flex-col justify-between p-12 text-white h-full">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/50">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Danjin BMS</span>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-4xl font-bold leading-tight uppercase tracking-tighter">
              Quản lý tòa nhà <br /> thông minh & hiệu quả.
            </h2>
            <p className="text-slate-300 max-w-md italic font-light">
              Nâng tầm trải nghiệm vận hành chung cư mini tại Hà Nội.
            </p>
          </motion.div>

          <p className="text-sm text-slate-400 font-light">
            © 2026 Danjin System.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}
