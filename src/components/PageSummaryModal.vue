<template>
  <div v-if="state.isSummaryModalOpen" class="summary-overlay" @click.self="closeSummaryModal">
    <div class="summary-box">
      <div class="summary-header">
        <span><i class="bi bi-clipboard-data-fill"></i> Resumo da Página</span>
        <button class="summary-close" @click="closeSummaryModal"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="summary-body">
        <!-- Page info -->
        <div class="sm-section">
          <div class="sm-h1">{{ state.pageSettings.pageTitle || 'Sem título' }}</div>
          <div class="sm-meta">
            <span><i class="bi bi-palette-fill"></i> BG: <code>{{ state.pageSettings.bgColor }}</code></span>
            <span><i class="bi bi-fonts"></i> Fonte: <code>{{ state.pageSettings.fontFamily }}</code></span>
            <span v-if="state.pageSettings.metaPixel"><i class="bi bi-lightning-charge-fill"></i> Pixel: <code>{{ state.pageSettings.metaPixel }}</code></span>
          </div>
          <div v-if="state.pageSettings.metaDesc" class="sm-desc">{{ state.pageSettings.metaDesc }}</div>
        </div>

        <div class="sm-divider"></div>

        <!-- All elements -->
        <div v-for="(row, ri) in state.rows" :key="row.id">
          <div v-for="col in row.columns" :key="col.id">
            <template v-for="elem in col.elements" :key="elem.id">

              <!-- TOP BANNER -->
              <div v-if="elem.type === 'top-banner'" class="sm-block sm-banner">
                <div class="sm-tag"><i class="bi bi-megaphone-fill"></i> Banner Topo</div>
                <div class="sm-text" v-html="parseSimple(elem.content)"></div>
              </div>

              <!-- HEADING -->
              <div v-else-if="elem.type === 'heading'" class="sm-block sm-heading">
                <div class="sm-tag"><i class="bi bi-type-h1"></i> Headline</div>
                <div class="sm-text sm-big" v-html="parseSimple(elem.content)"></div>
                <div v-if="elem.delayEnabled" class="sm-delay"><i class="bi bi-stopwatch-fill"></i> Delay: {{ pad(elem.delayMinutes) }}:{{ pad(elem.delaySeconds) }}</div>
              </div>

              <!-- PARAGRAPH -->
              <div v-else-if="elem.type === 'paragraph'" class="sm-block sm-paragraph">
                <div class="sm-tag"><i class="bi bi-card-text"></i> Parágrafo</div>
                <div class="sm-text" v-html="parseSimple(elem.content)"></div>
                <div v-if="elem.delayEnabled" class="sm-delay"><i class="bi bi-stopwatch-fill"></i> Delay: {{ pad(elem.delayMinutes) }}:{{ pad(elem.delaySeconds) }}</div>
              </div>

              <!-- BUTTON -->
              <div v-else-if="elem.type === 'button' || elem.type === 'pitch-button'" class="sm-block sm-btn-block">
                <div class="sm-tag"><i class="bi bi-cursor-fill"></i> Botão</div>
                <div class="sm-text" v-html="parseSimple(elem.content)"></div>
                <div v-if="elem.subtext" class="sm-subtext" v-html="parseSimple(elem.subtext)"></div>
                <div class="sm-link"><i class="bi bi-arrow-right"></i> Redirecionamento: <a :href="elem.url" target="_blank" class="sm-url">{{ elem.url || '#' }}</a> <span v-if="elem.openInNewTab" class="sm-badge">Nova aba</span></div>
                <div v-if="elem.delayEnabled" class="sm-delay"><i class="bi bi-stopwatch-fill"></i> Delay: {{ pad(elem.delayMinutes) }}:{{ pad(elem.delaySeconds) }}</div>
              </div>

              <!-- VTURB PLAYER -->
              <div v-else-if="elem.type === 'vturb-player'" class="sm-block sm-vturb">
                <div class="sm-tag"><i class="bi bi-play-btn-fill"></i> Player VTurb (VSL)</div>
                <div v-if="elem.vturbBody" class="sm-code-wrap">
                  <div class="sm-code-label">Link 1 (Player Embed):</div>
                  <div class="sm-code">{{ truncate(elem.vturbBody, 120) }}</div>
                </div>
                <div v-if="elem.vturbHead" class="sm-code-wrap" style="margin-top:4px;">
                  <div class="sm-code-label">Link 2 (Head Preload & Scripts):</div>
                  <div class="sm-code">{{ truncate(elem.vturbHead, 120) }}</div>
                </div>
                <div v-if="!elem.vturbBody && !elem.vturbHead" class="sm-empty">Sem embed configurado</div>
                <div v-if="elem.delayEnabled" class="sm-delay"><i class="bi bi-stopwatch-fill"></i> Delay: {{ pad(elem.delayMinutes) }}:{{ pad(elem.delaySeconds) }}</div>
              </div>

              <!-- LIVE VIEWERS -->
              <div v-else-if="elem.type === 'live-viewers'" class="sm-block sm-viewers">
                <div class="sm-tag"><i class="bi bi-eye-fill"></i> Espectadores Ao Vivo</div>
                <div class="sm-text">{{ elem.minViewers }}–{{ elem.maxViewers }} pessoas · <em v-html="parseSimple(elem.content)"></em></div>
              </div>

              <!-- META PIXEL -->
              <div v-else-if="elem.type === 'meta-pixel'" class="sm-block sm-pixel">
                <div class="sm-tag"><i class="bi bi-lightning-charge-fill"></i> Meta Pixel</div>
                <div class="sm-text">ID: <code>{{ elem.pixelId || '—' }}</code> · Evento: <code>{{ elem.pixelEvent || 'PageView' }}</code></div>
              </div>

            </template>
          </div>
          <div class="sm-section-divider" v-if="ri < state.rows.length - 1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuilderStore } from '../composables/useBuilderStore';

