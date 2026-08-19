<template>
  <section class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-badge purple"><i class="bi bi-grid-1x2-fill"></i></div>
          <div class="stat-content">
            <div class="stat-number">3 Formatos</div>
            <div class="stat-label">Funis VSL, E-mails 600px e Quizzes</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-badge blue"><i class="bi bi-lightning-charge-fill"></i></div>
          <div class="stat-content">
            <div class="stat-number">100% Visual</div>
            <div class="stat-label">Edição em tempo real sem programar</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-badge cyan"><i class="bi bi-code-slash"></i></div>
          <div class="stat-content">
            <div class="stat-number">HTML Ultraleve</div>
            <div class="stat-label">Exportação limpa e carregamento instantâneo</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-badge green"><i class="bi bi-clock-history"></i></div>
          <div class="stat-content">
            <div class="stat-number">20 Backups</div>
            <div class="stat-label">Histórico e segurança automática</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  padding: 10px 0 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-main);
  border-color: var(--color-border-strong);
}

.stat-icon-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.stat-icon-badge.purple { background: var(--color-primary-soft); color: var(--color-primary); }
.stat-icon-badge.blue { background: #e8f4fd; color: #2296fc; }
.stat-icon-badge.cyan { background: #e6f7ff; color: #0284c7; }
.stat-icon-badge.green { background: #e7faf3; color: #10b981; }

.stat-content {
  text-align: left;
}

.stat-number {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 2px;
  font-family: var(--font-display);
}

.stat-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  line-height: 1.35;
}
</style>
