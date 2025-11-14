import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const ProductInput = z.object({
  name: z.string().min(4).max(40),
  description: z.string().optional().default(""),
  photo: z.string().optional().default(""),
  price: z.number().nonnegative(),
  categoryId: z.string().regex(objectIdRegex, "Invalid categoryId"),

  stock: z.number().int().nonnegative().optional().default(0),
  dailyCapacity: z.number().int().nonnegative().optional().default(0),
  active: z.boolean().optional().default(true),
});

export type ProductInputT = z.infer<typeof ProductInput>;
