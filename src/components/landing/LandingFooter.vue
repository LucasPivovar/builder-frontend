<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-brand">
        <div class="brand-logo"><i class="bi bi-diagram-3-fill"></i></div>
        <span>Funil Builder</span>
        <p>Construtor visual para criar, organizar e exportar páginas de funil, e-mails e quizzes.</p>
      </div>
      <div class="footer-links">
        <p>© 2026 Funil Builder. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

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
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-surface);
}
</style>
