<template>
  <div
    class="canvas-top-banner"
    :style="computedStyle"
    v-html="parsedContent"
  ></div>
</template>

<script setup>
import { computed } from 'vue';
import { parseAtomitags, hexToRgba } from '../../utils/atomitags';

const props = defineProps({
  element: { type: Object, required: true }
});

const computedStyle = computed(() => {
  const s = props.element.style || {};

  let bg = s.bgColor || '#dc2626';
  if (s.hasTransparentBg) {
    bg = 'transparent';
  } else if (s.bgOpacity !== undefined && s.bgOpacity < 1) {
    bg = hexToRgba(bg, s.bgOpacity);
  }

  let border = 'none';
  if (s.hasBorder) {
    border = `${s.borderWidth || 2}px ${s.borderStyle || 'solid'} ${s.borderColor || '#ffffff'}`;
  }

  const py = s.paddingVertical !== undefined ? s.paddingVertical : 12;
  const px = s.paddingHorizontal !== undefined ? s.paddingHorizontal : 16;

  return {
    backgroundColor: bg,
    color: s.textColor || '#ffffff',
    fontWeight: s.fontWeight || '800',
    fontSize: s.fontSize || '15px',
    padding: `${py}px ${px}px`,
    borderRadius: (s.borderRadius || 0) + 'px',
    border: border,
    textAlign: s.align || 'center',
    width: '100%',
    boxSizing: 'border-box'
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
</script>
