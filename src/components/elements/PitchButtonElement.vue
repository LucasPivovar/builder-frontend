<template>
  <div :style="{ textAlign: element.style?.align || 'center', width: '100%' }">
    <a
      :href="element.url || '#'"
      :target="element.openInNewTab !== false ? '_blank' : '_self'"
      class="canvas-pitch-btn"
      :class="{ 'is-glow': element.style?.isGlow }"
      :style="computedBtnStyle"
    >
      <span style="font-size: 18px; display: block;" v-html="parsedMain"></span>
      <span v-if="element.subtext" style="font-size: 13px; opacity: 0.9; display: block; margin-top: 4px; font-weight: 500;" v-html="parsedSub"></span>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { parseAtomitags, hexToRgba } from '../../utils/atomitags';

const props = defineProps({
  element: { type: Object, required: true }
});

const computedBtnStyle = computed(() => {
  const s = props.element.style || {};

  let bg = s.bgColor || '#10b981';
  if (s.hasTransparentBg) {
    bg = 'transparent';
  } else if (s.bgOpacity !== undefined && s.bgOpacity < 1) {
    bg = hexToRgba(bg, s.bgOpacity);
  }

  let border = 'none';
  if (s.hasBorder) {
    const bw = s.borderWidth || 2;
    const bs = s.borderStyle || 'solid';
    const bc = s.borderColor || '#ffffff';
    border = `${bw}px ${bs} ${bc}`;
  }

  const py = s.paddingVertical !== undefined ? s.paddingVertical : 14;
  const px = s.paddingHorizontal !== undefined ? s.paddingHorizontal : 24;

  let boxShadow = s.hasTransparentBg ? 'none' : '0 0 15px rgba(16, 185, 129, 0.4)';
  if (s.isGlow) {
    const gc = s.glowColor || '#10b981';
    boxShadow = `0 0 20px ${gc}, 0 0 40px ${gc}`;
  }

  return {
    display: 'inline-block',
    backgroundColor: bg,
    color: s.textColor || '#ffffff',
    padding: `${py}px ${px}px`,
    borderRadius: (s.borderRadius !== undefined ? s.borderRadius : 12) + 'px',
    border: border,
    textDecoration: 'none',
    fontWeight: '700',
    maxWidth: '100%',
    width: s.fullWidth ? '100%' : 'auto',
    boxSizing: 'border-box',
    boxShadow: boxShadow
  };
});

const parsedMain = computed(() => parseAtomitags(props.element.content || 'QUERO MEU ACESSO AGORA', props.element.style?.altColor, props.element.style?.bgColor));
const parsedSub = computed(() => parseAtomitags(props.element.subtext || '', props.element.style?.altColor, props.element.style?.bgColor));
</script>
