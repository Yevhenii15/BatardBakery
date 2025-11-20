// composables/useAuth.ts
import { ref, computed } from "vue";
import { useApiClient } from "./useApiClient";

export interface AdminUser {
  _id: string;
  email: string;
}

const adminUser = ref<AdminUser | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useAuth() {
  const api = useApiClient();

  const isLoggedIn = computed(() => adminUser.value !== null);

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      // matches your login.post.ts response
      const res = await api<{ token: string; user: AdminUser }>(
        "/api/auth/login",
        {
          method: "POST",
          body: { email, password },
        }
      );

      adminUser.value = res.user;
      return true;
    } catch (err: any) {
      // try to read backend error message if present
      const msg =
        err?.data?.message ||
        err?.statusMessage ||
        "Login failed. Please check your email and password.";
      error.value = msg;
      adminUser.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    error.value = null;

    try {
      await api<{ ok: boolean }>("/api/auth/logout", {
        method: "POST",
      });
      adminUser.value = null;
      return true;
    } catch (err: any) {
      const msg = err?.data?.message || err?.statusMessage || "Logout failed.";
      error.value = msg;
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    // state
    adminUser,
    isLoggedIn,
    loading,
    error,
    // actions
    login,
    logout,
  };
}
