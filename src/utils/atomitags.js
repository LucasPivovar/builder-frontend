/**
 * Helper para substituição dinâmica de Atomitags e Formatações Inline
 */
export function getDynamicDateString(styleKey = 'full') {
  const now = new Date();
  const weekdayStr = now.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dayNum = now.getDate();
  const monthStr = now.toLocaleDateString('pt-BR', { month: 'long' });
  const yearNum = now.getFullYear();
  const dateFormatted = now.toLocaleDateString('pt-BR');

  if (styleKey === 'warning') {
    return '⚠️ ATENÇÃO: Última chance em ' + dateFormatted;
  } else if (styleKey === 'valid_today') {
    return '🔥 VÁLIDO SOMENTE HOJE (' + weekdayStr + ')';
  } else if (styleKey === 'vagas') {
    return '⚡ AVISO IMPORTANTE: Vagas limitadas para ' + monthStr + ' de ' + yearNum;
  } else if (styleKey === 'live') {
    return '🔴 AO VIVO HOJE (' + dayNum + ' de ' + monthStr + ')';
  } else if (styleKey === 'none') {
    return '';
  } else {
    return 'Hoje, ' + weekdayStr + ', ' + dayNum + ' de ' + monthStr + ' de ' + yearNum;
  }
}

export function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function parseAtomitags(text, altColor = '#f1c232', bgColor = '#00ff0b', options = {}) {
  if (!text) return '';
  let html = String(text);

  const now = new Date();
  const weekday = now.toLocaleDateString('pt-BR', { weekday: 'long' });
  const day = now.getDate();
  const month = now.toLocaleDateString('pt-BR', { month: 'long' });
  const year = now.getFullYear();

  const cityName = options.cityName || 'Curitiba';
  const minViewers = options.minViewers || 140;
  const maxViewers = options.maxViewers || 200;
  const randomViewers = Math.floor(Math.random() * (maxViewers - minViewers + 1)) + minViewers;
  const countColor = options.countColor || (options.style && options.style.countColor) || '#38bdf8';

  // 1. Suporte a quebra de linha com \n e <br>
  html = html.replace(/\r?\n/g, '<br>');

  // 2. Atomitags de variáveis dinâmicas
  html = html.replace(/\$cidade/gi, cityName);
  html = html.replace(/\$hoje-ext/gi, `${weekday}, ${day} de ${month} de ${year}`);
  html = html.replace(/\$hoje/gi, now.toLocaleDateString('pt-BR'));
  html = html.replace(/\$espectadores/gi, `<strong style="color:${countColor}">${randomViewers}</strong>`);
  html = html.replace(/\$random/gi, `<strong style="color:${countColor}">${randomViewers}</strong>`);

  // 3. Formatações customizadas (regexes não-gulosos)
  html = html.replace(/>>(.+?)<</g, `<span style="color:${altColor};">$1</span>`);
  html = html.replace(/\[\[(.+?)\]\]/g, `<span style="background-color:${bgColor}; color:#000000; padding:0 4px; border-radius:2px;">$1</span>`);
  html = html.replace(/\*\*(.+?)\*\*/g, `<strong>$1</strong>`);
  html = html.replace(/--(.+?)--/g, `<del>$1</del>`);
  html = html.replace(/__(.+?)__/g, `<u>$1</u>`);
  html = html.replace(/\/\/(.+?)\/\//g, `<em>$1</em>`);
  html = html.replace(/\(\((.+?)\)\)/g, `<span style="color:#ffffff;">$1</span>`);
  html = html.replace(/~(.+?)~/g, `<span class="is-pulsing" style="display:inline-block;">$1</span>`);

  return html;
}

export function getNum(val, fallback) {
  if (val === undefined || val === null || val === '' || isNaN(Number(val))) {
    return fallback;
  }
  return Number(val);
}

