<template>
  <header class="builder-header">
    <div class="header-start">
      <button class="icon-button back-button" :aria-label="state.isTemplateBuilder ? 'Voltar aos templates' : 'Voltar ao painel'" :title="state.isTemplateBuilder ? 'Voltar aos templates' : 'Voltar ao painel'" @click="goToDashboard">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="page-identification">
        <strong>{{ state.currentPageName || 'Página sem título' }}</strong>
        <span>{{ state.isTemplateBuilder ? 'Template · ' : '' }}{{ state.builderMode === 'email' ? 'E-mail' : state.builderMode === 'quiz' ? 'Quiz interativo' : 'Funil' }}</span>
      </div>
    </div>

    <div class="header-tools">
      <label v-if="state.builderMode === 'funil'" class="viewport-select" title="Tamanho da área de edição">
        <i class="bi bi-aspect-ratio"></i>
        <select :value="state.viewportMode" aria-label="Tamanho da área de edição" @change="setViewport($event.target.value)">
          <option value="100%">VSL · 100%</option>
          <option value="1024px">Desktop</option>
          <option value="768px">Tablet</option>
          <option value="375px">Celular</option>
        </select>
      </label>
      <div v-else class="viewport-fixed" :title="state.builderMode === 'email' ? 'E-mails usam largura fixa de 600px' : 'Quizzes usam largura de 460px'">
        <i :class="state.builderMode === 'email' ? 'bi bi-envelope-paper' : 'bi bi-phone'"></i>
        <span>{{ state.builderMode === 'email' ? 'E-mail · 600px' : 'Quiz · 460px' }}</span>
      </div>

      <div class="history-controls" aria-label="Histórico de alterações">
        <button class="icon-button" :disabled="undoStack.length <= 1" aria-label="Desfazer" title="Desfazer (Ctrl+Z)" @click="undo"><i class="bi bi-arrow-counterclockwise"></i></button>
        <button class="icon-button" :disabled="redoStack.length === 0" aria-label="Refazer" title="Refazer (Ctrl+Y)" @click="redo"><i class="bi bi-arrow-clockwise"></i></button>
      </div>

      <button class="icon-button" aria-label="Abrir prévia" title="Abrir prévia" @click="$emit('open-preview')"><i class="bi bi-eye"></i></button>
      <button class="icon-button clear-canvas-button" aria-label="Limpar canvas" title="Limpar canvas" @click="clearCanvas"><i class="bi bi-trash3"></i></button>

      <div class="more-menu tour-more-menu tour-history" @click.stop>
        <button class="icon-button" :class="{ active: isMoreMenuOpen }" aria-label="Mais ações" title="Mais ações" @click="isMoreMenuOpen = !isMoreMenuOpen"><i class="bi bi-three-dots"></i></button>
        <div v-if="isMoreMenuOpen" class="more-menu-panel">
          <button @click="openSummary"><i class="bi bi-file-text"></i> Resumo</button>
          <button class="tour-versions-action" @click="openVersions"><i class="bi bi-clock-history"></i> Versões</button>
          <button @click="openMetrics"><i class="bi bi-bar-chart-line"></i> Métricas</button>
          <span></span>
          <button class="danger" @click="clearCanvas"><i class="bi bi-trash"></i> Limpar página</button>
        </div>
      </div>

      <button class="action-button save-button tour-save" :title="state.isTemplateBuilder ? 'Publicar template' : 'Salvar página'" @click="$emit('open-save')"><i :class="state.isTemplateBuilder ? 'bi bi-cloud-arrow-up-fill' : 'bi bi-floppy-fill'"></i><span>{{ state.isTemplateBuilder ? (state.currentTemplateId ? 'Atualizar template' : 'Publicar template') : 'Salvar' }}</span></button>
      <button class="action-button export-button tour-export" title="Publicar página" @click="$emit('open-export')"><i class="bi bi-cloud-arrow-up-fill"></i><span>Publicar</span></button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBuilderStore } from '../composables/useBuilderStore';

const emit = defineEmits(['open-export', 'open-save', 'open-preview', 'open-versions', 'open-metrics']);
const router = useRouter();
const isMoreMenuOpen = ref(false);
const { state, undoStack, redoStack, undo, redo, setViewport, clearCanvas, openSummaryModal, closeTemplateBuilder } = useBuilderStore();

