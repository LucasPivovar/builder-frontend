<template>
  <div v-if="state.isElementModalOpen && elem" class="element-modal-overlay">
    <div class="element-modal-box tour-element-modal" :class="{ 'is-global-settings': elem.isGlobalSettings }">

      <!-- HEADER -->
      <div class="em-header">
        <div class="em-header-left">
          <span class="em-title">
            <template v-if="elem.isGlobalSettings"><i class="bi bi-gear-fill"></i> Configurações Gerais</template>
            <template v-else>Editando: <strong>{{ getTypeTitle(elem) }}</strong></template>
          </span>
          <span class="em-badge">Desktop</span>
        </div>
        <button class="em-close" @click="saveAndClose"><i class="bi bi-x-lg"></i></button>
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
                    <HeadingElement v-else-if="e.type === 'heading' || e.type === 'quiz-question'" :element="e" />
                    <ParagraphElement v-else-if="e.type === 'paragraph'" :element="e" />
                    <ButtonElement v-else-if="e.type === 'button' || e.type === 'quiz-next'" :element="e" />
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
            <div class="em-field em-full global-theme-presets-box">
              <label class="em-lbl"><i class="bi bi-palette-fill"></i> Esquema de Cores Global (Aplica em TODOS os elementos da página)</label>
              <span class="theme-subtitle">Clique em um tema para harmonizar a cor de fundo, títulos, parágrafos, botões e banners de uma só vez:</span>

              <div class="theme-cards-grid">
                <div
                  v-for="t in colorThemesList"
                  :key="t.key"
                  class="theme-card"
                  :class="{ active: state.activeThemeKey === t.key }"
                  @click="applyGlobalColorTheme(t.key)"
                >
                  <div class="theme-card-header">
                    <span class="theme-name">{{ t.name }}</span>
                    <i v-if="state.activeThemeKey === t.key" class="bi bi-check-circle-fill active-check"></i>
                    <span v-else class="theme-tag">{{ t.tag }}</span>
                  </div>
                  <div class="theme-dots">
                    <span class="dot-preview" :style="{ background: t.pageBg }" title="Fundo"></span>
                    <span class="dot-preview" :style="{ background: t.headingAlt }" title="Destaque"></span>
                    <span class="dot-preview" :style="{ background: t.btnBg }" title="Botão"></span>
                    <span class="dot-preview" :style="{ background: t.headingText }" title="Texto"></span>
                  </div>
                </div>
              </div>
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
            <div v-if="state.builderMode === 'quiz'" class="quiz-progress-settings em-full">
              <div class="quiz-progress-settings-copy">
                <span class="quiz-progress-settings-icon"><i class="bi bi-bar-chart-steps"></i></span>
                <div>
                  <strong>Barra de progresso do quiz</strong>
                  <small>O percentual é calculado automaticamente conforme a etapa atual.</small>
                </div>
              </div>
              <div class="quiz-progress-settings-controls">
                <div class="em-field">
                  <label class="em-lbl">Cor da barra</label>
                  <div class="em-color-row quiz-progress-color-row">
                    <input v-model="state.pageSettings.quizProgressColor" class="em-color-dot" type="color" aria-label="Cor da barra de progresso" />
                    <input v-model="state.pageSettings.quizProgressColor" class="em-input" type="text" aria-label="Código da cor da barra de progresso" />
                  </div>
                </div>
                <div class="em-field">
                  <label class="em-lbl">Espessura</label>
                  <select v-model.number="state.pageSettings.quizProgressHeight" class="em-select">
                    <option :value="3">Fina · 3px</option>
                    <option :value="6">Média · 6px</option>
                    <option :value="10">Grossa · 10px</option>
                  </select>
                </div>
              </div>
              <div class="quiz-progress-settings-preview">
                <span>Prévia · etapa 3 de 5</span>
                <div :style="{ height: `${state.pageSettings.quizProgressHeight || 6}px` }"><i :style="{ width: '60%', backgroundColor: state.pageSettings.quizProgressColor || '#612bf4' }"></i></div>
              </div>
            </div>
            <div class="em-field em-full">
              <label class="em-lbl">
                <i class="bi bi-lightning-charge-fill"></i> Meta Pixel (ID ou Script Completo)
                <span v-if="state.pageSettings.metaPixel" class="em-pixel-badge"><i class="bi bi-check-circle-fill"></i> Pixel Configurado</span>
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
              :style="{
                backgroundColor: state.pageSettings.bgColor || '#141722',
                fontFamily: `'${state.pageSettings.fontFamily || 'Roboto'}', -apple-system, BlinkMacSystemFont, sans-serif`
              }"
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
              <HeadingElement v-else-if="elem.type === 'heading' || elem.type === 'quiz-question'" :element="elem" />
              <ParagraphElement v-else-if="elem.type === 'paragraph'" :element="elem" />
              <ButtonElement v-else-if="elem.type === 'button' || elem.type === 'quiz-next'" :element="elem" />
              <VturbModalPreview v-else-if="elem.type === 'vturb-player'" :element="elem" />
              <PitchButtonElement v-else-if="elem.type === 'pitch-button'" :element="elem" />
              <UpsellButtonsElement v-else-if="elem.type === 'upsell-buttons'" :element="elem" />
              <LiveViewersElement v-else-if="elem.type === 'live-viewers'" :element="elem" />
              <LibraryElement v-else-if="libraryElementTypes.includes(elem.type)" :element="elem" />
              <QuizElement v-else-if="quizElementTypes.includes(elem.type)" :element="elem" />

              <!-- EMAIL HEADER PREVIEW -->
              <div v-else-if="elem.type === 'email-header'" style="width: 100%; max-width: 600px; margin: 0 auto;">
                <div :style="{ background: elem.style?.bgColor || '#27272a', padding: `${getNum(elem.style?.paddingVertical, 26)}px ${getNum(elem.style?.paddingHorizontal, 44)}px`, marginTop: `${getNum(elem.style?.marginTop, 0)}px`, marginBottom: `${getNum(elem.style?.marginBottom, 24)}px`, borderRadius: '8px', textAlign: elem.style?.align || 'left' }">
                  <img v-if="elem.logoType === 'image' && elem.logoImageUrl" :src="elem.logoImageUrl" alt="Logo" style="max-height: 40px; max-width: 150px; display: inline-block;" />
                  <div v-else :style="{ color: elem.style?.logoColor || '#ffffff', fontSize: elem.style?.fontSize || '20px', fontWeight: elem.style?.fontWeight || '700' }">
                    {{ elem.logoText || 'Rappu' }}
                  </div>
                </div>
              </div>

              <!-- EMAIL FOOTER PREVIEW -->
              <div v-else-if="elem.type === 'email-footer'" style="width: 100%; max-width: 600px; margin: 0 auto;">
                <div :style="{ background: elem.style?.bgColor || '#27272a', padding: `${getNum(elem.style?.paddingVertical, 24)}px ${getNum(elem.style?.paddingHorizontal, 44)}px`, marginTop: `${getNum(elem.style?.marginTop, 24)}px`, marginBottom: `${getNum(elem.style?.marginBottom, 0)}px`, borderRadius: '8px', textAlign: elem.style?.align || 'center' }">
                  <img v-if="elem.logoType === 'image' && elem.logoImageUrl" :src="elem.logoImageUrl" alt="Logo" style="max-height: 36px; max-width: 120px; display: block; margin: 0 auto 8px;" />
                  <div v-else :style="{ color: elem.style?.logoColor || '#ffffff', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }">
                    {{ elem.logoText || 'Rappu' }}
                  </div>
                  <p :style="{ color: elem.style?.textColor || '#a1a1aa', fontSize: elem.style?.fontSize || '12px', margin: 0 }">
                    {{ elem.copyrightText || '© 2026 Rappu. Todos os direitos reservados.' }}
                  </p>
                </div>
              </div>

              <!-- EMAIL TAG PREVIEW -->
              <div v-else-if="elem.type === 'email-tag'" :style="{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '16px', background: '#ffffff', borderRadius: '8px', textAlign: elem.style?.align || 'left' }">
                <div :style="{ display: 'inline-block', background: elem.style?.bgColor || '#f4f4f5', color: elem.style?.textColor || '#27272a', fontSize: elem.style?.fontSize || '11px', fontWeight: elem.style?.fontWeight || '500', padding: `${getNum(elem.style?.paddingVertical, 5)}px ${getNum(elem.style?.paddingHorizontal, 12)}px`, borderRadius: `${getNum(elem.style?.borderRadius, 999)}px`, marginTop: `${getNum(elem.style?.marginTop, 0)}px`, marginBottom: `${getNum(elem.style?.marginBottom, 12)}px`, border: '1px solid #e4e4e7', letterSpacing: '0.6px' }">
                  {{ elem.content || 'ARTES PRONTAS' }}
                </div>
              </div>

              <div v-else-if="elem.type === 'meta-pixel'" class="meta-pixel-preview">
                <i class="bi bi-lightning-charge-fill"></i> Meta Pixel &nbsp;·&nbsp; ID: {{ elem.pixelId || '—' }} &nbsp;·&nbsp; Evento: {{ elem.pixelEvent || 'PageView' }}
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
                      <label class="em-lbl"><i class="bi bi-play-btn-fill"></i> Link 1: Código Embed do Player (Tag &lt;vturb-smartplayer&gt;)</label>
                      <textarea v-model="elem.vturbBody" class="em-input em-ta-main" placeholder="Cole aqui a tag <vturb-smartplayer id='...'>...</vturb-smartplayer> e o script do player..."></textarea>
                    </div>
                    <div class="em-field">
                      <label class="em-lbl"><i class="bi bi-lightning-charge-fill"></i> Link 2: Scripts de Otimização &amp; Preload (Cabeçalho &lt;head&gt;)</label>
                      <textarea v-model="elem.vturbHead" class="em-input em-ta-sm" placeholder="Cole aqui os links <link rel='preload'>, dns-prefetch e scripts de otimização VTurb..."></textarea>
                    </div>
                  </div>

                  <!-- META PIXEL -->
                  <div v-else-if="elem.type === 'meta-pixel'" class="em-field-stack">
                    <div class="em-field">
                      <label class="em-lbl">
                        <i class="bi bi-code-square"></i> Cole o Código Completo do Meta Pixel (Script / HTML)
                      </label>
                      <textarea
                        v-model="elem.pixelCode"
                        class="em-input em-ta-main"
                        placeholder="<!-- Meta Pixel Code -->&#10;<script>&#10;!function(f,b,e,v,n,t,s)...&#10;fbq('init', '426292223103034');&#10;fbq('track', 'PageView');&#10;</script>&#10;<noscript><img ... /></noscript>&#10;<!-- End Meta Pixel Code -->"
                        @input="onPixelCodeInput"
                      ></textarea>
                    </div>
                    <div class="em-field">
                      <label class="em-lbl">Ou digite apenas o ID do Pixel</label>
                      <input v-model="elem.pixelId" class="em-input" type="text" placeholder="Ex: 426292223103034" />
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

                  <!-- EMAIL HEADER -->
                  <div v-else-if="elem.type === 'email-header'" class="em-field-stack">
                    <div class="em-field">
                      <label class="em-lbl">Tipo de Logo</label>
                      <select v-model="elem.logoType" class="em-select">
                        <option value="text">Texto / Escrita</option>
                        <option value="image">Imagem (URL / Upload)</option>
                      </select>
                    </div>
                    <div v-if="elem.logoType === 'text'" class="em-field">
                      <label class="em-lbl">Texto da Logo / Marca</label>
                      <input v-model="elem.logoText" class="em-input" type="text" placeholder="Rappu" />
                    </div>
                    <div v-else class="em-field-stack">
                      <div class="em-field">
                        <label class="em-lbl"><i class="bi bi-image-fill"></i> Upload de Arquivo de Imagem</label>
                        <input type="file" accept="image/*" class="em-input" @change="handleLogoFileUpload" />
                      </div>
                      <div class="em-field">
                        <label class="em-lbl"><i class="bi bi-link-45deg"></i> ou Cole a URL / Base64 da Logo</label>
                        <input v-model="elem.logoImageUrl" class="em-input" type="text" placeholder="https://exemplo.com/logo.png" />
                      </div>
                    </div>
                  </div>

                  <!-- EMAIL FOOTER -->
                  <div v-else-if="elem.type === 'email-footer'" class="em-field-stack">
                    <div class="em-field">
                      <label class="em-lbl">Tipo de Logo</label>
                      <select v-model="elem.logoType" class="em-select">
                        <option value="text">Texto / Escrita</option>
                        <option value="image">Imagem (URL / Upload)</option>
                      </select>
                    </div>
                    <div v-if="elem.logoType === 'text'" class="em-field">
                      <label class="em-lbl">Texto da Logo</label>
                      <input v-model="elem.logoText" class="em-input" type="text" placeholder="Rappu" />
                    </div>
                    <div v-else class="em-field-stack">
                      <div class="em-field">
                        <label class="em-lbl"><i class="bi bi-image-fill"></i> Upload de Arquivo de Imagem</label>
                        <input type="file" accept="image/*" class="em-input" @change="handleLogoFileUpload" />
                      </div>
                      <div class="em-field">
                        <label class="em-lbl"><i class="bi bi-link-45deg"></i> ou Cole a URL / Base64 da Logo</label>
                        <input v-model="elem.logoImageUrl" class="em-input" type="text" placeholder="https://exemplo.com/logo.png" />
                      </div>
                    </div>
                    <div class="em-field">
                      <label class="em-lbl">Texto do Rodapé / Copyright</label>
                      <input v-model="elem.copyrightText" class="em-input" type="text" placeholder="© 2026 Rappu. Todos os direitos reservados." />
                    </div>
                  </div>

                  <!-- EMAIL TAG / PILL -->
                  <div v-else-if="elem.type === 'email-tag'" class="em-field-stack">
                    <div class="em-field">
                      <label class="em-lbl">Texto do Pill / Label</label>
                      <input v-model="elem.content" class="em-input" type="text" placeholder="ARTES PRONTAS" />
                    </div>
                  </div>

                  <!-- BIBLIOTECA DE BLOCOS -->
                  <div v-else-if="libraryElementTypes.includes(elem.type)" class="em-field-stack">
                    <template v-if="elem.type === 'image'">
                      <div class="em-field">
                        <label class="em-lbl">Upload da imagem</label>
                        <input type="file" accept="image/*" class="em-input" @change="handleLibraryImageUpload" />
                      </div>
                      <div class="em-field">
                        <label class="em-lbl">URL da imagem</label>
                        <input v-model="elem.imageUrl" class="em-input" type="url" placeholder="https://exemplo.com/imagem.jpg" />
                      </div>
                      <div class="em-field">
                        <label class="em-lbl">Texto alternativo</label>
                        <input v-model="elem.altText" class="em-input" type="text" placeholder="Descreva a imagem" />
                      </div>
                    </template>
                    <template v-else-if="elem.type !== 'divider'">
                      <div class="em-field">
                        <label class="em-lbl">{{ elem.type === 'faq' ? 'Pergunta' : elem.type === 'form' ? 'Texto do botão' : 'Texto principal' }}</label>
                        <input v-model="elem.content" class="em-input" type="text" />
                      </div>
                      <div v-if="elem.type === 'testimonial'" class="em-field">
                        <label class="em-lbl">Nome da pessoa</label>
                        <input v-model="elem.author" class="em-input" type="text" />
                      </div>
                      <div v-if="elem.type === 'testimonial'" class="em-field">
                        <label class="em-lbl">Cargo ou contexto</label>
                        <input v-model="elem.role" class="em-input" type="text" />
                      </div>
                      <div v-if="elem.type === 'faq'" class="em-field">
                        <label class="em-lbl">Resposta</label>
                        <textarea v-model="elem.answer" class="em-input em-ta-sm"></textarea>
                      </div>
                      <template v-if="elem.type === 'form'">
                        <div class="em-field"><label class="em-lbl">Título do formulário</label><input v-model="elem.formTitle" class="em-input" type="text" /></div>
                        <div class="em-field"><label class="em-lbl">Descrição</label><input v-model="elem.description" class="em-input" type="text" /></div>
                        <div class="em-field"><label class="em-lbl">URL de envio (será ativada com o backend)</label><input v-model="elem.submitUrl" class="em-input" type="url" placeholder="https://..." /></div>
                      </template>
                      <div v-if="elem.type === 'countdown'" class="em-field">
                        <label class="em-lbl">Data final (formato ISO)</label>
                        <input v-model="elem.targetDate" class="em-input" type="text" placeholder="2026-12-31T23:59:00" />
                      </div>
                    </template>
                  </div>

                  <div v-else-if="quizElementTypes.includes(elem.type)" class="em-field-stack">
                    <div v-if="['quiz-single','quiz-multiple','quiz-yes-no'].includes(elem.type)" class="em-field"><label class="em-lbl">Opções (uma por linha)</label><textarea v-model="elem.optionsText" class="em-input em-ta-sm"></textarea></div>
                    <div v-if="['quiz-progress','quiz-loading'].includes(elem.type)" class="em-field"><label class="em-lbl">Progresso (%)</label><input v-model.number="elem.progress" class="em-input" type="number" min="0" max="100"></div>
                    <div v-if="elem.type === 'quiz-loading'" class="em-field"><label class="em-lbl">Texto do carregamento</label><input v-model="elem.content" class="em-input" type="text"></div>
                    <div v-if="elem.type === 'quiz-metric'" class="em-field em-metrics-editor">
                      <div class="em-metrics-header">
                        <div>
                          <label class="em-lbl">Métricas</label>
                          <small>Use uma ou várias. O espaço se adapta automaticamente.</small>
                        </div>
                        <button type="button" class="em-add-metric" @click="addMetric"><i class="bi bi-plus-lg"></i> Adicionar</button>
                      </div>
                      <div class="em-metric-list">
                        <div v-for="(metric, index) in metricItems" :key="index" class="em-metric-row">
                          <span class="em-metric-index">{{ index + 1 }}</span>
                          <div class="em-field"><label class="em-lbl">Valor</label><input :value="metric.value" class="em-input" placeholder="72%" @input="updateMetric(index, 'value', $event.target.value)"></div>
                          <div class="em-field em-metric-name"><label class="em-lbl">Nome</label><input :value="metric.label" class="em-input" placeholder="Taxa de conversão" @input="updateMetric(index, 'label', $event.target.value)"></div>
                          <button type="button" class="em-remove-metric" :disabled="metricItems.length === 1" :title="metricItems.length === 1 ? 'Mantenha ao menos uma métrica' : 'Remover métrica'" @click="removeMetric(index)"><i class="bi bi-trash3"></i></button>
                        </div>
                      </div>
                    </div>
                    <template v-if="elem.type === 'quiz-price'"><div class="em-field"><label class="em-lbl">Nome do plano</label><input v-model="elem.content" class="em-input"></div><div class="em-field"><label class="em-lbl">Descrição</label><input v-model="elem.description" class="em-input"></div><div class="em-field"><label class="em-lbl">Preço</label><input v-model="elem.price" class="em-input"></div><div class="em-field"><label class="em-lbl">Destaque</label><input v-model="elem.badge" class="em-input"></div></template>
                    <div v-if="elem.type === 'quiz-spacer'" class="em-field"><label class="em-lbl">Altura do espaço (px)</label><input v-model.number="elem.height" class="em-input" type="number" min="4" max="300"></div>
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
                  <template v-if="elem.type === 'button' || elem.type === 'pitch-button' || elem.type === 'quiz-next'">
                    <div class="em-field" style="margin-top:6px;">
                      <label class="em-lbl">Subtexto do Botão (Opcional)</label>
                      <input v-model="elem.subtext" class="em-input" type="text" placeholder="Ex: Acesso imediato · Garantia de 7 dias" />
                    </div>

                    <div class="em-field" style="margin-top:6px;">
                      <label class="em-lbl">Link de Redirecionamento</label>
                      <input v-model="elem.url" class="em-input" type="text" placeholder="https://..." />
                      <div style="display:flex; gap:14px; margin-top:6px; flex-wrap:wrap; align-items:center;">
                        <label class="em-chk-lbl"><input type="checkbox" v-model="elem.openInNewTab" /> Abrir em nova aba (target="_blank")</label>
                        <label class="em-chk-lbl"><input type="checkbox" v-model="elemStyle.isGlow" /> <i class="bi bi-stars"></i> Efeito Glow (Brilho Neon)</label>
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
                      <i class="bi bi-stopwatch-fill"></i> Pitch Delay neste objeto
                    </label>
                    <div v-if="elem.delayEnabled" class="em-delay-mmss">
                      <input
                        :value="formatDelay(elem)"
                        class="em-input em-mmss-input"
                        type="text"
                        inputmode="numeric"
                        maxlength="6"
                        placeholder="00:00"
                        aria-label="Atraso no formato minutos e segundos"
                        @input="updateDelay(elem, $event.target.value)"
                        @blur="$event.target.value = formatDelay(elem)"
                      />
                    </div>
                  </div>
                  <!-- VARIÁVEIS DINÂMICAS -->
                  <div v-if="hasVariableTags(elem)" class="em-field-stack" style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <div class="em-lbl" style="color: var(--accent-primary);"><i class="bi bi-lightning-charge-fill"></i> Variáveis Dinâmicas Detectadas</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px;">
                      <div class="em-field">
                        <label class="em-lbl"><i class="bi bi-building"></i> $cidade</label>
                        <input v-model="elem.cityName" class="em-input" type="text" placeholder="Curitiba" />
                      </div>
                      <div class="em-field">
                        <label class="em-lbl"><i class="bi bi-eye-fill"></i> Mín. Espectadores</label>
                        <input v-model.number="elem.minViewers" class="em-input" type="number" placeholder="140" />
                      </div>
                      <div class="em-field">
                        <label class="em-lbl"><i class="bi bi-eye-fill"></i> Máx. Espectadores</label>
                        <input v-model.number="elem.maxViewers" class="em-input" type="number" placeholder="200" />
                      </div>
                      <div class="em-field">
                        <label class="em-lbl"><i class="bi bi-palette-fill"></i> Cor do Número</label>
                        <div class="em-color-row">
                          <input v-model="elemStyle.countColor" class="em-color-dot" type="color" />
                          <input v-model="elemStyle.countColor" class="em-input em-c-input" type="text" placeholder="#38bdf8" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- RIGHT: STYLE -->
                <div class="em-style-col" v-if="hasStyleOptions(elem)">
                  <div class="em-style-2col" v-if="elem.type !== 'vturb-player'">
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
                  <div class="em-field">
                    <label class="em-lbl">Margem (Altura / Vertical) ↕</label>
                    <input
                      :value="marginVerticalValue"
                      @input="onMarginVerticalInput($event.target.value)"
                      class="em-input"
                      type="number"
                      placeholder="6"
                    />
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
                      <input v-model="elemStyle.maxWidth" class="em-input" type="text" placeholder="320px ou 100%" />
                    </div>
                    <div class="em-field">
                      <label class="em-lbl">Altura Máxima</label>
                      <input v-model="elemStyle.maxHeight" class="em-input" type="text" placeholder="500px" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- COLORS & TRANSPARENCY ROW (oculto para VTurb) -->
              <div class="em-colors-row" v-if="hasStyleOptions(elem) && elem.type !== 'vturb-player'">
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
                  <label class="em-lbl"><i class="bi bi-123"></i> Cor do Número</label>
                  <div class="em-color-row">
                    <input v-model="elemStyle.countColor" class="em-color-dot" type="color" />
                    <input v-model="elemStyle.countColor" class="em-input em-c-input" type="text" placeholder="#38bdf8" />
                  </div>
                </div>
                <div class="em-color-field">
                  <label class="em-lbl">Opacidade Fundo</label>
                  <input v-model.number="elemStyle.bgOpacity" class="em-input" type="number" step="0.1" min="0" max="1" placeholder="1.0" style="width:80px;" />
                </div>
                <div class="em-color-field" style="justify-content:flex-end;">
                  <label class="em-chk-lbl" style="padding-bottom:6px;">
                    <input type="checkbox" v-model="elemStyle.hasTransparentBg" />
                    <i class="bi bi-slash-circle"></i> Sem Fundo (Transparente)
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

              <!-- PALETAS RÁPIDAS DE CORES -->
              <div v-if="hasStyleOptions(elem) && elem.type !== 'vturb-player'" class="color-presets-bar">
                <span class="preset-label"><i class="bi bi-palette-fill"></i> Paleta Rápida VSL & SaaS:</span>
                <div class="preset-swatches">
                  <button type="button" class="swatch-btn" style="background:#ffffff;" title="Branco / Amarelo VSL" @click="applyColorPreset('#ffffff', '#f1c232', null)"></button>
                  <button type="button" class="swatch-btn" style="background:#f1c232;" title="Amarelo VSL / Fundo Vermelho" @click="applyColorPreset('#ffffff', '#f1c232', '#dc2626')"></button>
                  <button type="button" class="swatch-btn" style="background:#612bf4;" title="Púrpura Astro" @click="applyColorPreset('#ffffff', '#4321aa', '#612bf4')"></button>
                  <button type="button" class="swatch-btn" style="background:#10b981;" title="Verde Conversão" @click="applyColorPreset('#ffffff', '#f1c232', '#10b981')"></button>
                  <button type="button" class="swatch-btn" style="background:#ef4444;" title="Vermelho Alerta" @click="applyColorPreset('#ffffff', '#f1c232', '#ef4444')"></button>
                  <button type="button" class="swatch-btn" style="background:#07031a; border:1px solid #a854fa;" title="Navy Astro" @click="applyColorPreset('#faf9ff', '#a854fa', '#07031a')"></button>
                </div>
              </div>

              <!-- BORDER OPTIONS ROW (oculto para VTurb) -->
              <div class="em-colors-row" v-if="hasStyleOptions(elem) && elem.type !== 'vturb-player'" style="border-top:1px dashed rgba(255,255,255,0.08); background:rgba(0,0,0,0.25);">
                <div class="em-color-field" style="justify-content:center;">
                  <label class="em-chk-lbl">
                    <input type="checkbox" v-model="elemStyle.hasBorder" />
                    <i class="bi bi-border-style"></i> Ativar Borda Personalizada
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

              <!-- ASTROTAGS PANEL -->
              <div class="em-at-panel" v-if="showAstrotags(elem)">
                <div class="em-at-header">Conheça as <strong class="em-at-hl">astrotags</strong> que você pode usar nos elementos de texto</div>
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
                      <div class="em-at-card"><div class="em-at-k">~texto~</div><div class="em-at-v">→ <span :style="{ color: elemStyle.altColor || '#f1c232' }">pulsando</span></div></div>
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
import { getNum } from '../utils/astrotags';
import TopBannerElement from './elements/TopBannerElement.vue';
import HeadingElement from './elements/HeadingElement.vue';
import ParagraphElement from './elements/ParagraphElement.vue';
import ButtonElement from './elements/ButtonElement.vue';
import VturbPlayerElement from './elements/VturbPlayerElement.vue';
import VturbModalPreview from './elements/VturbModalPreview.vue';
import PitchButtonElement from './elements/PitchButtonElement.vue';
import UpsellButtonsElement from './elements/UpsellButtonsElement.vue';
import LiveViewersElement from './elements/LiveViewersElement.vue';
import LibraryElement from './elements/LibraryElement.vue';
import QuizElement from './elements/QuizElement.vue';

