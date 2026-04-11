import { LucideIcon } from "lucide-react";

export type SubNavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export type NavItem = {
  title: string;
  icon: LucideIcon;
  url?: string;
  children?: SubNavItem[];
};
