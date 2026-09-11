<template>
  <Teleport to="body">
    <div v-if="conflict.open" class="modal-backdrop">
      <section class="conflict-modal" role="dialog" aria-modal="true" aria-labelledby="workspace-conflict-title">
        <div class="modal-header">
          <h3 id="workspace-conflict-title"><i class="bi bi-exclamation-triangle-fill"></i> Este workspace mudou em outra sessão</h3>
          <p>Duas versões diferentes existem ao mesmo tempo. Escolha qual delas fica — a outra é descartada.</p>
        </div>

        <div class="modal-body">
          <div class="compare">
            <article class="side">
              <h4>Versão do servidor</h4>
              <p class="count">{{ server.pagesCount }} {{ server.pagesCount === 1 ? 'página' : 'páginas' }}</p>
              <p class="meta">{{ server.foldersCount }} {{ server.foldersCount === 1 ? 'pasta' : 'pastas' }} · {{ server.rootPagesCount }} sem pasta</p>
              <p class="meta" v-if="server.lastEditedAt">Editada em {{ formatDate(server.lastEditedAt) }}</p>
            </article>
            <article class="side">
              <h4>Suas alterações locais</h4>
              <p class="count">{{ local.pagesCount }} {{ local.pagesCount === 1 ? 'página' : 'páginas' }}</p>
              <p class="meta">{{ local.foldersCount }} {{ local.foldersCount === 1 ? 'pasta' : 'pastas' }} · {{ local.rootPagesCount }} sem pasta</p>
              <p class="meta" v-if="local.lastEditedAt">Editada em {{ formatDate(local.lastEditedAt) }}</p>
            </article>
          </div>

          <div v-if="losses.length" class="warning">
            <strong>Manter as alterações locais custa:</strong>
            <ul>
              <li v-for="(loss, index) in losses" :key="index">{{ loss }}</li>
            </ul>
          </div>
          <p v-else class="no-loss">Nenhuma perda detectada entre as duas versões.</p>
        </div>

        <div class="modal-footer">
          <button class="btn-safe" type="button" @click="answer('server')">
            <i class="bi bi-cloud-download"></i> Carregar a versão do servidor
          </button>
          <button class="btn-risk" type="button" @click="answer('local')">
            Manter minhas alterações locais
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useBuilderStore } from '../composables/useBuilderStore';

const { workspaceConflict: conflict, answerWorkspaceConflict, registerWorkspaceConflictUi } = useBuilderStore();

const empty = { pagesCount: 0, foldersCount: 0, rootPagesCount: 0, pageNames: [], pagesByFolder: [], lastEditedAt: '' };
const local = computed(() => conflict.local || empty);
const server = computed(() => conflict.server || empty);

// O que a escolha destrutiva custa, em texto, antes de ela ser feita.
const losses = computed(() => {
  const items = [];
  const localIds = new Set(local.value.pagesByFolder.map(page => page.id));
  const missing = server.value.pagesByFolder.filter(page => !localIds.has(page.id));
  if (missing.length) items.push(`${missing.length} página(s) somem: ${missing.map(page => page.name).join(', ')}`);

  const localById = new Map(local.value.pagesByFolder.map(page => [page.id, page]));
  const unfiled = server.value.pagesByFolder.filter(page => {
    const mirror = localById.get(page.id);
    return mirror && page.folder && !mirror.folder;
  });
  if (unfiled.length) items.push(`${unfiled.length} página(s) saem da pasta e vão para a raiz: ${unfiled.map(page => `${page.name} (${page.folder})`).join(', ')}`);

  if (server.value.foldersCount > local.value.foldersCount) {
    items.push(`${server.value.foldersCount - local.value.foldersCount} pasta(s) deixam de existir`);
  }
  return items;
});

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('pt-BR');
}

function answer(choice) {
  answerWorkspaceConflict(choice);
}

onMounted(() => registerWorkspaceConflictUi(true));
onUnmounted(() => registerWorkspaceConflictUi(false));
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 10050;
  background: var(--overlay, rgba(0, 0, 0, 0.7));
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}

.conflict-modal {
  background: var(--color-surface); color: var(--color-text);
  border: 1px solid var(--color-border); border-radius: 18px;
  width: 560px; max-width: 94vw; box-shadow: var(--shadow-modal);
}

.modal-header { padding: 20px 24px 14px; border-bottom: 1px solid var(--color-border); }
.modal-header h3 { font-size: 17px; font-weight: 800; margin-bottom: 4px; }
.modal-header p { font-size: 13px; color: var(--color-text-muted); }

.modal-body { padding: 18px 24px; }
.compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.side { border: 1px solid var(--color-border); border-radius: 12px; padding: 12px 14px; background: var(--color-surface-soft); }
.side h4 { font-size: 12.5px; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 6px; }
.count { font-size: 18px; font-weight: 800; }
.meta { font-size: 12.5px; color: var(--color-text-muted); }

.warning {
  margin-top: 16px; padding: 12px 14px; border-radius: 12px;
  background: var(--color-danger-soft, rgba(220, 38, 38, 0.12));
  border: 1px solid var(--color-danger, rgba(220, 38, 38, 0.4));
  font-size: 13px;
}
.warning ul { margin: 6px 0 0 18px; }
.warning li { margin-bottom: 3px; }
.no-loss { margin-top: 16px; font-size: 13px; color: var(--color-text-muted); }

.modal-footer {
  display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;
  padding: 14px 24px 20px; border-top: 1px solid var(--color-border); background: var(--color-surface-soft);
}

.btn-safe {
  background: var(--color-primary); border: none; color: #fff;
  padding: 10px 18px; border-radius: 9px; font-weight: 700; font-size: 13.5px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn-risk {
  background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text-secondary);
  padding: 10px 18px; border-radius: 9px; font-weight: 600; font-size: 13.5px; cursor: pointer;
}

@media (max-width: 520px) { .compare { grid-template-columns: 1fr; } }
</style>
