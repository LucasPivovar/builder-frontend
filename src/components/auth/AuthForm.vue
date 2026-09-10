<template>
  <div class="auth-wrapper">
    <!-- Brand Logo Navigation -->
    <div class="auth-nav-header">
      <router-link to="/" class="auth-home" aria-label="Astro Builder">
        <AstroMark class="auth-logo" />
        <span class="auth-brand-name">Astro<span class="brand-light">Builder</span></span>
      </router-link>
    </div>

    <div class="auth-card">
      <!-- Brand -->
      <div class="auth-brand">
        
        <h1>{{ authCopy.title }}</h1>
        <p>{{ authCopy.description }}</p>
      </div>

      <!-- Login Form -->
      <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <div class="input-wrapper">
            <i class="bi bi-envelope input-icon" aria-hidden="true"></i>
            <input type="email" class="form-input" v-model="loginEmail" placeholder="seu@email.com" required autocomplete="email" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Senha</label>
          <div class="input-wrapper">
            <i class="bi bi-lock input-icon" aria-hidden="true"></i>
            <input
              :type="showPass ? 'text' : 'password'"
              class="form-input has-icon-right"
              v-model="loginPassword"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
            <button type="button" class="btn-toggle-pass" :aria-label="showPass ? 'Ocultar senha' : 'Mostrar senha'" :aria-pressed="showPass" @click="showPass = !showPass">
              <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div class="form-row-between">
          <label class="check-label">
            <input type="checkbox" v-model="rememberMe" /> Lembrar-me
          </label>
          <a href="#" class="link-forgot" @click.prevent="switchMode('reset')">Esqueceu a senha?</a>
        </div>

        <div v-if="loginError" class="error-message" role="alert">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ loginError }}
        </div>

        <button type="submit" class="btn-auth" :disabled="loading">
          <span v-if="!loading"><i class="bi bi-arrow-right-circle" aria-hidden="true"></i> Entrar na conta</span>
          <span v-else><i class="bi bi-hourglass-split" aria-hidden="true"></i> Aguarde...</span>
        </button>

        <!-- Switch to Register -->
        <div class="auth-switch-box">
          <div class="switch-row">
            <span>Não tem uma conta?</span>
            <button type="button" class="btn-switch-link" @click="switchMode('register')">
              Cadastre-se agora
            </button>
          </div>
          <div class="switch-row verify-row">
            <span>Recebeu um código?</span>
            <button type="button" class="btn-switch-link" @click="switchMode('verify')">Confirmar e-mail</button>
          </div>
        </div>
      </form>

      <!-- Register Form -->
      <form v-else-if="mode === 'register'" @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Primeiro nome</label>
            <div class="input-wrapper">
              <i class="bi bi-person input-icon" aria-hidden="true"></i>
              <input type="text" class="form-input" v-model="regName" placeholder="João" required autocomplete="given-name" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Último nome</label>
            <div class="input-wrapper">
              <i class="bi bi-person input-icon" aria-hidden="true"></i>
              <input type="text" class="form-input" v-model="regLastName" placeholder="Silva" autocomplete="family-name" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">E-mail</label>
          <div class="input-wrapper">
            <i class="bi bi-envelope input-icon" aria-hidden="true"></i>
            <input type="email" class="form-input" v-model="regEmail" placeholder="seu@email.com" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">WhatsApp</label>
          <div class="input-wrapper">
            <i class="bi bi-whatsapp input-icon" aria-hidden="true"></i>
            <input type="tel" class="form-input" :value="regPhone" @input="maskRegPhone" placeholder="(11) 99999-9999" required autocomplete="tel" inputmode="tel" maxlength="19" />
          </div>
        </div>

        <div class="form-group password-field-group">
          <label class="form-label">Senha</label>
          <div class="input-wrapper">
            <i class="bi bi-lock input-icon" aria-hidden="true"></i>
            <input
              :type="showPass ? 'text' : 'password'"
              class="form-input has-icon-right"
              v-model="regPassword"
              placeholder="Mínimo 8 caracteres"
              required
              autocomplete="new-password"
              aria-describedby="password-requirements"
              :aria-expanded="passwordRequirementsOpen"
              @focus="passwordRequirementsOpen = true"
              @click="passwordRequirementsOpen = true"
              @blur="passwordRequirementsOpen = false"
            />
            <button type="button" class="btn-toggle-pass" :aria-label="showPass ? 'Ocultar senha' : 'Mostrar senha'" :aria-pressed="showPass" @click="showPass = !showPass">
              <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'" aria-hidden="true"></i>
            </button>
          </div>
          <div class="password-strength" v-if="regPassword.length > 0">
            <div class="strength-bar">
              <div class="strength-fill" :class="passwordStrengthClass" :style="{ width: passwordStrength + '%' }"></div>
            </div>
            <span class="strength-label" :class="passwordStrengthClass">{{ passwordStrengthLabel }}</span>
          </div>
          <Transition name="requirements-popover">
            <div v-if="passwordRequirementsOpen" id="password-requirements" class="password-requirements" role="status">
              <strong>Crie uma senha segura</strong>
              <p v-for="requirement in passwordRequirements" :key="requirement.label" :class="{ valid: requirement.valid }">
                <i :class="requirement.valid ? 'bi bi-check-circle-fill' : 'bi bi-circle'" aria-hidden="true"></i>
                {{ requirement.label }}
              </p>
            </div>
          </Transition>
        </div>

        <div class="form-group">
          <label class="form-label">Confirmar Senha</label>
          <div class="input-wrapper">
            <i class="bi bi-shield-lock input-icon" aria-hidden="true"></i>
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

        <div v-if="registerError" class="error-message" role="alert">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ registerError }}
        </div>
        <div v-if="registerSuccess" class="success-message" role="status">
          <i class="bi bi-check-circle-fill"></i> {{ registerSuccess }}
        </div>

        <button type="submit" class="btn-auth" :disabled="loading || !passwordMeetsRequirements || regPassword !== regConfirmPassword">
          <span v-if="!loading"><i class="bi bi-person-plus" aria-hidden="true"></i> Criar minha conta</span>
          <span v-else><i class="bi bi-hourglass-split" aria-hidden="true"></i> Criando conta...</span>
        </button>

        <!-- Switch to Login -->
        <div class="auth-switch-box">
          <div class="switch-row">
            <span>Já tem uma conta?</span>
            <button type="button" class="btn-switch-link" @click="switchMode('login')">
              Fazer login
            </button>
          </div>
          <div class="switch-row verify-row">
            <span>Recebeu um código?</span>
            <button type="button" class="btn-switch-link" @click="switchMode('verify')">
              Confirmar e-mail
            </button>
          </div>
        </div>
      </form>

      <form v-else-if="mode === 'reset'" class="auth-form" @submit.prevent="resetRequested ? handleResetConfirm() : handleResetRequest()">
        <div class="form-group">
          <label class="form-label">E-mail da conta</label>
          <div class="input-wrapper"><i class="bi bi-envelope input-icon"></i><input v-model="resetEmail" type="email" class="form-input" required autocomplete="email" placeholder="seu@email.com" :disabled="resetRequested" /></div>
        </div>
        <template v-if="resetRequested">
          <div class="form-group"><label class="form-label">Código de recuperação</label><div class="input-wrapper"><i class="bi bi-key input-icon"></i><input v-model="resetToken" class="form-input" required minlength="32" autocomplete="one-time-code" placeholder="Cole o código recebido" /></div></div>
          <div class="form-group"><label class="form-label">Nova senha</label><div class="input-wrapper"><i class="bi bi-lock input-icon"></i><input v-model="resetPassword" :type="showPass ? 'text' : 'password'" class="form-input" required minlength="8" autocomplete="new-password" placeholder="Nova senha segura" /></div></div>
        </template>
        <div v-if="resetMessage" class="success-message" role="status"><i class="bi bi-check-circle-fill"></i> {{ resetMessage }}</div>
        <div v-if="resetError" class="error-message" role="alert"><i class="bi bi-exclamation-triangle-fill"></i> {{ resetError }}</div>
        <button type="submit" class="btn-auth" :disabled="loading"><span><i class="bi bi-shield-lock"></i> {{ loading ? 'Aguarde…' : resetRequested ? 'Definir nova senha' : 'Solicitar recuperação' }}</span></button>
        <div class="auth-switch-box">
          <div class="switch-row">
            <button type="button" class="btn-switch-link" @click="switchMode('login')">Voltar ao login</button>
          </div>
        </div>
      </form>

      <form v-else class="auth-form" @submit.prevent="handleEmailVerification">
        <div class="form-group"><label class="form-label" for="verify-email">E-mail da conta</label><div class="input-wrapper"><i class="bi bi-envelope input-icon"></i><input id="verify-email" v-model.trim="verificationEmail" type="email" class="form-input" required autocomplete="email" placeholder="seu@email.com"></div></div>
        <div class="form-group"><label class="form-label" for="verify-token">Código de confirmação</label><div class="input-wrapper"><i class="bi bi-shield-check input-icon"></i><input id="verify-token" v-model.trim="verificationToken" class="form-input" required minlength="32" autocomplete="one-time-code" placeholder="Cole o código recebido"></div></div>
        <div v-if="verificationMessage" class="success-message" role="status"><i class="bi bi-check-circle-fill"></i> {{ verificationMessage }}</div>
        <div v-if="verificationError" class="error-message" role="alert"><i class="bi bi-exclamation-triangle-fill"></i> {{ verificationError }}</div>
        <button type="submit" class="btn-auth" :disabled="loading"><span><i class="bi bi-patch-check"></i> {{ loading ? 'Confirmando…' : 'Confirmar e-mail' }}</span></button>
        <button type="button" class="btn-switch-link verification-resend" :disabled="loading" @click="resendVerification">Reenviar código</button>
        <div class="auth-switch-box">
          <div class="switch-row">
            <button type="button" class="btn-switch-link" @click="switchMode('login')">Voltar ao login</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AstroMark from '../AstroMark.vue';