const { state, closeModal, deleteSelectedElement, applyGlobalColorTheme, colorThemesList } = useBuilderStore();

const iconPickerOpen = ref(false);
const iconSearch = ref('');
const activeIconCat = ref('Social');
const taMain = ref(null);
const libraryElementTypes = ['image', 'divider', 'testimonial', 'faq', 'countdown', 'form'];
const quizElementTypes = ['quiz-progress', 'quiz-single', 'quiz-multiple', 'quiz-yes-no', 'quiz-loading', 'quiz-metric', 'quiz-price', 'quiz-spacer'];

const elem = computed(() => state.selectedElement);
const elemStyle = computed(() => elem.value?.style || {});
const metricItems = computed(() => parseMetricItems(elem.value?.metricsText));

function formatDelay(element) {
  const minutes = Math.max(0, Math.min(180, Number(element?.delayMinutes) || 0));
  const seconds = Math.max(0, Math.min(59, Number(element?.delaySeconds) || 0));
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateDelay(element, value) {
  const match = String(value).match(/^(\d{1,3}):(\d{1,2})$/);
  if (!match || !element) return;
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  if (minutes > 180 || seconds > 59) return;
  element.delayMinutes = minutes;
  element.delaySeconds = seconds;
}

function parseMetricItems(raw) {
  const parsed = String(raw || '').split('\n').map(line => {
    const separator = line.indexOf('|');
    if (separator < 0) return { value: line.trim(), label: '' };
    return { value: line.slice(0, separator).trim(), label: line.slice(separator + 1).trim() };
  }).filter(item => item.value || item.label);
  return parsed.length ? parsed : [{ value: '', label: '' }];
}

function saveMetricItems(items) {
  if (!elem.value) return;
  elem.value.metricsText = items.map(item => `${String(item.value || '').replace(/\|/g, '')}|${String(item.label || '').replace(/\|/g, '')}`).join('\n');
}

function updateMetric(index, key, value) {
  const items = metricItems.value.map(item => ({ ...item }));
  items[index][key] = value;
  saveMetricItems(items);
}

function addMetric() {
  saveMetricItems([...metricItems.value.map(item => ({ ...item })), { value: '0%', label: 'Nova métrica' }]);
}

function removeMetric(index) {
  if (metricItems.value.length === 1) return;
  saveMetricItems(metricItems.value.filter((_, itemIndex) => itemIndex !== index));
}

const marginVerticalValue = computed(() => {
  const mt = elemStyle.value?.marginTop;
  const mb = elemStyle.value?.marginBottom;
  if (mt !== undefined && mt !== null && mt !== '') return Number(mt);
  if (mb !== undefined && mb !== null && mb !== '') return Number(mb);
  return 6;
});

function onMarginVerticalInput(val) {
  const parsed = (val === '' || val === null || isNaN(Number(val))) ? 0 : Number(val);
  if (elemStyle.value) {
    elemStyle.value.marginTop = parsed;
    elemStyle.value.marginBottom = parsed;
  }
}

function handleLogoFileUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    if (elem.value) {
      elem.value.logoImageUrl = event.target.result;
    }
  };
  reader.readAsDataURL(file);
}

function handleLibraryImageUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file || !elem.value) return;
  const reader = new FileReader();
  reader.onload = event => { elem.value.imageUrl = event.target.result; };
  reader.readAsDataURL(file);
}

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

function applyColorPreset(textColor, altColor, bgColor) {
  if (!elemStyle.value) return;
  if (textColor) elemStyle.value.textColor = textColor;
  if (altColor) elemStyle.value.altColor = altColor;
  if (bgColor) {
    elemStyle.value.bgColor = bgColor;
    elemStyle.value.hasTransparentBg = false;
  }
}

function saveAndClose() {
  closeModal();
}

function getTypeTitle(e) {
  if (!e) return '';
  const m = {
    'top-banner': 'Banner Topo', 'heading': 'Headline', 'paragraph': 'Parágrafo',
    'button': 'Botão Link', 'vturb-player': 'Player VTurb', 'pitch-button': 'Botão Pitch',
    'live-viewers': 'Espectadores', 'meta-pixel': 'Meta Pixel',
    'email-header': 'Cabeçalho E-mail', 'email-footer': 'Rodapé E-mail', 'email-tag': 'Pill / Label E-mail',
    image: 'Imagem', divider: 'Divisor', testimonial: 'Depoimento', faq: 'Pergunta frequente',
    countdown: 'Contagem regressiva', form: 'Formulário'
    , 'quiz-question':'Pergunta', 'quiz-next':'Avançar etapa', 'quiz-progress':'Progresso', 'quiz-single':'Escolha única', 'quiz-multiple':'Múltipla escolha', 'quiz-yes-no':'Sim / Não', 'quiz-loading':'Loading', 'quiz-metric':'Métricas', 'quiz-price':'Preço / Plano', 'quiz-spacer':'Espaço'
  };
  return m[e.type] || e.type;
}

