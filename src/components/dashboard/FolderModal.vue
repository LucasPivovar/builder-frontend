<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
      <div class="folder-modal">
        <div class="modal-header">
          <h3>{{ mode === 'create' ? '📁 Nova Pasta' : '✏️ Renomear Pasta' }}</h3>
          <button class="btn-close" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nome da Pasta *</label>
            <input
              type="text"
              class="form-input"
              v-model="folderName"
              placeholder="ex: Funil Dollar App, Lançamento 2026..."
              autofocus
              @keydown.enter="handleConfirm"
            />
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
              <option v-for="f in foldersRegistry" :key="f.id" :value="f.id">📁 {{ f.name }}</option>
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
const selectedColor = ref('#6366f1');
const parentId = ref('');

const colorOptions = ['#6366f1', '#f59e0b', '#10b981', '#38bdf8', '#f87171', '#a78bfa', '#fb923c', '#34d399'];

watch(() => props.isOpen, (open) => {
  if (open) {
    folderName.value = props.mode === 'rename' && props.folder ? props.folder.name : '';
    selectedColor.value = '#6366f1';
    parentId.value = '';
  }
});

function handleConfirm() {
  if (!folderName.value.trim()) return;
  if (props.mode === 'create') {
    const f = createFolder(folderName.value.trim(), parentId.value || null, selectedColor.value);
    emit('done', f);
  } else if (props.mode === 'rename' && props.folder) {
    renameFolder(props.folder.id, folderName.value.trim());
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

.modal-header h3 { font-size: 17px; font-weight: 800; color: #fff; }
.btn-close { background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; }
.btn-close:hover { color: #fff; }

.modal-body { padding: 20px 24px; }

.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 12.5px; font-weight: 700; color: #e2e8f0; margin-bottom: 6px; }

.form-input, .form-select {
  width: 100%; background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
  padding: 10px 14px; color: #fff; font-size: 14px; outline: none;
}

.form-input:focus { border-color: #6366f1; }

.color-picker-row { display: flex; gap: 8px; flex-wrap: wrap; }
.color-swatch {
  width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
  border: 2px solid transparent; transition: all 0.2s; flex-shrink: 0;
}
.color-swatch.active { border-color: #fff; transform: scale(1.15); }

.modal-footer {
  display: flex; gap: 8px; justify-content: flex-end;
  padding: 14px 24px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0; padding: 9px 18px; border-radius: 9px; font-weight: 600; font-size: 13.5px; cursor: pointer;
}

.btn-confirm {
  background: #6366f1; border: none; color: #fff;
  padding: 9px 18px; border-radius: 9px; font-weight: 700; font-size: 13.5px; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
}

.btn-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
