<template>
  <Teleport to="body">
    <div
      v-if="state.open"
      class="product-tour"
      :data-tour-step="state.index + 1"
      aria-live="polite"
    >
      <div v-if="targetRect" class="tour-highlight" :style="highlightStyle"></div>

      <section class="tour-card" :style="cardStyle" role="dialog" aria-modal="false" aria-label="Tour guiado">
        <div class="tour-card-head">
          <span>{{ stepLabel }}</span>
          <button class="tour-close" type="button" aria-label="Fechar tour" @click="finishTour(true)">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="tour-progress" aria-hidden="true">
          <i :style="{ width: `${progress}%` }"></i>
        </div>

        <h2>{{ currentStep.title }}</h2>
        <p>{{ currentStep.body }}</p>
        <p v-if="statusMessage" class="tour-status" role="status">{{ statusMessage }}</p>

        <div class="tour-actions">
          <button type="button" class="tour-skip" :disabled="isTransitioning" @click="finishTour(true)">Pular tour</button>
          <div class="tour-nav">
            <button
              type="button"
              class="tour-back"
              :disabled="state.index === 0 || isTransitioning"
              @click="handlePrevious"
            >
              Voltar
            </button>
            <button type="button" class="tour-next" :disabled="isTransitioning" @click="handleNext">
              <span>{{ isTransitioning ? 'Aguarde...' : (state.index === steps.length - 1 ? 'Concluir' : 'Próximo') }}</span>
              <i v-if="!isTransitioning" class="bi bi-arrow-right"></i>
              <i v-else class="bi bi-arrow-repeat tour-spinner"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { emitProductTour, useProductTour } from '../composables/useProductTour';

const router = useRouter();
const route = useRoute();
const { state, steps, currentStep, progress, stepLabel, close, goTo } = useProductTour();

const targetRect = ref(null);
const isTransitioning = ref(false);
const statusMessage = ref('');
let locateTimer = null;
let mutationObserver = null;

const highlightStyle = computed(() => {
  if (!targetRect.value) return {};
  const gap = 7;
  const rect = targetRect.value;
  return {
    left: `${Math.max(8, rect.left - gap)}px`,
    top: `${Math.max(8, rect.top - gap)}px`,
    width: `${Math.max(22, rect.width + gap * 2)}px`,
    height: `${Math.max(22, rect.height + gap * 2)}px`
  };
});

const cardStyle = computed(() => {
  const width = Math.min(350, Math.max(280, window.innerWidth - 28));
  const height = 260;
  const rect = targetRect.value;

  if (!rect) {
    return {
      left: '50%',
      top: '50%',
      width: `${width}px`,
      transform: 'translate(-50%, -50%)'
    };
  }

  const gap = 18;
  let left = rect.left;
  let top = rect.bottom + gap;
  const placement = currentStep.value.placement;

  if (placement === 'left') {
    left = rect.left - width - gap;
    top = rect.top;
  } else if (placement === 'right') {
    left = rect.right + gap;
    top = rect.top;
  } else if (placement === 'top') {
    left = rect.left;
    top = rect.top - height - gap;
  }

  if (placement === 'bottom' && top + height > window.innerHeight - 14) {
    top = rect.top - height - gap;
  }
  if (placement === 'right' && left + width > window.innerWidth - 14) {
    left = rect.left - width - gap;
  }
  if (placement === 'left' && left < 14) {
    left = rect.right + gap;
  }

  left = Math.max(14, Math.min(left, window.innerWidth - width - 14));
  top = Math.max(14, Math.min(top, window.innerHeight - height - 14));

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    transform: 'none'
  };
});

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isVisible(selector) {
  if (!selector) return true;
  const element = document.querySelector(selector);
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
}

async function waitFor(check, timeout = 5000, interval = 60) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    await nextTick();
    if (check()) return true;
    await wait(interval);
  }
  return false;
}

function setTourBodyState(open) {
  document.body.classList.toggle('product-tour-active', open);
}

function click(selector) {
  const element = document.querySelector(selector);
  if (!element || element.disabled) return false;
  element.click();
  return true;
}

