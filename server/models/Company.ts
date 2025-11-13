import mongoose, { Schema } from "mongoose";

const CompanySchema = new Schema(
  {
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export type CompanyDoc = mongoose.InferSchemaType<typeof CompanySchema>;

export default (mongoose.models.Company as mongoose.Model<CompanyDoc>) ||
  mongoose.model<CompanyDoc>("Company", CompanySchema);
