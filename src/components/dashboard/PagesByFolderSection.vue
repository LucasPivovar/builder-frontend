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
          <i class="bi bi-folder2-open folder-icon-open" :style="{ color: group.color || '#f59e0b' }"></i>
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
  background: rgba(23, 31, 48, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
}

.folder-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
  color: #ffffff;
}

.folder-count-badge {
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.see-all-folder-btn {
  color: #38bdf8;
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
  height: 130px;
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
  top: 8px;
  right: 8px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}

.status-tag.published { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.status-tag.draft { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }

.category-badge-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(15, 23, 42, 0.85);
  color: #38bdf8;
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

.page-item-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; color: #fff; }
.page-item-date { font-size: 11.5px; color: #94a3b8; margin-bottom: 12px; }

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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
