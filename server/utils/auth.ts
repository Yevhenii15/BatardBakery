import { verifyAdminJWT } from "./jwt";

export function getAuthToken(event: any) {
  const cookie = getCookie(event, "batard_token");
  if (cookie) return cookie;
  const auth = getHeader(event, "authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function requireAdmin(event: any) {
  const token = getAuthToken(event);
  if (!token)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  try {
    const payload = verifyAdminJWT(token);
    // @ts-ignore
    event.context.admin = payload;
    return payload;
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }
}
