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
  const isActive = pathname === item.url;
  console.log(isActive, pathname, item);
  return (
    <SidebarMenuItem>
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
            {item.children &&
              item.children.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    className={`${
                      pathname === subItem.url
                        ? "bg-slate-950 hover:bg-slate-800 hover:text-white text-white"
                        : ""
                    }`}
                  >
                    <Link href={subItem.url}>
                      {/* {subItem.icon && <subItem.icon />} */}
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
