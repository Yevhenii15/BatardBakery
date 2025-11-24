<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
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

const editingProduct = ref<Product | null>(null);

// 🔹 ref to the form container (for scroll on Edit)
const formSection = ref<HTMLElement | null>(null);

const loading = computed(
  () => productsLoading.value || categoriesLoading.value
);

const error = computed(() => productsError.value || categoriesError.value);

// 🔹 scroll helper: scroll to the form (top) when clicking Edit
const scrollToForm = () => {
  nextTick(() => {
    if (!formSection.value) return;

    const rect = formSection.value.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY - 80; // adjust for navbar height

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  });
};

// 🔹 scroll helper: scroll to a product card after create/update
const scrollToProduct = (id: string) => {
  nextTick(() => {
    const el = document.getElementById(`product-${id}`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });
};

onMounted(async () => {
  await Promise.all([getCategories(), getProducts()]);
});

// when form is submitted
const handleSubmit = async (payload: ProductInput) => {
  if (editingProduct.value) {
    // UPDATE
    const id = editingProduct.value._id;
    const ok = await updateProduct(id, payload);
    if (!ok) return;

    // update list locally
    products.value = products.value.map((p) =>
      p._id === id ? { ...p, ...payload, _id: id } : p
    );

    editingProduct.value = null;

    // scroll to updated product
    scrollToProduct(id);
  } else {
    // CREATE
    const ok = await createProduct(payload);
    if (!ok) return;

    await getProducts();

    // find last product in that category
    const lastInCategory = [...products.value]
      .reverse()
      .find((p) => p.categoryId === payload.categoryId);

    if (lastInCategory?._id) {
      scrollToProduct(lastInCategory._id);
    }
  }
};

// when clicking "Edit" in cards
const handleEdit = (product: Product) => {
  editingProduct.value = product;
  scrollToForm(); // 🔥 scroll up to the form again
};

// when clicking "Delete"
const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const ok = await deleteProduct(id);
  if (!ok) return;

  await getProducts();

  if (editingProduct.value?._id === id) {
    editingProduct.value = null;
  }
};

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
      <!-- 🔹 Form -->
      <div class="xl:col-span-1" ref="formSection">
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
