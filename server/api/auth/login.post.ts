/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginRequest' }
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/LoginResponse' }
 *       401: { description: Invalid credentials }
 */

import bcrypt from "bcryptjs";
import Admin from "../../models/Admin";
import { LoginInput } from "../../validation/Auth";
import { signAdminJWT } from "../../utils/jwt";

export default defineEventHandler(async (event) => {
  const { email, password } = LoginInput.parse(await readBody(event));
  const admin = await Admin.findOne({ email });
  if (!admin) {
    setResponseStatus(event, 401);
    return { message: "Invalid credentials" };
  }

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) {
    setResponseStatus(event, 401);
    return { message: "Invalid credentials" };
  }

  const token = signAdminJWT(String(admin._id), admin.email);

  setCookie(event, "batard_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { token, user: { _id: admin._id, email: admin.email } };
});
