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
  background-color: #090d16;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #f8fafc;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.glow-circle-1 {
  position: absolute;
  top: -150px;
  left: -150px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
  pointer-events: none;
}

.glow-circle-2 {
  position: absolute;
  bottom: -150px;
  right: -150px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%);
  pointer-events: none;
}
</style>
