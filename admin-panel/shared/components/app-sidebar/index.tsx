"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  ChevronDown,
  LayoutDashboard,
  Home,
  Users,
  Receipt,
  Settings,
  ShieldCheck,
  LogOut,
  UserCircle,
  Building2,
  Wrench,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
// import { useMounted } from "@/shared/hooks/useMounted";

const navigation = {
  main: [
    { title: "Tổng quan", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Quản lý phòng", icon: Home, url: "/rooms" },
    {
      title: "Nhân viên & Khách thuê",
      icon: Users,
      items: [
        { title: "Nhân viên", url: "/staffs" },
        { title: "Khách thuê", url: "/tenants" },
      ],
    },
  ],
  finance: [
    { title: "Hóa đơn tháng", icon: Receipt, url: "/invoices" },
    { title: "Dịch vụ & Tiện ích", icon: Wrench, url: "/services" },
  ],
  system: [
    { title: "Cài đặt", icon: Settings, url: "/settings" },
    { title: "Phân quyền", icon: ShieldCheck, url: "/roles" },
  ],
};

export default function AppSidebar() {
  // const mounted = useMounted();

  // if (!mounted) return null;
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Building2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Danjin CCMN</span>
                    <span className="truncate text-xs">Hệ thống quản lý</span>
                  </div>
                  <ChevronDown className="ml-auto size-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width] min-w-56"
                align="start"
              >
                <DropdownMenuItem>
                  <Building2 className="mr-2 size-4" />
                  <span>Danjin - Cơ sở 1</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Building2 className="mr-2 size-4" />
                  <span>Danjin - Cơ sở 2</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Nhóm Vận hành */}
        <SidebarGroup>
          <SidebarGroupLabel>Vận hành</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.main.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  // Trường hợp có menu con (Dùng Collapsible)
                  <Collapsible className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  // Trường hợp menu đơn
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Nhóm Tài chính */}
        <SidebarGroup>
          <SidebarGroupLabel>Tài chính</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.finance.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Nhóm Hệ thống */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.system.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-slate-200">
                    <UserCircle className="size-6 text-slate-600" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin Danjin</span>
                    <span className="truncate text-xs">admin@danjin.vn</span>
                  </div>
                  <ChevronDown className="ml-auto size-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width] min-w-56"
                align="end"
                side="top"
              >
                <a href="/profile">
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 size-4" />
                    Hồ sơ cá nhân
                  </DropdownMenuItem>
                </a>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 size-4" />
                  <Link href={'/login'}>Đăng xuất</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
