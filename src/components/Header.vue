<template>
  <header class="builder-header">
    <div class="header-brand">
      <div class="brand-icon">B</div>
      <span class="brand-title">Visual Builder Studio (Vue 3)</span>
    </div>

    <div class="header-viewports">
      <button
        class="viewport-btn"
        :class="{ active: state.viewportMode === '100%' }"
        @click="setViewport('100%')"
      >
        <i class="bi bi-aspect-ratio"></i> 100% Full
      </button>
      <button
        class="viewport-btn"
        :class="{ active: state.viewportMode === '1024px' }"
        @click="setViewport('1024px')"
      >
        <i class="bi bi-display"></i> 1024px
      </button>
      <button
        class="viewport-btn"
        :class="{ active: state.viewportMode === '768px' }"
        @click="setViewport('768px')"
      >
        <i class="bi bi-tablet"></i> Tablet
      </button>
      <button
        class="viewport-btn"
        :class="{ active: state.viewportMode === '375px' }"
        @click="setViewport('375px')"
      >
        <i class="bi bi-phone"></i> Mobile
      </button>
    </div>

    <div class="header-actions">
      <button class="btn btn-secondary" @click="openSummaryModal">
        <i class="bi bi-file-text"></i> Resumo
      </button>
      <button class="btn btn-secondary" @click="clearCanvas">
        <i class="bi bi-trash"></i> Limpar Canvas
      </button>
      <button class="btn btn-primary" @click="$emit('open-export')">
        <i class="bi bi-download"></i> Salvar / Exportar HTML
      </button>
    </div>
  </header>
</template>

<script setup>
import { useBuilderStore } from '../composables/useBuilderStore';

defineEmits(['open-export']);

const { state, setViewport, clearCanvas, openSummaryModal } = useBuilderStore();
</script>
