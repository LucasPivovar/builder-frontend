<template>
  <section class="hero-section">
    <div class="hero-bg-overlay"></div>
    <div class="container hero-container">
      <!-- Top Announcement Badge -->
      <div class="badge-tag">
        <span class="badge-dot"></span>
        <i class="bi bi-rocket-takeoff-fill"></i> Construtor visual de alta performance para conversão
      </div>

      <!-- Main Headline -->
      <h1 class="hero-title">
        Crie Funis, E-mails e Quizzes de <span class="gradient-text">Alta Conversão</span> em Minutos
      </h1>

      <!-- Subtitle -->
      <p class="hero-subtitle">
        Construa páginas completas com suporte nativo a VTurb, delay de pitch programável e exportação de HTML ultraleve sem encostar em uma linha de código.
      </p>

      <!-- Action Buttons -->
      <div class="hero-buttons">
        <button class="btn-hero-primary" @click="$emit('navigate', 'dashboard')">
          <span>Acessar Meu Painel</span>
          <i class="bi bi-arrow-right-short"></i>
        </button>
        <button class="btn-hero-secondary" @click="$emit('navigate', 'builder')">
          <i class="bi bi-play-circle-fill"></i>
          <span>Abrir Construtor Visual</span>
        </button>
      </div>

      <!-- Real Application Workspace Mockup -->
      <div class="preview-mockup-wrapper">
        <!-- Floating Feature Badges (Desktop) -->
        <div class="floating-badge badge-left">
          <div class="f-icon green"><i class="bi bi-lightning-charge-fill"></i></div>
          <div>
            <strong>HTML Puro & Ultraleve</strong>
            <span>Zero scripts lentos ou bloatware</span>
          </div>
        </div>

        <div class="floating-badge badge-right">
          <div class="f-icon purple"><i class="bi bi-stopwatch-fill"></i></div>
          <div>
            <strong>Pitch Delay Sincronizado</strong>
            <span>Integração nativa com VTurb & YouTube</span>
          </div>
        </div>

        <!-- Main Window Container -->
        <div class="app-window-frame">
          <!-- Window Titlebar / Builder Header Replica -->
          <div class="builder-header-bar">
            <div class="header-left">
              <div class="window-controls">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <button class="header-icon-btn back-btn" title="Voltar ao painel">
                <i class="bi bi-arrow-left"></i>
              </button>
              <div class="page-meta">
                <span class="page-name">Página de Vendas VSL</span>
                <span class="mode-badge"><i class="bi bi-funnel-fill"></i> Funil</span>
              </div>
            </div>

            <!-- Right Actions Bar -->
            <div class="header-right">
              <div class="tool-icons-group">
                <button class="header-icon-btn" title="Desfazer"><i class="bi bi-arrow-counterclockwise"></i></button>
                <button class="header-icon-btn" title="Refazer"><i class="bi bi-arrow-clockwise"></i></button>
                <button class="header-icon-btn" title="Pré-visualizar"><i class="bi bi-eye"></i></button>
              </div>
              <button class="btn-builder-save" title="Salvar Alterações">
                <i class="bi bi-floppy-fill"></i>
                <span class="btn-label">Salvar</span>
              </button>
              <button class="btn-builder-export" title="Exportar Código HTML">
                <i class="bi bi-download"></i>
                <span class="btn-label">Exportar</span>
              </button>
            </div>
          </div>

          <!-- Application Workspace Body -->
          <div class="builder-workspace-body">
            <!-- Central Canvas Viewport -->
            <div class="canvas-viewport-area">
              <!-- Active Element Floating Pill Inspector -->
              <div class="canvas-inspector-bar">
                <div class="inspector-badge">
                  <i class="bi bi-cursor-fill"></i>
                  <span>Elemento: <strong>{{ selectedElementTitle }}</strong></span>
                </div>
                <div class="inspector-quick-tools">
                  <span class="font-tag">Outfit 800</span>
                  <span class="color-dot" style="background: #612bf4"></span>
                  <span class="align-tag"><i class="bi bi-text-center"></i> Centro</span>
                </div>
              </div>

              <!-- Scrollable Canvas Stage -->
              <div class="canvas-stage">
                <!-- Top Urgency Banner Block -->
                <div
                  class="canvas-block urgency-block"
                  :class="{ 'block-selected': selectedBlock === 'urgency' }"
                  @click="selectBlock('urgency', 'Barra de Urgência')"
                >
                  <div class="block-controls-overlay" v-if="selectedBlock === 'urgency'">
                    <span class="block-tag"><i class="bi bi-fire"></i> Urgência</span>
                  </div>
                  <div class="urgency-inner">
                    <span class="pulse-fire">🔥</span>
                    <strong>ATENÇÃO:</strong> CONDIÇÃO ESPECIAL LIMITADA ÀS PRÓXIMAS <strong>07 HORAS</strong>
                  </div>
                </div>

                <!-- Main Sales Headline Block -->
                <div
                  class="canvas-block headline-block"
                  :class="{ 'block-selected': selectedBlock === 'headline' }"
                  @click="selectBlock('headline', 'Título H1 Principal')"
                >
                  <div class="block-controls-overlay" v-if="selectedBlock === 'headline'">
                    <span class="block-tag"><i class="bi bi-type-h1"></i> Título H1</span>
                  </div>
                  <h2 class="canvas-h1">
                    Descubra Como Multiplicar Suas Vendas Com Páginas de Alta Conversão
                  </h2>
                  <p class="canvas-subtitle">
                    O método definitivo para estruturar funis com carregamento instantâneo e delay de pitch sincronizado.
                  </p>
                </div>

                <!-- High-Converting VSL Video Player Block -->
                <div
                  class="canvas-block video-block"
                  :class="{ 'block-selected': selectedBlock === 'video' }"
                  @click="selectBlock('video', 'Vídeo VSL (VTurb)')"
                >
                  <div class="block-controls-overlay" v-if="selectedBlock === 'video'">
                    <span class="block-tag"><i class="bi bi-play-btn-fill"></i> VTurb / VSL</span>
                  </div>
                  <div class="vsl-player-frame">
                    <!-- Live Viewers Chip -->
                    <div class="live-chip">
                      <span class="red-pulse-dot"></span>
                      <span>1.482 assistindo agora</span>
                    </div>

                    <!-- Pitch delay indicator -->
                    <div class="pitch-chip">
                      <i class="bi bi-stopwatch-fill"></i>
                      <span>Pitch: 08:30 min</span>
                    </div>

                    <!-- Video Center Controls -->
                    <div class="vsl-center-play">
                      <div class="play-circle-glow">
                        <i class="bi bi-play-fill"></i>
                      </div>
                    </div>

                    <!-- Bottom Player Controls Bar -->
                    <div class="vsl-bottom-bar">
                      <div class="vsl-progress-rail">
                        <div class="vsl-progress-fill" style="width: 48%"></div>
                      </div>
                      <div class="vsl-controls-row">
                        <div class="vsl-time"><i class="bi bi-play-fill"></i> 04:12 / 18:30</div>
                        <div class="vsl-icons">
                          <i class="bi bi-volume-up-fill"></i>
                          <i class="bi bi-fullscreen"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Call to Action & Pitch Delay Area Block -->
                <div
                  class="canvas-block cta-block"
                  :class="{ 'block-selected': selectedBlock === 'cta' }"
                  @click="selectBlock('cta', 'Botão CTA & Delay de Pitch')"
                >
                  <div class="block-controls-overlay" v-if="selectedBlock === 'cta'">
                    <span class="block-tag"><i class="bi bi-box-arrow-in-right"></i> Botão CTA</span>
                  </div>
                  <button class="canvas-cta-button">
                    <span>QUERO GARANTIR MEU ACESSO COM 50% OFF</span>
                    <i class="bi bi-arrow-right-circle-fill"></i>
                  </button>
                  <div class="canvas-guarantee-row">
                    <span><i class="bi bi-shield-fill-check"></i> Pagamento Seguro</span>
                    <span><i class="bi bi-patch-check-fill"></i> 7 Dias de Garantia</span>
                    <span><i class="bi bi-lightning-charge-fill"></i> Acesso Imediato</span>
                  </div>
                </div>

                <!-- Social Proof / Testimonials Micro-Strip -->
                <div class="canvas-block proof-block">
                  <div class="proof-avatars">
                    <div class="avatar-stack">
                      <span class="av av1">👨🏻</span>
                      <span class="av av2">👩🏼</span>
                      <span class="av av3">👨🏽</span>
                      <span class="av av4">👩🏻</span>
                    </div>
                    <div class="proof-text">
                      <div class="stars-gold"><i class="bi bi-star-fill" v-for="n in 5" :key="n"></i> <strong>4.9/5</strong></div>
                      <span>Mais de <strong>2.400+ funis</strong> publicados</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Builder Library Panel (SidebarRight replica) -->
            <div class="builder-sidebar-panel">
              <!-- Tabs -->
              <div class="sidebar-tabs-bar">
                <button
                  class="side-tab-btn"
                  :class="{ active: activeSidebarTab === 'objects' }"
                  @click="activeSidebarTab = 'objects'"
                >
                  <i class="bi bi-box-seam"></i> Objetos
                </button>
                <button
                  class="side-tab-btn"
                  :class="{ active: activeSidebarTab === 'sections' }"
                  @click="activeSidebarTab = 'sections'"
                >
                  <i class="bi bi-list-nested"></i> Seções
                </button>
              </div>

              <!-- Elements List -->
              <div class="sidebar-elements-scroll">
                <!-- Search Input -->
                <div class="sidebar-search">
                  <i class="bi bi-search"></i>
                  <input type="text" placeholder="Buscar blocos..." readonly value="" />
                </div>

                <!-- Category 1: Estrutura -->
                <div class="category-block">
                  <div class="category-header">
                    <span>ESTRUTURA</span>
                  </div>
                  <div class="elements-grid">
                    <div class="elem-item" @click="selectBlock('grid', 'Grid Layout')">
                      <div class="elem-icon purple"><i class="bi bi-grid-1x2"></i></div>
                      <span class="elem-name">Grid</span>
                    </div>
                    <div class="elem-item" @click="selectBlock('container', 'Container 100%')">
                      <div class="elem-icon purple"><i class="bi bi-bounding-box-circles"></i></div>
                      <span class="elem-name">Container</span>
                    </div>
                  </div>
                </div>

                <!-- Category 2: Texto & Mídia -->
                <div class="category-block">
                  <div class="category-header">
                    <span>TEXTO & MÍDIA</span>
                  </div>
                  <div class="elements-grid">
                    <div class="elem-item active-item" @click="selectBlock('headline', 'Título H1 Principal')">
                      <div class="elem-icon blue"><i class="bi bi-type-h1"></i></div>
                      <span class="elem-name">Título H1</span>
                    </div>
                    <div class="elem-item" @click="selectBlock('video', 'Vídeo VSL (VTurb)')">
                      <div class="elem-icon red"><i class="bi bi-play-btn-fill"></i></div>
                      <span class="elem-name">Vídeo VSL</span>
                    </div>
                    <div class="elem-item" @click="selectBlock('image', 'Imagem Otimizada')">
                      <div class="elem-icon cyan"><i class="bi bi-image"></i></div>
                      <span class="elem-name">Imagem</span>
                    </div>
                    <div class="elem-item" @click="selectBlock('text', 'Parágrafo')">
                      <div class="elem-icon green"><i class="bi bi-text-paragraph"></i></div>
                      <span class="elem-name">Parágrafo</span>
                    </div>
                  </div>
                </div>

                <!-- Category 3: Conversão -->
                <div class="category-block">
                  <div class="category-header">
                    <span>CONVERSÃO & MARKETING</span>
                  </div>
                  <div class="elements-grid">
                    <div class="elem-item" @click="selectBlock('cta', 'Botão CTA & Delay de Pitch')">
                      <div class="elem-icon orange"><i class="bi bi-box-arrow-in-right"></i></div>
                      <span class="elem-name">Botão CTA</span>
                    </div>
                    <div class="elem-item" @click="selectBlock('pitch', 'Temporizador & Delay')">
                      <div class="elem-icon purple"><i class="bi bi-stopwatch"></i></div>
                      <span class="elem-name">Delay Pitch</span>
                    </div>
                    <div class="elem-item" @click="selectBlock('urgency', 'Barra de Urgência')">
                      <div class="elem-icon red"><i class="bi bi-fire"></i></div>
                      <span class="elem-name">Urgência</span>
                    </div>
                    <div class="elem-item" @click="selectBlock('proof', 'Prova Social')">
                      <div class="elem-icon green"><i class="bi bi-shield-check"></i></div>
                      <span class="elem-name">Garantia</span>
                    </div>
                  </div>
                </div>

                <!-- Add Section Button Replica -->
                <div class="sidebar-cta-box">
                  <button class="btn-add-section">
                    <i class="bi bi-plus-circle-fill"></i>
                    <span>Adicionar Seção Pronta</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['navigate']);

