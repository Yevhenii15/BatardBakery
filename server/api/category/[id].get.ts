/**
 * @openapi
 * /api/category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404: { description: Not found }
 */

import Category from "../../models/Category";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;
  const cat = await Category.findById(id).lean();
  if (!cat) {
    setResponseStatus(event, 404);
    return { message: "Category not found" };
  }
  return cat;
});
