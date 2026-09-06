<template>
  <div class="sp-editor-panel">
    <!-- SEÇÃO SUPERIOR: DIVISÃO EM 2 COLUNAS (CONTEÚDO À ESQUERDA | PREVIEW À DIREITA) -->
    <div class="sp-top-split">
      
      <!-- COLUNA ESQUERDA: CONTEÚDO DO POPUP (TÍTULOS, ÍCONE, TEXTOS E CAMPOS) -->
      <div class="sp-col-content">
        
        <!-- CARD 1: TEXTOS, TÍTULO E ÍCONE DO MODAL -->
        <div class="sp-card">
          <div class="sp-card-title">
            <i class="bi bi-type-bold"></i>
            <span>Conteúdo: Textos, Título e Ícone</span>
          </div>

          <div class="sp-grid-2">
            <div class="sp-field-group">
              <div class="sp-label-row">
                <label>Faixa Destaque Topo</label>
                <label class="sp-toggle-inline">
                  <input type="checkbox" v-model="form.showBadge" /> Ativa
                </label>
              </div>
              <input
                v-model="form.badgeText"
                :disabled="!form.showBadge"
                placeholder="🔴 CONTEÚDO EXCLUSIVO"
                maxlength="80"
                class="sp-input"
              />
            </div>

            <div class="sp-field-group">
              <label>Ícone Central</label>
              <select v-model="form.icon" class="sp-input">
                <option value="lock">🔒 Cadeado (Conteúdo Bloqueado)</option>
                <option value="star">⭐ Estrela (Destaque VIP)</option>
                <option value="fire">🔥 Fogo (Oferta Limitada)</option>
                <option value="gift">🎁 Presente (Bônus Especial)</option>
                <option value="bell">🔔 Sino (Aviso Urgente)</option>
                <option value="shield">🛡️ Escudo (Segurança)</option>
                <option value="play">▶️ Play (Continuar Vídeo)</option>
                <option value="none">Nenhum Ícone</option>
              </select>
            </div>
          </div>

          <div class="sp-grid-2" style="margin-top: 10px;">
            <div class="sp-field-group">
              <label>Título do Modal</label>
              <input v-model="form.title" placeholder="DESBLOQUEIE O VÍDEO" maxlength="120" class="sp-input" />
            </div>

            <div class="sp-field-group">
              <label>Subtítulo / Mensagem</label>
              <input v-model="form.subtitle" placeholder="Preencha os dados abaixo para continuar assistindo o vídeo." maxlength="250" class="sp-input" />
            </div>
          </div>

          <div class="sp-field-group" style="margin-top: 10px;">
            <label>Texto do Botão de Envio (CTA)</label>
            <input v-model="form.submitText" placeholder="LIBERAR ACESSO" maxlength="80" class="sp-input" />
          </div>
          <div class="sp-field-group" style="margin-top: 10px;">
            <div class="sp-label-row">
              <label>Texto de Segurança (Rodapé)</label>
              <label class="sp-toggle-inline"><input type="checkbox" v-model="form.showFooter" /> Ativo</label>
            </div>
            <input v-model="form.footerText" :disabled="!form.showFooter" placeholder="🛡️ Seus dados estão protegidos" maxlength="100" class="sp-input" />
          </div>
        </div>

        <!-- CARD 2: CAMPOS DO FORMULÁRIO (COLETA DE LEADS) -->
        <div class="sp-card">
          <div class="sp-card-header-flex">
            <div class="sp-card-title">
              <i class="bi bi-ui-checks-grid"></i>
              <span>Campos do Formulário (Coleta de Leads)</span>
            </div>

            <!-- DROPDOWN PARA ADICIONAR ELEMENTOS EM CARDS -->
            <div ref="dropdownRef" class="sp-dropdown-wrapper">
              <button type="button" class="sp-btn-add" @click="dropdownOpen = !dropdownOpen">
                <i class="bi bi-plus-lg"></i> Adicionar Campo <i class="bi bi-chevron-down" style="font-size:10px;"></i>
              </button>

              <div v-if="dropdownOpen" class="sp-dropdown-menu">
                <div class="sp-dropdown-header">Escolha o campo para adicionar:</div>
                <button type="button" class="sp-dropdown-item" @click="addField('text', '')">
                  <span class="sp-drop-icon"><i class="bi bi-input-cursor-text"></i></span>
                  <div class="sp-drop-info"><strong>Input personalizado</strong><small>Defina o tipo e o placeholder do campo</small></div>
                </button>
              </div>
            </div>
          </div>

          <!-- LISTA DE CAMPOS COMPACTA EM LINHA -->
          <div v-if="!form.fields || !form.fields.length" class="sp-empty-fields">
            Nenhum campo adicionado. Clique no botão "+ Adicionar Campo" acima para inserir.
          </div>

          <div v-else class="sp-fields-list">
            <div v-for="(field, index) in form.fields" :key="field.id" class="sp-field-inline-row">
              <span class="sp-row-index">{{ index + 1 }}</span>

              <select v-model="field.inputType" class="sp-inline-select" title="Tipo do input">
                <option value="text">Texto</option>
                <option value="tel">WhatsApp</option>
                <option value="email">E-mail</option>
                <option value="number">Número</option>
              </select>

              <input
                v-model="field.placeholder"
                class="sp-inline-input"
                placeholder="Texto de exemplo no campo (placeholder)"
                maxlength="160"
              />

              <label class="sp-inline-req" title="Marcar como preenchimento obrigatório">
                <input type="checkbox" v-model="field.required" />
                <span>Obrigatório</span>
              </label>

              <div class="sp-inline-actions">
                <button
                  type="button"
                  class="sp-btn-icon"
                  :disabled="index === 0"
                  title="Mover para cima"
                  @click="moveField(index, -1)"
                >
                  ↑
                </button>
                <button
                  type="button"
                  class="sp-btn-icon"
                  :disabled="index === form.fields.length - 1"
                  title="Mover para baixo"
                  @click="moveField(index, 1)"
                >
                  ↓
                </button>
                <button
                  type="button"
                  class="sp-btn-icon sp-btn-del"
                  title="Excluir este campo"
                  @click="form.fields.splice(index, 1)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- COLUNA DIREITA: PREVIEW DO POPUP EM TEMPO REAL -->
      <div class="sp-col-preview">
        <div class="sp-preview-box">
          <div class="sp-preview-bar">
            <div class="sp-preview-tag">
              <span class="sp-live-dot"></span>
              <span>PREVIEW EM TEMPO REAL</span>
            </div>
            <span class="sp-preview-dim">Largura: {{ form.maxWidth || 500 }}px</span>
          </div>

          <div
            class="sp-preview-stage"
            :style="{
              backgroundColor: pageSettings?.bgColor || '#0d0d12',
              fontFamily: `'${pageSettings?.fontFamily || 'Roboto'}', -apple-system, sans-serif`
            }"
          >
            <SmartPopupElement :element="form" mode="preview" />
          </div>
        </div>
      </div>

    </div>

    <section class="sp-card">
      <div class="sp-card-title"><i class="bi bi-palette"></i> Aparência do formulário</div>
      <div class="sp-grid-4">
        <label class="sp-field-group">Fonte dos textos<select v-model="form.appearance.font" class="sp-input"><option>Montserrat</option><option>Poppins</option><option>Arial</option><option>Roboto</option></select></label>
        <label class="sp-field-group">Fonte do título<select v-model="form.appearance.titleFont" class="sp-input"><option>Poppins</option><option>Montserrat</option><option>Arial</option><option>Roboto</option></select></label>
        <label class="sp-field-group">Tamanho do título<input v-model.number="form.appearance.titleSize" type="number" min="16" max="60" class="sp-input" /></label>
        <label class="sp-field-group">Tamanho dos campos<input v-model.number="form.appearance.inputSize" type="number" min="12" max="28" class="sp-input" /></label>
        <label class="sp-field-group">Arredondamento dos campos<input v-model.number="form.appearance.radius" type="number" min="0" max="32" class="sp-input" /></label>
      </div>
      <div class="sp-color-controls">
        <label v-for="control in colorControls" :key="control.key" class="sp-color-control" :title="control.hint || control.label">
          <span>{{ control.label }}</span>
          <input :value="form.appearance[control.key]" @input="form.appearance[control.key] = $event.target.value" @change="form.appearance[control.key] = $event.target.value" type="color" class="sp-color-dot" :aria-label="control.label" />
        </label>
      </div>
    </section>

    <section class="sp-card">
      <div class="sp-card-title"><i class="bi bi-link-45deg"></i> Integração Sellflux</div>
      <label class="sp-field-group">URL do webhook
        <input v-model.trim="form.webhook.url" type="url" class="sp-input" placeholder="Cole o webhook da sua integração Sellflux" />
      </label>
      <div v-if="form.webhook.url" class="sp-grid-3" style="margin-top:12px">
        <label v-for="mapping in webhookMappings" :key="mapping.key" class="sp-field-group">{{ mapping.label }}
          <select v-model="form.webhook[mapping.key]" class="sp-input"><option value="">Não enviar</option><option v-for="field in form.fields" :key="field.id" :value="field.id">{{ field.placeholder || 'Campo sem nome' }}</option></select>
        </label>
      </div>
      <p class="sp-tip-footer">Salve o popup e a página para ativar. As respostas ficam nas métricas mesmo se o Sellflux estiver indisponível.</p>
    </section>
    <!-- SEÇÃO INFERIOR: O RESTO (GATILHO DE ABERTURA, COMPORTAMENTO E TAMANHO) -->
    <div class="sp-bottom-section">
      <div class="sp-card">
        <div class="sp-card-title">
          <i class="bi bi-sliders"></i>
          <span>Gatilho de Abertura, Comportamento & Segurança</span>
        </div>

        <div class="sp-grid-4">
          <div class="sp-field-group">
            <label>Como o modal deve abrir?</label>
            <select v-model="form.trigger" class="sp-input">
              <option value="exit">🚪 Ao tentar sair da página (Exit Intent)</option>
              <option value="time">⏱️ Após segundos na página</option>
              <option value="entry">⚡ Ao entrar na página (Imediato)</option>
            </select>
          </div>

          <div v-if="form.trigger === 'time'" class="sp-field-group">
            <label>Tempo na Página (segundos)</label>
            <input v-model.number="form.openDelay" type="number" min="0" max="3600" placeholder="Ex: 5" class="sp-input" />
          </div>

          <div v-else class="sp-field-group">
            <label>Comportamento</label>
            <input
              :value="form.trigger === 'exit' ? 'Detecta cursor para fechar a aba' : 'Abre assim que a página carregar'"
              disabled
              class="sp-input sp-input-disabled"
            />
          </div>

          <div class="sp-field-group">
            <label>Largura Máxima (px)</label>
            <input v-model.number="form.maxWidth" type="number" min="320" max="800" placeholder="500" class="sp-input" />
          </div>

        </div>

        <div class="sp-tip-footer">
          <i class="bi bi-info-circle-fill"></i>
          <span>Ao clicar em enviar no site, as respostas são salvas nas <strong>Métricas</strong> da página e o modal fecha imediatamente para o visitante.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { popupAppearanceDefaults } from '../utils/popupAppearance';
