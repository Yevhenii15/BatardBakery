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
 *       400:
 *         description: Invalid data
 */

import Booking from "../../models/Booking";
import Category from "../../models/Category";
import Product from "../../models/Product";
import { BookingCreateInput } from "../../validation/Booking";
import { generateBookingNumber } from "../../utils/booking";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const input = BookingCreateInput.parse(body);

  // 1) Load all categories used in pickups
  const categoryIds = [...new Set(input.pickups.map((p) => p.categoryId))];
  const categories = await Category.find({ _id: { $in: categoryIds } }).lean();

  if (categories.length !== categoryIds.length) {
    setResponseStatus(event, 400);
    return { message: "One or more categories do not exist" };
  }

  const categoryMap = new Map(categories.map((c) => [String(c._id), c]));

  // 2) Load all products used in items
  const productIds = [...new Set(input.items.map((i) => i.productId))];
  const products = await Product.find({ _id: { $in: productIds } }).lean();

  if (products.length !== productIds.length) {
    setResponseStatus(event, 400);
    return { message: "One or more products do not exist" };
  }

  const productMap = new Map(products.map((p) => [String(p._id), p]));

  // 3) Build items with product snapshot + pickupIndex
  const items = input.items.map((i) => {
    const p = productMap.get(i.productId)!;
    const subtotal = p.price * i.quantity;

    return {
      productId: p._id,
      name: p.name,
      photo: p.photo ?? "",
      quantity: i.quantity,
      price: p.price,
      subtotalPrice: subtotal,
      pickupIndex: i.pickupIndex,
    };
  });

  const totalPrice = items.reduce((sum, i) => sum + i.subtotalPrice, 0);

  // 4) Build pickups array with categoryName
  const pickups = input.pickups.map((p) => {
    const cat = categoryMap.get(p.categoryId)!;

    return {
      categoryId: cat._id,
      categoryName: cat.categoryName,
      date: p.date,
      timeSlot: p.timeSlot,
      orderNotes: p.orderNotes ?? "",
    };
  });

  // 5) Create booking in DB
  const booking = await Booking.create({
    bookingNumber: generateBookingNumber(),
    customer: input.customer,
    pickups,
    items,
    totalPrice,
    status: "pending",
    archived: false,
    archivedAt: null,
  });

  setResponseStatus(event, 201);
  return booking.toObject();
});
