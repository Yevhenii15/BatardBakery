<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const { login, loading, error } = useAuth();

const form = ref({
  email: "",
  password: "",
});

const onSubmit = async () => {
  const success = await login(form.value.email, form.value.password);
  if (success) router.push("/admin");
};
</script>

<template>
  <div class="admin-bg">
    <div class="login-window">
      <!-- Logo Placeholder -->
      <div class="logo-container">
        <!-- Replace with your <img> -->
        <div class="logo-placeholder"><img src="/public/img/logo.png" alt=""></div>
      </div>
      <h1 class="title">Welcome, Admin!</h1>

      <form @submit.prevent="onSubmit" class="form">
        <!-- Email -->
        <label class="label">Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="input"
          placeholder="admin@example.com"
        />

        <!-- Password -->
        <label class="label">Password</label>
        <input
          v-model="form.password"
          type="password"
          required
          class="input"
          placeholder="••••••••"
        />

        <!-- Error -->
        <p v-if="error" class="error">{{ error }}</p>

        <!-- Button -->
        <button type="submit" :disabled="loading" class="btn">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Fullscreen background */
.admin-bg {
  background: #211a1a;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Main login box */
.login-window {
  width: 360px;
  background: #5d7261; /* the pine green */
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* Logo container */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.logo-placeholder {
  width: 300px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: bold;
  font-size: 0.85rem;
  text-align: center;
}

/* Title */
.title {
  text-align: center;
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

/* Labels */
.label {
  color: #e8e8e8;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

/* Inputs */
.input {
  width: 92%;
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #ffffff;
  color: #333;
  margin-bottom: 1rem;
  outline: none;
  transition: 0.2s;
}

.input:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
}

/* Error */
.error {
  color: #ffe0e0;
  background: rgba(255, 0, 0, 0.25);
  padding: 6px 10px;
  border-radius: 6px;
  text-align: center;
  margin-top: -0.5rem;
  font-size: 0.85rem;
}

/* Button */
.btn {
  width: 100%;
  padding: 12px;
  background: #ffffff;
  color: #5d7261;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
}

.btn:hover {
  background: #e4e4e4;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
