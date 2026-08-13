<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
      <div class="create-modal">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-title-area">
            <h2><i class="bi" :class="step === 3 ? 'bi-grid-1x2-fill' : 'bi-file-earmark-plus'"></i> {{ step === 3 ? 'Escolha um template' : 'Criar nova página' }}</h2>
            <p>{{ step === 3 ? 'Veja o preview e selecione o melhor ponto de partida' : 'Defina o formato, a pasta e como deseja começar' }}</p>
          </div>
          <button class="btn-close" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </div>

        <!-- Step 1: Skeleton Selection -->
        <div v-if="step === 1" class="modal-body">
          <div class="type-cards tour-create-modal-types">
            <div
                class="type-card tour-type-card-funil"
              :class="{ active: selectedType === 'funil' }"
              @click="selectType('funil')"
            >
              <div class="type-icon" style="background: var(--color-primary-soft); color: var(--color-primary);">
                <i class="bi bi-play-btn-fill"></i>
              </div>
              <div class="type-info">
                <h3>Página VSL / Funil</h3>
                <p>Canvas vazio, largura responsiva e fundo escuro próprios para páginas de vendas.</p>
              </div>
              <div class="type-check" :class="{ visible: selectedType === 'funil' }">
                <i class="bi bi-check-circle-fill"></i>
              </div>
            </div>

            <div
                class="type-card tour-type-card-email"
              :class="{ active: selectedType === 'email' }"
              @click="selectType('email')"
            >
              <div class="type-icon" style="background: var(--color-primary-soft); color: var(--color-primary-strong);">
                <i class="bi bi-envelope-paper-fill"></i>
              </div>
              <div class="type-info">
                <h3>Página de E-mail</h3>
                <p>Canvas vazio com largura fixa de 600px e fundo azul-claro para e-mails profissionais.</p>
              </div>
              <div class="type-check" :class="{ visible: selectedType === 'email' }">
                <i class="bi bi-check-circle-fill"></i>
              </div>
            </div>
            <div class="type-card tour-type-card-quiz" :class="{ active: selectedType === 'quiz' }" @click="selectType('quiz')">
              <div class="type-icon"><i class="bi bi-ui-checks-grid"></i></div>
              <div class="type-info"><h3>Quiz interativo</h3><p>Perguntas em etapas, progresso, loading, métricas e resultado personalizado.</p></div>
              <div class="type-check" :class="{ visible: selectedType === 'quiz' }"><i class="bi bi-check-circle-fill"></i></div>
            </div>
          </div>
        </div>

        <!-- Step 2: Name & Folder -->
        <div v-else-if="step === 2" class="modal-body tour-create-details">
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">Nome da Página *</label>
              <input
                type="text"
                class="form-input tour-page-name"
                v-model="pageName"
                :placeholder="selectedType === 'email' ? 'ex: E-mail Boas-vindas' : selectedType === 'quiz' ? 'ex: Quiz Diagnóstico do Cliente' : 'ex: VSL Funil Dollar App 2026'"
                autofocus
              />
            </div>

            <div class="form-group">
              <label class="form-label">Pasta Destino</label>
              <div class="folder-select-row">
              <select class="form-select" v-model="selectedFolderId">
                  <option value="">Sem pasta (Raiz)</option>
                  <option v-for="folder in flatFolders" :key="folder.id" :value="folder.id">
                    {{ '  '.repeat(folder.depth) }}{{ folder.name }}
                  </option>
                </select>
                <button class="btn-new-folder" @click="quickCreateFolder" title="Criar nova pasta">
                  <i class="bi bi-folder-plus"></i>
                </button>
              </div>
            </div>

            <div class="selected-type-badge">
              <span :class="selectedType === 'email' ? 'badge-email' : selectedType === 'quiz' ? 'badge-quiz' : 'badge-funil'">
                <i :class="selectedType === 'email' ? 'bi bi-envelope-paper-fill' : selectedType === 'quiz' ? 'bi bi-ui-checks-grid' : 'bi bi-play-btn-fill'"></i>
                {{ selectedType === 'email' ? 'E-mail (600px fixo)' : selectedType === 'quiz' ? 'Quiz interativo (460px)' : 'Funil (largura livre)' }} — {{ templateKey ? selectedTemplateName : 'canvas em branco' }}
              </span>
            </div>
            <div class="form-group start-mode">
              <label class="form-label">Como deseja começar?</label>
              <div class="start-mode-options">
                <button type="button" class="start-mode-option" :class="{ active: !templateKey }" @click="templateKey = ''">
                  <i class="bi bi-file-earmark-plus"></i><span><strong>Canvas vazio</strong><small>Somente com o padrão da página.</small></span>
                </button>
                <button type="button" class="start-mode-option" :class="{ active: templateKey }" @click="openTemplatePicker">
                  <i class="bi bi-grid-1x2"></i><span><strong>{{ templateKey ? selectedTemplateName : 'Usar template' }}</strong><small>{{ templateKey ? 'Clique para trocar o modelo selecionado.' : 'Abrir galeria com previews.' }}</small></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Template gallery -->
        <div v-else class="modal-body template-picker-body">
          <div class="template-picker-heading">
            <span>{{ selectedType === 'email' ? 'Templates de e-mail' : selectedType === 'quiz' ? 'Templates de quiz' : 'Templates de funil/VSL' }}</span>
            <small>{{ templateOptions.length }} {{ templateOptions.length === 1 ? 'modelo disponível' : 'modelos disponíveis' }}</small>
          </div>
          <div class="template-picker-grid">
            <button
              v-for="option in templateOptions"
              :key="option.key"
              type="button"
              class="template-choice"
              :class="{ selected: templateKey === option.key }"
              @click="selectTemplate(option)"
            >
              <div class="template-preview" :class="option.type">
                <span class="preview-kind">{{ option.type === 'email' ? 'E-mail 600px' : option.type === 'quiz' ? 'Quiz interativo' : 'VSL responsiva' }}</span>
                <div v-if="option.type === 'email'" class="email-sheet-preview">
                  <div class="email-preview-header"></div>
                  <div class="preview-line wide"></div>
                  <div class="preview-line"></div>
                  <div class="preview-button"></div>
                  <div class="email-preview-footer"></div>
                </div>
                <div v-else-if="option.type === 'quiz'" class="quiz-sheet-preview"><div class="quiz-preview-progress"></div><div class="preview-line wide"></div><div class="quiz-preview-option"></div><div class="quiz-preview-option"></div><div class="preview-button"></div></div>
                <div v-else class="vsl-sheet-preview">
                  <div class="preview-line wide"></div>
                  <div class="preview-line"></div>
                  <div class="video-preview"><i class="bi bi-play-fill"></i></div>
                  <div class="preview-button"></div>
                </div>
              </div>
              <span class="template-choice-copy">
                <strong>{{ option.name }}</strong>
                <small>{{ option.description }}</small>
              </span>
              <span class="template-select-label"><i class="bi" :class="templateKey === option.key ? 'bi-check-circle-fill' : 'bi-arrow-right'"></i> {{ templateKey === option.key ? 'Selecionado' : 'Selecionar' }}</span>
            </button>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="modal-footer">
          <button class="btn-secondary" @click="handleBack">
            <i v-if="step !== 1" class="bi bi-arrow-left"></i> {{ step === 1 ? 'Cancelar' : 'Voltar' }}
          </button>

          <button
            v-if="step === 1"
            class="btn-primary tour-modal-next"
            :disabled="!selectedType"
            @click="goToDetails"
          >
            Continuar →
          </button>

          <button
            v-else-if="step === 2"
            class="btn-primary tour-create-submit"
            :disabled="!pageName.trim()"
            @click="handleCreate"
          >
            <i class="bi" :class="templateKey ? 'bi-magic' : 'bi-plus-circle-fill'"></i> {{ templateKey ? 'Criar com template' : 'Criar página' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useBuilderStore } from '../../composables/useBuilderStore';

const props = defineProps({
  isOpen: Boolean,
  initialFolderId: {
    type: [String, Number],
    default: ''
  }
});

const emit = defineEmits(['close', 'created']);

const { foldersRegistry, customTemplatesRegistry, createFolder } = useBuilderStore();

const step = ref(1);
const selectedType = ref('funil');
const pageName = ref('');
const selectedFolderId = ref('');
const templateKey = ref('');

watch(() => props.isOpen, (open) => {
  if (!open) return;
  step.value = 1;
  selectedType.value = 'funil';
  pageName.value = '';
  selectedFolderId.value = props.initialFolderId ? String(props.initialFolderId) : '';
  templateKey.value = '';
});


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

const templateOptions = computed(() => {
  const isEmail = selectedType.value === 'email';
  const isQuiz = selectedType.value === 'quiz';
  const standard = isEmail
    ? { key: 'email', name: 'E-mail profissional', description: 'Cabeçalho, conteúdo, CTA e rodapé prontos.', type: 'email' }
    : isQuiz ? { key: 'quiz', name: 'Quiz de diagnóstico', description: '5 etapas com perguntas, análise e oferta final.', type: 'quiz' }
    : { key: 'vsl', name: 'VSL de alta conversão', description: 'Headline, vídeo, CTA e prova social prontos.', type: 'funil' };

  const custom = customTemplatesRegistry
    .filter(template => {
      const category = String(template.category || '').toLowerCase();
      const templateIsEmail = Boolean(template.emailMode) || category.includes('mail');
      const templateIsQuiz = Boolean(template.quizMode) || category.includes('quiz');
      return isQuiz ? templateIsQuiz : isEmail ? templateIsEmail : !templateIsEmail && !templateIsQuiz;
    })
    .map(template => ({
      key: template.id,
      name: template.name || 'Template personalizado',
      description: template.description || 'Modelo personalizado salvo na biblioteca.',
      type: isEmail ? 'email' : isQuiz ? 'quiz' : 'funil'
    }));

  return [standard, ...custom];
});

const selectedTemplateName = computed(() => {
  return templateOptions.value.find(option => option.key === templateKey.value)?.name || 'Usar template';
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
    templateKey: templateKey.value
  });
  // Reset
  step.value = 1;
  selectedType.value = 'funil';
  pageName.value = '';
  selectedFolderId.value = '';
  templateKey.value = '';
}

