// composables/useContactMessages.ts
import { ref } from "vue";
import { useApiClient } from "./useApiClient";

export type ContactStatus = "open" | "in_progress" | "closed";

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactStatus;
  archived: boolean;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const messages = ref<ContactMessage[]>([]);
const message = ref<ContactMessage | null>(null);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);

export function useContactMessages() {
  const api = useApiClient();

  /**
   * Public: POST contact message
   */
  const sendMessage = async (data: ContactMessageInput) => {
    loading.value = true;
    error.value = null;

    try {
      const created = await api<ContactMessage>("/api/contact", {
        method: "POST",
        body: data,
      });

      return created;
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.statusMessage ||
        "Failed to send contact message";
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Admin: GET messages (paginated & filtered)
   * You can pass status and/or archived = true/false
   */
  const getMessages = async (
    page = 1,
    pageSize = 20,
    status?: ContactStatus,
    archived?: boolean
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (status) query.append("status", status);
      if (typeof archived === "boolean") {
        query.append("archived", archived ? "true" : "false");
      }

      const res = await api<{ items: ContactMessage[]; total: number }>(
        `/api/contact?${query.toString()}`
      );

      messages.value = res.items;
      total.value = res.total;
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch contact messages";
    } finally {
      loading.value = false;
    }
  };

  /**
   * Admin: GET one message by ID (if you have /api/contact/:id)
   */
  const getMessageById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      message.value = await api<ContactMessage>(`/api/contact/${id}`);
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch message";
    } finally {
      loading.value = false;
    }
  };

  /**
   * Admin: Update message status and/or archived flag
   * e.g. { status: "closed", archived: true }
   */
  const updateMessage = async (
    id: string,
    payload: { status?: ContactStatus; archived?: boolean }
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const updated = await api<ContactMessage>(`/api/contact/${id}`, {
        method: "PUT",
        body: payload,
      });

      // Update list
      const idx = messages.value.findIndex((m) => m._id === id);
      if (idx !== -1) messages.value[idx] = updated;

      // Update single
      if (message.value?._id === id) {
        message.value = updated;
      }

      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to update message";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    messages,
    message,
    total,
    loading,
    error,

    // Public
    sendMessage,

    // Admin
    getMessages,
    getMessageById,
    updateMessage,
  };
}
