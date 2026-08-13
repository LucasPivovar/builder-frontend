<template>
  <section id="planos" class="pricing-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Comece do seu jeito</h2>
        <p class="section-subtitle">Use uma estrutura vazia ou acelere o trabalho com um template pronto.</p>
      </div>

      <div class="pricing-grid">
        <div class="price-card">
          <div class="price-title">Criar do zero</div>
          <div class="price-amount">Livre <span>para personalizar</span></div>
          <ul class="price-features">
            <li><i class="bi bi-check-lg"></i> Funil, e-mail ou quiz</li>
            <li><i class="bi bi-check-lg"></i> Editor visual completo</li>
            <li><i class="bi bi-check-lg"></i> Prévia e exportação HTML</li>
          </ul>
          <button class="btn-price-outline" @click="$emit('navigate', 'dashboard')">Criar página</button>
        </div>

        <div class="price-card popular">
          <span class="popular-tag">MAIS RÁPIDO</span>
          <div class="price-title">Usar um template</div>
          <div class="price-amount">Pronto <span>para editar</span></div>
          <ul class="price-features">
            <li><i class="bi bi-check-lg"></i> Modelos separados por formato</li>
            <li><i class="bi bi-check-lg"></i> Conteúdo totalmente editável</li>
            <li><i class="bi bi-check-lg"></i> Meta Pixel e GTM configuráveis</li>
            <li><i class="bi bi-check-lg"></i> Salvamento e histórico local</li>
          </ul>
          <button class="btn-price-primary" @click="$emit('navigate', 'dashboard')">Ver templates</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['navigate']);
</script>

<style scoped>
.pricing-section { padding: 80px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-header { text-align: center; margin-bottom: 50px; }
.section-title { font-size: 32px; font-weight: 800; margin-bottom: 10px; }
.section-subtitle { color: var(--color-text-soft); font-size: 16px; }

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.price-card {
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 36px;
  position: relative;
}

.price-card.popular {
  border-color: var(--color-primary);
  box-shadow: none;
}

.popular-tag {
  position: absolute;
  top: -14px;
  right: 24px;
  background: var(--color-primary);
  color: var(--color-surface);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 999px;
}

.price-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
.price-amount { font-size: 42px; font-weight: 800; color: var(--color-surface); margin-bottom: 16px; }
.price-amount span { font-size: 16px; color: var(--color-text-soft); font-weight: 500; }
.price-features { list-style: none; margin: 24px 0; font-size: 14.5px; color: var(--color-text-soft); }
.price-features li { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.price-features i { color: #10b981; }

.btn-price-outline {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: var(--color-surface);
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-price-primary {
  width: 100%;
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
</style>
