<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  useProduct,
  type Product,
  type ProductInput,
} from "~/composables/useProduct";
import { useCategory, type Category } from "~/composables/useCategory";

import AdminProductForm from "~/components/admin/product/ProductForm.vue";
import AdminProductTable from "~/components/admin/product/ProductTable.vue";

// composables
const {
  products,
  loading: productsLoading,
  error: productsError,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = useProduct();

const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
  getCategories,
} = useCategory();

// which product is being edited (null = create mode)
const editingProduct = ref<Product | null>(null);

const loading = computed(
  () => productsLoading.value || categoriesLoading.value
);

const error = computed(() => productsError.value || categoriesError.value);

// load initial data
onMounted(async () => {
  await Promise.all([getCategories(), getProducts()]);
});

// when form is submitted
const handleSubmit = async (payload: ProductInput) => {
  if (editingProduct.value) {
    // UPDATE
    const ok = await updateProduct(editingProduct.value._id, payload);
    if (!ok) return;
  } else {
    // CREATE
    const ok = await createProduct(payload);
    if (!ok) return;
  }

  editingProduct.value = null;

  // refresh list
  await getProducts();
};

// when clicking "Edit" in table
const handleEdit = (product: Product) => {
  editingProduct.value = product;
};

// when clicking "Delete" in table
const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const ok = await deleteProduct(id);
  if (!ok) return;

  await getProducts();

  // if we deleted the product currently being edited, reset the form
  if (editingProduct.value?._id === id) {
    editingProduct.value = null;
  }
};

// cancel editing, clear form
const handleCancelEdit = () => {
  editingProduct.value = null;
};
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Products</h1>
        <p class="text-sm text-gray-500 mt-1">
          Manage all products, their categories, images, prices and stock.
        </p>
      </div>

      <div v-if="loading" class="text-xs text-gray-500">Loading…</div>
    </header>

    <!-- Error -->
    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Layout: form + table -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Form -->
      <div class="xl:col-span-1">
        <AdminProductForm
          :key="editingProduct ? editingProduct._id : 'new'"
          :modelValue="editingProduct"
          :categories="categories as Category[]"
          @submit="handleSubmit"
          @cancelEdit="handleCancelEdit"
        />
      </div>

      <!-- Table -->
      <div class="xl:col-span-2">
        <AdminProductTable
          :products="products"
          :categories="categories"
          :loading="productsLoading"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>
