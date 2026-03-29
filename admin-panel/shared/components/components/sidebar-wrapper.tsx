// components/sidebar-wrapper.tsx
"use client";

import dynamic from "next/dynamic";

const AppSidebar = dynamic(() => import("@/shared/components/app-sidebar"), {
  ssr: false,
});

export default function SidebarWrapper() {
  return <AppSidebar />;
}
