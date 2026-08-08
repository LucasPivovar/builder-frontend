<template>
  <p
    class="canvas-paragraph"
    :style="computedStyle"
    v-html="parsedContent"
  ></p>
</template>

<script setup>
import { computed } from 'vue';
import { parseAtomitags, hexToRgba, getNum } from '../../utils/atomitags';

const props = defineProps({
  element: { type: Object, required: true }
});

const computedStyle = computed(() => {
  const s = props.element.style || {};

  let bg = 'transparent';
  if (s.bgColor && !s.hasTransparentBg) {
    bg = s.bgOpacity !== undefined && s.bgOpacity !== null && s.bgOpacity !== '' && Number(s.bgOpacity) < 1 
      ? hexToRgba(s.bgColor, Number(s.bgOpacity)) 
      : s.bgColor;
  }

  let border = 'none';
  if (s.hasBorder) {
    border = `${getNum(s.borderWidth, 2)}px ${s.borderStyle || 'solid'} ${s.borderColor || '#ffffff'}`;
  }

  const py = getNum(s.paddingVertical, 0);
  const px = getNum(s.paddingHorizontal, 0);
  const mt = getNum(s.marginTop, 6);
  const mb = getNum(s.marginBottom, 6);
  const br = getNum(s.borderRadius, 0);

  return {
    fontSize: s.fontSize || '15px',
    fontWeight: s.fontWeight || '400',
    color: s.textColor || '#cccccc',
    backgroundColor: bg,
    padding: `${py}px ${px}px`,
    borderRadius: `${br}px`,
    border: border,
    marginTop: `${mt}px`,
    marginBottom: `${mb}px`,
    textAlign: s.align || 'center',
    lineHeight: s.lineHeight || 1.5,
    letterSpacing: (s.letterSpacing || 0) + 'px',
    maxWidth: (s.maxWidth && s.maxWidth.trim()) ? s.maxWidth.trim() : '850px',
    maxHeight: (s.maxHeight && s.maxHeight.trim()) ? s.maxHeight.trim() : undefined,
    width: '100%',
    margin: `${mt}px auto ${mb}px auto`,
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
      maxViewers: props.element.maxViewers,
      countColor: props.element.style?.countColor
    }
  );
});
</script>
