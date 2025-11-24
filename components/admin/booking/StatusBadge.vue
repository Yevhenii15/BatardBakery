<template>
  <span :class="['status-badge', colorClass]">
    {{ status }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string;
}>();

const colorClass = computed(() => {
  return (
    {
      pending: "yellow",
      confirmed: "green",
      completed: "blue",
      cancelled: "red",
    }[props.status] || "gray"
  );
});
</script>

<style scoped>
.status-badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: capitalize;
  border: 1px solid transparent;
}

/* colors */
.status-badge.green {
  background: #e8f9f1;
  color: #0f8f4f;
  border-color: #b5ead1;
}

.status-badge.yellow {
  background: #fff7db;
  color: #a07d00;
  border-color: #f0e2a0;
}

.status-badge.blue {
  background: #e7f2ff;
  color: #1a6ecb;
  border-color: #bcd8ff;
}

.status-badge.red {
  background: #ffecec;
  color: #c63b3b;
  border-color: #ffb6b6;
}

.status-badge.gray {
  background: #f3f4f6;
  color: #777;
  border-color: #ddd;
}
</style>
