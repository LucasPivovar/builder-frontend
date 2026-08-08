<template>
  <div class="billing-view-container">
    <div class="page-header-title">
      <div class="title-group">
        <h1>💳 Assinaturas & Planos</h1>
        <p>Gerencie sua assinatura e faturamento</p>
      </div>
    </div>

    <div class="settings-card-panel">
      <div class="billing-status-box">
        <div>
          <span class="badge-plan-active">PLANO ATIVO</span>
          <h2 style="font-size: 24px; margin-top: 6px;">Pro Performance</h2>
          <p style="font-size: 13.5px; color: #94a3b8;">Renovação automática em 07/09/2026 · R$ 99,00/mês</p>
        </div>
        <button class="btn-outline-sm" @click="manageBilling">Gerenciar Cartão</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuilderStore } from '../../composables/useBuilderStore';

const { showToast } = useBuilderStore();

function manageBilling() {
  showToast('Redirecionando para portal financeiro...', 'info');
}
</script>

<style scoped>
.page-header-title h1 { font-size: 24px; font-weight: 800; }
.page-header-title p { font-size: 14px; color: #94a3b8; }
.settings-card-panel {
  background: rgba(23, 31, 48, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 28px;
  max-width: 700px;
  margin-top: 20px;
}
.billing-status-box { display: flex; align-items: center; justify-content: space-between; }
.badge-plan-active {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
}
.btn-outline-sm {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
}
</style>
