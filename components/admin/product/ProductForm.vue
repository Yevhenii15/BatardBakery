<script setup lang="ts">
import { reactive, watch, computed, ref } from "vue";
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

// helper for default form state
const createEmptyForm = (): ProductInput => ({
  name: "",
  description: "",
  photo: "",
  price: 0,
  categoryId: "",
  stock: 0,
  dailyCapacity: 0,
  active: true,
});

const form = reactive<ProductInput>(createEmptyForm());

// 💾 local selected file (not uploaded yet)
const selectedFile = ref<File | null>(null);
// 👀 preview URL (for new file or existing photo)
const previewUrl = ref<string | null>(null);

// reset form
const resetForm = () => {
  Object.assign(form, createEmptyForm());
  selectedFile.value = null;
  previewUrl.value = null;
};

// sync modelValue -> form
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      resetForm();
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

    // show existing photo as preview when editing
    previewUrl.value = val.photo || null;
    selectedFile.value = null;
  },
  { immediate: true }
);

const api = useApiClient();

// 🧁 Submit: first upload file (if any), then emit product payload
const onSubmit = async () => {
  const payload: ProductInput = { ...form };

  // if user selected a new file, upload it now
  if (selectedFile.value) {
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    // if editing and there was an old image, tell backend so it can delete it
    if (form.photo) {
      formData.append("oldUrl", form.photo);
    }

    try {
      const res = await api<{ url: string }>("/api/upload", {
        method: "POST",
        body: formData,
      });

      // use uploaded URL for this product
      payload.photo = res.url;
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image. Product was not saved.");
      return; // ❌ stop here – don't create/update product
    }
  }

  emit("submit", payload);
  resetForm();
};

const onCancel = () => {
  resetForm();
  emit("cancelEdit");
};

// 📁 Only keep file locally + generate preview (no upload here)
const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  selectedFile.value = file;

  // new preview from chosen file
  previewUrl.value = URL.createObjectURL(file);
};
</script>

<template>
  <section class="product-form-card">
    <!-- Header -->
    <header class="pf-header">
      <div>
        <h2 class="pf-title">
          {{ isEditMode ? "Edit product" : "Create new product" }}
        </h2>
        <p class="pf-subtitle">
          Configure product details, category, image and stock information.
        </p>
      </div>
    </header>

    <form @submit.prevent="onSubmit" class="pf-form">
      <!-- Name + Category -->
      <div class="pf-grid pf-grid-2">
        <div class="pf-field">
          <label class="pf-label">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="pf-input"
            placeholder="e.g. Batard, Pizza #2"
            required
          />
        </div>

        <div class="pf-field">
          <label class="pf-label">Category</label>
          <select v-model="form.categoryId" class="pf-input" required>
            <option value="" disabled>Select category</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.categoryName }}
            </option>
          </select>
          <p class="pf-help">
            Pickup time rules will follow the selected category.
          </p>
        </div>
      </div>

      <!-- Description -->
      <div class="pf-field">
        <label class="pf-label">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="pf-input pf-textarea"
          placeholder="Short description shown to customers"
        />
      </div>

      <!-- Photo + Price -->
      <div class="pf-grid pf-grid-2">
        <!-- Image upload -->
        <div class="pf-field">
          <label class="pf-label">Product image</label>

          <div class="pf-upload">
            <div class="pf-upload-main">
              <input
                type="file"
                accept="image/*"
                class="pf-file"
                @change="onFileChange"
              />
              <p class="pf-help">Upload a JPG/PNG image (max 5MB).</p>
            </div>

            <!-- ✅ Preview priority: new file previewUrl > existing photo > "No image" -->
            <div v-if="previewUrl" class="pf-thumb">
              <img :src="previewUrl" alt="Preview" />
            </div>
            <div v-else-if="form.photo" class="pf-thumb">
              <img :src="form.photo" alt="Preview" />
            </div>
            <div v-else class="pf-thumb pf-thumb-empty">No image</div>
          </div>
        </div>

        <!-- Price -->
        <div class="pf-field">
          <label class="pf-label">Price (DKK)</label>
          <input
            v-model.number="form.price"
            type="number"
            min="0"
            step="0.5"
            class="pf-input"
            required
          />
        </div>
      </div>

      <!-- Stock / daily capacity / active -->
      <div class="pf-grid pf-grid-3">
        <div class="pf-field">
          <label class="pf-label">Stock</label>
          <input
            v-model.number="form.stock"
            type="number"
            min="0"
            class="pf-input"
            required
          />
          <p class="pf-help">Current available pieces in store.</p>
        </div>

        <div class="pf-field">
          <label class="pf-label">Daily capacity</label>
          <input
            v-model.number="form.dailyCapacity"
            type="number"
            min="0"
            class="pf-input"
            required
          />
          <p class="pf-help">Maximum pieces baked per day.</p>
        </div>

        <div class="pf-field pf-checkbox-wrap">
          <label class="pf-checkbox-label">
            <input v-model="form.active" type="checkbox" class="pf-checkbox" />
            Active (visible to customers)
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="pf-actions">
        <button
          v-if="isEditMode"
          type="button"
          class="pf-btn pf-btn-ghost"
          @click="onCancel"
        >
          Cancel
        </button>

        <button type="submit" class="pf-btn pf-btn-primary">
          {{ isEditMode ? "Save changes" : "Create product" }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.product-form-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

/* Header */
.pf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.pf-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}
.pf-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.1rem;
}

