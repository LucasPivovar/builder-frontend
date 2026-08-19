<template>
  <section id="planos" class="pricing-section">
    <div class="container">
      <div class="section-header">
        <span class="sub-pill">PRONTO PARA USAR</span>
        <h2 class="section-title">Escolha como prefere começar seu projeto</h2>
        <p class="section-subtitle">Sem mensalidades ocultas ou contratos complexos. Crie, teste e exporte com liberdade total.</p>
      </div>

      <div class="pricing-grid">
        <!-- Card 1: Criar do Zero -->
        <div class="price-card">
          <div class="price-header">
            <div class="price-type-icon"><i class="bi bi-file-earmark-plus-fill"></i></div>
            <div>
              <div class="price-title">Criar do Zero</div>
              <div class="price-subtitle">Para quem quer controle pixel-perfect</div>
            </div>
          </div>

          <div class="price-amount-box">
            <div class="price-amount">Livre <span>/ Total</span></div>
            <p class="price-tagline">Construa telas personalizadas bloco a bloco</p>
          </div>

          <ul class="price-features">
            <li><i class="bi bi-check-circle-fill"></i> Construtor visual 100% livre</li>
            <li><i class="bi bi-check-circle-fill"></i> Suporte aos 3 formatos (Funil, E-mail, Quiz)</li>
            <li><i class="bi bi-check-circle-fill"></i> Responsividade Desktop, Tablet e Mobile</li>
            <li><i class="bi bi-check-circle-fill"></i> Exportação em HTML puro instantânea</li>
            <li><i class="bi bi-check-circle-fill"></i> Salvamento local e histórico no backend</li>
          </ul>

          <button class="btn-price-outline" @click="$emit('navigate', 'dashboard')">
            <i class="bi bi-plus-lg"></i> Criar Nova Página
          </button>
        </div>

        <!-- Card 2: Templates Prontos (Popular) -->
        <div class="price-card popular">
          <span class="popular-tag"><i class="bi bi-lightning-fill"></i> MAIS RÁPIDO</span>
          <div class="price-header">
            <div class="price-type-icon purple"><i class="bi bi-stars"></i></div>
            <div>
              <div class="price-title">Biblioteca de Templates</div>
              <div class="price-subtitle">Prontos para editar e publicar em minutos</div>
            </div>
          </div>

          <div class="price-amount-box">
            <div class="price-amount">Prontos <span>/ Testados</span></div>
            <p class="price-tagline">Modelos validados com alta taxa de conversão</p>
          </div>

          <ul class="price-features">
            <li><i class="bi bi-check-circle-fill"></i> Todos os recursos do construtor livre</li>
            <li><i class="bi bi-check-circle-fill"></i> Templates de VSL com pitch delay configurado</li>
            <li><i class="bi bi-check-circle-fill"></i> Modelos de e-mail marketing responsivos 600px</li>
            <li><i class="bi bi-check-circle-fill"></i> Quizzes estruturados em etapas inteligentes</li>
            <li><i class="bi bi-check-circle-fill"></i> Configuração de Meta Pixel e GTM em 1 clique</li>
          </ul>

          <button class="btn-price-primary" @click="$emit('navigate', 'dashboard')">
            <span>Explorar Templates Prontos</span>
            <i class="bi bi-arrow-right-short"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['navigate']);
</script>

<style scoped>
.pricing-section {
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.sub-pill {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: var(--color-primary-strong);
  background: var(--color-primary-soft);
  padding: 4px 14px;
  border-radius: 999px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 34px;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--color-text);
  font-family: var(--font-display);
  letter-spacing: -0.5px;
}

.section-subtitle {
  color: var(--color-text-secondary);
  font-size: 16px;
  max-width: 680px;
  margin: 0 auto;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 30px;
}

.price-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 38px 32px;
  position: relative;
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
}

.price-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-main);
}

.price-card.popular {
  border: 2px solid var(--color-primary);
  box-shadow: 0 16px 38px rgba(97, 43, 244, 0.14);
}

.popular-tag {
  position: absolute;
  top: -15px;
  right: 28px;
  background: var(--gradient-aurora);
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 18px;
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(97, 43, 244, 0.35);
  display: flex;
  align-items: center;
  gap: 5px;
}

.price-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.price-type-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--color-text-secondary);
}

.price-type-icon.purple {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-color: var(--color-primary-border);
}

.price-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text);
  font-family: var(--font-display);
}

.price-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
}

.price-amount-box {
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.price-amount {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-text);
  font-family: var(--font-display);
}

.price-amount span {
  font-size: 15px;
  color: var(--color-text-secondary);
  font-weight: 600;
  font-family: var(--font-sans);
}

.price-tagline {
  font-size: 12.5px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.price-features {
  list-style: none;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-features li {
  font-size: 14.5px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.4;
}

.price-features li i {
  color: var(--color-success);
  font-size: 16px;
  flex-shrink: 0;
}

.btn-price-outline {
  width: 100%;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 14px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-price-outline:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-price-primary {
  width: 100%;
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(97, 43, 244, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-price-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 10px 28px rgba(97, 43, 244, 0.42);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .pricing-section { padding: 50px 0; }
  .section-title { font-size: 26px; }
  .pricing-grid { grid-template-columns: 1fr; gap: 24px; }
  .price-card { padding: 28px 20px; }
  .popular-tag { right: 16px; top: -12px; font-size: 11px; padding: 4px 12px; }
  .price-amount { font-size: 28px; }
}
</style>
