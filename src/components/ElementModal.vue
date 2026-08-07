<template>
  <div v-if="state.isElementModalOpen && elem" class="element-modal-overlay">
    <div class="element-modal-box">

      <!-- HEADER -->
      <div class="em-header">
        <div class="em-header-left">
          <span class="em-title">
            <template v-if="elem.isGlobalSettings">⚙️ Configurações Gerais</template>
            <template v-else>Editando: <strong>{{ getTypeTitle(elem) }}</strong></template>
          </span>
          <span class="em-badge">Desktop</span>
        </div>
        <button class="em-close" @click="saveAndClose">✕</button>
      </div>
      <div class="em-subinfo">
        <span v-if="!elem.isGlobalSettings">Classe: {{ elem.type }}-element &nbsp;·&nbsp; ID: division-{{ elem.id }}</span>
        <span v-else>Configurações globais da página</span>
      </div>

      <!-- BODY -->
      <div class="em-scroll-body">

        <!-- ========== GLOBAL SETTINGS ========== -->
        <template v-if="elem.isGlobalSettings">
          <div class="em-preview-top global-page-mini-preview">
            <div
              class="mini-site-scaler"
              :style="{ backgroundColor: state.pageSettings.bgColor || '#191919', fontFamily: state.pageSettings.fontFamily || 'Roboto' }"
            >
              <div
                v-for="row in state.rows"
                :key="row.id"
                class="mini-builder-row"
                :style="{ marginBottom: (state.pageSettings.sectionGap !== undefined ? state.pageSettings.sectionGap : 16) + 'px' }"
              >
                <div v-for="col in row.columns" :key="col.id" class="mini-builder-col" :style="{ flex: col.flex || 1 }">
                  <div v-for="e in col.elements" :key="e.id" class="mini-canvas-elem">
                    <TopBannerElement v-if="e.type === 'top-banner'" :element="e" />
                    <HeadingElement v-else-if="e.type === 'heading'" :element="e" />
                    <ParagraphElement v-else-if="e.type === 'paragraph'" :element="e" />
                    <ButtonElement v-else-if="e.type === 'button'" :element="e" />
                    <VturbPlayerElement v-else-if="e.type === 'vturb-player'" :element="e" />
                    <PitchButtonElement v-else-if="e.type === 'pitch-button'" :element="e" />
                    <LiveViewersElement v-else-if="e.type === 'live-viewers'" :element="e" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="em-gs-grid">
            <div class="em-field em-full">
              <label class="em-lbl">Título da Página (&lt;title&gt;)</label>
              <input v-model="state.pageSettings.pageTitle" class="em-input" type="text" placeholder="Página de Vendas - VSL" />
            </div>
            <div class="em-field">
              <label class="em-lbl">Cor de Fundo da Página</label>
              <div class="em-color-row">
                <input v-model="state.pageSettings.bgColor" class="em-color-dot" type="color" />
                <input v-model="state.pageSettings.bgColor" class="em-input" type="text" />
              </div>
            </div>
            <div class="em-field">
              <label class="em-lbl">Fonte da Página</label>
              <select v-model="state.pageSettings.fontFamily" class="em-select">
                <option value="Roboto">Roboto</option>
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Oswald">Oswald</option>
                <option value="Raleway">Raleway</option>
                <option value="Nunito">Nunito</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              </select>
            </div>
            <div class="em-field">
              <label class="em-lbl">Espaçamento entre Seções (px)</label>
              <input v-model.number="state.pageSettings.sectionGap" class="em-input" type="number" min="0" max="100" placeholder="16" />
            </div>
            <div class="em-field em-full">
              <label class="em-lbl">
                ⚡ Meta Pixel (ID ou Script Completo)
                <span v-if="state.pageSettings.metaPixel" class="em-pixel-badge">✓ Pixel Configurado</span>
              </label>
              <textarea v-model="state.pageSettings.metaPixel" class="em-input em-ta-sm" placeholder="Insira o ID (ex: 1234567890) ou cole o código <script> completo do Meta Pixel..."></textarea>
            </div>
            <div class="em-field em-full">
              <label class="em-lbl">Meta Description (SEO)</label>
              <textarea v-model="state.pageSettings.metaDesc" class="em-input em-ta-sm" placeholder="Descrição para mecanismos de busca..."></textarea>
            </div>
            <div class="em-field em-full">
              <label class="em-lbl">Favicon URL</label>
              <input v-model="state.pageSettings.faviconUrl" class="em-input" type="text" placeholder="https://..." />
            </div>
            <div class="em-field em-full">
              <label class="em-lbl">Código Google Tag Manager (GTM)</label>
              <textarea v-model="state.pageSettings.gtmCode" class="em-input em-ta-sm" placeholder="<script>...</script>"></textarea>
            </div>
          </div>
        </template>

        <!-- ========== NORMAL ELEMENT ========== -->
        <template v-else>

          <!-- LAYOUT ADAPTATIVO -->
          <!-- Vertical (vídeo portrait): preview à ESQUERDA, conteúdo/estilos à DIREITA -->
          <!-- Horizontal (outros): preview em CIMA, conteúdo abaixo -->
          <div :class="isVerticalPreview ? 'em-layout-side' : 'em-layout-top'">

            <!-- PREVIEW -->
            <div
              :class="isVerticalPreview ? 'em-preview-side' : 'em-preview-top'"
              :style="{ backgroundColor: state.pageSettings.bgColor || '#141722' }"
            >
              <!-- BOTÃO DE TOGGLE ORIENTAÇÃO (só VTurb) -->
              <div v-if="elem.type === 'vturb-player'" class="em-orientation-toggle">
                <button
                  :class="['em-orient-btn', { active: isVerticalPreview }]"
                  @click="orientationOverride = 'vertical'"
                  title="Preview vertical (retrato)"
                ><i class="bi bi-phone"></i> Vertical</button>
                <button
                  :class="['em-orient-btn', { active: !isVerticalPreview }]"
                  @click="orientationOverride = 'horizontal'"
                  title="Preview horizontal (paisagem)"
                ><i class="bi bi-display"></i> Horizontal</button>
                <button
                  v-if="orientationOverride"
                  class="em-orient-btn em-orient-auto"
                  @click="orientationOverride = null"
                  title="Detectar automático"
                ><i class="bi bi-magic"></i> Auto</button>
              </div>
              <TopBannerElement v-if="elem.type === 'top-banner'" :element="elem" />
              <HeadingElement v-else-if="elem.type === 'heading'" :element="elem" />
              <ParagraphElement v-else-if="elem.type === 'paragraph'" :element="elem" />
              <ButtonElement v-else-if="elem.type === 'button'" :element="elem" />
              <VturbModalPreview v-else-if="elem.type === 'vturb-player'" :element="elem" />
              <PitchButtonElement v-else-if="elem.type === 'pitch-button'" :element="elem" />
              <UpsellButtonsElement v-else-if="elem.type === 'upsell-buttons'" :element="elem" />
              <LiveViewersElement v-else-if="elem.type === 'live-viewers'" :element="elem" />
              <div v-else-if="elem.type === 'meta-pixel'" class="meta-pixel-preview">
                ⚡ Meta Pixel &nbsp;·&nbsp; ID: {{ elem.pixelId || '—' }} &nbsp;·&nbsp; Evento: {{ elem.pixelEvent || 'PageView' }}
              </div>
            </div>

            <!-- CONTEÚDO + ESTILOS (fica à direita no layout vertical, ou abaixo no horizontal) -->
            <div :class="isVerticalPreview ? 'em-side-content' : 'em-below-content'">

              <!-- MAIN ROW (conteúdo + estilos) -->
              <div class="em-main-row" v-if="hasContent(elem) || hasStyleOptions(elem)">

                <!-- LEFT: CONTENT -->
                <div class="em-content-col" v-if="hasContent(elem)">

                  <!-- VTURB -->
                  <div v-if="elem.type === 'vturb-player'" class="em-field-stack">
                    <div class="em-field">
                      <label class="em-lbl">🎬 Link 1: Código Embed do Player (Tag &lt;vturb-smartplayer&gt;)</label>
                      <textarea v-model="elem.vturbBody" class="em-input em-ta-main" placeholder="Cole aqui a tag <vturb-smartplayer id='...'>...</vturb-smartplayer> e o script do player..."></textarea>
                    </div>
                    <div class="em-field">
                      <label class="em-lbl">⚡ Link 2: Scripts de Otimização &amp; Preload (Cabeçalho &lt;head&gt;)</label>
                      <textarea v-model="elem.vturbHead" class="em-input em-ta-sm" placeholder="Cole aqui os links <link rel='preload'>, dns-prefetch e scripts de otimização VTurb..."></textarea>
                    </div>
                  </div>

                  <!-- META PIXEL -->
                  <div v-else-if="elem.type === 'meta-pixel'" class="em-field-stack">
                    <div class="em-field">
                      <label class="em-lbl">ID do Meta Pixel</label>
                      <input v-model="elem.pixelId" class="em-input" type="text" placeholder="123456789012345" />
                    </div>
                    <div class="em-field">
                      <label class="em-lbl">Evento do Pixel</label>
                      <select v-model="elem.pixelEvent" class="em-select">
                        <option value="PageView">PageView</option>
                        <option value="Lead">Lead</option>
                        <option value="InitiateCheckout">InitiateCheckout</option>
                        <option value="Purchase">Purchase</option>
                      </select>
                    </div>
                  </div>

                  <!-- DEFAULT TEXT CONTENT -->
                  <div v-if="hasTextContent(elem)" class="em-field">
                    <label class="em-lbl">Conteúdo</label>
                    <div class="em-textarea-wrap">
                      <textarea
                        ref="taMain"
                        v-model="elem.content"
                        class="em-input em-ta-main"
                        placeholder="Escreva aqui... use >>cor<< **negrito** [[fundo]]"
                      ></textarea>
                      <!-- ICON PICKER TRIGGER -->
                      <div class="em-icon-toolbar">
                        <button class="em-icon-trigger" @click="iconPickerOpen = !iconPickerOpen">
                          <i class="bi bi-grid-3x3-gap"></i> Ícones Bootstrap <i class="bi bi-chevron-down" style="font-size:9px;"></i>
                        </button>
                      </div>
                      <!-- ICON PICKER DROPDOWN -->
                      <div v-if="iconPickerOpen" class="em-icon-picker">
                        <div class="em-ip-search">
                          <input v-model="iconSearch" class="em-input em-ip-input" placeholder="Buscar ícone... (ex: star, heart, lock)" />
                        </div>
                        <div class="em-ip-categories">
                          <button v-for="cat in iconCategories" :key="cat.label"
                            class="em-ip-cat" :class="{ active: activeIconCat === cat.label }"
                            @click="activeIconCat = cat.label">{{ cat.label }}</button>
                        </div>
                        <div class="em-ip-grid">
                          <button
                            v-for="ic in filteredIcons"
                            :key="ic"
                            class="em-ip-btn"
                            :title="ic"
                            @click="insertIcon(ic)"
                          >
                            <i :class="'bi bi-' + ic"></i>
                            <span class="em-ip-name">{{ ic }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- LINK + SUBTEXT + TARGET for buttons -->
                  <template v-if="elem.type === 'button' || elem.type === 'pitch-button'">
                    <div class="em-field" style="margin-top:6px;">
                      <label class="em-lbl">Subtexto do Botão (Opcional)</label>
                      <input v-model="elem.subtext" class="em-input" type="text" placeholder="Ex: ⚡ Acesso imediato · Garantia de 7 dias" />
                    </div>

                    <div class="em-field" style="margin-top:6px;">
                      <label class="em-lbl">Link de Redirecionamento</label>
                      <input v-model="elem.url" class="em-input" type="text" placeholder="https://..." />
                      <div style="display:flex; gap:14px; margin-top:6px; flex-wrap:wrap; align-items:center;">
                        <label class="em-chk-lbl"><input type="checkbox" v-model="elem.openInNewTab" /> Abrir em nova aba (target="_blank")</label>
                        <label class="em-chk-lbl"><input type="checkbox" v-model="elemStyle.isGlow" /> ✨ Efeito Glow (Brilho Neon)</label>
                        <div v-if="elemStyle.isGlow" style="display:flex; align-items:center; gap:6px;">
                          <label class="em-lbl" style="margin:0;">Cor do Glow:</label>
                          <input v-model="elemStyle.glowColor" class="em-color-dot" type="color" />
                          <input v-model="elemStyle.glowColor" class="em-input em-c-input" type="text" style="width:75px;" placeholder="#10b981" />
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- COMPACT DELAY - apenas para texto e botão -->
                  <div v-if="hasDelayOption(elem)" class="em-delay-line">
                    <label class="em-chk-lbl">
                      <input type="checkbox" v-model="elem.delayEnabled" />
                      ⏱ Pitch Delay neste objeto
                    </label>
                    <div v-if="elem.delayEnabled" class="em-delay-mmss">
                      <input v-model.number="elem.delayMinutes" type="number" min="0" max="180" class="em-input em-mmss-input" placeholder="0" />
                      <span class="em-mmss-sep">m</span>
                      <input v-model.number="elem.delaySeconds" type="number" min="0" max="59" class="em-input em-mmss-input" placeholder="0" />
                      <span class="em-mmss-sep">s</span>
                    </div>
                  </div>
                  <!-- VARIÁVEIS DINÂMICAS -->
                  <div v-if="hasVariableTags(elem)" class="em-field-stack" style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <div class="em-lbl" style="color: var(--accent-primary);">⚡ Variáveis Dinâmicas Detectadas</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                      <div class="em-field">
                        <label class="em-lbl">🏙️ $cidade</label>
                        <input v-model="elem.cityName" class="em-input" type="text" placeholder="Curitiba" />
                      </div>
                      <div class="em-field">
                        <label class="em-lbl">👀 Mín. Espectadores</label>
                        <input v-model.number="elem.minViewers" class="em-input" type="number" placeholder="140" />
                      </div>
                      <div class="em-field">
                        <label class="em-lbl">👀 Máx. Espectadores</label>
                        <input v-model.number="elem.maxViewers" class="em-input" type="number" placeholder="200" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- RIGHT: STYLE -->
                <div class="em-style-col" v-if="hasStyleOptions(elem)">
                  <div class="em-style-2col">
                    <div class="em-field">
                      <label class="em-lbl">Tamanho</label>
                      <select v-model="elemStyle.fontSize" class="em-select">
                        <option value="12px">Mínimo (12)</option>
                        <option value="14px">Pequena (14)</option>
                        <option value="16px">Médio (16)</option>
                        <option value="18px">Normal (18)</option>
                        <option value="22px">Médio-Grande (22)</option>
                        <option value="24px">Grande (24)</option>
                        <option value="30px">Extra Grande (30)</option>
                        <option value="36px">Muito Grande (36)</option>
                        <option value="40px">Gigante (40)</option>
                        <option value="54px">Enorme (54)</option>
                      </select>
                    </div>
                    <div class="em-field">
                      <label class="em-lbl">Espessura</label>
                      <select v-model="elemStyle.fontWeight" class="em-select">
                        <option value="300">Fina (300)</option>
                        <option value="400">Normal (400)</option>
                        <option value="500">Média (500)</option>
                        <option value="600">Semi-Bold (600)</option>
                        <option value="700">Negrito (700)</option>
                        <option value="900">Extra Bold (900)</option>
                      </select>
                    </div>
                  </div>

                  <!-- MARGENS E PADDINGS -->
                  <div class="em-style-2col">
                    <div class="em-field">
                      <label class="em-lbl">Margem 👆</label>
                      <input v-model.number="elemStyle.marginTop" class="em-input" type="number" placeholder="6" />
                    </div>
                    <div class="em-field">
                      <label class="em-lbl">Margem 👇</label>
                      <input v-model.number="elemStyle.marginBottom" class="em-input" type="number" placeholder="6" />
                    </div>
                  </div>

                  <div class="em-style-2col">
                    <div class="em-field">
                      <label class="em-lbl">Padding Vert ↕</label>
                      <input v-model.number="elemStyle.paddingVertical" class="em-input" type="number" placeholder="14" />
                    </div>
                    <div class="em-field">
                      <label class="em-lbl">Padding Horiz ↔</label>
                      <input v-model.number="elemStyle.paddingHorizontal" class="em-input" type="number" placeholder="28" />
                    </div>
                  </div>

                  <div class="em-field">
                    <label class="em-lbl">Canto Arredondado (px)</label>
                    <input v-model.number="elemStyle.borderRadius" class="em-input" type="number" placeholder="10" />
                  </div>

                  <!-- LARGURA E ALTURA MÁXIMAS DA DIV -->
                  <div class="em-style-2col">
                    <div class="em-field">
                      <label class="em-lbl">Largura Máxima</label>
                      <input v-model="elemStyle.maxWidth" class="em-input" type="text" placeholder="400px ou 100%" />
                    </div>
                    <div class="em-field">
                      <label class="em-lbl">Altura Máxima</label>
                      <input v-model="elemStyle.maxHeight" class="em-input" type="text" placeholder="500px" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- COLORS & TRANSPARENCY ROW -->
              <div class="em-colors-row" v-if="hasStyleOptions(elem)">
                <div class="em-color-field">
                  <label class="em-lbl">Cor do texto</label>
                  <div class="em-color-row">
                    <input v-model="elemStyle.textColor" class="em-color-dot" type="color" />
                    <input v-model="elemStyle.textColor" class="em-input em-c-input" type="text" />
                  </div>
                </div>
                <div class="em-color-field">
                  <label class="em-lbl">&gt;&gt;alternativa&lt;&lt;</label>
                  <div class="em-color-row">
                    <input v-model="elemStyle.altColor" class="em-color-dot" type="color" />
                    <input v-model="elemStyle.altColor" class="em-input em-c-input" type="text" />
                  </div>
                </div>
                <div class="em-color-field">
                  <label class="em-lbl">[[fundo]]</label>
                  <div class="em-color-row">
                    <input v-model="elemStyle.bgColor" class="em-color-dot" type="color" />
                    <input v-model="elemStyle.bgColor" class="em-input em-c-input" type="text" />
                  </div>
                </div>
                <div class="em-color-field">
                  <label class="em-lbl">Opacidade Fundo</label>
                  <input v-model.number="elemStyle.bgOpacity" class="em-input" type="number" step="0.1" min="0" max="1" placeholder="1.0" style="width:80px;" />
                </div>
                <div class="em-color-field" style="justify-content:flex-end;">
                  <label class="em-chk-lbl" style="padding-bottom:6px;">
                    <input type="checkbox" v-model="elemStyle.hasTransparentBg" />
                    🚫 Sem Fundo (Transparente)
                  </label>
                </div>
                <div class="em-color-field">
                  <label class="em-lbl">Alinhamento</label>
                  <select v-model="elemStyle.align" class="em-select">
                    <option value="center">Centralizar</option>
                    <option value="left">Esquerda</option>
                    <option value="right">Direita</option>
                  </select>
                </div>
              </div>

              <!-- BORDER OPTIONS ROW -->
              <div class="em-colors-row" v-if="hasStyleOptions(elem)" style="border-top:1px dashed rgba(255,255,255,0.08); background:rgba(0,0,0,0.25);">
                <div class="em-color-field" style="justify-content:center;">
                  <label class="em-chk-lbl">
                    <input type="checkbox" v-model="elemStyle.hasBorder" />
                    🔲 Ativar Borda Personalizada
                  </label>
                </div>
                <template v-if="elemStyle.hasBorder">
                  <div class="em-color-field">
                    <label class="em-lbl">Espessura (px)</label>
                    <input v-model.number="elemStyle.borderWidth" class="em-input" type="number" placeholder="2" style="width:70px;" />
                  </div>
                  <div class="em-color-field">
                    <label class="em-lbl">Estilo Borda</label>
                    <select v-model="elemStyle.borderStyle" class="em-select" style="width:100px;">
                      <option value="solid">Sólida</option>
                      <option value="dashed">Tracejada</option>
                      <option value="dotted">Pontilhada</option>
                      <option value="double">Dupla</option>
                    </select>
                  </div>
                  <div class="em-color-field">
                    <label class="em-lbl">Cor da Borda</label>
                    <div class="em-color-row">
                      <input v-model="elemStyle.borderColor" class="em-color-dot" type="color" />
                      <input v-model="elemStyle.borderColor" class="em-input em-c-input" type="text" />
                    </div>
                  </div>
                </template>
              </div>

              <!-- ATOMITAGS PANEL -->
              <div class="em-at-panel" v-if="showAtomitags(elem)">
                <div class="em-at-header">Conheça as <strong class="em-at-hl">atomitags</strong> que você pode usar nos elementos de texto</div>
                <div class="em-at-grid4">
                  <div class="em-at-card"><div class="em-at-k">$cidade</div><div class="em-at-v">→ {{ elem.cityName || 'Curitiba' }}</div></div>
                  <div class="em-at-card"><div class="em-at-k">$hoje-ext</div><div class="em-at-v">→ {{ todayExt }}</div></div>
                  <div class="em-at-card"><div class="em-at-k">$hoje</div><div class="em-at-v">→ {{ todayShort }}</div></div>
                  <div class="em-at-card"><div class="em-at-k">$espectadores</div><div class="em-at-v">→ nº aleatório crescente</div></div>
                </div>
                <div class="em-at-grid3">
                  <div class="em-at-card"><div class="em-at-k">&gt;&gt;texto&lt;&lt;</div><div class="em-at-v">→ <span :style="{ color: elemStyle.altColor || '#f1c232' }">cor alternativa</span></div></div>
                  <div class="em-at-card"><div class="em-at-k">[[texto]]</div><div class="em-at-v">→ <span :style="{ background: elemStyle.bgColor || '#00ff0b', color: '#000', padding: '0 4px', borderRadius: '2px' }">fundo</span></div></div>
                  <div class="em-at-card"><div class="em-at-k">**texto**</div><div class="em-at-v">→ <strong>negrito</strong></div></div>
                      <div class="em-at-card"><div class="em-at-k">~texto~</div><div class="em-at-v">→ <span :style="{ color: elemStyle.altColor || '#f1c232' }">pulsando ✦</span></div></div>
                  <div class="em-at-card"><div class="em-at-k">&lt;i class="bi bi-star"&gt;&lt;/i&gt;</div><div class="em-at-v">→ <i class="bi bi-star"></i> ícone</div></div>
                </div>
                <div class="em-at-quick">
                  <button class="em-at-q-btn" @click="insertAtCursor('<br>')">&lt;br&gt; quebra de linha</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('$cidade')">$cidade</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('$espectadores')">$espectadores</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('$hoje')">$hoje</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('>>texto<<')">&gt;&gt;alternativa&lt;&lt;</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('[[texto]]')">[[fundo]]</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('**texto**')">**negrito**</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('--texto--')">--riscado--</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('__texto__')">__sublinhado__</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('//texto//')">// itálico //</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('((texto))')">((branco))</button>
                  <button class="em-at-q-btn" @click="insertAtCursor('~texto~')">~pulsando~</button>
                </div>
              </div>

            </div><!-- /em-side-content or em-below-content -->
          </div><!-- /em-layout-* -->

        </template>
      </div>

      <!-- FOOTER -->
      <div class="em-footer">
        <button v-if="!elem.isGlobalSettings" class="btn-em-delete" @click="deleteSelectedElement">
          <i class="bi bi-trash"></i> Excluir elemento
        </button>
        <div v-else></div>
        <button class="btn-em-save" @click="saveAndClose">
          <i class="bi bi-check-lg"></i> Salvar alterações
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';
import TopBannerElement from './elements/TopBannerElement.vue';
import HeadingElement from './elements/HeadingElement.vue';
import ParagraphElement from './elements/ParagraphElement.vue';
import ButtonElement from './elements/ButtonElement.vue';
import VturbPlayerElement from './elements/VturbPlayerElement.vue';
import VturbModalPreview from './elements/VturbModalPreview.vue';
import PitchButtonElement from './elements/PitchButtonElement.vue';
import UpsellButtonsElement from './elements/UpsellButtonsElement.vue';
import LiveViewersElement from './elements/LiveViewersElement.vue';

const { state, closeModal, deleteSelectedElement } = useBuilderStore();

const iconPickerOpen = ref(false);
const iconSearch = ref('');
const activeIconCat = ref('Social');
const taMain = ref(null);

const elem = computed(() => state.selectedElement);
const elemStyle = computed(() => {
  if (!elem.value || !elem.value.style) return {};
  return elem.value.style;
});

// Override manual de orientação: null = auto, 'vertical' = forçar lateral, 'horizontal' = forçar topo
const orientationOverride = ref(null);

// Detecta se o elemento de preview é vertical (portrait)
// VTurb vertical: padding > 100% na tag vturb-smartplayer ou placeholder
const isVerticalPreview = computed(() => {
  // Override manual tem prioridade
  if (orientationOverride.value === 'vertical') return true;
  if (orientationOverride.value === 'horizontal') return false;

  const e = elem.value;
  if (!e) return false;
  if (e.type === 'vturb-player') {
    // Tenta extrair o padding-top do vturbBody
    const body = e.vturbBody || '';
    const match = body.match(/padding[^:]*:[^\d]*(\d+(?:\.\d+)?)%/);
    if (match) {
      return parseFloat(match[1]) > 100; // > 100% = portrait
    }
    // Sem vturbBody ainda: assume horizontal por padrão
    return false;
  }
  return false; // outros elementos = horizontal (preview em cima)
});





const todayShort = computed(() => new Date().toLocaleDateString('pt-BR'));
const todayExt = computed(() => new Date().toLocaleDateString('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
}));