function hasContent(e) {
  if (!e || e.isGlobalSettings) return false;
  return ['heading', 'quiz-question', 'paragraph', 'button', 'quiz-next', 'top-banner', 'pitch-button', 'live-viewers', 'vturb-player', 'meta-pixel', 'email-header', 'email-footer', 'email-tag', ...libraryElementTypes, ...quizElementTypes].includes(e.type);
}

function hasTextContent(e) {
  if (!e || e.isGlobalSettings) return false;
  return ['heading', 'quiz-question', 'paragraph', 'button', 'quiz-next', 'top-banner', 'pitch-button', 'live-viewers'].includes(e.type);
}

function hasDelayOption(e) {
  if (!e || e.isGlobalSettings) return false;
  return ['heading', 'quiz-question', 'paragraph', 'button', 'quiz-next', 'top-banner', 'pitch-button', 'upsell-buttons', 'live-viewers'].includes(e.type);
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

function onPixelCodeInput() {
  if (!elem.value || !elem.value.pixelCode) return;
  const match = elem.value.pixelCode.match(/fbq\(\s*['"]init['"]\s*,\s*['"]([0-9]+)['"]\s*\)/) ||
                elem.value.pixelCode.match(/id=([0-9]{8,20})/);
  if (match && match[1]) {
    elem.value.pixelId = match[1];
  }
}

function showAstrotags(e) {
  if (!e) return false;
  return ['heading', 'quiz-question', 'paragraph', 'button', 'quiz-next', 'top-banner', 'pitch-button', 'live-viewers'].includes(e.type);
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
  height: fit-content;
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
.em-title { font-size:15px; color:var(--color-surface); }
.em-title strong { font-weight:800; }
.em-badge { font-size:10px; font-weight:700; background:var(--color-primary-soft); color:var(--color-primary-strong); padding:2px 8px; border-radius:10px; text-transform:uppercase; }
.em-close { background:transparent; border:none; color:var(--color-primary-strong); font-size:17px; cursor:pointer; padding:4px 8px; border-radius:6px; }
.em-close:hover { color:var(--color-surface); background:rgba(255,255,255,0.07); }
.em-subinfo { padding:0 20px 10px; font-size:11px; color:var(--color-primary-deep); border-bottom:1px solid var(--color-border); }

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
  width: fit-content;
  min-width: 290px;
  max-width: 400px;
  height: fit-content;
  max-height: 100%;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  border-right: 1px solid rgba(255,255,255,0.09);
  box-sizing: border-box;
  gap: 12px;
}

/* Preview em cima (video horizontal) */
.em-preview-top {
  position: relative;
  background: #141722;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  height: fit-content;
  min-height: auto;
  max-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 14px 20px;
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
  color: var(--color-primary-deep);
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
  background: rgba(14,165,233,0.14);
  border-color: rgba(14,165,233,0.45);
  color: var(--color-surface);
}
.em-orient-btn.active {
  background: rgba(14,165,233,0.16);
  border-color: rgba(14,165,233,0.65);
  color: var(--color-primary-hover);
  box-shadow: 0 0 8px rgba(14,165,233,0.22);
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
  color: var(--color-border);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.em-chk-lbl:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary-border);
  color: var(--color-primary-strong);
}
.em-chk-lbl input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 17px;
  height: 17px;
  border: 2px solid var(--color-text-muted);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  outline: none;
  margin: 0;
}
.em-chk-lbl input[type="checkbox"]:checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 10px rgba(97, 43, 244, 0.42);
}
.em-chk-lbl input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 7px;
  height: 7px;
  background: var(--color-surface);
  border-radius: 2px;
}
.meta-pixel-preview {
  color:var(--color-primary-hover); font-weight:700; font-size:13px;
  background:var(--color-primary-soft); padding:10px 20px; border-radius:8px;
  border:1px solid var(--color-border);
}

