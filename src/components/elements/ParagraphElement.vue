<template>
  <p
    class="canvas-paragraph"
    :style="computedStyle"
    v-html="parsedContent"
  ></p>
</template>

<script setup>
import { computed } from 'vue';
import { parseAtomitags, hexToRgba } from '../../utils/atomitags';

const props = defineProps({
  element: { type: Object, required: true }
});

const computedStyle = computed(() => {
  const s = props.element.style || {};

  let bg = 'transparent';
  if (s.bgColor && !s.hasTransparentBg) {
    bg = s.bgOpacity !== undefined && s.bgOpacity < 1 ? hexToRgba(s.bgColor, s.bgOpacity) : s.bgColor;
  }

  let border = 'none';
  if (s.hasBorder) {
    border = `${s.borderWidth || 2}px ${s.borderStyle || 'solid'} ${s.borderColor || '#ffffff'}`;
  }

  const py = s.paddingVertical !== undefined ? s.paddingVertical : 0;
  const px = s.paddingHorizontal !== undefined ? s.paddingHorizontal : 0;

  return {
    fontSize: s.fontSize || '15px',
    fontWeight: s.fontWeight || '400',
    color: s.textColor || '#cccccc',
    backgroundColor: bg,
    padding: `${py}px ${px}px`,
    borderRadius: (s.borderRadius || 0) + 'px',
    border: border,
    marginTop: (s.marginTop !== undefined ? s.marginTop : 6) + 'px',
    marginBottom: (s.marginBottom !== undefined ? s.marginBottom : 6) + 'px',
    textAlign: s.align || 'center',
    lineHeight: s.lineHeight || 1.5,
    letterSpacing: (s.letterSpacing || 0) + 'px',
    maxWidth: '850px',
    width: '100%',
    margin: `${s.marginTop !== undefined ? s.marginTop : 6}px auto ${s.marginBottom !== undefined ? s.marginBottom : 6}px auto`,
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