function saveAndClose() {
  closeModal();
}

function getTypeTitle(e) {
  if (!e) return '';
  const m = {
    'top-banner': 'Banner Topo', 'heading': 'Headline', 'paragraph': 'Parágrafo',
    'button': 'Botão Link', 'vturb-player': 'Player VTurb', 'pitch-button': 'Botão Pitch',
    'live-viewers': 'Espectadores', 'meta-pixel': 'Meta Pixel'
  };
  return m[e.type] || e.type;
}

function hasContent(e) {
  if (!e || e.isGlobalSettings) return false;
  return ['heading', 'paragraph', 'button', 'top-banner', 'pitch-button', 'live-viewers', 'vturb-player', 'meta-pixel'].includes(e.type);
}

function hasTextContent(e) {
  if (!e || e.isGlobalSettings) return false;
  return ['heading', 'paragraph', 'button', 'top-banner', 'pitch-button', 'live-viewers'].includes(e.type);
}

function hasDelayOption(e) {
  if (!e || e.isGlobalSettings) return false;
  return ['heading', 'paragraph', 'button', 'top-banner', 'pitch-button', 'upsell-buttons', 'live-viewers'].includes(e.type);
}

function hasVariableTags(e) {
  if (!e || e.isGlobalSettings) return false;
  if (e.type === 'live-viewers') return true;
  const text = (e.content || '') + ' ' + (e.subtext || '');
  return /\$(cidade|espectadores|random|hoje)/i.test(text);
}

