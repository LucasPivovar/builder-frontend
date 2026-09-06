<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <AstroMark class="brand-icon" />
      <span class="brand-name">Astro Builder</span>
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
        <span>Páginas</span>
        <span class="badge-count">{{ pagesCount }}</span>
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

      <!-- Label de Categoria: SISTEMA -->
      <div class="menu-group-title" style="margin-top: 18px;">
        <span>SISTEMA</span>
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
        <span>Tickets</span>
      </a>
    </nav>

    <div class="sidebar-logout">
      <button class="btn-logout" type="button" @click="$emit('logout')">
        <i class="bi bi-box-arrow-right"></i><span>Sair</span>
      </button>
    </div>
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
import AstroMark from '../AstroMark.vue';

defineEmits(['select-tab', 'logout']);

const props = defineProps({
  activeTab: String,
  pagesCount: Number,
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
.sidebar-logout { padding: 12px 16px; }
.sidebar-logout .btn-logout { width: 100%; justify-content: flex-start !important; }
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
  --mark-width: 46px;
  --mark-height: 33px;
}

.brand-name {
  font-size: 17px;
  font-weight: 800;
  font-family: var(--font-display);
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
