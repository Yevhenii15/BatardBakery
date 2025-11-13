/**
 * @openapi
 * /api/hero:
 *   put:
 *     summary: Create or update the single Hero Section
 *     tags: [Hero]
 *     security: [{ bearerAuth: [] }]
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
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */

import Hero from "../../models/HeroSection";
import { HeroSectionInput } from "../../validation/HeroSection";
import { requireAdmin } from "../../utils/auth"; // ← add this

export default defineEventHandler(async (event) => {
  // ensure admin is logged in (reads HttpOnly cookie or Bearer token)
  requireAdmin(event);

  const body = await readBody(event);
  const input = HeroSectionInput.parse(body);

  const hero = await Hero.findOneAndUpdate({}, input, {
    new: true,
    upsert: true,
  }).lean();

  return hero;
});
