<template>
  <div class="app-layout">
    <DashboardSidebar
      :activeTab="activeTab"
      :pagesCount="pagesRegistry.length"
      :foldersCount="foldersRegistry.length"
      :templatesCount="customTemplatesRegistry.length"
      :funilTemplatesCount="funilTemplatesCount"
      :emailTemplatesCount="emailTemplatesCount"
      :quizTemplatesCount="quizTemplatesCount"
      :currentUser="currentUser"
      @select-tab="setActiveTab"
      @logout="handleAuthNavigate"
    />

    <div class="main-wrapper">
      <DashboardHeader
        v-model:searchQuery="searchQuery"
        :unreadCount="notificationUnread"
        :pagesCount="pagesRegistry.length"
        :maxPages="planUsage.maxPages"
        @open-builder="handleOpenBuilder"
        @notify="openNotifications"
        @start-tour="startTour"
      />

      <main class="content-area">

        <!-- ══ PÁGINA INICIAL ══ -->
        <template v-if="activeTab === 'home'">
          <div class="page-header-title">
            <div class="title-group">
              <h1>Seus projetos</h1>
              <p>Escolha uma pasta para acessar e organizar as páginas do projeto</p>
            </div>
          </div>
          <div class="home-overview-grid">
            <FoldersGrid
              :folders="foldersRegistry"
              :publications="publications"
              @open-folder="openFolder"
              @create-folder="showFolderModal = true"
              @rename-folder="handleRenameFolder"
              @delete-folder="handleDeleteFolder"
            />
            <aside class="recent-activity" aria-label="Últimas atualizações">
              <div class="activity-heading">
                <div>
                  <span class="activity-eyebrow">ATIVIDADE</span>
                  <h2>Últimas atualizações</h2>
                </div>
                <button type="button" title="Ver notificações" @click="openNotifications"><i class="bi bi-arrow-up-right"></i></button>
              </div>
              <div v-if="homeActivity.length" class="activity-list">
                <article v-for="item in homeActivity" :key="item.id" class="activity-item">
                  <span class="activity-icon" :class="`is-${item.type}`"><i :class="activityIcon(item.type)"></i></span>
                  <div><strong>{{ item.title }}</strong><p>{{ item.message }}</p><time>{{ formatDate(item.createdAt) }}</time></div>
                </article>
              </div>
              <div v-else class="activity-empty">
                <i class="bi bi-clock-history"></i>
                <strong>Nenhuma atualização ainda</strong>
                <p>Salvamentos, publicações e alterações de DNS aparecerão aqui.</p>
              </div>
            </aside>
          </div>
        </template>

        <!-- ══ PÁGINAS ══ -->
        <template v-else-if="activeTab === 'todas-paginas'">
          <div class="page-header-title">
            <div class="title-group">
              <h1>Páginas</h1>
              <p>{{ countLabel(filteredPages.length, 'página encontrada', 'páginas encontradas') }}</p>
            </div>
            <div class="header-right-row">
              <button class="btn-create-new" @click="openCreateModal()">
                <i class="bi bi-plus-circle-fill"></i> Nova Página
              </button>
            </div>
          </div>

          <AnalyticsOverview
            :totals="analyticsSummary.totals || {}"
            :pages="analyticsSummary.pages || []"
            :videos="analyticsSummary.videos || []"
          />
          <PagesByFolderSection
            :folderGroups="pagesFolderGroups"
            @create-new="openCreateModal()"
            @see-all-folder="openFolderById"
            @edit-page="handleEditPage"
            @more-options="showPageOptions"
            @publish-page="handlePublishPage"
            @edit-folder-domain="handleFolderDomainById"
            @open-publication="openPublicationUrl"
            @open-metrics="openPageMetrics"
          />
        </template>

        <!-- ══ PASTAS ══ -->
        <template v-else-if="activeTab === 'pastas'">
          <template v-if="!selectedFolder">
            <div class="page-header-title">
              <div class="title-group">
                <h1>Minhas Pastas</h1>
                <p>{{ countLabel(foldersRegistry.length, 'pasta criada', 'pastas criadas') }}</p>
              </div>
              <button class="btn-create-new" @click="showFolderModal = true">
                <i class="bi bi-folder-plus"></i> Nova pasta
              </button>
            </div>
            <FoldersGrid
              :folders="foldersRegistry"
              :publications="publications"
              @open-folder="openFolder"
              @create-folder="showFolderModal = true"
              @rename-folder="handleRenameFolder"
              @delete-folder="handleDeleteFolder"
            />
          </template>

          <template v-else>
            <FolderDetail
              :folder="selectedFolder"
              :pages="selectedFolderPages"
              :publications="publications"
              @back="selectedFolder = null"
              @open-builder="openCreateModal(selectedFolder.id)"
              @edit-page="handleEditPage"
              @more-options="showPageOptions"
              @download-folder="downloadSelectedFolder"
              @edit-folder="handleRenameFolder"
              @edit-domain="handleFolderDomain"
              @publish-page="handlePublishPage"
              @open-publication="openPublicationUrl"
              @open-metrics="openPageMetrics"
            />
          </template>
        </template>

        <!-- ══ TODOS OS TEMPLATES ══ -->
        <template v-else-if="activeTab === 'templates'">
          <div class="page-header-title template-library-header">
            <div class="title-group">
              <h1>Biblioteca de Templates</h1>
              <p>Escolha entre todos os modelos, funis VSL ou e-mails</p>
            </div>
            <div class="template-filter-tabs">
              <button :class="{ active: templateLibraryFilter === 'all' }" @click="templateLibraryFilter = 'all'">Todos</button>
              <button :class="{ active: templateLibraryFilter === 'funil' }" @click="templateLibraryFilter = 'funil'">VSL / Funil</button>
              <button :class="{ active: templateLibraryFilter === 'email' }" @click="templateLibraryFilter = 'email'">E-mail</button>
              <button :class="{ active: templateLibraryFilter === 'quiz' }" @click="templateLibraryFilter = 'quiz'">Quiz</button>
            </div>
          </div>
          <TemplatesGrid v-if="['all','funil'].includes(templateLibraryFilter)" templateType="funil" @use-template="handleOpenBuilder" />
          <TemplatesGrid v-if="['all','email'].includes(templateLibraryFilter)" templateType="email" @use-template="handleOpenBuilder" />
          <TemplatesGrid v-if="['all','quiz'].includes(templateLibraryFilter)" templateType="quiz" @use-template="handleOpenBuilder" />
        </template>

        <!-- ══ TEMPLATES DE FUNIL ══ -->
        <template v-else-if="activeTab === 'templates-funil'">
          <div class="page-header-title">
            <div class="title-group">
              <h1>Biblioteca: Templates de Funil</h1>
              <p>Clique em um template para abrir no Construtor Visual</p>
            </div>
          </div>
          <TemplatesGrid templateType="funil" @use-template="handleOpenBuilder" />
        </template>

        <!-- ══ TEMPLATES DE E-MAIL ══ -->
        <template v-else-if="activeTab === 'templates-email'">
          <div class="page-header-title">
            <div class="title-group">
              <h1>Biblioteca: Templates de E-mail</h1>
              <p>Templates com estrutura fixa de 600px para e-mail marketing</p>
            </div>
          </div>
          <TemplatesGrid templateType="email" @use-template="handleOpenBuilder" @switch-funnel="setActiveTab('templates-funil')" />
        </template>
        <template v-else-if="activeTab === 'templates-quiz'"><div class="page-header-title"><div class="title-group"><h1>Biblioteca: Templates de Quiz</h1><p>Modelos interativos com perguntas, análise e resultado</p></div></div><TemplatesGrid templateType="quiz" @use-template="handleOpenBuilder" /></template>

        <SettingsPanel v-else-if="activeTab === 'settings' || activeTab === 'profile'" />
        <BackupsPanel v-else-if="activeTab === 'backups'" />
        <PlansPanel v-else-if="activeTab === 'plans' || activeTab === 'billing'" @open-support="setActiveTab('support')" />
        <SupportPanel v-else-if="activeTab === 'support'" />
        <EmailCampaignsPanel v-else-if="activeTab === 'email-campaigns'" />
      </main>
    </div>

    <!-- Modals -->
    <CreateNewModal
      ref="createModalRef"
      :isOpen="showCreateModal"
      :initialFolderId="creationFolderId"
      @close="showCreateModal = false"
      @created="handlePageCreated"
    />

    <PageActionsModal
      :isOpen="Boolean(pageOptionsTarget)"
      :page="pageOptionsTarget"
      :folders="foldersRegistry"
      @close="pageOptionsTarget = null"
      @save="handleSavePageOptions"
      @edit="handleEditFromOptions"
      @delete="handleDeletePage"
      @unpublish="handleUnpublishPage"
      @open-publication="handleOpenPublicationFromOptions"
      @open-metrics="handleOpenMetricsFromOptions"
      @open-dns="handleOpenDnsFromOptions"
      @publish-page="handlePublishFromOptions"
    />

    <DnsModal
      :isOpen="Boolean(dnsTargetPage)"
      :page="dnsTargetPage"
      @close="dnsTargetPage = null"
      @save="handleSaveDns"
      @verify="handleVerifyDns"
    />

    <ConfirmModal
      :isOpen="Boolean(confirmAction)"
      :title="confirmAction?.title"
      :message="confirmAction?.message"
      :confirmLabel="confirmAction?.confirmLabel"
      :icon="confirmAction?.icon"
      @cancel="confirmAction = null"
      @confirm="runConfirmAction"
    />

    <FolderModal
      :isOpen="showFolderModal"
      :mode="folderModalMode"
      :folder="folderBeingRenamed"
      @close="closeFolderModal"
      @done="handleFolderDone"
    />

    <NotificationsModal
      :isOpen="showNotifications"
      :items="notifications"
      :unreadCount="notificationUnread"
      :loading="notificationsLoading"
      @close="showNotifications = false"
      @read-all="readAllNotifications"
      @clear="clearAllNotifications"
      @select="selectNotification"
    />

  </div>
