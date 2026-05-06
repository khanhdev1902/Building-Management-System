import React from "react";
import {
  ClipboardCheck,
  Zap,
  Droplets,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { DetailRow, FileCard, TimelineStep, UtilityCard } from "./ui-atoms";

export function TabContract() {
  return (
    <div className="p-0 animate-in fade-in duration-500">
      {/* Top Section: Thông tin Hợp đồng & Chỉ số */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 border-b border-slate-100">
        {/* Cột 1 & 2: Hợp đồng (Chiếm 2/3 không gian) */}
        <div className="lg:col-span-2 space-y-6 border-r border-slate-100 pr-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <div className="p-1.5 bg-slate-900 rounded text-white">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              Thỏa thuận thuê nhà
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-indigo-600 font-bold text-xs h-8 hover:bg-indigo-50"
            >
              <ExternalLink className="w-3 h-3 mr-1.5" /> Bản gốc
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <DetailRow
              label="Mã hợp đồng"
              value="CT-2024-P101"
              isBold
              color="text-indigo-600"
            />
            <DetailRow label="Loại hợp đồng" value="Dài hạn (12 tháng)" />
            <DetailRow label="Ngày hiệu lực" value="01/01/2026" />
            <DetailRow label="Ngày kết thúc" value="01/01/2027" />
            <DetailRow label="Chu kỳ thanh toán" value="Mỗi 03 tháng" />
            <DetailRow label="Tiền thuê niêm yết" value="12,500,000đ" isBold />
            <div className="md:col-span-2 pt-2 flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Pháp lý:
              </span>
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-bold text-[10px] shadow-none">
                Chưa khai báo tạm trú
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold text-[10px] shadow-none">
                Đã cọc 100%
              </Badge>
            </div>
          </div>
        </div>

        {/* Cột 3: Tiện ích & Chỉ số kỹ thuật */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <div className="p-1.5 bg-amber-500 rounded text-white">
              <Zap className="w-4 h-4" />
            </div>
            Dịch vụ & Chỉ số
          </h3>
          <div className="space-y-3">
            <UtilityCard
              icon={<Zap className="w-4 h-4" />}
              label="Điện năng tiêu thụ"
              value="1,245"
              unit="kWh"
              sub="Kỳ: 03/2026"
              trend="up"
            />
            <UtilityCard
              icon={<Droplets className="w-4 h-4" />}
              label="Nước sinh hoạt"
              value="452"
              unit="m³"
              sub="Kỳ: 03/2026"
              trend="stable"
            />
          </div>
        </div>
      </div>

      {/* Middle Section: Tài liệu đính kèm */}
      <div className="p-6 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Hồ sơ & Phụ lục đính kèm
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-bold border-slate-300"
          >
            QUẢN LÝ FILE
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <FileCard name="Hop_Dong_Thue_Goc_Scan.pdf" size="2.4MB" />
          <FileCard name="Phu_Luc_Noi_Quy_Toa_Nha.pdf" size="1.2MB" />
          <FileCard name="Bien_Ban_Ban_Giao_TS.pdf" size="4.5MB" />
        </div>
      </div>

      {/* Bottom Section: Timeline */}
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Tiến độ thực hiện hợp đồng
            </h4>
            <p className="text-[11px] text-slate-500 font-medium italic">
              Tự động cập nhật theo tiến độ thanh toán và thời hạn
            </p>
          </div>
        </div>

        <div className="relative pt-4 pb-8 px-4 overflow-x-auto">
          <div className="flex gap-12 min-w-150">
            <TimelineStep
              date="01/01/2026"
              title="Ký kết & Nhận bàn giao"
              status="completed"
            />
            <TimelineStep
              date="01/04/2026"
              title="Thanh toán Kỳ 02"
              status="pending"
            />
            <TimelineStep
              date="01/07/2026"
              title="Thanh toán Kỳ 03"
              status="upcoming"
            />
            <TimelineStep
              date="01/10/2026"
              title="Thanh toán Kỳ 04"
              status="upcoming"
            />
            <TimelineStep
              date="01/01/2027"
              title="Tái ký / Thanh lý"
              status="upcoming"
              isLast
            />
          </div>
        </div>
      </div>
    </div>
  );
}
