import { createRouter, createWebHistory } from 'vue-router';
import LandingPageView from '../views/LandingPageView.vue';
import DashboardView from '../views/DashboardView.vue';
import AuthView from '../views/AuthView.vue';
import BuilderView from '../views/BuilderView.vue';
import AdminView from '../views/AdminView.vue';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPageView,
    meta: { title: 'Visual Builder Studio | Plataforma Nº1' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard de Funis & Páginas | Visual Builder Studio' }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    meta: { title: 'Autenticação | DevNexus Auth' }
  },
  {
    path: '/builder',
    name: 'Builder',
    component: BuilderView,
    meta: { title: 'Estúdio Construtor Visual (Vue 3)' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { title: 'Painel Admin & Gestão de Templates | Visual Builder Studio' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