/* ─── GLOBAL SETTINGS GRID ───────────────────────── */
.em-gs-grid {
  display:grid; grid-template-columns:1fr 1fr; gap:14px;
  padding:20px;
}
.em-pixel-badge {
  display:inline-block; margin-left:8px; background:var(--color-primary-soft);
  color:var(--color-primary-hover); font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px;
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
.em-mmss-input { width:68px !important; text-align:center; }

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
.em-icon-trigger:hover { background:rgba(14,165,233,0.14); border-color:rgba(14,165,233,0.45); color:var(--color-text); }

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
  color:var(--color-primary-deep); padding:3px 8px; border-radius:5px; font-size:10px;
  cursor:pointer; font-weight:600; transition:all 0.12s;
}
.em-ip-cat.active, .em-ip-cat:hover { background:rgba(14,165,233,0.14); border-color:rgba(14,165,233,0.45); color:var(--color-text); }
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
.em-ip-btn:hover { background:rgba(14,165,233,0.14); border-color:rgba(14,165,233,0.45); color:var(--color-text); }
.em-ip-name { font-size:8px; color:var(--color-primary-deep); overflow:hidden; max-width:50px; text-overflow:ellipsis; white-space:nowrap; }

/* ─── ASTROTAGS PANEL ────────────────────────────── */
.em-at-panel { padding:14px 20px; background:rgba(255,255,255,0.012); }
.em-at-header { font-size:12px; color:var(--color-primary-deep); margin-bottom:10px; }
.em-at-hl { color:var(--color-primary); }
.em-at-grid4 { display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:8px; }
.em-at-grid3 { display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; margin-bottom:10px; }
.em-at-card { background:rgba(255,255,255,0.04); border-radius:6px; padding:7px 10px; }
.em-at-k { font-size:10px; font-weight:700; color:var(--color-primary-deep); font-family:var(--font-mono); margin-bottom:3px; }
.em-at-v { font-size:12px; color:#e5e7eb; }
.em-at-quick { display:flex; flex-wrap:wrap; gap:5px; border-top:1px solid rgba(255,255,255,0.06); padding-top:10px; }
.em-at-q-btn {
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
  color:#d1d5db; padding:3px 8px; border-radius:5px; font-size:11px;
  cursor:pointer; font-family:var(--font-mono); transition:all 0.13s;
}
.em-at-q-btn:hover { background:rgba(14,165,233,0.14); border-color:rgba(14,165,233,0.45); color:var(--color-text); }

/* ─── FORM ELEMENTS ──────────────────────────────── */
.em-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--color-primary-deep); }
.em-input {
  background:#0f1117; border:1px solid rgba(255,255,255,0.1); border-radius:6px;
  color:var(--color-surface); font-size:13px; padding:8px 10px; width:100%; outline:none;
  transition:border-color 0.15s; font-family:inherit;
}
.em-input:focus { border-color:rgba(14,165,233,0.55); }
.em-select {
  background:#0f1117; border:1px solid rgba(255,255,255,0.1); border-radius:6px;
  color:var(--color-surface); font-size:13px; padding:8px 10px; width:100%; outline:none;
}
.em-field { display:flex; flex-direction:column; gap:5px; }
.em-field-stack { display:flex; flex-direction:column; gap:8px; }
.em-full { grid-column:1 / -1; }
.em-metrics-editor { gap:10px; }
.em-metrics-header { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.em-metrics-header>div { display:flex; flex-direction:column; gap:3px; }
.em-metrics-header small { color:var(--color-text-muted); font-size:11px; }
.em-add-metric { min-height:34px; display:inline-flex; align-items:center; gap:6px; padding:0 12px; border:1px solid var(--color-primary-border); border-radius:8px; background:var(--color-primary-soft); color:var(--color-primary-strong); font:inherit; font-size:11px; font-weight:800; cursor:pointer; transition:transform .18s ease, background-color .18s ease; }
.em-add-metric:hover { transform:translateY(-1px); background:var(--color-primary-subtle); }
.em-metric-list { display:flex; flex-direction:column; gap:8px; }
.em-metric-row { display:grid; grid-template-columns:28px minmax(100px,.55fr) minmax(170px,1.45fr) 34px; align-items:end; gap:8px; padding:10px; border:1px solid var(--color-border); border-radius:10px; background:var(--color-surface-soft); animation:emMetricIn .22s ease both; }
.em-metric-index { width:25px; height:34px; display:grid; place-items:center; color:var(--color-primary-strong); font-size:11px; font-weight:900; }
.em-remove-metric { width:34px; height:34px; display:grid; place-items:center; border:1px solid var(--color-border); border-radius:8px; background:var(--color-surface); color:var(--color-danger); cursor:pointer; transition:.18s ease; }
.em-remove-metric:hover:not(:disabled) { border-color:var(--color-danger); background:var(--color-danger-soft); transform:translateY(-1px); }
.em-remove-metric:disabled { opacity:.32; cursor:not-allowed; }
@keyframes emMetricIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
@media(max-width:720px){.em-metric-row{grid-template-columns:24px 1fr 34px}.em-metric-name{grid-column:2}.em-remove-metric{grid-column:3;grid-row:1/3;align-self:center}}

.em-upsell-tabs { display:flex; gap:6px; }
.em-tab-btn {
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
  color:var(--color-primary-deep); padding:5px 10px; border-radius:6px; font-size:12px; cursor:pointer;
}
.em-tab-btn.active { background:rgba(14,165,233,0.14); border-color:rgba(14,165,233,0.45); color:var(--color-text); }
.em-chk-lbl { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--color-primary-deep); cursor:pointer; }

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
  background:var(--color-primary); border:none; color:var(--color-surface);
  padding:8px 20px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;
  display:flex; align-items:center; gap:6px; transition:opacity 0.15s;
}
.btn-em-save:hover { opacity:0.88; }