function hasStyleOptions(e) {
  if (!e || e.isGlobalSettings) return false;
  return !['meta-pixel'].includes(e.type);
}

function showAtomitags(e) {
  if (!e) return false;
  return ['heading', 'paragraph', 'button', 'top-banner', 'pitch-button', 'live-viewers'].includes(e.type);
}

function insertAtCursor(str) {
  if (!elem.value) return;
  const ta = taMain.value;
  if (ta) {
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const cur = elem.value.content || '';
    elem.value.content = cur.substring(0, start) + str + cur.substring(end);
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + str.length; ta.focus(); }, 0);
  } else {
    elem.value.content = (elem.value.content || '') + str;
  }
}

function insertIcon(ic) {
  const tag = `<i class="bi bi-${ic}"></i>`;
  insertAtCursor(tag);
  iconPickerOpen.value = false;
}

// ── ICONS DATABASE ──────────────────────────────
const iconCategories = [
  { label: 'Social', icons: ['instagram', 'facebook', 'twitter-x', 'youtube', 'whatsapp', 'telegram', 'tiktok', 'linkedin', 'pinterest', 'snapchat', 'reddit', 'discord', 'twitch', 'spotify', 'apple'] },
  { label: 'Ação', icons: ['arrow-right-circle-fill', 'arrow-left-circle-fill', 'chevron-right', 'chevron-double-right', 'play-fill', 'play-circle-fill', 'cursor-fill', 'hand-index-fill', 'hand-thumbs-up-fill', 'hand-thumbs-down-fill', 'check-circle-fill', 'x-circle-fill', 'plus-circle-fill', 'dash-circle-fill', 'send-fill'] },
  { label: 'Comércio', icons: ['bag-check-fill', 'cart-fill', 'credit-card-fill', 'cash-stack', 'currency-dollar', 'currency-bitcoin', 'gift-fill', 'shop', 'tag-fill', 'percent', 'box-seam-fill', 'truck', 'receipt', 'wallet-fill', 'bank'] },
  { label: 'Destaque', icons: ['star-fill', 'star-half', 'trophy-fill', 'award-fill', 'patch-check-fill', 'shield-check', 'gem', 'fire', 'lightning-fill', 'rocket-takeoff-fill', 'graph-up-arrow', 'bar-chart-fill', 'crown', 'medal', 'bookmark-star-fill'] },
  { label: 'Comunicação', icons: ['chat-fill', 'chat-dots-fill', 'chat-heart-fill', 'envelope-fill', 'bell-fill', 'megaphone-fill', 'broadcast', 'telephone-fill', 'phone-fill', 'headset', 'mic-fill', 'volume-up-fill', 'speaker-fill', 'chat-quote-fill', 'question-circle-fill'] },
  { label: 'Segurança', icons: ['lock-fill', 'shield-fill', 'shield-lock-fill', 'eye-slash-fill', 'key-fill', 'fingerprint', 'incognito', 'person-check-fill', 'person-lock', 'safe-fill', 'bug-fill', 'exclamation-triangle-fill', 'info-circle-fill', 'check-all', 'patch-exclamation-fill'] },
  { label: 'Outros', icons: ['heart-fill', 'emoji-smile-fill', 'emoji-heart-eyes-fill', 'emoji-laughing-fill', 'emoji-sunglasses-fill', 'person-fill', 'people-fill', 'globe', 'geo-alt-fill', 'clock-fill', 'calendar-fill', 'camera-fill', 'image-fill', 'music-note-beamed', 'palette-fill'] }
];

