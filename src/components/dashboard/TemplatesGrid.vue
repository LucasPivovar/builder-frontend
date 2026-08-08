<template>
  <div class="templates-view-wrapper">
    <!-- EMAIL TEMPLATES -->
    <div v-if="templateType === 'email'">
      <div class="template-category-block">
        <div class="category-header">
          <div class="category-title-badge">
            <i class="bi bi-envelope-paper-fill" style="color: #38bdf8;"></i>
            <h3>Templates de E-mail Marketing</h3>
          </div>
          <span class="category-count">{{ 1 + customEmailTemplates.length }} modelos</span>
        </div>

        <div class="templates-grid">
          <!-- Default Email Template -->
          <div class="page-item-card">
            <div class="page-preview-box email-preview-box">
              <span class="category-badge-tag" style="color: #38bdf8;">E-mail</span>
              <span class="badge-default-tag">PADRÃO</span>
              <div class="email-mockup">
                <div class="em-header"></div>
                <div class="em-body">
                  <div class="em-line"></div>
                  <div class="em-line short"></div>
                  <div class="em-btn"></div>
                </div>
                <div class="em-footer"></div>
              </div>
            </div>
            <div class="page-item-info">
              <div class="page-item-title">E-mail Padrão com Header e Footer</div>
              <div class="page-item-date">600px fixo · Header escuro · CTA + Rodapé</div>
              <div class="page-item-actions">
                <button
                  class="btn-edit-builder"
                  style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border-color: rgba(56, 189, 248, 0.35);"
                  @click="$emit('use-template', 'email')"
                >
                  <i class="bi bi-magic"></i> Usar Template E-mail
                </button>
              </div>
            </div>
          </div>

          <!-- Custom Email Templates -->
          <div
            v-for="tmpl in customEmailTemplates"
            :key="tmpl.id"
            class="page-item-card"
          >
            <div class="page-preview-box">
              <span class="category-badge-tag" style="color: #38bdf8;">E-mail</span>
              <span class="badge-custom-tag">PERSONALIZADO</span>
              <div class="page-preview-mockup" style="border-color: #38bdf8;">
                <div class="mockup-line"></div>
                <div class="mockup-btn" style="background: #38bdf8;"></div>
              </div>
            </div>
            <div class="page-item-info">
              <div class="page-item-title">{{ tmpl.name }}</div>
              <div class="page-item-date">Template Salvo (JSON)</div>
              <div class="page-item-actions">
                <button
                  class="btn-edit-builder"
                  style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-color: rgba(56, 189, 248, 0.4);"
                  @click="$emit('use-template', tmpl.id)"
                >
                  <i class="bi bi-magic"></i> Usar Template E-mail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FUNNEL TEMPLATES CATEGORIZED IN FOLDERS (VSL, UPSELL, DOWNSELL, CAPTURA) -->
    <div v-else class="funnel-templates-wrapper">
      <div
        v-for="group in categorizedFolders"
        :key="group.key"
        class="template-category-block"
      >
        <div class="category-header">
          <div class="category-title-badge">
            <i :class="group.icon" :style="{ color: group.color }"></i>
            <h3>{{ group.name }}</h3>
          </div>
          <span class="category-count">{{ group.templates.length }} modelos nesta pasta</span>
        </div>

        <div class="templates-grid">
          <div
            v-for="tmpl in group.templates"
            :key="tmpl.id"
            class="page-item-card"
          >
            <div class="page-preview-box">
              <span class="category-badge-tag" :style="{ color: group.color }">{{ tmpl.subCategory }}</span>
              <span v-if="tmpl.isCustom" class="badge-custom-tag">PERSONALIZADO</span>
              <div class="page-preview-mockup" :style="{ borderColor: group.color }">
                <div class="mockup-line"></div>
                <div class="mockup-btn" :style="{ background: group.color }"></div>
              </div>
            </div>
            <div class="page-item-info">
              <div class="page-item-title">{{ tmpl.title }}</div>
              <div class="page-item-date">{{ tmpl.isCustom ? 'Template Salvo (JSON)' : 'Pronto para uso' }}</div>
              <div class="page-item-actions">
                <button
                  class="btn-edit-builder"
                  :style="{ background: group.bgColor, color: group.color, borderColor: group.borderColor }"
                  @click="$emit('use-template', tmpl.templateKey)"
                >
                  <i class="bi bi-magic"></i> Usar Template {{ tmpl.subCategory }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBuilderStore } from '../../composables/useBuilderStore';

