<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
      <div class="folder-modal">
        <div class="modal-header">
          <h3>
            <i :class="mode === 'create' ? 'bi bi-folder-plus' : 'bi bi-pencil-square'"></i>
            {{ mode === 'create' ? 'Nova Pasta' : 'Renomear Pasta' }}
          </h3>
          <button class="btn-close" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nome da Pasta *</label>
            <input
              type="text"
              class="form-input"
              v-model="folderName"
              placeholder="Ex.: Funil principal ou Campanha de lançamento"
              autofocus
              @keydown.enter="handleConfirm"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Domínio da pasta (opcional)</label>
            <input class="form-input" v-model.trim="customDomain" placeholder="ofertas.seudominio.com" />
            <small>As páginas serão publicadas em domínio/slug-da-página. Configure o DNS e republique as páginas após alterar.</small>
          </div>
          <div v-if="mode === 'create'" class="form-group">
            <label class="form-label">Cor da Pasta</label>
            <div class="color-picker-row">
              <div
                v-for="color in colorOptions"
                :key="color"
                class="color-swatch"
                :class="{ active: selectedColor === color }"
                :style="{ background: color }"
                @click="selectedColor = color"
              ></div>
            </div>
          </div>

          <div v-if="mode === 'create'" class="form-group">
            <label class="form-label">Pasta Pai (subpasta)</label>
            <select class="form-select" v-model="parentId">
              <option value="">Raiz (sem pasta pai)</option>
              <option v-for="f in foldersRegistry" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button class="btn-confirm" :disabled="!folderName.trim()" @click="handleConfirm">
            <i class="bi bi-folder-plus"></i>
            {{ mode === 'create' ? 'Criar Pasta' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useBuilderStore } from '../../composables/useBuilderStore';

const props = defineProps({
  isOpen: Boolean,
  mode: { type: String, default: 'create' }, // 'create' | 'rename'
  folder: { type: Object, default: null } // folder being renamed
});

const emit = defineEmits(['close', 'done']);
const { foldersRegistry, createFolder, renameFolder } = useBuilderStore();

const folderName = ref('');
const selectedColor = ref('#612bf4');
const parentId = ref('');
const customDomain = ref('');

const colorOptions = ['#612bf4', '#a854fa', '#395cf9', '#2296fc', '#17b5fc', '#1a1433'];

watch(() => props.isOpen, (open) => {
  if (open) {
    folderName.value = props.mode === 'rename' && props.folder ? props.folder.name : '';
    selectedColor.value = '#612bf4';
    parentId.value = '';
    customDomain.value = props.folder?.customDomain || '';
  }
});

function handleConfirm() {
  if (!folderName.value.trim()) return;
  if (props.mode === 'create') {
    const f = createFolder(folderName.value.trim(), parentId.value || null, selectedColor.value, customDomain.value.toLowerCase());
    emit('done', f);
  } else if (props.mode === 'rename' && props.folder) {
    renameFolder(props.folder.id, folderName.value.trim(), customDomain.value.toLowerCase());
    emit('done');
  }
  emit('close');
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}

.folder-modal {
  background: #0d1220;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  width: 420px;
  max-width: 96vw;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.modal-header h3 { font-size: 17px; font-weight: 800; color: var(--color-surface); }
.btn-close { background: none; border: none; color: var(--color-text-soft); font-size: 16px; cursor: pointer; }
.btn-close:hover { color: var(--color-surface); }

.modal-body { padding: 20px 24px; }

.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 12.5px; font-weight: 700; color: var(--color-border); margin-bottom: 6px; }

.form-input, .form-select {
  width: 100%; background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
  padding: 10px 14px; color: var(--color-surface); font-size: 14px; outline: none;
}

.form-input:focus { border-color: var(--color-primary); }

.color-picker-row { display: flex; gap: 8px; flex-wrap: wrap; }
.color-swatch {
  width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
  border: 2px solid transparent; transition: all 0.2s; flex-shrink: 0;
}
.color-swatch.active { border-color: var(--color-surface); transform: scale(1.15); }

.modal-footer {
  display: flex; gap: 8px; justify-content: flex-end;
  padding: 14px 24px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-border); padding: 9px 18px; border-radius: 9px; font-weight: 600; font-size: 13.5px; cursor: pointer;
}

.btn-confirm {
  background: var(--color-primary); border: none; color: var(--color-surface);
  padding: 9px 18px; border-radius: 9px; font-weight: 700; font-size: 13.5px; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
}

.btn-confirm:disabled { opacity: 0.4; cursor: not-allowed; }

.modal-backdrop { background: var(--overlay); }
.folder-modal { background: var(--color-surface); border-color: var(--color-border); box-shadow: var(--shadow-modal); color: var(--color-text); }
.modal-header, .modal-footer { border-color: var(--color-border); }
.modal-header h3 { color: var(--color-text); }
.btn-close { color: var(--color-text-muted); }
.btn-close:hover { color: var(--color-primary-strong); }
.form-label { color: var(--color-text-secondary); }
.form-input, .form-select { background: var(--color-surface); border-color: var(--color-border); color: var(--color-text); }
.form-input:focus, .form-select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-focus-ring); }
.color-swatch.active { border-color: var(--color-text); }
.modal-footer { background: var(--color-surface-soft); }
.btn-cancel { background: var(--color-surface); border-color: var(--color-border); color: var(--color-text-secondary); }
</style>
