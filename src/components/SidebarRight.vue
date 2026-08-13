<template>
  <aside class="sidebar-right" :class="{ 'mobile-open': isMobileSidebarOpen }">
    <button class="mobile-panel-toggle" @click="isMobileSidebarOpen = !isMobileSidebarOpen">
      <i :class="isMobileSidebarOpen ? 'bi bi-chevron-down' : 'bi bi-plus-circle-fill'"></i>
      {{ isMobileSidebarOpen ? 'Fechar biblioteca' : 'Adicionar e editar blocos' }}
    </button>
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
        class="tab-btn tour-sections-tab"
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
          <div class="search-box-wrapper">
            <i class="bi bi-search search-box-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              class="sidebar-search-input"
              aria-label="Pesquisar elementos"
              placeholder="Pesquisar elementos..."
            />
            <button v-if="searchQuery" class="clear-search-btn" aria-label="Limpar busca" @click="searchQuery = ''"><i class="bi bi-x-lg"></i></button>
          </div>

          <template v-if="!searchQuery && state.builderMode !== 'quiz'">
            <div class="section-title">ESTRUTURA & ESTRUTURAÇÃO</div>
            <div class="objects-grid tour-object-library">
              <!-- Objeto Grid especial -->
              <div class="object-card grid-card" @click="showingGridPresets = true">
                <div class="object-icon"><i class="bi bi-grid-3x3-gap-fill"></i></div>
                <span class="object-name">Grid Layout</span>
              </div>
            </div>
          </template>

          <div v-if="filteredContentObjects.length" class="section-title">OBJETOS GERAIS</div>
          <div v-if="filteredContentObjects.length" class="objects-grid">
            <div
              v-for="obj in filteredContentObjects"
              :key="obj.type"
              class="object-card"
              :class="{ 'tour-object-heading': obj.type === 'heading' }"
              @click="addElementToCanvas(obj.type)"
            >
              <div class="object-icon"><i :class="obj.icon"></i></div>
              <span class="object-name">{{ obj.title }}</span>
            </div>
          </div>

          <div v-if="filteredModeObjects.length" class="section-title">{{ modeObjectsTitle }}</div>
          <div v-if="filteredModeObjects.length" class="objects-grid">
            <div
              v-for="obj in filteredModeObjects"
              :key="obj.type"
              class="object-card"
              @click="addElementToCanvas(obj.type)"
            >
              <div class="object-icon"><i :class="obj.icon"></i></div>
              <span class="object-name">{{ obj.title }}</span>
            </div>
          </div>

          <template v-if="!searchQuery">
            <div class="section-title">TEMPLATES PRONTOS</div>
            <div class="objects-grid">
              <div class="object-card" @click="loadTemplateWithConfirm(activeTemplate.key)"><div class="object-icon"><i :class="activeTemplate.icon"></i></div><span class="object-name">{{ activeTemplate.title }}</span></div>
            </div>
          </template>
        </div>
      </div>

      <!-- ABA 2: SEÇÕES (ÁRVORE DO CANVAS COM DRAG & DROP + CONFIGS GERAIS) -->
      <div v-if="activeTab === 'sections'" class="tab-content active">
        <!-- ITEM FIXO: CONFIGURAÇÕES GERAIS DA PÁGINA -->
        <div class="global-page-settings-card" @click="openGlobalSettings">
          <div class="gps-icon"><i class="bi bi-gear-wide-connected"></i></div>
          <div class="gps-info">
            <span class="gps-title">Configurações Gerais da Página</span>
            <span class="gps-subtitle">{{ state.builderMode === 'quiz' ? 'Progresso, cores, título, SEO e rastreamento' : 'Título, cor de fundo, SEO e rastreamento' }}</span>
          </div>
          <i class="bi bi-chevron-right" style="color:var(--text-dim); font-size:12px;"></i>
        </div>

        <div class="sections-header-bar">
          <span class="section-title" style="margin:0;">{{ state.builderMode === 'quiz' ? 'ETAPAS DO QUIZ' : 'ESTRUTURA DAS SEÇÕES' }}</span>
          <button class="btn-add-section-sm" @click="createNewSection">
            <i class="bi bi-plus-lg"></i> {{ state.builderMode === 'quiz' ? 'Nova etapa' : 'Nova seção' }}
          </button>
        </div>

        <div v-if="state.rows.length === 0" style="color:var(--text-dim); font-size:12px; text-align:center; padding:20px 0;">
          Nenhuma seção criada. Clique acima para adicionar.
        </div>

        <div class="sections-tree-list tour-section-tree">
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
                  class="section-item-row tour-section-item"
                  draggable="true"
                  @dragstart.stop="onDragStartItem(col.id, elem, $event)"
                  @click.stop="openModalForElement(elem)"
                >
                  <span class="section-item-label" :title="getElementSummary(elem)">
                    <i class="bi bi-grip-vertical" style="color:var(--text-dim); margin-right:4px;"></i>
                    <i :class="getElementIcon(elem)" style="color:var(--accent-primary);"></i>
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
                        <i class="bi bi-pencil-square" style="color: var(--color-primary-hover);"></i> Editar Objeto
                      </button>
                      <button class="elem-dd-item" @click="duplicateElement(elem.id); closeAllDropdowns();">
                        <i class="bi bi-files" style="color: var(--color-success);"></i> Duplicar Objeto
                      </button>
                      <div class="elem-dd-divider"></div>
                      <button class="elem-dd-item danger" @click="deleteElement(elem.id); closeAllDropdowns();">
                        <i class="bi bi-trash" style="color: var(--color-danger);"></i> Excluir Objeto
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
import { ref, computed } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';

