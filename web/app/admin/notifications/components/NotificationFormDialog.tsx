"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Megaphone,
  FileText,
  Home,
  Send,
  ChevronDown,
  X,
  Layers,
  DoorOpen,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  notificationSchema,
  NotificationFormValues,
} from "../schemas/notification.schema";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_FLOORS = [
  { id: "f1", label: "Tầng 1" },
  { id: "f2", label: "Tầng 2" },
  { id: "f3", label: "Tầng 3" },
  { id: "f4", label: "Tầng 4" },
  { id: "f5", label: "Tầng 5" },
  { id: "f6", label: "Tầng 6" },
  { id: "f7", label: "Tầng 7" },
  { id: "f8", label: "Tầng 8" },
];

const MOCK_ROOMS = [
  { id: "101", label: "101", floor: "f1" },
  { id: "102", label: "102", floor: "f1" },
  { id: "103", label: "103", floor: "f1" },
  { id: "104", label: "104", floor: "f1" },
  { id: "201", label: "201", floor: "f2" },
  { id: "202", label: "202", floor: "f2" },
  { id: "203", label: "203", floor: "f2" },
  { id: "204", label: "204", floor: "f2" },
  { id: "301", label: "301", floor: "f3" },
  { id: "302", label: "302", floor: "f3" },
  { id: "303", label: "303", floor: "f3" },
  { id: "304", label: "304", floor: "f3" },
  { id: "401", label: "401", floor: "f4" },
  { id: "402", label: "402", floor: "f4" },
  { id: "403", label: "403", floor: "f4" },
  { id: "501", label: "501", floor: "f5" },
  { id: "502", label: "502", floor: "f5" },
  { id: "503", label: "503", floor: "f5" },
  { id: "601", label: "601", floor: "f6" },
  { id: "602", label: "602", floor: "f6" },
  { id: "701", label: "701", floor: "f7" },
  { id: "702", label: "702", floor: "f7" },
  { id: "801", label: "801", floor: "f8" },
  { id: "802", label: "802", floor: "f8" },
];

// ─── Multi-select Dropdown ─────────────────────────────────────────────────────

interface MultiSelectOption {
  id: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
  icon?: React.ReactNode;
  hasError?: boolean;
}

