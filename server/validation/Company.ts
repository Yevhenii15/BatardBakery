import { z } from "zod";

export const CompanyInput = z.object({
  shortDescription: z.string().min(5),
  description: z.string().min(10),
});

export type CompanyInputT = z.infer<typeof CompanyInput>;