const activeTab = ref('objects');
const isMobileSidebarOpen = ref(false);
const showingGridPresets = ref(false);
const searchQuery = ref('');

const draggedSectionIndex = ref(null);
const draggedItemData = ref(null);

const activeElementDropdownId = ref(null);

function toggleElementDropdown(id) {
  activeElementDropdownId.value = activeElementDropdownId.value === id ? null : id;
}

function closeAllDropdowns() {
  activeElementDropdownId.value = null;
}

const { state, addRow, addElementToCanvas, duplicateRow, deleteRow, openModalForElement, openGlobalSettings, duplicateElement, deleteElement, loadTemplate } = useBuilderStore();

function loadTemplateWithConfirm(key) {
  if (state.rows && state.rows.length > 0) {
    if (!confirm('Atenção: Carregar este template irá substituir o conteúdo atual da sua página. Deseja continuar?')) {
      return;
    }
  }
  loadTemplate(key);
}

const contentObjects = [
  { type: 'heading', title: 'Título / Headline', icon: 'bi bi-type-h1' },
  { type: 'paragraph', title: 'Parágrafo / Texto', icon: 'bi bi-paragraph' },
  { type: 'button', title: 'Botão Link', icon: 'bi bi-menu-button-wide-fill' },
  { type: 'image', title: 'Imagem', icon: 'bi bi-image' },
  { type: 'divider', title: 'Divisor', icon: 'bi bi-hr' }
];

const vslObjects = [
  { type: 'top-banner', title: 'Banner Topo', icon: 'bi bi-exclamation-triangle-fill' },
  { type: 'vturb-player', title: 'Player VTurb', icon: 'bi bi-play-circle-fill' },
  { type: 'pitch-button', title: 'Botão CTA Pitch', icon: 'bi bi-lightning-charge-fill' },
  { type: 'upsell-buttons', title: 'Botões Upsell', icon: 'bi bi-bag-check-fill' },
  { type: 'live-viewers', title: 'Espectadores Ao Vivo', icon: 'bi bi-eye-fill' },
  { type: 'countdown', title: 'Contagem', icon: 'bi bi-stopwatch-fill' },
  { type: 'form', title: 'Formulário', icon: 'bi bi-ui-checks-grid' },
  { type: 'testimonial', title: 'Depoimento', icon: 'bi bi-quote' },
  { type: 'faq', title: 'Pergunta FAQ', icon: 'bi bi-patch-question' }
];

