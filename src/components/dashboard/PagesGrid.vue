<template>
  <section class="dashboard-section">
    <div class="section-header-row">
      <h2 class="section-h2"><i class="bi bi-file-earmark-code-fill" style="color: #818cf8;"></i> Páginas Recentes</h2>
      <a href="#" class="see-all-link" @click.prevent="$emit('see-all')">Ver todas as páginas →</a>
    </div>

    <div class="pages-grid">
      <div
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
  </section>
</template>

<script setup>
defineProps({
  pages: Array
});

defineEmits(['see-all', 'edit-page', 'more-options']);
</script>

<style scoped>
.dashboard-section { margin-bottom: 36px; }
.section-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-h2 { font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.see-all-link { font-size: 13px; color: #38bdf8; text-decoration: none; font-weight: 600; }

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
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
