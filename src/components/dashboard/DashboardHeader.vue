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
      <button class="btn-create-blank" @click="$emit('open-builder')">
        <i class="bi bi-plus-lg"></i> Criar em Branco
      </button>
      <button class="btn-icon-top" @click="$emit('notify')" title="Notificações">
        <i class="bi bi-bell"></i>
      </button>
      <button class="btn-icon-top" @click="$emit('open-auth')" title="Sair">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  searchQuery: String
});

defineEmits(['update:searchQuery', 'open-builder', 'notify', 'open-auth']);
</script>

<style scoped>
.header-topbar {
  height: 64px;
  background: #0f1523;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
  color: #94a3b8;
}

.header-search input {
  width: 100%;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 9px 14px 9px 38px;
  color: #fff;
  font-size: 13.5px;
  outline: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-create-blank {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  border: none;
  padding: 9px 20px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.btn-icon-top {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
