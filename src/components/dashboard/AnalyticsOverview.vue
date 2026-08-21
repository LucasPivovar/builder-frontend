<template>
  <section class="analytics-overview">
    <div class="analytics-cards">
      <article><i class="bi bi-eye"></i><strong>{{ totals.views || 0 }}</strong><span>visualizações</span></article>
      <article><i class="bi bi-cursor-fill"></i><strong>{{ totals.clicks || 0 }}</strong><span>cliques</span></article>
      <article><i class="bi bi-people"></i><strong>{{ totals.sessions || 0 }}</strong><span>sessões</span></article>
      <article><i class="bi bi-stopwatch"></i><strong>{{ formatDuration(totals.avgTimeSeconds || 0) }}</strong><span>tempo médio</span></article>
    </div>
    <div class="video-dashboard">
      <div class="video-heading">
        <h3><i class="bi bi-play-btn-fill"></i> Dashboard de vídeos</h3>
        <span>{{ videos.length }} {{ videos.length === 1 ? 'vídeo rastreado' : 'vídeos rastreados' }}</span>
      </div>
      <div v-if="!videos.length" class="empty-video">Os vídeos aparecem aqui depois que uma página publicada receber visitas.</div>
      <div v-else class="video-list">
        <article v-for="video in videos" :key="`${video.pageId}-${video.target}`">
          <strong>{{ video.target }}</strong>
          <span>{{ pageName(video.pageId) }}</span>
          <em>{{ video.plays }} plays</em>
          <em>{{ formatDuration(video.avgWatchedSeconds || 0) }} média</em>
          <em>{{ video.completions }} conclusões</em>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  totals: { type: Object, default: () => ({}) },
  pages: { type: Array, default: () => [] },
  videos: { type: Array, default: () => [] }
});

function pageName(pageId) {
  return props.pages.find(page => page.pageId === pageId)?.pageName || pageId;
}

function formatDuration(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  const min = Math.floor(value / 60);
  const sec = Math.round(value % 60);
  return min ? `${min}m ${sec}s` : `${sec}s`;
}
</script>

<style scoped>
.analytics-overview{display:flex;flex-direction:column;gap:14px;margin-bottom:18px}.analytics-cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.analytics-cards article{display:grid;grid-template-columns:38px 1fr;gap:4px 10px;align-items:center;padding:15px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface)}.analytics-cards i{grid-row:1/3;width:38px;height:38px;display:grid;place-items:center;border-radius:10px;background:var(--color-primary-soft);color:var(--color-primary-strong)}.analytics-cards strong{font-size:21px;line-height:1;color:var(--color-text)}.analytics-cards span{color:var(--color-text-muted);font-size:11px;font-weight:800}.video-dashboard{border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface);overflow:hidden}.video-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--color-border)}.video-heading h3{margin:0;display:flex;align-items:center;gap:8px;color:var(--color-text);font-size:15px}.video-heading span{color:var(--color-text-muted);font-size:11px;font-weight:800}.empty-video{padding:18px;color:var(--color-text-muted);font-size:12px;text-align:center}.video-list{display:flex;flex-direction:column;max-height:280px;overflow:auto}.video-list article{display:grid;grid-template-columns:minmax(180px,1.5fr) minmax(130px,1fr) repeat(3,90px);gap:12px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--color-border)}.video-list article:last-child{border-bottom:0}.video-list strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--color-text);font-size:12px}.video-list span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--color-text-muted);font-size:11px}.video-list em{font-style:normal;color:var(--color-primary-strong);font-size:11px;font-weight:900}@media(max-width:860px){.analytics-cards{grid-template-columns:repeat(2,1fr)}.video-list article{grid-template-columns:1fr 1fr}.video-list em{display:none}}@media(max-width:520px){.analytics-cards{grid-template-columns:1fr}.video-heading{align-items:flex-start;flex-direction:column}}
</style>