</template>

<script setup>
import { nextTick, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBuilderStore } from '../composables/useBuilderStore';

import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue';
import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import PagesByFolderSection from '../components/dashboard/PagesByFolderSection.vue';
import AnalyticsOverview from '../components/dashboard/AnalyticsOverview.vue';
import FoldersGrid from '../components/dashboard/FoldersGrid.vue';
import TemplatesGrid from '../components/dashboard/TemplatesGrid.vue';
import FolderDetail from '../components/dashboard/FolderDetail.vue';
import CreateNewModal from '../components/dashboard/CreateNewModal.vue';
import PageActionsModal from '../components/dashboard/PageActionsModal.vue';
import DnsModal from '../components/dashboard/DnsModal.vue';
import ConfirmModal from '../components/dashboard/ConfirmModal.vue';
import FolderModal from '../components/dashboard/FolderModal.vue';
import NotificationsModal from '../components/dashboard/NotificationsModal.vue';
import SettingsPanel from '../components/dashboard/SettingsPanel.vue';
import PlansPanel from '../components/dashboard/PlansPanel.vue';
import BackupsPanel from '../components/dashboard/BackupsPanel.vue';
import EmailCampaignsPanel from '../components/dashboard/EmailCampaignsPanel.vue';
import SupportPanel from '../components/dashboard/SupportPanel.vue';
import { PRODUCT_TOUR_EVENT, useProductTour } from '../composables/useProductTour';
import { clearAuthSession, clearNotifications, deletePublication, getAnalyticsSummary, getNotifications, getPublications, markAllNotificationsRead, markNotificationRead, publishPage, verifyPublicationDomain } from '../services/api';
import { generateExportedHTML } from '../utils/htmlExporter';
import { createZipBlob, safeFileName } from '../utils/zip';

