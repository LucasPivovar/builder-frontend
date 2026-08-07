<template>
  <main class="sandbox-workspace" :style="{ backgroundColor: state.pageSettings.bgColor || '#191919' }">
    <div
      class="sandbox-canvas"
      :style="{ maxWidth: state.viewportMode, backgroundColor: state.pageSettings.bgColor || '#191919' }"
    >
      <div v-if="state.rows.length === 0" class="sandbox-placeholder">
        <div class="placeholder-icon"><i class="bi bi-plus-circle-dotted"></i></div>
        <div class="placeholder-title">Seu Canvas está vazio</div>
        <p style="font-size: 13px;">Adicione uma coluna ou objeto pelo painel lateral para começar.</p>
      </div>

      <div
        v-for="row in state.rows"
        :key="row.id"
        class="builder-row"
        :style="{ marginBottom: (state.pageSettings.sectionGap !== undefined ? state.pageSettings.sectionGap : 16) + 'px' }"
        :class="{ 'has-top-banner': row.columns.some(c => c.elements.some(e => e.type === 'top-banner')) }"
      >
        <div
          v-for="col in row.columns"
          :key="col.id"
          class="builder-col"
          :style="{ flex: col.flex || 1 }"
        >
          <div
            v-for="elem in col.elements"
            :key="elem.id"
            class="canvas-element"
            :class="{ 'is-top-banner': elem.type === 'top-banner' }"
            @click.stop="openModalForElement(elem)"
            title="Clique para editar este objeto"
          >
            <!-- Dynamic Element Renderer -->
            <TopBannerElement v-if="elem.type === 'top-banner'" :element="elem" />
            <HeadingElement v-else-if="elem.type === 'heading'" :element="elem" />
            <ParagraphElement v-else-if="elem.type === 'paragraph'" :element="elem" />
            <ButtonElement v-else-if="elem.type === 'button'" :element="elem" />
            <VturbPlayerElement v-else-if="elem.type === 'vturb-player'" :element="elem" />
            <PitchButtonElement v-else-if="elem.type === 'pitch-button'" :element="elem" />
            <LiveViewersElement v-else-if="elem.type === 'live-viewers'" :element="elem" />
            <div v-else class="generic-element">{{ elem.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { watch } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';
import TopBannerElement from './elements/TopBannerElement.vue';
import HeadingElement from './elements/HeadingElement.vue';
import ParagraphElement from './elements/ParagraphElement.vue';
import ButtonElement from './elements/ButtonElement.vue';
import VturbPlayerElement from './elements/VturbPlayerElement.vue';
import PitchButtonElement from './elements/PitchButtonElement.vue';
import LiveViewersElement from './elements/LiveViewersElement.vue';

const { state, openModalForElement } = useBuilderStore();

// Atualizar o título da aba do navegador em tempo real ao mudar em Configurações Gerais
watch(
  () => state.pageSettings.pageTitle,
  (newTitle) => {
    if (newTitle && newTitle.trim()) {
      document.title = newTitle;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.sandbox-workspace {
  transition: background-color 0.2s ease;
}
.sandbox-canvas {
  transition: background-color 0.2s ease, max-width 0.2s ease;
  min-height: 100vh !important;
}
.canvas-element {
  cursor: pointer;
  transition: outline 0.15s ease;
}
.canvas-element:hover {
  outline: 2px dashed rgba(99, 102, 241, 0.6);
  outline-offset: 2px;
}
</style>
