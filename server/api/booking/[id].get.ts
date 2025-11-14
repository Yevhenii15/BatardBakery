/**
 * @openapi
 * /api/booking/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Booking]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 */
import Booking from "../../models/Booking";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const { id } = event.context.params!;
  const booking = await Booking.findById(id, { __v: 0 }).lean();
  if (!booking) {
    setResponseStatus(event, 404);
    return { message: "Booking not found" };
  }
  return booking;
});
