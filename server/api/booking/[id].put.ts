/**
 * @openapi
 * /api/booking/{id}:
 *   put:
 *     summary: Update booking (status/archive)
 *     tags: [Booking]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *               archived:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 */
import Booking from "../../models/Booking";
import { BookingUpdateInput } from "../../validation/Booking";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const { id } = event.context.params!;
  const body = await readBody(event);
  const input = BookingUpdateInput.parse(body);

  const booking = await Booking.findById(id);
  if (!booking) {
    setResponseStatus(event, 404);
    return { message: "Booking not found" };
  }

  if (input.status) {
    booking.status = input.status;

    // auto-archive when completed or cancelled
    if (
      (input.status === "completed" || input.status === "cancelled") &&
      !booking.archived
    ) {
      booking.archived = true;
      booking.set("archivedAt", new Date());
    }

    if (input.status === "pending" || input.status === "confirmed") {
      // if you ever "reopen" a booking
      booking.archived = false;
      booking.set("archivedAt", null); // <- use set()
    }
  }

  if (typeof input.archived === "boolean") {
    booking.archived = input.archived;
    booking.set("archivedAt", input.archived ? new Date() : null); // <- use set()
  }

  await booking.save();
  return booking.toObject();
});
