<template>
  <div class="app-layout">
    <DashboardSidebar
      :activeTab="'todas-paginas'"
      :pagesCount="pagesRegistry.length"
      :foldersCount="foldersRegistry.length"
      :templatesCount="customTemplatesRegistry?.length || 0"
      :funilTemplatesCount="funilTemplatesCount"
      :emailTemplatesCount="emailTemplatesCount"
      :quizTemplatesCount="quizTemplatesCount"
      :currentUser="currentUser"
      @select-tab="handleSelectTab"
      @logout="handleLogout"
    />

    <div class="main-wrapper">
      <DashboardHeader
        :searchQuery="searchQuery"
        :unreadCount="notificationUnread"
        @update:searchQuery="handleSearch"
        @open-builder="handleOpenBuilder"
        @notify="openNotifications"
        @start-tour="startTour"
      />

      <main class="metrics-content-area">
        <!-- Loading State -->
        <section v-if="loading" class="state-box">
          <i class="bi bi-arrow-repeat spinning"></i>
          <span>Carregando métricas e estatísticas...</span>
        </section>

        <!-- Page Not Found State -->
        <section v-else-if="!page" class="state-box">
          <i class="bi bi-exclamation-circle"></i>
          <strong>Página não encontrada</strong>
          <span>Ela pode ter sido excluída ou ainda não sincronizou com o dashboard.</span>
          <button class="btn-back-dashboard" type="button" @click="router.push('/dashboard')">
            <i class="bi bi-arrow-left"></i> Voltar ao Dashboard
          </button>
        </section>

        <!-- Main Content with Hero & Metrics -->
        <template v-else>
          <!-- ══ HERO SECTION ══ -->
          <section class="metrics-hero-card">
            <div class="hero-top-row">
              <button class="btn-hero-back" type="button" @click="router.push({ path: '/dashboard', query: { tab: 'todas-paginas' } })">
                <i class="bi bi-arrow-left"></i>
                <span>Voltar para Páginas</span>
              </button>
              <div class="hero-badges">
                <span class="badge-type" :class="pageType.toLowerCase()">
                  <i :class="pageTypeIcon"></i> {{ pageType }}
                </span>
                <span class="badge-status" :class="publication?.publicUrl ? 'online' : 'draft'">
                  <span class="pulse-dot"></span> {{ publication ? publicationStatus : 'Rascunho' }}
                </span>
              </div>
            </div>

            <div class="hero-main-content">
              <div class="hero-info">
                <div class="hero-icon-box" :class="pageType.toLowerCase()">
                  <i :class="pageTypeHeroIcon"></i>
                </div>
                <div class="hero-headings">
                  <span class="hero-eyebrow">Relatório de Performance em Tempo Real</span>
                  <h1 class="hero-title">{{ pageTitle }}</h1>
                  <div class="hero-meta-details">
                    <span><i class="bi bi-folder2-open"></i> {{ folderName }}</span>
                    <span v-if="publication?.customDomain"><i class="bi bi-globe"></i> {{ publication.customDomain }}</span>
                    <span v-else-if="publication?.slug"><i class="bi bi-link-45deg"></i> /{{ publication.slug }}</span>
                    <span><i class="bi bi-clock-history"></i> Atualizado às {{ lastSyncText }}</span>
                  </div>
                </div>
              </div>

              <div class="hero-actions">
                <select v-model="periodDays" class="metrics-period" @change="refreshMetrics"><option value="7">7 dias</option><option value="30">30 dias</option><option value="90">90 dias</option><option value="all">Todo período</option></select>
                <a
                  v-if="publicationUrl"
                  class="btn-hero-action primary"
                  :href="publicationUrl"
                  target="_blank"
                  rel="noopener"
                  title="Abrir página no navegador"
                >
                  <i class="bi bi-box-arrow-up-right"></i>
                  <span>Abrir Página</span>
                </a>
                <button
                  class="btn-hero-action secondary"
                  type="button"
                  @click="handleEditPage"
                  title="Abrir página no editor"
                >
                  <i class="bi bi-pencil-square"></i>
                  <span>Editar Página</span>
                </button>
                <button
                  class="btn-hero-action refresh-btn"
                  type="button"
                  title="Atualizar dados agora"
                  @click="refreshMetrics"
                >
                  <i class="bi bi-arrow-clockwise" :class="{ spinning: refreshing }"></i>
                </button>
              </div>
            </div>

            <!-- Hero KPI Highlight Row -->
            <div class="hero-kpis-grid" :class="pageType.toLowerCase()">
              <template v-if="pageType === 'Quiz'">
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-people-fill"></i><span>Visitantes Únicos</span></div>
                  <strong class="kpi-value">{{ metric('views') }}</strong>
                  <span class="kpi-footer">sessões no quiz</span>
                </div>
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-play-circle-fill"></i><span>Inícios do Quiz</span></div>
                  <strong class="kpi-value">{{ metric('quizStarts') }}</strong>
                  <span class="kpi-footer">iniciaram a 1ª pergunta</span>
                </div>
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-check-circle-fill"></i><span>Conclusões</span></div>
                  <strong class="kpi-value">{{ metric('quizCompletions') }}</strong>
                  <span class="kpi-footer">finalizaram todas as etapas</span>
                </div>
                <div class="hero-kpi-item highlight">
                  <div class="kpi-header"><i class="bi bi-graph-up-arrow"></i><span>Taxa de Conclusão</span></div>
                  <strong class="kpi-value highlight">{{ quizCompletionRate }}%</strong>
                  <span class="kpi-footer">conversão final</span>
                </div>
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-stopwatch-fill"></i><span>Tempo Médio</span></div>
                  <strong class="kpi-value">{{ formatDuration(metric('avgTimeSeconds')) }}</strong>
                  <span class="kpi-footer">tempo ativo na página</span>
                </div>
              </template>

              <template v-else-if="pageType === 'Funil'">
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-eye-fill"></i><span>Visualizações</span></div>
                  <strong class="kpi-value">{{ metric('views') }}</strong>
                  <span class="kpi-footer">acessos à página</span>
                </div>
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-cursor-fill"></i><span>Cliques em Botões</span></div>
                  <strong class="kpi-value">{{ metric('clicks') }}</strong>
                  <span class="kpi-footer">interações registradas</span>
                </div>
                <div class="hero-kpi-item highlight">
                  <div class="kpi-header"><i class="bi bi-graph-up-arrow"></i><span>Taxa de Conversão</span></div>
                  <strong class="kpi-value highlight">{{ clickRate }}%</strong>
                  <span class="kpi-footer">cliques / visualizações</span>
                </div>
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-stopwatch-fill"></i><span>Tempo Médio</span></div>
                  <strong class="kpi-value">{{ formatDuration(metric('avgTimeSeconds')) }}</strong>
                  <span class="kpi-footer">tempo ativo</span>
                </div>
              </template>

              <template v-else>
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-cursor-fill"></i><span>Total de Cliques</span></div>
                  <strong class="kpi-value">{{ metric('clicks') }}</strong>
                  <span class="kpi-footer">cliques registrados</span>
                </div>
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-people-fill"></i><span>Navegadores</span></div>
                  <strong class="kpi-value">{{ metric('sessions') }}</strong>
                  <span class="kpi-footer">sessões identificadas</span>
                </div>
                <div class="hero-kpi-item">
                  <div class="kpi-header"><i class="bi bi-link-45deg"></i><span>Links Rastreados</span></div>
                  <strong class="kpi-value">{{ pageButtons.length }}</strong>
                  <span class="kpi-footer">botões com métricas</span>
                </div>
              </template>
            </div>
          </section>

          <!-- ══ DETAILED SECTIONS ══ -->
          <PopupSubmissions v-if="pageType === 'Funil'" :page-id="pageId" />

          <!-- Quiz Funnel & Steps Section -->
          <section v-if="pageType === 'Quiz'" class="panel">
            <div class="panel-title">
              <div>
                <h2>Etapas e respostas do quiz</h2>
                <span class="panel-sub">Acompanhe a retenção dos usuários passo a passo</span>
              </div>
              <button
                class="export-csv-btn"
                type="button"
                :disabled="!quizSteps.length && !quizAnswers.length"
                @click="exportQuizMetrics"
              >
                <i class="bi bi-download"></i> Exportar respostas (CSV)
              </button>
            </div>
            <p v-if="!quizSteps.length" class="empty-line">As etapas aparecerão após a primeira visita ao quiz publicado.</p>
            <div v-else class="quiz-funnel">
              <article v-for="step in quizStepRows" :key="step.label">
                <div><strong>{{ step.label }}</strong><span>{{ step.visitors }} visitantes · {{ step.conversion }}% avançaram</span></div>
                <div class="quiz-funnel-bar"><i :style="{ width: `${step.width}%` }"></i></div>
                <small v-if="step.dropoff">{{ step.dropoff }} abandonos antes desta etapa</small>
              </article>
            </div>
            <div v-if="quizAnswerRows.length" class="metric-table-wrap">
              <table class="metric-table">
                <thead><tr><th>Pergunta</th><th>Resposta</th><th>Respostas</th><th>Participação</th></tr></thead>
                <tbody>
                  <tr v-for="(answer, index) in quizAnswerRows" :key="index">
                    <td><strong>{{ answer.question }}</strong></td>
                    <td>{{ answer.answer || 'Sem resposta' }}</td>
                    <td>{{ answer.count }}</td>
                    <td><span class="answer-share"><i :style="{ width: `${answer.percentage}%` }"></i></span><b>{{ answer.percentage }}%</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Email Clicks Section -->
          <section v-if="pageType === 'E-mail'" class="panel">
            <div class="panel-title">
              <div>
                <h2>Cliques do e-mail</h2>
                <span class="panel-sub">Estatísticas dos links inseridos no template</span>
              </div>
              <button
                class="export-csv-btn"
                type="button"
                :disabled="!pageButtons.length && !metric('clicks')"
                @click="exportEmailMetrics"
              >
                <i class="bi bi-download"></i> Exportar cliques (CSV)
              </button>
            </div>
            <p><strong>{{ metric('clicks') }}</strong> cliques registrados · <strong>{{ metric('sessions') }}</strong> navegadores identificados</p>
            <p class="panel-sub">Use o HTML copiado ou baixado pelo exportador para rastrear os links. Aberturas de e-mail não são medidas. Verificadores automáticos do provedor também podem acessar links.</p>
          </section>

          <!-- Funil Engagement & Publication Grid -->
          <section class="metrics-layout">
            <article v-if="pageType === 'Funil'" class="panel">
              <div class="panel-title">
                <div>
                  <h2>Engajamento</h2>
                  <span class="panel-sub">Resumo da retenção na página publicada</span>
                </div>
              </div>
              <div class="bars">
                <div class="bar-row">
                  <span>Cliques por visualização</span>
                  <strong>{{ clickRate }}%</strong>
                  <div><em :style="{ width: `${clickRate}%` }"></em></div>
                </div>
              </div>
            </article>

            <!-- Publication Details Panel -->
            <article class="panel">
              <div class="panel-title">
                <div>
                  <h2>Publicação</h2>
                  <span class="panel-sub">Status de hospedagem e domínio</span>
                </div>
              </div>
              <div class="publication-list">
                <div>
                  <span>Status</span>
                  <strong>{{ publication ? publicationStatus : 'Rascunho' }}</strong>
                </div>
                <div>
                  <span>URL temporária</span>
                  <a v-if="publication?.publicUrl" :href="publication.publicUrl" target="_blank" rel="noopener">{{ cleanUrl(publication.publicUrl) }}</a>
                  <strong v-else>Não publicada</strong>
                </div>
                <div>
                  <span>Domínio próprio</span>
                  <a v-if="publication?.customDomainUrl && publication.domainStatus === 'active'" :href="publication.customDomainUrl" target="_blank" rel="noopener">{{ cleanUrl(publication.customDomainUrl) }}</a>
                  <strong v-else>{{ publication?.customDomain || 'Não atribuído' }}</strong>
                </div>
              </div>
            </article>
          </section>

          <!-- Buttons Click Breakdown -->
          <section class="panel">
            <div class="panel-title">
              <div>
                <h2>Cliques por botão</h2>
                <span class="panel-sub">Desempenho individual das chamadas para ação (CTAs)</span>
              </div>
            </div>
            <p v-if="!pageButtons.length" class="empty-line">Nenhum clique registrado até o momento.</p>
            <div v-else class="metric-table-wrap">
              <table class="metric-table">
                <thead><tr><th>Botão</th><th>Destino</th><th>Cliques</th></tr></thead>
                <tbody>
                  <tr v-for="(button, index) in pageButtons" :key="index">
                    <td><strong>Botão — {{ button.label }}</strong></td>
                    <td>{{ button.target || '—' }}</td>
                    <td><b>{{ button.clicks }}</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </template>
      </main>
    </div>

    <!-- Notifications Modal -->
    <NotificationsModal
      :isOpen="showNotifications"
      :loading="notificationsLoading"
      :items="notifications"
      :unreadCount="notificationUnread"
      @close="showNotifications = false"
      @read-all="handleReadAllNotifications"
      @clear="handleClearNotifications"
      @select="handleSelectNotification"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue';
