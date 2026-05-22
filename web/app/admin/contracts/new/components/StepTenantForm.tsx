"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FileText, ChevronDown } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { FormGroup } from "./FormGroup";
import { tenantApi } from "@/app/admin/tenants/apis/tenant.api";
import { toast } from "sonner";
import { Tenant } from "@/app/admin/tenants/types/tenant.type";

export function StepTenantForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const genderValue = watch("gender");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [openTenantList, setOpenTenantList] = useState(false);

  // 1. Luồng Fetching đồng bộ danh sách cư dân PENDING từ Server
  useEffect(() => {
    const getTenants = async () => {
      try {
        const res = await tenantApi.getAllTenants();
        if (res.success || res.code === 200) {
          setTenants(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách cư dân hệ thống:", error);
      }
    };
    getTenants();
  }, []);

  // 2. Thuật toán đổ dữ liệu tự động (Auto-fill Workflow) và bóc tách cấu trúc phức tạp
  const handleSelectTenant = (tenant: Tenant) => {
    // Đổ các trường dữ liệu phẳng cơ bản
    setValue("tenantName", tenant.fullName);
    setValue("phone", tenant.phone);
    setValue("email", tenant.email || "");
    setValue("cccd", tenant.citizenId);
    setValue("gender", tenant.gender);
    setValue("occupation", tenant.occupation);

    // Xử lý chuỗi ngày sinh chuyển đổi từ định dạng ISO (2004-01-05T...) sang YYYY-MM-DD của Input HTML
    if (tenant.dateOfBirth) {
      const formattedDate = tenant.dateOfBirth.split("T")[0];
      setValue("birthday", formattedDate);
    }

    // Đổ dữ liệu phân rã địa chỉ gốc của cư dân phục vụ Step 2/3
    if (tenant.hometown) {
      setValue(
        "hometown",
        `${tenant.hometown.address}, ${tenant.hometown.ward}, ${tenant.hometown.district}, ${tenant.hometown.province}`,
      );
      // Nếu các bước sau anh cần lưu bóc tách thì set sẵn:
      setValue("province", tenant.hometown.province);
      setValue("district", tenant.hometown.district);
      setValue("ward", tenant.hometown.ward);
      setValue("addressDetail", tenant.hometown.address);
      setValue("tenantId", tenant.id);
    }

    console.log(tenant);
    // Đồng bộ danh mục xe cộ đi kèm thẳng vào luồng dữ liệu Form Array
    if (tenant.vehicles && tenant.vehicles.length > 0) {
      const formattedVehicles = tenant.vehicles.map((v) => ({
        id: v.id,
        type: v.type,
        licensePlate: v.licensePlate,
      }));
      console.log(formattedVehicles);
      setValue("tenantVehicles", formattedVehicles); // Đồng bộ thẳng vào mảng đi kèm sinh hoạt
    }

    setOpenTenantList(false);
    toast.success(`Đã đồng bộ hồ sơ số hóa của cư dân ${tenant.fullName}!`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-50 pb-1 select-none">
        <FileText size={14} className="text-slate-400" /> I. Thông tin cá nhân
        bên thuê phòng
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* HYBRID SEARCH INPUT: Cho phép gõ chữ tự do hoặc bấm nút chọn nhanh từ Server */}
        <FormGroup
          label="Họ và tên khách thuê đại diện"
          error={errors.tenantName?.message as string}
        >
          <div className="relative flex items-center w-full group">
            <Input
              {...register("tenantName")}
              placeholder="Họ và tên..."
              className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg pr-8 focus-visible:bg-white transition-all w-full text-slate-800"
            />

            <Popover open={openTenantList} onOpenChange={setOpenTenantList}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="absolute right-0 top-0 h-8.5 w-8 flex items-center justify-center text-slate-400 hover:text-slate-800 border-l border-slate-200/60 transition-colors cursor-pointer"
                >
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${openTenantList ? "rotate-180" : ""}`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="p-1 w-72 rounded-xl border border-slate-200 shadow-md bg-white select-none"
                align="end"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5 border-b border-slate-50">
                  Danh sách cư dân hệ thống
                </div>
                <div className="max-h-48 overflow-y-auto pt-0.5">
                  {tenants.length === 0 ? (
                    <p className="text-[11px] text-slate-400 p-3 italic text-center">
                      Không tìm thấy dữ liệu cư dân
                    </p>
                  ) : (
                    tenants.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTenant(t)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors flex flex-col gap-0.5 group cursor-pointer border-none bg-transparent"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {t.fullName}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1 rounded bg-slate-100 text-slate-500">
                            {t.phone}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono truncate block max-w-60">
                          CCCD: {t.citizenId}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </FormGroup>

        {/* TẤT CẢ CÁC Ô INPUT BÊN DƯỚI ĐỀU GIỮ NGUYÊN QUYỀN CHỈNH SỬA (MUTABLE INPUTS) */}
        <FormGroup
          label="Số điện thoại"
          error={errors.phone?.message as string}
        >
          <Input
            {...register("phone")}
            placeholder="09xx xxx xxx"
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all"
          />
        </FormGroup>

        <FormGroup
          label="Địa chỉ thư điện tử (Email)"
          error={errors.email?.message as string}
        >
          <Input
            {...register("email")}
            placeholder="khanhnv@gmail.com"
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all"
          />
        </FormGroup>

        <FormGroup
          label="Số căn cước công dân (CCCD)"
          error={errors.cccd?.message as string}
        >
          <Input
            {...register("cccd")}
            placeholder="Số căn cước công dân 12 số..."
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all"
          />
        </FormGroup>

        <FormGroup
          label="Ngày tháng năm sinh"
          error={errors.birthday?.message as string}
        >
          <Input
            type="date"
            {...register("birthday")}
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg text-slate-700 focus-visible:bg-white transition-all"
          />
        </FormGroup>

        <FormGroup label="Giới tính">
          <Select
            value={genderValue}
            onValueChange={(val) => setValue("gender", val)}
          >
            <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-semibold px-2.5 focus:ring-0 cursor-pointer shadow-3xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="p-1 rounded-lg border-slate-200">
              <SelectItem value="Nam" className="text-xs">
                Nam
              </SelectItem>
              <SelectItem value="Nữ" className="text-xs">
                Nữ
              </SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>

        <FormGroup
          label="Nguyên quán đăng ký khai sinh gốc"
          error={errors.hometown?.message as string}
        >
          <Input
            {...register("hometown")}
            placeholder="Ví dụ: Xuân Trường, Nam Định"
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all"
          />
        </FormGroup>

        <FormGroup
          label="Nghề nghiệp / Học tập hiện tại"
          error={errors.occupation?.message as string}
        >
          <Input
            {...register("occupation")}
            placeholder="Ví dụ: Sinh viên"
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all"
          />
        </FormGroup>
      </div>
    </div>
  );
}
