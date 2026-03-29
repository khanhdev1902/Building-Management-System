"use client";

import React, { useState } from "react";
import { Plus, Search, User, CreditCard } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

// Dữ liệu mẫu (Sau này em sẽ fetch từ NestJS Backend)
const ROOM_DATA = [
  {
    id: "101",
    name: "Phòng 101",
    type: "Studio",
    status: "occupied",
    price: "4.500.000",
    floor: "Tầng 1",
    tenant: "Nguyễn Văn A",
  },
  {
    id: "102",
    name: "Phòng 102",
    type: "1PN",
    status: "available",
    price: "5.200.000",
    floor: "Tầng 1",
    tenant: null,
  },
  {
    id: "201",
    name: "Phòng 201",
    type: "Studio",
    status: "maintenance",
    price: "4.500.000",
    floor: "Tầng 2",
    tenant: null,
  },
  {
    id: "202",
    name: "Phòng 202",
    type: "Studio",
    status: "occupied",
    price: "4.500.000",
    floor: "Tầng 2",
    tenant: "Trần Thị B",
  },
];

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Danh sách phòng</h1>
          <p className="text-muted-foreground">
            Quản lý trạng thái và thông tin chi tiết các phòng trong tòa nhà.
          </p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Thêm phòng mới
        </Button>
      </div>

      {/* Filters Area */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo số phòng, tên khách..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Tất cả các tầng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả các tầng</SelectItem>
            <SelectItem value="1">Tầng 1</SelectItem>
            <SelectItem value="2">Tầng 2</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="available">Còn trống</SelectItem>
            <SelectItem value="occupied">Đã thuê</SelectItem>
            <SelectItem value="maintenance">Đang sửa chữa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ROOM_DATA.map((room) => (
          <Card
            key={room.id}
            className="overflow-hidden transition-all hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-bold">{room.name}</CardTitle>
                <Badge
                  variant={
                    room.status === "available"
                      ? "default"
                      : room.status === "occupied"
                        ? "secondary"
                        : "outline"
                  }
                  className={
                    room.status === "available"
                      ? "bg-green-500 hover:bg-green-600"
                      : room.status === "maintenance"
                        ? "bg-yellow-500 text-white"
                        : ""
                  }
                >
                  {room.status === "available"
                    ? "Trống"
                    : room.status === "occupied"
                      ? "Đã thuê"
                      : "Bảo trì"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {room.type} • {room.floor}
              </p>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {room.price}đ
                  </span>{" "}
                  / tháng
                </div>
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span>{room.tenant || "Chưa có khách"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 p-2 flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 text-xs">
                Chi tiết
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                Chỉnh sửa
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