import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import NotificationsModal from '../components/dashboard/NotificationsModal.vue';
import PopupSubmissions from '../components/dashboard/PopupSubmissions.vue';
import { useBuilderStore } from '../composables/useBuilderStore';
import { useProductTour } from '../composables/useProductTour';
import {
  clearAuthSession,
  getAnalyticsSummary,
  getNotifications,
  getPublications,
  markAllNotificationsRead,
  clearNotifications,
  markNotificationRead
} from '../services/api';

const route = useRoute();
const router = useRouter();
const { pagesRegistry, foldersRegistry, customTemplatesRegistry, loadPage } = useBuilderStore();
const { start: startTour } = useProductTour();

const loading = ref(true);
const refreshing = ref(false);
const periodDays = ref('30');
const searchQuery = ref('');
const analytics = ref({ totals: {}, pages: [], videos: [] });
const publications = ref([]);
const lastSync = ref(new Date());

const showNotifications = ref(false);
const notifications = ref([]);
const notificationUnread = ref(0);
const notificationsLoading = ref(false);

const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('vbs_current_user') || sessionStorage.getItem('vbs_current_user') || 'null');
  } catch {
    return null;
  }
});

const funilTemplatesCount = computed(() => (customTemplatesRegistry.value || []).filter(t => !t.quizMode && !t.emailMode).length + 1);
const emailTemplatesCount = computed(() => (customTemplatesRegistry.value || []).filter(t => t.emailMode).length + 1);
const quizTemplatesCount = computed(() => (customTemplatesRegistry.value || []).filter(t => t.quizMode).length + 1);

