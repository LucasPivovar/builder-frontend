<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <!-- Brand -->
      <div class="auth-brand">
        <AstroMark class="brand-logo" />
        <h1>Astro Builder</h1>
        <p>Crie páginas de funil e templates profissionais</p>
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

        <!-- Switch to Register -->
        <div class="auth-switch-box">
          <span>Não tem uma conta?</span>
          <button type="button" class="btn-switch-link" @click="switchMode('register')">
            Cadastre-se agora
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

        <!-- Switch to Login -->
        <div class="auth-switch-box">
          <span>Já tem uma conta?</span>
          <button type="button" class="btn-switch-link" @click="switchMode('login')">
            Fazer login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AstroMark from '../AstroMark.vue';
import { useRouter, useRoute } from 'vue-router';
import { login, register, storeAuthSession } from '../../services/api';
import { useBuilderStore } from '../../composables/useBuilderStore';

const router = useRouter();
const route = useRoute();
const { hydrateWorkspaceFromBackend } = useBuilderStore();

const mode = ref(route.query.mode === 'register' ? 'register' : 'login');
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

const redirectTarget = computed(() => {
  const target = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard';
  return target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';
});

function switchMode(nextMode) {
  mode.value = nextMode;
  loginError.value = '';
  registerError.value = '';
  registerSuccess.value = '';
}

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
  const m = { weak: 'Fraca', fair: 'Razoável', good: 'Boa', strong: 'Forte' };
  return m[passwordStrengthClass.value];
});

async function handleLogin() {
  loginError.value = '';
  loading.value = true;
  try {
    const session = await login({
      email: loginEmail.value.trim().toLowerCase(),
      password: loginPassword.value,
      remember: rememberMe.value
    });
    storeAuthSession(session, rememberMe.value);
    await hydrateWorkspaceFromBackend();
    router.push(redirectTarget.value);
  } catch (error) {
    loginError.value = error.message || 'Não foi possível entrar.';
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  registerError.value = '';
  registerSuccess.value = '';
  if (regPassword.value !== regConfirmPassword.value) { registerError.value = 'Senhas não coincidem.'; return; }
  if (!acceptTerms.value) { registerError.value = 'Aceite os termos de uso.'; return; }
  loading.value = true;
  try {
    const session = await register({
      name: regName.value.trim(),
      lastName: regLastName.value.trim(),
      email: regEmail.value.trim().toLowerCase(),
      password: regPassword.value,
      remember: true
    });
    storeAuthSession(session, true);
    await hydrateWorkspaceFromBackend();
    registerSuccess.value = 'Conta criada! Abrindo seu painel...';
    setTimeout(() => router.push(redirectTarget.value), 350);
  } catch (error) {
    registerError.value = error.message || 'Não foi possível criar a conta.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-subtle);
  padding: 20px;
}

.auth-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 22px;
  padding: 36px;
  width: 440px;
  max-width: 100%;
  box-shadow: 0 18px 46px rgba(40, 25, 96, 0.14);
}

.auth-brand { text-align: center; margin-bottom: 28px; }
.brand-logo { --mark-width: 78px; --mark-height: 56px; margin-bottom: 10px; }
.auth-brand h1 { font-size: 22px; font-weight: 900; color: var(--color-text); margin-bottom: 4px; }
.auth-brand p { font-size: 13.5px; color: var(--color-text-secondary); }

.auth-form { display: flex; flex-direction: column; gap: 0; }

.form-group { margin-bottom: 14px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-label { display: block; font-size: 12px; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }

.input-wrapper { position: relative; }
.input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-primary-hover); font-size: 14px; pointer-events: none; }
.btn-toggle-pass { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--color-primary-hover); cursor: pointer; font-size: 14px; padding: 4px; }

.form-input {
  width: 100%; padding: 10px 14px 10px 38px;
  background: var(--color-surface-soft); border: 1px solid var(--color-border);
  border-radius: 10px; color: var(--color-text); font-size: 14px; outline: none;
  transition: border-color 0.2s;
}

.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(97, 43, 244, .13); }
.form-input.has-icon-right { padding-right: 38px; }
.form-input::placeholder { color: var(--color-text-soft); }

.form-row-between { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }

.check-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--color-text-secondary); cursor: pointer; }
.check-label input[type="checkbox"] { accent-color: var(--color-primary); width: 14px; height: 14px; cursor: pointer; }

.link-forgot, .link-terms { color: var(--color-primary-hover); font-size: 12.5px; text-decoration: none; font-weight: 600; }
.link-forgot:hover, .link-terms:hover { color: var(--color-primary-strong); text-decoration: underline; }

.password-strength { margin-top: 6px; display: flex; align-items: center; gap: 8px; }
.strength-bar { flex: 1; height: 4px; background: rgba(0,0,0,0.06); border-radius: 999px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 999px; transition: width 0.3s, background 0.3s; }
.strength-fill.weak { background: #ef4444; }
.strength-fill.fair { background: var(--color-primary-bright); }
.strength-fill.good { background: #3b82f6; }
.strength-fill.strong { background: #10b981; }
.strength-label { font-size: 11px; font-weight: 700; white-space: nowrap; }
.strength-label.weak { color: #ef4444; }
.strength-label.fair { color: var(--color-primary-hover); }
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
  color: var(--color-primary-strong); padding: 8px 12px; border-radius: 8px; font-size: 13px;
  display: flex; align-items: center; gap: 6px; margin-bottom: 14px;
}

.btn-auth {
  width: 100%; padding: 13px;
  background: var(--gradient-aurora); border: none; color: #ffffff;
  font-size: 15px; font-weight: 800; border-radius: 12px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 6px 16px rgba(97, 43, 244, .24);
  transition: all 0.2s;
}

.btn-auth:hover { background: var(--color-primary-hover); transform: translateY(-1px); }
.btn-auth:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* Switch Links Underneath the Button */
.auth-switch-box {
  margin-top: 20px;
  text-align: center;
  font-size: 13.5px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-switch-link {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.15s ease;
}

.btn-switch-link:hover {
  color: var(--color-primary-hover);
}
</style>
