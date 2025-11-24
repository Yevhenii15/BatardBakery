<template>
  <div class="ts-block">
    <span class="ts-label">{{ label }}</span>
    <span>{{ formatted }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string;
}>();

const formatted = computed(() => {
  const d = new Date(props.value);
  return isNaN(d.getTime()) ? props.value : d.toLocaleString();
});
</script>

<style scoped>
.ts-block {
  font-size: 0.78rem;
  color: #4b5563;
  margin-bottom: 4px;
}

.ts-label {
  display: block;
  font-size: 0.65rem;
  color: #9ca3af;
}
</style>