const pageId = computed(() => String(route.params.pageId || ''));
const page = computed(() => pagesRegistry.find(item => item.id === pageId.value));
const pageMetrics = computed(() => analytics.value.pages?.find(item => item.pageId === pageId.value) || {});
const pageButtons = computed(() => (analytics.value.buttons || []).filter(button => button.pageId === pageId.value));
const quizSteps = computed(() => (analytics.value.quizSteps || []).filter(item => item.pageId === pageId.value).sort((a,b) => a.label.localeCompare(b.label, 'pt-BR', { numeric: true })));
const quizAnswers = computed(() => (analytics.value.quizAnswers || []).filter(item => item.pageId === pageId.value));
const quizCompletionRate = computed(() => metric('quizStarts') ? Math.round(metric('quizCompletions') / metric('quizStarts') * 100) : 0);

const quizStepRows = computed(() => {
  const first = Number(quizSteps.value[0]?.visitors || 0);
  return quizSteps.value.map((step, index) => {
    const previous = Number(quizSteps.value[index - 1]?.visitors || step.visitors || 0);
    return {
      ...step,
      width: first ? Math.max(4, Math.round(step.visitors / first * 100)) : 0,
      conversion: previous ? Math.round(step.visitors / previous * 100) : 100,
      dropoff: index ? Math.max(0, previous - step.visitors) : 0
    };
  });
});

