<template>
  <div class="modal-vturb-container" :style="wrapperStyle">
    <iframe
      ref="iframeRef"
      class="modal-vturb-iframe"
      frameborder="0"
      scrolling="no"
      allow="autoplay; fullscreen"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';

const props = defineProps({
  element: { type: Object, required: true }
});

const iframeRef = ref(null);

const wrapperStyle = computed(() => {
  const e = props.element || {};
  const body = e.vturbBody || '';
  const match = body.match(/padding[^:]*:[^\d]*(\d+(?:\.\d+)?)%/);
  const padTopRatio = match ? parseFloat(match[1]) / 100 : 0.5625;
  const padTop = match ? match[1] + '%' : '56.25%';
  const mw = (e.style && e.style.maxWidth && e.style.maxWidth.trim()) ? e.style.maxWidth.trim() : (e.vturbWidth || '100%');

  // Limite máximo de altura para o player no modal: 380px (largura = altura / proporção)
  const maxTargetHeight = 380;
  const maxAllowableWidth = Math.round(maxTargetHeight / padTopRatio);

  let finalMw = /px|%/.test(mw) ? mw : mw + 'px';
  finalMw = `min(${finalMw}, ${maxAllowableWidth}px)`;

  return {
    position: 'relative',
    width: '100%',
    maxWidth: finalMw,
    maxHeight: `${maxTargetHeight}px`,
    paddingTop: padTop,
    height: 0,
    overflow: 'hidden',
    margin: '0 auto',
    borderRadius: '8px'
  };
});

function loadIframe() {
  nextTick(() => {
    if (!iframeRef.value) return;
    try {
      const doc = iframeRef.value.contentDocument || iframeRef.value.contentWindow.document;
      if (!doc) return;
      const headCode = (props.element.vturbHead || '').trim();
      const bodyCode = (props.element.vturbBody || '').trim();
      const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: transparent; overflow: hidden; }
    vturb-smartplayer { display: block !important; margin: 0 auto !important; width: 100% !important; max-width: 100% !important; max-height: 380px !important; }
    .vturb-player-placeholder { max-height: 380px !important; }
  </style>
  ${headCode}
</head>
<body>
  ${bodyCode}
</body>
</html>`;
      doc.open();
      doc.write(htmlContent);
      doc.close();
    } catch (err) {
      // Ignorar erros de escrita
    }
  });
}

onMounted(() => {
  loadIframe();
});

watch(
  () => [props.element.vturbBody, props.element.vturbHead],
  () => {
    loadIframe();
  }
);
</script>

<style scoped>
.modal-vturb-container {
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  background: #000;
}
.modal-vturb-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
