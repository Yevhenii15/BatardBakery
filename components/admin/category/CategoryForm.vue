<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type {
  Category,
  CategoryInput,
  TimeRange,
} from "~/composables/useCategory";

const props = defineProps<{
  modelValue: Category | null;
}>();

const emit = defineEmits<{
  (e: "submit", payload: CategoryInput): void;
  (e: "cancelEdit"): void;
}>();

const isEditMode = computed(() => !!props.modelValue);

// Form state
const form = reactive<CategoryInput>({
  categoryName: "",
  weekdayTime: { from: "", to: "" } as TimeRange,
  weekendsTime: { from: "", to: "" } as TimeRange,
  slotSizeMinutes: 5,
  leadTimeMinutes: 0,
});

// Sync edit values
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      form.categoryName = "";
      form.weekdayTime = { from: "", to: "" };
      form.weekendsTime = { from: "", to: "" };
      form.slotSizeMinutes = 5;
      form.leadTimeMinutes = 0;
      return;
    }

    form.categoryName = val.categoryName;
    form.weekdayTime = { ...val.weekdayTime };
    form.weekendsTime = { ...val.weekendsTime };
    form.slotSizeMinutes = val.slotSizeMinutes;
    form.leadTimeMinutes = val.leadTimeMinutes;
  },
  { immediate: true }
);

const onSubmit = () => emit("submit", { ...form });
const onCancel = () => emit("cancelEdit");
</script>

<template>
  <div class="border border-gray-200 rounded-lg p-6 bg-white">
    <h2 class="text-xl font-semibold mb-4">
      {{ isEditMode ? "Edit Category" : "Create Category" }}
    </h2>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Category Name -->
      <div>
        <label class="block text-sm mb-1 font-medium">Category Name</label>
        <input
          v-model="form.categoryName"
          type="text"
          class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:ring-gray-300"
          required
        />
      </div>

      <!-- Time Ranges -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm mb-1 font-medium"
            >Weekday Time (Mon–Fri)</label
          >
          <div class="flex gap-2">
            <input
              v-model="form.weekdayTime.from"
              type="time"
              class="border border-gray-300 rounded-lg px-3 py-2 w-full"
              required
            />
            <span class="self-center text-gray-500">to</span>
            <input
              v-model="form.weekdayTime.to"
              type="time"
              class="border border-gray-300 rounded-lg px-3 py-2 w-full"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm mb-1 font-medium"
            >Weekend Time (Sat–Sun)</label
          >
          <div class="flex gap-2">
            <input
              v-model="form.weekendsTime.from"
              type="time"
              class="border border-gray-300 rounded-lg px-3 py-2 w-full"
              required
            />
            <span class="self-center text-gray-500">to</span>
            <input
              v-model="form.weekendsTime.to"
              type="time"
              class="border border-gray-300 rounded-lg px-3 py-2 w-full"
              required
            />
          </div>
        </div>
      </div>

      <!-- Slot + lead time -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm mb-1 font-medium"
            >Slot Size (minutes)</label
          >
          <input
            v-model.number="form.slotSizeMinutes"
            type="number"
            class="border border-gray-300 rounded-lg px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label class="block text-sm mb-1 font-medium"
            >Lead Time (minutes)</label
          >
          <input
            v-model.number="form.leadTimeMinutes"
            type="number"
            class="border border-gray-300 rounded-lg px-3 py-2 w-full"
            required
          />
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3">
        <button
          v-if="isEditMode"
          type="button"
          class="border border-gray-400 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
          @click="onCancel"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="border border-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-900 hover:text-white transition"
        >
          {{ isEditMode ? "Save Changes" : "Create Category" }}
        </button>
      </div>
    </form>
  </div>
</template>
