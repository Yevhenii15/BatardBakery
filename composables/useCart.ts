// composables/useCart.ts
import { ref, computed } from "vue";
import type { Product } from "~/composables/useProduct";

export interface CartItem {
  productId: string;
  name: string;
  photo: string;
  price: number;
  quantity: number;
  categoryId: string;
}

const STORAGE_KEY = "batard_cart";

// shared state (like your other composables)
const items = ref<CartItem[]>([]);
const initialized = ref(false);

const loadFromStorage = () => {
  if (initialized.value) return;
  initialized.value = true;

  if (import.meta.server) return; // do nothing on SSR

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (Array.isArray(parsed)) {
      items.value = parsed;
    }
  } catch (e) {
    console.error("Failed to parse cart from storage", e);
  }
};

const saveToStorage = () => {
  if (import.meta.server) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
  } catch (e) {
    console.error("Failed to save cart to storage", e);
  }
};

export function useCart() {
  loadFromStorage();

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const addItem = (product: Product, quantity = 1) => {
    const existing = items.value.find((i) => i.productId === product._id);

    // basic stock guard if you want
    const maxStock =
      typeof product.stock === "number" ? product.stock : Infinity;

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, maxStock);
    } else {
      const qty = Math.min(quantity, maxStock);
      items.value.push({
        productId: product._id,
        name: product.name,
        photo: product.photo || "",
        price: product.price,
        quantity: qty,
        categoryId: product.categoryId,
      });
    }

    saveToStorage();
    alert(`${product.name} has been added to the cart.`);
  };

  const setQuantity = (productId: string, quantity: number) => {
    const item = items.value.find((i) => i.productId === productId);
    if (!item) return;
    if (quantity <= 0) {
      items.value = items.value.filter((i) => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }
    saveToStorage();
  };

  const removeItem = (productId: string) => {
    items.value = items.value.filter((i) => i.productId !== productId);
    saveToStorage();
  };

  const clearCart = () => {
    items.value = [];
    saveToStorage();
  };

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  };
}
