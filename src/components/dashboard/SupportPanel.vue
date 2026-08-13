<template>
  <div class="support-panel">
    <div class="support-hero">
      <div class="hero-icon"><i class="bi bi-headset"></i></div>
      <h2>Central de ajuda</h2>
      <p>Consulte as orientações dos principais fluxos da plataforma local.</p>
    </div>

    <!-- FAQ -->
    <div class="faq-section">
      <h3 class="section-title"><i class="bi bi-patch-question-fill"></i> Perguntas Frequentes</h3>

      <div class="faq-list">
        <div
          v-for="(faq, idx) in faqs"
          :key="idx"
          class="faq-item"
          :class="{ open: openFaq === idx }"
          @click="openFaq = openFaq === idx ? null : idx"
        >
          <div class="faq-question">
            <span>{{ faq.q }}</span>
            <i class="bi" :class="openFaq === idx ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          </div>
          <div class="faq-answer" v-show="openFaq === idx">
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const openFaq = ref(null);

const faqs = [
  { q: 'Como faço para salvar minha página no Builder?', a: 'No topo do Builder, clique no botão "Salvar Página". Um modal abrirá para você nomear a página e escolher uma pasta. Após salvar, ela aparecerá no Dashboard em "Todas as Páginas".' },
  { q: 'Qual é a diferença entre funil, e-mail e quiz?', a: 'O funil usa largura total e é indicado para VSLs e páginas de vendas. O e-mail usa largura fixa de 600px. O quiz funciona em etapas com perguntas, respostas e resultado.' },
  { q: 'Como posso editar os elementos da página?', a: 'No Builder, clique na aba "Seções" no painel lateral direito. Lá você verá a árvore com todas as seções e objetos do seu canvas. Clique nos 3 pontinhos de qualquer objeto para editá-lo ou duplicá-lo.' },
  { q: 'Posso criar pastas dentro de pastas?', a: 'Sim! Ao criar uma nova pasta (clique em "Nova Pasta" na seção Pastas), você pode selecionar uma "Pasta Pai" para criá-la como subpasta dentro de outra pasta existente.' },
  { q: 'Como exportar minha página em HTML?', a: 'No Builder, clique no botão "Exportar HTML" no canto superior direito. O sistema gerará um arquivo HTML completo e otimizado com todos os seus elementos e estilos.' },
  { q: 'Como publicar um template no Painel Admin?', a: 'Abra o Painel Admin, acesse “Templates” e clique em “Criar template”. Escolha o formato, monte o conteúdo no Builder e clique em “Publicar template”.' }
];
</script>

<style scoped>
.support-panel {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.support-hero {
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 44px 24px;
}

.hero-icon {
  width: 64px; height: 64px; border-radius: 18px;
  background: var(--color-primary-soft); color: var(--color-primary);
  font-size: 32px; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}

.support-hero h2 { font-size: 26px; font-weight: 900; color: var(--color-text); margin-bottom: 8px; }
.support-hero p { font-size: 15px; color: var(--color-text-muted); max-width: 500px; margin: 0 auto; }

.contact-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

.contact-card {
  display: flex; align-items: center; gap: 14px;
  background: rgba(23, 31, 48, 0.75); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px; padding: 18px 20px; text-decoration: none; transition: all 0.2s;
}

.contact-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.2); }
.contact-card i { font-size: 28px; flex-shrink: 0; }
.contact-card strong { display: block; font-size: 14px; font-weight: 700; color: var(--color-surface); margin-bottom: 2px; }
.contact-card span { font-size: 12px; color: var(--color-text-soft); }

.contact-whatsapp { border-color: rgba(37, 211, 102, 0.3); }
.contact-whatsapp i { color: #25d366; }
.contact-email i { color: var(--color-primary-bright); }
.contact-docs i { color: var(--color-primary-strong); }

.section-title { font-size: 18px; font-weight: 800; color: var(--color-text); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

.faq-section, .ticket-section {
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: 18px; padding: 28px;
}

.faq-list { display: flex; flex-direction: column; gap: 8px; }

.faq-item {
  background: var(--color-surface-soft); border: 1px solid var(--color-border);
  border-radius: 12px; overflow: hidden; cursor: pointer;
  transition: border-color 0.2s;
}

.faq-item.open, .faq-item:hover { border-color: var(--color-primary); }

.faq-question {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; color: var(--color-text-secondary); font-size: 14px; font-weight: 600;
}

.faq-answer { padding: 0 18px 14px; border-top: 1px solid var(--color-border); }
.faq-answer p { font-size: 13.5px; color: var(--color-text-muted); line-height: 1.6; margin-top: 10px; }

.ticket-form { display: flex; flex-direction: column; gap: 0; }
.form-group { margin-bottom: 16px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-label { display: block; font-size: 12px; font-weight: 700; color: var(--color-border); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.4px; }

.form-input, .form-select, .form-textarea {
  width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 10px 14px; color: var(--color-surface); font-size: 14px; outline: none;
}

.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--color-primary); }
.form-textarea { resize: vertical; font-family: inherit; line-height: 1.5; }

.ticket-priority { margin-bottom: 20px; }
.priority-btns { display: flex; gap: 8px; flex-wrap: wrap; }

.priority-btn {
  padding: 7px 16px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
  background: rgba(255,255,255,0.05); color: var(--color-text-soft); font-size: 13px; font-weight: 600; cursor: pointer;
}

.priority-btn.active { color: var(--color-surface); }
.priority-btn.priority-baixa.active { background: rgba(16,185,129,0.2); border-color: #10b981; }
.priority-btn.priority-normal.active { background: var(--color-primary-soft); border-color: var(--color-primary); }
.priority-btn.priority-alta.active { background: var(--color-primary-soft); border-color: var(--color-primary); }
.priority-btn.priority-urgente.active { background: rgba(239,68,68,0.2); border-color: #ef4444; }

.success-box {
  display: flex; align-items: flex-start; gap: 12px;
  background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16,185,129,0.3);
  color: var(--color-primary-strong); padding: 14px 16px; border-radius: 12px; margin-bottom: 16px;
}

.success-box i { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.success-box strong { display: block; font-size: 14px; margin-bottom: 2px; }
.success-box p { font-size: 13px; margin: 0; color: #6ee7b7; }

.ticket-actions { display: flex; gap: 10px; justify-content: flex-end; }

.btn-cancel {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-border); padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 13.5px; cursor: pointer;
}

.btn-submit-ticket {
  background: var(--color-primary); border: none; color: var(--color-surface); padding: 10px 22px;
  border-radius: 10px; font-weight: 700; font-size: 13.5px; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
}

.btn-submit-ticket:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
