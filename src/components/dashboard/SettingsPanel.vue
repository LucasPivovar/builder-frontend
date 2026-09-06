<template>
  <section class="settings-view-container">
    <header><div><h1>Meu perfil</h1><p>Atualize seus dados e o acesso à sua conta.</p></div><button class="btn-save-settings" :disabled="saving" @click="save">{{ saving ? 'Salvando…' : 'Salvar alterações' }}</button></header>
    <p v-if="message" role="status">{{ message }}</p>
    <div class="profile-grid">
      <section class="profile-card"><h2>Dados pessoais</h2>
        <label>Nome<input v-model.trim="form.name" autocomplete="name" maxlength="120" /></label>
        <label>WhatsApp<input v-model="form.phone" type="tel" autocomplete="tel" placeholder="+55 (41) 99999-9999" maxlength="20" /></label>
        <label>E-mail atual<input :value="user.email" disabled /></label>
      </section>
      <section class="profile-card"><h2>Acesso à conta</h2>
        <button class="btn-secondary" @click="changeEmail = !changeEmail">Alterar e-mail</button>
        <label v-if="changeEmail">Novo e-mail<input v-model.trim="form.email" type="email" autocomplete="email" /></label>
        <button class="btn-secondary" @click="changePassword = !changePassword">Alterar senha</button>
        <template v-if="changePassword"><label>Nova senha<input v-model="form.newPassword" type="password" autocomplete="new-password" maxlength="72" /></label><small>8 ou mais caracteres, com maiúscula, minúscula e número.</small><label>Confirmar nova senha<input v-model="confirmPassword" type="password" autocomplete="new-password" /></label></template>
        <label v-if="changeEmail || changePassword">Senha atual<input v-model="form.currentPassword" type="password" autocomplete="current-password" /></label>
      </section>
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
</script>
<style scoped>
.settings-view-container{width:100%;min-width:0}header{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}h1{font-size:26px;margin:0}p,small{color:var(--color-text-secondary)}.profile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.profile-card{padding:24px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:14px}h2{font-size:18px;margin:0 0 24px}label{display:flex;flex-direction:column;gap:8px;margin:18px 0;font-size:13px;font-weight:600}input{box-sizing:border-box;width:100%;min-height:42px;padding:10px 12px;border:1px solid var(--color-border);border-radius:9px;font:inherit;color:var(--color-text);background:var(--color-surface-soft)}input:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}button{margin:0 10px 12px 0}@media(max-width:760px){.profile-grid{grid-template-columns:1fr}header{align-items:flex-start;flex-direction:column}}
</style>
