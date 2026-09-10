<template>
  <section class="settings-view-container">
    <header><div><h1>Meu perfil</h1><p>Atualize seus dados e o acesso à sua conta.</p></div><button class="btn-save-settings" :disabled="saving" @click="save">{{ saving ? 'Salvando…' : 'Salvar alterações' }}</button></header>
    <p v-if="message" role="status">{{ message }}</p>
    <div class="profile-grid">
      <section class="profile-card personal-card"><div class="card-heading"><span><i class="bi bi-person-fill"></i></span><div><h2>Dados pessoais</h2><p>Informações usadas no seu perfil e no acesso.</p></div></div>
        <label>Nome<input v-model.trim="form.name" autocomplete="name" maxlength="120" /></label>
        <label>WhatsApp<input :value="form.phone" type="tel" autocomplete="tel" placeholder="+55 (41) 99999-9999" maxlength="19" @input="form.phone = formatPhone($event.target.value)" /></label>
        <div class="account-field"><label>E-mail<input :value="user.email" disabled /></label><button class="field-action" type="button" @click="changeEmail = !changeEmail">{{ changeEmail ? 'Cancelar' : 'Alterar e-mail' }}</button></div>
        <label v-if="changeEmail">Novo e-mail<input v-model.trim="form.email" type="email" autocomplete="email" /></label>
        <div class="password-row"><div><strong>Senha</strong><small>Atualize sua senha de acesso com segurança.</small></div><button class="field-action" type="button" @click="changePassword = !changePassword">{{ changePassword ? 'Cancelar' : 'Alterar senha' }}</button></div>
        <template v-if="changePassword"><label>Nova senha<input v-model="form.newPassword" type="password" autocomplete="new-password" maxlength="72" /></label><small>8 ou mais caracteres, com maiúscula, minúscula e número.</small><label>Confirmar nova senha<input v-model="confirmPassword" type="password" autocomplete="new-password" /></label></template>
        <label v-if="changeEmail || changePassword">Senha atual<input v-model="form.currentPassword" type="password" autocomplete="current-password" /></label>
      </section>
      <aside class="profile-card security-card"><div class="card-heading"><span><i class="bi bi-shield-check"></i></span><div><h2>Conta e segurança</h2><p>Resumo da proteção do seu acesso.</p></div></div>
        <div class="status-line"><span :class="['status-icon',{success:user.emailVerified}]"><i :class="user.emailVerified?'bi bi-check-lg':'bi bi-envelope-exclamation'"></i></span><div><strong>{{ user.emailVerified?'E-mail confirmado':'Confirme seu e-mail' }}</strong><small>{{ user.email || 'Não informado' }}</small></div><button v-if="!user.emailVerified" class="verify-send" :disabled="verificationBusy" @click="sendVerification">Enviar código</button></div>
        <form v-if="!user.emailVerified" class="verification-form" @submit.prevent="verifyEmail"><input v-model.trim="verificationToken" required minlength="32" placeholder="Código recebido por e-mail"><button :disabled="verificationBusy">Confirmar</button></form>
        <div class="status-line"><span class="status-icon"><i class="bi bi-key-fill"></i></span><div><strong>Senha protegida</strong><small>Sua senha é armazenada de forma segura.</small></div></div>
        <div class="status-line"><span class="status-icon"><i class="bi bi-laptop"></i></span><div><strong>Sessão atual</strong><small>Você está conectado neste dispositivo.</small></div></div>
        <div class="account-summary"><span>Tipo de conta</span><strong>{{ user.role === 'admin' ? 'Administrador' : 'Usuário' }}</strong></div>
        <div class="sessions-heading"><strong>Dispositivos conectados</strong><button v-if="sessions.length > 1" :disabled="sessionBusy" @click="revokeOthers">Sair dos demais</button></div>
        <div class="sessions-list">
          <div v-for="session in sessions" :key="session.id" class="session-row"><i class="bi bi-display"></i><div><strong>{{ session.current ? 'Este dispositivo' : deviceLabel(session.userAgent) }}</strong><small>{{ formatDate(session.updatedAt) }}<template v-if="session.ipAddress"> · {{ session.ipAddress }}</template></small></div><button v-if="!session.current" :disabled="sessionBusy" aria-label="Revogar sessão" @click="removeSession(session.id)"><i class="bi bi-x-lg"></i></button></div>
        </div>
      </aside>
    </div>
    <section class="profile-card privacy-card"><div><h2>Privacidade e dados</h2><p>Baixe uma cópia completa ou exclua permanentemente a conta.</p></div><div class="privacy-actions"><button type="button" class="btn-export-data" @click="downloadData"><i class="bi bi-download"></i> Exportar meus dados</button><input v-model="deletePassword" type="password" autocomplete="current-password" placeholder="Senha atual para excluir"><button class="danger" :disabled="!deletePassword||deleting" @click="deleteAccount">{{ deleting?'Excluindo…':'Excluir conta' }}</button></div></section>
  </section>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';