const emailObjects = [
  { type: 'email-header', title: 'Cabeçalho E-mail', icon: 'bi bi-card-heading' },
  { type: 'email-tag', title: 'Pill / Label', icon: 'bi bi-tag-fill' },
  { type: 'email-footer', title: 'Rodapé E-mail', icon: 'bi bi-menu-down' }
];
const quizObjects = [
  { type:'quiz-question', title:'Pergunta', icon:'bi bi-patch-question-fill' },
  { type:'quiz-single', title:'Respostas · única', icon:'bi bi-ui-radios' },
  { type:'quiz-multiple', title:'Respostas · múltiplas', icon:'bi bi-ui-checks' },
  { type:'quiz-yes-no', title:'Respostas · sim/não', icon:'bi bi-toggles' },
  { type:'quiz-next', title:'Avançar etapa', icon:'bi bi-arrow-right-square-fill' },
  { type:'quiz-loading', title:'Análise / Carregamento', icon:'bi bi-arrow-repeat' },
  { type:'quiz-metric', title:'Métricas', icon:'bi bi-graph-up-arrow' },
  { type:'quiz-price', title:'Preço / Plano', icon:'bi bi-cash-coin' },
  { type:'quiz-spacer', title:'Espaço', icon:'bi bi-arrows-expand' }
];

const filteredContentObjects = computed(() => {
  if (!searchQuery.value.trim()) return contentObjects;
  const q = searchQuery.value.toLowerCase().trim();
  return contentObjects.filter(o => o.title.toLowerCase().includes(q));
});

const modeObjects = computed(() => state.builderMode === 'email' ? emailObjects : state.builderMode === 'quiz' ? quizObjects : vslObjects);
const modeObjectsTitle = computed(() => state.builderMode === 'email' ? 'OBJETOS DE E-MAIL' : state.builderMode === 'quiz' ? 'OBJETOS DO QUIZ' : 'COMPONENTES DE CONVERSÃO · VSL');
const filteredModeObjects = computed(() => {
  if (!searchQuery.value.trim()) return modeObjects.value;
  const q = searchQuery.value.toLowerCase().trim();
  return modeObjects.value.filter(o => o.title.toLowerCase().includes(q));
});
const activeTemplate = computed(() => state.builderMode === 'email' ? {key:'email',title:'Template de e-mail',icon:'bi bi-envelope-paper-fill'} : state.builderMode === 'quiz' ? {key:'quiz',title:'Template de quiz',icon:'bi bi-ui-checks-grid'} : {key:'vsl',title:'Template de VSL',icon:'bi bi-play-circle-fill'});

const gridPresets = [
  { preset: '1-col', title: '1 Coluna', sub: '100% Largura', cols: [1], total: 1 },
  { preset: '2-col', title: '2 Colunas Iguais', sub: '50% / 50%', cols: [1, 1], total: 2 },
  { preset: '3-col', title: '3 Colunas Iguais', sub: '33% x3', cols: [1, 1, 1], total: 3 },
  { preset: '4-col', title: '4 Colunas Iguais', sub: '25% x4', cols: [1, 1, 1, 1], total: 4 }
];

function createNewSection() {
  const row = addRow('1-col');
  if (state.builderMode === 'quiz') {
    addElementToCanvasInRow(row, 'quiz-question');
    addElementToCanvasInRow(row, 'quiz-single');
    addElementToCanvasInRow(row, 'quiz-next');
  }
}

