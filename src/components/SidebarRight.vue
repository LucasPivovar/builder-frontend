<template>
  <aside class="sidebar-right">
    <!-- Top Tab Bar: Objetos e Seções -->
    <div class="sidebar-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'objects' }"
        @click="activeTab = 'objects'"
      >
        <i class="bi bi-box-seam"></i> Objetos
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'sections' }"
        @click="activeTab = 'sections'"
      >
        <i class="bi bi-list-nested"></i> Seções
      </button>
    </div>

    <div class="sidebar-content">
      <!-- ABA 1: OBJETOS -->
      <div v-if="activeTab === 'objects'" class="tab-content active">
        <!-- Subvisão: Escolha do Grid Layout -->
        <div v-if="showingGridPresets">
          <div class="subpanel-header">
            <button class="btn-back" title="Voltar" @click="showingGridPresets = false">
              <i class="bi bi-arrow-left"></i>
            </button>
            <span class="subpanel-title">Escolha o Layout do Grid</span>
          </div>

          <div class="grid-presets-list">
            <div
              v-for="grid in gridPresets"
              :key="grid.preset"
              class="grid-preset-card"
              @click="selectGridPreset(grid.preset)"
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
                  {{ Math.round(col * 100 / grid.total) }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visão Principal de Objetos -->
        <div v-else>
          <div class="section-title">ESTRUTURA & ESTRUTURAÇÃO</div>
          <div class="objects-grid">
            <!-- Objeto Grid especial -->
            <div class="object-card grid-card" @click="showingGridPresets = true">
              <div class="object-icon"><i class="bi bi-grid-3x3-gap-fill"></i></div>
              <span class="object-name">Grid Layout</span>
            </div>
          </div>

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
      </div>

      <!-- ABA 2: SEÇÕES (ÁRVORE DO CANVAS COM DRAG & DROP + CONFIGS GERAIS) -->
      <div v-if="activeTab === 'sections'" class="tab-content active">
        <!-- ITEM FIXO: CONFIGURAÇÕES GERAIS DA PÁGINA -->
        <div class="global-page-settings-card" @click="openGlobalSettings">
          <div class="gps-icon"><i class="bi bi-gear-wide-connected"></i></div>
          <div class="gps-info">
            <span class="gps-title">⚙️ Configurações Gerais da Página</span>
            <span class="gps-subtitle">Título, Cor de Fundo, Meta Pixel, SEO...</span>
          </div>
          <i class="bi bi-chevron-right" style="color:var(--text-dim); font-size:12px;"></i>
        </div>

        <div class="sections-header-bar">
          <span class="section-title" style="margin:0;">ESTRUTURA DAS SEÇÕES</span>
          <button class="btn-add-section-sm" @click="createNewSection">
            <i class="bi bi-plus-lg"></i> Nova Seção
          </button>
        </div>

        <div v-if="state.rows.length === 0" style="color:var(--text-dim); font-size:12px; text-align:center; padding:20px 0;">
          Nenhuma seção criada. Clique acima para adicionar.
        </div>

        <div class="sections-tree-list">
          <div
            v-for="(row, rowIndex) in state.rows"
            :key="row.id"
            class="section-block"
            draggable="true"
            @dragstart="onDragStartSection(rowIndex, $event)"
            @dragover.prevent
            @drop="onDropSection(rowIndex, $event)"
          >
            <div class="section-header-box">
              <span class="section-header-title">
                <span class="drag-handle" title="Arraste para reordenar esta seção">═</span> {{ getSectionTitle(row, rowIndex) }}
              </span>
              <div class="section-header-actions">
                <button
                  class="section-action-btn"
                  title="Duplicar Seção"
                  @click.stop="duplicateRow(rowIndex)"
                >
                  <i class="bi bi-files"></i>
                </button>
                <button
                  class="section-action-btn"
                  title="Excluir Seção"
                  @click.stop="deleteRow(rowIndex)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <!-- Lista de Elementos Internos da Seção (Draggables entre Seções) -->
            <div
              class="section-items-container"
              @dragover.prevent
              @drop.stop="onDropItem(rowIndex, $event)"
            >
              <template v-for="col in row.columns" :key="col.id">
                <div
                  v-for="elem in col.elements"
                  :key="elem.id"
                  class="section-item-row"
                  draggable="true"
                  @dragstart.stop="onDragStartItem(col.id, elem, $event)"
                  @click.stop="openModalForElement(elem)"
                >
                  <span class="section-item-label" :title="getElementSummary(elem)">
                    <i class="bi bi-grip-vertical" style="color:var(--text-dim); margin-right:4px;"></i>
                    <i class="bi bi-file-earmark-text" style="color:var(--accent-primary);"></i>
                    <strong>{{ getElementTypeLabel(elem) }}:</strong> {{ getElementSummary(elem) }}
                  </span>
                  <div class="section-item-actions" style="position: relative;">
                    <button
                      class="section-action-btn"
                      title="Opções do Objeto"
                      @click.stop="toggleElementDropdown(elem.id)"
                    >
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>

                    <div
                      v-if="activeElementDropdownId === elem.id"
                      class="elem-context-dropdown"
                      @click.stop
                    >
                      <button class="elem-dd-item" @click="openModalForElement(elem); closeAllDropdowns();">
                        <i class="bi bi-pencil-square" style="color: #818cf8;"></i> Editar Objeto
                      </button>
                      <button class="elem-dd-item" @click="duplicateElement(elem.id); closeAllDropdowns();">
                        <i class="bi bi-files" style="color: #10b981;"></i> Duplicar Objeto
                      </button>
                      <div class="elem-dd-divider"></div>
                      <button class="elem-dd-item danger" @click="deleteElement(elem.id); closeAllDropdowns();">
                        <i class="bi bi-trash" style="color: #ef4444;"></i> Excluir Objeto
                      </button>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Dropzone para Seção Vazia -->
              <div v-if="!hasElementsInRow(row)" class="empty-section-dropzone">
                <i class="bi bi-box-arrow-in-down" style="font-size: 16px;"></i>
                <span>Seção Vazia — Arraste um objeto aqui</span>
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
const showingGridPresets = ref(false);

const draggedSectionIndex = ref(null);
const draggedItemData = ref(null);

const activeElementDropdownId = ref(null);

function toggleElementDropdown(id) {
  activeElementDropdownId.value = activeElementDropdownId.value === id ? null : id;
}

function closeAllDropdowns() {
  activeElementDropdownId.value = null;
}

const { state, addRow, addElementToCanvas, duplicateRow, deleteRow, openModalForElement, openGlobalSettings, duplicateElement, deleteElement } = useBuilderStore();

const contentObjects = [
  { type: 'top-banner', title: 'Banner Topo', icon: 'bi bi-exclamation-triangle-fill' },
  { type: 'heading', title: 'Título / Headline', icon: 'bi bi-type-h1' },
  { type: 'paragraph', title: 'Parágrafo / Texto', icon: 'bi bi-paragraph' },
  { type: 'button', title: 'Botão Link', icon: 'bi bi-menu-button-wide-fill' }
];

const conversionObjects = [
  { type: 'vturb-player', title: 'Player VTurb', icon: 'bi bi-play-circle-fill' },
  { type: 'pitch-button', title: 'Botão CTA Pitch', icon: 'bi bi-lightning-charge-fill' },
  { type: 'live-viewers', title: 'Espectadores Ao Vivo', icon: 'bi bi-eye-fill' }
];

const gridPresets = [
  { preset: '1-col', title: '1 Coluna', sub: '100% Largura', cols: [1], total: 1 },
  { preset: '2-col', title: '2 Colunas Iguais', sub: '50% / 50%', cols: [1, 1], total: 2 },
  { preset: '3-col', title: '3 Colunas Iguais', sub: '33% x3', cols: [1, 1, 1], total: 3 },
  { preset: '4-col', title: '4 Colunas Iguais', sub: '25% x4', cols: [1, 1, 1, 1], total: 4 }
];

function createNewSection() {
  addRow('1-col');
}

function selectGridPreset(preset) {
  addRow(preset);
  showingGridPresets.value = false;
}

function hasElementsInRow(row) {
  if (!row || !row.columns) return false;
  return row.columns.some(c => c.elements && c.elements.length > 0);
}

// DRAG AND DROP DE SEÇÕES
function onDragStartSection(index, e) {
  draggedSectionIndex.value = index;
  e.dataTransfer.effectAllowed = 'move';
}

function onDropSection(targetIndex) {
  if (draggedSectionIndex.value === null || draggedSectionIndex.value === targetIndex) return;
  const item = state.rows.splice(draggedSectionIndex.value, 1)[0];
  state.rows.splice(targetIndex, 0, item);
  draggedSectionIndex.value = null;
}

// DRAG AND DROP DE ELEMENTOS ENTRE SEÇÕES
function onDragStartItem(colId, elem, e) {
  draggedItemData.value = { colId, elem };
  e.dataTransfer.effectAllowed = 'move';
}

function onDropItem(targetRowIndex) {
  if (!draggedItemData.value) return;

  const { colId, elem } = draggedItemData.value;
  const targetRow = state.rows[targetRowIndex];
  if (!targetRow || !targetRow.columns || !targetRow.columns.length) return;

  // 1. Encontrar e remover da coluna original
  for (const r of state.rows) {
    for (const c of r.columns) {
      if (c.id === colId) {
        const idx = c.elements.findIndex(e => e.id === elem.id);
        if (idx !== -1) {
          c.elements.splice(idx, 1);
        }
      }
    }
  }

  // 2. Adicionar na primeira coluna da seção de destino
  targetRow.columns[0].elements.push(elem);
  draggedItemData.value = null;
}

function getSectionTitle(row, index) {
  if (!row || !row.columns) return `Seção ${index + 1}`;

  for (const col of row.columns) {
    for (const elem of col.elements || []) {
      if (elem.type === 'top-banner') return `🔴 Banner Topo`;
      if (elem.type === 'heading' && elem.content) {
        const txt = elem.content.replace(/\n/g, ' ').trim();
        return `📝 ${txt.length > 20 ? txt.substring(0, 20) + '...' : txt}`;
      }
      if (elem.type === 'vturb-player') return `🎬 Vídeo VSL`;
      if (elem.type === 'pitch-button' || elem.type === 'upsell-buttons') return `🟢 Botão / CTA`;
      if (elem.type === 'live-viewers') return `👀 Espectadores Ao Vivo`;
      if (elem.type === 'meta-pixel') return `⚡ Meta Pixel`;
    }
  }
  return `Seção ${index + 1}`;
}

function getElementTypeLabel(elem) {
  const map = {
    'top-banner': 'Banner',
    'heading': 'Título',
    'paragraph': 'Parágrafo',
    'button': 'Botão',
    'vturb-player': 'VTurb',
    'pitch-button': 'CTA Pitch',
    'upsell-buttons': 'Upsell',
    'live-viewers': 'Viewers',
    'meta-pixel': 'Meta Pixel'
  };
  return map[elem.type] || elem.type;
}

function getElementSummary(elem) {
  if (elem.type === 'meta-pixel') {
    return `ID: ${elem.pixelId || '123456'}`;
  }
  if (elem.content) {
    const clean = elem.content.replace(/\n/g, ' ').trim();
    return clean.length > 25 ? clean.substring(0, 25) + '...' : clean;
  }
  return getElementTypeLabel(elem);
}
</script>

<style scoped>
.grid-card {
  border-color: var(--accent-primary) !important;
  background: rgba(99, 102, 241, 0.08) !important;
}
.grid-card:hover {
  background: rgba(99, 102, 241, 0.2) !important;
}
.section-block {
  cursor: grab;
}
.section-item-row {
  cursor: grab;
}

.global-page-settings-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.global-page-settings-card:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25));
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}