import { clearAuthSession, confirmEmailVerification, deleteOwnAccount, exportPersonalData, getStoredUser, getProfile, getSessions, requestEmailVerification, revokeOtherSessions, revokeSession, updateProfile } from '../../services/api';
const user = ref(getStoredUser() || {});
const form = reactive({ name: user.value.name || '', phone: user.value.phone || '', email: '', newPassword: '', currentPassword: '' });
const changeEmail = ref(false), changePassword = ref(false), confirmPassword = ref(''), saving = ref(false), message = ref('');
const sessions = ref([]), sessionBusy = ref(false);
const deletePassword=ref(''),deleting=ref(false);
const verificationToken=ref(sessionStorage.getItem('vbs_verification_token')||''),verificationBusy=ref(false);
onMounted(async () => { try { [user.value,sessions.value] = await Promise.all([getProfile(),getSessions()]); form.name = user.value.name; form.phone = user.value.phone || ''; } catch (error) { message.value = error.message; } });
async function save() {
  message.value = '';
  if (changePassword.value && (!form.newPassword || form.newPassword !== confirmPassword.value)) { message.value = 'Confira a nova senha e sua confirmação.'; return; }
  if (changeEmail.value && !form.email) { message.value = 'Informe o novo e-mail.'; return; }
  saving.value = true;
  try {
    user.value = await updateProfile({ name: form.name, phone: form.phone, ...(changeEmail.value ? { email: form.email } : {}), ...(changePassword.value ? { newPassword: form.newPassword } : {}), ...((changeEmail.value || changePassword.value) ? { currentPassword: form.currentPassword } : {}) });
    changeEmail.value = false; changePassword.value = false; form.newPassword = ''; form.currentPassword = ''; confirmPassword.value = ''; message.value = 'Perfil atualizado.';
  } catch (error) { message.value = error.message; } finally { saving.value = false; }
}
async function removeSession(id){ sessionBusy.value=true; try { await revokeSession(id); sessions.value=sessions.value.filter(item=>item.id!==id); } catch(error){ message.value=error.message; } finally { sessionBusy.value=false; } }
async function revokeOthers(){ sessionBusy.value=true; try { await revokeOtherSessions(); sessions.value=sessions.value.filter(item=>item.current); message.value='As outras sessões foram encerradas.'; } catch(error){ message.value=error.message; } finally { sessionBusy.value=false; } }
function deviceLabel(agent){ const value=String(agent||''); if(/mobile|android|iphone/i.test(value))return 'Dispositivo móvel'; if(/windows/i.test(value))return 'Computador Windows'; if(/macintosh|mac os/i.test(value))return 'Computador Mac'; if(/linux/i.test(value))return 'Computador Linux'; return 'Outro dispositivo'; }
function formatDate(value){ return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(value)); }
async function downloadData(){try{const data=await exportPersonalData();const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=`astro-builder-dados-${new Date().toISOString().slice(0,10)}.json`;link.click();URL.revokeObjectURL(url);}catch(error){message.value=error.message;}}
async function deleteAccount(){if(!window.confirm('Excluir permanentemente conta, projetos, publicações, leads e arquivos? Esta ação não pode ser desfeita.'))return;deleting.value=true;try{await deleteOwnAccount(deletePassword.value);clearAuthSession();window.location.assign('/');}catch(error){message.value=error.message;}finally{deleting.value=false;}}
async function sendVerification(){verificationBusy.value=true;try{const result=await requestEmailVerification(user.value.email);if(result.verificationToken)verificationToken.value=result.verificationToken;message.value=result.message;}catch(error){message.value=error.message;}finally{verificationBusy.value=false;}}
async function verifyEmail(){verificationBusy.value=true;try{await confirmEmailVerification(verificationToken.value);user.value=await getProfile();sessionStorage.removeItem('vbs_verification_token');message.value='E-mail confirmado com sucesso.';}catch(error){message.value=error.message;}finally{verificationBusy.value=false;}}
function formatPhone(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 13);
  const local = digits.startsWith('55') ? digits.slice(2) : digits;
  const area = local.slice(0, 2), first = local.length > 10 ? local.slice(2, 7) : local.slice(2, 6), last = local.length > 10 ? local.slice(7, 11) : local.slice(6, 10);
  return `${digits ? '+55 ' : ''}${area ? `(${area}${area.length === 2 ? ') ' : ''}` : ''}${first}${last ? `-${last}` : ''}`;
}
</script>
<style scoped>
.settings-view-container{width:100%;min-width:0}
header{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}
h1{font-size:26px;margin:0}
p,small{color:var(--color-text-secondary)}
.btn-save-settings{min-height:40px;padding:9px 20px;border-radius:10px;font-size:13.5px;font-weight:700;background:var(--color-primary);color:#fff;border:0;cursor:pointer;transition:all .15s ease}
.btn-save-settings:hover:not(:disabled){background:var(--color-primary-hover)}
.profile-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(310px,1fr);gap:24px}
.profile-card{padding:24px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:16px}
.card-heading{display:flex;align-items:center;gap:12px;margin-bottom:20px}
.card-heading>span{width:40px;height:40px;display:grid;place-items:center;border-radius:11px;background:var(--color-primary-soft);color:var(--color-primary-strong)}
h2{font-size:18px;margin:0}
.card-heading p{margin:3px 0 0;font-size:12px}
label{display:flex;flex-direction:column;gap:8px;margin:18px 0;font-size:13px;font-weight:600}
input{box-sizing:border-box;width:100%;min-height:42px;padding:10px 14px;border:1px solid var(--color-border);border-radius:10px;font-family:var(--font-ui)!important;font-size:13.5px;color:var(--color-text);background:var(--color-surface-soft);transition:border-color .15s, box-shadow .15s}
input::placeholder{font-family:var(--font-ui)!important;font-size:13px;color:var(--color-text-muted);opacity:1}
input:focus-visible{outline:none;border-color:var(--color-primary);box-shadow:0 0 0 3px var(--color-focus-ring)}
.account-field{display:flex;flex-direction:column;gap:6px;margin:18px 0}
.account-field label{margin:0}
.field-action{align-self:flex-start;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:36px;padding:7px 15px;border-radius:9px;background:var(--color-primary-soft);border:1px solid var(--color-border-strong);color:var(--color-primary-strong);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .15s ease}
.field-action:hover{background:var(--color-primary);color:#fff;border-color:var(--color-primary)}
.password-row{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:22px;padding-top:20px;border-top:1px solid var(--color-border)}
.password-row div{display:flex;flex-direction:column;gap:4px}
.password-row strong,.status-line strong{font-size:13.5px;color:var(--color-text)}
.password-row small,.status-line small{font-size:11.5px}
.security-card{align-self:start}
.status-line{display:grid;grid-template-columns:38px 1fr auto;gap:11px;align-items:center;padding:15px 0;border-bottom:1px solid var(--color-border)}
.status-line>div{display:flex;flex-direction:column;gap:3px}
.status-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;background:#edf6ff;color:#2563eb}
.status-icon.success{background:#dcfce7;color:#166534}
.verify-send{border:0;background:transparent;color:var(--color-primary);font:inherit;font-size:10px;font-weight:900;cursor:pointer}
.verification-form{display:flex;gap:6px;margin:10px 0}
.verification-form input{min-width:0;min-height:36px;padding:8px 10px;font-size:11px}
.verification-form button{border:0;border-radius:8px;background:var(--color-primary);color:#fff;font-size:10px;font-weight:900;padding:0 12px;cursor:pointer}
.account-summary{display:flex;justify-content:space-between;gap:12px;margin-top:18px;padding:13px 15px;border-radius:10px;background:var(--color-surface-soft);font-size:12.5px}
.account-summary span{color:var(--color-text-muted)}
.sessions-heading{display:flex;align-items:center;justify-content:space-between;margin-top:20px;padding-top:18px;border-top:1px solid var(--color-border);font-size:12.5px}
.sessions-heading button{border:0;background:transparent;color:var(--color-primary-strong);font:inherit;font-size:11px;font-weight:800;cursor:pointer;padding:4px 6px;border-radius:6px}
.sessions-heading button:hover{background:var(--color-primary-soft)}
.sessions-list{max-height:280px;overflow-y:auto;padding-right:6px;display:flex;flex-direction:column;scrollbar-width:thin;scrollbar-color:var(--color-border) transparent}
.sessions-list::-webkit-scrollbar{width:5px}
.sessions-list::-webkit-scrollbar-track{background:transparent}
.sessions-list::-webkit-scrollbar-thumb{background:var(--color-border);border-radius:4px}
.session-row{display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:8px;padding:11px 0;border-bottom:1px solid var(--color-border)}
.session-row:last-child{border-bottom:0}
.session-row>i{color:var(--color-primary);font-size:15px}
.session-row>div{display:flex;min-width:0;flex-direction:column;gap:2px}
.session-row strong{font-size:11.5px}
.session-row small{overflow:hidden;font-size:10px;text-overflow:ellipsis;white-space:nowrap}
.session-row>button{width:26px;height:26px;border:0;border-radius:7px;background:var(--color-surface-soft);color:var(--color-text-muted);cursor:pointer;display:grid;place-items:center;transition:all .15s}
.session-row>button:hover{background:var(--color-danger-soft);color:var(--color-danger-strong)}
.privacy-card{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:20px}
.privacy-card h2{font-size:16px}
.privacy-card p{margin:4px 0;font-size:12px}
.privacy-actions{display:flex;align-items:center;gap:10px}
.privacy-actions input{width:230px;min-height:40px;padding:9px 12px;font-family:var(--font-ui)!important;font-size:13px}
.privacy-actions input::placeholder{font-family:var(--font-ui)!important;font-size:12.5px;color:var(--color-text-muted);opacity:1}
.privacy-actions button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;padding:9px 16px;border:1px solid var(--color-border-strong);border-radius:10px;background:var(--color-primary-soft);color:var(--color-primary-strong);font:inherit;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .15s ease}
.privacy-actions button:hover:not(:disabled){background:var(--color-primary);color:#fff;border-color:var(--color-primary)}
.privacy-actions .danger{border-color:#fca5a5;background:var(--color-danger-soft);color:var(--color-danger-strong)}
.privacy-actions .danger:hover:not(:disabled){background:#dc2626;color:#fff;border-color:#dc2626}
.privacy-actions button:disabled{opacity:.45;cursor:not-allowed}
@media(max-width:860px){.profile-grid{grid-template-columns:1fr}.privacy-card,.privacy-actions{align-items:stretch;flex-direction:column}.privacy-actions input{width:100%}}
@media(max-width:760px){header{align-items:flex-start;flex-direction:column}.password-row{align-items:flex-start;flex-direction:column}}
</style>
