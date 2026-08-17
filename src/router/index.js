import { createRouter, createWebHistory } from 'vue-router';
import LandingPageView from '../views/LandingPageView.vue';
import DashboardView from '../views/DashboardView.vue';
import AuthView from '../views/AuthView.vue';
import BuilderView from '../views/BuilderView.vue';
import AdminView from '../views/AdminView.vue';
import { hasAuthToken } from '../services/api';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPageView,
    meta: { title: 'Astro Builder' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard | Astro Builder', requiresAuth: true }
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
    meta: { title: 'Construtor | Astro Builder', requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { title: 'Painel Admin | Astro Builder', requiresAuth: true }
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

  const isAuthenticated = hasAuthToken();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/auth', query: { redirect: to.fullPath } });
    return;
  }

  if (to.path === '/auth' && isAuthenticated && !to.query.redirect) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;
