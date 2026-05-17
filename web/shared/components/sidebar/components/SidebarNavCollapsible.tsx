"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { NavItem } from "../types/nav.type";
import { usePathname } from "next/navigation";

type Props = { item: NavItem };

export function SidebarNavCollapsible({ item }: Props) {
  const pathname = usePathname();

  const isChildActive = useMemo(() => {
    if (!item.children) return false;
    return item.children.some((child) => pathname === child.url);
  }, [pathname, item.children]);

  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isChildActive) setIsOpen(true);
  }, [pathname, isChildActive]);

  return (
    <SidebarMenuItem className="px-1">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible w-full"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            // SỬA: Tăng đậm màu chữ để thanh menu hiển thị sắc nét, đầm mắt
            className={`w-full transition-all duration-200 h-8.5 rounded-lg hover:bg-slate-50 ${
              isChildActive
                ? "text-slate-900 font-semibold"
                : "text-slate-700/90"
            }`}
          >
            {item.icon && (
              <item.icon
                className={`size-4 stroke-[1.8] transition-colors ${
                  isChildActive
                    ? "text-slate-900"
                    : "text-slate-700 group-hover/collapsible:text-slate-800"
                }`}
              />
            )}
            <span className="text-[14px] font-semibold tracking-tight">{item.title}</span>
            <ChevronRight
              className={`ml-auto size-3.5 text-slate-400 stroke-2 transition-transform duration-200 ${
                isOpen ? "rotate-90 text-slate-700" : ""
              }`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent className="animate-in fade-in slide-in-from-top-0.5 duration-200">
          {/* SỬA: Tăng độ đậm của nét chỉ báo cây thư mục border-slate-200/90 */}
          <SidebarMenuSub className="ml-3 pl-3 border-l border-slate-200 my-0.5 space-y-0.5">
            {item.children &&
              item.children.map((subItem) => {
                const isSubActive = pathname === subItem.url;
                return (
                  <SidebarMenuSubItem key={subItem.title} className="relative">
                    <SidebarMenuSubButton
                      asChild
                      className={`w-full h-8 px-2.5 rounded-md text-xs transition-all duration-200 ${
                        isSubActive
                          ? "bg-slate-100 text-slate-900 font-bold"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <Link
                        href={subItem.url}
                        className="flex items-center gap-2"
                      >
                        {subItem.icon && (
                          <subItem.icon className="size-3.5 stroke-[1.8]" />
                        )}
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>

                    {/* Vạch chỉ báo phụ siêu mảnh cho sub-menu */}
                    {isSubActive && (
                      <div className="absolute -left-3.25 top-2 bottom-2 w-0.5 bg-slate-900 rounded-r" />
                    )}
                  </SidebarMenuSubItem>
                );
              })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