function fillPageName() {
  const input = document.querySelector('.tour-page-name');
  if (!input || input.value.trim()) return;
  input.focus();
  input.value = 'Minha primeira página';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function locateTarget() {
  clearTimeout(locateTimer);
  if (!state.open) return false;

  const step = currentStep.value;
  if (step.route && route.path !== step.route) {
    await router.push(step.route);
    await nextTick();
  }

  const found = await waitFor(() => isVisible(step.selector), 4200);
  if (!found || !state.open) {
    targetRect.value = null;
    statusMessage.value = 'Não encontrei esta área. Clique em Próximo para tentar novamente.';
    return false;
  }

  const target = document.querySelector(step.selector);
  target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  await wait(180);
  targetRect.value = target.getBoundingClientRect();
  statusMessage.value = '';
  return true;
}

function outcomeReached(step) {
  if (step.readyRoute && route.path !== step.readyRoute) return false;
  if (step.readySelector && !isVisible(step.readySelector)) return false;
  if (step.hiddenSelector && document.querySelector(step.hiddenSelector)) return false;
  return true;
}

async function completeStep(indexAtStart) {
  const step = steps[indexAtStart];
  const completed = await waitFor(() => outcomeReached(step), step.readyRoute ? 7000 : 5000);

  if (!state.open || state.index !== indexAtStart) return completed;
  if (!completed) {
    statusMessage.value = 'A ação não foi concluída. Verifique a tela e tente novamente.';
    return false;
  }

  if (step.finishAfterAction) {
    finishTour(false);
    return true;
  }

  goTo(indexAtStart + 1);
  await nextTick();
  await locateTarget();
  return true;
}

async function performCurrentAction() {
  const step = currentStep.value;

  if (step.action === 'create-folder') {
    const input = document.querySelector('.tour-folder-name');
    if (input && !input.value.trim()) {
      input.value = 'Meu primeiro projeto';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await nextTick();
    }
    return click('.tour-folder-submit');
  }

  if (step.action === 'create-page') {
    fillPageName();
    await nextTick();
    return click('.tour-create-submit');
  }

  if (step.action === 'open-history') {
    click('.tour-more-menu > .icon-button');
    const menuOpened = await waitFor(() => isVisible('.tour-versions-action'), 1600);
    return menuOpened && click('.tour-versions-action');
  }

  return click(step.actionSelector);
}

async function handleNext() {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  statusMessage.value = '';
  const indexAtStart = state.index;

  try {
    if (outcomeReached(currentStep.value) && state.index < steps.length - 1) {
      goTo(indexAtStart + 1);
      await nextTick();
      await locateTarget();
      return;
    }
    const targetReady = await locateTarget();
    if (!targetReady || state.index !== indexAtStart) return;
    const actionStarted = await performCurrentAction();
    if (!actionStarted) {
      statusMessage.value = 'Não consegui executar esta ação. Tente clicar no elemento destacado.';
      return;
    }
    await completeStep(indexAtStart);
  } finally {
    isTransitioning.value = false;
  }
}

async function preparePreviousStep(targetIndex) {
  if (targetIndex === 0) {
    click('.tour-folder-modal .btn-close');
  } else if (targetIndex === 2) {
    click('.create-modal .btn-close');
  } else if (targetIndex === 3 && isVisible('.tour-page-name')) {
    click('.create-modal .btn-secondary');
  } else if (targetIndex === 4 && isVisible('.tour-create-modal-types')) {
    click('.tour-modal-next');
  } else if (targetIndex === 7 && isVisible('.tour-element-modal')) {
    click('.tour-element-modal .em-close');
  } else if (targetIndex === 8 && !isVisible('.tour-element-modal')) {
    click('.tour-section-item');
  } else if (targetIndex === 10 && !isVisible('.tour-save-modal')) {
    click('.tour-save');
  }
}

async function handlePrevious() {
  if (state.index === 0 || isTransitioning.value) return;
  isTransitioning.value = true;
  statusMessage.value = '';
  const targetIndex = state.index - 1;

  try {
    await preparePreviousStep(targetIndex);
    goTo(targetIndex);
    await nextTick();
    await locateTarget();
  } finally {
    isTransitioning.value = false;
  }
}

async function handlePageClick(event) {
  if (!state.open || isTransitioning.value) return;
  const step = currentStep.value;
  const clickedAction = event.target.closest?.(step.actionSelector);
  if (!clickedAction) return;

  isTransitioning.value = true;
  statusMessage.value = '';
  const indexAtStart = state.index;
  try {
    await completeStep(indexAtStart);
  } finally {
    isTransitioning.value = false;
  }
}

function closeOpenSurfaces() {
  emitProductTour('command', { action: 'cancel-tour' });
  [
    '.tour-folder-modal .btn-close',
    '.create-modal .btn-close',
    '.tour-element-modal .em-close',
    '.tour-save-modal .btn-close',
    '.tour-version-modal .icon-btn',
    '.tour-export-modal .modal-close'
  ].forEach((selector) => click(selector));
}

function finishTour(closeSurfaces = true) {
  clearTimeout(locateTimer);
  if (closeSurfaces) closeOpenSurfaces();
  targetRect.value = null;
  statusMessage.value = '';
  setTourBodyState(false);
  close();
}

function refreshTarget() {
  if (!state.open || isTransitioning.value) return;
  clearTimeout(locateTimer);
  locateTimer = setTimeout(() => locateTarget(), 40);
}

watch(
  () => [state.open, state.index, state.runId, route.fullPath],
  async ([open]) => {
    setTourBodyState(open);
    if (!open) {
      targetRect.value = null;
      return;
    }
    statusMessage.value = '';
    await nextTick();
    refreshTarget();
  },
  { flush: 'post' }
);

onMounted(() => {
  setTourBodyState(state.open);
  document.addEventListener('click', handlePageClick, true);
  window.addEventListener('resize', refreshTarget);
  window.addEventListener('scroll', refreshTarget, true);
  mutationObserver = new MutationObserver(() => refreshTarget());
  mutationObserver.observe(document.body, { childList: true, subtree: true });
  if (state.open) refreshTarget();
});

onUnmounted(() => {
  clearTimeout(locateTimer);
  mutationObserver?.disconnect();
  document.removeEventListener('click', handlePageClick, true);
  window.removeEventListener('resize', refreshTarget);
  window.removeEventListener('scroll', refreshTarget, true);
  setTourBodyState(false);
});
</script>

<style scoped>
.product-tour {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  pointer-events: none;
}

.tour-highlight {
  position: fixed;
  z-index: 1;
  pointer-events: none;
  border: 3px solid var(--color-primary-bright);
  border-radius: 14px;
  background: transparent;
  box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.78), 0 0 0 7px rgba(125, 211, 252, 0.34), 0 12px 36px rgba(3, 105, 161, 0.32);
  transition: left .24s ease, top .24s ease, width .24s ease, height .24s ease;
}

