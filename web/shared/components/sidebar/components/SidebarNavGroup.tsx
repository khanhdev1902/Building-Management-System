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
    <SidebarGroup className={cn(className)}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
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
