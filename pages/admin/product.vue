<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useProduct } from "~/composables/useProduct";
import { useCategory } from "~/composables/useCategory";
import ProductForm from "~/components/admin/product/ProductForm.vue";
import ProductTable from "~/components/admin/product/ProductTable.vue";

// Optional admin auth middleware
// definePageMeta({
//   middleware: "admin",
// });

const {
  products,
  product,
  loading,
  error,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = useProduct();

const { categories, getCategories } = useCategory();

const editingProductId = ref<string | null>(null);

const handleSubmit = async (payload: any) => {
  if (editingProductId.value) {
    const ok = await updateProduct(editingProductId.value, payload);
    if (ok) {
      editingProductId.value = null;
      product.value = null;
    }
  } else {
    await createProduct(payload);
  }
};

const handleEdit = (p: any) => {
  editingProductId.value = p._id;
  product.value = p;
};

const handleCancelEdit = () => {
  editingProductId.value = null;
  product.value = null;
};

const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this product?")) return;
  await deleteProduct(id);
};

onMounted(async () => {
  await Promise.all([getCategories(), getProducts()]);
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <main class="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header class="space-y-2">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
          Product management
        </h1>
        <p class="text-sm text-gray-600 max-w-2xl">
          Manage all products that can be ordered online. Each product is linked
          to a category which controls its pickup logic.
        </p>
      </header>

      <div
        v-if="error"
        class="border border-gray-300 bg-white rounded-lg px-4 py-3 text-sm text-gray-800"
      >
        {{ error }}
      </div>

      <div class="grid grid-cols-1 gap-6">
        <ProductForm
          :model-value="product"
          :categories="categories"
          @submit="handleSubmit"
          @cancelEdit="handleCancelEdit"
        />

        <ProductTable
          :products="products"
          :categories="categories"
          :loading="loading"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </main>
  </div>
</template>