const { state, closeSummaryModal } = useBuilderStore();

function pad(n) {
  return String(n || 0).padStart(2, '0');
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

function parseSimple(text) {
  if (!text) return '';
  return text
    .replace(/>>(.+?)<<\/g/g, '<span style="color:#f1c232">$1</span>')
    .replace(/>>(.+?)<</g, '<span style="color:#f1c232">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}
</script>

<style scoped>
.summary-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
  z-index: 999998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.summary-box {
  width: min(820px, 96vw);
  max-height: 88vh;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(14,116,144,0.22);
  animation: smPop 0.2s cubic-bezier(0.16,1,0.3,1);
}

@keyframes smPop {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text);
}

.summary-close {
  background: transparent;
  border: none;
  color: var(--color-primary-strong);
  font-size: 17px;
  cursor: pointer;
}
.summary-close:hover { color: var(--color-primary-hover); }

.summary-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Page meta */
.sm-section { margin-bottom: 4px; }
.sm-h1 { font-size: 22px; font-weight: 900; color: var(--color-text); margin-bottom: 8px; }
.sm-meta { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: var(--color-primary-deep); margin-bottom: 6px; }
.sm-meta code { color: var(--color-primary-hover); background: var(--color-primary-soft); padding: 1px 6px; border-radius: 4px; }
.sm-desc { font-size: 13px; color: var(--color-primary-deep); font-style: italic; }
.sm-divider { height: 1px; background: var(--color-border); margin: 8px 0; }
.sm-section-divider { height: 1px; background: var(--color-primary-soft); margin: 4px 0; border-style: dashed; border-color: var(--color-border); }

/* Blocks */
.sm-block {
  border-radius: 10px;
  padding: 12px 16px;
  border-left: 3px solid transparent;
  margin-bottom: 4px;
}
.sm-banner   { background: rgba(220,38,38,0.1); border-color: #dc2626; }
.sm-heading  { background: var(--color-primary-soft); border-color: var(--color-primary); }
.sm-paragraph{ background: var(--color-surface-soft); border-color: var(--color-border); }
.sm-btn-block{ background: var(--color-primary-soft); border-color: var(--color-primary-bright); }
.sm-vturb    { background: rgba(200,160,69,0.08); border-color: #c8a045; }
.sm-pitch    { background: rgba(16,185,129,0.08); border-color: #10b981; }
.sm-viewers  { background: var(--color-surface-soft); border-color: var(--color-primary-bright); }
.sm-pixel    { background: var(--color-primary-soft); border-color: var(--color-primary); }

.sm-tag {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--color-primary-deep);
  margin-bottom: 6px;
}
.sm-text { font-size: 14px; color: var(--color-text); line-height: 1.5; margin-bottom: 4px; }
.sm-big  { font-size: 17px; font-weight: 700; }
.sm-green { color: #34d399; }
.sm-subtext { font-size: 12px; color: var(--color-primary-deep); margin-bottom: 4px; }
.sm-link { font-size: 12px; color: var(--color-primary-deep); margin-top: 4px; }
.sm-url  { color: var(--color-primary-hover); text-decoration: underline; word-break: break-all; }
.sm-badge { background: rgba(16,185,129,0.2); color: #34d399; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 10px; margin-left: 4px; }
.sm-delay { font-size: 11px; color: #f59e0b; margin-top: 4px; }
.sm-empty { font-size: 12px; color: var(--color-primary-deep); font-style: italic; }
.sm-code-wrap { margin-top: 6px; }
.sm-code-label { font-size: 10px; color: var(--color-primary-deep); margin-bottom: 3px; }
.sm-code { font-size: 11px; color: var(--color-primary-strong); font-family: var(--font-mono); background: var(--color-primary-subtle); padding: 6px 8px; border-radius: 6px; word-break: break-all; }
</style>
