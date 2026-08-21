<template>
  <div class="settings-view-container">
    <header class="page-header-title">
      <div class="title-group">
        <h1><i class="bi bi-gear-fill"></i> Configurações da Conta</h1>
        <p>Perfil, segurança e preferências do painel.</p>
      </div>
      <button class="btn-save-settings" type="button" @click="saveSettings">
        <i class="bi bi-check2-circle"></i> Salvar
      </button>
    </header>

    <section class="settings-card-panel">
      <div class="profile-header-card">
        <div class="avatar-big">{{ initials }}</div>
        <div>
          <h2>{{ account.name || user.name || 'Usuário' }}</h2>
          <p>{{ user.email || 'Sessão ativa' }}</p>
        </div>
      </div>

      <div v-if="saved" class="save-feedback">
        <i class="bi bi-check-circle-fill"></i>
        Preferências salvas neste navegador.
      </div>

      <div class="settings-grid">
        <section class="settings-block">
          <h3><i class="bi bi-person-badge"></i> Perfil</h3>
          <label>Nome de exibição<input v-model="account.name" type="text" placeholder="Seu nome" /></label>
          <label>Empresa<input v-model="account.company" type="text" placeholder="Nome da empresa" /></label>
          <label>Telefone / WhatsApp<input v-model="account.phone" type="text" placeholder="+55..." /></label>
        </section>

        <section class="settings-block">
          <h3><i class="bi bi-sliders"></i> Preferências</h3>
          <label>Idioma do painel<select v-model="account.language"><option value="pt-BR">Português Brasil</option><option value="en-US">English</option><option value="es">Español</option></select></label>
          <label>Fuso horário<select v-model="account.timezone"><option value="America/Sao_Paulo">America/Sao_Paulo</option><option value="America/New_York">America/New_York</option><option value="Europe/Lisbon">Europe/Lisbon</option></select></label>
          <label>Página inicial<select v-model="account.startPage"><option value="home">Página Inicial</option><option value="todas-paginas">Páginas</option><option value="pastas">Pastas</option><option value="support">Tickets</option></select></label>
        </section>

        <section class="settings-block">
          <h3><i class="bi bi-shield-lock"></i> Segurança</h3>
          <label class="toggle-row"><span><strong>Confirmar antes de publicar</strong><small>Evita publicar páginas por engano.</small></span><input v-model="account.confirmBeforePublish" type="checkbox" /></label>
          <label class="toggle-row"><span><strong>Alertar DNS pendente</strong><small>Mostra aviso quando domínio ainda não foi validado.</small></span><input v-model="account.warnPendingDns" type="checkbox" /></label>
          <label class="toggle-row"><span><strong>Modo compacto</strong><small>Reduz espaçamentos no dashboard.</small></span><input v-model="account.compactMode" type="checkbox" /></label>
        </section>

        <section class="settings-block">
          <h3><i class="bi bi-database-check"></i> Conta</h3>
          <div class="info-list">
            <span><strong>E-mail</strong><small>{{ user.email || 'Não informado' }}</small></span>
            <span><strong>Perfil</strong><small>{{ user.role || 'user' }}</small></span>
            <span><strong>Sessão</strong><small>JWT ativo no navegador</small></span>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { getStoredUser } from '../../services/api';

const SETTINGS_KEY = 'vbs_account_settings_v1';
const user = getStoredUser() || {};
const saved = ref(false);

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); }
  catch { return {}; }
}

const account = reactive({
  name: user.name || '',
  company: '',
  phone: '',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  startPage: 'home',
  confirmBeforePublish: true,
  warnPendingDns: true,
  compactMode: false,
  ...loadSettings()
});

const initials = computed(() => {
  const name = account.name || user.name || user.email || 'U';
  return String(name).split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
});

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...account }));
  saved.value = true;
  setTimeout(() => { saved.value = false; }, 2600);
}
</script>

<style scoped>
.settings-view-container{max-width:1040px;margin:0 auto}.page-header-title{margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:16px}.page-header-title h1{margin:0;color:var(--color-text);font-size:24px;font-weight:800;display:flex;align-items:center;gap:10px}.page-header-title p{margin:6px 0 0;color:var(--color-text-muted);font-size:14px}.btn-save-settings{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:10px;padding:10px 14px;background:var(--color-primary);color:#fff;font:inherit;font-size:13px;font-weight:800;cursor:pointer}.settings-card-panel{padding:28px;border:1px solid var(--color-border);border-radius:18px;background:var(--color-surface);box-shadow:var(--shadow-sm)}.profile-header-card{display:flex;align-items:center;gap:16px;padding-bottom:22px;margin-bottom:18px;border-bottom:1px solid var(--color-border)}.avatar-big{width:56px;height:56px;display:grid;place-items:center;border-radius:14px;background:var(--gradient-aurora);color:#fff;font-size:18px;font-weight:900;box-shadow:0 4px 14px rgba(97,43,244,.28)}.profile-header-card h2{font-size:18px;font-weight:800;color:var(--color-text);margin:0}.profile-header-card p{margin:4px 0 0;color:var(--color-text-muted);font-size:13px}.save-feedback{display:flex;align-items:center;gap:8px;margin-bottom:18px;padding:11px 13px;border:1px solid rgba(16,185,129,.25);border-radius:11px;background:rgba(16,185,129,.1);color:#059669;font-size:13px;font-weight:800}.settings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.settings-block{padding:18px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface-soft)}.settings-block h3{display:flex;align-items:center;gap:8px;margin:0 0 14px;color:var(--color-text);font-size:15px}.settings-block label{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;color:var(--color-text-secondary);font-size:12px;font-weight:800}.settings-block input,.settings-block select{width:100%;min-height:38px;border:1px solid var(--color-border);border-radius:9px;background:var(--color-surface);color:var(--color-text);padding:0 11px;font:inherit;font-size:13px;outline:0}.settings-block input:focus,.settings-block select:focus{border-color:var(--color-primary);box-shadow:0 0 0 3px var(--color-focus-ring)}.toggle-row{flex-direction:row!important;align-items:center;justify-content:space-between;gap:14px}.toggle-row span{display:flex;flex-direction:column;gap:3px}.toggle-row strong{font-size:13px;color:var(--color-text)}.toggle-row small,.info-list small{color:var(--color-text-muted);font-size:11px;font-weight:600}.toggle-row input{width:18px;height:18px;min-height:18px;accent-color:var(--color-primary)}.info-list{display:flex;flex-direction:column;gap:10px}.info-list span{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--color-border)}.info-list span:last-child{border-bottom:0}.info-list strong{color:var(--color-text);font-size:13px}@media(max-width:760px){.page-header-title{align-items:flex-start;flex-direction:column}.settings-grid{grid-template-columns:1fr}.settings-card-panel{padding:20px}}
</style>
