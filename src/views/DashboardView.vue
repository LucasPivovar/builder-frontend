<template>
  <div class="app-layout">
    <DashboardSidebar
      :activeTab="activeTab"
      :pagesCount="pagesRegistry.length"
      :funilPagesCount="funilPagesCount"
      :emailPagesCount="emailPagesCount"
      :quizPagesCount="quizPagesCount"
      :foldersCount="foldersRegistry.length"
      :templatesCount="customTemplatesRegistry.length"
      :funilTemplatesCount="funilTemplatesCount"
      :emailTemplatesCount="emailTemplatesCount"
      :quizTemplatesCount="quizTemplatesCount"
      :currentUser="currentUser"
      @select-tab="setActiveTab"
    />

    <div class="main-wrapper">
      <DashboardHeader
        v-model:searchQuery="searchQuery"
        :unreadCount="notificationUnread"
        @open-builder="handleOpenBuilder"
        @notify="openNotifications"
        @open-auth="handleAuthNavigate"
      />

      <main class="content-area">

        <!-- ══ PÁGINA INICIAL ══ -->
        <template v-if="activeTab === 'home'">
          <div class="page-header-title">
            <div class="title-group">
              <h1>Página Inicial</h1>
              <p>Visão geral dos seus projetos, pastas e templates</p>
            </div>
            <div class="dashboard-header-actions">
              <button class="btn-tour-launch" @click="startTour"><i class="bi bi-compass"></i> Tour guiado</button>
              <button class="btn-create-new tour-create-page" @click="openCreateModal()">
              <i class="bi bi-plus-circle-fill"></i> Criar nova página
              </button>
            </div>
          </div>

          <QuickActions
            @open-builder="handleOpenBuilder"
            @open-create-modal="openCreateModal()"
            @select-templates="setActiveTab('templates')"
          />
          <RecentPagesSection
            :pages="recentPages"
            @create-new="openCreateModal()"
            @see-all="setActiveTab('todas-paginas')"
            @edit-page="handleEditPage"
            @more-options="showPageOptions"
          />
          <FoldersGrid
            :folders="foldersRegistry"
            @see-all="setActiveTab('pastas')"
            @open-folder="openFolder"
            @create-folder="showFolderModal = true"
          />
          <TemplateFoldersGrid @open-template-folder="setActiveTab" />
        </template>

        <!-- ══ TODAS AS PÁGINAS / FUNIL ══ -->
        <template v-else-if="['todas-paginas', 'funil', 'email-pages', 'quiz-pages'].includes(activeTab)">
          <div class="page-header-title">
            <div class="title-group">
              <h1>{{ activeTab === 'funil' ? 'Páginas — Funil' : activeTab === 'email-pages' ? 'Páginas — E-mail' : activeTab === 'quiz-pages' ? 'Quizzes interativos' : 'Todas as páginas' }}</h1>
              <p>{{ countLabel(filteredPages.length, 'página encontrada', 'páginas encontradas') }}</p>
            </div>
            <div class="header-right-row">
              <select class="filter-select" v-model="selectedCategory">
                <option value="todas">Todas categorias</option>
                <option value="funil">Funil & Vendas</option>
                <option value="email">E-mail Template</option>
                <option value="quiz">Quiz interativo</option>
              </select>
              <button class="btn-create-new" @click="openCreateModal()">
                <i class="bi bi-plus-circle-fill"></i> Nova Página
              </button>
            </div>
          </div>

          <PagesByCategorySection
            v-if="activeTab === 'todas-paginas'"
            :groups="pageCategoryGroups"
            @open-category="setActiveTab"
            @create-category="openCreateModalForType"
            @edit-page="handleEditPage"
            @more-options="showPageOptions"
          />
          <PagesByFolderSection
            v-else
            :folderGroups="folderGroups"
            @see-all-folder="openFolderById"
            @edit-page="handleEditPage"
            @more-options="showPageOptions"
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
              @see-all="setActiveTab('pastas')"
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
              @back="selectedFolder = null"
              @open-builder="openCreateModal(selectedFolder.id)"
              @edit-page="handleEditPage"
              @more-options="showPageOptions"
              @download-folder="downloadSelectedFolder"
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

        <SettingsPanel v-else-if="activeTab === 'settings' || activeTab === 'profile' || activeTab === 'billing'" />
        <SupportPanel v-else-if="activeTab === 'support'" />
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
    />

    <FolderModal
      :isOpen="showFolderModal"
      :mode="folderModalMode"
      :folder="folderBeingRenamed"
      @close="showFolderModal = false"
      @done="showFolderModal = false"
    />

    <NotificationsModal
      :isOpen="showNotifications"
      :items="notifications"
      :unreadCount="notificationUnread"
      :loading="notificationsLoading"
      @close="showNotifications = false"
      @read-all="readAllNotifications"
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
import QuickActions from '../components/dashboard/QuickActions.vue';
import RecentPagesSection from '../components/dashboard/RecentPagesSection.vue';
import PagesByFolderSection from '../components/dashboard/PagesByFolderSection.vue';
import PagesByCategorySection from '../components/dashboard/PagesByCategorySection.vue';
import FoldersGrid from '../components/dashboard/FoldersGrid.vue';
import TemplateFoldersGrid from '../components/dashboard/TemplateFoldersGrid.vue';
import TemplatesGrid from '../components/dashboard/TemplatesGrid.vue';
import FolderDetail from '../components/dashboard/FolderDetail.vue';
import CreateNewModal from '../components/dashboard/CreateNewModal.vue';
import PageActionsModal from '../components/dashboard/PageActionsModal.vue';
import FolderModal from '../components/dashboard/FolderModal.vue';
import NotificationsModal from '../components/dashboard/NotificationsModal.vue';
import SettingsPanel from '../components/dashboard/SettingsPanel.vue';
import SupportPanel from '../components/dashboard/SupportPanel.vue';
import { useProductTour } from '../composables/useProductTour';
import { clearAuthSession, getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';
import { generateExportedHTML } from '../utils/htmlExporter';
import { createZipBlob, safeFileName } from '../utils/zip';

const router = useRouter();
const { start: startTour } = useProductTour();
const {
  showToast, loadTemplate, loadPage, deleteFolder, newBlankCanvas,
  pagesRegistry, foldersRegistry, customTemplatesRegistry, flushWorkspaceToBackend, updatePageDetails, closeTemplateBuilder
} = useBuilderStore();

const activeTab = ref('home');
const searchQuery = ref('');
const selectedCategory = ref('todas');
const selectedFolder = ref(null);
const showCreateModal = ref(false);
const creationFolderId = ref('');
const pageOptionsTarget = ref(null);
const templateLibraryFilter = ref('all');
const showFolderModal = ref(false);
const folderModalMode = ref('create');
const folderBeingRenamed = ref(null);
const createModalRef = ref(null);
const allowedFolderColors = new Set(['#0ea5e9', '#0284c7', '#38bdf8', '#7dd3fc', '#0369a1', '#075985']);
const showNotifications = ref(false);
const notificationsLoading = ref(false);
const notifications = ref([]);
const notificationUnread = ref(0);

const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('vbs_current_user') || sessionStorage.getItem('vbs_current_user') || 'null');
  } catch (error) {
    return null;
  }
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
onMounted(() => {
  window.addEventListener('vbs-tour-action', handleTourAction);
  if (localStorage.getItem('vbs_tour_seen') !== 'true') tourIntroTimer = setTimeout(() => startTour(), 650);
  loadNotifications();
});
onUnmounted(() => {
  window.removeEventListener('vbs-tour-action', handleTourAction);
  clearTimeout(tourIntroTimer);
});