const router = useRouter();
const { state: tourState, start: beginTour } = useProductTour();
const {
  showToast, loadTemplate, loadPage, deleteFolder, newBlankCanvas,
  pagesRegistry, foldersRegistry, customTemplatesRegistry, flushWorkspaceToBackend, updatePageDetails, closeTemplateBuilder, deletePage,
  planUsage, loadPlanLimits
} = useBuilderStore();

const requestedDashboardTab = sessionStorage.getItem('vbs_dashboard_tab');
const activeTab = ref(requestedDashboardTab || 'home');
if (requestedDashboardTab) sessionStorage.removeItem('vbs_dashboard_tab');
const searchQuery = ref('');
const selectedFolder = ref(null);

async function startTour() {
  activeTab.value = 'home';
  selectedFolder.value = null;
  showCreateModal.value = false;
  showFolderModal.value = false;
  await nextTick();
  beginTour(0);
}
const showCreateModal = ref(false);
const creationFolderId = ref('');
const pageOptionsTarget = ref(null);
const dnsTargetPage = ref(null);
const confirmAction = ref(null);
const templateLibraryFilter = ref('all');
const showFolderModal = ref(false);
const folderModalMode = ref('create');
const folderBeingRenamed = ref(null);
const createPageAfterFolder = ref(false);
const createModalRef = ref(null);
const showNotifications = ref(false);
const notificationsLoading = ref(false);
const notifications = ref([]);
const notificationUnread = ref(0);
const publications = ref([]);
const analyticsSummary = ref({ totals: {}, pages: [], videos: [] });

const profileRevision = ref(0);
const refreshProfile = () => { profileRevision.value += 1; };
onMounted(() => window.addEventListener('profile-updated', refreshProfile));
// O teto do plano pode ter mudado desde o carregamento do workspace.
onMounted(() => { loadPlanLimits(); });
onUnmounted(() => window.removeEventListener('profile-updated', refreshProfile));
const currentUser = computed(() => {
  void profileRevision.value;
  try {
    return JSON.parse(localStorage.getItem('vbs_current_user') || sessionStorage.getItem('vbs_current_user') || 'null');
  } catch (error) {
    return null;
  }
});
const tourSeenKey = computed(() => {
  const identifier = currentUser.value?.id || currentUser.value?.email || 'anonymous';
  return `vbs_tour_seen_${String(identifier).toLowerCase()}`;
});

async function handleTourAction(event) {
  const action = event.detail?.action;
  if (action === 'open-create') {
    openCreateModal();
    return;
  }

  if (action === 'continue-create-type') {
    openCreateModal();
    await nextTick();
    createModalRef.value?.goToDetailsFromTour?.();
    return;
  }

  if (action === 'create-demo-page') {
    openCreateModal();
    await nextTick();
    createModalRef.value?.createFromTour?.();
    return;
  }

  if (action === 'cancel-tour') {
    showCreateModal.value = false;
  }
}

let tourIntroTimer;
let dashboardRefreshTimer;
onMounted(() => {
  window.addEventListener(PRODUCT_TOUR_EVENT, handleTourAction);
  if (localStorage.getItem(tourSeenKey.value) !== 'true') {
    localStorage.setItem(tourSeenKey.value, 'true');
    tourIntroTimer = setTimeout(() => startTour(), 650);
  }
  loadNotifications();
  loadPublications();
  loadAnalyticsSummary();
  dashboardRefreshTimer = window.setInterval(() => { loadNotifications(); loadPublications(); loadAnalyticsSummary(); }, 60000);
});
onUnmounted(() => {
  window.removeEventListener(PRODUCT_TOUR_EVENT, handleTourAction);
  clearTimeout(tourIntroTimer);
  clearInterval(dashboardRefreshTimer);
});

// ─── Navigation ──────────────────────────────────────────────────────────────
function setActiveTab(tab) {
  if (tab === 'admin') {
    router.push('/admin');
    return;
  }
  activeTab.value = tab;
  selectedFolder.value = null;
  if (tab === 'todas-paginas') loadAnalyticsSummary();
}

function openCreateModal(folderId = null) {
  if (!foldersRegistry.length) {
    createPageAfterFolder.value = true;
    folderModalMode.value = 'create';
    folderBeingRenamed.value = null;
    showFolderModal.value = true;
    showToast('Crie uma pasta antes de criar a página.', 'info');
    return;
  }
  creationFolderId.value = folderId || '';
  showCreateModal.value = true;
}

