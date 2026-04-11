import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { useAuthStore } from "../stores/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";

export function SidebarFooterUser() {
  const user = useAuthStore((s) => s.user);

  return (
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
                  <span className="truncate font-semibold">
                    {user?.name ?? "Admin Danjin"}
                  </span>
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
                <Link href={"/login"}>Đăng xuất</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
