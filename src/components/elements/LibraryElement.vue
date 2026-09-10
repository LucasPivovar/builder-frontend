<template>
  <div class="library-element" :class="`library-${element.type}`" :style="wrapperStyle">
    <img
      v-if="element.type === 'image'"
      class="library-image"
      :src="element.imageUrl || element.content"
      :alt="element.altText || 'Imagem da página'"
      :style="imageStyle"
    />

    <div v-else-if="element.type === 'divider'" class="library-divider" :style="{ borderColor: style.textColor || '#38bdf8' }"></div>

    <figure v-else-if="element.type === 'testimonial'" class="library-card testimonial-card" :style="cardStyle">
      <i class="bi bi-quote quote-icon" :style="{ color: style.bgColor || '#612bf4' }"></i>
      <blockquote :style="textStyle">{{ element.content }}</blockquote>
      <figcaption>
        <strong :style="textStyle">{{ element.author || 'Cliente verificado' }}</strong>
        <span>{{ element.role || 'Cliente' }}</span>
      </figcaption>
    </figure>

    <details v-else-if="element.type === 'faq'" class="library-card faq-card" open :style="cardStyle">
      <summary :style="textStyle">{{ element.content }}</summary>
      <p :style="textStyle">{{ element.answer || 'Adicione aqui a resposta para esta pergunta frequente.' }}</p>
    </details>

    <section v-else-if="element.type === 'countdown'" class="countdown-card" :style="cardStyle">
      <span class="countdown-label" :style="textStyle">{{ element.content }}</span>
      <div class="countdown-numbers" :style="{ color: style.textColor || '#0f172a' }">
        <span><b>{{ timeParts.days }}</b><small>dias</small></span>
        <span><b>{{ timeParts.hours }}</b><small>horas</small></span>
        <span><b>{{ timeParts.minutes }}</b><small>min</small></span>
        <span><b>{{ timeParts.seconds }}</b><small>seg</small></span>
      </div>
    </section>

    <form v-else-if="element.type === 'form'" class="library-card form-card" :style="cardStyle" @submit.prevent="submitForm">
      <h3 :style="textStyle">{{ element.formTitle || 'Receba as novidades' }}</h3>
      <p :style="textStyle">{{ element.description || 'Deixe seus dados para receber o próximo passo.' }}</p>
      <input aria-label="Nome" type="text" :placeholder="element.namePlaceholder || 'Nome'" required />
      <input aria-label="E-mail" type="email" :placeholder="element.emailPlaceholder || 'Seu melhor e-mail'" required />
      <button type="submit" :style="buttonStyle">{{ element.content || 'Quero receber' }}</button>
      <small v-if="submitted" class="form-success">Dados enviados com sucesso.</small>
    </form>

    <div v-else class="library-card" :style="cardStyle">{{ element.content }}</div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getNum } from '../../utils/astrotags';

const props = defineProps({ element: { type: Object, required: true } });
const now = ref(Date.now());
const submitted = ref(false);
let timer;

const style = computed(() => props.element.style || {});

function normalizeSize(val) {
  if (!val) return undefined;
  const str = String(val).trim();
  if (!str) return undefined;
  if (/^\d+(\.\d+)?$/.test(str)) return `${str}px`;
  return str;
}

const wrapperStyle = computed(() => ({
  marginTop: `${style.value.marginTop || 0}px`,
  marginBottom: `${style.value.marginBottom || 0}px`,
  textAlign: style.value.align || 'center',
  maxWidth: normalizeSize(style.value.maxWidth) || '100%',
  width: '100%',
  boxSizing: 'border-box'
}));

const imageStyle = computed(() => {
  const s = style.value;
  const maxW = normalizeSize(s.maxWidth);
  const maxH = normalizeSize(s.maxHeight);
  return {
    borderRadius: `${s.borderRadius !== undefined ? s.borderRadius : 12}px`,
    maxWidth: maxW || '100%',
    maxHeight: maxH || undefined,
    width: maxW ? '100%' : '100%',
    height: maxH ? 'auto' : 'auto',
    objectFit: 'cover'
  };
});

const textStyle = computed(() => ({
  color: style.value.textColor || '#0f172a',
  fontSize: style.value.fontSize || '16px',
  fontWeight: style.value.fontWeight || undefined,
  lineHeight: style.value.lineHeight || undefined
}));

