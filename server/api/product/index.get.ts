/**
 * @openapi
 * /api/product:
 *   get:
 *     summary: List all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found
 */
import Product from "../../models/Product";

export default defineEventHandler(async (event) => {
  const products = await Product.find({}, { __v: 0 }).lean();

  if (!products || products.length === 0) {
    setResponseStatus(event, 404);
    return { message: "No products found" };
  }

  setHeader(event, "Cache-Control", "public, max-age=30");
  return products;
});
