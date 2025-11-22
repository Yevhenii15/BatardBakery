<template>
  <Navbar />
  <!-- BACK BUTTON -->
  <button class="back-btn" @click="router.back()">
    <svg viewBox="0 0 24 24" class="arrow-icon">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  <!-- LOADING / ERROR -->
  <section v-if="loading" class="product-details">
    <p class="loading-text">Loading product…</p>
  </section>

  <section v-else-if="error" class="product-details">
    <p class="error-text">{{ error }}</p>
  </section>

  <!-- PRODUCT FOUND -->
  <section v-else-if="product" class="product-details">
    <div class="product-wrapper">
      <div class="info">
        <h1 class="title">{{ product.name }}</h1>

        <p class="description">
          {{ product.description || "Description will be added soon..." }}
        </p>

        <p class="price">{{ product.price.toFixed(2) }} DKK</p>

        <button class="add-to-cart-btn" type="button" @click="handleAddToCart">
          Add to cart
        </button>
      </div>

      <div class="image-box">
        <img
          :src="product.photo || '/img/placeholder.jpg'"
          :alt="product.name"
        />
      </div>
    </div>
  </section>

  <!-- PRODUCT NOT FOUND -->
  <section v-else class="not-found">
    <h2>Product not found</h2>
    <NuxtLink to="/products" class="back-link"> Back to products </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProduct } from "~/composables/useProduct";
import { useCart } from "~/composables/useCart";
import Navbar from "~/components/NavbarView.vue";

const route = useRoute();
const router = useRouter();

const { product, loading, error, getProductById } = useProduct();
const { addItem } = useCart();

onMounted(async () => {
  const id = route.params.id as string;
  if (id) {
    await getProductById(id);
  }
});

const handleAddToCart = () => {
  if (product.value) {
    addItem(product.value, 1);
  }
};
</script>

<style scoped>
.back-btn {
  position: fixed;
  top: 100px; /* 👈 moved down */
  left: 25px;
  width: 48px;
  height: 48px;
  background: #6f7d75;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transition: 0.25s ease;
}

.back-btn:hover {
  background: #4f5c55;
  transform: scale(1.07);
}

.arrow-icon {
  width: 22px;
  height: 22px;
}

/* Layout */
.product-details {
  padding: 6rem 2rem;
  background: #f4f4f4;
  min-height: 100vh;
}

.product-wrapper {
  position: relative;
  top: 80px;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: 3rem;
  align-items: center;
  flex-wrap: wrap;
}

.info {
  flex: 1 1 320px;
}

.image-box {
  flex: 1 1 320px;
  display: flex;
  justify-content: center;
}

.image-box img {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 3rem;
  color: #6f7d75;
  margin-bottom: 1rem;
  font-weight: 700;
}

.description {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
  max-width: 560px;
}

.price {
  font-size: 1.6rem;
  margin-top: 1.5rem;
  font-weight: 600;
  color: #1d2a3a;
}

.add-to-cart-btn {
  margin-top: 1.5rem;
  padding: 0.8rem 1.8rem;
  border-radius: 6px;
  border: none;
  background: #6f7d75;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.add-to-cart-btn:hover {
  background: #4f5c55;
  transform: scale(1.03);
}

.loading-text,
.error-text {
  text-align: center;
  font-size: 1rem;
  margin-top: 5rem;
  color: #555;
}

.error-text {
  color: #c53030;
}

.not-found {
  padding: 6rem 2rem;
  text-align: center;
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.back-link {
  color: #6f7d75;
  text-decoration: underline;
  font-size: 0.95rem;
}
</style>
