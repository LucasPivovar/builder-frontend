<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast-slide">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-bubble"
          :class="`toast-${toast.type}`"
        >
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useBuilderStore } from '../composables/useBuilderStore';
const { toasts } = useBuilderStore();
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.toast-bubble {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  min-width: 220px;
  max-width: 360px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12);
}

.toast-success {
  background: linear-gradient(135deg, rgba(16,185,129,0.92), rgba(5,150,105,0.92));
}
.toast-save {
  background: linear-gradient(135deg, rgba(99,102,241,0.92), rgba(139,92,246,0.92));
}
.toast-error {
  background: linear-gradient(135deg, rgba(239,68,68,0.92), rgba(185,28,28,0.92));
}

.toast-msg { flex: 1; }

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
</style>
