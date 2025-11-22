<template>
  <section class="border border-gray-200 rounded-xl bg-white shadow-sm p-6">
    <header class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <p class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <span v-if="loading" class="text-xs text-gray-500">Loading…</span>
    </header>

    <div v-if="!items.length && !loading" class="text-sm text-gray-500">
      No bookings found.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm border-separate border-spacing-y-2">
        <thead>
          <tr class="text-left text-gray-600">
            <th class="py-2 px-2">Booking</th>
            <th class="py-2 px-2">Customer</th>
            <th class="py-2 px-2">Pickups</th>
            <th class="py-2 px-2">Items</th>
            <th class="py-2 px-2">Total</th>
            <th class="py-2 px-2">Status</th>
            <th class="py-2 px-2">Archive</th>
            <th class="py-2 px-2">Timestamps</th>
            <th class="py-2 px-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="b in items"
            :key="b._id"
            class="bg-gray-50 hover:bg-gray-100 transition rounded align-top"
          >
            <!-- Booking -->
            <td class="py-3 px-2 align-top">
              <div class="font-semibold text-gray-900">
                #{{ b.bookingNumber }}
              </div>
              <div class="text-[11px] text-gray-500 break-all">
                ID: {{ b._id }}
              </div>
            </td>

            <!-- Customer -->
            <td class="py-3 px-2 align-top">
              <div class="font-medium text-gray-900">
                {{ b.customer.firstName }} {{ b.customer.lastName }}
              </div>
              <div class="text-xs text-gray-600">
                {{ b.customer.email }}
              </div>
              <div class="text-xs text-gray-600">
                {{ b.customer.phone }}
              </div>
            </td>

            <!-- Pickups -->
            <td class="py-3 px-2 align-top">
              <ul class="space-y-2 text-xs text-gray-700">
                <li v-for="(p, i) in b.pickups" :key="i">
                  <div class="font-medium">
                    {{ p.categoryName }}
                  </div>
                  <div>{{ p.date }} – {{ p.timeSlot }}</div>
                  <div class="text-[11px] text-gray-500">
                    categoryId: {{ p.categoryId }}
                  </div>
                  <div
                    v-if="p.orderNotes"
                    class="text-[11px] text-gray-500 italic"
                  >
                    Notes: {{ p.orderNotes }}
                  </div>
                </li>
              </ul>
            </td>

            <!-- Items -->
            <td class="py-3 px-2 align-top">
              <ul class="space-y-2 text-xs text-gray-700">
                <li
                  v-for="(item, idx) in b.items"
                  :key="idx"
                  class="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
                >
                  <div class="flex gap-2">
                    <div
                      v-if="item.photo"
                      class="w-12 h-12 border border-gray-300 rounded-lg overflow-hidden bg-white"
                    >
                      <img
                        :src="item.photo"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      v-else
                      class="w-12 h-12 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-[10px] text-gray-400"
                    >
                      No img
                    </div>

                    <div class="flex-1">
                      <div class="font-medium">
                        {{ item.quantity }} × {{ item.name }}
                      </div>
                      <div class="text-gray-500">
                        {{ item.price.toFixed(2) }} DKK each
                      </div>
                      <div class="text-gray-500">
                        Subtotal: {{ item.subtotalPrice.toFixed(2) }} DKK
                      </div>
                      <div class="text-[11px] text-gray-400">
                        productId: {{ item.productId }}
                      </div>
                      <div class="text-[11px] text-gray-400">
                        pickupIndex: {{ item.pickupIndex }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </td>

            <!-- Total -->
            <td class="py-3 px-2 align-top font-semibold text-gray-900">
              {{ b.totalPrice.toFixed(2) }} DKK
            </td>

            <!-- Status -->
            <td class="py-3 px-2 align-top">
              <span
                class="px-2 py-1 border border-gray-400 rounded-full text-xs capitalize"
              >
                {{ b.status }}
              </span>
            </td>

            <!-- Archive -->
            <td class="py-3 px-2 align-top text-xs text-gray-700">
              <div>
                Archived: <strong>{{ b.archived ? "Yes" : "No" }}</strong>
              </div>
              <div v-if="b.archivedAt" class="text-[11px] text-gray-500">
                archivedAt:<br />
                {{ b.archivedAt }}
              </div>
            </td>

            <!-- Timestamps -->
            <td class="py-3 px-2 align-top text-xs text-gray-700">
              <div>
                createdAt:<br />
                <span class="text-[11px] text-gray-600">
                  {{ formatDateTime(b.createdAt) }}
                </span>
              </div>
              <div class="mt-1">
                updatedAt:<br />
                <span class="text-[11px] text-gray-600">
                  {{ formatDateTime(b.updatedAt) }}
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td class="py-3 px-2 align-top text-right">
              <div class="inline-flex flex-col gap-2 items-end">
                <button
                  class="px-3 py-1 border border-gray-500 rounded-lg text-xs hover:bg-gray-200"
                  @click="$emit('view', b._id)"
                >
                  View
                </button>

                <button
                  class="px-3 py-1 border border-gray-500 rounded-lg text-xs hover:bg-gray-200"
                  @click="$emit('edit', b)"
                >
                  Edit
                </button>

                <button
                  class="px-3 py-1 border border-red-500 text-red-600 rounded-lg text-xs hover:bg-red-50"
                  @click="$emit('delete', b._id)"
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

<script setup lang="ts">
import type { Booking } from "~/composables/useBooking";

defineProps<{
  title: string;
  subtitle: string;
  items: Booking[];
  loading: boolean;
}>();

defineEmits<{
  (e: "view", id: string): void;
  (e: "edit", booking: Booking): void;
  (e: "delete", id: string): void;
}>();

const formatDateTime = (value: string) => {
  // value is ISO string from backend
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};
</script>
