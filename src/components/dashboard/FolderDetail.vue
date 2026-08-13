<template>
  <div class="folder-detail-container">
    <!-- Breadcrumb Header -->
    <div class="folder-header">
      <nav class="folder-breadcrumb" aria-label="Navegação da pasta">
        <button type="button" @click="$emit('back')"><i class="bi bi-folder2-open"></i> Pastas</button>
        <i class="bi bi-chevron-right"></i>
        <strong>{{ folder.name }}</strong>
      </nav>

      <div class="folder-title-row">
        <div class="folder-badge-icon">
          <i class="bi bi-folder-fill" :style="{ color: folderAccent(folder.color) }"></i>
        </div>
        <div>
          <h2>{{ folder.name }}</h2>
          <p class="folder-meta">{{ pages.length }} páginas neste projeto</p>
        </div>

        <div class="folder-actions">
          <select v-model="sortMode" class="folder-sort" aria-label="Ordenar páginas">
            <option value="recent">Mais recentes</option>
            <option value="name">Nome A–Z</option>
            <option value="oldest">Mais antigas</option>
          </select>
          <div class="view-switch" aria-label="Modo de visualização">
            <button type="button" :class="{ active: viewMode === 'cards' }" title="Visualizar em cards" @click="viewMode = 'cards'"><i class="bi bi-grid-3x3-gap-fill"></i></button>
            <button type="button" :class="{ active: viewMode === 'list' }" title="Visualizar em lista" @click="viewMode = 'list'"><i class="bi bi-list-ul"></i></button>
          </div>
          <button class="btn-download-folder" type="button" :disabled="!pages.length" @click="$emit('download-folder')">
            <i class="bi bi-file-earmark-zip"></i> Baixar ZIP
          </button>
          <button class="btn-add-page" type="button" @click="$emit('open-builder')">
            <i class="bi bi-plus-lg"></i> Adicionar página
          </button>
        </div>
      </div>
    </div>

    <!-- Pages inside this folder -->
    <div class="folder-pages-grid" :class="`view-${viewMode}`">
      <div v-if="displayedPages.length === 0" class="empty-folder-box">
        <i class="bi bi-folder2-open empty-icon"></i>
        <p>Nenhuma página criada nesta pasta ainda.</p>
        <button class="btn-primary-sm" @click="$emit('open-builder')">Criar Primeira Página</button>
      </div>

      <div
        v-else
        v-for="page in displayedPages"
        :key="page.id"
        class="page-item-card"
      >
        <div class="page-preview-box">
          <span class="category-badge-tag">{{ page.category }}</span>
          <span class="status-tag" :class="page.statusClass">{{ page.statusText }}</span>
          <div class="page-preview-mockup">
            <div class="mockup-line"></div>
            <div class="mockup-line short"></div>
            <div class="mockup-btn"></div>
          </div>
        </div>
        <div class="page-item-info">
          <div class="page-item-title">{{ page.title }}</div>
          <div class="page-item-date">{{ page.date }}</div>
          <div class="page-item-actions">
            <button class="btn-edit-builder" @click="$emit('edit-page', page.templateId)">Editar no Builder</button>
            <button class="btn-item-more" @click="$emit('more-options', page)"><i class="bi bi-three-dots-vertical"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  folder: Object,
  pages: Array
});

defineEmits(['back', 'open-builder', 'edit-page', 'more-options', 'download-folder']);

const viewMode = ref('cards');
const sortMode = ref('recent');
const displayedPages = computed(() => [...(props.pages || [])].sort((a, b) => {
  if (sortMode.value === 'name') return String(a.title || '').localeCompare(String(b.title || ''), 'pt-BR');
  const aDate = new Date(a.lastEditedAt || a.updatedAt || a.rawUpdatedAt || 0).getTime();
  const bDate = new Date(b.lastEditedAt || b.updatedAt || b.rawUpdatedAt || 0).getTime();
  return sortMode.value === 'oldest' ? aDate - bDate : bDate - aDate;
}));

const allowedFolderColors = new Set(['#0ea5e9', '#0284c7', '#38bdf8', '#7dd3fc', '#0369a1', '#075985']);

function folderAccent(color) {
  return allowedFolderColors.has(String(color || '').toLowerCase()) ? color : '#0ea5e9';
}
</script>

<style scoped>
.folder-detail-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.folder-header {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
}

