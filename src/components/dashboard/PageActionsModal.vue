<template>
  <Teleport to="body">
    <div v-if="isOpen && page" class="page-actions-overlay" @click.self="$emit('close')">
      <section class="page-actions-modal" role="dialog" aria-modal="true" aria-labelledby="page-actions-title">
        <header>
          <div>
            <span class="eyebrow">ORGANIZAR PROJETO</span>
            <h2 id="page-actions-title">Opções da página</h2>
          </div>
          <button class="icon-close" type="button" aria-label="Fechar" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </header>

        <div class="page-actions-body">
          <label>
            <span>Nome da página</span>
            <input v-model="draftName" type="text" maxlength="120" @keyup.enter="save" />
          </label>

          <label>
            <span>Local da página</span>
            <select v-model="draftFolderId">
              <option value="">Fora de pastas (Raiz)</option>
              <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
            </select>
          </label>

          <label>
            <span>Caminho da página</span>
            <input v-model="draftSlug" type="text" maxlength="80" placeholder="minha-oferta" @keyup.enter="save" />
            <small>Com domínio na pasta, esta página abre em dominio.com/caminho-da-pagina.</small>
          </label>

          <button class="edit-now" type="button" @click="$emit('edit', page.id)">
            <i class="bi bi-pencil-square"></i>
            <span><strong>Editar no Builder</strong><small>Abrir esta página para continuar a edição.</small></span>
            <i class="bi bi-arrow-right"></i>
          </button>

          <button class="delete-page" type="button" @click="$emit('delete', page.id)">
            <i class="bi bi-trash3"></i>
            <span><strong>Excluir página</strong><small>Remover esta página do dashboard.</small></span>
          </button>

          <button v-if="page.publication" class="unpublish-page" type="button" @click="$emit('unpublish', page.id)">
            <i class="bi bi-cloud-slash"></i>
            <span><strong>Despublicar</strong><small>Tirar a página do ar e remover DNS vinculado.</small></span>
          </button>
        </div>

        <footer>
          <button class="button-secondary" type="button" @click="$emit('close')">Cancelar</button>
          <button class="button-primary" type="button" :disabled="!draftName.trim()" @click="save"><i class="bi bi-check-lg"></i> Salvar alterações</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  page: { type: Object, default: null },
  folders: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'save', 'edit', 'delete', 'unpublish']);
const draftName = ref('');
const draftFolderId = ref('');
const draftSlug = ref('');

watch(() => [props.isOpen, props.page], () => {
  if (!props.isOpen || !props.page) return;
  draftName.value = props.page.name || '';
  draftFolderId.value = props.page.folderId || '';
  draftSlug.value = props.page.pageSettings?.publicationSlug || slugFromName(props.page.name || '');
}, { immediate: true });

function save() {
  if (!draftName.value.trim()) return;
  emit('save', {
    id: props.page.id,
    name: draftName.value.trim(),
    folderId: draftFolderId.value || null,
    slug: cleanSlug(draftSlug.value || draftName.value)
  });
}

function cleanSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function slugFromName(name) {
  return cleanSlug(name) || 'pagina';
}
</script>

<style scoped>
.page-actions-overlay { position: fixed; inset: 0; z-index: 100000; display: grid; place-items: center; padding: 20px; background: var(--overlay); backdrop-filter: blur(4px); }
.page-actions-modal { width: min(500px, 96vw); overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: var(--color-surface); box-shadow: var(--shadow-modal); }
header, footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 20px 22px; }
header { border-bottom: 1px solid var(--color-border); }
footer { justify-content: flex-end; border-top: 1px solid var(--color-border); background: var(--color-surface-soft); }
.eyebrow { display: block; margin-bottom: 3px; color: var(--color-primary-strong); font-size: 9px; font-weight: 900; letter-spacing: .13em; }
h2 { margin: 0; color: var(--color-text); font-size: 19px; }
.icon-close { border: 0; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 17px; }
.page-actions-body { display: grid; gap: 16px; padding: 22px; }
label { display: grid; gap: 6px; color: var(--color-text-secondary); font-size: 12px; font-weight: 800; }
input, select { width: 100%; border: 1px solid var(--color-border); border-radius: 10px; outline: none; background: var(--color-surface); color: var(--color-text); padding: 11px 12px; font: inherit; font-size: 13px; }
input:focus, select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-focus-ring); }
.edit-now { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 11px; padding: 13px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-primary-subtle); color: var(--color-primary-strong); cursor: pointer; text-align: left; }
.edit-now > i:first-child { font-size: 20px; }
.edit-now span, .delete-page span, .unpublish-page span { display: grid; gap: 2px; }
.edit-now strong, .delete-page strong, .unpublish-page strong { color: var(--color-text); font-size: 12px; }
.edit-now small, .delete-page small, .unpublish-page small { color: var(--color-text-muted); font-size: 10.5px; font-weight: 500; }
.delete-page, .unpublish-page { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 11px; padding: 13px; border: 1px solid rgba(239,68,68,.26); border-radius: 12px; background: rgba(239,68,68,.07); color: #dc2626; cursor: pointer; text-align: left; }
.unpublish-page { border-color: var(--color-border); background: var(--color-surface-soft); color: var(--color-text-secondary); }
.delete-page > i:first-child, .unpublish-page > i:first-child { font-size: 19px; }
.button-secondary, .button-primary { border-radius: 9px; padding: 9px 14px; cursor: pointer; font: inherit; font-size: 12px; font-weight: 800; }
.button-secondary { border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-secondary); }
.button-primary { border: 1px solid var(--color-primary); background: var(--color-primary); color: var(--color-on-primary); }
.button-primary:disabled { opacity: .45; cursor: not-allowed; }
@media (max-width: 520px) { header, footer, .page-actions-body { padding: 17px; } footer button { flex: 1; } }
</style>
