import { reactive } from 'vue';
import { generateExportedHTML } from '../utils/htmlExporter';

// ─── LocalStorage Helpers ────────────────────────────────────────────────────
function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}

// ─── Default Canvas (Funil VSL) ──────────────────────────────────────────────
const defaultFunilRows = [
  {
    id: 'row-1', hasTopBanner: true,
    columns: [{ id: 'col-1-1', flex: 1, elements: [{
      id: 'elem-1', type: 'top-banner',
      content: '⚠️ ATENÇÃO NÃO FECHE ESTA PÁGINA - PODE DAR ERRO NA SUA COMPRA ⚠️',
      style: { bgColor: '#dc2626', textColor: '#ffffff', fontSize: '15px', fontWeight: '800', marginTop: 0, marginBottom: 0, paddingVertical: 12, paddingHorizontal: 16, align: 'center' }
    }]}]
  },
  {
    id: 'row-2',
    columns: [{ id: 'col-2-1', flex: 1, elements: [{
      id: 'elem-2', type: 'heading',
      content: 'RECADO ESPECIAL PARA VOCÊ\nAlgo Para >>Triplicar<< Seus Ganhos com a Dollar App',
      style: { fontSize: '30px', fontWeight: '900', textColor: '#ffffff', altColor: '#f1c232', hasTransparentBg: true, marginTop: 10, marginBottom: 10, align: 'center', lineHeight: 1.3 }
    }]}]
  },
  {
    id: 'row-3',
    columns: [{ id: 'col-3-1', flex: 1, elements: [{
      id: 'elem-3', type: 'vturb-player', content: '',
      vturbBody: `<vturb-smartplayer id="vid-6a74fc57b559162d923537ff" style="display: block; margin: 0 auto; width: 100%; max-width: 320px;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 177.77777777777777% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/93deedb3-3cfc-44e6-b93a-9684b498089c/players/6a74fc57b559162d923537ff/v4/player.js", s.async=!0,document.head.appendChild(s); </script>`,
      vturbHead: '',
      style: { maxWidth: '320px', marginTop: 6, marginBottom: 6 }
    }]}]
  },
  {
    id: 'row-4',
    columns: [{ id: 'col-4-1', flex: 1, elements: [{
      id: 'elem-4', type: 'pitch-button', content: 'QUERO MEU ACESSO AGORA', url: '', openInNewTab: true, subtext: '',
      style: { bgColor: '#ffffff', textColor: '#000000', fontSize: '20px', fontWeight: '700', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, isGlow: false, glowColor: '#ffffff', marginTop: 10, marginBottom: 10, align: 'center' }
    }]}]
  },
  {
    id: 'row-5',
    columns: [{ id: 'col-5-1', flex: 1, elements: [{
      id: 'elem-5', type: 'live-viewers',
      content: 'espectadores estão vendo este conteúdo simultaneamente com você',
      minViewers: 500, maxViewers: 1000,
      style: { fontSize: '18px', textColor: '#ffffff', countColor: '#38bdf8', marginTop: 4, marginBottom: 4, align: 'center' }
    }]}]
  }
];

