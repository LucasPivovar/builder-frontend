<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click.self="!saving && $emit('close')">
      <section class="save-modal tour-save-modal" role="dialog" aria-modal="true" aria-labelledby="save-page-title" @keydown.esc="!saving && $emit('close')">
        <div class="modal-header">
          <div>
            <h3 id="save-page-title"><i class="bi bi-floppy-fill"></i> Salvar Página</h3>
            <p>Salve sua página para acessar e editar depois</p>
          </div>
          <button class="btn-close" type="button" :disabled="saving" aria-label="Fechar salvamento da página" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label" for="save-page-name">Nome da Página *</label>
            <input
              id="save-page-name"
              type="text"
              class="form-input"
              v-model="pageName"
              :placeholder="pagePlaceholder"
              autofocus
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="save-page-folder">Pasta Destino</label>
            <div class="folder-row">
              <select id="save-page-folder" class="form-select" v-model="folderId">
                <option value="">Sem pasta (Raiz)</option>
                <option v-for="f in foldersRegistry" :key="f.id" :value="f.id">{{ f.name }}</option>
              </select>
            </div>
          </div>

          <div class="type-info-badge" :class="`badge-${builderMode}`">
            <i :class="pageModeIcon"></i>
            Formato: {{ pageModeLabel }}
            <span v-if="currentPageId" style="margin-left: 8px; opacity: 0.7;">(Atualizando página existente)</span>
          </div>
          <div v-if="builderMode !== 'email'" class="form-group"><label class="form-label" for="save-page-slug">Caminho da página</label><input id="save-page-slug" class="form-input" v-model="slug" placeholder="minha-oferta" pattern="[a-z0-9-]+" /><small>Use letras minúsculas, números e hífens. URL final: {{ urlPreview }}</small></div>
        </div>

        <div v-if="planBlocked" class="plan-warning" role="status">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span>
            Você já usa {{ pagesUsed }} de {{ planUsage.maxPages }} páginas do plano, somando todas as pastas e a raiz.
            Criar mais uma exige um plano maior. Editar as que já existem continua liberado.
          </span>
        </div>

        <div class="modal-footer">
          <p v-if="saveError" role="alert">{{ saveError }}</p>
          <button class="btn-cancel" :disabled="saving" @click="$emit('close')">Cancelar</button>
          <button class="btn-save tour-save-modal-submit" :disabled="saving || !pageName.trim()" @click="handleSave">
            <i class="bi bi-floppy-fill"></i>
            {{ saving ? 'Salvando...' : currentPageId ? 'Atualizar Página' : 'Salvar Página' }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close', 'saved']);

const { state, foldersRegistry, pagesRegistry, planUsage, savePageToBackend } = useBuilderStore();
const saving = ref(false);
const saveError = ref('');

const pageName = ref('');
const folderId = ref('');
const slug = ref('');

const builderMode = computed(() => state.builderMode);
const currentPageId = computed(() => state.currentPageId);
const pageModeLabel = computed(() => builderMode.value === 'email' ? 'Página de e-mail' : builderMode.value === 'quiz' ? 'Quiz interativo' : 'Página de funil');
const pageModeIcon = computed(() => builderMode.value === 'email' ? 'bi bi-envelope-paper-fill' : builderMode.value === 'quiz' ? 'bi bi-ui-checks-grid' : 'bi bi-play-btn-fill');
const pagePlaceholder = computed(() => builderMode.value === 'email' ? 'Ex.: E-mail de boas-vindas' : builderMode.value === 'quiz' ? 'Ex.: Quiz de diagnóstico' : 'Ex.: VSL do produto principal');
const selectedFolder = computed(() => foldersRegistry.find(folder => folder.id === folderId.value));
// O limite vale para a conta inteira. Só atrapalha quem está criando uma página
// nova: atualizar uma existente não aumenta a contagem.
const pagesUsed = computed(() => pagesRegistry.length);
const planBlocked = computed(() => !currentPageId.value && Boolean(planUsage.maxPages) && pagesUsed.value >= planUsage.maxPages);
const cleanSlugPreview = computed(() => cleanSlug(slug.value || pageName.value || 'pagina'));
const urlPreview = computed(() => `${selectedFolder.value?.customDomain || 'dominio-da-pasta.com'}/${cleanSlugPreview.value}`);

watch(() => props.isOpen, (open) => {
  if (open) {
    pageName.value = state.currentPageName || '';
    folderId.value = state.currentPageFolderId || '';
    slug.value = state.pageSettings.publicationSlug || '';
  }
});

async function handleSave() {
  if (saving.value || !pageName.value.trim()) return;
  saving.value = true;
  saveError.value = '';
  try {
    state.pageSettings.publicationSlug = cleanSlug(slug.value || pageName.value);
    const page = await savePageToBackend(pageName.value.trim(), folderId.value || null);
    emit('saved', page);
    emit('close');
  } catch (error) {
    saveError.value = error.message;
  } finally {
    saving.value = false;
  }
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
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}

.save-modal {
  background: #0d1220; border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px; width: 420px; max-width: 96vw;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 20px 24px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.modal-header h3 { font-size: 17px; font-weight: 800; color: var(--color-surface); margin-bottom: 2px; }
.modal-header p { font-size: 12.5px; color: var(--color-text-soft); }
.btn-close { background: none; border: none; color: var(--color-text-soft); font-size: 16px; cursor: pointer; }

.plan-warning {
  display: flex; gap: 8px; align-items: flex-start;
  margin: 0 24px 4px; padding: 10px 12px; border-radius: 10px;
  background: var(--color-danger-soft, rgba(220, 38, 38, 0.12));
  border: 1px solid var(--color-danger, rgba(220, 38, 38, 0.4));
  color: var(--color-text); font-size: 12.5px; line-height: 1.45;
}

.modal-body { padding: 20px 24px; }
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 12.5px; font-weight: 700; color: var(--color-border); margin-bottom: 6px; }

.form-input, .form-select {
  width: 100%; background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
  padding: 10px 14px; color: var(--color-surface); font-size: 14px; outline: none;
}

.form-input:focus { border-color: var(--color-primary); }

.type-info-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-top: 8px;
}

