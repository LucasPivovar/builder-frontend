<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <!-- Brand -->
      <div class="auth-brand">
        <div class="brand-logo">🚀</div>
        <h1>Visual Builder Studio</h1>
        <p>Crie páginas de funil e templates profissionais</p>
      </div>

      <!-- Tabs -->
      <div class="auth-tabs">
        <button class="tab-btn" :class="{ active: mode === 'login' }" @click="mode = 'login'">Entrar</button>
        <button class="tab-btn" :class="{ active: mode === 'register' }" @click="mode = 'register'">Criar conta</button>
      </div>

      <!-- Login Form -->
      <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <div class="input-wrapper">
            <i class="bi bi-envelope-fill input-icon"></i>
            <input type="email" class="form-input" v-model="loginEmail" placeholder="seu@email.com" required autocomplete="email" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Senha</label>
          <div class="input-wrapper">
            <i class="bi bi-lock-fill input-icon"></i>
            <input
              :type="showPass ? 'text' : 'password'"
              class="form-input has-icon-right"
              v-model="loginPassword"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
            <button type="button" class="btn-toggle-pass" @click="showPass = !showPass">
              <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-row-between">
          <label class="check-label">
            <input type="checkbox" v-model="rememberMe" /> Lembrar-me
          </label>
          <a href="#" class="link-forgot" @click.prevent>Esqueceu a senha?</a>
        </div>

        <div v-if="loginError" class="error-message">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ loginError }}
        </div>

        <button type="submit" class="btn-auth" :disabled="loading">
          <span v-if="!loading"><i class="bi bi-box-arrow-in-right"></i> Entrar na conta</span>
          <span v-else><i class="bi bi-hourglass-split"></i> Aguarde...</span>
        </button>

        <div class="auth-divider"><span>ou continue com</span></div>

        <div class="social-buttons">
          <button type="button" class="btn-social">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" class="btn-social">
            <i class="bi bi-github" style="color: #fff;"></i>
            GitHub
          </button>
        </div>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <div class="input-wrapper">
              <i class="bi bi-person-fill input-icon"></i>
              <input type="text" class="form-input" v-model="regName" placeholder="João" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Sobrenome</label>
            <div class="input-wrapper">
              <i class="bi bi-person-fill input-icon"></i>
              <input type="text" class="form-input" v-model="regLastName" placeholder="Silva" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">E-mail</label>
          <div class="input-wrapper">
            <i class="bi bi-envelope-fill input-icon"></i>
            <input type="email" class="form-input" v-model="regEmail" placeholder="seu@email.com" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Senha</label>
          <div class="input-wrapper">
            <i class="bi bi-lock-fill input-icon"></i>
            <input
              :type="showPass ? 'text' : 'password'"
              class="form-input has-icon-right"
              v-model="regPassword"
              placeholder="Mínimo 8 caracteres"
              required
            />
            <button type="button" class="btn-toggle-pass" @click="showPass = !showPass">
              <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <div class="password-strength" v-if="regPassword.length > 0">
            <div class="strength-bar">
              <div class="strength-fill" :class="passwordStrengthClass" :style="{ width: passwordStrength + '%' }"></div>
            </div>
            <span class="strength-label" :class="passwordStrengthClass">{{ passwordStrengthLabel }}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Confirmar Senha</label>
          <div class="input-wrapper">
            <i class="bi bi-shield-lock-fill input-icon"></i>
            <input
              :type="showPass ? 'text' : 'password'"
              class="form-input"
              v-model="regConfirmPassword"
              placeholder="••••••••"
              required
            />
          </div>
          <div v-if="regConfirmPassword && regPassword !== regConfirmPassword" class="error-inline">
            <i class="bi bi-x-circle-fill"></i> Senhas não coincidem
          </div>
        </div>

        <div class="form-group">
          <label class="check-label" style="font-size: 12.5px;">
            <input type="checkbox" v-model="acceptTerms" required />
            Li e aceito os <a href="#" class="link-terms">Termos de Uso</a> e a <a href="#" class="link-terms">Política de Privacidade</a>
          </label>
        </div>

        <div v-if="registerError" class="error-message">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ registerError }}
        </div>
        <div v-if="registerSuccess" class="success-message">
          <i class="bi bi-check-circle-fill"></i> {{ registerSuccess }}
        </div>

        <button type="submit" class="btn-auth" :disabled="loading || regPassword !== regConfirmPassword">
          <span v-if="!loading"><i class="bi bi-person-plus-fill"></i> Criar minha conta</span>
          <span v-else><i class="bi bi-hourglass-split"></i> Criando conta...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const mode = ref('login');
const loading = ref(false);
const showPass = ref(false);

// Login
const loginEmail = ref('');
const loginPassword = ref('');
const rememberMe = ref(false);
const loginError = ref('');

// Register
const regName = ref('');
const regLastName = ref('');
const regEmail = ref('');
const regPassword = ref('');
const regConfirmPassword = ref('');
const acceptTerms = ref(false);
const registerError = ref('');
const registerSuccess = ref('');

const passwordStrength = computed(() => {
  const p = regPassword.value;
  if (p.length === 0) return 0;
  let score = 0;
  if (p.length >= 8) score += 25;
  if (/[A-Z]/.test(p)) score += 25;
  if (/[0-9]/.test(p)) score += 25;
  if (/[^A-Za-z0-9]/.test(p)) score += 25;
  return score;
});

const passwordStrengthClass = computed(() => {
  const s = passwordStrength.value;
  if (s <= 25) return 'weak';
  if (s <= 50) return 'fair';
  if (s <= 75) return 'good';
  return 'strong';
});

