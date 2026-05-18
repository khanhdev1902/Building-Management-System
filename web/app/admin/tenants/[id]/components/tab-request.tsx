"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Clock,
  Flame,
  HelpCircle,
  SearchX,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export function TabRequest() {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "processing" | "resolved"
  >("all");

  // Mockup danh sách Ticket phản ánh kỹ thuật thực tế năm 2026 của Phòng 101
  const tickets = [
    {
      id: "TK-8821",
      title: "Áp lực nước sinh hoạt chảy yếu và có cặn vàng đầu kỳ",
      category: "Điện nước",
      createdAt: "16/05/2026 09:15",
      severity: "high", // Khẩn cấp
      status: "processing", // Đang sửa
      reporter: "Trần Bình An (Chủ hộ)",
      handler: "Minh Tuấn (Kỹ thuật nội khu)",
      description:
        "Cư dân báo xả nước phòng tắm chảy rất nhỏ, mở vòi bồn rửa mặt thấy có cặn vôi màu vàng chảy ra kèm theo. Đã cử kỹ thuật lên kiểm tra van tổng tầng mái.",
    },
    {
      id: "TK-8410",
      title: "Bóng đèn led hành lang đối diện cửa phòng bị nhấp nháy",
      category: "Thiết bị",
      createdAt: "12/04/2026 14:20",
      severity: "low", // Bình thường
      status: "resolved", // Đã xong
      reporter: "Trần Bình An (Chủ hộ)",
      handler: "Văn Hải (Kỹ thuật ngoại khu)",
      description:
        "Đèn hành lang chập chờn gây khó chịu ban đêm. Kỹ thuật đã thay thế bóng tuýp led Philips 12W mới, bàn giao hành lang sáng ổn định.",
    },
  ];

  // Lọc dữ liệu động theo Tab trạng thái
  const filteredTickets = useMemo(() => {
    if (statusFilter === "all") return tickets;
    return tickets.filter((t) => t.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="divide-y divide-slate-100/70 font-sans animate-in fade-in duration-300">
      {/* SECTION 1: THANH ĐIỀU HÀNH BỘ LỌC TÁC VỤ DẸT LÌ */}
      <section className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        {/* Bộ nút lọc trạng thái dẹt h-7 phẳng phiêu */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 w-fit h-8 items-center">
          {[
            { key: "all", label: "Tất cả phiếu" },
            { key: "pending", label: "Chờ tiếp nhận" },
            { key: "processing", label: "Đang xử lý" },
            { key: "resolved", label: "Đã khắc phục" },
          ].map((tab) => (
            <button
              key={tab.key}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setStatusFilter(tab.key as any)}
              className={`h-6 px-3 rounded-md text-[11px] font-semibold transition-all ${
                statusFilter === tab.key
                  ? "bg-white shadow-2xs text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[10px] font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md self-start sm:self-center"
        >
          <Plus size={12} className="mr-1 stroke-[2.5]" /> Khởi tạo Ticket sửa
          chữa
        </Button>
      </section>

      {/* SECTION 2: DANH SÁCH FEED TICKET PHẲNG DẸT TRÀN CẠNH */}
      <section className="p-5">
        {filteredTickets.length === 0 ? (
          /* MÀN HÌNH BÁO RỖNG (EMPTY STATE CHUẨN SAAS) */
          <div className="flex flex-col items-center justify-center h-60 text-slate-400 space-y-2 select-none">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 mb-1">
              <SearchX size={18} strokeWidth={1.5} />
            </div>
            <h4 className="text-xs font-semibold text-slate-800">
              Không có phiếu sự cố nào
            </h4>
            <p className="text-[11px] text-slate-400 text-center max-w-60 leading-normal">
              Cư dân phòng này hiện chưa gửi phản ánh kỹ thuật nào trùng khớp
              với trạng thái lọc.
            </p>
          </div>
        ) : (
          /* DANH SÁCH TICKET HOẠT ĐỘNG */
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-slate-200/70 rounded-xl p-4 bg-white hover:border-slate-300 transition-colors space-y-3 relative group"
              >
                {/* Dòng đầu: Tiêu đề + Badge độ khẩn cấp */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-50 pb-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[11px] text-slate-400">
                        {ticket.id}
                      </span>
                      <span className="text-slate-200 font-light">•</span>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-semibold border-slate-200 bg-slate-50 text-slate-500 rounded px-1.5 h-4.5"
                      >
                        Phân loại: {ticket.category}
                      </Badge>

                      {/* Phân tầng màu sắc cảnh báo khẩn cấp kỹ thuật */}
                      {ticket.severity === "high" ? (
                        <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-700 border border-rose-100/50 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-sans">
                          <Flame size={10} className="fill-rose-600" /> Nguy cơ
                          cao
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 bg-slate-50 text-slate-600 border border-slate-200/60 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase font-sans">
                          Thường nhật
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs tracking-tight">
                      {ticket.title}
                    </h4>
                  </div>

                  {/* Badge trạng thái luồng xử lý Ticket */}
                  <Badge
                    className={`border-none text-[9px] font-semibold px-2 py-0.5 rounded-md shrink-0 select-none ${
                      ticket.status === "processing"
                        ? "bg-amber-50 text-amber-700 animate-pulse"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {ticket.status === "processing"
                      ? "Đội kỹ thuật đang sửa"
                      : "Đã nghiệm thu xong"}
                  </Badge>
                </div>

                {/* Dòng giữa: Đoạn mô tả chi tiết hiện trạng thiết bị báo hỏng */}
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans bg-slate-50/40 p-2.5 rounded-lg border border-slate-100/60">
                  {ticket.description}
                </p>

                {/* Dòng đáy: Nhật ký tác nghiệp xử lý */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-medium text-slate-400 font-mono pt-1 select-none">
                  <div className="flex items-center gap-3 flex-wrap font-sans">
                    <span>
                      Người báo:{" "}
                      <strong className="text-slate-600 font-medium">
                        {ticket.reporter}
                      </strong>
                    </span>
                    <span className="text-slate-200 font-light">|</span>
                    <span>
                      Kỹ thuật viên thụ lý:{" "}
                      <strong className="text-slate-700 font-semibold">
                        {ticket.handler}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>Khởi tạo: {ticket.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: KHỐI THÔNG BÁO QUY TRÌNH TIẾP NHẬN B2B SAAS */}
      <section className="p-5 select-none">
        <div className="flex items-start gap-1.5 text-[10px] text-slate-400 font-medium leading-normal bg-slate-50/60 p-2.5 rounded-lg border border-dashed border-slate-200">
          <HelpCircle size={12} className="text-slate-400 mt-0.5 shrink-0" />
          <span>
            Mọi Ticket báo hỏng do cư dân gửi từ ứng dụng di động (Danjin Tenant
            App) sẽ tự động đồng bộ theo thời gian thực về màn hình này thông
            qua kết nối mạng WebSocket. Hệ thống tự động tính toán chấm điểm
            KPIs tốc độ sửa chữa của đội ngũ kỹ thuật tòa nhà.
          </span>
        </div>
      </section>
    </div>
  );
}
