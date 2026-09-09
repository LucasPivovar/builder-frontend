<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-brand"><span><i class="bi bi-shield-check"></i></span><div><strong>Admin</strong><small>Astro Builder</small></div></div>
      <nav>
        <button :class="{ active: tab === 'overview' }" @click="tab = 'overview'"><i class="bi bi-grid-1x2"></i> Visão geral</button>
        <button :class="{ active: tab === 'users' }" @click="tab = 'users'"><i class="bi bi-people"></i> Usuários <em>{{ users.length }}</em></button>
        <button :class="{ active: tab === 'projects' }" @click="tab = 'projects'"><i class="bi bi-collection"></i> Todas as páginas <em>{{ allPages.length }}</em></button>
        <button :class="{ active: tab === 'templates' }" @click="tab = 'templates'"><i class="bi bi-layout-text-window"></i> Templates <em>{{ customTemplatesRegistry.length + 3 }}</em></button>
        <button :class="{ active: tab === 'alerts' }" @click="tab = 'alerts'"><i class="bi bi-megaphone"></i> Alertas</button>
        <button :class="{ active: tab === 'billing' }" @click="tab = 'billing'"><i class="bi bi-credit-card"></i> Planos <em>{{ pendingBillingCount }}</em></button>
        <button :class="{ active: tab === 'support' }" @click="tab = 'support'"><i class="bi bi-life-preserver"></i> Suporte <em>{{ openSupportCount }}</em></button>
        <button :class="{ active: tab === 'history' }" @click="tab = 'history'"><i class="bi bi-clock-history"></i> Histórico</button>
      </nav>
      <button class="back-button" @click="$emit('navigate', 'dashboard')"><i class="bi bi-arrow-left"></i> Voltar ao painel</button>
    </aside>

    <main class="admin-main">
      <header class="admin-topbar">
        <div><p>Administração</p><h1>{{ pageTitle }}</h1></div>
        <div class="topbar-actions"><span class="status-online"><i></i> Sistema local online</span><button @click="loadAdminData"><i class="bi bi-arrow-clockwise"></i></button></div>
      </header>

      <div class="admin-content">
        <div v-if="loading" class="state-panel"><span class="spinner"></span><strong>Carregando dados da plataforma...</strong></div>
        <div v-else-if="error" class="state-panel error"><i class="bi bi-shield-exclamation"></i><strong>{{ error }}</strong><button @click="loadAdminData">Tentar novamente</button></div>

        <template v-else-if="tab === 'overview'">
          <section class="welcome-card"><div><span>CONTROLE DA PLATAFORMA</span><h2>Visão completa do seu produto</h2><p>Acompanhe usuários, páginas, armazenamento e recuperação em um só lugar.</p></div><button @click="tab = 'users'"><i class="bi bi-people"></i> Ver usuários</button></section>
          <section class="stats-grid">
            <article v-for="stat in stats" :key="stat.label" class="stat-card"><span class="stat-icon"><i :class="stat.icon"></i></span><div><strong>{{ stat.value }}</strong><small>{{ stat.label }}</small><p>{{ stat.note }}</p></div></article>
          </section>
          <section class="overview-grid">
            <article class="panel-card"><div class="panel-header"><div><h3>Usuários recentes</h3><p>Últimos cadastros na plataforma</p></div><button @click="tab='users'">Ver todos</button></div><div class="recent-list"><button v-for="user in overview.recentUsers || []" :key="user.id" @click="openUser(user)"><span class="avatar">{{ initials(user.name) }}</span><span><strong>{{ user.name }}</strong><small>{{ user.email }}</small></span><em>{{ projectCount(user.projects) }}</em><i class="bi bi-chevron-right"></i></button></div></article>
            <article class="panel-card system-card"><div class="panel-header"><div><h3>Saúde do sistema</h3><p>Resumo dos serviços configurados</p></div></div><ul><li><i class="bi bi-check-circle-fill"></i><span><strong>Banco persistente</strong><small>SQL.js local ou PostgreSQL em produção</small></span><em>Operacional</em></li><li><i class="bi bi-check-circle-fill"></i><span><strong>Backups automáticos</strong><small>Até 20 versões por usuário</small></span><em>Ativo</em></li><li><i class="bi bi-check-circle-fill"></i><span><strong>Autenticação JWT</strong><small>Sessões protegidas e limitadas</small></span><em>Protegido</em></li></ul></article>
          </section>
        </template>

        <template v-else-if="tab === 'users'">
          <section class="section-heading">
            <div>
              <h2>Todos os usuários</h2>
              <p>Consulte contas cadastradas e abra seus espaços de trabalho para recuperação ou edição.</p>
            </div>
            <label class="admin-search">
              <i class="bi bi-search"></i>
              <input v-model="query" placeholder="Buscar por nome ou e-mail">
            </label>
          </section>
          <section class="users-table-card">
            <div class="table-head">
              <span>Usuário</span>
              <span>Projetos</span>
              <span>Pastas</span>
              <span>Última atividade</span>
              <span>Status</span>
              <span></span>
            </div>
            <button v-for="user in filteredUsers" :key="user.id" class="user-row" @click="openUser(user)">
              <span class="user-cell">
                <span class="avatar">{{ initials(user.name) }}</span>
                <span><strong>{{ user.name }}</strong><small>{{ user.email }}</small></span>
              </span>
              <span><strong>{{ user.projects }}</strong><small>páginas</small></span>
              <span><strong>{{ user.folders }}</strong><small>pastas</small></span>
              <span><strong>{{ formatDate(user.workspaceUpdatedAt || user.updatedAt) }}</strong><small>revisão {{ user.revision }}</small></span>
              <span><em class="status-pill" :class="{ inactive: !user.active }">{{ user.active ? 'Ativo' : 'Inativo' }}</em></span>
              <span class="row-action"><i class="bi bi-chevron-right"></i></span>
            </button>
            <div v-if="!filteredUsers.length" class="empty-table"><i class="bi bi-person-x"></i><strong>Nenhum usuário encontrado</strong></div>
          </section>
        </template>

        <template v-else-if="tab === 'projects'">
          <section class="section-heading">
            <div>
              <h2>Todas as páginas da plataforma</h2>
              <p>Visualize, acesse e edite qualquer página de qualquer usuário diretamente no construtor.</p>
            </div>
            <label class="admin-search">
              <i class="bi bi-search"></i>
              <input v-model="pageQuery" placeholder="Buscar por página, usuário, pasta ou slug">
            </label>
          </section>
          <section class="pages-table-card">
            <div class="pages-head">
              <span>Página</span>
              <span>Usuário</span>
              <span>Pasta</span>
              <span>Domínio / Link</span>
              <span>Atualizada</span>
              <span style="text-align: right;">Ações</span>
            </div>
            <article v-for="p in filteredPages" :key="p.userId + ':' + p.pageId" class="pages-row">
              <span class="page-cell">
                <span class="page-type-icon"><i :class="projectIcon(p)"></i></span>
                <span>
                  <strong>{{ p.pageName }}</strong>
                  <small>{{ projectLabel(p) }} {{ p.slug ? ('· /' + p.slug) : '' }}</small>
                </span>
              </span>
              <span class="user-meta-cell">
                <strong>{{ p.userName }}</strong>
                <small>{{ p.userEmail }}</small>
              </span>
              <span>
                <em class="folder-pill"><i class="bi bi-folder-fill"></i> {{ p.folderName || 'Raiz' }}</em>
              </span>
              <span class="domain-cell">
                <template v-if="p.published">
                  <a :href="p.customDomainUrl || p.publicUrl" target="_blank" class="page-link" :title="p.customDomainUrl || p.publicUrl">
                    <i class="bi bi-globe"></i> {{ p.customDomain || 'Link público' }}
                  </a>
                  <small :class="['status-subpill', p.domainStatus]">{{ p.customDomain ? (p.domainStatus === 'active' ? 'DNS ativo' : 'DNS pendente') : 'Publicado' }}</small>
                </template>
                <template v-else>
                  <em class="status-subpill draft">Não publicada</em>
                </template>
              </span>
              <span>
                <time>{{ formatDate(p.updatedAt) }}</time>
              </span>
              <span class="page-row-actions">
                <button
                  class="btn-admin-edit"
                  @click="router.push({ path: '/builder', query: { adminUser: p.userId, page: p.pageId } })"
                  title="Abrir e editar no Builder"
                >
                  <i class="bi bi-pencil-square"></i> Abrir no Builder
                </button>
                <a
                  v-if="p.published"
                  :href="p.customDomainUrl || p.publicUrl"
                  target="_blank"
                  class="btn-admin-visit"
                  title="Visitar página"
                >
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </span>
            </article>
            <div v-if="!filteredPages.length" class="empty-table">
              <i class="bi bi-window-x"></i>
              <strong>Nenhuma página encontrada</strong>
            </div>
          </section>
        </template>

        <template v-else-if="tab === 'templates'">
          <section class="section-heading">
            <div><h2>Templates da plataforma</h2><p>Crie no mesmo Builder das páginas e publique direto na biblioteca.</p></div>
            <button class="primary-button" @click="openTemplateCreator"><i class="bi bi-plus-lg"></i> Criar template</button>
          </section>
          <section class="template-grid">
            <article class="template-card default"><span><i class="bi bi-play-btn"></i></span><div><small>FUNIL PADRÃO</small><h3>VSL de alta conversão</h3><p>Estrutura inicial para páginas de vendas em largura total.</p></div></article>
            <article class="template-card default"><span><i class="bi bi-envelope-paper"></i></span><div><small>E-MAIL PADRÃO</small><h3>E-mail responsivo</h3><p>Layout fixo de 600px para campanhas.</p></div></article>
            <article class="template-card default"><span><i class="bi bi-ui-checks-grid"></i></span><div><small>QUIZ PADRÃO</small><h3>Quiz interativo</h3><p>Etapas, respostas, progresso e tela de resultado.</p></div></article>
            <article v-for="template in customTemplatesRegistry" :key="template.id" class="template-card">
              <span><i :class="templateIcon(template)"></i></span>
              <div class="template-card-content"><small>{{ templateCategoryLabel(template) }}</small><h3>{{ template.name }}</h3><p>{{ template.description || 'Template personalizado salvo no construtor.' }}</p><div class="template-actions"><button @click="editTemplate(template)"><i class="bi bi-pencil"></i> Editar no Builder</button><button class="danger" aria-label="Excluir template" @click="removeTemplate(template)"><i class="bi bi-trash3"></i></button></div></div>
            </article>
          </section>
          <div v-if="!customTemplatesRegistry.length" class="template-empty"><i class="bi bi-layout-text-window"></i><strong>Nenhum template personalizado</strong><p>Abra o Builder de templates e monte o primeiro modelo.</p><button class="primary-button" @click="openTemplateCreator">Criar primeiro template</button></div>
        </template>

        <template v-else-if="tab === 'alerts'">
          <section class="section-heading"><div><h2>Emitir alerta</h2><p>Envie notificações para todos os usuários ou para uma conta específica.</p></div></section>
          <section class="admin-form-card">
            <label><span>Título *</span><input v-model.trim="alertForm.title" maxlength="120" placeholder="Ex.: Manutenção programada"></label>
            <label><span>Mensagem *</span><textarea v-model.trim="alertForm.message" rows="4" maxlength="500" placeholder="Explique o que o usuário precisa saber."></textarea></label>
            <div class="form-grid-3">
              <label><span>Tipo</span><select v-model="alertForm.type"><option value="success">Sucesso</option><option value="info">Informação</option><option value="pending">Pendente</option><option value="warning">Aviso</option><option value="error">Erro</option></select></label>
              <label><span>Destino</span><select v-model="alertForm.target"><option value="all">Todos os usuários</option><option value="user">Usuário específico</option></select></label>
              <label><span>Usuário</span><select v-model="alertForm.userId" :disabled="alertForm.target !== 'user'"><option value="">Selecione</option><option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }} · {{ user.email }}</option></select></label>
            </div>
            <footer><button class="primary-button" :disabled="sendingAlert || !canSendAlert" @click="sendAlert"><i class="bi bi-send-fill"></i> {{ sendingAlert ? 'Enviando...' : 'Enviar alerta' }}</button></footer>
          </section>
        </template>

        <template v-else-if="tab === 'history'">
          <section class="section-heading"><div><h2>Histórico da plataforma</h2><p>Salvamentos, publicações, restaurações e alertas emitidos.</p></div><button class="secondary-button" @click="loadHistory"><i class="bi bi-arrow-clockwise"></i> Atualizar</button></section>
          <section class="history-table-card">
            <div class="history-row history-head"><span>Tipo</span><span>Evento</span><span>Página</span><span>Usuário</span><span>Data</span></div>
            <article v-for="item in historyItems" :key="item.id" class="history-row">
              <span><em :class="['event-pill', item.type]">{{ eventLabel(item.type) }}</em></span>
              <span><strong>{{ item.title }}</strong><small>{{ item.message }}</small></span>
              <span>{{ item.pageName || '-' }}</span>
              <span>{{ item.userEmail || item.userId || '-' }}</span>
              <time>{{ formatDate(item.createdAt) }}</time>
            </article>
            <div v-if="!historyItems.length" class="empty-table"><i class="bi bi-clock-history"></i><strong>Nenhum evento registrado</strong></div>
          </section>
        </template>

        <template v-else-if="tab === 'billing'">
          <section class="section-heading"><div><h2>Solicitações de plano</h2><p>Aprove ou rejeite mudanças quando não houver checkout externo configurado.</p></div></section>
          <section class="billing-request-list">
            <article v-for="request in billingRequests" :key="request.id" class="billing-request-card">
              <div><strong>{{ request.userName }}</strong><small>{{ request.userEmail }}</small></div>
              <span>Plano <b>{{ planLabel(request.requestedPlan) }}</b></span>
              <time>{{ formatDate(request.createdAt) }}</time>
              <em :class="request.status">{{ requestStatus(request.status) }}</em>
              <div v-if="request.status === 'pending'" class="billing-actions"><button class="secondary-button" :disabled="updatingBilling === request.id" @click="decideBilling(request,'rejected')">Rejeitar</button><button class="primary-button" :disabled="updatingBilling === request.id" @click="decideBilling(request,'approved')">Aprovar</button></div>
            </article>
            <div v-if="!billingRequests.length" class="empty-table"><i class="bi bi-credit-card"></i><strong>Nenhuma solicitação de plano</strong></div>
          </section>
        </template>

        <template v-else-if="tab === 'support'">
          <section class="section-heading">
            <div><h2>Fila de suporte</h2><p>Responda e acompanhe os chamados abertos pelos usuários.</p></div>
            <select v-model="supportFilter" class="support-filter"><option value="open">Abertos</option><option value="resolved">Resolvidos</option><option value="all">Todos</option></select>
          </section>
          <section class="admin-support-list">
            <article v-for="ticket in filteredSupportTickets" :key="ticket.id" class="admin-support-ticket">
              <header><div><span :class="['support-priority', ticket.priority.toLowerCase()]">{{ ticket.priority }}</span><strong>{{ ticket.subject }}</strong><small>{{ ticket.userName }} · {{ ticket.userEmail }}</small></div><time>{{ formatDate(ticket.createdAt) }}</time></header>
              <p>{{ ticket.message }}</p>
              <div class="support-ticket-meta"><span><i class="bi bi-tag"></i> {{ ticket.category }}</span><span v-if="ticket.pageUrl"><i class="bi bi-link-45deg"></i> {{ ticket.pageUrl }}</span></div>
              <div v-if="ticket.messages?.length" class="admin-ticket-thread"><div v-for="(entry,index) in ticket.messages" :key="index" :class="entry.author"><strong>{{ entry.author === 'admin' ? 'Suporte' : 'Usuário' }}</strong><p>{{ entry.message }}</p><small>{{ formatDate(entry.createdAt) }}</small></div></div>
              <div v-if="ticket.attachments?.length" class="admin-ticket-attachments"><button v-for="attachment in ticket.attachments" :key="attachment.id" @click="downloadTicketAttachment(ticket,attachment)"><i class="bi bi-paperclip"></i> {{ attachment.name }}</button></div>
              <textarea v-model="supportReplies[ticket.id]" rows="3" maxlength="5000" placeholder="Escreva uma resposta para o usuário…"></textarea>
              <footer>
                <button v-if="ticket.status === 'resolved'" class="secondary-button" :disabled="updatingTicket === ticket.id" @click="updateTicket(ticket, 'open')"><i class="bi bi-arrow-counterclockwise"></i> Reabrir</button>
                <button class="primary-button" :disabled="updatingTicket === ticket.id || (!supportReplies[ticket.id]?.trim() && ticket.status === 'resolved')" @click="updateTicket(ticket, 'resolved')"><i class="bi bi-send-check"></i> {{ updatingTicket === ticket.id ? 'Salvando…' : 'Responder e resolver' }}</button>
              </footer>
            </article>
            <div v-if="!filteredSupportTickets.length" class="empty-table"><i class="bi bi-inbox"></i><strong>Nenhum ticket neste filtro</strong></div>
          </section>
        </template>
      </div>
    </main>

    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="selectedUser" class="drawer-overlay" @mousedown.self="closeUser">
          <aside class="user-drawer">
            <header><div class="drawer-user"><span class="avatar large">{{ initials(selectedUser.name) }}</span><div><h2>{{ selectedUser.name }}</h2><p>{{ selectedUser.email }}</p></div></div><button @click="closeUser"><i class="bi bi-x-lg"></i></button></header>
            <div v-if="detailsLoading" class="drawer-loading"><span class="spinner"></span> Carregando espaço...</div>
            <template v-else-if="userDetails">
              <div class="drawer-summary"><div><strong>{{ workspacePages.length }}</strong><small>Projetos</small></div><div><strong>{{ workspaceFolders.length }}</strong><small>Pastas</small></div><div><strong>{{ userDetails.backups.length }}</strong><small>Backups</small></div></div>
              <div class="drawer-access-actions">
                <button :disabled="updatingAccess" @click="changeUserAccess({ active: !selectedUser.active })"><i :class="selectedUser.active ? 'bi bi-person-x' : 'bi bi-person-check'"></i> {{ selectedUser.active ? 'Desativar conta' : 'Reativar conta' }}</button>
                <button :disabled="updatingAccess" @click="changeUserAccess({ role: selectedUser.role === 'admin' ? 'user' : 'admin' })"><i class="bi bi-shield-check"></i> {{ selectedUser.role === 'admin' ? 'Remover admin' : 'Tornar admin' }}</button>
              </div>
              <div class="drawer-actions"><button @click="downloadWorkspace"><i class="bi bi-download"></i> Baixar backup completo</button></div>
              <section class="drawer-section"><div class="drawer-section-title"><h3>Sessões ativas</h3><span>{{ userDetails.sessions?.length || 0 }}</span></div><div v-if="userDetails.sessions?.length" class="admin-session-list"><article v-for="session in userDetails.sessions" :key="session.id"><i class="bi bi-display"></i><div><strong>{{ deviceLabel(session.userAgent) }}</strong><small>{{ formatDate(session.updatedAt) }}<template v-if="session.ipAddress"> · {{ session.ipAddress }}</template></small></div><button :disabled="revokingSession" aria-label="Encerrar esta sessão" @click="revokeUserSession(session.id)"><i class="bi bi-x-lg"></i></button></article><button class="revoke-all-sessions" :disabled="revokingSession" @click="revokeAllUserSessions"><i class="bi bi-shield-x"></i> {{ revokingSession ? 'Encerrando…' : 'Encerrar todas as sessões' }}</button></div><div v-else class="drawer-empty">Não há sessões ativas para esta conta.</div></section>
              <div class="drawer-actions"><button v-for="page in workspacePages" :key="page.id" @click="router.push({ path: '/builder', query: { adminUser: selectedUser.id, page: page.id } })"><i class="bi bi-pencil-square"></i> Abrir {{ page.name }} no builder</button></div>
              <section class="drawer-section"><div class="drawer-section-title"><h3>Projetos salvos</h3><span>{{ workspacePages.length }}</span></div><div v-if="workspacePages.length" class="project-list"><article v-for="page in workspacePages" :key="page.id"><span class="project-icon"><i :class="projectIcon(page)"></i></span><div><strong>{{ page.name }}</strong><small>{{ folderName(page.folderId) }} · {{ formatDate(page.updatedAt || page.createdAt) }}</small></div><em>{{ projectLabel(page) }}</em></article></div><div v-else class="drawer-empty">Nenhum projeto salvo neste espaço.</div></section>
              <section class="drawer-section"><div class="drawer-section-title"><h3>Histórico de recuperação</h3><span>{{ userDetails.backups.length }}</span></div><div v-if="userDetails.backups.length" class="backup-list"><article v-for="backup in userDetails.backups" :key="backup.id"><div><strong>Revisão {{ backup.revision }}</strong><small>{{ backup.reason }} · {{ formatDate(backup.createdAt) }}</small></div><span>{{ projectCount(backup.pagesCount) }}</span><button :disabled="restoring === backup.id" @click="restoreBackup(backup)">{{ restoring === backup.id ? 'Restaurando...' : 'Restaurar' }}</button></article></div><div v-else class="drawer-empty">Os backups aparecerão após novos salvamentos.</div></section>
            </template>
          </aside>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="templateCreatorOpen" class="template-modal-overlay" @mousedown.self="closeTemplateCreator">
          <section class="template-modal" role="dialog" aria-modal="true" aria-labelledby="template-modal-title">
            <header>
              <div><small>NOVO MODELO</small><h2 id="template-modal-title">Criar template</h2><p>Escolha o formato. O Builder abrirá vazio e pronto para você montar o modelo.</p></div>
              <button aria-label="Fechar" @click="closeTemplateCreator"><i class="bi bi-x-lg"></i></button>
            </header>
            <form @submit.prevent="createTemplate">
              <div class="type-selector" aria-label="Tipo do template">
                <button v-for="option in templateTypes" :key="option.value" type="button" :class="{ active: templateForm.type === option.value }" @click="templateForm.type = option.value"><i :class="option.icon"></i><span><strong>{{ option.label }}</strong><small>{{ option.size }}</small></span></button>
              </div>
              <label><span>Nome do template *</span><input v-model.trim="templateForm.name" required maxlength="80" placeholder="Ex.: Quiz de diagnóstico"></label>
              <label><span>Descrição</span><textarea v-model.trim="templateForm.description" rows="3" maxlength="180" placeholder="Explique quando usar este modelo."></textarea></label>
              <footer><button type="button" class="secondary-button" @click="closeTemplateCreator">Cancelar</button><button type="submit" class="primary-button" :disabled="!canCreateTemplate"><i class="bi bi-pencil-square"></i> Abrir Builder</button></footer>
            </form>
          </section>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBuilderStore } from '../composables/useBuilderStore';
