<script setup lang="ts">
import type { Booking } from "~/composables/useBooking";

const props = defineProps<{
  booking: Booking;
}>();

// 🔹 Force full reload when going back to products
const goBackToProducts = () => {
  if (import.meta.client) {
    window.location.href = "/products";
  }
};
</script>

<template>
  <div class="success-box">
    <header class="success-header">
      <div>
        <h2>Booking created</h2>

        <p class="success-intro">
          Thank you,
          <strong>{{ booking.customer.firstName }}</strong
          >. Your booking number is <strong>{{ booking.bookingNumber }}</strong
          >.
        </p>

        <p class="success-note">
          Below is a full summary of your booking, including customer details,
          pickup time(s), and all items.
        </p>
      </div>
    </header>

    <div class="success-grid">
      <!-- Customer -->
      <section class="success-card">
        <h3>Customer</h3>
        <div class="card-body">
          <p class="line">
            <span class="label">Name</span>
            <span class="value">
              {{ booking.customer.firstName }} {{ booking.customer.lastName }}
            </span>
          </p>
          <p class="line">
            <span class="label">Phone</span>
            <span class="value">{{ booking.customer.phone }}</span>
          </p>
          <p class="line">
            <span class="label">Email</span>
            <span class="value">{{ booking.customer.email }}</span>
          </p>
        </div>
      </section>

      <!-- Pickup times -->
      <section class="success-card">
        <h3>Pickup time(s)</h3>

        <div class="card-body">
          <ul class="pickup-list">
            <li
              v-for="(p, idx) in booking.pickups"
              :key="idx"
              class="pickup-row"
            >
              <div class="pickup-badge">Pickup {{ idx + 1 }}</div>

              <div class="pickup-details">
                <div class="pickup-main">
                  <span class="pickup-category">{{ p.categoryName }}</span>
                  <span class="pickup-time">
                    {{ p.date }} · {{ p.timeSlot }}
                  </span>
                </div>

                <p v-if="p.orderNotes" class="pickup-notes">
                  Notes: {{ p.orderNotes }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Items -->
      <section class="success-card success-items">
        <h3>Items</h3>

        <div class="card-body card-body--no-padding-top">
          <table class="items-table">
            <thead>
              <tr>
                <th class="col-product">Product</th>
                <th class="col-pickup">Pickup</th>
                <th class="col-qty">Qty</th>
                <th class="col-price">Price</th>
                <th class="col-subtotal">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in booking.items" :key="item.productId">
                <td class="col-product">
                  <div class="item-cell">
                    <img
                      v-if="item.photo"
                      :src="item.photo"
                      :alt="item.name"
                      class="item-thumb"
                    />
                    <div class="item-text">
                      <div class="item-name">{{ item.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="col-pickup">
                  <span class="pill">Pickup {{ item.pickupIndex + 1 }}</span>
                </td>
                <td class="col-qty">
                  {{ item.quantity }}
                </td>
                <td class="col-price">{{ item.price.toFixed(2) }} DKK</td>
                <td class="col-subtotal">
                  {{ item.subtotalPrice.toFixed(2) }} DKK
                </td>
              </tr>
            </tbody>
          </table>

          <div class="success-total">
            <span>Total</span>
            <strong>{{ booking.totalPrice.toFixed(2) }} DKK</strong>
          </div>
        </div>
      </section>
    </div>

    <!-- 🔹 Now a button that reloads the page -->
    <button class="primary-btn mt-4" @click="goBackToProducts">
      Back to products
    </button>
  </div>
</template>

<style scoped>
.success-box {
  max-width: 1100px;
  margin: 2.5rem auto 0;
  background: #ffffff;
  border-radius: 16px;
  padding: 1.8rem 2rem 2.2rem;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e7e7e7;
}

/* Header */
.success-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.success-box h2 {
  font-size: 1.7rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
  color: #2f2f2f;
}

.success-intro {
  font-size: 0.98rem;
  color: #444;
  margin: 0;
}

.success-note {
  font-size: 0.9rem;
  color: #777;
  margin-top: 0.35rem;
}

/* Layout for the three summary blocks */
.success-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.05fr) minmax(0, 1.5fr);
  gap: 1.2rem;
  margin-top: 0.8rem;
}

@media (max-width: 960px) {
  .success-box {
    padding: 1.5rem 1.25rem 1.8rem;
  }

  .success-grid {
    grid-template-columns: 1fr;
  }
}

/* Cards */
.success-card {
  border-radius: 12px;
  border: 1px solid #ececec;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 40%);
  display: flex;
  flex-direction: column;
}

.success-card h3 {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.7rem 0.9rem 0.5rem;
  border-bottom: 1px solid #ececec;
  margin: 0;
  color: #333;
}

.card-body {
  padding: 0.75rem 0.95rem 0.9rem;
}

.card-body--no-padding-top {
  padding-top: 0.4rem;
}

/* Customer lines */
.success-card .line {
  display: grid;
  grid-template-columns: 0.9fr 1.3fr;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.25rem 0;
}

.label {
  color: #777;
  text-align: start;
}

.value {
  font-weight: 500;
  color: #222;
  text-align: right;
  word-break: break-word;
  text-align: start;
}

/* Pickup list */
.pickup-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pickup-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.6rem 0.75rem;
  align-items: flex-start;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.pickup-row:last-child {
  border-bottom: none;
}

.pickup-badge {
  font-size: 0.75rem;
  padding: 0.18rem 0.6rem;
  border-radius: 999px;
  border: 1px solid #d7d7d7;
  background: #ffffff;
  color: #555;
  white-space: nowrap;
}

.pickup-details {
  font-size: 0.9rem;
}

.pickup-main {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.pickup-category {
  font-weight: 600;
  color: #333;
}

.pickup-time {
  color: #666;
  font-size: 0.85rem;
}

.pickup-notes {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
}

/* Items table */
.success-items {
  background: #ffffff;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.2rem;
  font-size: 0.9rem;
}

.items-table th,
.items-table td {
  padding: 0.45rem 0.35rem;
  border-bottom: 1px solid #f0f0f0;
}

.items-table thead th {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #888;
  font-weight: 600;
}

.items-table tbody tr:last-child td {
  border-bottom: none;
}

.col-product {
  width: 40%;
  text-align: left;
}

.col-pickup {
  width: 15%;
  text-align: center;
}

.col-qty {
  width: 8%;
  text-align: center;
}

.col-price,
.col-subtotal {
  width: 18%;
  text-align: right;
}

.item-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-thumb {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  object-fit: cover;
  background: #f1f1f1;
}

.item-text .item-name {
  font-size: 0.9rem;
  color: #333;
}

/* Small pill for pickup index in table */
.pill {
  display: inline-flex;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  border: 1px solid #dedede;
  font-size: 0.78rem;
  color: #555;
  background: #fafafa;
}

/* Total at the bottom of success items */
.success-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.7rem;
  font-size: 0.98rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}

.success-total span {
  color: #666;
}

/* Button */
.primary-btn {
  margin-top: 1.6rem;
  background: #6f7d75;
  color: #fff;
  border: none;
  padding: 0.7rem 1.6rem;
  font-size: 0.95rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.primary-btn:hover {
  background: #4f5c55;
}
</style>
