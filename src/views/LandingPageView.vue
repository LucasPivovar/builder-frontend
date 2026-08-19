<template>
  <div class="landing-page-view">
    <LandingNavbar @navigate="$emit('navigate', $event)" />
    <LandingHero @navigate="$emit('navigate', $event)" />
    <LandingFeatures />
    <LandingTestimonials />
    <LandingPricing @navigate="$emit('navigate', $event)" />
    <LandingCtaBanner @navigate="$emit('navigate', $event)" />
    <LandingFaq />
    <LandingFooter @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import LandingNavbar from '../components/landing/LandingNavbar.vue';
import LandingHero from '../components/landing/LandingHero.vue';
import LandingFeatures from '../components/landing/LandingFeatures.vue';
import LandingPricing from '../components/landing/LandingPricing.vue';
import LandingTestimonials from '../components/landing/LandingTestimonials.vue';
import LandingCtaBanner from '../components/landing/LandingCtaBanner.vue';
import LandingFaq from '../components/landing/LandingFaq.vue';
import LandingFooter from '../components/landing/LandingFooter.vue';

defineEmits(['navigate']);

onMounted(() => {
  document.documentElement.classList.add('landing-scroll');
  document.body.classList.add('landing-scroll');
});

onUnmounted(() => {
  document.documentElement.classList.remove('landing-scroll');
  document.body.classList.remove('landing-scroll');
});
</script>

<style>
.landing-page-view {
  min-height: 100vh;
  width: 100%;
  background: var(--color-page);
  color: var(--color-text);
  font-family: var(--font-sans);
  overflow-x: hidden;
  overflow-y: visible;
}

/* Animations and responsive layout for public LP */
.landing-page-view .hero-title,
.landing-page-view .hero-subtitle,
.landing-page-view .hero-buttons,
.landing-page-view .preview-mockup-card {
  animation: landing-rise 0.5s ease both;
}

.landing-page-view .hero-subtitle { animation-delay: 0.06s; }
.landing-page-view .hero-buttons { animation-delay: 0.12s; }
.landing-page-view .preview-mockup-card { animation-delay: 0.18s; }

@keyframes landing-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 760px) {
  .landing-page-view .nav-links { display: none; }
  .landing-page-view .nav-container { padding: 0 16px; }
  .landing-page-view .nav-brand span { font-size: 15px; }
  .landing-page-view .btn-primary { padding: 9px 13px; font-size: 12px; }
  .landing-page-view .hero-section { padding-top: 52px; }
  .landing-page-view .hero-buttons { flex-direction: column; gap: 10px; }
  .landing-page-view .hero-buttons button { width: min(100%, 330px); justify-content: center; }
  .landing-page-view .preview-mockup-card { margin: 0 16px; }
  .landing-page-view .mockup-sidebar { width: 72px; }
  .landing-page-view .mockup-body { height: 280px; }
  .landing-page-view .mockup-video { height: 120px; width: 76%; }
}
</style>
