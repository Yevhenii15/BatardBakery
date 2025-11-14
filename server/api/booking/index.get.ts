/**
 * @openapi
 * /api/booking:
 *   get:
 *     summary: List all bookings (admin)
 *     tags: [Booking]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
import Booking from "../../models/Booking";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const bookings = await Booking.find({}, { __v: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return bookings;
});
