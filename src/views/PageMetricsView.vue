<template>
  <main class="metrics-page">
    <header class="metrics-header">
      <button class="back-button" type="button" @click="router.push('/dashboard')">
        <i class="bi bi-arrow-left"></i>
        <span>Voltar</span>
      </button>
      <div>
        <span class="eyebrow">Métricas da página</span>
        <h1>{{ pageTitle }}</h1>
        <p>{{ folderName }} · {{ pageType }}</p>
      </div>
      <a v-if="publicationUrl" class="open-page" :href="publicationUrl" target="_blank" rel="noopener">
        <i class="bi bi-box-arrow-up-right"></i>
        <span>Abrir página</span>
      </a>
    </header>

    <section v-if="loading" class="state-box">
      <i class="bi bi-arrow-repeat"></i>
      <span>Carregando métricas...</span>
    </section>

    <section v-else-if="!page" class="state-box">
      <i class="bi bi-exclamation-circle"></i>
      <strong>Página não encontrada</strong>
      <span>Ela pode ter sido excluída ou ainda não sincronizou com o dashboard.</span>
    </section>

    <template v-else>
      <PopupSubmissions v-if="pageType === 'Funil'" :page-id="pageId" />
      <section v-if="pageType === 'Quiz'" class="metric-grid">
        <article><strong>{{ metric('views') }}</strong><span>visitantes</span></article>
        <article><strong>{{ metric('quizStarts') }}</strong><span>inícios do quiz</span></article>
        <article><strong>{{ metric('quizCompletions') }}</strong><span>conclusões</span></article>
        <article><strong>{{ metric('quizStarts') ? Math.round(metric('quizCompletions') / metric('quizStarts') * 100) : 0 }}%</strong><span>taxa de conclusão</span></article>
        <article><strong>{{ formatDuration(metric('avgTimeSeconds')) }}</strong><span>tempo médio ativo</span></article>
      </section>
      <section v-if="pageType === 'Quiz'" class="panel">
        <div class="panel-title">
          <h2>Etapas e respostas do quiz</h2>
          <button
            class="export-csv-btn"
            type="button"
            :disabled="!quizSteps.length && !quizAnswers.length"
            @click="exportQuizMetrics"
          >
            <i class="bi bi-download"></i> Exportar respostas (CSV)
          </button>
        </div>
        <p v-if="!quizSteps.length">As etapas aparecerão após a primeira visita ao quiz publicado.</p>
        <table v-else><thead><tr><th>Etapa</th><th>Visitantes</th></tr></thead><tbody><tr v-for="step in quizSteps" :key="step.label"><td>{{ step.label }}</td><td>{{ step.visitors }}</td></tr></tbody></table>
        <table v-if="quizAnswers.length"><thead><tr><th>Pergunta</th><th>Resposta</th><th>Quantidade</th></tr></thead><tbody><tr v-for="(answer,index) in quizAnswers" :key="index"><td>{{ answer.question }}</td><td>{{ answer.answer || 'Sem resposta' }}</td><td>{{ answer.count }}</td></tr></tbody></table>
      </section>
      <section v-if="pageType === 'E-mail'" class="panel">
        <div class="panel-title">
          <h2>Cliques do e-mail</h2>
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
        <p>Use o HTML copiado ou baixado pelo exportador para rastrear os links. Aberturas de e-mail não são medidas. Verificadores automáticos do provedor também podem acessar links.</p>
      </section>
      <section v-if="pageType === 'Funil'" class="metric-grid">
        <article>
          <i class="bi bi-eye"></i>
          <strong>{{ metric('views') }}</strong>
          <span>visualizações</span>
        </article>
        <article>
          <i class="bi bi-cursor-fill"></i>
          <strong>{{ metric('clicks') }}</strong>
          <span>cliques nos botões</span>
        </article>
        <article>
          <i class="bi bi-arrow-down"></i>
          <strong>{{ metric('maxScroll') }}%</strong>
          <span>maior rolagem</span>
        </article>
        <article>
          <i class="bi bi-stopwatch"></i>
          <strong>{{ formatDuration(metric('avgTimeSeconds')) }}</strong>
          <span>tempo médio</span>
        </article>
        <article>
          <i class="bi bi-input-cursor-text"></i>
          <strong>{{ metric('forms') }}</strong>
          <span>envios de formulário</span>
        </article>
        <article>
          <i class="bi bi-play-btn-fill"></i>
          <strong>{{ metric('videoPlays') }}</strong>
          <span>plays de vídeo</span>
        </article>
      </section>

      <section class="metrics-layout">
        <article v-if="pageType === 'Funil'" class="panel">
          <div class="panel-title">
            <h2>Engajamento</h2>
            <span>Resumo da página publicada</span>
          </div>
          <div class="bars">
            <div class="bar-row">
              <span>Cliques por visualização</span>
              <strong>{{ clickRate }}%</strong>
              <div><em :style="{ width: `${clickRate}%` }"></em></div>
            </div>
            <div class="bar-row">
              <span>Rolagem máxima</span>
              <strong>{{ metric('maxScroll') }}%</strong>
              <div><em :style="{ width: `${metric('maxScroll')}%` }"></em></div>
            </div>
            <div class="bar-row">
              <span>Conclusão de vídeo</span>
              <strong>{{ videoCompletionRate }}%</strong>
              <div><em :style="{ width: `${videoCompletionRate}%` }"></em></div>
            </div>
          </div>
        </article>

        <article class="panel">
          <div class="panel-title">
            <h2>Publicação</h2>
            <span>Status e destino</span>
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

      <section class="panel">
        <div class="panel-title">
          <h2>Cliques por botão</h2>
        </div>
        <p v-if="!pageButtons.length">Nenhum clique registrado.</p>
        <table v-else><thead><tr><th>Botão</th><th>Destino</th><th>Cliques</th></tr></thead><tbody>
          <tr v-for="(button, index) in pageButtons" :key="index"><td>Botão — {{ button.label }}</td><td>{{ button.target || '—' }}</td><td>{{ button.clicks }}</td></tr>
        </tbody></table>
      </section>

      <section v-if="pageType === 'Funil'" class="panel">
        <div class="panel-heading">
          <h2>Vídeos desta página</h2>
          <span>{{ pageVideos.length }} {{ pageVideos.length === 1 ? 'vídeo rastreado' : 'vídeos rastreados' }}</span>
        </div>
        <div v-if="!pageVideos.length" class="empty-line">
          Os vídeos aparecem depois que uma página publicada receber plays rastreáveis.
        </div>
        <div v-else class="video-table">
          <div class="video-head">
            <span>Vídeo</span>
            <span>Plays</span>
            <span>Média assistida</span>
            <span>Conclusões</span>
          </div>
          <article v-for="video in pageVideos" :key="`${video.pageId}-${video.target}`">
            <strong>{{ video.target }}</strong>
            <span>{{ video.plays || 0 }}</span>
            <span>{{ formatDuration(video.avgWatchedSeconds || 0) }}</span>
            <span>{{ video.completions || 0 }}</span>
          </article>
        </div>
      </section>
    </template>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import PopupSubmissions from '../components/dashboard/PopupSubmissions.vue';
