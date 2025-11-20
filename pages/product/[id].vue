<template>
  <section v-if="product" class="product-details">

    <!-- BACK BUTTON -->
    <button class="back-btn" @click="router.back()">
      <svg viewBox="0 0 24 24" class="arrow-icon">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
    </button>
    
    

    <div class="product-wrapper">
      <div class="info">
        <h1 class="title">{{ product.name }}</h1>
        <p class="description">
          {{ product.description || "Beskrivelse kommer snart..." }}
        </p>

        <p class="price">
          <span v-if="product.oldPrice" class="old">{{ product.oldPrice }} kr.</span>
          <span>{{ product.price }} kr.</span>
        </p>
      </div>

      <div class="image-box">
        <img :src="product.image" :alt="product.name" />
      </div>
    </div>

  </section>

  <section v-else class="not-found">
    <h2>Produkt ikke fundet</h2>
    <NuxtLink to="/products">Tilbage</NuxtLink>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Copy the same arrays from Products.vue
const bread = [
  { id: 1, name: "4 Blandede Surdejsstykker", price: 40, oldPrice: 48, image: "/img/rundst.jpg" },
  { id: 2, name: "Grov Birkes", price: 12, image: "/img/grov.jpg" },
  { id: 3, name: "Bedstemorboller", price: 12, image: "/img/minib.jpg" },
  { id: 4, name: "Bâtard Surdejsbrød", price: 44, image: "/img/breadBatard.jpg" },
]

const cakes = [
  { id: 10, name: "KBH Birkes", price: 20, image: "/img/kbh.jpg" },
  { id: 11, name: "Croissant", price: 22, image: "/img/smorcr.jpg" },
  { id: 12, name: "Chokoladeboller", price: 25, image: "/img/choko.jpg" },
]

const pizzas = [
  { id: 20, name: "Margherita", price: 89, image: "/img/4.jpeg" },
  { id: 21, name: "Pepperoni", price: 95, image: "/img/3.jpeg" },
  { id: 22, name: "Vegetar", price: 92, image: "/img/5.jpeg" },
]

// Make one combined list
const all = [...bread, ...cakes, ...pizzas]

// Find correct product
const product = all.find(p => p.id === Number(route.params.id))
</script>

<style scoped>
/* Same back button styles you already use */
.back-btn {
  position: fixed;
  top: 25px;
  left: 25px;
  width: 48px;
  height: 48px;
  background: #6f7d75; /* Batard green/grey */
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 999;
  transition: 0.25s ease;
}

/* Style the product page */
.product-details {
  padding: 6rem 2rem;
}

.product-wrapper {
  display: flex;
  gap: 3rem;
  align-items: center;
}

.image-box img {
  width: 500px;
  border-radius: 12px;
  object-fit: cover;
}

.title {
  font-size: 3rem;
  color: #6f7d75;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.6rem;
  margin-top: 1rem;
}

.old {
  text-decoration: line-through;
  margin-right: .5rem;
}
</style>
