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
  background: var(--color-navy);
  color: var(--color-white);
  font-family: var(--font-sans);
  overflow-x: hidden;
  overflow-y: visible;
}

/* Shared flat palette for the complete public experience. */
.landing-page-view .navbar { background: rgba(7, 3, 26, .9); border-bottom: 1px solid #332b5c; backdrop-filter: blur(16px); }
.landing-page-view .nav-brand { color: var(--color-white); font-family: var(--font-display); }
.landing-page-view .brand-logo:not(.astro-mark) { background: var(--gradient-aurora); }
.landing-page-view .nav-links a { color: #b7b0c9; }
.landing-page-view .nav-links a:hover { color: var(--color-cyan); }
.landing-page-view .btn-outline { border-color: #524779; color: var(--color-white); background: transparent; }
.landing-page-view .btn-primary,
.landing-page-view .btn-hero-primary,
.landing-page-view .btn-price-primary { background: var(--gradient-aurora); box-shadow: 0 10px 28px rgba(97, 43, 244, .3); }
.landing-page-view .btn-primary:hover,
.landing-page-view .btn-hero-primary:hover,
.landing-page-view .btn-price-primary:hover { filter: brightness(1.1); }
.landing-page-view .hero-section { background: radial-gradient(circle at 80% 20%, rgba(97, 43, 244, .24), transparent 28%), var(--color-navy); }
.landing-page-view .glow-bg { display: block; }
.landing-page-view .badge-tag { background: rgba(168, 84, 250, .13); border-color: rgba(168, 84, 250, .45); color: #d7c7ff; }
.landing-page-view .hero-title { color: var(--color-white); }
.landing-page-view .gradient-text { background: var(--gradient-aurora); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.landing-page-view .hero-subtitle, .landing-page-view .section-subtitle { color: #b7b0c9; }
.landing-page-view .btn-hero-secondary { background: rgba(255,255,255,.04); border-color: #524779; color: var(--color-white); }
.landing-page-view .preview-mockup-card { background: #1a1433; border-color: #332b5c; box-shadow: 0 18px 40px rgba(0, 0, 0, .3); }
.landing-page-view .mockup-header { background: #261f45; }.landing-page-view .mockup-url { color: var(--color-cyan); }.landing-page-view .mockup-body { background: #120c29; }.landing-page-view .mockup-sidebar { background: #261f45; border-color: #332b5c; }.landing-page-view .mockup-headline { background: #4a416d; }.landing-page-view .mockup-video { background: #261f45; border-color: #524779; }.landing-page-view .play-icon { color: var(--color-cyan); }.landing-page-view .mockup-btn { background: var(--gradient-aurora); }
.landing-page-view .stats-grid,
.landing-page-view .feature-card,
.landing-page-view .price-card,
.landing-page-view .testimonial-card,
.landing-page-view .faq-item { background: #1a1433; border-color: #332b5c; }
.landing-page-view .feature-card, .landing-page-view .price-card, .landing-page-view .testimonial-card, .landing-page-view .faq-item { transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease; }
.landing-page-view .feature-card:hover, .landing-page-view .price-card:hover, .landing-page-view .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(14, 116, 144, .10); }
.landing-page-view .hero-title, .landing-page-view .hero-subtitle, .landing-page-view .hero-buttons, .landing-page-view .preview-mockup-card { animation: landing-rise .5s ease both; }
.landing-page-view .hero-subtitle { animation-delay: .06s; }.landing-page-view .hero-buttons { animation-delay: .12s; }.landing-page-view .preview-mockup-card { animation-delay: .18s; }
.landing-page-view .stat-number, .landing-page-view .price-amount { color: var(--color-cyan); }
.landing-page-view .stat-label, .landing-page-view .feature-card p,
.landing-page-view .price-features, .landing-page-view .price-amount span,
.landing-page-view .quote, .landing-page-view .user-role,
.landing-page-view .faq-answer { color: #b7b0c9; }.landing-page-view .icon-box { background: rgba(97,43,244,.2); color: var(--color-cyan); }.landing-page-view .price-card.popular { border-color: var(--color-violet); box-shadow: 0 10px 26px rgba(97,43,244,.25); }.landing-page-view .popular-tag { background: var(--gradient-aurora); }.landing-page-view .btn-price-outline { border-color: #524779; color: var(--color-white); background: transparent; }.landing-page-view .faq-section, .landing-page-view .footer { border-color: #332b5c; }.landing-page-view .footer { color: #b7b0c9; }.landing-page-view .footer .brand-logo:not(.astro-mark) { background: var(--gradient-aurora); }

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
  background: #1a1433 !important;
  border-color: #332b5c !important;
  box-shadow: 0 18px 40px rgba(0, 0, 0, .24) !important;
}

.landing-page-view .navbar { background: rgba(7, 3, 26, .9) !important; }

.landing-page-view .brand-logo:not(.astro-mark),
.landing-page-view .btn-primary,
.landing-page-view .btn-hero-primary,
.landing-page-view .btn-price-primary,
.landing-page-view .popular-tag,
.landing-page-view .mockup-btn,
.landing-page-view .avatar,
.landing-page-view .icon-box {
  background: var(--gradient-aurora) !important;
  color: var(--color-white) !important;
  box-shadow: 0 10px 28px rgba(97, 43, 244, .25) !important;
}

.landing-page-view .badge-tag,
.landing-page-view .btn-outline,
.landing-page-view .btn-hero-secondary,
.landing-page-view .btn-price-outline {
  background: transparent !important;
  border-color: #524779 !important;
  color: var(--color-white) !important;
}

.landing-page-view .section-title,
.landing-page-view .hero-title,
.landing-page-view h2,
.landing-page-view h3,
.landing-page-view .user-name {
  color: var(--color-white) !important;
}

.landing-page-view .hero-subtitle,
.landing-page-view .section-subtitle,
.landing-page-view .quote,
.landing-page-view .user-role,
.landing-page-view .feature-card p,
.landing-page-view .faq-answer,
.landing-page-view .price-features {
  color: #b7b0c9 !important;
}

.landing-page-view .glow-bg {
  display: block !important;
}
</style>
