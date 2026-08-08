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
        <div class="section-title">ELEMENTOS DE CONTEÚDO</div>
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

        <div class="section-title">COMPONENTES DE CONVERSÃO</div>
        <div class="objects-grid">
          <div
            v-for="obj in conversionObjects"
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
import { ref } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';

const activeTab = ref('pages');
const { addElementToCanvas, addRow, loadTemplate } = useBuilderStore();

const pageTemplates = [
  { id: 'lp', title: 'Landing Page (LP)', desc: 'Página de VSL e alta conversão', icon: 'bi bi-rocket-takeoff-fill' },
  { id: 'home', title: 'Página Inicial', desc: 'Home Page SaaS / Institucional', icon: 'bi bi-house-door-fill' },
  { id: 'auth', title: 'Página de Auth', desc: 'Tela de Login e Cadastro', icon: 'bi bi-shield-lock-fill' }
];

const contentObjects = [
  { type: 'top-banner', title: 'Banner Topo', icon: 'bi bi-exclamation-triangle-fill' },
  { type: 'heading', title: 'Título / Headline', icon: 'bi bi-type-h1' },
  { type: 'paragraph', title: 'Parágrafo / Texto', icon: 'bi bi-paragraph' },
  { type: 'button', title: 'Botão Link', icon: 'bi bi-menu-button-wide-fill' }
];

const conversionObjects = [
  { type: 'vturb-player', title: 'Player VTurb', icon: 'bi bi-play-circle-fill' },
  { type: 'pitch-button', title: 'Botão CTA Pitch', icon: 'bi bi-lightning-charge-fill' },
  { type: 'upsell-buttons', title: 'Botões Upsell', icon: 'bi bi-bag-check-fill' },
  { type: 'live-viewers', title: 'Espectadores Ao Vivo', icon: 'bi bi-eye-fill' }
];

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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-template-card:hover {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.35);
  transform: translateX(3px);
}

.page-template-icon {
  width: 38px;
  height: 38px;
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
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
  color: #ffffff;
}

.page-template-desc {
  font-size: 11.5px;
  color: var(--text-muted, #94a3b8);
}

.card-arrow {
  color: rgba(255, 255, 255, 0.3);
  font-size: 18px;
}

.page-template-card:hover .card-arrow {
  color: #818cf8;
}
</style>
