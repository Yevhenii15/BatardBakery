import { z } from "zod";

export const ContactCreateInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const ContactUpdateInput = z.object({
  status: z.enum(["open", "in_progress", "closed"]).optional(),
  adminNote: z.string().optional(),
});
