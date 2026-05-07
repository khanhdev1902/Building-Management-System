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
    <ProtectedRoute>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-background">
            <SidebarWrapper />

            <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
              {/* HEADER CẢI TIẾN */}
              <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md dark:bg-background/80">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-accent transition-colors" />
                  <Separator orientation="vertical" className="h-6" />
                  <Breadcrumb className="hidden sm:block">
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href="/dashboard"
                          className="transition-colors hover:text-primary"
                        >
                          Danjin
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold text-foreground">
                          Quản lý hệ thống
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                <div className="flex items-center gap-3">
                  {/* THANH TÌM KIẾM CHUYÊN NGHIỆP */}
                  <div className="hidden md:flex items-center">
                    <Popover open={openSearch} onOpenChange={setOpenSearch}>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 px-3 py-1.5 w-64 text-sm text-muted-foreground bg-muted/50 border rounded-full hover:bg-muted transition-all border-transparent hover:border-input focus:outline-none">
                          <Search className="h-4 w-4" />
                          <span className="flex-1 text-left text-xs">
                            Tìm kiếm nhanh...
                          </span>
                          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                          </kbd>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0 w-112.5 overflow-hidden rounded-xl shadow-2xl border-none"
                        align="end"
                      >
                        <Command className="rounded-none border-none">
                          <div className="flex items-center border-b px-3">
                            <Select
                              value={searchType}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onValueChange={(val: any) => setSearchType(val)}
                            >
                              <SelectTrigger className="w-27.5 border-none shadow-none focus:ring-0 text-[11px] h-8 uppercase font-bold tracking-wider text-primary">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="room">Phòng</SelectItem>
                                <SelectItem value="tenant">Cư dân</SelectItem>
                                <SelectItem value="contract">
                                  Hợp đồng
                                </SelectItem>
                                <SelectItem value="staff">Nhân viên</SelectItem>
                              </SelectContent>
                            </Select>
                            <Separator
                              orientation="vertical"
                              className="h-4 mx-2"
                            />
                            <Input
                              placeholder="Nhập từ khóa tìm kiếm..."
                              className="border-none focus-visible:ring-0 h-11 text-sm bg-transparent"
                              value={searchValue}
                              onChange={(e) => setSearchValue(e.target.value)}
                            />
                          </div>
                          <CommandList className="max-h-87.5">
                            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                              Không tìm thấy kết quả.
                            </CommandEmpty>
                            <CommandGroup
                              heading={
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                                  Kết quả gợi ý
                                </span>
                              }
                            >
                              {MOCK_DATA[searchType].map((item) => (
                                <CommandItem
                                  key={item.id}
                                  onSelect={() => setOpenSearch(false)}
                                  className="flex items-center gap-3 p-3 rounded-md mx-2 my-1 cursor-pointer"
                                >
                                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                    <item.icon className="h-4 w-4" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold">
                                      {item.title}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
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

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full relative hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Bell className="h-4.5 w-4.5" />
                      <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse"></span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    >
                      <HelpCircle className="h-4.5 w-4.5" />
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-6" />
                  <div className="pl-2">
                    <Clock />
                  </div>
                </div>
              </header>

              {/* CONTENT AREA */}
              <div className="flex-1 p-8">
                <div className="mx-auto max-w-7xl h-full">{children}</div>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ProtectedRoute>
  );
}