/* Form */
.pf-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Grids */
.pf-grid {
  display: grid;
  gap: 0.9rem;
}
.pf-grid-2 {
  grid-template-columns: 1fr;
}
.pf-grid-3 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .pf-grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pf-grid-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Fields */
.pf-field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.pf-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
}

/* Inputs */
.pf-input {
  border-radius: 7px;
  border: 1px solid #d1d5db;
  padding: 0.4rem 0.65rem;
  font-size: 0.85rem;
  outline: none;
  background: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.pf-input:focus {
  border-color: #6f7d75;
  box-shadow: 0 0 0 1px #6f7d7522;
}
.pf-textarea {
  resize: vertical;
}

/* Help text */
.pf-help {
  font-size: 0.7rem;
  color: #6b7280;
}

/* Upload */
.pf-upload {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
  background: #f9fafb;
  padding: 0.5rem 0.6rem;
}
.pf-upload-main {
  flex: 1;
}
.pf-file {
  font-size: 0.7rem;
}
.pf-thumb {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #d1d5db;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pf-thumb-empty {
  font-size: 0.7rem;
  color: #9ca3af;
}

/* Checkbox */
.pf-checkbox-wrap {
  justify-content: flex-end;
}
.pf-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  color: #374151;
  margin-top: 0.5rem;
}
.pf-checkbox {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  border: 1px solid #9ca3af;
}

/* Actions */
.pf-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.3rem;
}
.pf-btn {
  font-size: 0.8rem;
  border-radius: 999px;
  padding: 0.35rem 1rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.15s ease;
}
.pf-btn-primary {
  border-color: #111827;
  background: #111827;
  color: #ffffff;
}
.pf-btn-primary:hover {
  background: #000000;
}
.pf-btn-ghost {
  border-color: #d1d5db;
  background: #ffffff;
  color: #374151;
}
.pf-btn-ghost:hover {
  background: #f3f4f6;
}
</style>
<style scoped>
.product-form-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

/* Header */
.pf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.pf-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}
.pf-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.1rem;
}

/* Form */
.pf-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Grids */
.pf-grid {
  display: grid;
  gap: 0.9rem;
}
.pf-grid-2 {
  grid-template-columns: 1fr;
}
.pf-grid-3 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .pf-grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pf-grid-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Fields */
.pf-field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.pf-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
}

/* Inputs */
.pf-input {
  border-radius: 7px;
  border: 1px solid #d1d5db;
  padding: 0.4rem 0.65rem;
  font-size: 0.85rem;
  outline: none;
  background: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.pf-input:focus {
  border-color: #6f7d75;
  box-shadow: 0 0 0 1px #6f7d7522;
}

.pf-textarea {
  resize: vertical;
}

/* smaller description textarea */
.pf-textarea-small {
  min-height: 50px;
  max-height: 90px;
}

/* Help text */
.pf-help {
  font-size: 0.7rem;
  color: #6b7280;
}

/* Upload */
.pf-upload {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
  background: #f9fafb;
  padding: 0.5rem 0.6rem;
  margin-bottom: 0.45rem;
}
.pf-upload-main {
  flex: 1;
}
.pf-file {
  font-size: 0.7rem;
}
.pf-thumb {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #d1d5db;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pf-thumb-empty {
  font-size: 0.7rem;
  color: #9ca3af;
}

/* Right column above price */
.pf-right-col {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

/* Price inline under image */
.pf-price-inline {
  margin-top: 0.1rem;
}
.pf-input-price {
  max-width: 140px;
}

/* Checkbox */
.pf-checkbox-wrap {
  justify-content: flex-end;
}
.pf-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  color: #374151;
  margin-top: 0.5rem;
}
.pf-checkbox {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  border: 1px solid #9ca3af;
}

/* Actions */
.pf-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.3rem;
}
.pf-btn {
  font-size: 0.8rem;
  border-radius: 999px;
  padding: 0.35rem 1rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.15s ease;
}
.pf-btn-primary {
  border-color: #111827;
  background: #111827;
  color: #ffffff;
}
.pf-btn-primary:hover {
  background: #000000;
}
.pf-btn-ghost {
  border-color: #d1d5db;
  background: #ffffff;
  color: #374151;
}
.pf-btn-ghost:hover {
  background: #f3f4f6;
}
</style>
