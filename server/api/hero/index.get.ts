/**
 * @openapi
 * /api/hero:
 *   get:
 *     summary: List hero sections
 *     tags: [Hero]
 *     responses:
 *       200:
 *         description: Array of hero sections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/HeroSection' }
 */

import Hero from "../../models/HeroSection";

export default defineEventHandler(async () => {
  return await Hero.find().lean();
});