import { createAdminAlert, decideAdminBillingRequest, downloadSupportAttachment, getAdminBillingRequests, getAdminHistory, getAdminOverview, getAdminPages, getAdminSupportTickets, getAdminUsers, getAdminUserWorkspace, restoreAdminBackup, revokeAdminUserSession, revokeAdminUserSessions, updateAdminSupportTicket, updateAdminUserAccess } from '../services/api';

defineEmits(['navigate', 'open-builder']);
const router = useRouter();
const route = useRoute();
const { customTemplatesRegistry, deleteCustomTemplate, flushWorkspaceToBackend, startTemplateBuilder, showToast } = useBuilderStore();
const tab = ref(route.query.tab === 'templates' ? 'templates' : 'overview'); const loading = ref(true); const error = ref(''); const overview = ref({}); const users = ref([]); const allPages = ref([]); const query = ref(''); const pageQuery = ref('');
const selectedUser = ref(null); const userDetails = ref(null); const detailsLoading = ref(false); const restoring = ref('');
const historyItems = ref([]);
const sendingAlert = ref(false);
const supportTickets = ref([]);
const supportFilter = ref('open');
const supportReplies = reactive({});
const updatingTicket = ref('');
const updatingAccess = ref(false);
const revokingSession = ref(false);
const billingRequests = ref([]);
const updatingBilling = ref('');
const alertForm = reactive({ title:'', message:'', type:'info', target:'all', userId:'' });
const templateCreatorOpen = ref(false);
const templateForm = reactive({ type:'funil', name:'', description:'' });
const templateTypes = [
  { value:'funil', label:'Funil / VSL', size:'Largura total', icon:'bi bi-play-btn' },
  { value:'email', label:'E-mail', size:'600px', icon:'bi bi-envelope-paper' },
  { value:'quiz', label:'Quiz', size:'460px', icon:'bi bi-ui-checks-grid' }
];
const pageTitle = computed(() => ({ overview:'Visão geral', users:'Usuários', projects:'Projetos e recuperação', templates:'Templates', alerts:'Alertas', billing:'Planos e cobrança', support:'Suporte', history:'Histórico' }[tab.value]));
const openSupportCount = computed(() => supportTickets.value.filter(ticket => ticket.status === 'open').length);
const pendingBillingCount = computed(() => billingRequests.value.filter(request => request.status === 'pending').length);
const filteredSupportTickets = computed(() => supportTickets.value.filter(ticket => supportFilter.value === 'all' || ticket.status === supportFilter.value));
const stats = computed(() => [
  { label:'Usuários cadastrados', value:overview.value.users || 0, note:`${overview.value.activeThisWeek || 0} ativos nesta semana`, icon:'bi bi-people' },
  { label:'Projetos salvos', value:overview.value.pages || 0, note:`${overview.value.workspaces || 0} espaços sincronizados`, icon:'bi bi-window-stack' },
  { label:'Pastas criadas', value:overview.value.folders || 0, note:'Organização dos usuários', icon:'bi bi-folder2-open' },
  { label:'Versões protegidas', value:overview.value.versions || 0, note:'Histórico dentro dos projetos', icon:'bi bi-clock-history' }
]);
const filteredPages = computed(() => {
  const term = pageQuery.value.trim().toLowerCase();
  return allPages.value.filter(p =>
    !term ||
    p.pageName.toLowerCase().includes(term) ||
    p.userName.toLowerCase().includes(term) ||
    p.userEmail.toLowerCase().includes(term) ||
    (p.folderName && p.folderName.toLowerCase().includes(term)) ||
    (p.slug && p.slug.toLowerCase().includes(term)) ||
    (p.customDomain && p.customDomain.toLowerCase().includes(term))
  );
});
const filteredUsers = computed(() => { const term=query.value.trim().toLowerCase(); return users.value.filter(user => !term || `${user.name} ${user.email}`.toLowerCase().includes(term)); });
const workspacePages = computed(() => userDetails.value?.workspace?.data?.pages || []); const workspaceFolders = computed(() => userDetails.value?.workspace?.data?.folders || []);
const canCreateTemplate = computed(() => Boolean(templateForm.name.trim()));
const canSendAlert = computed(() => Boolean(alertForm.title.trim() && alertForm.message.trim() && (alertForm.target !== 'user' || alertForm.userId)));
onMounted(loadAdminData);
async function loadAdminData(){ loading.value=true; error.value=''; try { [overview.value,users.value,historyItems.value,allPages.value,supportTickets.value,billingRequests.value]=await Promise.all([getAdminOverview(),getAdminUsers(),getAdminHistory().catch(()=>[]),getAdminPages().catch(()=>[]),getAdminSupportTickets().catch(()=>[]),getAdminBillingRequests().catch(()=>[])]); supportTickets.value.forEach(ticket=>{ supportReplies[ticket.id]=ticket.adminReply||''; }); } catch(e){ error.value=e.status===403?'Sua conta não possui permissão administrativa.':e.message; } finally { loading.value=false; } }
async function decideBilling(request,status){ updatingBilling.value=request.id; try { const updated=await decideAdminBillingRequest(request.id,status); const index=billingRequests.value.findIndex(item=>item.id===request.id); if(index>=0)billingRequests.value[index]={...billingRequests.value[index],...updated}; showToast(status==='approved'?'Plano aprovado e ativado.':'Solicitação rejeitada.','success'); } catch(e){ showToast(e.message,'error'); } finally { updatingBilling.value=''; } }
function planLabel(plan){ return ({essential:'Essencial',pro:'Pro',agency:'Agência'}[plan]||plan); }
function requestStatus(status){ return ({pending:'Pendente',approved:'Aprovada',rejected:'Rejeitada'}[status]||status); }
async function updateTicket(ticket,status){ updatingTicket.value=ticket.id; try { const updated=await updateAdminSupportTicket(ticket.id,{status,reply:supportReplies[ticket.id]||''}); const index=supportTickets.value.findIndex(item=>item.id===ticket.id); if(index>=0)supportTickets.value[index]={...ticket,...updated}; showToast(status==='resolved'?'Resposta enviada e ticket resolvido.':'Ticket reaberto.','success'); await loadHistory(); } catch(e){ showToast(e.message,'error'); } finally { updatingTicket.value=''; } }
async function downloadTicketAttachment(ticket,attachment){ try { await downloadSupportAttachment(ticket.id,attachment); } catch(e){ showToast(e.message,'error'); } }
async function loadHistory(){ try { historyItems.value=await getAdminHistory(); } catch(e){ showToast(e.message,'error'); } }
async function sendAlert(){ if(!canSendAlert.value)return; sendingAlert.value=true; try { const result=await createAdminAlert(alertForm); showToast(`Alerta enviado para ${result.delivered} usuário(s).`,'success'); alertForm.title=''; alertForm.message=''; alertForm.type='info'; alertForm.target='all'; alertForm.userId=''; await loadHistory(); } catch(e){ showToast(e.message,'error'); } finally { sendingAlert.value=false; } }
async function openUser(user){ selectedUser.value=user; detailsLoading.value=true; try { userDetails.value=await getAdminUserWorkspace(user.id); } catch(e){ showToast(e.message,'error'); closeUser(); } finally { detailsLoading.value=false; } }
async function changeUserAccess(update){ if(!selectedUser.value)return; updatingAccess.value=true; try { const changed=await updateAdminUserAccess(selectedUser.value.id,update); selectedUser.value={...selectedUser.value,...changed}; const index=users.value.findIndex(user=>user.id===changed.id); if(index>=0)users.value[index]={...users.value[index],...changed}; showToast('Acesso atualizado com sucesso.','success'); } catch(e){ showToast(e.message,'error'); } finally { updatingAccess.value=false; } }
function deviceLabel(userAgent){ const value=String(userAgent||'').toLowerCase(); if(value.includes('iphone')||value.includes('android')||value.includes('mobile'))return 'Dispositivo móvel'; if(value.includes('tablet')||value.includes('ipad'))return 'Tablet'; return 'Computador / navegador'; }
async function revokeUserSession(sessionId){ if(!selectedUser.value)return; revokingSession.value=true; try { await revokeAdminUserSession(selectedUser.value.id,sessionId); userDetails.value.sessions=userDetails.value.sessions.filter(session=>session.id!==sessionId); showToast('Sessão encerrada.','success'); } catch(e){ showToast(e.message,'error'); } finally { revokingSession.value=false; } }
async function revokeAllUserSessions(){ if(!selectedUser.value||!window.confirm(`Encerrar todas as sessões de ${selectedUser.value.name}?`))return; revokingSession.value=true; try { await revokeAdminUserSessions(selectedUser.value.id); userDetails.value.sessions=[]; showToast('Todas as sessões foram encerradas.','success'); } catch(e){ showToast(e.message,'error'); } finally { revokingSession.value=false; } }
function closeUser(){ selectedUser.value=null; userDetails.value=null; }
function initials(name){ return String(name||'U').split(' ').slice(0,2).map(v=>v[0]).join('').toUpperCase(); }
function formatDate(value){ if(!value)return 'Sem atividade'; return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)); }
function folderName(id){ return workspaceFolders.value.find(folder=>folder.id===id)?.name || 'Sem pasta'; }
function downloadWorkspace(){ const data=JSON.stringify(userDetails.value.workspace,null,2); const url=URL.createObjectURL(new Blob([data],{type:'application/json'})); const link=document.createElement('a'); link.href=url; link.download=`backup-${selectedUser.value.email.replace(/[^a-z0-9]/gi,'-')}.json`; link.click(); URL.revokeObjectURL(url); }
async function restoreBackup(backup){ if(!window.confirm(`Restaurar a revisão ${backup.revision}? O estado atual também será protegido.`))return; restoring.value=backup.id; try { await restoreAdminBackup(selectedUser.value.id,backup.id); showToast('Backup restaurado com sucesso.','success'); await openUser(selectedUser.value); await loadAdminData(); } catch(e){ showToast(e.message,'error'); } finally { restoring.value=''; } }
function normalizePageType(page){ const value=String(page?.builderMode || page?.type || 'funil').toLowerCase(); if(value.includes('mail'))return 'email'; if(value.includes('quiz'))return 'quiz'; return 'funil'; }
function projectLabel(page){ const type=normalizePageType(page); return type === 'email' ? 'E-mail' : type === 'quiz' ? 'Quiz' : 'Funil'; }
function projectIcon(page){ const type=normalizePageType(page); return type === 'email' ? 'bi bi-envelope' : type === 'quiz' ? 'bi bi-ui-checks-grid' : 'bi bi-window'; }
function projectCount(count){ return `${count} ${count === 1 ? 'projeto' : 'projetos'}`; }
function eventLabel(type){ return ({ success:'Sucesso', error:'Erro', pending:'Pendente', warning:'Aviso', info:'Info' }[type] || type); }
function templateCategoryLabel(template){ const type=normalizePageType({ type: template.quizMode ? 'quiz' : template.emailMode ? 'email' : template.category }); return type === 'email' ? 'E-MAIL' : type === 'quiz' ? 'QUIZ' : 'FUNIL'; }
function templateIcon(template){ const type=templateCategoryLabel(template); return type === 'E-MAIL' ? 'bi bi-envelope-paper' : type === 'QUIZ' ? 'bi bi-ui-checks-grid' : 'bi bi-play-btn'; }
function openTemplateCreator(){ templateForm.type='funil'; templateForm.name=''; templateForm.description=''; templateCreatorOpen.value=true; }
function closeTemplateCreator(){ templateCreatorOpen.value=false; }
function createTemplate(){
  if(!canCreateTemplate.value)return;
  startTemplateBuilder({ type:templateForm.type, name:templateForm.name, description:templateForm.description });
  closeTemplateCreator();
  router.push('/builder');
}
function editTemplate(template){ startTemplateBuilder({ templateId:template.id }); router.push('/builder'); }
async function removeTemplate(template){ if(!window.confirm(`Excluir o template “${template.name}”?`))return; deleteCustomTemplate(template.id); await flushWorkspaceToBackend?.(); }
</script>

