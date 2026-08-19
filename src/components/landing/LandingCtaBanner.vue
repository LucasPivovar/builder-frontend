<template>
  <section class="cta-banner-section">
    <div class="container">
      <div class="cta-banner-card">
        <div class="cta-glow"></div>
        <div class="cta-content">
          <span class="cta-pill">ACESSO IMEDIATO</span>
          <h2 class="cta-title">Pronto para criar páginas que realmente convertem?</h2>
          <p class="cta-subtitle">
            Crie, personalize e exporte seus funis, campanhas de e-mail e quizzes em poucos minutos. Sem código, sem travamentos e com velocidade incomparável.
          </p>

          <div class="cta-buttons">
            <button class="btn-cta-primary" @click="$emit('navigate', 'dashboard')">
              <span>Começar a Criar Agora</span>
              <i class="bi bi-arrow-right-short"></i>
            </button>
            <button class="btn-cta-secondary" @click="$emit('navigate', 'builder')">
              <i class="bi bi-play-circle-fill"></i>
              <span>Testar Construtor</span>
            </button>
          </div>

          <div class="cta-trust-row">
            <div class="trust-item"><i class="bi bi-check-circle-fill"></i> 100% Visual</div>
            <div class="trust-item"><i class="bi bi-check-circle-fill"></i> Exportação HTML Limpa</div>
            <div class="trust-item"><i class="bi bi-check-circle-fill"></i> Suporte Nativo a VTurb</div>
            <div class="trust-item"><i class="bi bi-check-circle-fill"></i> Histórico Seguro</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['navigate']);
</script>

<style scoped>
.cta-banner-section {
  padding: 60px 0 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.cta-banner-card {
  background: linear-gradient(135deg, #2d176d 0%, #4321aa 35%, #612bf4 70%, #2296fc 100%);
  border-radius: var(--radius-xl);
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(97, 43, 244, 0.28);
  text-align: center;
  color: #ffffff;
}

.cta-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(23, 181, 252, 0.35) 0%, transparent 70%);
  pointer-events: none;
}

.cta-content {
  position: relative;
  z-index: 1;
  max-width: 780px;
  margin: 0 auto;
}

.cta-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 16px;
  border-radius: 999px;
  margin-bottom: 16px;
  backdrop-filter: blur(8px);
}

.cta-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
  color: #ffffff;
  font-family: var(--font-display);
  letter-spacing: -0.8px;
}

.cta-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.6;
  margin-bottom: 32px;
}

.cta-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.btn-cta-primary {
  background: #ffffff;
  color: var(--color-primary-strong);
  border: none;
  font-size: 16px;
  font-weight: 800;
  padding: 15px 36px;
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  background: #faf9ff;
}

.btn-cta-secondary {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  padding: 15px 30px;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.btn-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.24);
  transform: translateY(-2px);
}

.cta-trust-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  padding-top: 24px;
}

.trust-item {
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 7px;
}

.trust-item i {
  color: #22c993;
  font-size: 15px;
}

@media (max-width: 768px) {
  .cta-banner-section { padding: 40px 0 60px 0; }
  .cta-banner-card { padding: 36px 18px; border-radius: 18px; }
  .cta-title { font-size: 26px; }
  .cta-subtitle { font-size: 14.5px; margin-bottom: 24px; }
  .cta-buttons { flex-direction: column; width: 100%; gap: 12px; }
  .cta-buttons button { width: 100%; justify-content: center; padding: 14px; font-size: 15px; }
  .cta-trust-row { gap: 12px; font-size: 12px; }
}
</style>
