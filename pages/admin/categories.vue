<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCategory } from "~/composables/useCategory";
import CategoryForm from "../../components/admin/category/CategoryForm.vue";
import CategoryTable from "../../components/admin/category/CategoryTable.vue";

const {
  categories,
  category,
  loading,
  error,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useCategory();

const editingCategoryId = ref<string | null>(null);

const handleSubmit = async (payload: any) => {
  if (editingCategoryId.value) {
    // ✅ EDIT MODE
    const ok = await updateCategory(editingCategoryId.value, payload);
    if (ok) {
      editingCategoryId.value = null;
      category.value = null; // << very important, clears form model
    }
  } else {
    // ✅ CREATE MODE
    const ok = await createCategory(payload);
    if (ok) {
      category.value = null; // stays in create mode, but ensure clean
    }
  }
};

const handleEdit = (cat: any) => {
  editingCategoryId.value = cat._id;
  // clone so we don't mutate table row directly
  category.value = { ...cat };
};

const handleCancelEdit = () => {
  editingCategoryId.value = null;
  category.value = null;
};

const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this category?")) return;
  await deleteCategory(id);
};

onMounted(async () => {
  await getCategories();
});
</script>
<template>
  <div class="max-w-5xl mx-auto py-10 space-y-8">
    <h1 class="text-3xl font-bold">Category Management</h1>

    <p class="text-gray-600">
      Configure pickup time rules and scheduling logic for bakery categories.
    </p>

    <div
      v-if="error"
      class="p-3 rounded bg-gray-100 text-gray-700 text-sm border border-gray-300"
    >
      {{ error }}
    </div>

    <CategoryForm
      :model-value="category"
      @submit="handleSubmit"
      @cancelEdit="handleCancelEdit"
    />

    <CategoryTable
      :categories="categories"
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>
