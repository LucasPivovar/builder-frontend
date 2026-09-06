<template>
  <main class="auth-page-wrapper">
    <section class="auth-panel" aria-label="Acesse sua conta">
      <AuthForm @navigate="$emit('navigate', $event)" />
    </section>
    <aside class="auth-story">
      <div class="creator-illustration">
        <img src="../assets/auth-funnel-illustration.png" alt="Pessoa construindo uma página de funil com faixa no topo, player de vídeo e botão de ação" width="1120" height="1400" fetchpriority="high" />
      </div>
    </aside>
  </main>
</template>

<script setup>
import AuthForm from '../components/auth/AuthForm.vue';

defineEmits(['navigate']);
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100svh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--color-surface);
  font-family: var(--font-sans);
  color: var(--color-text);
  padding: 0;
  gap: 0;
}

.auth-panel {
  display: flex;
  flex-direction: column;
  padding: 0;
  min-width: 0;
  min-height: 100svh;
  position: relative;
}

.auth-story {
  border-radius: 0;
  min-height: 100svh;
  padding: 48px 36px 32px;
  background: linear-gradient(135deg, var(--color-primary-strong), var(--color-primary) 55%, #a20ddd);
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.auth-story::before, .auth-story::after {
  content: '';
  position: absolute;
  z-index: -1;
  background: var(--color-blue);
  width: 370px;
  height: 250px;
  border-radius: 42% 58% 66% 34% / 46% 36% 64% 54%;
  transform: rotate(-28deg);
}
.auth-story::before { top: -140px; right: -55px; }
.auth-story::after { bottom: -180px; left: -130px; background: var(--color-violet); width: 450px; height: 330px; }

.creator-illustration {
  width: 100%;
  max-width: 560px;
  margin: auto;
}
.creator-illustration img {
  width: 100%;
  height: auto;
  max-height: 76svh;
  object-fit: contain;
}

@media (max-width: 800px) {
  .auth-page-wrapper {
    display: block;
  }
  .auth-panel {
    min-height: 100svh;
    padding: 0;
  }
  .auth-story {
    display: none;
  }
}
</style>
