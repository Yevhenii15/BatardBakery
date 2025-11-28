<template>
  <div class="admin-wrapper">
    <!-- Page Title -->
    <div class="admin-container">
      <div class="back-btn-wrapper">
        <NuxtLink to="/admin" class="back-btn">← </NuxtLink>
      </div>
      <!-- Header -->
      <h1 class="admin-title">All bookings</h1>
      <p class="admin-subtitle">
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

<style scoped>
.back-btn-wrapper {
  text-align: left;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-block;
  background: #3b4b3d;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  transition: 0.2s ease;
  font-weight: bold;
}

.back-btn:hover {
  background: #283529;
}

.admin-wrapper {
  background: #211a1a;
  min-height: 100vh;
  padding: 40px 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.admin-container {
  width: 100%;
  padding: 40px;
  text-align: center;
}

.admin-title {
  font-size: 32px;
  font-family: Georgia, serif;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
  margin-right: 60px;
}

.admin-subtitle {
  color: #e7e7e7;
  margin-bottom: 30px;
  margin-right: 60px;
  font-size: 15px;
}


.admin-card {
  background: #6f8472;
  padding: 25px;
  border-radius: 14px;
  margin-bottom: 30px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
}

.alert-error {
  background: #c67b7b;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}
</style>
