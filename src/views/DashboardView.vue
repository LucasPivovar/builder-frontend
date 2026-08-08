<template>
  <div class="app-layout">
    <DashboardSidebar
      :activeTab="activeTab"
      :pagesCount="pagesRegistry.length"
      :funilPagesCount="funilPagesCount"
      :foldersCount="foldersRegistry.length"
      :templatesCount="customTemplatesRegistry.length"
      @select-tab="setActiveTab"
    />

    <div class="main-wrapper">
      <DashboardHeader
        v-model:searchQuery="searchQuery"
        @open-builder="handleOpenBuilder"
        @notify="showNotificationToast"
        @open-auth="handleAuthNavigate"
      />

      <main class="content-area" :class="{ 'no-padding': activeTab === 'admin' }">

        <!-- ══ PÁGINA INICIAL ══ -->
        <template v-if="activeTab === 'home'">
          <div class="page-header-title">
            <div class="title-group">
              <h1>Página Inicial</h1>
              <p>Visão geral dos seus projetos, pastas e templates</p>
            </div>
            <button class="btn-create-new" @click="showCreateModal = true">
              <i class="bi bi-plus-circle-fill"></i> + Criar Nova Página
            </button>
          </div>

          <QuickActions
            @open-builder="handleOpenBuilder"
            @open-create-modal="showCreateModal = true"
            @select-templates="setActiveTab('templates-funil')"
          />
          <RecentPagesSection
            :pages="recentPages"
            @create-new="showCreateModal = true"
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
        <template v-else-if="['todas-paginas', 'funil'].includes(activeTab)">
          <div class="page-header-title">
            <div class="title-group">
              <h1>{{ activeTab === 'funil' ? 'Páginas — Funil' : 'Todas as Páginas' }}</h1>
              <p>{{ filteredPages.length }} página(s) encontrada(s)</p>
            </div>
            <div class="header-right-row">
              <select class="filter-select" v-model="selectedCategory">
                <option value="todas">Todas categorias</option>
                <option value="funil">Funil & Vendas</option>
                <option value="email">E-mail Template</option>
              </select>
              <button class="btn-create-new" @click="showCreateModal = true">
                <i class="bi bi-plus-circle-fill"></i> + Nova Página
              </button>
            </div>
          </div>

          <PagesByFolderSection
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
                <p>{{ foldersRegistry.length }} pasta(s) criada(s)</p>
              </div>
              <button class="btn-create-new" @click="showFolderModal = true">
                <i class="bi bi-folder-plus"></i> Nova Pasta
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
              @open-builder="showCreateModal = true"
              @edit-page="handleEditPage"
              @more-options="showPageOptions"
            />
          </template>
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

        <!-- ══ ADMIN ══ -->
        <AdminView
          v-else-if="activeTab === 'admin'"
          @navigate="handleAdminNavigate"
          @open-builder="handleOpenBuilder"
        />

        <SettingsPanel v-else-if="activeTab === 'settings' || activeTab === 'profile' || activeTab === 'billing'" />
        <SupportPanel v-else-if="activeTab === 'support'" />
      </main>
    </div>

    <!-- Modals -->
    <CreateNewModal
      :isOpen="showCreateModal"
      @close="showCreateModal = false"
      @created="handlePageCreated"
    />

    <FolderModal
      :isOpen="showFolderModal"
      :mode="folderModalMode"
      :folder="folderBeingRenamed"
      @close="showFolderModal = false"
      @done="showFolderModal = false"
    />

    <ToastNotification />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBuilderStore } from '../composables/useBuilderStore';

import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue';
import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import QuickActions from '../components/dashboard/QuickActions.vue';
import RecentPagesSection from '../components/dashboard/RecentPagesSection.vue';
import PagesByFolderSection from '../components/dashboard/PagesByFolderSection.vue';
import FoldersGrid from '../components/dashboard/FoldersGrid.vue';
import TemplateFoldersGrid from '../components/dashboard/TemplateFoldersGrid.vue';
import TemplatesGrid from '../components/dashboard/TemplatesGrid.vue';
import FolderDetail from '../components/dashboard/FolderDetail.vue';
import CreateNewModal from '../components/dashboard/CreateNewModal.vue';
import FolderModal from '../components/dashboard/FolderModal.vue';
import AdminView from './AdminView.vue';
import SettingsPanel from '../components/dashboard/SettingsPanel.vue';
import SupportPanel from '../components/dashboard/SupportPanel.vue';
import ToastNotification from '../components/ToastNotification.vue';

