<script setup lang="ts">
import { onMounted } from "vue";
import { useContactInfo } from "~/composables/useContactInfo";
import ContactInfoForm from "~/components/admin/contact/ContactInfoForm.vue";

const { contactInfo, loading, error, getContactInfo, updateContactInfo } =
  useContactInfo();

onMounted(async () => {
  await getContactInfo();
});

const handleSubmit = async (payload: any) => {
  const ok = await updateContactInfo(payload);
  if (ok) {
    alert("Contact information updated successfully");
  }
};
</script>

<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <!-- Back button + header -->
      <div class="back-btn-wrapper">
        <NuxtLink to="/admin" class="back-btn">←</NuxtLink>
      </div>

      <h1 class="admin-title">Contact information</h1>
      <p class="admin-subtitle">
        Update email, phone, address, opening hours and logo used on the website
        footer and contact sections.
      </p>

      <div v-if="error" class="alert-error">
        {{ error }}
      </div>

      <div class="admin-card">
        <ContactInfoForm
          :contact-info="contactInfo"
          :loading="loading"
          :error="error"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.back-btn-wrapper {
  text-align: left;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-block;
  background: #3b4b3d;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  transition: 0.2s ease;
  font-weight: bold;
}

.back-btn:hover {
  background: #283529;
}

.admin-wrapper {
  background: #211a1a;
  min-height: 100vh;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.admin-container {
  background: #5d7261;
  width: 90%;
  max-width: 1100px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0px 0px 35px rgba(0, 0, 0, 0.45);
  text-align: center;
}

.admin-title {
  font-size: 32px;
  font-family: Georgia, serif;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.admin-subtitle {
  color: #e7e7e7;
  margin-bottom: 30px;
  font-size: 15px;
}

.alert-error {
  background: #c67b7b;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}
</style>
