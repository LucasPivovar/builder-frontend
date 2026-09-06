<template>
  <img class="astro-mark" :src="asset" alt="AstroBuilder" />
</template>

<script setup>
import { computed } from 'vue';
import iconColor from '../assets/brand/astrobuilder-icon-v2.png';
import iconWhite from '../assets/brand/astrobuilder-icon-white-v2.png';
import logoColor from '../assets/brand/astrobuilder-logo-v2.png';
import logoWhite from '../assets/brand/astrobuilder-logo-white-v2.png';
const props = defineProps({ variant: { type: String, default: 'light' }, lockup: { type: Boolean, default: false } });
const asset = computed(() => props.lockup ? (props.variant === 'white' || props.variant === 'dark' ? logoWhite : logoColor) : (props.variant === 'white' || props.variant === 'dark' ? iconWhite : iconColor));
</script>

<style scoped>
.astro-mark {
  width: var(--mark-width, 42px);
  height: var(--mark-height, 30px);
  display: inline-block;
  flex: 0 0 auto;
  object-fit: contain;
}
</style>
