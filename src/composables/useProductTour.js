import { computed, reactive } from 'vue';

export const PRODUCT_TOUR_EVENT = 'vbs-product-tour';

export const productTourSteps = [
  {
    route: '/dashboard',
    selector: '.tour-create-folder',
    actionSelector: '.tour-create-folder',
    placement: 'bottom',
    title: 'Organize por projeto',
    body: 'As páginas ficam dentro de pastas. Se você já tiver uma pasta, o tour abre ela automaticamente; se não tiver, crie a primeira agora.',
    action: 'open-folder-create',
    readySelector: '.tour-folder-modal'
  },
  {
    route: '/dashboard',
    selector: '.tour-folder-modal',
    actionSelector: '.tour-folder-submit',
    placement: 'right',
    title: 'Nome e domínio da pasta',
    body: 'Dê um nome ao projeto. O domínio é opcional e pode ser configurado depois, direto na página publicada.',
    action: 'create-folder',
    readySelector: '.tour-create-page',
    hiddenSelector: '.tour-folder-modal'
  },
  {
    route: '/dashboard',
    selector: '.tour-create-page',
    actionSelector: '.tour-create-page',
    placement: 'bottom',
    title: 'Crie a página',
    body: 'Abra o fluxo de criação para escolher o formato e enviar a página ao builder.',
    action: 'open-create',
    readySelector: '.tour-create-modal-types'
  },
  {
    route: '/dashboard',
    selector: '.tour-create-modal-types',
    actionSelector: '.tour-modal-next',
    placement: 'right',
    title: 'Escolha o formato',
    body: 'Selecione VSL, e-mail ou quiz. Cada formato ajusta automaticamente a base visual do editor.',
    action: 'continue-create',
    readySelector: '.tour-page-name'
  },
  {
    route: '/dashboard',
    selector: '.tour-create-details',
    actionSelector: '.tour-create-submit',
    placement: 'right',
    title: 'Defina o ponto de partida',
    body: 'Informe o nome, confirme a pasta e escolha canvas vazio ou template. Ao criar, você vai direto ao builder.',
    action: 'create-page',
    readyRoute: '/builder',
    readySelector: '.tour-object-heading'
  },
  {
    route: '/builder',
    selector: '.tour-object-heading',
    actionSelector: '.tour-object-heading',
    placement: 'left',
    title: 'Adicione um elemento',
    body: 'Clique em um elemento da biblioteca para inserir no canvas.',
    action: 'add-heading',
    readySelector: '.tour-canvas-element'
  },
  {
    route: '/builder',
    selector: '.tour-sections-tab',
    actionSelector: '.tour-sections-tab',
    placement: 'left',
    title: 'Veja a estrutura',
    body: 'A aba Seções mostra tudo o que existe na página e facilita encontrar cada elemento.',
    action: 'open-sections',
    readySelector: '.tour-section-item'
  },
  {
    route: '/builder',
    selector: '.tour-section-item',
    actionSelector: '.tour-section-item',
    placement: 'left',
    title: 'Abra a edição',
    body: 'Clique no item da estrutura para editar conteúdo, estilo, espaçamento e comportamento.',
    action: 'open-element-from-sections',
    readySelector: '.tour-element-modal'
  },
  {
    route: '/builder',
    selector: '.tour-element-modal',
    actionSelector: '.tour-element-modal .em-close',
    placement: 'left',
    title: 'Ajuste o elemento',
    body: 'Aqui ficam textos, cores, tipografia, alinhamento, margens, dimensões e configurações específicas.',
    action: 'close-element',
    readySelector: '.tour-save',
    hiddenSelector: '.tour-element-modal'
  },
  {
    route: '/builder',
    selector: '.tour-save',
    actionSelector: '.tour-save',
    placement: 'bottom',
    title: 'Salve a página',
    body: 'Salve para manter a página disponível no dashboard e continuar editando depois.',
    action: 'open-save',
    readySelector: '.tour-save-modal-submit'
  },
  {
    route: '/builder',
    selector: '.tour-save-modal',
    actionSelector: '.tour-save-modal-submit',
    placement: 'left',
    title: 'Confirme os dados',
    body: 'Revise nome, pasta e slug. Depois confirme para registrar a página.',
    action: 'save-page',
    readySelector: '.tour-export',
    hiddenSelector: '.tour-save-modal'
  },
  {
    route: '/builder',
    selector: '.tour-export',
    actionSelector: '.tour-export',
    placement: 'bottom',
    title: 'Publique a página',
    body: 'Publique no servidor. Depois você pode configurar domínio próprio e a plataforma prepara DNS, Nginx e SSL automaticamente.',
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
