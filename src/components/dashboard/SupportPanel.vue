<template>
  <div class="support-panel">
    <div class="support-header">
      <div>
        <h2><i class="bi bi-life-preserver"></i> Tickets de suporte</h2>
        <p>Abra chamados e acompanhe o histórico neste painel.</p>
      </div>
      <span>{{ tickets.length }} {{ tickets.length === 1 ? 'ticket' : 'tickets' }}</span>
    </div>

    <section class="ticket-layout">
      <form class="ticket-card ticket-form" @submit.prevent="submitTicket">
        <h3>Novo ticket</h3>
        <label>Assunto<input v-model="draft.subject" required type="text" placeholder="Ex.: DNS não validou" /></label>
        <div class="form-row">
          <label>Categoria<select v-model="draft.category"><option>Publicação / DNS</option><option>Conta</option><option>Pagamento</option><option>Bug no builder</option><option>Dúvida geral</option></select></label>
          <label>Prioridade<select v-model="draft.priority"><option>Normal</option><option>Alta</option><option>Urgente</option></select></label>
        </div>
        <label>Página relacionada<input v-model="draft.pageUrl" type="text" placeholder="URL ou nome da página" /></label>
        <label>Mensagem<textarea v-model="draft.message" required rows="5" placeholder="Descreva o que aconteceu e o que você esperava."></textarea></label>
        <button class="btn-submit-ticket" type="submit"><i class="bi bi-send-fill"></i> Abrir ticket</button>
      </form>

      <section class="ticket-card">
        <h3>Histórico</h3>
        <div v-if="tickets.length === 0" class="empty-ticket">
          <i class="bi bi-inbox"></i>
          <strong>Nenhum ticket aberto</strong>
          <span>Quando criar um chamado, ele aparece aqui.</span>
        </div>
        <div v-else class="ticket-list">
          <article v-for="ticket in tickets" :key="ticket.id" class="ticket-item">
            <div class="ticket-top">
              <strong>{{ ticket.subject }}</strong>
              <span :class="['priority', ticket.priority.toLowerCase()]">{{ ticket.priority }}</span>
            </div>
            <p>{{ ticket.message }}</p>
            <div class="ticket-meta">
              <span><i class="bi bi-tag"></i> {{ ticket.category }}</span>
              <span><i class="bi bi-clock"></i> {{ ticket.createdAt }}</span>
              <button type="button" @click="closeTicket(ticket.id)"><i class="bi bi-check2"></i> Resolver</button>
            </div>
          </article>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const TICKETS_KEY = 'vbs_support_tickets_v1';

function loadTickets() {
  try { return JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]'); }
  catch { return []; }
}

const tickets = ref(loadTickets());
const draft = reactive({ subject: '', category: 'Publicação / DNS', priority: 'Normal', pageUrl: '', message: '' });

function persistTickets() {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets.value));
}

function submitTicket() {
  tickets.value.unshift({
    id: `ticket-${Date.now()}`,
    subject: draft.subject.trim(),
    category: draft.category,
    priority: draft.priority,
    pageUrl: draft.pageUrl.trim(),
    message: draft.message.trim(),
    createdAt: new Date().toLocaleString('pt-BR')
  });
  persistTickets();
  draft.subject = '';
  draft.pageUrl = '';
  draft.message = '';
  draft.priority = 'Normal';
}

function closeTicket(id) {
  tickets.value = tickets.value.filter(ticket => ticket.id !== id);
  persistTickets();
}
</script>

<style scoped>
.support-panel{width:100%;min-width:0;display:flex;flex-direction:column;gap:22px}.support-header{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%}.support-header h2{display:flex;align-items:center;gap:10px;margin:0;color:var(--color-text);font-size:24px;font-weight:900}.support-header p{margin:6px 0 0;color:var(--color-text-muted);font-size:14px}.support-header>span{padding:6px 12px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:12px;font-weight:900}.ticket-layout{display:grid;grid-template-columns:minmax(360px,460px) minmax(0,1fr);gap:24px;width:100%}.ticket-card{padding:24px;border:1px solid var(--color-border);border-radius:18px;background:var(--color-surface);box-shadow:var(--shadow-sm)}.ticket-card h3{margin:0 0 16px;color:var(--color-text);font-size:16px;font-weight:800}.ticket-form{display:flex;flex-direction:column;gap:12px}.ticket-form label{display:flex;flex-direction:column;gap:6px;color:var(--color-text-secondary);font-size:12px;font-weight:800}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ticket-form input,.ticket-form select,.ticket-form textarea{width:100%;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface-soft);color:var(--color-text);padding:10px 12px;font:inherit;font-size:13px;outline:0}.ticket-form textarea{resize:vertical;line-height:1.45}.ticket-form input:focus,.ticket-form select:focus,.ticket-form textarea:focus{border-color:var(--color-primary);box-shadow:0 0 0 3px var(--color-focus-ring)}.btn-submit-ticket{height:40px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:10px;background:var(--color-primary);color:#fff;font:inherit;font-size:13px;font-weight:900;cursor:pointer}.empty-ticket{min-height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:var(--color-text-muted);text-align:center}.empty-ticket i{font-size:32px;color:var(--color-primary)}.empty-ticket strong{color:var(--color-text)}.ticket-list{display:flex;flex-direction:column;gap:10px;max-height:560px;overflow:auto}.ticket-item{padding:14px;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface-soft)}.ticket-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.ticket-top strong{min-width:0;overflow:hidden;color:var(--color-text);font-size:14px;text-overflow:ellipsis;white-space:nowrap}.priority{padding:3px 8px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:10px;font-weight:900}.priority.alta{background:#fef3c7;color:#92400e}.priority.urgente{background:var(--color-danger-soft);color:var(--color-danger-strong)}.ticket-item p{margin:9px 0 12px;color:var(--color-text-muted);font-size:12px;line-height:1.5}.ticket-meta{display:flex;align-items:center;flex-wrap:wrap;gap:9px;color:var(--color-text-muted);font-size:11px}.ticket-meta button{margin-left:auto;display:inline-flex;align-items:center;gap:5px;border:1px solid var(--color-border);border-radius:8px;background:var(--color-surface);color:var(--color-primary-strong);padding:6px 9px;font:inherit;font-size:11px;font-weight:900;cursor:pointer}@media(max-width:960px){.ticket-layout{grid-template-columns:1fr}.support-header{align-items:flex-start;flex-direction:column}.form-row{grid-template-columns:1fr}}
</style>
