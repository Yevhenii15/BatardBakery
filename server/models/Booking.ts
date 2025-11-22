import mongoose, { Schema, Types } from "mongoose";

const CustomerSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { _id: false }
);

const PickupSchema = new Schema(
  {
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    categoryName: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    timeSlot: { type: String, required: true }, // "HH:mm"
    orderNotes: { type: String, default: "" },
  },
  { _id: false }
);

const ItemSchema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    photo: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotalPrice: { type: Number, required: true, min: 0 },
    pickupIndex: { type: Number, required: true },
  },
  { _id: false }
);

const BookingSchema = new Schema(
  {
    bookingNumber: { type: String, required: true, unique: true },

    customer: { type: CustomerSchema, required: true },
    pickups: {
      type: [PickupSchema],
      required: true,
      validate: (v: any[]) => v.length > 0,
    },
    items: { type: [ItemSchema], required: true },

    totalPrice: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    archived: { type: Boolean, default: false },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

BookingSchema.index({ "pickups.date": 1 });
BookingSchema.index({ archived: 1 });

export type BookingDoc = mongoose.InferSchemaType<typeof BookingSchema> & {
  archivedAt: Date | null;
};

export default (mongoose.models.Booking as mongoose.Model<BookingDoc>) ||
  mongoose.model<BookingDoc>("Booking", BookingSchema);
