<template>
  <div class="space-y-10">
    <!-- Search -->
    <BookingSearch @search="searchBooking" />

    <!-- Single booking result -->
    <section v-if="booking" class="border p-4 rounded-xl bg-white shadow-sm">
      <h3 class="text-md font-semibold mb-2">
        Booking: {{ booking.bookingNumber }}
      </h3>
      <p class="text-sm text-gray-600">
        {{ booking.customer.firstName }} {{ booking.customer.lastName }}
      </p>

      <div class="flex gap-2 mt-3">
        <button
          class="px-3 py-1 border border-gray-800 rounded-lg text-xs"
          @click="openEdit(booking)"
        >
          Edit
        </button>
        <button
          class="px-3 py-1 border border-red-600 text-red-600 rounded-lg text-xs"
          @click="removeBooking(booking._id)"
        >
          Delete
        </button>
      </div>
    </section>

    <!-- Active bookings -->
    <BookingTable
      title="Active Bookings"
      subtitle="Pending and confirmed bookings"
      :items="activeBookings"
      :loading="loading"
      @edit="openEdit"
      @view="searchBooking"
      @delete="removeBooking"
    />

    <!-- Archived bookings -->
    <BookingTable
      title="Archived Bookings"
      subtitle="Completed or cancelled bookings"
      :items="archivedBookings"
      :loading="loadingArchived"
      @edit="openEdit"
      @view="searchBooking"
      @delete="removeBooking"
    />

    <BookingUpdateModal
      v-if="editBooking"
      :booking="editBooking"
      @save="update"
      @close="editBooking = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBooking } from "~/composables/useBooking";

import BookingTable from "~/components/admin/booking/BookingTable.vue";
import BookingSearch from "~/components/admin/booking/BookingSearch.vue";
import BookingUpdateModal from "~/components/admin/booking/BookingUpdateModal.vue";

const {
  bookings,
  booking,
  loading,
  getBookings,
  getBookingById,
  deleteBooking,
  updateBooking,
} = useBooking();

const loadingArchived = ref(false);

const activeBookings = computed(() =>
  bookings.value.filter((b) => !b.archived)
);

const archivedBookings = computed(() =>
  bookings.value.filter((b) => b.archived)
);

onMounted(async () => {
  await getBookings(false);
  loadingArchived.value = true;
  await getBookings(true);
  loadingArchived.value = false;
});

const searchBooking = async (id: string) => {
  await getBookingById(id);
};

const editBooking = ref(null as any);

const openEdit = (b: any) => {
  editBooking.value = b;
};

const update = async (payload: any) => {
  if (!editBooking.value) return;

  await updateBooking(editBooking.value._id, payload);
  editBooking.value = null;
};

const removeBooking = async (id: string) => {
  if (!confirm("Delete this booking?")) return;
  await deleteBooking(id);
};
</script>
