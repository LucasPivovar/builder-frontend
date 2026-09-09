<template>
  <div class="modal-vturb-container" :style="wrapperStyle">
    <video
      v-if="element.hostedVideoUrl"
      class="modal-hosted-video"
      :src="element.hostedVideoUrl"
      :poster="element.hostedVideoPoster || ''"
      :controls="element.videoControls !== false"
      :autoplay="Boolean(element.videoAutoplay)"
      :muted="Boolean(element.videoMuted || element.videoAutoplay)"
      :loop="Boolean(element.videoLoop)"
      playsinline
      preload="metadata"
    ></video>
    <iframe
      v-else
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
import { ref, onMounted, computed, nextTick } from 'vue';
import { getNum } from '../../utils/astrotags';

const props = defineProps({
  element: { type: Object, required: true }
});

const iframeRef = ref(null);

const wrapperStyle = computed(() => {
  const e = props.element || {};
  const s = e.style || {};
  const body = e.vturbBody || '';
  const match = body.match(/padding[^:]*:[^\d]*(\d+(?:\.\d+)?)%/);
  const padTopRatio = match ? parseFloat(match[1]) / 100 : 0.5625;
  const padTop = match ? match[1] + '%' : '56.25%';
  const isVertical = padTopRatio > 1.0;
  const mw = (s.maxWidth && s.maxWidth.trim()) ? s.maxWidth.trim() : (e.vturbWidth || '100%');

  const mt = getNum(s.marginTop, 0);
  const mb = getNum(s.marginBottom, 0);

  // Preview estático: maior na horizontal para não ficar encolhido
  const maxTargetHeight = isVertical ? 450 : 300;
  const maxAllowableWidth = Math.round(maxTargetHeight / padTopRatio);

  let finalMw = /px|%/.test(mw) ? mw : (mw ? mw + 'px' : '100%');
  finalMw = `min(${finalMw}, ${maxAllowableWidth}px)`;

  return {
    position: 'relative',
    width: '100%',
    maxWidth: finalMw,
    maxHeight: `${maxTargetHeight}px`,
    paddingTop: padTop,
    height: 0,
    overflow: 'hidden',
    marginTop: `${mt}px`,
    marginBottom: `${mb}px`,
    marginRight: 'auto',
    marginLeft: 'auto',
    borderRadius: (s.borderRadius !== undefined && s.borderRadius !== null && s.borderRadius !== '') ? (typeof s.borderRadius === 'number' ? s.borderRadius + 'px' : s.borderRadius) : '10px'
  };
});

function loadIframe() {
  nextTick(() => {
    if (!iframeRef.value) return;
    try {
      const doc = iframeRef.value.contentDocument || iframeRef.value.contentWindow.document;
      if (!doc) return;
      const headCode = (props.element.vturbHead || '').trim();
      let bodyCode = (props.element.vturbBody || '').trim();
      if (!bodyCode) {
        bodyCode = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:220px;color:#94a3b8;background:#0f172a;font-family:sans-serif;text-align:center;padding:20px;box-sizing:border-box;"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px;opacity:0.8;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span style="font-weight:700;font-size:14px;color:#f8fafc;">Player VTurb</span><span style="font-size:12px;margin-top:4px;opacity:0.7;">Insira o código do vídeo nas configurações</span></div>`;
      }
      const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: transparent; overflow: hidden; }
    vturb-smartplayer { display: block !important; margin: 0 auto !important; width: 100% !important; max-width: 100% !important; height: 100% !important; max-height: 100% !important; }
    .vturb-player-placeholder { width: 100% !important; height: 100% !important; max-height: 100% !important; }
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
.modal-hosted-video { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; background:#000; }
</style>
