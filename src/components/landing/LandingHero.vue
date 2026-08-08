<template>
  <section class="hero-section">
    <div class="glow-bg"></div>
    <div class="container hero-container">
      <div class="badge-tag">
        <i class="bi bi-rocket-takeoff-fill"></i> Plataforma Nº 1 em Construção Visual de Páginas
      </div>

      <h1 class="hero-title">
        Crie Funis & Páginas de <span class="gradient-text">Alta Conversão</span> em Minutos
      </h1>

      <p class="hero-subtitle">
        A plataforma completa para você construir, gerenciar e publicar páginas modernas, VSLs e funis de vendas com máxima performance e sem programar uma linha de código.
      </p>

      <div class="hero-buttons">
        <button class="btn-hero-primary" @click="$emit('navigate', 'dashboard')">
          Acessar Meu Painel <i class="bi bi-arrow-right-short"></i>
        </button>
        <button class="btn-hero-secondary" @click="$emit('navigate', 'builder')">
          <i class="bi bi-play-circle-fill"></i> Abrir Construtor Live
        </button>
      </div>

      <!-- App Workspace Preview Card -->
      <div class="preview-mockup-card">
        <div class="mockup-header">
          <div class="mockup-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="mockup-url">builder.visualstudio.com/editor</span>
        </div>
        <div class="mockup-body">
          <div class="mockup-sidebar"></div>
          <div class="mockup-canvas">
            <div class="mockup-banner"></div>
            <div class="mockup-headline"></div>
            <div class="mockup-video">
              <i class="bi bi-play-circle-fill play-icon"></i>
            </div>
            <div class="mockup-btn"></div>
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
.hero-section {
  padding: 80px 0 60px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.glow-bg {
  position: absolute;
  top: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 70%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #818cf8;
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 24px;
}

.hero-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1px;
  max-width: 900px;
  margin: 0 auto 20px auto;
}

.gradient-text {
  background: linear-gradient(135deg, #818cf8 0%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: clamp(16px, 2vw, 20px);
  color: #94a3b8;
  max-width: 760px;
  margin: 0 auto 36px auto;
}

.hero-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 60px;
}

.btn-hero-primary {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  padding: 14px 34px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.btn-hero-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-mockup-card {
  max-width: 900px;
  margin: 0 auto;
  background: #0f1523;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.2);
  overflow: hidden;
}

.mockup-header {
  height: 40px;
  background: #1e293b;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
}

.mockup-dots {
  display: flex;
  gap: 6px;
}

.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.mockup-url {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #94a3b8;
}

.mockup-body {
  height: 380px;
  display: flex;
  background: #0b0f19;
}

.mockup-sidebar {
  width: 180px;
  background: #0f1523;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.mockup-canvas {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.mockup-banner { width: 100%; height: 28px; background: #dc2626; border-radius: 6px; }
.mockup-headline { width: 70%; height: 20px; background: rgba(255, 255, 255, 0.2); border-radius: 6px; }
.mockup-video {
  width: 60%;
  height: 180px;
  background: #1f2937;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.play-icon { font-size: 40px; color: #10b981; }
.mockup-btn { width: 50%; height: 36px; background: #10b981; border-radius: 10px; }
</style>
