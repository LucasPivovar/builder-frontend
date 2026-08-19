<template>
  <section id="depoimentos" class="testimonials-section">
    <div class="container">
      <!-- Format Showcase Split View (Interactive Format Explorer) -->
      <div class="format-split-showcase">
        <div class="showcase-left-panel">
          <span class="sub-pill"><i class="bi bi-layers-fill"></i> MULTIFORMATO NATIVO</span>
          <h2 class="section-title">Uma única plataforma para todas as suas estratégias</h2>
          <p class="section-subtitle">
            Alterne entre modos de criação sem sair do editor. Cada formato conta com regras de exportação e dimensões otimizadas para conversão máxima.
          </p>

          <!-- Interactive Format Selector Pills -->
          <div class="format-nav-tabs">
            <button
              class="format-tab-item"
              :class="{ active: activeFormat === 'vsl' }"
              @click="activeFormat = 'vsl'"
            >
              <div class="tab-icon purple"><i class="bi bi-play-btn-fill"></i></div>
              <div class="tab-text">
                <strong>Funis de Vendas & VSLs</strong>
                <span>Largura total, VTurb e Pitch Delay</span>
              </div>
              <i class="bi bi-chevron-right tab-arrow"></i>
            </button>

            <button
              class="format-tab-item"
              :class="{ active: activeFormat === 'email' }"
              @click="activeFormat = 'email'"
            >
              <div class="tab-icon blue"><i class="bi bi-envelope-paper-fill"></i></div>
              <div class="tab-text">
                <strong>Campanhas de E-mail (600px)</strong>
                <span>Compatível com Gmail, Outlook e ActiveCampaign</span>
              </div>
              <i class="bi bi-chevron-right tab-arrow"></i>
            </button>

            <button
              class="format-tab-item"
              :class="{ active: activeFormat === 'quiz' }"
              @click="activeFormat = 'quiz'"
            >
              <div class="tab-icon orange"><i class="bi bi-ui-checks-grid"></i></div>
              <div class="tab-text">
                <strong>Quizzes Interativos (460px)</strong>
                <span>Engajamento em etapas e diagnóstico</span>
              </div>
              <i class="bi bi-chevron-right tab-arrow"></i>
            </button>
          </div>
        </div>

        <!-- Format Live Interactive Showcase Viewport -->
        <div class="showcase-right-viewport">
          <div class="viewport-display-card">
            <!-- Top Tab Identifier -->
            <div class="card-top-bar">
              <div class="dots-row">
                <span></span><span></span><span></span>
              </div>
              <span class="preview-mode-tag">
                <i :class="currentFormatData.icon"></i> {{ currentFormatData.badge }}
              </span>
            </div>

            <!-- Dynamic Mock Screen -->
            <div class="preview-canvas-content" :class="`mode-${activeFormat}`">
              <transition name="fade" mode="out-in">
                <!-- VSL Mode Preview -->
                <div v-if="activeFormat === 'vsl'" key="vsl" class="format-preview-inner">
                  <div class="prev-badge red">🔴 VSL COM PITCH DELAY ATIVO</div>
                  <h4 class="prev-title">Página de Vendas de Alta Conversão</h4>
                  <div class="prev-video-box">
                    <i class="bi bi-play-circle-fill play-icon"></i>
                    <div class="prev-video-bar"></div>
                  </div>
                  <div class="prev-cta-box">
                    <div class="prev-button">QUERO GARANTIR MEU ACESSO</div>
                    <span class="prev-sub"><i class="bi bi-shield-check"></i> Garantia incondicional de 7 dias</span>
                  </div>
                </div>

                <!-- Email Mode Preview -->
                <div v-else-if="activeFormat === 'email'" key="email" class="format-preview-inner email-inner">
                  <div class="prev-badge blue">✉️ E-MAIL MARKETING PADRÃO 600PX</div>
                  <div class="email-mock-header">
                    <span class="email-avatar">⚡</span>
                    <div>
                      <strong>Astro Comunidade</strong>
                      <span>Assunto: Sua estratégia de vendas precisa disso hoje</span>
                    </div>
                  </div>
                  <div class="email-mock-body">
                    <p>Olá! Se você quer páginas que carregam instantaneamente e convertem mais leads em clientes...</p>
                    <div class="prev-button small">CLIQUE AQUI PARA CONFERIR</div>
                  </div>
                </div>

                <!-- Quiz Mode Preview -->
                <div v-else-if="activeFormat === 'quiz'" key="quiz" class="format-preview-inner quiz-inner">
                  <div class="prev-badge orange">🧩 QUIZ INTERATIVO COM PONTUAÇÃO</div>
                  <div class="quiz-progress-bar">
                    <div class="quiz-fill" style="width: 66%"></div>
                  </div>
                  <span class="quiz-step-text">Etapa 2 de 3: Qual é o seu maior gargalo?</span>
                  <div class="quiz-options-list">
                    <div class="quiz-opt active"><i class="bi bi-check-circle-fill"></i> Taxa de conversão baixa</div>
                    <div class="quiz-opt"><i class="bi bi-circle"></i> Páginas lentas que perdem tráfego</div>
                    <div class="quiz-opt"><i class="bi bi-circle"></i> Falta de tempo para programar</div>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Bullet Points Strip -->
            <div class="card-features-footer">
              <div
                v-for="(item, i) in currentFormatData.features"
                :key="i"
                class="footer-feat-item"
              >
                <i class="bi bi-check-circle-fill"></i>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeFormat = ref('vsl');

