<template>
  <aside class="sidebar-left">
    <div class="sidebar-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'pages' }"
        @click="activeTab = 'pages'"
      >
        <i class="bi bi-file-earmark-text"></i> Páginas
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'objects' }"
        @click="activeTab = 'objects'"
      >
        <i class="bi bi-box"></i> Objetos
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'grid' }"
        @click="activeTab = 'grid'"
      >
        <i class="bi bi-grid-3x3"></i> Grids
      </button>
    </div>

    <div class="sidebar-content">
      <!-- Tab Páginas / Templates -->
      <div v-if="activeTab === 'pages'" class="tab-content active">
        <div class="section-title">TEMPLATES DE PÁGINAS</div>
        <div class="page-templates-list">
          <div
            v-for="tmpl in pageTemplates"
            :key="tmpl.id"
            class="page-template-card"
            @click="loadTemplate(tmpl.id)"
          >
            <div class="page-template-icon"><i :class="tmpl.icon"></i></div>
            <div class="page-template-info">
              <span class="page-template-title">{{ tmpl.title }}</span>
              <span class="page-template-desc">{{ tmpl.desc }}</span>
            </div>
            <i class="bi bi-arrow-right-short card-arrow"></i>
          </div>
        </div>
      </div>

      <!-- Tab Objetos -->
      <div v-if="activeTab === 'objects'" class="tab-content active">
        <div class="section-title">OBJETOS GERAIS</div>
        <div class="objects-grid">
          <div
            v-for="obj in contentObjects"
            :key="obj.type"
            class="object-card"
            @click="addElementToCanvas(obj.type)"
          >
            <div class="object-icon"><i :class="obj.icon"></i></div>
            <span class="object-name">{{ obj.title }}</span>
          </div>
        </div>

        <div class="section-title">{{ modeSectionTitle }}</div>
        <div class="objects-grid">
          <div
            v-for="obj in modeObjects"
            :key="obj.type"
            class="object-card"
            @click="addElementToCanvas(obj.type)"
          >
            <div class="object-icon"><i :class="obj.icon"></i></div>
            <span class="object-name">{{ obj.title }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Grid Layouts -->
      <div v-if="activeTab === 'grid'" class="tab-content active">
        <div class="section-title">PRESETS DE COLUNAS</div>
        <div class="grid-presets-list">
          <div
            v-for="grid in gridPresets"
            :key="grid.preset"
            class="grid-preset-card"
            @click="addRow(grid.preset)"
          >
            <div class="grid-preset-info">
              <span class="grid-preset-title">{{ grid.title }}</span>
              <span class="grid-preset-cols-text">{{ grid.sub }}</span>
            </div>
            <div class="grid-preview-visual">
              <div
                v-for="(col, i) in grid.cols"
                :key="i"
                class="grid-preview-col"
                :style="{ flex: col }"
              >
                {{ col * 100 / grid.total }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';

const activeTab = ref('pages');
const { state, addElementToCanvas, addRow, loadTemplate } = useBuilderStore();

const vslPageTemplates = [
  { id: 'lp', title: 'Landing Page (LP)', desc: 'Página de VSL e alta conversão', icon: 'bi bi-rocket-takeoff-fill' },
  { id: 'home', title: 'Página Inicial', desc: 'Home Page SaaS / Institucional', icon: 'bi bi-house-door-fill' },
  { id: 'auth', title: 'Página de Auth', desc: 'Tela de Login e Cadastro', icon: 'bi bi-shield-lock-fill' }
];
const emailPageTemplates = [{ id:'email', title:'E-mail profissional', desc:'Cabeçalho, conteúdo, CTA e rodapé', icon:'bi bi-envelope-paper-fill' }];
const quizPageTemplates = [{ id:'quiz', title:'Quiz de diagnóstico', desc:'Perguntas, progresso e resultado', icon:'bi bi-ui-checks-grid' }];
const pageTemplates = computed(() => state.builderMode === 'email' ? emailPageTemplates : state.builderMode === 'quiz' ? quizPageTemplates : vslPageTemplates);

const contentObjects = [
  { type: 'heading', title: 'Título / Headline', icon: 'bi bi-type-h1' },
  { type: 'paragraph', title: 'Parágrafo / Texto', icon: 'bi bi-paragraph' },
  { type: 'image', title: 'Imagem', icon: 'bi bi-image' },
  { type: 'button', title: 'Botão Link', icon: 'bi bi-menu-button-wide-fill' },
  { type: 'divider', title: 'Divisor', icon: 'bi bi-dash-lg' }
];

const quizObjects = [
  { type: 'quiz-progress', title: 'Progresso', icon: 'bi bi-bar-chart-steps' },
  { type: 'quiz-single', title: 'Escolha única', icon: 'bi bi-ui-radios' },
  { type: 'quiz-multiple', title: 'Múltipla escolha', icon: 'bi bi-ui-checks' },
  { type: 'quiz-yes-no', title: 'Sim / Não', icon: 'bi bi-toggles' },
  { type: 'quiz-loading', title: 'Carregamento', icon: 'bi bi-arrow-repeat' },
  { type: 'quiz-metric', title: 'Métricas', icon: 'bi bi-graph-up-arrow' },
  { type: 'quiz-price', title: 'Preço / Plano', icon: 'bi bi-cash-coin' },
  { type: 'quiz-spacer', title: 'Espaço', icon: 'bi bi-arrows-expand' }
];
const vslObjects = [
  { type: 'top-banner', title: 'Banner Topo', icon: 'bi bi-exclamation-triangle-fill' },
  { type: 'vturb-player', title: 'Player VTurb', icon: 'bi bi-play-circle-fill' },
  { type: 'pitch-button', title: 'Botão CTA Pitch', icon: 'bi bi-lightning-charge-fill' },
  { type: 'smart-popup', title: 'Popup inteligente (Modal)', icon: 'bi bi-window-stack' },
  { type: 'live-viewers', title: 'Espectadores Ao Vivo', icon: 'bi bi-eye-fill' }
];
const emailObjects = [
  { type:'email-header', title:'Cabeçalho E-mail', icon:'bi bi-envelope-paper-fill' },
  { type:'email-tag', title:'Tag / Label', icon:'bi bi-tag-fill' },
  { type:'email-footer', title:'Rodapé E-mail', icon:'bi bi-postcard-fill' }
];
const modeObjects = computed(() => state.builderMode === 'email' ? emailObjects : state.builderMode === 'quiz' ? quizObjects : vslObjects);
const modeSectionTitle = computed(() => state.builderMode === 'email' ? 'OBJETOS DE E-MAIL' : state.builderMode === 'quiz' ? 'OBJETOS DO QUIZ' : 'COMPONENTES DE CONVERSÃO VSL');

const gridPresets = [
  { preset: '1-col', title: '1 Coluna', sub: '100% Largura', cols: [1], total: 1 },
  { preset: '2-col', title: '2 Colunas Iguais', sub: '50% / 50%', cols: [1, 1], total: 2 },
  { preset: '3-col', title: '3 Colunas Iguais', sub: '33% x3', cols: [1, 1, 1], total: 3 },
  { preset: '4-col', title: '4 Colunas Iguais', sub: '25% x4', cols: [1, 1, 1, 1], total: 4 }
];
</script>

<style scoped>
.page-templates-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.page-template-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-template-card:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary-border);
  transform: translateX(3px);
}

.page-template-icon {
  width: 38px;
  height: 38px;
  background: var(--color-primary-soft);
  color: var(--color-primary-hover);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.page-template-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-template-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--color-surface);
}

.page-template-desc {
  font-size: 11.5px;
  color: var(--text-muted, var(--color-text-soft));
}

.card-arrow {
  color: var(--color-text-soft);
  font-size: 18px;
}

.page-template-card:hover .card-arrow {
  color: var(--color-primary-hover);
}
</style>