const quizAnswerRows = computed(() => quizAnswers.value.map(answer => {
  const total = quizAnswers.value.filter(item => item.question === answer.question).reduce((sum, item) => sum + Number(item.count || 0), 0);
  return { ...answer, percentage: total ? Math.round(Number(answer.count || 0) / total * 100) : 0 };
}));

const publication = computed(() => publications.value.find(item => item.pageId === pageId.value));
const pageTitle = computed(() => page.value?.name || pageMetrics.value.pageName || 'Página');
const folderName = computed(() => foldersRegistry.find(folder => folder.id === page.value?.folderId)?.name || 'Sem pasta');
const pageType = computed(() => {
  const value = String(page.value?.builderMode || page.value?.type || 'funil').toLowerCase();
  if (value.includes('mail')) return 'E-mail';
  if (value.includes('quiz')) return 'Quiz';
  return 'Funil';
});

const pageTypeIcon = computed(() => {
  if (pageType.value === 'Quiz') return 'bi bi-patch-question-fill';
  if (pageType.value === 'E-mail') return 'bi bi-envelope-fill';
  return 'bi bi-funnel-fill';
});

const pageTypeHeroIcon = computed(() => {
  if (pageType.value === 'Quiz') return 'bi bi-patch-question';
  if (pageType.value === 'E-mail') return 'bi bi-envelope-paper';
  return 'bi bi-broadcast';
});