.badge-funil { background: var(--color-primary-soft); color: var(--color-primary-strong); }
.badge-email { background: rgba(56, 189, 248, 0.15); color: var(--color-primary-bright); }
.badge-quiz { background: var(--color-primary-subtle); color: var(--color-primary-strong); }

.modal-footer {
  display: flex; gap: 8px; justify-content: flex-end;
  padding: 14px 24px 20px; border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-border); padding: 9px 18px; border-radius: 9px; font-weight: 600; font-size: 13.5px; cursor: pointer;
}

.btn-save {
  background: var(--color-primary);
  border: none; color: var(--color-surface); padding: 9px 20px; border-radius: 9px;
  font-weight: 700; font-size: 13.5px; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  box-shadow: none;
}

.btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

.modal-backdrop { background: var(--overlay); }
.save-modal { background: var(--color-surface); border-color: var(--color-border); box-shadow: var(--shadow-modal); color: var(--color-text); }
.modal-header, .modal-footer { border-color: var(--color-border); }
.modal-header h3 { color: var(--color-text); }
.modal-header p, .btn-close { color: var(--color-text-muted); }
.form-label { color: var(--color-text-secondary); }
.form-input, .form-select { background: var(--color-surface); border-color: var(--color-border); color: var(--color-text); }
.form-input:focus, .form-select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-focus-ring); }
.badge-email { background: var(--color-primary-soft); color: var(--color-primary-strong); }
.modal-footer { background: var(--color-surface-soft); }
.btn-cancel { background: var(--color-surface); border-color: var(--color-border); color: var(--color-text-secondary); }
</style>
