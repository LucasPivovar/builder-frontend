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
import { onMounted, onUnmounted } from 'vue';
import LandingNavbar from '../components/landing/LandingNavbar.vue';
import LandingHero from '../components/landing/LandingHero.vue';
import LandingStats from '../components/landing/LandingStats.vue';
import LandingFeatures from '../components/landing/LandingFeatures.vue';
import LandingPricing from '../components/landing/LandingPricing.vue';
import LandingTestimonials from '../components/landing/LandingTestimonials.vue';
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
  background-color: var(--color-primary-subtle);
  color: var(--color-text);
  font-family: var(--font-sans);
  overflow-x: hidden;
  overflow-y: visible;
}

/* Shared flat palette for the complete public experience. */
.landing-page-view .navbar { background: var(--color-surface); border-bottom: 1px solid var(--color-border); backdrop-filter: none; }
.landing-page-view .nav-brand { color: var(--color-text); }
.landing-page-view .brand-logo { background: var(--color-primary); }
.landing-page-view .nav-links a { color: var(--color-text-secondary); }
.landing-page-view .nav-links a:hover { color: var(--color-primary-strong); }
.landing-page-view .btn-outline { border-color: var(--color-border); color: var(--color-primary-strong); background: var(--color-surface); }
.landing-page-view .btn-primary,
.landing-page-view .btn-hero-primary,
.landing-page-view .btn-price-primary { background: var(--color-primary); box-shadow: none; }
.landing-page-view .btn-primary:hover,
.landing-page-view .btn-hero-primary:hover,
.landing-page-view .btn-price-primary:hover { background: var(--color-primary-hover); }
.landing-page-view .hero-section { background: var(--color-primary-subtle); }
.landing-page-view .glow-bg { display: none; }
.landing-page-view .badge-tag { background: var(--color-primary-soft); border-color: var(--color-border-strong); color: var(--color-primary-strong); }
.landing-page-view .hero-title { color: var(--color-text); }
.landing-page-view .gradient-text { color: var(--color-primary-hover); background: none; -webkit-text-fill-color: initial; }
.landing-page-view .hero-subtitle, .landing-page-view .section-subtitle { color: var(--color-text-secondary); }
.landing-page-view .btn-hero-secondary { background: var(--color-surface); border-color: var(--color-border); color: var(--color-primary-strong); }
.landing-page-view .preview-mockup-card { background: var(--color-surface); border-color: var(--color-border); box-shadow: 0 18px 40px rgba(14, 116, 144, .14); }
.landing-page-view .mockup-header { background: var(--color-primary-soft); }
.landing-page-view .mockup-url { color: var(--color-primary-strong); }
.landing-page-view .mockup-body { background: var(--color-surface-soft); }
.landing-page-view .mockup-sidebar { background: var(--color-primary-soft); border-color: var(--color-border); }
.landing-page-view .mockup-headline { background: var(--color-border); }
.landing-page-view .mockup-video { background: var(--color-border); border-color: var(--color-border-strong); }
.landing-page-view .play-icon { color: var(--color-primary); }
.landing-page-view .mockup-btn { background: var(--color-primary); }
.landing-page-view .stats-grid,
.landing-page-view .feature-card,
.landing-page-view .price-card,
.landing-page-view .testimonial-card,
.landing-page-view .faq-item { background: var(--color-surface); border-color: var(--color-border); }
.landing-page-view .feature-card, .landing-page-view .price-card, .landing-page-view .testimonial-card, .landing-page-view .faq-item { transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease; }
.landing-page-view .feature-card:hover, .landing-page-view .price-card:hover, .landing-page-view .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(14, 116, 144, .10); }
.landing-page-view .hero-title, .landing-page-view .hero-subtitle, .landing-page-view .hero-buttons, .landing-page-view .preview-mockup-card { animation: landing-rise .5s ease both; }
.landing-page-view .hero-subtitle { animation-delay: .06s; }.landing-page-view .hero-buttons { animation-delay: .12s; }.landing-page-view .preview-mockup-card { animation-delay: .18s; }
.landing-page-view .stat-number, .landing-page-view .price-amount { color: var(--color-primary-strong); }
.landing-page-view .stat-label, .landing-page-view .feature-card p,
.landing-page-view .price-features, .landing-page-view .price-amount span,
.landing-page-view .quote, .landing-page-view .user-role,
.landing-page-view .faq-answer { color: var(--color-text-secondary); }
.landing-page-view .icon-box { background: var(--color-primary-soft); color: var(--color-primary-hover); }
.landing-page-view .price-card.popular { border-color: var(--color-primary); box-shadow: 0 10px 26px rgba(14, 165, 233, .12); }
.landing-page-view .popular-tag { background: var(--color-primary); }
.landing-page-view .btn-price-outline { border-color: var(--color-border-strong); color: var(--color-primary-strong); background: var(--color-surface); }
.landing-page-view .faq-section, .landing-page-view .footer { border-color: var(--color-border); }
.landing-page-view .footer { color: var(--color-text-secondary); }
.landing-page-view .footer .brand-logo { background: var(--color-primary); }

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

@keyframes landing-rise { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

.landing-page-view .navbar,
.landing-page-view .stats-grid,
.landing-page-view .feature-card,
.landing-page-view .price-card,
.landing-page-view .testimonial-card,
.landing-page-view .faq-item,
.landing-page-view .preview-mockup-card {
  background: var(--color-surface) !important;
  border-color: var(--color-border) !important;
  box-shadow: none !important;
}

.landing-page-view .brand-logo,
.landing-page-view .btn-primary,
.landing-page-view .btn-hero-primary,
.landing-page-view .btn-price-primary,
.landing-page-view .popular-tag,
.landing-page-view .mockup-btn,
.landing-page-view .avatar,
.landing-page-view .icon-box {
  background: var(--color-primary) !important;
  background-image: none !important;
  color: var(--color-surface) !important;
  box-shadow: none !important;
}

.landing-page-view .badge-tag,
.landing-page-view .btn-outline,
.landing-page-view .btn-hero-secondary,
.landing-page-view .btn-price-outline {
  background: var(--color-surface) !important;
  border-color: var(--color-border-strong) !important;
  color: var(--color-primary-strong) !important;
}

.landing-page-view .section-title,
.landing-page-view .hero-title,
.landing-page-view h2,
.landing-page-view h3,
.landing-page-view .user-name {
  color: var(--color-text) !important;
}

.landing-page-view .hero-subtitle,
.landing-page-view .section-subtitle,
.landing-page-view .quote,
.landing-page-view .user-role,
.landing-page-view .feature-card p,
.landing-page-view .faq-answer,
.landing-page-view .price-features {
  color: var(--color-text-secondary) !important;
}

.landing-page-view .glow-bg {
  display: none !important;
}
</style>
