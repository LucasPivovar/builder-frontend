<template>
  <header class="builder-header">
    <div class="header-brand">
      <button class="btn btn-secondary btn-back-dash" @click="goToDashboard">
        <i class="bi bi-arrow-left"></i> Dashboard
      </button>
      <div class="brand-icon" :class="state.builderMode === 'email' ? 'brand-email' : ''">
        {{ state.builderMode === 'email' ? '✉' : 'B' }}
      </div>
      <div class="brand-info">
        <span class="brand-title">Visual Builder Studio</span>
        <span class="mode-badge" :class="state.builderMode === 'email' ? 'badge-email' : 'badge-funil'">
          {{ state.builderMode === 'email' ? '📧 E-mail' : '🚀 Funil' }}
        </span>
      </div>
    </div>

    <div class="header-viewports">
      <button class="viewport-btn" :class="{ active: state.viewportMode === '100%' }" @click="setViewport('100%')">
        <i class="bi bi-aspect-ratio"></i> 100%
      </button>
      <button class="viewport-btn" :class="{ active: state.viewportMode === '1024px' }" @click="setViewport('1024px')">
        <i class="bi bi-display"></i> 1024
      </button>
      <button class="viewport-btn" :class="{ active: state.viewportMode === '768px' }" @click="setViewport('768px')">
        <i class="bi bi-tablet"></i> Tablet
      </button>
      <button class="viewport-btn" :class="{ active: state.viewportMode === '375px' }" @click="setViewport('375px')">
        <i class="bi bi-phone"></i> Mobile
      </button>
    </div>

    <div class="header-actions">
      <div v-if="state.currentPageName" class="current-page-info">
        <i class="bi bi-file-earmark-text"></i>
        <span>{{ state.currentPageName }}</span>
      </div>

      <button class="btn btn-secondary" @click="openSummaryModal">
        <i class="bi bi-file-text"></i> Resumo
      </button>
      <button class="btn btn-secondary" @click="clearCanvas">
        <i class="bi bi-trash"></i> Limpar
      </button>
      <button class="btn btn-save" @click="$emit('open-save')">
        <i class="bi bi-floppy-fill"></i>
        {{ state.currentPageId ? 'Atualizar' : 'Salvar Página' }}
      </button>
      <button class="btn btn-primary" @click="$emit('open-export')">
        <i class="bi bi-download"></i> Exportar HTML
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useBuilderStore } from '../composables/useBuilderStore';

defineEmits(['open-export', 'go-dashboard', 'open-save']);

const router = useRouter();
const { state, setViewport, clearCanvas, openSummaryModal } = useBuilderStore();

function goToDashboard() {
  router.push('/dashboard');
}
</script>

<style scoped>
.builder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  background: #0d121f;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
}

.header-brand { display: flex; align-items: center; gap: 10px; }

.btn-back-dash {
  margin-right: 4px;
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
  font-weight: 700 !important;
}

.btn-back-dash:hover { background: rgba(99, 102, 241, 0.3) !important; }

.brand-icon {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 900; color: #fff;
}

.brand-icon.brand-email {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
}

.brand-info { display: flex; flex-direction: column; gap: 2px; }
.brand-title { font-size: 14px; font-weight: 800; color: #fff; line-height: 1; }

.mode-badge {
  font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 999px; line-height: 1.4;
}

.badge-funil { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.badge-email { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }

.header-viewports { display: flex; align-items: center; gap: 4px; }

.viewport-btn {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  color: #94a3b8; padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 5px; transition: all 0.15s ease;
}

.viewport-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
.viewport-btn.active { background: rgba(99,102,241,0.2); color: #818cf8; border-color: rgba(99,102,241,0.4); }

.header-actions { display: flex; align-items: center; gap: 8px; }

.current-page-info {
  display: flex; align-items: center; gap: 6px;
  padding: 4px 12px; background: rgba(255,255,255,0.05); border-radius: 8px;
  font-size: 12px; color: #94a3b8; font-weight: 600; max-width: 180px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer;
  border: none; transition: all 0.15s;
}

.btn-secondary {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0;
}

.btn-secondary:hover { background: rgba(255,255,255,0.14); }

.btn-save {
  background: linear-gradient(135deg, #10b981, #059669); color: #fff;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
}

.btn-save:hover { opacity: 0.9; }

.btn-primary {
  background: #6366f1; color: #fff;
}

.btn-primary:hover { background: #5558e8; }
</style>
