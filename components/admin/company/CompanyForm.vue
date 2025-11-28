<script setup lang="ts">
import { reactive, watch, computed, ref } from "vue";
import type { Company } from "~/composables/useCompany";

const props = defineProps<{
  company: Company | null;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "submit", payload: Company): void;
}>();

const collapsed = ref(false);
const isLoaded = computed(() => !!props.company);

// local form state
const form = reactive<Company>({
  shortDescription: "",
  description: "",
});

// sync from props whenever company changes
watch(
  () => props.company,
  (val) => {
    if (!val) return;
    form.shortDescription = val.shortDescription ?? "";
    form.description = val.description ?? "";
  },
  { immediate: true }
);

const onSubmit = () => {
  emit("submit", {
    shortDescription: form.shortDescription,
    description: form.description,
  });
};

const toggle = () => (collapsed.value = !collapsed.value);
</script>

<template>
  <div class="form-container">
    <!-- Header with collapse -->
    <div class="form-header">
      <h2 class="form-title">Company information</h2>

      <button class="collapse-btn" type="button" @click="toggle">
        {{ collapsed ? "Show" : "Hide" }}
        <span class="collapse-icon" :class="{ rotated: collapsed }">▾</span>
      </button>
    </div>

    <!-- Error from composable -->
    <p v-if="error" class="error-text">{{ error }}</p>

    <!-- Loading state -->
    <p v-if="loading && !isLoaded" class="loading-text">Loading company…</p>

    <!-- Form -->
    <form v-if="!collapsed" class="form-inner" @submit.prevent="onSubmit">
      <!-- Short description -->
      <div class="field">
        <label>Short description</label>
        <textarea
          v-model="form.shortDescription"
          rows="2"
          placeholder="Short intro used in hero or teaser sections…"
          required
        />
        <p class="hint">A concise 1–2 sentence summary of the bakery.</p>
      </div>

      <!-- Full description -->
      <div class="field field-full">
        <label>Full description</label>
        <textarea
          v-model="form.description"
          rows="6"
          placeholder="Longer story about the bakery, philosophy, history, etc."
          required
        />
        <p class="hint">
          This text can be used on the About page and other long descriptions.
        </p>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button
          type="submit"
          class="btn-submit"
          :disabled="loading || !isLoaded"
        >
          {{ loading ? "Saving…" : "Update company info" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Main container */
.form-container {
  margin: 20px 0;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15);
  color: #333;
}

/* Header */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Title */
.form-title {
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 1.2rem;
  color: #2c2c2c;
}

/* Collapse button */
.collapse-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #d4d4d4;
  background: #f9fafb;
  cursor: pointer;
  font-size: 0.75rem;
  color: #374151;
  transition: 0.2s ease;
}

.collapse-btn:hover {
  background: #f3f4f6;
}

.collapse-icon {
  transition: transform 0.2s ease;
}

.collapse-icon.rotated {
  transform: rotate(180deg);
}

/* Layout */
.form-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 0.8rem;
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
}

/* Labels */
label {
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
}

/* Inputs */
textarea {
  background: #f4f4f4;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 8px 10px;
  width: 100%;
  font-size: 14px;
  outline: none;
  color: #333;
  resize: vertical;
  height: auto;
}

textarea:focus {
  border-color: #5d7261;
  box-shadow: 0 0 0 2px #5d726155;
}

/* Small helper text */
.hint {
  font-size: 0.78rem;
  color: #777;
  margin-top: 4px;
}

/* Error & loading */
.error-text {
  color: #b3261e;
  font-size: 0.9rem;
  margin-top: 0.4rem;
}

.loading-text {
  font-size: 0.85rem;
  color: #4b5563;
  margin-top: 0.4rem;
}

/* Actions */
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

button {
  cursor: pointer;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.2s ease;
  border: none;
  white-space: nowrap;
}

/* Submit button */
.btn-submit {
  background: #5d7261;
  color: white;
  font-weight: bold;
}

.btn-submit:hover {
  background: #46574a;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
