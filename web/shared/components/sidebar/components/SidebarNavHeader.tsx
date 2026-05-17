"use client";

import React from "react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { Building2, ChevronsUpDown } from "lucide-react";

export default function SidebarNavHeader() {
  return (
    <SidebarHeader className="border-b border-slate-200 h-14 py-1 px-3">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-slate-50 hover:bg-slate-50/80 rounded-xl transition-all duration-200"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm shrink-0">
                  <Building2 className="size-4 stroke-[1.8]" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-bold text-slate-800 tracking-tight">
                    Danjin CCMN
                  </span>
                  {/* SỬA: Đổi text-slate-400 mờ sang slate-500 rõ ràng */}
                  <span className="truncate text-[9px] font-medium text-slate-500 font-mono tracking-wide uppercase mt-0.5">
                    Hệ thống quản lý
                  </span>
                </div>

                <ChevronsUpDown className="ml-auto size-3.5 text-slate-500 opacity-90 shrink-0" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-popper-anchor-width] min-w-55 rounded-xl p-1.5 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.08)] border border-slate-200 bg-white"
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5 select-none">
                Chuyển đổi tòa nhà
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-slate-100" />

              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer py-2 text-slate-700 focus:bg-slate-50 text-xs font-medium">
                <Building2 className="size-3.5 text-slate-400 stroke-[1.75]" />
                <span>Danjin - Cơ sở 1 (Mặc định)</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer py-2 text-slate-700 focus:bg-slate-50 text-xs font-medium">
                <Building2 className="size-3.5 text-slate-400 stroke-[1.75]" />
                <span>Danjin - Cơ sở 2 (Vận hành)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
