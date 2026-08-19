<template>
  <section id="recursos" class="features-section">
    <div class="container">
      <!-- Section 1: Connected Visual Pipeline (Do zero ao ar) -->
      <div class="pipeline-wrapper">
        <div class="section-badge-center">
          <span class="sub-pill"><i class="bi bi-diagram-3-fill"></i> FLUXO SIMPLIFICADO</span>
          <h2 class="section-title">Do zero ao funil publicado em 3 passos</h2>
          <p class="section-subtitle">Sem instalações complicadas, sem banco de dados pesado e sem necessidade de programadores.</p>
        </div>

        <div class="interactive-pipeline">
          <div class="pipeline-track"></div>
          
          <div class="pipeline-step" :class="{ active: activeStep === 1 }" @click="activeStep = 1">
            <div class="step-indicator">
              <span class="step-number">01</span>
              <div class="step-glow"></div>
            </div>
            <div class="step-info">
              <h4>Escolha a Estratégia</h4>
              <p>Inicie em branco ou escolha um template validado para VSL, e-mail ou quiz.</p>
              <div class="step-tags">
                <span>VSL 100%</span>
                <span>E-mail 600px</span>
                <span>Quiz</span>
              </div>
            </div>
          </div>

          <div class="pipeline-step" :class="{ active: activeStep === 2 }" @click="activeStep = 2">
            <div class="step-indicator">
              <span class="step-number">02</span>
              <div class="step-glow"></div>
            </div>
            <div class="step-info">
              <h4>Personalize Visualmente</h4>
              <p>Adicione blocos, sincronize o pitch delay do VTurb e configure gatilhos.</p>
              <div class="step-tags">
                <span>Pitch Delay</span>
                <span>Urgência</span>
                <span>Provas</span>
              </div>
            </div>
          </div>

          <div class="pipeline-step" :class="{ active: activeStep === 3 }" @click="activeStep = 3">
            <div class="step-indicator">
              <span class="step-number">03</span>
              <div class="step-glow"></div>
            </div>
            <div class="step-info">
              <h4>Exporte HTML Limpo</h4>
              <p>Baixe o pacote HTML ou suba diretamente para qualquer servidor ou CDN.</p>
              <div class="step-tags">
                <span>Zero Bloat</span>
                <span>99 PageSpeed</span>
                <span>Instantâneo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Interactive Bento Showcase -->
      <div class="bento-header">
        <span class="sub-pill"><i class="bi bi-cpu-fill"></i> ARQUITETURA DE ALTA PERFORMANCE</span>
        <h2 class="section-title">Construído para maximizar sua taxa de conversão</h2>
        <p class="section-subtitle">Cada funcionalidade foi desenhada para resolver as maiores dores de quem roda tráfego pago.</p>
      </div>

      <div class="bento-grid">
        <!-- Bento 1 (Wide 65% Interactive Sandbox): Pitch Delay & VTurb Engine -->
        <div class="bento-item bento-pitch-delay">
          <div class="bento-content-side">
            <div class="bento-tag red"><i class="bi bi-play-circle-fill"></i> Alta Conversão</div>
            <h3>Delay de Pitch Nativo para VTurb & YouTube</h3>
            <p>
              Oculte botões de compra, formulários e depoimentos até o exato momento em que o vídeo faz a oferta. Aumenta a retenção e o desejo de compra.
            </p>
            
            <div class="interactive-simulator-box">
              <div class="sim-header">
                <span><i class="bi bi-sliders"></i> Simulador ao Vivo</span>
                <span class="sim-status" :class="{ unlocked: isPitchUnlocked }">
                  {{ isPitchUnlocked ? '🔓 Oferta Liberada!' : '🔒 Oferta Oculta' }}
                </span>
              </div>
              
              <div class="sim-action-row">
                <button
                  class="btn-simulate"
                  :disabled="isSimulating"
                  @click="runPitchSimulation"
                >
                  <i :class="isSimulating ? 'bi bi-hourglass-split' : 'bi bi-play-fill'"></i>
                  {{ isSimulating ? `Aguardando pitch (${simSecondsLeft}s)...` : 'Testar Pitch Delay (Simulação de 3s)' }}
                </button>
              </div>

              <div class="sim-preview-area">
                <transition name="fade">
                  <div v-if="isPitchUnlocked" class="sim-cta-reveal">
                    <button class="sim-cta-btn">
                      <span>COMPRAR AGORA COM 50% DE DESCONTO</span>
                      <i class="bi bi-arrow-right-circle-fill"></i>
                    </button>
                    <span class="sim-badge-ok">✨ Botão liberado no segundo programado!</span>
                  </div>
                  <div v-else class="sim-cta-placeholder">
                    <i class="bi bi-lock-fill"></i>
                    <span>O botão de compra surgirá aqui automaticamente quando o vídeo atingir o tempo de oferta.</span>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento 2 (Tall 35%): Speed & HTML Benchmark -->
        <div class="bento-item bento-performance">
          <div class="bento-tag cyan"><i class="bi bi-speedometer2"></i> Velocidade Extrema</div>
          <h3>Exportação de HTML Ultraleve</h3>
          <p>
            Páginas geradas sem frameworks lentos ou centenas de requisições. Carregamento em menos de 0.2 segundos.
          </p>

          <div class="speed-benchmark-card">
            <div class="speed-score-circle">
              <div class="score-number">99</div>
              <div class="score-label">PageSpeed</div>
            </div>
            <div class="comparison-bars">
              <div class="comp-row winner">
                <div class="comp-label"><strong>Astro Builder</strong> <span>0.18s • 14KB</span></div>
                <div class="comp-bar-track"><div class="comp-bar-fill fast"></div></div>
              </div>
              <div class="comp-row loser">
                <div class="comp-label"><span>WordPress / Elementor</span> <span>3.90s • 4.2MB</span></div>
                <div class="comp-bar-track"><div class="comp-bar-fill slow"></div></div>
              </div>
            </div>
          </div>

          <div class="perf-metric-pill">
            <i class="bi bi-check-circle-fill text-green"></i>
            <span>Redução de até <strong>68% no abandono de página</strong></span>
          </div>
        </div>

        <!-- Bento 3 (50% Split): Responsive Studio -->
        <div class="bento-item bento-split">
          <div class="bento-tag blue"><i class="bi bi-phone-fill"></i> Mobile First</div>
          <h3>Visualização Multidispositivo em Tempo Real</h3>
          <p>Alterne entre Desktop, Tablet e Mobile instantaneamente. Seus blocos se reorganizam com perfeição sem quebrar nada.</p>
          
          <div class="device-showcase-visual">
            <div class="mock-device desktop">
              <div class="device-bar"></div>
              <div class="device-body">
                <div class="sk-line w-80"></div>
                <div class="sk-box"></div>
              </div>
            </div>
            <div class="mock-device mobile">
              <div class="device-notch"></div>
              <div class="device-body">
                <div class="sk-line w-90"></div>
                <div class="sk-box small"></div>
                <div class="sk-btn"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento 4 (50% Split): Safe Backups & Cloud Sync -->
        <div class="bento-item bento-split">
          <div class="bento-tag green"><i class="bi bi-shield-check"></i> Segurança & Versões</div>
          <h3>Histórico com Restauração em 1 Clique</h3>
          <p>Nunca perca uma alteração importante. O sistema cria pontos de salvamento automáticos com prévia visual para restaurar a qualquer momento.</p>
          
          <div class="backup-timeline-visual">
            <div class="timeline-entry active">
              <div class="t-dot"></div>
              <div class="t-details">
                <strong>Versão 1.4 (Atual)</strong>
                <span>Adicionado Pitch Delay e vídeo VTurb</span>
              </div>
              <span class="t-badge">Salvo</span>
            </div>
            <div class="timeline-entry">
              <div class="t-dot"></div>
              <div class="t-details">
                <strong>Versão 1.3</strong>
                <span>Ajuste de título H1 e cores da oferta</span>
              </div>
              <button class="t-restore-btn"><i class="bi bi-clock-history"></i> Restaurar</button>
            </div>
            <div class="timeline-entry">
              <div class="t-dot"></div>
              <div class="t-details">
                <strong>Versão 1.2</strong>
                <span>Criação da estrutura inicial do funil</span>
              </div>
              <button class="t-restore-btn"><i class="bi bi-clock-history"></i> Restaurar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const activeStep = ref(2);
