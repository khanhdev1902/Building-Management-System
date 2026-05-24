/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import {
  Bell,
  Search,
  FileText,
  Wrench,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import dynamic from "next/dynamic";
import ProtectedRoute from "../protect-router";
import SidebarClient from "@/shared/components/sidebar-client/sidebar-client";

// Mock data được tối ưu lại cho trải nghiệm tra cứu cá nhân của cư dân
const MOCK_DATA = {
  invoice: [
    {
      id: "i1",
      title: "Hóa đơn dịch vụ tháng 05/2026",
      sub: "Chưa thanh toán",
      icon: CreditCard,
    },
    {
      id: "i2",
      title: "Hóa đơn tiền điện nước tháng 04/2026",
      sub: "Đã thanh toán",
      icon: CreditCard,
    },
  ],
  ticket: [
    {
      id: "t1",
      title: "Sự cố: Hỏng điều hòa phòng khách",
      sub: "Đang xử lý",
      icon: Wrench,
    },
    {
      id: "t2",
      title: "Yêu cầu: Đăng ký thẻ xe bổ sung",
      sub: "Đã phê duyệt",
      icon: FileText,
    },
  ],
  notice: [
    {
      id: "n1",
      title: "Thông báo bảo trì định kỳ thang máy",
      sub: "Ngày 25/05/2026",
      icon: Bell,
    },
    {
      id: "n2",
      title: "Nội quy phòng cháy chữa cháy cập nhật",
      sub: "Quan trọng",
      icon: FileText,
    },
  ],
};

const Clock = dynamic(() => import("@/shared/components/clock"), {
  ssr: false,
});

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchType, setSearchType] =
    useState<keyof typeof MOCK_DATA>("invoice");
  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenSearch((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <ProtectedRoute allowedRoles={["TENANT"]}>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-slate-50/40 antialiased selection:bg-indigo-50">
            {/* Sidebar điều hướng dành riêng cho Tenant */}
            <SidebarClient />

            <main className="flex flex-1 flex-col min-w-0 transition-all duration-300">
              {/* HEADER: H-14 Minimalist, đồng bộ độ cao với Sidebar */}
              <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 backdrop-blur-md select-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                {/* Cụm điều hướng Breadcrumb bên trái */}
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors" />
                  <Separator
                    orientation="vertical"
                    className="h-4 bg-slate-200"
                  />

                  <Breadcrumb className="hidden sm:block">
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href="/dashboard"
                          className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
                        >
                          Danjin
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="text-slate-300 scale-80" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-xs font-semibold text-slate-800 tracking-tight">
                          Cổng thông tin cư dân
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Cụm công cụ tương tác bên phải */}
                <div className="flex items-center gap-3.5">
                  {/* THANH TÌM KIẾM TRA CỨU NHANH CHO CƯ DÂN */}
                  <div className="hidden md:flex items-center">
                    <Popover open={openSearch} onOpenChange={setOpenSearch}>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 px-3 h-8.5 w-64 text-slate-400 bg-slate-50/50 border border-slate-200/70 rounded-lg hover:bg-white hover:border-slate-300 transition-all focus:outline-none cursor-pointer">
                          <Search className="h-3.5 w-3.5 stroke-[1.8]" />
                          <span className="flex-1 text-left text-xs font-medium text-slate-400">
                            Tra cứu hóa đơn, sự cố...
                          </span>
                          <kbd className="pointer-events-none hidden h-4.5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[9px] font-medium text-slate-400 shadow-2xs sm:flex">
                            <span className="text-[10px]">⌘</span>K
                          </kbd>
                        </button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="p-0 w-110 overflow-hidden rounded-xl shadow-xl border border-slate-200/80 bg-white"
                        align="end"
                        sideOffset={6}
                      >
                        <Command className="rounded-none border-none bg-white">
                          <div className="flex items-center border-b border-slate-100 px-3 bg-slate-50/30">
                            <Select
                              value={searchType}
                              onValueChange={(val: any) => setSearchType(val)}
                            >
                              <SelectTrigger className="w-28 border-none shadow-none focus:ring-0 text-xs h-9 font-semibold text-slate-700 bg-transparent p-0 hover:text-slate-900">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-lg border-slate-200">
                                <SelectItem value="invoice" className="text-xs">
                                  Hóa đơn & Chi phí
                                </SelectItem>
                                <SelectItem value="ticket" className="text-xs">
                                  Phản ánh & Sự cố
                                </SelectItem>
                                <SelectItem value="notice" className="text-xs">
                                  Thông báo tòa nhà
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Separator
                              orientation="vertical"
                              className="h-3.5 bg-slate-200 mx-2"
                            />

                            <Input
                              placeholder="Nhập mã hóa đơn, nội dung cần tìm..."
                              className="border-none focus-visible:ring-0 h-10 text-xs font-medium text-slate-800 bg-transparent placeholder:text-slate-400"
                              value={searchValue}
                              onChange={(e) => setSearchValue(e.target.value)}
                            />
                          </div>

                          <CommandList className="max-h-72 p-1">
                            <CommandEmpty className="py-8 text-center text-xs text-slate-400 font-medium">
                              Không tìm thấy kết quả nào của bạn.
                            </CommandEmpty>

                            <CommandGroup
                              heading={
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-1">
                                  Dữ liệu cá nhân của bạn
                                </span>
                              }
                            >
                              {MOCK_DATA[searchType].map((item) => (
                                <CommandItem
                                  key={item.id}
                                  onSelect={() => setOpenSearch(false)}
                                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer focus:bg-slate-50"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-500">
                                    <item.icon className="h-4 w-4 stroke-[1.75]" />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-semibold text-slate-800 truncate">
                                      {item.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">
                                      {item.sub}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* CỤM CHỨC NĂNG PHỤ TRỢ */}
                  <div className="flex items-center gap-1">
                    {/* Hộp thư thông báo */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg relative hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <Bell className="h-4 w-4 stroke-[1.75]" />
                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-1 ring-white"></span>
                    </Button>

                    {/* Hỗ trợ / Liên hệ Ban Quản Lý */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Liên hệ Ban quản lý"
                    >
                      <MessageSquare className="h-4 w-4 stroke-[1.75]" />
                    </Button>
                  </div>

                  <Separator
                    orientation="vertical"
                    className="h-4 bg-slate-200"
                  />

                  {/* Đồng hồ điện tử thời gian thực */}
                  <div className="pl-1 text-slate-700">
                    <Clock />
                  </div>
                </div>
              </header>

              {/* AREA NỘI DUNG CHÍNH */}
              <div className="flex-1 w-full overflow-y-auto">
                <div className="mx-auto max-w-7xl h-full w-full">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ProtectedRoute>
  );
}
