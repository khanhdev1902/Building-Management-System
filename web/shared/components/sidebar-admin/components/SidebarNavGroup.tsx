"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/shared/components/ui/sidebar";
import { SidebarNavCollapsible } from "./SidebarNavCollapsible";
import { SidebarNavItem } from "./SidebarNavItem";
import { cn } from "@/shared/utils/cn";
import { NavItem } from "../types/nav.type";

type Props = {
  label: string;
  navItems: NavItem[];
  className?: string;
};

export function SidebarNavGroup({ label, navItems, className }: Props) {
  return (
    <SidebarGroup className={cn("pt-4 first:pt-1.5", className)}>
      {/* SỬA: Nâng text-slate-400 lên slate-500 để tiêu đề phân cụm sắc nét, không bị mờ bạc */}
      <SidebarGroupLabel className="text-[13px] font-bold uppercase tracking-wider text-slate-700 h-6 select-none px-3">
        {label}
      </SidebarGroupLabel>

      <SidebarMenu className="space-y-0.5">
        {navItems.map((item) =>
          item.children ? (
            <SidebarNavCollapsible key={item.title} item={item} />
          ) : (
            <SidebarNavItem key={item.title} item={item} />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