<style scoped>
.admin-shell{min-height:100%;display:grid;grid-template-columns:230px 1fr;background:var(--color-page);color:var(--color-text);font-family:var(--font-sans)}.admin-sidebar{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;padding:18px 14px;background:var(--color-surface);border-right:1px solid var(--color-border)}.admin-brand{display:flex;align-items:center;gap:11px;padding:5px 8px 22px}.admin-brand>span{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--color-primary);color:var(--color-on-primary);font-size:18px}.admin-brand div{display:flex;flex-direction:column}.admin-brand strong{font-size:15px}.admin-brand small{color:var(--color-text-muted);font-size:11px}.admin-sidebar nav{display:flex;flex-direction:column;gap:5px}.admin-sidebar nav button,.back-button{width:100%;display:flex;align-items:center;gap:11px;padding:11px 12px;border:0;border-radius:10px;background:transparent;color:var(--color-text-secondary);font:inherit;font-size:12px;font-weight:800;cursor:pointer;text-align:left}.admin-sidebar nav button:hover,.admin-sidebar nav button.active{background:var(--color-primary-soft);color:var(--color-primary-strong)}.admin-sidebar nav em{margin-left:auto;font-style:normal;padding:2px 7px;border-radius:999px;background:var(--color-surface-soft);font-size:10px}.back-button{margin-top:auto;border:1px solid var(--color-border);justify-content:center}.admin-main{min-width:0}.admin-topbar{height:76px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:var(--color-surface);border-bottom:1px solid var(--color-border)}.admin-topbar p{margin:0;color:var(--color-text-muted);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.9px}.admin-topbar h1{margin:2px 0 0;font-size:19px}.topbar-actions{display:flex;align-items:center;gap:10px}.status-online{display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:9px;background:var(--color-primary-subtle);color:var(--color-primary-strong);font-size:11px;font-weight:800}.status-online i{width:7px;height:7px;border-radius:50%;background:var(--color-primary)}.topbar-actions button{width:36px;height:36px;border:1px solid var(--color-border);border-radius:9px;background:var(--color-surface);color:var(--color-text-secondary);cursor:pointer}.admin-content{padding:26px;max-width:1450px;margin:0 auto}.welcome-card{display:flex;align-items:center;justify-content:space-between;padding:26px;border-radius:18px;background:var(--color-primary);color:var(--color-on-primary);margin-bottom:20px}.welcome-card span{font-size:10px;font-weight:900;letter-spacing:1px;opacity:.8}.welcome-card h2{margin:6px 0;font-size:23px}.welcome-card p{margin:0;font-size:13px;opacity:.85}.welcome-card button,.primary-button{border:0;border-radius:10px;padding:10px 14px;background:var(--color-surface);color:var(--color-primary-strong);font:inherit;font-size:12px;font-weight:900;cursor:pointer}.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.stat-card{display:flex;gap:14px;padding:18px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:15px}.stat-icon{width:42px;height:42px;display:grid;place-items:center;flex:0 0 auto;border-radius:11px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:18px}.stat-card div{display:flex;flex-direction:column}.stat-card strong{font-size:23px;line-height:1}.stat-card small{margin-top:5px;color:var(--color-text);font-size:11px;font-weight:800}.stat-card p{margin:3px 0 0;color:var(--color-text-muted);font-size:10px}.overview-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:16px;margin-top:16px}.panel-card,.users-table-card{background:var(--color-surface);border:1px solid var(--color-border);border-radius:15px;overflow:hidden}.panel-header{display:flex;align-items:center;justify-content:space-between;padding:18px;border-bottom:1px solid var(--color-border)}.panel-header h3{margin:0;font-size:14px}.panel-header p{margin:3px 0 0;color:var(--color-text-muted);font-size:10px}.panel-header button{border:0;background:transparent;color:var(--color-primary-strong);font:inherit;font-size:11px;font-weight:900;cursor:pointer}.recent-list button{width:100%;display:grid;grid-template-columns:38px 1fr auto 14px;gap:10px;align-items:center;padding:12px 18px;border:0;border-bottom:1px solid var(--color-border);background:transparent;text-align:left;cursor:pointer}.recent-list button:hover{background:var(--color-primary-subtle)}.avatar{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:11px;font-weight:900}.recent-list button>span:nth-child(2){display:flex;flex-direction:column}.recent-list strong{font-size:12px}.recent-list small{color:var(--color-text-muted);font-size:10px}.recent-list em{font-style:normal;color:var(--color-text-secondary);font-size:10px}.system-card ul{list-style:none;margin:0;padding:8px 18px}.system-card li{display:grid;grid-template-columns:18px 1fr auto;gap:10px;padding:12px 0;border-bottom:1px solid var(--color-border);align-items:center}.system-card li>i{color:var(--color-primary)}.system-card li span{display:flex;flex-direction:column}.system-card li strong{font-size:11px}.system-card li small{font-size:9px;color:var(--color-text-muted)}.system-card li em{font-style:normal;font-size:9px;font-weight:900;color:var(--color-primary-strong)}.section-heading{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:18px}.section-heading h2{margin:0;font-size:21px}.section-heading p{margin:4px 0 0;color:var(--color-text-muted);font-size:12px}.admin-search{position:relative;width:280px}.admin-search i{position:absolute;left:12px;top:10px;color:var(--color-text-soft)}.admin-search input{width:100%;padding:9px 12px 9px 35px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface);font:inherit;font-size:12px;outline:none}.table-head,.user-row{display:grid;grid-template-columns:2fr .65fr .65fr 1.1fr .65fr 30px;gap:12px;align-items:center}.table-head{padding:11px 16px;background:var(--color-surface-soft);color:var(--color-text-muted);font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.5px}.user-row{width:100%;padding:13px 16px;border:0;border-top:1px solid var(--color-border);background:var(--color-surface);text-align:left;cursor:pointer}.user-row:hover{background:var(--color-primary-subtle)}.user-cell{display:flex;align-items:center;gap:10px}.user-cell>span:last-child,.user-row>span:not(.user-cell){display:flex;flex-direction:column}.user-row strong{font-size:11px;color:var(--color-text)}.user-row small{font-size:9px;color:var(--color-text-muted);margin-top:2px}.status-pill{width:max-content;padding:4px 8px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-style:normal;font-size:9px;font-weight:900}.status-pill.inactive{opacity:.5}.row-action{color:var(--color-text-soft)}.empty-table,.state-panel{min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--color-text-muted)}.state-panel.error i{font-size:28px;color:var(--color-primary)}.state-panel button{padding:8px 12px;border:0;border-radius:8px;background:var(--color-primary);color:var(--color-on-primary);font-weight:800}.spinner{width:26px;height:26px;border:3px solid var(--color-primary-soft);border-top-color:var(--color-primary);border-radius:50%;animation:spin .7s linear infinite}.template-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.template-card{display:flex;gap:13px;padding:18px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface)}.template-card>span{width:44px;height:44px;border-radius:11px;display:grid;place-items:center;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:18px}.template-card small{font-size:8px;font-weight:900;color:var(--color-primary-strong)}.template-card h3{margin:4px 0;font-size:13px}.template-card p{margin:0;color:var(--color-text-muted);font-size:10px;line-height:1.4}.primary-button{background:var(--color-primary);color:var(--color-on-primary)}
.template-heading-actions,.template-actions{display:flex;align-items:center;gap:8px}.secondary-button{border:1px solid var(--color-border);border-radius:10px;padding:10px 14px;background:var(--color-surface);color:var(--color-text-secondary);font:inherit;font-size:12px;font-weight:900;cursor:pointer}.template-card-content{display:flex;flex:1;min-width:0;flex-direction:column}.template-actions{margin-top:auto;padding-top:12px}.template-actions button{border:1px solid var(--color-primary-border);border-radius:8px;padding:6px 9px;background:var(--color-primary-subtle);color:var(--color-primary-strong);font:inherit;font-size:10px;font-weight:900;cursor:pointer}.template-actions button.danger{margin-left:auto;border-color:var(--color-border);background:var(--color-surface);color:var(--color-text-muted)}.template-empty{margin-top:16px;padding:28px;border:1px dashed var(--color-primary-border);border-radius:15px;background:var(--color-primary-subtle);text-align:center}.template-empty>i{display:block;margin-bottom:8px;color:var(--color-primary);font-size:25px}.template-empty strong{display:block;font-size:13px}.template-empty p{margin:5px 0 14px;color:var(--color-text-muted);font-size:11px}.template-modal-overlay{position:fixed;inset:0;z-index:15000;display:grid;place-items:center;padding:18px;background:var(--color-overlay)}.template-modal{width:min(640px,100%);max-height:calc(100vh - 36px);overflow:auto;border:1px solid var(--color-primary-border);border-radius:20px;background:var(--color-surface);box-shadow:var(--shadow-xl);color:var(--color-text)}.template-modal>header{display:flex;align-items:flex-start;justify-content:space-between;padding:22px;border-bottom:1px solid var(--color-border)}.template-modal>header small{color:var(--color-primary-strong);font-size:9px;font-weight:900;letter-spacing:.9px}.template-modal>header h2{margin:4px 0;font-size:20px}.template-modal>header p{margin:0;color:var(--color-text-muted);font-size:11px}.template-modal>header>button{width:34px;height:34px;border:0;border-radius:9px;background:var(--color-surface-soft);color:var(--color-text-secondary);cursor:pointer}.template-modal form{display:flex;flex-direction:column;gap:15px;padding:22px}.type-selector{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.type-selector>button{display:flex;align-items:center;gap:9px;padding:12px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-surface);color:var(--color-text-secondary);font:inherit;text-align:left;cursor:pointer}.type-selector>button.active{border-color:var(--color-primary);background:var(--color-primary-subtle);color:var(--color-primary-strong);box-shadow:0 0 0 2px var(--color-primary-soft)}.type-selector>button>i{font-size:18px}.type-selector span{display:flex;min-width:0;flex-direction:column}.type-selector strong{font-size:11px}.type-selector small{font-size:9px;color:var(--color-text-muted)}.template-modal form>label{display:flex;flex-direction:column;gap:6px}.template-modal form>label>span{font-size:10px;font-weight:900;color:var(--color-text-secondary)}.template-modal input,.template-modal select,.template-modal textarea{width:100%;border:1px solid var(--color-border);border-radius:10px;padding:10px 11px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:12px;outline:none}.template-modal input:focus,.template-modal select:focus,.template-modal textarea:focus{border-color:var(--color-primary);box-shadow:0 0 0 3px var(--color-primary-soft)}.template-modal label>small{color:var(--color-text-muted);font-size:9px}.template-modal footer{display:flex;justify-content:flex-end;gap:9px;padding-top:5px}.template-modal button:disabled{cursor:not-allowed;opacity:.45}
.admin-form-card,.history-table-card{padding:18px;border:1px solid var(--color-border);border-radius:15px;background:var(--color-surface);box-shadow:var(--shadow-sm)}.admin-form-card{display:flex;flex-direction:column;gap:14px}.admin-form-card label{display:flex;flex-direction:column;gap:6px}.admin-form-card label>span{color:var(--color-text-secondary);font-size:10px;font-weight:900;text-transform:uppercase}.admin-form-card input,.admin-form-card select,.admin-form-card textarea{width:100%;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface-soft);color:var(--color-text);padding:10px 11px;font:inherit;font-size:12px;outline:0}.admin-form-card input:focus,.admin-form-card select:focus,.admin-form-card textarea:focus{border-color:var(--color-primary);box-shadow:0 0 0 3px var(--color-primary-soft)}.form-grid-3{display:grid;grid-template-columns:1fr 1fr 1.5fr;gap:12px}.admin-form-card footer{display:flex;justify-content:flex-end}.history-table-card{overflow:auto;padding:0}.history-row{min-width:850px;display:grid;grid-template-columns:100px minmax(260px,1.7fr) minmax(130px,.8fr) minmax(150px,1fr) 150px;gap:14px;align-items:center;padding:13px 16px;border-bottom:1px solid var(--color-border)}.history-row:last-child{border-bottom:0}.history-head{background:var(--color-surface-soft);color:var(--color-text-muted);font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.5px}.history-row strong{display:block;color:var(--color-text);font-size:12px}.history-row small{display:block;margin-top:3px;color:var(--color-text-muted);font-size:10px;line-height:1.4}.history-row span,.history-row time{min-width:0;overflow:hidden;color:var(--color-text-secondary);font-size:11px;text-overflow:ellipsis}.event-pill{display:inline-flex;padding:4px 8px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-style:normal;font-size:9px;font-weight:900}.event-pill.error{background:var(--color-danger-soft);color:var(--color-danger-strong)}.event-pill.pending,.event-pill.warning{background:#fef3c7;color:#92400e}.event-pill.success{background:#dcfce7;color:#166534}
.drawer-overlay{position:fixed;inset:0;z-index:13000;background:var(--color-overlay);display:flex;justify-content:flex-end}.user-drawer{width:min(560px,100%);height:100%;overflow:auto;background:var(--color-surface);box-shadow:var(--shadow-xl)}.user-drawer>header{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid var(--color-border);background:var(--color-surface)}.drawer-user{display:flex;align-items:center;gap:12px}.avatar.large{width:46px;height:46px;border-radius:13px}.drawer-user h2{margin:0;font-size:16px}.drawer-user p{margin:3px 0 0;color:var(--color-text-muted);font-size:11px}.user-drawer>header>button{width:36px;height:36px;border:0;border-radius:9px;background:var(--color-surface-soft);cursor:pointer}.drawer-loading{min-height:300px;display:flex;align-items:center;justify-content:center;gap:10px}.drawer-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:16px 20px}.drawer-summary div{display:flex;flex-direction:column;padding:13px;border-radius:11px;background:var(--color-primary-subtle);border:1px solid var(--color-primary-border)}.drawer-summary strong{font-size:19px}.drawer-summary small{font-size:9px;color:var(--color-text-muted)}.drawer-actions{padding:0 20px 5px}.drawer-actions button{width:100%;padding:10px;border:1px solid var(--color-primary-border);border-radius:9px;background:var(--color-primary-soft);color:var(--color-primary-strong);font:inherit;font-size:11px;font-weight:900;cursor:pointer}.drawer-section{padding:18px 20px;border-top:1px solid var(--color-border)}.drawer-section-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.drawer-section-title h3{margin:0;font-size:13px}.drawer-section-title span{padding:2px 7px;border-radius:999px;background:var(--color-surface-soft);font-size:9px}.project-list article,.backup-list article{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--color-border)}.project-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--color-primary-soft);color:var(--color-primary-strong)}.project-list article>div,.backup-list article>div{display:flex;flex:1;flex-direction:column}.project-list strong,.backup-list strong{font-size:11px}.project-list small,.backup-list small{font-size:9px;color:var(--color-text-muted);margin-top:3px}.project-list em{font-style:normal;font-size:9px;color:var(--color-primary-strong)}.backup-list article>span{font-size:9px;color:var(--color-text-muted)}.backup-list button{padding:6px 9px;border:1px solid var(--color-primary-border);border-radius:7px;background:var(--color-surface);color:var(--color-primary-strong);font-size:9px;font-weight:900;cursor:pointer}.drawer-empty{padding:22px;border-radius:10px;background:var(--color-surface-soft);text-align:center;color:var(--color-text-muted);font-size:10px}.drawer-enter-active,.drawer-leave-active{transition:opacity .2s}.drawer-enter-active .user-drawer,.drawer-leave-active .user-drawer{transition:transform .25s ease}.drawer-enter-from,.drawer-leave-to{opacity:0}.drawer-enter-from .user-drawer,.drawer-leave-to .user-drawer{transform:translateX(100%)}@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:1000px){.stats-grid{grid-template-columns:repeat(2,1fr)}.overview-grid{grid-template-columns:1fr}.template-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:760px){.admin-shell{display:block}.admin-sidebar{position:static;width:100%;height:auto;padding:10px}.admin-brand{display:none}.admin-sidebar nav{flex-direction:row;overflow:auto}.admin-sidebar nav button{min-width:max-content}.back-button{margin-top:8px}.admin-topbar{height:auto;padding:14px}.status-online{display:none}.admin-content{padding:14px}.welcome-card{align-items:flex-start;gap:14px}.stats-grid,.template-grid{grid-template-columns:1fr}.section-heading{align-items:flex-start;gap:12px;flex-direction:column}.template-heading-actions{width:100%}.template-heading-actions button{flex:1}.admin-search{width:100%}.table-head{display:none}.user-row{grid-template-columns:1fr auto}.user-row>span:nth-child(2),.user-row>span:nth-child(3),.user-row>span:nth-child(4),.user-row>span:nth-child(5){display:none}.overview-grid{grid-template-columns:1fr}.type-selector{grid-template-columns:1fr}.template-modal>header,.template-modal form{padding:17px}.template-modal footer{flex-direction:column-reverse}.template-modal footer button{width:100%}}

