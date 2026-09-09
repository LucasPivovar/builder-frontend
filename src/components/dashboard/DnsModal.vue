<template>
  <Teleport to="body">
    <div v-if="isOpen && page" class="dns-overlay" @click.self="$emit('close')">
      <section class="dns-modal" role="dialog" aria-modal="true" aria-labelledby="dns-modal-title">
        <header>
          <div>
            <span class="eyebrow">DOMÍNIO DA PASTA</span>
            <h2 id="dns-modal-title">{{ domain ? 'Editar domínio' : 'Linkar domínio' }}</h2>
          </div>
          <button class="icon-close" type="button" aria-label="Fechar" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </header>

        <div class="dns-body">
          <div class="page-summary">
            <span><i class="bi bi-folder2-open"></i></span>
            <div>
              <strong>{{ page.folderName || page.title || page.name }}</strong>
              <small>Domínio único da pasta. O caminho de cada página é configurado em “Opções da página”.</small>
            </div>
          </div>

          <div v-if="page.publication?.domainStatus" class="domain-status" :class="page.publication.domainStatus">
            <i :class="['bi', page.publication.domainStatus === 'active' ? 'bi-check-circle-fill' : 'bi-clock-history']"></i>
            <span>{{ page.publication.domainStatus === 'active' ? 'DNS ativo' : 'Aguardando verificação DNS' }}</span>
          </div>

          <label>
            <span>Domínio ou subdomínio</span>
            <input v-model.trim="domain" type="text" placeholder="ex: oferta.seudominio.com" maxlength="180" @keyup.enter="save" />
          </label>

          <div class="dns-help">
            <i class="bi bi-info-circle"></i>
            <p>Informe o domínio da pasta. As páginas publicadas nesta pasta abrirão como domínio.com/caminho-da-página.</p>
          </div>

          <div class="dns-record">
            <div class="dns-record-head">
              <strong>Registro para copiar no provedor DNS</strong>
              <button class="copy-button" type="button" :disabled="!domain" @click="copyRecord">
                <i :class="['bi', copied ? 'bi-check2' : 'bi-copy']"></i>
                {{ copied ? 'Copiado' : 'Copiar' }}
              </button>
            </div>
            <dl>
              <div>
                <dt>Tipo</dt>
                <dd>{{ recommendedRecord.type }}</dd>
              </div>
              <div>
                <dt>Nome/Host</dt>
                <dd>{{ recommendedRecord.host }}</dd>
              </div>
              <div>
                <dt>Valor/Aponta para</dt>
                <dd>{{ recommendedRecord.value }}</dd>
              </div>
            </dl>
            <p class="dns-note">{{ dnsInstruction }}</p>
          </div>
          <div v-if="page.publication?.domainVerificationError" class="dns-error">
            {{ page.publication.domainVerificationError }}
          </div>
        </div>

        <footer>
          <button class="button-secondary" type="button" @click="$emit('close')">Cancelar</button>
          <button v-if="page.publication?.id" class="button-secondary" type="button" @click="$emit('verify', page.publication.id)">
            <i class="bi bi-arrow-clockwise"></i> Verificar DNS
          </button>
          <button class="button-primary" type="button" :disabled="!domain" @click="save"><i class="bi bi-check-lg"></i> Salvar domínio</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  page: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save', 'verify']);
const domain = ref('');
const copied = ref(false);
const cnameTarget = computed(() => props.page?.publication?.dns?.cname || props.page?.publication?.dns?.value || 'astrobuilder.com.br');
const publicServerIp = computed(() => props.page?.publication?.dns?.ips?.[0] || '193.203.182.228');
const isRootDomain = computed(() => domain.value.split('.').filter(Boolean).length === 2);
const recommendedRecord = computed(() => {
  if (isRootDomain.value) return { type: 'A', host: '@', value: publicServerIp.value };
  return { type: 'CNAME', host: domain.value || 'oferta.seudominio.com', value: cnameTarget.value };
});
const dnsInstruction = computed(() => {
  if (isRootDomain.value) return `Para domínio raiz, como ${domain.value || 'seudominio.com'}, use registro A com Nome/Host @. CNAME no domínio raiz costuma falhar quando já existem registros NS, SOA, MX ou TXT.`;
  return 'Para subdomínio, crie um CNAME com o nome completo ou apenas o prefixo, conforme o painel do seu provedor pedir.';
});

watch(() => [props.isOpen, props.page], () => {
  if (!props.isOpen || !props.page) return;
  domain.value = props.page.customDomain || props.page.publication?.customDomain || '';
  copied.value = false;
}, { immediate: true });

function save() {
  if (!domain.value) return;
  emit('save', { page: props.page, domain: domain.value });
}

