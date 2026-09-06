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
        <div class="status-line"><span class="status-icon success"><i class="bi bi-check-lg"></i></span><div><strong>E-mail vinculado</strong><small>{{ user.email || 'Não informado' }}</small></div></div>
        <div class="status-line"><span class="status-icon"><i class="bi bi-key-fill"></i></span><div><strong>Senha protegida</strong><small>Sua senha é armazenada de forma segura.</small></div></div>
        <div class="status-line"><span class="status-icon"><i class="bi bi-laptop"></i></span><div><strong>Sessão atual</strong><small>Você está conectado neste dispositivo.</small></div></div>
        <div class="account-summary"><span>Tipo de conta</span><strong>{{ user.role === 'admin' ? 'Administrador' : 'Usuário' }}</strong></div>
      </aside>
    </div>
  </section>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';
import { getStoredUser, getProfile, updateProfile } from '../../services/api';
const user = ref(getStoredUser() || {});
const form = reactive({ name: user.value.name || '', phone: user.value.phone || '', email: '', newPassword: '', currentPassword: '' });
const changeEmail = ref(false), changePassword = ref(false), confirmPassword = ref(''), saving = ref(false), message = ref('');
onMounted(async () => { try { user.value = await getProfile(); form.name = user.value.name; form.phone = user.value.phone || ''; } catch (error) { message.value = error.message; } });
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
function formatPhone(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 13);
  const local = digits.startsWith('55') ? digits.slice(2) : digits;
  const area = local.slice(0, 2), first = local.length > 10 ? local.slice(2, 7) : local.slice(2, 6), last = local.length > 10 ? local.slice(7, 11) : local.slice(6, 10);
  return `${digits ? '+55 ' : ''}${area ? `(${area}${area.length === 2 ? ') ' : ''}` : ''}${first}${last ? `-${last}` : ''}`;
}
</script>
<style scoped>
.settings-view-container{width:100%;min-width:0}header{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}h1{font-size:26px;margin:0}p,small{color:var(--color-text-secondary)}.profile-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(290px,1fr);gap:24px}.profile-card{padding:24px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:16px}.card-heading{display:flex;align-items:center;gap:12px;margin-bottom:20px}.card-heading>span{width:40px;height:40px;display:grid;place-items:center;border-radius:11px;background:var(--color-primary-soft);color:var(--color-primary-strong)}h2{font-size:18px;margin:0}.card-heading p{margin:3px 0 0;font-size:12px}label{display:flex;flex-direction:column;gap:8px;margin:18px 0;font-size:13px;font-weight:600}input{box-sizing:border-box;width:100%;min-height:42px;padding:10px 12px;border:1px solid var(--color-border);border-radius:9px;font:inherit;color:var(--color-text);background:var(--color-surface-soft)}input:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.account-field{position:relative}.account-field label{margin-bottom:8px}.field-action{min-height:34px!important;padding:6px 11px!important;margin:0!important}.password-row{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:22px;padding-top:20px;border-top:1px solid var(--color-border)}.password-row div{display:flex;flex-direction:column;gap:4px}.password-row strong,.status-line strong{font-size:13px;color:var(--color-text)}.password-row small,.status-line small{font-size:11px}.security-card{align-self:start}.status-line{display:grid;grid-template-columns:38px 1fr;gap:11px;align-items:center;padding:15px 0;border-bottom:1px solid var(--color-border)}.status-line>div{display:flex;flex-direction:column;gap:3px}.status-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;background:#edf6ff;color:#2563eb}.status-icon.success{background:#dcfce7;color:#166534}.account-summary{display:flex;justify-content:space-between;gap:12px;margin-top:18px;padding:13px;border-radius:10px;background:var(--color-surface-soft);font-size:12px}.account-summary span{color:var(--color-text-muted)}@media(max-width:860px){.profile-grid{grid-template-columns:1fr}}@media(max-width:760px){header{align-items:flex-start;flex-direction:column}.password-row{align-items:flex-start;flex-direction:column}}
</style>
