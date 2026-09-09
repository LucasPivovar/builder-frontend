import { popupThemeCss, popupVariables } from './popupAppearance.js';
const escape = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// Runtime autossuficiente executado no navegador do visitante
function popupRuntime() {
  const script = document.currentScript;
  const root = script.previousElementSibling;
  const dialog = root.querySelector('dialog');
  const form = root.querySelector('form');
  const error = root.querySelector('[role="alert"]');
  const triggerType = root.dataset.trigger || 'exit';
  const openDelay = Number(root.dataset.delay) || 0;
  let hasOpened = false;
  let previousFocus;
  const seenKey = 'ab_popup_seen_' + (window.__builderPopupPageId || location.pathname) + '_' + root.dataset.popupId;
  try { hasOpened = localStorage.getItem(seenKey) === '1'; } catch (_) { /* Storage indisponível: mantém funcionamento nesta visita. */ }

  function open() {
    if (hasOpened || dialog.open) return;
    hasOpened = true;
    previousFocus = document.activeElement;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    try { localStorage.setItem(seenKey, '1'); } catch (_) { /* Storage indisponível. */ }
  }

  function close() {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  const closeBtn = root.querySelector('[data-close]');
  if (closeBtn) closeBtn.onclick = close;

  // Fechar ao clicar no backdrop (fora do conteúdo do modal)
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) close();
  });

  // 1. GATILHO: ENTRADA IMEDIATA
  if (triggerType === 'entry') {
    setTimeout(open, 300);
  }
  // 2. GATILHO: DELAY EM SEGUNDOS NA PÁGINA
  else if (triggerType === 'time') {
    setTimeout(open, Math.max(0, openDelay) * 1000);
  }
  // 4. GATILHO: EXIT INTENT (INTENÇÃO DE SAÍDA)
  else {
    // Desktop: cursor se move para cima da janela para fechar ou trocar de aba
    const handleMouseLeave = event => {
      if (hasOpened) return;
      if (event.clientY <= 15) {
        open();
      }
    };
    const handleMouseOut = event => {
      if (hasOpened) return;
      if (!event.relatedTarget && !event.toElement && event.clientY <= 15) {
        open();
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseout', handleMouseOut);

    // Mobile / Alternativo: se a aba perder foco ou mudar visibilidade
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && !hasOpened) {
        // Prepara para quando o usuário voltar para a aba
        window.addEventListener('focus', open, { once: true });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
  }

  for (const input of form.querySelectorAll('input[type="tel"]')) {
    const formatPhone = () => {
      const digits = input.value.replace(/\D/g, '');
      const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8), digits.slice(8)];
      input.value = digits ? '+' + parts.filter(Boolean).join(' ') : '';
      input.setCustomValidity(digits && digits.length !== 12 ? 'Informe 12 dígitos, incluindo o código do país e o DDD.' : '');
    };
    input.addEventListener('input', formatPhone);
    input.addEventListener('change', formatPhone);
  }

  // SUBMISSÃO DO FORMULÁRIO
  form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopPropagation();
    if (form.dataset.sending) return;
    error.textContent = '';

    const inputs = Array.from(form.querySelectorAll('input:not([type=hidden])'));
    const fields = inputs.map(input => ({
      id: input.name,
      label: input.dataset.label || input.placeholder || 'Campo',
      value: input.type === 'tel' ? input.value.replace(/\D/g, '') : input.value.trim()
    }));

    if (!fields.length) {
      error.textContent = 'Este formulário não possui campos.';
      return;
    }

    if (!window.__builderPopupPageId) {
      if (location.protocol === 'about:' || location.protocol === 'blob:' || location.protocol === 'file:') {
        form.reset();
        close();
        return;
      }
      error.textContent = 'Publique a página para ativar o envio de respostas.';
      return;
    }

    form.dataset.sending = 'true';
    const buttons = form.querySelectorAll('[type="submit"]');
    buttons.forEach(button => { button.disabled = true; button.style.opacity = '0.7'; });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      let visitorId;
      try {
        const key = 'ab_session_' + window.__builderPopupPageId;
        visitorId = localStorage.getItem(key) || Date.now().toString(36) + Math.random().toString(36).slice(2);
        localStorage.setItem(key, visitorId);
      } catch (_) { /* Identificação persistente indisponível. */ }
      const response = await fetch('/api/analytics/popup-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          pageId: window.__builderPopupPageId,
          signature: window.__builderAnalyticsSignature || '',
          popupId: root.dataset.popupId,
          visitorId,
          fields
        })
      });

      if (!response.ok) throw new Error('send');
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');

      form.reset();
      close();
    } catch (_) {
      error.textContent = 'Não foi possível enviar suas respostas. Tente novamente.';
    } finally {
      clearTimeout(timeout);
      delete form.dataset.sending;
      buttons.forEach(button => { button.disabled = false; button.style.opacity = '1'; });
    }
  });
}

