<template>
  <section class="pages-table-section">
    <div v-if="pages.length === 0" class="empty-pages">
      <i class="bi bi-file-earmark-plus"></i>
      <strong>Nenhuma página encontrada</strong>
      <span>Crie uma nova página para começar.</span>
      <button type="button" @click="$emit('create-new')"><i class="bi bi-plus-lg"></i> Nova página</button>
    </div>

    <div v-else class="pages-table-wrap">
      <div class="pages-table-head" aria-hidden="true">
        <span>Status</span>
        <span>Página</span>
        <span>Métricas</span>
        <span>Pasta</span>
        <span>Última edição</span>
        <span>Ações</span>
      </div>

      <article v-for="page in pages" :key="page.id" class="pages-table-row">
        <div class="row-status">
          <i :class="['bi', page.isPublished ? 'bi-broadcast-pin' : 'bi-pencil-square']"></i>
          <span>{{ page.statusText }}</span>
        </div>

        <button type="button" class="row-page-name" @click="$emit('edit-page', page.templateId)">
          <span class="row-page-icon"><i class="bi bi-file-earmark-richtext"></i></span>
          <span>
            <strong>{{ page.title }}</strong>
            <small>{{ page.publicUrl || page.customDomain || 'Rascunho local' }}</small>
          </span>
        </button>

        <div class="row-metrics">
          <span><i class="bi bi-eye"></i>{{ page.metrics?.views || 0 }}</span>
          <span><i class="bi bi-cursor-fill"></i>{{ page.metrics?.clicks || 0 }}</span>
          <span><i class="bi bi-arrow-down"></i>{{ page.metrics?.maxScroll || 0 }}%</span>
        </div>

        <div>
          <span class="row-folder">{{ page.folderName || 'Sem pasta' }}</span>
        </div>

        <time class="row-date">{{ page.date }}</time>

        <div class="row-actions">
          <button v-if="page.isPublished" class="btn-edit-builder" type="button" @click="$emit('assign-dns', page)">
            <i class="bi bi-globe2"></i><span>Atribuir DNS</span>
          </button>
          <button v-else class="btn-edit-builder" type="button" @click="$emit('publish-page', page)">
            <i class="bi bi-cloud-arrow-up"></i><span>Publicar</span>
          </button>
          <button class="btn-item-more" type="button" aria-label="Mais opções" @click="$emit('more-options', page)">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  pages: { type: Array, default: () => [] }
});

defineEmits(['create-new', 'edit-page', 'more-options', 'publish-page', 'assign-dns']);
</script>

<style scoped>
.pages-table-section { width:100%; }
.pages-table-wrap { overflow:auto; border:1px solid var(--color-border); border-radius:18px; background:var(--color-surface); box-shadow:var(--shadow-sm); }
.pages-table-head,
.pages-table-row { min-width:980px; display:grid; grid-template-columns:132px minmax(240px,1.7fr) 150px minmax(120px,.75fr) minmax(132px,.8fr) 174px; align-items:center; gap:16px; }
.pages-table-head { min-height:48px; padding:0 20px; border-bottom:1px solid var(--color-border); color:var(--color-text-muted); font-size:10px; font-weight:900; letter-spacing:.5px; text-transform:uppercase; }
.pages-table-row { min-height:78px; padding:0 20px; border-bottom:1px solid var(--color-border); transition:background .18s ease; }
.pages-table-row:last-child { border-bottom:0; }
.pages-table-row:hover { background:var(--color-primary-subtle); }
.row-status { display:inline-flex; align-items:center; gap:7px; color:var(--color-text-secondary); font-size:12px; font-weight:800; }
.row-status i { color:var(--color-primary); font-size:14px; }
.row-page-name { min-width:0; display:flex; align-items:center; gap:10px; padding:0; border:0; background:transparent; color:inherit; font:inherit; text-align:left; cursor:pointer; }
.row-page-name>span:last-child { min-width:0; display:flex; flex-direction:column; gap:3px; }
.row-page-name strong { overflow:hidden; color:var(--color-text); font-size:13px; text-overflow:ellipsis; white-space:nowrap; }
.row-page-name small { overflow:hidden; color:var(--color-text-muted); font-size:11px; text-overflow:ellipsis; white-space:nowrap; }
.row-page-icon { width:34px; height:34px; flex:0 0 auto; display:grid; place-items:center; border-radius:9px; background:var(--color-primary-soft); color:var(--color-primary-strong); font-size:16px; }
.row-folder { display:inline-flex; max-width:100%; padding:4px 8px; border-radius:999px; background:var(--color-primary-soft); color:var(--color-primary-strong); font-size:11px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.row-metrics{display:flex;align-items:center;gap:8px;color:var(--color-text-muted);font-size:11px;font-weight:900}.row-metrics span{display:inline-flex;align-items:center;gap:4px}.row-metrics i{color:var(--color-primary)}
.row-date { color:var(--color-text-muted); font-size:12px; }
.row-actions { display:flex; align-items:center; justify-content:flex-end; gap:7px; }
.btn-edit-builder { flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px; white-space:nowrap; background:var(--color-primary-soft); color:var(--color-primary-strong); border:1px solid var(--color-border-strong); padding:7px; border-radius:8px; font-size:12px; font-weight:800; cursor:pointer; }
.btn-edit-builder:hover { border-color:var(--color-primary); background:var(--color-primary); color:#fff; }
.btn-item-more { width:30px; height:30px; border-radius:8px; background:var(--color-surface-soft); border:1px solid var(--color-border); color:var(--color-text-muted); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.btn-item-more:hover { border-color:var(--color-primary-border); color:var(--color-primary-strong); }
.empty-pages { min-height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; border:1px dashed var(--color-border-strong); border-radius:18px; background:var(--color-surface); color:var(--color-text-muted); text-align:center; }
.empty-pages i { font-size:32px; color:var(--color-primary); }
.empty-pages strong { color:var(--color-text); font-size:16px; }
.empty-pages button { margin-top:8px; display:inline-flex; align-items:center; gap:7px; border:0; border-radius:10px; padding:10px 14px; background:var(--color-primary); color:#fff; font:inherit; font-size:13px; font-weight:800; cursor:pointer; }
@media(max-width:720px){.pages-table-head,.pages-table-row{min-width:900px;grid-template-columns:116px minmax(220px,1.8fr) 130px 110px 118px 164px}.pages-table-row{padding:0 14px}.pages-table-head{padding:0 14px}}
</style>
