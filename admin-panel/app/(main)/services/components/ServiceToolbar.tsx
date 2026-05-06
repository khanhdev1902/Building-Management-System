import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface ToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const ServiceToolbar = ({ searchTerm, setSearchTerm }: ToolbarProps) => (
  <div className="flex gap-4 items-center bg-white/40 p-2 rounded-3xl border border-white/60 backdrop-blur-md shadow-inner">
    <div className="relative flex-1 group">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
      <Input
        placeholder="Tìm kiếm dịch vụ nhanh..."
        className="pl-12 h-12 bg-transparent border-none rounded-2xl focus-visible:ring-0 text-base placeholder:text-slate-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <Button
      variant="ghost"
      className="rounded-2xl h-12 px-4 text-slate-500 hover:bg-white hover:text-indigo-600 transition-all"
    >
      <SlidersHorizontal className="mr-2 h-4 w-4" /> Lọc
    </Button>
  </div>
);
