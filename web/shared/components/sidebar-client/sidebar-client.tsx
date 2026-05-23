"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  Home,
  Receipt,
  Wrench,
  Bell,
  ShieldAlert,
  User,
  LogOut,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/shared/components/ui/separator";

// Menu được phân loại gọn gàng đúng góc nhìn của một người đi thuê
const TENANT_NAVIGATION = [
  {
    group: "Không gian sống",
    items: [
      { title: "Tổng quan phòng", href: "/dashboard", icon: Home },
      { title: "Hóa đơn & Chi phí", href: "/invoices", icon: Receipt },
      { title: "Báo cáo sự cố", href: "/tickets", icon: Wrench },
    ],
  },
  {
    group: "Tòa nhà & An ninh",
    items: [
      { title: "Thông báo chung", href: "/notifications", icon: Bell },
      { title: "Sự cố khẩn cấp", href: "/emergency", icon: ShieldAlert },
    ],
  },
];

export default function SidebarClient() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-slate-200/60 bg-white"
    >
      {/* 1. SIDEBAR HEADER: Đồng bộ chiều cao h-14 phẳng mịn với Header chính */}
      <SidebarHeader className="flex h-14 items-center px-4 justify-between border-b border-slate-200/60 select-none">
        <div className="flex items-center gap-2.5 overflow-hidden transition-all duration-200">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Building2 className="h-4.5 w-4.5 stroke-2" />
          </div>
          {open && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-800 tracking-tight leading-none">
                Danjin BMS
              </span>
              <span className="text-[10px] text-slate-400 font-medium font-mono mt-1">
                Tenant Portal
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* 2. SIDEBAR CONTENT: Danh sách tính năng */}
      <SidebarContent className="gap-0 py-3 bg-white">
        {TENANT_NAVIGATION.map((group, index) => (
          <SidebarGroup key={index} className="px-3 py-1.5">
            {open && (
              <SidebarGroupLabel className="text-[9px] font-bold uppercase tracking-wider text-slate-400/90 px-2 mb-1.5 select-none">
                {group.group}
              </SidebarGroupLabel>
            )}
            <SidebarMenu className="gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-9 w-full rounded-lg px-2.5 transition-all duration-200 border ${
                        isActive
                          ? "bg-indigo-50/70 border-indigo-100/80 text-indigo-600 font-semibold shadow-xs"
                          : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-100/50"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <item.icon
                          className={`h-4 w-4 shrink-0 stroke-[1.8] ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                        />
                        <span className="text-xs tracking-tight">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* 3. SIDEBAR FOOTER: Hồ sơ cư dân thu nhỏ */}
      <SidebarFooter className="p-3 border-t border-slate-100 bg-slate-50/30 select-none">
        <SidebarMenu>
          {/* Nút trang cá nhân */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Tài khoản cá nhân"
              className="h-10 w-full rounded-lg px-2 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Link href="/profile" className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 border border-slate-300/50 text-slate-600">
                  <User className="h-3.5 w-3.5 stroke-2" />
                </div>
                {open && (
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-xs font-semibold text-slate-800 truncate leading-none">
                      Nguyễn Văn Khanh
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium font-mono mt-1 leading-none">
                      Phòng 202
                    </span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {open && <Separator className="my-1.5 bg-slate-200/60" />}

          {/* Nút Đăng xuất */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Đăng xuất"
              className="h-9 w-full rounded-lg px-2.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100/50 transition-all duration-200"
              onClick={() => console.log("Logout triggered")}
            >
              <div className="flex items-center gap-3 w-full">
                <LogOut className="h-4 w-4 shrink-0 stroke-[1.8]" />
                <span className="text-xs font-medium tracking-tight">
                  Đăng xuất
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