const isPitchUnlocked = ref(false);
const isSimulating = ref(false);
const simSecondsLeft = ref(3);

function runPitchSimulation() {
  if (isSimulating.value) return;
  isPitchUnlocked.value = false;
  isSimulating.value = true;
  simSecondsLeft.value = 3;

  const timer = setInterval(() => {
    simSecondsLeft.value -= 1;
    if (simSecondsLeft.value <= 0) {
      clearInterval(timer);
      isSimulating.value = false;
      isPitchUnlocked.value = true;
    }
  }, 1000);
}
</script>

<style scoped>
.features-section {
  padding: 40px 0 90px 0;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-badge-center, .bento-header {
  text-align: center;
  max-width: 780px;
  margin: 0 auto 46px auto;
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
   CONNECTED PIPELINE / TIMELINE PROCESS
======================================================== */
.pipeline-wrapper {
  margin-bottom: 90px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 44px 36px;
  box-shadow: var(--shadow-sm);
}

.interactive-pipeline {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-top: 36px;
}

.pipeline-track {
  position: absolute;
  top: 30px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e2e8f0;
  z-index: 0;
}

.pipeline-step {
  position: relative;
  z-index: 1;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.pipeline-step:hover, .pipeline-step.active {
  border-color: var(--color-primary);
  box-shadow: 0 10px 28px rgba(97, 43, 244, 0.12);
  transform: translateY(-3px);
}

.pipeline-step.active {
  background: #faf8ff;
}

.step-indicator {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.pipeline-step.active .step-indicator {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(97, 43, 244, 0.35);
}

.step-info h4 {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 6px;
}

.step-info p {
  font-size: 13.5px;
  color: var(--color-text-secondary);
  line-height: 1.45;
  margin-bottom: 14px;
}

.step-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.step-tags span {
  font-size: 11px;
  font-weight: 700;
  background: #f1f5f9;
  color: #475569;
  padding: 3px 8px;
  border-radius: 6px;
}

.pipeline-step.active .step-tags span {
  background: #ede9fe;
  color: #6d28d9;
}

/* ========================================================
   ASYMMETRIC BENTO GRID MATRIX
======================================================== */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.bento-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 32px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  text-align: left;
  transition: all 0.25s ease;
}

.bento-item:hover {
  box-shadow: var(--shadow-main);
  border-color: var(--color-border-strong);
}

.bento-pitch-delay {
  grid-column: span 7;
}

.bento-performance {
  grid-column: span 5;
}

.bento-split {
  grid-column: span 6;
}

.bento-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 14px;
  width: fit-content;
}

.bento-tag.red { background: #ffe4e6; color: #e11d48; }
.bento-tag.cyan { background: #e0f2fe; color: #0284c7; }
.bento-tag.blue { background: #dbeafe; color: #2563eb; }
.bento-tag.green { background: #dcfce7; color: #16a34a; }

.bento-item h3 {
  font-size: 21px;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 8px;
  line-height: 1.3;
}

.bento-item p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.55;
  margin-bottom: 20px;
}

/* Simulator Box inside Pitch Delay */
.interactive-simulator-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px;
  margin-top: auto;
}

.sim-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 12px;
}

.sim-status {
  background: #fee2e2;
  color: #dc2626;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 11.5px;
}

.sim-status.unlocked {
  background: #dcfce7;
  color: #16a34a;
}

.btn-simulate {
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: var(--color-text);
  font-size: 13px;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.btn-simulate:hover:not(:disabled) {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

.sim-preview-area {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sim-cta-placeholder {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  padding: 10px;
}

.sim-cta-reveal {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: landing-rise 0.3s ease;
}

.sim-cta-btn {
  width: 100%;
  background: var(--gradient-aurora);
  color: #ffffff;
  border: none;
  padding: 11px 16px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(97, 43, 244, 0.3);
}

.sim-badge-ok {
  font-size: 11px;
  font-weight: 700;
  color: #16a34a;
}

/* Speed Benchmark Card */
.speed-benchmark-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  margin-top: auto;
  margin-bottom: 16px;
}

.speed-score-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 4px solid #10b981;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #ffffff;
}

.score-number {
  font-size: 24px;
  font-weight: 900;
  color: #10b981;
  line-height: 1;
}

.score-label {
  font-size: 9px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.comparison-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comp-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comp-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #475569;
}

.comp-bar-track {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.comp-bar-fill.fast {
  width: 96%;
  height: 100%;
  background: #10b981;
}

.comp-bar-fill.slow {
  width: 32%;
  height: 100%;
  background: #ef4444;
}

.perf-metric-pill {
  font-size: 12.5px;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-green {
  color: #10b981;
  font-size: 15px;
}

/* Device Visual */
.device-showcase-visual {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px 16px 0 16px;
  margin-top: auto;
  overflow: hidden;
  height: 150px;
}

.mock-device.desktop {
  width: 220px;
  height: 120px;
  background: #ffffff;
  border: 2px solid #cbd5e1;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mock-device.mobile {
  width: 90px;
  height: 130px;
  background: #ffffff;
  border: 2px solid #94a3b8;
  border-bottom: none;
  border-radius: 14px 14px 0 0;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sk-line { height: 6px; background: #e2e8f0; border-radius: 3px; }
.sk-line.w-80 { width: 80%; }
.sk-line.w-90 { width: 90%; }
.sk-box { flex: 1; background: #ede9fe; border-radius: 6px; }
.sk-box.small { height: 40px; }
.sk-btn { height: 12px; background: var(--color-primary); border-radius: 4px; }

/* Backup Timeline Visual */
.backup-timeline-visual {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  margin-top: auto;
}

.timeline-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
}

.timeline-entry.active {
  border-color: #a7f3d0;
  background: #f0fdf4;
}

.t-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
}

.timeline-entry.active .t-dot {
  background: #10b981;
}

.t-details {
  flex: 1;
  text-align: left;
}

.t-details strong {
  display: block;
  font-size: 12px;
  color: var(--color-text);
}

.t-details span {
  display: block;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.t-badge {
  font-size: 10.5px;
  font-weight: 700;
  color: #10b981;
  background: #dcfce7;
  padding: 2px 8px;
  border-radius: 4px;
}

.t-restore-btn {
  background: transparent;
  border: 1px solid #cbd5e1;
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.t-restore-btn:hover {
  background: #f1f5f9;
  color: var(--color-text);
}

/* ========================================================
   RESPONSIVE
======================================================== */
@media (max-width: 980px) {
  .interactive-pipeline {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .pipeline-track { display: none; }
  .bento-pitch-delay, .bento-performance, .bento-split {
    grid-column: span 12;
  }
}

@media (max-width: 600px) {
  .pipeline-wrapper { padding: 24px 16px; }
  .bento-item { padding: 20px 16px; }
  .speed-benchmark-card { flex-direction: column; text-align: center; }
}
</style>
