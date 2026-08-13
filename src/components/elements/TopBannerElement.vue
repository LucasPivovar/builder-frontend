<template>
  <div
    class="canvas-top-banner"
    :style="computedStyle"
    v-html="parsedContent"
  ></div>
</template>

<script setup>
import { computed } from 'vue';
import { parseAtomitags, hexToRgba, getNum } from '../../utils/atomitags';

const props = defineProps({
  element: { type: Object, required: true }
});

const computedStyle = computed(() => {
  const s = props.element.style || {};

  let bg = s.bgColor || '#dc2626';
  if (s.hasTransparentBg) {
    bg = 'transparent';
  } else if (s.bgOpacity !== undefined && s.bgOpacity !== null && s.bgOpacity !== '' && Number(s.bgOpacity) < 1) {
    bg = hexToRgba(bg, Number(s.bgOpacity));
  }

  let border = 'none';
  if (s.hasBorder) {
    border = `${getNum(s.borderWidth, 2)}px ${s.borderStyle || 'solid'} ${s.borderColor || '#ffffff'}`;
  }

  const py = getNum(s.paddingVertical, 12);
  const px = getNum(s.paddingHorizontal, 16);
  const mb = getNum(s.marginBottom, 0);
  const br = getNum(s.borderRadius, 0);

  return {
    backgroundColor: bg,
    color: s.textColor || '#ffffff',
    fontWeight: s.fontWeight || '800',
    fontSize: s.fontSize || '15px',
    padding: `${py}px ${px}px`,
    marginTop: '0px',
    marginBottom: `${mb}px`,
    borderRadius: `${br}px`,
    border: border,
    textAlign: s.align || 'center',
    maxWidth: (s.maxWidth && s.maxWidth.trim()) ? s.maxWidth.trim() : '100%',
    maxHeight: (s.maxHeight && s.maxHeight.trim()) ? s.maxHeight.trim() : undefined,
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
      maxViewers: props.element.maxViewers,
      countColor: props.element.style?.countColor
    }
  );
});
</script>
