import mongoose, { Schema } from "mongoose";

const HeroSectionSchema = new Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String, default: "" },
    heroImg1: { type: String, default: "" },
    heroImg2: { type: String, default: "" },
  },
  { timestamps: true }
);

export type HeroSectionDoc = mongoose.InferSchemaType<typeof HeroSectionSchema>;
export default (mongoose.models
  .HeroSection as mongoose.Model<HeroSectionDoc>) ||
  mongoose.model<HeroSectionDoc>("HeroSection", HeroSectionSchema);
