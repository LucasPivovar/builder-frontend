<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast-slide">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-bubble"
          :class="`toast-${toast.type}`"
          role="status"
          aria-live="polite"
        >
          <span class="toast-icon"><i :class="toastIcon(toast.type)"></i></span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useBuilderStore } from '../composables/useBuilderStore';
const { toasts } = useBuilderStore();
function toastIcon(type) {
  return {
    success: 'bi bi-check-lg',
    save: 'bi bi-floppy',
    error: 'bi bi-exclamation-lg',
    warning: 'bi bi-exclamation-triangle',
    info: 'bi bi-info-lg'
  }[type] || 'bi bi-check-lg';
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: calc(var(--header-height) + 14px);
  right: calc(var(--sidebar-width) + 18px);
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  pointer-events: none;
}

.toast-bubble {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px 9px 9px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
  min-width: 190px;
  max-width: min(340px, calc(100vw - var(--sidebar-width) - 40px));
  box-shadow: var(--shadow-main);
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
}

.toast-icon { width:26px; height:26px; flex:0 0 26px; display:grid; place-items:center; border-radius:7px; background:var(--color-primary-soft); color:var(--color-primary-strong); }

.toast-success {
  background: var(--color-surface);
}
.toast-save {
  background: var(--color-primary-soft);
}
.toast-error {
  background: var(--color-surface);
  border-color: var(--color-danger);
  color: var(--color-danger);
}
.toast-error .toast-icon { background:var(--color-danger-soft); color:var(--color-danger); }
.toast-warning .toast-icon { background:#fff7ed; color:var(--color-warning); }
.toast-info .toast-icon { background:var(--color-primary-soft); color:var(--color-primary-strong); }

.toast-msg { flex: 1; min-width:0; line-height:1.35; overflow-wrap:anywhere; }

/* Animations */
.toast-slide-enter-active { animation: toastIn 0.3s cubic-bezier(0.16,1,0.3,1); }
.toast-slide-leave-active { animation: toastOut 0.25s ease-in forwards; }

@keyframes toastIn {
  from { opacity: 0; transform: translateX(40px) scale(0.92); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes toastOut {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to   { opacity: 0; transform: translateX(40px) scale(0.9); }
}
@media(max-width:900px){
  .toast-container{top:12px;right:12px;left:12px;align-items:stretch}
  .toast-bubble{width:100%;min-width:0;max-width:none}
}
</style>
