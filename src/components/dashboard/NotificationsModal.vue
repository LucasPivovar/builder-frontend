<template>
  <Teleport to="body">
    <Transition name="notification-modal">
      <div v-if="isOpen" class="notifications-overlay" @mousedown.self="$emit('close')">
        <section class="notifications-modal" role="dialog" aria-modal="true" aria-label="Notificações">
          <header>
            <div class="modal-title">
              <span class="title-icon"><i class="bi bi-bell-fill"></i></span>
              <div><h2>Notificações</h2><p>{{ unreadCount ? `${unreadCount} ${unreadCount === 1 ? 'não lida' : 'não lidas'}` : 'Tudo em dia' }}</p></div>
            </div>
            <button class="close-button" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
          </header>
          <div class="notification-toolbar">
            <button :disabled="!unreadCount || loading" @click="$emit('read-all')"><i class="bi bi-check2-all"></i> Marcar todas como lidas</button>
          </div>
          <div class="notification-list">
            <div v-if="loading" class="empty-state"><span class="spinner"></span><p>Carregando notificações...</p></div>
            <button v-for="item in items" v-else :key="item.id" class="notification-item" :class="{ unread: !item.read }" @click="$emit('select', item)">
              <span class="item-icon"><i :class="iconFor(item.type)"></i></span>
              <span class="item-copy"><strong>{{ item.title }}</strong><small>{{ item.message }}</small><time>{{ formatDate(item.createdAt) }}</time></span>
              <span v-if="!item.read" class="unread-dot"></span>
            </button>
            <div v-if="!loading && !items.length" class="empty-state"><i class="bi bi-bell-slash"></i><strong>Nenhuma notificação</strong><p>As novidades da plataforma aparecerão aqui.</p></div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({ isOpen: Boolean, items: { type: Array, default: () => [] }, unreadCount: { type: Number, default: 0 }, loading: Boolean });
defineEmits(['close', 'read-all', 'select']);
const icons = { welcome: 'bi bi-stars', security: 'bi bi-shield-check', update: 'bi bi-lightning-charge', info: 'bi bi-info-circle' };
function iconFor(type) { return icons[type] || icons.info; }
function formatDate(value) { return new Intl.DateTimeFormat('pt-BR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }).format(new Date(value)); }
</script>

<style scoped>
.notifications-overlay { position:fixed; inset:0; z-index:12000; display:flex; justify-content:flex-end; align-items:flex-start; padding:72px 24px 24px; background:var(--overlay); backdrop-filter:blur(3px); }
.notifications-modal { width:min(430px, calc(100vw - 28px)); max-height:calc(100vh - 96px); display:flex; flex-direction:column; background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-xl); box-shadow:var(--shadow-modal); overflow:hidden; }
header { display:flex; align-items:center; justify-content:space-between; padding:20px; border-bottom:1px solid var(--color-border); }
.modal-title { display:flex; align-items:center; gap:12px; }.title-icon { width:42px; height:42px; border-radius:12px; display:grid; place-items:center; background:var(--color-primary-soft); color:var(--color-primary-strong); font-size:18px; }
h2 { margin:0; font-size:18px; color:var(--color-text); }p { margin:2px 0 0; color:var(--color-text-muted); font-size:12px; }.close-button { width:36px; height:36px; border:0; border-radius:9px; background:var(--color-surface-soft); color:var(--color-text-muted); cursor:pointer; }
.notification-toolbar { padding:10px 18px; border-bottom:1px solid var(--color-border); text-align:right; }.notification-toolbar button { border:0; background:transparent; color:var(--color-primary-strong); font:inherit; font-size:12px; font-weight:800; cursor:pointer; }.notification-toolbar button:disabled { opacity:.45; cursor:default; }
.notification-list { overflow:auto; display:flex; flex-direction:column; gap:8px; padding:10px; }.notification-item { width:100%; flex:0 0 auto; display:grid; grid-template-columns:42px 1fr 8px; gap:12px; align-items:start; text-align:left; border:1px solid transparent; border-radius:12px; padding:13px; background:transparent; cursor:pointer; }.notification-item:hover { background:var(--color-primary-subtle); }.notification-item.unread { background:var(--color-primary-subtle); border-color:var(--color-primary-border); }
.item-icon { width:40px; height:40px; border-radius:11px; display:grid; place-items:center; background:var(--color-surface); border:1px solid var(--color-border); color:var(--color-primary-strong); }.item-copy { min-width:0; display:flex; flex-direction:column; gap:4px; }.item-copy strong { color:var(--color-text); font-size:13px; }.item-copy small { color:var(--color-text-secondary); font-size:12px; line-height:1.45; }.item-copy time { color:var(--color-text-soft); font-size:10px; }.unread-dot { width:7px; height:7px; margin-top:6px; border-radius:50%; background:var(--color-primary); }
.empty-state { min-height:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; text-align:center; color:var(--color-text-muted); }.empty-state>i { font-size:28px; color:var(--color-primary); }.empty-state strong { color:var(--color-text); }.spinner { width:24px; height:24px; border:3px solid var(--color-primary-soft); border-top-color:var(--color-primary); border-radius:50%; animation:spin .7s linear infinite; }
.notification-modal-enter-active,.notification-modal-leave-active { transition:opacity .2s ease; }.notification-modal-enter-active .notifications-modal,.notification-modal-leave-active .notifications-modal { transition:transform .24s ease,opacity .2s ease; }.notification-modal-enter-from,.notification-modal-leave-to { opacity:0; }.notification-modal-enter-from .notifications-modal,.notification-modal-leave-to .notifications-modal { transform:translateY(-12px) scale(.98); opacity:0; }@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:600px){.notifications-overlay{padding:0;align-items:flex-end}.notifications-modal{width:100%;max-height:85vh;border-radius:20px 20px 0 0}}
</style>
