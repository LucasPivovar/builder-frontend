<template>
  <section class="analytics-overview">
    <div class="analytics-cards">
      <article><i class="bi bi-eye"></i><strong>{{ totals.views || 0 }}</strong><span>visualizações</span></article>
      <article><i class="bi bi-cursor-fill"></i><strong>{{ totals.clicks || 0 }}</strong><span>cliques</span></article>
      <article><i class="bi bi-people"></i><strong>{{ totals.sessions || 0 }}</strong><span>sessões</span></article>
      <article><i class="bi bi-stopwatch"></i><strong>{{ formatDuration(totals.avgTimeSeconds || 0) }}</strong><span>tempo médio</span></article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  totals: { type: Object, default: () => ({}) },
  pages: { type: Array, default: () => [] },
  videos: { type: Array, default: () => [] }
});

function formatDuration(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  const min = Math.floor(value / 60);
  const sec = Math.round(value % 60);
  return min ? `${min}m ${sec}s` : `${sec}s`;
}
</script>

<style scoped>
.analytics-overview { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
.analytics-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.analytics-cards article { display: grid; grid-template-columns: 38px 1fr; gap: 4px 12px; align-items: center; padding: 18px 20px; border: 1px solid var(--color-border); border-radius: 14px; background: var(--color-surface); box-shadow: var(--shadow-sm); }
.analytics-cards i { grid-row: 1/3; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 10px; background: var(--color-primary-soft); color: var(--color-primary-strong); font-size: 16px; }
.analytics-cards strong { font-size: 22px; line-height: 1; color: var(--color-text); font-weight: 800; }
.analytics-cards span { color: var(--color-text-muted); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; }
@media (max-width: 860px) { .analytics-cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .analytics-cards { grid-template-columns: 1fr; } }
</style>
