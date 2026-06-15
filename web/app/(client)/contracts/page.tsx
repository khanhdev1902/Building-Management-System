/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import {
  KeyRound,
  Calendar,
  FileText,
  Download,
  Coins,
  AlertCircle,
  UserCheck,
  Building,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { contractApi } from "@/app/admin/contracts/new/apis/contracts.api";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { ContractDetail } from "./types/contract.type";

export default function TenantContractPage() {
  const [contract, setContract] = useState<ContractDetail>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const auth = useAuthStore();

  const fechData = async () => {
    try {
      setIsLoading(true);
      if (!auth.user) return;
      const res = await contractApi.getContractTenantById(auth.user.id);
      setContract(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      // Giữ loading nhẹ 400ms tránh giật lag UI khi mạng quá nhanh
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  useEffect(() => {
    fechData();
  }, []);

  // LOGIC TÍNH TOÁN TIẾN ĐỘ THỜI GIAN REAL-TIME
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { totalDays, daysLeft, progressPercent } = React.useMemo(() => {
    if (!contract?.terms?.startDate || !contract?.terms?.endDate) {
      return { totalDays: 365, daysLeft: 0, progressPercent: 0 };
    }

    // Định dạng ngày từ API (Giả định chuỗi đang là "DD/MM/YYYY")
    const parseDateStr = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    };

    const start = parseDateStr(contract.terms.startDate);
    const end = parseDateStr(contract.terms.endDate);
    const now = new Date();

    // Đưa tất cả về mốc 0h để tính toán số ngày chính xác, không lệch múi giờ
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    // Tính tổng số ngày của hợp đồng (1 ngày = 24 * 60 * 60 * 1000 ms)
    const oneDayMs = 24 * 60 * 60 * 1000;
    const total = Math.round((end.getTime() - start.getTime()) / oneDayMs);

    // Tính số ngày còn lại từ hôm nay đến ngày đáo hạn
    let left = Math.round((end.getTime() - now.getTime()) / oneDayMs);

    // Chặn trường hợp hợp đồng đã hết hạn (tránh số ngày âm) hoặc chưa đến ngày bắt đầu ở tương lai
    if (left < 0) left = 0;
    if (left > total) left = total;

    // Tính tỷ lệ % thời gian đã trôi qua
    const elapsed = total - left;
    const percent = total > 0 ? (elapsed / total) * 100 : 0;

    return {
      totalDays: total,
      daysLeft: left,
      progressPercent: percent,
    };
  }, [contract]);

  const handleDownloadContract = async (id: string) => {
    try {
      const blob = await contractApi.exportContractPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-${id.slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`Đã xuất hợp đồng PDF cho chứng từ ${id.slice(0, 10)}!`);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xuất file chứng từ PDF");
    }
  };

  // ================= 🎨 BỘ KHUNG XƯƠNG LOADING SKELETON ĐỒNG TRỤC =================
  if (isLoading || !contract) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-5 bg-[#fcfcfd] min-h-screen animate-pulse select-none">
        <div className="flex justify-between items-center pb-5 border-b border-slate-100">
          <div className="space-y-2 w-1/3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="h-9 bg-slate-200 rounded w-36" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="h-28 bg-white border border-slate-100 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-28 bg-white border border-slate-100 rounded-lg" />
              <div className="h-28 bg-white border border-slate-100 rounded-lg" />
            </div>
            <div className="h-36 bg-white border border-slate-100 rounded-lg" />
          </div>
          <div className="space-y-5">
            <div className="h-32 bg-white border border-slate-100 rounded-lg" />
            <div className="h-56 bg-white border border-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // ================= GIAO DIỆN CHÍNH FLAT & SHARP =================
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-5 bg-[#fcfcfd] min-h-screen antialiased font-sans select-none">
      {/* 1. TOP BAR TIÊU ĐỀ FLAT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-2 uppercase">
            <KeyRound className="w-4 h-4 text-slate-900 stroke-[2.5]" />
            Hợp đồng thuê nhà điện tử
          </h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Mã chứng từ pháp lý:{" "}
            <span className="font-mono text-slate-700 font-black">
              {contract.contractNo}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button
            onClick={() => handleDownloadContract(contract.id)}
            className="h-8.5 text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white rounded-md gap-1.5 cursor-pointer w-full sm:w-auto"
          >
            <Download size={13} strokeWidth={2.5} /> Tải file bản sao PDF
          </Button>
        </div>
      </div>

      {/* LƯỚI TỶ LỆ CÂN BẰNG 2:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ================= CỘT TRÁI (2/3 HỆ THỐNG) ================= */}
        <div className="lg:col-span-2 space-y-5 min-w-0">
          {/* PROGRESS THỜI HẠN THUÊ */}
          <div className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-white space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-slate-900" /> Tiến độ thời hạn
                thuê mặt bằng
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] sm:text-[11px] font-black text-slate-400 font-mono uppercase tracking-tight">
                <span>Khởi đầu: {contract.terms.startDate}</span>
                <span className="text-slate-900 font-black">
                  Còn {daysLeft} ngày lưu trú
                </span>
                <span>Đáo hạn: {contract.terms.endDate}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="bg-slate-900 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(15,23,42,0.2)]"
                />
              </div>
            </div>
          </div>

          {/* GRID QUẢN LÝ BÊN A & BÊN B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block border-b border-slate-50 pb-1.5">
                Bên cho thuê (BÊN A)
              </span>
              <div className="space-y-1 text-xs font-bold text-slate-800">
                <p className="text-[13px] font-black text-slate-900">
                  {contract.lessor.name}
                </p>
                <div className="text-slate-400 text-[11px] font-medium">
                  Đại diện pháp nhân: {contract.lessor.representative}
                </div>
                <div className="text-slate-400 text-[11px] font-medium font-mono">
                  Hotline BQL: {contract.lessor.phone}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block border-b border-slate-50 pb-1.5">
                Đại diện thuê (BÊN B)
              </span>
              <div className="space-y-1 text-xs font-bold text-slate-800">
                <p className="text-[13px] font-black text-slate-900">
                  {contract.lessee.name}
                </p>
                <div className="text-slate-400 text-[11px] font-medium font-mono">
                  Số CCCD gốc: {contract.lessee.idNo}
                </div>
                <div className="text-slate-400 text-[11px] font-medium font-mono">
                  SĐT hệ thống: {contract.lessee.phone}
                </div>
              </div>
            </div>
          </div>

          {/* THÀNH VIÊN ĐĂNG KÝ LƯU TRÚ */}
          <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-slate-900" /> Thành viên lưu
                trú cùng phòng
              </span>
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                Hạn ngạch: 02 người
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {contract.roommates?.map((member, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50/40 rounded border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-[12px]">
                        {member.name}
                      </span>
                      <span className="text-[8px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        {member.relationship}
                      </span>
                    </div>
                    <div className="text-slate-400 font-medium flex gap-4 font-mono text-[10px] pt-0.5">
                      <span>SĐT: {member.phoneMasked}</span>
                      <span>CCCD: {member.idNoMasked}</span>
                    </div>
                  </div>
                  <div>
                    {member.status === "ACTIVE" ? (
                      <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        ĐÃ DUYỆT TẠM TRÚ
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-100 animate-pulse">
                        CHỜ XÁC MINH
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ĐIỀU KHOẢN TÀI CHÍNH CỐ ĐỊNH */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-3.5 bg-slate-50/50 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-slate-900" /> Tóm lược nghĩa
                vụ tài chính cố định
              </span>
            </div>
            <div className="divide-y divide-slate-50 text-[12px] font-bold text-slate-600">
              <div className="flex justify-between p-2.5 px-4 items-center">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">
                  <Building size={12} /> Căn hộ điều phối
                </span>
                <span className="text-slate-900 font-black">
                  Phòng {contract.terms.room} ({contract.terms.building})
                </span>
              </div>
              <div className="flex justify-between p-2.5 px-4 items-center">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">
                  <Coins size={12} /> Đơn giá thuê định kỳ
                </span>
                <span className="text-slate-900 font-mono font-black">
                  {contract.terms.monthlyRent.toLocaleString()}đ / tháng
                </span>
              </div>
              <div className="flex justify-between p-2.5 px-4 items-center bg-slate-50/30">
                <span className="text-slate-900 font-black uppercase text-[9px] tracking-wider">
                  🔒 Quỹ bảo lưu tiền ký cọc
                </span>
                <span className="text-slate-900 font-mono font-black">
                  {contract.terms.depositAmount.toLocaleString()}đ
                </span>
              </div>
              <div className="flex justify-between p-2.5 px-4 items-center">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">
                  <Calendar size={12} /> Kỳ lập hóa đơn
                </span>
                <span className="text-slate-900 font-black uppercase text-[11px]">
                  {contract.terms.paymentCycle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI (1/3 HỆ THỐNG) ================= */}
        <div className="space-y-5 min-w-0">
          {/* CHỨNG THỰC CHỮ KÝ SỐ */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block border-b border-slate-50 pb-1.5">
              Hệ thống chứng thực số
            </span>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-md space-y-2 flex flex-col items-center text-center">
              <div className="h-7 w-7 bg-slate-900 text-white rounded-full flex items-center justify-center">
                <UserCheck size={14} className="stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wide">
                  Đã xác thực OTP SMS
                </p>
                <p className="text-[10px] font-mono font-bold text-slate-400">
                  {contract.signedAt}
                </p>
              </div>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium text-center px-1">
              Biên bản điện tử mang đầy đủ tính chất pháp lý ràng buộc nghĩa vụ
              hai bên theo luật nhà ở hiện hành.
            </p>
          </div>

          {/* QUY CHẾ ĐIỀU KHOẢN TÒA NHÀ */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-1.5">
              <AlertCircle size={13} className="text-slate-900" /> Nội quy vận
              hành tòa nhà
            </span>

            <div className="space-y-3.5 text-xs font-bold">
              {contract.rules?.map((rule, idx) => (
                <div key={idx} className="space-y-0.5">
                  <strong className="text-slate-900 font-black text-[12px] tracking-tight block">
                    • {rule.title}
                  </strong>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal pl-2.5">
                    {rule.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