function goToDashboard() {
  if (state.isTemplateBuilder) {
    closeTemplateBuilder();
    router.push({ path: '/admin', query: { tab: 'templates' } });
    return;
  }
  router.push('/dashboard');
}
function openSummary() { openSummaryModal(); isMoreMenuOpen.value = false; }
function openVersions() { emit('open-versions'); isMoreMenuOpen.value = false; }
function openMetrics() { emit('open-metrics'); isMoreMenuOpen.value = false; }
function handleKeyDown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    event.shiftKey ? redo() : undo();
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
    event.preventDefault(); redo();
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault(); emit('open-save');
  }
}
function closeMenus() { isMoreMenuOpen.value = false; }
onMounted(() => { window.addEventListener('keydown', handleKeyDown); window.addEventListener('click', closeMenus); });
onUnmounted(() => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('click', closeMenus); });
</script>

<style scoped>
.builder-header { height: 58px; padding: 0 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-shrink:0; background:var(--color-surface); border-bottom:1px solid var(--color-border); color:var(--color-text); }
.header-start, .header-tools, .history-controls { display:flex; align-items:center; }
.header-start { min-width:0; gap:10px; }
.header-tools { gap:7px; }
.page-identification { min-width:0; display:flex; flex-direction:column; line-height:1.2; }
.page-identification strong { max-width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; font-size:13px; }
.page-identification span { color:var(--color-text-muted); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
.icon-button { width:34px; height:34px; display:grid; place-items:center; border:1px solid var(--color-border); border-radius:9px; background:var(--color-surface); color:var(--color-text-secondary); cursor:pointer; font-size:15px; transition:.15s ease; }
.icon-button:hover:not(:disabled), .icon-button.active { color:var(--color-primary-strong); border-color:var(--color-border-strong); background:var(--color-primary-soft); }
.icon-button:disabled { opacity:.35; cursor:not-allowed; }
.clear-canvas-button { color:var(--color-danger); }
.back-button { color:var(--color-primary-strong); background:var(--color-primary-subtle); }
.history-controls { gap:3px; padding-right:7px; border-right:1px solid var(--color-border); }
.viewport-select { height:34px; display:flex; align-items:center; gap:6px; padding:0 9px; border:1px solid var(--color-border); border-radius:9px; background:var(--color-surface); color:var(--color-text-secondary); font-size:13px; cursor:pointer; }
.viewport-select:focus-within { border-color:var(--color-primary-bright); box-shadow:0 0 0 3px var(--color-primary-soft); }
.viewport-fixed { height:34px; display:flex; align-items:center; gap:6px; padding:0 10px; border:1px solid var(--color-border); border-radius:9px; background:var(--color-primary-subtle); color:var(--color-primary-strong); font-size:11px; font-weight:800; white-space:nowrap; }
.viewport-select select { border:0; outline:0; background:transparent; color:var(--color-text-secondary); font:inherit; font-weight:700; cursor:pointer; }
.more-menu { position:relative; }
.more-menu-panel { position:absolute; right:0; top:42px; z-index:1000; width:190px; padding:6px; border:1px solid var(--color-border); border-radius:12px; background:var(--color-surface); box-shadow:0 16px 35px rgba(15,23,42,.16); }
.more-menu-panel button { width:100%; display:flex; align-items:center; gap:9px; border:0; border-radius:8px; padding:10px; background:transparent; color:var(--color-text-secondary); text-align:left; font:inherit; font-size:12px; font-weight:700; cursor:pointer; }
.more-menu-panel button:hover { background:var(--color-primary-subtle); color:var(--color-primary-strong); }
.more-menu-panel span { display:block; height:1px; margin:5px 4px; background:var(--color-border); }
.more-menu-panel .danger { color:var(--color-danger); }.more-menu-panel .danger:hover { background:var(--color-danger-soft); color:var(--color-danger-strong); }
.action-button { height:34px; display:flex; align-items:center; gap:6px; border:0; border-radius:9px; padding:0 12px; color:var(--color-surface); font:inherit; font-size:12px; font-weight:800; cursor:pointer; }
.save-button { background:var(--color-primary); }.export-button { background:var(--color-primary-strong); }.save-button:hover { background:var(--color-primary-hover); }.export-button:hover { background:var(--color-primary-deep); }
@media (max-width:700px) { .builder-header { padding:0 9px; gap:7px; }.page-identification strong { max-width:96px; }.viewport-select { position:relative; width:34px; padding:0; justify-content:center; }.viewport-select select { position:absolute; inset:0; display:block; width:100%; opacity:0; cursor:pointer; }.history-controls { padding-right:0; border:0; }.history-controls .icon-button:last-child { display:none; }.action-button { width:34px; padding:0; justify-content:center; }.action-button span { display:none; } }
@media (max-width:390px) { .page-identification { display:none; }.history-controls { display:none; } }
</style>
