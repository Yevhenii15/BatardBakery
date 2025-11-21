/**
 * @openapi
 * /api/product/{id}:
 *   delete:
 *     summary: Delete product
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
 *       404:
 *         description: Not found
 */

import Product from "../../models/Product";
import { requireAdmin } from "../../utils/auth";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const { id } = event.context.params!;

  const prod = await Product.findById(id).lean();
  if (!prod) {
    setResponseStatus(event, 404);
    return { message: "Product not found" };
  }

  // Delete image file if exists
  if (prod.photo) {
    const clean = String(prod.photo).replace(/^\//, "");
    const imgPath = path.join(process.cwd(), "public", clean);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }

  await Product.findByIdAndDelete(id);

  return { ok: true };
});
