<template>
  <div class="pages-by-folder-container">
    <!-- Folder Section Block -->
    <div
      v-for="group in folderGroups"
      :key="group.folderId"
      class="folder-block-section"
    >
      <div class="folder-block-header">
        <div class="folder-block-title">
          <i class="bi bi-folder2-open folder-icon-open" :style="{ color: group.color || '#0ea5e9' }"></i>
          <h3>{{ group.folderName }}</h3>
          <span class="folder-count-badge">{{ group.pages.length }} páginas</span>
        </div>

        <a
          href="#"
          class="see-all-folder-btn"
          @click.prevent="$emit('see-all-folder', group.folderId)"
        >
          Ver todos <i class="bi bi-arrow-right"></i>
        </a>
      </div>

      <!-- Files Grid (Up to 4 items per row) -->
      <div class="folder-files-grid">
        <div
          v-for="page in group.pages.slice(0, 4)"
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
  </div>
</template>

<script setup>
defineProps({
  folderGroups: Array
});

defineEmits(['see-all-folder', 'edit-page', 'more-options']);
</script>

<style scoped>
.pages-by-folder-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.folder-block-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  padding: 24px;
}

.folder-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-primary-soft);
}

.folder-block-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.folder-icon-open {
  font-size: 24px;
}

.folder-block-title h3 {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text);
}

.folder-count-badge {
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.see-all-folder-btn {
  color: var(--color-primary-bright);
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s;
}

.see-all-folder-btn:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* 4 Items per row layout */
.folder-files-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

@media (min-width: 640px) {
  .folder-files-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .folder-files-grid {
    grid-template-columns: repeat(4, 1fr);
  }
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
  height: 130px;
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
  top: 8px;
  right: 8px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}

.status-tag.published { background: var(--color-primary-soft); color: var(--color-primary-strong); }
.status-tag.draft { background: var(--color-primary-subtle); color: var(--color-primary-strong); border: 1px solid var(--color-border); }

.category-badge-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--color-surface);
  color: var(--color-primary-bright);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.page-item-info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.page-item-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; color: var(--color-text); }
.page-item-date { font-size: 11.5px; color: var(--color-text-muted); margin-bottom: 12px; }

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
  padding: 7px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-item-more {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