const activeSidebarTab = ref('objects');
const selectedBlock = ref('headline');
const selectedElementTitle = ref('Título H1 Principal');

function selectBlock(type, title) {
  selectedBlock.value = type;
  selectedElementTitle.value = title;
}
</script>

<style scoped>
/* ========================================================
   HERO SECTION (WHITE WITH SUBTLE BLUE DOTS)
======================================================== */
.hero-section {
  padding: 110px 0 130px 0;
  text-align: center;
  position: relative;
  isolation: isolate;
  background-color: #ffffff;
  background-image: radial-gradient(rgba(56, 189, 248, 0.28) 1.5px, transparent 1.5px);
  background-size: 26px 26px;
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 15%, rgba(97, 43, 244, 0.04) 0%, rgba(56, 189, 248, 0.02) 50%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}

.container {
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(238, 242, 255, 0.9);
  border: 1px solid rgba(199, 210, 254, 0.9);
  color: var(--color-primary-strong);
  padding: 9px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(97, 43, 244, 0.08);
  backdrop-filter: blur(8px);
}

.badge-dot {
  width: 9px;
  height: 9px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: pulse-dot 1.8s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.8; }
}

.hero-title {
  font-size: clamp(34px, 5.5vw, 64px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.03em;
  max-width: 980px;
  margin: 0 auto 26px auto;
  color: #0f172a;
  font-family: var(--font-sans);
}

.gradient-text {
  background: var(--gradient-aurora);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: clamp(16px, 2.1vw, 20.5px);
  color: #475569;
  max-width: 820px;
  margin: 0 auto 44px auto;
  line-height: 1.65;
}

.hero-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn-hero-primary {
  background: var(--color-primary);
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  padding: 16px 40px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(97, 43, 244, 0.32);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-hero-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 14px 36px rgba(97, 43, 244, 0.45);
  transform: translateY(-3px);
}

.btn-hero-secondary {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  color: #1e293b;
  font-size: 17px;
  font-weight: 700;
  padding: 16px 34px;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.btn-hero-secondary:hover {
  background: #f8fafc;
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(97, 43, 244, 0.12);
}

/* ========================================================
   MOCKUP POSITIONED FURTHER DOWN
======================================================== */
.preview-mockup-wrapper {
  position: relative;
  max-width: 1160px;
  margin: 140px auto 0 auto;
}

/* Floating Badges */
.floating-badge {
  position: absolute;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px 20px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(16px);
  text-align: left;
  transition: transform 0.3s ease;
}

.floating-badge strong {
  display: block;
  font-size: 14px;
  color: #0f172a;
}

.floating-badge span {
  display: block;
  font-size: 12.5px;
  color: #64748b;
}

.floating-badge .f-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.f-icon.green { background: #e6f9f0; color: #10b981; }
.f-icon.purple { background: var(--color-primary-soft); color: var(--color-primary); }

.badge-left {
  top: 90px;
  left: -28px;
  animation: float-slow 4.5s ease-in-out infinite alternate;
}

.badge-right {
  bottom: 90px;
  right: -28px;
  animation: float-slow 4.2s ease-in-out infinite alternate-reverse;
}

@keyframes float-slow {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-10px); }
}

/* Main Window Container Frame */
.app-window-frame {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.16), 0 4px 18px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  text-align: left;
}