.gps-icon {
  width: 32px;
  height: 32px;
  background: var(--accent-primary);
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.gps-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.gps-title {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

.gps-subtitle {
  font-size: 10px;
  color: var(--text-muted);
}

.sections-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.btn-add-section-sm {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: var(--accent-primary);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-add-section-sm:hover {
  background: var(--accent-primary);
  color: #ffffff;
}

.empty-section-dropzone {
  padding: 12px;
  border: 1.5px dashed rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-sm);
  text-align: center;
  font-size: 11px;
  color: var(--text-dim);
  background: rgba(255, 255, 255, 0.01);
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.empty-section-dropzone:hover {
  border-color: var(--accent-primary);
  color: var(--text-main);
  background: rgba(99, 102, 241, 0.05);
}

/* ─── DROPDOWN MENU 3 PONTINHOS ─────────────────── */
.elem-context-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 9999;
  background: #181b28;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 150px;
}
.elem-dd-item {
  background: transparent;
  border: none;
  color: #e2e8f0;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.15s ease;
}
.elem-dd-item:hover {
  background: rgba(99, 102, 241, 0.2);
  color: #ffffff;
}
.elem-dd-item.danger:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}
.elem-dd-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 4px 0;
}
/* ─── DROPDOWN MENU 3 PONTINHOS ─────────────────── */
.section-block {
  overflow: visible !important;
}
.section-items-container {
  overflow: visible !important;
}
.section-item-row {
  position: relative;
  overflow: visible !important;
}
.elem-context-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 999999;
  background: #181b28;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 155px;
}
.elem-dd-item {
  background: transparent;
  border: none;
  color: #e2e8f0;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.15s ease;
}
.elem-dd-item:hover {
  background: rgba(99, 102, 241, 0.2);
  color: #ffffff;
}
.elem-dd-item.danger:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}
.elem-dd-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 4px 0;
}
</style>
