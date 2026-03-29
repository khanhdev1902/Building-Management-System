import {
  Home,
  Users,
  FileText,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function DanjinDashboard() {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan Danjin</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Cập nhật lần cuối: 23:40 hôm nay
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số phòng</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">8 phòng trống (16%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách thuê</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112</div>
            <p className="text-xs text-green-500">+4 người mới tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu tháng
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245.5M</div>
            <p className="text-xs text-green-500">+12% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hóa đơn chưa thu
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-red-500">Cần nhắc nợ ngay</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Biểu đồ doanh thu hoặc Danh sách phòng (Placeholder) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu 6 tháng</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-75 flex items-end justify-around pb-4 pt-10 px-4">
              {/* Giả lập biểu đồ thanh bằng Tailwind */}
              {[40, 65, 45, 90, 75, 85].map((height, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-center gap-2 w-full max-w-10"
                >
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full bg-primary/80 rounded-t-sm hover:bg-primary transition-all cursor-pointer"
                  ></div>
                  <span className="text-[10px] text-muted-foreground">
                    Tháng {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danh sách hoạt động gần đây */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: "Phòng 201",
                  action: "Đã đóng tiền phòng tháng 3",
                  time: "2 phút trước",
                  icon: <DollarSign className="h-4 w-4 text-green-500" />,
                },
                {
                  user: "Phòng 405",
                  action: "Báo hỏng điều hòa",
                  time: "1 giờ trước",
                  icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
                },
                {
                  user: "Lê Văn A",
                  action: "Hết hạn hợp đồng (P102)",
                  time: "3 giờ trước",
                  icon: <FileText className="h-4 w-4 text-blue-500" />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b pb-3 last:border-0"
                >
                  <div className="rounded-full bg-slate-100 p-2">
                    {item.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.action}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
