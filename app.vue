<script setup>
import { useCartPanel } from "~/composables/useCartPanel";
const { isOpen } = useCartPanel();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />

    <!-- Global cart panel -->
    <CartPanel v-if="isOpen" />
  </NuxtLayout>
</template>