// ─── Default Email Template ──────────────────────────────────────────────────
const defaultEmailRows = [
  {
    id: 'email-row-1',
    columns: [{ id: 'email-col-1', flex: 1, elements: [{
      id: 'email-header-1', type: 'email-header',
      logoType: 'text', // 'text' | 'image'
      logoText: 'Rappu',
      logoImageUrl: '',
      content: 'Header',
      style: { bgColor: '#27272a', textColor: '#ffffff', logoColor: '#ffffff', paddingVertical: 26, paddingHorizontal: 44, align: 'left', fontSize: '20px', fontWeight: '700', marginBottom: 24 }
    }]}]
  },
  {
    id: 'email-row-2',
    columns: [{ id: 'email-col-2', flex: 1, elements: [
      {
        id: 'email-tag-1', type: 'email-tag', content: 'ARTES PRONTAS',
        style: { bgColor: '#f4f4f5', textColor: '#27272a', fontSize: '11px', fontWeight: '500', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 999, marginBottom: 12, align: 'left' }
      },
      {
        id: 'email-heading-1', type: 'heading', content: 'Suas artes estão prontas!',
        style: { fontSize: '26px', fontWeight: '400', textColor: '#111111', align: 'left', marginTop: 0, marginBottom: 14, hasTransparentBg: true }
      },
      {
        id: 'email-para-1', type: 'paragraph', content: 'Concluímos a produção dos materiais do seu projeto.\n\nAgora é o momento de revisar as artes e verificar se tudo está conforme o esperado.',
        style: { fontSize: '14px', fontWeight: '400', textColor: '#3f3f46', align: 'left', marginTop: 0, marginBottom: 12, hasTransparentBg: true }
      },
      {
        id: 'email-btn-1', type: 'button', content: 'Visualizar artes', url: '#', openInNewTab: true, subtext: '',
        style: { bgColor: '#27272a', textColor: '#ffffff', fontSize: '14px', fontWeight: '500', paddingVertical: 14, paddingHorizontal: 26, borderRadius: 8, align: 'left', marginTop: 26, marginBottom: 0 }
      }
    ]}]
  },
  {
    id: 'email-row-3',
    columns: [{ id: 'email-col-3', flex: 1, elements: [{
      id: 'email-footer-1', type: 'email-footer',
      logoType: 'text',
      logoText: 'Rappu',
      logoImageUrl: '',
      copyrightText: '© 2026 Rappu. Todos os direitos reservados.',
      content: 'Footer',
      style: { bgColor: '#27272a', textColor: '#a1a1aa', logoColor: '#ffffff', paddingVertical: 24, paddingHorizontal: 44, align: 'center', fontSize: '12px', fontWeight: '400', marginTop: 24 }
    }]}]
  }
];

// ─── Toast Queue ─────────────────────────────────────────────────────────────
const toasts = reactive([]);
function showToast(message, type = 'success', duration = 2800) {
  const id = Date.now() + Math.random();
  toasts.push({ id, message, type });
  setTimeout(() => {
    const idx = toasts.findIndex(t => t.id === id);
    if (idx !== -1) toasts.splice(idx, 1);
  }, duration);
}

// ─── Custom Templates Registry ───────────────────────────────────────────────
const customTemplatesRegistry = reactive(lsGet('custom_templates_v1', []));

// ─── Pages Registry ──────────────────────────────────────────────────────────
const pagesRegistry = reactive(lsGet('pages_registry_v1', []));

// ─── Folders Registry ────────────────────────────────────────────────────────
const foldersRegistry = reactive(lsGet('folders_registry_v1', [
  { id: 'folder-default', name: 'Funil Principal', parentId: null, color: '#f59e0b', createdAt: new Date().toISOString() }
]));

// ─── Main State ──────────────────────────────────────────────────────────────
const state = reactive({
  rows: defaultFunilRows.map(r => JSON.parse(JSON.stringify(r))),
  selectedElement: null,
  isElementModalOpen: false,
  isExportModalOpen: false,
  isSummaryModalOpen: false,
  exportedHTML: '',
  viewportMode: '100%',
  builderMode: 'funil', // 'funil' | 'email'
  currentPageId: null, // ID of the page being edited, null = new
  currentPageName: '',
  currentPageFolderId: null,
  pageSettings: {
    bgColor: '#191919', fontFamily: 'Roboto', fontSize: 14, sectionGap: 0,
    pageTitle: 'Página de Vendas - VSL', metaDesc: 'Página oficial de vendas e conversão VSL.',
    metaPixel: '', gtmCode: '', faviconUrl: ''
  }
});

