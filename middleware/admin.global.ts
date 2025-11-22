import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth();

  // Only protect /admin/** routes — but allow /admin/login
  if (to.path.startsWith("/admin") && to.path !== "/admin/login") {
    if (!isLoggedIn.value) {
      return "/admin/login";
    }
  }
});
