<template>
  <section class="plans-view">
    <header><span>PLANOS</span><h1>Escolha o plano ideal para seus projetos</h1><p>Compare os recursos e solicite uma mudança quando precisar crescer.</p></header>
    <div class="plans-grid">
      <article v-for="plan in plans" :key="plan.name" class="plan-card" :class="{ featured: plan.featured }">
        <span v-if="plan.featured" class="popular">MAIS ESCOLHIDO</span>
        <div class="plan-icon"><i :class="plan.icon"></i></div><h2>{{ plan.name }}</h2><p>{{ plan.description }}</p>
        <div class="price"><strong>{{ plan.price }}</strong><span v-if="plan.period">/{{ plan.period }}</span></div>
        <ul><li v-for="feature in plan.features" :key="feature"><i class="bi bi-check-circle-fill"></i>{{ feature }}</li></ul>
        <div v-if="plan.current" class="current-plan"><i class="bi bi-check-circle-fill"></i> Plano atual</div><button v-else class="btn-primary" @click="$emit('open-support')">Solicitar este plano</button>
      </article>
    </div>
  </section>
</template>
<script setup>
defineEmits(['open-support']);
const plans = [
  { name:'Essencial', description:'Para começar a publicar seus projetos.', price:'Grátis', period:'', icon:'bi bi-rocket-takeoff', current:true, features:['1 domínio personalizado','Até 5 páginas','Métricas essenciais','Templates de funil, quiz e e-mail'] },
  { name:'Pro', description:'Para quem cria e testa campanhas todos os dias.', price:'R$ 79', period:'mês', icon:'bi bi-stars', featured:true, features:['5 domínios personalizados','Páginas ilimitadas','Métricas completas','Webhooks e pixels','Histórico de versões'] },
  { name:'Agência', description:'Para gerenciar projetos e clientes em escala.', price:'Sob consulta', period:'', icon:'bi bi-buildings-fill', features:['Domínios ilimitados','Acessos para equipe','Visão administrativa','Suporte prioritário','Ambiente personalizado'] }
];
</script>
<style scoped>
.plans-view{width:100%}.plans-view>header{max-width:720px;margin-bottom:28px}.plans-view>header span{color:var(--color-primary-strong);font-size:11px;font-weight:900;letter-spacing:.14em}.plans-view h1{margin:7px 0;font-size:28px}.plans-view header p,.plan-card>p{color:var(--color-text-secondary)}.plans-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.plan-card{position:relative;display:flex;flex-direction:column;padding:25px;border:1px solid var(--color-border);border-radius:17px;background:var(--color-surface)}.plan-card.featured{border:2px solid var(--color-primary);box-shadow:0 14px 34px rgba(69,32,181,.12)}.popular{position:absolute;top:14px;right:14px;padding:5px 8px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-strong);font-size:9px;font-weight:900}.plan-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:#edf6ff;color:#2563eb;font-size:19px}.plan-card h2{margin:17px 0 5px}.plan-card>p{min-height:42px;margin:0;font-size:12px;line-height:1.5}.price{min-height:50px;margin:22px 0 18px}.price strong{font:800 25px/1.1 var(--font-display)}.price span{color:var(--color-text-muted);font-size:12px}.plan-card ul{display:flex;flex-direction:column;gap:12px;margin:0 0 24px;padding:20px 0 0;border-top:1px solid var(--color-border);list-style:none}.plan-card li{display:flex;gap:9px;color:var(--color-text-secondary);font-size:12px}.plan-card li i{color:#168552}.plan-card button{width:100%;margin-top:auto}.current-plan{width:100%;min-height:40px;display:flex;align-items:center;justify-content:center;gap:8px;box-sizing:border-box;margin-top:auto;border:1px solid #a7e3bd;border-radius:9px;background:#eafaf0;color:#166534;font-size:13px;font-weight:800}.current-plan i{font-size:15px}@media(max-width:1000px){.plans-grid{grid-template-columns:1fr}.plan-card>p{min-height:0}}
</style>
