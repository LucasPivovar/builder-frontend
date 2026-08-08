<template>
  <section class="dashboard-section">
    <div class="section-header-row">
      <h2 class="section-h2"><i class="bi bi-folder-fill" style="color: #f59e0b;"></i> Pastas</h2>
      <div class="section-header-actions">
        <button class="btn-new-folder" @click="$emit('create-folder')">
          <i class="bi bi-folder-plus"></i> Nova Pasta
        </button>
        <a href="#" class="see-all-link" @click.prevent="$emit('see-all')">Ver todas →</a>
      </div>
    </div>

    <div v-if="folders.length === 0" class="empty-folders">
      <i class="bi bi-folder-plus empty-icon"></i>
      <p>Nenhuma pasta criada. Organize suas páginas em pastas!</p>
      <button class="btn-create-folder" @click="$emit('create-folder')">
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
          <i class="bi bi-folder-fill folder-icon" :style="{ color: folder.color || '#f59e0b' }"></i>
          <div>
            <div class="folder-name">{{ folder.name }}</div>
            <div class="folder-items-count">{{ getFolderPageCount(folder.id) }} página(s)</div>
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
import { useBuilderStore } from '../../composables/useBuilderStore';

defineProps({
  folders: Array
});

defineEmits(['see-all', 'open-folder', 'create-folder', 'rename-folder', 'delete-folder']);

const { pagesRegistry } = useBuilderStore();

function getFolderPageCount(folderId) {
  return pagesRegistry.filter(p => p.folderId === folderId).length;
}
</script>

<style scoped>
.dashboard-section { margin-bottom: 36px; }

.section-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-h2 { font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: #fff; }
.section-header-actions { display: flex; align-items: center; gap: 10px; }
.see-all-link { font-size: 13px; color: #38bdf8; text-decoration: none; font-weight: 600; }

.btn-new-folder {
  background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24; padding: 6px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; gap: 6px;
}

.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.folder-card {
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px; padding: 14px 16px;
  display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; transition: all 0.2s ease;
}

.folder-card:hover {
  background: rgba(30, 41, 62, 0.9);
  border-color: rgba(245, 158, 11, 0.3);
  transform: translateY(-2px);
}

.folder-left { display: flex; align-items: center; gap: 12px; }
.folder-icon { font-size: 24px; }
.folder-name { font-size: 14px; font-weight: 700; color: #fff; }
.folder-items-count { font-size: 12px; color: #94a3b8; }

.folder-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
.folder-card:hover .folder-actions { opacity: 1; }

.btn-folder-action {
  width: 28px; height: 28px; border-radius: 7px; border: none;
  background: rgba(255,255,255,0.08); color: #94a3b8; cursor: pointer; font-size: 12px;
}

.btn-folder-action:hover { background: rgba(255,255,255,0.15); color: #fff; }
.btn-folder-action.btn-delete:hover { background: rgba(239,68,68,0.2); color: #f87171; }

.empty-folders {
  background: rgba(23, 31, 48, 0.4); border: 1px dashed rgba(255,255,255,0.12);
  border-radius: 16px; padding: 40px; text-align: center; color: #94a3b8;
}

.empty-icon { font-size: 40px; color: #f59e0b; display: block; margin-bottom: 10px; }

.btn-create-folder {
  margin-top: 14px; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3);
  color: #fbbf24; padding: 8px 18px; border-radius: 9px; font-weight: 700; font-size: 13px; cursor: pointer;
}
</style>
