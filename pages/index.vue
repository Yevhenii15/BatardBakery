<template>
    <div>
        <Navbar />
        <Hero />
        <About />
        <ContactUs />
        <FooterView />
    </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/NavbarView.vue'
import Hero from '~/components/HeroView.vue'
import About from '~/components/AboutView.vue'
import ContactUs from '~/components/ContactUsView.vue'
import FooterView from '~/components/FooterView.vue'
</script>