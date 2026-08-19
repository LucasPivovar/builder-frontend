<template>
  <div class="settings-view-container">
    <header class="page-header-title">
      <div class="title-group">
        <h1><i class="bi bi-gear-fill"></i> Configurações da Conta</h1>
        <p>Gerencie sua sessão e informações de perfil.</p>
      </div>
    </header>

    <section class="settings-card-panel">
      <div class="profile-header-card">
        <div class="avatar-big">{{ initials }}</div>
        <div>
          <h2>{{ user.name || 'Usuário' }} {{ user.lastName || '' }}</h2>
          <p>{{ user.email || 'Sessão ativa' }}</p>
        </div>
      </div>
      <div class="info-grid">
        <article>
          <i class="bi bi-shield-check"></i>
          <div>
            <strong>Sessão protegida</strong>
            <p>O acesso usa autenticação segura com token JWT.</p>
          </div>
        </article>
        <article>
          <i class="bi bi-database-check"></i>
          <div>
            <strong>Dados persistentes</strong>
            <p>Seus funis, quizzes, e-mails e backups ficam salvos na sua conta.</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getStoredUser } from '../../services/api';

const user = getStoredUser() || {};
const initials = computed(() => {
  const name = user.name || user.email || 'U';
  return String(name).split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
});
</script>

<style scoped>
.settings-view-container {
  max-width: 860px;
  margin: 0 auto;
}

.page-header-title {
  margin-bottom: 24px;
}

.page-header-title h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 24px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-header-title p {
  margin: 6px 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.settings-card-panel {
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.profile-header-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 22px;
  margin-bottom: 22px;
  border-bottom: 1px solid var(--color-border);
}

.avatar-big {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: var(--gradient-aurora);
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 4px 14px rgba(97, 43, 244, 0.28);
}

.profile-header-card h2 {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
}

.profile-header-card p {
  margin: 4px 0 0;
  color: var(--color-text-muted);
  font-size: 13px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.info-grid article {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-primary-subtle);
}

.info-grid article > i {
  color: var(--color-primary);
  font-size: 22px;
}

.info-grid strong {
  display: block;
  font-size: 13.5px;
  color: var(--color-text);
}

.info-grid p {
  margin: 4px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 620px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  .settings-card-panel {
    padding: 20px;
  }
}
</style>
