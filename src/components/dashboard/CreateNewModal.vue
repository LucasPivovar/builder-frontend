<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
      <div class="create-modal">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-title-area">
            <h2>✨ Criar Nova Página em Branco</h2>
            <p>Selecione a estrutura do esqueleto da sua página</p>
          </div>
          <button class="btn-close" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </div>

        <!-- Step 1: Skeleton Selection -->
        <div v-if="step === 1" class="modal-body">
          <div class="type-cards">
            <div
              class="type-card"
              :class="{ active: selectedType === 'funil' }"
              @click="selectedType = 'funil'"
            >
              <div class="type-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">
                <i class="bi bi-play-btn-fill"></i>
              </div>
              <div class="type-info">
                <h3>Página Funil</h3>
                <p>VSL, Landing Page, Upsell, Downsell, Captura. Largura livre, fundo escuro, canvas vazio.</p>
              </div>
              <div class="type-check" :class="{ visible: selectedType === 'funil' }">
                <i class="bi bi-check-circle-fill"></i>
              </div>
            </div>

            <div
              class="type-card"
              :class="{ active: selectedType === 'email' }"
              @click="selectedType = 'email'"
            >
              <div class="type-icon" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">
                <i class="bi bi-envelope-paper-fill"></i>
              </div>
              <div class="type-info">
                <h3>Template E-mail</h3>
                <p>Largura fixa 600px, fundo cinza claro. Inclui slots de Cabeçalho, Corpo e Rodapé.</p>
              </div>
              <div class="type-check" :class="{ visible: selectedType === 'email' }">
                <i class="bi bi-check-circle-fill"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Name & Folder -->
        <div v-else class="modal-body">
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">Nome da Página *</label>
              <input
                type="text"
                class="form-input"
                v-model="pageName"
                :placeholder="selectedType === 'email' ? 'ex: E-mail Boas-vindas Novos Usuários' : 'ex: VSL Funil Dollar App 2026'"
                autofocus
              />
            </div>

            <div class="form-group">
              <label class="form-label">Pasta Destino</label>
              <div class="folder-select-row">
                <select class="form-select" v-model="selectedFolderId">
                  <option value="">📂 Sem pasta (Raiz)</option>
                  <option v-for="folder in flatFolders" :key="folder.id" :value="folder.id">
                    {{ '  '.repeat(folder.depth) }}📁 {{ folder.name }}
                  </option>
                </select>
                <button class="btn-new-folder" @click="quickCreateFolder" title="Criar nova pasta">
                  <i class="bi bi-folder-plus"></i>
                </button>
              </div>
            </div>

            <div class="selected-type-badge">
              <span :class="selectedType === 'email' ? 'badge-email' : 'badge-funil'">
                <i :class="selectedType === 'email' ? 'bi bi-envelope-paper-fill' : 'bi bi-play-btn-fill'"></i>
                {{ selectedType === 'email' ? 'Template E-mail (600px fixo) — canvas em branco' : 'Página Funil (largura livre) — canvas em branco' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="modal-footer">
          <button class="btn-secondary" @click="step === 2 ? step = 1 : $emit('close')">
            {{ step === 2 ? '← Voltar' : 'Cancelar' }}
          </button>

          <button
            v-if="step === 1"
            class="btn-primary"
            :disabled="!selectedType"
            @click="step = 2"
          >
            Continuar →
          </button>

          <button
            v-else
            class="btn-primary"
            :disabled="!pageName.trim()"
            @click="handleCreate"
          >
            <i class="bi bi-plus-circle-fill"></i> Criar Página em Branco
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBuilderStore } from '../../composables/useBuilderStore';

defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'created']);

const { foldersRegistry, createFolder } = useBuilderStore();

const step = ref(1);
const selectedType = ref('funil');
const pageName = ref('');
const selectedFolderId = ref('');


const flatFolders = computed(() => {
  const result = [];
  function walk(parentId, depth) {
    foldersRegistry.filter(f => f.parentId === parentId).forEach(f => {
      result.push({ ...f, depth });
      walk(f.id, depth + 1);
    });
  }
  walk(null, 0);
  return result;
});

function quickCreateFolder() {
  const name = prompt('Nome da nova pasta:');
  if (name && name.trim()) {
    const f = createFolder(name.trim(), null);
    selectedFolderId.value = f.id;
  }
}

function handleCreate() {
  if (!pageName.value.trim()) return;
  emit('created', {
    name: pageName.value.trim(),
    type: selectedType.value,
    folderId: selectedFolderId.value || null,
    templateKey: '' // blank canvas — no template
  });
  // Reset
  step.value = 1;
  selectedType.value = 'funil';
  pageName.value = '';
  selectedFolderId.value = '';
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0, 0, 0, 0.75);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}

.create-modal {
  background: #0d1220;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  width: 600px;
  max-width: 96vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
}

.modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.modal-title-area h2 { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 2px; }
.modal-title-area p { font-size: 13px; color: #94a3b8; }

.btn-close { background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; padding: 4px 8px; }
.btn-close:hover { color: #fff; }

.modal-body { padding: 24px 28px; overflow-y: auto; flex: 1; }

.type-cards { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }

.type-card {
  display: flex; align-items: center; gap: 16px;
  background: rgba(23, 31, 48, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-card:hover { border-color: rgba(99, 102, 241, 0.4); background: rgba(30, 41, 62, 0.8); }
.type-card.active { border-color: #6366f1; background: rgba(99, 102, 241, 0.1); }

.type-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.type-info { flex: 1; }
.type-info h3 { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.type-info p { font-size: 13px; color: #94a3b8; line-height: 1.4; }

.type-check { color: #6366f1; font-size: 20px; opacity: 0; transition: opacity 0.2s; }
.type-check.visible { opacity: 1; }

.section-label { font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.8px; }

.quick-templates-row { display: flex; flex-wrap: wrap; gap: 8px; }

.quick-tmpl-btn {
  display: flex; align-items: center; gap: 8px;
  background: rgba(23, 31, 48, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0; font-size: 13px; font-weight: 600;
  padding: 8px 14px; border-radius: 10px; cursor: pointer;
  transition: all 0.2s;
}

.quick-tmpl-btn:hover { border-color: rgba(99, 102, 241, 0.4); background: rgba(99, 102, 241, 0.1); }
.quick-tmpl-btn.active { border-color: #6366f1; background: rgba(99, 102, 241, 0.2); color: #fff; }

.form-group { margin-bottom: 18px; }
.form-label { display: block; font-size: 13px; font-weight: 700; color: #e2e8f0; margin-bottom: 6px; }

.form-input, .form-select {
  width: 100%; background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
  padding: 10px 14px; color: #fff; font-size: 14px; outline: none;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus { border-color: #6366f1; }

.folder-select-row { display: flex; gap: 8px; }
.folder-select-row .form-select { flex: 1; }

.btn-new-folder {
  background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3);
  color: #818cf8; border-radius: 10px; padding: 0 14px; cursor: pointer; font-size: 18px;
}

.selected-type-badge { margin-top: 18px; }
.badge-funil, .badge-email {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 600;
}
.badge-funil { background: rgba(16, 185, 129, 0.15); color: #34d399; }
.badge-email { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }

.modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 18px 28px; border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
}

.btn-primary {
  background: #6366f1; border: none; color: #fff;
  padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
}

.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