const router = useRouter();
const {
  showToast, loadTemplate, loadPage, deleteFolder, newBlankCanvas,
  pagesRegistry, foldersRegistry, customTemplatesRegistry
} = useBuilderStore();

const activeTab = ref('home');
const searchQuery = ref('');
const selectedCategory = ref('todas');
const selectedFolder = ref(null);
const showCreateModal = ref(false);
const showFolderModal = ref(false);
const folderModalMode = ref('create');
const folderBeingRenamed = ref(null);

// ─── Navigation ──────────────────────────────────────────────────────────────
function setActiveTab(tab) {
  activeTab.value = tab;
  selectedFolder.value = null;
}

function handleOpenBuilder(templateKey) {
  if (templateKey && typeof templateKey === 'string') {
    loadTemplate(templateKey);
  }
  router.push('/builder');
}

function handleAuthNavigate() { router.push('/auth'); }

function handleAdminNavigate(target) {
  if (target === 'dashboard') activeTab.value = 'home';
  else if (target === 'builder') router.push('/builder');
  else handleOpenBuilder(target);
}

// ─── Pages ───────────────────────────────────────────────────────────────────
function handlePageCreated({ type, templateKey }) {
  newBlankCanvas(type);
  if (templateKey) loadTemplate(templateKey);
  // The page will be saved when user clicks "Salvar Página" in the builder
  showCreateModal.value = false;
  router.push('/builder');
}

function handleEditPage(pageId) {
  const loaded = loadPage(pageId);
  if (loaded) router.push('/builder');
  else showToast('❌ Página não encontrada', 'error');
}

function showPageOptions(page) {
  showToast(`Opções para: "${page.name || page.title}"`, 'info');
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
const funilPagesCount = computed(() => pagesRegistry.filter(p => p.type !== 'email').length);

const recentPages = computed(() => {
  return [...pagesRegistry]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      title: p.name,
      category: p.type === 'email' ? 'E-mail' : 'Funil',
      statusClass: p.statusClass || 'draft',
      statusText: p.statusText || 'Rascunho',
      date: formatDate(p.updatedAt),
      templateId: p.id
    }));
});

const filteredPages = computed(() => {
  return pagesRegistry.filter(p => {
    const matchSearch = !searchQuery.value || p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = selectedCategory.value === 'todas' || p.type === selectedCategory.value;
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
        color: folder.color || '#6366f1',
        pages: pages.map(p => ({
          id: p.id,
          title: p.name,
          category: p.type === 'email' ? 'E-mail' : 'Funil',
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
      color: '#94a3b8',
      pages: rootPages.map(p => ({
        id: p.id,
        title: p.name,
        category: p.type === 'email' ? 'E-mail' : 'Funil',
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
    .map(p => ({
      id: p.id,
      title: p.name,
      category: p.type === 'email' ? 'E-mail' : 'Funil',
      statusClass: p.statusClass || 'draft',
      statusText: p.statusText || 'Rascunho',
      date: formatDate(p.updatedAt),
      templateId: p.id
    }));
});

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

function showNotificationToast() {
  showToast('🔔 Nenhuma notificação nova', 'info');
}
</script>

<style scoped>
.app-layout {
  display: flex; height: 100vh; width: 100vw; overflow: hidden;
  background-color: #0b0f19; color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.main-wrapper { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.content-area { flex: 1; overflow-y: auto; padding: 28px; }
.content-area.no-padding { padding: 0; }

.page-header-title {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
}

.title-group h1 { font-size: 24px; font-weight: 800; }
.title-group p { font-size: 14px; color: #94a3b8; }

.header-right-row { display: flex; align-items: center; gap: 10px; }

.filter-select {
  background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; font-size: 13.5px; padding: 8px 14px; border-radius: 10px; outline: none; cursor: pointer;
}

.btn-create-new {
  background: #6366f1; color: #fff; border: none; padding: 9px 18px;
  border-radius: 10px; font-size: 13.5px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 7px;
}

.btn-create-new:hover { background: #5558e8; }
</style>
