import React from "react";
import {
  AlertCircle,
  Clock,
  MessageSquare,
  Wrench,
  ShieldAlert,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

const REQUEST_DATA = [
  {
    id: "REQ-001",
    title: "Hỏng vòi hoa sen phòng tắm",
    category: "Sửa chữa",
    priority: "High",
    status: "In Progress",
    createdAt: "10:30 - 05/05/2026",
    desc: "Vòi sen bị rò rỉ nước liên tục gây lãng phí.",
  },
  {
    id: "REQ-002",
    title: "Đăng ký thẻ gửi xe mới",
    category: "Dịch vụ",
    priority: "Medium",
    status: "Completed",
    createdAt: "09:00 - 01/05/2026",
    desc: "Cấp thêm 01 thẻ xe máy cho xe Honda Vision.",
  },
  {
    id: "REQ-003",
    title: "Hàng xóm gây ồn ban đêm",
    category: "An ninh",
    priority: "Urgent",
    status: "Pending",
    createdAt: "23:45 - Hôm qua",
    desc: "Phòng 102 mở nhạc to sau 11h đêm.",
  },
];

export function TabRequest() {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* 1. Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
            Danh sách yêu cầu
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Theo dõi và xử lý các phản hồi từ cư dân
          </p>
        </div>
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 h-9 text-xs font-bold shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Tạo yêu cầu mới
        </Button>
      </div>

      {/* 2. Filter Tabs (Mini) */}
      <div className="flex gap-2 border-b border-slate-100 pb-1">
        <button className="px-3 py-2 text-xs font-bold text-indigo-600 border-b-2 border-indigo-600">
          Tất cả
        </button>
        <button className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600">
          Đang xử lý
        </button>
        <button className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600">
          Hoàn thành
        </button>
      </div>

      {/* 3. List of Request Cards */}
      <div className="space-y-3">
        {REQUEST_DATA.map((req) => (
          <div
            key={req.id}
            className="group relative bg-white border border-slate-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Icon theo Category */}
                <div
                  className={`p-2.5 rounded-lg ${getCategoryStyle(req.category)}`}
                >
                  {getCategoryIcon(req.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {req.id}
                    </span>
                    <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {req.title}
                    </h4>
                    {req.priority === "Urgent" && (
                      <Badge className="bg-red-50 text-red-600 border-none text-[9px] font-black uppercase px-1.5 h-4">
                        Khẩn cấp
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {req.desc}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {req.createdAt}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} /> 2 phản hồi
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                {getStatusBadge(req.status)}
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Empty State (Nếu không có data) */}
      {REQUEST_DATA.length === 0 && (
        <div className="py-20 text-center">
          <AlertCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">
            Chưa có yêu cầu nào được ghi nhận
          </p>
        </div>
      )}
    </div>
  );
}

// --- Helper Functions ---

function getCategoryIcon(cat: string) {
  switch (cat) {
    case "Sửa chữa":
      return <Wrench size={18} />;
    case "An ninh":
      return <ShieldAlert size={18} />;
    default:
      return <AlertCircle size={18} />;
  }
}

function getCategoryStyle(cat: string) {
  switch (cat) {
    case "Sửa chữa":
      return "bg-orange-50 text-orange-600";
    case "An ninh":
      return "bg-red-50 text-red-600";
    default:
      return "bg-blue-50 text-blue-600";
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "In Progress":
      return (
        <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-bold">
          Đang xử lý
        </Badge>
      );
    case "Completed":
      return (
        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold">
          Hoàn thành
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold">
          Chờ tiếp nhận
        </Badge>
      );
  }
}
