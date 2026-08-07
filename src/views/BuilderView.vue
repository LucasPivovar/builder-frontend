<template>
  <div class="builder-view">
    <Header @open-export="openExport" />

    <div class="app-container">
      <CanvasWorkspace />
      <SidebarRight />
    </div>

    <!-- Modais -->
    <ElementModal />
    <ExportModal />
  </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import SidebarRight from '../components/SidebarRight.vue';
import CanvasWorkspace from '../components/CanvasWorkspace.vue';
import ElementModal from '../components/ElementModal.vue';
import ExportModal from '../components/ExportModal.vue';

import { useBuilderStore } from '../composables/useBuilderStore';
import { generateExportedHTML } from '../utils/htmlExporter';

const { state } = useBuilderStore();

function openExport() {
  state.exportedHTML = generateExportedHTML(state.rows, state.pageSettings);
  state.isExportModalOpen = true;
}
</script>

<style scoped>
.builder-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