/* ─── COLOR PRESETS BAR ─────────────────────────── */
.color-presets-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}
.preset-label {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--color-text-soft);
}
.preset-swatches {
  display: flex;
  align-items: center;
  gap: 6px;
}
.swatch-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
  padding: 0;
}
.swatch-btn:hover {
  transform: scale(1.2);
  border-color: var(--color-primary);
}

/* ─── GLOBAL THEMES GRID ────────────────────────── */
.global-theme-presets-box {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
}
.theme-subtitle {
  display: block;
  font-size: 11.5px;
  color: var(--color-text-soft);
  margin-top: 2px;
  margin-bottom: 12px;
}
.theme-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}
.theme-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.theme-card:hover {
  background: rgba(97, 43, 244, 0.14);
  border-color: rgba(97, 43, 244, 0.45);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
.theme-card.active {
  background: rgba(97, 43, 244, 0.14);
  border: 1.5px solid var(--color-primary);
  box-shadow: 0 0 16px rgba(97, 43, 244, 0.22);
}
.active-check {
  color: var(--color-primary-bright);
  font-size: 14px;
}
.theme-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.theme-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-surface);
}
.theme-tag {
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
}
.theme-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot-preview {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* Editor alinhado à identidade visual central. */
.element-modal-overlay { background: var(--overlay) !important; backdrop-filter: blur(4px); }
.element-modal-box { background: var(--color-surface) !important; border-color: var(--color-border) !important; box-shadow: var(--shadow-modal); color: var(--color-text); }
.em-header, .em-footer { background: var(--color-surface) !important; border-color: var(--color-border) !important; }
.em-header { padding: 16px 20px 9px; }
.em-footer { border-top: 1px solid var(--color-border) !important; }
.em-title, .em-lbl, .em-label, .em-editing-title, .theme-name { color: var(--color-text) !important; }
.em-close { color: var(--color-text-muted); }
.em-close:hover { color: var(--color-primary-strong); background: var(--color-primary-soft); }
.em-subinfo, .em-sub-info, .theme-subtitle { color: var(--color-text-muted) !important; border-color: var(--color-border) !important; }
.em-scroll-body, .em-layout-top, .em-layout-side, .em-below-content, .em-side-content { background: var(--color-surface); }
.em-main-row { border-color: var(--color-border) !important; }
.em-content-col, .em-style-col { background: var(--color-surface-soft) !important; border-color: var(--color-border) !important; }
.em-input, .em-select, .em-textarea-container { background: var(--color-surface) !important; border-color: var(--color-border) !important; color: var(--color-text) !important; }
.em-input:focus, .em-select:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px var(--color-focus-ring); }
.em-preview-top, .em-preview-side, .em-preview-pane, .em-preview-card { background: var(--color-primary-subtle) !important; border-color: var(--color-border) !important; }
.em-preview-card { box-shadow: none; }
.em-colors-row { background: var(--color-surface-soft) !important; border-color: var(--color-border) !important; }
.em-color-dot { border-color: var(--color-border-strong); }
.em-chk-lbl, .em-delay-line, .em-icon-trigger, .em-ip-cat, .em-ip-btn, .em-at-card, .em-at-q-btn, .em-tab-btn { background: var(--color-surface) !important; border-color: var(--color-border) !important; color: var(--color-text-secondary) !important; }
.em-chk-lbl:hover, .em-icon-trigger:hover, .em-ip-cat:hover, .em-ip-cat.active, .em-ip-btn:hover, .em-at-q-btn:hover, .em-tab-btn.active { background: var(--color-primary-soft) !important; border-color: var(--color-primary-border) !important; color: var(--color-primary-strong) !important; }
.em-chk-lbl input[type="checkbox"] { border-color: var(--color-primary-border); background: var(--color-surface); }
.em-chk-lbl input[type="checkbox"]:checked { background: var(--color-primary); border-color: var(--color-primary); box-shadow: none; }
.em-icon-picker, .global-theme-presets-box, .astrotags-guide-box, .color-presets-bar, .em-at-panel { background: var(--color-surface-soft) !important; border-color: var(--color-border) !important; }
.em-at-panel { border-top: 1px solid var(--color-border); }
.em-at-header, .em-at-k, .preset-label, .em-ip-name { color: var(--color-primary-strong) !important; }
.em-at-v { color: var(--color-text-muted) !important; }
.em-at-quick { border-color: var(--color-border); }
.theme-card { background: var(--color-surface) !important; border-color: var(--color-border) !important; }
.theme-card:hover, .theme-card.active { background: var(--color-primary-soft) !important; border-color: var(--color-primary) !important; box-shadow: none; }
.btn-em-save { background: var(--color-primary); color: var(--color-on-primary); }
.btn-em-save:hover { opacity: 1; background: var(--color-primary-hover); }
.btn-em-delete { background: var(--color-surface); }

