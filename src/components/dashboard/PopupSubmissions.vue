<template>
  <section class="submissions">
    <header><div><h2>Respostas de formulários</h2><p>{{ total }} envios de popups e formulários · 5 por página</p></div><button :disabled="exporting || !total" @click="exportAll"><i class="bi bi-download"></i> {{ exporting ? 'Exportando...' : 'Exportar todos (CSV)' }}</button></header>
    <p v-if="error" role="alert">{{ error }} <button @click="load">Tentar novamente</button></p>
    <p v-if="loading">Carregando respostas...</p>
    <p v-else-if="!items.length && !error">Os envios de popups e formulários publicados aparecerão aqui.</p>
    <div v-else class="table-scroll"><table><thead><tr><th>Data</th><th>Popup</th><th>Respostas</th></tr></thead><tbody><tr v-for="item in items" :key="item.id"><td>{{ new Date(item.createdAt).toLocaleString('pt-BR') }}</td><td>{{ item.popupId }}</td><td><dl><template v-for="field in item.fields" :key="field.id"><dt>{{ field.label }}</dt><dd>{{ formatPopupResponse(field) }}</dd></template></dl></td></tr></tbody></table></div>
    <p v-for="item in items.filter(item => item.webhookStatus && item.webhookStatus !== 'none')" :key="'webhook-' + item.id" :role="item.webhookStatus === 'failed' ? 'alert' : undefined">
      Sellflux · {{ new Date(item.createdAt).toLocaleString('pt-BR') }}: {{ item.webhookStatus === 'sent' ? 'Enviado' : 'Falha na integração. A resposta está salva; confira a URL e o mapeamento no popup.' }}
    </p>
    <footer><button :disabled="loading || page === 1" @click="navigate(-1)">Anterior</button><span>Página {{ page }} de {{ Math.max(1, Math.ceil(total / 5)) }}</span><button :disabled="loading || page * 5 >= total" @click="navigate(1)">Próxima</button><button :disabled="loading" @click="load">Atualizar</button></footer>
  </section>
</template>
<script setup>
import { ref, watch } from 'vue';
import { getPopupSubmissions, exportPopupSubmissions } from '../../services/api';
import { formatPopupResponse } from '../../utils/popupResponseDisplay';
const props = defineProps({ pageId: { type: String, required: true } });
const items = ref([]), total = ref(0), page = ref(1), loading = ref(false), exporting = ref(false), error = ref('');
let requestVersion = 0;
async function load() {
  const version = ++requestVersion;
  loading.value = true; error.value = '';
  try { const result = await getPopupSubmissions(props.pageId, page.value); if (version !== requestVersion) return; items.value = result.items; total.value = result.total; }
  catch (err) { if (version === requestVersion) error.value = err.message || 'Não foi possível carregar as respostas.'; }
  finally { if (version === requestVersion) loading.value = false; }
}
function navigate(delta) { page.value += delta; load(); }
watch(() => props.pageId, () => { page.value = 1; items.value = []; total.value = 0; load(); }, { immediate: true });
async function exportAll() {
  exporting.value = true;
  try { const result = await exportPopupSubmissions(props.pageId); const url = URL.createObjectURL(new Blob([result.csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'respostas-popup.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  catch (err) { error.value = err.message || 'Não foi possível exportar.'; }
  finally { exporting.value = false; }
}
</script>
<style scoped>
.submissions button { color: #4820b8; font-weight: 600; border-color: #c7b8ec; background: #fff; }
.submissions button:disabled { opacity: 1; color: #686176; border-color: #ded8e8; background: #f3f0f7; }
.submissions footer, .submissions td, .submissions p { color: #383047; font-weight: 500; }
.submissions dt, .submissions th { color: #211735; font-weight: 650; }
.submissions{background:var(--color-surface);border:1px solid var(--color-border);padding:22px;border-radius:16px;margin-top:20px}header,footer{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}h2{font-size:18px}p{font-size:13px;color:var(--color-text-secondary);margin:10px 0}button{padding:10px 14px;border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-primary);border-radius:8px;font:inherit;font-size:12px;cursor:pointer}button:disabled{opacity:.45;cursor:default}.table-scroll{overflow:auto;margin:18px 0}table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:14px;border-bottom:1px solid var(--color-border);vertical-align:top}th{background:var(--color-primary-subtle)}td{max-width:420px;overflow-wrap:anywhere}dl{display:grid;grid-template-columns:minmax(80px,1fr) 2fr;gap:8px}dt{font-weight:600}dd{margin:0;white-space:pre-wrap}footer{font-size:12px}
</style>
