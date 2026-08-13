<template>
  <div v-if="state.isVersionModalOpen" class="history-overlay">
    <section class="history-modal tour-version-modal" role="dialog" aria-modal="true">
      <header>
        <div><span class="eyebrow">HISTÓRICO LOCAL</span><h2>Versões da página</h2></div>
        <button class="icon-btn" @click="closeVersionModal"><i class="bi bi-x-lg"></i></button>
      </header>
      <div class="create-version">
        <input v-model="label" maxlength="50" placeholder="Ex.: antes de mudar a oferta" @keyup.enter="saveVersion" />
        <button @click="saveVersion"><i class="bi bi-bookmark-plus"></i> Criar versão</button>
      </div>
      <div v-if="versions.length" class="version-list">
        <article v-for="version in versions" :key="version.id" class="version-item">
          <div><strong>{{ version.label }}</strong><span>{{ formatDate(version.createdAt) }} · {{ countElements(version) }} blocos</span></div>
          <button @click="restore(version)"><i class="bi bi-arrow-counterclockwise"></i> Restaurar</button>
        </article>
      </div>
      <div v-else class="empty"><i class="bi bi-clock-history"></i><p>Nenhuma versão salva ainda.</p><small>As versões ficam neste navegador até conectar o backend.</small></div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';
const { state, createVersion, getVersions, restoreVersion, closeVersionModal } = useBuilderStore();
const label = ref('');
const versions = computed(() => { state.versionRevision; return getVersions(); });
function saveVersion() { createVersion(label.value || 'Versão manual'); label.value = ''; }
function restore(version) { if (confirm(`Restaurar “${version.label}”? O conteúdo atual não será apagado.`)) restoreVersion(version); }
function formatDate(value) { return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); }
function countElements(version) { return (version.snapshot?.rows || []).reduce((total, row) => total + (row.columns || []).reduce((sum, column) => sum + (column.elements || []).length, 0), 0); }
</script>

<style scoped>
.history-overlay { position: fixed; inset: 0; z-index: 100000; display: grid; place-items: center; padding: 20px; background: rgba(15, 23, 42, .45); }
.history-modal { width: min(640px, 96vw); max-height: 82vh; overflow: auto; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 18px; box-shadow: 0 24px 60px rgba(15,23,42,.22); }
header { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid var(--color-primary-soft); }
.eyebrow { font-size: 10px; color: var(--color-primary-hover); letter-spacing: .12em; font-weight: 900; } h2 { margin: 3px 0 0; font-size: 19px; color: var(--color-text); }
.icon-btn { border: 0; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 17px; }
.create-version { padding: 16px 20px; display: flex; gap: 8px; border-bottom: 1px solid var(--color-primary-soft); }
input { flex: 1; min-width: 0; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px 12px; font: inherit; }
button { border: 0; border-radius: 8px; background: var(--color-primary); color: var(--color-surface); padding: 10px 12px; cursor: pointer; font: inherit; font-size: 12px; font-weight: 800; }
.version-list { padding: 8px 20px 16px; } .version-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
.version-item strong { display: block; color: var(--color-text); font-size: 14px; }.version-item span { display: block; margin-top: 4px; color: var(--color-text-muted); font-size: 11px; }.version-item button { background: var(--color-primary-soft); color: var(--color-primary-strong); }
.empty { padding: 46px 20px; text-align: center; color: var(--color-text-muted); }.empty i { color: var(--color-primary); font-size: 34px; }.empty p { margin: 10px 0 4px; color: var(--color-text-secondary); font-weight: 800; }
</style>
