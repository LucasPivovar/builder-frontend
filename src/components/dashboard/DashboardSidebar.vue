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
        :class="{ active: activeTab === 'templates-funil' }"
        @click="$emit('select-tab', 'templates-funil')"
      >
        <i class="bi bi-grid-1x2-fill"></i>
        <span>Templates de Funil</span>
        <span class="badge-count">{{ templatesCount }}</span>
      </a>

      <a
        class="menu-item"
        :class="{ active: activeTab === 'templates-email' }"
        @click="$emit('select-tab', 'templates-email')"
      >
        <i class="bi bi-envelope-paper-fill"></i>
        <span>Templates de E-mail</span>
        <span class="badge-count empty-badge">0</span>
      </a>

      <!-- Label de Categoria: CONTA & SISTEMA -->
      <div class="menu-group-title" style="margin-top: 18px;">
        <span>CONTA & SISTEMA</span>
      </div>

      <a
        class="menu-item admin-item"
        :class="{ active: activeTab === 'admin' }"
        @click="$emit('select-tab', 'admin')"
      >
        <i class="bi bi-shield-lock-fill" style="color: #ef4444;"></i>
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
      <div class="user-avatar">L</div>
      <div class="user-details">
        <span class="user-name">Lucas Wallysson</span>
        <span class="user-plan">Plano Pro Performance</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  activeTab: String,
  pagesCount: Number,
  funilPagesCount: Number,
  foldersCount: Number,
  templatesCount: Number
});

defineEmits(['select-tab']);
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: #0f1523;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #6366f1 0%, #38bdf8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
}

.brand-name {
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
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
  color: #94a3b8;
  margin: 18px 12px 6px 12px;
  text-transform: uppercase;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  color: #94a3b8;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.menu-item.active {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.menu-item.admin-item.active {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.admin-badge-sm {
  margin-left: auto;
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-count {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
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
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name { font-size: 13.5px; font-weight: 700; }
.user-plan { font-size: 11.5px; color: #38bdf8; }
</style>
