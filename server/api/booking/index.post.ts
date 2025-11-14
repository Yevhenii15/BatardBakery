/**
 * @openapi
 * /api/booking:
 *   post:
 *     summary: Create a booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingCreateRequest'
 *     responses:
 *       201:
 *         description: Created booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid data (missing category or product)
 */
import Booking from "../../models/Booking";
import Category from "../../models/Category";
import Product from "../../models/Product";
import { BookingCreateInput } from "../../validation/Booking";
import { generateBookingNumber } from "../../utils/booking";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const input = BookingCreateInput.parse(body);

  // 1) Check category exists
  const category = await Category.findById(input.pickup.categoryId).lean();
  if (!category) {
    setResponseStatus(event, 400);
    return { message: "Category does not exist" };
  }

  // 2) Load products
  const productIds = input.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  if (products.length !== productIds.length) {
    setResponseStatus(event, 400);
    return { message: "One or more products do not exist" };
  }

  // 3) Build items array with snapshot of product data
  const items = input.items.map((i) => {
    const p = products.find((prod) => String(prod._id) === i.productId)!;
    const subtotal = p.price * i.quantity;
    return {
      productId: p._id,
      name: p.name,
      photo: p.photo ?? "",
      quantity: i.quantity,
      price: p.price,
      subtotalPrice: subtotal,
    };
  });

  const totalPrice = items.reduce((sum, item) => sum + item.subtotalPrice, 0);

  const booking = await Booking.create({
    bookingNumber: generateBookingNumber(),
    customer: input.customer,
    pickup: {
      categoryId: category._id,
      categoryName: category.categoryName,
      date: input.pickup.date,
      timeSlot: input.pickup.timeSlot,
      orderNotes: input.pickup.orderNotes ?? "",
    },
    items,
    totalPrice,
    status: "pending",
    archived: false,
    archivedAt: null,
  });

  setResponseStatus(event, 201);
  return booking.toObject();
});
