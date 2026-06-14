import { z } from "zod";

export const notificationSchema = z
  .object({
    // type: z.enum(["finance", "maintenance", "life"]),
    // targetType: z.enum(["all", "room"]),
    // priority: z.enum(["low", "medium", "high"]),
    title: z
      .string()
      .min(5, { message: "Tiêu đề bản tin phải chứa ít nhất 5 ký tự" })
      .max(100, { message: "Tiêu đề không được vượt quá 100 ký tự" }),
    type: z.string().min(1, { message: "Vui lòng chọn danh mục nội dung" }),
    targetType: z
      .string()
      .min(1, { message: "Vui lòng chọn phạm vi tiếp nhận" }),
    specificRoom: z.string().optional(),
    priority: z.string(),
    // enum(["low", "medium", "high"] as const, {
    //   required_error: "Vui lòng chọn mức độ khẩn cấp",
    // }),
    content: z
      .string()
      .min(10, { message: "Nội dung thông báo phải chứa ít nhất 10 ký tự" })
      .max(1000, { message: "Nội dung không được vượt quá 1000 ký tự" }),
  })
  .refine(
    (data) => {
      if (
        data.targetType === "room" &&
        (!data.specificRoom || data.specificRoom.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Vui lòng nhập mã số phòng tiếp nhận cụ thể",
      path: ["specificRoom"],
    },
  );

export type NotificationFormValues = z.infer<typeof notificationSchema>;
