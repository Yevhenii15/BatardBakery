<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCategory } from "~/composables/useCategory";
import CategoryForm from "~/components/admin/category/CategoryForm.vue";
import CategoryTable from "~/components/admin/category/CategoryTable.vue";

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
    const ok = await updateCategory(editingCategoryId.value, payload);
    if (ok) {
      editingCategoryId.value = null;
      category.value = null;
    }
  } else {
    const ok = await createCategory(payload);
    if (ok) category.value = null;
  }
};

const handleEdit = (cat: any) => {
  editingCategoryId.value = cat._id;
  category.value = { ...cat };
};

const handleCancelEdit = () => {
  editingCategoryId.value = null;
  category.value = null;
};

const handleDelete = async (id: string) => {
  if (!confirm("Are you sure?")) return;
  await deleteCategory(id);
};

onMounted(async () => {
  await getCategories();
});
</script>

<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <div class="back-btn-wrapper">
        <NuxtLink to="/admin" class="back-btn">← </NuxtLink>
      </div>
      <h1 class="admin-title">Category Management</h1>
      <p class="admin-subtitle">
        Configure pickup time rules and scheduling logic for bakery categories.
      </p>

      <div v-if="error" class="alert-error">{{ error }}</div>

      <div class="admin-card">
        <CategoryForm
          :model-value="category"
          @submit="handleSubmit"
          @cancelEdit="handleCancelEdit"
        />
      </div>

      <div class="admin-card">
        <CategoryTable
          :categories="categories"
          :loading="loading"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.back-btn-wrapper {
  text-align: left;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-block;
  background: #3b4b3d;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  transition: 0.2s ease;
  font-weight: bold;
}

.back-btn:hover {
  background: #283529;
}

.admin-wrapper {
  background: #211a1a;
  min-height: 100vh;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.admin-container {
  background: #5d7261;
  width: 90%;
  max-width: 1100px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0px 0px 35px rgba(0, 0, 0, 0.45);
  text-align: center;
}

.admin-title {
  font-size: 32px;
  font-family: Georgia, serif;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.admin-subtitle {
  color: #e7e7e7;
  margin-bottom: 30px;
  font-size: 15px;
}

.alert-error {
  background: #c67b7b;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}
</style>
