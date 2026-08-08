<template>
  <section class="dashboard-section">
    <div class="section-header-row">
      <h2 class="section-h2"><i class="bi bi-grid-1x2-fill" style="color: #34d399;"></i> Pastas de Templates</h2>
    </div>

    <div class="template-folders-grid">
      <!-- Folder 1: Templates de Funil -->
      <div
        class="template-folder-card"
        @click="$emit('open-template-folder', 'templates-funil')"
      >
        <div class="folder-card-left">
          <div class="folder-icon-box" style="background: rgba(52, 211, 153, 0.15); color: #34d399;">
            <i class="bi bi-folder-fill"></i>
          </div>
          <div>
            <div class="folder-card-name">Templates de Funil</div>
            <div class="folder-card-sub">VSL, Upsell e Downsell · {{ totalFunnelTemplatesCount }} modelos</div>
          </div>
        </div>
        <div class="folder-card-arrow">
          <i class="bi bi-chevron-right"></i>
        </div>
      </div>

      <!-- Folder 2: Templates de E-mail -->
      <div
        class="template-folder-card"
        @click="$emit('open-template-folder', 'templates-email')"
      >
        <div class="folder-card-left">
          <div class="folder-icon-box" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">
            <i class="bi bi-folder-fill"></i>
          </div>
          <div>
            <div class="folder-card-name">Templates de E-mail</div>
            <div class="folder-card-sub">Sequências de E-mail Marketing · 0 modelos</div>
          </div>
        </div>
        <div class="folder-card-arrow">
          <i class="bi bi-chevron-right"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useBuilderStore } from '../../composables/useBuilderStore';

defineEmits(['open-template-folder']);

const { customTemplatesRegistry } = useBuilderStore();

const totalFunnelTemplatesCount = computed(() => {
  return 5 + customTemplatesRegistry.length;
});
</script>

<style scoped>
.dashboard-section {
  margin-bottom: 36px;
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-h2 {
  font-size: 17px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.template-folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.template-folder-card {
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-folder-card:hover {
  background: rgba(30, 41, 62, 0.9);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-2px);
}

.folder-card-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.folder-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.folder-card-name {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.folder-card-sub {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.folder-card-arrow {
  color: #94a3b8;
  font-size: 16px;
}

.template-folder-card:hover .folder-card-arrow {
  color: #fff;
}
</style>
