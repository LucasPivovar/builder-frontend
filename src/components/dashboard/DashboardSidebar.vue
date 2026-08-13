<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-icon"><i class="bi bi-diagram-3-fill"></i></div>
      <span class="brand-name">Funil & Builder</span>
    </div>

    <nav class="sidebar-menu">
      <!-- Página Inicial -->
      <a
        class="menu-item"
        :class="{ active: activeTab === 'home' }"
        @click="$emit('select-tab', 'home')"
      >
        <i class="bi bi-house-door-fill"></i>
        <span>Página Inicial</span>
      </a>

      <!-- Label de Categoria: PÁGINAS -->
      <div class="menu-group-title">
        <span>PÁGINAS</span>
      </div>
      
      <a
        class="menu-item"
        :class="{ active: activeTab === 'todas-paginas' }"
        @click="$emit('select-tab', 'todas-paginas')"
      >
        <i class="bi bi-collection-fill"></i>
        <span>Todas as Páginas</span>
        <span class="badge-count">{{ pagesCount }}</span>
      </a>

      <a
        class="menu-item"
        :class="{ active: activeTab === 'funil' }"
        @click="$emit('select-tab', 'funil')"
      >
        <i class="bi bi-funnel-fill"></i>
        <span>Funil</span>
        <span class="badge-count">{{ funilPagesCount }}</span>
      </a>

      <a
        class="menu-item"
        :class="{ active: activeTab === 'email-pages' }"
        @click="$emit('select-tab', 'email-pages')"
      >
        <i class="bi bi-envelope-paper-fill"></i>
        <span>E-mails</span>
        <span class="badge-count">{{ emailPagesCount }}</span>
      </a>
      <a class="menu-item" :class="{ active: activeTab === 'quiz-pages' }" @click="$emit('select-tab', 'quiz-pages')">
        <i class="bi bi-ui-checks-grid"></i><span>Quizzes</span><span class="badge-count">{{ quizPagesCount }}</span>
      </a>

      <!-- Label de Categoria: ORGANIZAÇÃO -->
      <div class="menu-group-title" style="margin-top: 18px;">
        <span>ORGANIZAÇÃO</span>
      </div>

      <a
        class="menu-item"
        :class="{ active: activeTab === 'pastas' }"
        @click="$emit('select-tab', 'pastas')"
      >
        <i class="bi bi-folder-fill"></i>
        <span>Pastas</span>
        <span class="badge-count">{{ foldersCount }}</span>
      </a>

      <!-- Label de Categoria: TEMPLATES -->
      <div class="menu-group-title" style="margin-top: 18px;">
        <span>TEMPLATES</span>
      </div>

      <a
        class="menu-item"
        :class="{ active: activeTab === 'templates' }"
        @click="$emit('select-tab', 'templates')"
      >
        <i class="bi bi-collection-fill"></i>
        <span>Todos os Templates</span>
        <span class="badge-count">{{ funilTemplatesCount + emailTemplatesCount + quizTemplatesCount }}</span>
      </a>

      <a
        class="menu-item"
        :class="{ active: activeTab === 'templates-funil' }"
        @click="$emit('select-tab', 'templates-funil')"
      >
        <i class="bi bi-grid-1x2-fill"></i>
        <span>Templates de Funil</span>
        <span class="badge-count">{{ funilTemplatesCount }}</span>
      </a>

      <a
        class="menu-item"
        :class="{ active: activeTab === 'templates-email' }"
        @click="$emit('select-tab', 'templates-email')"
      >
        <i class="bi bi-envelope-paper-fill"></i>
        <span>Templates de E-mail</span>
        <span class="badge-count">{{ emailTemplatesCount }}</span>
      </a>
      <a class="menu-item" :class="{ active: activeTab === 'templates-quiz' }" @click="$emit('select-tab', 'templates-quiz')">
        <i class="bi bi-ui-checks-grid"></i><span>Templates de Quiz</span><span class="badge-count">{{ quizTemplatesCount }}</span>
      </a>

      <!-- Label de Categoria: CONTA & SISTEMA -->
      <div class="menu-group-title" style="margin-top: 18px;">
        <span>CONTA & SISTEMA</span>
      </div>

      <a
        v-if="currentUser?.role === 'admin'"
        class="menu-item admin-item"
        :class="{ active: activeTab === 'admin' }"
        @click="$emit('select-tab', 'admin')"
      >
        <i class="bi bi-shield-lock-fill"></i>
        <span>Painel Admin</span>
        <span class="admin-badge-sm">ADMIN</span>
      </a>

      <a
        class="menu-item"
        :class="{ active: activeTab === 'settings' }"
        @click="$emit('select-tab', 'settings')"
      >
        <i class="bi bi-gear-fill"></i>
        <span>Configurações</span>
      </a>

      <a
        class="menu-item"
        :class="{ active: activeTab === 'support' }"
        @click="$emit('select-tab', 'support')"
      >
        <i class="bi bi-headset"></i>
        <span>Suporte</span>
      </a>
    </nav>

    <div class="sidebar-user" @click="$emit('select-tab', 'settings')" style="cursor: pointer;">
      <div class="user-avatar">{{ userInitial }}</div>
      <div class="user-details">
        <span class="user-name">{{ currentUser?.name || 'Seu espaço' }}</span>
        <span class="user-plan">{{ currentUser?.email || 'Plano local' }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';

defineEmits(['select-tab']);

const props = defineProps({
  activeTab: String,
  pagesCount: Number,
  funilPagesCount: Number,
  emailPagesCount: Number,
  quizPagesCount: Number,
  foldersCount: Number,
  templatesCount: Number,
  funilTemplatesCount: { type: Number, default: 1 },
  emailTemplatesCount: { type: Number, default: 1 },
  quizTemplatesCount: { type: Number, default: 1 },
  currentUser: { type: Object, default: null }
});

const userInitial = computed(() => {
  const name = props.currentUser?.name || props.currentUser?.email || 'S';
  return name.trim().charAt(0).toUpperCase();
});
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  user-select: none;
}

