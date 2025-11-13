import { z } from "zod";

export const HeroSectionInput = z.object({
  title: z.string().min(5),
  subTitle: z.string().min(5).optional().default(""),
  heroImg1: z.string().optional().default(""),
  heroImg2: z.string().optional().default(""),
});

export type HeroSectionInputT = z.infer<typeof HeroSectionInput>;
