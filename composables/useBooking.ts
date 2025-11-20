// composables/useBooking.ts
import { ref } from "vue";
import { useApiClient } from "./useApiClient";

export interface BookingCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface BookingItemInput {
  productId: string;
  quantity: number;
}

export interface BookingPickupInput {
  categoryId: string;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "HH:mm"
  orderNotes?: string;
}

export interface BookingCreateInput {
  customer: BookingCustomer;
  pickup: BookingPickupInput;
  items: BookingItemInput[];
}

// Full booking as returned by API (simplified)
export interface BookingItem {
  productId: string;
  name: string;
  photo: string;
  quantity: number;
  price: number;
  subtotalPrice: number;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  _id: string;
  bookingNumber: string;
  customer: BookingCustomer;
  pickup: {
    categoryId: string;
    categoryName: string;
    date: string;
    timeSlot: string;
    orderNotes?: string;
  };
  items: BookingItem[];
  totalPrice: number;
  status: BookingStatus;
  archived: boolean;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingUpdatePayload {
  status?: BookingStatus;
  archived?: boolean;
}

const bookings = ref<Booking[]>([]);
const booking = ref<Booking | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useBooking() {
  const api = useApiClient();

  // Public: create booking
  const createBooking = async (data: BookingCreateInput) => {
    loading.value = true;
    error.value = null;

    try {
      const created = await api<Booking>("/api/booking", {
        method: "POST",
        body: data,
      });
      booking.value = created;
      return created;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to create booking";
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Admin: list bookings
  const getBookings = async (archived = false) => {
    loading.value = true;
    error.value = null;

    try {
      bookings.value = await api<Booking[]>(
        `/api/booking?archived=${archived}`
      );
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch bookings";
    } finally {
      loading.value = false;
    }
  };

  // Admin: get booking by id
  const getBookingById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      booking.value = await api<Booking>(`/api/booking/${id}`);
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch booking";
    } finally {
      loading.value = false;
    }
  };

  // Admin: update booking (status / archived)
  const updateBooking = async (id: string, payload: BookingUpdatePayload) => {
    loading.value = true;
    error.value = null;

    try {
      const updated = await api<Booking>(`/api/booking/${id}`, {
        method: "PUT",
        body: payload,
      });

      booking.value = updated;
      const index = bookings.value.findIndex((b) => b._id === id);
      if (index !== -1) bookings.value[index] = updated;

      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to update booking";
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Admin: delete booking
  const deleteBooking = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await api(`/api/booking/${id}`, { method: "DELETE" });
      bookings.value = bookings.value.filter((b) => b._id !== id);
      if (booking.value?._id === id) booking.value = null;
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to delete booking";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    bookings,
    booking,
    loading,
    error,

    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
  };
}
