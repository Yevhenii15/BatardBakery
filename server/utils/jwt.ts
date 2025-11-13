import jwt from "jsonwebtoken";

export function signAdminJWT(id: string, email: string) {
  const secret = useRuntimeConfig().jwtSecret!;
  return jwt.sign({ sub: id, email }, secret, { expiresIn: "7d" });
}

export function verifyAdminJWT(token: string) {
  const secret = useRuntimeConfig().jwtSecret!;
  return jwt.verify(token, secret) as { sub: string; email: string };
}
