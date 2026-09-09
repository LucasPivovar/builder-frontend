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
        <p v-if="error" class="support-error">{{ error }}</p>
        <button class="btn-submit-ticket" type="submit" :disabled="saving"><i class="bi bi-send-fill"></i> {{ saving ? 'Enviando…' : 'Abrir ticket' }}</button>
      </form>

      <section class="ticket-card">
        <h3>Histórico</h3>
        <div v-if="loading" class="empty-ticket"><span class="support-spinner"></span><strong>Carregando tickets…</strong></div>
        <div v-else-if="tickets.length === 0" class="empty-ticket">
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
            <div v-if="ticket.messages?.length" class="support-thread"><div v-for="(entry,index) in ticket.messages" :key="index" :class="['support-reply',entry.author]"><strong><i :class="entry.author === 'admin' ? 'bi bi-headset' : 'bi bi-person'"></i> {{ entry.author === 'admin' ? 'Suporte' : 'Você' }}</strong><p>{{ entry.message }}</p><small>{{ formatDate(entry.createdAt) }}</small></div></div>
            <div v-else-if="ticket.adminReply" class="support-reply admin"><strong><i class="bi bi-headset"></i> Resposta do suporte</strong><p>{{ ticket.adminReply }}</p><small>{{ formatDate(ticket.repliedAt) }}</small></div>
            <div v-if="ticket.attachments?.length" class="support-attachments"><button v-for="attachment in ticket.attachments" :key="attachment.id" type="button" @click="download(ticket,attachment)"><i class="bi bi-paperclip"></i><span>{{ attachment.name }}</span><small>{{ fileSize(attachment.size) }}</small></button></div>
            <form class="ticket-reply-form" @submit.prevent="sendMessage(ticket)"><input v-model="ticketReplies[ticket.id]" minlength="2" maxlength="5000" required placeholder="Adicionar mensagem ao ticket" /><button type="submit" :disabled="replying === ticket.id"><i class="bi bi-send"></i></button></form>
            <label class="attachment-action"><i class="bi bi-paperclip"></i>{{ attaching === ticket.id ? 'Enviando…' : 'Anexar imagem ou PDF' }}<input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" :disabled="attaching === ticket.id" @change="attach(ticket,$event)" /></label>
            <div class="ticket-meta">
              <span><i class="bi bi-tag"></i> {{ ticket.category }}</span>
              <span><i class="bi bi-clock"></i> {{ formatDate(ticket.createdAt) }}</span>
              <span :class="['ticket-status', ticket.status]">{{ ticket.status === 'resolved' ? 'Resolvido' : 'Aberto' }}</span>
              <button v-if="ticket.status !== 'resolved'" type="button" @click="closeTicket(ticket.id)"><i class="bi bi-check2"></i> Resolver</button>
            </div>
          </article>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { addSupportTicketMessage, createSupportTicket, downloadSupportAttachment, getSupportTickets, resolveSupportTicket, uploadSupportAttachment } from '../../services/api';

const tickets = ref([]);
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const ticketReplies = reactive({});
const replying = ref('');
const attaching = ref('');
const draft = reactive({ subject: '', category: 'Publicação / DNS', priority: 'Normal', pageUrl: '', message: '' });

function formatDate(value) {
  return new Date(value).toLocaleString('pt-BR');
}

async function loadTickets() {
  loading.value = true;
  error.value = '';
  try { tickets.value = await getSupportTickets(); }
  catch (requestError) { error.value = requestError.message; }
  finally { loading.value = false; }
}

async function submitTicket() {
  saving.value = true;
  error.value = '';
  try {
    const ticket = await createSupportTicket({
    subject: draft.subject.trim(),
    category: draft.category,
    priority: draft.priority,
    pageUrl: draft.pageUrl.trim(),
      message: draft.message.trim()
    });
    tickets.value.unshift(ticket);
    draft.subject = '';
    draft.pageUrl = '';
    draft.message = '';
    draft.priority = 'Normal';
  } catch (requestError) { error.value = requestError.message; }
  finally { saving.value = false; }
}

async function closeTicket(id) {
  error.value = '';
  try {
    const updated = await resolveSupportTicket(id);
    const index = tickets.value.findIndex(ticket => ticket.id === id);
    if (index >= 0) tickets.value[index] = updated;
  } catch (requestError) { error.value = requestError.message; }
}

async function sendMessage(ticket) {
  const message = String(ticketReplies[ticket.id] || '').trim();
  if (!message) return;
  replying.value = ticket.id; error.value = '';
  try {
    const updated = await addSupportTicketMessage(ticket.id, message);
    const index = tickets.value.findIndex(item => item.id === ticket.id);
    if (index >= 0) tickets.value[index] = updated;
    ticketReplies[ticket.id] = '';
  } catch (requestError) { error.value = requestError.message; }
  finally { replying.value = ''; }
}

async function attach(ticket,event){ const file=event.target.files?.[0]; event.target.value=''; if(!file)return; attaching.value=ticket.id; error.value=''; try { const updated=await uploadSupportAttachment(ticket.id,file); const index=tickets.value.findIndex(item=>item.id===ticket.id); if(index>=0)tickets.value[index]=updated; } catch(requestError){ error.value=requestError.message; } finally { attaching.value=''; } }
async function download(ticket,attachment){ try { await downloadSupportAttachment(ticket.id,attachment); } catch(requestError){ error.value=requestError.message; } }
function fileSize(bytes){ return bytes>=1000000?`${(bytes/1000000).toFixed(1)} MB`:`${Math.ceil(bytes/1000)} KB`; }

