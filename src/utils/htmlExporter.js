import { parseAtomitags, hexToRgba } from './atomitags';

/**
 * Compila a estrutura reativa do canvas em um documento HTML 100% autônomo com suporte a VSL Pitch Delay
 */
export function generateExportedHTML(rows, pageSettings) {
  const fontFam = pageSettings.fontFamily || 'Roboto';
  const bgColor = pageSettings.bgColor || '#191919';

  let bodyContentHTML = '';

  rows.forEach(row => {
    let colsHTML = '';
    const cols = row.columns || [];

    cols.forEach(col => {
      let elementsHTML = '';
      const elems = col.elements || [];

      elems.forEach(elem => {
        elementsHTML += renderExportElement(elem);
      });

      const flexStyle = col.flex ? `flex: ${col.flex};` : 'flex: 1;';
      colsHTML += `<div class="builder-col" style="${flexStyle}">${elementsHTML}</div>`;
    });

    bodyContentHTML += `<div class="builder-row${row.hasTopBanner ? ' has-top-banner' : ''}">${colsHTML}</div>`;
  });
  // Coleta de scripts Head do VTurb
  let vturbHeadCode = '';
  rows.forEach(row => {
    (row.columns || []).forEach(col => {
      (col.elements || []).forEach(elem => {
        if (elem.type === 'vturb-player' && elem.vturbHead && elem.vturbHead.trim()) {
          vturbHeadCode += `\n  <!-- VTurb Preload & Head Scripts -->\n  ${elem.vturbHead.trim()}\n`;
        }
      });
    });
  });

  // Meta Pixel Script Block
  let metaPixelScript = '';
  if (pageSettings.metaPixel && pageSettings.metaPixel.trim()) {
    const rawPixel = pageSettings.metaPixel.trim();
    if (rawPixel.includes('<script') || rawPixel.includes('fbq(') || rawPixel.includes('function(')) {
      metaPixelScript = `\n  <!-- Meta Pixel Code -->\n  ${rawPixel}\n  <!-- End Meta Pixel Code -->`;
    } else {
      metaPixelScript = `
  <!-- Meta Pixel Code -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${rawPixel}');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${rawPixel}&ev=PageView&noscript=1"/></noscript>
  <!-- End Meta Pixel Code -->`;
    }
  }

  const fullDocHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageSettings.pageTitle || 'Página de Vendas'}</title>
  <meta name="description" content="${pageSettings.metaDesc || ''}">
  ${pageSettings.faviconUrl ? `<link rel="icon" href="${pageSettings.faviconUrl}">` : ''}
  <!-- Bootstrap Icons CDN -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFam)}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: '${fontFam}', sans-serif;
      background-color: ${bgColor};
      color: #ffffff;
      line-height: 1.5;
      font-size: ${pageSettings.fontSize || 14}px;
      width: 100%;
      min-height: 100%;
    }
    .vsl-container {
      width: 100%;
      max-width: 100%;
      height: fit-content;
      min-height: 0;
      padding-bottom: 40px;
      margin: 0 auto;
    }
    .builder-row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto ${pageSettings.sectionGap !== undefined ? pageSettings.sectionGap : 16}px auto;
      padding: 10px 16px;
      clear: both;
      box-sizing: border-box;
    }
    .builder-row.has-top-banner {
      max-width: 100%;
      width: 100%;
      margin: 0 0 ${pageSettings.sectionGap !== undefined ? pageSettings.sectionGap : 16}px 0;
      padding: 0;
    }
    .builder-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      flex: 1;
      box-sizing: border-box;
    }
    .canvas-element {
      display: block;
      width: 100%;
      clear: both;
      margin-bottom: 12px;
      box-sizing: border-box;
    }
    .canvas-element.is-top-banner {
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: 100%;
    }
    .canvas-top-banner {
      width: 100%;
      max-width: 100%;
      margin: 0;
      text-align: center;
      padding: 12px 16px;
      font-weight: 800;
      font-size: 15px;
      box-sizing: border-box;
    }
    .canvas-heading {
      max-width: 900px;
      width: 100%;
      margin: 10px auto;
      box-sizing: border-box;
    }
    .canvas-paragraph {
      max-width: 850px;
      width: 100%;
      margin: 6px auto;
      box-sizing: border-box;
    }
    .canvas-vturb-wrapper {
      width: 100%;
      margin: 16px auto;
      display: block;
      clear: both;
      box-sizing: border-box;
    }
    .vturb-player-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #c8a045;
      gap: 8px;
      width: 100%;
      min-height: 250px;
    }
    .canvas-pitch-btn {
      max-width: 480px;
      width: 100%;
      display: inline-block;
      padding: 14px 24px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      text-align: center;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
      box-sizing: border-box;
    }
    .is-pulsing { animation: btnPulse 2s infinite; }
    .vsl-delay-element {
      display: none;
      opacity: 0;
      transition: opacity 0.6s ease-in;
    }
    .vsl-delay-element.revealed {
      display: block;
      opacity: 1;
    }
    @keyframes btnPulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1.02); box-shadow: 0 0 0 14px rgba(16, 185, 129, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
  </style>
  ${vturbHeadCode}
  ${metaPixelScript}
  ${pageSettings.gtmCode || ''}
</head>
<body>
  <div class="vsl-container" style="background-color: ${bgColor}; color: #ffffff;">
    ${bodyContentHTML}
  </div>

  <!-- SCRIPT AUTOMÁTICO DE INTERCEPTAÇÃO E SINCRONIZAÇÃO DE PITCH DELAY COM VÍDEO VSL -->
  <script>
    (function() {
      var delayElems = document.querySelectorAll('.vsl-delay-element');
      if (!delayElems.length) return;

      var revealed = {};

      function checkDelay(currentTime) {
        delayElems.forEach(function(el, index) {
          if (revealed[index]) return;
          var targetSec = parseInt(el.getAttribute('data-delay-seconds') || '0', 10);
          if (currentTime >= targetSec) {
            revealed[index] = true;
            el.style.display = 'block';
            setTimeout(function() {
              el.style.opacity = '1';
              el.classList.add('revealed');
            }, 30);
          }
        });
      }

      // 1. Intercepta mensagens postMessage de iframes (VTurb, Panda, Vimeo, YouTube)
      window.addEventListener('message', function(e) {
        if (!e.data) return;
        var t = null;
        if (typeof e.data === 'number') { t = e.data; }
        else if (e.data && typeof e.data.currentTime === 'number') { t = e.data.currentTime; }
        else if (e.data && typeof e.data.time === 'number') { t = e.data.time; }
        else if (e.data && e.data.event === 'timeupdate' && typeof e.data.seconds === 'number') { t = e.data.seconds; }
        if (t !== null && t >= 0) checkDelay(t);
      });

      // 2. Poll continuo: VTurb smartplayer API + HTML5 <video>
      setInterval(function() {
        // VTurb smartplayer instances
        try {
          if (window.smartplayer && window.smartplayer.instances) {
            window.smartplayer.instances.forEach(function(sp) {
              if (sp && sp.video && typeof sp.video.currentTime === 'number') {
                checkDelay(sp.video.currentTime);
              } else if (sp && typeof sp.currentTime === 'number') {
                checkDelay(sp.currentTime);
              }
            });
          }
        } catch(err) {}
        // HTML5 video nativo
        document.querySelectorAll('video').forEach(function(v) {
          if (!isNaN(v.currentTime) && v.currentTime > 0) {
            checkDelay(v.currentTime);
          }
        });
      }, 300);

      // 3. Fallback: tempo decorrido desde o carregamento (caso nao encontre video)
      var startTime = Date.now();
      var fallbackInterval = setInterval(function() {
        var elapsedSec = (Date.now() - startTime) / 1000;
        // So usa o fallback se nenhum video foi encontrado ainda
        var hasVideo = document.querySelector('video') ||
          (window.smartplayer && window.smartplayer.instances && window.smartplayer.instances.length > 0);
        if (!hasVideo) checkDelay(elapsedSec);
        // Para o fallback quando todos revelados
        var allRevealed = Object.keys(revealed).length >= delayElems.length;
        if (allRevealed) clearInterval(fallbackInterval);
      }, 500);
    })();
  </script>
</body>
</html>`;

  return fullDocHTML;
}

function renderExportElement(elem) {
  const type = elem.type;
  const style = elem.style || {};

  // Cálculo de cor de fundo com transparência e opacidade
  let bg = 'transparent';
  if (style.bgColor && !style.hasTransparentBg) {
    bg = style.bgOpacity !== undefined && style.bgOpacity < 1 ? hexToRgba(style.bgColor, style.bgOpacity) : style.bgColor;
  }

  // Cálculo de borda customizada
  let borderStyleStr = 'border: none;';
  if (style.hasBorder) {
    borderStyleStr = `border: ${style.borderWidth || 2}px ${style.borderStyle || 'solid'} ${style.borderColor || '#ffffff'};`;
  }

  const textStyle = `font-size:${style.fontSize || '24px'}; font-weight:${style.fontWeight || '700'}; color:${style.textColor || '#ffffff'}; margin-top:${style.marginTop || 2}px; margin-bottom:${style.marginBottom || 2}px; text-align:${style.align || 'center'}; line-height:${style.lineHeight || 1.3}; letter-spacing:${style.letterSpacing || 0}px;`;

  let innerHTML = '';

  const parseOpts = {
    cityName: elem.cityName,
    minViewers: elem.minViewers,
    maxViewers: elem.maxViewers
  };

  if (type === 'top-banner') {
    const py = style.paddingVertical !== undefined ? style.paddingVertical : 12;
    const px = style.paddingHorizontal !== undefined ? style.paddingHorizontal : 16;
    const bannerBg = style.hasTransparentBg ? 'transparent' : (style.bgOpacity !== undefined && style.bgOpacity < 1 ? hexToRgba(style.bgColor || '#dc2626', style.bgOpacity) : (style.bgColor || '#dc2626'));
    innerHTML = `<div class="canvas-top-banner" style="background: ${bannerBg}; color: ${style.textColor || '#ffffff'}; font-weight: 800; text-align: center; padding: ${py}px ${px}px; font-size: 15px; width: 100%; ${borderStyleStr} border-radius: ${style.borderRadius || 0}px;">
      ${parseAtomitags(elem.content || '⚠️ ATENÇÃO NÃO FECHE ESTA PÁGINA ⚠️', style.altColor, style.bgColor, parseOpts)}
    </div>`;
  } else if (type === 'heading') {
    const py = style.paddingVertical !== undefined ? style.paddingVertical : 0;
    const px = style.paddingHorizontal !== undefined ? style.paddingHorizontal : 0;
    innerHTML = `<h2 class="canvas-heading" style="background-color: ${bg}; padding: ${py}px ${px}px; border-radius: ${style.borderRadius || 0}px; ${borderStyleStr} ${textStyle}">${parseAtomitags(elem.content, style.altColor, style.bgColor, parseOpts)}</h2>`;
  } else if (type === 'paragraph') {
    const py = style.paddingVertical !== undefined ? style.paddingVertical : 0;
    const px = style.paddingHorizontal !== undefined ? style.paddingHorizontal : 0;
    innerHTML = `<p class="canvas-paragraph" style="background-color: ${bg}; padding: ${py}px ${px}px; border-radius: ${style.borderRadius || 0}px; ${borderStyleStr} ${textStyle}">${parseAtomitags(elem.content, style.altColor, style.bgColor, parseOpts)}</p>`;
  } else if (type === 'button' || type === 'pitch-button') {
    const targetAttr = elem.openInNewTab !== false ? ' target="_blank"' : '';
    const btnBg = style.hasTransparentBg ? 'transparent' : (style.bgOpacity !== undefined && style.bgOpacity < 1 ? hexToRgba(style.bgColor || '#6366f1', style.bgOpacity) : (style.bgColor || '#6366f1'));
    const py = style.paddingVertical !== undefined ? style.paddingVertical : 14;
    const px = style.paddingHorizontal !== undefined ? style.paddingHorizontal : 28;
    const glowStyle = style.isGlow ? `box-shadow: 0 0 20px ${style.glowColor || '#6366f1'}, 0 0 40px ${style.glowColor || '#6366f1'};` : '';
    const btnStyle = `display:inline-block; padding:${py}px ${px}px; border-radius:${style.borderRadius !== undefined ? style.borderRadius : 10}px; text-decoration:none; background-color:${btnBg}; ${borderStyleStr} ${glowStyle} max-width:100%; width:auto; box-sizing:border-box; ${textStyle}`;
    const subTextHTML = elem.subtext ? `<span style="font-size:12px; opacity:0.88; display:block; margin-top:4px; font-weight:500;">${parseAtomitags(elem.subtext, style.altColor, style.bgColor, parseOpts)}</span>` : '';
    
    innerHTML = `<div style="text-align:${style.align || 'center'}; width: 100%;">
      <a href="${elem.url || '#'}"${targetAttr} class="canvas-button" style="${btnStyle}">
        <span style="display:block;">${parseAtomitags(elem.content, style.altColor, style.bgColor, parseOpts)}</span>
        ${subTextHTML}
      </a>
    </div>`;
  } else if (type === 'vturb-player') {
    // Aceita style.maxWidth (novo) ou vturbWidth (legado)
    const mw = (style.maxWidth && style.maxWidth.trim()) ? style.maxWidth.trim() : (elem.vturbWidth || '');
    const mh = (style.maxHeight && style.maxHeight.trim()) ? style.maxHeight.trim() : (elem.vturbHeight || '');
    const vturbW = mw ? `max-width: ${mw.endsWith('px') || mw.endsWith('%') ? mw : mw + 'px'};` : '';
    const vturbH = mh ? `max-height: ${mh.endsWith('px') || mh.endsWith('%') ? mh : mh + 'px'}; overflow: hidden;` : '';
    const vturbStyle = `margin: 0 auto; width: 100%; ${vturbW} ${vturbH}`;
    if (elem.vturbBody && elem.vturbBody.trim().length > 0) {
      innerHTML = `<div class="canvas-vturb-wrapper" style="${vturbStyle}">
        ${elem.vturbBody}
      </div>`;
    } else {
      innerHTML = `<div class="canvas-vturb-wrapper" style="${vturbStyle}">
        <div class="vturb-player-box">
          <i class="bi bi-play-circle-fill" style="font-size: 38px;"></i>
          <span style="font-weight: 700; font-size: 13px;">Player VTurb (VSL)</span>
        </div>
      </div>`;
    }
  } else if (type === 'live-viewers') {
    innerHTML = `<div style="color: ${style.textColor || '#ffffff'}; text-align: center; font-size: ${style.fontSize || '18px'}; margin-top: 20px; width: 100%;">
      👀 <strong style="color:${style.countColor || '#ffffff'}">${Math.floor(Math.random() * ((elem.maxViewers || 200) - (elem.minViewers || 140) + 1)) + (elem.minViewers || 140)}</strong> ${parseAtomitags(elem.content || 'espectadores estão vendo este conteúdo simultaneamente com você', style.altColor, style.bgColor, parseOpts)}
    </div>`;
  } else if (type === 'meta-pixel') {
    if (elem.pixelId) {
      innerHTML = `<script>if(typeof fbq === 'function'){ fbq('track', '${elem.pixelEvent || 'PageView'}'); }</script>`;
    }
  } else {
    innerHTML = elem.content || '';
  }

  const bannerClass = type === 'top-banner' ? ' is-top-banner' : '';

  if (elem.delayEnabled) {
    const totalSeconds = ((elem.delayMinutes || 0) * 60) + (elem.delaySeconds || 0);
    return `<div class="canvas-element vsl-delay-element${bannerClass}" data-element-type="${type}" data-delay-seconds="${totalSeconds}">
      ${innerHTML}
    </div>`;
  }

  return `<div class="canvas-element${bannerClass}" data-element-type="${type}">${innerHTML}</div>`;
}