function handleFolderDone(folder) {
  showFolderModal.value = false;
  if (tourState.open && folder?.id) {
    createPageAfterFolder.value = false;
    openFolder(folder);
    return;
  }
  if (createPageAfterFolder.value && folder?.id) {
    createPageAfterFolder.value = false;
    creationFolderId.value = folder.id;
    showCreateModal.value = true;
  }
}

function closeFolderModal() {
  showFolderModal.value = false;
  createPageAfterFolder.value = false;
}

function handleOpenBuilder(templateKey) {
  if (!foldersRegistry.length) {
    openCreateModal();
    return;
  }
  closeTemplateBuilder();
  if (templateKey && typeof templateKey === 'string') {
    loadTemplate(templateKey);
  }
  router.push('/builder');
}

async function handleAuthNavigate() {
  await flushWorkspaceToBackend().catch(() => false);
  clearAuthSession();
  router.push('/');
}

// ─── Pages ───────────────────────────────────────────────────────────────────
function handlePageCreated({ name, type, folderId, templateKey }) {
  newBlankCanvas(type, { name, folderId });
  if (templateKey) loadTemplate(templateKey);
  // The page will be saved when user clicks "Salvar Página" in the builder
  showCreateModal.value = false;
  router.push('/builder').then(() => {
    window.dispatchEvent(new CustomEvent('vbs-tour-progress', { detail: { name: 'page-created' } }));
  });
}

function handleEditPage(pageId) {
  const loaded = loadPage(pageId);
  if (loaded) router.push('/builder');
  else showToast('Página não encontrada', 'error');
}

function showPageOptions(page) {
  const pageId = page?.id || page?.templateId;
  const source = pagesRegistry.find(item => item.id === pageId) || null;
  const publication = source ? findPublication(source.id) : null;
  pageOptionsTarget.value = source ? { ...source, publication, isPublished: Boolean(publication) } : null;
  if (!pageOptionsTarget.value) showToast('Página não encontrada', 'error');
}

async function handleSavePageOptions(details) {
  const wasPublished = Boolean(findPublication(details.id));
  if (!updatePageDetails(details.id, details)) return;
  pageOptionsTarget.value = null;
  if (!wasPublished) return;
  const source = pagesRegistry.find(item => item.id === details.id);
  if (!source) return;
  try {
    await publishSavedPage(source);
    showToast('URL da página atualizada.', 'success');
  } catch (error) {
    showToast(error.message || 'Não foi possível republicar a página.', 'error');
  }
}

function handleEditFromOptions(pageId) {
  pageOptionsTarget.value = null;
  handleEditPage(pageId);
}

async function handleDeletePage(pageId) {
  const page = pagesRegistry.find(item => item.id === pageId);
  if (!page) {
    pageOptionsTarget.value = null;
    return;
  }
  confirmAction.value = {
    title: 'Excluir página',
    message: `A página "${page.name}" será removida do dashboard e, se estiver publicada, também sairá do ar.`,
    confirmLabel: 'Excluir página',
    icon: 'bi bi-trash3',
    action: () => deletePageConfirmed(page.id)
  };
}

async function deletePageConfirmed(pageId) {
  const page = pagesRegistry.find(item => item.id === pageId);
  if (!page) return;
  const publication = findPublication(page.id);
  try {
    if (publication?.id) await deletePublication(publication.id).catch(() => null);
    deletePage(page.id);
    pageOptionsTarget.value = null;
    await loadPublications();
    await flushWorkspaceToBackend().catch(() => false);
    showToast('Página excluída.', 'info');
  } catch (error) {
    showToast(error.message || 'Não foi possível excluir a página.', 'error');
  }
}

async function handleUnpublishPage(pageId) {
  const page = pagesRegistry.find(item => item.id === pageId);
  const publication = page ? findPublication(page.id) : null;
  if (!page || !publication) {
    pageOptionsTarget.value = null;
    showToast('Publicação não encontrada.', 'error');
    return;
  }

  confirmAction.value = {
    title: 'Despublicar página',
    message: `A publicação de "${page.name}" será removida e o domínio deixará de abrir esta página.`,
    confirmLabel: 'Despublicar',
    icon: 'bi bi-cloud-slash',
    action: () => unpublishPageConfirmed(publication.id)
  };
}

async function unpublishPageConfirmed(publicationId) {
  try {
    await deletePublication(publicationId);
    pageOptionsTarget.value = null;
    dnsTargetPage.value = null;
    await loadPublications();
    showToast('Página despublicada.', 'info');
  } catch (error) {
    showToast(error.message || 'Não foi possível despublicar.', 'error');
  }
}

async function handlePublishPage(page) {
  const source = pagesRegistry.find(item => item.id === (page?.id || page?.templateId));
  if (!source) {
    showToast('Página não encontrada.', 'error');
    return;
  }

  try {
    const result = await publishSavedPage(source);
    showToast(`Página publicada: ${result.publicUrl}`, 'success', 4200);
    if (result.publicUrl) window.open(result.publicUrl, '_blank', 'noopener');
  } catch (error) {
    showToast(error.message || 'Não foi possível publicar a página.', 'error');
  }
}

function openPublicationUrl(page) {
  const publication = page?.publication || findPublication(page?.id || page?.templateId);
  const url = publication?.customDomainUrl && publication.domainStatus === 'active'
    ? publication.customDomainUrl
    : publication?.publicUrl || page?.publicUrl;
  if (!url) {
    showToast('Publique a página antes de abrir a URL.', 'info');
    return;
  }
  window.open(url, '_blank', 'noopener');
}

