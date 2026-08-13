<template>
  <div class="quiz-element" :style="wrapperStyle">
    <div v-if="element.type === 'quiz-progress'" class="quiz-progress"><span :style="{ width: `${element.progress || 20}%` }"></span></div>
    <div v-else-if="['quiz-single','quiz-multiple','quiz-yes-no'].includes(element.type)" class="quiz-options">
      <button v-for="(option,index) in options" :key="option" type="button" @click.stop="toggle(index)" :class="{ selected:selected.includes(index) }">
        <span class="option-mark">{{ element.type === 'quiz-multiple' ? String.fromCharCode(65 + index) : '' }}</span><span>{{ option }}</span><i class="bi bi-chevron-right"></i>
      </button>
    </div>
    <div v-else-if="element.type === 'quiz-loading'" class="quiz-loading">
      <div class="quiz-loading-header"><span>{{ element.content || 'Analisando suas respostas...' }}</span><strong>{{ loadingProgress }}%</strong></div>
      <div class="quiz-loading-track"><span :style="{ width:`${loadingProgress}%` }"><i></i></span></div>
    </div>
    <div v-else-if="element.type === 'quiz-metric'" class="quiz-metrics"><article v-for="(metric,index) in metrics" :key="`${index}-${metric.value}-${metric.label}`" :style="{ '--metric-index':index }"><strong>{{ metric.value }}</strong><span>{{ metric.label }}</span></article></div>
    <div v-else-if="element.type === 'quiz-price'" class="quiz-price"><small>{{ element.badge || 'Recomendado' }}</small><div><span><strong>{{ element.content || 'Plano PRO' }}</strong><em>{{ element.description || 'Acesso completo' }}</em></span><b>{{ element.price || 'R$ 197,00' }}</b></div></div>
    <div v-else-if="element.type === 'quiz-spacer'" :style="{ height:`${element.height || 32}px` }"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
const props=defineProps({element:{type:Object,required:true}}); const selected=ref([]);
const emit=defineEmits(['answered']);
const style=computed(()=>props.element.style||{});
const wrapperStyle=computed(()=>({marginTop:`${style.value.marginTop||0}px`,marginBottom:`${style.value.marginBottom||0}px`,color:style.value.textColor||'#0f172a'}));
const options=computed(()=>String(props.element.optionsText||'Opção 1\nOpção 2').split('\n').map(v=>v.trim()).filter(Boolean));
const loadingProgress=computed(()=>Math.max(0,Math.min(100,Number(props.element.progress)||0)));
const metrics=computed(()=>String(props.element.metricsText||'72%|Taxa de conversão').split('\n').map(line=>{const [value,...labelParts]=line.split('|');return{value:(value||'').trim(),label:labelParts.join('|').trim()}}).filter(metric=>metric.value||metric.label));
function toggle(index){ if(props.element.type==='quiz-multiple'){selected.value=selected.value.includes(index)?selected.value.filter(v=>v!==index):[...selected.value,index]}else selected.value=[index]; emit('answered',selected.value) }
</script>

<style scoped>
.quiz-element{width:100%;box-sizing:border-box}.quiz-progress{height:5px;border-radius:999px;background:var(--color-primary-soft);overflow:hidden}.quiz-progress span{display:block;height:100%;background:var(--color-primary);border-radius:inherit;transition:width .4s cubic-bezier(.22,1,.36,1)}.quiz-options{display:flex;flex-direction:column;gap:9px}.quiz-options button{min-height:58px;display:grid;grid-template-columns:30px 1fr 20px;align-items:center;gap:10px;width:100%;padding:10px 14px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:15px;text-align:left;cursor:pointer;transition:transform .18s ease,border-color .18s ease,background-color .18s ease}.quiz-options button:hover,.quiz-options button.selected{border-color:var(--color-primary);background:var(--color-primary-subtle);transform:translateY(-1px)}.option-mark{width:27px;height:27px;border:1px solid var(--color-border);border-radius:50%;display:grid;place-items:center;font-size:10px;transition:.18s ease}.quiz-options button.selected .option-mark{background:var(--color-primary);color:white;transform:scale(1.04)}.quiz-options i{color:var(--color-primary)}
.quiz-loading{display:flex;flex-direction:column;gap:9px;width:100%;padding:12px 2px}.quiz-loading-header{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--color-text)}.quiz-loading-header span{font-size:13px;font-weight:700}.quiz-loading-header strong{color:var(--color-primary-strong);font-size:13px}.quiz-loading-track{height:12px;border-radius:999px;background:var(--color-primary-soft);overflow:hidden}.quiz-loading-track>span{position:relative;display:block;height:100%;border-radius:inherit;background:var(--color-primary);transform-origin:left;animation:quizLoadGrow 1.15s cubic-bezier(.22,1,.36,1) both}.quiz-loading-track i{position:absolute;inset:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(-120%);animation:quizLoadShimmer 1.45s ease-in-out .35s infinite}
.quiz-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.quiz-metrics article{min-height:145px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface);animation:quizMetricIn .35s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--metric-index) * 70ms);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.quiz-metrics article:hover{transform:translateY(-2px);border-color:var(--color-primary-border);box-shadow:var(--shadow-sm)}.quiz-metrics strong{font-size:22px;color:var(--color-primary-strong)}.quiz-metrics span{margin-top:8px;font-size:12px;color:var(--color-text-muted);text-align:center}.quiz-price{border:2px solid var(--color-primary);border-radius:15px;overflow:hidden}.quiz-price>small{display:block;padding:6px;text-align:center;background:var(--color-primary);color:white;font-weight:800}.quiz-price>div{display:flex;justify-content:space-between;align-items:center;padding:16px}.quiz-price span{display:flex;flex-direction:column}.quiz-price strong{font-size:17px}.quiz-price em{font-style:normal;color:var(--color-text-muted);font-size:11px}.quiz-price b{font-size:21px;color:var(--color-primary-strong)}
@keyframes quizLoadGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes quizLoadShimmer{0%{transform:translateX(-120%)}70%,100%{transform:translateX(320%)}}@keyframes quizMetricIn{from{opacity:0;transform:translateY(9px) scale(.98)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.quiz-loading-track>span,.quiz-loading-track i,.quiz-metrics article{animation:none!important}.quiz-options button,.quiz-metrics article{transition:none!important}}
</style>
