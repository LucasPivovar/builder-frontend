<template>
  <section id="depoimentos" class="testimonials-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Um fluxo para cada campanha</h2>
      </div>

      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="stars" aria-label="Funis e páginas"><i class="bi bi-window"></i></div>
          <p class="quote">Monte páginas de vendas e VSLs em largura total, configure rastreamento e exporte o HTML quando estiver pronto.</p>
          <div class="user-info">
            <div class="avatar"><i class="bi bi-play-btn-fill"></i></div>
            <div>
              <div class="user-name">Funis e VSLs</div>
              <div class="user-role">Páginas de conversão</div>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="stars" aria-label="E-mails e quizzes"><i class="bi bi-ui-checks-grid"></i></div>
          <p class="quote">Crie e-mails compatíveis com largura de 600px e quizzes em etapas com respostas, progresso e resultado.</p>
          <div class="user-info">
            <div class="avatar"><i class="bi bi-envelope-paper-fill"></i></div>
            <div>
              <div class="user-name">E-mails e quizzes</div>
              <div class="user-role">Campanhas e experiências interativas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials-section { padding: 60px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-header { text-align: center; margin-bottom: 40px; }
.section-title { font-size: 32px; font-weight: 800; }

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.testimonial-card {
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
}

.stars { color: var(--color-primary); font-size: 16px; margin-bottom: 12px; display:flex; gap:3px; }
.quote { font-size: 14.5px; color: var(--color-border); margin-bottom: 18px; font-style: italic; }
.user-info { display: flex; align-items: center; gap: 12px; }
.avatar { width: 42px; height: 42px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--color-surface); }
.user-name { font-weight: 700; font-size: 14px; }
.user-role { font-size: 12px; color: var(--color-text-soft); }
</style>
