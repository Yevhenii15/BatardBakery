/**
 * @openapi
 * /api/contact/{id}:
 *   get:
 *     summary: Get single contact message (admin)
 *     tags: [Contact]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Single contact message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       404:
 *         description: Contact message not found
 */

import Contact from "../../models/Contact";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const { id } = event.context.params!;

  const msg = await Contact.findById(id).lean();

  if (!msg) {
    setResponseStatus(event, 404);
    return { message: "Contact message not found" };
  }

  return msg;
});
