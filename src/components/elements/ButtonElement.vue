<template>
  <div :style="{ textAlign: element.style?.align || 'center', width: '100%' }">
    <a
      :href="element.url || '#'"
      :target="element.openInNewTab !== false ? '_blank' : '_self'"
      class="canvas-button"
      :class="{ 'is-glow': element.style?.isGlow }"
      :style="computedBtnStyle"
    >
      <span style="display: block;" v-html="parsedContent"></span>
      <span
        v-if="element.subtext"
        style="font-size: 12px; opacity: 0.88; display: block; margin-top: 4px; font-weight: 500;"
        v-html="parsedSubtext"
      ></span>
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

  let bg = s.bgColor || '#6366f1';
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
  const px = s.paddingHorizontal !== undefined ? s.paddingHorizontal : 28;

  let boxShadow = 'none';
  if (s.isGlow) {
    const gc = s.glowColor || '#6366f1';
    boxShadow = `0 0 15px ${gc}, 0 0 30px ${gc}`;
  }

  return {
    display: 'inline-block',
    backgroundColor: bg,
    color: s.textColor || '#ffffff',
    fontSize: s.fontSize || '16px',
    fontWeight: s.fontWeight || '700',
    padding: `${py}px ${px}px`,
    borderRadius: (s.borderRadius !== undefined ? s.borderRadius : 10) + 'px',
    border: border,
    textDecoration: 'none',
    marginTop: (s.marginTop || 6) + 'px',
    marginBottom: (s.marginBottom || 6) + 'px',
    maxWidth: '100%',
    width: s.fullWidth ? '100%' : 'auto',
    boxSizing: 'border-box',
    boxShadow: boxShadow
  };
});

const parsedContent = computed(() => {
  return parseAtomitags(
    props.element.content || '',
    props.element.style?.altColor || '#f1c232',
    props.element.style?.bgColor || '#00ff0b',
    {
      cityName: props.element.cityName,
      minViewers: props.element.minViewers,
      maxViewers: props.element.maxViewers
    }
  );
});

const parsedSubtext = computed(() => {
  return parseAtomitags(
    props.element.subtext || '',
    props.element.style?.altColor || '#f1c232',
    props.element.style?.bgColor || '#00ff0b',
    {
      cityName: props.element.cityName,
      minViewers: props.element.minViewers,
      maxViewers: props.element.maxViewers
    }
  );
});
</script>

<style scoped>
.canvas-button {
  transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.2s ease, padding 0.15s ease;
}
.canvas-button:hover {
  transform: translateY(-1px);
}
</style>
