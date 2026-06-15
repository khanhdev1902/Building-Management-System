import * as z from "zod";

export const ticketFormSchema = z.object({
  assignee: z.string().optional(),
  appointmentTime: z.string().optional(),
  billPayer: z.enum(["landlord", "resident"]),
  adminNotes: z.string().optional(),
  materials: z.array(
    z.object({
      name: z.string().min(1, { message: "Tên vật tư không được để trống" }),
      price: z.number().min(0, { message: "Giá không được âm" }),
    }),
  ),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
