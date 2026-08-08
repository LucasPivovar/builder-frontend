<template>
  <!-- ═══ FUNIL MODE ═══ -->
  <main
    v-if="state.builderMode !== 'email'"
    class="sandbox-workspace funnel-workspace"
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
        v-for="row in state.rows"
        :key="row.id"
        class="builder-row"
        :class="{ 'has-top-banner': row.columns.some(c => c.elements.some(e => e.type === 'top-banner')) }"
      >
        <div
          v-for="col in row.columns"
          :key="col.id"
          class="builder-col"
          :style="{ flex: col.flex || 1 }"
        >
          <div
            v-for="elem in col.elements"
            :key="elem.id"
            class="canvas-element"
            :class="{ 'is-top-banner': elem.type === 'top-banner' }"
          >
            <TopBannerElement v-if="elem.type === 'top-banner'" :key="elem.id + '-tb'" :element="elem" />
            <HeadingElement v-else-if="elem.type === 'heading'" :key="elem.id + '-hd'" :element="elem" />
            <ParagraphElement v-else-if="elem.type === 'paragraph'" :key="elem.id + '-pr'" :element="elem" />
            <ButtonElement v-else-if="elem.type === 'button'" :key="elem.id + '-bt'" :element="elem" />
            <VturbPlayerElement v-else-if="elem.type === 'vturb-player'" :key="elem.id + '-vt'" :element="elem" />
            <PitchButtonElement v-else-if="elem.type === 'pitch-button'" :key="elem.id + '-pb'" :element="elem" />
            <LiveViewersElement v-else-if="elem.type === 'live-viewers'" :key="elem.id + '-lv'" :element="elem" />
            <div v-else :key="elem.id + '-gen'" class="generic-element">{{ elem.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- ═══ EMAIL MODE ═══ -->
  <main
    v-else
    class="sandbox-workspace email-workspace"
  >
    <!-- Dotted background wrapper -->
    <div class="email-outer-bg">
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
              class="email-element"
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
import { watch } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';
import { getNum } from '../utils/atomitags';
import TopBannerElement from './elements/TopBannerElement.vue';
import HeadingElement from './elements/HeadingElement.vue';
import ParagraphElement from './elements/ParagraphElement.vue';
import ButtonElement from './elements/ButtonElement.vue';
import VturbPlayerElement from './elements/VturbPlayerElement.vue';
import PitchButtonElement from './elements/PitchButtonElement.vue';
import LiveViewersElement from './elements/LiveViewersElement.vue';

const EMAIL_MAX_WIDTH = 600;

const { state } = useBuilderStore();

watch(
  () => state.pageSettings.pageTitle,
  (newTitle) => { if (newTitle && newTitle.trim()) document.title = newTitle; },
  { immediate: true }
);

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #64748b;
  text-align: center;
  gap: 10px;
}

.placeholder-icon { font-size: 52px; opacity: 0.4; }
.placeholder-title { font-size: 20px; font-weight: 700; }

.builder-row {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto clamp(16px, 2.5vh, 28px) auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.builder-row.has-top-banner { max-width: 100%; margin: 0 0 clamp(16px, 2.5vh, 28px) 0; padding: 0; }
.builder-col { display: flex; flex-direction: column; gap: clamp(12px, 2vh, 20px); width: 100%; flex: 1; box-sizing: border-box; }

.canvas-element {
  position: relative;
}

/* ─── EMAIL MODE ─────────────────────────────────────────────────────────── */
.email-workspace {
  padding: 0;
}

.email-outer-bg {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f7;
  background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px 60px;
}

.email-canvas-label {
  background: rgba(0,0,0,0.7);
  color: #fff;
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
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #d4d4d8;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.email-empty-state {
  padding: 60px 24px;
  text-align: center;
  color: #94a3b8;
}

.email-empty-state i { font-size: 44px; display: block; margin-bottom: 10px; color: #38bdf8; }

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
  background: #ffffff;
}

.email-logo-text { font-weight: 700; }
</style>
