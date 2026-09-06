import { hexToRgba, getNum } from './astrotags.js';
import { renderSmartPopup } from './smartPopup.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeQuizOption(value) {
  if (value && typeof value === 'object') {
    return {
      label: String(value.label || value.text || value.title || '').trim(),
      description: String(value.description || value.subtitle || '').trim(),
      icon: String(value.icon || value.marker || '').trim()
    };
  }
  return { label: String(value || '').trim(), description: '', icon: '' };
}

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
  const trackingKey = String(pageSettings.trackingKey || 'draft').replace(/[^a-zA-Z0-9_-]/g, '');

  // Processa Meta Pixel
  let metaPixelScript = '';
  if (pageSettings.metaPixel) {
    const p = pageSettings.metaPixel.trim();
    if (p.includes('<script')) {
      metaPixelScript += '\n' + p + '\n';
    } else if (/^\d+$/.test(p)) {
      metaPixelScript += `
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
        window.__abPixels = window.__abPixels || {};
        if (!window.__abPixels['${p}']) { fbq('init', '${p}'); window.__abPixels['${p}'] = true; }
        var pixelKey = 'ab_pixel_${trackingKey}_${p}_PageView';
        try { if (!localStorage.getItem(pixelKey)) { fbq('trackSingle', '${p}', 'PageView'); localStorage.setItem(pixelKey, '1'); } } catch (_) { fbq('trackSingle', '${p}', 'PageView'); }
        </script>
        <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${p}&ev=PageView&noscript=1"
        /></noscript>
        <!-- End Meta Pixel Code -->
      `;
    }
  }

  // Coleta scripts de head do VTurb e Meta Pixel dos elementos
  let vturbHeadCode = '';
  for (const row of rows) {
    for (const col of row.columns) {
      for (const elem of col.elements) {
        if (elem.type === 'vturb-player' && elem.vturbHead) {
          vturbHeadCode += elem.vturbHead + '\n';
        }
        if (elem.type === 'meta-pixel') {
          if (elem.pixelCode && elem.pixelCode.includes('<script')) {
            metaPixelScript += '\n' + elem.pixelCode + '\n';
          } else if (elem.pixelId) {
            const pid = elem.pixelId.trim();
            if (!/^\d+$/.test(pid)) continue;
            const pevent = String(elem.pixelEvent || 'PageView').replace(/[^a-zA-Z0-9_]/g, '');
            metaPixelScript += `
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
              window.__abPixels = window.__abPixels || {};
              if (!window.__abPixels['${pid}']) { fbq('init', '${pid}'); window.__abPixels['${pid}'] = true; }
              ${pevent === 'Lead' ? '' : `var pixelKey = 'ab_pixel_${trackingKey}_${pid}_${pevent}';
              try { if (!localStorage.getItem(pixelKey)) { fbq('trackSingle', '${pid}', '${pevent}'); localStorage.setItem(pixelKey, '1'); } } catch (_) { fbq('trackSingle', '${pid}', '${pevent}'); }`}
              </script>
              <noscript><img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=${pid}&ev=${pevent}&noscript=1"
              /></noscript>
              <!-- End Meta Pixel Code -->
            `;
          }
        }
      }
    }
  }
  const isEmailMode = pageSettings.builderMode === 'email' || rows.some(r => r.columns.some(c => c.elements.some(e => ['email-header', 'email-footer', 'email-tag'].includes(e.type))));
  const quizTypes = ['quiz-question','quiz-next','quiz-progress','quiz-single','quiz-multiple','quiz-yes-no','quiz-loading','quiz-metric','quiz-price','quiz-spacer'];
  const isQuizMode = pageSettings.builderMode === 'quiz' || rows.some(r => r.columns.some(c => c.elements.some(e => quizTypes.includes(e.type))));

  if (isEmailMode) {
    let emailRowsHTML = '';
    for (const row of rows) {
      for (const col of row.columns) {
        let colElemsHTML = '';
        const flushContentRow = () => {
          if (!colElemsHTML.trim()) return;
          emailRowsHTML += `<tr><td class="pad" style="padding:34px 44px 38px;background:#ffffff">${colElemsHTML}</td></tr>`;
          colElemsHTML = '';
        };
        for (const elem of col.elements) {
          if (elem.type === 'email-header' || elem.type === 'email-footer') {
            flushContentRow();
            emailRowsHTML += renderExportElement(elem, fontFamily);
          } else {
            colElemsHTML += renderExportElement(elem, fontFamily);
          }
        }
        flushContentRow();
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
  for (const [rowIndex, row] of rows.entries()) {
    let colsHTML = '';
    for (const col of row.columns) {
      let elemsHTML = '';
      for (const elem of col.elements) {
        if (isQuizMode && elem.type === 'quiz-progress') continue;
        elemsHTML += renderExportElement(elem, fontFamily);
      }
      colsHTML += `<div class="builder-col" style="flex: ${col.flex || 1};">${elemsHTML}</div>`;
    }
    const rowHasTopBanner = row.columns.some(c => c.elements.some(e => e.type === 'top-banner'));
    const rowClass = rowHasTopBanner ? 'builder-row has-top-banner' : `builder-row${isQuizMode ? ' quiz-step' : ''}`;
    const progress = Math.round(((rowIndex + 1) / Math.max(1, rows.length)) * 100);
    const progressHTML = isQuizMode ? `<div class="quiz-progress" style="height:${Number(pageSettings.quizProgressHeight)||6}px"><span style="width:${progress}%;background:${pageSettings.quizProgressColor || '#0ea5e9'}"></span></div><div class="quiz-step-label">Etapa ${rowIndex + 1} de ${rows.length}</div>` : '';
    bodyContentHTML += `<div class="${rowClass}"${isQuizMode ? ` data-quiz-step="${rowIndex}"` : ''}>${progressHTML}${colsHTML}</div>`;
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
    .builder-row.has-top-banner:first-child, .builder-row.has-top-banner .canvas-top-banner { margin-top: 0 !important; }
    ${isQuizMode ? `
    body,html{background:#f5fbff!important;color:#0f172a!important}
    .vsl-container{width:min(100%,480px)!important;min-height:100vh;margin:0 auto!important;padding:24px 12px 48px!important;background:#f5fbff!important;display:flex;align-items:flex-start}
    .quiz-step{display:none;flex-direction:column;width:100%;margin:0!important;padding:28px 20px!important;border:1px solid #bae6fd;border-radius:24px;background:#fff;box-shadow:0 12px 34px rgba(14,116,144,.13)}
    .quiz-step.active{display:flex;animation:quizIn .3s ease}.quiz-step .builder-col{gap:14px}
    .quiz-progress{border-radius:999px;background:#e0f2fe;overflow:hidden}.quiz-progress span{display:block;height:100%;border-radius:inherit;background:#0ea5e9}.quiz-step-label{text-align:right;margin:7px 0 12px;color:#7890a8;font-size:9px;font-weight:800;text-transform:uppercase}
    .quiz-options{display:flex;flex-direction:column;gap:9px}.quiz-option{min-height:58px;display:grid;grid-template-columns:32px 1fr 18px;gap:10px;align-items:center;width:100%;padding:11px 14px;border:1px solid #bae6fd;border-radius:14px;background:#fff;color:#0f172a;font:inherit;font-size:15px;text-align:left;cursor:pointer}.quiz-option:hover,.quiz-option.selected{border-color:#0ea5e9;background:#f0f9ff}.quiz-options.quiz-required .quiz-option{border-color:#0ea5e9;box-shadow:0 0 0 2px rgba(14,165,233,.12)}.quiz-option-mark{width:29px;height:29px;border:1px solid #bae6fd;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:900}.quiz-option-copy{display:flex;min-width:0;flex-direction:column;gap:2px}.quiz-option-copy strong{font-size:15px;line-height:1.25;overflow-wrap:anywhere}.quiz-option-copy small{color:#64748b;font-size:12px;line-height:1.25;overflow-wrap:anywhere}.quiz-option.selected .quiz-option-mark{background:#0ea5e9;color:#fff}
    .quiz-loading{display:flex;flex-direction:column;gap:9px;padding:12px 2px}.quiz-loading-header{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#0f172a;font-size:13px;font-weight:700}.quiz-loading-header strong{color:#0369a1}.quiz-loading-bar{height:12px;border-radius:999px;background:#e0f2fe;overflow:hidden}.quiz-loading-bar span{position:relative;display:block;height:100%;background:#0ea5e9;transform-origin:left;animation:quizLoadGrow 1.15s cubic-bezier(.22,1,.36,1) both}.quiz-loading-bar span:after{content:'';position:absolute;inset:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(-120%);animation:quizLoadShimmer 1.45s ease-in-out .35s infinite}.quiz-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.quiz-metrics article{min-height:130px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid #bae6fd;border-radius:14px;animation:quizMetricIn .35s cubic-bezier(.22,1,.36,1) both}.quiz-metrics strong{font-size:22px;color:#0369a1}.quiz-metrics span{margin-top:8px;color:#64748b;font-size:12px;text-align:center}
    .quiz-price{border:2px solid #0ea5e9;border-radius:15px;overflow:hidden}.quiz-price>small{display:block;padding:6px;text-align:center;background:#0ea5e9;color:#fff;font-weight:800}.quiz-price>div{display:flex;justify-content:space-between;align-items:center;padding:16px}.quiz-price span{display:flex;flex-direction:column}.quiz-price em{font-style:normal;color:#64748b;font-size:11px}.quiz-price b{font-size:20px;color:#0369a1}
    @keyframes quizIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}@keyframes quizLoadGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes quizLoadShimmer{0%{transform:translateX(-120%)}70%,100%{transform:translateX(320%)}}@keyframes quizMetricIn{from{opacity:0;transform:translateY(9px) scale(.98)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.quiz-step,.quiz-loading-bar span,.quiz-loading-bar span:after,.quiz-metrics article{animation:none!important}}
    ` : ''}
    .builder-col {
      display: flex;
      flex-direction: column;
      gap: clamp(16px, 2.5vh, 24px);
      width: 100%;
      flex: 1;
      box-sizing: border-box;
    }
    @media (max-width: 700px) {
      .builder-row { padding: 0 12px; }
      .builder-row.has-top-banner { padding: 0; }
      .builder-col { flex: 0 0 100% !important; }
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

  ${isQuizMode ? `<script>
    (function(){
      var steps=Array.from(document.querySelectorAll('.quiz-step')),index=0,answers={};
      function show(next){index=Math.max(0,Math.min(next,steps.length-1));steps.forEach(function(step,i){step.classList.toggle('active',i===index)});window.scrollTo({top:0,behavior:'smooth'});document.dispatchEvent(new CustomEvent('quiz:step',{detail:{index:index}}));}
      document.addEventListener('click',function(event){
        var option=event.target.closest('.quiz-option');
        if(option){var group=option.closest('.quiz-options');group.classList.remove('quiz-required');group.removeAttribute('aria-invalid');if(group.dataset.multiple==='true')option.classList.toggle('selected');else{group.querySelectorAll('.quiz-option').forEach(function(item){item.classList.remove('selected')});option.classList.add('selected')}answers[index]=Array.from(group.querySelectorAll('.selected')).map(function(item){return item.dataset.value});}
        var next=event.target.closest('a[href="#quiz-next"]');if(next){event.preventDefault();var active=steps[index],required=active&&active.querySelector('.quiz-options');if(required&&!required.querySelector('.selected')){required.classList.add('quiz-required');required.setAttribute('aria-invalid','true');var first=required.querySelector('.quiz-option');if(first)first.focus();return;}document.dispatchEvent(new CustomEvent('quiz:answer',{detail:{index:index,answers:answers[index]||[]}}));if(index<steps.length-1)show(index+1);else document.dispatchEvent(new CustomEvent('quiz:complete',{detail:{answers:answers}}));}
      });
      show(0);window.quizAnswers=answers;
      document.addEventListener('quiz:complete',function(){
        var active=steps[index],button=active&&active.querySelector('a[href="#quiz-next"]');
        if(button){button.setAttribute('aria-disabled','true');button.style.pointerEvents='none';button.textContent='Concluído';}
        var destination=button&&button.getAttribute('data-complete-url');
        if(destination){try{var url=new URL(destination,location.href);if(url.protocol==='https:'||url.protocol==='http:'){setTimeout(function(){location.assign(url.href)},250);return;}}catch(e){/* Destino inválido: mantém confirmação na página. */}}
        var message=document.createElement('p');message.setAttribute('role','status');message.textContent='Respostas enviadas. Obrigado!';if(active)active.appendChild(message);
      },{once:true});
    })();
  </script>` : ''}

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

  <script>
    (function() {
      var countdowns = document.querySelectorAll('.builder-countdown');
      function update() {
        countdowns.forEach(function(item) {
          var target = new Date(item.getAttribute('data-target')).getTime();
          var seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
          var days = Math.floor(seconds / 86400); seconds %= 86400;
          var hours = Math.floor(seconds / 3600); seconds %= 3600;
          var minutes = Math.floor(seconds / 60); var secs = seconds % 60;
          var values = [[days,'dias'],[hours,'horas'],[minutes,'min'],[secs,'seg']];
          item.querySelector('.builder-countdown-numbers').innerHTML = values.map(function(value) {
            return '<span style="background:#e0f2fe;border-radius:10px;padding:10px 12px;min-width:54px;display:flex;flex-direction:column"><b style="font-size:26px;line-height:1">' + value[0] + '</b><small style="margin-top:5px;text-transform:uppercase;color:#475569">' + value[1] + '</small></span>';
          }).join('');
        });
      }
      if (countdowns.length) { update(); setInterval(update, 1000); }
    })();
  </script>

  <script>
    (function() {
      var pageKey = '${trackingKey || 'draft'}';
      var pageName = ${JSON.stringify(pageTitle)};
      var sessionKey = 'ab_session_' + pageKey;
      var sessionId = sessionStorage.getItem(sessionKey) || (Date.now().toString(36) + Math.random().toString(36).slice(2));
      var startedAt = Date.now();
      var countingTime = !document.hidden;
      function flushTime() {
        var now = Date.now();
        if (countingTime) {
          var seconds = Math.floor((now - startedAt) / 1000);
          if (seconds > 0) record('time_on_page', 'page', seconds);
        }
        startedAt = now;
      }
      document.addEventListener('visibilitychange', function(){ flushTime(); countingTime = !document.hidden; });
      window.addEventListener('pagehide', function(){ flushTime(); countingTime = false; });
      window.addEventListener('pageshow', function(){ startedAt = Date.now(); countingTime = !document.hidden; });
      var maxScroll = 0;
      sessionStorage.setItem(sessionKey, sessionId);
      function record(type, target, value, meta) {
        if (document.hidden && type.indexOf('video_') === 0) return;
        var metric = { pageKey: pageKey, pageId: pageKey, pageName: pageName, type: type, target: target || '', value: Number(value) || 0, sessionId: sessionId, referrer: document.referrer || '', meta: meta || {}, createdAt: new Date().toISOString() };
        var payload = { source: 'visual-builder', type: 'metric', metric: metric };
        try {
          var saved = JSON.parse(localStorage.getItem('builder_metrics_v1') || '[]');
          saved.unshift(metric);
          localStorage.setItem('builder_metrics_v1', JSON.stringify(saved.slice(0, 1000)));
        } catch (e) {}
        try {
          var body = JSON.stringify(metric);
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics/events', new Blob([body], { type: 'application/json' }));
          } else {
            fetch('/api/analytics/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true }).catch(function(){});
          }
        } catch (e) {}
        if (window.parent !== window) window.parent.postMessage(payload, '*');
      }
      record('page_view');
      document.addEventListener('click', function(event) {
        var target = event.target.closest && event.target.closest('a, button, [role="button"], .canvas-btn, .canvas-pitch-btn');
        if (target) record('cta_click', target.innerText || target.getAttribute('href') || target.getAttribute('aria-label') || '', 1, { href: target.getAttribute('href') || '' });
      });
      document.addEventListener('submit', function(event) {
        record('form_submit', event.target.getAttribute('action') || '', 1);
      });
      window.addEventListener('scroll', function() {
        var doc = document.documentElement;
        var height = Math.max(1, doc.scrollHeight - window.innerHeight);
        maxScroll = Math.max(maxScroll, Math.round((window.scrollY / height) * 100));
      }, { passive: true });
      setInterval(flushTime, 15000);
      window.addEventListener('beforeunload', function(){ record('scroll_depth', 'page', maxScroll); flushTime(); countingTime = false; });
      function bindVideos() {
        document.querySelectorAll('video').forEach(function(video, index) {
          if (video.dataset.analyticsBound) return;
          video.dataset.analyticsBound = '1';
          var target = video.getAttribute('id') || video.getAttribute('src') || ('video-' + (index + 1));
          var last = 0;
          document.addEventListener('visibilitychange', function(){ last = Math.round(video.currentTime || 0); });
          video.addEventListener('play', function(){ record('video_play', target, Math.round(video.currentTime || 0)); });
          video.addEventListener('timeupdate', function(){
            var now = Math.round(video.currentTime || 0);
            if (document.hidden) { last = now; return; }
            if (now - last >= 5) { last = now; record('video_progress', target, 5, { currentTime: now, duration: Math.round(video.duration || 0) }); }
          });
          video.addEventListener('ended', function(){ record('video_complete', target, Math.round(video.duration || video.currentTime || 0)); });
        });
        document.querySelectorAll('vturb-smartplayer, .canvas-vturb-wrapper').forEach(function(player, index) {
          if (player.dataset.analyticsBound) return;
          player.dataset.analyticsBound = '1';
          var smart = player.matches && player.matches('vturb-smartplayer') ? player : player.querySelector('vturb-smartplayer');
          var target = (smart && smart.getAttribute('id')) || player.getAttribute('data-video-id') || ('vturb-' + (index + 1));
          var played = false;
          var lastProgress = 0;
          var resetProgress = false;
          document.addEventListener('visibilitychange', function(){ resetProgress = true; });
          function markPlay(value) {
            if (!played) {
              played = true;
              record('video_play', target, Number(value) || 0, { provider: 'vturb' });
            }
          }
          player.addEventListener('click', function(){ markPlay(0); });
          if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) markPlay(0);
              });
            }, { threshold: [0.5] });
            observer.observe(player);
          }
          var progressTimer = setInterval(function() {
            try {
              var instances = window.smartplayer && window.smartplayer.instances ? window.smartplayer.instances : [];
              instances.forEach(function(inst) {
                var video = inst && inst.video;
                if (!video || !(video.currentTime > 0)) return;
                markPlay(video.currentTime);
                var now = Math.round(video.currentTime || 0);
                if (document.hidden || resetProgress) { lastProgress = now; resetProgress = false; return; }
                if (now - lastProgress >= 5) {
                  lastProgress = now;
                  record('video_progress', target, 5, { provider: 'vturb', currentTime: now, duration: Math.round(video.duration || 0) });
                }
                if (video.ended) {
                  record('video_complete', target, Math.round(video.duration || video.currentTime || 0), { provider: 'vturb' });
                  clearInterval(progressTimer);
                }
              });
            } catch (e) {}
          }, 1000);
        });
      }
      bindVideos();
      setInterval(bindVideos, 3000);
      document.addEventListener('quiz:complete', function(event) {
        record('quiz_answer', 'quiz_complete', 1, event.detail || {});
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
  str = str.replace(/~(.*?)~/g, `<span class="is-pulsing" style="color: ${altColor}; display: inline-block;">$1</span>`);

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
  if (elem.type === 'smart-popup') return renderSmartPopup(elem);
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
    const mb = getNum(style.marginBottom, 0);
    const bannerBg = style.hasTransparentBg ? 'transparent' : (style.bgOpacity !== undefined && style.bgOpacity !== null && style.bgOpacity !== '' && Number(style.bgOpacity) < 1 ? hexToRgba(style.bgColor || '#dc2626', Number(style.bgOpacity)) : (style.bgColor || '#dc2626'));
    innerHTML = `<div class="canvas-top-banner" style="background: ${bannerBg}; color: ${style.textColor || '#ffffff'}; font-weight: ${style.fontWeight || '800'}; text-align: ${style.align || 'center'}; padding: ${py}px ${px}px; margin-top: 0; margin-bottom: ${mb}px; font-size: ${style.fontSize || '15px'}; width: 100%; ${borderStyleStr} border-radius: ${style.borderRadius || 0}px;">
      ${parseAtomitags(elem.content || 'ATENÇÃO: NÃO FECHE ESTA PÁGINA', style.altColor, style.bgColor, parseOpts)}
    </div>`;
  } else if (type === 'heading' || type === 'quiz-question') {
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
  } else if (type === 'button' || type === 'pitch-button' || type === 'quiz-next') {
    const targetAttr = type === 'quiz-next' ? '' : (elem.openInNewTab !== false ? ' target="_blank"' : '');
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
      <a href="${type === 'quiz-next' ? '#quiz-next' : escapeHtml(elem.url || '#')}"${type === 'quiz-next' ? ` data-complete-url="${escapeHtml(elem.url === '#quiz-next' ? '' : elem.url || '')}"` : ''}${targetAttr} class="${type === 'pitch-button' ? 'canvas-pitch-btn' : 'canvas-button'}" style="${btnStyle}">
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
  } else if (type === 'quiz-progress') {
    innerHTML = `<div class="quiz-progress"><span style="width:${Math.max(0,Math.min(100,Number(elem.progress)||0))}%"></span></div>`;
  } else if (['quiz-single','quiz-multiple','quiz-yes-no'].includes(type)) {
    const optionSource = Array.isArray(elem.options) ? elem.options : String(elem.optionsText || 'Opção 1\nOpção 2').split('\n');
    const options = optionSource.map(normalizeQuizOption).filter(option => option.label);
    innerHTML = `<div class="quiz-options" data-multiple="${type === 'quiz-multiple'}">${options.map((option,index)=>`<button type="button" class="quiz-option" data-value="${escapeHtml(option.label)}"><span class="quiz-option-mark">${escapeHtml(option.icon || (type === 'quiz-multiple' ? String.fromCharCode(65+index) : ''))}</span><span class="quiz-option-copy"><strong>${escapeHtml(option.label)}</strong>${option.description ? `<small>${escapeHtml(option.description)}</small>` : ''}</span><span>›</span></button>`).join('')}</div>`;
  } else if (type === 'quiz-loading') {
    const progress=Math.max(0,Math.min(100,Number(elem.progress)||0)); innerHTML=`<div class="quiz-loading"><div class="quiz-loading-header"><span>${elem.content || 'Analisando suas respostas...'}</span><strong>${progress}%</strong></div><div class="quiz-loading-bar"><span style="width:${progress}%"></span></div></div>`;
  } else if (type === 'quiz-metric') {
    const metrics=String(elem.metricsText || '72%|Conversão').split('\n').map(line=>{const parts=line.split('|');return{value:(parts.shift()||'').trim(),label:parts.join('|').trim()}}).filter(metric=>metric.value||metric.label); innerHTML=`<div class="quiz-metrics">${metrics.map(({value,label})=>`<article><strong>${value||''}</strong><span>${label||''}</span></article>`).join('')}</div>`;
  } else if (type === 'quiz-price') {
    innerHTML=`<div class="quiz-price"><small>${elem.badge || 'Recomendado'}</small><div><span><strong>${elem.content || 'Plano PRO'}</strong><em>${elem.description || 'Acesso completo'}</em></span><b>${elem.price || 'R$ 197,00'}</b></div></div>`;
  } else if (type === 'quiz-spacer') {
    innerHTML=`<div style="height:${Math.max(4,Number(elem.height)||32)}px"></div>`;
  } else if (type === 'image') {
    const url = elem.imageUrl || elem.content || '';
    innerHTML = `<img src="${url}" alt="${elem.altText || ''}" style="display:block;width:100%;max-width:${style.maxWidth || '760px'};height:auto;margin:${getNum(style.marginTop, 10)}px auto ${getNum(style.marginBottom, 10)}px;border-radius:${getNum(style.borderRadius, 12)}px;">`;
  } else if (type === 'divider') {
    innerHTML = `<div style="border-top:2px solid ${style.textColor || '#38bdf8'};margin:${getNum(style.marginTop, 18)}px 0 ${getNum(style.marginBottom, 18)}px;opacity:.8"></div>`;
  } else if (type === 'testimonial') {
    innerHTML = `<figure style="max-width:680px;margin:${getNum(style.marginTop, 12)}px auto ${getNum(style.marginBottom, 12)}px;padding:24px;border:1px solid ${style.borderColor || '#bae6fd'};border-radius:${getNum(style.borderRadius, 14)}px;background:${style.bgColor || '#ffffff'};color:${style.textColor || '#0f172a'};text-align:left"><blockquote style="margin:8px 0 18px;line-height:1.55;font-size:${style.fontSize || '16px'}">${parseAtomitags(elem.content || '', style.altColor, style.bgColor, parseOpts)}</blockquote><figcaption><strong>${elem.author || 'Cliente verificado'}</strong><br><span style="color:#64748b;font-size:13px">${elem.role || 'Cliente'}</span></figcaption></figure>`;
  } else if (type === 'faq') {
    innerHTML = `<details open style="max-width:680px;margin:${getNum(style.marginTop, 8)}px auto ${getNum(style.marginBottom, 8)}px;padding:20px 24px;border:1px solid ${style.borderColor || '#bae6fd'};border-radius:${getNum(style.borderRadius, 12)}px;background:${style.bgColor || '#ffffff'};color:${style.textColor || '#0f172a'}"><summary style="cursor:pointer;font-weight:800">${parseAtomitags(elem.content || 'Pergunta frequente', style.altColor, style.bgColor, parseOpts)}</summary><p style="margin:16px 0 0;line-height:1.55">${parseAtomitags(elem.answer || '', style.altColor, style.bgColor, parseOpts)}</p></details>`;
  } else if (type === 'countdown') {
    const target = elem.targetDate || new Date(Date.now() + 86400000).toISOString();
    innerHTML = `<section class="builder-countdown" data-target="${target}" style="max-width:680px;margin:${getNum(style.marginTop, 12)}px auto ${getNum(style.marginBottom, 12)}px;padding:22px;border:1px solid ${style.borderColor || '#bae6fd'};border-radius:${getNum(style.borderRadius, 14)}px;background:${style.bgColor || '#ffffff'};color:${style.textColor || '#0f172a'};text-align:center"><strong style="display:block;margin-bottom:16px;font-size:${style.fontSize || '16px'}">${parseAtomitags(elem.content || '', style.altColor, style.bgColor, parseOpts)}</strong><div class="builder-countdown-numbers" style="display:flex;justify-content:center;gap:10px"></div></section>`;
  } else if (type === 'form') {
    const action = elem.submitUrl || '';
    innerHTML = `<form action="${action}" method="post" style="max-width:680px;margin:${getNum(style.marginTop, 12)}px auto ${getNum(style.marginBottom, 12)}px;padding:24px;border:1px solid ${style.borderColor || '#bae6fd'};border-radius:${getNum(style.borderRadius, 14)}px;background:#ffffff;color:#0f172a;display:flex;flex-direction:column;gap:11px;text-align:left"><h3 style="margin:0">${elem.formTitle || 'Receba as novidades'}</h3><p style="margin:0;color:#475569">${elem.description || ''}</p><input name="name" required placeholder="${elem.namePlaceholder || 'Seu nome'}" style="padding:12px;border:1px solid #cbd5e1;border-radius:8px;font:inherit"><input name="email" type="email" required placeholder="${elem.emailPlaceholder || 'Seu melhor e-mail'}" style="padding:12px;border:1px solid #cbd5e1;border-radius:8px;font:inherit"><button type="submit" style="padding:12px;border:0;border-radius:8px;background:${style.bgColor || '#0ea5e9'};color:${style.textColor || '#ffffff'};font:inherit;font-weight:800;cursor:pointer">${parseAtomitags(elem.content || 'Enviar', style.altColor, style.bgColor, parseOpts)}</button></form>`;
  } else if (type === 'meta-pixel') {
    innerHTML = '';
  } else {
    innerHTML = elem.content || '';
  }

  const bannerClass = type === 'top-banner' ? ' is-top-banner' : '';

  // Em tabelas de e-mail, <tr> precisa ser filho direto de <table>/<tbody>.
  if (type === 'email-header' || type === 'email-footer') return innerHTML;

  if (elem.delayEnabled) {
    const totalSeconds = ((elem.delayMinutes || 0) * 60) + (elem.delaySeconds || 0);
    return `<div class="canvas-element vsl-delay-element${bannerClass}" data-element-type="${type}" data-delay-seconds="${totalSeconds}">
      ${innerHTML}
    </div>`;
  }

  return `<div class="canvas-element${bannerClass}" data-element-type="${type}">${innerHTML}</div>`;
}

export const generateExportedHTML = generateFullHTML;
