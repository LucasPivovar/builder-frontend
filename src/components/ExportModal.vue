<template>
  <div v-if="state.isExportModalOpen" class="element-modal-overlay">
    <div class="element-modal-box export-modal-box tour-export-modal">
      <div class="element-modal-header">
        <span class="em-editing-title"><i class="bi bi-check-circle-fill"></i> HTML pronto para exportar</span>
        <button class="modal-close" @click="state.isExportModalOpen = false"><i class="bi bi-x-lg"></i></button>
      </div>

      <div class="element-modal-body">
        <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.4;">
          Seu código HTML foi gerado. Você pode baixar <strong>{{ exportFileName }}</strong>, abrir a prévia ou copiar o código abaixo.
        </p>

        <textarea
          class="em-input"
          style="height: 280px; font-family: var(--font-mono); font-size: 12px; margin-top: 12px;"
          readonly
          v-model="state.exportedHTML"
        ></textarea>

        <div v-if="warnings.length" class="export-warnings">
          <strong><i class="bi bi-exclamation-circle"></i> Revisar antes de publicar</strong>
          <ul><li v-for="warning in warnings" :key="warning">{{ warning }}</li></ul>
        </div>
        <div v-else class="export-ready"><i class="bi bi-check-circle-fill"></i> Página pronta para exportar.</div>
      </div>

      <div class="element-modal-footer" style="justify-content: flex-end; gap: 10px;">
        <button class="btn btn-secondary" @click="openPreviewModal">
          <i class="bi bi-eye"></i> Abrir prévia
        </button>
        <button class="btn btn-secondary" @click="copyExportCode">
          <i class="bi bi-clipboard"></i> {{ copied ? 'Código Copiado!' : 'Copiar Código HTML' }}
        </button>
        <button class="btn btn-primary" @click="downloadExportCode">
          <i class="bi bi-download"></i> Baixar HTML
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';
import { generateExportedHTML } from '../utils/htmlExporter';
import { validateExport } from '../utils/exportValidation';

const { state, openPreviewModal } = useBuilderStore();
const copied = ref(false);
const warnings = computed(() => validateExport(state.rows, state.pageSettings));
const exportFileName = computed(() => state.builderMode === 'email' ? 'pagina-email.html' : state.builderMode === 'quiz' ? 'quiz-interativo.html' : 'pagina-vsl.html');

function copyExportCode() {
  state.exportedHTML = generateExportedHTML(state.rows, { ...state.pageSettings, builderMode: state.builderMode });
  navigator.clipboard.writeText(state.exportedHTML);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

function downloadExportCode() {
  state.exportedHTML = generateExportedHTML(state.rows, { ...state.pageSettings, builderMode: state.builderMode });
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
@media (max-width: 620px) { .element-modal-footer { flex-wrap: wrap; }.element-modal-footer .btn { flex: 1 1 140px; justify-content: center; }.element-modal-body textarea { height: 220px !important; } }
</style>
