/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Send,
  User,
  CheckCircle2,
  Paperclip,
  MoreVertical,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Trash2,
  Pin,
  Smile,
  Plus,
  Users,
  Hash,
  Phone,
  X,
  ChevronRight,
  Circle,
  Lock,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { toast } from "sonner";
import { INITIAL_MESSAGES } from "./data";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomCategory = "support" | "channel" | "group";
type TabFilter = "all" | "support" | "group" | "channel";

interface Room {
  id: string;
  roomName: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  category: RoomCategory;
  residentName: string;
  status: string;
  members?: string[];
  phone?: string;
  floor?: string;
}

// ─── Mock search data ─────────────────────────────────────────────────────────

const RESIDENT_DIRECTORY = [
  {
    id: "r1",
    name: "Trần Thế Anh",
    room: "P.202",
    phone: "0912 345 678",
    floor: "Tầng 2",
  },
  {
    id: "r2",
    name: "Nguyễn Văn Anh",
    room: "P.104",
    phone: "0987 654 321",
    floor: "Tầng 1",
  },
  {
    id: "r3",
    name: "Lê Thị Mai",
    room: "P.305",
    phone: "0908 111 222",
    floor: "Tầng 3",
  },
  {
    id: "r4",
    name: "Phạm Đức Huy",
    room: "P.401",
    phone: "0933 999 888",
    floor: "Tầng 4",
  },
  {
    id: "r5",
    name: "Hoàng Minh Tú",
    room: "P.503",
    phone: "0977 222 333",
    floor: "Tầng 5",
  },
  {
    id: "r6",
    name: "Vũ Thị Lan",
    room: "P.601",
    phone: "0944 777 555",
    floor: "Tầng 6",
  },
  {
    id: "r7",
    name: "Đặng Văn Khoa",
    room: "P.702",
    phone: "0965 444 123",
    floor: "Tầng 7",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoomAvatar({
  category,
  roomName,
}: {
  category: RoomCategory;
  roomName: string;
}) {
  if (category === "channel") {
    return (
      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
        <Hash className="w-4.5 h-4.5 text-indigo-600 stroke-[2.5]" />
      </div>
    );
  }
  if (category === "group") {
    return (
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
        <Users className="w-4.5 h-4.5 text-amber-600 stroke-[2.5]" />
      </div>
    );
  }
  // support — show room initials
  const initials = roomName.replace("P.", "").trim();
  return (
    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
      <span className="text-xs font-black text-slate-600 font-mono">
        {initials}
      </span>
    </div>
  );
}

function OnlineDot({ category }: { category: RoomCategory }) {
  const color =
    category === "channel"
      ? "bg-indigo-500"
      : category === "group"
        ? "bg-amber-500"
        : "bg-emerald-500";
  return <span className={`w-2 h-2 rounded-full ${color} shrink-0`} />;
}

// ─── New Chat Modal ───────────────────────────────────────────────────────────

interface NewChatModalProps {
  open: boolean;
  onClose: () => void;
  onCreateChat: (room: Room) => void;
}

function NewChatModal({ open, onClose, onCreateChat }: NewChatModalProps) {
  const [mode, setMode] = useState<"private" | "group" | null>(null);
  const [query, setQuery] = useState("");
  const [selectedResidents, setSelectedResidents] = useState<
    typeof RESIDENT_DIRECTORY
  >([]);
  const [groupName, setGroupName] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return RESIDENT_DIRECTORY;
    const q = query.toLowerCase();
    return RESIDENT_DIRECTORY.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.room.toLowerCase().includes(q) ||
        r.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
        r.floor.toLowerCase().includes(q),
    );
  }, [query]);

  const toggleResident = (r: (typeof RESIDENT_DIRECTORY)[0]) => {
    if (mode === "private") {
      setSelectedResidents([r]);
    } else {
      setSelectedResidents((prev) =>
        prev.find((x) => x.id === r.id)
          ? prev.filter((x) => x.id !== r.id)
          : [...prev, r],
      );
    }
  };

  const handleCreate = () => {
    if (mode === "private" && selectedResidents.length === 1) {
      const r = selectedResidents[0];
      onCreateChat({
        id: `CHAT-${r.room.replace("P.", "")}`,
        roomName: r.room,
        lastMessage: "Bắt đầu hội thoại mới",
        time: "Vừa xong",
        unreadCount: 0,
        category: "support",
        residentName: r.name,
        status: "pending",
        phone: r.phone,
        floor: r.floor,
      });
    } else if (mode === "group" && selectedResidents.length >= 2) {
      const name =
        groupName.trim() ||
        `Nhóm ${selectedResidents.map((r) => r.room).join(", ")}`;
      onCreateChat({
        id: `GROUP-${Date.now()}`,
        roomName: name,
        lastMessage: "Nhóm được tạo bởi ban quản lý",
        time: "Vừa xong",
        unreadCount: 0,
        category: "group",
        residentName: `${selectedResidents.length} thành viên`,
        status: "active",
        members: selectedResidents.map((r) => r.name),
      });
    }
    onClose();
    setMode(null);
    setQuery("");
    setSelectedResidents([]);
    setGroupName("");
  };

  const canCreate =
    (mode === "private" && selectedResidents.length === 1) ||
    (mode === "group" && selectedResidents.length >= 2);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          onClose();
          setMode(null);
          setQuery("");
          setSelectedResidents([]);
          setGroupName("");
        }
      }}
    >
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 border border-slate-200 shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <MessageSquare size={14} className="text-slate-600" />
            </div>
            Cuộc trò chuyện mới
          </DialogTitle>
          <DialogDescription className="text-[11px] text-slate-400 font-medium mt-0.5">
            Tìm cư dân theo tên, số phòng, số điện thoại hoặc tầng
          </DialogDescription>
        </div>

        {/* Mode picker */}
        {!mode && (
          <div className="p-4 space-y-2">
            <button
              onClick={() => setMode("private")}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Lock
                  size={15}
                  className="text-slate-500 group-hover:text-blue-600"
                />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-bold text-slate-800">
                  Nhắn tin riêng
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  1-1 với 1 cư dân cụ thể
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:text-blue-400"
              />
            </button>
            <button
              onClick={() => setMode("group")}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                <Users
                  size={15}
                  className="text-slate-500 group-hover:text-amber-600"
                />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-bold text-slate-800">
                  Tạo nhóm chat
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Nhiều cư dân, 1 cuộc trò chuyện
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:text-amber-400"
              />
            </button>
          </div>
        )}

        {/* Search + select */}
        {mode && (
          <div className="flex flex-col">
            {/* Back + title */}
            <div className="px-4 pt-3 pb-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setMode(null);
                  setSelectedResidents([]);
                  setQuery("");
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={14} />
              </button>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                {mode === "private" ? "Chọn cư dân" : "Chọn thành viên nhóm"}
              </span>
              {mode === "group" && selectedResidents.length > 0 && (
                <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
                  {selectedResidents.length} đã chọn
                </span>
              )}
            </div>

            {/* Group name input */}
            {mode === "group" && (
              <div className="px-4 pb-2">
                <Input
                  placeholder="Tên nhóm (tuỳ chọn)..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="h-8 text-xs rounded-lg border-slate-200 bg-slate-50 focus-visible:ring-0 focus-visible:border-amber-400"
                />
              </div>
            )}

            {/* Selected chips */}
            {mode === "group" && selectedResidents.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {selectedResidents.map((r) => (
                  <span
                    key={r.id}
                    onClick={() => toggleResident(r)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    {r.room} · {r.name.split(" ").pop()}
                    <X size={9} />
                  </span>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="px-4 pb-2">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  autoFocus
                  placeholder="Tìm theo tên, phòng, SĐT, tầng..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 h-9 text-xs rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-0 focus-visible:border-slate-400"
                />
              </div>
            </div>

            {/* Results */}
            <ScrollArea className="h-56">
              <div className="px-2 pb-2 space-y-0.5">
                {filtered.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <User size={24} className="mx-auto mb-2 text-slate-200" />
                    <p className="text-[11px] font-semibold">
                      Không tìm thấy cư dân
                    </p>
                  </div>
                )}
                {filtered.map((r) => {
                  const isSelected = selectedResidents.find(
                    (x) => x.id === r.id,
                  );
                  return (
                    <div
                      key={r.id}
                      onClick={() => toggleResident(r)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-slate-900 text-white"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs font-mono ${isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"}`}
                      >
                        {r.room.replace("P.", "")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-800"}`}
                        >
                          {r.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[10px] font-medium ${isSelected ? "text-white/60" : "text-slate-400"}`}
                          >
                            {r.floor}
                          </span>
                          <span
                            className={`text-[10px] font-mono ${isSelected ? "text-white/50" : "text-slate-300"}`}
                          >
                            ·
                          </span>
                          <Phone
                            size={9}
                            className={
                              isSelected ? "text-white/50" : "text-slate-300"
                            }
                          />
                          <span
                            className={`text-[10px] font-mono ${isSelected ? "text-white/60" : "text-slate-400"}`}
                          >
                            {r.phone}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-white shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClose();
                  setMode(null);
                  setSelectedResidents([]);
                  setQuery("");
                  setGroupName("");
                }}
                className="h-8 text-xs text-slate-400 hover:text-slate-600 rounded-lg"
              >
                Huỷ
              </Button>
              <Button
                size="sm"
                disabled={!canCreate}
                onClick={handleCreate}
                className="h-8 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 disabled:opacity-40"
              >
                {mode === "private"
                  ? "Bắt đầu chat"
                  : `Tạo nhóm (${selectedResidents.length})`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TAB_OPTIONS: { key: TabFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "support", label: "Riêng" },
  { key: "group", label: "Nhóm" },
  { key: "channel", label: "Kênh" },
];

export default function AdminChatDashboard() {
  const [rooms, setRooms] = useState<Room[]>();
  const [messages, setMessages] =
    useState<Record<string, any[]>>(INITIAL_MESSAGES);
  const [activeRoomId, setActiveRoomId] = useState("CHAT-P202");
  const [typedMessage, setTypedMessage] = useState("");
  const [tabFilter, setTabFilter] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoomId, messages]);

  const filteredRooms = useMemo(() => {
    return rooms?.filter((room) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        room.roomName.toLowerCase().includes(q) ||
        room.residentName.toLowerCase().includes(q) ||
        (room.phone ?? "").replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
        (room.floor ?? "").toLowerCase().includes(q);
      const matchesTab = tabFilter === "all" || room.category === tabFilter;
      return matchesSearch && matchesTab;
    });
  }, [rooms, searchQuery, tabFilter]);

  const activeRoom = rooms?.find((r) => r.id === activeRoomId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const currentTime = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "admin",
      text: typedMessage,
      time: currentTime,
      status: "sent",
    };

    setMessages((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMsg],
    }));

    setRooms((prev) =>
      prev?.map((room) =>
        room.id === activeRoomId
          ? {
              ...room,
              lastMessage: typedMessage,
              time: currentTime,
              unreadCount: 0,
            }
          : room,
      ),
    );

    setTypedMessage("");
    inputRef.current?.focus();
  };

  const toggleResolveStatus = (id: string) => {
    setRooms((prev) =>
      prev?.map((room) =>
        room.id === id
          ? {
              ...room,
              status: room.status === "resolved" ? "pending" : "resolved",
            }
          : room,
      ),
    );
    const room = rooms?.find((r) => r.id === id);
    if (room?.status === "resolved") {
      toast.info(`Đã mở lại luồng xử lý cho ${room.roomName}`);
    } else {
      toast.success(`✓ Đã đóng ticket ${room?.roomName}`);
    }
  };

  const handleCreateChat = (room: Room) => {
    setRooms((prev) => {
      const exists = prev?.find((r) => r.id === room.id);
      if (exists) {
        setActiveRoomId(room.id);
        return prev;
      }
      if (!prev) return;
      return [room, ...prev];
    });
    setMessages((prev) => ({ ...prev, [room.id]: [] }));
    setActiveRoomId(room.id);
    toast.success(`Đã tạo hội thoại: ${room.roomName}`);
  };

  const totalUnread = rooms?.reduce((acc, r) => acc + r.unreadCount, 0);

  return (
    <div className="flex h-screen w-full bg-slate-100 text-slate-900 font-sans antialiased overflow-hidden">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-72 lg:w-120 bg-white border-r border-slate-200/80 flex flex-col shrink-0">
        {/* Sidebar header */}
        <div className="px-4 pt-4 pb-3 space-y-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-[13px] font-extrabold text-slate-900 tracking-tight leading-none">
                  Danjin Chat
                </h1>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Ban quản lý
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {totalUnread && totalUnread > 0 && (
                <span className="text-[9px] font-black bg-red-500 text-white rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
              <Button
                size="icon"
                onClick={() => setNewChatOpen(true)}
                className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-slate-700 text-white shadow-sm cursor-pointer"
                title="Cuộc trò chuyện mới"
              >
                <Plus size={14} className="stroke-[2.5]" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Tìm phòng, tên, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8.5 bg-slate-50 border-slate-200 text-[11px] rounded-xl focus-visible:ring-0 focus-visible:border-slate-400 transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-4 gap-0.5 bg-slate-100 p-0.5 rounded-xl">
            {TAB_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTabFilter(key)}
                className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  tabFilter === key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Room list */}
        <ScrollArea className="flex-1">
          {filteredRooms?.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Circle size={28} className="mx-auto mb-2 text-slate-200" />
              <p className="text-[11px] font-semibold">Không có hội thoại</p>
            </div>
          ) : (
            <div className="py-1">
              {filteredRooms?.map((room) => {
                const isActive = activeRoomId === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      setActiveRoomId(room.id);
                      setRooms((prev) =>
                        prev?.map((r) =>
                          r.id === room.id ? { ...r, unreadCount: 0 } : r,
                        ),
                      );
                    }}
                    className={`mx-2 my-0.5 px-3 py-2.5 flex items-start gap-2.5 rounded-xl cursor-pointer transition-all ${
                      isActive ? "bg-slate-900 shadow-sm" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <RoomAvatar
                        category={room.category}
                        roomName={room.roomName}
                      />
                      {isActive && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[12px] font-bold truncate ${isActive ? "text-white" : "text-slate-800"}`}
                        >
                          {room.roomName}
                        </span>
                        <span
                          className={`text-[9px] font-mono shrink-0 ${isActive ? "text-slate-400" : "text-slate-400"}`}
                        >
                          {room.time}
                        </span>
                      </div>
                      <div
                        className={`text-[10px] font-medium truncate mt-0.5 ${isActive ? "text-slate-400" : "text-slate-400"}`}
                      >
                        {room.residentName}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p
                          className={`text-[11px] truncate flex-1 ${
                            room.unreadCount > 0
                              ? "text-slate-900 font-bold"
                              : isActive
                                ? "text-slate-500 font-medium"
                                : "text-slate-400 font-medium"
                          }`}
                        >
                          {room.lastMessage}
                        </p>
                        {room.unreadCount > 0 && (
                          <span className="ml-1.5 shrink-0 bg-blue-600 text-white rounded-full text-[9px] font-black h-4 min-w-4 px-1 flex items-center justify-center">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* ── CHAT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {activeRoom ? (
          <>
            {/* Chat topbar */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <RoomAvatar
                  category={activeRoom.category}
                  roomName={activeRoom.roomName}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[13px] font-extrabold text-slate-900 tracking-tight">
                      {activeRoom.roomName}
                    </h2>
                    {activeRoom.status === "resolved" && (
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] px-1.5 h-4 rounded">
                        Đã xử lý
                      </Badge>
                    )}
                    {activeRoom.category === "group" && (
                      <Badge className="bg-amber-50 text-amber-600 border-none font-bold text-[9px] px-1.5 h-4 rounded">
                        Nhóm
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                    <OnlineDot category={activeRoom.category} />
                    {activeRoom.category === "group"
                      ? `${activeRoom.residentName} · ${activeRoom.members?.join(", ")}`
                      : activeRoom.category === "channel"
                        ? "Kênh phát thanh toàn tòa"
                        : `${activeRoom.residentName}${activeRoom.phone ? ` · ${activeRoom.phone}` : ""}${activeRoom.floor ? ` · ${activeRoom.floor}` : ""}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {activeRoom.category === "support" && (
                  <Button
                    variant="outline"
                    onClick={() => toggleResolveStatus(activeRoom.id)}
                    className={`h-8 text-[11px] font-bold rounded-lg px-3 gap-1.5 transition-colors cursor-pointer ${
                      activeRoom.status === "resolved"
                        ? "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                        : "border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {activeRoom.status === "resolved"
                      ? "Mở lại ticket"
                      : "Đóng ticket"}
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-44 rounded-xl border-slate-200 text-xs"
                  >
                    <DropdownMenuItem className="py-2 cursor-pointer gap-2 font-medium">
                      <Pin className="w-3.5 h-3.5 text-slate-400" /> Ghim hội
                      thoại
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 gap-2 font-semibold">
                      <Trash2 className="w-3.5 h-3.5" /> Xóa lịch sử
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 bg-slate-50/50">
              <div className="px-5 py-4 space-y-3 max-w-3xl mx-auto">
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 bg-white border border-slate-200/60 px-2.5 py-1 rounded-full shadow-xs">
                    🔒 Lịch sử mã hoá · Danjin BMS
                  </span>
                </div>

                {(messages[activeRoomId] || []).map((msg: any) => {
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      {!isAdmin && (
                        <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                          <User size={12} className="text-slate-500" />
                        </div>
                      )}
                      <div
                        className={`max-w-[72%] space-y-1 ${isAdmin ? "items-end" : "items-start"} flex flex-col`}
                      >
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-relaxed shadow-xs ${
                            isAdmin
                              ? "bg-slate-900 text-white rounded-br-sm"
                              : "bg-white border border-slate-200/80 text-slate-800 rounded-bl-sm"
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-1 ${isAdmin ? "flex-row-reverse" : ""}`}
                        >
                          <span className="text-[9px] text-slate-400 font-mono">
                            {msg.time}
                          </span>
                          {isAdmin &&
                            (msg.status === "read" ? (
                              <CheckCheck className="w-3 h-3 text-blue-400" />
                            ) : (
                              <Check className="w-3 h-3 text-slate-400" />
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input bar */}
            <div className="px-5 py-3 bg-white border-t border-slate-100">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    placeholder={
                      activeRoom.category === "channel"
                        ? "Soạn thông báo kênh phát thanh..."
                        : activeRoom.category === "group"
                          ? `Nhắn vào ${activeRoom.roomName}...`
                          : `Nhắn tin ${activeRoom.residentName}...`
                    }
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    className="h-10 pr-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-medium focus-visible:ring-0 focus-visible:border-slate-400 focus-visible:bg-white transition-all"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 rounded-lg absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!typedMessage.trim()}
                  className="h-10 w-10 p-0 bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xl shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  <Send className="w-4 h-4 stroke-[2.2]" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30 gap-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <MessageSquare size={24} className="text-slate-200" />
            </div>
            <p className="text-xs font-bold text-slate-400">
              Chọn một hội thoại để bắt đầu
            </p>
            <Button
              size="sm"
              onClick={() => setNewChatOpen(true)}
              className="h-8 text-xs font-bold bg-slate-900 text-white rounded-xl px-4 gap-1.5 cursor-pointer"
            >
              <Plus size={12} /> Cuộc trò chuyện mới
            </Button>
          </div>
        )}
      </div>

      {/* New chat modal */}
      <NewChatModal
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
}
