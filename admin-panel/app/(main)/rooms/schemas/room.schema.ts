import * as z from "zod";

export const roomSchema = z.object({
  roomNumber: z
    .string()
    .trim()
    .min(1, "Số phòng không được để trống")
    .max(20, "Số phòng quá dài"),

  floor: z
    .number()
    .int("Tầng phải là số nguyên")
    .min(1, "Tầng tối thiểu là 1")
    .max(100, "Tầng không hợp lệ"),

  roomPrice: z
    .number({
      message: "Giá phòng phải là số",
    })
    .finite("Giá phòng không hợp lệ")
    .min(100000, "Giá phòng tối thiểu 100.000đ"),

  acreage: z
    .number({
      message: "Diện tích phải là số",
    })
    .finite("Diện tích không hợp lệ")
    .min(5, "Diện tích tối thiểu 5m²")
    .max(1000, "Diện tích quá lớn"),

  maxOccupants: z
    .number()
    .int()
    .min(1, "Ít nhất 1 người")
    .max(20, "Tối đa 20 người"),
  type: z
    .string()
    .trim()
    .min(1, "Loại phòng không được để trống")
    .max(50, "Loại phòng quá dài"),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]),
  description: z.string().max(500, "Mô tả quá dài").optional(),
  amenities: z.array(z.string()),
  otherServices: z.array(z.string()),
  services: z.record(z.string(), z.number()),
});
