<template>
  <section id="recursos" class="features-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Tudo o que sua aplicação precisa</h2>
        <p class="section-subtitle">Recursos modernos para construir experiências digitais incríveis de conversão.</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="icon-box"><i class="bi bi-cursor-fill"></i></div>
          <h3>Editor Drag & Drop Vivo</h3>
          <p>Arraste elementos, configure estilos em tempo real e visualize o resultado final na hora.</p>
        </div>

        <div class="feature-card">
          <div class="icon-box"><i class="bi bi-play-circle-fill"></i></div>
          <h3>Suporte Nativo a VTurb</h3>
          <p>Integre vídeos VSL do VTurb com interceptação e sincronização automática de pitch delay.</p>
        </div>

        <div class="feature-card">
          <div class="icon-box"><i class="bi bi-eye-fill"></i></div>
          <h3>Widget de Espectadores Ao Vivo</h3>
          <p>Gere prova social dinâmica com contador de visualizações flutuante em tempo real.</p>
        </div>

        <div class="feature-card">
          <div class="icon-box"><i class="bi bi-phone-fill"></i></div>
          <h3>100% Responsivo</h3>
          <p>Edite e pré-visualize o comportamento em Desktop, Tablet e Celular instantaneamente.</p>
        </div>

        <div class="feature-card">
          <div class="icon-box"><i class="bi bi-code-slash"></i></div>
          <h3>Exportação Clean HTML</h3>
          <p>Baixe o código HTML puro sem dependências pesadas, super leve e otimizado para SEO.</p>
        </div>

        <div class="feature-card">
          <div class="icon-box"><i class="bi bi-shield-lock-fill"></i></div>
          <h3>Hospedagem & Domínios</h3>
          <p>Conecte seus próprios domínios personalizados e publique páginas com SSL nativo.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
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

.section-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 10px;
}

.section-subtitle {
  color: #94a3b8;
  font-size: 16px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.feature-card {
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(99, 102, 241, 0.4);
}

.icon-box {
  width: 56px;
  height: 56px;
  background: rgba(99, 102, 241, 0.12);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #818cf8;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 14.5px;
  color: #94a3b8;
}
</style>
