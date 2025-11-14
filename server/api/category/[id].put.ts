/**
 * @openapi
 * /api/category/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Category]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401: { description: Unauthorized }
 *       404: { description: Not found }
 */

import Category from "../../models/Category";
import { CategoryInput } from "../../validation/Category";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const { id } = event.context.params!;
  const body = await readBody(event);
  const input = CategoryInput.parse(body);

  const cat = await Category.findByIdAndUpdate(id, input, { new: true }).lean();
  if (!cat) {
    setResponseStatus(event, 404);
    return { message: "Category not found" };
  }
  return cat;
});