const cardStyle = computed(() => {
  const s = style.value;
  const py = s.paddingVertical !== undefined && s.paddingVertical !== null && s.paddingVertical !== ''
    ? getNum(s.paddingVertical, 24)
    : 24;
  const px = s.paddingHorizontal !== undefined && s.paddingHorizontal !== null && s.paddingHorizontal !== ''
    ? getNum(s.paddingHorizontal, 24)
    : 24;
  const maxH = normalizeSize(s.maxHeight);
  return {
    backgroundColor: s.hasTransparentBg ? 'transparent' : (s.bgColor || '#ffffff'),
    borderRadius: `${s.borderRadius !== undefined ? s.borderRadius : 12}px`,
    borderColor: s.borderColor || '#cbd5e1',
    padding: `${py}px ${px}px`,
    maxHeight: maxH || undefined
  };
});

const buttonStyle = computed(() => ({
  backgroundColor: style.value.bgColor || '#612bf4',
  color: style.value.textColor || '#ffffff',
  fontSize: style.value.fontSize || undefined,
  fontWeight: style.value.fontWeight || undefined,
  borderRadius: `${style.value.borderRadius !== undefined ? style.value.borderRadius : 8}px`
}));

const timeParts = computed(() => {
  const target = new Date(props.element.targetDate || Date.now() + 86400000).getTime();
  let seconds = Math.max(0, Math.floor((target - now.value) / 1000));
  const days = Math.floor(seconds / 86400); seconds %= 86400;
  const hours = Math.floor(seconds / 3600); seconds %= 3600;
  const minutes = Math.floor(seconds / 60); const secs = seconds % 60;
  return { days, hours, minutes, seconds: secs };
});

function submitForm() {
  submitted.value = true;
  window.dispatchEvent(new CustomEvent('builder:conversion', { detail: { type: 'form_submit' } }));
}

onMounted(() => { timer = window.setInterval(() => { now.value = Date.now(); }, 1000); });
onBeforeUnmount(() => window.clearInterval(timer));
</script>

<style scoped>
.library-element { width: 100%; box-sizing: border-box; }
.library-image { display: block; width: 100%; max-width: 100%; height: auto; margin: 0 auto; object-fit: cover; }
.library-divider { width: 100%; border-top: 2px solid; opacity: .8; }
.library-card { width: min(100%, 680px); margin: 0 auto; padding: 24px; border: 1px solid; text-align: left; box-sizing: border-box; }
.testimonial-card { position: relative; }
.quote-icon { font-size: 26px; display: block; margin-bottom: 8px; }
blockquote { margin: 0 0 18px; line-height: 1.55; }
figcaption { display: flex; flex-direction: column; gap: 3px; font-size: 13px; color: var(--color-text-muted); }
.faq-card summary { cursor: pointer; font-weight: 800; list-style: none; }
.faq-card summary::after { content: '+'; float: right; color: var(--color-primary); font-size: 20px; }
.faq-card p { margin: 16px 0 0; opacity: .78; line-height: 1.55; }
.countdown-card { width: min(100%, 680px); margin: 0 auto; padding: 22px; border: 1px solid var(--color-border); }
.countdown-label { display: block; font-weight: 800; margin-bottom: 16px; }
.countdown-numbers { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.countdown-numbers span { background: var(--color-primary-soft); border-radius: 10px; padding: 10px 4px; display: flex; flex-direction: column; }
.countdown-numbers b { font-size: 26px; line-height: 1; }
.countdown-numbers small { margin-top: 5px; font-size: 10px; text-transform: uppercase; font-weight: 700; color: var(--color-text-secondary); }
.form-card { display: flex; flex-direction: column; gap: 11px; }
.form-card h3, .form-card p { margin: 0; }
.form-card input { width: 100%; box-sizing: border-box; border: 1px solid var(--color-border); border-radius: 8px; padding: 12px; font: inherit; }
.form-card button { border: 0; border-radius: 8px; padding: 12px; font: inherit; font-weight: 800; cursor: pointer; }
.form-success { color: #15803d; font-weight: 700; }
@media (max-width: 420px) { .countdown-numbers b { font-size: 20px; } .library-card, .countdown-card { padding: 18px; } }
</style>
