<template>
  <div class="space-y-10">
    <!-- Page Title -->
    <div class="mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">All bookings</h1>
      <p class="text-sm text-gray-500">
        Search, manage, and update customer bookings
      </p>
    </div>

    <!-- Search -->
    <BookingSearch @search="searchBooking" @reset="reloadBookings" />

    <!-- Active bookings -->
    <BookingTable
      title="Active bookings"
      subtitle="Pending and confirmed bookings"
      :items="activeBookings"
      :loading="loading"
      @updateBooking="handleUpdateBooking"
      @delete="removeBooking"
    />

    <!-- Archived bookings -->
    <BookingTable
      title="Archived bookings"
      subtitle="Completed or cancelled bookings"
      :items="archivedBookings"
      :loading="loadingArchived"
      @updateBooking="handleUpdateBooking"
      @delete="removeBooking"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBooking } from "~/composables/useBooking";

import BookingTable from "~/components/admin/booking/BookingTable.vue";
import BookingSearch from "~/components/admin/booking/BookingSearch.vue";

// composable
const {
  bookings,
  booking,
  loading,
  getBookings,
  getBookingById,
  getBookingByNumber,
  deleteBooking,
  updateBooking,
} = useBooking();

const loadingArchived = ref(false);

// split into active / archived
const activeBookings = computed(() =>
  bookings.value.filter((b) => !b.archived)
);

const archivedBookings = computed(() =>
  bookings.value.filter((b) => b.archived)
);
const reloadBookings = async () => {
  await getBookings(false);
  loadingArchived.value = true;
  await getBookings(true);
  loadingArchived.value = false;
};

onMounted(async () => {
  await getBookings(false); // active
  loadingArchived.value = true;
  await getBookings(true); // archived
  loadingArchived.value = false;
});

// search by ID (from BookingSearch)
const searchBooking = async (value: string) => {
  const trimmed = value.trim();

  // If input empty -> reload full lists
  if (!trimmed) {
    await getBookings(false); // active
    loadingArchived.value = true;
    await getBookings(true); // archived
    loadingArchived.value = false;
    return;
  }

  let found: any = null;

  // 1) If it looks like a Mongo ObjectId, try by ID first
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(trimmed);
  if (isObjectId) {
    const byId = await getBookingById(trimmed);
    if (byId) {
      found = byId;
    }
  }

  // 2) If not found yet, try by booking number
  if (!found) {
    const byNumber = await getBookingByNumber(trimmed);
    if (byNumber) {
      found = byNumber;
    }
  }

  // 3) Update table or show "not found"
  if (found) {
    bookings.value = [found];
  } else {
    window.alert("Booking not found");
    bookings.value = [];
  }
};

// 🔥 called when inline edit in table is saved
const handleUpdateBooking = async (payload: {
  id: string;
  status: string;
  archived: boolean;
}) => {
  let archived = payload.archived;

  // auto-archive completed / cancelled
  if (payload.status === "completed" || payload.status === "cancelled") {
    archived = true;
  }

  // 1) Update in backend
  await updateBooking(payload.id, {
    status: payload.status as any,
    archived,
  });

  // 2) Update local reactive state so UI changes immediately

  // update in main bookings list
  bookings.value = bookings.value.map((b) =>
    b._id === payload.id ? { ...b, status: payload.status as any, archived } : b
  );

  // also keep single `booking` (from search) in sync
  if (booking.value && booking.value._id === payload.id) {
    booking.value.status = payload.status as any;
    booking.value.archived = archived;
  }
};

// delete booking (both from search result & tables)
const removeBooking = async (id: string) => {
  if (!confirm("Delete this booking?")) return;
  await deleteBooking(id);

  // remove from local list so UI updates without reload
  bookings.value = bookings.value.filter((b) => b._id !== id);

  // clear search result if it was this booking
  if (booking.value && booking.value._id === id) {
    booking.value = null;
  }
};
</script>
