<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
      <div class="save-modal">
        <div class="modal-header">
          <div>
            <h3>💾 Salvar Página</h3>
            <p>Salve sua página para acessar e editar depois</p>
          </div>
          <button class="btn-close" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nome da Página *</label>
            <input
              type="text"
              class="form-input"
              v-model="pageName"
              :placeholder="builderMode === 'email' ? 'ex: E-mail Boas-vindas' : 'ex: VSL Funil Dollar App'"
              autofocus
            />
          </div>

          <div class="form-group">
            <label class="form-label">Pasta Destino</label>
            <div class="folder-row">
              <select class="form-select" v-model="folderId">
                <option value="">📂 Sem pasta (Raiz)</option>
                <option v-for="f in foldersRegistry" :key="f.id" :value="f.id">📁 {{ f.name }}</option>
              </select>
            </div>
          </div>

          <div class="type-info-badge" :class="builderMode === 'email' ? 'badge-email' : 'badge-funil'">
            <i :class="builderMode === 'email' ? 'bi bi-envelope-paper-fill' : 'bi bi-play-btn-fill'"></i>
            Modo: {{ builderMode === 'email' ? 'Template E-mail' : 'Página Funil' }}
            <span v-if="currentPageId" style="margin-left: 8px; opacity: 0.7;">(Atualizando página existente)</span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button class="btn-save" :disabled="!pageName.trim()" @click="handleSave">
            <i class="bi bi-floppy-fill"></i>
            {{ currentPageId ? 'Atualizar Página' : 'Salvar Página' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close', 'saved']);

const { state, foldersRegistry, savePage } = useBuilderStore();

const pageName = ref('');
const folderId = ref('');

const builderMode = computed(() => state.builderMode);
const currentPageId = computed(() => state.currentPageId);

watch(() => props.isOpen, (open) => {
  if (open) {
    pageName.value = state.currentPageName || '';
    folderId.value = state.currentPageFolderId || '';
  }
});

function handleSave() {
  if (!pageName.value.trim()) return;
  const page = savePage(pageName.value.trim(), folderId.value || null);
  emit('saved', page);
  emit('close');
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

.modal-header h3 { font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 2px; }
.modal-header p { font-size: 12.5px; color: #94a3b8; }
.btn-close { background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; }

.modal-body { padding: 20px 24px; }
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 12.5px; font-weight: 700; color: #e2e8f0; margin-bottom: 6px; }

.form-input, .form-select {
  width: 100%; background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
  padding: 10px 14px; color: #fff; font-size: 14px; outline: none;
}

.form-input:focus { border-color: #6366f1; }

.type-info-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-top: 8px;
}

.badge-funil { background: rgba(16, 185, 129, 0.15); color: #34d399; }
.badge-email { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }

.modal-footer {
  display: flex; gap: 8px; justify-content: flex-end;
  padding: 14px 24px 20px; border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0; padding: 9px 18px; border-radius: 9px; font-weight: 600; font-size: 13.5px; cursor: pointer;
}

.btn-save {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none; color: #fff; padding: 9px 20px; border-radius: 9px;
  font-weight: 700; font-size: 13.5px; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
