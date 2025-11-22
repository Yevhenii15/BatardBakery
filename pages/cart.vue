<template>
  <div class="cart-page">
    <!-- Dimmed background (just for feeling of a panel) -->
    <div class="cart-backdrop"></div>

    <!-- RIGHT PANEL -->
    <section class="cart-panel">
      <!-- Header -->
      <header class="cart-header">
        <div>
          <h1>Your cart</h1>
          <p class="subtitle">Review your items before checkout.</p>
        </div>

        <button class="close-btn" @click="$router.push('/products')">×</button>
      </header>

      <!-- Empty state -->
      <div v-if="items.length === 0" class="empty-cart">
        <p>Your cart is empty.</p>
        <NuxtLink to="/products" class="primary-btn">
          Browse products
        </NuxtLink>
      </div>

      <!-- Cart content -->
      <div v-else class="cart-content">
        <!-- Items list -->
        <div class="items-list">
          <article
            v-for="item in items"
            :key="item.productId"
            class="cart-item"
          >
            <div class="thumb-wrap">
              <img
                :src="item.photo || '/img/placeholder.jpg'"
                :alt="item.name"
                class="thumb"
              />
            </div>

            <div class="main-info">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-price">{{ item.price.toFixed(2) }} DKK</p>

              <!-- Quantity controls -->
              <div class="qty-row">
                <div class="qty-controls">
                  <button
                    type="button"
                    @click="decrease(item)"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button
                    type="button"
                    @click="increase(item)"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <p class="subtotal">
                  {{ (item.price * item.quantity).toFixed(2) }} DKK
                </p>
              </div>
            </div>

            <!-- Remove button -->
            <button
              class="remove-btn"
              type="button"
              @click="removeItem(item.productId)"
              aria-label="Remove from cart"
            >
              ✕
            </button>
          </article>
        </div>

        <!-- Footer: total and actions -->
        <footer class="cart-footer">
          <div class="total-row">
            <span>Total</span>
            <strong>{{ totalPrice.toFixed(2) }} DKK</strong>
          </div>

          <div class="actions">
            <button class="secondary-btn" type="button" @click="clearCart">
              Clear cart
            </button>

            <NuxtLink to="/checkout" class="primary-btn">
              Go to checkout →
            </NuxtLink>
          </div>
        </footer>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCart } from "~/composables/useCart";

const { items, totalPrice, setQuantity, removeItem, clearCart } = useCart();

const decrease = (item: any) => {
  const next = item.quantity - 1;
  setQuantity(item.productId, next);
};

const increase = (item: any) => {
  const next = item.quantity + 1;
  setQuantity(item.productId, next);
};
</script>

<style scoped>
.cart-page {
  position: relative;
  min-height: 100vh;
  background: #f4f4f4;
  display: flex;
  justify-content: flex-end;
}

/* Slight dark overlay on left side (optional) */
.cart-backdrop {
  flex: 1;
  background: rgba(0, 0, 0, 0.02);
}

/* Panel */
.cart-panel {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08);
  padding: 2rem 2rem 2.5rem;
  display: flex;
  flex-direction: column;
}

@media (min-width: 900px) {
  .cart-panel {
    max-width: 50vw; /* roughly half of the screen */
  }
}

/* Header */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cart-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.subtitle {
  font-size: 0.95rem;
  color: #666;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  color: #888;
}

/* Empty cart */
.empty-cart {
  margin-top: 3rem;
  text-align: center;
  font-size: 1rem;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* List */
.cart-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.items-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.3rem;
}

/* Single item */
.cart-item {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.thumb-wrap {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f1f1;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.item-price {
  font-size: 0.9rem;
  color: #666;
}

/* Quantity + subtotal */
.qty-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.qty-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid #ddd;
  padding: 0.1rem 0.35rem;
}

.qty-controls button {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: none;
  background: #6f7d75;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.qty-controls span {
  min-width: 20px;
  text-align: center;
  font-size: 0.95rem;
}

.subtotal {
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
}

.remove-btn {
  border: none;
  background: transparent;
  font-size: 1.3rem;
  color: #b33;
  cursor: pointer;
}

/* Footer */
.cart-footer {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  margin-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.total-row span {
  color: #555;
}

.total-row strong {
  color: #222;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.primary-btn,
.secondary-btn {
  flex: 1;
  text-align: center;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

/* Buttons */
.primary-btn {
  background: #6f7d75;
  color: #fff;
  border: none;
}

.primary-btn:hover {
  background: #4f5c55;
}

.secondary-btn {
  background: #f3f3f3;
  color: #333;
  border: 1px solid #ddd;
}

.secondary-btn:hover {
  background: #e6e6e6;
}
</style>