.folder-breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: var(--color-text-muted); font-size: 12px; }
.folder-breadcrumb button { display: inline-flex; align-items: center; gap: 7px; padding: 0; border: 0; background: transparent; color: var(--color-primary-strong); cursor: pointer; font: inherit; font-weight: 800; }
.folder-breadcrumb > i { color: var(--color-primary-border); font-size: 10px; }
.folder-breadcrumb strong { max-width: min(360px, 50vw); overflow: hidden; color: var(--color-text-secondary); text-overflow: ellipsis; white-space: nowrap; }

.folder-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.folder-badge-icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary-soft);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.folder-title-row h2 {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text);
}

.folder-meta {
  font-size: 13px;
  color: var(--color-text-muted);
}

.btn-add-page {
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.folder-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.folder-sort { height: 38px; padding: 0 10px; border: 1px solid var(--color-border); border-radius: 9px; outline: none; background: var(--color-surface); color: var(--color-text-secondary); font: inherit; font-size: 11px; font-weight: 700; }
.folder-sort:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-focus-ring); }
.view-switch { display: flex; padding: 3px; border: 1px solid var(--color-border); border-radius: 9px; background: var(--color-surface-soft); }
.view-switch button { width: 32px; height: 30px; border: 0; border-radius: 6px; background: transparent; color: var(--color-text-muted); cursor: pointer; }
.view-switch button.active { background: var(--color-primary-soft); color: var(--color-primary-strong); }
.btn-download-folder { display: inline-flex; align-items: center; gap: 7px; padding: 9px 12px; border: 1px solid var(--color-border-strong); border-radius: 9px; background: var(--color-surface); color: var(--color-primary-strong); cursor: pointer; font: inherit; font-size: 12px; font-weight: 800; }
.btn-download-folder:disabled { opacity: .45; cursor: not-allowed; }

.folder-pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.folder-pages-grid.view-list { grid-template-columns: 1fr; gap: 10px; }
.folder-pages-grid.view-list .page-item-card { display: grid; grid-template-columns: 160px minmax(0, 1fr); min-height: 104px; }
.folder-pages-grid.view-list .page-preview-box { height: 100%; min-height: 104px; border-right: 1px solid var(--color-border); border-bottom: 0; }
.folder-pages-grid.view-list .page-preview-mockup { height: 76px; }
.folder-pages-grid.view-list .page-item-info { justify-content: center; }
.folder-pages-grid.view-list .page-item-actions { justify-content: flex-end; margin-top: 10px; }
.folder-pages-grid.view-list .btn-edit-builder { flex: 0 1 180px; }

.empty-folder-box {
  grid-column: 1 / -1;
  background: var(--color-surface);
  border: 1px dashed var(--color-border-strong);
  border-radius: 16px;
  padding: 60px 20px;
  text-align: center;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 48px;
  color: var(--color-primary);
  margin-bottom: 12px;
  display: block;
}

.btn-primary-sm {
  margin-top: 16px;
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.page-item-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.page-item-card:hover {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary-bright);
  transform: translateY(-4px);
}

.page-preview-box {
  height: 140px;
  background: var(--color-primary-soft);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--color-border);
}

.page-preview-mockup {
  width: 80%;
  height: 80%;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0.8;
}

.mockup-line { height: 8px; background: var(--color-border); border-radius: 4px; }
.mockup-line.short { width: 50%; }
.mockup-btn { height: 14px; background: var(--color-primary); border-radius: 4px; width: 40%; margin-top: 4px; }

.status-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.status-tag.published { background: var(--color-primary-soft); color: var(--color-primary-strong); }
.status-tag.draft { background: var(--color-primary-subtle); color: var(--color-primary-strong); border: 1px solid var(--color-border); }

.category-badge-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--color-surface);
  color: var(--color-primary-strong);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
}

.page-item-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.page-item-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; color: var(--color-text); }
.page-item-date { font-size: 12px; color: var(--color-text-muted); margin-bottom: 14px; }

.page-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.btn-edit-builder {
  flex: 1;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  border: 1px solid var(--color-border-strong);
  padding: 8px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}

.btn-item-more {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

@media (max-width: 820px) {
  .folder-title-row { align-items: flex-start; flex-wrap: wrap; }
  .folder-actions { width: 100%; margin-left: 0; flex-wrap: wrap; }
  .btn-add-page { flex: 1; justify-content: center; }
}

@media (max-width: 560px) {
  .folder-header { padding: 18px; }
  .folder-badge-icon { width: 42px; height: 42px; }
  .folder-pages-grid.view-list .page-item-card { grid-template-columns: 1fr; }
  .folder-pages-grid.view-list .page-preview-box { display: none; }
  .btn-download-folder { flex: 1; justify-content: center; }
}
</style>