function addElementToCanvasInRow(row, type) {
  const before = state.rows.length;
  const target = row?.columns?.[0];
  if (!target) return;
  addElementToCanvas(type);
  if (state.rows.length !== before) return;
  const lastRow = state.rows[state.rows.length - 1];
  if (lastRow !== row && lastRow?.columns?.[0]?.elements?.length) {
    const element = lastRow.columns[0].elements.pop();
    target.elements.push(element);
  }
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

function getElementIcon(elem) {
  const map = {
    'top-banner': 'bi bi-exclamation-triangle-fill',
    'heading': 'bi bi-type-h1',
    'paragraph': 'bi bi-paragraph',
    'button': 'bi bi-menu-button-wide-fill',
    'vturb-player': 'bi bi-play-circle-fill',
    'pitch-button': 'bi bi-lightning-charge-fill',
    'upsell-buttons': 'bi bi-bag-check-fill',
    'live-viewers': 'bi bi-eye-fill',
    'meta-pixel': 'bi bi-lightning-fill',
    'email-header': 'bi bi-card-heading',
    'email-tag': 'bi bi-tag-fill',
    'email-footer': 'bi bi-menu-down',
    image: 'bi bi-image', divider: 'bi bi-hr', testimonial: 'bi bi-quote',
    faq: 'bi bi-patch-question', countdown: 'bi bi-stopwatch-fill', form: 'bi bi-ui-checks-grid'
    , 'quiz-question':'bi bi-patch-question-fill', 'quiz-single':'bi bi-ui-radios', 'quiz-multiple':'bi bi-ui-checks', 'quiz-yes-no':'bi bi-toggles', 'quiz-next':'bi bi-arrow-right-square-fill', 'quiz-loading':'bi bi-arrow-repeat', 'quiz-metric':'bi bi-graph-up-arrow', 'quiz-price':'bi bi-cash-coin', 'quiz-spacer':'bi bi-arrows-expand'
  };
  return map[elem.type] || 'bi bi-box-seam';
}

function getSectionTitle(row, index) {
  if (!row || !row.columns) return `Seção ${index + 1}`;
  if (state.builderMode === 'quiz') return `Etapa ${index + 1}`;

  for (const col of row.columns) {
    for (const elem of col.elements || []) {
      if (elem.type === 'top-banner') return `Banner Topo`;
      if (elem.type === 'heading' && elem.content) {
        const txt = elem.content.replace(/\n/g, ' ').trim();
        return `${txt.length > 20 ? txt.substring(0, 20) + '...' : txt}`;
      }
      if (elem.type === 'vturb-player') return `Vídeo VSL`;
      if (elem.type === 'pitch-button' || elem.type === 'upsell-buttons') return `Botão / CTA`;
      if (elem.type === 'live-viewers') return `Espectadores Ao Vivo`;
      if (elem.type === 'meta-pixel') return `Meta Pixel`;
      if (elem.type === 'email-header') return `Cabeçalho E-mail`;
      if (elem.type === 'email-footer') return `Rodapé E-mail`;
      if (elem.type === 'email-tag') return `Pill / Label E-mail`;
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
    'meta-pixel': 'Meta Pixel',
    'email-header': 'Cabeçalho',
    'email-footer': 'Rodapé',
    'email-tag': 'Pill Tag',
    image: 'Imagem', divider: 'Divisor', testimonial: 'Depoimento', faq: 'FAQ',
    countdown: 'Contagem', form: 'Formulário'
    , 'quiz-question':'Pergunta', 'quiz-single':'Resposta única', 'quiz-multiple':'Múltiplas respostas', 'quiz-yes-no':'Sim / Não', 'quiz-next':'Avançar', 'quiz-loading':'Carregamento', 'quiz-metric':'Métricas', 'quiz-price':'Preço', 'quiz-spacer':'Espaço'
  };
  return map[elem.type] || elem.type;
}

function getElementSummary(elem) {
  if (elem.type === 'meta-pixel') {
    return `ID: ${elem.pixelId || '123456'}`;
  }
  if (elem.type === 'email-header' || elem.type === 'email-footer') {
    return elem.logoText ? `Logo: ${elem.logoText}` : (elem.copyrightText || 'Cabeçalho/Rodapé');
  }
  if (elem.type === 'email-tag') {
    return elem.content || 'Pill / Label';
  }
  if (['quiz-single','quiz-multiple','quiz-yes-no'].includes(elem.type)) return String(elem.optionsText || '').split('\n').filter(Boolean).length + ' alternativas';
  if (elem.content) {
    const clean = elem.content.replace(/\n/g, ' ').trim();
    return clean.length > 25 ? clean.substring(0, 25) + '...' : clean;
  }
  return getElementTypeLabel(elem);
}
</script>

<style scoped>
.mobile-panel-toggle { display: none; }
.grid-card {
  border-color: var(--accent-primary) !important;
  background: var(--color-primary-subtle) !important;
}
.grid-card:hover {
  background: var(--color-primary-soft) !important;
}
.section-block {
  cursor: grab;
}
.section-item-row {
  cursor: grab;
}

.global-page-settings-card {
  background: var(--color-primary-subtle);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

@media (max-width: 900px) {
  .sidebar-right {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100% !important;
    height: min(68vh, 590px);
    max-height: calc(100vh - 108px);
    transform: translateY(calc(100% - 52px));
    transition: transform .2s ease;
    z-index: 80;
    border: 1px solid var(--color-border);
    border-bottom: 0;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -12px 28px rgba(14, 116, 144, .16);
  }
  .sidebar-right.mobile-open { transform: translateY(0); }
  .mobile-panel-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    width: 100%;
    height: 52px;
    flex: 0 0 52px;
    background: var(--color-surface);
    border: 0;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-primary-strong);
    font: inherit;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }
  .sidebar-tabs { flex: 0 0 48px; }
  .sidebar-content { padding: 12px; }
  .objects-grid { gap: 8px; }
  .object-card { min-height: 72px; padding: 9px 7px; }
  .object-name { font-size: 11px; }
}

.global-page-settings-card:hover {
  background: var(--color-primary-soft);
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}

.gps-icon {
  width: 32px;
  height: 32px;
  background: var(--accent-primary);
  color: var(--color-surface);
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
  font-weight: 800;
  color: var(--color-text);
}

.gps-subtitle {
  font-size: 10px;
  color: var(--color-text-muted);
  line-height: 1.35;
}

.sections-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.btn-add-section-sm {
  background: var(--color-primary-soft);
  border: 1px solid var(--color-primary-border);
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
  color: var(--color-surface);
}

.empty-section-dropzone {
  padding: 12px;
  border: 1.5px dashed var(--color-border-strong);
  border-radius: var(--radius-sm);
  text-align: center;
  font-size: 11px;
  color: var(--text-dim);
  background: var(--color-primary-subtle);
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.empty-section-dropzone:hover {
  border-color: var(--accent-primary);
  color: var(--text-main);
  background: var(--color-primary-soft);
}

/* ─── DROPDOWN MENU 3 PONTINHOS ─────────────────── */
.elem-context-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 9999;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 6px;
  box-shadow: var(--shadow-main);
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 150px;
}
.elem-dd-item {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
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
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
}
.elem-dd-item.danger:hover {
  background: var(--color-danger-soft);
  color: var(--color-danger-strong);
}
.elem-dd-divider {
  height: 1px;
  background: var(--color-border);
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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 6px;
  box-shadow: var(--shadow-main);
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 155px;
}
.elem-dd-item {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
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
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
}
.elem-dd-item.danger:hover {
  background: var(--color-danger-soft);
  color: var(--color-danger-strong);
}
.elem-dd-divider {
  height: 1px;
  background: var(--color-border);
  margin: 4px 0;
}

/* ─── SEARCH BOX ENHANCEMENT ───────────────────── */
.search-box-wrapper {
  position: relative;
  margin-bottom: 14px;
}
.search-box-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: 13px;
  pointer-events: none;
}
.sidebar-search-input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px 30px 8px 30px;
  color: var(--color-text);
  font-size: 12px;
  outline: none;
  transition: all 0.2s ease;
}
.sidebar-search-input:focus {
  border-color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}
.sidebar-search-input::placeholder { color: var(--color-text-soft); }
.clear-search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
  padding: 2px 4px;
}
.clear-search-btn:hover {
  color: var(--color-primary-strong);
}

.elem-context-dropdown { background: var(--color-surface); border-color: var(--color-border); box-shadow: var(--shadow-main); }
.elem-dd-item { color: var(--color-text-secondary); }
.elem-dd-item:hover { background: var(--color-primary-soft); color: var(--color-primary-strong); }
.elem-dd-divider { background: var(--color-border); }
</style>
