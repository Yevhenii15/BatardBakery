<template>
  <div class="flex gap-3 items-center mb-6">
    <input
      v-model="search"
      type="text"
      placeholder="Enter booking ID"
      class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
    />

    <button
      @click="onSearch"
      class="px-4 py-2 border border-gray-800 rounded-lg text-sm hover:bg-gray-900 hover:text-white"
    >
      Search
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const search = ref("");

const emit = defineEmits(["search"]);

const onSearch = () => {
  if (!search.value) return;
  emit("search", search.value);
};
</script>