function selectType(type) {
  selectedType.value = type;
  templateKey.value = '';
}

function goBackToTypes() {
  step.value = 1;
}

function handleBack() {
  if (step.value === 3) {
    step.value = 2;
    return;
  }
  if (step.value === 2) {
    goBackToTypes();
    return;
  }
  emit('close');
}

function openTemplatePicker() {
  step.value = 3;
}

function selectTemplate(option) {
  templateKey.value = option.key;
  step.value = 2;
}

function goToDetails() {
  step.value = 2;
  window.dispatchEvent(new CustomEvent('vbs-tour-progress', { detail: { name: 'create-details-opened' } }));
}

function goToDetailsFromTour() {
  goToDetails();
}

function createFromTour() {
  step.value = 2;
  if (!pageName.value.trim()) pageName.value = 'Meu primeiro projeto';
  handleCreate();
}

defineExpose({ goToDetailsFromTour, createFromTour, selectType });
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(15, 23, 42, 0.38);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}

.create-modal {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 22px;
  width: 600px;
  max-width: 96vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(14, 116, 144, 0.20);
}

.modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid var(--color-primary-soft);
}

.modal-title-area h2 { font-size: 20px; font-weight: 800; color: var(--color-text); margin-bottom: 2px; }
.modal-title-area p { font-size: 13px; color: var(--color-text-muted); }

