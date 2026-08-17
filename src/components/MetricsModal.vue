<template>
  <div v-if="state.isMetricsModalOpen" class="metrics-overlay">
    <section class="metrics-modal" role="dialog" aria-modal="true" aria-label="Métricas locais">
      <header><div><span class="eyebrow">MÉTRICAS LOCAIS</span><h2>Atividade da página</h2></div><button class="icon-btn" aria-label="Fechar métricas" @click="closeMetricsModal"><i class="bi bi-x-lg"></i></button></header>
      <p class="notice"><i class="bi bi-info-circle"></i> Estes dados ficam neste navegador até o backend ser conectado. A prévia já registra visitas, cliques e formulários.</p>
      <div class="metric-grid"><div><span>Visualizações</span><strong>{{ metrics.pageViews }}</strong></div><div><span>Cliques CTA</span><strong>{{ metrics.clicks }}</strong></div><div><span>Leads</span><strong>{{ metrics.leads }}</strong></div><div><span>Conversão CTA</span><strong>{{ conversionRate }}%</strong></div></div>
      <section class="chart-section" aria-label="Gráfico dos últimos 7 dias">
        <div class="chart-heading"><strong>Últimos 7 dias</strong><div class="legend"><span class="views">Visitas</span><span class="clicks">Cliques</span><span class="leads">Leads</span></div></div>
        <canvas ref="chartCanvas" class="metric-chart" role="img" aria-label="Gráfico de visitas, cliques e leads nos últimos sete dias"></canvas>
        <div class="chart-labels"><span v-for="item in chartData" :key="item.key">{{ item.label }}</span></div>
      </section>
      <div class="history-title"><strong>Últimos eventos</strong><button class="clear" @click="clearMetrics">Limpar</button></div>
      <div v-if="metrics.records.length" class="event-list"><div v-for="event in metrics.records.slice(0, 12)" :key="event.id"><span>{{ eventLabel(event.type) }}</span><time>{{ formatDate(event.createdAt) }}</time></div></div>
      <div v-else class="empty"><i class="bi bi-bar-chart"></i><p>Sem dados ainda.</p><small>Abra a prévia para começar a testar.</small></div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';
const { state, getMetrics, clearMetrics, closeMetricsModal } = useBuilderStore();
const chartCanvas = ref(null);
const metrics = computed(() => { state.metricRevision; return getMetrics(); });
const conversionRate = computed(() => metrics.value.pageViews ? Math.round((metrics.value.clicks / metrics.value.pageViews) * 100) : 0);
const chartData = computed(() => {
  const result = [];
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    const sameDay = metrics.value.records.filter(record => new Date(record.createdAt).toISOString().slice(0, 10) === key);
    result.push({ key, label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), views: sameDay.filter(item => item.type === 'page_view').length, clicks: sameDay.filter(item => item.type === 'cta_click').length, leads: sameDay.filter(item => item.type === 'form_submit').length });
  }
  return result;
});
function drawChart() {
  const canvas = chartCanvas.value; if (!canvas) return;
  const width = canvas.clientWidth || 560; const height = 190; const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio; canvas.height = height * ratio;
  const ctx = canvas.getContext('2d'); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, width, height);
  const padding = { top: 18, right: 10, bottom: 14, left: 12 }; const plotWidth = width - padding.left - padding.right; const plotHeight = height - padding.top - padding.bottom;
  const max = Math.max(1, ...chartData.value.flatMap(day => [day.views, day.clicks, day.leads]));
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  for (let line = 0; line < 4; line++) { const y = padding.top + (plotHeight / 3) * line; ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke(); }
  const colors = { views: '#612bf4', clicks: '#2296fc', leads: '#17b5fc' }; const spacing = plotWidth / chartData.value.length; const groupWidth = Math.min(28, spacing * .6); const barWidth = Math.max(3, groupWidth / 3 - 2);
  chartData.value.forEach((day, index) => {
    const baseX = padding.left + index * spacing + (spacing - groupWidth) / 2;
    ['views', 'clicks', 'leads'].forEach((type, barIndex) => {
      const value = day[type]; const barHeight = (value / max) * plotHeight; const x = baseX + barIndex * (barWidth + 2); const y = padding.top + plotHeight - barHeight;
      ctx.fillStyle = colors[type]; ctx.beginPath(); ctx.roundRect(x, y, barWidth, Math.max(barHeight, value ? 3 : 0), 3); ctx.fill();
    });
  });
}
watch([chartData, () => state.isMetricsModalOpen], () => nextTick(drawChart), { deep: true });
onMounted(() => nextTick(drawChart));
function eventLabel(type) { return ({ page_view: 'Visualização da página', cta_click: 'Clique em CTA', form_submit: 'Envio de formulário' })[type] || type; }
function formatDate(value) { return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); }
</script>