/* Window Header Bar */
.builder-header-bar {
  height: 54px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.window-controls {
  display: flex;
  gap: 7px;
  margin-right: 6px;
}

.dot { width: 11px; height: 11px; border-radius: 50%; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.header-icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14.5px;
  transition: all 0.15s ease;
}

.header-icon-btn:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #0f172a;
}

.page-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.mode-badge {
  font-size: 11.5px;
  font-weight: 700;
  background: #eef2ff;
  color: var(--color-primary);
  padding: 3px 9px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #dbeafe;
}

/* Header Right Actions */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-icons-group {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 8px;
  border-right: 1px solid #e2e8f0;
}

.btn-builder-save {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.btn-builder-save:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-builder-export {
  background: var(--gradient-aurora);
  border: none;
  color: #ffffff;
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px rgba(97, 43, 244, 0.28);
  transition: all 0.15s ease;
}

.btn-builder-export:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

/* Workspace Body Layout */
.builder-workspace-body {
  height: 540px;
  display: flex;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

/* Canvas Viewport */
.canvas-viewport-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 28px 32px 28px;
  overflow-y: auto;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Inspector Quick Bar */
.canvas-inspector-bar {
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.inspector-badge {
  font-size: 12.5px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.inspector-badge strong {
  color: var(--color-primary);
}

.inspector-quick-tools {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #475569;
  font-weight: 600;
}

.font-tag, .align-tag {
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 4px;
}

.color-dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 1px #cbd5e1;
}

/* Canvas Stage Sheet */
.canvas-stage {
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 26px 28px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Canvas Blocks */
.canvas-block {
  position: relative;
  border: 1px dashed transparent;
  border-radius: 8px;
  padding: 4px;
  transition: all 0.15s ease;
  cursor: pointer;
}

.canvas-block:hover {
  border-color: #93c5fd;
  background: rgba(239, 246, 255, 0.35);
}

.canvas-block.block-selected {
  border: 1.5px solid var(--color-primary);
  background: rgba(97, 43, 244, 0.03);
  box-shadow: 0 0 0 2px rgba(97, 43, 244, 0.15);
}

.block-controls-overlay {
  position: absolute;
  top: -10px;
  left: 10px;
  z-index: 10;
}

.block-tag {
  background: var(--color-primary);
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* Urgency Block */
.urgency-inner {
  background: #fff1f2;
  border: 1px dashed #f43f5e;
  color: #be123c;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  padding: 7px 14px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.pulse-fire {
  font-size: 15px;
  animation: pulse-dot 1.2s infinite;
}

/* Headline Block */
.canvas-h1 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
  margin-bottom: 6px;
  font-family: var(--font-sans);
}

.canvas-subtitle {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* VSL Video Player Frame */
.vsl-player-frame {
  width: 100%;
  height: 210px;
  background: linear-gradient(135deg, #090614 0%, #17112d 100%);
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(9, 6, 20, 0.25);
}

.live-chip {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.red-pulse-dot {
  width: 7px;
  height: 7px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse-dot 1.2s infinite;
}

.pitch-chip {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(97, 43, 244, 0.75);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.vsl-center-play {
  z-index: 2;
  cursor: pointer;
}

.play-circle-glow {
  width: 54px;
  height: 54px;
  background: var(--gradient-aurora);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #ffffff;
  box-shadow: 0 0 26px rgba(97, 43, 244, 0.6);
  transition: transform 0.2s ease;
}

.play-circle-glow:hover {
  transform: scale(1.1);
}

.vsl-bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
  padding: 8px 14px 6px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vsl-progress-rail {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  overflow: hidden;
}

.vsl-progress-fill {
  height: 100%;
  background: var(--gradient-aurora);
}

.vsl-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-size: 11px;
}

.vsl-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vsl-icons {
  display: flex;
  gap: 9px;
  font-size: 11.5px;
  opacity: 0.85;
}

/* CTA Block */
.canvas-cta-button {
  width: 100%;
  background: var(--gradient-aurora);
  color: #ffffff;
  border: none;
  padding: 14px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(97, 43, 244, 0.32);
  letter-spacing: -0.01em;
}

.canvas-guarantee-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 10px;
  font-size: 11.5px;
  color: #64748b;
  font-weight: 600;
  flex-wrap: wrap;
}

.canvas-guarantee-row span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.canvas-guarantee-row i {
  color: #10b981;
}

/* Proof Block */
.proof-avatars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.avatar-stack {
  display: flex;
  margin-left: 6px;
}

.avatar-stack .av {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #ffffff;
  margin-left: -7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.proof-text {
  font-size: 11.5px;
  color: #475569;
  text-align: left;
}

.stars-gold {
  color: #eab308;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 2px;
}

/* Right Builder Library Panel */
.builder-sidebar-panel {
  width: 245px;
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-tabs-bar {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.side-tab-btn {
  flex: 1;
  padding: 11px 8px;
  font-size: 12px;
  font-weight: 700;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;
  border-bottom: 2px solid transparent;
}

.side-tab-btn.active {
  color: var(--color-primary);
  background: #ffffff;
  border-bottom-color: var(--color-primary);
}

.sidebar-elements-scroll {
  flex: 1;
  padding: 14px 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-search {
  position: relative;
}

.sidebar-search i {
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11.5px;
  color: #94a3b8;
}

.sidebar-search input {
  width: 100%;
  padding: 6px 8px 6px 28px;
  font-size: 11.5px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
  outline: none;
}

.category-header {
  font-size: 10.5px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  padding-left: 2px;
}

.elements-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.elem-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.elem-item:hover, .elem-item.active-item {
  background: #eef2ff;
  border-color: #c7d2fe;
  transform: translateY(-1px);
}

.elem-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.elem-icon.purple { background: #ede9fe; color: #7c3aed; }
.elem-icon.blue { background: #dbeafe; color: #2563eb; }
.elem-icon.red { background: #ffe4e6; color: #e11d48; }
.elem-icon.cyan { background: #e0f2fe; color: #0284c7; }
.elem-icon.green { background: #dcfce7; color: #16a34a; }
.elem-icon.orange { background: #ffedd5; color: #ea580c; }

.elem-name {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

.sidebar-cta-box {
  margin-top: 4px;
}

.btn-add-section {
  width: 100%;
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  color: #475569;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.btn-add-section:hover {
  background: #ede9fe;
  border-color: #818cf8;
  color: #4f46e5;
}

/* ========================================================
   RESPONSIVE DESIGN (MOBILE PERFECTION)
======================================================== */
@media (max-width: 980px) {
  .hero-section { padding: 80px 0 100px 0; }
  .floating-badge { display: none; }
  .builder-sidebar-panel { display: none; }
  .builder-workspace-body { height: 480px; }
  .preview-mockup-wrapper { margin-top: 75px; }
}

@media (max-width: 680px) {
  .hero-section { padding: 48px 0 70px 0; }
  .container { padding: 0 16px; }
  .badge-tag { font-size: 12px; padding: 7px 16px; margin-bottom: 20px; }
  .hero-title { font-size: 30px; margin-bottom: 18px; }
  .hero-subtitle { font-size: 15px; margin-bottom: 30px; }
  .hero-buttons { flex-direction: column; width: 100%; gap: 12px; }
  .hero-buttons button { width: 100%; justify-content: center; padding: 14px; font-size: 15.5px; }
  
  .preview-mockup-wrapper { margin-top: 45px; }
  .builder-header-bar { padding: 0 12px; height: 48px; }
  .tool-icons-group { display: none; }
  .btn-label { display: none; }
  .btn-builder-save, .btn-builder-export { padding: 6px 10px; }
  .page-name { font-size: 12px; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .canvas-viewport-area { padding: 12px 10px; }
  .canvas-inspector-bar { flex-direction: column; gap: 6px; align-items: flex-start; padding: 8px 10px; font-size: 11px; }
  .canvas-stage { padding: 14px 12px; border-radius: 10px; }
  .canvas-h1 { font-size: 16px; }
  .canvas-subtitle { font-size: 12px; }
  .vsl-player-frame { height: 160px; }
  .live-chip, .pitch-chip { font-size: 10px; padding: 3px 7px; }
  .canvas-cta-button { font-size: 12px; padding: 12px 14px; }
  .canvas-guarantee-row { font-size: 10px; gap: 8px; }
  .builder-workspace-body { height: 430px; }
}
</style>
