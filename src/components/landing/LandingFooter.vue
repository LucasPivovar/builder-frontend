<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-brand">
        <AstroMark class="brand-logo" variant="dark" />
        <span>Astro Builder</span>
        <p>Construa sem código. Do zero ao ar.</p>
      </div>
      <div class="footer-links">
        <p>© 2026 Astro Builder. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import AstroMark from '../AstroMark.vue';
</script>

<style scoped>
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 40px 0;
  color: var(--color-text-soft);
  font-size: 14px;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brand-logo {
  --mark-width: 40px;
  --mark-height: 29px;
}
</style>
