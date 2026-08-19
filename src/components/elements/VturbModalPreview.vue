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
        // eslint-disable-next-line no-useless-escape
        bodyCode = `<vturb-smartplayer id="vid-6a74fc57b559162d923537ff" style="display: block; margin: 0 auto; width: 100%; max-width: 320px;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 177.77777777777777% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/93deedb3-3cfc-44e6-b93a-9684b498089c/players/6a74fc57b559162d923537ff/v4/player.js", s.async=!0,document.head.appendChild(s); <\/script>`;
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
</style>
