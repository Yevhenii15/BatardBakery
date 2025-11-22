<template>
  <Navbar />
  <section class="order-of-products">
    <!-- ===== BACK BUTTON ===== -->
    <button class="back-btn" @click="$router.push('/')">
      <svg viewBox="0 0 24 24" class="arrow-icon">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- ===== PAGE HEADER ===== -->
    <section class="order-header">
      <h1 class="order-title">ORDER</h1>
      <p class="order-subtitle">Skip the line – pick up in the bakery</p>
    </section>

    <section class="products">
      <!-- Loading / error -->
      <div v-if="loading" class="text-center text-sm text-gray-600 mb-6">
        Loading products…
      </div>
      <div v-if="error" class="text-center text-sm text-red-600 mb-6">
        {{ error }}
      </div>

      <!-- Dynamic categories from DB -->
      <div
        v-for="section in sections"
        :key="section.category._id"
        class="category"
      >
        <h2 class="category-title">
          {{ section.category.categoryName }}
        </h2>

        <div v-if="section.items.length" class="product-grid">
          <div
            v-for="item in section.items"
            :key="item._id"
            class="product-card"
          >
            <div class="product-image">
              <img
                :src="item.photo || '/img/placeholder.jpg'"
                :alt="item.name"
              />
            </div>

            <h3 class="product-name">{{ item.name }}</h3>

            <p class="product-price">{{ item.price.toFixed(2) }} DKK</p>

            <div class="product-actions">
              <NuxtLink class="product-btn" :to="`/product/${item._id}`">
                View details
              </NuxtLink>

              <button
                type="button"
                class="product-btn"
                @click="handleAddToCart(item)"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <p v-else class="text-sm text-gray-500 ml-4 mb-8">
          No products in this category yet.
        </p>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useCategory } from "~/composables/useCategory";
import { useProduct } from "~/composables/useProduct";
import { useCart } from "~/composables/useCart";
import Navbar from "~/components/NavbarView.vue";

const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
  getCategories,
} = useCategory();

const {
  products,
  loading: productsLoading,
  error: productsError,
  getProducts,
} = useProduct();

const { addItem } = useCart();

const loading = computed(
  () => categoriesLoading.value || productsLoading.value
);

const error = computed(() => categoriesError.value || productsError.value);

const sections = computed(() =>
  categories.value
    .map((cat) => ({
      category: cat,
      items: products.value.filter(
        (p) => p.categoryId === cat._id && p.active !== false
      ),
    }))
    .filter((section) => section.items.length > 0)
);

onMounted(async () => {
  await Promise.all([getCategories(), getProducts()]);
});

const handleAddToCart = (product: any) => {
  addItem(product, 1);
};
</script>

<style scoped>
.order-of-products {
  position: relative;
  top: 80px;
}
/* ===== BACK BUTTON ===== */
.back-btn {
  position: fixed;
  top: 100px; /* below navbar (which is ~70–80px high) */
  left: 25px;
  width: 48px;
  height: 48px;
  background: #6f7d75;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1100; /* higher than navbar’s 1000 */
  transition: 0.25s ease;
}

.back-btn:hover {
  background: #4f5c55;
  transform: scale(1.07);
}

/* Arrow icon inside circle */
.arrow-icon {
  width: 22px;
  height: 22px;
  color: white;
}

/* ===== ORDER PAGE HEADER ===== */
.order-header {
  text-align: center;
  background: #f4f4f4;
  padding: 3rem 2rem 2rem;
  margin: 0;
}

.order-title {
  font-size: 5rem;
  letter-spacing: 4px;
  color: #6f7d75; /* same green/grey as Batard */
  font-weight: 700;
  margin: 0;
  font-family: "Tungsten", "Arial Narrow", sans-serif;
}

.order-subtitle {
  font-size: 1.4rem;
  color: #333;
  margin-top: 1rem;
  font-weight: 600;
}

/* Page Wrapper */
.products {
  padding: 4rem 2rem;
  background: #f4f4f4;
}

/* Category Title */
.category-title {
  font-size: 3rem;
  margin-bottom: 2rem;
  margin-left: 1rem;
  color: #1d2a3a;
  font-weight: 700;
  letter-spacing: 2px;
}

.product-grid {
  display: grid;
  gap: 2.5rem;
  padding: 1rem;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Card */
.product-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

/* Placeholder image box */
.product-image {
  width: 100%;
  height: 230px;
  border-radius: 12px;
  overflow: hidden;
  background: #d2d2d2;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Product name */
.product-name {
  margin-top: 1rem;
  font-size: 1.4rem;
  color: #395153;
  font-weight: 700;
}

/* Price */
.product-price {
  margin: 0.4rem 0 1rem;
  font-size: 1.2rem;
  color: #333;
}

.product-actions {
  display: flex;
  gap: 12px; /* space between buttons */
  justify-content: center;
  margin-top: 12px;
}

.product-btn {
  background: #6f7d75;
  color: white;
  border: none;
  padding: 0.7rem 1.6rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.25s ease;
  text-decoration: none;
  display: inline-flex; /* important! */
  align-items: center;
  justify-content: center;
}

.product-btn:hover {
  background: #4f5c55;
  transform: scale(1.05);
}
</style>