const publicationUrl = computed(() => {
  if (publication.value?.customDomainUrl && publication.value.domainStatus === 'active') return publication.value.customDomainUrl;
  return publication.value?.publicUrl || '';
});

const publicationStatus = computed(() => {
  if (publication.value?.customDomain && publication.value.domainStatus !== 'active') return 'DNS pendente';
  return 'Publicado';
});

const clickRate = computed(() => {
  const views = metric('views');
  if (!views) return 0;
  return Math.min(100, Math.round((metric('clicks') / views) * 100));
});

const lastSyncText = computed(() => {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(lastSync.value);
});

async function loadData() {
  try {
    const from = periodDays.value === 'all' ? undefined : new Date(Date.now() - Number(periodDays.value) * 86400000).toISOString();
    const [summary, publicationList, notifs] = await Promise.all([
      getAnalyticsSummary({ pageId: pageId.value, from }).catch(() => ({ totals: {}, pages: [], videos: [] })),
      getPublications().catch(() => []),
      getNotifications().catch(() => ({ items: [], unread: 0 }))
    ]);
    analytics.value = summary;
    publications.value = publicationList;
    notifications.value = notifs.items || [];
    notificationUnread.value = Number(notifs.unread || 0);
    lastSync.value = new Date();
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadData();
  metricsRefreshTimer = window.setInterval(loadData, 60000);
});
let metricsRefreshTimer;
onBeforeUnmount(() => clearInterval(metricsRefreshTimer));

async function refreshMetrics() {
  refreshing.value = true;
  await loadData();
  setTimeout(() => { refreshing.value = false; }, 400);
}

function handleSelectTab(tab) {
  if (tab === 'admin') {
    router.push('/admin');
    return;
  }
  router.push({ path: '/dashboard', query: { tab } });
}

function handleLogout() {
  clearAuthSession();
  router.push('/auth');
}

function handleOpenBuilder() {
  router.push('/builder');
}

function handleSearch(val) {
  searchQuery.value = val;
  if (val && val.trim()) {
    router.push({ path: '/dashboard', query: { tab: 'todas-paginas', q: val.trim() } });
  }
}

function handleEditPage() {
  if (page.value) {
    loadPage(page.value.id);
    router.push('/builder');
  }
}

async function openNotifications() {
  showNotifications.value = true;
  notificationsLoading.value = true;
  try {
    const data = await getNotifications();
    notifications.value = data.items || [];
    notificationUnread.value = Number(data.unread || 0);
  } catch {
    notifications.value = [];
  } finally {
    notificationsLoading.value = false;
  }
}

async function handleReadAllNotifications() {
  const data = await markAllNotificationsRead();
  notifications.value = data.items || [];
  notificationUnread.value = Number(data.unread || 0);
}

async function handleClearNotifications() {
  const data = await clearNotifications();
  notifications.value = data.items || [];
  notificationUnread.value = Number(data.unread || 0);
}

async function handleSelectNotification(item) {
  if (!item.read) {
    const data = await markNotificationRead(item.id);
    notifications.value = data.items || [];
    notificationUnread.value = Number(data.unread || 0);
  }
  showNotifications.value = false;
  if (item.action === 'create') router.push('/dashboard');
  else if (item.action === 'templates') router.push({ path: '/dashboard', query: { tab: 'templates' } });
  else if (item.action === 'projects') router.push({ path: '/dashboard', query: { tab: 'todas-paginas' } });
}

function metric(key) {
  return Number(pageMetrics.value?.[key] || 0);
}