function getIconSvg(icon) {
  const map = {
    lock: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e5a924" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
    star: '<svg width="28" height="28" viewBox="0 0 24 24" fill="#e5a924" stroke="#e5a924" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    fire: '<svg width="28" height="28" viewBox="0 0 24 24" fill="#e5a924" stroke="#e5a924" stroke-width="1"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
    gift: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e5a924" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>',
    bell: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e5a924" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
    shield: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e5a924" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    play: '<svg width="28" height="28" viewBox="0 0 24 24" fill="#e5a924" stroke="#e5a924" stroke-width="1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'
  };
  return (map[icon] || map.lock).replaceAll('#e5a924', 'currentColor');
}

export function renderSmartPopup(element) {
  const id = escape(element.id);
  const theme = Object.entries(popupVariables(element)).map(([key, value]) => `${key}:${value}`).join(';');
  const maxWidth = Math.min(800, Math.max(300, Number(element.maxWidth) || 500));
  const trigger = ['exit', 'time', 'entry'].includes(element.trigger) ? element.trigger : element.trigger === 'video' ? 'time' : 'exit';
  const openDelay = Math.min(3600, Math.max(0, Number(element.openDelay) || 0));

  const showBadge = element.showBadge !== false && (element.badgeText || '').trim();
  const badgeText = escape(element.badgeText || '🔴 CONTEÚDO EXCLUSIVO');
  const iconSvg = element.icon && element.icon !== 'none' ? getIconSvg(element.icon) : '';
  const title = escape(element.title || 'DESBLOQUEIE O VÍDEO');
  const subtitle = escape(element.subtitle || 'Preencha os dados abaixo para continuar assistindo o vídeo.');
  const submitText = escape(element.submitText || 'LIBERAR ACESSO');
  const showFooter = element.showFooter !== false && (element.footerText || '').trim();
  const footerText = escape(element.footerText || '🛡️ Seus dados estão protegidos');

  // Campos com suporte tanto ao novo formato .fields quanto ao legado .blocks
  let fieldsList = [];
  if (Array.isArray(element.fields)) {
    fieldsList = element.fields;
  } else if (Array.isArray(element.blocks) && element.blocks.some(b => b.type === 'field')) {
    fieldsList = element.blocks.filter(b => b.type === 'field');
  } else {
    fieldsList = [
      { id: 'name', inputType: 'text', placeholder: 'Seu Nome', required: true },
      { id: 'whatsapp', inputType: 'tel', placeholder: 'Whatsapp', required: true }
    ];
  }

  const fieldsHtml = fieldsList.slice(0, 20).map(f => {
    const fId = escape(f.id);
    const type = ['text', 'email', 'tel', 'number'].includes(f.inputType) ? f.inputType : 'text';
    const placeholder = escape(f.placeholder || f.label || 'Digite aqui');
    const req = f.required ? 'required' : '';
    return `<div style="width:100%;margin-bottom:12px">
      <input
        type="${type}"
        ${type === 'tel' ? 'inputmode="tel" autocomplete="tel" title="12 dígitos com código do país e DDD: +55 41 1234 5678"' : ''}
        id="${id}-${fId}"
        name="${fId}"
        aria-label="${placeholder}"
        data-label="${escape((f.placeholder || f.label || 'Campo').slice(0, 100))}"
        placeholder="${placeholder}${f.required ? ' *' : ''}"
        ${req}
        maxlength="2000"
        style="display:block;width:100%;box-sizing:border-box;background:#17181c;border:1px solid #282932;border-radius:10px;padding:15px 18px;color:#ffffff;font-size:15px;font-family:inherit;outline:none;"
      />
    </div>`;
  }).join('');

  return `<div data-popup-id="${id}" data-trigger="${trigger}" data-delay="${openDelay}">
    <style>
      ${popupThemeCss}
      dialog[data-smart-dialog-${id}]::backdrop {
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
      }
      dialog[data-smart-dialog-${id}] input:focus {
        border-color: #e5a924 !important;
        box-shadow: 0 0 0 2px rgba(229, 169, 36, 0.25) !important;
      }
      dialog[data-smart-dialog-${id}] input::placeholder {
        color: #636879 !important;
        opacity: 1;
      }
    </style>
    <dialog
      class="smart-popup-theme"
      data-smart-dialog-${id}
      aria-label="Modal inteligente de conversão"
      style="${theme};position:fixed;inset:0;margin:auto;border:1px solid #26262b;border-radius:20px;padding:0;max-width:${maxWidth}px;width:calc(100% - 32px);max-height:90vh;overflow:auto;box-sizing:border-box;color:#ffffff;background:#0d0d10;text-align:center;font-family:Montserrat,Poppins,sans-serif;box-shadow:0 25px 80px rgba(0,0,0,0.9);z-index:99999999;"
    >
      ${showBadge ? `<div class="sp-top-badge" style="background:#e5a924;color:#1a1505;font-size:11px;font-weight:900;letter-spacing:2px;padding:10px 16px;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:8px;">
        <span style="color:#dc2626;font-size:11px;">●</span> ${badgeText}
      </div>` : ''}

      <div style="padding:32px 28px 24px;position:relative;">
        <button
          type="button"
          data-close
          aria-label="Fechar"
          style="position:absolute;top:14px;right:18px;border:0;background:transparent;font-size:24px;cursor:pointer;color:#71717a;line-height:1;padding:4px;"
        >×</button>

        ${iconSvg ? `<div class="sp-icon-circle" style="width:68px;height:68px;border-radius:50%;margin:0 auto 20px;background:#18181c;border:1px solid rgba(229,169,36,0.45);box-shadow:0 0 28px rgba(229,169,36,0.18);display:flex;align-items:center;justify-content:center;">
          ${iconSvg}
        </div>` : ''}

        <h2 style="font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:0.5px;color:#ffffff;margin:0 0 10px;line-height:1.2;">
          ${title}
        </h2>

        ${subtitle ? `<p style="font-size:14px;color:#9ca3af;line-height:1.5;margin:0 auto 22px;max-width:380px;">${subtitle}</p>` : ''}

        <form style="display:block;max-width:420px;margin:0 auto;">
          ${fieldsHtml}
          <button
            type="submit"
            style="display:block;width:100%;box-sizing:border-box;background:linear-gradient(180deg,#f5c43d,#df9e19);color:#111111;font-weight:900;font-size:16px;letter-spacing:0.8px;text-transform:uppercase;padding:16px 20px;border:none;border-radius:10px;cursor:pointer;box-shadow:0 5px 22px rgba(223,158,25,0.38);margin-top:4px;font-family:inherit;"
          >${submitText}</button>
          <p role="alert" style="color:#ef4444;font-size:13px;margin:10px 0 0;"></p>
        </form>

        ${showFooter ? `<div style="font-size:12px;color:#636879;display:flex;align-items:center;justify-content:center;gap:6px;margin-top:16px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#636879" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>${footerText}</span>
        </div>` : ''}
      </div>
    </dialog>
  </div><script>(${popupRuntime.toString()})();</script>`;
}
