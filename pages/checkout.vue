<template>
  <Navbar />

  <main class="checkout-page">
    <!-- Back button -->
    <button class="back-btn" @click="$router.push('/products')">
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

    <section class="checkout-container">
      <header class="checkout-header">
        <h1>Checkout</h1>
        <p v-if="!success">Fill in your details and choose pickup time.</p>
      </header>

      <!-- Error from form / API -->
      <p v-if="formError" class="error-text">{{ formError }}</p>
      <p v-if="bookingError" class="error-text">{{ bookingError }}</p>

      <!-- Empty cart -->
      <div v-if="items.length === 0 && !success" class="empty-state">
        <p>Your cart is empty.</p>
        <NuxtLink to="/products" class="primary-btn"> Go to products </NuxtLink>
      </div>

      <!-- SUCCESS (FULL SCREEN) -->
      <CheckoutSuccessSummary v-if="success && booking" :booking="booking" />

      <!-- MAIN CHECKOUT FORM -->
      <div v-if="items.length > 0 && !success" class="checkout-grid">
        <section class="left-column">
          <CustomerForm v-model:customer="customer" />
          <PickupGroupsForm
            v-model:groups="pickupGroups"
            v-model:date="pickupDate"
            :today="today"
            :timeSlots="timeSlots"
          />
        </section>

        <section class="right-column">
          <OrderSummary
            :items="items"
            :totalPrice="totalPrice"
            :submitting="submitting"
            @submit="handleSubmit"
          />
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue";
import Navbar from "~/components/NavbarView.vue";

import { useCart } from "~/composables/useCart";
import { useCategory } from "~/composables/useCategory";
import {
  useBooking,
  type BookingCustomer,
  type BookingItemInput,
  type BookingPickupInput,
} from "~/composables/useBooking";
import {
  useCheckoutPickup,
  type PickupGroupState,
} from "~/composables/useCheckoutPickup";

import CustomerForm from "../components/checkout/CustomerForm.vue";
import PickupGroupsForm from "../components/checkout/PickupGroupsForm.vue";
import OrderSummary from "../components/checkout/OrderSummary.vue";
import CheckoutSuccessSummary from "~/components/checkout/CheckoutSuccessSummary.vue";

const { items, totalPrice, clearCart } = useCart();
const { categories, getCategories, loading: categoriesLoading } = useCategory();
const {
  createBooking,
  loading: bookingLoading,
  error: bookingError,
  booking,
} = useBooking();

// 🔹 now also get pickupDate
const { today, pickupDate, pickupGroups, timeSlots, rebuildPickupGroups } =
  useCheckoutPickup(items, categories);

const customer = reactive<BookingCustomer>({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
});

const formError = ref<string | null>(null);
const success = ref(false);

const submitting = computed(
  () => bookingLoading.value || categoriesLoading.value
);

onMounted(async () => {
  await getCategories();
  rebuildPickupGroups();
});

// ✅ Submit handler
const handleSubmit = async () => {
  formError.value = null;

  if (!items.value.length) {
    formError.value = "Your cart is empty.";
    return;
  }

  if (
    !customer.firstName.trim() ||
    !customer.lastName.trim() ||
    !customer.phone.trim() ||
    !customer.email.trim()
  ) {
    formError.value = "Please fill in all customer details.";
    return;
  }

  // 🔹 ensure one global date is selected
  if (!pickupDate.value) {
    formError.value = "Please select a pickup date.";
    return;
  }

  // 🔹 ensure EVERY group has a time
  for (const group of pickupGroups.value) {
    if (!group.timeSlot) {
      formError.value = "Please select time for all pickup groups.";
      return;
    }
  }

  // Build pickups array – all share the same date
  const pickups: BookingPickupInput[] = pickupGroups.value.map((group) => ({
    categoryId: group.categoryIds[0] ?? "",
    date: pickupDate.value, // 🔹 shared date
    timeSlot: group.timeSlot,
    orderNotes: group.orderNotes || "",
  }));

  const itemsPayload: BookingItemInput[] = [];
  pickupGroups.value.forEach((group, index) => {
    for (const item of group.items) {
      itemsPayload.push({
        productId: item.productId,
        quantity: item.quantity,
        pickupIndex: index,
      });
    }
  });

  const created = await createBooking({
    customer: {
      firstName: customer.firstName.trim(),
      lastName: customer.lastName.trim(),
      phone: customer.phone.trim(),
      email: customer.email.trim(),
    },
    pickups,
    items: itemsPayload,
  });

  if (!created) {
    if (!formError.value) {
      formError.value = "Could not create booking. Please try again.";
    }
    return;
  }

  success.value = true;
  clearCart();
};
</script>

<style scoped>
.checkout-page {
  position: relative;
  top: 80px;
  min-height: calc(100vh - 80px);
  background: #f4f4f4;
}

.back-btn {
  position: fixed;
  top: 100px;
  left: 25px;
  width: 48px;
  height: 48px;
  background: #6f7d75;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
}

.arrow-icon {
  width: 22px;
  height: 22px;
  color: white;
}

.checkout-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.checkout-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 2fr 1.2fr;
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state,
.success-box {
  margin-top: 2rem;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}

.error-text {
  color: #b3261e;
  margin-top: 1rem;
}
</style>
