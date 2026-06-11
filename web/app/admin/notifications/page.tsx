"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { NotificationDialog } from "./components/NotificationFormDialog";
import { NotificationFormValues } from "./schemas/notification.schema";
import { INITIAL_NOTIFICATIONS } from "./data/mockNotifications";
import { NotificationTable } from "./components/NotificationTable";
import { NotificationTableSkeleton } from "./components/Notificationtableskeleton";
import { NotificationFilterBar } from "./components/NotificationFilterBar";
import { NotificationPagination } from "./components/NotificationPagination";
import { TypeFilter, StatusFilter } from "./components/NotificationFilterBar";
import { NotificationDetailDialog } from "./components/NotificationDetailDialog";
import { notificationApi } from "./apis/notification.api";

const ITEMS_PER_PAGE = 5;

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailNoti, setDetailNoti] = useState<Notification | null>(null);

  const auth = useAuthStore();

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const res = await notificationApi.getAllNotifications();
        setNotifications(res.data);
        //await new Promise((resolve) => setTimeout(resolve, 1200)); // remove khi có API thật
      } catch {
        toast.error("Không thể tải danh sách thông báo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Socket realtime
  useEffect(() => {
    if (!auth.accessToken) return;

    const socket = io("http://localhost:5000", {
      auth: { token: auth.accessToken },
    });

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("notification", (data) => toast.success(data.title));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      socket.disconnect();
    };
  }, [auth.accessToken]);

  // Filter & search
  const filteredNotis = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.target.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "ALL" || n.type === typeFilter;
      const matchesStatus = statusFilter === "all" || n.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, searchQuery, typeFilter, statusFilter]);

  const paginatedNotis = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotis.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNotis, currentPage]);

  const totalPages = Math.ceil(filteredNotis.length / ITEMS_PER_PAGE) || 1;

  const handleSendNotification = async (data: NotificationFormValues) => {
    try {
      console.log(data);
      const res = await notificationApi.createNewNotification(data);
      console.log(res);
      toast.success("Phát thông báo thành công!");
    } catch {
      toast.error("Gửi thất bại, vui lòng thử lại");
    }
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success(`Đã gỡ bỏ bản tin ${id}`);
  };

  const handleTypeChange = (val: TypeFilter) => {
    setTypeFilter(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: StatusFilter) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50/50 text-slate-900 font-sans antialiased">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm">
            <Megaphone className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Bảng tin & Thông báo
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Quản lý nội dung phát thanh phát ra App cư dân tòa nhà DANJIN BMS
            </p>
          </div>
        </div>
        <NotificationDialog onSubmit={handleSendNotification} />
      </header>

      {/* Filter bar */}
      <NotificationFilterBar
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onTypeChange={handleTypeChange}
        onStatusChange={handleStatusChange}
      />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col justify-between">
        {isLoading ? (
          <NotificationTableSkeleton rows={ITEMS_PER_PAGE} />
        ) : (
          <NotificationTable
            notifications={paginatedNotis}
            onDelete={handleDelete}
            onView={(id) => {
              const found = notifications.find((n) => n.id === id);
              if (found) setDetailNoti(found);
            }}
          />
        )}

        <NotificationDetailDialog
          notification={detailNoti}
          open={!!detailNoti}
          onOpenChange={(open) => {
            if (!open) setDetailNoti(null);
          }}
        />
        <NotificationPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredNotis.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