import { useRoute, useRouter } from 'vue-router';
import { useBuilderStore } from '../composables/useBuilderStore';
import { getAnalyticsSummary, getPublications } from '../services/api';

const route = useRoute();
const router = useRouter();
const { pagesRegistry, foldersRegistry } = useBuilderStore();
const loading = ref(true);
const analytics = ref({ totals: {}, pages: [], videos: [] });
const publications = ref([]);

const pageId = computed(() => String(route.params.pageId || ''));
const page = computed(() => pagesRegistry.find(item => item.id === pageId.value));
const pageMetrics = computed(() => analytics.value.pages?.find(item => item.pageId === pageId.value) || {});
const pageVideos = computed(() => (analytics.value.videos || []).filter(video => video.pageId === pageId.value));
const pageButtons = computed(() => (analytics.value.buttons || []).filter(button => button.pageId === pageId.value));
const quizSteps = computed(() => (analytics.value.quizSteps || []).filter(item => item.pageId === pageId.value).sort((a,b) => a.label.localeCompare(b.label, 'pt-BR', { numeric: true })));
const quizAnswers = computed(() => (analytics.value.quizAnswers || []).filter(item => item.pageId === pageId.value));
const publication = computed(() => publications.value.find(item => item.pageId === pageId.value));
const pageTitle = computed(() => page.value?.name || pageMetrics.value.pageName || 'Página');
const folderName = computed(() => foldersRegistry.find(folder => folder.id === page.value?.folderId)?.name || 'Sem pasta');
const pageType = computed(() => {
  const value = String(page.value?.builderMode || page.value?.type || 'funil').toLowerCase();
  if (value.includes('mail')) return 'E-mail';
  if (value.includes('quiz')) return 'Quiz';
  return 'Funil';
});
const publicationUrl = computed(() => {
  if (publication.value?.customDomainUrl && publication.value.domainStatus === 'active') return publication.value.customDomainUrl;
  return publication.value?.publicUrl || '';
});
const publicationStatus = computed(() => {
  if (publication.value?.customDomain && publication.value.domainStatus !== 'active') return 'Publicado, DNS pendente';
  return 'Publicado';
});
const clickRate = computed(() => {
  const views = metric('views');
  if (!views) return 0;
  return Math.min(100, Math.round((metric('clicks') / views) * 100));
});
const videoCompletionRate = computed(() => {
  const plays = metric('videoPlays');
  if (!plays) return 0;
  return Math.min(100, Math.round((metric('videoCompletions') / plays) * 100));
});