function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder,
  icon,
  hasError,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const toggleAll = () => {
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((o) => o.id));
    }
  };

  const selectedLabels = options
    .filter((o) => selected.includes(o.id))
    .map((o) => o.label);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full h-9 pl-9 pr-8 rounded-lg border bg-slate-50/30 text-xs font-semibold text-left flex items-center transition-all
          ${hasError ? "border-red-500" : "border-slate-200 hover:border-slate-300"}
          ${open ? "bg-white border-slate-400" : ""}
        `}
      >
        <span className="absolute left-3 text-slate-400">{icon}</span>
        {selected.length === 0 ? (
          <span className="text-slate-400 font-normal">{placeholder}</span>
        ) : selected.length <= 4 ? (
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {selectedLabels.map((l) => (
              <span
                key={l}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-900 text-white rounded-md text-[10px] font-bold leading-none"
              >
                {l}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-700">
            Đã chọn{" "}
            <span className="font-bold text-slate-900">{selected.length}</span>{" "}
            mục
          </span>
        )}
        <ChevronDown
          size={13}
          className={`absolute right-2.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-1 fade-in duration-150">
          {/* Select all row */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={toggleAll}
          >
            <div
              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors
                ${selected.length === options.length ? "bg-slate-900 border-slate-900" : "border-slate-300"}`}
            >
              {selected.length === options.length && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path
                    d="M1 3L3 5L7 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {selected.length > 0 && selected.length < options.length && (
                <div className="w-2 h-0.5 bg-slate-400 rounded" />
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Chọn tất cả ({options.length})
            </span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
                className="ml-auto text-slate-400 hover:text-slate-700"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Options */}
          <div className="max-h-44 overflow-y-auto py-1">
            <div className="grid grid-cols-3 gap-0.5 px-1.5">
              {options.map((opt) => {
                const checked = selected.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggle(opt.id)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors select-none
                      ${checked ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-700"}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-sm border shrink-0 flex items-center justify-center transition-colors
                        ${checked ? "bg-white/20 border-white/40" : "border-slate-300"}`}
                    >
                      {checked && (
                        <svg width="7" height="5" viewBox="0 0 8 6" fill="none">
                          <path
                            d="M1 3L3 5L7 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-[11px] font-bold">{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface NotificationDialogProps {
  onSubmit: (data: NotificationFormValues) => void;
  trigger?: React.ReactNode;
}

export function NotificationDialog({
  onSubmit,
  trigger,
}: NotificationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [roomTargetMode, setRoomTargetMode] = useState<"room" | "floor">(
    "room",
  );
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedFloors, setSelectedFloors] = useState<string[]>([]);
  const [targetError, setTargetError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      type: "life",
      targetType: "all",
      specificRoom: "",
      priority: "low",
      content: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const targetType = watch("targetType");
  const currentPriority = watch("priority");

  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedRooms([]);
      setSelectedFloors([]);
      setRoomTargetMode("room");
      setTargetError("");
    }
  }, [isOpen, reset]);

  // Sync specificRoom value to form
  useEffect(() => {
    if (targetType === "room") {
      if (roomTargetMode === "room") {
        setValue("specificRoom", selectedRooms.join(","));
      } else {
        // Expand floors to rooms
        const roomsInFloors = MOCK_ROOMS.filter((r) =>
          selectedFloors.includes(r.floor),
        ).map((r) => r.id);
        setValue("specificRoom", roomsInFloors.join(","));
      }
    }
  }, [selectedRooms, selectedFloors, roomTargetMode, targetType, setValue]);

  const handleFormSubmit = async (data: NotificationFormValues) => {
    // Validate target selection
    if (targetType === "room") {
      const hasSelection =
        roomTargetMode === "room"
          ? selectedRooms.length > 0
          : selectedFloors.length > 0;
      if (!hasSelection) {
        setTargetError(
          roomTargetMode === "room"
            ? "Vui lòng chọn ít nhất một phòng."
            : "Vui lòng chọn ít nhất một tầng.",
        );
        return;
      }
    }
    setTargetError("");
    try {
      await onSubmit(data);
      setIsOpen(false);
    } catch (error) {
      console.error("Lỗi gửi thông báo:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="cursor-pointer h-9 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm gap-1.5 px-4 transition-all active:scale-[0.98]">
            <Plus size={14} className="stroke-[2.5]" /> Soạn thông báo mới
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl bg-white rounded-xl p-6 border border-slate-200 shadow-2xl overflow-hidden font-sans">
        <div className="space-y-1 border-b border-slate-100 pb-4 select-none">
          <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-md">
              <Megaphone size={14} className="text-slate-600 stroke-2" />
            </div>
            Soạn văn bản thông điệp phát thanh
          </DialogTitle>
          <DialogDescription className="text-[11px] text-slate-400 font-medium">
            Bản tin hệ thống sẽ được gửi thông báo đẩy (Push Notification) tức
            thời đến ứng dụng di động của cư dân.
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 pt-3 text-xs"
        >
          {/* 1. Tiêu đề */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wide">
              Tiêu đề bản tin thông báo *
            </label>
            <div className="relative flex items-center">
              <Input
                {...register("title")}
                placeholder="Ví dụ: Lịch cắt nước sửa chữa trục ống chính..."
                className={`h-9 pl-9 rounded-lg border-slate-200 bg-slate-50/30 text-xs font-semibold text-slate-800 focus-visible:bg-white focus-visible:border-slate-400 focus-visible:ring-0 shadow-none transition-all placeholder:font-normal placeholder:text-slate-400 ${
                  errors.title
                    ? "border-red-500 focus-visible:border-red-500"
                    : ""
                }`}
              />
              <FileText size={14} className="absolute left-3 text-slate-400" />
            </div>
            {errors.title && (
              <p className="text-red-500 text-[10px] font-medium italic mt-0.5">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2. Danh mục */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wide">
                Danh mục nội dung
              </label>
              <Select
                value={watch("type")}
                onValueChange={(val) =>
                  setValue("type", val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="h-9 border-slate-200 bg-slate-50/30 rounded-lg text-xs font-semibold px-3 text-slate-700 focus:ring-0 focus:border-slate-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-slate-200 p-1 bg-white shadow-md">
                  <SelectItem
                    value="finance"
                    className="text-xs cursor-pointer rounded-md"
                  >
                    Tài chính / Công nợ hóa đơn
                  </SelectItem>
                  <SelectItem
                    value="maintenance"
                    className="text-xs cursor-pointer rounded-md"
                  >
                    Kỹ thuật / Bảo trì hạ tầng
                  </SelectItem>
                  <SelectItem
                    value="life"
                    className="text-xs cursor-pointer rounded-md"
                  >
                    Đời sống / Nội quy tòa nhà
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Phạm vi */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wide">
                Phạm vi tiếp nhận
              </label>
              <Select
                value={targetType}
                onValueChange={(val) => {
                  setValue("targetType", val, { shouldValidate: true });
                  setTargetError("");
                  setSelectedRooms([]);
                  setSelectedFloors([]);
                }}
              >
                <SelectTrigger className="h-9 border-slate-200 bg-slate-50/30 rounded-lg text-xs font-semibold px-3 text-slate-700 focus:ring-0 focus:border-slate-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-slate-200 p-1 bg-white shadow-md">
                  <SelectItem
                    value="all"
                    className="text-xs cursor-pointer rounded-md"
                  >
                    Gửi toàn bộ tòa nhà
                  </SelectItem>
                  <SelectItem
                    value="room"
                    className="text-xs cursor-pointer rounded-md"
                  >
                    Gửi đích danh phòng
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4. Room targeting block */}
          {targetType === "room" && (
            <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
              {/* Mode toggle: Phòng vs Tầng */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">
                  Chọn theo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      key: "room" as const,
                      label: "Theo phòng",
                      icon: <DoorOpen size={12} />,
                    },
                    {
                      key: "floor" as const,
                      label: "Theo tầng",
                      icon: <Layers size={12} />,
                    },
                  ].map((mode) => {
                    const active = roomTargetMode === mode.key;
                    return (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => {
                          setRoomTargetMode(mode.key);
                          setSelectedRooms([]);
                          setSelectedFloors([]);
                          setTargetError("");
                        }}
                        className={`h-9 text-[11px] font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer
                          ${
                            active
                              ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                              : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                          }`}
                      >
                        {mode.icon}
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multi-select */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">
                  {roomTargetMode === "room" ? "Chọn phòng *" : "Chọn tầng *"}
                </label>
                {roomTargetMode === "room" ? (
                  <MultiSelectDropdown
                    options={MOCK_ROOMS}
                    selected={selectedRooms}
                    onChange={(ids) => {
                      setSelectedRooms(ids);
                      setTargetError("");
                    }}
                    placeholder="Bấm để chọn các phòng..."
                    icon={<Home size={14} />}
                    hasError={!!targetError}
                  />
                ) : (
                  <MultiSelectDropdown
                    options={MOCK_FLOORS}
                    selected={selectedFloors}
                    onChange={(ids) => {
                      setSelectedFloors(ids);
                      setTargetError("");
                    }}
                    placeholder="Bấm để chọn các tầng..."
                    icon={<Layers size={14} />}
                    hasError={!!targetError}
                  />
                )}
                {targetError && (
                  <p className="text-red-500 text-[10px] font-medium italic mt-0.5">
                    {targetError}
                  </p>
                )}

                {/* Preview summary */}
                {roomTargetMode === "floor" && selectedFloors.length > 0 && (
                  <p className="text-[10px] text-slate-400 font-medium">
                    → Tương ứng{" "}
                    <span className="text-slate-700 font-bold">
                      {
                        MOCK_ROOMS.filter((r) =>
                          selectedFloors.includes(r.floor),
                        ).length
                      }
                    </span>{" "}
                    phòng sẽ được nhận thông báo
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 5. Mức độ khẩn cấp */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wide select-none">
              Mức độ khẩn cấp & Độ ưu tiên
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  key: "low" as const,
                  label: "Thông thường",
                  class:
                    "hover:border-slate-300 border-slate-200 text-slate-700",
                  activeClass:
                    "border-slate-400 bg-slate-50 ring-1 ring-slate-400 text-slate-900",
                },
                {
                  key: "medium" as const,
                  label: "Quan trọng",
                  class:
                    "hover:border-amber-300 border-slate-200 text-slate-700",
                  activeClass:
                    "border-amber-400 bg-amber-50/20 ring-1 ring-amber-400 text-amber-800",
                },
                {
                  key: "high" as const,
                  label: "Hỏa tốc khẩn",
                  class:
                    "hover:border-rose-300 border-slate-200 text-slate-700",
                  activeClass:
                    "border-rose-400 bg-rose-50/20 ring-1 ring-rose-400 text-rose-800",
                },
              ].map((priority) => {
                const isActive = currentPriority === priority.key;
                return (
                  <button
                    key={priority.key}
                    type="button"
                    onClick={() =>
                      setValue("priority", priority.key, {
                        shouldValidate: true,
                      })
                    }
                    className={`cursor-pointer h-9 text-[11px] font-bold rounded-lg border flex items-center justify-center transition-all select-none ${
                      isActive ? priority.activeClass : priority.class
                    }`}
                  >
                    {priority.label}
                  </button>
                );
              })}
            </div>
            {errors.priority && (
              <p className="text-red-500 text-[10px] font-medium italic mt-0.5">
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* 6. Nội dung */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wide">
              Chi tiết nội dung phát thông báo *
            </label>
            <Textarea
              {...register("content")}
              placeholder="Nhập nội dung văn bản chi tiết gửi tới cư dân, ghi rõ mốc thời gian và hướng dẫn vận hành nếu có..."
              rows={4}
              className={`w-full p-3 h-36 rounded-lg border border-slate-200 bg-slate-50/30 text-xs font-medium text-slate-800 leading-relaxed placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-0 transition-all resize-none ${
                errors.content ? "border-red-500" : ""
              }`}
            />
            {errors.content && (
              <p className="text-red-500 text-[10px] font-medium italic mt-0.5">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* 7. Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 select-none">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer h-9 px-4 text-xs font-semibold text-slate-400 hover:text-slate-700 rounded-lg"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 uppercase tracking-wider text-[10px] transition-all active:scale-[0.98]"
            >
              <Send size={12} />{" "}
              {isSubmitting ? "Đang phát..." : "Phát thanh ngay"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
