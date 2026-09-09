<template>
  <div v-if="state.isExportModalOpen" class="element-modal-overlay" @mousedown.self="!publishing && (state.isExportModalOpen = false)">
    <section class="element-modal-box export-modal-box tour-export-modal" role="dialog" aria-modal="true" aria-labelledby="export-modal-title" @keydown.esc="!publishing && (state.isExportModalOpen = false)">
      <div class="element-modal-header">
        <span id="export-modal-title" class="em-editing-title"><i class="bi bi-cloud-arrow-up-fill"></i> {{ serverOnly ? 'Publicar página' : 'Exportar e-mail' }}</span>
        <button class="modal-close" :disabled="publishing" aria-label="Fechar" @click="state.isExportModalOpen = false"><i class="bi bi-x-lg"></i></button>
      </div>

      <div class="element-modal-body">
        <p v-if="serverOnly">{{ publishResult ? 'Sua página foi publicada. Acesse pelo endereço abaixo.' : 'Publique sua página diretamente no servidor.' }}</p>
        <p v-else style="font-size: 13.5px; color: var(--text-muted); line-height: 1.4;">
          Seu código HTML foi gerado. Você pode baixar <strong>{{ exportFileName }}</strong>, abrir a prévia, copiar o código ou publicar no servidor.
        </p>

        <textarea
          v-if="!serverOnly"
          readonly
          v-model="state.exportedHTML"
        ></textarea>

        <div v-if="!publishResult && warnings.length" class="export-warnings">
          <strong><i class="bi bi-exclamation-circle"></i> Revisar antes de publicar</strong>
          <ul><li v-for="warning in warnings" :key="warning">{{ warning }}</li></ul>
        </div>
        <div v-else-if="!publishResult" class="export-ready"><i class="bi bi-check-circle-fill"></i> {{ serverOnly ? 'Página pronta para publicar.' : 'Página pronta para exportar.' }}</div>

        <div v-if="publishResult || publishError" class="publish-panel">
          <div v-if="publishResult" class="publish-result">
            <strong><i class="bi bi-broadcast-pin"></i> Publicado no servidor</strong>
            <a :href="publishResult.publicUrl" target="_blank" rel="noopener">
              {{ publishResult.publicUrl }}
            </a>

          </div>
          <div v-if="publishError" class="publish-error">{{ publishError }}</div>
        </div>
      </div>

      <div class="element-modal-footer" style="justify-content: flex-end; gap: 10px;">
        <button v-if="!serverOnly" class="btn btn-secondary" @click="openPreviewModal">
          <i class="bi bi-eye"></i> Abrir prévia
        </button>
        <button v-if="!serverOnly" class="btn btn-secondary" @click="copyExportCode">
          <i class="bi bi-clipboard"></i> {{ copied ? 'Código Copiado!' : 'Copiar Código HTML' }}
        </button>
        <template v-if="serverOnly">
          <button v-if="publishResult" class="btn btn-primary" @click="state.isExportModalOpen = false">Concluir</button>
          <button v-else class="btn btn-primary" :disabled="publishing" @click="publishCurrentPage"><i class="bi bi-cloud-arrow-up"></i> {{ publishing ? 'Publicando...' : 'Publicar' }}</button>
        </template>
        <button v-if="!serverOnly" class="btn btn-primary" @click="downloadExportCode">
          <i class="bi bi-download"></i> Baixar HTML
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';
import { publishPage, prepareEmailTracking } from '../services/api';
import { generateExportedHTML } from '../utils/htmlExporter';
import { validateExport } from '../utils/exportValidation';

const { state, openPreviewModal, showToast, flushWorkspaceToBackend } = useBuilderStore();
const serverOnly = computed(() => state.builderMode !== 'email');
const copied = ref(false);
const publishing = ref(false);
const publishError = ref('');
const publishResult = ref(null);
watch(() => state.isExportModalOpen, (open) => {
  if (open) { publishResult.value = null; publishError.value = ''; }
});
const warnings = computed(() => validateExport(state.rows, state.pageSettings));
const exportFileName = computed(() => state.builderMode === 'email' ? 'pagina-email.html' : state.builderMode === 'quiz' ? 'quiz-interativo.html' : 'pagina-vsl.html');

