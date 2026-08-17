<template>
  <div class="templates-view-wrapper">
    <div v-if="templateType === 'quiz'" class="template-category-block">
      <div class="category-header"><div class="category-title-badge"><i class="bi bi-ui-checks-grid"></i><h3>Templates de Quiz Interativo</h3></div><span class="category-count">{{ 1 + customQuizTemplates.length }} modelos</span></div>
      <div class="templates-grid">
        <div class="page-item-card"><div class="page-preview-box quiz-preview-box"><span class="category-badge-tag">Quiz</span><span class="badge-default-tag">PADRÃO</span><div class="quiz-mockup"><div class="quiz-bar"></div><div class="mockup-line"></div><div class="quiz-option"></div><div class="quiz-option"></div><div class="mockup-btn"></div></div></div><div class="page-item-info"><div class="page-item-title">Quiz de Diagnóstico</div><div class="page-item-date">5 etapas · Perguntas · Análise · Resultado</div><div class="page-item-actions"><button class="btn-edit-builder" @click="$emit('use-template','quiz')"><i class="bi bi-magic"></i> Usar Template Quiz</button></div></div></div>
        <div v-for="tmpl in customQuizTemplates" :key="tmpl.id" class="page-item-card"><div class="page-preview-box quiz-preview-box"><span class="category-badge-tag">Quiz</span><span class="badge-custom-tag">PERSONALIZADO</span><div class="quiz-mockup"><div class="quiz-bar"></div><div class="mockup-line"></div><div class="quiz-option"></div><div class="mockup-btn"></div></div></div><div class="page-item-info"><div class="page-item-title">{{ tmpl.name }}</div><div class="page-item-date">Template de quiz salvo</div><div class="page-item-actions"><button class="btn-edit-builder" @click="$emit('use-template',tmpl.id)"><i class="bi bi-magic"></i> Usar Template Quiz</button></div></div></div>
      </div>
    </div>
    <!-- EMAIL TEMPLATES -->
    <div v-else-if="templateType === 'email'">
      <div class="template-category-block">
        <div class="category-header">
          <div class="category-title-badge">
            <i class="bi bi-envelope-paper-fill" style="color: var(--color-primary-strong);"></i>
            <h3>Templates de E-mail Marketing</h3>
          </div>
          <span class="category-count">{{ 1 + customEmailTemplates.length }} modelos</span>
        </div>

        <div class="templates-grid">
          <!-- Default Email Template -->
          <div class="page-item-card">
            <div class="page-preview-box email-preview-box">
              <span class="category-badge-tag" style="color: var(--color-primary-strong);">E-mail</span>
              <span class="badge-default-tag">PADRÃO</span>
              <div class="email-mockup">
                <div class="template-email-header"></div>
                <div class="em-body">
                  <div class="em-line"></div>
                  <div class="em-line short"></div>
                  <div class="template-email-button"></div>
                </div>
                <div class="template-email-footer"></div>
              </div>
            </div>
            <div class="page-item-info">
              <div class="page-item-title">E-mail Padrão com Header e Footer</div>
              <div class="page-item-date">600px fixo · Header escuro · CTA + Rodapé</div>
              <div class="page-item-actions">
                <button
                  class="btn-edit-builder"
                  style="background: var(--color-primary-soft); color: var(--color-primary-strong); border-color: var(--color-primary-border);"
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
              <span class="category-badge-tag" style="color: var(--color-primary-strong);">E-mail</span>
              <span class="badge-custom-tag">PERSONALIZADO</span>
              <div class="page-preview-mockup" style="border-color: var(--color-primary-border);">
                <div class="mockup-line"></div>
                <div class="mockup-btn" style="background: var(--color-primary);"></div>
              </div>
            </div>
            <div class="page-item-info">
              <div class="page-item-title">{{ tmpl.name }}</div>
              <div class="page-item-date">Template Salvo (JSON)</div>
              <div class="page-item-actions">
                <button
                  class="btn-edit-builder"
                  style="background: var(--color-primary-soft); color: var(--color-primary-strong); border-color: var(--color-primary-border);"
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
const customQuizTemplates = computed(() => customTemplatesRegistry.filter(t => t.quizMode || (t.category || '').toLowerCase().includes('quiz')));

