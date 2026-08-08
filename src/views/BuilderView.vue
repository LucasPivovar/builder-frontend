<template>
  <div class="builder-view">
    <Header
      @open-export="openExport"
      @open-save="isSaveModalOpen = true"
    />

    <div class="app-container">
      <CanvasWorkspace />
      <SidebarRight />
    </div>

    <!-- Modals -->
    <ElementModal />
    <ExportModal />
    <SavePageModal :isOpen="isSaveModalOpen" @close="isSaveModalOpen = false" @saved="onPageSaved" />
    <ToastNotification />
    <PageSummaryModal v-if="state.isSummaryModalOpen" @close="closeSummaryModal" />
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
import ToastNotification from '../components/ToastNotification.vue';
import PageSummaryModal from '../components/PageSummaryModal.vue';

import { useBuilderStore } from '../composables/useBuilderStore';

const { state, showToast, closeSummaryModal, openExportModal } = useBuilderStore();
const isSaveModalOpen = ref(false);

function openExport() {
  openExportModal();
}

function onPageSaved(page) {
  showToast(`✅ "${page.name}" salva com sucesso!`, 'success');
}
</script>

<style scoped>
.builder-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #0b0f19;
}

.app-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
