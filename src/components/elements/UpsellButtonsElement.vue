<template>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 20px; width: 100%;">
    <a
      :href="element.acceptUrl || '#'"
      :target="element.acceptOpenInNewTab ? '_blank' : '_self'"
      class="canvas-pitch-btn is-pulsing"
      :style="{
        background: element.style?.bgColor || '#10B981',
        color: element.style?.textColor || '#ffffff',
        maxWidth: '420px',
        borderRadius: '12px',
        padding: '14px 24px',
        textAlign: 'center',
        textDecoration: 'none',
        width: '100%',
        fontWeight: '700',
        boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
      }"
    >
      <span style="font-size: 16px; display: block;" v-html="parsedAccept"></span>
      <span v-if="element.acceptSubtext" style="font-size: 12px; opacity: 0.9; display: block; margin-top: 4px;" v-html="parsedSub"></span>
    </a>

    <a
      :href="element.declineUrl || '#'"
      :target="element.declineOpenInNewTab ? '_blank' : '_self'"
      style="background: rgba(220,38,38,0.1); color: #DC2626; border: 1px solid rgba(220,38,38,0.3); border-radius: 8px; padding: 10px 20px; font-size: 13px; text-decoration: none;"
    >
      {{ element.declineText || 'Não, obrigado. Prefiro continuar operando manualmente.' }}
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { parseAtomitags } from '../../utils/atomitags';

const props = defineProps({
  element: { type: Object, required: true }
});

const parsedAccept = computed(() => parseAtomitags(props.element.acceptText || 'SIM! ADQUIRA AGORA POR APENAS R$ 97,00'));
const parsedSub = computed(() => parseAtomitags(props.element.acceptSubtext || ''));
</script>
