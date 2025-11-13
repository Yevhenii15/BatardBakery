/**
 * @openapi
 * /api/contact:
 *   get:
 *     summary: List contact messages (admin)
 *     tags: [Contact]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [open,closed] }
 *     responses:
 *       200:
 *         description: Paginated messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ContactMessage' }
 *                 total: { type: integer }
 */

import Contact from "../../models/Contact";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const q = getQuery(event);
  const page = Math.max(parseInt((q.page as string) || "1"), 1);
  const pageSize = Math.min(
    Math.max(parseInt((q.pageSize as string) || "20"), 1),
    100
  );
  const status = q.status as string | undefined;

  const filter = status ? { status } : {};
  const [items, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Contact.countDocuments(filter),
  ]);

  return { items, total };
});