.btn-close { background: none; border: none; color: var(--color-text-muted); font-size: 18px; cursor: pointer; padding: 4px 8px; }
.btn-close:hover { color: var(--color-primary-strong); }

.modal-body { padding: 24px 28px; overflow-y: auto; flex: 1; }

.type-cards { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }

.type-card {
  display: flex; align-items: center; gap: 16px;
  background: var(--color-surface-soft);
  border: 2px solid var(--color-primary-soft);
  border-radius: 16px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-card:hover { border-color: var(--color-border-strong); background: var(--color-primary-subtle); }
.type-card.active { border-color: var(--color-primary); background: var(--color-primary-soft); }

.type-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.type-info { flex: 1; }
.type-info h3 { font-size: 15px; font-weight: 700; color: var(--color-text); margin-bottom: 2px; }
.type-info p { font-size: 13px; color: var(--color-text-muted); line-height: 1.4; }

.type-check { color: var(--color-primary); font-size: 20px; opacity: 0; transition: opacity 0.2s; }
.type-check.visible { opacity: 1; }

.section-label { font-size: 12px; font-weight: 700; color: var(--color-text-muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.8px; }

.quick-templates-row { display: flex; flex-wrap: wrap; gap: 8px; }

.quick-tmpl-btn {
  display: flex; align-items: center; gap: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary); font-size: 13px; font-weight: 600;
  padding: 8px 14px; border-radius: 10px; cursor: pointer;
  transition: all 0.2s;
}

.quick-tmpl-btn:hover { border-color: var(--color-border-strong); background: var(--color-primary-subtle); }.quick-tmpl-btn.active { border-color: var(--color-primary); background: var(--color-primary-soft); color: var(--color-primary-strong); }

.form-group { margin-bottom: 18px; }
.form-label { display: block; font-size: 13px; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 6px; }

.form-input, .form-select {
  width: 100%; background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: 10px;
  padding: 10px 14px; color: var(--color-text); font-size: 14px; outline: none;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-soft); }

.folder-select-row { display: flex; gap: 8px; }
.folder-select-row .form-select { flex: 1; }

