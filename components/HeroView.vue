<template>
  <section class="hero">
    <!-- Background images split in half -->
    <div class="hero-image hero-left"></div>
    <div class="hero-image hero-right"></div>

    <!-- Overlay content -->
    <div class="hero-content">
      <h1 class="hero-title">BAGERI I VEJERS STRAND</h1>
      <p class="hero-subtitle">
        Batard Bakery er det bedste surdejsbageri i Vejers Strand
      </p>
     <NuxtLink to="/products" class="hero-btn">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="hero-btn-icon"
  >
    <path d="M6 6h15l-1.5 9h-13z" />
    <circle cx="9" cy="21" r="1" />
    <circle cx="18" cy="21" r="1" />
  </svg>
  BESTIL HER
</NuxtLink>
    </div>
  </section>
</template>

<style>

* {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}


.hero {
  position: relative;
  height: 100vh;
  display: flex;
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
}


.hero-image {
  width: 50%;
  background-size: cover;
  margin: 0;
  padding: 0;
}

.hero-left {
  background-image: url('/img/bakery2.jpg'); 
  background-position: 20% 20%;
}

.hero-right {
  background-image: url('/img/bakery1.jpg');
  background-position: 20% 80%;
}

/* Overlay content */
.hero-content {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
  margin: 0;
  padding: 0;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.hero-subtitle {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Button styling */
.hero-btn {
  background-color: #5d7261;
  color: white;
  font-weight: 500;
  letter-spacing: 1px;
  padding: 0.9rem 1.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.hero-btn:hover {
  background-color: white;
  color: #5d7261;
  transform: scale(1.08);
}

.hero-btn-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}


/* Mobile adjustments */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    height: 100vh;
    position: relative;
  }

  /* Hide LEFT image */
  .hero-right {
    display: none;
  }

  /* Right image becomes full-size background */
  .hero-left {
    width: 100%;
    height: 100%;
  }

  /* Keep text absolutely centered on the image */
  .hero-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0%);
    padding: 0; 
    background: none; /* remove dark background */
    width: 90%;
    max-width: 500px;
    text-align: center;
    z-index: 2;
  }

  .hero-title {
    font-size: 2rem;
  }
}


</style>
