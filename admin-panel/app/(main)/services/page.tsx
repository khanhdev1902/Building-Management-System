/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { ServiceCard } from "./components/ServiceCard";
import { ServiceHeader } from "./components/ServiceHeader";
import { ServiceToolbar } from "./components/ServiceToolbar";
import { ServiceSummary } from "./components/ServiceSummary";
import { ArrowUpRight, Car, Droplets, Trash2, Wifi } from "lucide-react";

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

// export default function ServicesPage() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredServices = SERVICE_DATA.filter((s) =>
//     s.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
//       <ServiceHeader />

//       <ServiceToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {filteredServices.map((service) => (
//           <ServiceCard key={service.id} service={service} />
//         ))}
//       </div>

//       <ServiceSummary />
//     </div>
//   );
// }
import { ServiceFormModal } from "./components/ServiceFormModal";
// ... (các import khác giữ nguyên)

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  // Mở modal để thêm mới
  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  // Mở modal để sửa (Cái này anh truyền xuống ServiceCard)
  const handleEdit = (service: any) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingService) {
      console.log("Gọi API Update (NestJS Patch):", data);
    } else {
      console.log("Gọi API Create (NestJS Post):", data);
    }
    // Sau khi gọi API xong thì load lại data
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 bg-slate-50/30 min-h-screen">
      {/* Truyền hàm handleAddNew vào ServiceHeader */}
      <ServiceHeader onAdd={handleAddNew} />

      <ServiceToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_DATA.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service as any} 
            onEdit={() => handleEdit(service)} // Gắn sự kiện sửa
          />
        ))}
      </div>

      <ServiceSummary />

      {/* Modal dùng chung */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingService}
        onSave={handleSave}
      />
    </div>
  );
}