function openPageMetrics(page) {
  const pageId = page?.id || page?.templateId;
  if (!pageId) {
    showToast('Página não encontrada.', 'error');
    return;
  }
  router.push(`/dashboard/metricas/${pageId}`);
}

function handleFolderDomainById(folderId) {
  const folder = foldersRegistry.find(item => item.id === folderId);
  if (!folder) {
    showToast('Pasta não encontrada.', 'error');
    return;
  }
  handleFolderDomain(folder);
}

function handleOpenPublicationFromOptions(page) {
  pageOptionsTarget.value = null;
  openPublicationUrl(page);
}

function handleOpenMetricsFromOptions(page) {
  pageOptionsTarget.value = null;
  openPageMetrics(page);
}

function handleOpenDnsFromOptions(page) {
  const target = page;
  pageOptionsTarget.value = null;
  const source = pagesRegistry.find(item => item.id === (target?.id || target?.templateId)) || target;
  if (source?.folderId) {
    handleFolderDomainById(source.folderId);
  } else {
    const publication = findPublication(source.id);
    dnsTargetPage.value = {
      id: source.id,
      templateId: source.id,
      title: source.name || source.title || 'Página',
      folderId: null,
      folderName: 'Raiz',
      customDomain: publication?.customDomain || '',
      publication
    };
  }
}

function handlePublishFromOptions(page) {
  const target = page;
  pageOptionsTarget.value = null;
  handlePublishPage(target);
}

function handleFolderDomain(folder) {
  if (!folder?.id) {
    showToast('Pasta não encontrada.', 'error');
    return;
  }
  const folderPages = pagesRegistry.filter(page => page.folderId === folder.id);
  const firstPublishedPage = folderPages.find(page => findPublication(page.id));
  const firstPage = firstPublishedPage || folderPages[0] || null;
  const publication = firstPage ? findPublication(firstPage.id) : null;
  dnsTargetPage.value = {
    id: firstPage?.id || `folder-${folder.id}`,
    templateId: firstPage?.id || `folder-${folder.id}`,
    title: firstPage?.name || folder.name,
    folderId: folder.id,
    folderName: folder.name,
    customDomain: folder.customDomain || publication?.customDomain || '',
    publication,
    isFolderDomainTarget: true
  };
}

async function handleSaveDns({ page, domain }) {
  const source = pagesRegistry.find(item => item.id === (page?.id || page?.templateId));
  try {
    const folder = foldersRegistry.find(item => item.id === (page?.folderId || source?.folderId));
    if (!folder) {
      showToast('Escolha uma pasta antes de configurar domínio.', 'info');
      return;
    }
    updateFolderDomain(folder.id, domain);
    await flushWorkspaceToBackend();
    const results = await publishFolderPages(folder.id);
    const result = source ? results.find(item => item.pageId === source.id) || results[0] : results[0];
    const dnsText = result.domainStatus === 'active'
      ? `DNS ativo: ${result.dns?.host || domain}`
      : pendingDnsText(result, domain);
    dnsTargetPage.value = null;
    showToast(dnsText, 'success', 6000);
  } catch (error) {
    showToast(error.message || 'Não foi possível atribuir DNS.', 'error');
  }
}

function pendingDnsText(result, domain) {
  const host = result.dns?.host || domain;
  const isRootDomain = String(host).split('.').filter(Boolean).length === 2;
  if (isRootDomain) return `DNS pendente: crie A @ -> ${result.dns?.ips?.[0] || '193.203.182.228'}`;
  return `DNS pendente: crie CNAME ${host} -> ${result.dns?.cname || result.dns?.value || 'astrobuilder.com.br'}`;
}

async function handleVerifyDns(publicationId) {
  try {
    const result = await verifyPublicationDomain(publicationId);
    await loadPublications();
    const source = pagesRegistry.find(item => item.id === result.pageId);
    if (source) {
      dnsTargetPage.value = {
        id: source.id,
        templateId: source.id,
        title: source.name,
        folderId: source.folderId,
        folderName: foldersRegistry.find(folder => folder.id === source.folderId)?.name || '',
        customDomain: result.customDomain || '',
        publication: result,
        isFolderDomainTarget: true
      };
    }
    showToast(result.domainStatus === 'active' ? 'DNS ativo.' : 'DNS ainda pendente.', result.domainStatus === 'active' ? 'success' : 'info');
  } catch (error) {
    showToast(error.message || 'Não foi possível verificar DNS.', 'error');
  }
}

async function runConfirmAction() {
  const action = confirmAction.value?.action;
  confirmAction.value = null;
  if (action) await action();
}

async function publishSavedPage(page) {
  await flushWorkspaceToBackend();
  const html = generateExportedHTML(page.rows || [], {
    ...(page.pageSettings || {}),
    builderMode: page.builderMode || page.type || 'funil',
    pageTitle: page.pageSettings?.pageTitle || page.name || 'Página publicada',
    trackingKey: page.id
  });
  const result = await publishPage({
    pageId: page.id,
    pageName: page.name || 'Página publicada',
    slug: page.pageSettings?.publicationSlug || page.name || 'pagina',
    html
  });
  await loadPublications();
  return result;
}

async function publishFolderPages(folderId) {
  const publishedIds = new Set(publications.value.map(item => item.pageId));
  const pages = pagesRegistry.filter(page => page.folderId === folderId && publishedIds.has(page.id));
  const targets = pages.length ? pages : pagesRegistry.filter(page => page.folderId === folderId).slice(0, 1);
  const results = [];
  for (const page of targets) results.push(await publishSavedPage(page));
  await loadPublications();
  return results;
}