export function useBuilderStore() {

  // ─── Viewport ──────────────────────────────────────────────────────────────
  function setViewport(mode) { state.viewportMode = mode; }

  // ─── Builder Mode ──────────────────────────────────────────────────────────
  function setBuilderMode(mode) {
    state.builderMode = mode;
    if (mode === 'email') {
      state.pageSettings.bgColor = '#f5f5f7';
      state.pageSettings.fontFamily = 'Poppins';
    } else {
      state.pageSettings.bgColor = '#191919';
      state.pageSettings.fontFamily = 'Roboto';
    }
  }

  function genUid(prefix = '') {
    return prefix + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  }

  // ─── Rows ──────────────────────────────────────────────────────────────────
  function addRow(preset = '1-col') {
    const rId = genUid('row-');
    let cols = [{ id: genUid('col-'), flex: 1, elements: [] }];
    if (preset === '2-col') cols = [
      { id: genUid('col-'), flex: 1, elements: [] },
      { id: genUid('col-'), flex: 1, elements: [] }
    ];
    if (preset === '3-col') cols = [
      { id: genUid('col-'), flex: 1, elements: [] },
      { id: genUid('col-'), flex: 1, elements: [] },
      { id: genUid('col-'), flex: 1, elements: [] }
    ];
    const newRow = { id: rId, columns: cols };
    state.rows.push(newRow);
    return newRow;
  }

  function duplicateRow(rowIndex) {
    if (rowIndex < 0 || rowIndex >= state.rows.length) return;
    const clone = JSON.parse(JSON.stringify(state.rows[rowIndex]));
    clone.id = genUid('row-');
    if (Array.isArray(clone.columns)) {
      clone.columns.forEach(col => {
        col.id = genUid('col-');
        if (Array.isArray(col.elements)) {
          col.elements.forEach(elem => {
            elem.id = genUid('elem-');
          });
        }
      });
    }
    state.rows.splice(rowIndex + 1, 0, clone);
    showToast('📋 Seção duplicada!');
  }

  function deleteRow(rowIndex) {
    if (rowIndex >= 0 && rowIndex < state.rows.length) state.rows.splice(rowIndex, 1);
  }

  // ─── Elements ──────────────────────────────────────────────────────────────
  function addElementToColumn(columnId, elementType) {
    for (const row of state.rows) {
      for (const col of row.columns) {
        if (col.id === columnId) {
          col.elements.push(createDefaultElement(elementType));
          showToast(`✅ "${getElemLabel(elementType)}" adicionado!`);
          return;
        }
      }
    }
  }

  function addElementToCanvas(elementType) {
    let targetRow = state.rows[state.rows.length - 1];
    if (!targetRow || !targetRow.columns.length) targetRow = addRow('1-col');
    targetRow.columns[0].elements.push(createDefaultElement(elementType));
    showToast(`✅ "${getElemLabel(elementType)}" adicionado!`);
  }

  function getElemLabel(type) {
    const m = {
      heading: 'Título', paragraph: 'Parágrafo', button: 'Botão',
      'top-banner': 'Banner Topo', 'vturb-player': 'Player VTurb',
      'pitch-button': 'Botão Pitch CTA', 'live-viewers': 'Espectadores Ao Vivo',
      'meta-pixel': 'Meta Pixel', 'email-header': 'Cabeçalho E-mail',
      'email-footer': 'Rodapé E-mail', 'email-tag': 'Tag/Label'
    };
    return m[type] || type;
  }

  function createDefaultElement(type) {
    const id = genUid('elem-');
    const base = { id, type, delayEnabled: false, delayMinutes: 0, delaySeconds: 0 };
    const baseStyle = { fontSize: '16px', fontWeight: '700', textColor: '#000', bgColor: '#fff', hasTransparentBg: false, marginTop: 6, marginBottom: 0, align: 'center', lineHeight: 1.2 };

    if (type === 'heading') return { ...base, content: 'Novo Título em Destaque', style: { ...baseStyle, fontSize: '28px', fontWeight: '800', textColor: '#fff', hasTransparentBg: true, altColor: '#f1c232' } };
    if (type === 'paragraph') return { ...base, content: 'Texto do parágrafo...', style: { ...baseStyle, fontSize: '15px', fontWeight: '400', textColor: '#ccc', hasTransparentBg: true } };
    if (type === 'button') return { ...base, content: 'CLIQUE AQUI', url: '', openInNewTab: true, subtext: '', style: { ...baseStyle, bgColor: '#fff', textColor: '#000', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10 } };
    if (type === 'top-banner') return { ...base, content: '⚠️ ATENÇÃO NÃO FECHE ESTA PÁGINA ⚠️', style: { ...baseStyle, bgColor: '#dc2626', textColor: '#fff', fontSize: '15px' } };
    if (type === 'vturb-player') return { ...base, content: '', vturbBody: `<vturb-smartplayer id="vid-6a74fc57b559162d923537ff" style="display: block; margin: 0 auto; width: 100%; max-width: 320px;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 177.77777777777777% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/93deedb3-3cfc-44e6-b93a-9684b498089c/players/6a74fc57b559162d923537ff/v4/player.js", s.async=!0,document.head.appendChild(s); </script>`, vturbHead: '', style: { ...baseStyle, maxWidth: '320px', marginTop: 6, marginBottom: 6 } };
    if (type === 'pitch-button') return { ...base, content: 'QUERO MEU ACESSO AGORA', url: '', openInNewTab: true, subtext: '⚡ Acesso imediato', style: { ...baseStyle, bgColor: '#fff', textColor: '#000', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, isGlow: false } };
    if (type === 'live-viewers') return { ...base, content: 'espectadores estão assistindo', minViewers: 100, maxViewers: 250, style: { ...baseStyle, textColor: '#fff', countColor: '#38bdf8', fontSize: '18px', marginTop: 4, marginBottom: 4 } };
    if (type === 'meta-pixel') return { ...base, pixelId: '', pixelEvent: 'PageView', content: 'Meta Pixel', style: baseStyle };

    // Email elements
    if (type === 'email-header') return { ...base, logoType: 'text', logoText: 'Empresa', logoImageUrl: '', content: 'Header', style: { bgColor: '#27272a', textColor: '#fff', logoColor: '#fff', paddingVertical: 26, paddingHorizontal: 44, align: 'left', fontSize: '20px', fontWeight: '700' } };
    if (type === 'email-footer') return { ...base, logoType: 'text', logoText: 'Empresa', logoImageUrl: '', copyrightText: '© 2026 Empresa. Todos os direitos reservados.', content: 'Footer', style: { bgColor: '#27272a', textColor: '#a1a1aa', logoColor: '#fff', paddingVertical: 24, paddingHorizontal: 44, align: 'center', fontSize: '12px', fontWeight: '400' } };
    if (type === 'email-tag') return { ...base, content: 'LABEL', style: { ...baseStyle, bgColor: '#f4f4f5', textColor: '#27272a', fontSize: '11px', fontWeight: '500', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 999, marginBottom: 12, align: 'left' } };

    return { ...base, content: 'Novo Elemento', style: baseStyle };
  }

  // ─── Modal ─────────────────────────────────────────────────────────────────
  function openModalForElement(elem) {
    if (elem && !elem.isGlobalSettings && !elem.style) {
      elem.style = {};
    }
    state.selectedElement = elem;
    state.isElementModalOpen = true;
  }
  function openExportModal() {
    state.exportedHTML = generateExportedHTML(state.rows, state.pageSettings);
    state.isExportModalOpen = true;
  }

  function openGlobalSettings() { state.selectedElement = { isGlobalSettings: true, id: 'global-settings', type: 'global-settings' }; state.isElementModalOpen = true; }
  function closeModal() { state.isElementModalOpen = false; state.selectedElement = null; showToast('💾 Alterações salvas!', 'save'); }

  function deleteSelectedElement() {
    if (!state.selectedElement || state.selectedElement.isGlobalSettings) return;
    const targetId = state.selectedElement.id;
    for (const row of state.rows) {
      for (const col of row.columns) {
        const i = col.elements.findIndex(e => e.id === targetId);
        if (i !== -1) { col.elements.splice(i, 1); break; }
      }
    }
    closeModal();
  }

  function duplicateElement(elementId) {
    for (const row of state.rows) {
      for (const col of row.columns) {
        const i = col.elements.findIndex(e => e.id === elementId);
        if (i !== -1) {
          const clone = JSON.parse(JSON.stringify(col.elements[i]));
          clone.id = 'elem-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
          col.elements.splice(i + 1, 0, clone);
          showToast('📋 Objeto duplicado!');
          return;
        }
      }
    }
  }

  function deleteElement(elementId) {
    for (const row of state.rows) {
      for (const col of row.columns) {
        const i = col.elements.findIndex(e => e.id === elementId);
        if (i !== -1) { col.elements.splice(i, 1); showToast('🗑️ Objeto excluído', 'info'); return; }
      }
    }
  }

  function clearCanvas() {
    if (confirm('Tem certeza que deseja limpar todo o canvas?')) { state.rows = []; closeModal(); }
  }

  // ─── Pages Registry ────────────────────────────────────────────────────────
  function savePage(name, folderId) {
    const now = new Date().toISOString();
    if (state.currentPageId) {
      // Update existing page
      const idx = pagesRegistry.findIndex(p => p.id === state.currentPageId);
      if (idx !== -1) {
        pagesRegistry[idx] = {
          ...pagesRegistry[idx],
          name: name || pagesRegistry[idx].name,
          folderId: folderId || pagesRegistry[idx].folderId,
          rows: JSON.parse(JSON.stringify(state.rows)),
          pageSettings: JSON.parse(JSON.stringify(state.pageSettings)),
          builderMode: state.builderMode,
          updatedAt: now
        };
        lsSet('pages_registry_v1', pagesRegistry);
        showToast(`💾 "${name}" atualizada!`, 'success');
        return pagesRegistry[idx];
      }
    }
    // Create new page
    const newPage = {
      id: 'page-' + Date.now(),
      name: name || 'Nova Página',
      folderId: folderId || null,
      type: state.builderMode,
      rows: JSON.parse(JSON.stringify(state.rows)),
      pageSettings: JSON.parse(JSON.stringify(state.pageSettings)),
      builderMode: state.builderMode,
      createdAt: now,
      updatedAt: now,
      statusClass: 'draft',
      statusText: 'Rascunho'
    };
    pagesRegistry.unshift(newPage);
    lsSet('pages_registry_v1', pagesRegistry);
    state.currentPageId = newPage.id;
    state.currentPageName = newPage.name;
    state.currentPageFolderId = newPage.folderId;
    showToast(`🎉 "${newPage.name}" salva com sucesso!`, 'success');
    return newPage;
  }

  function loadPage(pageId) {
    const page = pagesRegistry.find(p => p.id === pageId);
    if (!page) return false;
    state.rows = JSON.parse(JSON.stringify(page.rows || []));
    state.pageSettings = { ...state.pageSettings, ...JSON.parse(JSON.stringify(page.pageSettings || {})) };
    state.builderMode = page.builderMode || page.type || 'funil';
    state.currentPageId = page.id;
    state.currentPageName = page.name;
    state.currentPageFolderId = page.folderId;
    return true;
  }

  function deletePage(pageId) {
    const idx = pagesRegistry.findIndex(p => p.id === pageId);
    if (idx !== -1) {
      const name = pagesRegistry[idx].name;
      pagesRegistry.splice(idx, 1);
      lsSet('pages_registry_v1', pagesRegistry);
      showToast(`🗑️ "${name}" excluída!`, 'info');
    }
  }

  function newBlankCanvas(mode = 'funil') {
    state.builderMode = mode;
    state.currentPageId = null;
    state.currentPageName = '';
    state.currentPageFolderId = null;
    if (mode === 'email') {
      state.rows = defaultEmailRows.map(r => JSON.parse(JSON.stringify(r)));
      state.pageSettings = { ...state.pageSettings, bgColor: '#f5f5f7', fontFamily: 'Poppins', pageTitle: 'Novo Template E-mail' };
    } else {
      state.rows = [];
      state.pageSettings = { ...state.pageSettings, bgColor: '#191919', fontFamily: 'Roboto', pageTitle: 'Nova Página Funil' };
    }
  }

  // ─── Folders Registry ──────────────────────────────────────────────────────
  function createFolder(name, parentId = null, color = '#6366f1') {
    const f = { id: 'folder-' + Date.now(), name, parentId, color, createdAt: new Date().toISOString() };
    foldersRegistry.unshift(f);
    lsSet('folders_registry_v1', foldersRegistry);
    showToast(`📁 Pasta "${name}" criada!`, 'success');
    return f;
  }

  function renameFolder(id, newName) {
    const f = foldersRegistry.find(f => f.id === id);
    if (f) { f.name = newName; lsSet('folders_registry_v1', foldersRegistry); showToast(`✏️ Pasta renomeada para "${newName}"!`); }
  }

  function deleteFolder(id) {
    const idx = foldersRegistry.findIndex(f => f.id === id);
    if (idx !== -1) {
      // Move pages in this folder to root
      pagesRegistry.forEach(p => { if (p.folderId === id) p.folderId = null; });
      lsSet('pages_registry_v1', pagesRegistry);
      foldersRegistry.splice(idx, 1);
      lsSet('folders_registry_v1', foldersRegistry);
      showToast('🗑️ Pasta excluída!', 'info');
    }
  }

  function moveFolder(id, newParentId) {
    const f = foldersRegistry.find(f => f.id === id);
    if (f && f.id !== newParentId) { f.parentId = newParentId; lsSet('folders_registry_v1', foldersRegistry); showToast('📁 Pasta movida!'); }
  }

  function movePage(pageId, folderId) {
    const p = pagesRegistry.find(p => p.id === pageId);
    if (p) { p.folderId = folderId; lsSet('pages_registry_v1', pagesRegistry); showToast('📄 Página movida!'); }
  }

  // ─── Custom Templates Registry ─────────────────────────────────────────────
  function registerCustomTemplate(templateObj) {
    if (!templateObj || !templateObj.id) return;
    const idx = customTemplatesRegistry.findIndex(t => t.id === templateObj.id);
    if (idx !== -1) customTemplatesRegistry[idx] = templateObj;
    else customTemplatesRegistry.unshift(templateObj);
    lsSet('custom_templates_v1', customTemplatesRegistry);
  }

  // ─── Load Template ─────────────────────────────────────────────────────────
  function loadTemplate(templateTypeOrKey) {
    if (!templateTypeOrKey) return;

    // Custom JSON templates
    const custom = customTemplatesRegistry.find(t => t.id === templateTypeOrKey || t.key === templateTypeOrKey);
    if (custom && custom.json) {
      state.rows = JSON.parse(JSON.stringify(custom.json.rows || []));
      if (custom.json.pageSettings) state.pageSettings = { ...state.pageSettings, ...JSON.parse(JSON.stringify(custom.json.pageSettings)) };
      state.builderMode = custom.emailMode ? 'email' : 'funil';
      state.currentPageId = null;
      showToast(`🚀 Template "${custom.name}" carregado!`, 'success');
      return;
    }

    // VSL Preset
    if (templateTypeOrKey === 'vsl' || templateTypeOrKey === 'lp') {
      state.builderMode = 'funil';
      state.currentPageId = null;
      state.pageSettings = { ...state.pageSettings, bgColor: '#191919', fontFamily: 'Roboto', pageTitle: 'Página de Vendas VSL' };
      state.rows = defaultFunilRows.map(r => JSON.parse(JSON.stringify(r)));
      showToast('🚀 Template VSL carregado!', 'success');
      return;
    }

    // Email Preset
    if (templateTypeOrKey === 'email') {
      state.builderMode = 'email';
      state.currentPageId = null;
      state.pageSettings = { ...state.pageSettings, bgColor: '#f5f5f7', fontFamily: 'Poppins', pageTitle: 'Template E-mail' };
      state.rows = defaultEmailRows.map(r => JSON.parse(JSON.stringify(r)));
      showToast('📧 Template E-mail carregado!', 'success');
      return;
    }

    // Home preset
    if (templateTypeOrKey === 'home') {
      state.builderMode = 'funil';
      state.currentPageId = null;
      state.pageSettings = { ...state.pageSettings, bgColor: '#0a0d14', pageTitle: 'Página Inicial' };
      state.rows = [{
        id: 'row-h-1', columns: [{ id: 'col-h-1', flex: 1, elements: [
          { id: 'e-h-1', type: 'heading', content: 'A Solução Completa Para >>Impulsionar Seu Negócio<<', style: { fontSize: '36px', fontWeight: '900', textColor: '#fff', altColor: '#38bdf8', align: 'center', marginTop: 24, marginBottom: 12, hasTransparentBg: true } },
          { id: 'e-h-2', type: 'paragraph', content: 'Simplifique processos e garanta máxima performance.', style: { fontSize: '18px', textColor: '#94a3b8', align: 'center', marginTop: 0, marginBottom: 24, hasTransparentBg: true, fontWeight: '400' } },
          { id: 'e-h-3', type: 'button', content: 'COMEÇAR GRÁTIS AGORA', url: '', openInNewTab: false, subtext: '', style: { bgColor: '#6366f1', textColor: '#fff', fontSize: '18px', fontWeight: '700', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, align: 'center' } }
        ]}]
      }];
      showToast('🏠 Template Página Inicial carregado!', 'success');
      return;
    }
  }

  // ─── Modals ────────────────────────────────────────────────────────────────
  function openSummaryModal() { state.isSummaryModalOpen = true; }
  function closeSummaryModal() { state.isSummaryModalOpen = false; }

  return {
    state, toasts, customTemplatesRegistry, pagesRegistry, foldersRegistry,
    showToast, setViewport, setBuilderMode,
    addRow, duplicateRow, deleteRow,
    addElementToColumn, addElementToCanvas,
    openModalForElement, openExportModal, openGlobalSettings, closeModal,
    deleteSelectedElement, duplicateElement, deleteElement, clearCanvas,
    savePage, loadPage, deletePage, newBlankCanvas, movePage,
    createFolder, renameFolder, deleteFolder, moveFolder,
    registerCustomTemplate, loadTemplate,
    openSummaryModal, closeSummaryModal
  };
}