function formatDuration(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  const min = Math.floor(value / 60);
  const sec = Math.round(value % 60);
  return min ? `${min}m ${sec}s` : `${sec}s`;
}

function cleanUrl(url) {
  return String(url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function escapeCsv(str) {
  const text = String(str ?? '');
  if (/^[=+\-@]/.test(text)) {
    return `"'${text.replace(/"/g, '""')}"`;
  }
  return `"${text.replace(/"/g, '""')}"`;
}

function exportQuizMetrics() {
  const lines = ['Tipo;Pergunta / Etapa;Resposta;Quantidade / Visitantes'];
  for (const step of quizSteps.value) {
    lines.push(`Etapa;${escapeCsv(step.label)};;${step.visitors}`);
  }
  for (const ans of quizAnswers.value) {
    lines.push(`Resposta;${escapeCsv(ans.question)};${escapeCsv(ans.answer || 'Sem resposta')};${ans.count}`);
  }
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `metricas-quiz-${pageTitle.value || 'quiz'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportEmailMetrics() {
  const lines = ['Botão / Link;Destino;Cliques'];
  for (const btn of pageButtons.value) {
    lines.push(`${escapeCsv(btn.label)};${escapeCsv(btn.target || '')};${btn.clicks}`);
  }
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cliques-email-${pageTitle.value || 'email'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<style scoped>
.metrics-period{min-height:38px;padding:0 10px;border:1px solid var(--color-border);border-radius:9px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:11px;font-weight:700}
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--color-surface-soft);
  color: var(--color-text);
  font-family: var(--font-sans);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  height: 100%;
}

.metrics-content-area {
  flex: 1;
  height: 100%;
  min-height: 0;
  overflow-y: auto !important;
  overflow-x: hidden;
  padding: 28px 32px 64px;
  scroll-behavior: smooth;
  width: 100%;
  box-sizing: border-box;
}

/* ══ HERO CARD ══ */
.metrics-hero-card {
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
  padding: 24px 28px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.hero-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.btn-hero-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-hero-back:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  border-color: var(--color-primary);
}

.hero-badges {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  border: 1px solid var(--color-primary-bright);
}

.badge-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 800;
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.badge-status.online {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border-color: rgba(16, 185, 129, 0.3);
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2);
}

.hero-main-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.hero-info {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
}

.hero-icon-box {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 26px;
  flex-shrink: 0;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  border: 1px solid var(--color-primary-bright);
}

.hero-headings {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.hero-eyebrow {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.hero-title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.15;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-meta-details {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 12.5px;
  font-weight: 600;
  flex-wrap: wrap;
}

.hero-meta-details span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-hero-action {
  min-height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-hero-action.primary {
  background: var(--color-primary);
  color: #fff;
  border: 1px solid var(--color-primary);
}

.btn-hero-action.primary:hover {
  background: var(--color-primary-hover);
}

.btn-hero-action.secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border-strong);
}

.btn-hero-action.secondary:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  border-color: var(--color-primary);
}

.btn-hero-action.icon-only, .btn-hero-action.refresh-btn {
  width: 40px;
  min-height: 40px;
  padding: 0;
  display: grid;
  place-items: center;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  font-size: 16px;
}

.btn-hero-action.refresh-btn:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  border-color: var(--color-primary);
}

/* ══ HERO KPIS GRID ══ */
.hero-kpis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--color-border);
}

.hero-kpi-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-surface-soft);
  transition: all 0.15s ease;
}

.hero-kpi-item:hover {
  border-color: var(--color-primary-bright);
  background: var(--color-surface);
}

.hero-kpi-item.highlight {
  border-color: rgba(99, 102, 241, 0.4);
  background: var(--color-primary-soft);
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--color-text-muted);
  font-size: 11.5px;
  font-weight: 700;
}

.kpi-header i {
  color: var(--color-primary-strong);
  font-size: 13px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 900;
  line-height: 1.1;
  color: var(--color-text);
}

.kpi-value.highlight {
  color: var(--color-primary-strong);
}

.kpi-footer {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 600;
}

/* ══ PANELS & DETAILED METRICS ══ */
.panel, .state-box {
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
}

.panel {
  padding: 22px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  width: 100%;
  box-sizing: border-box;
}

.panel-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.panel-title h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text);
}

.panel-sub {
  display: block;
  margin-top: 3px;
  color: var(--color-text-muted);
  font-size: 12.5px;
  font-weight: 600;
}

.export-csv-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 15px;
  border: 1px solid var(--color-border);
  border-radius: 9px;
  background: var(--color-surface);
  color: var(--color-primary);
  font: inherit;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.export-csv-btn:hover:not(:disabled) {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary);
}

.export-csv-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Quiz Funnel Bars */
.quiz-funnel {
  display: grid;
  gap: 14px;
  margin-bottom: 24px;
}

.quiz-funnel article {
  display: grid;
  grid-template-columns: minmax(180px, 0.45fr) 1fr auto;
  align-items: center;
  gap: 14px;
}

.quiz-funnel article > div:first-child {
  display: grid;
  gap: 3px;
}

.quiz-funnel article span,
.quiz-funnel small {
  color: var(--color-text-muted);
  font-size: 11px;
}

.quiz-funnel small {
  min-width: 155px;
  text-align: right;
}

.quiz-funnel-bar {
  height: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-primary-soft);
}

.quiz-funnel-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-bright));
}

/* Tables */
.metric-table-wrap {
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: 14px;
}

.metric-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;
}

.metric-table th,
.metric-table td {
  padding: 13px 16px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  font-size: 13px;
}

.metric-table th {
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-table tr:last-child td {
  border-bottom: 0;
}

.metric-table td:last-child {
  display: flex;
  align-items: center;
  gap: 10px;
}

.answer-share {
  width: 100px;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-primary-soft);
}

.answer-share i {
  display: block;
  height: 100%;
  background: var(--color-primary);
}

/* Funil Layout */
.metrics-layout {
  display: grid;
  grid-template-columns: 1.35fr 0.85fr;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.bars {
  display: grid;
  gap: 16px;
}

.bar-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 14px;
  color: var(--color-text-secondary);
  font-size: 12.5px;
  font-weight: 800;
}

.bar-row div {
  grid-column: 1 / -1;
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-primary-soft);
}

.bar-row em {
  display: block;
  height: 100%;
  max-width: 100%;
  border-radius: inherit;
  background: var(--color-primary);
}

/* Publication Details */
.publication-list {
  display: grid;
  gap: 15px;
}

.publication-list div {
  display: grid;
  gap: 4px;
}

.publication-list span {
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.publication-list strong,
.publication-list a {
  overflow: hidden;
  color: var(--color-text);
  font-size: 13.5px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
}

.publication-list a {
  color: var(--color-primary-strong);
}

.publication-list a:hover {
  text-decoration: underline;
}

/* Video Table */
.video-table {
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: 14px;
}

.video-head,
.video-table article {
  min-width: 680px;
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 90px 140px 120px;
  gap: 12px;
  align-items: center;
  padding: 13px 16px;
  border-bottom: 1px solid var(--color-border);
}

.video-head {
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.video-table article:last-child {
  border-bottom: 0;
}

.video-table strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.video-table span {
  color: var(--color-text-secondary);
  font-size: 12.5px;
  font-weight: 700;
}

.empty-line {
  padding: 24px 20px;
  border: 1px dashed var(--color-border-strong);
  border-radius: 12px;
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  margin: 4px 0 0;
}

.state-box {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--color-text-muted);
  text-align: center;
  margin-top: 24px;
}

.state-box i {
  color: var(--color-primary);
  font-size: 34px;
}

.state-box strong {
  color: var(--color-text);
  font-size: 16px;
}

.btn-back-dashboard {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 1080px) {
  .metrics-layout {
    grid-template-columns: 1fr;
  }
  .quiz-funnel article {
    grid-template-columns: 1fr;
  }
  .quiz-funnel small {
    text-align: left;
  }
}

@media (max-width: 760px) {
  .app-layout {
    height: auto;
    min-height: 100vh;
    flex-direction: column;
    overflow: visible;
  }
  .main-wrapper {
    width: 100%;
    min-width: 0;
    overflow: visible;
  }
  .metrics-content-area {
    padding: 18px 14px 40px;
    overflow: visible;
  }
  .hero-main-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .hero-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  .hero-actions .btn-hero-action:not(.icon-only) {
    flex: 1;
    justify-content: center;
  }
}
</style>
