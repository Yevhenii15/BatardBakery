<template>
  <section class="booking-table">
    <!-- Header -->
    <header class="bt-header">
      <div>
        <h2 class="bt-title">{{ title }}</h2>
        <p class="bt-subtitle">{{ subtitle }}</p>
      </div>

      <div v-if="loading" class="bt-loading">
        <span class="bt-dot"></span> Loading…
      </div>
    </header>

    <!-- Empty state -->
    <div v-if="!items.length && !loading" class="bt-empty">
      No bookings found.
    </div>

    <!-- Table -->
    <div v-else class="bt-table-wrapper">
      <table class="bt-table">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Customer</th>
            <th>Pickups</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Archive</th>
            <th>Timestamps</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <BookingTableRow
            v-for="b in items"
            :key="b._id"
            :booking="b"
            @updateBooking="$emit('updateBooking', $event)"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Booking } from "~/composables/useBooking";
import BookingTableRow from "./BookingTableRow.vue";

defineProps<{
  title: string;
  subtitle: string;
  items: Booking[];
  loading: boolean;
}>();

defineEmits<{
  (
    e: "updateBooking",
    payload: { id: string; status: Booking["status"]; archived: boolean }
  ): void;
  (e: "delete", id: string): void;
}>();
</script>

<style scoped>
.booking-table {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

/* Header */
.bt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bt-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.bt-subtitle {
  font-size: 0.75rem;
  color: #777;
}

.bt-loading {
  font-size: 0.75rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.bt-dot {
  width: 6px;
  height: 6px;
  background: #666;
  border-radius: 50%;
  animation: bt-pulse 1s infinite;
}

@keyframes bt-pulse {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

/* Empty */
.bt-empty {
  margin-top: 1rem;
  padding: 1.5rem;
  text-align: center;
  border: 1px dashed #ccc;
  border-radius: 10px;
  background: #fafafa;
}

/* Table wrapper */
.bt-table-wrapper {
  margin-top: 1rem;
  overflow-x: auto;
}

.bt-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.bt-table thead th {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #888;
  padding: 4px 6px;
}
</style>
