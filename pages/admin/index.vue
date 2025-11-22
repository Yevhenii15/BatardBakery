<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const { logout } = useAuth();

const goTo = (path: string) => {
  router.push(path);
};

const onLogout = async () => {
  await logout();
  router.push("/"); // or "/admin/login" if you have a login page there
};
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Admin panel</h1>
        <p class="text-sm text-gray-500 mt-1">
          Manage content, products, categories and bookings for Batard Bakery.
        </p>
      </div>

      <button
        type="button"
        class="px-4 py-2 border border-gray-800 rounded-lg text-sm hover:bg-gray-900 hover:text-white transition"
        @click="onLogout"
      >
        Logout
      </button>
    </header>

    <!-- Grid of cards -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Categories -->
      <button
        type="button"
        class="text-left border border-gray-200 rounded-xl bg-white shadow-sm p-5 hover:shadow-md hover:bg-gray-50 transition flex flex-col justify-between"
        @click="goTo('/admin/categories')"
      >
        <div>
          <h2 class="text-lg font-semibold">Categories</h2>
          <p class="mt-1 text-xs text-gray-500">
            Manage product categories and their pickup time rules.
          </p>
        </div>
        <span class="mt-4 text-xs text-gray-600"> Go to categories → </span>
      </button>

      <!-- Products -->
      <button
        type="button"
        class="text-left border border-gray-200 rounded-xl bg-white shadow-sm p-5 hover:shadow-md hover:bg-gray-50 transition flex flex-col justify-between"
        @click="goTo('/admin/products')"
      >
        <div>
          <h2 class="text-lg font-semibold">Products</h2>
          <p class="mt-1 text-xs text-gray-500">
            Create and edit products, prices, stock and images.
          </p>
        </div>
        <span class="mt-4 text-xs text-gray-600"> Go to products → </span>
      </button>

      <!-- Bookings -->
      <button
        type="button"
        class="text-left border border-gray-200 rounded-xl bg-white shadow-sm p-5 hover:shadow-md hover:bg-gray-50 transition flex flex-col justify-between"
        @click="goTo('/admin/bookings')"
      >
        <div>
          <h2 class="text-lg font-semibold">Bookings</h2>
          <p class="mt-1 text-xs text-gray-500">
            View active and archived bookings, update status or delete.
          </p>
        </div>
        <span class="mt-4 text-xs text-gray-600"> Go to bookings → </span>
      </button>
    </section>
  </div>
</template>