import SmartPopupElement from './elements/SmartPopupElement.vue';

const props = defineProps({
  element: { type: Object, required: true },
  pageSettings: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update']);

function genId() {
  return 'f-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}

// Normaliza propriedades com padrões fieis ao design da imagem
const raw = JSON.parse(JSON.stringify(props.element || {}));

const form = reactive({
  ...raw,
  trigger: raw.trigger === 'video' ? 'time' : raw.trigger || 'exit',
  openDelay: raw.openDelay ?? 5,
  videoDelay: raw.videoDelay ?? 60,
  maxWidth: raw.maxWidth || 500,
  showBadge: raw.showBadge ?? true,
  badgeText: raw.badgeText ?? '🔴 CONTEÚDO EXCLUSIVO',
  icon: raw.icon || 'lock',
  title: raw.title ?? 'DESBLOQUEIE O VÍDEO',
  subtitle: raw.subtitle ?? 'Preencha os dados abaixo para continuar assistindo o vídeo.',
  submitText: raw.submitText ?? 'LIBERAR ACESSO',
  showFooter: raw.showFooter ?? true,
  footerText: raw.footerText ?? '🛡️ Seus dados estão protegidos',
  fields: Array.isArray(raw.fields)
    ? raw.fields
    : (Array.isArray(raw.blocks) && raw.blocks.some(b => b.type === 'field'))
      ? raw.blocks.filter(b => b.type === 'field').map(b => ({ id: b.id, inputType: b.inputType || 'text', placeholder: b.placeholder || b.label || 'Digite aqui', required: !!b.required }))
      : [
          { id: genId(), inputType: 'text', placeholder: 'Seu Nome', required: true },
          { id: genId(), inputType: 'tel', placeholder: 'Whatsapp', required: true }
        ]
});

form.appearance = { ...popupAppearanceDefaults, ...(raw.appearance || {}) };
form.webhook = { url: '', name: '', email: '', phone: '', ...(raw.webhook || {}) };
const webhookMappings = [{ key: 'name', label: 'Campo de nome' }, { key: 'email', label: 'Campo de e-mail' }, { key: 'phone', label: 'Campo de telefone' }];
form.appearance.primaryColor = raw.appearance?.primaryColor || form.appearance.accent;
const colorControls = [
  { key: 'primaryColor', label: 'Cor principal', hint: 'Faixa, ícone, bordas e botão' },
  { key: 'titleColor', label: 'Título' },
  { key: 'buttonColor', label: 'Texto do botão' }
];
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

function handleDocClick(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocClick);
});

function addField(type, defaultPlaceholder) {
  if (form.fields.length >= 20) return;
  form.fields.push({
    id: genId(),
    inputType: type,
    placeholder: defaultPlaceholder,
    required: true
  });
  dropdownOpen.value = false;
}

function moveField(index, delta) {
  const [item] = form.fields.splice(index, 1);
  form.fields.splice(index + delta, 0, item);
}

// Sincroniza element.blocks para manter 100% de compatibilidade legada
function getDraft() {
    const copy = JSON.parse(JSON.stringify(form));
    copy.blocks = (copy.fields || []).map(f => ({
      id: f.id,
      type: 'field',
      inputType: f.inputType,
      label: f.placeholder,
      placeholder: f.placeholder,
      required: f.required
    }));
    copy.blocks.push({ id: 'btn-' + copy.id, type: 'submit', text: copy.submitText });
    return copy;
}

defineExpose({ getDraft });
watch(form, () => emit('update', getDraft()), { deep: true, immediate: true, flush: 'sync' });
</script>

<style scoped>
.sp-editor-panel {
  padding: 16px 20px 24px;
  color: var(--color-text);
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

/* ========== SEÇÃO SUPERIOR EM 2 COLUNAS (CONTEÚDO ESQ | PREVIEW DIR) ========== */
.sp-top-split {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 18px;
  align-items: start;
}

@media (max-width: 1080px) {
  .sp-top-split {
    grid-template-columns: 1fr;
  }
}

.sp-col-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ========== COLUNA PREVIEW DIREITA ========== */
.sp-col-preview {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
}

.sp-preview-box {
  background: var(--color-surface, #181920);
  border: 1px solid var(--color-border, rgba(255,255,255,0.1));
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
}

.sp-preview-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 18px;
  background: rgba(0, 0, 0, 0.35);
  border-bottom: 1px solid var(--color-border, rgba(255,255,255,0.08));
}

.sp-preview-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  color: #22c55e;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.sp-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 10px #22c55e;
  animation: spPulse 2s infinite ease-in-out;
}

@keyframes spPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.sp-preview-dim {
  font-size: 11.5px;
  font-weight: 700;
  color: #94a3b8;
}

.sp-preview-stage {
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
  max-height: 64vh;
  overflow-y: auto;
  border-radius: 0 0 14px 14px;
  box-sizing: border-box;
}

/* ========== CARDS GERAIS ========== */
.sp-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px 18px;
}

