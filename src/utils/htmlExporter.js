import { hexToRgba, getNum } from './atomitags.js';

export function generateFullHTML(stateOrRows, pageSettingsParam) {
  let rows = [];
  let pageSettings = {};

  if (Array.isArray(stateOrRows)) {
    rows = stateOrRows;
    pageSettings = pageSettingsParam || {};
  } else if (stateOrRows && typeof stateOrRows === 'object') {
    rows = Array.isArray(stateOrRows.rows) ? stateOrRows.rows : [];
    pageSettings = stateOrRows.pageSettings || pageSettingsParam || {};
  }

  const pageTitle = pageSettings.pageTitle || 'Página de Vendas - VSL';
  const metaDesc = pageSettings.metaDesc || 'Página oficial de vendas e conversão VSL.';
  const bgColor = pageSettings.bgColor || '#191919';
  const fontFamily = pageSettings.fontFamily || 'Roboto';
  const faviconUrl = pageSettings.faviconUrl || '';

  // Processa Meta Pixel
  let metaPixelScript = '';
  if (pageSettings.metaPixel) {
    const p = pageSettings.metaPixel.trim();
    if (p.includes('<script')) {
      metaPixelScript = p;
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
        fbq('init', '${p}');
        fbq('track', 'PageView');
        </script>
        <!-- End Meta Pixel Code -->
      `;
    }
  }

  // Coleta scripts de head do VTurb
  let vturbHeadCode = '';
  for (const row of rows) {
    for (const col of row.columns) {
      for (const elem of col.elements) {
        if (elem.type === 'vturb-player' && elem.vturbHead) {
          vturbHeadCode += elem.vturbHead + '\n';
        }
      }
    }
  }
  const isEmailMode = pageSettings.builderMode === 'email' || rows.some(r => r.columns.some(c => c.elements.some(e => ['email-header', 'email-footer', 'email-tag'].includes(e.type))));

  if (isEmailMode) {
    let emailRowsHTML = '';
    for (const row of rows) {
      for (const col of row.columns) {
        let colElemsHTML = '';
        let hasHeaderOrFooter = false;
        for (const elem of col.elements) {
          if (elem.type === 'email-header' || elem.type === 'email-footer') {
            hasHeaderOrFooter = true;
            emailRowsHTML += renderExportElement(elem, fontFamily);
          } else {
            colElemsHTML += renderExportElement(elem, fontFamily);
          }
        }
        if (!hasHeaderOrFooter && colElemsHTML.trim()) {
          emailRowsHTML += `<tr><td class="pad" style="padding:34px 44px 38px;background:#ffffff">${colElemsHTML}</td></tr>`;
        }
      }
    }

    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; box-sizing: border-box; }
    @media only screen and (max-width:620px) {
      .email { width:100%!important; max-width:100%!important; }
      .pad { padding-left:24px!important; padding-right:24px!important; }
      .title { font-size:24px!important; line-height:30px!important; }
      .cta { display:block!important; text-align:center!important; }
      .email img { max-width:100%!important; height:auto!important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${bgColor || '#f5f5f7'};font-family:'${fontFamily}',sans-serif!important">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:32px 12px">
        <table class="email" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #d4d4d8;box-shadow:0 8px 24px rgba(0,0,0,0.06)">
          ${emailRowsHTML}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // Constrói o HTML do corpo
  let bodyContentHTML = '';
  for (const row of rows) {
    let colsHTML = '';
    for (const col of row.columns) {
      let elemsHTML = '';
      for (const elem of col.elements) {
        elemsHTML += renderExportElement(elem, fontFamily);
      }
      colsHTML += `<div class="builder-col" style="flex: ${col.flex || 1};">${elemsHTML}</div>`;
    }
    const rowHasTopBanner = row.columns.some(c => c.elements.some(e => e.type === 'top-banner'));
    const rowClass = rowHasTopBanner ? 'builder-row has-top-banner' : 'builder-row';
    bodyContentHTML += `<div class="${rowClass}">${colsHTML}</div>`;
  }

  const fullDocHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}">
  ${faviconUrl ? `<link rel="icon" href="${faviconUrl}">` : ''}

  <!-- GOOGLE FONTS -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- BOOTSTRAP ICONS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html {
      width: 100%;
      min-height: 100vh;
      background-color: ${bgColor};
      font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #ffffff;
      overflow-x: hidden;
    }
    .vsl-container {
      width: 100%;
      margin: 0 auto;
    }
    .builder-row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto clamp(20px, 3vh, 36px) auto;
      padding: 0 16px;
      clear: both;
      box-sizing: border-box;
    }
    .builder-row.has-top-banner {
      max-width: 100%;
      width: 100%;
      margin: 0 0 clamp(16px, 2.5vh, 28px) 0;
      padding: 0;
    }
    .builder-col {
      display: flex;
      flex-direction: column;
      gap: clamp(16px, 2.5vh, 24px);
      width: 100%;
      flex: 1;
      box-sizing: border-box;
    }
    .canvas-element {
      display: block;
      width: 100%;
      clear: both;
      margin: 0;
      padding: 0;
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
      text-align: center;
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
      margin: 0 auto;
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
    .canvas-pitch-btn, .canvas-button {
      display: inline-block;
      text-decoration: none;
      text-align: center;
      box-sizing: border-box;
      max-width: 100%;
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
        try {
          var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          if (data && (data.currentTime !== undefined || data.time !== undefined)) {
            var time = data.currentTime || data.time;
            checkDelay(parseFloat(time));
          }
        } catch(err) {}
      });

      // 2. Poll nos players VTurb e HTML5 video
      setInterval(function() {
        try {
          if (window.smartplayer && window.smartplayer.instances) {
            window.smartplayer.instances.forEach(function(inst) {
              if (inst && inst.video && inst.video.currentTime > 0) {
                checkDelay(inst.video.currentTime);
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
        var hasVideo = document.querySelector('video') ||
          (window.smartplayer && window.smartplayer.instances && window.smartplayer.instances.length > 0);
        if (!hasVideo) checkDelay(elapsedSec);
        var allRevealed = Object.keys(revealed).length >= delayElems.length;
        if (allRevealed) clearInterval(fallbackInterval);
      }, 500);
    })();
  </script>

  <!-- SCRIPT AUTOMÁTICO DE FLUTUAÇÃO DE ESPECTADORES AO VIVO -->
  <script>
    (function() {
      var widgets = document.querySelectorAll('.canvas-live-viewers-widget');
      if (!widgets.length) return;
      widgets.forEach(function(widget) {
        var min = parseInt(widget.getAttribute('data-min') || '140', 10);
        var max = parseInt(widget.getAttribute('data-max') || '200', 10);
        var countEl = widget.querySelector('.vsl-viewer-count');
        if (!countEl) return;
        setInterval(function() {
          var cur = parseInt(countEl.textContent || min, 10);
          var delta = Math.floor(Math.random() * 7) - 3;
          var next = cur + delta;
          if (next < min) next = min + Math.floor(Math.random() * 4);
          if (next > max) next = max - Math.floor(Math.random() * 4);
          countEl.textContent = next;
        }, 3200);
      });
    })();
  </script>
</body>
</html>`;

  return fullDocHTML;
}

function parseAtomitags(text, altColor = '#f1c232', bgColor = '#00ff0b', parseOpts = {}) {
  if (!text) return '';

  let str = String(text);

  // 0. Quebra de linha
  str = str.replace(/\r?\n/g, '<br>');

  // 1. Substituir variáveis conhecidas
  if (parseOpts.cityName) {
    str = str.replace(/\$cidade/gi, parseOpts.cityName);
  } else {
    str = str.replace(/\$cidade/gi, 'Curitiba');
  }

  // $espectadores
  const minV = parseOpts.minViewers !== undefined && parseOpts.minViewers !== null ? parseInt(parseOpts.minViewers, 10) : 140;
  const maxV = parseOpts.maxViewers !== undefined && parseOpts.maxViewers !== null ? parseInt(parseOpts.maxViewers, 10) : 200;
  const realMin = Math.min(minV, maxV);
  const realMax = Math.max(minV, maxV);
  const randViewers = Math.floor(Math.random() * (realMax - realMin + 1)) + realMin;
  str = str.replace(/\$espectadores/gi, randViewers);

  // $hoje-ext
  const todayExt = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  str = str.replace(/\$hoje-ext/gi, todayExt);

  // $hoje
  const todayShort = new Date().toLocaleDateString('pt-BR');
  str = str.replace(/\$hoje/gi, todayShort);

  // 2. Parsers visuais de texto (atomitags)
  // >>texto<< -> cor alternativa
  str = str.replace(/>>(.*?)<</g, `<span style="color: ${altColor};">$1</span>`);

  // [[texto]] -> fundo destacado
  str = str.replace(/\[\[(.*?)\]\]/g, `<span style="background-color: ${bgColor}; color: #000000; padding: 2px 6px; border-radius: 4px; font-weight: 700;">$1</span>`);

  // **texto** -> negrito
  str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // ~texto~ -> pulsando / destaque neon
  str = str.replace(/~(.*?)~/g, `<span class="is-pulsing" style="color: ${altColor}; display: inline-block;">$1 ✦</span>`);

  // --texto-- -> riscado (strikethrough)
  str = str.replace(/--(.*?)--/g, '<del style="opacity: 0.7;">$1</del>');

  // __texto__ -> sublinhado
  str = str.replace(/__(.*?)__/g, '<u style="text-decoration-color: ' + altColor + ';">$1</u>');

  // //texto// -> itálico
  str = str.replace(/\/\/(.*?)\/\//g, '<em>$1</em>');

  // ((texto)) -> texto em branco puro
  str = str.replace(/\(\((.*?)\)\)/g, '<span style="color: #ffffff;">$1</span>');

  return str;
}

function renderExportElement(elem, fontFamily = 'Poppins') {
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

  let innerHTML = '';

  const parseOpts = {
    cityName: elem.cityName,
    minViewers: elem.minViewers,
    maxViewers: elem.maxViewers,
    countColor: style.countColor || '#38bdf8'
  };

  if (type === 'top-banner') {
    const py = getNum(style.paddingVertical, 12);
    const px = getNum(style.paddingHorizontal, 16);
    const mt = getNum(style.marginTop, 0);
    const mb = getNum(style.marginBottom, 0);
    const bannerBg = style.hasTransparentBg ? 'transparent' : (style.bgOpacity !== undefined && style.bgOpacity !== null && style.bgOpacity !== '' && Number(style.bgOpacity) < 1 ? hexToRgba(style.bgColor || '#dc2626', Number(style.bgOpacity)) : (style.bgColor || '#dc2626'));
    innerHTML = `<div class="canvas-top-banner" style="background: ${bannerBg}; color: ${style.textColor || '#ffffff'}; font-weight: ${style.fontWeight || '800'}; text-align: ${style.align || 'center'}; padding: ${py}px ${px}px; margin-top: ${mt}px; margin-bottom: ${mb}px; font-size: ${style.fontSize || '15px'}; width: 100%; ${borderStyleStr} border-radius: ${style.borderRadius || 0}px;">
      ${parseAtomitags(elem.content || '⚠️ ATENÇÃO NÃO FECHE ESTA PÁGINA ⚠️', style.altColor, style.bgColor, parseOpts)}
    </div>`;
  } else if (type === 'heading') {
    const py = getNum(style.paddingVertical, 0);
    const px = getNum(style.paddingHorizontal, 0);
    const mt = getNum(style.marginTop, 10);
    const mb = getNum(style.marginBottom, 10);
    const textStyle = `font-size:${style.fontSize || '30px'}; font-weight:${style.fontWeight || '800'}; color:${style.textColor || '#ffffff'}; margin:${mt}px auto ${mb}px auto; text-align:${style.align || 'center'}; line-height:${style.lineHeight || 1.3}; letter-spacing:${style.letterSpacing || 0}px;`;
    innerHTML = `<h2 class="canvas-heading" style="background-color: ${bg}; padding: ${py}px ${px}px; border-radius: ${style.borderRadius || 0}px; ${borderStyleStr} ${textStyle}">${parseAtomitags(elem.content, style.altColor, style.bgColor, parseOpts)}</h2>`;
  } else if (type === 'paragraph') {
    const py = getNum(style.paddingVertical, 0);
    const px = getNum(style.paddingHorizontal, 0);
    const mt = getNum(style.marginTop, 6);
    const mb = getNum(style.marginBottom, 6);
    const textStyle = `font-size:${style.fontSize || '15px'}; font-weight:${style.fontWeight || '400'}; color:${style.textColor || '#cccccc'}; margin:${mt}px auto ${mb}px auto; text-align:${style.align || 'center'}; line-height:${style.lineHeight || 1.5}; letter-spacing:${style.letterSpacing || 0}px;`;
    innerHTML = `<p class="canvas-paragraph" style="background-color: ${bg}; padding: ${py}px ${px}px; border-radius: ${style.borderRadius || 0}px; ${borderStyleStr} ${textStyle}">${parseAtomitags(elem.content, style.altColor, style.bgColor, parseOpts)}</p>`;
  } else if (type === 'button' || type === 'pitch-button') {
    const targetAttr = elem.openInNewTab !== false ? ' target="_blank"' : '';
    const defaultBg = '#ffffff';
    const defaultTextColor = '#000000';
    const defaultFontSize = '20px';
    const defaultPx = type === 'pitch-button' ? 24 : 28;
    const defaultRadius = type === 'pitch-button' ? 12 : 10;
    const btnBg = style.hasTransparentBg ? 'transparent' : (style.bgOpacity !== undefined && style.bgOpacity !== null && style.bgOpacity !== '' && Number(style.bgOpacity) < 1 ? hexToRgba(style.bgColor || defaultBg, Number(style.bgOpacity)) : (style.bgColor || defaultBg));
    const py = getNum(style.paddingVertical, 14);
    const px = getNum(style.paddingHorizontal, defaultPx);
    const mt = getNum(style.marginTop, 18);
    const mb = getNum(style.marginBottom, 18);
    const br = getNum(style.borderRadius, defaultRadius);
    const gc = style.glowColor || '#ffffff';
    const glowStyle = style.isGlow ? `box-shadow: 0 0 20px ${gc}, 0 0 40px ${gc};` : 'box-shadow: none;';
    const btnTextStyle = `font-size:${style.fontSize || defaultFontSize}; font-weight:${style.fontWeight || '700'}; color:${style.textColor || defaultTextColor}; margin-top:${mt}px; margin-bottom:${mb}px; text-align:${style.align || 'center'}; line-height:${style.lineHeight || 1.3}; letter-spacing:${style.letterSpacing || 0}px;`;
    const btnStyle = `display:inline-block; padding:${py}px ${px}px; border-radius:${br}px; text-decoration:none; background-color:${btnBg}; ${borderStyleStr} ${glowStyle} max-width:${(style.maxWidth && style.maxWidth.trim()) ? style.maxWidth.trim() : '100%'}; width:${elem.fullWidth ? '100%' : 'auto'}; box-sizing:border-box; ${btnTextStyle}`;
    const subTextHTML = elem.subtext ? `<span style="font-size:12px; opacity:0.88; display:block; margin-top:4px; font-weight:500;">${parseAtomitags(elem.subtext, style.altColor, style.bgColor, parseOpts)}</span>` : '';
    
    innerHTML = `<div style="text-align:${style.align || 'center'}; width: 100%;">
      <a href="${elem.url || '#'}"${targetAttr} class="${type === 'pitch-button' ? 'canvas-pitch-btn' : 'canvas-button'}" style="${btnStyle}">
        <span style="display:block;">${parseAtomitags(elem.content || (type === 'pitch-button' ? 'QUERO MEU ACESSO AGORA' : ''), style.altColor, style.bgColor, parseOpts)}</span>
        ${subTextHTML}
      </a>
    </div>`;
  } else if (type === 'upsell-buttons') {
    const py = getNum(style.paddingVertical, 14);
    const px = getNum(style.paddingHorizontal, 24);
    const mt = getNum(style.marginTop, 20);
    const mb = getNum(style.marginBottom, 20);
    const br = getNum(style.borderRadius, 12);
    const bg = style.bgColor || '#10B981';
    const color = style.textColor || '#ffffff';
    const acceptContent = parseAtomitags(elem.acceptText || 'SIM! ADQUIRA AGORA POR APENAS R$ 97,00', style.altColor, style.bgColor, parseOpts);
    const subContent = elem.acceptSubtext ? `<span style="font-size: 12px; opacity: 0.9; display: block; margin-top: 4px;">${parseAtomitags(elem.acceptSubtext, style.altColor, style.bgColor, parseOpts)}</span>` : '';
    const declineText = elem.declineText || 'Não, obrigado. Prefiro continuar operando manualmente.';
    const targetAttr = elem.acceptOpenInNewTab ? ' target="_blank"' : '';
    const decTargetAttr = elem.declineOpenInNewTab ? ' target="_blank"' : '';

    innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: ${mt}px; margin-bottom: ${mb}px; width: 100%;">
      <a href="${elem.acceptUrl || '#'}"${targetAttr} class="canvas-pitch-btn is-pulsing" style="background: ${bg}; color: ${color}; max-width: 420px; border-radius: ${br}px; padding: ${py}px ${px}px; text-align: center; text-decoration: none; width: 100%; font-weight: 700; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); display: inline-block;">
        <span style="font-size: 16px; display: block;">${acceptContent}</span>
        ${subContent}
      </a>
      <a href="${elem.declineUrl || '#'}"${decTargetAttr} style="background: rgba(220,38,38,0.1); color: #DC2626; border: 1px solid rgba(220,38,38,0.3); border-radius: 8px; padding: 10px 20px; font-size: 13px; text-decoration: none; display: inline-block;">
        ${declineText}
      </a>
    </div>`;
  } else if (type === 'vturb-player') {
    const mt = getNum(style.marginTop, 16);
    const mb = getNum(style.marginBottom, 16);
    const py = getNum(style.paddingVertical, 0);
    const px = getNum(style.paddingHorizontal, 0);
    const body = elem.vturbBody || '';
    const match = body.match(/padding[^:]*:[^\d]*(\d+(?:\.\d+)?)%/);
    const padTopRatio = match ? parseFloat(match[1]) / 100 : 0.5625;
    const isVertical = padTopRatio > 1.0;

    let mw = (style.maxWidth && style.maxWidth.trim()) ? style.maxWidth.trim()
             : (elem.vturbWidth && elem.vturbWidth.trim()) ? elem.vturbWidth.trim()
             : (isVertical ? '320px' : '640px');

    const mh = (style.maxHeight && style.maxHeight.trim()) ? style.maxHeight.trim() : (elem.vturbHeight || '');
    const br = style.borderRadius !== undefined && style.borderRadius !== null && style.borderRadius !== '' ? `border-radius: ${typeof style.borderRadius === 'number' ? style.borderRadius + 'px' : style.borderRadius}; overflow: hidden;` : '';
    const vturbW = mw ? `max-width: ${mw.endsWith('px') || mw.endsWith('%') || mw.endsWith('vw') ? mw : mw + 'px'};` : '';
    const vturbH = mh ? `max-height: ${mh.endsWith('px') || mh.endsWith('%') || mh.endsWith('vh') ? mh : mh + 'px'}; overflow: hidden;` : '';
    const vturbStyle = `margin: ${mt}px auto ${mb}px auto; padding: ${py}px ${px}px; width: 100%; ${vturbW} ${vturbH} ${br}`;

    if (elem.vturbBody && elem.vturbBody.trim().length > 0) {
      let vturbBodyContent = elem.vturbBody;
      if (isVertical) {
        vturbBodyContent = vturbBodyContent.replace(/max-width:\s*\d+px/gi, 'max-width: 100%');
      }
      innerHTML = `<div class="canvas-vturb-wrapper" style="${vturbStyle}">
        ${vturbBodyContent}
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
    const minV = elem.minViewers !== undefined && elem.minViewers !== null ? parseInt(elem.minViewers, 10) : 140;
    const maxV = elem.maxViewers !== undefined && elem.maxViewers !== null ? parseInt(elem.maxViewers, 10) : 200;
    const realMin = Math.min(minV, maxV);
    const realMax = Math.max(minV, maxV);
    const initialCount = Math.floor(Math.random() * (realMax - realMin + 1)) + realMin;
    const py = getNum(style.paddingVertical, 0);
    const px = getNum(style.paddingHorizontal, 0);
    const mt = getNum(style.marginTop, 16);
    const mb = getNum(style.marginBottom, 12);
    const bg = style.hasTransparentBg ? 'transparent' : (style.bgColor || 'transparent');

    innerHTML = `<div class="canvas-live-viewers-widget" data-min="${realMin}" data-max="${realMax}" style="color: ${style.textColor || '#ffffff'}; text-align: ${style.align || 'center'}; font-size: ${style.fontSize || '18px'}; margin-top: ${mt}px; margin-bottom: ${mb}px; background-color: ${bg}; padding: ${py}px ${px}px; width: 100%; box-sizing: border-box;">
      <strong class="vsl-viewer-count" style="color:${style.countColor || '#38bdf8'}">${initialCount}</strong> ${parseAtomitags(elem.content || 'espectadores estão vendo este conteúdo simultaneamente com você', style.altColor, style.bgColor, parseOpts)}
    </div>`;
  } else if (type === 'email-header') {
    const py = getNum(style.paddingVertical, 26);
    const px = getNum(style.paddingHorizontal, 44);
    const mt = getNum(style.marginTop, 0);
    const mb = getNum(style.marginBottom, 24);
    const bannerBg = style.bgColor || '#27272a';
    const logoContent = elem.logoType === 'image' && elem.logoImageUrl
      ? `<img src="${elem.logoImageUrl}" alt="Logo" width="130" style="display:block;width:130px;max-width:100%;height:auto;border:0">`
      : `<div style="color:${style.logoColor || '#ffffff'};font-family:'${fontFamily}',sans-serif!important;font-size:${style.fontSize || '20px'};font-weight:${style.fontWeight || '700'};">${elem.logoText || 'Rappu'}</div>`;
    innerHTML = `<tr><td class="pad" style="padding:${py}px ${px}px;margin-top:${mt}px;margin-bottom:${mb}px;background:${bannerBg};text-align:${style.align || 'left'}">${logoContent}</td></tr>`;
  } else if (type === 'email-footer') {
    const py = getNum(style.paddingVertical, 24);
    const px = getNum(style.paddingHorizontal, 44);
    const mt = getNum(style.marginTop, 24);
    const mb = getNum(style.marginBottom, 0);
    const bannerBg = style.bgColor || '#27272a';
    const logoContent = elem.logoType === 'image' && elem.logoImageUrl
      ? `<img src="${elem.logoImageUrl}" alt="Logo" width="105" style="display:block;width:105px;max-width:100%;height:auto;border:0;margin:0 auto 10px auto;">`
      : `<div style="color:${style.logoColor || '#ffffff'};font-family:'${fontFamily}',sans-serif!important;font-size:14px;font-weight:700;margin-bottom:8px;">${elem.logoText || 'Rappu'}</div>`;
    innerHTML = `<tr><td class="pad" align="${style.align || 'center'}" style="padding:${py}px ${px}px;margin-top:${mt}px;margin-bottom:${mb}px;background:${bannerBg}">${logoContent}<p style="margin:0;font-family:'${fontFamily}',sans-serif!important;font-size:${style.fontSize || '12px'};color:${style.textColor || '#a1a1aa'};font-weight:400;letter-spacing:0.2px">${elem.copyrightText || '© 2026 Rappu. Todos os direitos reservados.'}</p></td></tr>`;
  } else if (type === 'email-tag') {
    const py = getNum(style.paddingVertical, 5);
    const px = getNum(style.paddingHorizontal, 12);
    const mt = getNum(style.marginTop, 0);
    const mb = getNum(style.marginBottom, 12);
    const tagBg = style.bgColor || '#f4f4f5';
    const textCol = style.textColor || '#27272a';
    const borderCol = style.borderColor || '#e4e4e7';
    const radius = getNum(style.borderRadius, 999);
    innerHTML = `<div style="display:inline-block;background:${tagBg};border:1px solid ${borderCol};border-radius:${radius}px;color:${textCol};font-family:'${fontFamily}',sans-serif!important;font-size:${style.fontSize || '11px'};font-weight:${style.fontWeight || '500'};letter-spacing:.6px;padding:${py}px ${px}px;margin-top:${mt}px;margin-bottom:${mb}px">${parseAtomitags(elem.content || 'ARTES PRONTAS', style.altColor, style.bgColor, parseOpts)}</div>`;
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

export const generateExportedHTML = generateFullHTML;
