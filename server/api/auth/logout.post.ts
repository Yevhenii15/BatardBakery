/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout admin (clear token)
 *     tags: [Auth]
 *     responses:
 *       200: { description: Logged out }
 */

export default defineEventHandler((event) => {
  deleteCookie(event, "batard_token");
  return { ok: true };
});
