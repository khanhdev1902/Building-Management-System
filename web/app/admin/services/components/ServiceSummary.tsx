// import {
//   LayoutGrid,
//   Activity,
//   TrendingUp,
// } from "lucide-react";

// const STATS = [
//   {
//     label: "Tổng dịch vụ",
//     value: "12",
//     subValue: "+2 mới tháng này",
//     icon: LayoutGrid,
//     color: "text-indigo-600",
//     bg: "bg-indigo-50",
//   },
//   {
//     label: "Trạng thái vận hành",
//     value: "98.5%",
//     subValue: "Hệ thống ổn định",
//     icon: Activity,
//     color: "text-emerald-600",
//     bg: "bg-emerald-50",
//   },
//   {
//     label: "Doanh thu dịch vụ",
//     value: "24.5M",
//     subValue: "Dự kiến tháng 05",
//     icon: TrendingUp,
//     color: "text-blue-600",
//     bg: "bg-blue-50",
//   },
// ];

// export const ServiceSummary = () => (
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
//     {STATS.map((stat, i) => (
//       <div
//         key={i}
//         className="group relative p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden"
//       >
//         {/* Subtle Background Pattern - Tạo chiều sâu */}
//         <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
//           <stat.icon size={100} />
//         </div>

//         <div className="flex items-center gap-4 relative z-10">
//           {/* Icon Box: Sắc sảo và cân đối */}
//           <div
//             className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.bg} ${stat.color} transition-colors`}
//           >
//             <stat.icon className="h-6 w-6 stroke-[2.5px]" />
//           </div>

//           <div className="flex-1">
//             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
//               {stat.label}
//             </p>
//             <div className="flex items-baseline gap-2">
//               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
//                 {stat.value}
//               </h2>
//               <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
//                 {stat.subValue}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// );
