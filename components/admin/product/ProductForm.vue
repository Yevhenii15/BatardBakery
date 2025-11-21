<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import type { Product, ProductInput } from "~/composables/useProduct";
import type { Category } from "~/composables/useCategory";
import { useApiClient } from "~/composables/useApiClient";

const props = defineProps<{
  modelValue: Product | null;
  categories: Category[];
}>();

const emit = defineEmits<{
  (e: "submit", payload: ProductInput): void;
  (e: "cancelEdit"): void;
}>();

const isEditMode = computed(() => !!props.modelValue);

const form = reactive<ProductInput>({
  name: "",
  description: "",
  photo: "",
  price: 0,
  categoryId: "",
  stock: 0,
  dailyCapacity: 0,
  active: true,
});

// sync modelValue -> form
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      form.name = "";
      form.description = "";
      form.photo = "";
      form.price = 0;
      form.categoryId = "";
      form.stock = 0;
      form.dailyCapacity = 0;
      form.active = true;
      return;
    }

    form.name = val.name;
    form.description = val.description;
    form.photo = val.photo;
    form.price = val.price;
    form.categoryId = val.categoryId;
    form.stock = val.stock;
    form.dailyCapacity = val.dailyCapacity;
    form.active = val.active;
  },
  { immediate: true }
);

const onSubmit = () => {
  emit("submit", { ...form });
};

const onCancel = () => {
  emit("cancelEdit");
};

const api = useApiClient();

const onFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;

  const file = target.files[0];

  const formData = new FormData();
  formData.append("file", file);

  if (form.photo) {
    formData.append("oldUrl", form.photo); // so backend can delete it
  }

  try {
    const res = await api<{ url: string }>("/api/upload", {
      method: "POST",
      body: formData,
    });

    form.photo = res.url;
  } catch (err) {
    console.error("Upload failed", err);
    alert("Failed to upload image");
  }
};
</script>

<template>
  <section
    class="border border-gray-200 rounded-xl bg-white shadow-sm p-6 space-y-5"
  >
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">
          {{ isEditMode ? "Edit product" : "Create new product" }}
        </h2>
        <p class="text-xs text-gray-500 mt-1">
          Configure product details, category, image, and stock information.
        </p>
      </div>
    </header>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Name + Category -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-800"> Name </label>
          <input
            v-model="form.name"
            type="text"
            class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring focus:ring-gray-300"
            placeholder="e.g. Batard, Pizza #2"
            required
          />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-800">
            Category
          </label>
          <select
            v-model="form.categoryId"
            class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm bg-white focus:outline-none focus:ring focus:ring-gray-300"
            required
          >
            <option value="" disabled>Select category</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.categoryName }}
            </option>
          </select>
          <p class="text-xs text-gray-500">
            Pickup time rules will follow the selected category.
          </p>
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-800">
          Description
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm resize-y focus:outline-none focus:ring focus:ring-gray-300"
          placeholder="Short description shown to customers"
        />
      </div>

      <!-- Photo + price -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-800">
            Product image
          </label>

          <div
            class="border border-dashed border-gray-300 rounded-lg px-3 py-3 flex items-center gap-4 bg-gray-50"
          >
            <div class="flex-1">
              <input
                type="file"
                accept="image/*"
                class="text-xs"
                @change="onFileChange"
              />
              <p class="text-xs text-gray-500 mt-1">
                Upload a JPG/PNG image (max 5MB).
              </p>
            </div>

            <div
              v-if="form.photo"
              class="w-20 h-20 overflow-hidden border border-gray-300 rounded-lg bg-white"
            >
              <img :src="form.photo" class="w-full h-full object-cover" />
            </div>
            <div
              v-else
              class="w-20 h-20 flex items-center justify-center border border-gray-200 rounded-lg text-[10px] text-gray-400 bg-white"
            >
              No image
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-800">
            Price (DKK)
          </label>
          <input
            v-model.number="form.price"
            type="number"
            min="0"
            step="0.5"
            class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
            required
          />
        </div>
      </div>

      <!-- Stock + capacity + active -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-800"> Stock </label>
          <input
            v-model.number="form.stock"
            type="number"
            min="0"
            class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
            required
          />
          <p class="text-xs text-gray-500">
            Current available pieces in store.
          </p>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-800">
            Daily capacity
          </label>
          <input
            v-model.number="form.dailyCapacity"
            type="number"
            min="0"
            class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
            required
          />
          <p class="text-xs text-gray-500">Maximum pieces baked per day.</p>
        </div>

        <div class="space-y-1 flex items-center">
          <label class="flex items-center gap-2 text-sm text-gray-800 mt-6">
            <input
              v-model="form.active"
              type="checkbox"
              class="w-4 h-4 border border-gray-400 rounded"
            />
            Active (visible to customers)
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-2">
        <button
          v-if="isEditMode"
          type="button"
          class="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 transition"
          @click="onCancel"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="px-4 py-2 rounded-lg border border-gray-800 text-sm hover:bg-gray-900 hover:text-white transition"
        >
          {{ isEditMode ? "Save changes" : "Create product" }}
        </button>
      </div>
    </form>
  </section>
</template>
