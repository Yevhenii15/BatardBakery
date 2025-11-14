import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const BookingCreateInput = z.object({
  customer: z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    phone: z.string().min(8),
    email: z.string().email(),
  }),
  pickup: z.object({
    categoryId: z.string().regex(objectIdRegex, "Invalid categoryId"),
    date: z.string().regex(dateRegex, "Invalid date format (YYYY-MM-DD)"),
    timeSlot: z.string(),
    orderNotes: z.string().optional().default(""),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().regex(objectIdRegex, "Invalid productId"),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export const BookingUpdateInput = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  archived: z.boolean().optional(),
});
