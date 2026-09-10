<template>
  <section class="email-panel">
    <header><div><span>E-MAIL</span><h1>Contatos e campanhas</h1><p>Gerencie consentimento, escolha um template salvo e acompanhe as entregas.</p></div></header>
    <p v-if="message" class="email-message" role="status">{{ message }}</p>
    <div class="email-grid">
      <section class="email-card"><h2>Novo contato</h2><form @submit.prevent="addContact"><label>Nome<input v-model.trim="contact.name" maxlength="160"></label><label>E-mail<input v-model.trim="contact.email" type="email" required></label><label>Origem do consentimento<input v-model.trim="contact.consentSource" required placeholder="Ex.: formulário da página"></label><small>Cadastre somente endereços que autorizaram o recebimento.</small><button type="submit" class="btn-action-contact" :disabled="busy"><i class="bi bi-person-plus"></i> Adicionar contato</button></form></section>
      <section class="email-card"><h2>Nova campanha</h2><form @submit.prevent="addCampaign"><label>Nome interno<input v-model.trim="campaign.name" required></label><label>Assunto<input v-model.trim="campaign.subject" required></label><label>Remetente<input v-model.trim="campaign.fromName" required></label><label>Template salvo<select v-model="campaign.pageId" required><option value="">Selecione</option><option v-for="page in emailPages" :key="page.id" :value="page.id">{{ page.name }}</option></select></label><button type="submit" class="btn-action-campaign" :disabled="busy||!emailPages.length"><i class="bi bi-send"></i> Criar campanha</button></form></section>
    </div>
    <section class="email-card list-card"><header><div><h2>Campanhas</h2><small>{{ campaigns.length }} cadastradas</small></div><button @click="load">Atualizar</button></header><div v-if="!campaigns.length" class="empty">Nenhuma campanha criada.</div><article v-for="item in campaigns" :key="item.id" class="campaign-row"><div><strong>{{ item.name }}</strong><small>{{ item.subject }}</small></div><span>{{ item.recipients }} destinatários</span><span>{{ item.sent }} enviadas · {{ item.opened }} abertas</span><em :class="item.status">{{ statusLabel(item.status) }}</em><button :disabled="busy||item.status==='sending'" @click="send(item)">{{ item.status==='draft'?'Enviar':'Processar fila' }}</button></article></section>
    <section class="email-card list-card"><header><div><h2>Contatos</h2><small>{{ contacts.total }} cadastrados</small></div><div class="contact-filter"><input v-model.trim="query" placeholder="Buscar" @keyup.enter="loadContacts"><select v-model="filter" @change="loadContacts"><option value="all">Todos</option><option value="subscribed">Inscritos</option><option value="unsubscribed">Descadastrados</option><option value="bounced">Bounce</option></select></div></header><div v-if="!contacts.items.length" class="empty">Nenhum contato neste filtro.</div><article v-for="item in contacts.items" :key="item.id" class="contact-row"><div><strong>{{ item.name||'Sem nome' }}</strong><small>{{ item.email }}</small></div><span>{{ item.consentSource }}</span><em :class="item.status">{{ contactStatus(item.status) }}</em><button v-if="item.status!=='bounced'" @click="toggleContact(item)">{{ item.status==='subscribed'?'Descadastrar':'Reinscrever' }}</button><button class="danger" aria-label="Excluir contato" @click="removeContact(item)"><i class="bi bi-trash3"></i></button></article></section>
  </section>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { createEmailCampaign, createEmailContact, deleteEmailContact, getEmailCampaigns, getEmailContacts, prepareEmailTracking, sendEmailCampaign, updateEmailContact } from '../../services/api';
