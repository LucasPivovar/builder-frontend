<template>
  <div class="quiz-element" :style="wrapperStyle">
    <!-- Progress Bar -->
    <div v-if="element.type === 'quiz-progress'" class="quiz-progress" :style="progressTrackStyle">
      <span :style="progressBarFillStyle"></span>
    </div>

    <!-- Options: Single, Multiple, Yes/No -->
    <div v-else-if="['quiz-single','quiz-multiple','quiz-yes-no'].includes(element.type)" class="quiz-options" :style="optionsContainerStyle">
      <button
        v-for="(option,index) in options"
        :key="`${index}-${option.label}`"
        type="button"
        @click.stop="toggle(index)"
        :class="{ selected: selected.includes(index) }"
        :style="optionButtonStyle"
      >
        <span class="option-mark" :class="{ 'option-mark-cross': isCrossIcon(option.icon) }">
          {{ option.icon || (element.type === 'quiz-multiple' ? String.fromCharCode(65 + index) : '') }}
        </span>
        <span class="option-copy">
          <strong :style="optionTitleStyle">{{ option.label }}</strong>
          <small v-if="option.description" :style="optionDescStyle">{{ option.description }}</small>
        </span>
        <i class="bi bi-chevron-right" :style="chevronStyle"></i>
      </button>
    </div>

    <!-- Loading -->
    <div v-else-if="element.type === 'quiz-loading'" class="quiz-loading" :style="loadingContainerStyle">
      <div class="quiz-loading-header">
        <span :style="loadingHeaderStyle">{{ element.content || 'Analisando suas respostas...' }}</span>
        <strong :style="loadingPercentStyle">{{ loadingProgress }}%</strong>
      </div>
      <div class="quiz-loading-track" :style="loadingTrackStyle">
        <span :style="loadingFillStyle"><i></i></span>
      </div>
    </div>

    <!-- Metrics -->
    <div v-else-if="element.type === 'quiz-metric'" class="quiz-metrics" :style="metricsContainerStyle">
      <article
        v-for="(metric,index) in metrics"
        :key="`${index}-${metric.value}-${metric.label}`"
        :style="[metricCardStyle, { '--metric-index': index }]"
      >
        <strong :style="metricValueStyle">{{ metric.value }}</strong>
        <span :style="metricLabelStyle">{{ metric.label }}</span>
      </article>
    </div>

    <!-- Price / Plan -->
    <div v-else-if="element.type === 'quiz-price'" class="quiz-price" :style="priceCardStyle">
      <small :style="priceBadgeStyle">{{ element.badge || 'Recomendado' }}</small>
      <div :style="priceBodyStyle">
        <span>
          <strong :style="priceTitleStyle">{{ element.content || 'Plano PRO' }}</strong>
          <em :style="priceDescStyle">{{ element.description || 'Acesso completo' }}</em>
        </span>
        <b :style="priceValueStyle">{{ element.price || 'R$ 197,00' }}</b>
      </div>
    </div>

    <!-- Spacer -->
    <div v-else-if="element.type === 'quiz-spacer'" :style="spacerStyle"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { hexToRgba, getNum } from '../../utils/astrotags';

const props = defineProps({ element: { type: Object, required: true } });
const selected = ref([]);
const emit = defineEmits(['answered']);

const style = computed(() => props.element.style || {});

function normalizeSize(val) {
  if (!val) return undefined;
  const str = String(val).trim();
  if (!str) return undefined;
  if (/^\d+(\.\d+)?$/.test(str)) return `${str}px`;
  return str;
}

function isCrossIcon(icon) {
  const trimmed = String(icon || '').trim();
  return ['×', 'x', 'X', '✕', '✖', '✗'].includes(trimmed);
}

const wrapperStyle = computed(() => {
  const s = style.value;
  const mt = getNum(s.marginTop, 0);
  const mb = getNum(s.marginBottom, 0);
  const maxW = normalizeSize(s.maxWidth);
  const maxH = normalizeSize(s.maxHeight);

  return {
    marginTop: `${mt}px`,
    marginBottom: `${mb}px`,
    color: s.textColor || '#0f172a',
    maxWidth: maxW || '100%',
    maxHeight: maxH || undefined,
    width: '100%',
    boxSizing: 'border-box'
  };
});

// Options
const options = computed(() => {
  const values = Array.isArray(props.element.options)
    ? props.element.options
    : String(props.element.optionsText || 'Opção 1\nOpção 2').split('\n');
  return values.map(normalizeOption).filter(option => option.label);
});

const optionsContainerStyle = computed(() => ({
  maxHeight: normalizeSize(style.value.maxHeight),
  textAlign: style.value.align || 'left'
}));