onMounted(loadTickets);
</script>

<style scoped>
.support-panel{width:100%;min-width:0;display:flex;flex-direction:column;gap:22px}.support-header{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%}.support-header h2{display:flex;align-items:center;gap:10px;margin:0;color:var(--color-text);font-size:24px;font-weight:900}.support-header p{margin:6px 0 0;color:var(--color-text-muted);font-size:14px}.support-header>span{padding:6px 12px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:12px;font-weight:900}.ticket-layout{display:grid;grid-template-columns:minmax(360px,460px) minmax(0,1fr);gap:24px;width:100%}.ticket-card{padding:24px;border:1px solid var(--color-border);border-radius:18px;background:var(--color-surface);box-shadow:var(--shadow-sm)}.ticket-card h3{margin:0 0 16px;color:var(--color-text);font-size:16px;font-weight:800}.ticket-form{display:flex;flex-direction:column;gap:12px}.ticket-form label{display:flex;flex-direction:column;gap:6px;color:var(--color-text-secondary);font-size:12px;font-weight:800}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ticket-form input,.ticket-form select,.ticket-form textarea{width:100%;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface-soft);color:var(--color-text);padding:10px 12px;font:inherit;font-size:13px;outline:0}.ticket-form textarea{resize:vertical;line-height:1.45}.ticket-form input:focus,.ticket-form select:focus,.ticket-form textarea:focus{border-color:var(--color-primary);box-shadow:0 0 0 3px var(--color-focus-ring)}.btn-submit-ticket{height:40px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:10px;background:var(--color-primary);color:#fff;font:inherit;font-size:13px;font-weight:900;cursor:pointer}.empty-ticket{min-height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:var(--color-text-muted);text-align:center}.empty-ticket i{font-size:32px;color:var(--color-primary)}.empty-ticket strong{color:var(--color-text)}.ticket-list{display:flex;flex-direction:column;gap:10px;max-height:560px;overflow:auto}.ticket-item{padding:14px;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface-soft)}.ticket-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.ticket-top strong{min-width:0;overflow:hidden;color:var(--color-text);font-size:14px;text-overflow:ellipsis;white-space:nowrap}.priority{padding:3px 8px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:10px;font-weight:900}.priority.alta{background:#fef3c7;color:#92400e}.priority.urgente{background:var(--color-danger-soft);color:var(--color-danger-strong)}.ticket-item p{margin:9px 0 12px;color:var(--color-text-muted);font-size:12px;line-height:1.5}.ticket-meta{display:flex;align-items:center;flex-wrap:wrap;gap:9px;color:var(--color-text-muted);font-size:11px}.ticket-meta button{margin-left:auto;display:inline-flex;align-items:center;gap:5px;border:1px solid var(--color-border);border-radius:8px;background:var(--color-surface);color:var(--color-primary-strong);padding:6px 9px;font:inherit;font-size:11px;font-weight:900;cursor:pointer}@media(max-width:960px){.ticket-layout{grid-template-columns:1fr}.support-header{align-items:flex-start;flex-direction:column}.form-row{grid-template-columns:1fr}}
.support-error{margin:0;color:var(--color-danger-strong);font-size:11px}.btn-submit-ticket:disabled{cursor:not-allowed;opacity:.6}.ticket-status{padding:3px 7px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:9px;font-weight:900}.ticket-status.resolved{background:#dcfce7;color:#166534}.support-spinner{width:24px;height:24px;border:3px solid var(--color-primary-soft);border-top-color:var(--color-primary);border-radius:50%;animation:support-spin .7s linear infinite}@keyframes support-spin{to{transform:rotate(360deg)}}
.support-reply{margin:10px 0;padding:11px;border:1px solid var(--color-primary-border);border-radius:10px;background:var(--color-primary-subtle)}.support-reply strong{display:block;color:var(--color-primary-strong);font-size:11px}.support-reply p{margin:6px 0;color:var(--color-text-secondary);white-space:pre-wrap}.support-reply small{color:var(--color-text-muted);font-size:9px}
.support-thread{display:flex;flex-direction:column;gap:7px;margin:10px 0}.support-thread .support-reply{margin:0}.support-reply.user{margin-left:24px;background:var(--color-surface);border-color:var(--color-border)}.ticket-reply-form{display:flex;gap:6px;margin-top:10px}.ticket-reply-form input{min-width:0;flex:1;padding:8px 10px;border:1px solid var(--color-border);border-radius:8px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:11px}.ticket-reply-form button{margin:0;width:34px;display:grid;place-items:center}
.support-attachments{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.support-attachments button{display:flex;align-items:center;gap:5px;max-width:100%;padding:6px 8px;border:1px solid var(--color-border);border-radius:8px;background:var(--color-surface);color:var(--color-text-secondary);font:inherit;font-size:10px;cursor:pointer}.support-attachments button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.support-attachments button small{font-size:8px}.attachment-action{width:max-content;display:inline-flex!important;align-items:center;gap:5px;margin:8px 0 0!important;color:var(--color-primary-strong)!important;font-size:10px!important;cursor:pointer}.attachment-action input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
</style>