const passwordStrengthLabel = computed(() => {
  const m = { weak: '⚠️ Fraca', fair: '📊 Razoável', good: '👍 Boa', strong: '🔒 Forte' };
  return m[passwordStrengthClass.value];
});

async function handleLogin() {
  loginError.value = '';
  loading.value = true;
  await new Promise(r => setTimeout(r, 800));
  loading.value = false;

  // Simulate auth (localStorage)
  const users = JSON.parse(localStorage.getItem('vbs_users') || '[]');
  const user = users.find(u => u.email === loginEmail.value && u.password === loginPassword.value);

  if (user || loginEmail.value === 'admin@test.com') {
    const currentUser = user || { name: 'Admin', email: loginEmail.value };
    localStorage.setItem('vbs_current_user', JSON.stringify(currentUser));
    localStorage.setItem('vbs_logged_in', 'true');
    router.push('/dashboard');
  } else {
    loginError.value = 'E-mail ou senha incorretos. Tente novamente.';
  }
}

async function handleRegister() {
  registerError.value = '';
  registerSuccess.value = '';
  if (regPassword.value !== regConfirmPassword.value) { registerError.value = 'Senhas não coincidem.'; return; }
  if (!acceptTerms.value) { registerError.value = 'Aceite os termos de uso.'; return; }
  loading.value = true;
  await new Promise(r => setTimeout(r, 900));
  loading.value = false;

  const users = JSON.parse(localStorage.getItem('vbs_users') || '[]');
  if (users.find(u => u.email === regEmail.value)) {
    registerError.value = 'Este e-mail já está cadastrado.';
    return;
  }

  users.push({
    id: 'user-' + Date.now(),
    name: `${regName.value} ${regLastName.value}`.trim(),
    email: regEmail.value,
    password: regPassword.value,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('vbs_users', JSON.stringify(users));
  registerSuccess.value = '✅ Conta criada! Redirecionando para login...';
  setTimeout(() => { mode.value = 'login'; registerSuccess.value = ''; }, 1800);
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              #08091a;
  padding: 20px;
}

.auth-card {
  background: rgba(13, 18, 32, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  padding: 36px;
  width: 440px;
  max-width: 100%;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
}

.auth-brand { text-align: center; margin-bottom: 28px; }
.brand-logo { font-size: 40px; margin-bottom: 10px; }
.auth-brand h1 { font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 4px; }
.auth-brand p { font-size: 13.5px; color: #94a3b8; }

.auth-tabs { display: flex; background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 3px; margin-bottom: 24px; }
.tab-btn { flex: 1; padding: 9px; border-radius: 10px; border: none; background: none; color: #94a3b8; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.tab-btn.active { background: #6366f1; color: #fff; }

.auth-form { display: flex; flex-direction: column; gap: 0; }

.form-group { margin-bottom: 14px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-label { display: block; font-size: 12px; font-weight: 700; color: #e2e8f0; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }

.input-wrapper { position: relative; }
.input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 14px; pointer-events: none; }
.btn-toggle-pass { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 14px; padding: 4px; }

.form-input {
  width: 100%; padding: 10px 14px 10px 38px;
  background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px; color: #fff; font-size: 14px; outline: none;
  transition: border-color 0.2s;
}

.form-input:focus { border-color: #6366f1; }
.form-input.has-icon-right { padding-right: 38px; }

.form-row-between { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }

.check-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #94a3b8; cursor: pointer; }
.check-label input[type="checkbox"] { accent-color: #6366f1; width: 14px; height: 14px; cursor: pointer; }

.link-forgot, .link-terms { color: #818cf8; font-size: 12.5px; text-decoration: none; font-weight: 600; }
.link-forgot:hover, .link-terms:hover { color: #a5b4fc; text-decoration: underline; }

.password-strength { margin-top: 6px; display: flex; align-items: center; gap: 8px; }
.strength-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 999px; transition: width 0.3s, background 0.3s; }
.strength-fill.weak { background: #ef4444; }
.strength-fill.fair { background: #f59e0b; }
.strength-fill.good { background: #3b82f6; }
.strength-fill.strong { background: #10b981; }
.strength-label { font-size: 11px; font-weight: 700; white-space: nowrap; }
.strength-label.weak { color: #ef4444; }
.strength-label.fair { color: #f59e0b; }
.strength-label.good { color: #3b82f6; }
.strength-label.strong { color: #10b981; }

.error-message, .error-inline {
  background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171; padding: 8px 12px; border-radius: 8px; font-size: 13px;
  display: flex; align-items: center; gap: 6px; margin-bottom: 14px;
}

.error-inline { padding: 4px 10px; margin-top: 4px; margin-bottom: 0; font-size: 12px; }

.success-message {
  background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399; padding: 8px 12px; border-radius: 8px; font-size: 13px;
  display: flex; align-items: center; gap: 6px; margin-bottom: 14px;
}

.btn-auth {
  width: 100%; padding: 12px;
  background: #6366f1; border: none; color: #fff;
  font-size: 15px; font-weight: 800; border-radius: 12px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  transition: all 0.2s;
}

.btn-auth:hover { background: #5558e8; }
.btn-auth:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-divider { text-align: center; margin: 20px 0 14px; position: relative; }
.auth-divider::before {
  content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px;
  background: rgba(255, 255, 255, 0.08);
}
.auth-divider span {
  position: relative; background: #0d1220; padding: 0 12px;
  color: #64748b; font-size: 12px;
}

.social-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.btn-social {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0; padding: 10px; border-radius: 10px; font-size: 13.5px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}

.btn-social:hover { background: rgba(255, 255, 255, 0.1); }
</style>
