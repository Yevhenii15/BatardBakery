// composables/useImageUpload.ts
import { ref } from "vue";
import { useApiClient } from "./useApiClient";

export function useImageUpload() {
  const api = useApiClient();
  const uploading = ref(false);
  const uploadError = ref<string | null>(null);

  const uploadImage = async (file: File, oldUrl?: string) => {
    uploading.value = true;
    uploadError.value = null;

    const formData = new FormData();
    formData.append("file", file);
    if (oldUrl) {
      formData.append("oldUrl", oldUrl);
    }

    try {
      const res = await api<{ url: string }>("/api/upload", {
        method: "POST",
        body: formData,
      });
      return res.url;
    } catch (err: any) {
      uploadError.value =
        err?.statusMessage || err?.data?.message || "Failed to upload image.";
      throw err;
    } finally {
      uploading.value = false;
    }
  };

  return {
    uploadImage,
    uploading,
    uploadError,
  };
}
