<template>
  <div class="quick-start-grid">
    <div class="action-card" @click="$emit('open-create-modal')">
      <div class="action-card-icon"><i class="bi bi-file-earmark-plus"></i></div>
      <div>
        <div class="action-card-title">Criar em branco</div>
        <div class="action-card-subtitle">Funil, e-mail ou quiz</div>
      </div>
    </div>

    <div class="action-card" @click="$emit('open-builder', 'vsl')">
      <div class="action-card-icon"><i class="bi bi-play-circle-fill"></i></div>
      <div>
        <div class="action-card-title">Template VSL</div>
        <div class="action-card-subtitle">Funil de vídeo pronto</div>
      </div>
    </div>

    <div class="action-card" @click="$emit('open-builder', 'email')">
      <div class="action-card-icon"><i class="bi bi-envelope-paper-fill"></i></div>
      <div>
        <div class="action-card-title">Template de e-mail</div>
        <div class="action-card-subtitle">E-mail marketing 600px</div>
      </div>
    </div>

    <div class="action-card" @click="$emit('select-templates')">
      <div class="action-card-icon"><i class="bi bi-magic"></i></div>
      <div>
        <div class="action-card-title">Ver templates</div>
        <div class="action-card-subtitle">Biblioteca de modelos</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['open-builder', 'open-create-modal', 'select-templates']);
</script>

<style scoped>
.quick-start-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.action-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-card:hover {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.action-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-primary-soft);
  color: var(--color-primary-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.action-card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.action-card-subtitle {
  font-size: 12px;
  color: var(--color-text-soft);
}
</style>
