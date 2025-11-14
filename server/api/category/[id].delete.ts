/**
 * @openapi
 * /api/category/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Category]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       401: { description: Unauthorized }
 *       404: { description: Not found }
 */

import Category from "../../models/Category";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const { id } = event.context.params!;
  const res = await Category.findByIdAndDelete(id);
  if (!res) {
    setResponseStatus(event, 404);
    return { message: "Category not found" };
  }
  return { ok: true };
});
