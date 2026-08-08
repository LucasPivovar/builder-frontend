<template>
  <div id="app">
    <!-- Router View for SPA pages -->
    <router-view
      @navigate="handleNavigate"
      @open-builder="handleOpenBuilder"
      @open-auth="handleNavigate('auth')"
      @open-dashboard="handleNavigate('dashboard')"
      @open-admin="handleNavigate('admin')"
      @go-dashboard="handleNavigate('dashboard')"
    />

    <!-- Global Modals -->
    <ToastNotification />
    <PageSummaryModal />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ToastNotification from './components/ToastNotification.vue';
import PageSummaryModal from './components/PageSummaryModal.vue';
import { useBuilderStore } from './composables/useBuilderStore';

const router = useRouter();
const { loadTemplate } = useBuilderStore();

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
  if (templateKey && typeof templateKey === 'string') {
    loadTemplate(templateKey);
  }
  router.push('/builder');
}
</script>

<style>
@import './assets/style.css';
</style>
