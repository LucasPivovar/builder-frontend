<template>
  <div class="settings-view-container">
    <div class="page-header-title">
      <div class="title-group">
        <h1>⚙️ Configurações da Conta</h1>
        <p>Gerencie seu perfil, preferências, rastreamento e segurança</p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="settings-tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
        <i class="bi bi-person-fill"></i> Meu Perfil
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'preferences' }" @click="activeTab = 'preferences'">
        <i class="bi bi-sliders"></i> Preferências & Domínios
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'tracking' }" @click="activeTab = 'tracking'">
        <i class="bi bi-graph-up-arrow"></i> Rastreamento (Pixel / GTM)
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'security' }" @click="activeTab = 'security'">
        <i class="bi bi-shield-lock-fill"></i> Segurança
      </button>
    </div>

    <!-- Tab 1: Meu Perfil -->
    <div v-if="activeTab === 'profile'" class="settings-card-panel">
      <div class="profile-header-card">
        <div class="avatar-big">L</div>
        <div>
          <h3>Lucas Wallysson</h3>
          <p class="sub-text">lucas@email.com · Plano Pro Performance</p>
        </div>
      </div>

      <div class="form-grid-2">
        <div class="form-group">
          <label class="form-label">Nome Completo</label>
          <input type="text" class="custom-input" v-model="profile.name" />
        </div>
        <div class="form-group">
          <label class="form-label">Endereço de E-mail</label>
          <input type="email" class="custom-input" v-model="profile.email" />
        </div>
        <div class="form-group">
          <label class="form-label">Empresa / Negócio</label>
          <input type="text" class="custom-input" v-model="profile.company" placeholder="Sua Empresa Ltda" />
        </div>
        <div class="form-group">
          <label class="form-label">Telefone / WhatsApp</label>
          <input type="text" class="custom-input" v-model="profile.phone" placeholder="(11) 99999-9999" />
        </div>
      </div>

      <button class="btn-primary-sm" @click="saveProfile">
        <i class="bi bi-check-lg"></i> Salvar Perfil
      </button>
    </div>

    <!-- Tab 2: Preferências & Domínios -->
    <div v-else-if="activeTab === 'preferences'" class="settings-card-panel">
      <div class="settings-group">
        <h3>🌐 Domínio Personalizado</h3>
        <p class="sub-desc">Conecte seu próprio domínio para publicar suas páginas com sua marca.</p>
        <div class="form-row-custom">
          <input type="text" class="custom-input" placeholder="ex: meudominio.com.br" v-model="domainInput" />
          <button class="btn-primary-sm" @click="saveDomain">Conectar Domínio</button>
        </div>
      </div>

      <div class="settings-group" style="margin-top: 24px;">
        <h3>🎨 Preferências do Editor</h3>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Tema do Dashboard</label>
            <select class="custom-select" v-model="preferences.theme">
              <option value="dark">Escuro Premium (Padrão)</option>
              <option value="glass">Glassmorphism Dark</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Auto-Salvar no Builder</label>
            <select class="custom-select" v-model="preferences.autoSave">
              <option value="true">Ativado (a cada 2 minutos)</option>
              <option value="false">Desativado (manual)</option>
            </select>
          </div>
        </div>
        <button class="btn-primary-sm" @click="savePreferences">Salvar Preferências</button>
      </div>
    </div>

    <!-- Tab 3: Rastreamento -->
    <div v-else-if="activeTab === 'tracking'" class="settings-card-panel">
      <div class="settings-group">
        <h3>⚡ Meta Pixel (Facebook & Instagram)</h3>
        <p class="sub-desc">Insira o ID do seu Meta Pixel para rastrear conversões em todas as suas páginas.</p>
        <div class="form-row-custom">
          <input type="text" class="custom-input" placeholder="Ex: 123456789012345" v-model="pixelInput" />
          <button class="btn-primary-sm" @click="savePixel">Salvar Pixel</button>
        </div>
      </div>

      <div class="settings-group" style="margin-top: 24px;">
        <h3>🏷️ Google Tag Manager (GTM)</h3>
        <p class="sub-desc">Insira o ID do seu container do GTM (ex: GTM-XXXXXXX).</p>
        <div class="form-row-custom">
          <input type="text" class="custom-input" placeholder="Ex: GTM-ABC1234" v-model="gtmInput" />
          <button class="btn-primary-sm" @click="saveGtm">Salvar GTM</button>
        </div>
      </div>
    </div>

    <!-- Tab 4: Segurança -->
    <div v-else-if="activeTab === 'security'" class="settings-card-panel">
      <div class="settings-group">
        <h3>🔒 Alterar Senha</h3>
        <div class="form-stack">
          <div class="form-group">
            <label class="form-label">Senha Atual</label>
            <input type="password" class="custom-input" v-model="pass.current" placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label class="form-label">Nova Senha</label>
            <input type="password" class="custom-input" v-model="pass.newPass" placeholder="Mínimo 8 caracteres" />
          </div>
          <div class="form-group">
            <label class="form-label">Confirmar Nova Senha</label>
            <input type="password" class="custom-input" v-model="pass.confirmPass" placeholder="••••••••" />
          </div>
        </div>
        <button class="btn-primary-sm" @click="changePassword" style="margin-top: 14px;">
          Atualizar Senha
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useBuilderStore } from '../../composables/useBuilderStore';

