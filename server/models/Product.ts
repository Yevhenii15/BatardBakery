import mongoose, { Schema, Types } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    photo: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },

    categoryId: { type: Types.ObjectId, ref: "Category", required: true },

    stock: { type: Number, default: 0, min: 0 },
    dailyCapacity: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ProductDoc = mongoose.InferSchemaType<typeof ProductSchema>;

export default (mongoose.models.Product as mongoose.Model<ProductDoc>) ||
  mongoose.model<ProductDoc>("Product", ProductSchema);
