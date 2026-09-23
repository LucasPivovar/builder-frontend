import { reactive } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ store: null }));
vi.mock('../src/composables/useBuilderStore', () => ({ useBuilderStore: () => mocks.store }));
vi.mock('../src/services/api', () => ({ hasAuthToken: () => true }));
import App from '../src/App.vue';

beforeEach(() => {
  mocks.store = { workspaceStatus: reactive({ loading: false, error: '' }),
    loadTemplate: vi.fn(), closeTemplateBuilder: vi.fn(), hydrateWorkspaceFromBackend: vi.fn(async () => {}) };
});
it('mostra erro de carregamento com tentativa novamente em vez de um painel vazio', async () => {
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/dashboard', component: { template: '<div>Minhas páginas</div>' }, meta: { requiresAuth: true } }
  ] });
  await router.push('/dashboard'); await router.isReady();
  mocks.store.hydrateWorkspaceFromBackend.mockImplementationOnce(async () => {
    mocks.store.workspaceStatus.error = 'Não foi possível carregar suas páginas.';
    throw new Error('offline');
  }).mockImplementationOnce(async () => { mocks.store.workspaceStatus.error = ''; });
  const wrapper = mount(App, { global: { plugins: [router], stubs: {
    ToastNotification: true, PageSummaryModal: true, WorkspaceConflictModal: true, ProductTour: true
  } } });
  await flushPromises();
  expect(wrapper.find('[role="alert"]').text()).toContain('Não foi possível carregar');
  expect(wrapper.text()).toContain('Tentar novamente');
  await wrapper.find('button').trigger('click'); await flushPromises();
  expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  expect(mocks.store.hydrateWorkspaceFromBackend).toHaveBeenCalledTimes(2);
  wrapper.unmount();
});
