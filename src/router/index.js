import { createRouter, createWebHistory } from 'vue-router';
import { getStoredUser, hasAuthToken } from '../services/api';
const LandingPageView=()=>import('../views/LandingPageView.vue');const DashboardView=()=>import('../views/DashboardView.vue');const AuthView=()=>import('../views/AuthView.vue');const BuilderView=()=>import('../views/BuilderView.vue');const AdminView=()=>import('../views/AdminView.vue');const PageMetricsView=()=>import('../views/PageMetricsView.vue');

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
    path: '/dashboard/metricas/:pageId',
    name: 'PageMetrics',
    component: PageMetricsView,
    meta: { title: 'Métricas da página | Astro Builder', requiresAuth: true }
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
    meta: { title: 'Painel Admin | Astro Builder', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

  if (to.meta.requiresAdmin && getStoredUser()?.role !== 'admin') {
    next('/dashboard');
    return;
  }

  if (to.path === '/auth' && isAuthenticated && !to.query.redirect) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;