defineProps({
  templateType: {
    type: String,
    default: 'funil'
  }
});

defineEmits(['use-template', 'switch-funnel']);

const { customTemplatesRegistry } = useBuilderStore();

const customEmailTemplates = computed(() => {
  return customTemplatesRegistry.filter(t => (t.category || '').toLowerCase().includes('mail'));
});

const categorizedFolders = computed(() => {
  const baseFolders = [
    {
      key: 'vsl',
      name: '📁 Pasta: Templates VSL (Vídeo de Vendas)',
      categoryKey: 'VSL',
      icon: 'bi bi-play-circle-fill',
      color: '#34d399',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      defaultTemplates: [
        { id: 'vsl-1', title: 'VSL Vendas de Alta Conversão', subCategory: 'VSL', templateKey: 'vsl' }
      ]
    }
  ];

  return baseFolders.map(folder => {
    const customItems = customTemplatesRegistry.filter(t => {
      const cat = (t.category || '').toLowerCase();
      const targetCat = folder.categoryKey.toLowerCase();
      if (targetCat === 'vsl') return cat.includes('vsl') || cat.includes('funil') || cat === '';
      return cat.includes(targetCat);
    }).map(t => ({
      id: t.id,
      title: t.name,
      subCategory: t.category || folder.categoryKey,
      templateKey: t.id,
      isCustom: true
    }));

    return {
      ...folder,
      templates: [...customItems, ...folder.defaultTemplates]
    };
  });
});
</script>

<style scoped>
.templates-view-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.empty-email-templates {
  background: rgba(23, 31, 48, 0.5);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 80px 24px;
  text-align: center;
}

.empty-icon-box {
  width: 64px;
  height: 64px;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 16px auto;
}

.empty-email-templates h3 {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 6px;
}

.empty-email-templates p {
  color: #94a3b8;
  font-size: 14px;
  max-width: 450px;
  margin: 0 auto 20px auto;
}

.btn-primary-sm {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.template-category-block {
  background: rgba(23, 31, 48, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.category-title-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-title-badge i { font-size: 20px; }
.category-title-badge h3 { font-size: 17px; font-weight: 800; color: #fff; }

.category-count {
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
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
  border: 1px solid;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0.8;
}

.mockup-line { height: 8px; background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
.mockup-btn { height: 14px; border-radius: 4px; width: 40%; margin-top: 4px; }

.category-badge-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(15, 23, 42, 0.85);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.badge-custom-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(99, 102, 241, 0.25);
  color: #a5b4fc;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
}

.page-item-info { padding: 14px; display: flex; flex-direction: column; flex: 1; }
.page-item-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; color: #fff; }
.page-item-date { font-size: 11.5px; color: #94a3b8; margin-bottom: 12px; }

.page-item-actions { display: flex; align-items: center; gap: 8px; margin-top: auto; }
.btn-edit-builder { flex: 1; padding: 8px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid; }

/* Email template preview mockup */
.email-preview-box {
  background: #f5f5f7 !important;
}

.email-mockup {
  width: 75%; height: 80%;
  border-radius: 6px; overflow: hidden;
  border: 1px solid rgba(56, 189, 248, 0.4);
  display: flex; flex-direction: column;
}

.em-header { height: 22%; background: #27272a; flex-shrink: 0; }
.em-body { flex: 1; background: #ffffff; padding: 6px; display: flex; flex-direction: column; gap: 4px; }
.em-footer { height: 18%; background: #27272a; flex-shrink: 0; }
.em-line { height: 6px; background: #d4d4d8; border-radius: 3px; }
.em-line.short { width: 55%; }
.em-btn { height: 10px; background: #27272a; border-radius: 3px; width: 40%; margin-top: 4px; }

.badge-default-tag {
  position: absolute; top: 8px; right: 8px;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8; font-size: 10px; font-weight: 800;
  padding: 2px 8px; border-radius: 999px;
}
</style>
