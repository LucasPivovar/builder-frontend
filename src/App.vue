<template>
  <div id="app">
    <!-- Router View for SPA pages -->
    <router-view
      v-show="!workspaceBlocked"
      @navigate="handleNavigate"
      @open-builder="handleOpenBuilder"
      @open-auth="handleNavigate('auth')"
      @open-dashboard="handleNavigate('dashboard')"
      @open-admin="handleNavigate('admin')"
      @go-dashboard="handleNavigate('dashboard')"
    />
    <section v-if="workspaceBlocked" class="workspace-loading" :role="workspaceStatus.error ? 'alert' : 'status'">
      <p>{{ workspaceStatus.loading ? 'Carregando suas páginas…' : workspaceStatus.error }}</p>
      <button v-if="!workspaceStatus.loading" class="btn-primary" @click="reloadWorkspace">Tentar novamente</button>
    </section>

    <!-- Global Modals -->
    <ToastNotification />
    <PageSummaryModal />
    <WorkspaceConflictModal />
    <ProductTour />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ToastNotification from './components/ToastNotification.vue';
import PageSummaryModal from './components/PageSummaryModal.vue';
import WorkspaceConflictModal from './components/WorkspaceConflictModal.vue';
import ProductTour from './components/ProductTour.vue';
import { useBuilderStore } from './composables/useBuilderStore';
import { hasAuthToken } from './services/api';

const router = useRouter();
const { loadTemplate, hydrateWorkspaceFromBackend, closeTemplateBuilder, workspaceStatus } = useBuilderStore();
const workspaceBlocked = computed(() => router.currentRoute.value.meta.requiresAuth && (workspaceStatus.loading || workspaceStatus.error));
function reloadWorkspace() {
  return hydrateWorkspaceFromBackend().catch(() => {});
}

onMounted(() => {
  if (hasAuthToken() && router.currentRoute.value.path !== '/builder') reloadWorkspace();
});

function handleNavigate(routeName) {
  const routesMap = {
    'landing': '/',
    'dashboard': '/dashboard',
    'auth': '/auth',
    'builder': '/builder',
    'admin': '/admin'
  };
  const targetPath = routesMap[routeName] || routeName || '/';
  router.push(targetPath);
}

function handleOpenBuilder(templateKey) {
  closeTemplateBuilder();
  if (templateKey && typeof templateKey === 'string') {
    loadTemplate(templateKey);
  }
  router.push('/builder');
}
</script>

<style>
@import './assets/style.css';
.workspace-loading { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 32px; text-align: center; }
</style>
