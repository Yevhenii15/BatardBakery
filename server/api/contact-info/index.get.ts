/**
 * @openapi
 * /api/contact-info:
 *   get:
 *     summary: Get Contact Info
 *     tags: [ContactInfo]
 *     responses:
 *       200:
 *         description: Returns contact info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactInfo'
 *       404:
 *         description: Contact info not found
 */

import ContactInfo from "../../models/ContactInfo";

export default defineEventHandler(async (event) => {
  const info = await ContactInfo.findOne().lean();
  if (!info) {
    setResponseStatus(event, 404);
    return { message: "Contact info not found" };
  }
  setHeader(event, "Cache-Control", "public, max-age=30");
  return info;
});