const optionButtonStyle = computed(() => {
  const s = style.value;
  let bg = undefined;
  if (s.hasTransparentBg) {
    bg = 'transparent';
  } else if (s.bgColor) {
    bg = s.bgOpacity !== undefined && s.bgOpacity !== null && s.bgOpacity !== '' && Number(s.bgOpacity) < 1
      ? hexToRgba(s.bgColor, Number(s.bgOpacity))
      : s.bgColor;
  }
  const br = s.borderRadius !== undefined && s.borderRadius !== null && s.borderRadius !== ''
    ? `${getNum(s.borderRadius, 14)}px`
    : undefined;
  const py = s.paddingVertical !== undefined && s.paddingVertical !== null && s.paddingVertical !== ''
    ? getNum(s.paddingVertical, 11)
    : undefined;
  const px = s.paddingHorizontal !== undefined && s.paddingHorizontal !== null && s.paddingHorizontal !== ''
    ? getNum(s.paddingHorizontal, 14)
    : undefined;
  const borderCol = s.hasBorder && s.borderColor ? s.borderColor : undefined;
  const borderW = s.hasBorder && s.borderWidth ? `${getNum(s.borderWidth, 1)}px` : undefined;
  const borderSt = s.hasBorder ? (s.borderStyle || 'solid') : undefined;

  return {
    backgroundColor: bg,
    borderRadius: br,
    paddingTop: py !== undefined ? `${py}px` : undefined,
    paddingBottom: py !== undefined ? `${py}px` : undefined,
    paddingLeft: px !== undefined ? `${px}px` : undefined,
    paddingRight: px !== undefined ? `${px}px` : undefined,
    borderColor: borderCol,
    borderWidth: borderW,
    borderStyle: borderSt,
    maxHeight: normalizeSize(s.maxHeight),
    minHeight: s.maxHeight ? 'auto' : undefined
  };
});

const optionTitleStyle = computed(() => {
  const s = style.value;
  return {
    fontSize: s.fontSize || undefined,
    fontWeight: s.fontWeight || undefined,
    color: s.textColor || undefined
  };
});

const optionDescStyle = computed(() => {
  const s = style.value;
  return {
    color: s.textColor ? hexToRgba(s.textColor, 0.7) : undefined
  };
});

const chevronStyle = computed(() => {
  const s = style.value;
  return {
    color: s.altColor || s.countColor || undefined
  };
});

// Metrics
const metrics = computed(() => String(props.element.metricsText || '72%|Taxa de conversão').split('\n').map(line => {
  const [value, ...labelParts] = line.split('|');
  return { value: (value || '').trim(), label: labelParts.join('|').trim() };
}).filter(metric => metric.value || metric.label));

const metricsContainerStyle = computed(() => ({
  maxHeight: normalizeSize(style.value.maxHeight)
}));

const metricCardStyle = computed(() => {
  const s = style.value;
  let bg = undefined;
  if (s.hasTransparentBg) {
    bg = 'transparent';
  } else if (s.bgColor) {
    bg = s.bgOpacity !== undefined && s.bgOpacity !== null && s.bgOpacity !== '' && Number(s.bgOpacity) < 1
      ? hexToRgba(s.bgColor, Number(s.bgOpacity))
      : s.bgColor;
  }
  const br = s.borderRadius !== undefined && s.borderRadius !== null && s.borderRadius !== ''
    ? `${getNum(s.borderRadius, 14)}px`
    : undefined;
  const py = s.paddingVertical !== undefined && s.paddingVertical !== null && s.paddingVertical !== ''
    ? getNum(s.paddingVertical, 16)
    : undefined;
  const px = s.paddingHorizontal !== undefined && s.paddingHorizontal !== null && s.paddingHorizontal !== ''
    ? getNum(s.paddingHorizontal, 12)
    : undefined;
  const borderCol = s.hasBorder && s.borderColor
    ? s.borderColor
    : (s.altColor || undefined);
  const borderW = s.hasBorder && s.borderWidth ? `${getNum(s.borderWidth, 1)}px` : undefined;
  const borderSt = s.hasBorder ? (s.borderStyle || 'solid') : undefined;

  return {
    backgroundColor: bg,
    borderRadius: br,
    paddingTop: py !== undefined ? `${py}px` : undefined,
    paddingBottom: py !== undefined ? `${py}px` : undefined,
    paddingLeft: px !== undefined ? `${px}px` : undefined,
    paddingRight: px !== undefined ? `${px}px` : undefined,
    borderColor: borderCol,
    borderWidth: borderW,
    borderStyle: borderSt,
    maxHeight: normalizeSize(s.maxHeight),
    minHeight: s.maxHeight ? 'auto' : undefined
  };
});

const metricValueStyle = computed(() => {
  const s = style.value;
  return {
    fontSize: s.fontSize || undefined,
    fontWeight: s.fontWeight || undefined,
    color: s.altColor || s.countColor || undefined
  };
});

