import { reactive } from 'vue';
import { generateExportedHTML } from '../utils/htmlExporter';
import { getPlatformTemplates, getStoredUser, getWorkspace, hasAuthToken, saveWorkspace as saveWorkspaceRequest } from '../services/api';

const WORKSPACE_SYNC_KEYS = new Set([
  'pages_registry_v1',
  'folders_registry_v1',
  'custom_templates_v1',
  'page_versions_v1',
  'builder_metrics_v1'
]);
let suppressBackendSync = false;
let workspaceReady = false;
let backendRevision = 0;
let workspaceSyncTimer = null;
let workspaceSyncChain = Promise.resolve();
let syncErrorShown = false;
let lastWorkspaceSyncError = '';

// ─── LocalStorage Helpers ────────────────────────────────────────────────────
function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (!suppressBackendSync && WORKSPACE_SYNC_KEYS.has(key)) scheduleWorkspaceSync();
  } catch (e) { /* storage unavailable */ }
}

// ─── Default Canvas (Funil VSL) ──────────────────────────────────────────────
const defaultFunilRows = [
  {
    id: 'row-1', hasTopBanner: true,
    columns: [{ id: 'col-1-1', flex: 1, elements: [{
      id: 'elem-1', type: 'top-banner',
      content: 'ATENÇÃO: NÃO FECHE ESTA PÁGINA - PODE DAR ERRO NA SUA COMPRA',
      style: { bgColor: '#dc2626', textColor: '#ffffff', fontSize: '15px', fontWeight: '800', marginTop: 0, marginBottom: 0, paddingVertical: 12, paddingHorizontal: 16, align: 'center' }
    }]}]
  },
  {
    id: 'row-2',
    columns: [{ id: 'col-2-1', flex: 1, elements: [{
      id: 'elem-2', type: 'heading',
      content: 'RECADO ESPECIAL PARA VOCÊ\nAlgo Para >>Triplicar<< Seus Ganhos',
      style: { fontSize: '30px', fontWeight: '900', textColor: '#ffffff', altColor: '#f1c232', hasTransparentBg: true, marginTop: 10, marginBottom: 10, align: 'center', lineHeight: 1.3 }
    }]}]
  },
  {
    id: 'row-3',
    columns: [{ id: 'col-3-1', flex: 1, elements: [{
      id: 'elem-3', type: 'vturb-player', content: '',
      vturbBody: '',
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
      style: { fontSize: '18px', textColor: '#ffffff', countColor: '#ffffff', hasTransparentBg: true, bgColor: 'transparent', marginTop: 4, marginBottom: 4, align: 'center' }
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

const defaultQuizRows = [
  { id:'quiz-step-1', columns:[{ id:'quiz-col-1', flex:1, elements:[
    { id:'quiz-title-1', type:'quiz-question', content:'Vamos começar!', style:{fontSize:'31px',fontWeight:'900',textColor:'#0f172a',hasTransparentBg:true,align:'center',marginTop:0,marginBottom:8} },
    { id:'quiz-text-1', type:'paragraph', content:'Selecione a sua idade para iniciarmos o quiz.', style:{fontSize:'16px',fontWeight:'400',textColor:'#64748b',hasTransparentBg:true,align:'center',marginBottom:18} },
    { id:'quiz-single-1', type:'quiz-single', options:[{label:'18–24',description:'Começando agora',icon:'1'},{label:'25–34',description:'Fase de crescimento',icon:'2'},{label:'35–54',description:'Mais experiência',icon:'3'},{label:'55–65+',description:'Alta maturidade',icon:'4'}], optionsText:'18–24\n25–34\n35–54\n55–65+', style:{marginBottom:8} },
    { id:'quiz-next-1', type:'quiz-next', content:'Continuar', url:'#quiz-next', openInNewTab:false, style:{bgColor:'#0ea5e9',textColor:'#ffffff',fontSize:'16px',fontWeight:'800',paddingVertical:16,paddingHorizontal:28,borderRadius:12,align:'center',marginTop:10} }
  ]}]},
  { id:'quiz-step-2', columns:[{ id:'quiz-col-2', flex:1, elements:[
    { id:'quiz-title-2', type:'quiz-question', content:'Sobre quais temas você mais gosta de responder?', style:{fontSize:'26px',fontWeight:'900',textColor:'#0f172a',hasTransparentBg:true,align:'center',marginBottom:15} },
    { id:'quiz-multiple-2', type:'quiz-multiple', options:[{label:'Desenvolvimento pessoal',description:'Hábitos, foco e evolução',icon:'A'},{label:'Saúde e bem-estar',description:'Rotina, energia e qualidade de vida',icon:'B'},{label:'Estilo de vida',description:'Preferências e objetivos pessoais',icon:'C'},{label:'Curiosidades em geral',description:'Assuntos leves e variados',icon:'D'}], optionsText:'Desenvolvimento pessoal\nSaúde e bem-estar\nEstilo de vida\nCuriosidades em geral', style:{marginBottom:8} },
    { id:'quiz-next-2', type:'quiz-next', content:'Continuar', url:'#quiz-next', openInNewTab:false, style:{bgColor:'#0ea5e9',textColor:'#ffffff',fontSize:'16px',fontWeight:'800',paddingVertical:16,paddingHorizontal:28,borderRadius:12,align:'center'} }
  ]}]},
  { id:'quiz-step-3', columns:[{ id:'quiz-col-3', flex:1, elements:[
    { id:'quiz-title-3', type:'quiz-question', content:'Você costuma planejar as suas atividades?', style:{fontSize:'28px',fontWeight:'900',textColor:'#0f172a',hasTransparentBg:true,align:'center',marginBottom:15} },
    { id:'quiz-yesno-3', type:'quiz-yes-no', options:[{label:'Costumo planejar',description:'Gosto de ter clareza antes de agir',icon:'✓'},{label:'Apenas deixo fluir',description:'Prefiro decidir no caminho',icon:'×'}], optionsText:'Costumo planejar\nApenas deixo fluir', style:{marginBottom:12} },
    { id:'quiz-next-3', type:'quiz-next', content:'Continuar', url:'#quiz-next', openInNewTab:false, style:{bgColor:'#0ea5e9',textColor:'#ffffff',fontSize:'16px',fontWeight:'800',paddingVertical:16,paddingHorizontal:28,borderRadius:12,align:'center'} }
  ]}]},
  { id:'quiz-step-4', columns:[{ id:'quiz-col-4', flex:1, elements:[
    { id:'quiz-title-4', type:'quiz-question', content:'Criando seu plano personalizado...', style:{fontSize:'26px',fontWeight:'900',textColor:'#0f172a',hasTransparentBg:true,align:'center',marginBottom:20} },
    { id:'quiz-loading-4', type:'quiz-loading', content:'Checagem de dados', progress:72, style:{marginBottom:16} },
    { id:'quiz-metric-4', type:'quiz-metric', metricsText:'72%|Taxa de conversão\n56%|Retenção', style:{marginBottom:8} },
    { id:'quiz-next-4', type:'quiz-next', content:'Ver meu resultado', url:'#quiz-next', openInNewTab:false, style:{bgColor:'#0ea5e9',textColor:'#ffffff',fontSize:'16px',fontWeight:'800',paddingVertical:16,paddingHorizontal:28,borderRadius:12,align:'center'} }
  ]}]},
  { id:'quiz-step-5', columns:[{ id:'quiz-col-5', flex:1, elements:[
    { id:'quiz-title-5', type:'quiz-question', content:'Plano perfeito para você!', style:{fontSize:'28px',fontWeight:'900',textColor:'#0f172a',hasTransparentBg:true,align:'center',marginBottom:8} },
    { id:'quiz-text-5', type:'paragraph', content:'Selecionamos a opção que melhor combina com as suas respostas.', style:{fontSize:'15px',fontWeight:'400',textColor:'#64748b',hasTransparentBg:true,align:'center',marginBottom:14} },
    { id:'quiz-price-5', type:'quiz-price', content:'Plano PRO', description:'Acesso completo', price:'R$ 197,00', badge:'Destaque', style:{marginBottom:12} },
    { id:'quiz-result-5', type:'button', content:'Quero começar', url:'#', openInNewTab:false, style:{bgColor:'#0ea5e9',textColor:'#ffffff',fontSize:'16px',fontWeight:'800',paddingVertical:16,paddingHorizontal:28,borderRadius:12,align:'center'} }
  ]}]}
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
const platformTemplatesRegistry = reactive([]);

// Dados locais separados do conteúdo da página, prontos para futura migração a uma API.
const versionsRegistry = reactive(lsGet('page_versions_v1', []));
const metricsRegistry = reactive(lsGet('builder_metrics_v1', []));

// ─── Pages Registry ──────────────────────────────────────────────────────────
const pagesRegistry = reactive(lsGet('pages_registry_v1', []));

// ─── Folders Registry ────────────────────────────────────────────────────────
const foldersRegistry = reactive(lsGet('folders_registry_v1', []));
function removeDefaultFolder() {
  const index = foldersRegistry.findIndex(folder => folder.id === 'folder-default' && folder.name === 'Funil Principal');
  if (index < 0) return;
  foldersRegistry.splice(index, 1);
  pagesRegistry.forEach(page => { if (page.folderId === 'folder-default') page.folderId = null; });
  foldersRegistry.forEach(folder => { if (folder.parentId === 'folder-default') folder.parentId = null; });
}
removeDefaultFolder();

function workspaceSnapshot() {
  return {
    pages: JSON.parse(JSON.stringify(pagesRegistry)),
    folders: JSON.parse(JSON.stringify(foldersRegistry)),
    templates: JSON.parse(JSON.stringify(customTemplatesRegistry)),
    versions: JSON.parse(JSON.stringify(versionsRegistry)),
    metrics: JSON.parse(JSON.stringify(metricsRegistry)),
    settings: {
      activeThemeKey: state.activeThemeKey,
      productTourSeen: localStorage.getItem('vbs_tour_seen') === 'true'
    }
  };
}

function replaceRegistry(registry, values) {
  const safeValues = Array.isArray(values) ? JSON.parse(JSON.stringify(values)) : [];
  registry.splice(0, registry.length, ...safeValues);
}

function applyWorkspaceData(data = {}) {
  suppressBackendSync = true;
  try {
    replaceRegistry(pagesRegistry, data.pages);
    replaceRegistry(foldersRegistry, data.folders);
    removeDefaultFolder();
    replaceRegistry(customTemplatesRegistry, data.templates);
    replaceRegistry(versionsRegistry, data.versions);
    replaceRegistry(metricsRegistry, data.metrics);
    if (data.settings?.activeThemeKey) state.activeThemeKey = data.settings.activeThemeKey;
    if (data.settings?.productTourSeen) localStorage.setItem('vbs_tour_seen', 'true');
    lsSet('pages_registry_v1', pagesRegistry);
    lsSet('folders_registry_v1', foldersRegistry);
    lsSet('custom_templates_v1', customTemplatesRegistry);
    lsSet('page_versions_v1', versionsRegistry);
    lsSet('builder_metrics_v1', metricsRegistry);
  } finally {
    suppressBackendSync = false;
  }
}

async function loadPlatformTemplates() {
  if (!hasAuthToken()) return [];
  try {
    const templates = await getPlatformTemplates();
    platformTemplatesRegistry.splice(0, platformTemplatesRegistry.length, ...(Array.isArray(templates) ? templates : []));
    return platformTemplatesRegistry;
  } catch {
    platformTemplatesRegistry.splice(0, platformTemplatesRegistry.length);
    return [];
  }
}

function hasMeaningfulLocalWorkspace() {
  const customFolders = foldersRegistry.filter(folder => folder.id !== 'folder-default');
  return pagesRegistry.length > 0
    || customFolders.length > 0
    || customTemplatesRegistry.length > 0
    || versionsRegistry.length > 0
    || metricsRegistry.length > 0;
}

async function persistWorkspaceNow() {
  if (!hasAuthToken()) return false;
  if (!workspaceReady) throw new Error('Seu workspace ainda não foi carregado do servidor. Recarregue a página antes de salvar.');
  const response = await saveWorkspaceRequest({ revision: backendRevision, ...workspaceSnapshot() });
  backendRevision = response.revision;
  syncErrorShown = false;
  lastWorkspaceSyncError = '';
  return true;
}

function flushWorkspaceToBackend() {
  clearTimeout(workspaceSyncTimer);
  workspaceSyncChain = workspaceSyncChain
    .catch(() => false)
    .then(() => persistWorkspaceNow())
    .catch(async (error) => {
      if (error.status === 409 && Number.isInteger(error.payload?.currentRevision)) {
        const localSnapshot = workspaceSnapshot();
        const keepLocal = window.confirm('Este workspace foi alterado em outra sessão. Pressione OK para manter suas alterações locais ou Cancelar para carregar a versão do servidor.');
        if (keepLocal && Number.isInteger(error.payload?.currentRevision)) {
          const response = await saveWorkspaceRequest({ revision:error.payload.currentRevision, ...localSnapshot });
          backendRevision = response.revision;
          lastWorkspaceSyncError = '';
          showToast('Suas alterações locais foram mantidas sobre a versão mais recente.', 'success');
          return true;
        } else {
          await hydrateWorkspaceFromBackend();
          lastWorkspaceSyncError = 'A versão mais recente do servidor foi carregada.';
          showToast('A versão mais recente do servidor foi carregada.', 'info');
        }
      } else if (!syncErrorShown) {
        syncErrorShown = true;
        lastWorkspaceSyncError = error.message || 'Não foi possível sincronizar com o backend.';
        showToast(error.message || 'Não foi possível sincronizar com o backend.', 'error');
      } else {
        lastWorkspaceSyncError = error.message || 'Não foi possível sincronizar com o backend.';
      }
      return false;
    });
  return workspaceSyncChain;
}

function scheduleWorkspaceSync() {
  if (suppressBackendSync || !workspaceReady || !hasAuthToken()) return;
  clearTimeout(workspaceSyncTimer);
  workspaceSyncTimer = setTimeout(() => flushWorkspaceToBackend(), 450);
}

async function hydrateWorkspaceFromBackend() {
  if (!hasAuthToken()) return false;
  const response = await getWorkspace();
  backendRevision = Number(response.revision || 0);
  const user = getStoredUser();
  const ownerId = localStorage.getItem('vbs_workspace_owner');
  const canMigrateLegacy = (!ownerId || ownerId === user?.id) && hasMeaningfulLocalWorkspace();

  workspaceReady = true;
  if (!response.initialized && canMigrateLegacy) {
    await persistWorkspaceNow();
  } else {
    applyWorkspaceData(response.data || {});
    if (!response.initialized) await persistWorkspaceNow();
  }

  await loadPlatformTemplates();
  if (user?.id) localStorage.setItem('vbs_workspace_owner', user.id);
  return true;
}

// ─── Main State ──────────────────────────────────────────────────────────────
const state = reactive({
  activeQuizStepIndex: 0,
  rows: defaultFunilRows.map(r => JSON.parse(JSON.stringify(r))),
  selectedElement: null,
  isElementModalOpen: false,
  renderKey: 0,
  activeThemeKey: 'vsl-gold',
  isExportModalOpen: false,
  isSummaryModalOpen: false,
  isPreviewModalOpen: false,
  isVersionModalOpen: false,
  isMetricsModalOpen: false,
  exportedHTML: '',
  versionRevision: 0,
  metricRevision: 0,
  viewportMode: '100%',
  builderMode: 'funil', // 'funil' | 'email' | 'quiz'
  currentPageId: null, // ID of the page being edited, null = new
  currentPageName: '',
  currentPageFolderId: null,
  isTemplateBuilder: false,
  currentTemplateId: null,
  templateDraftMeta: { name: '', description: '', type: 'funil' },
  pageSettings: {
    bgColor: '#191919', fontFamily: 'Roboto', fontSize: 14, sectionGap: 12,
    pageTitle: 'Página de Vendas - VSL', metaDesc: 'Página oficial de vendas e conversão VSL.',
    metaPixel: '', gtmCode: '', faviconUrl: '', trackingKey: 'draft'
    , quizCardBg:'#ffffff', quizOptionBg:'#ffffff', quizOptionBorder:'#bae6fd', quizAccent:'#0ea5e9'
  }
});

// ─── Undo / Redo History Stack ─────────────────────────────────────────────
const undoStack = reactive([]);
const redoStack = reactive([]);

function pushSnapshot() {
  const snap = JSON.stringify(state.rows);
  if (undoStack.length > 0 && undoStack[undoStack.length - 1] === snap) return;
  undoStack.push(snap);
  if (undoStack.length > 40) undoStack.shift();
  redoStack.length = 0;
}

function setRows(newRows) {
  const parsed = JSON.parse(JSON.stringify(newRows || []));
  state.rows.splice(0, state.rows.length, ...parsed);
  state.renderKey++;
}

// Inicializar primeiro snapshot
if (undoStack.length === 0) {
  pushSnapshot();
}

export function useBuilderStore() {

  // ─── History ───────────────────────────────────────────────────────────────
  function undo() {
    if (undoStack.length <= 1) return;
    const currentSnap = undoStack.pop();
    redoStack.push(currentSnap);
    const prevSnap = undoStack[undoStack.length - 1];
    if (prevSnap) {
      setRows(JSON.parse(prevSnap));
      showToast('Ação desfeita!');
    }
  }

  function redo() {
    if (redoStack.length === 0) return;
    const nextSnap = redoStack.pop();
    undoStack.push(nextSnap);
    setRows(JSON.parse(nextSnap));
    showToast('Ação refeita!');
  }

  // ─── Viewport ──────────────────────────────────────────────────────────────
  function setViewport(mode) { state.viewportMode = mode; }

  function normalizeBuilderMode(mode) {
    const value = String(mode || 'funil').toLowerCase();
    if (value.includes('mail') || value === 'email') return 'email';
    if (value.includes('quiz')) return 'quiz';
    return 'funil';
  }

  function syncViewportForMode(mode = state.builderMode) {
    const normalizedMode = normalizeBuilderMode(mode);
    state.viewportMode = normalizedMode === 'email' ? '600px' : normalizedMode === 'quiz' ? '460px' : '100%';
    return normalizedMode;
  }

  // ─── Builder Mode ──────────────────────────────────────────────────────────
  function setBuilderMode(mode) {
    const normalizedMode = syncViewportForMode(mode);
    state.builderMode = normalizedMode;
    if (normalizedMode === 'email') {
      state.pageSettings.bgColor = '#f0f9ff';
      state.pageSettings.fontFamily = 'Poppins';
    } else if (normalizedMode === 'quiz') {
      state.pageSettings.bgColor = '#f5fbff';
      state.pageSettings.fontFamily = 'Plus Jakarta Sans';
      state.pageSettings.quizProgressColor = state.pageSettings.quizProgressColor || '#0ea5e9';
      state.pageSettings.quizProgressHeight = Number(state.pageSettings.quizProgressHeight) || 6;
      state.pageSettings.quizCardBg = state.pageSettings.quizCardBg || '#ffffff';
      state.pageSettings.quizOptionBg = state.pageSettings.quizOptionBg || '#ffffff';
      state.pageSettings.quizOptionBorder = state.pageSettings.quizOptionBorder || '#bae6fd';
      state.pageSettings.quizAccent = state.pageSettings.quizAccent || '#0ea5e9';
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
    pushSnapshot();
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
    if (preset === '4-col') cols = [
      { id: genUid('col-'), flex: 1, elements: [] },
      { id: genUid('col-'), flex: 1, elements: [] },
      { id: genUid('col-'), flex: 1, elements: [] },
      { id: genUid('col-'), flex: 1, elements: [] }
    ];
    const newRow = { id: rId, columns: cols };
    state.rows.push(newRow);
    pushSnapshot();
    return newRow;
  }

  function duplicateRow(rowIndex) {
    if (rowIndex < 0 || rowIndex >= state.rows.length) return;
    pushSnapshot();
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
    pushSnapshot();
    showToast('Seção duplicada!');
  }

  function deleteRow(rowIndex) {
    if (rowIndex >= 0 && rowIndex < state.rows.length) {
      pushSnapshot();
      state.rows.splice(rowIndex, 1);
      pushSnapshot();
    }
  }

  // ─── Elements ──────────────────────────────────────────────────────────────
  function addElementToColumn(columnId, elementType) {
    pushSnapshot();
    for (const row of state.rows) {
      for (const col of row.columns) {
        if (col.id === columnId) {
          col.elements.push(createDefaultElement(elementType));
          pushSnapshot();
          showToast(`"${getElemLabel(elementType)}" adicionado!`);
          return;
        }
      }
    }
  }

  function addElementToCanvas(elementType) {
    pushSnapshot();
    let targetRow = state.builderMode === 'quiz'
      ? state.rows[state.activeQuizStepIndex] || state.rows[0]
      : state.rows[state.rows.length - 1];
    if (!targetRow || !targetRow.columns.length) targetRow = addRow('1-col');
    targetRow.columns[0].elements.push(createDefaultElement(elementType));
    pushSnapshot();
    showToast(`"${getElemLabel(elementType)}" adicionado!`);
  }

  function getElemLabel(type) {
    if (type === 'smart-popup') return 'Popup inteligente (Modal)';
    const m = {
      heading: 'Título', paragraph: 'Parágrafo', button: 'Botão',
      'top-banner': 'Banner Topo', 'vturb-player': 'Player VTurb',
      'pitch-button': 'Botão Pitch CTA', 'live-viewers': 'Espectadores Ao Vivo',
      'meta-pixel': 'Meta Pixel', 'email-header': 'Cabeçalho E-mail',
      'email-footer': 'Rodapé E-mail', 'email-tag': 'Tag/Label',
      image: 'Imagem', divider: 'Divisor', testimonial: 'Depoimento', faq: 'Pergunta frequente',
      countdown: 'Contagem regressiva', form: 'Formulário'
      , 'quiz-question':'Pergunta', 'quiz-next':'Avançar etapa', 'quiz-progress':'Progresso', 'quiz-single':'Escolha única', 'quiz-multiple':'Múltipla escolha', 'quiz-yes-no':'Sim / Não', 'quiz-loading':'Loading', 'quiz-metric':'Métricas', 'quiz-price':'Preço', 'quiz-spacer':'Espaço'
    };
    return m[type] || type;
  }

  function createDefaultElement(type) {
    const id = genUid('elem-');
    const base = { id, type, delayEnabled: false, delayMinutes: 0, delaySeconds: 0 };
    const baseStyle = { fontSize: '16px', fontWeight: '700', textColor: '#000', bgColor: '#fff', hasTransparentBg: false, marginTop: 6, marginBottom: 0, align: 'center', lineHeight: 1.2 };

    if (type === 'smart-popup') {
      return {
        ...base,
        trigger: 'exit',
        openDelay: 5,
        videoDelay: 60,
        maxWidth: 500,
        showBadge: true,
        badgeText: 'CONTEÚDO EXCLUSIVO',
        icon: 'lock',
        title: 'DESBLOQUEIE O VÍDEO',
        subtitle: 'Preencha os dados abaixo para continuar assistindo o vídeo.',
        submitText: 'LIBERAR ACESSO',
        showFooter: true,
        footerText: 'Seus dados estão protegidos',
        fields: [
          { id: genUid('f-'), inputType: 'text', placeholder: 'Nome', required: true },
          { id: genUid('f-'), inputType: 'tel', placeholder: 'Whatsapp', required: true }
        ],
        blocks: [],
        style: {}
      };
    }

    if (type === 'heading') return { ...base, content: 'Novo Título em Destaque', style: { ...baseStyle, fontSize: '28px', fontWeight: '800', textColor: '#fff', hasTransparentBg: true, altColor: '#f1c232' } };
    if (type === 'paragraph') return { ...base, content: 'Texto do parágrafo...', style: { ...baseStyle, fontSize: '15px', fontWeight: '400', textColor: '#ccc', hasTransparentBg: true } };
    if (type === 'button') return { ...base, content: 'CLIQUE AQUI', url: '', openInNewTab: true, subtext: '', style: { ...baseStyle, bgColor: '#fff', textColor: '#000', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10 } };
    if (type === 'top-banner') return { ...base, content: 'ATENÇÃO: NÃO FECHE ESTA PÁGINA', style: { ...baseStyle, bgColor: '#dc2626', textColor: '#fff', fontSize: '15px' } };
    if (type === 'vturb-player') return { ...base, content: '', vturbBody: '', vturbHead: '', hostedVideoId: '', hostedVideoUrl: '', hostedVideoName: '', hostedVideoPoster: '', videoControls: true, videoAutoplay: false, videoMuted: false, videoLoop: false, style: { ...baseStyle, maxWidth: '320px', marginTop: 6, marginBottom: 6 } };
    if (type === 'pitch-button') return { ...base, content: 'QUERO MEU ACESSO AGORA', url: '', openInNewTab: true, subtext: 'Acesso imediato', style: { ...baseStyle, bgColor: '#fff', textColor: '#000', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, isGlow: false } };
    if (type === 'live-viewers') return { ...base, content: 'espectadores estão assistindo', minViewers: 100, maxViewers: 250, style: { ...baseStyle, textColor: '#fff', countColor: '#ffffff', hasTransparentBg: true, bgColor: 'transparent', fontSize: '18px', marginTop: 4, marginBottom: 4 } };
    if (type === 'meta-pixel') return { ...base, pixelId: '', pixelEvent: 'PageView', content: 'Meta Pixel', style: baseStyle };
    if (type === 'image') return { ...base, content: '', imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80', altText: 'Imagem de destaque', style: { ...baseStyle, hasTransparentBg: true, borderRadius: 14, marginTop: 10, marginBottom: 10 } };
    if (type === 'divider') return { ...base, content: '', style: { ...baseStyle, textColor: '#38bdf8', hasTransparentBg: true, marginTop: 18, marginBottom: 18 } };
    if (type === 'testimonial') return { ...base, content: '“A página ficou pronta muito mais rápido do que eu imaginava.”', author: 'Mariana Silva', role: 'Cliente verificada', style: { ...baseStyle, bgColor: '#ffffff', textColor: '#0f172a', borderColor: '#bae6fd', borderRadius: 14, fontSize: '16px', marginTop: 12, marginBottom: 12, align: 'left' } };
    if (type === 'faq') return { ...base, content: 'Como recebo o acesso?', answer: 'Assim que o pagamento for confirmado, o acesso será enviado para o seu e-mail.', style: { ...baseStyle, bgColor: '#ffffff', textColor: '#0f172a', borderColor: '#bae6fd', borderRadius: 12, fontSize: '16px', marginTop: 8, marginBottom: 8, align: 'left' } };
    if (type === 'countdown') return { ...base, content: 'Esta condição termina em:', targetDate: new Date(Date.now() + 86400000).toISOString(), style: { ...baseStyle, bgColor: '#ffffff', textColor: '#0f172a', borderColor: '#bae6fd', borderRadius: 14, fontSize: '16px', marginTop: 12, marginBottom: 12 } };
    if (type === 'form') return { ...base, content: 'Quero receber', formTitle: 'Receba o material gratuito', description: 'Preencha seus dados e receba o próximo passo.', namePlaceholder: 'Nome', emailPlaceholder: 'Seu melhor e-mail', submitUrl: '', style: { ...baseStyle, bgColor: '#0ea5e9', textColor: '#ffffff', borderColor: '#bae6fd', borderRadius: 14, fontSize: '16px', marginTop: 12, marginBottom: 12, align: 'left' } };
    if (type === 'quiz-question') return { ...base, content:'Escreva a pergunta desta etapa', style:{...baseStyle,fontSize:'28px',fontWeight:'900',textColor:'#0f172a',hasTransparentBg:true,align:'center',marginBottom:14} };
    if (type === 'quiz-next') return { ...base, content:'Continuar', url:'#quiz-next', openInNewTab:false, style:{...baseStyle,bgColor:'#0ea5e9',textColor:'#ffffff',fontSize:'16px',fontWeight:'800',paddingVertical:16,paddingHorizontal:28,borderRadius:12,align:'center',marginTop:10} };
    if (type === 'quiz-progress') return { ...base, content:'Progresso', progress:25, style:{...baseStyle,hasTransparentBg:true,marginBottom:18} };
    if (type === 'quiz-single') return { ...base, content:'Escolha uma opção', options:[{label:'Opção 1',description:'Explique quando essa escolha faz sentido',icon:'1'},{label:'Opção 2',description:'Mostre outro caminho possível',icon:'2'},{label:'Opção 3',description:'Use uma descrição curta e direta',icon:'3'}], optionsText:'Opção 1\nOpção 2\nOpção 3', style:{...baseStyle,hasTransparentBg:true,marginBottom:8} };
    if (type === 'quiz-multiple') return { ...base, content:'Escolha uma ou mais opções', options:[{label:'Opção A',description:'Primeiro interesse do visitante',icon:'A'},{label:'Opção B',description:'Segundo interesse do visitante',icon:'B'},{label:'Opção C',description:'Terceiro interesse do visitante',icon:'C'}], optionsText:'Opção A\nOpção B\nOpção C', style:{...baseStyle,hasTransparentBg:true,marginBottom:8} };
    if (type === 'quiz-yes-no') return { ...base, content:'Escolha uma resposta', options:[{label:'Sim',description:'Quero seguir por esse caminho',icon:'✓'},{label:'Não',description:'Prefiro outra opção',icon:'×'}], optionsText:'Sim\nNão', style:{...baseStyle,hasTransparentBg:true,marginBottom:8} };
    if (type === 'quiz-loading') return { ...base, content:'Analisando suas respostas...', progress:72, style:{...baseStyle,hasTransparentBg:true,marginBottom:12} };
    if (type === 'quiz-metric') return { ...base, content:'Métricas', metricsText:'72%|Taxa de conversão\n56%|Retenção', style:{...baseStyle,hasTransparentBg:true,marginBottom:12} };
    if (type === 'quiz-price') return { ...base, content:'Plano PRO', description:'Acesso completo', price:'R$ 197,00', badge:'Recomendado', style:{...baseStyle,hasTransparentBg:true,marginBottom:12} };
    if (type === 'quiz-spacer') return { ...base, content:'Espaço', height:32, style:{...baseStyle,hasTransparentBg:true} };

    // Email elements
    if (type === 'email-header') return { ...base, logoType: 'text', logoText: 'Rappu', logoImageUrl: '', content: 'Cabeçalho E-mail', style: { bgColor: '#27272a', textColor: '#fff', logoColor: '#fff', paddingVertical: 26, paddingHorizontal: 44, align: 'left', fontSize: '20px', fontWeight: '700' } };
    if (type === 'email-footer') return { ...base, logoType: 'text', logoText: 'Rappu', logoImageUrl: '', copyrightText: '© 2026 Rappu. Todos os direitos reservados.', content: 'Rodapé E-mail', style: { bgColor: '#27272a', textColor: '#a1a1aa', logoColor: '#fff', paddingVertical: 24, paddingHorizontal: 44, align: 'center', fontSize: '12px', fontWeight: '400' } };
    if (type === 'email-tag') return { ...base, content: 'ARTES PRONTAS', style: { ...baseStyle, bgColor: '#f4f4f5', textColor: '#27272a', fontSize: '11px', fontWeight: '500', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 999, marginBottom: 12, align: 'left' } };

    return { ...base, content: 'Novo Elemento', style: baseStyle };
  }

  // ─── Modal ─────────────────────────────────────────────────────────────────
  function openModalForElement(elem) {
    if (elem && !elem.isGlobalSettings && !elem.style) {
      elem.style = {};
    }
    state.selectedElement = JSON.parse(JSON.stringify(elem));
    state.isElementModalOpen = true;
  }
  function openExportModal() {
    state.exportedHTML = generateExportedHTML(state.rows, { ...state.pageSettings, builderMode: state.builderMode });
    state.isExportModalOpen = true;
  }

  function openPreviewModal() { state.isPreviewModalOpen = true; }
  function closePreviewModal() { state.isPreviewModalOpen = false; }
  function openVersionModal() { state.isVersionModalOpen = true; }
  function closeVersionModal() { state.isVersionModalOpen = false; }
  function openMetricsModal() { state.isMetricsModalOpen = true; }
  function closeMetricsModal() { state.isMetricsModalOpen = false; }

  function openGlobalSettings() { state.selectedElement = { isGlobalSettings: true, id: 'global-settings', type: 'global-settings' }; state.isElementModalOpen = true; }
  function closeModal(save = false) {
    if (save && state.selectedElement && !state.selectedElement.isGlobalSettings) {
      const draft = state.selectedElement;
      for (const row of state.rows) for (const col of row.columns) {
        const index = col.elements.findIndex(item => item.id === draft.id);
        if (index !== -1) col.elements.splice(index, 1, JSON.parse(JSON.stringify(draft)));
      }
      pushSnapshot();
    }
    state.isElementModalOpen = false;
    state.selectedElement = null;
    if (save) showToast('Alterações salvas!', 'save');
  }

  function deleteSelectedElement() {
    if (!state.selectedElement || state.selectedElement.isGlobalSettings) return;
    pushSnapshot();
    const targetId = state.selectedElement.id;
    for (const row of state.rows) {
      for (const col of row.columns) {
        const i = col.elements.findIndex(e => e.id === targetId);
        if (i !== -1) { col.elements.splice(i, 1); break; }
      }
    }
    pushSnapshot();
    closeModal();
  }

  function duplicateElement(elementId) {
    pushSnapshot();
    for (const row of state.rows) {
      for (const col of row.columns) {
        const i = col.elements.findIndex(e => e.id === elementId);
        if (i !== -1) {
          const clone = JSON.parse(JSON.stringify(col.elements[i]));
          clone.id = 'elem-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
          col.elements.splice(i + 1, 0, clone);
          pushSnapshot();
          showToast('Objeto duplicado!');
          return;
        }
      }
    }
  }

  function deleteElement(elementId) {
    pushSnapshot();
    for (const row of state.rows) {
      for (const col of row.columns) {
        const i = col.elements.findIndex(e => e.id === elementId);
        if (i !== -1) {
          col.elements.splice(i, 1);
          pushSnapshot();
          showToast('Objeto excluído', 'info');
          return;
        }
      }
    }
  }

  function clearCanvas() {
    if (confirm('Tem certeza que deseja limpar todo o canvas?')) {
      pushSnapshot();
      setRows([]);
      pushSnapshot();
      closeModal();
    }
  }

  // ─── Pages Registry ────────────────────────────────────────────────────────
  function savePage(name, folderId) {
    const now = new Date().toISOString();
    if (state.currentPageId) {
      // Update existing page
      const idx = pagesRegistry.findIndex(p => p.id === state.currentPageId);
      if (idx !== -1) {
        state.currentPageName = name || pagesRegistry[idx].name;
        const targetFolderId = folderId === undefined ? pagesRegistry[idx].folderId : (folderId || null);
        state.currentPageFolderId = targetFolderId;
        state.pageSettings.trackingKey = state.currentPageId;
        pagesRegistry[idx] = {
          ...pagesRegistry[idx],
          name: name || pagesRegistry[idx].name,
          folderId: targetFolderId,
          rows: JSON.parse(JSON.stringify(state.rows)),
          pageSettings: JSON.parse(JSON.stringify(state.pageSettings)),
          builderMode: state.builderMode,
          updatedAt: now,
          lastEditedAt: now
        };
        lsSet('pages_registry_v1', pagesRegistry);
        createVersion('Salvamento automático', false);
        return pagesRegistry[idx];
      }
    }
    // Create new page
    const newPageId = 'page-' + Date.now();
    state.pageSettings.trackingKey = newPageId;
    const newPage = {
      id: newPageId,
      name: name || 'Nova Página',
      folderId: folderId || null,
      type: state.builderMode,
      rows: JSON.parse(JSON.stringify(state.rows)),
      pageSettings: JSON.parse(JSON.stringify(state.pageSettings)),
      builderMode: state.builderMode,
      createdAt: now,
      updatedAt: now,
      lastEditedAt: now,
      statusClass: 'draft',
      statusText: 'Rascunho'
    };
    pagesRegistry.unshift(newPage);
    lsSet('pages_registry_v1', pagesRegistry);
    state.currentPageId = newPage.id;
    state.currentPageName = newPage.name;
    state.currentPageFolderId = newPage.folderId;
    createVersion('Primeira versão', false);
    return newPage;
  }

  function capturePageSaveState() {
    return {
      pages: JSON.parse(JSON.stringify(pagesRegistry)),
      versions: JSON.parse(JSON.stringify(versionsRegistry)),
      currentPageId: state.currentPageId,
      currentPageName: state.currentPageName,
      currentPageFolderId: state.currentPageFolderId,
      pageSettings: JSON.parse(JSON.stringify(state.pageSettings)),
      versionRevision: state.versionRevision
    };
  }

  function restorePageSaveState(snapshot) {
    if (!snapshot) return;
    clearTimeout(workspaceSyncTimer);
    suppressBackendSync = true;
    try {
      replaceRegistry(pagesRegistry, snapshot.pages);
      replaceRegistry(versionsRegistry, snapshot.versions);
      state.currentPageId = snapshot.currentPageId;
      state.currentPageName = snapshot.currentPageName;
      state.currentPageFolderId = snapshot.currentPageFolderId;
      state.pageSettings = JSON.parse(JSON.stringify(snapshot.pageSettings));
      state.versionRevision = snapshot.versionRevision;
      lsSet('pages_registry_v1', pagesRegistry);
      lsSet('page_versions_v1', versionsRegistry);
    } finally {
      suppressBackendSync = false;
    }
  }

  async function savePageToBackend(name, folderId) {
    const snapshot = capturePageSaveState();
    const page = savePage(name, folderId);
    if (await flushWorkspaceToBackend()) return page;
    restorePageSaveState(snapshot);
    throw new Error(lastWorkspaceSyncError || 'Não foi possível confirmar o salvamento. Tente novamente.');
  }

  function loadPage(pageId) {
    const page = pagesRegistry.find(p => p.id === pageId);
    if (!page) return false;
    state.activeQuizStepIndex = 0;
    state.isTemplateBuilder = false;
    state.currentTemplateId = null;
    setRows(page.rows || []);
    state.pageSettings = { ...state.pageSettings, ...JSON.parse(JSON.stringify(page.pageSettings || {})) };
    state.builderMode = syncViewportForMode(page.builderMode || page.type || 'funil');
    state.currentPageId = page.id;
    state.currentPageName = page.name;
    state.currentPageFolderId = page.folderId;
    state.pageSettings.trackingKey = page.id;
    page.lastEditedAt = new Date().toISOString();
    lsSet('pages_registry_v1', pagesRegistry);
    return true;
  }

  function deletePage(pageId) {
    const idx = pagesRegistry.findIndex(p => p.id === pageId);
    if (idx !== -1) {
      const name = pagesRegistry[idx].name;
      pagesRegistry.splice(idx, 1);
      lsSet('pages_registry_v1', pagesRegistry);
      showToast(`"${name}" excluída!`, 'info');
    }
  }

  function newBlankCanvas(mode = 'funil', { name = '', folderId = null } = {}) {
    state.activeQuizStepIndex = 0;
    const normalizedMode = normalizeBuilderMode(mode);
    state.isTemplateBuilder = false;
    state.currentTemplateId = null;
    state.templateDraftMeta = { name: '', description: '', type: normalizedMode };
    state.builderMode = normalizedMode;
    state.currentPageId = null;
    state.currentPageName = name;
    state.currentPageFolderId = folderId;
    if (normalizedMode === 'email') {
      setRows([]);
      state.viewportMode = '600px';
      state.pageSettings = { ...state.pageSettings, bgColor: '#f0f9ff', fontFamily: 'Poppins', fontSize: 14, sectionGap: 0, pageTitle: name || 'Novo e-mail', metaDesc: '', metaPixel: '', gtmCode: '', faviconUrl: '', trackingKey: 'draft' };
    } else if (normalizedMode === 'quiz') {
      setRows([]);
      state.viewportMode = '460px';
      state.pageSettings = { ...state.pageSettings, bgColor:'#f5fbff', fontFamily:'Plus Jakarta Sans', fontSize:14, sectionGap:18, quizProgressColor:'#0ea5e9', quizProgressHeight:6, pageTitle:name || 'Novo quiz interativo', metaDesc:'Quiz interativo personalizado', metaPixel:'', gtmCode:'', faviconUrl:'', trackingKey:'draft' };
    } else {
      setRows([]);
      state.viewportMode = '100%';
      state.pageSettings = { ...state.pageSettings, bgColor: '#191919', fontFamily: 'Roboto', fontSize: 14, sectionGap: 12, pageTitle: name || 'Nova página VSL', metaDesc: '', metaPixel: '', gtmCode: '', faviconUrl: '', trackingKey: 'draft' };
    }
  }

  // ─── Folders Registry ──────────────────────────────────────────────────────
  function createFolder(name, parentId = null, color = '#0ea5e9', customDomain = '') {
    const f = { id: 'folder-' + Date.now(), name, parentId, color, customDomain, createdAt: new Date().toISOString() };
    foldersRegistry.unshift(f);
    lsSet('folders_registry_v1', foldersRegistry);
    showToast(`Pasta "${name}" criada!`, 'success');
    return f;
  }

  function renameFolder(id, newName, customDomain) {
    const f = foldersRegistry.find(f => f.id === id);
    if (f && customDomain !== undefined) f.customDomain = customDomain;
    if (f) { f.name = newName; lsSet('folders_registry_v1', foldersRegistry); showToast(`Pasta renomeada para "${newName}"!`); }
  }

  function deleteFolder(id) {
    const idx = foldersRegistry.findIndex(f => f.id === id);
    if (idx !== -1) {
      // Move pages in this folder to root
      pagesRegistry.forEach(p => { if (p.folderId === id) p.folderId = null; });
      lsSet('pages_registry_v1', pagesRegistry);
      foldersRegistry.splice(idx, 1);
      lsSet('folders_registry_v1', foldersRegistry);
      showToast('Pasta excluída!', 'info');
    }
  }

  function moveFolder(id, newParentId) {
    const f = foldersRegistry.find(f => f.id === id);
    if (f && f.id !== newParentId) { f.parentId = newParentId; lsSet('folders_registry_v1', foldersRegistry); showToast('Pasta movida!'); }
  }

  function movePage(pageId, folderId) {
    const p = pagesRegistry.find(p => p.id === pageId);
    if (p) {
      p.folderId = folderId || null;
      p.lastEditedAt = new Date().toISOString();
      lsSet('pages_registry_v1', pagesRegistry);
      showToast('Página movida!');
    }
  }

  function updatePageDetails(pageId, { name, folderId, slug } = {}) {
    const page = pagesRegistry.find(item => item.id === pageId);
    if (!page) return false;
    const cleanName = String(name || '').trim();
    if (cleanName) page.name = cleanName;
    if (folderId !== undefined) page.folderId = folderId || null;
    if (slug !== undefined) {
      page.pageSettings = { ...(page.pageSettings || {}), publicationSlug: cleanSlug(slug || cleanName || page.name) };
    }
    page.lastEditedAt = new Date().toISOString();
    page.updatedAt = page.lastEditedAt;
    if (state.currentPageId === page.id) {
      state.currentPageName = page.name;
      state.currentPageFolderId = page.folderId;
    }
    lsSet('pages_registry_v1', pagesRegistry);
    showToast('Projeto atualizado!', 'success');
    return true;
  }

  function cleanSlug(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  // ─── Custom Templates Registry ─────────────────────────────────────────────
  function registerCustomTemplate(templateObj) {
    if (!templateObj || !templateObj.id) return;
    const idx = customTemplatesRegistry.findIndex(t => t.id === templateObj.id);
    if (idx !== -1) customTemplatesRegistry[idx] = templateObj;
    else customTemplatesRegistry.unshift(templateObj);
    lsSet('custom_templates_v1', customTemplatesRegistry);
  }

  function deleteCustomTemplate(templateId) {
    const index = customTemplatesRegistry.findIndex(template => template.id === templateId);
    if (index < 0) return false;
    customTemplatesRegistry.splice(index, 1);
    lsSet('custom_templates_v1', customTemplatesRegistry);
    showToast('Template removido.', 'info');
    return true;
  }

  function startTemplateBuilder({ type = 'funil', name = '', description = '', templateId = null } = {}) {
    const normalizedType = normalizeBuilderMode(type);
    const existing = templateId
      ? customTemplatesRegistry.find(template => template.id === templateId || template.key === templateId)
      : null;

    if (existing) {
      loadTemplate(existing.id);
      state.currentTemplateId = existing.id;
      state.currentPageName = existing.name;
      state.templateDraftMeta = {
        name: existing.name,
        description: existing.description || '',
        type: normalizeBuilderMode(existing.quizMode ? 'quiz' : existing.emailMode ? 'email' : existing.category)
      };
    } else {
      newBlankCanvas(normalizedType, { name });
      state.currentTemplateId = null;
      state.templateDraftMeta = { name: name.trim(), description: description.trim(), type: normalizedType };
    }

    state.isTemplateBuilder = true;
    state.currentPageId = null;
    state.currentPageFolderId = null;
  }

  function saveTemplateFromBuilder() {
    if (!state.isTemplateBuilder) return null;
    const type = normalizeBuilderMode(state.templateDraftMeta.type || state.builderMode);
    const existing = customTemplatesRegistry.find(template => template.id === state.currentTemplateId);
    const now = new Date().toISOString();
    const id = existing?.id || `template-${Date.now()}`;
    const template = {
      ...existing,
      id,
      key: id,
      name: state.templateDraftMeta.name.trim() || state.currentPageName || 'Novo template',
      description: state.templateDraftMeta.description.trim(),
      category: type === 'email' ? 'E-mail' : type === 'quiz' ? 'Quiz' : 'Funil',
      emailMode: type === 'email',
      quizMode: type === 'quiz',
      status: 'published',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      json: {
        rows: JSON.parse(JSON.stringify(state.rows)),
        pageSettings: { ...JSON.parse(JSON.stringify(state.pageSettings)), builderMode: type },
        builderMode: type
      }
    };
    registerCustomTemplate(template);
    state.currentTemplateId = id;
    state.currentPageName = template.name;
    showToast(existing ? 'Template atualizado com sucesso!' : 'Template publicado na biblioteca!', 'success');
    return template;
  }

  function closeTemplateBuilder() {
    state.isTemplateBuilder = false;
    state.currentTemplateId = null;
    state.templateDraftMeta = { name: '', description: '', type: state.builderMode };
  }

  // ─── Load Template ─────────────────────────────────────────────────────────
  function loadTemplate(templateTypeOrKey) {
    if (!templateTypeOrKey) return;

    // Custom JSON templates
    const custom = customTemplatesRegistry.find(t => t.id === templateTypeOrKey || t.key === templateTypeOrKey);
    const platform = platformTemplatesRegistry.find(t => t.id === templateTypeOrKey || t.sourceTemplateId === templateTypeOrKey || t.key === templateTypeOrKey);
    const selectedTemplate = custom || platform;
    if (selectedTemplate && selectedTemplate.json) {
      setRows(selectedTemplate.json.rows || []);
      if (selectedTemplate.json.pageSettings) state.pageSettings = { ...state.pageSettings, ...JSON.parse(JSON.stringify(selectedTemplate.json.pageSettings)) };
      state.builderMode = syncViewportForMode(selectedTemplate.quizMode || String(selectedTemplate.category || '').toLowerCase().includes('quiz') ? 'quiz' : selectedTemplate.emailMode || String(selectedTemplate.category || '').toLowerCase().includes('mail') ? 'email' : 'funil');
      state.currentPageId = null;
      showToast(`Template "${selectedTemplate.name}" carregado!`, 'success');
      return;
    }

    // VSL Preset
    if (templateTypeOrKey === 'vsl' || templateTypeOrKey === 'lp') {
      state.builderMode = 'funil';
      syncViewportForMode('funil');
      state.currentPageId = null;
      state.pageSettings = { ...state.pageSettings, bgColor: '#191919', fontFamily: 'Roboto', pageTitle: 'Página de Vendas VSL', sectionGap: 12 };
      setRows(defaultFunilRows);
      showToast('Template VSL carregado!', 'success');
      return;
    }

    // Email Preset
    if (templateTypeOrKey === 'email') {
      state.builderMode = 'email';
      syncViewportForMode('email');
      state.currentPageId = null;
      state.pageSettings = { ...state.pageSettings, bgColor: '#f5f5f7', fontFamily: 'Poppins', pageTitle: 'Template E-mail' };
      state.rows = defaultEmailRows.map(r => JSON.parse(JSON.stringify(r)));
      showToast('Template E-mail carregado!', 'success');
      return;
    }

    if (templateTypeOrKey === 'quiz') {
      state.builderMode = 'quiz';
      state.currentPageId = null;
      syncViewportForMode('quiz');
      state.pageSettings = { ...state.pageSettings, bgColor:'#f5fbff', fontFamily:'Plus Jakarta Sans', quizProgressColor:'#0ea5e9', quizProgressHeight:6, pageTitle:'Quiz interativo' };
      setRows(defaultQuizRows);
      showToast('Template de quiz carregado!', 'success');
      return;
    }

    // Home preset
    if (templateTypeOrKey === 'home') {
      state.builderMode = 'funil';
      syncViewportForMode('funil');
      state.currentPageId = null;
      state.pageSettings = { ...state.pageSettings, bgColor: '#0a0d14', pageTitle: 'Página Inicial' };
      state.rows = [{
        id: 'row-h-1', columns: [{ id: 'col-h-1', flex: 1, elements: [
          { id: 'e-h-1', type: 'heading', content: 'A Solução Completa Para >>Impulsionar Seu Negócio<<', style: { fontSize: '36px', fontWeight: '900', textColor: '#fff', altColor: '#38bdf8', align: 'center', marginTop: 24, marginBottom: 12, hasTransparentBg: true } },
          { id: 'e-h-2', type: 'paragraph', content: 'Simplifique processos e garanta máxima performance.', style: { fontSize: '18px', textColor: '#64748b', align: 'center', marginTop: 0, marginBottom: 24, hasTransparentBg: true, fontWeight: '400' } },
          { id: 'e-h-3', type: 'button', content: 'COMEÇAR GRÁTIS AGORA', url: '', openInNewTab: false, subtext: '', style: { bgColor: '#0ea5e9', textColor: '#fff', fontSize: '18px', fontWeight: '700', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, align: 'center' } }
        ]}]
      }];
      showToast('Template Página Inicial carregado!', 'success');
      return;
    }
  }

  function moveElementUp(elementId) {
    for (const row of state.rows) {
      for (const col of row.columns) {
        const i = col.elements.findIndex(e => e.id === elementId);
        if (i > 0) {
          pushSnapshot();
          const item = col.elements.splice(i, 1)[0];
          col.elements.splice(i - 1, 0, item);
          pushSnapshot();
          showToast('Elemento movido para cima!');
          return;
        }
      }
    }
  }

  function moveElementDown(elementId) {
    for (const row of state.rows) {
      for (const col of row.columns) {
        const i = col.elements.findIndex(e => e.id === elementId);
        if (i !== -1 && i < col.elements.length - 1) {
          pushSnapshot();
          const item = col.elements.splice(i, 1)[0];
          col.elements.splice(i + 1, 0, item);
          pushSnapshot();
          showToast('Elemento movido para baixo!');
          return;
        }
      }
    }
  }

  // ─── Presell High-Conversion Color Theme Engine ───────────────────────────
  const colorThemesCatalog = {
    'presell-vsl-gold': {
      key: 'presell-vsl-gold', name: 'Presell VSL Clássico', tag: 'Recomendado',
      pageBg: '#191919', fontFamily: 'Roboto',
      headingText: '#ffffff', headingAlt: '#f1c232', paraText: '#d1d5db',
      btnBg: '#10b981', btnText: '#ffffff', bannerBg: '#dc2626', bannerText: '#ffffff',
      emailBg: '#27272a', emailText: '#ffffff', countColor: '#f1c232'
    },
    'presell-green-cta': {
      key: 'presell-green-cta', name: 'Presell Verde Vendas', tag: 'Alta Conversão',
      pageBg: '#0f172a', fontFamily: 'Poppins',
      headingText: '#ffffff', headingAlt: '#34d399', paraText: '#94a3b8',
      btnBg: '#059669', btnText: '#ffffff', bannerBg: '#b91c1c', bannerText: '#ffffff',
      emailBg: '#0f172a', emailText: '#ffffff', countColor: '#34d399'
    },
    'presell-yellow-banner': {
      key: 'presell-yellow-banner', name: 'Presell Topo Amarelo', tag: 'Alerta Total',
      pageBg: '#111827', fontFamily: 'Inter',
      headingText: '#ffffff', headingAlt: '#f1c232', paraText: '#9ca3af',
      btnBg: '#22c55e', btnText: '#ffffff', bannerBg: '#f1c232', bannerText: '#000000',
      emailBg: '#1f2937', emailText: '#ffffff', countColor: '#f1c232'
    },
    'presell-black-gold': {
      key: 'presell-black-gold', name: 'Presell Dark & Ouro', tag: 'VIP Presell',
      pageBg: '#000000', fontFamily: 'Montserrat',
      headingText: '#ffffff', headingAlt: '#fbbf24', paraText: '#e5e7eb',
      btnBg: '#f1c232', btnText: '#000000', bannerBg: '#991b1b', bannerText: '#ffffff',
      emailBg: '#18181b', emailText: '#ffffff', countColor: '#fbbf24'
    },
    'presell-danger-alert': {
      key: 'presell-danger-alert', name: 'Presell Urgência Red', tag: 'Oferta Única',
      pageBg: '#18181b', fontFamily: 'Oswald',
      headingText: '#ffffff', headingAlt: '#facc15', paraText: '#a1a1aa',
      btnBg: '#10b981', btnText: '#ffffff', bannerBg: '#ef4444', bannerText: '#ffffff',
      emailBg: '#27272a', emailText: '#ffffff', countColor: '#facc15'
    }
  };

  const colorThemesList = Object.values(colorThemesCatalog);

  function applyGlobalColorTheme(themeKey) {
    pushSnapshot();
    const t = colorThemesCatalog[themeKey];
    if (!t) return;

    state.activeThemeKey = themeKey;
    state.pageSettings.bgColor = t.pageBg;
    state.pageSettings.fontFamily = t.fontFamily;

    for (const row of state.rows) {
      for (const col of row.columns) {
        for (const elem of col.elements) {
          if (!elem.style) elem.style = {};
          if (elem.type === 'heading') {
            elem.style.textColor = t.headingText;
            elem.style.altColor = t.headingAlt;
          } else if (elem.type === 'paragraph') {
            elem.style.textColor = t.paraText;
          } else if (elem.type === 'button' || elem.type === 'pitch-button') {
            elem.style.bgColor = t.btnBg;
            elem.style.textColor = t.btnText;
            elem.style.hasTransparentBg = false;
          } else if (elem.type === 'top-banner') {
            elem.style.bgColor = t.bannerBg;
            elem.style.textColor = t.bannerText;
          } else if (elem.type === 'email-header' || elem.type === 'email-footer') {
            elem.style.bgColor = t.emailBg;
            elem.style.logoColor = t.emailText;
            elem.style.textColor = t.emailText;
          } else if (elem.type === 'email-tag') {
            elem.style.bgColor = t.emailBg;
            elem.style.textColor = t.emailText;
          } else if (elem.type === 'live-viewers') {
            elem.style.textColor = t.headingText;
            elem.style.countColor = t.countColor;
          }
        }
      }
    }

    state.renderKey++;
    pushSnapshot();
    showToast(`Tema "${t.name}" aplicado em toda a página!`, 'success');
  }

  // ─── Modals ────────────────────────────────────────────────────────────────
  function getActivePageKey() {
    return state.currentPageId || state.pageSettings.trackingKey || 'draft';
  }

  function createVersion(label = 'Versão manual', announce = true) {
    const pageKey = getActivePageKey();
    const version = {
      id: `version-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      pageKey,
      label: label.trim() || 'Versão manual',
      createdAt: new Date().toISOString(),
      snapshot: {
        rows: JSON.parse(JSON.stringify(state.rows)),
        pageSettings: JSON.parse(JSON.stringify(state.pageSettings)),
        builderMode: state.builderMode,
        currentPageName: state.currentPageName
      }
    };
    versionsRegistry.unshift(version);
    const keep = versionsRegistry.filter(item => item.pageKey === pageKey).slice(0, 25).map(item => item.id);
    for (let i = versionsRegistry.length - 1; i >= 0; i--) {
      if (versionsRegistry[i].pageKey === pageKey && !keep.includes(versionsRegistry[i].id)) versionsRegistry.splice(i, 1);
    }
    lsSet('page_versions_v1', versionsRegistry);
    state.versionRevision++;
    if (announce) showToast('Versão salva no histórico.', 'success');
    return version;
  }

  function getVersions() {
    state.versionRevision;
    return versionsRegistry.filter(item => item.pageKey === getActivePageKey());
  }

  function restoreVersion(version) {
    if (!version?.snapshot) return false;
    pushSnapshot();
    setRows(version.snapshot.rows || []);
    state.pageSettings = { ...state.pageSettings, ...JSON.parse(JSON.stringify(version.snapshot.pageSettings || {})) };
    state.builderMode = syncViewportForMode(version.snapshot.builderMode || state.builderMode);
    state.currentPageName = version.snapshot.currentPageName || state.currentPageName;
    pushSnapshot();
    showToast(`Versão "${version.label}" restaurada.`, 'success');
    return true;
  }

  function recordMetric(metric = {}) {
    const entry = {
      id: `metric-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      pageKey: metric.pageKey || getActivePageKey(),
      type: metric.type || 'page_view',
      createdAt: metric.createdAt || new Date().toISOString(),
      target: metric.target || ''
    };
    metricsRegistry.unshift(entry);
    if (metricsRegistry.length > 1000) metricsRegistry.splice(1000);
    lsSet('builder_metrics_v1', metricsRegistry);
    state.metricRevision++;
  }

  function getMetrics() {
    state.metricRevision;
    const records = metricsRegistry.filter(item => item.pageKey === getActivePageKey());
    const count = type => records.filter(item => item.type === type).length;
    return {
      pageViews: count('page_view'),
      clicks: count('cta_click'),
      leads: count('form_submit'),
      records: records.slice(0, 20)
    };
  }

  function clearMetrics() {
    const pageKey = getActivePageKey();
    for (let i = metricsRegistry.length - 1; i >= 0; i--) {
      if (metricsRegistry[i].pageKey === pageKey) metricsRegistry.splice(i, 1);
    }
    lsSet('builder_metrics_v1', metricsRegistry);
    state.metricRevision++;
    showToast('Métricas locais limpas.', 'info');
  }

  function openSummaryModal() { state.isSummaryModalOpen = true; }
  function closeSummaryModal() { state.isSummaryModalOpen = false; }

  return {
    state, toasts, customTemplatesRegistry, platformTemplatesRegistry, pagesRegistry, foldersRegistry, versionsRegistry, metricsRegistry,
    undoStack, redoStack, undo, redo, colorThemesList,
    showToast, setViewport, setBuilderMode,
    addRow, duplicateRow, deleteRow,
    addElementToColumn, addElementToCanvas,
    openModalForElement, openExportModal, openPreviewModal, closePreviewModal, openGlobalSettings, closeModal,
    deleteSelectedElement, duplicateElement, deleteElement, clearCanvas,
    moveElementUp, moveElementDown, applyGlobalColorTheme,
    savePageToBackend, loadPage, deletePage, newBlankCanvas, movePage, updatePageDetails,
    createFolder, renameFolder, deleteFolder, moveFolder,
    registerCustomTemplate, deleteCustomTemplate, loadTemplate, loadPlatformTemplates,
    startTemplateBuilder, saveTemplateFromBuilder, closeTemplateBuilder,
    createVersion, getVersions, restoreVersion, openVersionModal, closeVersionModal,
    recordMetric, getMetrics, clearMetrics, openMetricsModal, closeMetricsModal,
    openSummaryModal, closeSummaryModal,
    hydrateWorkspaceFromBackend, flushWorkspaceToBackend
  };
}
