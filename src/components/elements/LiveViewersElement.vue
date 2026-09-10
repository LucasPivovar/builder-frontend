<template>
  <div
    class="canvas-viewer-widget"
    :style="computedStyle"
  >
    <strong :style="{ color: (element.style?.countColor && element.style.countColor !== '#38bdf8') ? element.style.countColor : '#ffffff' }">{{ count }}</strong>
    <span v-html="parsedContent"></span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { parseAstrotags as parseAtomitags, hexToRgba, getNum } from '../../utils/astrotags';

const props = defineProps({
  element: { type: Object, required: true }
});

const computedStyle = computed(() => {
  const s = props.element.style || {};

  let bg = 'transparent';
  if (s.bgColor && !s.hasTransparentBg && s.bgColor !== 'transparent') {
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
    color: s.textColor || '#ffffff',
    backgroundColor: bg,
    padding: `${py}px ${px}px`,
    marginTop: `${mt}px`,
    marginBottom: `${mb}px`,
    borderRadius: `${br}px`,
    border: border,
    textAlign: s.align || 'center',
    fontSize: s.fontSize || '18px',
    maxWidth: (s.maxWidth && s.maxWidth.trim()) ? s.maxWidth.trim() : '100%',
    maxHeight: (s.maxHeight && s.maxHeight.trim()) ? s.maxHeight.trim() : undefined,
    width: '100%',
    boxSizing: 'border-box'
  };
});

const currentMin = computed(() => {
  const v = parseInt(props.element.minViewers, 10);
  return !isNaN(v) && v >= 0 ? v : 140;
});

const currentMax = computed(() => {
  const v = parseInt(props.element.maxViewers, 10);
  return !isNaN(v) && v >= 0 ? v : 200;
});

function getNewCount() {
  const min = Math.min(currentMin.value, currentMax.value);
  const max = Math.max(currentMin.value, currentMax.value);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const count = ref(getNewCount());
let timer = null;

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    const min = Math.min(currentMin.value, currentMax.value);
    const max = Math.max(currentMin.value, currentMax.value);
    const delta = Math.floor(Math.random() * 7) - 3;
    let next = count.value + delta;
    if (next < min) next = min + Math.floor(Math.random() * 4);
    if (next > max) next = max - Math.floor(Math.random() * 4);
    count.value = next;
  }, 3200);
}

onMounted(() => {
  count.value = getNewCount();
  startTimer();
});

watch(
  () => [props.element?.minViewers, props.element?.maxViewers],
  () => {
    if (!props.element) return;
    count.value = getNewCount();
    startTimer();
  }
);

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const parsedContent = computed(() => {
  return ' ' + parseAtomitags(
    props.element.content || 'espectadores estão vendo este conteúdo simultaneamente com você',
    props.element.style?.altColor || '#f1c232',
    props.element.style?.bgColor || '#00ff0b',
    {
      cityName: props.element.cityName,
      minViewers: currentMin.value,
      maxViewers: currentMax.value,
      countColor: (props.element.style?.countColor && props.element.style.countColor !== '#38bdf8') ? props.element.style.countColor : '#ffffff'
    }
  );
});
</script>
