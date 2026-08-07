import { reactive } from 'vue';

// Initial default canvas setup (matches Upsell / VSL page)
const initialRows = [
  {
    id: 'row-1',
    hasTopBanner: true,
    columns: [
      {
        id: 'col-1-1',
        flex: 1,
        elements: [
          {
            id: 'elem-1',
            type: 'top-banner',
            content: '⚠️ ATENÇÃO NÃO FECHE ESTA PÁGINA - PODE DAR ERRO NA SUA COMPRA ⚠️',
            style: {
              bgColor: '#dc2626',
              textColor: '#ffffff',
              fontSize: '15px',
              fontWeight: '800',
              marginTop: 0,
              marginBottom: 0,
              align: 'center'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'row-2',
    columns: [
      {
        id: 'col-2-1',
        flex: 1,
        elements: [
          {
            id: 'elem-2',
            type: 'heading',
            content: 'RECADO ESPECIAL PARA VOCÊ\nAlgo Para >>Triplicar<< Seus Ganhos com a Dollar App',
            style: {
              fontSize: '30px',
              fontWeight: '900',
              textColor: '#ffffff',
              altColor: '#f1c232',
              hasTransparentBg: true,
              marginTop: 10,
              marginBottom: 10,
              align: 'center',
              lineHeight: 1.3
            }
          }
        ]
      }
    ]
  },
  {
    id: 'row-3',
    columns: [
      {
        id: 'col-3-1',
        flex: 1,
        elements: [
          {
            id: 'elem-3',
            type: 'vturb-player',
            content: '',
            vturbBody: `<vturb-smartplayer id="vid-6a6d621a6a693d904c682e0b" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 177.77777777777777% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/93deedb3-3cfc-44e6-b93a-9684b498089c/players/6a6d621a6a693d904c682e0b/v4/player.js", s.async=!0,document.head.appendChild(s); </script>`,
            vturbHead: '',
            style: {
              marginTop: 10,
              marginBottom: 10
            }
          }
        ]
      }
    ]
  }
];

// Toast queue
const toasts = reactive([]);

function showToast(message, type = 'success', duration = 2800) {
  const id = Date.now() + Math.random();
  toasts.push({ id, message, type });
  setTimeout(() => {
    const idx = toasts.findIndex(t => t.id === id);
    if (idx !== -1) toasts.splice(idx, 1);
  }, duration);
}

const state = reactive({
  rows: initialRows,
  selectedElement: null,
  isElementModalOpen: false,
  isExportModalOpen: false,
  isSummaryModalOpen: false,
  exportedHTML: '',
  viewportMode: '100%',
  pageSettings: {
    bgColor: '#191919',
    fontFamily: 'Roboto',
    fontSize: 14,
    sectionGap: 16,
    pageTitle: 'Página de Vendas - VSL',
    metaDesc: 'Página oficial de vendas e conversão VSL.',
    metaPixel: '',
    gtmCode: '',
    faviconUrl: ''
  }
});

export function useBuilderStore() {
  function setViewport(mode) {
    state.viewportMode = mode;
  }

  function addRow(preset = '1-col') {
    let cols = [{ id: 'col-' + Date.now() + '-1', flex: 1, elements: [] }];
    if (preset === '2-col') {
      cols = [
        { id: 'col-' + Date.now() + '-1', flex: 1, elements: [] },
        { id: 'col-' + Date.now() + '-2', flex: 1, elements: [] }
      ];
    } else if (preset === '3-col') {
      cols = [
        { id: 'col-' + Date.now() + '-1', flex: 1, elements: [] },
        { id: 'col-' + Date.now() + '-2', flex: 1, elements: [] },
        { id: 'col-' + Date.now() + '-3', flex: 1, elements: [] }
      ];
    } else if (preset === '4-col') {
      cols = [
        { id: 'col-' + Date.now() + '-1', flex: 1, elements: [] },
        { id: 'col-' + Date.now() + '-2', flex: 1, elements: [] },
        { id: 'col-' + Date.now() + '-3', flex: 1, elements: [] },
        { id: 'col-' + Date.now() + '-4', flex: 1, elements: [] }
      ];
    }

    const newRow = {
      id: 'row-' + Date.now(),
      columns: cols
    };
    state.rows.push(newRow);
    return newRow;
  }

  function duplicateRow(rowIndex) {
    if (rowIndex >= 0 && rowIndex < state.rows.length) {
      const clone = JSON.parse(JSON.stringify(state.rows[rowIndex]));
      clone.id = 'row-' + Date.now();
      state.rows.splice(rowIndex + 1, 0, clone);
    }
  }

  function deleteRow(rowIndex) {
    if (rowIndex >= 0 && rowIndex < state.rows.length) {
      state.rows.splice(rowIndex, 1);
    }
  }

  function addElementToColumn(columnId, elementType) {
    let targetCol = null;
    for (const row of state.rows) {
      for (const col of row.columns) {
        if (col.id === columnId) {
          targetCol = col;
          break;
        }
      }
    }
    if (!targetCol) return;

    const newElem = createDefaultElement(elementType);
    targetCol.elements.push(newElem);
    showToast(`✅ "${getElemLabel(elementType)}" adicionado!`, 'success');
  }

  function addElementToCanvas(elementType) {
    let targetRow = state.rows[state.rows.length - 1];
    if (!targetRow || !targetRow.columns.length) {
      targetRow = addRow('1-col');
    }
    const targetCol = targetRow.columns[0];
    const newElem = createDefaultElement(elementType);
    targetCol.elements.push(newElem);
    showToast(`✅ "${getElemLabel(elementType)}" adicionado!`, 'success');
  }

  function getElemLabel(type) {
    const m = {
      'heading': 'Título / Headline', 'paragraph': 'Parágrafo', 'button': 'Botão Link',
      'top-banner': 'Banner Topo', 'vturb-player': 'Player VTurb', 'pitch-button': 'Botão Pitch CTA',
      'upsell-buttons': 'Botões Upsell', 'live-viewers': 'Espectadores Ao Vivo', 'meta-pixel': 'Meta Pixel'
    };
    return m[type] || type;
  }

  function createDefaultElement(type) {
    const id = 'elem-' + Date.now();
    const defaultStyle = {
      fontSize: '24px',
      fontWeight: '700',
      textColor: '#ffffff',
      altColor: '#f1c232',
      bgColor: '#00ff0b',
      hasTransparentBg: false,
      marginTop: 6,
      marginBottom: 6,
      align: 'center',
      lineHeight: 1.2,
      letterSpacing: 0
    };

    if (type === 'heading') {
      return { id, type, content: 'Novo Título em Destaque', delayEnabled: false, delayMinutes: 0, delaySeconds: 0, style: { ...defaultStyle, fontSize: '28px', fontWeight: '800', hasTransparentBg: true } };
    }
    if (type === 'paragraph') {
      return { id, type, content: 'Digite o texto do seu parágrafo aqui...', delayEnabled: false, delayMinutes: 0, delaySeconds: 0, style: { ...defaultStyle, fontSize: '15px', fontWeight: '400', textColor: '#cccccc', hasTransparentBg: true } };
    }
    if (type === 'button') {
      return { id, type, content: 'CLIQUE AQUI AGORA', url: 'https://pay.kirvano.com/...', openInNewTab: true, subtext: '', delayEnabled: false, delayMinutes: 0, delaySeconds: 0, style: { ...defaultStyle, bgColor: '#6366f1', textColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10 } };
    }
    if (type === 'top-banner') {
      return { id, type, content: '⚠️ ATENÇÃO NÃO FECHE ESTA PÁGINA ⚠️', delayEnabled: false, delayMinutes: 0, delaySeconds: 0, style: { ...defaultStyle, bgColor: '#dc2626', textColor: '#ffffff', fontSize: '15px' } };
    }
    if (type === 'vturb-player') {
      return { id, type, content: '', vturbBody: `<vturb-smartplayer id="vid-6a6d621a6a693d904c682e0b" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 177.77777777777777% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/93deedb3-3cfc-44e6-b93a-9684b498089c/players/6a6d621a6a693d904c682e0b/v4/player.js", s.async=!0,document.head.appendChild(s); </script>`, vturbHead: '', delayEnabled: false, delayMinutes: 0, delaySeconds: 0, style: { ...defaultStyle } };
    }
    if (type === 'pitch-button') {
      return { id, type, content: 'QUERO MEU ACESSO AGORA', url: 'https://pay.kirvano.com/...', openInNewTab: true, subtext: '⚡ Acesso imediato · Garantia de 7 dias', delayEnabled: false, delayMinutes: 0, delaySeconds: 0, style: { ...defaultStyle, bgColor: '#10b981', textColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 } };
    }
    if (type === 'live-viewers') {
      return { id, type, content: 'espectadores estão vendo este conteúdo simultaneamente com você', minViewers: 100, maxViewers: 250, delayEnabled: false, delayMinutes: 0, delaySeconds: 0, style: { ...defaultStyle, fontSize: '18px', textColor: '#ffffff', countColor: '#ffffff' } };
    }
    if (type === 'meta-pixel') {
      return { id, type, pixelId: '', pixelEvent: 'PageView', content: 'Meta Pixel Component', delayEnabled: false, delayMinutes: 0, delaySeconds: 0, style: { ...defaultStyle } };
    }

    return { id, type, content: 'Novo Elemento', delayEnabled: false, delayMinutes: 0, delaySeconds: 0, style: defaultStyle };
  }

  function openModalForElement(elem) {
    state.selectedElement = elem;
    state.isElementModalOpen = true;
  }

  function openGlobalSettings() {
    state.selectedElement = {
      isGlobalSettings: true,
      id: 'global-settings',
      type: 'global-settings'
    };
    state.isElementModalOpen = true;
  }

  function closeModal() {
    state.isElementModalOpen = false;
    state.selectedElement = null;
    showToast('💾 Alterações salvas!', 'save');
  }

  function deleteSelectedElement() {
    if (!state.selectedElement || state.selectedElement.isGlobalSettings) return;
    const targetId = state.selectedElement.id;

    for (const row of state.rows) {
      for (const col of row.columns) {
        const index = col.elements.findIndex(e => e.id === targetId);
        if (index !== -1) {
          col.elements.splice(index, 1);
          break;
        }
      }
    }

    closeModal();
  }

  function duplicateElement(elementId) {
    if (!elementId) return;
    for (const row of state.rows) {
      for (const col of row.columns) {
        const index = col.elements.findIndex(e => e.id === elementId);
        if (index !== -1) {
          const original = col.elements[index];
          const clone = JSON.parse(JSON.stringify(original));
          clone.id = 'elem-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
          col.elements.splice(index + 1, 0, clone);
          showToast(`📋 Objeto duplicado!`, 'success');
          return;
        }
      }
    }
  }

  function deleteElement(elementId) {
    if (!elementId) return;
    for (const row of state.rows) {
      for (const col of row.columns) {
        const index = col.elements.findIndex(e => e.id === elementId);
        if (index !== -1) {
          col.elements.splice(index, 1);
          showToast('🗑️ Objeto excluído', 'info');
          return;
        }
      }
    }
  }

  function clearCanvas() {
    if (confirm('Tem certeza que deseja limpar todo o canvas?')) {
      state.rows = [];
      closeModal();
    }
  }

  function openSummaryModal() {
    state.isSummaryModalOpen = true;
  }

  function closeSummaryModal() {
    state.isSummaryModalOpen = false;
  }

  return {
    state,
    toasts,
    showToast,
    setViewport,
    addRow,
    duplicateRow,
    deleteRow,
    addElementToColumn,
    addElementToCanvas,
    openModalForElement,
    openGlobalSettings,
    closeModal,
    deleteSelectedElement,
    duplicateElement,
    deleteElement,
    clearCanvas,
    openSummaryModal,
    closeSummaryModal
  };
}
