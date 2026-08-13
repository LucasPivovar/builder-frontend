<template>
  <div class="auth-page-wrapper">
    <div class="glow-circle-1"></div>
    <div class="glow-circle-2"></div>

    <AuthForm @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import AuthForm from '../components/auth/AuthForm.vue';

defineEmits(['navigate']);
</script>

<style scoped>
.auth-page-wrapper {
  background-color: var(--color-primary-subtle);
  font-family: var(--font-sans);
  color: var(--color-surface-soft);
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: auto;
}

.glow-circle-1 {
  position: absolute;
  top: -150px;
  left: -150px;
  width: 500px;
  height: 500px;
  background: var(--color-primary-soft);
  pointer-events: none;
}

.glow-circle-2 {
  position: absolute;
  bottom: -150px;
  right: -150px;
  width: 500px;
  height: 500px;
  background: var(--color-border);
  pointer-events: none;
}
</style>