function updateFolderDomain(folderId, domain) {
  const folder = foldersRegistry.find(item => item.id === folderId);
  if (!folder) return;
  folder.customDomain = String(domain || '').trim().toLowerCase();
  localStorage.setItem('folders_registry_v1', JSON.stringify(foldersRegistry));
}

// ─── Folders ─────────────────────────────────────────────────────────────────
function openFolder(folder) {
  selectedFolder.value = folder;
  activeTab.value = 'pastas';
}

function openFolderById(folderId) {
  if (!folderId) return;
  const folder = foldersRegistry.find(item => item.id === folderId);
  if (folder) openFolder(folder);
}

function handleRenameFolder(folder) {
  folderBeingRenamed.value = folder;
  folderModalMode.value = 'rename';
  showFolderModal.value = true;
}

function handleDeleteFolder(folderId) {
  if (confirm('Tem certeza? As páginas desta pasta serão movidas para a raiz.')) {
    deleteFolder(folderId);
  }
}

// ─── Computed ─────────────────────────────────────────────────────────────────
function normalizedPageType(pageOrType) {
  const value = String(typeof pageOrType === 'object' ? pageOrType?.builderMode || pageOrType?.type : pageOrType || 'funil').toLowerCase();
  if (value.includes('mail')) return 'email';
  if (value.includes('quiz')) return 'quiz';
  return 'funil';
}

const emailTemplatesCount = computed(() => 1 + customTemplatesRegistry.filter(template => Boolean(template.emailMode) || String(template.category || '').toLowerCase().includes('mail')).length);
const funilTemplatesCount = computed(() => 1 + customTemplatesRegistry.filter(template => { const category=String(template.category||'').toLowerCase(); return !template.emailMode && !template.quizMode && !category.includes('mail') && !category.includes('quiz'); }).length);
const quizTemplatesCount = computed(() => 1 + customTemplatesRegistry.filter(template => template.quizMode || String(template.category || '').toLowerCase().includes('quiz')).length);
const homeActivity = computed(() => notifications.value.slice(0, 6));

function activityIcon(type) {
  return ({ success:'bi bi-check-lg', pending:'bi bi-hourglass-split', warning:'bi bi-exclamation-lg', error:'bi bi-x-lg', security:'bi bi-shield-check', update:'bi bi-lightning-charge-fill' })[type] || 'bi bi-pencil-square';
}

const filteredPages = computed(() => {
  return pagesRegistry.filter(p => {
    const matchSearch = !searchQuery.value || p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchSearch;
  });
});

const allPages = computed(() => {
  return [...filteredPages.value]
    .sort((a, b) => new Date(b.lastEditedAt || b.updatedAt || 0) - new Date(a.lastEditedAt || a.updatedAt || 0))
    .map(p => {
      const publication = findPublication(p.id);
      const folder = foldersRegistry.find(item => item.id === p.folderId);
      const metrics = analyticsSummary.value.pages?.find(item => item.pageId === p.id) || {};
      return {
        id: p.id,
        title: p.name,
        category: pageCategory(p.type),
        folderName: folder?.name || '',
        publicUrl: publication?.publicUrl || '',
        ...pagePublicationState(p),
        date: formatDate(p.lastEditedAt || p.updatedAt),
        rawUpdatedAt: p.lastEditedAt || p.updatedAt,
        templateId: p.id,
        publication,
        metrics
      };
    });
});

const pagesFolderGroups = computed(() => {
  const groups = [];
  const pages = allPages.value;
  const rootPages = pages.filter(page => !pagesRegistry.find(item => item.id === page.id)?.folderId);

  foldersRegistry.forEach(folder => {
    const folderPages = pages.filter(page => pagesRegistry.find(item => item.id === page.id)?.folderId === folder.id);
    if (!folderPages.length && searchQuery.value) return;
    groups.push({
      folderId: folder.id,
      folderName: folder.name,
      customDomain: folder.customDomain || '',
      color: folder.color,
      pages: folderPages
    });
  });

  if (rootPages.length) {
    groups.unshift({
      folderId: null,
      folderName: 'Sem pasta',
      color: '#64748b',
      pages: rootPages
    });
  }

  return groups.filter(group => group.pages.length || !searchQuery.value);
});

const selectedFolderPages = computed(() => {
  if (!selectedFolder.value) return [];
  return pagesRegistry
    .filter(p => p.folderId === selectedFolder.value.id)
    .sort((a, b) => new Date(b.lastEditedAt || b.updatedAt || 0) - new Date(a.lastEditedAt || a.updatedAt || 0))
    .map(p => {
      const metrics = analyticsSummary.value.pages?.find(item => item.pageId === p.id) || {};
      return {
        id: p.id,
        title: p.name,
        category: pageCategory(p.type),
        ...pagePublicationState(p),
        date: formatDate(p.lastEditedAt || p.updatedAt),
        rawUpdatedAt: p.lastEditedAt || p.updatedAt,
        templateId: p.id,
        publication: findPublication(p.id),
        metrics
      };
    });
});