import { useRouter, useRoute } from 'vue-router';
import { confirmEmailVerification, confirmPasswordReset, login, register, requestEmailVerification, requestPasswordReset, storeAuthSession } from '../../services/api';
import { useBuilderStore } from '../../composables/useBuilderStore';

const router = useRouter();
const route = useRoute();
const { hydrateWorkspaceFromBackend } = useBuilderStore();

const mode = ref(route.query.mode === 'register' ? 'register' : 'login');
const loading = ref(false);
const showPass = ref(false);
const passwordRequirementsOpen = ref(false);
const resetEmail = ref('');
const resetToken = ref('');
const resetPassword = ref('');
const resetRequested = ref(false);
const resetMessage = ref('');
const resetError = ref('');
const verificationEmail = ref('');
const verificationToken = ref('');
const verificationMessage = ref('');
const verificationError = ref('');
const authCopy = computed(() => ({
  login: { title:'Bom ter você de volta.', description:'Entre na sua conta e continue de onde parou.' },
  register: { title:'Sua próxima ideia começa aqui.', description:'Crie sua conta e dê forma às suas ideias.' },
  reset: { title:'Recupere seu acesso.', description:'Solicite um código e defina uma nova senha segura.' },
  verify: { title:'Confirme seu e-mail.', description:'Use o código enviado para liberar seu acesso.' }
}[mode.value]));

