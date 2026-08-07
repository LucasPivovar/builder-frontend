<template>
  <div id="app">
    <BuilderView />
    <ToastNotification />
    <PageSummaryModal />
  </div>
</template>

<script setup>
import BuilderView from './views/BuilderView.vue';
import ToastNotification from './components/ToastNotification.vue';
import PageSummaryModal from './components/PageSummaryModal.vue';
</script>

<style>
@import './assets/style.css';
</style>
