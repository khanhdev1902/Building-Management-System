// "use client";

// import React from "react";
// import {
//   Wifi,
//   Car,
//   ShieldCheck,
//   Trash2,
//   Plus,
//   ArrowRight,
//   Zap,
//   Droplets,
//   CreditCard,
//   History,
//   Settings2,
//   Info,
// } from "lucide-react";
// import { Button } from "@/shared/components/ui/button";
// import { Badge } from "@/shared/components/ui/badge";
// import { Progress } from "@/shared/components/ui/progress";
// import { ScrollArea } from "@/shared/components/ui/scroll-area";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/shared/components/ui/card";

// const MY_SERVICES = [
//   {
//     id: 1,
//     name: "Internet Giga-Net",
//     icon: <Wifi className="text-blue-500" />,
//     status: "active",
//     price: "250.000đ",
//     billingCycle: "Hàng tháng",
//     nextBilling: "15/04/2026",
//     usage: 65,
//   },
//   {
//     id: 2,
//     name: "Gửi xe ô tô (B2)",
//     icon: <Car className="text-slate-700" />,
//     status: "active",
//     price: "1.200.000đ",
//     billingCycle: "Hàng tháng",
//     nextBilling: "01/04/2026",
//     usage: null,
//   },
//   {
//     id: 3,
//     name: "Bảo trì định kỳ Gold",
//     icon: <ShieldCheck className="text-emerald-500" />,
//     status: "pending",
//     price: "500.000đ",
//     billingCycle: "Hàng năm",
//     nextBilling: "Chờ xác nhận",
//     usage: null,
//   },
// ];

// export default function ServiceManagement() {
//   return (
//     <div className="p-8 bg-white min-h-screen text-slate-900 font-sans">
//       {/* Header Area */}
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
//         <div>
//           <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
//             Dịch vụ của tôi
//           </h1>
//           <p className="text-sm text-slate-500 font-medium">
//             Quản lý và đăng ký các tiện ích tại LuxHouse
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             className="rounded-xl border-slate-200 text-xs font-bold"
//           >
//             <History className="w-4 h-4 mr-2" /> Lịch sử thanh toán
//           </Button>
//           <Button
//             size="sm"
//             className="bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-200"
//           >
//             <Plus className="w-4 h-4 mr-2" /> Đăng ký dịch vụ mới
//           </Button>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column: Active Services List */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
//               Đang sử dụng ({MY_SERVICES.length})
//             </h3>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {MY_SERVICES.map((service) => (
//               <Card
//                 key={service.id}
//                 className="border-slate-100 shadow-none hover:border-slate-300 transition-all group overflow-hidden"
//               >
//                 <CardHeader className="p-5 pb-2">
//                   <div className="flex justify-between items-start">
//                     <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
//                       {service.icon}
//                     </div>
//                     <Badge
//                       variant="outline"
//                       className={`border-none text-[10px] font-bold ${
//                         service.status === "active"
//                           ? "bg-emerald-50 text-emerald-600"
//                           : "bg-amber-50 text-amber-600"
//                       }`}
//                     >
//                       •{" "}
//                       {service.status === "active" ? "ĐANG CHẠY" : "CHỜ DUYỆT"}
//                     </Badge>
//                   </div>
//                   <CardTitle className="text-base font-bold mt-4">
//                     {service.name}
//                   </CardTitle>
//                   <CardDescription className="text-xs font-medium text-slate-400">
//                     {service.billingCycle}
//                   </CardDescription>
//                 </CardHeader>

//                 <CardContent className="p-5 pt-2 space-y-4">
//                   <div className="flex justify-between items-end">
//                     <div>
//                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                         Phí dịch vụ
//                       </p>
//                       <p className="text-lg font-black text-slate-900">
//                         {service.price}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                         Hạn thanh toán
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         {service.nextBilling}
//                       </p>
//                     </div>
//                   </div>

//                   {service.usage && (
//                     <div className="space-y-1.5">
//                       <div className="flex justify-between text-[10px] font-bold">
//                         <span className="text-slate-400">
//                           Dung lượng đã dùng
//                         </span>
//                         <span className="text-slate-900">{service.usage}%</span>
//                       </div>
//                       <Progress
//                         value={service.usage}
//                         className="h-1 bg-slate-100"
//                       />
//                     </div>
//                   )}
//                 </CardContent>

//                 <CardFooter className="p-3 bg-slate-50/50 border-t border-slate-50 flex gap-2">
//                   <Button
//                     variant="ghost"
//                     className="flex-1 text-[11px] font-bold text-slate-500 hover:text-slate-900"
//                   >
//                     Chi tiết
//                   </Button>
//                   <div className="w-[1px] h-4 bg-slate-200 my-auto" />
//                   <Button
//                     variant="ghost"
//                     className="flex-1 text-[11px] font-bold text-red-500 hover:bg-red-50"
//                   >
//                     Hủy bỏ
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Right Column: Quick Stats & Suggestions */}
//         <div className="space-y-8">
//           {/* Tổng chi phí hàng tháng */}
//           <Card className="bg-slate-900 text-white border-none shadow-xl shadow-slate-200 rounded-3xl overflow-hidden relative">
//             <Zap className="absolute -right-4 -top-4 w-24 h-24 text-white/5 rotate-12" />
//             <CardHeader>
//               <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
//                 Tổng chi phí dự kiến
//               </CardDescription>
//               <CardTitle className="text-3xl font-black">1.950.000đ</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-xs text-slate-400 font-medium leading-relaxed">
//                 Bao gồm Internet, gửi xe và phí quản lý tòa nhà tháng 03.
//               </p>
//             </CardContent>
//             <CardFooter>
//               <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs h-11">
//                 Thanh toán tất cả <ArrowRight className="ml-2 w-4 h-4" />
//               </Button>
//             </CardFooter>
//           </Card>

