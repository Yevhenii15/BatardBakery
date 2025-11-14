import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const TimeRangeSchema = z
  .object({
    from: z.string().regex(timeRegex),
    to: z.string().regex(timeRegex),
  })
  .refine((data) => data.from < data.to, {
    message: "'from' must be earlier than 'to'",
  });

export const CategoryInput = z.object({
  categoryName: z.string().min(4),
  weekdayTime: TimeRangeSchema,
  weekendsTime: TimeRangeSchema,
  slotSizeMinutes: z.number().int().positive(),
  leadTimeMinutes: z.number().int().nonnegative(),
});

export type CategoryInputT = z.infer<typeof CategoryInput>;
