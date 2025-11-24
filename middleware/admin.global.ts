import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, checkAuth } = useAuth();

  await checkAuth();

  if (to.path.startsWith("/admin") && to.path !== "/admin/login") {
    if (!isLoggedIn.value) {
      return "/admin/login";
    }
  }
});