async function copyRecord() {
  if (!domain.value) return;
  const text = `Tipo: ${recommendedRecord.value.type}\nNome/Host: ${recommendedRecord.value.host}\nValor/Aponta para: ${recommendedRecord.value.value}`;
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    window.setTimeout(() => { copied.value = false; }, 1800);
  } catch {
    copied.value = false;
  }
}
</script>

<style scoped>
.dns-overlay { position: fixed; inset: 0; z-index: 100000; display: grid; place-items: center; padding: 20px; background: var(--overlay); backdrop-filter: blur(4px); }
.dns-modal { width: min(540px, 96vw); overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: var(--color-surface); box-shadow: var(--shadow-modal); }
header, footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 20px 22px; }
header { border-bottom: 1px solid var(--color-border); }
footer { justify-content: flex-end; border-top: 1px solid var(--color-border); background: var(--color-surface-soft); }
.eyebrow { display: block; margin-bottom: 3px; color: var(--color-primary-strong); font-size: 9px; font-weight: 900; letter-spacing: .13em; }
h2 { margin: 0; color: var(--color-text); font-size: 19px; }
.icon-close { border: 0; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 17px; }
.dns-body { display: grid; gap: 16px; padding: 22px; }
.page-summary { display: grid; grid-template-columns: 42px 1fr; gap: 12px; align-items: center; padding: 13px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-primary-subtle); }
.page-summary > span { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 10px; background: var(--color-primary-soft); color: var(--color-primary-strong); font-size: 18px; }
.page-summary div { min-width: 0; display: grid; gap: 3px; }
.page-summary strong { overflow: hidden; color: var(--color-text); font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.page-summary small { color: var(--color-text-muted); font-size: 11px; line-height: 1.35; }
.page-summary a { overflow: hidden; color: var(--color-primary-strong); font-size: 11px; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; }
label { display: grid; gap: 6px; color: var(--color-text-secondary); font-size: 12px; font-weight: 800; }
input { width: 100%; border: 1px solid var(--color-border); border-radius: 10px; outline: none; background: var(--color-surface); color: var(--color-text); padding: 11px 12px; font: inherit; font-size: 13px; }
input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-focus-ring); }
.dns-help { display: grid; grid-template-columns: 18px 1fr; gap: 9px; color: var(--color-text-muted); font-size: 12px; line-height: 1.45; }
.dns-help i { color: var(--color-primary-strong); }
.dns-help p { margin: 0; }
.dns-record { display: grid; gap: 12px; padding: 13px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-surface-soft); }
.dns-record-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.dns-record-head strong { color: var(--color-text); font-size: 12px; }
.copy-button { display: inline-flex; align-items: center; gap: 6px; min-height: 32px; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-surface); color: var(--color-primary-strong); padding: 7px 10px; font: inherit; font-size: 11px; font-weight: 900; cursor: pointer; }
.copy-button:disabled { opacity: .45; cursor: not-allowed; }
dl { display: grid; gap: 8px; margin: 0; }
dl div { display: grid; grid-template-columns: 112px 1fr; gap: 10px; align-items: center; min-width: 0; }
dt { color: var(--color-text-muted); font-size: 10px; font-weight: 900; text-transform: uppercase; }
dd { min-width: 0; margin: 0; overflow-wrap: anywhere; color: var(--color-text); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; font-weight: 800; }
.dns-note { margin: 0; color: var(--color-text-muted); font-size: 11px; line-height: 1.45; }
.dns-error { padding: 10px 12px; border: 1px solid rgba(245,158,11,.25); border-radius: 10px; background: rgba(245,158,11,.1); color: #92400e; font-size: 12px; line-height: 1.4; }
.domain-status { display: inline-flex; align-items: center; gap: 7px; width: fit-content; padding: 7px 10px; border: 1px solid var(--color-border); border-radius: 999px; color: var(--color-text-muted); background: var(--color-surface-soft); font-size: 11px; font-weight: 800; }
.domain-status.active { border-color: var(--color-primary-border); color: var(--color-primary-strong); background: var(--color-primary-soft); }
.domain-status.pending { color: #92400e; background: rgba(245,158,11,.1); border-color: rgba(245,158,11,.25); }
.button-secondary, .button-primary { border-radius: 9px; padding: 9px 14px; cursor: pointer; font: inherit; font-size: 12px; font-weight: 800; }
.button-secondary { border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-secondary); }
.button-primary { border: 1px solid var(--color-primary); background: var(--color-primary); color: var(--color-on-primary); }
.button-primary:disabled { opacity: .45; cursor: not-allowed; }
@media (max-width: 520px) { header, footer, .dns-body { padding: 17px; } footer button { flex: 1; } dl div { grid-template-columns: 1fr; gap: 3px; } }
</style>