function downloadSelectedFolder() {
  const folder = selectedFolder.value;
  if (!folder) return;
  const folderPages = pagesRegistry.filter(page => page.folderId === folder.id);
  if (!folderPages.length) {
    showToast('Esta pasta ainda não possui páginas.', 'info');
    return;
  }

  const files = folderPages.map((page, index) => ({
    name: `${String(index + 1).padStart(2, '0')}-${safeFileName(page.name, 'pagina')}.html`,
    content: generateExportedHTML(page.rows || [], {
      ...(page.pageSettings || {}),
      builderMode: page.builderMode || page.type || 'funil'
    }),
    date: page.updatedAt
  }));
  files.push({
    name: 'LEIA-ME.txt',
    content: `Pasta: ${folder.name}\nPáginas exportadas: ${folderPages.length}\nGerado em: ${new Date().toLocaleString('pt-BR')}\n`
  });

  const blob = createZipBlob(files);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${safeFileName(folder.name, 'pasta')}.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Pasta compactada com sucesso!', 'success');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Agora há pouco';
  if (diff < 3600) return `Há ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `Há ${Math.floor(diff / 3600)} horas`;
  return `Há ${Math.floor(diff / 86400)} dias`;
}

async function loadNotifications() {
  try {
    const data = await getNotifications();
    notifications.value = data.items || [];
    notificationUnread.value = Number(data.unread || 0);
  } catch {
    notifications.value = [];
  }
}
async function loadPublications() {
  try {
    publications.value = await getPublications();
  } catch {
    publications.value = [];
  }
}
async function loadAnalyticsSummary() {
  try {
    analyticsSummary.value = await getAnalyticsSummary();
  } catch {
    analyticsSummary.value = { totals: {}, pages: [], videos: [] };
  }
}

function findPublication(pageId) {
  return publications.value.find(item => item.pageId === pageId);
}

function pagePublicationState(page) {
  const publication = findPublication(page.id);
  const isPublished = Boolean(publication) || page.statusClass === 'published' || page.status === 'published';
  const hasPendingDomain = publication?.customDomain && publication.domainStatus !== 'active';
  return {
    isPublished,
    publication,
    customDomain: publication?.customDomain || '',
    statusClass: isPublished ? 'published' : 'draft',
      statusText: hasPendingDomain ? 'DNS pendente' : isPublished ? 'Publicado' : 'Rascunho'
  };
}
function pageCategory(type) { const normalized=normalizedPageType(type); return normalized === 'email' ? 'E-mail' : normalized === 'quiz' ? 'Quiz' : 'Funil'; }
function countLabel(count, singular, plural) { return `${count} ${count === 1 ? singular : plural}`; }

async function openNotifications() {
  showNotifications.value = true;
  notificationsLoading.value = true;
  await loadNotifications();
  notificationsLoading.value = false;
}

async function readAllNotifications() {
  const data = await markAllNotificationsRead();
  notifications.value = data.items || [];
  notificationUnread.value = Number(data.unread || 0);
}

async function clearAllNotifications() {
  const data = await clearNotifications();
  notifications.value = data.items || [];
  notificationUnread.value = Number(data.unread || 0);
}

async function selectNotification(item) {
  if (!item.read) {
    const data = await markNotificationRead(item.id);
    notifications.value = data.items || [];
    notificationUnread.value = Number(data.unread || 0);
  }
  showNotifications.value = false;
  if (item.action === 'create') openCreateModal();
  else if (item.action === 'templates') setActiveTab('templates');
  else if (item.action === 'projects') setActiveTab('todas-paginas');
  else if (item.action === 'support') setActiveTab('support');
}

</script>

<style scoped>
.app-layout {
  display: flex; height: 100vh; width: 100vw; overflow: hidden;
  background-color: var(--color-surface-soft); color: var(--color-text);
  font-family: var(--font-sans);
}

.main-wrapper { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.content-area { flex: 1; overflow-y: auto; padding: 28px; }
.content-area.no-padding { padding: 0; }

.page-header-title {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
}

.title-group h1 { font-size: 24px; font-weight: 800; }
.title-group p { font-size: 14px; color: var(--color-text-muted); }

.header-right-row { display: flex; align-items: center; gap: 10px; }

.filter-select {
  background: var(--color-surface); border: 1px solid var(--color-border);
  color: var(--color-text); font-size: 13.5px; padding: 8px 14px; border-radius: 10px; outline: none; cursor: pointer;
}

.btn-create-new {
  background: var(--color-primary); color: var(--color-surface); border: none; padding: 9px 18px;
  border-radius: 10px; font-size: 13.5px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 7px;
}

.btn-create-new:hover { background: var(--color-primary-hover); }
.home-overview-grid { display:grid; grid-template-columns:minmax(0, 7fr) minmax(280px, 3fr); gap:22px; align-items:start; }
.home-overview-grid > :deep(.dashboard-section) { width:100%; min-width:0; margin-bottom:0; }
.home-overview-grid > :deep(.dashboard-section .folders-grid) { grid-template-columns:1fr; width:100%; }
.home-overview-grid > :deep(.dashboard-section .folder-card) { width:100%; min-height:72px; box-sizing:border-box; }
.home-overview-grid > :deep(.dashboard-section .empty-folders) { width:100%; min-height:210px; box-sizing:border-box; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.recent-activity { min-width:0; overflow:hidden; border:1px solid var(--color-border); border-radius:16px; background:var(--color-surface); box-shadow:var(--shadow-card); }
.activity-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:18px; border-bottom:1px solid var(--color-border); }
.activity-heading h2 { margin:3px 0 0; color:var(--color-text); font:800 17px/1.2 var(--font-display); }
.activity-eyebrow { color:var(--color-primary-strong); font-size:10px; font-weight:900; letter-spacing:.12em; }
.activity-heading button { width:36px; height:36px; padding:0; border:0 !important; border-radius:10px; background:#edf6ff !important; color:#2563eb !important; box-shadow:none !important; }
.activity-heading button:hover { background:#dbeafe !important; color:#1d4ed8 !important; }
.activity-list { display:flex; flex-direction:column; padding:6px 14px; }
.activity-item { display:grid; grid-template-columns:38px minmax(0,1fr); gap:11px; padding:13px 2px; border-bottom:1px solid var(--color-border); }
.activity-item:last-child { border-bottom:0; }
.activity-icon { width:36px; height:36px; display:grid; place-items:center; border-radius:10px; background:var(--color-primary-soft); color:var(--color-primary-strong); }
.activity-icon.is-success { background:#dcfce7; color:#166534; }.activity-icon.is-pending,.activity-icon.is-warning { background:#fef3c7; color:#92400e; }.activity-icon.is-error { background:var(--color-danger-soft); color:var(--color-danger-strong); }
.activity-item strong { display:block; overflow:hidden; color:var(--color-text); font-size:13px; text-overflow:ellipsis; white-space:nowrap; }
.activity-item p { display:-webkit-box; overflow:hidden; margin:4px 0; color:var(--color-text-secondary); font-size:11px; line-height:1.4; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.activity-item time { color:var(--color-text-muted); font-size:10px; font-weight:700; }
.activity-empty { min-height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:28px; color:var(--color-text-muted); text-align:center; }
.activity-empty > i { width:44px; height:44px; display:grid; place-items:center; margin-bottom:10px; border-radius:13px; background:var(--color-primary-soft); color:var(--color-primary-strong); font-size:19px; }.activity-empty strong { color:var(--color-text); font-size:13px; }.activity-empty p { max-width:240px; margin:6px 0 0; font-size:11px; line-height:1.45; }
.dashboard-header-actions { display:flex; align-items:center; gap:8px; }
.btn-tour-launch { display:flex; align-items:center; gap:7px; border:1px solid var(--color-border-strong); background:var(--color-surface); color:var(--color-primary-strong); padding:8px 13px; border-radius:10px; font:inherit; font-size:12.5px; font-weight:800; cursor:pointer; }
.btn-tour-launch:hover { background:var(--color-primary-soft); }

.template-library-header { align-items: flex-end; }
.template-filter-tabs { display: flex; padding: 4px; border: 1px solid var(--color-border); border-radius: 11px; background: var(--color-surface-soft); }
.template-filter-tabs button { border: 0; border-radius: 8px; padding: 8px 12px; background: transparent; color: var(--color-text-muted); cursor: pointer; font: inherit; font-size: 11px; font-weight: 800; }
.template-filter-tabs button.active { background: var(--color-primary); color: var(--color-on-primary); }
.template-library-header + :deep(.templates-view-wrapper) { margin-bottom: 28px; }

@media (max-width: 760px) {
  .app-layout { height: auto; min-height: 100vh; flex-direction: column; overflow: visible; }
  .main-wrapper { width: 100%; min-width: 0; overflow: visible; }
  .content-area { padding: 18px 14px 28px; overflow: visible; }
  .page-header-title { align-items: flex-start; gap: 14px; margin-bottom: 18px; }
  .page-header-title, .header-right-row { flex-wrap: wrap; }
  .title-group h1 { font-size: 21px; }
  .title-group p { font-size: 12px; }
  .dashboard-header-actions { width:100%; }
  .dashboard-header-actions .btn-create-new, .dashboard-header-actions .btn-tour-launch { flex:1; justify-content:center; }
  .template-filter-tabs { width: 100%; }
  .template-filter-tabs button { flex: 1; }
  .home-overview-grid { grid-template-columns:1fr; }
}
@media (min-width:761px) and (max-width:1100px) { .home-overview-grid { grid-template-columns:minmax(0, 3fr) minmax(260px, 2fr); } }

/* Uma única paleta para todas as áreas do painel, inclusive componentes legados. */
:deep(.folder-card), :deep(.template-folder-card), :deep(.page-item-card), :deep(.template-category-block), :deep(.folder-header), :deep(.empty-folder-box), :deep(.empty-folders), :deep(.empty-email-templates), :deep(.dashboard-filter-panel) { background:var(--color-surface) !important; border-color:var(--color-border) !important; }
:deep(.folder-card:hover), :deep(.template-folder-card:hover), :deep(.page-item-card:hover) { background:var(--color-primary-subtle) !important; border-color:var(--color-primary-bright) !important; }
:deep(.page-preview-box), :deep(.file-preview), :deep(.template-preview-box) { background:var(--color-primary-soft) !important; border-color:var(--color-border) !important; }
:deep(.page-preview-mockup), :deep(.template-preview-mockup), :deep(.mockup-window) { background:var(--color-surface) !important; border-color:var(--color-border) !important; }
:deep(.mockup-line) { background:var(--color-border) !important; }:deep(.mockup-btn) { background:var(--color-primary) !important; }
:deep(.section-h2), :deep(.folder-name), :deep(.folder-card-name), :deep(.page-item-title), :deep(.category-title-badge h3), :deep(.empty-email-templates h3) { color:var(--color-text) !important; }
:deep(.folder-items-count), :deep(.folder-card-sub), :deep(.page-item-date), :deep(.empty-email-templates p) { color:var(--color-text-muted) !important; }
:deep(.btn-edit-builder), :deep(.btn-primary-sm), :deep(.btn-create-folder) { background:var(--color-primary-soft) !important; border-color:var(--color-border-strong) !important; color:var(--color-primary-strong) !important; }
:deep(.btn-add-page), :deep(.btn-primary) { background:var(--color-primary) !important; }
</style>
