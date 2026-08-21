<template>
  <Teleport to="body">
    <div v-if="isOpen" class="confirm-overlay" @click.self="$emit('cancel')">
      <section class="confirm-modal" role="dialog" aria-modal="true">
        <header>
          <span><i :class="icon"></i></span>
          <div>
            <h2>{{ title }}</h2>
            <p>{{ message }}</p>
          </div>
        </header>
        <footer>
          <button class="secondary" type="button" @click="$emit('cancel')">{{ cancelLabel }}</button>
          <button class="danger" type="button" @click="$emit('confirm')">{{ confirmLabel }}</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: { type: String, default: 'Confirmar ação' },
  message: { type: String, default: '' },
  icon: { type: String, default: 'bi bi-exclamation-triangle' },
  confirmLabel: { type: String, default: 'Confirmar' },
  cancelLabel: { type: String, default: 'Cancelar' }
});
defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.confirm-overlay{position:fixed;inset:0;z-index:100001;display:grid;place-items:center;padding:20px;background:var(--overlay);backdrop-filter:blur(4px)}
.confirm-modal{width:min(430px,96vw);overflow:hidden;border:1px solid var(--color-border);border-radius:var(--radius-xl);background:var(--color-surface);box-shadow:var(--shadow-modal)}
header{display:grid;grid-template-columns:42px 1fr;gap:13px;padding:22px;border-bottom:1px solid var(--color-border)}
header>span{width:42px;height:42px;display:grid;place-items:center;border-radius:11px;background:rgba(239,68,68,.1);color:#dc2626;font-size:19px}
h2{margin:0;color:var(--color-text);font-size:18px}p{margin:5px 0 0;color:var(--color-text-muted);font-size:12px;line-height:1.45}
footer{display:flex;justify-content:flex-end;gap:9px;padding:16px 22px;background:var(--color-surface-soft)}
button{border-radius:9px;padding:9px 14px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}.secondary{border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text-secondary)}.danger{border:1px solid #dc2626;background:#dc2626;color:#fff}
</style>