/* Configurações gerais: contraste forte e blocos fáceis de escanear. */
.is-global-settings .em-header { background: var(--color-primary-subtle) !important; border-bottom: 1px solid var(--color-border) !important; }
.is-global-settings .em-title { color: var(--color-text) !important; font-weight: 800; }
.is-global-settings .em-subinfo { padding-top: 7px; padding-bottom: 11px; background: var(--color-surface); color: var(--color-text-secondary) !important; }
.is-global-settings .em-scroll-body { background: var(--color-page); }
.is-global-settings .global-page-mini-preview { background: var(--color-primary-soft) !important; border-bottom: 1px solid var(--color-border) !important; }
.is-global-settings .em-gs-grid { background: var(--color-page); gap: 12px; }
.is-global-settings .em-gs-grid > .em-field { padding: 14px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-surface); }
.is-global-settings .em-lbl { color: var(--color-text-secondary) !important; }
.is-global-settings .em-input,
.is-global-settings .em-select { min-height: 40px; border-color: var(--color-border-strong) !important; background: var(--color-surface) !important; color: var(--color-text) !important; }
.is-global-settings .em-input::placeholder { color: var(--color-text-soft); opacity: 1; }
.is-global-settings .theme-card { border-color: var(--color-border-strong) !important; }
.is-global-settings .theme-name { color: var(--color-text) !important; }
.is-global-settings .theme-tag { background: var(--color-primary-soft); color: var(--color-primary-strong); }
.is-global-settings .theme-subtitle { color: var(--color-text-muted) !important; line-height: 1.45; }
.is-global-settings .em-footer { background: var(--color-surface) !important; }

