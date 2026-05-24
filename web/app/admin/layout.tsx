"use client";
import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import {
  Bell,
  HelpCircle,
  Search,
  User,
  Home,
  FileText,
  Briefcase,
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
import SidebarWrapper from "@/shared/components/sidebar";
import dynamic from "next/dynamic";
import ProtectedRoute from "../protect-router";

const MOCK_DATA = {
  room: [
    { id: "r1", title: "Phòng 101 - Tòa Lux 1", sub: "Trống", icon: Home },
    { id: "r2", title: "Phòng 202 - Tòa Danjin", sub: "Đang thuê", icon: Home },
  ],
  tenant: [
    { id: "t1", title: "Nguyễn Văn Khanh", sub: "0987.654.321", icon: User },
    { id: "t2", title: "Trần Thị B", sub: "0123.456.789", icon: User },
  ],
  contract: [
    {
      id: "c1",
      title: "Hợp đồng #HD-2024-01",
      sub: "Sắp hết hạn",
      icon: FileText,
    },
    {
      id: "c2",
      title: "Hợp đồng #HD-2024-05",
      sub: "Đã thanh toán",
      icon: FileText,
    },
  ],
  staff: [
    {
      id: "s1",
      title: "Kỹ thuật - Minh Tuấn",
      sub: "Trực ca sáng",
      icon: Briefcase,
    },
  ],
};

const Clock = dynamic(() => import("@/shared/components/clock"), {
  ssr: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchType, setSearchType] = useState<keyof typeof MOCK_DATA>("room");
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
    <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-slate-50/40 antialiased selection:bg-indigo-50">
            <SidebarWrapper />

            <main className="flex flex-1 flex-col min-w-0 transition-all duration-300">
              {/* 1. HEADER CẢI TIẾN: Sắc nét, nén chiều cao về h-14 đồng bộ Nav Sidebar */}
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
                          Quản lý hệ thống
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Cụm công cụ tương tác bên phải */}
                <div className="flex items-center gap-3.5">
                  {/* THANH TÌM KIẾM CHUYÊN NGHIỆP: Đã tăng tương phản, bọc viền mảnh hạt cát */}
                  <div className="hidden md:flex items-center">
                    <Popover open={openSearch} onOpenChange={setOpenSearch}>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 px-3 h-8.5 w-60 text-slate-400 bg-slate-50/50 border border-slate-200/70 rounded-lg hover:bg-white hover:border-slate-300 transition-all focus:outline-none cursor-pointer">
                          <Search className="h-3.5 w-3.5 stroke-[1.8]" />
                          <span className="flex-1 text-left text-xs font-medium text-slate-400">
                            Tìm kiếm nhanh...
                          </span>
                          <kbd className="pointer-events-none hidden h-4.5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[9px] font-medium text-slate-400 shadow-2xs sm:flex">
                            <span className="text-[10px]">⌘</span>K
                          </kbd>
                        </button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="p-0 w-105 overflow-hidden rounded-xl shadow-xl border border-slate-200/80 bg-white"
                        align="end"
                        sideOffset={6}
                      >
                        <Command className="rounded-none border-none bg-white">
                          <div className="flex items-center border-b border-slate-100 px-3 bg-slate-50/30">
                            <Select
                              value={searchType}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onValueChange={(val: any) => setSearchType(val)}
                            >
                              <SelectTrigger className="w-24 border-none shadow-none focus:ring-0 text-xs h-9 font-semibold text-slate-700 bg-transparent p-0 hover:text-slate-900">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-lg border-slate-200">
                                <SelectItem value="room" className="text-xs">
                                  Phòng căn hộ
                                </SelectItem>
                                <SelectItem value="tenant" className="text-xs">
                                  Cư dân thuê
                                </SelectItem>
                                <SelectItem
                                  value="contract"
                                  className="text-xs"
                                >
                                  Hợp đồng pháp lý
                                </SelectItem>
                                <SelectItem value="staff" className="text-xs">
                                  Nhân sự ca trực
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Separator
                              orientation="vertical"
                              className="h-3.5 bg-slate-200 mx-2"
                            />

                            <Input
                              placeholder="Nhập số phòng, tên cư dân, mã hợp đồng..."
                              className="border-none focus-visible:ring-0 h-10 text-xs font-medium text-slate-800 bg-transparent placeholder:text-slate-400"
                              value={searchValue}
                              onChange={(e) => setSearchValue(e.target.value)}
                            />
                          </div>

                          <CommandList className="max-h-72 p-1">
                            <CommandEmpty className="py-8 text-center text-xs text-slate-400 font-medium">
                              Không tìm thấy kết quả trùng khớp.
                            </CommandEmpty>

                            <CommandGroup
                              heading={
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-1">
                                  Thực thể gợi ý hệ thống
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

                  {/* Cụm Nút chức năng phụ hữu dụng */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      // SỬA: Thay đổi hiệu ứng hover từ màu đỏ giật gân sang màu xám mịn đồng bộ thanh lịch
                      className="h-8 w-8 rounded-lg relative hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <Bell className="h-4 w-4 stroke-[1.75]" />
                      {/* Chấm đỏ thông báo nhỏ gọn, tĩnh lặng bám sát nút */}
                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-1 ring-white"></span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 stroke-[1.75]" />
                    </Button>
                  </div>

                  <Separator
                    orientation="vertical"
                    className="h-4 bg-slate-200"
                  />

                  {/* Khối đồng hồ điện tử thời gian thực */}
                  <div className="pl-1 text-slate-700">
                    <Clock />
                  </div>
                </div>
              </header>

              {/* 2. AREA NỘI DUNG: Tràn viền phẳng thoáng đãng */}
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
