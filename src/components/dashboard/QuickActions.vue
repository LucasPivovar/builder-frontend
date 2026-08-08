<template>
  <div class="quick-start-grid">
    <div class="action-card" @click="$emit('open-create-modal')">
      <div class="action-card-icon"><i class="bi bi-file-earmark-plus"></i></div>
      <div>
        <div class="action-card-title">Criar em Branco</div>
        <div class="action-card-subtitle">Funil ou E-mail</div>
      </div>
    </div>

    <div class="action-card" @click="$emit('open-builder', 'vsl')">
      <div class="action-card-icon" style="background: rgba(52, 211, 153, 0.2); color: #34d399;"><i class="bi bi-play-circle-fill"></i></div>
      <div>
        <div class="action-card-title">Template VSL</div>
        <div class="action-card-subtitle">Funil de vídeo pronto</div>
      </div>
    </div>

    <div class="action-card" @click="$emit('open-builder', 'email')">
      <div class="action-card-icon" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;"><i class="bi bi-envelope-paper-fill"></i></div>
      <div>
        <div class="action-card-title">Template E-mail</div>
        <div class="action-card-subtitle">E-mail marketing 600px</div>
      </div>
    </div>

    <div class="action-card" @click="$emit('select-templates')">
      <div class="action-card-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;"><i class="bi bi-magic"></i></div>
      <div>
        <div class="action-card-title">Ver Templates</div>
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
  background: rgba(23, 31, 48, 0.75);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-card:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: #6366f1;
  transform: translateY(-2px);
}

.action-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.action-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.action-card-subtitle {
  font-size: 12px;
  color: #94a3b8;
}
</style>
