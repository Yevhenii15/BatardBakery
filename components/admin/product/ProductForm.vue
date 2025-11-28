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
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

const resetForm = () => {
  Object.assign(form, createEmptyForm());
  selectedFile.value = null;
  previewUrl.value = null;
};

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return resetForm();
    Object.assign(form, val);
    previewUrl.value = val.photo || null;
    selectedFile.value = null;
  },
  { immediate: true }
);

const api = useApiClient();

const onSubmit = async () => {
  const payload: ProductInput = { ...form };

  if (selectedFile.value) {
    const formData = new FormData();
    formData.append("file", selectedFile.value);
    if (form.photo) formData.append("oldUrl", form.photo);

    try {
      const res = await api<{ url: string }>("/api/upload", {
        method: "POST",
        body: formData,
      });
      payload.photo = res.url;
    } catch (err) {
      alert("Failed to upload image.");
      return;
    }
  }

  emit("submit", payload);
  resetForm();
};

const onCancel = () => {
  resetForm();
  emit("cancelEdit");
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
};
</script>

<template>
  <div class="form-container">
    <h2 class="form-title">{{ isEditMode ? "Edit Product" : "Create Product" }}</h2>

    <form class="form-inner" @submit.prevent="onSubmit">
      
      <!-- Name -->
      <label>Product Name</label>
      <input v-model="form.name" type="text" required />

      <!-- Category -->
      <label>Category</label>
      <select v-model="form.categoryId" required>
        <option disabled value="">Select a category</option>
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">
          {{ cat.categoryName }}
        </option>
      </select>

      <!-- Description -->
      <label>Description</label>
      <textarea v-model="form.description" rows="3" placeholder="Product description" />

      <!-- Image + Price -->
      <div class="row-2">
        <div class="column">
          <label>Product Image</label>
          <input type="file" accept="image/*" @change="onFileChange" />

          <div class="image-preview">
            <img v-if="previewUrl" :src="previewUrl" alt="Preview" />
            <img v-else-if="form.photo" :src="form.photo" alt="Preview" />
            <div v-else class="no-image">No image</div>
          </div>
        </div>

        <div class="column">
          <label>Price (DKK)</label>
          <input v-model.number="form.price" type="number" min="0" step="0.5" required />
        </div>
      </div>

      <!-- Stock + Daily Capacity -->
      <div class="row-2">
        <div class="column">
          <label>Stock</label>
          <input v-model.number="form.stock" type="number" min="0" required />
        </div>

        <div class="column">
          <label>Daily Capacity</label>
          <input v-model.number="form.dailyCapacity" type="number" min="0" required />
        </div>
      </div>

      <!-- Active -->
      <div class="checkbox-wrap">
        <label>
          <input type="checkbox" v-model="form.active" />
          Active (visible to customers)
        </label>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button v-if="isEditMode" type="button" class="btn-cancel" @click="onCancel">Cancel</button>
        <button type="submit" class="btn-submit">
          {{ isEditMode ? "Save Changes" : "Create Product" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  margin: 20px auto; /* center */
  background: #5d7261;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.4);
  color: white;
}

/* Title */
.form-title {
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 1.4rem;
  text-align: center; /* nicer layout */
}

/* Layout */
.form-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Labels */
label {
  color: #e8e8e8;
  font-size: 15px;
  margin-bottom: 4px;
}

/* Inputs */
input,
select,
textarea {
  background: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px;
  width: 100%;
  font-size: 14px;
  outline: none;
}

input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 2px #3c4d3e;
}

/* Reduce bigger fields */
textarea {
  resize: vertical;
  min-height: 70px;
}

/* Adjust column widths */
.row-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

@media (min-width: 650px) {
  .row-2 {
    grid-template-columns: 1.2fr 0.8fr; /* ⬅ tighter on right inputs */
  }
}

/* Image preview adjustments */
.image-preview {
  margin-top: 6px;
  width: 90px;
  height: 90px;
  border-radius: 8px;
  background: #ffffff33;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: #e8e8e8;
  font-size: 10px;
  text-align: center;
}

/* Checkbox layout */
.checkbox-wrap {
  margin-top: 4px;
  display: flex;
  align-items: center;
}

/* Buttons */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 5px;
}

button {
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.2s ease;
  border: none;
  white-space: nowrap;
}

.btn-cancel {
  background: #976d6d;
  color: white;
}

.btn-cancel:hover {
  background: #b97777;
}

.btn-submit {
  background: #334334;
  color: white;
  font-weight: bold;
}

.btn-submit:hover {
  background: #1d281d;
}
</style>

