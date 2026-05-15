import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "../../sidebar/types/nav.type";


type Props = { item: NavItem };

export function SidebarNavItem({ item }: Props) {
  const pathname = usePathname();
  const isActive = pathname === item.url;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        className={isActive ? " bg-red-800" : ""}
      >
        <Link href={item.url ?? ""}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
