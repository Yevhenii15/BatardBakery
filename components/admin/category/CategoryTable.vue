<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="cat in categories"
          :key="cat._id"
        >
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #ffffff;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 14px;
}

.loading {
  font-size: 14px;
  color: #ececec;
}

.empty-state {
  font-size: 14px;
  color: #d5d5d5;
  padding: 15px 0;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 6px;
}

thead th {
  text-align: left;
  padding: 10px;
  font-size: 13px;
  color: #e3e3e3;
}

tbody tr {
  background: #7f9580;
  transition: 0.2s;
}

tbody tr:hover {
  background: #90a693;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #ffffff;
}

.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

.btn-edit {
  background: #3b4b3d;
  color: #fff;
}

.btn-edit:hover {
  background: #2a352b;
}

.btn-delete {
  background: #8f5a5a;
  color: #fff;
}

.btn-delete:hover {
  background: #a16666;
}
</style>