const filteredIcons = computed(() => {
  const cat = iconCategories.find(c => c.label === activeIconCat.value);
  const list = cat ? cat.icons : iconCategories.flatMap(c => c.icons);
  if (!iconSearch.value.trim()) return list;
  return list.filter(ic => ic.includes(iconSearch.value.toLowerCase().trim()));
});
</script>

<style scoped>
/* ─── OVERLAY & BOX ─────────────────────────────── */
.element-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(6px);
  z-index: 999999;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.element-modal-box {
  width: min(1440px, 98vw);
  max-height: 94vh;
  background: #13151d;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 80px rgba(0,0,0,0.9);
  overflow: hidden;
  animation: emPop 0.18s cubic-bezier(0.16,1,0.3,1);
}
@keyframes emPop {
  from { opacity:0; transform: scale(0.97) translateY(8px); }
  to   { opacity:1; transform: scale(1) translateY(0); }
}

/* ─── HEADER ─────────────────────────────────────── */
.em-header { display:flex; align-items:center; justify-content:space-between; padding:14px 20px 8px; }
.em-header-left { display:flex; align-items:center; gap:10px; }
.em-title { font-size:15px; color:#fff; }
.em-title strong { font-weight:800; }
.em-badge { font-size:10px; font-weight:700; background:rgba(255,255,255,0.08); color:#9ca3af; padding:2px 8px; border-radius:10px; text-transform:uppercase; }
.em-close { background:transparent; border:none; color:#9ca3af; font-size:17px; cursor:pointer; padding:4px 8px; border-radius:6px; }
.em-close:hover { color:#fff; background:rgba(255,255,255,0.07); }
.em-subinfo { padding:0 20px 10px; font-size:11px; color:#4b5563; border-bottom:1px solid rgba(255,255,255,0.07); }

/* ─── BODY ───────────────────────────────────────── */
.em-scroll-body { flex:1; overflow-y:auto; display:flex; flex-direction:column; }

/* ─── LAYOUTS ADAPTATIVOS ─────────────────────────── */
/* Horizontal: preview em cima, conteúdo abaixo */
.em-layout-top {
  display: flex;
  flex-direction: column;
}

/* Vertical: preview à esquerda, conteúdo à direita */
.em-layout-side {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Preview lateral (vídeo vertical) */
.em-preview-side {
  width: 360px;
  min-width: 280px;
  max-width: 400px;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 12px;
  border-right: 1px solid rgba(255,255,255,0.09);
  box-sizing: border-box;
  gap: 10px;
}

/* Preview em cima (video horizontal) */
.em-preview-top {
  position: relative;
  background: #141722;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  min-height: 220px;
  max-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 12px 36px 36px 36px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
}

/* Coluna de conteúdo/estilos à direita do preview vertical */
.em-side-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.em-main-row-side {
  flex: 1;
  border-bottom: none;
}

/* Conteúdo abaixo do preview (layout horizontal) */
.em-below-content {
  display: flex;
  flex-direction: column;
}

/* ─── TOGGLE ORIENTAÇÃO ──────────────────────────── */
.modal-vturb-container {
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  background: #000;
}
.modal-vturb-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
.em-orientation-toggle {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 5px 14px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  width: fit-content;
  box-sizing: border-box;
  flex-shrink: 0;
  margin: 0 auto;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
.em-orient-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #9ca3af;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.em-orient-btn:hover {
  background: rgba(99,102,241,0.2);
  border-color: rgba(99,102,241,0.4);
  color: #fff;
}
.em-orient-btn.active {
  background: rgba(99,102,241,0.3);
  border-color: rgba(99,102,241,0.7);
  color: #818cf8;
  box-shadow: 0 0 8px rgba(99,102,241,0.3);
}
.em-orient-auto {
  background: rgba(16,185,129,0.1) !important;
  border-color: rgba(16,185,129,0.3) !important;
  color: #34d399 !important;
}
.em-orient-auto:hover {
  background: rgba(16,185,129,0.2) !important;
  border-color: rgba(16,185,129,0.6) !important;
}

/* ─── MINI SITE SCALED PREVIEW IN GLOBAL SETTINGS ─── */
.global-page-mini-preview {
  background: #141722 !important;
  min-height: 280px;
  max-height: 440px;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  position: relative;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.mini-site-scaler {
  width: 960px;
  transform: scale(0.52);
  transform-origin: top center;
  pointer-events: none;
  margin: 0 auto;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  padding: 0 0 40px 0;
  box-sizing: border-box;
  transition: background-color 0.2s ease;
}
.mini-builder-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
}
.mini-builder-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}
.mini-canvas-elem {
  width: 100%;
  box-sizing: border-box;
}

/* ─── CHECKBOX MODERNO COM GLOW ──────────────────── */
.em-chk-lbl {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.em-chk-lbl:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.4);
  color: #ffffff;
}
.em-chk-lbl input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 17px;
  height: 17px;
  border: 2px solid #64748b;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  outline: none;
  margin: 0;
}
.em-chk-lbl input[type="checkbox"]:checked {
  background: #6366f1;
  border-color: #6366f1;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
}
.em-chk-lbl input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 11px;
  font-weight: 900;
}
.meta-pixel-preview {
  color:#818cf8; font-weight:700; font-size:13px;
  background:rgba(99,102,241,0.1); padding:10px 20px; border-radius:8px;
  border:1px solid rgba(99,102,241,0.3);
}

/* ─── GLOBAL SETTINGS GRID ───────────────────────── */
.em-gs-grid {
  display:grid; grid-template-columns:1fr 1fr; gap:14px;
  padding:20px;
}
.em-pixel-badge {
  display:inline-block; margin-left:8px; background:rgba(99,102,241,0.2);
  color:#818cf8; font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px;
}

/* ─── MAIN ROW ───────────────────────────────────── */
.em-main-row { display:flex; gap:0; border-bottom:1px solid rgba(255,255,255,0.07); }
.em-content-col { flex:1; padding:16px 20px; border-right:1px solid rgba(255,255,255,0.07); display:flex; flex-direction:column; gap:10px; }
.em-style-col { width:256px; padding:16px; display:flex; flex-direction:column; gap:12px; }
.em-style-2col { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

/* ─── COLORS ROW ─────────────────────────────────── */
.em-colors-row {
  display:flex; gap:10px; padding:12px 20px;
  border-bottom:1px solid rgba(255,255,255,0.07);
  flex-wrap:wrap; align-items:flex-end; background:rgba(0,0,0,0.15);
}
.em-color-field { display:flex; flex-direction:column; gap:4px; min-width:100px; }
.em-color-row { display:flex; align-items:center; gap:6px; }
.em-color-dot { width:30px; height:30px; border:2px solid rgba(255,255,255,0.15); border-radius:6px; cursor:pointer; padding:0; background:none; flex-shrink:0; }
.em-c-input { width:90px; }

/* ─── DELAY - COMPACT ────────────────────────────── */
.em-delay-line {
  display:flex; align-items:center; gap:10px;
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
  border-radius:8px; padding:8px 12px; flex-wrap:wrap;
}
.em-delay-mmss { display:flex; align-items:center; gap:4px; }
.em-mmss-input { width:54px !important; text-align:center; }
.em-mmss-sep { color:#6b7280; font-size:13px; font-weight:700; }

/* ─── TEXTAREA & ICON PICKER ─────────────────────── */
.em-textarea-wrap { position:relative; display:flex; flex-direction:column; gap:4px; }
.em-ta-main { min-height:90px; resize:vertical; }
.em-ta-sm   { min-height:56px; resize:vertical; }

.em-icon-toolbar { display:flex; gap:6px; }
.em-icon-trigger {
  background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
  color:#d1d5db; padding:5px 10px; border-radius:6px; font-size:11px;
  cursor:pointer; display:flex; align-items:center; gap:5px; transition:all 0.15s;
}
.em-icon-trigger:hover { background:rgba(99,102,241,0.2); border-color:rgba(99,102,241,0.5); color:#fff; }

.em-icon-picker {
  background:#0d0f18; border:1px solid rgba(255,255,255,0.1); border-radius:10px;
  padding:12px; display:flex; flex-direction:column; gap:8px;
  max-height:280px; overflow:hidden;
}
.em-ip-search { }
.em-ip-input { font-size:12px !important; padding:6px 10px !important; }
.em-ip-categories { display:flex; gap:4px; flex-wrap:wrap; }
.em-ip-cat {
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
  color:#9ca3af; padding:3px 8px; border-radius:5px; font-size:10px;
  cursor:pointer; font-weight:600; transition:all 0.12s;
}
.em-ip-cat.active, .em-ip-cat:hover { background:rgba(99,102,241,0.25); border-color:rgba(99,102,241,0.5); color:#fff; }
.em-ip-grid {
  display:grid; grid-template-columns:repeat(auto-fill, minmax(52px, 1fr));
  gap:4px; overflow-y:auto; max-height:160px;
}
.em-ip-btn {
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06);
  border-radius:6px; padding:6px 4px; cursor:pointer; color:#e5e7eb;
  display:flex; flex-direction:column; align-items:center; gap:2px;
  transition:all 0.12s; font-size:16px;
}
.em-ip-btn:hover { background:rgba(99,102,241,0.2); border-color:rgba(99,102,241,0.5); color:#fff; }
.em-ip-name { font-size:8px; color:#6b7280; overflow:hidden; max-width:50px; text-overflow:ellipsis; white-space:nowrap; }

/* ─── ATOMITAGS PANEL ────────────────────────────── */
.em-at-panel { padding:14px 20px; background:rgba(255,255,255,0.012); }
.em-at-header { font-size:12px; color:#9ca3af; margin-bottom:10px; }
.em-at-hl { color:#6366f1; }
.em-at-grid4 { display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:8px; }
.em-at-grid3 { display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; margin-bottom:10px; }
.em-at-card { background:rgba(255,255,255,0.04); border-radius:6px; padding:7px 10px; }
.em-at-k { font-size:10px; font-weight:700; color:#6b7280; font-family:monospace; margin-bottom:3px; }
.em-at-v { font-size:12px; color:#e5e7eb; }
.em-at-quick { display:flex; flex-wrap:wrap; gap:5px; border-top:1px solid rgba(255,255,255,0.06); padding-top:10px; }
.em-at-q-btn {
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
  color:#d1d5db; padding:3px 8px; border-radius:5px; font-size:11px;
  cursor:pointer; font-family:monospace; transition:all 0.13s;
}
.em-at-q-btn:hover { background:rgba(99,102,241,0.2); border-color:rgba(99,102,241,0.4); color:#fff; }

/* ─── FORM ELEMENTS ──────────────────────────────── */
.em-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#6b7280; }
.em-input {
  background:#0f1117; border:1px solid rgba(255,255,255,0.1); border-radius:6px;
  color:#fff; font-size:13px; padding:8px 10px; width:100%; outline:none;
  transition:border-color 0.15s; font-family:inherit;
}
.em-input:focus { border-color:rgba(99,102,241,0.5); }
.em-select {
  background:#0f1117; border:1px solid rgba(255,255,255,0.1); border-radius:6px;
  color:#fff; font-size:13px; padding:8px 10px; width:100%; outline:none;
}
.em-field { display:flex; flex-direction:column; gap:5px; }
.em-field-stack { display:flex; flex-direction:column; gap:8px; }
.em-full { grid-column:1 / -1; }

.em-upsell-tabs { display:flex; gap:6px; }
.em-tab-btn {
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
  color:#9ca3af; padding:5px 10px; border-radius:6px; font-size:12px; cursor:pointer;
}
.em-tab-btn.active { background:rgba(99,102,241,0.2); border-color:rgba(99,102,241,0.5); color:#fff; }
.em-chk-lbl { display:flex; align-items:center; gap:6px; font-size:12px; color:#9ca3af; cursor:pointer; }

/* ─── FOOTER ─────────────────────────────────────── */
.em-footer {
  display:flex; align-items:center; justify-content:space-between;
  padding:12px 20px; border-top:1px solid rgba(255,255,255,0.08); background:#0f1117;
}
.btn-em-delete {
  background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;
  padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;
  display:flex; align-items:center; gap:6px; transition:all 0.15s;
}
.btn-em-delete:hover { background:rgba(239,68,68,0.2); }
.btn-em-save {
  background:linear-gradient(135deg, #6366f1, #8b5cf6); border:none; color:#fff;
  padding:8px 20px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;
  display:flex; align-items:center; gap:6px; transition:opacity 0.15s;
}
.btn-em-save:hover { opacity:0.88; }
</style>
