"use client";

import React from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

// Dữ liệu mẫu khách thuê
const TENANTS = [
  {
    id: "T-001",
    name: "Nguyễn Văn Anh",
    email: "anhnv@gmail.com",
    phone: "0987.654.321",
    room: "101",
    joinDate: "15/01/2026",
    status: "active",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "T-002",
    name: "Trần Thị Bảo",
    email: "baott@yahoo.com",
    phone: "0912.333.444",
    room: "102",
    joinDate: "10/02/2026",
    status: "active",
    avatar: "",
  },
  {
    id: "T-003",
    name: "Lê Minh Công",
    email: "congl@outlook.com",
    phone: "0345.111.222",
    room: "201",
    joinDate: "01/12/2025",
    status: "inactive",
    avatar: "",
  },
];

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý khách thuê
          </h1>
          <p className="text-muted-foreground">
            Danh sách thông tin liên lạc và tình trạng hợp đồng của cư dân.
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Thêm khách thuê
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm tên, số điện thoại, số phòng..."
            className="pl-9 bg-card"
          />
        </div>
        <Button variant="outline" className="hidden sm:flex">
          Bộ lọc nâng cao
        </Button>
      </div>

      {/* Tenants Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px]">Khách thuê</TableHead>
              <TableHead>Phòng</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Ngày vào ở</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TENANTS.map((tenant) => (
              <TableRow key={tenant.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={tenant.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {tenant.name.split(" ").pop()?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold">{tenant.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {tenant.id}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono bg-slate-50">
                    P.{tenant.room}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center text-muted-foreground hover:text-primary cursor-pointer">
                      <Phone className="mr-2 h-3 w-3" /> {tenant.phone}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="mr-2 h-3 w-3" /> {tenant.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-3 w-3" /> {tenant.joinDate}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      tenant.status === "active" ? "default" : "secondary"
                    }
                    className={
                      tenant.status === "active"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    {tenant.status === "active" ? "Đang ở" : "Đã rời đi"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600"
                      title="Nhắn Zalo"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" /> Xem chi tiết
                          hồ sơ
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" /> Lịch sử thanh
                          toán
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Kết thúc hợp đồng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
