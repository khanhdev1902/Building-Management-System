"use client";

import React from "react";
import { Sidebar, SidebarContent } from "@/shared/components/ui/sidebar";
import { navigation } from "@/shared/constants/navigation";
import { SidebarFooterUser } from "@/features/auth/components/SideBarFooterUser";
import SidebarNavHeader from "./SidebarNavHeader";
import { SidebarNavGroup } from "./SidebarNavGroup";

export default function AppSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-slate-200/60 bg-white"
    >
      {/* Header: Chứa Workspace Switcher (Danjin CCMN) */}
      <SidebarNavHeader />

      {/* KHẮC PHỤC: Nén chặt padding và khoảng cách space-y để menu liền mạch, tinh tế */}
      <SidebarContent className="px-2 py-2 space-y-1 scrollbar-none select-none">
        {/* 1. Nhóm Phân tích - Dành cho chủ nhà/Manager xem số liệu */}
        <SidebarNavGroup
          label="Báo cáo chiến lược"
          navItems={navigation.analytics}
        />

        {/* 2. Nhóm Hạ tầng & Cư dân - Core của quản lý chung cư */}
        <SidebarNavGroup
          label="Quản lý vận hành"
          navItems={navigation.operation}
        />

        {/* 3. Nhóm Tương tác & Tài chỉnh Cư dân - Dành cho Lễ tân/CSKH */}
        <SidebarNavGroup
          label="Dịch vụ cư dân"
          navItems={navigation.services}
        />

        {/* 4. Nhóm Quản trị nội bộ - Tài chính doanh nghiệp, Nhân sự, Kho */}
        <SidebarNavGroup
          label="Quản trị nội bộ"
          navItems={navigation.management}
        />

        {/* 5. Nhóm Hệ thống - Đẩy xuống cuối cùng tinh tế, thêm khoảng đệm pt-4 */}
        <SidebarNavGroup
          label="Thiết lập hệ thống"
          navItems={navigation.system}
          className="mt-auto pt-4 pb-2"
        />
      </SidebarContent>

      {/* KHẮC PHỤC: Đập bỏ SidebarSeparator cứng nhắc, để Footer kết nối phẳng mịn */}
      <div className="border-t border-slate-100 p-2 bg-white">
        <SidebarFooterUser />
      </div>
    </Sidebar>
  );
}
