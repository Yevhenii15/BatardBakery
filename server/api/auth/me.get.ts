// server/api/auth/me.get.ts
import { getCookie, deleteCookie } from "h3";
import { verifyAdminJWT } from "../../utils/jwt";

export default defineEventHandler((event) => {
  const token = getCookie(event, "batard_token");

  // no token -> just "not logged in", but 200
  if (!token) {
    return { user: null };
  }

  try {
    const payload = verifyAdminJWT(token);

    // 👇 match AdminUser: { _id, email }
    return {
      user: {
        _id: payload.sub,
        email: payload.email,
      },
    };
  } catch {
    // invalid / expired token -> clear cookie and treat as logged out
    deleteCookie(event, "batard_token", { path: "/" });
    return { user: null };
  }
});