const metricLabelStyle = computed(() => {
  const s = style.value;
  return {
    color: s.textColor || undefined
  };
});

// Price / Plan
const priceCardStyle = computed(() => {
  const s = style.value;
  let bg = undefined;
  if (s.hasTransparentBg) {
    bg = 'transparent';
  } else if (s.bgColor) {
    bg = s.bgOpacity !== undefined && s.bgOpacity !== null && s.bgOpacity !== '' && Number(s.bgOpacity) < 1
      ? hexToRgba(s.bgColor, Number(s.bgOpacity))
      : s.bgColor;
  }
  const br = s.borderRadius !== undefined && s.borderRadius !== null && s.borderRadius !== ''
    ? `${getNum(s.borderRadius, 15)}px`
    : undefined;
  const borderCol = s.hasBorder && s.borderColor
    ? s.borderColor
    : (s.altColor || s.countColor || undefined);
  const borderW = s.hasBorder && s.borderWidth ? `${getNum(s.borderWidth, 2)}px` : undefined;
  const borderSt = s.hasBorder ? (s.borderStyle || 'solid') : undefined;

  return {
    backgroundColor: bg,
    borderRadius: br,
    borderColor: borderCol,
    borderWidth: borderW,
    borderStyle: borderSt,
    maxHeight: normalizeSize(s.maxHeight)
  };
});

const priceBadgeStyle = computed(() => {
  const s = style.value;
  return {
    backgroundColor: s.altColor || s.countColor || undefined
  };
});

const priceBodyStyle = computed(() => {
  const s = style.value;
  const py = s.paddingVertical !== undefined && s.paddingVertical !== null && s.paddingVertical !== ''
    ? getNum(s.paddingVertical, 16)
    : undefined;
  const px = s.paddingHorizontal !== undefined && s.paddingHorizontal !== null && s.paddingHorizontal !== ''
    ? getNum(s.paddingHorizontal, 16)
    : undefined;
  return {
    paddingTop: py !== undefined ? `${py}px` : undefined,
    paddingBottom: py !== undefined ? `${py}px` : undefined,
    paddingLeft: px !== undefined ? `${px}px` : undefined,
    paddingRight: px !== undefined ? `${px}px` : undefined
  };
});

const priceTitleStyle = computed(() => {
  const s = style.value;
  return {
    fontSize: s.fontSize || undefined,
    fontWeight: s.fontWeight || undefined,
    color: s.textColor || undefined
  };
});

const priceDescStyle = computed(() => {
  const s = style.value;
  return {
    color: s.textColor ? hexToRgba(s.textColor, 0.7) : undefined
  };
});

const priceValueStyle = computed(() => {
  const s = style.value;
  return {
    fontSize: s.fontSize ? `calc(${s.fontSize} * 1.18)` : undefined,
    fontWeight: s.fontWeight || undefined,
    color: s.altColor || s.countColor || undefined
  };
});

// Loading
const loadingProgress = computed(() => Math.max(0, Math.min(100, Number(props.element.progress) || 0)));

const loadingContainerStyle = computed(() => ({
  maxHeight: normalizeSize(style.value.maxHeight)
}));

const loadingHeaderStyle = computed(() => {
  const s = style.value;
  return {
    fontSize: s.fontSize || undefined,
    fontWeight: s.fontWeight || undefined,
    color: s.textColor || undefined
  };
});

const loadingPercentStyle = computed(() => {
  const s = style.value;
  return {
    color: s.altColor || s.countColor || undefined
  };
});

const loadingTrackStyle = computed(() => {
  const s = style.value;
  const py = s.paddingVertical !== undefined && s.paddingVertical !== null && s.paddingVertical !== ''
    ? getNum(s.paddingVertical, 12)
    : undefined;
  return {
    height: py !== undefined ? `${py}px` : undefined
  };
});

const loadingFillStyle = computed(() => {
  const s = style.value;
  return {
    width: `${loadingProgress.value}%`,
    backgroundColor: s.altColor || s.countColor || undefined
  };
});

// Progress
const progressTrackStyle = computed(() => {
  const s = style.value;
  const py = s.paddingVertical !== undefined && s.paddingVertical !== null && s.paddingVertical !== ''
    ? getNum(s.paddingVertical, 5)
    : undefined;
  const br = s.borderRadius !== undefined && s.borderRadius !== null && s.borderRadius !== ''
    ? `${getNum(s.borderRadius, 999)}px`
    : undefined;
  return {
    height: py !== undefined ? `${py}px` : undefined,
    borderRadius: br
  };
});

const progressBarFillStyle = computed(() => {
  const s = style.value;
  return {
    width: `${props.element.progress || 20}%`,
    backgroundColor: s.altColor || s.countColor || undefined
  };
});

// Spacer
const spacerStyle = computed(() => {
  const s = style.value;
  const h = s.maxHeight ? normalizeSize(s.maxHeight) : `${props.element.height || 32}px`;
  return {
    height: h
  };
});

