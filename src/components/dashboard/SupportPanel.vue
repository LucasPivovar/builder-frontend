<template>
  <div class="support-panel">
    <div class="support-hero">
      <div class="hero-icon"><i class="bi bi-headset"></i></div>
      <h2>Central de Suporte</h2>
      <p>Nossa equipe está pronta para te ajudar. Consulte o FAQ ou abra um ticket de suporte.</p>
    </div>

    <!-- Contact Cards -->
    <div class="contact-cards">
      <a href="https://wa.me/5511999999999" target="_blank" class="contact-card contact-whatsapp">
        <i class="bi bi-whatsapp"></i>
        <div>
          <strong>WhatsApp</strong>
          <span>Resposta em até 1h</span>
        </div>
      </a>
      <a href="mailto:suporte@visualbuilder.app" class="contact-card contact-email">
        <i class="bi bi-envelope-fill"></i>
        <div>
          <strong>E-mail</strong>
          <span>suporte@visualbuilder.app</span>
        </div>
      </a>
      <div class="contact-card contact-docs" @click="showTicketForm = true" style="cursor: pointer;">
        <i class="bi bi-ticket-perforated-fill"></i>
        <div>
          <strong>Abrir Ticket</strong>
          <span>Detalhes sobre seu problema</span>
        </div>
      </div>
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

    <!-- Ticket Form -->
    <div v-if="showTicketForm" class="ticket-section">
      <h3 class="section-title"><i class="bi bi-send-fill"></i> Abrir Ticket de Suporte</h3>

      <form @submit.prevent="handleTicketSubmit" class="ticket-form">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Seu Nome</label>
            <input type="text" class="form-input" v-model="ticket.name" placeholder="João Silva" required />
          </div>
          <div class="form-group">
            <label class="form-label">Seu E-mail</label>
            <input type="email" class="form-input" v-model="ticket.email" placeholder="seu@email.com" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Assunto</label>
          <select class="form-select" v-model="ticket.subject">
            <option value="">Selecione o assunto...</option>
            <option value="billing">Problema de cobrança / assinatura</option>
            <option value="technical">Problema técnico no Builder</option>
            <option value="template">Dúvida sobre templates</option>
            <option value="account">Problema de acesso à conta</option>
            <option value="feature">Sugestão de funcionalidade</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Descrição do Problema</label>
          <textarea
            class="form-textarea"
            v-model="ticket.message"
            rows="5"
            placeholder="Descreva o problema com o máximo de detalhes possível: o que aconteceu, o que esperava que acontecesse, e quais passos seguiu..."
            required
          ></textarea>
        </div>

        <div class="ticket-priority">
          <label class="form-label">Prioridade</label>
          <div class="priority-btns">
            <button type="button" v-for="p in ['Baixa', 'Normal', 'Alta', 'Urgente']" :key="p"
              class="priority-btn"
              :class="{ active: ticket.priority === p, [`priority-${p.toLowerCase()}`]: true }"
              @click="ticket.priority = p">
              {{ p }}
            </button>
          </div>
        </div>

        <div v-if="ticketSent" class="success-box">
          <i class="bi bi-check-circle-fill"></i>
          <div>
            <strong>Ticket enviado com sucesso!</strong>
            <p>Nossa equipe entrará em contato em até 24 horas úteis.</p>
          </div>
        </div>

        <div class="ticket-actions">
          <button type="button" class="btn-cancel" @click="showTicketForm = false">Cancelar</button>
          <button type="submit" class="btn-submit-ticket" :disabled="ticketLoading || ticketSent">
            <span v-if="!ticketLoading"><i class="bi bi-send"></i> Enviar Ticket</span>
            <span v-else><i class="bi bi-hourglass-split"></i> Enviando...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const openFaq = ref(null);
const showTicketForm = ref(false);
const ticketLoading = ref(false);
const ticketSent = ref(false);

const ticket = reactive({
  name: '', email: '', subject: '', message: '', priority: 'Normal'
});

const faqs = [
  { q: 'Como faço para salvar minha página no Builder?', a: 'No topo do Builder, clique no botão "Salvar Página". Um modal abrirá para você nomear a página e escolher uma pasta. Após salvar, ela aparecerá no Dashboard em "Todas as Páginas".' },
  { q: 'Qual é a diferença entre Página Funil e Template E-mail?', a: 'A Página Funil tem largura livre e fundo escuro, ideal para VSL, landing pages, upsell e downsell. O Template E-mail tem largura fixa de 600px com estrutura de cabeçalho e rodapé, ideal para e-mail marketing.' },
  { q: 'Como posso editar os elementos da página?', a: 'No Builder, clique na aba "Seções" no painel lateral direito. Lá você verá a árvore com todas as seções e objetos do seu canvas. Clique nos 3 pontinhos de qualquer objeto para editá-lo ou duplicá-lo.' },
  { q: 'Posso criar pastas dentro de pastas?', a: 'Sim! Ao criar uma nova pasta (clique em "Nova Pasta" na seção Pastas), você pode selecionar uma "Pasta Pai" para criá-la como subpasta dentro de outra pasta existente.' },
  { q: 'Como exportar minha página em HTML?', a: 'No Builder, clique no botão "Exportar HTML" no canto superior direito. O sistema gerará um arquivo HTML completo e otimizado com todos os seus elementos e estilos.' },
  { q: 'Como publicar um template no Painel Admin?', a: 'Acesse "Painel Admin" no menu lateral, clique em "Subir Template", cole o HTML exportado pelo Builder ou faça upload do arquivo .html. O sistema converterá em JSON e disponibilizará na galeria.' }
];