//           {/* Gợi ý dịch vụ mới */}
//           <div className="space-y-4">
//             <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] px-2 text-center">
//               Đề xuất cho bạn
//             </h3>
//             <div className="space-y-3">
//               {[
//                 {
//                   title: "Gym & Yoga 24/7",
//                   icon: <Zap size={14} />,
//                   price: "200k/tháng",
//                 },
//                 {
//                   title: "Vệ sinh máy lạnh",
//                   icon: <Droplets size={14} />,
//                   price: "150k/máy",
//                 },
//               ].map((item, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
//                       {item.icon}
//                     </div>
//                     <div>
//                       <p className="text-xs font-bold text-slate-800">
//                         {item.title}
//                       </p>
//                       <p className="text-[10px] text-slate-400 font-medium">
//                         {item.price}
//                       </p>
//                     </div>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-slate-300"
//                   >
//                     <Plus size={16} />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Settings2,
  Car,
  Wind,
  Trash2,
  Wifi,
  Zap,
  Droplets,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

// Dữ liệu mẫu cho Dịch vụ
const SERVICE_DATA = [
  {
    id: "S1",
    name: "Gửi xe máy",
    category: "Parking",
    price: "150.000",
    unit: "Xe/tháng",
    status: "active",
    icon: <Car className="w-5 h-5" />,
    description: "Quản lý xe máy bằng thẻ từ thông minh.",
  },
  {
    id: "S2",
    name: "Vệ sinh hành lang",
    category: "Cleaning",
    price: "50.000",
    unit: "Phòng/tháng",
    status: "active",
    icon: <Droplets className="w-5 h-5" />,
    description: "Vệ sinh khu vực công cộng 3 lần/tuần.",
  },
  {
    id: "S3",
    name: "Vận hành thang máy",
    category: "Maintenance",
    price: "100.000",
    unit: "Phòng/tháng",
    status: "warning",
    icon: <ArrowUpRight className="w-5 h-5" />,
    description: "Bảo trì định kỳ vào ngày 15 hàng tháng.",
  },
  {
    id: "S4",
    name: "Internet (Gói Basic)",
    category: "Utility",
    price: "200.000",
    unit: "Phòng/tháng",
    status: "active",
    icon: <Wifi className="w-5 h-5" />,
    description: "Băng thông 100Mbps, hỗ trợ 24/7.",
  },
  {
    id: "S5",
    name: "Xử lý rác thải",
    category: "Cleaning",
    price: "30.000",
    unit: "Tháng",
    status: "active",
    icon: <Trash2 className="w-5 h-5" />,
    description: "Thu gom rác hàng ngày tại hầm B1.",
  },
];

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = SERVICE_DATA.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tiện ích & Dịch vụ
          </h1>
          <p className="text-slate-500 mt-1">
            Cấu hình các loại phí và dịch vụ của tòa nhà Danjin.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 shadow-lg shadow-indigo-200">
          <Plus className="mr-2 h-5 w-5" /> Thêm dịch vụ
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Tìm tên dịch vụ..."
            className="pl-9 bg-white border-slate-200 rounded-xl focus-visible:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-slate-200 hidden md:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" /> Thiết lập chung
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className="group border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden bg-white"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div
                  className={`p-3 rounded-2xl ${getStatusColor(service.status).iconBg}`}
                >
                  {React.cloneElement(
                    service.icon as React.ReactElement,
                    {
                      className: `w-6 h-6 ${getStatusColor(service.status).iconText}`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any,
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem>Chỉnh sửa giá</DropdownMenuItem>
                    <DropdownMenuItem>Lịch bảo trì</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Tạm dừng
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  {service.name}
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Đơn giá
                  </p>
                  <p className="text-lg font-black text-indigo-600">
                    {service.price}đ
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      /{service.unit}
                    </span>
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(service.status).badge} shadow-none border-none px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold`}
                >
                  {service.status === "active" ? "Đang chạy" : "Cần kiểm tra"}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl text-xs h-9 border-slate-100 hover:bg-slate-50"
                >
                  <Clock className="w-3 h-3 mr-2" /> Nhật ký
                </Button>
                <Button className="flex-1 rounded-xl bg-slate-900 text-xs h-9">
                  Cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="grid md:grid-cols-3 gap-6 pt-4">
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              An ninh tòa nhà
            </p>
            <p className="text-sm font-bold">Đang bảo vệ (24/7)</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Hệ thống điện</p>
            <p className="text-sm font-bold">Ổn định</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Phòng cháy chữa cháy
            </p>
            <p className="text-sm font-bold">Đã kiểm định (10/2025)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function để quản lý màu sắc trạng thái
function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return {
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
      };
    case "warning":
      return {
        iconBg: "bg-amber-50",
        iconText: "text-amber-600",
        badge: "bg-amber-100 text-amber-700",
      };
    default:
      return {
        iconBg: "bg-slate-50",
        iconText: "text-slate-600",
        badge: "bg-slate-100 text-slate-700",
      };
  }
}
