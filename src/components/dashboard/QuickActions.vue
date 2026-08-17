<template>
  <section class="quick-start-grid" aria-label="Resumo do espaço de trabalho">
    <article class="kpi-card">
      <div class="kpi-icon"><i class="bi bi-files"></i></div>
      <div>
        <strong>{{ pagesCount }}</strong>
        <span>Páginas criadas</span>
      </div>
    </article>

    <article class="kpi-card online">
      <div class="kpi-icon"><i class="bi bi-broadcast-pin"></i></div>
      <div>
        <strong>{{ onlinePagesCount }}</strong>
        <span>Páginas online</span>
      </div>
    </article>

    <article class="kpi-card">
      <div class="kpi-icon"><i class="bi bi-pencil-square"></i></div>
      <div>
        <strong>{{ draftPagesCount }}</strong>
        <span>Em rascunho</span>
      </div>
    </article>

    <article class="kpi-card">
      <div class="kpi-icon"><i class="bi bi-folder-fill"></i></div>
      <div>
        <strong>{{ foldersCount }}</strong>
        <span>Pastas criadas</span>
      </div>
    </article>
  </section>
</template>

<script setup>
defineProps({
  pagesCount: { type: Number, default: 0 },
  onlinePagesCount: { type: Number, default: 0 },
  draftPagesCount: { type: Number, default: 0 },
  foldersCount: { type: Number, default: 0 }
});
</script>

<style scoped>
.quick-start-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.kpi-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-primary-soft);
  color: var(--color-primary-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.kpi-card strong {
  display: block;
  color: var(--color-text);
  font-size: 23px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 5px;
}

.kpi-card span {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
}

.kpi-card span { color: var(--color-text-soft); }
</style>