async function prepareExport() {
  state.exportedHTML = generateExportedHTML(state.rows, { ...state.pageSettings, builderMode: state.builderMode });
  if (state.builderMode === 'email') {
    await flushWorkspaceToBackend();
    const result = await prepareEmailTracking({ pageId: state.currentPageId || '', html: state.exportedHTML });
    state.exportedHTML = result.html;
  }
}
async function copyExportCode() {
  try { await prepareExport(); await navigator.clipboard.writeText(state.exportedHTML); } catch (error) { publishError.value = error.message; return; }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

async function downloadExportCode() {
  try { await prepareExport(); } catch (error) { publishError.value = error.message; return; }
  const blob = new Blob([state.exportedHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = exportFileName.value;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function publishCurrentPage() {
  publishError.value = '';
  publishResult.value = null;
  if (!state.currentPageId) {
    publishError.value = 'Salve a página antes de publicar no servidor.';
    showToast('Salve a página antes de publicar.', 'error');
    return;
  }

  publishing.value = true;
  try {
    await flushWorkspaceToBackend();
    state.exportedHTML = generateExportedHTML(state.rows, {
      ...state.pageSettings,
      builderMode: state.builderMode,
      pageTitle: state.currentPageName || state.pageSettings.pageTitle || 'Página publicada',
      trackingKey: state.currentPageId
    });
    publishResult.value = await publishPage({
      pageId: state.currentPageId,
      pageName: state.currentPageName || state.pageSettings.pageTitle || 'Página publicada',
      html: state.exportedHTML
    });
    showToast('Página publicada no servidor!', 'success');
  } catch (error) {
    publishError.value = error.message || 'Não foi possível publicar agora.';
    showToast(publishError.value, 'error');
  } finally {
    publishing.value = false;
  }
}
</script>

<style scoped>
.export-modal-box {
  width: min(850px, 94vw) !important;
  height: fit-content !important;
  max-height: 90vh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  background: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
  color: var(--color-text) !important;
  box-shadow: var(--shadow-modal) !important;
}
.element-modal-header { padding: 20px; border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
.em-editing-title { color: var(--color-text) !important; }
.em-editing-title i { color: var(--color-primary); }
.publish-steps { display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 600; color: var(--color-text-muted); flex-wrap: wrap; }
.publish-steps span { padding: 8px 12px; border-radius: 8px; }
.publish-steps .active { background: var(--color-primary-subtle); color: var(--color-primary-strong); }
.modal-close { color: var(--color-text-muted); }
.element-modal-body {
  padding: 16px 20px;
  flex: 1;
  background: var(--color-surface);
}
.element-modal-body > p { color: var(--color-text-muted) !important; }
.element-modal-body textarea { border: 1px solid var(--color-border); background: var(--color-surface-soft); color: var(--color-text); }
.element-modal-body textarea:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-focus-ring); }
.element-modal-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  display: flex;
  align-items: center;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
.element-modal-footer .btn-secondary { border-color: var(--color-border); background: var(--color-surface); color: var(--color-primary-strong); }
.element-modal-footer .btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.export-warnings { margin-top: 14px; border: 1px solid var(--color-primary-border); background: var(--color-primary-subtle); color: var(--color-primary-deep); border-radius: 8px; padding: 10px 12px; font-size: 12px; }
.export-warnings ul { margin: 6px 0 0 18px; line-height: 1.45; }
.export-ready { margin-top: 14px; border: 1px solid var(--color-primary-border); background: var(--color-primary-subtle); color: var(--color-primary-deep); border-radius: 8px; padding: 10px 12px; font-size: 12px; font-weight: 700; }
.publish-panel { margin-top: 14px; border: 1px solid var(--color-border); border-radius: 8px; padding: 12px; background: var(--color-surface-soft); }
.publish-label { display: block; margin-bottom: 7px; color: var(--color-text); font-size: 12px; font-weight: 700; }
.publish-panel .em-input { background: var(--color-surface) !important; color: var(--color-text) !important; border-color: var(--color-border) !important; }
.publish-panel .em-input::placeholder { color: var(--color-text-muted) !important; }
.publish-result { margin-top: 10px; display: grid; gap: 6px; color: var(--color-text); font-size: 12px; }
.publish-result strong { color: var(--color-primary-strong); }
.publish-result a { color: var(--color-primary-strong); font-weight: 700; word-break: break-all; }
.publish-result p { margin: 0; color: var(--color-text-muted); line-height: 1.4; }
.publish-error { margin-top: 10px; color: #ef4444; font-size: 12px; font-weight: 700; }
@media (max-width: 620px) { .element-modal-footer { flex-wrap: wrap; }.element-modal-footer .btn { flex: 1 1 140px; justify-content: center; }.element-modal-body textarea { height: 220px !important; } }
</style>
