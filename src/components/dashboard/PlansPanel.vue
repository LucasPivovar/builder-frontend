<template>
  <section class="plans-view">
    <header><span>PLANOS</span><h1>Escolha o plano ideal para seus projetos</h1><p>Os limites abaixo são aplicados pelo servidor à sua conta.</p></header>
    <div v-if="loading" class="plans-state"><span class="spinner"></span> Carregando assinatura…</div>
    <div v-else-if="error" class="plans-state error"><i class="bi bi-exclamation-circle"></i> {{ error }} <button @click="load">Tentar novamente</button></div>
    <div v-else class="plans-grid">
      <article v-for="plan in plans" :key="plan.id" class="plan-card" :class="{ featured: plan.id === 'pro' }">
        <span v-if="plan.id === 'pro'" class="popular">MAIS ESCOLHIDO</span>
        <div class="plan-icon"><i :class="metadata[plan.id].icon"></i></div><h2>{{ plan.name }}</h2><p>{{ metadata[plan.id].description }}</p>
        <div class="price"><strong>{{ price(plan) }}</strong><span v-if="plan.price">/mês</span></div>
        <ul>
          <li><i class="bi bi-check-circle-fill"></i>{{ number(plan.maxPages) }} páginas</li>
          <li><i class="bi bi-check-circle-fill"></i>{{ number(plan.maxDomains) }} domínios personalizados</li>
          <li><i class="bi bi-check-circle-fill"></i>{{ storage(plan.maxVideoBytes) }} para vídeos</li>
          <li><i class="bi bi-check-circle-fill"></i>{{ storage(plan.maxAssetBytes) }} para imagens</li>
        </ul>
        <div v-if="plan.id === subscription.plan" class="current-plan"><i class="bi bi-check-circle-fill"></i> Plano atual</div>
        <button v-else class="btn-primary" :disabled="requesting === plan.id || plan.id === 'essential'" @click="request(plan.id)">
          {{ requesting === plan.id ? 'Solicitando…' : plan.id === 'essential' ? 'Plano inicial' : 'Solicitar este plano' }}
        </button>
      </article>
    </div>
    <p v-if="pending" class="pending-request"><i class="bi bi-clock-history"></i> Solicitação do plano {{ pending }} enviada e aguardando análise administrativa.</p>
  </section>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { getPlans, getSubscription, requestPlanChange } from '../../services/api';

const plans = ref([]); const subscription = ref({ plan:'essential' }); const loading = ref(true); const error = ref(''); const requesting = ref(''); const pending = ref('');
const metadata = { essential:{ icon:'bi bi-rocket-takeoff', description:'Para começar a publicar seus projetos.' }, pro:{ icon:'bi bi-stars', description:'Para quem cria e testa campanhas todos os dias.' }, agency:{ icon:'bi bi-buildings-fill', description:'Para gerenciar projetos e clientes em escala.' } };
onMounted(load);
async function load(){ loading.value=true; error.value=''; try { [plans.value,subscription.value]=await Promise.all([getPlans(),getSubscription()]); } catch(e){ error.value=e.message; } finally { loading.value=false; } }
async function request(plan){ requesting.value=plan; try { const result=await requestPlanChange(plan); if(result.redirectUrl){ window.location.assign(result.redirectUrl); return; } pending.value=plans.value.find(item=>item.id===plan)?.name||plan; } catch(e){ error.value=e.message; } finally { requesting.value=''; } }
function number(value){ return new Intl.NumberFormat('pt-BR').format(value); }
function price(plan){ return plan.price === null ? 'Sob consulta' : plan.price === 0 ? 'Grátis' : new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(plan.price); }
function storage(bytes){ const gb=bytes/1000000000; return gb>=1?`${new Intl.NumberFormat('pt-BR').format(gb)} GB`:`${Math.round(bytes/1000000)} MB`; }
</script>
<style scoped>
.plans-view{width:100%}.plans-view>header{max-width:720px;margin-bottom:28px}.plans-view>header span{color:var(--color-primary-strong);font-size:11px;font-weight:900;letter-spacing:.14em}.plans-view h1{margin:7px 0;font-size:28px}.plans-view header p,.plan-card>p{color:var(--color-text-secondary)}.plans-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.plan-card{position:relative;display:flex;flex-direction:column;padding:25px;border:1px solid var(--color-border);border-radius:17px;background:var(--color-surface)}.plan-card.featured{border:2px solid var(--color-primary);box-shadow:0 14px 34px rgba(69,32,181,.12)}.popular{position:absolute;top:14px;right:14px;padding:5px 8px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:9px;font-weight:900}.plan-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:#edf6ff;color:#2563eb;font-size:19px}.plan-card h2{margin:17px 0 5px}.plan-card>p{min-height:42px;margin:0;font-size:12px;line-height:1.5}.price{min-height:50px;margin:22px 0 18px}.price strong{font:800 25px/1.1 var(--font-display)}.price span{color:var(--color-text-muted);font-size:12px}.plan-card ul{display:flex;flex-direction:column;gap:12px;margin:0 0 24px;padding:20px 0 0;border-top:1px solid var(--color-border);list-style:none}.plan-card li{display:flex;gap:9px;color:var(--color-text-secondary);font-size:12px}.plan-card li i{color:#168552}.plan-card button{width:100%;margin-top:auto}.plan-card button:disabled{opacity:.5;cursor:not-allowed}.current-plan{width:100%;min-height:40px;display:flex;align-items:center;justify-content:center;gap:8px;box-sizing:border-box;margin-top:auto;border:1px solid #a7e3bd;border-radius:9px;background:#eafaf0;color:#166534;font-size:13px;font-weight:800}.plans-state{min-height:180px;display:flex;align-items:center;justify-content:center;gap:10px;color:var(--color-text-muted)}.plans-state button{border:0;background:transparent;color:var(--color-primary);font-weight:800;cursor:pointer}.spinner{width:22px;height:22px;border:3px solid var(--color-primary-soft);border-top-color:var(--color-primary);border-radius:50%;animation:spin .7s linear infinite}.pending-request{margin:18px 0 0;padding:13px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;color:#92400e;font-size:12px}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:1000px){.plans-grid{grid-template-columns:1fr}.plan-card>p{min-height:0}}
</style>
