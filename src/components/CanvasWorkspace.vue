<template>
  <!-- ═══ QUIZ MODE: uma etapa por vez ═══ -->
  <main v-if="state.builderMode === 'quiz'" class="sandbox-workspace quiz-workspace">
    <div class="quiz-editor-toolbar">
      <div class="quiz-step-selector">
        <button v-for="(_, index) in state.rows" :key="index" :class="{ active: quizStepIndex === index }" @click="goToQuizStep(index)">{{ index + 1 }}</button>
        <button class="add-step" title="Adicionar etapa" @click="addQuizStep"><i class="bi bi-plus-lg"></i></button>
      </div>
      <div class="quiz-test-controls">
        <button :class="{ active: quizTestMode }" @click="toggleQuizTest"><i :class="quizTestMode ? 'bi bi-pencil' : 'bi bi-play-fill'"></i> {{ quizTestMode ? 'Voltar à edição' : 'Testar quiz' }}</button>
      </div>
    </div>

    <div v-if="state.rows.length" class="quiz-phone-frame" :style="{ fontFamily: `'${state.pageSettings.fontFamily || 'Plus Jakarta Sans'}', sans-serif` }">
      <div class="quiz-auto-progress" :style="{ height:`${state.pageSettings.quizProgressHeight || 6}px` }"><span :style="{ width:`${quizProgress}%`, backgroundColor:state.pageSettings.quizProgressColor || '#612bf4' }"></span></div>
      <div class="quiz-step-counter">Etapa {{ quizStepIndex + 1 }} de {{ state.rows.length }}</div>
      <div :key="currentQuizRow.id" class="quiz-stage">
        <template v-for="col in currentQuizRow.columns" :key="col.id">
          <div v-for="elem in col.elements" :key="elem.id" class="canvas-element quiz-canvas-element tour-canvas-element" :class="{ interactive:quizTestMode }" @click.stop.prevent="handleQuizElementClick(elem)">
            <HeadingElement v-if="elem.type === 'heading' || elem.type === 'quiz-question'" :element="elem" />
            <ParagraphElement v-else-if="elem.type === 'paragraph'" :element="elem" />
            <ButtonElement v-else-if="elem.type === 'button' || elem.type === 'quiz-next'" :element="quizButton(elem)" />
            <LibraryElement v-else-if="libraryElementTypes.includes(elem.type)" :element="elem" />
            <QuizElement v-else-if="quizElementTypes.includes(elem.type) && elem.type !== 'quiz-progress'" :element="elem" @answered="markQuizAnswered" />
          </div>
        </template>
      </div>
      <div class="quiz-test-navigation">
        <button :disabled="quizStepIndex === 0" @click="previousQuizStep"><i class="bi bi-arrow-left"></i> Etapa anterior</button>
        <span>{{ quizProgress }}%</span>
        <button v-if="!quizTestMode" :disabled="quizStepIndex >= state.rows.length - 1" @click="nextQuizStep">Próxima etapa <i class="bi bi-arrow-right"></i></button>
      </div>
    </div>
    <div v-else class="quiz-empty">
      <div class="quiz-empty-card">
        <span class="quiz-empty-icon"><i class="bi bi-plus-circle"></i></span>
        <h3>Crie a primeira etapa</h3>
        <p>Ela já virá com pergunta, alternativas e botão para avançar.</p>
        <button @click="addQuizStep"><i class="bi bi-plus-lg"></i> Criar primeira etapa</button>
      </div>
    </div>
  </main>

  <!-- ═══ FUNIL MODE ═══ -->
  <main
    v-else-if="state.builderMode !== 'email'"
    :key="'funnel-' + state.renderKey"
    class="sandbox-workspace funnel-workspace"
    :class="{ 'quiz-workspace': state.builderMode === 'quiz' }"
    :style="{ backgroundColor: state.pageSettings.bgColor || '#191919' }"
  >
    <div
      class="sandbox-canvas"
      :style="{
        maxWidth: state.viewportMode,
        backgroundColor: state.pageSettings.bgColor || '#191919',
        fontFamily: `'${state.pageSettings.fontFamily || 'Roboto'}', -apple-system, BlinkMacSystemFont, sans-serif`
      }"
    >
      <div v-if="state.rows.length === 0" class="sandbox-placeholder">
        <div class="placeholder-icon"><i class="bi bi-plus-circle-dotted"></i></div>
        <div class="placeholder-title">Canvas Vazio</div>
        <p>Adicione elementos pelo painel lateral direito para começar.</p>
      </div>

      <div
        v-for="row in state.rows.filter(row => row.columns.some(col => col.elements.some(elem => elem.type !== 'smart-popup')))"
        :key="row.id"
        class="builder-row"
        :class="{ 'has-top-banner': row.columns.some(c => c.elements.some(e => e.type === 'top-banner')), 'quiz-step-row': state.builderMode === 'quiz' }"
        :style="{ marginBottom: row.columns.some(c => c.elements.some(e => e.type === 'top-banner')) ? '0px !important' : ((state.pageSettings?.sectionGap !== undefined ? state.pageSettings.sectionGap : 0) + 'px !important') }"
      >
        <div
          v-for="col in row.columns"
          :key="col.id"
          class="builder-col"
          :style="{ flex: col.flex || 1 }"
        >
          <div
            v-for="elem in col.elements.filter(elem => elem.type !== 'smart-popup')"
            :key="elem.id"
            class="canvas-element tour-canvas-element"
            :class="{ 'is-top-banner': elem.type === 'top-banner' }"
            @click.stop="openModalForElement(elem)"
          >
            <SmartPopupElement v-if="elem.type === 'smart-popup'" :element="elem" mode="canvas" />
            <TopBannerElement v-else-if="elem.type === 'top-banner'" :element="elem" />
            <HeadingElement v-else-if="elem.type === 'heading'" :element="elem" />
            <ParagraphElement v-else-if="elem.type === 'paragraph'" :element="elem" />
            <ButtonElement v-else-if="elem.type === 'button'" :element="elem" />
            <VturbPlayerElement v-else-if="elem.type === 'vturb-player'" :element="elem" />
            <PitchButtonElement v-else-if="elem.type === 'pitch-button'" :element="elem" />
            <LiveViewersElement v-else-if="elem.type === 'live-viewers'" :element="elem" />
            <LibraryElement v-else-if="libraryElementTypes.includes(elem.type)" :element="elem" />
            <QuizElement v-else-if="quizElementTypes.includes(elem.type)" :element="elem" />

            <!-- Email Header -->
            <div
              v-else-if="elem.type === 'email-header'"
              class="email-header-block"
              :style="{
                background: elem.style?.bgColor || '#27272a',
                padding: `${getNum(elem.style?.paddingVertical, 26)}px ${getNum(elem.style?.paddingHorizontal, 44)}px`,
                marginTop: `${getNum(elem.style?.marginTop, 0)}px`,
                marginBottom: `${getNum(elem.style?.marginBottom, 24)}px`,
                borderRadius: '8px'
              }"
            >
              <img
                v-if="elem.logoType === 'image' && elem.logoImageUrl"
                :src="elem.logoImageUrl"
                alt="Logo"
                style="max-height: 40px; max-width: 150px; display: block; object-fit: contain;"
              />
              <div
                v-else
                class="email-logo-text"
                :style="{ color: elem.style?.logoColor || '#ffffff', fontSize: elem.style?.fontSize || '20px', fontWeight: elem.style?.fontWeight || '700' }"
              >
                {{ elem.logoText || 'Rappu' }}
              </div>
            </div>

            <!-- Email Footer -->
            <div
              v-else-if="elem.type === 'email-footer'"
              class="email-footer-block"
              :style="{
                background: elem.style?.bgColor || '#27272a',
                padding: `${getNum(elem.style?.paddingVertical, 24)}px ${getNum(elem.style?.paddingHorizontal, 44)}px`,
                textAlign: elem.style?.align || 'center',
                marginTop: `${getNum(elem.style?.marginTop, 24)}px`,
                marginBottom: `${getNum(elem.style?.marginBottom, 0)}px`,
                borderRadius: '8px'
              }"
            >
              <img
                v-if="elem.logoType === 'image' && elem.logoImageUrl"
                :src="elem.logoImageUrl"
                alt="Logo"
                style="max-height: 36px; max-width: 120px; display: block; object-fit: contain; margin: 0 auto 8px;"
              />
              <div
                v-else
                class="email-logo-text"
                :style="{ color: elem.style?.logoColor || '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }"
              >
                {{ elem.logoText || 'Rappu' }}
              </div>
              <p :style="{ color: elem.style?.textColor || '#a1a1aa', fontSize: elem.style?.fontSize || '12px', margin: 0 }">
                {{ elem.copyrightText || '© 2026 Rappu. Todos os direitos reservados.' }}
              </p>
            </div>

            <!-- Email Tag -->
            <div
              v-else-if="elem.type === 'email-tag'"
              :style="{ textAlign: elem.style?.align || 'left' }"
            >
              <div
                :style="{
                  display: 'inline-block',
                  background: elem.style?.bgColor || '#f4f4f5',
                  color: elem.style?.textColor || '#27272a',
                  fontSize: elem.style?.fontSize || '11px',
                  fontWeight: elem.style?.fontWeight || '500',
                  padding: `${getNum(elem.style?.paddingVertical, 5)}px ${getNum(elem.style?.paddingHorizontal, 12)}px`,
                  borderRadius: `${getNum(elem.style?.borderRadius, 999)}px`,
                  border: '1px solid #e4e4e7',
                  letterSpacing: '0.6px',
                  marginTop: `${getNum(elem.style?.marginTop, 0)}px`,
                  marginBottom: `${getNum(elem.style?.marginBottom, 12)}px`
                }"
              >
                {{ elem.content || 'ARTES PRONTAS' }}
              </div>
            </div>

            <div v-else class="generic-element">{{ elem.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- ═══ EMAIL MODE ═══ -->
  <main
    v-else
    :key="'email-' + state.renderKey"
    class="sandbox-workspace email-workspace"
  >
    <!-- Dotted background wrapper -->
    <div class="email-outer-bg" :style="{ backgroundColor: state.pageSettings.bgColor || '#f8f7fc' }">
      <div class="email-canvas-label">
        <i class="bi bi-envelope-paper-fill"></i>
        Modo E-mail — {{ EMAIL_MAX_WIDTH }}px fixo &nbsp;·&nbsp; Use a aba "Seções" no painel à direita para editar os objetos
      </div>

      <!-- The email card container (simulates inbox view matching 01-artes-prontas.html) -->
      <div
        class="email-card"
        :style="{
          maxWidth: EMAIL_MAX_WIDTH + 'px',
          fontFamily: `'${state.pageSettings.fontFamily || 'Poppins'}', -apple-system, sans-serif`
        }"
      >
        <div v-if="state.rows.length === 0" class="email-empty-state">
          <i class="bi bi-envelope-plus"></i>
          <p>E-mail vazio. Adicione blocos pelo painel lateral direito.</p>
        </div>

        <div
          v-for="row in state.rows"
          :key="row.id"
          class="email-row"
        >
          <div
            v-for="col in row.columns"
            :key="col.id"
            class="email-col"
            :style="{ flex: col.flex || 1 }"
          >
            <div
              v-for="elem in col.elements"
              :key="elem.id"
                class="email-element tour-canvas-element"
                @click.stop="openModalForElement(elem)"
            >
              <!-- Email Header -->
              <div
                v-if="elem.type === 'email-header'"
                class="email-header-block"
                :style="{
                  background: elem.style?.bgColor || '#27272a',
                  padding: `${getNum(elem.style?.paddingVertical, 26)}px ${getNum(elem.style?.paddingHorizontal, 44)}px`,
                  marginTop: `${getNum(elem.style?.marginTop, 0)}px`,
                  marginBottom: `${getNum(elem.style?.marginBottom, 24)}px`
                }"
              >
                <img
                  v-if="elem.logoType === 'image' && elem.logoImageUrl"
                  :src="elem.logoImageUrl"
                  alt="Logo"
                  style="max-height: 40px; max-width: 150px; display: block; object-fit: contain;"
                />
                <div
                  v-else
                  class="email-logo-text"
                  :style="{ color: elem.style?.logoColor || '#ffffff', fontSize: elem.style?.fontSize || '20px', fontWeight: elem.style?.fontWeight || '700' }"
                >
                  {{ elem.logoText || 'Rappu' }}
                </div>
              </div>

              <!-- Email Footer -->
              <div
                v-else-if="elem.type === 'email-footer'"
                class="email-footer-block"
                :style="{
                  background: elem.style?.bgColor || '#27272a',
                  padding: `${getNum(elem.style?.paddingVertical, 24)}px ${getNum(elem.style?.paddingHorizontal, 44)}px`,
                  textAlign: elem.style?.align || 'center',
                  marginTop: `${getNum(elem.style?.marginTop, 24)}px`,
                  marginBottom: `${getNum(elem.style?.marginBottom, 0)}px`
                }"
              >
                <img
                  v-if="elem.logoType === 'image' && elem.logoImageUrl"
                  :src="elem.logoImageUrl"
                  alt="Logo"
                  style="max-height: 36px; max-width: 120px; display: block; object-fit: contain; margin: 0 auto 8px;"
                />
                <div
                  v-else
                  class="email-logo-text"
                  :style="{ color: elem.style?.logoColor || '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }"
                >
                  {{ elem.logoText || 'Rappu' }}
                </div>
                <p :style="{ color: elem.style?.textColor || '#a1a1aa', fontSize: elem.style?.fontSize || '12px', margin: 0 }">
                  {{ elem.copyrightText || '© 2026 Rappu. Todos os direitos reservados.' }}
                </p>
              </div>

              <!-- Email Tag/Label -->
              <div
                v-else-if="elem.type === 'email-tag'"
                class="email-body-pad"
              >
                <div
                  :style="{
                    display: 'inline-block',
                    background: elem.style?.bgColor || '#f4f4f5',
                    color: elem.style?.textColor || '#27272a',
                    fontSize: elem.style?.fontSize || '11px',
                    fontWeight: elem.style?.fontWeight || '500',
                    padding: `${getNum(elem.style?.paddingVertical, 5)}px ${getNum(elem.style?.paddingHorizontal, 12)}px`,
                    borderRadius: `${getNum(elem.style?.borderRadius, 999)}px`,
                    border: '1px solid #e4e4e7',
                    letterSpacing: '0.6px',
                    marginTop: `${getNum(elem.style?.marginTop, 0)}px`,
                    marginBottom: `${getNum(elem.style?.marginBottom, 12)}px`
                  }"
                >
                  {{ elem.content || 'ARTES PRONTAS' }}
                </div>
              </div>

              <!-- Heading inside email -->
              <div v-else-if="elem.type === 'heading'" class="email-body-pad">
                <HeadingElement :element="elem" />
              </div>

              <!-- Paragraph inside email -->
              <div v-else-if="elem.type === 'paragraph'" class="email-body-pad">
                <ParagraphElement :element="elem" />
              </div>

              <!-- Button inside email -->
              <div v-else-if="elem.type === 'button'" class="email-body-pad">
                <ButtonElement :element="elem" />
              </div>

              <!-- Generic fallback -->
              <div v-else class="email-body-pad" style="padding: 12px 44px; color: #333;">
                {{ elem.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';
import { getNum } from '../utils/astrotags';
import TopBannerElement from './elements/TopBannerElement.vue';
import SmartPopupElement from './elements/SmartPopupElement.vue';
import HeadingElement from './elements/HeadingElement.vue';
import ParagraphElement from './elements/ParagraphElement.vue';
import ButtonElement from './elements/ButtonElement.vue';
import VturbPlayerElement from './elements/VturbPlayerElement.vue';
import PitchButtonElement from './elements/PitchButtonElement.vue';
import LiveViewersElement from './elements/LiveViewersElement.vue';
import LibraryElement from './elements/LibraryElement.vue';
import QuizElement from './elements/QuizElement.vue';

const EMAIL_MAX_WIDTH = 600;
const libraryElementTypes = ['image', 'divider', 'testimonial', 'faq', 'countdown', 'form'];
const quizElementTypes = ['quiz-progress', 'quiz-single', 'quiz-multiple', 'quiz-yes-no', 'quiz-loading', 'quiz-metric', 'quiz-price', 'quiz-spacer'];

const { state, openModalForElement, addRow, addElementToColumn, showToast } = useBuilderStore();
const quizStepIndex = computed({ get: () => state.activeQuizStepIndex, set: value => { state.activeQuizStepIndex = value; } });
const quizTestMode = ref(false);
const quizAnswered = ref({});
const currentQuizRow = computed(() => state.rows[quizStepIndex.value] || { columns: [] });
const quizProgress = computed(() => state.rows.length ? Math.round(((quizStepIndex.value + 1) / state.rows.length) * 100) : 0);

function goToQuizStep(index) { quizStepIndex.value = Math.max(0, Math.min(index, state.rows.length - 1)); }
function addQuizStep() { const row=addRow('1-col'); addElementToColumn(row.columns[0].id,'quiz-question'); addElementToColumn(row.columns[0].id,'quiz-single'); addElementToColumn(row.columns[0].id,'quiz-next'); quizStepIndex.value=state.rows.length-1; }
function toggleQuizTest() { quizTestMode.value=!quizTestMode.value; quizStepIndex.value=0; quizAnswered.value={}; }
function markQuizAnswered(selected) { quizAnswered.value={...quizAnswered.value,[quizStepIndex.value]:Array.isArray(selected) && selected.length>0}; }
function previousQuizStep() { goToQuizStep(quizStepIndex.value-1); }
function nextQuizStep() { goToQuizStep(quizStepIndex.value+1); }
function handleQuizElementClick(elem) { if(!quizTestMode.value){openModalForElement(elem);return;} if(elem.type==='quiz-next'||elem.type==='button'){const needsAnswer=currentQuizRow.value.columns.some(col=>col.elements.some(item=>['quiz-single','quiz-multiple','quiz-yes-no'].includes(item.type)));if(needsAnswer&&!quizAnswered.value[quizStepIndex.value]){showToast('Selecione uma resposta antes de avançar.','warning');return;} if(quizStepIndex.value<state.rows.length-1)goToQuizStep(quizStepIndex.value+1);else showToast('Quiz concluído!','success');} }
function quizButton(elem) { return quizTestMode.value ? {...elem,url:'#',openInNewTab:false} : elem; }

watch(
  () => state.pageSettings.pageTitle,
  (newTitle) => { if (newTitle && newTitle.trim()) document.title = newTitle; },
  { immediate: true }
);
watch(() => state.rows.length, length => { if (!length) quizStepIndex.value=0; else if (quizStepIndex.value >= length) quizStepIndex.value=length-1; });

watch(
  () => state.pageSettings.fontFamily,
  (newFont) => {
    if (!newFont) return;
    const fontId = 'dynamic-builder-google-font';
    let link = document.getElementById(fontId);
    if (!link) {
      link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    const fontParam = newFont.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${fontParam}:wght@300;400;500;600;700;800;900&display=swap`;
  },
  { immediate: true }
);
</script>

<style scoped>
/* ─── SHARED ────────────────────────────────────────────────────────────── */
.sandbox-workspace {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.2s ease;
}

/* ─── FUNNEL MODE ────────────────────────────────────────────────────────── */
.funnel-workspace {
  padding: 0;
}

.sandbox-canvas {
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  transition: max-width 0.2s ease;
}

.sandbox-placeholder {
  position: relative !important;
  inset: auto !important;
  transform: none !important;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height));
  padding: 48px 24px;
  box-sizing: border-box;
  color: var(--color-border);
  text-align: center;
  gap: 10px;
}

.placeholder-icon { width:64px; height:64px; display:grid; place-items:center; border-radius:18px; background:var(--color-primary-soft); color:var(--color-primary-hover); font-size:30px; opacity:1; }
.placeholder-title { font-size:20px; font-weight:800; color:var(--color-surface-soft); }
.sandbox-placeholder p { max-width:320px; font-size:14px; line-height:1.5; }

.builder-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 10px auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.builder-row.has-top-banner { max-width: 100%; margin: 0 0 0 0 !important; padding: 0; }
.builder-row.has-top-banner:first-child { margin-top: 0 !important; }
.builder-row.has-top-banner .canvas-element.is-top-banner, .builder-row.has-top-banner .canvas-top-banner { margin-top: 0 !important; margin-bottom: 0 !important; }
.builder-col { display: flex; flex-direction: column; gap: 0px; width: 100%; flex: 1; box-sizing: border-box; }

@media (max-width: 700px) {
  .builder-row { padding: 0 12px; }
  .builder-row.has-top-banner { padding: 0; }
  .builder-col { flex: 0 0 100% !important; }
}

.canvas-element {
  position: relative;
}
.quiz-workspace { padding:16px 12px 50px; background:var(--color-page)!important; min-height:calc(100vh - var(--header-height)); height:auto; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; }
.quiz-editor-toolbar { width:min(100%,680px); display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; padding:8px; border:1px solid var(--color-border); border-radius:12px; background:var(--color-surface); box-shadow:var(--shadow-sm); flex-shrink:0; }
.quiz-step-selector,.quiz-test-controls{display:flex;align-items:center;gap:6px}.quiz-step-selector button{width:31px;height:31px;border:1px solid var(--color-border);border-radius:8px;background:var(--color-surface);color:var(--color-text-secondary);font-weight:800;cursor:pointer;transition:transform .18s ease,background-color .18s ease,border-color .18s ease}.quiz-step-selector button:hover{transform:translateY(-1px);border-color:var(--color-primary-border)}.quiz-step-selector button.active{background:var(--color-primary);border-color:var(--color-primary);color:white}.quiz-test-controls>button{height:32px;border:1px solid var(--color-primary-border);border-radius:8px;padding:0 10px;background:var(--color-primary-soft);color:var(--color-primary-strong);font:inherit;font-size:10px;font-weight:900;cursor:pointer;transition:transform .18s ease,background-color .18s ease}.quiz-test-controls>button:hover{transform:translateY(-1px)}.quiz-test-controls>button.active{background:var(--color-primary);color:white}
.quiz-phone-frame{width:min(100%,460px);min-height:590px;height:fit-content;max-height:none;flex-shrink:0;box-sizing:border-box;display:flex;flex-direction:column;padding:17px 18px 26px;border:7px solid var(--color-text);border-radius:34px;background:var(--color-surface);box-shadow:var(--shadow-main);overflow:visible}.quiz-auto-progress{width:100%;border-radius:999px;background:var(--color-primary-soft);overflow:hidden;flex-shrink:0}.quiz-auto-progress span{display:block;height:100%;border-radius:inherit;transition:width .48s cubic-bezier(.22,1,.36,1),background-color .25s ease}.quiz-step-counter{text-align:right;margin-top:7px;color:var(--color-text-soft);font-size:9px;font-weight:800;text-transform:uppercase;flex-shrink:0}.quiz-stage{display:flex;flex-direction:column;gap:13px;padding-top:16px;flex:1 0 auto;min-height:fit-content;height:fit-content;width:100%;box-sizing:border-box;animation:quizStageIn .3s cubic-bezier(.22,1,.36,1) both}.quiz-canvas-element{border:1px dashed transparent;border-radius:10px;transition:.18s ease;width:100%;height:fit-content;min-height:fit-content;box-sizing:border-box}.quiz-canvas-element:not(.interactive):hover{border-color:var(--color-primary-border);background:var(--color-primary-subtle)}.quiz-canvas-element.interactive{cursor:default}.quiz-test-navigation{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;margin-top:16px;padding-top:12px;border-top:1px solid var(--color-border);flex-shrink:0;width:100%;box-sizing:border-box}.quiz-test-navigation button{min-height:32px;display:inline-flex;align-items:center;gap:5px;border:1px solid var(--color-border);border-radius:8px;padding:0 9px;background:var(--color-surface);color:var(--color-primary-strong);font:inherit;font-size:10px;font-weight:800;cursor:pointer}.quiz-test-navigation button:last-child{justify-self:end}.quiz-test-navigation button:hover:not(:disabled){background:var(--color-primary-soft);border-color:var(--color-primary-border)}.quiz-test-navigation button:disabled{opacity:.35;cursor:not-allowed}.quiz-test-navigation span{font-size:10px;color:var(--color-text-muted)}.quiz-empty{width:min(100%,520px);min-height:420px;display:grid;place-items:center;color:var(--color-text-muted)}.quiz-empty-card{width:min(100%,380px);display:flex;flex-direction:column;align-items:center;text-align:center;padding:34px 28px;border:1px solid var(--color-border);border-radius:20px;background:var(--color-surface);box-shadow:var(--shadow-main)}.quiz-empty-icon{width:52px;height:52px;display:grid;place-items:center;margin-bottom:14px;border-radius:14px;background:var(--color-primary-soft);color:var(--color-primary);font-size:25px}.quiz-empty h3{margin:0;color:var(--color-text);font-size:19px}.quiz-empty p{max-width:290px;margin:8px 0 18px;line-height:1.55}.quiz-empty button{display:inline-flex;align-items:center;gap:7px;padding:10px 14px;border:0;border-radius:9px;background:var(--color-primary);color:white;font-weight:800;cursor:pointer}
@keyframes quizStageIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
@media(max-width:620px){.quiz-editor-toolbar{align-items:flex-start;flex-direction:column}.quiz-test-controls{width:100%;justify-content:flex-end}.quiz-phone-frame{min-height:520px;height:fit-content;border-width:5px;border-radius:27px}}

/* ─── EMAIL MODE ─────────────────────────────────────────────────────────── */
.email-workspace {
  padding: 0;
}

.email-outer-bg {
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-primary-subtle);
  background-image: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px 60px;
}

.email-canvas-label {
  background: var(--color-primary-hover);
  color: var(--color-surface);
  font-size: 12px;
  font-weight: 700;
  padding: 6px 18px;
  border-radius: 999px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.3px;
}

.email-card {
  width: 100%;
  background: var(--color-surface);
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #d4d4d8;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.email-empty-state {
  padding: 60px 24px;
  text-align: center;
  color: var(--color-text-soft);
}

.email-empty-state i { font-size: 44px; display: block; margin-bottom: 10px; color: var(--color-primary-bright); }

.email-row { display: flex; width: 100%; }
.email-col { display: flex; flex-direction: column; flex: 1; }

.email-element {
  position: relative;
}

.email-header-block {
  width: 100%;
}

.email-footer-block {
  width: 100%;
}

.email-body-pad {
  padding: 0 44px;
  position: relative;
  background: var(--color-surface);
}

.email-logo-text { font-weight: 700; }
</style>
