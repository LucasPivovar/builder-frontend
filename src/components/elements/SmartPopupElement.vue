<template>
  <!-- CANVAS MODE: Barra compacta no editor sem poluir o layout da página -->
  <div v-if="mode === 'canvas'" class="sp-canvas-widget">
    <div class="sp-canvas-left">
      <div class="sp-canvas-icon-box"><i class="bi bi-window-stack"></i></div>
      <div class="sp-canvas-details">
        <div class="sp-canvas-heading">
          <span class="sp-canvas-tag">MODAL DE CONVERSÃO</span>
          <strong class="sp-canvas-name">{{ element.title || 'DESBLOQUEIE O VÍDEO' }}</strong>
        </div>
        <div class="sp-canvas-trigger-info">
          <i :class="triggerIcon"></i> Gatilho: <strong>{{ triggerText }}</strong>
          <span class="sp-dot">·</span>
          <span>Max: {{ element.maxWidth || 500 }}px</span>
          <span class="sp-dot">·</span>
          <span class="sp-note">Permanece oculto na tela e abre pelo gatilho configurado</span>
        </div>
      </div>
    </div>
    <div class="sp-canvas-actions">
      <span class="sp-canvas-edit-hint"><i class="bi bi-pencil-fill"></i> Editar Modal</span>
    </div>
  </div>

  <!-- PREVIEW MODE: Visualização fiel e idêntica ao design do popup modal -->
  <div v-else class="sp-modal-preview-wrapper smart-popup-theme" :style="{ ...popupVariables(element), maxWidth: (element.maxWidth || 500) + 'px' }">
    <!-- Faixa Destaque Topo -->
    <div v-if="element.showBadge !== false && (element.badgeText || '').trim()" class="sp-top-badge">
      <span class="sp-badge-dot">●</span> {{ element.badgeText || 'CONTEÚDO EXCLUSIVO' }}
    </div>

    <div class="sp-modal-card-body">
      <!-- Botão Fechar discreto para visualização realista -->
      <button type="button" class="sp-preview-close-btn" aria-label="Fechar">×</button>

      <!-- Ícone Central Circular -->
      <div v-if="element.icon && element.icon !== 'none'" class="sp-icon-circle">
        <i :class="getIconClass(element.icon)"></i>
      </div>

      <!-- Título Principal -->
      <h3 class="sp-modal-title">{{ element.title || 'DESBLOQUEIE O VÍDEO' }}</h3>

      <!-- Subtítulo / Descrição -->
      <p v-if="element.subtitle" class="sp-modal-subtitle">{{ element.subtitle }}</p>

      <!-- Formulário com inputs (sem labels externas, apenas placeholders) -->
      <div class="sp-form-fields">
        <template v-for="field in renderedFields" :key="field.id">
          <div class="sp-input-wrap">
            <input
              :type="field.inputType || 'text'"
              :placeholder="field.placeholder + (field.required ? ' *' : '')"
              disabled
              class="sp-field-input"
            />
          </div>
        </template>

        <!-- Botão CTA Principal -->
        <button type="button" class="sp-submit-btn">
          {{ element.submitText || 'LIBERAR ACESSO' }}
        </button>

        <!-- Selo de Segurança / Rodapé -->
        <div v-if="element.showFooter !== false && (element.footerText || '').trim()" class="sp-footer-trust">
          <i class="bi bi-shield-check"></i> {{ element.footerText || 'Seus dados estão protegidos' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { popupVariables } from '../../utils/popupAppearance';

const props = defineProps({
  element: { type: Object, required: true },
  mode: { type: String, default: 'preview' } // 'canvas' | 'preview'
});

const renderedFields = computed(() => {
  if (Array.isArray(props.element.fields)) {
    return props.element.fields;
  }
  if (Array.isArray(props.element.blocks) && props.element.blocks.some(b => b.type === 'field')) {
    return props.element.blocks
      .filter(b => b.type === 'field')
      .map(b => ({
        id: b.id,
        inputType: b.inputType || 'text',
        placeholder: b.placeholder || b.label || 'Digite aqui',
        required: !!b.required
      }));
  }
  return [
    { id: 'f1', inputType: 'text', placeholder: 'Seu Nome', required: true },
    { id: 'f2', inputType: 'tel', placeholder: 'Whatsapp', required: true }
  ];
});

const triggerText = computed(() => {
  const t = props.element.trigger;
  if (t === 'exit') return 'Ao tentar sair da página (Exit Intent)';
  if (t === 'video') return `Aos ${props.element.videoDelay || 60}s do vídeo`;
  if (t === 'time') return `Após ${props.element.openDelay || 5}s na página`;
  if (t === 'entry') return 'Ao entrar na página (Imediato)';
  return 'Ao tentar sair da página';
});

const triggerIcon = computed(() => {
  const t = props.element.trigger;
  if (t === 'exit') return 'bi bi-box-arrow-right';
  if (t === 'video') return 'bi bi-play-circle-fill';
  if (t === 'time') return 'bi bi-stopwatch-fill';
  if (t === 'entry') return 'bi bi-lightning-charge-fill';
  return 'bi bi-window-stack';
});

function getIconClass(icon) {
  const map = {
    lock: 'bi bi-lock-fill',
    star: 'bi bi-star-fill',
    fire: 'bi bi-fire',
    gift: 'bi bi-gift-fill',
    bell: 'bi bi-bell-fill',
    shield: 'bi bi-shield-fill-check',
    play: 'bi bi-play-circle-fill'
  };
  return map[icon] || (icon?.startsWith('bi ') ? icon : 'bi bi-lock-fill');
}
</script>

<style scoped>
/* ========== MODO CANVAS (COMPACTO) ========== */
.sp-canvas-widget {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 18px;
  background: linear-gradient(135deg, rgba(30, 27, 46, 0.95), rgba(20, 18, 30, 0.95));
  border: 1px dashed rgba(229, 169, 36, 0.6);
  border-radius: 12px;
  color: #f4f4f5;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  margin: 6px 0;
}
.sp-canvas-widget:hover {
  border-color: #e5a924;
  background: linear-gradient(135deg, rgba(38, 33, 58, 0.98), rgba(26, 23, 40, 0.98));
  transform: translateY(-1px);
}
.sp-canvas-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.sp-canvas-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(229, 169, 36, 0.15);
  border: 1px solid rgba(229, 169, 36, 0.3);
  color: #e5a924;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.sp-canvas-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sp-canvas-heading {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sp-canvas-tag {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #e5a924;
  background: rgba(229, 169, 36, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
}
.sp-canvas-name {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}
.sp-canvas-trigger-info {
  font-size: 12px;
  color: #a1a1aa;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.sp-canvas-trigger-info strong {
  color: #e5a924;
}
.sp-dot {
  color: #52525b;
}
.sp-note {
  font-size: 11px;
  color: #71717a;
  font-style: italic;
}
.sp-canvas-edit-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #e5a924;
  background: rgba(229, 169, 36, 0.1);
  border: 1px solid rgba(229, 169, 36, 0.25);
  padding: 8px 14px;
  border-radius: 8px;
  white-space: nowrap;
}

/* ========== MODO PREVIEW (IDÊNTICO À FOTO) ========== */
.sp-modal-preview-wrapper {
  width: 100%;
  margin: 0 auto;
  background: #0d0d10;
  border: 1px solid #26262b;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.85);
  color: #ffffff;
  font-family: 'Poppins', 'Montserrat', -apple-system, sans-serif;
  text-align: center;
}
.sp-top-badge {
  background: #e5a924;
  color: #1a1505;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
  padding: 9px 16px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.sp-badge-dot {
  color: #dc2626;
  font-size: 11px;
}
.sp-modal-card-body {
  padding: 36px 28px 28px;
  position: relative;
}
.sp-preview-close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  border: none;
  background: transparent;
  color: #71717a;
  font-size: 22px;
  line-height: 1;
  padding: 4px;
  cursor: default;
}
.sp-icon-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  margin: 0 auto 22px;
  background: #18181c;
  border: 1px solid rgba(229, 169, 36, 0.45);
  box-shadow: 0 0 28px rgba(229, 169, 36, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5a924;
  font-size: 28px;
}
.sp-modal-title {
  font-size: 26px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #ffffff;
  margin: 0 0 10px;
  line-height: 1.2;
}
.sp-modal-subtitle {
  font-size: 13.5px;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0 auto 22px;
  max-width: 380px;
}
.sp-form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  margin: 0 auto;
}
.sp-input-wrap {
  width: 100%;
}
.sp-field-input {
  width: 100%;
  box-sizing: border-box;
  background: #17181c !important;
  border: 1px solid #272830 !important;
  border-radius: 10px !important;
  padding: 14px 16px !important;
  color: #ffffff !important;
  font-size: 14.5px !important;
  text-align: left;
  font-family: inherit;
}
.sp-field-input::placeholder {
  color: #636879 !important;
  opacity: 1;
}
.sp-submit-btn {
  width: 100%;
  background: linear-gradient(180deg, #f5c43d, #df9e19);
  color: #111111;
  font-weight: 900;
  font-size: 16px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 5px 22px rgba(223, 158, 25, 0.38);
  margin-top: 2px;
  font-family: inherit;
}
.sp-footer-trust {
  font-size: 12px;
  color: #636879;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
}
.sp-footer-trust i {
  color: #636879;
}
</style>
