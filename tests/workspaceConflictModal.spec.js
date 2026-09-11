import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import { mount } from '@vue/test-utils';

const mocks = vi.hoisted(() => ({
  conflict: null,
  answer: vi.fn(),
  register: vi.fn()
}));

vi.mock('../src/composables/useBuilderStore', () => ({
  useBuilderStore: () => ({
    workspaceConflict: mocks.conflict,
    answerWorkspaceConflict: mocks.answer,
    registerWorkspaceConflictUi: mocks.register
  })
}));
import WorkspaceConflictModal from '../src/components/WorkspaceConflictModal.vue';

const page = (id, name, folder = null) => ({ id, name, folder });

function mountModal() {
  return mount(WorkspaceConflictModal, { global: { stubs: { teleport: true } } });
}

describe('workspace conflict dialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.conflict = reactive({ open: false, local: null, server: null });
  });

  it('announces itself so the store knows a dialog can be shown', () => {
    const wrapper = mountModal();
    expect(mocks.register).toHaveBeenCalledWith(true);
    wrapper.unmount();
    expect(mocks.register).toHaveBeenLastCalledWith(false);
  });

  it('spells out the pages that would leave their folder', async () => {
    Object.assign(mocks.conflict, {
      open: true,
      server: { pagesCount: 5, foldersCount: 1, rootPagesCount: 0, pageNames: [], lastEditedAt: '', pagesByFolder: [page('p1', 'index', 'Site Oficial')] },
      local: { pagesCount: 5, foldersCount: 1, rootPagesCount: 5, pageNames: [], lastEditedAt: '', pagesByFolder: [page('p1', 'index')] }
    });
    const wrapper = mountModal();
    await wrapper.vm.$nextTick();
    const text = wrapper.find('.warning').text();
    expect(text).toContain('saem da pasta');
    expect(text).toContain('index (Site Oficial)');
    wrapper.unmount();
  });

  it('spells out the pages that would disappear', async () => {
    Object.assign(mocks.conflict, {
      open: true,
      server: { pagesCount: 2, foldersCount: 0, rootPagesCount: 2, pageNames: [], lastEditedAt: '', pagesByFolder: [page('p1', 'index'), page('p2', 'obrigado')] },
      local: { pagesCount: 1, foldersCount: 0, rootPagesCount: 1, pageNames: [], lastEditedAt: '', pagesByFolder: [page('p1', 'index')] }
    });
    const wrapper = mountModal();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.warning').text()).toContain('obrigado');
    wrapper.unmount();
  });

  it('reports each choice to the store', async () => {
    Object.assign(mocks.conflict, {
      open: true,
      server: { pagesCount: 1, foldersCount: 0, rootPagesCount: 1, pageNames: [], lastEditedAt: '', pagesByFolder: [page('p1', 'index')] },
      local: { pagesCount: 1, foldersCount: 0, rootPagesCount: 1, pageNames: [], lastEditedAt: '', pagesByFolder: [page('p1', 'index')] }
    });
    const wrapper = mountModal();
    await wrapper.vm.$nextTick();
    await wrapper.find('.btn-safe').trigger('click');
    expect(mocks.answer).toHaveBeenCalledWith('server');
    await wrapper.find('.btn-risk').trigger('click');
    expect(mocks.answer).toHaveBeenLastCalledWith('local');
    wrapper.unmount();
  });
});
