<template>
  <div v-if="state.isPreviewModalOpen" class="preview-overlay">
    <section class="preview-modal" aria-modal="true" role="dialog">
      <header class="preview-header">
        <div>
          <span class="eyebrow">PRÉVIA ISOLADA</span>
          <h2>{{ state.pageSettings.pageTitle || 'Página sem título' }}</h2>
        </div>
        <div class="preview-actions">
          <button :class="{ active: device === 'desktop' }" @click="device = 'desktop'"><i class="bi bi-laptop"></i> Desktop</button>
          <button :class="{ active: device === 'mobile' }" @click="device = 'mobile'"><i class="bi bi-phone"></i> Mobile</button>
          <button title="Atualizar prévia" @click="refresh"><i class="bi bi-arrow-clockwise"></i></button>
          <button class="close" title="Fechar" @click="closePreviewModal"><i class="bi bi-x-lg"></i></button>
        </div>
      </header>
      <div class="preview-stage">
        <iframe :key="refreshKey" class="preview-frame" :class="device" :srcdoc="exportedHTML" sandbox="allow-scripts allow-forms allow-popups allow-same-origin" title="Prévia da página"></iframe>
      </div>
      <footer>Esta prévia roda isolada do editor. Cliques e formulários são registrados apenas nas métricas locais desta sessão.</footer>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';
import { generateExportedHTML } from '../utils/htmlExporter';

const { state, closePreviewModal, recordMetric } = useBuilderStore();
const device = ref('desktop');
const refreshKey = ref(0);
const exportedHTML = computed(() => generateExportedHTML(state.rows, { ...state.pageSettings, builderMode: state.builderMode }));
function refresh() { refreshKey.value++; }
function onMessage(event) {
  const data = event.data;
  if (data?.source === 'visual-builder' && data.type === 'metric' && data.metric) recordMetric(data.metric);
}
onMounted(() => window.addEventListener('message', onMessage));
onBeforeUnmount(() => window.removeEventListener('message', onMessage));
</script>

<style scoped>
.preview-overlay { position: fixed; inset: 0; z-index: 100000; background: rgba(15, 23, 42, .45); padding: 24px; display: grid; place-items: center; }
.preview-modal { width: min(1280px, 96vw); height: min(880px, 92vh); border: 1px solid var(--color-border); border-radius: 18px; overflow: hidden; background: var(--color-surface-soft); box-shadow: 0 28px 75px rgba(15, 23, 42, .25); display: flex; flex-direction: column; }
.preview-header { min-height: 74px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
.eyebrow { color: var(--color-primary-hover); font-size: 10px; font-weight: 900; letter-spacing: .12em; }
h2 { margin: 3px 0 0; color: var(--color-text); font-size: 16px; }
.preview-actions { display: flex; gap: 7px; }
.preview-actions button { border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-secondary); border-radius: 8px; padding: 8px 10px; font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
.preview-actions button.active { border-color: var(--color-primary); background: var(--color-primary-soft); color: var(--color-primary-strong); }
.preview-actions .close { color: #b91c1c; }
.preview-stage { flex: 1; padding: 22px; overflow: auto; background: var(--color-primary-soft); display: flex; justify-content: center; }
.preview-frame { width: 100%; height: 100%; min-height: 620px; border: 1px solid var(--color-border); background: var(--color-surface); box-shadow: 0 10px 26px rgba(14, 116, 144, .15); transition: width .2s ease; }
.preview-frame.mobile { width: 390px; max-width: 100%; border-radius: 22px; }
footer { background: var(--color-surface); border-top: 1px solid var(--color-border); padding: 10px 20px; color: var(--color-text-muted); font-size: 11px; }
@media (max-width: 640px) { .preview-overlay { padding: 0; } .preview-modal { width: 100vw; height: 100vh; border-radius: 0; } .preview-header { padding: 12px; } .preview-actions button:not(.close) { font-size: 0; } .preview-stage { padding: 10px; } }
</style>
