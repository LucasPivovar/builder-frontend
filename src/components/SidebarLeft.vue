<template>
  <aside class="sidebar-left">
    <div class="sidebar-tabs">
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
        <i class="bi bi-grid-3x3"></i> Grid Layouts
      </button>
    </div>

    <div class="sidebar-content">
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

const activeTab = ref('objects');
const { addElementToCanvas, addRow } = useBuilderStore();

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
