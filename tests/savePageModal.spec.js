import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
const mocks = vi.hoisted(() => ({ flush: vi.fn(), save: vi.fn(() => ({ id: 'page-qa', name: 'QA' })) }));
vi.mock('../src/composables/useBuilderStore', () => ({
  useBuilderStore: () => ({
    state: { builderMode: 'email', pageSettings: {}, currentPageName: 'QA' },
    foldersRegistry: [], savePage: mocks.save, flushWorkspaceToBackend: mocks.flush
  })
}));
import SavePageModal from '../src/components/SavePageModal.vue';

describe('page save confirmation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('waits for the backend before confirming and closing', async () => {
    let resolveSave;
    mocks.flush.mockImplementation(() => new Promise(resolve => { resolveSave = resolve; }));
    const wrapper = mount(SavePageModal, { props: { isOpen: false }, global: { stubs: { teleport: true } } });
    await wrapper.setProps({ isOpen: true });
    await wrapper.find('.btn-save').trigger('click');
    expect(wrapper.find('.btn-save').element.disabled).toBe(true);
    expect(wrapper.emitted('close')).toBeUndefined();
    resolveSave(true);
    await flushPromises();
    expect(wrapper.emitted('saved')).toHaveLength(1);
    expect(wrapper.emitted('close')).toHaveLength(1);
    wrapper.unmount();
  });

  it('keeps the dialog open after a failed synchronization', async () => {
    mocks.flush.mockResolvedValue(false);
    const wrapper = mount(SavePageModal, { props: { isOpen: false }, global: { stubs: { teleport: true } } });
    await wrapper.setProps({ isOpen: true });
    await wrapper.find('.btn-save').trigger('click');
    await flushPromises();
    expect(wrapper.emitted('saved')).toBeUndefined();
    expect(wrapper.emitted('close')).toBeUndefined();
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('.btn-save').element.disabled).toBe(false);
    wrapper.unmount();
  });
});
