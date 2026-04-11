// components/sidebar-wrapper.tsx
"use client";

import dynamic from "next/dynamic";

const AppSidebar = dynamic(
  () => import("@/shared/components/sidebar/components/AppSidebar"),
  {
    ssr: false,
  },
);

export default function SidebarWrapper() {
  return <AppSidebar />;
}