import { useBuilderStore } from '../../composables/useBuilderStore';
import { generateFullHTML } from '../../utils/htmlExporter';
const { pagesRegistry }=useBuilderStore();
const emailPages=computed(()=>pagesRegistry.filter(page=>page.type==='email'||page.builderMode==='email'));
const contact=reactive({name:'',email:'',consentSource:''});const campaign=reactive({name:'',subject:'',fromName:'',pageId:''});const contacts=ref({items:[],total:0}),campaigns=ref([]),query=ref(''),filter=ref('all'),busy=ref(false),message=ref('');
onMounted(load);
async function load(){busy.value=true;message.value='';try{await Promise.all([loadContacts(),loadCampaigns()]);}catch(e){message.value=e.message;}finally{busy.value=false;}}
async function loadContacts(){contacts.value=await getEmailContacts(1,query.value,filter.value);}
async function loadCampaigns(){campaigns.value=await getEmailCampaigns();}
async function addContact(){busy.value=true;try{await createEmailContact(contact);Object.assign(contact,{name:'',email:'',consentSource:''});await loadContacts();message.value='Contato cadastrado com consentimento.';}catch(e){message.value=e.message;}finally{busy.value=false;}}
async function addCampaign(){const page=emailPages.value.find(item=>item.id===campaign.pageId);if(!page)return;busy.value=true;try{const raw=generateFullHTML(page);const tracked=await prepareEmailTracking({pageId:page.id,html:raw});await createEmailCampaign({...campaign,html:tracked.html});Object.assign(campaign,{name:'',subject:'',pageId:''});await loadCampaigns();message.value='Campanha criada como rascunho.';}catch(e){message.value=e.message;}finally{busy.value=false;}}
async function send(item){if(!window.confirm(`Processar a campanha “${item.name}” para os contatos inscritos?`))return;busy.value=true;try{const result=await sendEmailCampaign(item.id);await loadCampaigns();message.value=result.message||'Campanha processada pelo provedor configurado.';}catch(e){message.value=e.message;}finally{busy.value=false;}}
async function toggleContact(item){busy.value=true;try{await updateEmailContact(item.id,{status:item.status==='subscribed'?'unsubscribed':'subscribed'});await loadContacts();}catch(e){message.value=e.message;}finally{busy.value=false;}}
async function removeContact(item){if(!window.confirm(`Excluir ${item.email}?`))return;busy.value=true;try{await deleteEmailContact(item.id);await loadContacts();}catch(e){message.value=e.message;}finally{busy.value=false;}}
function statusLabel(value){return({draft:'Rascunho',queued:'Na fila',sending:'Enviando',sent:'Enviada',failed:'Falhou'}[value]||value)}function contactStatus(value){return({subscribed:'Inscrito',unsubscribed:'Descadastrado',bounced:'Bounce'}[value]||value)}
</script>
<style scoped>
.email-panel{width:100%}
.email-panel>header span{color:var(--color-primary-strong);font-size:10px;font-weight:900;letter-spacing:.12em}
.email-panel h1{margin:5px 0;font-size:27px}
.email-panel>header p{margin:0 0 22px;color:var(--color-text-muted)}
.email-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.email-card{padding:22px;border:1px solid var(--color-border);border-radius:16px;background:var(--color-surface)}
.email-card h2{margin:0;font-size:17px;font-weight:800}
.email-card form{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
.email-card label{display:flex;flex-direction:column;gap:6px;color:var(--color-text-secondary);font-size:12px;font-weight:700}
.email-card input,.email-card select{box-sizing:border-box;min-height:40px;padding:9px 12px;border:1px solid var(--color-border);border-radius:9px;background:var(--color-surface-soft);color:var(--color-text);font:inherit;font-size:13px;outline:none;transition:border-color .15s, box-shadow .15s}
.email-card input:focus,.email-card select:focus{border-color:var(--color-primary);box-shadow:0 0 0 3px var(--color-focus-ring)}
.email-card form small{grid-column:1/-1;color:var(--color-text-muted);font-size:11.5px;margin-top:-2px}

.btn-action-contact, .btn-action-campaign{
  grid-column:1/-1;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  min-height:42px;
  padding:10px 20px;
  border-radius:10px;
  font-family:inherit;
  font-size:13.5px;
  font-weight:700;
  cursor:pointer;
  transition:all .18s ease;
  margin-top:4px;
}
.btn-action-contact{
  background:var(--color-primary-soft);
  border:1px solid var(--color-border-strong);
  color:var(--color-primary-strong);
}
.btn-action-contact:hover:not(:disabled){
  background:var(--color-primary);
  color:#fff;
  border-color:var(--color-primary);
}
.btn-action-campaign{
  background:var(--color-primary);
  border:1px solid var(--color-primary);
  color:#fff;
}
.btn-action-campaign:hover:not(:disabled){
  background:var(--color-primary-hover);
  border-color:var(--color-primary-hover);
}
.btn-action-contact:disabled, .btn-action-campaign:disabled{
  opacity:.45;
  cursor:not-allowed;
}

.email-message{padding:12px 16px;border-radius:10px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:12.5px;font-weight:600;margin-bottom:18px}
.list-card{margin-top:20px}
.list-card>header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.list-card>header>div{display:flex;flex-direction:column}
.list-card>header button{min-height:34px;padding:6px 14px;border-radius:8px;border:1px solid var(--color-border-strong);background:var(--color-primary-soft);color:var(--color-primary-strong);font:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.list-card>header button:hover{background:var(--color-primary);color:#fff}
.campaign-row,.contact-row{display:grid;grid-template-columns:minmax(170px,1.4fr) 120px 170px 85px auto;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--color-border)}
.campaign-row>div,.contact-row>div{display:flex;min-width:0;flex-direction:column}
.campaign-row strong,.contact-row strong{font-size:12.5px}
.campaign-row small,.contact-row small,.campaign-row span,.contact-row span{overflow:hidden;color:var(--color-text-muted);font-size:10.5px;text-overflow:ellipsis}
.campaign-row em,.contact-row em{width:max-content;padding:3px 8px;border-radius:999px;background:#fef3c7;color:#92400e;font-style:normal;font-size:9.5px;font-weight:800}
.campaign-row em.sent,.contact-row em.subscribed{background:#dcfce7;color:#166534}
.contact-row em.bounced,.campaign-row em.failed{background:#fee2e2;color:#991b1b}
.campaign-row button, .contact-row button{min-height:34px;padding:6px 14px;border-radius:8px;border:1px solid var(--color-border-strong);background:var(--color-primary-soft);color:var(--color-primary-strong);font:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.campaign-row button:hover:not(:disabled), .contact-row button:hover:not(:disabled){background:var(--color-primary);color:#fff}
.contact-row{grid-template-columns:minmax(180px,1.5fr) 1fr 90px auto 34px}
.contact-row button.danger{padding:0;width:34px;height:34px;display:grid;place-items:center;background:var(--color-danger-soft);color:var(--color-danger-strong);border-color:#fca5a5}
.contact-row button.danger:hover{background:#dc2626;color:#fff;border-color:#dc2626}
.contact-filter{display:flex!important;flex-direction:row!important;gap:8px}
.contact-filter input{padding:7px 11px;min-height:34px;font-size:12px}
.contact-filter select{padding:7px 11px;min-height:34px;font-size:12px}
.empty{padding:34px;text-align:center;color:var(--color-text-muted);font-size:12.5px}
@media(max-width:900px){.email-grid{grid-template-columns:1fr}.campaign-row,.contact-row{grid-template-columns:1fr 1fr}.campaign-row>div,.contact-row>div{grid-column:1/-1}}
</style>
