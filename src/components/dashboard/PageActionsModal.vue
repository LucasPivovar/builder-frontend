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

          <div class="actions-group">
            <button v-if="page.isPublished || page.publication?.publicUrl" class="action-btn open-page" type="button" @click="$emit('open-publication', page)">
              <i class="bi bi-box-arrow-up-right"></i>
              <span><strong>Abrir página publicada</strong><small>{{ page.publication?.customDomainUrl || page.publication?.publicUrl || 'Visualizar online em nova aba' }}</small></span>
              <i class="bi bi-arrow-right"></i>
            </button>

            <button class="action-btn metrics-page" type="button" @click="$emit('open-metrics', page)">
              <i class="bi bi-graph-up-arrow"></i>
              <span><strong>Ver métricas da página</strong><small>Visualizar acessos, cliques e taxa de conversão.</small></span>
              <i class="bi bi-arrow-right"></i>
            </button>

            <button class="action-btn dns-page" type="button" @click="$emit('open-dns', page)">
              <i class="bi bi-globe2"></i>
              <span><strong>Atribuir DNS / Domínio</strong><small>{{ page.publication?.customDomain ? (page.publication.domainStatus === 'active' ? 'Domínio ativo: ' + page.publication.customDomain : 'DNS pendente: ' + page.publication.customDomain) : 'Configurar domínio personalizado nesta página.' }}</small></span>
              <i class="bi bi-arrow-right"></i>
            </button>

            <button v-if="!page.isPublished && !page.publication?.publicUrl" class="action-btn publish-page" type="button" @click="$emit('publish-page', page)">
              <i class="bi bi-cloud-arrow-up"></i>
              <span><strong>Publicar página</strong><small>Colocar a página no ar para receber visitantes.</small></span>
              <i class="bi bi-arrow-right"></i>
            </button>

            <button class="action-btn edit-now" type="button" @click="$emit('edit', page.id)">
              <i class="bi bi-pencil-square"></i>
              <span><strong>Editar no Builder</strong><small>Abrir esta página para continuar a edição.</small></span>
              <i class="bi bi-arrow-right"></i>
            </button>

            <button v-if="page.isPublished || page.publication" class="action-btn unpublish-page" type="button" @click="$emit('unpublish', page.id)">
              <i class="bi bi-cloud-slash"></i>
              <span><strong>Despublicar</strong><small>Tirar a página do ar e pausar o acesso online.</small></span>
            </button>

            <button class="action-btn delete-page" type="button" @click="$emit('delete', page.id)">
              <i class="bi bi-trash3"></i>
              <span><strong>Excluir página</strong><small>Remover esta página do dashboard.</small></span>
            </button>
          </div>
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

const emit = defineEmits(['close', 'save', 'edit', 'delete', 'unpublish', 'open-publication', 'open-metrics', 'open-dns', 'publish-page']);
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
.page-actions-modal { width: min(520px, 96vw); max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: var(--color-surface); box-shadow: var(--shadow-modal); }
header, footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 20px 22px; flex-shrink: 0; }
header { border-bottom: 1px solid var(--color-border); }
footer { justify-content: flex-end; border-top: 1px solid var(--color-border); background: var(--color-surface-soft); }
.eyebrow { display: block; margin-bottom: 3px; color: var(--color-primary-strong); font-size: 9px; font-weight: 900; letter-spacing: .13em; }
h2 { margin: 0; color: var(--color-text); font-size: 19px; }
.icon-close { border: 0; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 17px; }
.page-actions-body { display: grid; gap: 14px; padding: 22px; overflow-y: auto; }
label { display: grid; gap: 6px; color: var(--color-text-secondary); font-size: 12px; font-weight: 800; }
input, select { width: 100%; border: 1px solid var(--color-border); border-radius: 10px; outline: none; background: var(--color-surface); color: var(--color-text); padding: 11px 12px; font: inherit; font-size: 13px; }
input:focus, select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-focus-ring); }

.actions-group { display: grid; gap: 8px; margin-top: 4px; }
.action-btn { display: grid; grid-template-columns: 24px 1fr auto; align-items: start; gap: 12px; padding: 12px 14px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-surface); color: var(--color-text); cursor: pointer; text-align: left; transition: all 0.15s ease; font: inherit; width: 100%; }
.action-btn:hover { background: var(--color-surface-soft); border-color: var(--color-primary-border); }
.action-btn > i:first-child { font-size: 18px; color: var(--color-primary-strong); display: flex; align-items: center; justify-content: center; margin-top: 2px; }
.action-btn span { display: grid; gap: 2px; min-width: 0; }
.action-btn strong { color: var(--color-text); font-size: 12.5px; font-weight: 800; }
.action-btn small { color: var(--color-text-muted); font-size: 11px; font-weight: 500; white-space: normal; line-height: 1.4; }
.action-btn > i:last-child { color: var(--color-text-muted); font-size: 13px; margin-top: 3px; }

.action-btn.open-page { background: var(--color-surface); }
.action-btn.open-page:hover { background: var(--color-primary-soft); border-color: var(--color-primary); }
.action-btn.metrics-page { background: var(--color-surface); }
.action-btn.metrics-page:hover { background: var(--color-primary-soft); border-color: var(--color-primary); }
.action-btn.dns-page { background: var(--color-surface); }
.action-btn.dns-page:hover { background: var(--color-primary-soft); border-color: var(--color-primary); }
.action-btn.publish-page { background: #f0fdf4; border-color: #bbf7d0; }
.action-btn.publish-page > i:first-child { color: #16a34a; }
.action-btn.publish-page strong { color: #166534; }
.action-btn.publish-page:hover { background: #dcfce7; border-color: #86efac; }
.action-btn.edit-now { background: var(--color-primary-subtle); border-color: var(--color-primary-border); color: var(--color-primary-strong); }
.action-btn.edit-now > i:first-child { color: var(--color-primary-strong); }
.action-btn.edit-now:hover { background: var(--color-primary-soft); }
.action-btn.unpublish-page { border-color: var(--color-border); background: var(--color-surface-soft); }
.action-btn.unpublish-page > i:first-child { color: var(--color-text-muted); }
.action-btn.unpublish-page:hover { border-color: #fca5a5; background: #fef2f2; }
.action-btn.delete-page { border-color: rgba(239,68,68,.26); background: rgba(239,68,68,.07); color: #dc2626; }
.action-btn.delete-page > i:first-child { color: #dc2626; }
.action-btn.delete-page strong { color: #dc2626; }
.action-btn.delete-page:hover { background: rgba(239,68,68,.14); border-color: #ef4444; }

.button-secondary, .button-primary { border-radius: 9px; padding: 9px 14px; cursor: pointer; font: inherit; font-size: 12px; font-weight: 800; }
.button-secondary { border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-secondary); }
.button-primary { border: 1px solid var(--color-primary); background: var(--color-primary); color: var(--color-on-primary); }
.button-primary:disabled { opacity: .45; cursor: not-allowed; }
@media (max-width: 520px) { header, footer, .page-actions-body { padding: 17px; } footer button { flex: 1; } }
</style>
