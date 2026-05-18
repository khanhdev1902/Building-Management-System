"use client";

import React from "react";
import {
  Bike,
  History,
  Plus,
  Fingerprint,
  Users,
  Phone,
  FileText,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export function TabOverview() {
  return (
    <div className="divide-y divide-slate-100/70 font-sans">
      {/* SECTION 1: NHÂN KHẨU TẠM TRÚ ĐI KÈM (Lột xác sang dạng Grid Card) */}
      <section className="p-5 space-y-4">
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Users size={14} className="text-slate-400" /> Thành viên cư trú
              đi kèm (Roommates)
            </h3>
            <Badge className="bg-slate-100 text-slate-500 border-none font-semibold text-[10px] rounded px-1.5 h-4.5">
              02 Nhân khẩu
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-6.5 text-[10px] font-semibold border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
          >
            <Plus size={11} className="mr-1 stroke-[2.5]" /> Thêm thành viên
          </Button>
        </div>

        {/* Matrix Grid: Giải quyết triệt để bài toán ở ghép/sinh viên chung phòng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cư dân đi kèm 1 */}
          <div className="border border-slate-200/60 rounded-xl p-4 bg-slate-50/20 space-y-3 relative group hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-xs block">
                  Lê Thị Bảo
                </span>
                <span className="text-[10px] font-mono text-slate-400 tracking-wide">
                  ID: TEN-1025-SUB1
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[9px] font-bold border-indigo-100 bg-indigo-50/40 text-indigo-700 rounded px-1.5"
              >
                Quan hệ: Bạn ở ghép
              </Badge>
            </div>

            {/* Khay dữ liệu nhân trắc học nén chặt */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-[11px] font-medium text-slate-600">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Số điện thoại
                </span>
                <span className="font-mono text-slate-800 font-bold flex items-center gap-1">
                  <Phone size={11} className="text-slate-400" /> 0982 111 222
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Số định danh CCCD
                </span>
                <span className="font-mono text-slate-700 font-semibold flex items-center gap-1">
                  <FileText size={11} className="text-slate-400" /> 037196005678
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Giới tính / Ngày sinh
                </span>
                <span className="text-slate-700 flex items-center gap-1">
                  <User size={11} className="text-slate-400" /> Nữ • 14/05/1998
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Quê quán thường trú
                </span>
                <span
                  className="text-slate-700 truncate flex items-center gap-1"
                  title="Lục Ngạn, Bắc Giang"
                >
                  <MapPin size={11} className="text-slate-400" /> Bắc Giang
                </span>
              </div>
            </div>

            <div className="pt-1.5 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
              <CheckCircle2 size={12} className="shrink-0" />
              <span>CA Phường phê duyệt tạm trú</span>
            </div>
          </div>

          {/* Cư dân đi kèm 2 */}
          <div className="border border-slate-200/60 rounded-xl p-4 bg-slate-50/20 space-y-3 relative group hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-xs block">
                  Nguyễn Văn C
                </span>
                <span className="text-[10px] font-mono text-slate-400 tracking-wide">
                  ID: TEN-1025-SUB2
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[9px] font-bold border-slate-200 bg-slate-100 text-slate-600 rounded px-1.5"
              >
                Quan hệ: Bạn cùng lớp
              </Badge>
            </div>

            {/* Khay dữ liệu nhân trắc học nén chặt */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-[11px] font-medium text-slate-600">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Số điện thoại
                </span>
                <span className="font-mono text-slate-800 font-bold flex items-center gap-1">
                  <Phone size={11} className="text-slate-400" /> 0345 999 888
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Số định danh CCCD
                </span>
                <span className="font-mono text-slate-700 font-semibold flex items-center gap-1">
                  <FileText size={11} className="text-slate-400" /> 038200012345
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Giới tính / Ngày sinh
                </span>
                <span className="text-slate-700 flex items-center gap-1">
                  <User size={11} className="text-slate-400" /> Nam • 22/11/2004
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Quê quán thường trú
                </span>
                <span
                  className="text-slate-700 truncate flex items-center gap-1"
                  title="Kim Động, Hưng Yên"
                >
                  <MapPin size={11} className="text-slate-400" /> Hưng Yên
                </span>
              </div>
            </div>

            <div className="pt-1.5 flex items-center gap-1 text-[10px] font-semibold text-amber-600">
              <AlertCircle size={12} className="shrink-0" />
              <span>Chờ bổ sung ảnh CCCD mặt sau</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: QUẢN LÝ PHƯƠNG TIỆN (Phẳng lì đồng hàng) */}
      <section className="p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 select-none">
          <Bike size={14} className="text-slate-400" /> Quản lý phương tiện gửi
          tại hầm
        </h3>

        <div className="space-y-2">
          {[
            {
              plate: "29-G1 123.45",
              type: "Honda Vision • Thẻ mã số #99120",
              active: true,
            },
            {
              plate: "30-A2 555.88",
              type: "Mazda CX-5 • Thẻ mã số #88201",
              active: false,
            },
          ].map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 select-none text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-lg border ${v.active ? "bg-white text-slate-700" : "bg-rose-50 text-rose-500 border-rose-100/50"} shrink-0 shadow-3xs`}
                >
                  <Bike size={14} className="stroke-[2]" />
                </div>
                <div>
                  <span className="font-mono font-bold text-slate-800 mr-2 uppercase">
                    {v.plate}
                  </span>
                  <span className="text-slate-400 font-medium text-[11px]">
                    {v.type}
                  </span>
                </div>
              </div>
              <Badge
                className={`border-none text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                  v.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {v.active ? "Đang hoạt động" : "Tạm khóa thẻ"}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: TIMELINE (Audit Log) */}
      <section className="p-5 space-y-4">
        <div className="flex items-center justify-between select-none">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <History size={14} className="text-slate-400" /> Nhật ký quét cổng
            Vân tay / Cửa từ gần đây
          </h3>
          <span className="text-[10px] text-slate-400 font-medium font-mono flex items-center gap-1">
            <Fingerprint size={12} /> IoT Gateway Live
          </span>
        </div>

        <div className="space-y-4 pl-1 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200/60 select-none">
          {[
            {
              title: "Mở cổng bãi xe hầm B1 bằng xác thực Vân tay",
              user: "Hệ thống tự động",
              time: "Hôm nay, 10:30",
              color: "bg-emerald-500",
            },
            {
              title:
                "Cảnh báo: Thẻ từ quẹt cổng sảnh chính Tầng 1 sai định dạng mã thẻ",
              user: "Cổng kiểm soát an ninh số 2",
              time: "Hôm qua, 14:20",
              color: "bg-rose-500",
            },
            {
              title:
                "Hệ thống tự động kích hoạt chu kỳ thời hạn hợp đồng tạm trú mới",
              user: "Khánh Nguyễn (Manager)",
              time: "18/05/2026",
              color: "bg-indigo-500",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex gap-3 relative items-start text-xs font-sans"
            >
              <div
                className={`h-2 w-2 rounded-full ${item.color} border border-white ring-2 ring-slate-50 mt-1 z-10 shrink-0`}
              />
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="font-semibold text-slate-800 tracking-tight leading-normal">
                    {item.title}
                  </p>
                  <span className="text-[10px] font-medium text-slate-400 font-mono shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Thiết bị tác nghiệp:{" "}
                  <span className="text-slate-500">{item.user}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
