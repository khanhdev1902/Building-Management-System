import { z } from "zod";

export const loginSchema = z
  .object({
    loginMethod: z.enum(["email", "phone"]),
    // email: z.string().email("Email không hợp lệ").optional(),
    email: z.string().optional(),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
      .optional(),
    password: z.string().min(6, "Mật khẩu quá ngắn"),
    remember: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.loginMethod === "email" && !!data.email) ||
      (data.loginMethod === "phone" && !!data.phone),
    {
      message: "Vui lòng nhập email hoặc số điện thoại theo tab đang chọn",
      path: ["email"], // hoặc ["phone"] tuỳ bạn muốn highlight
    },
  );

export type LoginFormValues = z.infer<typeof loginSchema>;
