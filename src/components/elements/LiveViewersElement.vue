<template>
  <div
    class="canvas-viewer-widget"
    :style="{
      color: element.style?.textColor || '#ffffff',
      textAlign: 'center',
      marginTop: (element.style?.marginTop || 20) + 'px',
      fontSize: element.style?.fontSize || '18px'
    }"
  >
    👀 <strong :style="{ color: element.style?.countColor || '#ffffff' }">{{ count }}</strong>
    <span v-html="parsedContent"></span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { parseAtomitags } from '../../utils/atomitags';

const props = defineProps({
  element: { type: Object, required: true }
});

const min = props.element.minViewers || 140;
const max = props.element.maxViewers || 200;
const count = ref(Math.floor(Math.random() * (max - min + 1)) + min);

let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    count.value = Math.floor(Math.random() * (max - min + 1)) + min;
  }, 3500);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const parsedContent = computed(() => {
  return ' ' + parseAtomitags(
    props.element.content || 'espectadores estão vendo este conteúdo simultaneamente com você',
    props.element.style?.altColor || '#f1c232',
    props.element.style?.bgColor || '#00ff0b',
    {
      cityName: props.element.cityName,
      minViewers: props.element.minViewers,
      maxViewers: props.element.maxViewers
    }
  );
});
</script>