.tour-card {
  position: fixed;
  z-index: 3;
  pointer-events: auto;
  padding: 20px;
  border: 1px solid var(--color-border-strong);
  border-radius: 16px;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: 0 22px 58px rgba(2, 8, 23, 0.34);
  animation: tour-card-in .22s ease both;
  transition: left .22s ease, top .22s ease;
}

.tour-card-head,
.tour-actions,
.tour-nav {
  display: flex;
  align-items: center;
}

.tour-card-head,
.tour-actions {
  justify-content: space-between;
}

.tour-card-head span {
  color: var(--color-primary-hover);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .1em;
}

.tour-close {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: var(--color-primary-subtle);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.tour-progress {
  height: 4px;
  margin: 11px 0 15px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-primary-soft);
}

.tour-progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
  transition: width .25s ease;
}

.tour-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
  line-height: 1.25;
}

.tour-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.tour-card .tour-status {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-size: 11px;
  font-weight: 700;
}

.tour-actions {
  gap: 10px;
  margin-top: 18px;
}

.tour-nav {
  gap: 7px;
}

.tour-skip,
.tour-back,
.tour-next {
  min-height: 36px;
  border-radius: 9px;
  padding: 8px 12px;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.tour-skip,
.tour-back {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
}

.tour-next {
  min-width: 96px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0;
  background: var(--color-primary);
  color: var(--color-surface);
}

.tour-next:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.tour-skip:disabled,
.tour-back:disabled,
.tour-next:disabled {
  opacity: .56;
  cursor: wait;
}

.tour-spinner {
  animation: tour-spin .7s linear infinite;
}

@keyframes tour-card-in {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes tour-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 700px) {
  .tour-card {
    left: 12px !important;
    right: 12px;
    top: auto !important;
    bottom: 12px;
    width: auto !important;
    padding: 17px;
    transform: none !important;
  }

  .tour-actions {
    align-items: flex-end;
  }

  .tour-card p {
    font-size: 12.5px;
  }
}
</style>
