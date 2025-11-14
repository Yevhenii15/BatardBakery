import mongoose, { Schema } from "mongoose";

const TimeRangeSchema = new Schema(
  {
    from: { type: String, required: true }, // "HH:mm"
    to: { type: String, required: true }, // "HH:mm"
  },
  { _id: false }
);

const CategorySchema = new Schema(
  {
    categoryName: { type: String, required: true, unique: true, trim: true },
    weekdayTime: { type: TimeRangeSchema, required: true }, // Mon–Fri
    weekendsTime: { type: TimeRangeSchema, required: true }, // Sat–Sun
    slotSizeMinutes: { type: Number, required: true, min: 1 },
    leadTimeMinutes: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export type CategoryDoc = mongoose.InferSchemaType<typeof CategorySchema>;

export default (mongoose.models.Category as mongoose.Model<CategoryDoc>) ||
  mongoose.model<CategoryDoc>("Category", CategorySchema);
