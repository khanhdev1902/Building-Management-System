"use client";
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
import { authApi } from "../apis/auth.api";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

export function SidebarFooterUser() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  console.log("SidebarFooterUser render with user:", user);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Lỗi khi logout server:", error);
    } finally {
      const { logout } = useAuthStore.getState();
      logout();
      router.push("/login");
    }
  };

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
                  {user?.avatarUrl ? (
                    <Avatar className="size-8">
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {user.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <UserCircle className="size-6 text-slate-600" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : "Admin Danjin"}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
                <ChevronDown className="ml-auto size-4 opacity-50" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-popper-anchor-width] min-w-56"
              align="end"
              side="top"
            >
              <Link href="/profile">
                <DropdownMenuItem>
                  <UserCircle className="mr-2 size-4" />
                  Hồ sơ cá nhân
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 size-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
