<template>
  <section class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">3</div>
          <div class="stat-label">Formatos de página</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">100%</div>
          <div class="stat-label">Edição visual</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">HTML</div>
          <div class="stat-label">Exportação pronta</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">20</div>
          <div class="stat-label">Versões de recuperação</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  padding: 40px 0 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 36px;
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-surface);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13.5px;
  color: var(--color-text-soft);
}
</style>
