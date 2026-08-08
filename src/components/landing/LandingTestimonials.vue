<template>
  <section id="depoimentos" class="testimonials-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">O que nossos clientes dizem</h2>
      </div>

      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p class="quote">"O Visual Builder Studio revolucionou nossa agência. Criamos VSLs e funis em minutos e os resultados de conversão dobraram!"</p>
          <div class="user-info">
            <div class="avatar">R</div>
            <div>
              <div class="user-name">Rodrigo M.</div>
              <div class="user-role">Diretor de Marketing</div>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p class="quote">"Facilidade incrível de uso, integração com VTurb perfeita e a exportação do código HTML é extremamente limpa."</p>
          <div class="user-info">
            <div class="avatar">C</div>
            <div>
              <div class="user-name">Camila S.</div>
              <div class="user-role">Produtora Digital</div>
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

.stars { color: #fbbf24; font-size: 16px; margin-bottom: 12px; }
.quote { font-size: 14.5px; color: #cbd5e1; margin-bottom: 18px; font-style: italic; }
.user-info { display: flex; align-items: center; gap: 12px; }
.avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #10b981); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; }
.user-name { font-weight: 700; font-size: 14px; }
.user-role { font-size: 12px; color: #94a3b8; }
</style>
