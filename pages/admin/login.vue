<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const { login, loading, error, isLoggedIn } = useAuth();

const form = ref({
  email: "",
  password: "",
});

// 🚀 Redirect if already logged in
onMounted(() => {
  if (isLoggedIn.value) {
    router.push("/admin");
  }
});

const onSubmit = async () => {
  const success = await login(form.value.email, form.value.password);
  if (success) router.push("/admin");
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div
      class="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5"
    >
      <h1 class="text-xl font-semibold text-gray-800 text-center">
        Admin Login
      </h1>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
            placeholder="admin@example.com"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
            placeholder="••••••••"
          />
        </div>

        <!-- Error message -->
        <p v-if="error" class="text-sm text-red-600 text-center">
          {{ error }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 text-center border border-gray-800 rounded-lg text-sm hover:bg-gray-900 hover:text-white transition disabled:opacity-50"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>
