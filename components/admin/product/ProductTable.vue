<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "~/composables/useProduct";
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  products: Product[];
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", product: Product): void;
  (e: "delete", id: string): void;
}>();

const getCategoryName = (id: string) => {
  return props.categories.find((c) => c._id === id)?.categoryName || "—";
};

// 🔹 Build dynamic sections: each category + its products
const sections = computed(() =>
  props.categories
    .map((cat) => ({
      category: cat,
      items: props.products.filter((p) => p.categoryId === cat._id),
    }))
    .filter((section) => section.items.length > 0)
);
</script>

<template>
  <section class="product-grid-container">
    <!-- Global header -->
    <header class="pg-header">
      <div>
        <h2 class="pg-title">Products</h2>
        <p class="pg-subtitle">
          All products in the online ordering system, grouped by category.
        </p>
      </div>

      <div v-if="loading" class="pg-loading">
        <span class="dot"></span> Loading…
      </div>
    </header>

    <!-- Empty state -->
    <p v-if="!sections.length && !loading" class="pg-empty">
      No products created yet.
    </p>

    <!-- Category sections -->
    <div v-else class="pg-sections">
      <section
        v-for="section in sections"
        :key="section.category._id"
        class="pg-category-block"
      >
        <!-- Category title -->
        <header class="pg-category-header">
          <h3 class="pg-category-title">
            {{ section.category.categoryName }}
          </h3>
          <p class="pg-category-subtitle">
            {{ section.items.length }} product{{
              section.items.length > 1 ? "s" : ""
            }}
          </p>
        </header>

        <!-- Grid of cards for this category -->
        <div class="pg-grid">
          <div
            v-for="p in section.items"
            :key="p._id"
            class="pg-card"
            :id="`product-${p._id}`"
          >
            <!-- Image -->
            <div class="pg-image">
              <img v-if="p.photo" :src="p.photo" :alt="p.name" />
              <div v-else class="pg-image-empty">No image</div>
            </div>

            <!-- Info -->
            <div class="pg-body">
              <h4 class="pg-name">{{ p.name }}</h4>

              <div class="pg-info">
                <span
                  ><strong>Price:</strong> {{ p.price.toFixed(2) }} DKK</span
                >
                <span><strong>Stock:</strong> {{ p.stock }}</span>
                <span><strong>Daily cap.:</strong> {{ p.dailyCapacity }}</span>
              </div>

              <span :class="['pg-pill', p.active ? 'active' : 'inactive']">
                {{ p.active ? "Active" : "Hidden" }}
              </span>
            </div>

            <!-- Actions -->
            <div class="pg-actions">
              <button class="btn" @click.stop="emit('edit', p)">Edit</button>
              <button class="btn danger" @click.stop="emit('delete', p._id)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.product-grid-container {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

/* Header */
.pg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pg-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #111827;
}

.pg-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 2px;
}

.pg-loading {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #555;
}

.dot {
  width: 6px;
  height: 6px;
  background: #6f7d75;
  border-radius: 50%;
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from {
    opacity: 0.4;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Empty */
.pg-empty {
  margin-top: 1rem;
  padding: 1.25rem;
  text-align: center;
  background: #fafafa;
  border-radius: 10px;
  border: 1px dashed #ccc;
  color: #777;
}

/* Category blocks */
.pg-sections {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.pg-category-block {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.pg-category-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.75rem;
}

.pg-category-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2933;
}

.pg-category-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Grid of cards */
.pg-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
}

/* Card */
.pg-card {
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 0.75rem;
  transition: 0.2s ease;
}

.pg-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Image */
.pg-image {
  width: 100%;
  height: 200px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.pg-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pg-image-empty {
  color: #666;
  font-size: 0.9rem;
}

/* Body */
.pg-body {
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pg-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.pg-info {
  font-size: 0.78rem;
  color: #444;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Pills */
.pg-pill {
  display: inline-flex;
  align-self: flex-start;
  padding: 2px 10px;
  font-size: 0.7rem;
  border-radius: 999px;
  margin-top: 4px;
}

.pg-pill.active {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #b5e8c7;
}

.pg-pill.inactive {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

/* Actions */
.pg-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0.5rem 1rem 0;
}

.btn {
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid #888;
  background: #fff;
  font-size: 0.75rem;
  cursor: pointer;
  transition: 0.15s ease;
}

.btn:hover {
  background: #f3f4f6;
}

.btn.danger {
  border-color: #b91c1c;
  color: #b91c1c;
}

.btn.danger:hover {
  background: #fee2e2;
}
</style>
