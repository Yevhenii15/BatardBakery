/**
 * @openapi
 * /api/product/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Product]
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
import Product from "../../models/Product";
import Category from "../../models/Category";
import { ProductInput } from "../../validation/Product";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const { id } = event.context.params!;
  const body = await readBody(event);
  const input = ProductInput.parse(body);

  const categoryExists = await Category.exists({ _id: input.categoryId });
  if (!categoryExists) {
    setResponseStatus(event, 400);
    return { message: "Category does not exist" };
  }

  const product = await Product.findByIdAndUpdate(id, input, {
    new: true,
  }).lean();

  if (!product) {
    setResponseStatus(event, 404);
    return { message: "Product not found" };
  }

  return product;
});