// ─── Navigation ──────────────────────────────────────────────────────────────
function setActiveTab(tab) {
  if (tab === 'admin') {
    router.push('/admin');
    return;
  }
  activeTab.value = tab;
  selectedFolder.value = null;
  if (tab === 'funil') selectedCategory.value = 'funil';
  else if (tab === 'email-pages') selectedCategory.value = 'email';
  else if (tab === 'quiz-pages') selectedCategory.value = 'quiz';
  else if (tab === 'todas-paginas') selectedCategory.value = 'todas';
}

function openCreateModal(folderId = null) {
  creationFolderId.value = folderId || '';
  showCreateModal.value = true;
}

function openCreateModalForType(type) {
  openCreateModal();
  nextTick(() => createModalRef.value?.selectType?.(type));
}

function handleOpenBuilder(templateKey) {
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
  pageOptionsTarget.value = pagesRegistry.find(item => item.id === pageId) || null;
  if (!pageOptionsTarget.value) showToast('Página não encontrada', 'error');
}

function handleSavePageOptions(details) {
  if (updatePageDetails(details.id, details)) pageOptionsTarget.value = null;
}

function handleEditFromOptions(pageId) {
  pageOptionsTarget.value = null;
  handleEditPage(pageId);
}

// ─── Folders ─────────────────────────────────────────────────────────────────
function openFolder(folder) {
  selectedFolder.value = folder;
  activeTab.value = 'pastas';
}

