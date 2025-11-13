/**
 * @openapi
 * /api/company:
 *   put:
 *     summary: Create or update company information
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Updated or created company info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       401: { description: Unauthorized }
 */

import Company from "../../models/Company";
import { CompanyInput } from "../../validation/Company";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const body = await readBody(event);
  const input = CompanyInput.parse(body);

  const company = await Company.findOneAndUpdate({}, input, {
    new: true,
    upsert: true,
  }).lean();

  return company;
});
