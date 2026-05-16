export interface RoomData {
  id: string;
  roomNumber: string;
  floor: string;
  tenantName: string;
  phoneNumber: string;
  eOld: number; // Chỉ số điện cũ
  wOld: number; // Chỉ số nước cũ
  isLocked: boolean; // Trạng thái đã chốt số hay chưa
  lastUpdated?: string;
}

export const MOCK_ROOMS: RoomData[] = [
  {
    id: "1",
    roomNumber: "101",
    floor: "1",
    tenantName: "Nguyễn Văn Khanh",
    phoneNumber: "0912345678",
    eOld: 1250,
    wOld: 450,
    isLocked: true,
    lastUpdated: "2026-03-14 14:30",
  },
  {
    id: "2",
    roomNumber: "102",
    floor: "1",
    tenantName: "Trần Thị Lan Anh",
    phoneNumber: "0988776655",
    eOld: 2100,
    wOld: 800,
    isLocked: false,
  },
  {
    id: "3",
    roomNumber: "201",
    floor: "2",
    tenantName: "Lê Hoàng Nam",
    phoneNumber: "0344556677",
    eOld: 3400,
    wOld: 120,
    isLocked: false,
  },
  {
    id: "4",
    roomNumber: "202",
    floor: "2",
    tenantName: "Phạm Minh Tuấn",
    phoneNumber: "0901234567",
    eOld: 1580,
    wOld: 210,
    isLocked: true,
    lastUpdated: "2026-03-15 08:15",
  },
  {
    id: "5",
    roomNumber: "1001",
    floor: "10",
    tenantName: "Đặng Thu Thảo",
    phoneNumber: "0977123123",
    eOld: 560,
    wOld: 85,
    isLocked: false,
  },
  // Hàm này để tạo nhanh mớ data cho 100 tầng nếu chú muốn test thanh ScrollArea
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `gen-${i}`,
    roomNumber: `${Math.floor(i / 5) + 3}0${(i % 5) + 1}`,
    floor: (Math.floor(i / 5) + 3).toString(),
    tenantName: `Khách hàng mẫu ${i + 1}`,
    phoneNumber: "0123456xxx",
    eOld: Math.floor(Math.random() * 5000),
    wOld: Math.floor(Math.random() * 1000),
    isLocked: Math.random() > 0.5,
  })),
];

export const UNIT_PRICES = {
  electric: 3500, // 3.5k/số
  water: 15000, // 15k/khối
};