// Login
const loginEmail = ref('');
const loginPassword = ref('');
const rememberMe = ref(false);
const loginError = ref('');

// Register
const regName = ref('');
const regLastName = ref('');
const regEmail = ref('');
const regPhone = ref('');
function maskRegPhone(event) {
  const raw = event.target.value;
  let digits = raw.replace(/\D/g, '');
  const international = raw.startsWith('+') || (digits.startsWith('55') && digits.length > 11);
  let prefix = '';
  if (international) {
    digits = digits.slice(0, 13);
    prefix = '+' + digits.slice(0, 2);
    digits = digits.slice(2);
    if (digits) prefix += ' ';
  } else digits = digits.slice(0, 11);
  let formatted = digits ? '(' + digits.slice(0, 2) : '';
  if (digits.length > 2) formatted += ') ' + digits.slice(2, digits.length > 10 ? 7 : 6);
  const split = digits.length > 10 ? 7 : 6;
  if (digits.length > split) formatted += '-' + digits.slice(split);
  regPhone.value = prefix + formatted;
  event.target.value = regPhone.value;
}
const regPassword = ref('');
const regConfirmPassword = ref('');
const acceptTerms = ref(false);
const registerError = ref('');
const registerSuccess = ref('');

const passwordRequirements = computed(() => [
  { label: 'Pelo menos 8 caracteres', valid: regPassword.value.length >= 8 },
  { label: 'Uma letra maiúscula', valid: /[A-Z]/.test(regPassword.value) },
  { label: 'Uma letra minúscula', valid: /[a-z]/.test(regPassword.value) },
  { label: 'Um número', valid: /\d/.test(regPassword.value) }
]);