function toggle(index) {
  if (props.element.type === 'quiz-multiple') {
    selected.value = selected.value.includes(index)
      ? selected.value.filter(v => v !== index)
      : [...selected.value, index];
  } else {
    selected.value = [index];
  }
  emit('answered', selected.value);
}

function normalizeOption(value) {
  if (value && typeof value === 'object') {
    return {
      label: String(value.label || value.text || value.title || '').trim(),
      description: String(value.description || value.subtitle || '').trim(),
      icon: String(value.icon || value.marker || '').trim()
    };
  }
  return { label: String(value || '').trim(), description: '', icon: '' };
}
</script>

<style scoped>
.quiz-element { width: 100%; box-sizing: border-box; }
.quiz-progress { height: 5px; border-radius: 999px; background: var(--color-primary-soft); overflow: hidden; }
.quiz-progress span { display: block; height: 100%; background: var(--color-primary); border-radius: inherit; transition: width .4s cubic-bezier(.22,1,.36,1); }
.quiz-options { display: flex; flex-direction: column; gap: 9px; }
.quiz-options button {
  min-height: 58px;
  display: grid;
  grid-template-columns: 32px 1fr 20px;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  transition: transform .18s ease, border-color .18s ease, background-color .18s ease;
}
.quiz-options button:hover, .quiz-options button.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-subtle);
  transform: translateY(-1px);
}
.option-mark {
  width: 29px;
  height: 29px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 900;
  transition: .18s ease;
  flex-shrink: 0;
  line-height: 1;
}
.option-mark.option-mark-cross {
  font-size: 20px;
  line-height: 1;
  font-weight: 900;
}
.option-copy { display: flex; min-width: 0; flex-direction: column; gap: 2px; }
.option-copy strong { font-size: 15px; line-height: 1.25; overflow-wrap: anywhere; }
.option-copy small { color: var(--color-text-muted); font-size: 12px; line-height: 1.25; overflow-wrap: anywhere; }
.quiz-options button.selected .option-mark { background: var(--color-primary); color: white; transform: scale(1.04); }
.quiz-options i { color: var(--color-primary); }

.quiz-loading { display: flex; flex-direction: column; gap: 9px; width: 100%; padding: 12px 2px; box-sizing: border-box; }
.quiz-loading-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--color-text); }
.quiz-loading-header span { font-size: 13px; font-weight: 700; }
.quiz-loading-header strong { color: var(--color-primary-strong); font-size: 13px; }
.quiz-loading-track { height: 12px; border-radius: 999px; background: var(--color-primary-soft); overflow: hidden; }
.quiz-loading-track > span { position: relative; display: block; height: 100%; border-radius: inherit; background: var(--color-primary); transform-origin: left; animation: quizLoadGrow 1.15s cubic-bezier(.22,1,.36,1) both; }
.quiz-loading-track i { position: absolute; inset: 0; width: 45%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); transform: translateX(-120%); animation: quizLoadShimmer 1.45s ease-in-out .35s infinite; }

.quiz-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; box-sizing: border-box; }
.quiz-metrics article {
  min-height: 145px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-surface);
  box-sizing: border-box;
  animation: quizMetricIn .35s cubic-bezier(.22,1,.36,1) both;
  animation-delay: calc(var(--metric-index) * 70ms);
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.quiz-metrics article:hover { transform: translateY(-2px); border-color: var(--color-primary-border); box-shadow: var(--shadow-sm); }
.quiz-metrics strong { font-size: 22px; color: var(--color-primary-strong); }
.quiz-metrics span { margin-top: 8px; font-size: 12px; color: var(--color-text-muted); text-align: center; }

.quiz-price { border: 2px solid var(--color-primary); border-radius: 15px; overflow: hidden; box-sizing: border-box; }
.quiz-price > small { display: block; padding: 6px; text-align: center; background: var(--color-primary); color: white; font-weight: 800; }
.quiz-price > div { display: flex; justify-content: space-between; align-items: center; padding: 16px; box-sizing: border-box; }
.quiz-price span { display: flex; flex-direction: column; }
.quiz-price strong { font-size: 17px; }
.quiz-price em { font-style: normal; color: var(--color-text-muted); font-size: 11px; }
.quiz-price b { font-size: 21px; color: var(--color-primary-strong); }

@keyframes quizLoadGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes quizLoadShimmer { 0% { transform: translateX(-120%); } 70%, 100% { transform: translateX(320%); } }
@keyframes quizMetricIn { from { opacity: 0; transform: translateY(9px) scale(.98); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .quiz-loading-track > span, .quiz-loading-track i, .quiz-metrics article { animation: none !important; }
  .quiz-options button, .quiz-metrics article { transition: none !important; }
}
</style>
