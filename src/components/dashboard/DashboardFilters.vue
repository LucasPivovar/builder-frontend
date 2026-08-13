<template>
  <div class="filters-bar">
    <div class="filter-pills">
      <button
        class="pill-btn"
        :class="{ active: filterPill === 'tudo' }"
        @click="$emit('update:filterPill', 'tudo')"
      >Tudo</button>
      <button
        class="pill-btn"
        :class="{ active: filterPill === 'ultimas-paginas' }"
        @click="$emit('update:filterPill', 'ultimas-paginas')"
      >Últimas Páginas</button>
      <button
        class="pill-btn"
        :class="{ active: filterPill === 'todas-paginas' }"
        @click="$emit('update:filterPill', 'todas-paginas')"
      >Todas as Páginas</button>
      <button
        class="pill-btn"
        :class="{ active: filterPill === 'ultimas-pastas' }"
        @click="$emit('update:filterPill', 'ultimas-pastas')"
      >Últimas Pastas</button>
      <button
        class="pill-btn"
        :class="{ active: filterPill === 'todas-pastas' }"
        @click="$emit('update:filterPill', 'todas-pastas')"
      >Todas as Pastas</button>
      <button
        class="pill-btn"
        :class="{ active: filterPill === 'templates-categoria' }"
        @click="$emit('update:filterPill', 'templates-categoria')"
      >Templates por Categoria</button>
      <button
        class="pill-btn"
        :class="{ active: filterPill === 'todos-templates' }"
        @click="$emit('update:filterPill', 'todos-templates')"
      >Todos os Templates</button>
    </div>

    <div>
      <select
        class="filter-select"
        :value="selectedCategory"
        @change="$emit('update:selectedCategory', $event.target.value)"
      >
        <option value="todas">Todas as categorias</option>
        <option value="Funil">Funil & Vendas</option>
        <option value="VSL">VSL</option>
        <option value="Captura">Captura / Lead</option>
        <option value="Upsell">Upsell & Downsell</option>
        <option value="Checkout">Checkout</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filterPill: String,
  selectedCategory: String
});

defineEmits(['update:filterPill', 'update:selectedCategory']);
</script>

<style scoped>
.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 8px 12px;
  margin: 20px 0 28px 0;
}

.filter-pills {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
}

.pill-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.pill-btn.active {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.filter-select {
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 13px;
  padding: 7px 12px;
  border-radius: 8px;
  outline: none;
}
</style>
