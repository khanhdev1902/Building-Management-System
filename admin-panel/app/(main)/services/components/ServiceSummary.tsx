import { ShieldCheck, Zap, Wind } from "lucide-react";

const STATS = [
  {
    label: "An ninh",
    value: "24/7 Active",
    icon: <ShieldCheck />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Năng lượng",
    value: "Stable",
    icon: <Zap />,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Hệ thống PCCC",
    value: "Certified",
    icon: <Wind />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export const ServiceSummary = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    {STATS.map((stat, i) => (
      <div
        key={i}
        className="group p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5"
      >
        <div
          className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:rotate-12`}
        >
          {stat.icon}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {stat.label}
          </p>
          <p className="text-base font-black text-slate-800">{stat.value}</p>
        </div>
      </div>
    ))}
  </div>
);
