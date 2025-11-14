/**
 * @openapi
 * /api/booking/{id}:
 *   delete:
 *     summary: Delete booking
 *     tags: [Booking]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Booking not found
 */
import Booking from "../../models/Booking";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const { id } = event.context.params!;
  const res = await Booking.findByIdAndDelete(id);
  if (!res) {
    setResponseStatus(event, 404);
    return { message: "Booking not found" };
  }
  return { ok: true };
});