.sidebar-brand {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
}

.brand-icon {
  width: 38px;
  height: 38px;
  background: var(--color-primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-surface);
  font-size: 20px;
}

.brand-name {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text);
}

.sidebar-menu {
  padding: 16px 14px;
  flex: 1;
  overflow-y: auto;
}

.menu-group-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: var(--color-text-muted);
  margin: 18px 12px 6px 12px;
  text-transform: uppercase;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  color: var(--color-text-muted);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: var(--color-primary-subtle);
  color: var(--color-text);
}

.menu-item.active {
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  border: 1px solid var(--color-border-strong);
}

.menu-item.admin-item.active {
  background: var(--color-danger-soft);
  color: var(--color-danger-strong);
  border: 1px solid var(--color-danger-border);
}

.admin-badge-sm {
  margin-left: auto;
  background: var(--color-danger-soft);
  color: var(--color-danger-strong);
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-count {
  margin-left: auto;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}

.badge-count.empty-badge {
  opacity: 0.5;
}

.sidebar-user {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--color-surface);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name { font-size: 13.5px; font-weight: 700; color:var(--color-text); }
.user-plan { font-size: 11.5px; color: var(--color-primary-bright); }

@media (max-width: 760px) {
  .sidebar { width: 100%; height: 56px; flex-direction: row; border-right: 0; border-bottom: 1px solid var(--color-border); overflow: hidden; }
  .sidebar-brand, .sidebar-user, .menu-group-title, .menu-item span:not(.badge-count) { display: none; }
  .sidebar-menu { display: flex; align-items: center; justify-content: space-between; gap: 5px; padding: 7px 10px; overflow: hidden; }
  .menu-item { flex: 0 0 38px; justify-content: center; padding: 9px; margin: 0; }
  .menu-item:nth-of-type(6), .menu-item:nth-of-type(7), .menu-item:nth-of-type(9), .menu-item .badge-count { display: none; }
}
</style>
