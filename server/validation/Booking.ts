import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

export const BookingCreateInput = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
  }),

  pickups: z
    .array(
      z.object({
        categoryId: z.string().regex(objectIdRegex, "Invalid categoryId"),
        date: z.string().regex(dateRegex, "Invalid date format (YYYY-MM-DD)"),
        timeSlot: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
        orderNotes: z.string().optional(),
      })
    )
    .min(1, "At least one pickup required"),

  items: z
    .array(
      z.object({
        productId: z.string().regex(objectIdRegex, "Invalid productId"),
        quantity: z.number().int().positive(),
        pickupIndex: z.number().int().min(0),
      })
    )
    .min(1, "At least one item required"),
});

export const BookingUpdateInput = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  archived: z.boolean().optional(),
});
