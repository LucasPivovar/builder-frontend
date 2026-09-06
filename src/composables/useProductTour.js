import { computed, reactive } from 'vue';

export const PRODUCT_TOUR_EVENT = 'vbs-product-tour';

export const productTourSteps = [
  {
    route: '/dashboard',
    selector: '.tour-create-folder',
    actionSelector: '.tour-create-folder',
    placement: 'bottom',
    title: 'Crie a pasta do projeto',
    body: 'Toda página começa dentro de uma pasta. A pasta reúne as páginas que pertencem ao mesmo projeto.',
    action: 'open-folder-create',
    readySelector: '.tour-folder-modal'
  },
  {
    route: '/dashboard',
    selector: '.tour-folder-modal',
    actionSelector: '.tour-folder-submit',
    placement: 'right',
    title: 'Defina a pasta e o domínio',
    body: 'Dê um nome à pasta e, se já tiver um domínio, informe-o aqui. As páginas dessa pasta serão publicadas nesse domínio.',
    action: 'create-folder',
    readySelector: '.tour-create-page',
    hiddenSelector: '.tour-folder-modal'
  },
  {
    route: '/dashboard',
    selector: '.tour-create-page',
    actionSelector: '.tour-create-page',
    placement: 'bottom',
    title: 'Agora crie sua primeira página',
    body: 'Com a pasta pronta, abra o fluxo de criação para escolher o formato da página.',
    action: 'open-create',
    readySelector: '.tour-create-modal-types'
  },
  {
    route: '/dashboard',
    selector: '.tour-create-modal-types',
    actionSelector: '.tour-modal-next',
    placement: 'right',
    title: 'Escolha o formato',
    body: 'Selecione VSL ou E-mail. Cada formato já aplica a largura e a base visual corretas.',
    action: 'continue-create',
    readySelector: '.tour-page-name'
  },
  {
    route: '/dashboard',
    selector: '.tour-create-details',
    actionSelector: '.tour-create-submit',
    placement: 'right',
    title: 'Defina como começar',
    body: 'Dê um nome à página, confirme a pasta e escolha entre canvas vazio ou template. Ao criar, você irá direto ao builder.',
    action: 'create-page',
    readyRoute: '/builder',
    readySelector: '.tour-object-heading'
  },
  {
    route: '/builder',
    selector: '.tour-object-heading',
    actionSelector: '.tour-object-heading',
    placement: 'left',
    title: 'Adicione um objeto',
    body: 'Clique no título para inserir o primeiro elemento no canvas.',
    action: 'add-heading',
    readySelector: '.tour-canvas-element'
  },
  {
    route: '/builder',
    selector: '.tour-sections-tab',
    actionSelector: '.tour-sections-tab',
    placement: 'left',
    title: 'Abra a aba Seções',
    body: 'O objeto já está no canvas. Agora entre em Seções para acessar a estrutura e editar cada bloco.',
    action: 'open-sections',
    readySelector: '.tour-section-item'
  },
  {
    route: '/builder',
    selector: '.tour-section-item',
    actionSelector: '.tour-section-item',
    placement: 'left',
    title: 'Selecione o objeto na estrutura',
    body: 'Clique no item da seção para abrir a edição do objeto escolhido.',
    action: 'open-element-from-sections',
    readySelector: '.tour-element-modal'
  },
  {
    route: '/builder',
    selector: '.tour-element-modal',
    actionSelector: '.tour-element-modal .em-close',
    placement: 'left',
    title: 'Edite as propriedades',
    body: 'Aqui você altera conteúdo, cores, tipografia, alinhamento, margens e dimensões.',
    action: 'close-element',
    readySelector: '.tour-save',
    hiddenSelector: '.tour-element-modal'
  },
  {
    route: '/builder',
    selector: '.tour-save',
    actionSelector: '.tour-save',
    placement: 'bottom',
    title: 'Salve sua página',
    body: 'O salvamento mantém o projeto disponível no dashboard para continuar depois.',
    action: 'open-save',
    readySelector: '.tour-save-modal-submit'
  },
  {
    route: '/builder',
    selector: '.tour-save-modal',
    actionSelector: '.tour-save-modal-submit',
    placement: 'left',
    title: 'Confirme o salvamento',
    body: 'Revise o nome e a pasta. Depois, confirme para registrar a página no navegador.',
    action: 'save-page',
    readySelector: '.tour-history',
    hiddenSelector: '.tour-save-modal'
  },
  {
    route: '/builder',
    selector: '.tour-history',
    actionSelector: '.tour-versions-action',
    placement: 'bottom',
    title: 'Abra o histórico',
    body: 'No menu de ações ficam as versões locais e os backups da página.',
    action: 'open-history',
    readySelector: '.tour-version-modal'
  },
  {
    route: '/builder',
    selector: '.tour-version-modal',
    actionSelector: '.tour-version-modal .icon-btn',
    placement: 'left',
    title: 'Proteja suas alterações',
    body: 'Crie versões antes de mudanças importantes e restaure um ponto anterior quando precisar.',
    action: 'close-history',
    readySelector: '.tour-export',
    hiddenSelector: '.tour-version-modal'
  },
  {
    route: '/builder',
    selector: '.tour-export',
    actionSelector: '.tour-export',
    placement: 'bottom',
    title: 'Publique a página',
    body: 'Publique a página diretamente no servidor. Se a pasta tiver um domínio, ele será usado automaticamente.',
    action: 'open-export',
    readySelector: '.tour-export-modal',
    finishAfterAction: true
  }
];

const state = reactive({
  open: false,
  index: 0,
  runId: 0
});

export function emitProductTour(type, detail = {}) {
  window.dispatchEvent(new CustomEvent(PRODUCT_TOUR_EVENT, {
    detail: { type, ...detail }
  }));
}

export function useProductTour() {
  const currentStep = computed(() => productTourSteps[state.index] || productTourSteps[0]);
  const progress = computed(() => Math.round(((state.index + 1) / productTourSteps.length) * 100));
  const stepLabel = computed(() => `PASSO ${state.index + 1} DE ${productTourSteps.length}`);

  function start(index = 0) {
    const requestedIndex = Number.isInteger(index) ? index : 0;
    state.index = Math.max(0, Math.min(requestedIndex, productTourSteps.length - 1));
    state.runId += 1;
    state.open = true;
    localStorage.setItem('vbs_tour_seen', 'true');
  }

  function close() {
    state.open = false;
    localStorage.setItem('vbs_tour_seen', 'true');
  }

  function goTo(index) {
    state.index = Math.max(0, Math.min(index, productTourSteps.length - 1));
  }

  function next() {
    if (state.index < productTourSteps.length - 1) state.index += 1;
    else close();
  }

  function previous() {
    if (state.index > 0) state.index -= 1;
  }

  return {
    state,
    steps: productTourSteps,
    currentStep,
    progress,
    stepLabel,
    start,
    close,
    goTo,
    next,
    previous
  };
}
