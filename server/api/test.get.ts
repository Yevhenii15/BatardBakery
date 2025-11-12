import { connectDB } from "../utils/db";

export default defineEventHandler(async () => {
  await connectDB();
  return { message: "MongoDB connected successfully 🎉" };
});
