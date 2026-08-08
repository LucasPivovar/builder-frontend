<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-brand">
        <div class="brand-logo"><i class="bi bi-diagram-3-fill"></i></div>
        <span>Visual Builder Studio</span>
        <p>A solução definitiva para criação e gerenciamento de páginas de alta conversão.</p>
      </div>
      <div class="footer-links">
        <p>© 2026 Visual Builder Studio. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 40px 0;
  color: #94a3b8;
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
  background: linear-gradient(135deg, #6366f1, #38bdf8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
</style>
