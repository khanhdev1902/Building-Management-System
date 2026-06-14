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
  LayoutDashboard,
  Receipt,
  Wrench,
  Megaphone,
  ShieldAlert,
  LogOut,
  Building2,
  Sparkles,
  KeyRound,
  MessageSquare,
  Users, // Icon đại diện cho cộng đồng cư dân toàn tòa nhà
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Separator } from "@/shared/components/ui/separator";
import { SidebarFooterUser } from "@/features/auth/components/SideBarFooterUser";

// Bộ Menu chuẩn hóa theo luồng vận hành và tương tác thực tế của cư dân Danjin BMS
const TENANT_NAVIGATION = [
  {
    group: "Không gian của tôi",
    items: [
      { title: "Tổng quan phòng ở", href: "/dashboard", icon: LayoutDashboard },
      { title: "Hóa đơn & Biên lai", href: "/invoices", icon: Receipt },
      { title: "Hợp đồng điện tử", href: "/contracts", icon: KeyRound },
    ],
  },
  {
    group: "Tiện ích & Vận hành",
    items: [
      { title: "Dịch vụ & Tiện ích", href: "/services", icon: Sparkles },
      { title: "Báo cáo sự cố kỹ thuật", href: "/tickets", icon: Wrench },
    ],
  },
  {
    group: "Ban quản lý & Tương tác",
    items: [
      { title: "Bảng tin tòa nhà", href: "/notifications", icon: Megaphone },
      {
        title: "Hộp thoại hỗ trợ (BQL)",
        href: "/chat?type=private",
        icon: MessageSquare,
      },
      { title: "Cộng đồng cư dân", href: "/chat?type=group", icon: Users }, // 👈 ĐỒNG BỘ LUỒNG CHAT GROUP TOÀN TÒA
      // { title: "Hỗ trợ khẩn cấp", href: "/emergency", icon: ShieldAlert },
    ],
  },
];

export default function SidebarClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { open } = useSidebar();

  // Hàm kiểm tra trạng thái Active động, tính toán cả trường hợp dính Query Parameters (?type=...)
  const isItemActive = (href: string) => {
    const [basePath, queryStr] = href.split("?");
    if (pathname !== basePath) return false;
    if (!queryStr) return true; // Nếu menu không yêu cầu query, chỉ cần khớp pathname

    const paramKey = queryStr.split("=")[0];
    const paramValue = queryStr.split("=")[1];
    return searchParams.get(paramKey) === paramValue;
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-slate-100 bg-white"
    >
      {/* 1. SIDEBAR HEADER: Tối giản, đồng bộ chiều cao phẳng mịn h-14 */}
      <SidebarHeader className="flex h-14 items-center px-4 justify-between border-b border-slate-100 select-none">
        <div className="flex items-center gap-3 overflow-hidden transition-all duration-200">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
            <Building2 className="h-4 w-4 stroke-[2.2]" />
          </div>
          {open && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-slate-900 tracking-wider uppercase">
                Danjin BMS
              </span>
              <span className="text-[9px] text-slate-400 font-bold font-mono tracking-tight mt-0.5 uppercase">
                Tenant Portal
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* 2. SIDEBAR CONTENT: Phân nhóm dẹt khít, border hover mịn */}
      <SidebarContent className="gap-0 py-3 bg-white scrollbar-none">
        {TENANT_NAVIGATION.map((group, index) => (
          <SidebarGroup key={index} className="px-3 py-1">
            {open && (
              <SidebarGroupLabel className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400/80 px-2.5 mb-1 select-none">
                {group.group}
              </SidebarGroupLabel>
            )}
            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => {
                const isActive = isItemActive(item.href);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-8.5 w-full rounded-lg px-2.5 transition-all duration-150 border cursor-pointer ${
                        isActive
                          ? "bg-slate-900 border-slate-900 text-white font-semibold shadow-xs hover:bg-slate-900 hover:text-white"
                          : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-100/40"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2.5"
                      >
                        <item.icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive
                              ? "text-white stroke-[2.2]"
                              : "text-slate-400 stroke-[1.8] group-hover:text-slate-700"
                          }`}
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

      {/* 3. SIDEBAR FOOTER: Thẻ profile dẹt mượt, đồng bộ màu sắc */}
      <SidebarFooterUser />
    </Sidebar>
  );
}
