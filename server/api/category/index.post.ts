/**
 * @openapi
 * /api/category:
 *   post:
 *     summary: Create a category
 *     tags: [Category]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401: { description: Unauthorized }
 */

import Category from "../../models/Category";
import { CategoryInput } from "../../validation/Category";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const body = await readBody(event);
  const input = CategoryInput.parse(body);

  const created = await Category.create(input);
  setResponseStatus(event, 201);
  return created.toObject();
});
