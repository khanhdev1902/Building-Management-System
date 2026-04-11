"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar";
import { navigation } from "@/shared/constants/navigation";
import { SidebarFooterUser } from "@/features/auth/components/SideBarFooterUser";
import SidebarNavHeader from "./SidebarNavHeader";
import { SidebarNavGroup } from "./SidebarNavGroup";

export default function AppSidebar() {
  // const mounted = useMounted();
  // if (!mounted) return null;

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarNavHeader />

      <SidebarContent className="">
        {/* 1. Nhóm Phân tích - Dành cho chủ nhà/Manager xem số liệu */}
        <SidebarNavGroup
          label="Báo cáo chiến lược"
          navItems={navigation.analytics}
          className=""
        />

        {/* 2. Nhóm Hạ tầng & Cư dân - Core của quản lý chung cư */}
        <SidebarNavGroup
          label="Quản lý vận hành"
          navItems={navigation.operation}
        />

        {/* 3. Nhóm Tương tác & Tài chính Cư dân - Dành cho Lễ tân/CSKH */}
        {/* Chúng ta thêm group này vì đây là nơi phát sinh nhiều tác vụ hàng ngày nhất */}
        <SidebarNavGroup
          label="Dịch vụ cư dân"
          navItems={navigation.services}
        />

        {/* 4. Nhóm Quản trị nội bộ - Tài chính doanh nghiệp, Nhân sự, Kho */}
        <SidebarNavGroup
          label="Quản trị nội bộ"
          navItems={navigation.management}
        />

        {/* 5. Nhóm Hệ thống - Cấu hình và Log (đẩy xuống cuối cùng) */}
        <SidebarNavGroup
          label="Thiết lập hệ thống"
          navItems={navigation.system}
          className="mt-auto mb-4"
        />
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooterUser />
    </Sidebar>
  );
}
