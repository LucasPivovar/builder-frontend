<template>
  <section id="faq" class="faq-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Perguntas Frequentes</h2>
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
  { question: 'Preciso saber programar para usar a plataforma?', answer: 'Não! O construtor é 100% drag & drop visual. Você pode criar, estilizar e publicar suas páginas sem escrever nenhuma linha de código.' },
  { question: 'Posso usar meu próprio domínio personalizado?', answer: 'Sim! Nosso plano Pro permite que você vincule seus domínios próprios e publique suas páginas instantaneamente.' },
  { question: 'Como funciona a exportação de HTML?', answer: 'Com apenas um clique, o estúdio gera o código HTML puro, sem scripts desnecessários, pronto para subir em qualquer servidor ou hospedagem.' }
];

function toggleFaq(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx;
}
</script>

<style scoped>
.faq-section { padding: 60px 0; border-top: 1px solid rgba(255, 255, 255, 0.08); }
.container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
.section-header { text-align: center; margin-bottom: 40px; }
.section-title { font-size: 32px; font-weight: 800; }

.faq-item {
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
}

.faq-question {
  padding: 18px 24px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-answer {
  padding: 0 24px 18px 24px;
  font-size: 14.5px;
  color: #94a3b8;
  line-height: 1.6;
}

.faq-item.active .faq-question i {
  transform: rotate(180deg);
}
</style>
