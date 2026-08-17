<template>
  <header class="header-topbar">
    <div class="header-search">
      <i class="bi bi-search"></i>
      <input
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Buscar páginas, pastas ou templates..."
      />
    </div>

    <div class="header-actions">
      <button class="btn-tour tour-guided-launch" @click="$emit('start-tour')" title="Iniciar tour guiado">
        <i class="bi bi-compass"></i><span>Tour guiado</span>
      </button>
      <button class="btn-icon-top notification-trigger" @click="$emit('notify')" title="Notificações">
        <i class="bi bi-bell"></i>
        <span v-if="unreadCount" class="notification-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
      </button>
      <button class="btn-icon-top" @click="$emit('open-auth')" title="Sair">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  searchQuery: String,
  unreadCount: { type: Number, default: 0 }
});

defineEmits(['update:searchQuery', 'open-builder', 'notify', 'open-auth', 'start-tour']);
</script>

<style scoped>
.header-topbar {
  height: 64px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  flex-shrink: 0;
}

.header-search {
  position: relative;
  width: 360px;
}

.header-search i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-soft);
}

.header-search input {
  width: 100%;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 9px 14px 9px 38px;
  color: var(--color-text);
  font-size: 13.5px;
  outline: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-tour {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 13px;
  border-radius: 10px;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
  color: var(--color-primary-strong);
  font: inherit;
  font-size: 12.5px;
  font-weight: 800;
  cursor: pointer;
}

.btn-tour:hover { background: var(--color-primary-soft); }

.btn-create-blank {
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  padding: 9px 20px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: none;
}

.btn-icon-top {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.notification-trigger { position: relative; }
.notification-badge { position:absolute; top:-5px; right:-5px; min-width:18px; height:18px; padding:0 4px; border-radius:999px; display:flex; align-items:center; justify-content:center; background:var(--color-primary); color:var(--color-on-primary); border:2px solid var(--color-surface); font-size:9px; font-weight:900; }

@media (max-width: 700px) {
  .header-topbar { height: 56px; padding: 0 12px; gap: 10px; }
  .header-search { flex: 1; width: auto; }
  .header-search input { font-size: 12px; }
  .header-actions { gap: 6px; }
  .btn-tour { width: 36px; height: 36px; padding: 0; justify-content: center; }
  .btn-tour span { display: none; }
  .btn-create-blank { width: 36px; height: 36px; padding: 0; justify-content: center; font-size: 0; }
  .btn-create-blank i { font-size: 17px; }
  .btn-icon-top { width: 36px; height: 36px; }
  .btn-icon-top:last-child { display: none; }
}
</style>