async function handleTicketSubmit() {
  ticketLoading.value = true;
  await new Promise(r => setTimeout(r, 1200));
  ticketLoading.value = false;
  ticketSent.value = true;
  setTimeout(() => { ticketSent.value = false; showTicketForm.value = false; Object.assign(ticket, { name: '', email: '', subject: '', message: '', priority: 'Normal' }); }, 3000);
}
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
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 44px 24px;
}

.hero-icon {
  width: 64px; height: 64px; border-radius: 18px;
  background: rgba(99, 102, 241, 0.2); color: #818cf8;
  font-size: 32px; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}

.support-hero h2 { font-size: 26px; font-weight: 900; color: #fff; margin-bottom: 8px; }
.support-hero p { font-size: 15px; color: #94a3b8; max-width: 500px; margin: 0 auto; }

.contact-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

.contact-card {
  display: flex; align-items: center; gap: 14px;
  background: rgba(23, 31, 48, 0.75); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px; padding: 18px 20px; text-decoration: none; transition: all 0.2s;
}

.contact-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.2); }
.contact-card i { font-size: 28px; flex-shrink: 0; }
.contact-card strong { display: block; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.contact-card span { font-size: 12px; color: #94a3b8; }

.contact-whatsapp { border-color: rgba(37, 211, 102, 0.3); }
.contact-whatsapp i { color: #25d366; }
.contact-email i { color: #38bdf8; }
.contact-docs i { color: #a78bfa; }

.section-title { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

.faq-section, .ticket-section {
  background: rgba(23, 31, 48, 0.5); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px; padding: 28px;
}

.faq-list { display: flex; flex-direction: column; gap: 8px; }

.faq-item {
  background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px; overflow: hidden; cursor: pointer;
  transition: border-color 0.2s;
}

.faq-item.open { border-color: rgba(99, 102, 241, 0.4); }
.faq-item:hover { border-color: rgba(255,255,255,0.15); }

.faq-question {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; color: #e2e8f0; font-size: 14px; font-weight: 600;
}

.faq-answer { padding: 0 18px 14px; border-top: 1px solid rgba(255,255,255,0.05); }
.faq-answer p { font-size: 13.5px; color: #94a3b8; line-height: 1.6; margin-top: 10px; }

.ticket-form { display: flex; flex-direction: column; gap: 0; }
.form-group { margin-bottom: 16px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-label { display: block; font-size: 12px; font-weight: 700; color: #e2e8f0; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.4px; }

.form-input, .form-select, .form-textarea {
  width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 14px; outline: none;
}

.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #6366f1; }
.form-textarea { resize: vertical; font-family: inherit; line-height: 1.5; }

.ticket-priority { margin-bottom: 20px; }
.priority-btns { display: flex; gap: 8px; flex-wrap: wrap; }

.priority-btn {
  padding: 7px 16px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
  background: rgba(255,255,255,0.05); color: #94a3b8; font-size: 13px; font-weight: 600; cursor: pointer;
}

.priority-btn.active { color: #fff; }
.priority-btn.priority-baixa.active { background: rgba(16,185,129,0.2); border-color: #10b981; }
.priority-btn.priority-normal.active { background: rgba(99,102,241,0.2); border-color: #6366f1; }
.priority-btn.priority-alta.active { background: rgba(245,158,11,0.2); border-color: #f59e0b; }
.priority-btn.priority-urgente.active { background: rgba(239,68,68,0.2); border-color: #ef4444; }

.success-box {
  display: flex; align-items: flex-start; gap: 12px;
  background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16,185,129,0.3);
  color: #34d399; padding: 14px 16px; border-radius: 12px; margin-bottom: 16px;
}

.success-box i { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.success-box strong { display: block; font-size: 14px; margin-bottom: 2px; }
.success-box p { font-size: 13px; margin: 0; color: #6ee7b7; }

.ticket-actions { display: flex; gap: 10px; justify-content: flex-end; }

.btn-cancel {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  color: #e2e8f0; padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 13.5px; cursor: pointer;
}

.btn-submit-ticket {
  background: #6366f1; border: none; color: #fff; padding: 10px 22px;
  border-radius: 10px; font-weight: 700; font-size: 13.5px; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
}

.btn-submit-ticket:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
