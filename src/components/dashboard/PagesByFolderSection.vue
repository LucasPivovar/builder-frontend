<template>
  <div class="pages-by-folder-container">
    <div v-if="folderGroups.length === 0" class="empty-pages">
      <i class="bi bi-file-earmark-plus"></i>
      <strong>Nenhuma página encontrada</strong>
      <span>Crie uma página e escolha uma pasta para organizar seu projeto.</span>
      <button type="button" @click="$emit('create-new')"><i class="bi bi-plus-lg"></i> Nova página</button>
    </div>

    <!-- Folder Section Block -->
    <template v-else>
    <div
      v-for="group in folderGroups"
      :key="group.folderId || 'root'"
      class="folder-block-section"
    >
      <div class="folder-block-header">
        <div class="folder-block-title">
          <i class="bi bi-folder2-open folder-icon-open" :style="{ color: group.color || '#612bf4' }"></i>
          <h3>{{ group.folderName }}</h3>
          <span class="folder-count-badge">{{ group.pages.length }} páginas</span>
        </div>

        <a
          v-if="group.folderId"
          href="#"
          class="see-all-folder-btn"
          @click.prevent="$emit('see-all-folder', group.folderId)"
        >
          Ver todos <i class="bi bi-arrow-right"></i>
        </a>
      </div>

      <div class="folder-pages-table">
        <div class="folder-table-head" aria-hidden="true">
          <span>Status</span>
          <span>Página</span>
          <span>URL publicada</span>
          <span>Tipo</span>
          <span>Última edição</span>
          <span>Ações</span>
        </div>

        <article
          v-for="page in group.pages"
          :key="page.id"
          class="folder-page-row"
        >
          <div class="row-status">
            <i :class="['bi', page.isPublished ? 'bi-broadcast-pin' : 'bi-pencil-square']"></i>
            <span>{{ page.statusText }}</span>
          </div>
          <div class="row-page-name">
            <span class="row-page-icon"><i class="bi bi-file-earmark-richtext"></i></span>
            <button type="button" @click="$emit('edit-page', page.templateId || page.id)">
              <strong>{{ page.title }}</strong>
              <small>Editar página</small>
            </button>
          </div>
          <div class="row-public-url">
            <button
              v-if="page.publication?.publicUrl"
              type="button"
              @click="$emit('open-publication', page)"
            >
              <i class="bi bi-box-arrow-up-right"></i>
              <span>{{ displayUrl(page) }}</span>
            </button>
            <span v-else>Publicação pendente</span>
          </div>
          <div><span class="row-category">{{ page.category }}</span></div>
          <time class="row-date">{{ page.date }}</time>
          <div class="row-actions">
            <button
              v-if="page.isPublished"
              class="btn-open-page"
              @click="$emit('open-publication', page)"
            >
              <i class="bi bi-box-arrow-up-right"></i><span>Abrir</span>
            </button>
            <button
              class="btn-open-page"
              type="button"
              @click="$emit('open-metrics', page)"
            >
              <i class="bi bi-graph-up-arrow"></i><span>Métricas</span>
            </button>
            <button
              v-if="page.isPublished"
              class="btn-edit-builder"
              @click="$emit('assign-dns', page)"
            >
              <i class="bi bi-globe2"></i><span>Atribuir DNS</span>
            </button>
            <button
              v-else
              class="btn-edit-builder"
              @click="$emit('publish-page', page)"
            >
              <i class="bi bi-cloud-arrow-up"></i><span>Publicar</span>
            </button>
            <button class="btn-item-more" @click="$emit('more-options', page)"><i class="bi bi-three-dots-vertical"></i></button>
          </div>
        </article>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  folderGroups: { type: Array, default: () => [] }
});

defineEmits(['create-new', 'see-all-folder', 'edit-page', 'more-options', 'publish-page', 'assign-dns', 'open-publication', 'open-metrics']);

