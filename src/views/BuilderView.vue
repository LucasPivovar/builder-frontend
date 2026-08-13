<template>
  <div class="builder-view">
    <Header
      @open-export="openExport"
      @open-save="handleSave"
      @open-preview="openPreviewModal"
      @open-versions="openVersionModal"
      @open-metrics="openMetricsModal"
    />

    <div class="app-container">
      <CanvasWorkspace />
      <SidebarRight />
    </div>

    <!-- Modals -->
    <ElementModal />
    <ExportModal />
    <PreviewModal />
    <VersionModal />
    <MetricsModal />
    <SavePageModal :isOpen="isSaveModalOpen" @close="isSaveModalOpen = false" @saved="onPageSaved" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '../components/Header.vue';
import SidebarRight from '../components/SidebarRight.vue';
import CanvasWorkspace from '../components/CanvasWorkspace.vue';
import ElementModal from '../components/ElementModal.vue';
import ExportModal from '../components/ExportModal.vue';
import SavePageModal from '../components/SavePageModal.vue';
import PreviewModal from '../components/PreviewModal.vue';
import VersionModal from '../components/VersionModal.vue';
import MetricsModal from '../components/MetricsModal.vue';

import { useBuilderStore } from '../composables/useBuilderStore';

const { state, showToast, openExportModal, openPreviewModal, openVersionModal, openMetricsModal, saveTemplateFromBuilder, flushWorkspaceToBackend } = useBuilderStore();
const isSaveModalOpen = ref(false);

function openExport() {
  openExportModal();
}

async function handleSave() {
  if (!state.isTemplateBuilder) {
    isSaveModalOpen.value = true;
    return;
  }
  const template = saveTemplateFromBuilder();
  if (template) await flushWorkspaceToBackend().catch(() => false);
}

function onPageSaved(page) {
  showToast(`"${page.name}" salva com sucesso!`, 'success');
}
</script>

<style scoped>
.builder-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--color-primary-soft);
}

.app-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