<style scoped>
.metrics-overlay { position:fixed; inset:0; z-index:100000; display:grid; place-items:center; padding:20px; background:rgba(15,23,42,.45); }.metrics-modal { width:min(680px,96vw); max-height:84vh; overflow:auto; background:var(--color-surface); border:1px solid var(--color-border); border-radius:18px; box-shadow:0 24px 60px rgba(15,23,42,.22); }header { display:flex; justify-content:space-between; align-items:center; padding:20px; border-bottom:1px solid var(--color-primary-soft); }.eyebrow { font-size:10px; color:var(--color-primary-hover); letter-spacing:.12em; font-weight:900; }h2 { margin:3px 0 0; font-size:19px; color:var(--color-text); }.icon-btn { border:0; background:transparent; color:var(--color-text-muted); cursor:pointer; font-size:17px; }.notice { margin:16px 20px; padding:11px 12px; border-radius:8px; background:var(--color-primary-subtle); color:var(--color-primary-deep); font-size:12px; line-height:1.45; }.metric-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; padding:0 20px 20px; }.metric-grid div { border:1px solid var(--color-border); border-radius:12px; padding:14px; background:var(--color-surface-soft); }.metric-grid span { display:block; color:var(--color-text-muted); font-size:10px; font-weight:800; text-transform:uppercase; }.metric-grid strong { display:block; margin-top:7px; color:var(--color-primary-strong); font-size:24px; }.chart-section { margin:0 20px 20px; padding:14px; border:1px solid var(--color-primary-soft); border-radius:12px; background:var(--color-surface-soft); }.chart-heading, .legend { display:flex; align-items:center; }.chart-heading { justify-content:space-between; gap:10px; color:var(--color-text-secondary); font-size:12px; }.legend { gap:9px; color:var(--color-text-muted); font-size:10px; }.legend span::before { content:''; display:inline-block; width:7px; height:7px; margin-right:4px; border-radius:99px; }.legend .views::before { background:var(--color-primary); }.legend .clicks::before { background:var(--color-primary-bright); }.legend .leads::before { background:var(--color-primary-strong); }.metric-chart { display:block; width:100%; height:190px; margin-top:8px; }.chart-labels { display:grid; grid-template-columns:repeat(7,1fr); color:var(--color-text-soft); text-align:center; font-size:10px; }.history-title { display:flex; justify-content:space-between; padding:14px 20px; border-top:1px solid var(--color-primary-soft); color:var(--color-text); }.clear { border:0; background:transparent; color:#dc2626; cursor:pointer; font:inherit; font-size:12px; font-weight:800; }.event-list { padding:0 20px 16px; }.event-list div { display:flex; justify-content:space-between; gap:14px; padding:11px 0; border-bottom:1px solid #f1f5f9; color:var(--color-text-secondary); font-size:12px; }.event-list time { color:var(--color-text-muted); font-size:11px; }.empty { padding:32px; text-align:center; color:var(--color-text-muted); }.empty i { color:var(--color-primary); font-size:32px; }.empty p { margin:8px 0 4px; color:var(--color-text-secondary); font-weight:800; }@media (max-width:520px) { .metric-grid { grid-template-columns:repeat(2,1fr); }.legend { gap:5px; font-size:9px; }.chart-section { margin:0 14px 16px; }.metric-chart { height:160px; }.history-title { padding:14px; }.event-list { padding:0 14px 16px; } }@media (max-width:360px) { .metric-grid { grid-template-columns:1fr; } }
</style>
