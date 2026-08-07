<template>
  <div v-if="state.isExportModalOpen" class="element-modal-overlay">
    <div class="element-modal-box" style="width: min(850px, 94vw);">
      <div class="element-modal-header">
        <span class="em-editing-title">🎉 HTML Exportado com Sucesso!</span>
        <button class="modal-close" @click="state.isExportModalOpen = false">✕</button>
      </div>

      <div class="element-modal-body">
        <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.4;">
          Seu código HTML pronto e otimizado foi gerado. Você pode baixar o arquivo <strong>pagina-vsl.html</strong> ou copiar todo o código abaixo:
        </p>

        <textarea
          class="em-input"
          style="height: 280px; font-family: monospace; font-size: 12px; margin-top: 12px;"
          readonly
          v-model="state.exportedHTML"
        ></textarea>
      </div>

      <div class="element-modal-footer" style="justify-content: flex-end; gap: 10px;">
        <button class="btn btn-secondary" @click="copyExportCode">
          📋 {{ copied ? 'Código Copiado!' : 'Copiar Código HTML' }}
        </button>
        <button class="btn btn-primary" @click="downloadExportCode">
          📥 Baixar HTML
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';

const { state } = useBuilderStore();
const copied = ref(false);

function copyExportCode() {
  navigator.clipboard.writeText(state.exportedHTML);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

function downloadExportCode() {
  const blob = new Blob([state.exportedHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pagina-vsl.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>