.pages-table-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 15px; overflow: hidden; }
.pages-head, .pages-row { display: grid; grid-template-columns: 2fr 1.3fr .9fr 1.3fr .9fr 170px; gap: 12px; align-items: center; }
.pages-head { padding: 11px 16px; background: var(--color-surface-soft); color: var(--color-text-muted); font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .5px; }
.pages-row { width: 100%; padding: 12px 16px; border-top: 1px solid var(--color-border); background: var(--color-surface); font-size: 12px; }
.pages-row:hover { background: var(--color-primary-subtle); }
.page-cell { display: flex; align-items: center; gap: 10px; }
.page-type-icon { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; background: var(--color-primary-soft); color: var(--color-primary-strong); font-size: 15px; flex-shrink: 0; }
.page-cell span:last-child { display: flex; flex-direction: column; }
.page-cell strong { font-size: 12px; color: var(--color-text); }
.page-cell small { font-size: 10px; color: var(--color-text-muted); margin-top: 2px; }
.user-meta-cell { display: flex; flex-direction: column; }
.user-meta-cell strong { font-size: 11px; color: var(--color-text); }
.user-meta-cell small { font-size: 10px; color: var(--color-text-muted); }
.folder-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 6px; background: var(--color-surface-soft); font-style: normal; font-size: 10px; font-weight: 700; color: var(--color-text-secondary); }
.domain-cell { display: flex; flex-direction: column; gap: 3px; }
.page-link { font-size: 11px; font-weight: 700; color: var(--color-primary); text-decoration: none; display: inline-flex; align-items: center; gap: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px; }
.page-link:hover { text-decoration: underline; }
.status-subpill { display: inline-block; font-size: 9px; font-weight: 800; border-radius: 4px; padding: 1px 5px; width: max-content; }
.status-subpill.active { background: #dcfce7; color: #166534; }
.status-subpill.pending { background: #fef3c7; color: #92400e; }
.status-subpill.draft { background: var(--color-surface-soft); color: var(--color-text-muted); font-style: normal; }
.pages-row time { font-size: 11px; color: var(--color-text-muted); }
.page-row-actions { display: flex; align-items: center; justify-content: flex-end; gap: 6px; }
.btn-admin-edit { display: inline-flex; align-items: center; gap: 6px; padding: 7px 11px; border: 1px solid var(--color-primary-border); border-radius: 8px; background: var(--color-primary); color: #ffffff; font: inherit; font-size: 11px; font-weight: 800; cursor: pointer; transition: filter 0.15s; }
.btn-admin-edit:hover { filter: brightness(1.08); }
.btn-admin-visit { display: inline-grid; place-items: center; width: 31px; height: 31px; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-surface); color: var(--color-text-secondary); text-decoration: none; font-size: 12px; }
.btn-admin-visit:hover { background: var(--color-surface-soft); color: var(--color-primary); }

.admin-sidebar{background:#171126!important;border-right-color:#302442!important;color:#fff}.admin-brand strong{color:#fff}.admin-brand small{color:#978ca8}.admin-sidebar nav button{color:#d6cde2}.admin-sidebar nav button:hover,.admin-sidebar nav button.active{background:#6d32f5;color:#fff}.admin-sidebar nav em{background:#34234b;color:#dbcaff}.admin-sidebar .back-button{border-color:#49365f;background:#241832;color:#ddd3ec}.admin-sidebar .back-button:hover{background:#342245;color:#fff}
.support-filter{min-width:150px;padding:9px 11px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface);color:var(--color-text)}.admin-support-list{display:flex;flex-direction:column;gap:12px}.admin-support-ticket{padding:18px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface)}.admin-support-ticket header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.admin-support-ticket header>div{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:5px 9px}.admin-support-ticket header strong{font-size:14px}.admin-support-ticket header small{grid-column:2;color:var(--color-text-muted);font-size:10px}.admin-support-ticket time{color:var(--color-text-muted);font-size:10px}.admin-support-ticket>p{margin:14px 0;color:var(--color-text-secondary);font-size:12px;line-height:1.55;white-space:pre-wrap}.support-priority{grid-row:1/3;padding:4px 7px;border-radius:7px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:9px;font-weight:900}.support-priority.alta{background:#fef3c7;color:#92400e}.support-priority.urgente{background:var(--color-danger-soft);color:var(--color-danger-strong)}.support-ticket-meta{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px;color:var(--color-text-muted);font-size:10px}.admin-support-ticket textarea{width:100%;resize:vertical;padding:11px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface-soft);color:var(--color-text);font:inherit;font-size:12px}.admin-support-ticket footer{display:flex;justify-content:flex-end;gap:8px;margin-top:10px}.admin-support-ticket footer button:disabled{opacity:.5;cursor:not-allowed}
.drawer-access-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 20px 12px}.drawer-access-actions button{padding:9px;border:1px solid var(--color-border);border-radius:9px;background:var(--color-surface);color:var(--color-text-secondary);font:inherit;font-size:10px;font-weight:800;cursor:pointer}.drawer-access-actions button:hover{border-color:var(--color-primary-border);color:var(--color-primary-strong)}.drawer-access-actions button:disabled{opacity:.5;cursor:not-allowed}
.admin-session-list{display:flex;flex-direction:column;gap:7px}.admin-session-list article{display:grid;grid-template-columns:26px 1fr auto;gap:8px;align-items:center;padding:9px;border:1px solid var(--color-border);border-radius:9px;background:var(--color-surface-soft)}.admin-session-list article>i{color:var(--color-primary-strong)}.admin-session-list article>div{display:flex;min-width:0;flex-direction:column}.admin-session-list strong{font-size:10px}.admin-session-list small{overflow:hidden;color:var(--color-text-muted);font-size:9px;text-overflow:ellipsis;white-space:nowrap}.admin-session-list article button{width:26px;height:26px;border:0;border-radius:7px;background:var(--color-surface);color:var(--color-text-muted);cursor:pointer}.revoke-all-sessions{align-self:flex-start;margin-top:3px;padding:7px 9px;border:1px solid var(--color-danger-soft);border-radius:8px;background:var(--color-surface);color:var(--color-danger-strong);font:inherit;font-size:9px;font-weight:900;cursor:pointer}.revoke-all-sessions:disabled,.admin-session-list button:disabled{cursor:not-allowed;opacity:.55}
.admin-ticket-thread{display:flex;flex-direction:column;gap:6px;margin:12px 0}.admin-ticket-thread>div{padding:9px 11px;border:1px solid var(--color-border);border-radius:9px;background:var(--color-surface-soft)}.admin-ticket-thread>div.admin{margin-left:30px;border-color:var(--color-primary-border);background:var(--color-primary-subtle)}.admin-ticket-thread strong{font-size:10px;color:var(--color-primary-strong)}.admin-ticket-thread p{margin:4px 0;color:var(--color-text-secondary);font-size:11px;white-space:pre-wrap}.admin-ticket-thread small{color:var(--color-text-muted);font-size:9px}
.admin-ticket-attachments{display:flex;flex-wrap:wrap;gap:6px;margin:9px 0}.admin-ticket-attachments button{padding:6px 8px;border:1px solid var(--color-border);border-radius:7px;background:var(--color-surface-soft);color:var(--color-text-secondary);font:inherit;font-size:9px;cursor:pointer}
.billing-request-list{display:flex;flex-direction:column;gap:10px}.billing-request-card{display:grid;grid-template-columns:minmax(180px,1.4fr) 120px 160px 90px auto;align-items:center;gap:14px;padding:15px 17px;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface)}.billing-request-card>div:first-child{display:flex;flex-direction:column}.billing-request-card strong{font-size:12px}.billing-request-card small,.billing-request-card time{color:var(--color-text-muted);font-size:10px}.billing-request-card>span{font-size:11px}.billing-request-card>em{width:max-content;padding:4px 8px;border-radius:999px;background:#fef3c7;color:#92400e;font-style:normal;font-size:9px;font-weight:900}.billing-request-card>em.approved{background:#dcfce7;color:#166534}.billing-request-card>em.rejected{background:var(--color-danger-soft);color:var(--color-danger-strong)}.billing-actions{display:flex;justify-content:flex-end;gap:7px}.billing-actions button{padding:8px 11px;border-radius:8px;border:1px solid var(--color-border);font:inherit;font-size:10px;font-weight:900;cursor:pointer}.billing-actions button:disabled{opacity:.5}@media(max-width:900px){.billing-request-card{grid-template-columns:1fr 1fr}.billing-actions{grid-column:1/-1;justify-content:flex-start}}
</style>
