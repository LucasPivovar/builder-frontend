<template>
  <div class="profile-view-container">
    <div class="page-header-title">
      <div class="title-group">
        <h1>👤 Meu Perfil</h1>
        <p>Edite suas informações pessoais e credenciais de acesso</p>
      </div>
    </div>

    <div class="settings-card-panel">
      <div class="profile-header-avatar">
        <div class="user-avatar-lg">L</div>
        <div>
          <h3 style="margin-bottom: 2px;">Lucas Wallysson</h3>
          <span style="font-size: 13px; color: #38bdf8;">lucas@exemplo.com · Administrador</span>
        </div>
      </div>

      <div class="settings-group" style="margin-top: 24px;">
        <label class="custom-label">Nome Completo</label>
        <input type="text" class="custom-input" v-model="name" />
      </div>

      <div class="settings-group" style="margin-top: 16px;">
        <label class="custom-label">E-mail</label>
        <input type="email" class="custom-input" v-model="email" />
      </div>

      <button class="btn-primary-sm" style="margin-top: 20px;" @click="saveProfile">Salvar Alterações</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBuilderStore } from '../../composables/useBuilderStore';

const { showToast } = useBuilderStore();
const name = ref('Lucas Wallysson');
const email = ref('lucas@exemplo.com');

function saveProfile() {
  showToast('✅ Perfil atualizado com sucesso!');
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
.profile-header-avatar { display: flex; align-items: center; gap: 16px; }
.user-avatar-lg {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 22px;
  color: #fff;
}
.custom-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #e2e8f0; }
.custom-input {
  width: 100%;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 14px;
  color: #fff;
  font-size: 14px;
  outline: none;
}
.btn-primary-sm {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13.5px;
  cursor: pointer;
}
</style>
