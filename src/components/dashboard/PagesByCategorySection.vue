<template>
  <div class="category-sections">
    <section v-for="group in groups" :key="group.key" class="category-section">
      <header>
        <div class="category-heading">
          <span class="category-icon"><i :class="group.icon"></i></span>
          <div>
            <h2>{{ group.title }}</h2>
            <p>{{ group.description }}</p>
          </div>
          <span class="category-count">{{ group.pages.length }}</span>
        </div>
        <button type="button" @click="$emit('open-category', group.tab)">Ver categoria <i class="bi bi-arrow-right"></i></button>
      </header>

      <div v-if="group.pages.length" class="category-pages-grid">
        <article v-for="page in group.pages.slice(0, 4)" :key="page.id" class="page-card">
          <div class="page-preview" :class="`preview-${group.key}`">
            <span>{{ group.shortLabel }}</span>
            <div class="preview-sheet" :class="`sheet-${group.key}`">
              <i></i><i></i><b></b>
            </div>
          </div>
          <div class="page-info">
            <strong>{{ page.title }}</strong>
            <small>{{ page.date }}</small>
            <div>
              <button class="edit-button" @click="$emit('edit-page', page.templateId)">Editar</button>
              <button class="more-button" aria-label="Mais opções" @click="$emit('more-options', page)"><i class="bi bi-three-dots-vertical"></i></button>
            </div>
          </div>
        </article>
      </div>

      <button v-else type="button" class="empty-category" @click="$emit('create-category', group.key)">
        <span><i class="bi bi-plus-lg"></i></span>
        <strong>Criar primeiro {{ group.itemLabel }}</strong>
        <small>{{ group.emptyText }}</small>
      </button>
    </section>
  </div>
</template>

<script setup>
defineProps({ groups: { type: Array, default: () => [] } });
defineEmits(['open-category', 'create-category', 'edit-page', 'more-options']);
</script>

<style scoped>
.category-sections{display:flex;flex-direction:column;gap:22px}.category-section{padding:20px;border:1px solid var(--color-border);border-radius:17px;background:var(--color-surface)}.category-section>header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--color-border)}.category-heading{min-width:0;display:flex;align-items:center;gap:11px}.category-icon{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;border-radius:11px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:17px}.category-heading h2{margin:0;color:var(--color-text);font-size:16px}.category-heading p{margin:3px 0 0;color:var(--color-text-muted);font-size:10px}.category-count{padding:3px 8px;border-radius:999px;background:var(--color-primary-subtle);color:var(--color-primary-strong);font-size:10px;font-weight:900}.category-section>header>button{display:inline-flex;align-items:center;gap:6px;border:0;background:transparent;color:var(--color-primary-strong);font:inherit;font-size:11px;font-weight:900;cursor:pointer}.category-pages-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.page-card{min-width:0;overflow:hidden;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface);transition:.18s ease}.page-card:hover{transform:translateY(-2px);border-color:var(--color-primary-border);box-shadow:var(--shadow-sm)}.page-preview{height:105px;display:grid;place-items:center;position:relative;background:var(--color-primary-soft);border-bottom:1px solid var(--color-border)}.page-preview>span{position:absolute;top:8px;left:8px;padding:2px 7px;border-radius:6px;background:var(--color-surface);color:var(--color-primary-strong);font-size:8px;font-weight:900;text-transform:uppercase}.preview-sheet{width:74%;height:70%;display:flex;flex-direction:column;gap:6px;padding:10px;border:1px solid var(--color-border);border-radius:7px;background:var(--color-surface)}.preview-sheet i{height:6px;border-radius:999px;background:var(--color-border)}.preview-sheet i:nth-child(2){width:57%}.preview-sheet b{width:42%;height:12px;margin-top:auto;border-radius:4px;background:var(--color-primary)}.sheet-email{width:50%}.sheet-quiz{width:44%;height:79%;border-radius:13px}.page-info{display:flex;flex-direction:column;padding:12px}.page-info>strong{overflow:hidden;color:var(--color-text);font-size:12px;text-overflow:ellipsis;white-space:nowrap}.page-info>small{margin:4px 0 10px;color:var(--color-text-muted);font-size:9px}.page-info>div{display:flex;gap:7px}.edit-button{flex:1;padding:7px;border:1px solid var(--color-primary-border);border-radius:7px;background:var(--color-primary-soft);color:var(--color-primary-strong);font:inherit;font-size:10px;font-weight:900;cursor:pointer}.more-button{width:30px;border:1px solid var(--color-border);border-radius:7px;background:var(--color-surface);color:var(--color-text-muted);cursor:pointer}.empty-category{width:100%;min-height:104px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:1px dashed var(--color-border-strong);border-radius:12px;background:var(--color-primary-subtle);color:var(--color-text);font:inherit;cursor:pointer}.empty-category>span{width:28px;height:28px;display:grid;place-items:center;border-radius:8px;background:var(--color-primary-soft);color:var(--color-primary-strong)}.empty-category strong{font-size:11px}.empty-category small{color:var(--color-text-muted);font-size:9px}@media(max-width:1100px){.category-pages-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:640px){.category-section{padding:14px}.category-section>header{align-items:flex-start}.category-heading p{display:none}.category-pages-grid{grid-template-columns:1fr}.category-section>header>button{white-space:nowrap}}
</style>
