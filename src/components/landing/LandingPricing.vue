<template>
  <section id="planos" class="pricing-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Planos & Investimento</h2>
        <p class="section-subtitle">Escolha o plano ideal para alavancar seu negócio.</p>
      </div>

      <div class="pricing-grid">
        <div class="price-card">
          <div class="price-title">Starter</div>
          <div class="price-amount">R$ 49 <span>/mês</span></div>
          <ul class="price-features">
            <li><i class="bi bi-check-lg"></i> Até 5 páginas/funis</li>
            <li><i class="bi bi-check-lg"></i> Suporte por E-mail</li>
            <li><i class="bi bi-check-lg"></i> Exportação HTML</li>
          </ul>
          <button class="btn-price-outline" @click="$emit('navigate', 'auth')">Assinar Starter</button>
        </div>

        <div class="price-card popular">
          <span class="popular-tag">MAIS POPULAR</span>
          <div class="price-title">Pro Performance</div>
          <div class="price-amount">R$ 99 <span>/mês</span></div>
          <ul class="price-features">
            <li><i class="bi bi-check-lg"></i> Páginas & Funis ilimitados</li>
            <li><i class="bi bi-check-lg"></i> Suporte Prioritário 24/7</li>
            <li><i class="bi bi-check-lg"></i> Domínio Próprio & Meta Pixel</li>
            <li><i class="bi bi-check-lg"></i> Player VTurb com Delay Sync</li>
          </ul>
          <button class="btn-price-primary" @click="$emit('navigate', 'auth')">Assinar Pro Performance</button>
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
.section-subtitle { color: #94a3b8; font-size: 16px; }

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
  border-color: #6366f1;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
}

.popular-tag {
  position: absolute;
  top: -14px;
  right: 24px;
  background: #6366f1;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 999px;
}

.price-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
.price-amount { font-size: 42px; font-weight: 800; color: #fff; margin-bottom: 16px; }
.price-amount span { font-size: 16px; color: #94a3b8; font-weight: 500; }
.price-features { list-style: none; margin: 24px 0; font-size: 14.5px; color: #94a3b8; }
.price-features li { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.price-features i { color: #10b981; }

.btn-price-outline {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #fff;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-price-primary {
  width: 100%;
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
</style>
