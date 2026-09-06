<template>
  <span class="astro-mark" :class="`is-${variant}`" role="img" aria-label="Astro Builder"></span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'light' }
});
</script>

<style scoped>
.astro-mark {
  width: var(--mark-width, 42px);
  height: var(--mark-height, 30px);
  display: inline-block;
  flex: 0 0 auto;
  background-image: url('../assets/astro-brand-reference.png');
  background-repeat: no-repeat;
  /* Monograma completo, sem a tipografia ou bordas da prancha de referência. */
  background-size: 365% 385%;
  background-position: 19.3% 79%;
  overflow: hidden;
}

.astro-mark.is-dark { background-position: 19.3% 10.2%; }
</style>
