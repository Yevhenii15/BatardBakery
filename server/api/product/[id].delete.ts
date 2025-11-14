/**
 * @openapi
 * /api/product/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Product]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
import Product from "../../models/Product";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const { id } = event.context.params!;
  const res = await Product.findByIdAndDelete(id);

  if (!res) {
    setResponseStatus(event, 404);
    return { message: "Product not found" };
  }

  return { ok: true };
});
