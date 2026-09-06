import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/identity.css';
import './assets/style.css';
import './assets/buttons.css';
import { popupThemeCss } from './utils/popupAppearance';
const popupStyle = document.createElement('style');
popupStyle.textContent = popupThemeCss;
document.head.appendChild(popupStyle);

createApp(App).use(router).mount('#app');
