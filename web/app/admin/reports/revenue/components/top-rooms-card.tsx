// src/app/revenue/components/top-rooms-card.tsx
"use client";

import React from "react";

interface Top5RoomEntry {
  room: string;
  name: string;
  amount: number;
}

interface TopRoomsCardProps {
  rooms: Top5RoomEntry[];
  periodLabel: string;
}

export default function TopRoomsCard({
  rooms,
  periodLabel,
}: TopRoomsCardProps) {
  // Tìm giá trị lớn nhất làm mốc tính % độ dài thanh Progress
  const max = rooms[0]?.amount ?? 1;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 h-full">
      {/* TIÊU ĐỀ KHỐI */}
      <div className="mb-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Top 5 phòng — thực thu cao nhất
        </h3>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          Kỳ đối soát: {periodLabel}
        </p>
      </div>

      {/* HIỂN THỊ DỮ LIỆU ĐỘNG */}
      {rooms.length === 0 ? (
        <p className="text-xs text-slate-400 py-12 text-center italic">
          Không có dữ liệu nguồn trong kỳ này
        </p>
      ) : (
        <div className="space-y-3">
          {rooms.map((r, i) => (
            <div key={r.room} className="flex items-center gap-3">
              {/* Thứ hạng số */}
              <span className="text-[10px] font-bold text-slate-400 w-4 text-center font-mono">
                {i + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    P.{r.room}
                  </span>
                  <span className="text-xs font-black text-slate-900 font-mono">
                    {(r.amount / 1_000_000).toFixed(1)}M
                  </span>
                </div>

                {/* Thanh Progress Bar Luxury tối giản */}
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-950 rounded-full transition-all duration-500"
                    style={{ width: `${(r.amount / max) * 100}%` }}
                  />
                </div>

                {/* Tên cư dân đại diện */}
                <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5">
                  {r.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