const categorizedFolders = computed(() => {
  const baseFolders = [
    {
      key: 'vsl',
      name: 'Pasta: Templates VSL (Vídeo de Vendas)',
      categoryKey: 'VSL',
      icon: 'bi bi-play-circle-fill',
      color: '#612bf4',
      bgColor: '#f0edfa',
      borderColor: '#c7b8ff',
      defaultTemplates: [
        { id: 'vsl-1', title: 'VSL Vendas de Alta Conversão', subCategory: 'VSL', templateKey: 'vsl' }
      ]
    }
  ];

  return baseFolders.map(folder => {
    const customItems = customTemplatesRegistry.filter(t => {
      const cat = (t.category || '').toLowerCase();
      const targetCat = folder.categoryKey.toLowerCase();
      if (targetCat === 'vsl') return (cat.includes('vsl') || cat.includes('funil') || cat === '') && !cat.includes('quiz') && !cat.includes('mail');
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
  background: var(--color-surface-soft);
  border: 1px dashed var(--color-border);
  border-radius: 20px;
  padding: 80px 24px;
  text-align: center;
}

.empty-icon-box {
  width: 64px;
  height: 64px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
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
  color: var(--color-text);
  margin-bottom: 6px;
}

.empty-email-templates p {
  color: var(--color-primary-deep);
  font-size: 14px;
  max-width: 450px;
  margin: 0 auto 20px auto;
}

.btn-primary-sm {
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.template-category-block {
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
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
  border-bottom: 1px solid var(--color-border);
}

.category-title-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-title-badge i { font-size: 20px; }
.category-title-badge h3 { font-size: 17px; font-weight: 800; color: var(--color-text); }

.category-count {
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
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
  border: 1px solid;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0.8;
}

.mockup-line { height: 8px; background: var(--color-border); border-radius: 4px; }
.mockup-btn { height: 14px; border-radius: 4px; width: 40%; margin-top: 4px; }

.category-badge-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.badge-custom-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
}

.page-item-info { padding: 14px; display: flex; flex-direction: column; flex: 1; }
.page-item-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; color: var(--color-text); }
.page-item-date { font-size: 11.5px; color: var(--color-primary-deep); margin-bottom: 12px; }

.page-item-actions { display: flex; align-items: center; gap: 8px; margin-top: auto; }
.btn-edit-builder { flex: 1; padding: 8px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid; }

/* Email template preview mockup */
.email-preview-box {
  background: var(--color-primary-subtle) !important;
}

.email-mockup {
  width: 75%; height: 80%;
  border-radius: 6px; overflow: hidden;
  border: 1px solid var(--color-primary-border);
  display: flex; flex-direction: column;
}

.template-email-header { height: 22%; background: var(--color-primary-strong); flex-shrink: 0; }
.em-body { flex: 1; background: var(--color-surface); padding: 6px; display: flex; flex-direction: column; gap: 4px; }
.template-email-footer { height: 18%; background: var(--color-primary-strong); flex-shrink: 0; }
.em-line { height: 6px; background: var(--color-border); border-radius: 3px; }
.em-line.short { width: 55%; }
.template-email-button { height: 10px; background: var(--color-primary); border-radius: 3px; width: 40%; margin-top: 4px; }
.quiz-preview-box{background:var(--color-primary-subtle)}.quiz-mockup{width:52%;height:82%;margin:auto;padding:12px 9px;display:flex;flex-direction:column;gap:7px;border:2px solid var(--color-primary-strong);border-radius:16px;background:var(--color-surface)}.quiz-bar{height:4px;border-radius:8px;background:var(--color-primary)}.quiz-option{height:18px;border:1px solid var(--color-border);border-radius:7px}.quiz-mockup .mockup-btn{margin-top:auto;height:14px;border-radius:6px}

.badge-default-tag {
  position: absolute; top: 8px; right: 8px;
  background: var(--color-primary-soft);
  color: var(--color-primary-bright); font-size: 10px; font-weight: 800;
  padding: 2px 8px; border-radius: 999px;
}
/* Superfícies claras para a biblioteca de templates. */
.empty-email-templates, .template-category-block, .page-item-card { background:var(--color-surface); border-color:var(--color-border); }
.empty-email-templates { border-style:dashed; }.empty-email-templates h3, .category-title-badge h3, .page-item-title { color:var(--color-text); }.empty-email-templates p, .page-item-date { color:var(--color-text-muted); }
.empty-icon-box { background:var(--color-primary-soft); color:var(--color-primary-hover); }.btn-primary-sm { background:var(--color-primary); }.category-header { border-color:var(--color-primary-soft); }.category-count { background:var(--color-primary-soft); color:var(--color-primary-strong); }
.page-item-card:hover { background:var(--color-primary-subtle); border-color:var(--color-primary-bright); }.page-preview-box { background:var(--color-primary-soft); border-color:var(--color-border); }.page-preview-mockup { background:var(--color-surface); border-color:var(--color-border); }.mockup-line { background:var(--color-border); }.mockup-btn { background:var(--color-primary); }.category-badge-tag { background:var(--color-surface); color:var(--color-primary-strong); }.btn-edit-builder { background:var(--color-primary-soft); color:var(--color-primary-strong); border-color:var(--color-border-strong); }.btn-item-more { background:var(--color-surface-soft); border-color:var(--color-border); color:var(--color-text-muted); }
</style>
