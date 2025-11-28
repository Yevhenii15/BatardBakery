<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type {
  Category,
  CategoryInput,
} from "~/composables/useCategory";

const props = defineProps<{
  modelValue: Category | null;
}>();

const emit = defineEmits<{
  (e: "submit", payload: CategoryInput): void;
  (e: "cancelEdit"): void;
}>();

const isEditMode = computed(() => !!props.modelValue);

const emptyState = (): CategoryInput => ({
  categoryName: "",
  weekdayTime: { from: "", to: "" },
  weekendsTime: { from: "", to: "" },
  slotSizeMinutes: 5,
  leadTimeMinutes: 0,
});

const form = reactive<CategoryInput>(emptyState());

const resetForm = () => Object.assign(form, emptyState());

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return resetForm();
    form.categoryName = val.categoryName;
    form.weekdayTime = { ...val.weekdayTime };
    form.weekendsTime = { ...val.weekendsTime };
    form.slotSizeMinutes = val.slotSizeMinutes;
    form.leadTimeMinutes = val.leadTimeMinutes;
  },
  { immediate: true }
);

const onSubmit = () => {
  emit("submit", { ...form });
  resetForm();
};

const onCancel = () => {
  resetForm();
  emit("cancelEdit");
};
</script>

<template>
  <div class="form-container">
    <h2 class="form-title">
      {{ isEditMode ? "Edit Category" : "Create Category" }}
    </h2>

    <form @submit.prevent="onSubmit" class="form-inner">
      <!-- Category Name -->
      <label>Category Name</label>
      <input v-model="form.categoryName" type="text" required />

      <!-- Weekday -->
      <label>Weekday Time (Mon–Fri)</label>
      <div class="row">
        <input type="time" v-model="form.weekdayTime.from" required />
        <span>to</span>
        <input type="time" v-model="form.weekdayTime.to" required />
      </div>

      <!-- Weekend -->
      <label>Weekend Time (Sat–Sun)</label>
      <div class="row">
        <input type="time" v-model="form.weekendsTime.from" required />
        <span>to</span>
        <input type="time" v-model="form.weekendsTime.to" required />
      </div>

      <!-- Numbers -->
      <div class="row-2">
        <div class="column">
          <label>Slot Size (minutes)</label>
          <input type="number" v-model.number="form.slotSizeMinutes" required />
        </div>

        <div class="column">
          <label>Lead Time (minutes)</label>
          <input type="number" v-model.number="form.leadTimeMinutes" required />
        </div>
      </div>

      <!-- Buttons -->
      <div class="actions">
        <button v-if="isEditMode" type="button" class="btn-cancel" @click="onCancel">
          Cancel
        </button>
        <button type="submit" class="btn-submit">
          {{ isEditMode ? "Save Changes" : "Create Category" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  width: 100%;
  color: #ffffff;
}

.form-title {
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
}

.form-inner {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

label {
  color: #e8e8e8;
  font-size: 15px;
  margin-bottom: -2px;
}

input {
  background: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px;
  width: 100%;
  font-size: 14px;
  outline: none;
}

input:focus {
  box-shadow: 0 0 0 2px #3c4d3e;
}

.row {
  display: flex;
  gap: 30px;
  align-items: center;
}

.row span {
  color: #d3d3d3;
  width: 40px;
  font-size: 18px;
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

button {
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.2s ease;
  border: none;
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