const passwordMeetsRequirements = computed(() =>
  passwordRequirements.value.every(requirement => requirement.valid)
);

const redirectTarget = computed(() => {
  const target = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard';
  return target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';
});

function switchMode(nextMode) {
  mode.value = nextMode;
  loginError.value = '';
  registerError.value = '';
  registerSuccess.value = '';
  resetError.value = '';
  resetMessage.value = '';
  verificationError.value = '';
  verificationMessage.value = '';
}

async function handleResetRequest() {
  loading.value = true; resetError.value = ''; resetMessage.value = '';
  try {
    const result = await requestPasswordReset(resetEmail.value.trim().toLowerCase());
    resetRequested.value = true;
    if (result.resetToken) resetToken.value = result.resetToken;
    resetMessage.value = result.resetToken ? 'Código local gerado e preenchido. Defina a nova senha.' : result.message;
  } catch (error) { resetError.value = error.message; }
  finally { loading.value = false; }
}

async function handleResetConfirm() {
  loading.value = true; resetError.value = ''; resetMessage.value = '';
  try {
    await confirmPasswordReset(resetToken.value.trim(), resetPassword.value);
    resetMessage.value = 'Senha alterada. Você já pode entrar.';
    setTimeout(() => { switchMode('login'); loginEmail.value = resetEmail.value; resetRequested.value = false; }, 700);
  } catch (error) { resetError.value = error.message; }
  finally { loading.value = false; }
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
      phone: regPhone.value.replace(/\D/g, ''),
      email: regEmail.value.trim().toLowerCase(),
      password: regPassword.value,
      remember: true
    });
    if (session.emailVerificationRequired) {
      verificationEmail.value = session.email || regEmail.value.trim().toLowerCase();
      verificationToken.value = session.verificationToken || '';
      verificationMessage.value = session.message || 'Enviamos um código de confirmação para o seu e-mail.';
      mode.value = 'verify';
      return;
    }
    storeAuthSession(session, true);
    if(session.verificationToken)sessionStorage.setItem('vbs_verification_token',session.verificationToken);
    await hydrateWorkspaceFromBackend();
    registerSuccess.value = 'Conta criada! Abrindo seu painel...';
    setTimeout(() => router.push(redirectTarget.value), 350);
  } catch (error) {
    registerError.value = error.message || 'Não foi possível criar a conta.';
  } finally {
    loading.value = false;
  }
}

async function resendVerification() {
  verificationError.value = ''; verificationMessage.value = ''; loading.value = true;
  try {
    const result = await requestEmailVerification(verificationEmail.value);
    if (result.verificationToken) verificationToken.value = result.verificationToken;
    verificationMessage.value = result.message;
  } catch (error) { verificationError.value = error.message || 'Não foi possível reenviar o código.'; }
  finally { loading.value = false; }
}

async function handleEmailVerification() {
  verificationError.value = ''; verificationMessage.value = ''; loading.value = true;
  try {
    await confirmEmailVerification(verificationToken.value);
    verificationMessage.value = 'E-mail confirmado. Você já pode entrar.';
    setTimeout(() => { loginEmail.value = verificationEmail.value; switchMode('login'); }, 550);
  } catch (error) { verificationError.value = error.message || 'Não foi possível confirmar o e-mail.'; }
  finally { loading.value = false; }
}
</script>