.quiz-progress-settings { display:flex; flex-direction:column; gap:14px; }
.quiz-progress-settings-copy { display:flex; align-items:center; gap:11px; }
.quiz-progress-settings-icon { width:38px; height:38px; flex:0 0 38px; display:grid; place-items:center; border-radius:10px; background:var(--color-primary-soft); color:var(--color-primary-strong); font-size:17px; }
.quiz-progress-settings-copy>div { display:flex; flex-direction:column; gap:3px; }
.quiz-progress-settings-copy strong { color:var(--color-text); font-size:13px; }
.quiz-progress-settings-copy small { color:var(--color-text-muted); font-size:11px; line-height:1.4; }
.quiz-progress-settings-controls { display:grid; grid-template-columns:1fr 180px; gap:10px; }
.quiz-progress-color-row .em-input { flex:1; }
.quiz-progress-settings-preview { padding:11px 12px; border:1px solid var(--color-border); border-radius:10px; background:var(--color-primary-subtle); }
.quiz-progress-settings-preview>span { display:block; margin-bottom:7px; color:var(--color-text-secondary); font-size:10px; font-weight:800; text-transform:uppercase; }
.quiz-progress-settings-preview>div { width:100%; overflow:hidden; border-radius:999px; background:var(--color-primary-soft); }
.quiz-progress-settings-preview i { display:block; height:100%; border-radius:inherit; transition:width .4s ease,background-color .2s ease; }

@media (max-width: 760px) {
  .element-modal-overlay { padding: 8px; align-items: flex-end; }
  .element-modal-box { width: 100%; max-height: 96vh; border-radius: 16px 16px 0 0; }
  .em-main-row { flex-direction: column; }
  .em-content-col { border-right: 0; border-bottom: 1px solid var(--color-border); }
  .em-style-col { width: 100%; }
  .em-colors-row { align-items: stretch; }
  .em-color-field { flex: 1 1 130px; }
  .em-at-grid4, .em-at-grid3 { grid-template-columns: repeat(2, 1fr); }
  .is-global-settings .em-gs-grid { grid-template-columns:1fr; padding:12px; }
  .quiz-progress-settings-controls { grid-template-columns:1fr; }
}
</style>
