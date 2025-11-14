/**
 * @openapi
 * /api/product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
import Product from "../../models/Product";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;
  const product = await Product.findById(id, { __v: 0 }).lean();

  if (!product) {
    setResponseStatus(event, 404);
    return { message: "Product not found" };
  }

  return product;
});
