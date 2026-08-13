import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import bootstrapIconsFontUrl from 'bootstrap-icons/font/fonts/bootstrap-icons.woff2';
import './assets/identity.css';
import './assets/style.css';

// Garante o carregamento da fonte dos ícones também em navegadores que atrasam
// a fonte declarada pelo CSS do pacote.
if (typeof FontFace !== 'undefined' && document.fonts && !document.fonts.check('16px "bootstrap-icons"')) {
  const iconFont = new FontFace('bootstrap-icons', `url("${bootstrapIconsFontUrl}")`, {
    style: 'normal',
    weight: '400',
    display: 'block'
  });
  iconFont.load().then(font => document.fonts.add(font)).catch(() => {});
}

// Alguns navegadores integrados não aceitam fontes de ícones. Neles usamos
// símbolos nativos legíveis, sem deixar quadrados vazios na interface.
if (document.fonts) {
  document.fonts.ready.then(() => {
    if (!document.fonts.check('16px "bootstrap-icons"')) {
      document.documentElement.classList.add('icon-font-unavailable');
    }
  });
}

createApp(App).use(router).mount('#app');
