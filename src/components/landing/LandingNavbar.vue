<template>
  <nav class="navbar" :class="{ 'menu-open': isMobileMenuOpen }">
    <div class="container nav-container">
      <a href="#" class="nav-brand" @click.prevent="navigate('landing')">
        <AstroMark class="brand-logo" />
        <span>Astro Builder</span>
      </a>

      <!-- Desktop Links -->
      <ul class="nav-links">
        <li><a href="#recursos" @click="closeMobileMenu">Recursos</a></li>
        <li><a href="#planos" @click="closeMobileMenu">Como começar</a></li>
        <li><a href="#depoimentos" @click="closeMobileMenu">Formatos</a></li>
        <li><a href="#faq" @click="closeMobileMenu">FAQ</a></li>
      </ul>

      <!-- Desktop Actions -->
      <div class="nav-actions">
        <button class="btn-outline" @click="navigate('auth')">Entrar</button>
        <button class="btn-primary" @click="navigate('dashboard')">
          <span>Acessar Painel</span>
          <i class="bi bi-arrow-right-short"></i>
        </button>
      </div>

      <!-- Mobile Hamburger Button -->
      <button
        class="mobile-menu-toggle"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Abrir menu de navegação"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <i :class="isMobileMenuOpen ? 'bi bi-x-lg' : 'bi bi-list'"></i>
      </button>
    </div>

    <!-- Mobile Drawer Menu -->
    <transition name="drawer">
      <div v-if="isMobileMenuOpen" class="mobile-drawer">
        <div class="mobile-links">
          <a href="#recursos" @click="closeMobileMenu"><i class="bi bi-cpu"></i> Recursos</a>
          <a href="#planos" @click="closeMobileMenu"><i class="bi bi-stars"></i> Como começar</a>
          <a href="#depoimentos" @click="closeMobileMenu"><i class="bi bi-layers"></i> Formatos</a>
          <a href="#faq" @click="closeMobileMenu"><i class="bi bi-question-circle"></i> FAQ</a>
        </div>
        <div class="mobile-actions">
          <button class="btn-outline mobile-btn" @click="navigate('auth')">Entrar na Conta</button>
          <button class="btn-primary mobile-btn" @click="navigate('dashboard')">
            <span>Acessar Meu Painel</span>
            <i class="bi bi-arrow-right-short"></i>
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import AstroMark from '../AstroMark.vue';

const emit = defineEmits(['navigate']);

const isMobileMenuOpen = ref(false);

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function navigate(target) {
  closeMobileMenu();
  emit('navigate', target);
}
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.85);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 14px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.container {
  max-width: 1240px;
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
  font-size: 18.5px;
  font-weight: 800;
  color: var(--color-text);
  text-decoration: none;
  font-family: var(--font-display);
  letter-spacing: -0.02em;
}

.brand-logo {
  --mark-width: 44px;
  --mark-height: 32px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
}

.nav-links a {
  color: #475569;
  text-decoration: none;
  font-weight: 600;
  font-size: 14.5px;
  transition: color 0.15s ease;
}

.nav-links a:hover {
  color: var(--color-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-outline {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  padding: 9px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-outline:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-color: var(--color-primary-border);
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  padding: 9px 22px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(97, 43, 244, 0.28);
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 6px 20px rgba(97, 43, 244, 0.4);
  transform: translateY(-1px);
}

/* Mobile Hamburger Button */
.mobile-menu-toggle {
  display: none;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mobile-menu-toggle:hover {
  background: #f8fafc;
  color: var(--color-primary);
}

/* Mobile Drawer Menu */
.mobile-drawer {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 24px 28px 24px;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.mobile-links {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 22px;
}

.mobile-links a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e293b;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.mobile-links a i {
  color: var(--color-primary);
  font-size: 18px;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-btn {
  width: 100%;
  padding: 13px;
  font-size: 15px;
  justify-content: center;
}

/* Transitions */
.drawer-enter-active, .drawer-leave-active {
  transition: all 0.25s ease-out;
}

.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ========================================================
   RESPONSIVE
======================================================== */
@media (max-width: 860px) {
  .nav-links { display: none; }
  .nav-actions { display: none; }
  .mobile-menu-toggle { display: flex; }
}

@media (max-width: 480px) {
  .nav-brand span { font-size: 16.5px; }
  .brand-logo { --mark-width: 38px; --mark-height: 28px; }
  .container { padding: 0 16px; }
}
</style>