const { showToast } = useBuilderStore();

const activeTab = ref('profile');

const profile = reactive({
  name: 'Lucas Wallysson',
  email: 'lucas@email.com',
  company: 'Dollar App Digital',
  phone: '(11) 99999-9999'
});

const domainInput = ref('builder.meudominio.com');
const pixelInput = ref('123456789012345');
const gtmInput = ref('GTM-W82910X');

const preferences = reactive({
  theme: 'dark',
  autoSave: 'true'
});

const pass = reactive({
  current: '',
  newPass: '',
  confirmPass: ''
});

function saveProfile() { showToast('✅ Perfil atualizado com sucesso!'); }
function saveDomain() { showToast('✅ Domínio conectado com sucesso!'); }
function savePixel() { showToast('✅ Meta Pixel salvo!'); }
function saveGtm() { showToast('✅ GTM salvo!'); }
function savePreferences() { showToast('✅ Preferências salvas!'); }
function changePassword() {
  if (!pass.current || !pass.newPass) { showToast('⚠️ Preencha os campos de senha', 'error'); return; }
  if (pass.newPass !== pass.confirmPass) { showToast('❌ As senhas não coincidem', 'error'); return; }
  showToast('🔒 Senha alterada com sucesso!');
  pass.current = ''; pass.newPass = ''; pass.confirmPass = '';
}
</script>

<style scoped>
.settings-view-container { max-width: 800px; margin: 0 auto; }
.page-header-title { margin-bottom: 24px; }
.page-header-title h1 { font-size: 24px; font-weight: 800; color: #fff; }
.page-header-title p { font-size: 14px; color: #94a3b8; }

.settings-tabs {
  display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;
  background: rgba(23, 31, 48, 0.5); padding: 4px; border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.08);
}

.tab-btn {
  flex: 1; min-width: 140px; padding: 10px 16px; border-radius: 10px; border: none;
  background: transparent; color: #94a3b8; font-size: 13.5px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
}

.tab-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }
.tab-btn.active { background: #6366f1; color: #fff; }

.settings-card-panel {
  background: rgba(23, 31, 48, 0.75); border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px; padding: 28px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.profile-header-card {
  display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
  padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.avatar-big {
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #6366f1);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800; color: #fff;
}

.profile-header-card h3 { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 2px; }
.sub-text { font-size: 13px; color: #94a3b8; }
.sub-desc { font-size: 13px; color: #94a3b8; margin-bottom: 12px; }

.settings-group h3 { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; }

.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.form-stack { display: flex; flex-direction: column; gap: 14px; max-width: 400px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 12.5px; font-weight: 700; color: #e2e8f0; }

.custom-input, .custom-select {
  width: 100%; background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
  padding: 10px 14px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.2s;
}

.custom-input:focus, .custom-select:focus { border-color: #6366f1; }

.form-row-custom { display: flex; gap: 12px; }

.btn-primary-sm {
  background: #6366f1; color: #fff; border: none; padding: 10px 20px;
  border-radius: 10px; font-weight: 700; font-size: 13.5px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
}

.btn-primary-sm:hover { background: #5558e8; }
</style>
