<template>
  <div :style="{ textAlign: element.style?.align || 'center', width: '100%' }">
    <a
      :href="element.url || '#'"
      :target="element.openInNewTab !== false ? '_blank' : '_self'"
      class="canvas-pitch-btn"
      :class="{ 'is-glow': element.style?.isGlow }"
      :style="computedBtnStyle"
    >
      <span style="display: block;" v-html="parsedMain"></span>
      <span v-if="element.subtext" style="font-size: 12px; opacity: 0.88; display: block; margin-top: 4px; font-weight: 500;" v-html="parsedSub"></span>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { parseAstrotags as parseAtomitags, hexToRgba, getNum } from '../../utils/astrotags';

const props = defineProps({
  element: { type: Object, required: true }
});

const computedBtnStyle = computed(() => {
  const s = props.element.style || {};

  let bg = s.bgColor || '#ffffff';
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
  const mt = getNum(s.marginTop, 18);
  const mb = getNum(s.marginBottom, 18);
  const br = getNum(s.borderRadius, 12);

  let boxShadow = 'none';
  if (s.isGlow) {
    const gc = s.glowColor || '#ffffff';
    boxShadow = `0 0 20px ${gc}, 0 0 40px ${gc}`;
  }

  return {
    display: 'inline-block',
    backgroundColor: bg,
    color: s.textColor || '#000000',
    fontSize: s.fontSize || '20px',
    fontWeight: s.fontWeight || '700',
    lineHeight: s.lineHeight || 1.3,
    letterSpacing: (s.letterSpacing || 0) + 'px',
    padding: `${py}px ${px}px`,
    borderRadius: `${br}px`,
    border: border,
    textDecoration: 'none',
    marginTop: `${mt}px`,
    marginBottom: `${mb}px`,
    maxWidth: (s.maxWidth && s.maxWidth.trim()) ? s.maxWidth.trim() : '100%',
    maxHeight: (s.maxHeight && s.maxHeight.trim()) ? s.maxHeight.trim() : undefined,
    width: props.element.fullWidth ? '100%' : 'auto',
    boxSizing: 'border-box',
    boxShadow: boxShadow
  };
});

const parsedMain = computed(() => parseAtomitags(props.element.content || 'QUERO MEU ACESSO AGORA', props.element.style?.altColor, props.element.style?.bgColor, { cityName: props.element.cityName, minViewers: props.element.minViewers, maxViewers: props.element.maxViewers, countColor: props.element.style?.countColor }));
const parsedSub = computed(() => parseAtomitags(props.element.subtext || '', props.element.style?.altColor, props.element.style?.bgColor, { cityName: props.element.cityName, minViewers: props.element.minViewers, maxViewers: props.element.maxViewers, countColor: props.element.style?.countColor }));
</script>