<style scoped>
.auth-wrapper {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 32px 32px 40px;
  box-sizing: border-box;
  background: transparent;
  overflow-y: auto;
}

.auth-nav-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.auth-home {
  position: static;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.8px;
  font-family: var(--font-display, var(--font-sans));
  transition: opacity 0.15s ease;
}

.auth-home:hover {
  opacity: 0.85;
}

.auth-logo {
  --mark-width: 44px;
  --mark-height: 32px;
}

.auth-brand-name {
  display: inline-block;
  font-weight: 800;
  color: var(--color-text);
}

.brand-light {
  font-weight: 400;
  opacity: 0.85;
}

@media (max-width: 800px) {
  .auth-wrapper {
    padding: 24px 20px 32px;
  }

  .auth-nav-header {
    justify-content: center;
    margin-bottom: 20px;
  }

  .auth-card {
    padding: 28px 20px;
    width: 100%;
    max-width: 440px;
  }
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

.password-field-group { position: relative; z-index: 3; }
.password-requirements {
  position: absolute;
  top: calc(100% - 10px);
  left: 0;
  right: 0;
  z-index: 10;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 16px 38px rgba(40, 25, 96, 0.16);
}
.password-requirements::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 24px;
  width: 11px;
  height: 11px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
  transform: rotate(45deg);
}
.password-requirements strong {
  display: block;
  margin-bottom: 11px;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
}
.password-requirements p {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 8px 0;
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.35;
  transition: color 0.18s ease;
}
.password-requirements p .bi { color: var(--color-border-strong); font-size: 13px; }
.password-requirements p.valid { color: var(--color-success-strong); }
.password-requirements p.valid .bi { color: var(--color-success); }
.requirements-popover-enter-active,
.requirements-popover-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.requirements-popover-enter-from,
.requirements-popover-leave-to { opacity: 0; transform: translateY(-5px); }

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
  margin-top: 24px;
  text-align: center;
  font-size: 13.5px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.switch-row {
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
  text-decoration: none;
  transition: color 0.15s ease;
}

.btn-switch-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

/* Layout editorial da autenticação */
.auth-card {
  width: 100%;
  max-width: 400px;
  margin: auto auto;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.auth-brand { text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; }
.auth-eyebrow { display: block; font-size: 10px; letter-spacing: 1.8px; font-weight: 700; color: var(--color-primary); margin-bottom: 16px; text-align: center; }
.auth-brand h1 { font-family: var(--font-display); font-size: clamp(26px, 2.3vw, 34px); letter-spacing: -0.035em; font-weight: 700; line-height: 1.2; margin-bottom: 10px; text-align: center; }
.auth-brand p { font-family: var(--font-sans); font-size: 14px; line-height: 1.6; font-weight: 400; text-align: center; }
.form-label { text-transform: none; letter-spacing: 0; font-size: 13px; color: var(--color-text); margin-bottom: 8px; font-weight: 500; }
.form-group { margin-bottom: 18px; }
.form-input { padding-top: 13px; padding-bottom: 13px; background: var(--color-surface); border-radius: 8px; }
.form-row-between { margin: 0 0 24px; gap: 12px; flex-wrap: wrap; }
.btn-auth { background: var(--color-primary); border-radius: 8px; padding: 14px; font-family: var(--font-sans); font-weight: 600; box-shadow: none; }
.btn-auth span { display: inline-flex; align-items: center; justify-content: center; gap: 9px; }
.btn-auth .bi { font-size: 17px; }
.error-message, .error-inline { color: var(--color-danger-strong); background: var(--color-danger-soft); border-color: var(--color-danger-border); }
.btn-toggle-pass { min-width: 32px; min-height: 32px; }
button:focus-visible, a:focus-visible { outline: 3px solid var(--color-primary-border); outline-offset: 3px; }
@media (max-width: 380px) { .form-row-2 { grid-template-columns: 1fr; gap: 0; } }
</style>
