<template>
  <div class="settings-view-container">
    <header class="page-header-title">
      <div class="title-group">
        <h1><i class="bi bi-gear-fill"></i> Configurações</h1>
        <p>Confira sua sessão e as configurações disponíveis no ambiente local.</p>
      </div>
    </header>

    <nav class="settings-tabs" aria-label="Seções das configurações">
      <button :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'"><i class="bi bi-person-fill"></i> Conta</button>
      <button :class="{ active: activeTab === 'editor' }" @click="activeTab = 'editor'"><i class="bi bi-sliders"></i> Editor</button>
      <button :class="{ active: activeTab === 'tracking' }" @click="activeTab = 'tracking'"><i class="bi bi-graph-up-arrow"></i> Rastreamento</button>
    </nav>

    <section v-if="activeTab === 'account'" class="settings-card-panel">
      <div class="profile-header-card">
        <div class="avatar-big">{{ initials }}</div>
        <div><h2>{{ user.name || 'Usuário local' }}</h2><p>{{ user.email || 'Sessão local' }}</p></div>
      </div>
      <div class="info-grid">
        <article><i class="bi bi-shield-check"></i><div><strong>Sessão protegida</strong><p>O acesso usa autenticação JWT no backend local.</p></div></article>
        <article><i class="bi bi-database-check"></i><div><strong>Dados persistentes</strong><p>Páginas, pastas e backups ficam salvos no banco local.</p></div></article>
      </div>
      <p class="notice"><i class="bi bi-info-circle"></i> A edição de perfil e a troca de senha ainda não estão disponíveis nesta versão.</p>
    </section>

    <section v-else-if="activeTab === 'editor'" class="settings-card-panel">
      <h2>Configurações do editor</h2>
      <p class="section-description">Cada projeto mantém suas próprias definições de largura, cores, tipografia e comportamento.</p>
      <div class="info-grid">
        <article><i class="bi bi-window-fullscreen"></i><div><strong>Largura automática</strong><p>Funil usa largura total, e-mail usa 600px e quiz usa 460px.</p></div></article>
        <article><i class="bi bi-palette"></i><div><strong>Tema da página</strong><p>Abra o Builder e use “Seções” → “Configurações gerais”.</p></div></article>
      </div>
    </section>

    <section v-else class="settings-card-panel">
      <h2>Pixel e GTM por página</h2>
      <p class="section-description">O rastreamento é configurado individualmente para evitar que uma campanha use códigos de outra.</p>
      <div class="tracking-guide">
        <span>1</span><p>Abra a página no Builder.</p>
        <span>2</span><p>Entre na aba “Seções”.</p>
        <span>3</span><p>Abra “Configurações gerais” e informe o Meta Pixel ou o GTM.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { getStoredUser } from '../../services/api';

const activeTab = ref('account');
const user = getStoredUser() || {};
const initials = computed(() => String(user.name || user.email || 'U').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase());
</script>

<style scoped>
.settings-view-container{max-width:860px;margin:0 auto}.page-header-title{margin-bottom:20px}.page-header-title h1{margin:0;color:var(--color-text);font-size:24px}.page-header-title p,.section-description{margin:5px 0 0;color:var(--color-text-muted);font-size:13px}.settings-tabs{display:flex;gap:8px;margin-bottom:16px;padding:5px;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface)}.settings-tabs button{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px;border:0;border-radius:9px;background:transparent;color:var(--color-text-secondary);font:inherit;font-size:12px;font-weight:800;cursor:pointer}.settings-tabs button.active{background:var(--color-primary);color:var(--color-on-primary)}.settings-card-panel{padding:24px;border:1px solid var(--color-border);border-radius:17px;background:var(--color-surface);box-shadow:var(--shadow-sm)}.settings-card-panel h2{margin:0;color:var(--color-text);font-size:18px}.profile-header-card{display:flex;align-items:center;gap:13px;padding-bottom:18px;margin-bottom:18px;border-bottom:1px solid var(--color-border)}.avatar-big{width:52px;height:52px;display:grid;place-items:center;border-radius:14px;background:var(--color-primary);color:var(--color-on-primary);font-weight:900}.profile-header-card h2{font-size:16px}.profile-header-card p{margin:3px 0 0;color:var(--color-text-muted);font-size:11px}.info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:18px}.info-grid article{display:flex;gap:11px;padding:15px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-primary-subtle)}.info-grid article>i{color:var(--color-primary);font-size:19px}.info-grid strong{font-size:12px}.info-grid p{margin:4px 0 0;color:var(--color-text-muted);font-size:10px;line-height:1.5}.notice{display:flex;gap:8px;margin:16px 0 0;padding:11px;border-radius:10px;background:var(--color-surface-soft);color:var(--color-text-secondary);font-size:11px}.tracking-guide{display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:center;margin-top:20px}.tracking-guide span{width:28px;height:28px;display:grid;place-items:center;border-radius:8px;background:var(--color-primary);color:var(--color-on-primary);font-size:11px;font-weight:900}.tracking-guide p{margin:0;color:var(--color-text-secondary);font-size:12px}@media(max-width:620px){.settings-tabs{flex-direction:column}.info-grid{grid-template-columns:1fr}.settings-card-panel{padding:18px}}
</style>
