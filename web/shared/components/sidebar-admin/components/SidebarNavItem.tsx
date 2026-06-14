"use client";

import React from "react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "../types/nav.type";

type Props = { item: NavItem };

export function SidebarNavItem({ item }: Props) {
  const pathname = usePathname();
  const isActive = pathname === item.url;

  return (
    <SidebarMenuItem className="relative px-1">
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        // SỬA: Thay bg-slate-900 đen kịt bằng bg-slate-100 thanh lịch, tăng contrast cho chữ
        className={`w-full h-8.5 px-2.5 rounded-lg text-xs transition-all duration-200 gap-2.5 ${
          isActive
            ? "bg-slate-100 text-slate-900 font-semibold"
            : "text-slate-700/90 hover:text-slate-900 hover:bg-slate-50"
        }`}
      >
        <Link href={item.url ?? ""} className="flex items-center w-full">
          {item.icon && (
            <item.icon
              // SỬA: Tăng tương phản icon từ slate-400 lên slate-500 để không bị mờ bạc màu
              className={`size-4 stroke-[1.8] transition-colors ${
                isActive
                  ? "text-slate-900 stroke-[2.2]"
                  : "text-slate-700 group-hover:text-slate-800"
              }`}
            />
          )}
          <span className="tracking-tight text-[14px] font-semibold">{item.title}</span>
        </Link>
      </SidebarMenuButton>

      {/* Vạch chỉ báo ẩn ở cạnh trái - Kỷ nguyên thiết kế SaaS Premium */}
      {isActive && (
        <div className="absolute -left-1 top-1.5 bottom-1.5 w-0.75 bg-slate-900 rounded-r animate-in fade-in slide-in-from-left-1 duration-300" />
      )}
    </SidebarMenuItem>
  );
}
