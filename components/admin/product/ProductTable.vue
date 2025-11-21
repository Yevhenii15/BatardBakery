<script setup lang="ts">
import type { Product } from "~/composables/useProduct";
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  products: Product[];
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", product: Product): void;
  (e: "delete", id: string): void;
}>();

const getCategoryName = (id: string) => {
  const cat = props.categories.find((c) => c._id === id);
  return cat ? cat.categoryName : "—";
};
</script>

<template>
  <section class="border border-gray-200 rounded-xl bg-white shadow-sm p-6">
    <header class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold">Products</h2>
        <p class="text-xs text-gray-500 mt-1">
          All products available in the online ordering system.
        </p>
      </div>
      <span v-if="loading" class="text-xs text-gray-500">Loading…</span>
    </header>

    <div v-if="!products.length && !loading" class="text-sm text-gray-500">
      No products created yet.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm border-separate border-spacing-y-1">
        <thead>
          <tr class="text-left text-gray-600">
            <th class="py-2 px-2">Name</th>
            <th class="py-2 px-2">Image</th>
            <th class="py-2 px-2">Category</th>
            <th class="py-2 px-2">Price</th>
            <th class="py-2 px-2">Stock</th>
            <th class="py-2 px-2">Daily cap.</th>
            <th class="py-2 px-2">Active</th>
            <th class="py-2 px-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="prod in products"
            :key="prod._id"
            class="bg-gray-50 hover:bg-gray-100 transition rounded"
          >
            <!-- Name + description -->
            <td class="py-2 px-2 align-middle">
              <div class="flex flex-col">
                <span class="font-medium text-gray-900">
                  {{ prod.name }}
                </span>
                <span
                  v-if="prod.description"
                  class="text-xs text-gray-500 truncate max-w-xs"
                >
                  {{ prod.description }}
                </span>
              </div>
            </td>

            <!-- Image -->
            <td class="py-2 px-2 align-middle">
              <div class="w-16 h-16 flex items-center justify-center">
                <img
                  v-if="prod.photo"
                  :src="prod.photo"
                  class="w-16 h-16 rounded-lg object-cover border border-gray-300"
                />
                <span
                  v-else
                  class="text-[10px] text-gray-400 border border-dashed border-gray-300 rounded-lg px-2 py-1"
                >
                  No image
                </span>
              </div>
            </td>

            <!-- Category -->
            <td class="py-2 px-2 align-middle text-gray-700">
              {{ getCategoryName(prod.categoryId) }}
            </td>

            <!-- Price -->
            <td class="py-2 px-2 align-middle text-gray-700">
              {{ prod.price.toFixed(2) }} DKK
            </td>

            <!-- Stock -->
            <td class="py-2 px-2 align-middle text-gray-700">
              {{ prod.stock }}
            </td>

            <!-- Daily capacity -->
            <td class="py-2 px-2 align-middle text-gray-700">
              {{ prod.dailyCapacity }}
            </td>

            <!-- Active -->
            <td class="py-2 px-2 align-middle text-gray-700">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full border border-gray-400 text-xs"
              >
                {{ prod.active ? "Yes" : "No" }}
              </span>
            </td>

            <!-- Actions -->
            <td class="py-2 px-2 align-middle text-right">
              <div class="inline-flex gap-2">
                <button
                  class="px-3 py-1 border border-gray-500 rounded-lg text-xs hover:bg-gray-200 transition"
                  @click="emit('edit', prod)"
                >
                  Edit
                </button>
                <button
                  class="px-3 py-1 border border-gray-500 rounded-lg text-xs hover:bg-gray-200 transition"
                  @click="emit('delete', prod._id)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
