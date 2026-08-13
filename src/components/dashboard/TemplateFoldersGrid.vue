<template>
  <section class="dashboard-section">
    <div class="section-header-row">
      <h2 class="section-h2"><i class="bi bi-grid-1x2-fill" style="color: var(--color-primary);"></i> Pastas de Templates</h2>
    </div>

    <div class="template-folders-grid">
      <!-- Folder 1: Templates de Funil -->
      <div
        class="template-folder-card"
        @click="$emit('open-template-folder', 'templates-funil')"
      >
        <div class="folder-card-left">
          <div class="folder-icon-box" style="background: var(--color-primary-soft); color: var(--color-primary);">
            <i class="bi bi-folder-fill"></i>
          </div>
          <div>
            <div class="folder-card-name">Templates de Funil</div>
            <div class="folder-card-sub">VSL, upsell e downsell · {{ modelCount(totalFunnelTemplatesCount) }}</div>
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
          <div class="folder-icon-box" style="background: var(--color-primary-soft); color: var(--color-primary);">
            <i class="bi bi-folder-fill"></i>
          </div>
          <div>
            <div class="folder-card-name">Templates de E-mail</div>
            <div class="folder-card-sub">Sequências de e-mail marketing · {{ modelCount(totalEmailTemplatesCount) }}</div>
          </div>
        </div>
        <div class="folder-card-arrow">
          <i class="bi bi-chevron-right"></i>
        </div>
      </div>

      <div
        class="template-folder-card"
        @click="$emit('open-template-folder', 'templates-quiz')"
      >
        <div class="folder-card-left">
          <div class="folder-icon-box">
            <i class="bi bi-folder-fill"></i>
          </div>
          <div>
            <div class="folder-card-name">Templates de Quiz</div>
            <div class="folder-card-sub">Perguntas, diagnóstico e oferta · {{ modelCount(totalQuizTemplatesCount) }}</div>
          </div>
        </div>
        <div class="folder-card-arrow"><i class="bi bi-chevron-right"></i></div>
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
  return 1 + customTemplatesRegistry.filter(template => templateType(template) === 'funil').length;
});
const totalEmailTemplatesCount = computed(() => 1 + customTemplatesRegistry.filter(template => templateType(template) === 'email').length);
const totalQuizTemplatesCount = computed(() => 1 + customTemplatesRegistry.filter(template => templateType(template) === 'quiz').length);
const modelCount = count => `${count} ${count === 1 ? 'modelo' : 'modelos'}`;
function templateType(template) {
  const category=String(template.category||'').toLowerCase();
  if(template.emailMode||category.includes('mail')) return 'email';
  if(template.quizMode||category.includes('quiz')) return 'quiz';
  return 'funil';
}
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
  color: var(--color-text);
}

.template-folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.template-folder-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-folder-card:hover {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary-bright);
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
  color: var(--color-text);
}

.folder-card-sub {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.folder-card-arrow {
  color: var(--color-text-muted);
  font-size: 16px;
}

.template-folder-card:hover .folder-card-arrow {
  color: var(--color-primary-strong);
}
</style>
