<template>
  <!-- ===== BACK BUTTON ===== -->
 <button class="back-btn" @click="$router.push('/')">
  <svg viewBox="0 0 24 24" class="arrow-icon">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>


  <!-- ===== PAGE HEADER (BESTIL) ===== -->
  <section class="order-header">
    <h1 class="order-title">BESTIL</h1>
    <p class="order-subtitle">Slip for køen – Afhent direkte i butikken</p>
  </section>

  <section class="products">
    
    <!-- ===== BREAD SECTION ===== -->
    <div class="category">
      <h2 class="category-title">Brød</h2>

      <div class="product-grid">
        <div v-for="item in bread" :key="item.id" class="product-card">
          <div class="product-image">
            <img :src="item.image" :alt="item.name" />
          </div>

          <h3 class="product-name">{{ item.name }}</h3>

          <p class="product-price">
            <span v-if="item.oldPrice" class="old">{{ item.oldPrice }} kr.</span>
            <span>{{ item.price }} kr.</span>
          </p>

          <NuxtLink class="product-btn" :to="`/product/${item.id}`">
  Læs Mere
</NuxtLink>

        </div>
      </div>
    </div>

    <!-- ===== CAKES SECTION ===== -->
    <div class="category">
      <h2 class="category-title">Kager</h2>

      <div class="product-grid">
        <div v-for="item in cakes" :key="item.id" class="product-card">
          <div class="product-image">
            <img :src="item.image" :alt="item.name" />
          </div>

          <h3 class="product-name">{{ item.name }}</h3>
          <p class="product-price">{{ item.price }} kr.</p>
          <NuxtLink class="product-btn" :to="`/product/${item.id}`">
  Læs Mere
</NuxtLink>

        </div>
      </div>
    </div>

    <!-- ===== PIZZA SECTION ===== -->
    <div class="category">
      <h2 class="category-title">Pizza</h2>

      <div class="product-grid">
        <div v-for="item in pizzas" :key="item.id" class="product-card">
          <div class="product-image">
            <img :src="item.image" :alt="item.name" />
          </div>

          <h3 class="product-name">{{ item.name }}</h3>
          <p class="product-price">{{ item.price }} kr.</p>
          <NuxtLink class="product-btn" :to="`/product/${item.id}`">
  Læs Mere
</NuxtLink>

        </div>
      </div>
    </div>

  </section>
</template>


<script setup>
const bread = [
  { id: 1, name: "4 Blandede Surdejsstykker", price: 40, oldPrice: 48, image: "/img/rundst.jpg" },
  { id: 2, name: "Grov Birkes", price: 12, image: "/img/grov.jpg" },
  { id: 3, name: "Bedstemorboller", price: 12, image: "/img/minib.jpg" },
  { id: 4, name: "Bâtard Surdejsbrød", price: 44, image: "/img/breadBatard.jpg" },
  { id: 8, name: "Bâtard Surdejsbrød", price: 44, image: "/img/breadBatard.jpg" },
  { id: 6, name: "Grov Birkes", price: 12, image: "/img/grov.jpg" },
  { id: 5, name: "4 Blandede Surdejsstykker", price: 40, oldPrice: 48, image: "/img/rundst.jpg" },
  { id: 7, name: "Bedstemorboller", price: 12, image: "/img/minib.jpg" },
]


const cakes = [
    { id: 10, name: "KBH Birkes", price: 20, image: "/img/kbh.jpg" },
    { id: 11, name: "Croissant", price: 22, image: "/img/smorcr.jpg" },
    { id: 12, name: "Chokoladeboller", price: 25, image: "/img/choko.jpg" },
    { id: 15, name: "Chokoladeboller", price: 25, image: "/img/choko.jpg" },
    { id: 14, name: "Croissant", price: 22, image: "/img/smorcr.jpg" },
    { id: 13, name: "KBH Birkes", price: 20, image: "/img/kbh.jpg" },
    { id: 14, name: "Croissant", price: 22, image: "/img/smorcr.jpg" },
    { id: 13, name: "KBH Birkes", price: 20, image: "/img/kbh.jpg" },
    ]

const pizzas = [
  { id: 20, name: "Margherita", price: 89, image: "/img/4.jpeg" },
  { id: 21, name: "Pepperoni", price: 95, image: "/img/3.jpeg" },
  { id: 22, name: "Vegetar", price: 92, image: "/img/5.jpeg" },
  { id: 25, name: "Margherita", price: 89, image: "/img/5.jpeg" },
  { id: 24, name: "Pepperoni", price: 95, image: "/img/5.jpeg" },
  { id: 22, name: "Vegetar", price: 92, image: "/img/3.jpeg" },
]
</script>

<style scoped>

/* ===== BACK BUTTON ===== */
.back-btn {
  position: fixed;
  top: 25px;
  left: 25px;
  width: 48px;
  height: 48px;
  background: #6f7d75; /* Batard green/grey */
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
  width: 100%;
  text-align: center;
  background: #f4f4f4;
  padding: 3rem 2rem 2rem;
  margin: 0;
}

.order-title {
  font-size: 5rem;
  letter-spacing: 4px;
  color: #6f7d75;             /* same green/grey as Batard */
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

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.5rem;
  padding: 1rem;
}

/* Card */
.product-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
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

.product-image p {
  font-size: 1.3rem;
  opacity: 0.7;
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

.product-price .old {
  text-decoration: line-through;
  margin-right: 0.5rem;
  opacity: 0.6;
}

/* Button */
.product-btn {
  background: #6f7d75;
  color: white;
  border: none;
  padding: 0.7rem 1.6rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.25s ease;
}

.product-btn:hover {
  background: #4f5c55;
  transform: scale(1.05);
}

</style>
