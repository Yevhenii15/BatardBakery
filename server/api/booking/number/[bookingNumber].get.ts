/**
 * @openapi
 * /api/booking/number/{bookingNumber}:
 *   get:
 *     summary: Get booking by booking number
 *     tags: [Booking]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: bookingNumber
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
import Booking from "../../../models/Booking";
import { requireAdmin } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const { bookingNumber } = event.context.params!;
  const booking = await Booking.findOne({ bookingNumber }, { __v: 0 }).lean();

  if (!booking) {
    setResponseStatus(event, 404);
    return { message: "Booking not found" };
  }

  return booking;
});