.sp-card-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-strong, #6366f1);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.sp-card-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  position: relative;
}

.sp-grid-4 {
  display: grid;
  grid-template-columns: 1.5fr 1.1fr 1fr 1.5fr;
  gap: 12px;
}

.sp-grid-3 {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr;
  gap: 12px;
}

.sp-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 900px) {
  .sp-grid-4 {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .sp-grid-4, .sp-grid-3, .sp-grid-2 {
    grid-template-columns: 1fr;
  }
}

.sp-field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sp-color-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  margin-top: 18px;
}

.sp-color-control {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  cursor: pointer;
}

.sp-color-dot {
  appearance: none;
  width: 30px;
  height: 30px;
  min-width: 30px;
  padding: 3px;
  border: 1px solid var(--color-border, #ddd);
  border-radius: 50%;
  background: var(--color-surface, #fff);
  cursor: pointer;
  overflow: hidden;
}

.sp-color-dot::-webkit-color-swatch-wrapper { padding: 0; }
.sp-color-dot::-webkit-color-swatch { border: 0; border-radius: 50%; }
.sp-color-dot::-moz-color-swatch { border: 0; border-radius: 50%; }
.sp-color-dot:focus-visible { outline: 2px solid var(--color-primary, #6432ff); outline-offset: 3px; }

.sp-field-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.sp-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sp-toggle-inline {
  font-size: 11px;
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.sp-input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  font-size: 13px;
  background: var(--color-surface-soft, #fafafa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-family: inherit;
}

.sp-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.sp-input-disabled {
  opacity: 0.7;
  background: rgba(0,0,0,0.03);
  cursor: not-allowed;
}

/* ========== DROPDOWN DE ADICIONAR CAMPOS ========== */
.sp-dropdown-wrapper {
  position: relative;
}

.sp-btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-primary-soft, rgba(99, 102, 241, 0.1));
  color: var(--color-primary-strong, #6366f1);
  border: 1px solid var(--color-primary-subtle, rgba(99, 102, 241, 0.3));
  border-radius: 8px;
  padding: 7px 13px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sp-btn-add:hover {
  background: var(--color-primary);
  color: #ffffff;
}

.sp-dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 1000;
  width: 250px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.25);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sp-dropdown-header {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-muted);
  padding: 6px 8px 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sp-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}

.sp-dropdown-item:hover {
  background: var(--color-primary-soft, rgba(99, 102, 241, 0.08));
}

.sp-drop-icon {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
}

.sp-drop-info {
  display: flex;
  flex-direction: column;
}

.sp-drop-info strong {
  font-size: 12.5px;
}

.sp-drop-info small {
  font-size: 10.5px;
  color: var(--color-text-muted);
}

/* ========== LINHAS DE CAMPOS COMPACTAS (1 LINHA POR CAMPO) ========== */
.sp-fields-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sp-empty-fields {
  font-size: 12px;
  color: var(--color-text-muted);
  padding: 16px;
  text-align: center;
  background: var(--color-surface-soft);
  border-radius: 8px;
}

.sp-field-inline-row {
  display: grid;
  grid-template-columns: 24px 130px 1fr 110px 84px;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--color-surface-soft, #fafafa);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .sp-field-inline-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

.sp-row-index {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-align: center;
}

.sp-inline-select {
  padding: 7px 10px;
  font-size: 12.5px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-family: inherit;
}

.sp-inline-input {
  padding: 7px 10px;
  font-size: 12.5px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}

.sp-inline-req {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--color-text-secondary);
  cursor: pointer;
  white-space: nowrap;
}

.sp-inline-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}

.sp-btn-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.sp-btn-icon:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.sp-btn-del {
  color: #ef4444;
}

.sp-btn-del:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

/* ========== SEÇÃO INFERIOR ========== */
.sp-bottom-section {
  display: flex;
  flex-direction: column;
}

.sp-tip-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 11.5px;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.sp-tip-footer i {
  color: var(--color-primary);
  font-size: 13px;
  flex-shrink: 0;
}
</style>