function displayUrl(page) {
  const publication = page?.publication || {};
  const url = publication.customDomainUrl && publication.domainStatus === 'active'
    ? publication.customDomainUrl
    : publication.publicUrl || page.publicUrl || '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

</script>

<style scoped>
.pages-by-folder-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.folder-block-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  padding: 24px;
}

.folder-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-primary-soft);
}

.folder-block-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.folder-icon-open {
  font-size: 24px;
}

.folder-block-title h3 {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text);
}

.folder-count-badge {
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.see-all-folder-btn {
  color: var(--color-primary-bright);
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s;
}

.see-all-folder-btn:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.folder-pages-table {
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
}

.folder-table-head,
.folder-page-row {
  min-width: 1040px;
  display: grid;
  grid-template-columns: 120px minmax(190px, 1.25fr) minmax(210px, 1.2fr) 82px 112px 318px;
  align-items: center;
  gap: 16px;
}

.folder-table-head {
  min-height: 46px;
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .5px;
  text-transform: uppercase;
}

.folder-page-row {
  min-height: 76px;
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border);
  transition: background .2s ease;
}

.folder-page-row:last-child { border-bottom: 0; }
.folder-page-row:hover { background: var(--color-primary-subtle); }
.row-status { display: inline-flex; align-items: center; gap: 7px; color: var(--color-text-secondary); font-size: 12px; font-weight: 700; }
.row-status i { color: var(--color-primary); font-size: 14px; }
.row-page-name { min-width: 0; display: flex; align-items: center; gap: 10px; }
.row-page-name button { min-width:0; display:grid; gap:3px; padding:0; border:0; background:transparent; color:inherit; text-align:left; cursor:pointer; font:inherit; }
.row-page-name strong { overflow: hidden; color: var(--color-text); font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.row-page-name small { overflow:hidden; color:var(--color-text-muted); font-size:11px; text-overflow:ellipsis; white-space:nowrap; }
.row-page-icon { width: 34px; height: 34px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 9px; background: var(--color-primary-soft); color: var(--color-primary-strong); font-size: 16px; }
.row-public-url { min-width:0; }
.row-public-url button { max-width:100%; display:inline-flex; align-items:center; gap:6px; padding:0; border:0; background:transparent; color:var(--color-primary-strong); font:inherit; font-size:11px; font-weight:800; cursor:pointer; }
.row-public-url button span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.row-public-url > span { color:var(--color-text-muted); font-size:11px; font-weight:700; }
.row-category { display: inline-flex; padding: 4px 8px; border-radius: 999px; background: var(--color-primary-soft); color: var(--color-primary-strong); font-size: 11px; font-weight: 800; }
.row-date { color: var(--color-text-muted); font-size: 12px; }
.row-actions { display: flex; align-items: center; justify-content: flex-end; gap: 7px; }

.btn-edit-builder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  border: 1px solid var(--color-border-strong);
  padding: 7px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-open-page {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  white-space:nowrap;
  border:1px solid var(--color-border);
  background:var(--color-surface);
  color:var(--color-text-secondary);
  padding:7px 9px;
  border-radius:8px;
  font-size:12px;
  font-weight:800;
  cursor:pointer;
}

.btn-open-page:hover { border-color:var(--color-primary-border); color:var(--color-primary-strong); }

.btn-item-more {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.empty-pages { min-height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; border:1px dashed var(--color-border-strong); border-radius:18px; background:var(--color-surface); color:var(--color-text-muted); text-align:center; }
.empty-pages i { font-size:32px; color:var(--color-primary); }
.empty-pages strong { color:var(--color-text); font-size:16px; }
.empty-pages button { margin-top:8px; display:inline-flex; align-items:center; gap:7px; border:0; border-radius:10px; padding:10px 14px; background:var(--color-primary); color:#fff; font:inherit; font-size:13px; font-weight:800; cursor:pointer; }
</style>
