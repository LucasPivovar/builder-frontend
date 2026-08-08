<template>
  <div class="folder-detail-container">
    <!-- Breadcrumb Header -->
    <div class="folder-header">
      <button class="btn-back" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i> Voltar para Pastas
      </button>

      <div class="folder-title-row">
        <div class="folder-badge-icon">
          <i class="bi bi-folder-fill" :style="{ color: folder.color || '#f59e0b' }"></i>
        </div>
        <div>
          <h2>{{ folder.name }}</h2>
          <p class="folder-meta">{{ pages.length }} páginas neste projeto</p>
        </div>

        <button class="btn-add-page" @click="$emit('open-builder')">
          <i class="bi bi-plus-lg"></i> Adicionar Página a esta Pasta
        </button>
      </div>
    </div>

    <!-- Pages inside this folder -->
    <div class="folder-pages-grid">
      <div v-if="pages.length === 0" class="empty-folder-box">
        <i class="bi bi-folder2-open empty-icon"></i>
        <p>Nenhuma página criada nesta pasta ainda.</p>
        <button class="btn-primary-sm" @click="$emit('open-builder')">Criar Primeira Página</button>
      </div>

      <div
        v-else
        v-for="page in pages"
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
defineProps({
  folder: Object,
  pages: Array
});

defineEmits(['back', 'open-builder', 'edit-page', 'more-options']);
</script>

<style scoped>
.folder-detail-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.folder-header {
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
}

.btn-back {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  min-width: max-content;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.12);
}

.folder-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.folder-badge-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.folder-title-row h2 {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
}

.folder-meta {
  font-size: 13px;
  color: #94a3b8;
}

.btn-add-page {
  margin-left: auto;
  background: #6366f1;
  color: #fff;
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

.folder-pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.empty-folder-box {
  grid-column: 1 / -1;
  background: rgba(23, 31, 48, 0.5);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 60px 20px;
  text-align: center;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  color: #f59e0b;
  margin-bottom: 12px;
  display: block;
}

.btn-primary-sm {
  margin-top: 16px;
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.page-item-card {
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.page-item-card:hover {
  background: rgba(30, 41, 62, 0.9);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-4px);
}

.page-preview-box {
  height: 140px;
  background: #111827;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.page-preview-mockup {
  width: 80%;
  height: 80%;
  background: #1f2937;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0.8;
}

.mockup-line { height: 8px; background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
.mockup-line.short { width: 50%; }
.mockup-btn { height: 14px; background: #6366f1; border-radius: 4px; width: 40%; margin-top: 4px; }

.status-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.status-tag.published { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.status-tag.draft { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }

.category-badge-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(15, 23, 42, 0.85);
  color: #38bdf8;
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

.page-item-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; color: #fff; }
.page-item-date { font-size: 12px; color: #94a3b8; margin-bottom: 14px; }

.page-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.btn-edit-builder {
  flex: 1;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
