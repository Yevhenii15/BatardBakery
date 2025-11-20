<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="border border-gray-200 rounded-lg bg-white p-6">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold">Categories</h2>
      <span v-if="loading" class="text-sm text-gray-500">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="text-gray-500 text-sm">
      No categories found.
    </div>

    <table v-else class="w-full text-sm border-separate border-spacing-y-1">
      <thead>
        <tr class="text-left text-gray-700">
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="cat in categories"
          :key="cat._id"
          class="bg-gray-50 hover:bg-gray-100 transition rounded"
        >
          <td class="py-2 px-2">{{ cat.categoryName }}</td>
          <td class="py-2 px-2">
            {{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}
          </td>
          <td class="py-2 px-2">
            {{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}
          </td>
          <td class="py-2 px-2">{{ cat.slotSizeMinutes }} min</td>
          <td class="py-2 px-2">{{ cat.leadTimeMinutes }} min</td>

          <td class="py-2 px-2 text-right">
            <div class="flex gap-2 justify-end">
              <button
                class="px-3 py-1 border border-gray-600 rounded-lg text-xs hover:bg-gray-200"
                @click="emit('edit', cat)"
              >
                Edit
              </button>

              <button
                class="px-3 py-1 border border-gray-600 rounded-lg text-xs hover:bg-gray-200"
                @click="emit('delete', cat._id)"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
