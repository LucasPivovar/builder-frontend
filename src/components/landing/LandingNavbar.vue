<template>
  <nav class="navbar">
    <div class="container nav-container">
      <a href="#" class="nav-brand" @click.prevent="$emit('navigate', 'landing')">
        <AstroMark class="brand-logo" variant="dark" />
        <span>Astro Builder</span>
      </a>

      <ul class="nav-links">
        <li><a href="#recursos">Recursos</a></li>
        <li><a href="#planos">Como começar</a></li>
        <li><a href="#depoimentos">Formatos</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>

      <div class="nav-actions">
        <button class="btn-outline" @click="$emit('navigate', 'auth')">Entrar</button>
        <button class="btn-primary" @click="$emit('navigate', 'dashboard')">Acessar Painel <i class="bi bi-arrow-right-short"></i></button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import AstroMark from '../AstroMark.vue';

defineEmits(['navigate']);
</script>

<style scoped>
.navbar {
  background: rgba(15, 21, 35, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  color: var(--color-surface);
  text-decoration: none;
}

.brand-logo {
  --mark-width: 46px;
  --mark-height: 33px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
}

.nav-links a {
  color: var(--color-text-soft);
  text-decoration: none;
  font-weight: 600;
  font-size: 14.5px;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--color-surface);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-outline {
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: var(--color-surface);
  padding: 9px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  padding: 9px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: none;
}
</style>