onMounted(async () => {
  try {
    const [summary, publicationList] = await Promise.all([
      getAnalyticsSummary().catch(() => ({ totals: {}, pages: [], videos: [] })),
      getPublications().catch(() => [])
    ]);
    analytics.value = summary;
    publications.value = publicationList;
  } finally {
    loading.value = false;
  }
});

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
.metrics-page { min-height:100vh; padding:28px; background:var(--color-surface-soft); color:var(--color-text); font-family:var(--font-sans); }
.metrics-header { display:grid; grid-template-columns:auto 1fr auto; gap:18px; align-items:center; margin-bottom:22px; padding:22px; border:1px solid var(--color-border); border-radius:18px; background:var(--color-surface); }
.back-button, .open-page { min-height:38px; display:inline-flex; align-items:center; justify-content:center; gap:8px; border:1px solid var(--color-border); border-radius:10px; background:var(--color-surface); color:var(--color-text-secondary); font:inherit; font-size:13px; font-weight:900; text-decoration:none; cursor:pointer; }
.back-button { width:94px; }
.open-page { padding:0 14px; color:var(--color-primary-strong); }
.eyebrow { display:block; margin-bottom:4px; color:var(--color-primary-strong); font-size:10px; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
h1 { margin:0; font-size:25px; line-height:1.1; }
.metrics-header p { margin:5px 0 0; color:var(--color-text-muted); font-size:13px; font-weight:700; }
.metric-grid { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:12px; margin-bottom:16px; }
.metric-grid article { display:grid; grid-template-columns:38px 1fr; gap:4px 10px; align-items:center; padding:15px; border:1px solid var(--color-border); border-radius:14px; background:var(--color-surface); }
.export-csv-btn { display:inline-flex; align-items:center; gap:7px; padding:7px 13px; border:1px solid var(--color-border); border-radius:8px; background:var(--color-surface); color:var(--color-primary); font:inherit; font-size:12px; font-weight:700; cursor:pointer; transition:all .15s ease; }
.export-csv-btn:hover:not(:disabled) { background:var(--color-primary-subtle); border-color:var(--color-primary); }
.export-csv-btn:disabled { opacity:.45; cursor:not-allowed; }
.metric-grid i { grid-row:1/3; width:38px; height:38px; display:grid; place-items:center; border-radius:10px; background:var(--color-primary-soft); color:var(--color-primary-strong); }
.metric-grid strong { font-size:21px; line-height:1; }
.metric-grid span { color:var(--color-text-muted); font-size:11px; font-weight:800; }
.metrics-layout { display:grid; grid-template-columns:1.35fr .85fr; gap:16px; margin-bottom:16px; }
.panel, .state-box { border:1px solid var(--color-border); border-radius:16px; background:var(--color-surface); }
.panel { padding:18px; }
.panel-title { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; margin-bottom:16px; }
.panel-title h2 { margin:0; font-size:16px; }
.panel-title span { color:var(--color-text-muted); font-size:12px; font-weight:800; }
.bars { display:grid; gap:16px; }
.bar-row { display:grid; grid-template-columns:1fr auto; gap:8px 14px; color:var(--color-text-secondary); font-size:12px; font-weight:800; }
.bar-row div { grid-column:1/-1; height:9px; overflow:hidden; border-radius:999px; background:var(--color-primary-soft); }
.bar-row em { display:block; height:100%; max-width:100%; border-radius:inherit; background:var(--color-primary); }
.publication-list { display:grid; gap:13px; }
.publication-list div { display:grid; gap:4px; }
.publication-list span { color:var(--color-text-muted); font-size:11px; font-weight:900; text-transform:uppercase; }
.publication-list strong, .publication-list a { overflow:hidden; color:var(--color-text); font-size:13px; font-weight:900; text-overflow:ellipsis; white-space:nowrap; text-decoration:none; }
.publication-list a { color:var(--color-primary-strong); }
.video-table { overflow:auto; border:1px solid var(--color-border); border-radius:12px; }
.video-head, .video-table article { min-width:680px; display:grid; grid-template-columns:minmax(220px,1fr) 90px 140px 120px; gap:12px; align-items:center; padding:12px 14px; border-bottom:1px solid var(--color-border); }
.video-head { color:var(--color-text-muted); font-size:10px; font-weight:900; text-transform:uppercase; }
.video-table article:last-child { border-bottom:0; }
.video-table strong { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; }
.video-table span { color:var(--color-text-secondary); font-size:12px; font-weight:800; }
.empty-line { padding:18px; color:var(--color-text-muted); text-align:center; font-size:12px; }
.state-box { min-height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; color:var(--color-text-muted); text-align:center; }
.state-box i { color:var(--color-primary); font-size:30px; }
.state-box strong { color:var(--color-text); }
@media(max-width:1080px){.metric-grid{grid-template-columns:repeat(3,1fr)}.metrics-layout{grid-template-columns:1fr}}
@media(max-width:640px){.metrics-page{padding:18px}.metrics-header{grid-template-columns:1fr}.back-button{width:auto}.open-page{width:100%}.metric-grid{grid-template-columns:1fr}.panel-title{display:grid}}
</style>
