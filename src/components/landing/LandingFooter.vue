<template>
  <footer class="footer">
    <div class="container footer-center-container">
      <!-- Centered Brand Logo -->
      <a href="#" class="footer-brand" @click.prevent="$emit('navigate', 'landing')">
        <AstroMark class="brand-logo" variant="white" lockup />
      </a>

      <!-- Description & Copyright Underneath in Center -->
      <p class="footer-desc">
        A plataforma visual moderna para construir páginas de vendas, funis, e-mails e quizzes de alta conversão sem código.
      </p>

      <div class="footer-copyright">
        <p>© 2026 Astro Builder. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import AstroMark from '../AstroMark.vue';

defineEmits(['navigate']);
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 50px 0 40px 0;
  color: var(--color-text-secondary);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  margin-bottom: 16px;
  transition: transform 0.2s ease;
}

.footer-brand:hover {
  transform: translateY(-2px);
}

.brand-logo {
  --mark-width: 190px;
  --mark-height: 43px;
}

.brand-name {
  font-weight: 800;
  font-size: 21px;
  color: var(--color-text);
  font-family: var(--font-display);
  letter-spacing: -0.02em;
}

.footer-desc {
  color: var(--color-text-secondary);
  font-size: 14.5px;
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto 20px auto;
}

.footer-copyright {
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
  width: 100%;
  max-width: 420px;
}

.footer-copyright p {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

@media (max-width: 480px) {
  .footer { padding: 40px 0 30px 0; }
  .brand-name { font-size: 18px; }
  .footer-desc { font-size: 13.5px; }
}
</style>
