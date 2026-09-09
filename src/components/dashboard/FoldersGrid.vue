<template>
  <section class="dashboard-section">
    <div class="section-header-row">
      <h2 class="section-h2"><i class="bi bi-folder-fill" style="color: var(--color-primary);"></i> Pastas</h2>
      <div class="section-header-actions">
        <button class="btn-new-folder tour-create-folder" @click="$emit('create-folder')">
          <i class="bi bi-folder-plus"></i> Nova pasta
        </button>
      </div>
    </div>

    <div v-if="folders.length === 0" class="empty-folders">
      <i class="bi bi-folder-plus empty-icon"></i>
      <p>Nenhuma pasta criada. Organize suas páginas em pastas!</p>
      <button class="btn-create-folder tour-create-folder" @click="$emit('create-folder')">
        <i class="bi bi-plus"></i> Criar Primeira Pasta
      </button>
    </div>

    <div v-else class="folders-grid">
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="folder-card"
        @click="$emit('open-folder', folder)"
      >
        <div class="folder-left">
          <i class="bi bi-folder-fill folder-icon" :style="{ color: folderAccent(folder.color) }"></i>
          <div>
            <div class="folder-name">{{ folder.name }}</div>
            <div class="folder-items-count">{{ getFolderPageCount(folder.id) }} {{ getFolderPageCount(folder.id) === 1 ? 'página' : 'páginas' }}</div>
            <div class="folder-domain"><i class="bi bi-globe2"></i>{{ folderDomainLabel(folder) }}</div>
          </div>
        </div>
        <div class="folder-actions" @click.stop>
          <button class="btn-folder-action" @click="$emit('rename-folder', folder)" title="Renomear">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn-folder-action btn-delete" @click="$emit('delete-folder', folder.id)" title="Excluir">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useBuilderStore } from '../../composables/useBuilderStore';

const props = defineProps({
  folders: Array,
  publications: { type: Array, default: () => [] }
});

defineEmits(['open-folder', 'create-folder', 'rename-folder', 'delete-folder']);

const { pagesRegistry } = useBuilderStore();
const allowedFolderColors = new Set(['#612bf4', '#a854fa', '#395cf9', '#2296fc', '#17b5fc', '#1a1433']);
const pagesByFolder = computed(() => pagesRegistry.reduce((map, page) => {
  const list = map.get(page.folderId) || [];
  list.push(page.id);
  map.set(page.folderId, list);
  return map;
}, new Map()));

function getFolderPageCount(folderId) {
  return pagesRegistry.filter(p => p.folderId === folderId).length;
}

function folderAccent(color) {
  return allowedFolderColors.has(String(color || '').toLowerCase()) ? color : '#612bf4';
}

function folderDomainLabel(folder) {
  if (folder.customDomain) return folder.customDomain;
  const pageIds = new Set(pagesByFolder.value.get(folder.id) || []);
  const publication = props.publications.find(item => pageIds.has(item.pageId) && item.customDomain);
  if (!publication?.customDomain) return 'Domínio não configurado';
  return publication.domainStatus === 'active' ? publication.customDomain : `${publication.customDomain} · DNS pendente`;
}
</script>

<style scoped>
.dashboard-section { margin-bottom: 36px; }

.section-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-h2 { font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: var(--color-text); }
.section-header-actions { display: flex; align-items: center; gap: 10px; }

.btn-new-folder {
  background: var(--color-primary-soft); border: 1px solid var(--color-border-strong);
  color: var(--color-primary-strong); padding: 6px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; gap: 6px;
}

.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.folder-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px; padding: 16px;
  display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; transition: all 0.2s ease;
}

.folder-card:hover {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary-bright);
  transform: translateY(-2px);
}

.folder-left { display: flex; align-items: center; gap: 12px; }
.folder-icon { font-size: 24px; }
.folder-name { font-size: 14px; font-weight: 700; color: var(--color-text); }
.folder-items-count { font-size: 12px; color: var(--color-text-muted); }
.folder-domain { display:flex; align-items:center; gap:6px; margin-top:7px; color:var(--color-text-secondary); font-size:11px; font-weight:600; }
.folder-domain i { color:var(--color-primary-strong); }

.folder-actions { display:flex; gap:6px; opacity:1; }

.btn-folder-action {
  width:34px; height:34px; border-radius:9px; border:1px solid var(--color-border);
  background:var(--color-surface); color:var(--color-text-secondary); cursor:pointer; font-size:13px;
}

.btn-folder-action:hover { background: var(--color-primary-soft); color: var(--color-primary-strong); }
.btn-folder-action.btn-delete:hover { background: var(--color-danger-soft); color: var(--color-danger-strong); }

.empty-folders {
  background: var(--color-surface); border: 1px dashed var(--color-border-strong);
  border-radius: 16px; padding: 40px; text-align: center; color: var(--color-text-muted);
}

.empty-icon { font-size: 40px; color: var(--color-primary); display: block; margin-bottom: 10px; }

.btn-create-folder {
  margin-top: 14px; background: var(--color-primary-soft); border: 1px solid var(--color-border-strong);
  color: var(--color-primary-strong); padding: 8px 18px; border-radius: 9px; font-weight: 700; font-size: 13px; cursor: pointer;
}
</style>
