"use client";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { Bell, HelpCircle, Search } from "lucide-react";
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
import SidebarWrapper from "@/shared/components/sidebar";
import dynamic from "next/dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Clock = dynamic(() => import("@/shared/components/clock"), {
    ssr: false,
  });

  return (
    <div
      className="min-h-full flex flex-col bg-background text-foreground"
      suppressHydrationWarning={true}
    >
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <SidebarWrapper />

          <main className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />

                {/* Breadcrumb: Giúp Header hết trống và chuyên nghiệp hơn */}
                <Breadcrumb className="hidden md:block">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Danjin
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Quản lý phòng</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Phần bên phải: Các nút thao tác nhanh */}
              <div className="flex items-center gap-4">
                {/* Thanh tìm kiếm nhanh (Global Search) */}
                <div className="hidden lg:flex relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm nhanh (Ctrl + K)..."
                    className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary w-full text-xs"
                  />
                </div>

                {/* Icons thông báo và hỗ trợ */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full relative"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background"></span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-4 mx-1" />

                {/* Thời gian thực - Tạo cảm giác hệ thống đang vận hành */}
                <Clock />
              </div>
            </header>

            <div className="flex-1">{children}</div>
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
