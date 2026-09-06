<template>
  <div class="builder-view">
    <div v-if="adminOwner" role="status">Editando página de {{ adminOwner }} · {{ adminMessage }}</div>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { getAdminUserWorkspace, saveAdminPage } from '../services/api';
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
const route = useRoute();
const adminOwner = ref(''), adminMessage = ref('');
let adminRevision, adminPage, previousState;
onMounted(async () => {
  if (!route.query.adminUser || !route.query.page) return;
  adminOwner.value = 'Carregando…';
  try {
    const result = await getAdminUserWorkspace(route.query.adminUser);
    adminPage = result.workspace.data.pages.find(page => page.id === route.query.page);
    if (!adminPage) throw new Error('Página não encontrada.');
    previousState = { rows: state.rows, pageSettings: state.pageSettings, currentPageId: state.currentPageId, currentPageName: state.currentPageName, builderMode: state.builderMode };
    adminRevision = result.workspace.revision;
    state.rows = JSON.parse(JSON.stringify(adminPage.rows)); state.pageSettings = JSON.parse(JSON.stringify(adminPage.pageSettings));
    state.currentPageId = adminPage.id; state.currentPageName = adminPage.name; state.builderMode = adminPage.builderMode || adminPage.type;
    adminOwner.value = result.user.name;
  } catch (error) { adminMessage.value = error.message; }
});
onBeforeUnmount(() => { if (previousState) Object.assign(state, previousState); });

function openExport() {
  if (route.query.adminUser) { adminMessage.value = 'Salve as alterações. A publicação permanece sob controle do proprietário.'; return; }
  openExportModal();
}

async function handleSave() {
  if (route.query.adminUser) {
    if (!adminPage) return;
    try { const result = await saveAdminPage(route.query.adminUser, adminPage.id, { revision: adminRevision, page: { rows: state.rows, pageSettings: state.pageSettings } }); adminRevision = result.revision; adminMessage.value = 'Alterações salvas no usuário.'; } catch (error) { adminMessage.value = error.message; }
    return;
  }
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
