import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type AdminDoc = mongoose.InferSchemaType<typeof AdminSchema>;

export default (mongoose.models.Admin as mongoose.Model<AdminDoc>) ||
  mongoose.model<AdminDoc>("Admin", AdminSchema);