const formats = {
  vsl: {
    badge: 'Funil VSL 100%',
    icon: 'bi-play-btn-fill',
    features: ['Delay de pitch sincronizado', 'Widget de espectadores ao vivo', 'Exportação HTML ultra-rápida']
  },
  email: {
    badge: 'E-mail 600px',
    icon: 'bi-envelope-paper-fill',
    features: ['Largura padronizada 600px', 'Compatível com todos os clientes', 'Zero risco de corte no Gmail']
  },
  quiz: {
    badge: 'Quiz 460px',
    icon: 'bi-ui-checks-grid',
    features: ['Fluxo progressivo por etapas', 'Barra de progresso animada', 'Redirecionamento automático']
  }
};

const currentFormatData = computed(() => formats[activeFormat.value]);
</script>

<style scoped>
.testimonials-section {
  padding: 70px 0 80px 0;
  background: var(--color-surface-soft);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

.sub-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-size: 12px;
  font-weight: 800;
  padding: 6px 16px;
  border-radius: 999px;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
  border: 1px solid var(--color-border-strong);
}

.section-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.22;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: clamp(15px, 1.8vw, 17px);
  color: var(--color-text-secondary);
  line-height: 1.55;
  margin: 0;
}

/* ========================================================
   SPLIT FORMAT SHOWCASE
======================================================== */
.format-split-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 44px;
  box-shadow: var(--shadow-sm);
  text-align: left;
}

.showcase-left-panel {
  display: flex;
  flex-direction: column;
}

.format-nav-tabs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
}

.format-tab-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.format-tab-item:hover, .format-tab-item.active {
  background: #ffffff;
  border-color: var(--color-primary);
  box-shadow: 0 8px 24px rgba(97, 43, 244, 0.12);
  transform: translateX(4px);
}

.format-tab-item.active {
  border-left: 4px solid var(--color-primary);
}

.tab-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.tab-icon.purple { background: #ede9fe; color: #7c3aed; }
.tab-icon.blue { background: #dbeafe; color: #2563eb; }
.tab-icon.orange { background: #ffedd5; color: #ea580c; }

.tab-text {
  flex: 1;
}

.tab-text strong {
  display: block;
  font-size: 15px;
  color: var(--color-text);
  margin-bottom: 2px;
}

.tab-text span {
  display: block;
  font-size: 12.5px;
  color: var(--color-text-secondary);
}

.tab-arrow {
  font-size: 14px;
  color: #94a3b8;
  transition: transform 0.2s ease;
}

.format-tab-item.active .tab-arrow {
  color: var(--color-primary);
  transform: translateX(3px);
}

/* Viewport Card on Right */
.showcase-right-viewport {
  position: relative;
}

.viewport-display-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-top-bar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dots-row {
  display: flex;
  gap: 5px;
}

.dots-row span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #cbd5e1;
}

.preview-mode-tag {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.preview-canvas-content {
  min-height: 270px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.format-preview-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.prev-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
}

.prev-badge.red { background: #ffe4e6; color: #e11d48; }
.prev-badge.blue { background: #dbeafe; color: #1d4ed8; }
.prev-badge.orange { background: #ffedd5; color: #c2410c; }

.prev-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text);
}

.prev-video-box {
  width: 100%;
  max-width: 320px;
  height: 120px;
  background: #0f172a;
  border-radius: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  font-size: 38px;
  color: #38bdf8;
}

.prev-video-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-aurora);
}

.prev-button {
  background: var(--gradient-aurora);
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  padding: 10px 18px;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(97, 43, 244, 0.3);
}

.prev-button.small {
  padding: 8px 14px;
  font-size: 11.5px;
  margin-top: 8px;
}

.prev-sub {
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Email inner */
.email-inner {
  max-width: 340px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

.email-mock-header {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;
  width: 100%;
}

.email-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ede9fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.email-mock-header strong {
  display: block;
  font-size: 12px;
  color: var(--color-text);
}

.email-mock-header span {
  display: block;
  font-size: 11px;
  color: #64748b;
}

.email-mock-body p {
  font-size: 12px;
  color: #475569;
  line-height: 1.4;
  margin: 10px 0;
}

/* Quiz inner */
.quiz-inner {
  max-width: 340px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

.quiz-progress-bar {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.quiz-fill {
  height: 100%;
  background: #f97316;
}

.quiz-step-text {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--color-text);
}

.quiz-options-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.quiz-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-align: left;
}

.quiz-opt.active {
  background: #fff7ed;
  border-color: #fdba74;
  color: #c2410c;
}

.card-features-footer {
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
  flex-wrap: wrap;
}

.footer-feat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: #475569;
  font-weight: 600;
}

.footer-feat-item i {
  color: #10b981;
}

/* ========================================================
   RESPONSIVE
======================================================== */
@media (max-width: 980px) {
  .format-split-showcase {
    grid-template-columns: 1fr;
    padding: 28px 20px;
    gap: 32px;
  }
}
</style>
