<template>
  <div class="canvas-vturb-wrapper" :style="wrapperStyle">
    <div
      v-if="element.vturbBody && element.vturbBody.trim().length > 0"
      ref="containerRef"
      class="vturb-embed-box"
    ></div>
    <div v-else class="vturb-player-placeholder-box">
      <i class="bi bi-play-circle-fill" style="font-size: 42px;"></i>
      <span style="font-weight: 800; font-size: 14px; margin-top: 6px;">Player VTurb (VSL)</span>
      <span style="font-size: 11px; opacity: 0.7;">Insira o embed do VTurb nas configurações do objeto</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue';
import { getNum } from '../../utils/astrotags';

const props = defineProps({
  element: { type: Object, required: true }
});

const wrapperStyle = computed(() => {
  const s = props.element.style || {};
  const body = props.element.vturbBody || '';
  const match = body.match(/padding[^:]*:[^\d]*(\d+(?:\.\d+)?)%/);
  const padTopRatio = match ? parseFloat(match[1]) / 100 : 0.5625;
  const isVertical = padTopRatio > 1.0;

  let w = (s.maxWidth && s.maxWidth.trim()) ? s.maxWidth.trim()
           : (props.element.vturbWidth && props.element.vturbWidth.trim()) ? props.element.vturbWidth.trim()
           : (isVertical ? '400px' : '640px');

  const h = (s.maxHeight && s.maxHeight.trim()) ? s.maxHeight.trim()
           : (props.element.vturbHeight && props.element.vturbHeight.trim()) ? props.element.vturbHeight.trim()
           : '';

  const mt = getNum(s.marginTop, 16);
  const mb = getNum(s.marginBottom, 16);
  const py = getNum(s.paddingVertical, 0);
  const px = getNum(s.paddingHorizontal, 0);

  const res = {
    marginTop: `${mt}px`,
    marginBottom: `${mb}px`,
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: `${py}px ${px}px`,
    width: '100%',
    boxSizing: 'border-box',
    display: 'block'
  };
  if (w) res.maxWidth = /px|%|vw/.test(w) ? w : w + 'px';
  if (h) { res.maxHeight = /px|%|vh/.test(h) ? h : h + 'px'; res.overflow = 'hidden'; }
  if (s.borderRadius !== undefined && s.borderRadius !== null && s.borderRadius !== '') {
    const br = typeof s.borderRadius === 'number' ? s.borderRadius + 'px' : s.borderRadius;
    res.borderRadius = br;
    res.overflow = 'hidden';
  }
  return res;
});

const containerRef = ref(null);

function loadScriptOnce(src) {
  if (!src) return;
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
}

function loadInlineScript(code) {
  if (!code || !code.trim()) return;
  const s = document.createElement('script');
  s.textContent = code;
  document.head.appendChild(s);
}

function renderVturb() {
  nextTick(() => {
    if (!containerRef.value) return;
    let bodyHTML = (props.element.vturbBody || '').trim();
    if (!bodyHTML) {
      containerRef.value.innerHTML = '';
      return;
    }

    const match = bodyHTML.match(/padding[^:]*:[^\d]*(\d+(?:\.\d+)?)%/);
    const padTopRatio = match ? parseFloat(match[1]) / 100 : 0.5625;
    if (padTopRatio > 1.0) {
      bodyHTML = bodyHTML.replace(/max-width:\s*\d+px/gi, 'max-width: 100%');
    }

    // 1. Inserir o HTML no container
    containerRef.value.innerHTML = bodyHTML;

    // 2. Executar scripts do Head (vturbHead)
    const headHTML = (props.element.vturbHead || '').trim();
    if (headHTML) {
      const tempHead = document.createElement('div');
      tempHead.innerHTML = headHTML;
      tempHead.querySelectorAll('link').forEach(l => {
        const href = l.getAttribute('href');
        if (href && !document.head.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link');
          Array.from(l.attributes).forEach(a => link.setAttribute(a.name, a.value));
          document.head.appendChild(link);
        }
      });
      tempHead.querySelectorAll('script').forEach(s => {
        if (s.src) loadScriptOnce(s.src);
        else loadInlineScript(s.textContent);
      });
    }

    // 3. Executar scripts do Body (vturbBody)
    const tempBody = document.createElement('div');
    tempBody.innerHTML = bodyHTML;
    tempBody.querySelectorAll('script').forEach(s => {
      if (s.src) loadScriptOnce(s.src);
      else loadInlineScript(s.textContent);
    });
  });
}

onMounted(() => {
  renderVturb();
});

watch(
  () => [props.element?.vturbBody, props.element?.vturbHead],
  () => {
    if (!props.element) return;
    renderVturb();
  },
  { deep: true }
);
</script>

<style scoped>
.canvas-vturb-wrapper {
  display: block;
  clear: both;
  float: none;
}

.vturb-embed-box {
  width: 100%;
  box-sizing: border-box;
}

.vturb-player-placeholder-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c8a045;
  background-color: #0b0c10;
  border: 2px dashed rgba(200, 160, 69, 0.4);
  border-radius: 14px;
  padding: 30px 20px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  min-height: 120px;
}
</style>