.btn-new-folder {
  background: var(--color-primary-soft); border: 1px solid var(--color-border-strong);
  color: var(--color-primary-strong); border-radius: 10px; padding: 0 14px; cursor: pointer; font-size: 18px;
}

.selected-type-badge { margin-top: 18px; }
.badge-funil, .badge-email, .badge-quiz {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 600;
}
.badge-funil,.badge-email,.badge-quiz { background:var(--color-primary-soft); color:var(--color-primary-strong); }

.start-mode { margin-top: 22px; }
.start-mode-options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.start-mode-option { display: flex; align-items: flex-start; gap: 9px; padding: 12px; text-align: left; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-text-secondary); cursor: pointer; font: inherit; }
.start-mode-option i { color: var(--color-primary-hover); font-size: 17px; margin-top: 2px; }.start-mode-option span { display: flex; flex-direction: column; gap: 3px; }.start-mode-option strong { font-size: 12px; }.start-mode-option small { color: var(--color-text-muted); font-size: 11px; line-height: 1.35; }
.start-mode-option.active { border-color: var(--color-primary); background: var(--color-primary-soft); }.start-mode-option.active strong { color: var(--color-primary-strong); }

.modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 18px 28px; border-top: 1px solid var(--color-primary-soft);
}

.btn-secondary {
  background: var(--color-surface); border: 1px solid var(--color-border);
  color: var(--color-text-secondary); padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
}

.btn-primary {
  background: var(--color-primary); border: none; color: var(--color-surface);
  padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
}

.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

.template-picker-body { background: var(--color-surface); }
.template-picker-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; color: var(--color-text); font-weight: 800; }
.template-picker-heading small { color: var(--color-text-muted); font-size: 11px; font-weight: 600; }
.template-picker-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.template-choice { padding: 0; overflow: hidden; text-align: left; border: 1px solid var(--color-border); border-radius: 14px; background: var(--color-surface); color: var(--color-text); cursor: pointer; font: inherit; transition: border-color .18s ease, transform .18s ease, box-shadow .18s ease; }
.template-choice:hover { border-color: var(--color-primary-border); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.template-choice.selected { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-focus-ring); }
.template-preview { position: relative; height: 145px; display: grid; place-items: center; overflow: hidden; background: var(--color-primary-subtle); border-bottom: 1px solid var(--color-border); }
.preview-kind { position: absolute; z-index: 2; top: 9px; left: 9px; padding: 4px 8px; border: 1px solid var(--color-border); border-radius: 999px; background: var(--color-surface); color: var(--color-primary-strong); font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
.email-sheet-preview, .vsl-sheet-preview, .quiz-sheet-preview { width: 70%; height: 78%; padding: 14px 12px 10px; display: flex; flex-direction: column; gap: 7px; border: 1px solid var(--color-border-strong); border-radius: 8px; background: var(--color-surface); }
.quiz-sheet-preview{width:48%;border-radius:14px}.quiz-preview-progress{height:4px;background:var(--color-primary);border-radius:9px}.quiz-preview-option{height:18px;border:1px solid var(--color-border);border-radius:7px}
.email-sheet-preview { width: 56%; padding: 0 10px 8px; }
.email-preview-header, .email-preview-footer { height: 15px; margin: 0 -10px; background: var(--color-primary); }
.email-preview-footer { height: 11px; margin-top: auto; }
.preview-line { width: 58%; height: 6px; border-radius: 4px; background: var(--color-primary-border); }
.preview-line.wide { width: 88%; margin-top: 8px; }
.preview-button { width: 42%; height: 12px; margin-top: auto; border-radius: 4px; background: var(--color-primary); }
.video-preview { flex: 1; display: grid; place-items: center; border-radius: 6px; background: var(--color-primary-soft); color: var(--color-primary); font-size: 22px; }
.template-choice-copy { display: flex; flex-direction: column; gap: 3px; padding: 12px 12px 6px; }
.template-choice-copy strong { font-size: 13px; }
.template-choice-copy small { color: var(--color-text-muted); font-size: 10.5px; line-height: 1.35; }
.template-select-label { display: flex; align-items: center; justify-content: flex-end; gap: 5px; padding: 6px 12px 12px; color: var(--color-primary-strong); font-size: 11px; font-weight: 800; }

@media (max-width: 520px) {
  .modal-header, .modal-body, .modal-footer { padding-left: 18px; padding-right: 18px; }
  .start-mode-options, .template-picker-grid { grid-template-columns: 1fr; }
  .template-preview { height: 125px; }
  .modal-footer { justify-content: stretch; }
  .modal-footer button { flex: 1; justify-content: center; }
}
</style>
