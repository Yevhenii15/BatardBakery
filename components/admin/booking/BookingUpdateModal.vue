<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl p-6 shadow-lg w-full max-w-md space-y-4">
      <h2 class="text-lg font-semibold">Update Booking</h2>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Status</label>
        <select
          v-model="status"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="archived" />
        <span class="text-sm">Archived</span>
      </div>

      <div class="flex justify-end gap-3">
        <button class="px-4 py-2 border rounded-lg" @click="$emit('close')">
          Cancel
        </button>

        <button
          class="px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-800 hover:text-white"
          @click="submit"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  booking: any;
}>();

const emit = defineEmits(["save", "close"]);

const status = ref(props.booking.status);
const archived = ref(props.booking.archived);

watch(
  () => props.booking,
  (b) => {
    status.value = b.status;
    archived.value = b.archived;
  }
);

const submit = () => {
  emit("save", { status: status.value, archived: archived.value });
};
</script>
