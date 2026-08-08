<template>
  <div class="landing-page-view">
    <LandingNavbar @navigate="$emit('navigate', $event)" />
    <LandingHero @navigate="$emit('navigate', $event)" />
    <LandingStats />
    <LandingFeatures />
    <LandingPricing @navigate="$emit('navigate', $event)" />
    <LandingTestimonials />
    <LandingFaq />
    <LandingFooter />
  </div>
</template>

<script setup>
import LandingNavbar from '../components/landing/LandingNavbar.vue';
import LandingHero from '../components/landing/LandingHero.vue';
import LandingStats from '../components/landing/LandingStats.vue';
import LandingFeatures from '../components/landing/LandingFeatures.vue';
import LandingPricing from '../components/landing/LandingPricing.vue';
import LandingTestimonials from '../components/landing/LandingTestimonials.vue';
import LandingFaq from '../components/landing/LandingFaq.vue';
import LandingFooter from '../components/landing/LandingFooter.vue';

defineEmits(['navigate']);
</script>

<style scoped>
.landing-page-view {
  min-height: 100vh;
  width: 100vw;
  background-color: #0b0f19;
  color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow-x: hidden;
}
</style>
