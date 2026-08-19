<template>
  <section id="faq" class="faq-section">
    <div class="container">
      <div class="section-header">
        <span class="sub-pill">DÚVIDAS FREQUENTES</span>
        <h2 class="section-title">Perguntas Frequentes</h2>
        <p class="section-subtitle">Tudo o que você precisa saber para começar a construir suas páginas hoje.</p>
      </div>

      <div class="faq-list">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="faq-item"
          :class="{ active: openIndex === index }"
        >
          <div class="faq-question" @click="toggleFaq(index)">
            <span>{{ item.question }}</span>
            <i class="bi bi-chevron-down"></i>
          </div>
          <div class="faq-answer" v-if="openIndex === index">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const openIndex = ref(0);

const faqItems = [
  {
    question: 'Preciso saber programar para usar a plataforma?',
    answer: 'Não! O Astro Builder foi desenvolvido especialmente para infoprodutores, afiliados, copywriters e gestores de tráfego que querem montar páginas visualmente sem mexer em código.'
  },
  {
    question: 'Como funciona o pitch delay para vídeos do VTurb?',
    answer: 'Você pode definir exatamente em quantos minutos e segundos os botões de compra e seções da página devem aparecer após o início da reprodução do vídeo. O construtor sincroniza automaticamente.'
  },
  {
    question: 'Quais formatos de página posso criar?',
    answer: 'Você pode criar páginas completas de funil de vendas e VSLs, e-mails em formato padronizado de 600px de largura e quizzes interativos organizados em etapas progressivas.'
  },
  {
    question: 'Como faço para publicar a página na minha hospedagem?',
    answer: 'O construtor possui um botão de exportação que gera o arquivo HTML 100% puro e otimizado. Você pode copiar o código ou baixar o arquivo .html e subir em qualquer hospedagem (Hostinger, cPanel, Cloudflare Pages, Vercel, etc.).'
  },
  {
    question: 'Posso configurar Meta Pixel e Google Tag Manager?',
    answer: 'Sim! Há campos dedicados nas configurações da página para você inserir IDs de Pixel, scripts do GTM e tags personalizadas de cabeçalho e rodapé.'
  },
  {
    question: 'Minhas páginas ficam salvas se eu fechar o navegador?',
    answer: 'Sim. O sistema conta com auto-salvamento automático e histórico de até 20 versões no backend local, permitindo restaurar estados anteriores a qualquer momento.'
  }
];

function toggleFaq(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx;
}
</script>

<style scoped>
.faq-section {
  padding: 80px 0;
  border-top: 1px solid var(--color-border);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
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
  color: var(--color-text);
  font-family: var(--font-display);
  letter-spacing: -0.5px;
  margin-bottom: 10px;
}

.section-subtitle {
  font-size: 16px;
  color: var(--color-text-secondary);
}

.faq-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: 14px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  text-align: left;
}

.faq-item:hover {
  border-color: var(--color-border-strong);
}

.faq-item.active {
  border-color: var(--color-primary-border);
  box-shadow: var(--shadow-main);
}

.faq-question {
  padding: 20px 26px;
  font-weight: 700;
  font-size: 16px;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  font-family: var(--font-display);
}

.faq-question i {
  color: var(--color-primary);
  font-size: 16px;
  transition: transform 0.25s ease;
}

.faq-answer {
  padding: 0 26px 22px 26px;
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.65;
}

.faq-item.active .faq-question i {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .faq-section { padding: 50px 0; }
  .section-title { font-size: 26px; }
  .faq-question { padding: 16px 18px; font-size: 15px; }
  .faq-answer { padding: 0 18px 16px 18px; font-size: 14px; }
}
</style>
