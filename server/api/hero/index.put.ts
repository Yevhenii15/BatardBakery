/**
 * @openapi
 * /api/hero:
 *   put:
 *     summary: Create or update the single Hero Section
 *     tags: [Hero]
 *     description: This endpoint upserts the only hero section in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HeroSection'
 *     responses:
 *       200:
 *         description: Updated or created hero section
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HeroSection'
 */

import Hero from "../../models/HeroSection";
import { HeroSectionInput } from "../../validation/HeroSection";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const input = HeroSectionInput.parse(body);

  // Find the existing one or create new (upsert)
  const hero = await Hero.findOneAndUpdate({}, input, {
    new: true,
    upsert: true, // create if not found
  }).lean();

  return hero;
});
