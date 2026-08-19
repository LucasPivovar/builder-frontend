<template>
  <div :style="containerStyle">
    <a
      :href="element.acceptUrl || '#'"
      :target="element.acceptOpenInNewTab ? '_blank' : '_self'"
      class="canvas-pitch-btn is-pulsing"
      :style="acceptButtonStyle"
    >
      <span style="font-size: 16px; display: block;" v-html="parsedAccept"></span>
      <span v-if="element.acceptSubtext" style="font-size: 12px; opacity: 0.9; display: block; margin-top: 4px;" v-html="parsedSub"></span>
    </a>

    <a
      :href="element.declineUrl || '#'"
      :target="element.declineOpenInNewTab ? '_blank' : '_self'"
      style="background: rgba(220,38,38,0.1); color: #DC2626; border: 1px solid rgba(220,38,38,0.3); border-radius: 8px; padding: 10px 20px; font-size: 13px; text-decoration: none;"
    >
      {{ element.declineText || 'Não, obrigado. Prefiro continuar operando manualmente.' }}
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { parseAstrotags as parseAtomitags, hexToRgba, getNum } from '../../utils/astrotags';

const props = defineProps({
  element: { type: Object, required: true }
});

const containerStyle = computed(() => {
  const s = props.element.style || {};
  const mt = getNum(s.marginTop, 20);
  const mb = getNum(s.marginBottom, 20);
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginTop: `${mt}px`,
    marginBottom: `${mb}px`,
    width: '100%'
  };
});

const acceptButtonStyle = computed(() => {
  const s = props.element.style || {};

  let bg = s.bgColor || '#10B981';
  if (s.hasTransparentBg) {
    bg = 'transparent';
  } else if (s.bgOpacity !== undefined && s.bgOpacity !== null && s.bgOpacity !== '' && Number(s.bgOpacity) < 1) {
    bg = hexToRgba(bg, Number(s.bgOpacity));
  }

  let border = 'none';
  if (s.hasBorder) {
    border = `${getNum(s.borderWidth, 2)}px ${s.borderStyle || 'solid'} ${s.borderColor || '#ffffff'}`;
  }

  const py = getNum(s.paddingVertical, 14);
  const px = getNum(s.paddingHorizontal, 24);
  const br = getNum(s.borderRadius, 12);

  return {
    background: bg,
    color: s.textColor || '#ffffff',
    maxWidth: (s.maxWidth && s.maxWidth.trim()) ? s.maxWidth.trim() : '420px',
    maxHeight: (s.maxHeight && s.maxHeight.trim()) ? s.maxHeight.trim() : undefined,
    borderRadius: `${br}px`,
    border: border,
    padding: `${py}px ${px}px`,
    textAlign: 'center',
    textDecoration: 'none',
    width: '100%',
    fontWeight: '700',
    boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
  };
});

const parsedAccept = computed(() => parseAtomitags(props.element.acceptText || 'SIM! ADQUIRA AGORA POR APENAS R$ 97,00'));
const parsedSub = computed(() => parseAtomitags(props.element.acceptSubtext || ''));
</script>