function openFolderById(folderId) {
  const f = foldersRegistry.find(f => f.id === folderId);
  if (f) openFolder(f);
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

const funilPagesCount = computed(() => pagesRegistry.filter(p => normalizedPageType(p) === 'funil').length);
const emailPagesCount = computed(() => pagesRegistry.filter(p => normalizedPageType(p) === 'email').length);
const quizPagesCount = computed(() => pagesRegistry.filter(p => normalizedPageType(p) === 'quiz').length);
const emailTemplatesCount = computed(() => 1 + customTemplatesRegistry.filter(template => Boolean(template.emailMode) || String(template.category || '').toLowerCase().includes('mail')).length);
const funilTemplatesCount = computed(() => 1 + customTemplatesRegistry.filter(template => { const category=String(template.category||'').toLowerCase(); return !template.emailMode && !template.quizMode && !category.includes('mail') && !category.includes('quiz'); }).length);
const quizTemplatesCount = computed(() => 1 + customTemplatesRegistry.filter(template => template.quizMode || String(template.category || '').toLowerCase().includes('quiz')).length);

const recentPages = computed(() => {
  return [...pagesRegistry]
    .sort((a, b) => new Date(b.lastEditedAt || b.updatedAt || 0) - new Date(a.lastEditedAt || a.updatedAt || 0))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      title: p.name,
      category: pageCategory(p.type),
      statusClass: p.statusClass || 'draft',
      statusText: p.statusText || 'Rascunho',
      date: formatDate(p.lastEditedAt || p.updatedAt),
      rawUpdatedAt: p.lastEditedAt || p.updatedAt,
      templateId: p.id
    }));
});

const filteredPages = computed(() => {
  return pagesRegistry.filter(p => {
    const matchSearch = !searchQuery.value || p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = selectedCategory.value === 'todas' || normalizedPageType(p) === selectedCategory.value;
    return matchSearch && matchCat;
  });
});

const folderGroups = computed(() => {
  const groups = [];

  // Pages with folder
  foldersRegistry.forEach(folder => {
    const pages = filteredPages.value.filter(p => p.folderId === folder.id);
    if (pages.length > 0) {
      groups.push({
        folderId: folder.id,
        folderName: folder.name,
        color: folderAccent(folder.color),
        pages: pages.map(p => ({
          id: p.id,
          title: p.name,
          category: pageCategory(p.type),
          statusClass: p.statusClass || 'draft',
          statusText: p.statusText || 'Rascunho',
          date: formatDate(p.updatedAt),
          templateId: p.id
        }))
      });
    }
  });

  // Pages without folder (root)
  const rootPages = filteredPages.value.filter(p => !p.folderId);
  if (rootPages.length > 0) {
    groups.push({
      folderId: null,
      folderName: 'Páginas sem pasta',
      color: '#0ea5e9',
      pages: rootPages.map(p => ({
        id: p.id,
        title: p.name,
        category: pageCategory(p.type),
        statusClass: p.statusClass || 'draft',
        statusText: p.statusText || 'Rascunho',
        date: formatDate(p.updatedAt),
        templateId: p.id
      }))
    });
  }

  return groups;
});

const selectedFolderPages = computed(() => {
  if (!selectedFolder.value) return [];
  return pagesRegistry
    .filter(p => p.folderId === selectedFolder.value.id)
    .sort((a, b) => new Date(b.lastEditedAt || b.updatedAt || 0) - new Date(a.lastEditedAt || a.updatedAt || 0))
    .map(p => ({
      id: p.id,
      title: p.name,
      category: pageCategory(p.type),
      statusClass: p.statusClass || 'draft',
      statusText: p.statusText || 'Rascunho',
      date: formatDate(p.lastEditedAt || p.updatedAt),
      rawUpdatedAt: p.lastEditedAt || p.updatedAt,
      templateId: p.id
    }));
});

const pageCategoryGroups = computed(() => {
  const configs = [
    { key:'funil', tab:'funil', title:'Funil', shortLabel:'VSL · 100%', itemLabel:'funil', description:'Landing pages e páginas de vendas em largura total', icon:'bi bi-funnel-fill', emptyText:'Crie uma página VSL responsiva.' },
    { key:'email', tab:'email-pages', title:'E-mail', shortLabel:'E-mail · 600px', itemLabel:'e-mail', description:'Campanhas com largura fixa e compatível com caixas de entrada', icon:'bi bi-envelope-paper-fill', emptyText:'Crie seu primeiro template de e-mail.' },
    { key:'quiz', tab:'quiz-pages', title:'Quiz', shortLabel:'Quiz · 460px', itemLabel:'quiz', description:'Experiências interativas organizadas em etapas', icon:'bi bi-ui-checks-grid', emptyText:'Crie seu primeiro quiz interativo.' }
  ];
  return configs.map(config => ({
    ...config,
    pages: pagesRegistry.filter(page => normalizedPageType(page) === config.key).sort((a,b)=>new Date(b.lastEditedAt||b.updatedAt||0)-new Date(a.lastEditedAt||a.updatedAt||0)).map(page => ({ id:page.id, title:page.name, date:formatDate(page.lastEditedAt||page.updatedAt), templateId:page.id, category:pageCategory(normalizedPageType(page)) }))
  }));
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
}

function folderAccent(color) {
  return allowedFolderColors.has(String(color || '').toLowerCase()) ? color : '#0ea5e9';
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
}

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
