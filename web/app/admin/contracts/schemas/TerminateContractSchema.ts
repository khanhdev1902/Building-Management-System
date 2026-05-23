import * as z from "zod";

export const TerminateContractSchema = z.object({
  returnDate: z.string().min(1, "Vui lòng chọn ngày bàn giao thực tế"),
  terminationReason: z
    .string()
    .min(5, "Vui lòng nhập lý do cụ thể (tối thiểu 5 ký tự)"),
  depositHandling: z.enum(["REFUND_ALL", "FORFEIT_ALL", "PARTIAL_REFUND"]),
  refundAmount: z.number().min(0, "Số tiền không được âm"),
  notes: z.string().optional(),
});
