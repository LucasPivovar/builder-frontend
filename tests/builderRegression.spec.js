import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { useBuilderStore } from '../src/composables/useBuilderStore';
import { productTourSteps } from '../src/composables/useProductTour';
import ElementModal from '../src/components/ElementModal.vue';

const store = useBuilderStore();

describe('builder regressions', () => {
  beforeEach(() => store.newBlankCanvas('quiz'));

  it('inserts into the selected quiz step and supports undo/redo', () => {
    const first = store.addRow('1-col');
    const last = store.addRow('1-col');
    store.state.activeQuizStepIndex = 0;
    store.addElementToCanvas('quiz-next');
    expect(first.columns[0].elements).toHaveLength(1);
    expect(last.columns[0].elements).toHaveLength(0);
    store.undo();
    expect(store.state.rows[0].columns[0].elements).toHaveLength(0);
    store.redo();
    expect(store.state.rows[0].columns[0].elements[0].type).toBe('quiz-next');
    expect(store.state.rows[1].columns[0].elements).toHaveLength(0);
  });

  it('commits the element draft through the tour action', async () => {
    store.addElementToCanvas('heading');
    store.openModalForElement(store.state.rows[0].columns[0].elements[0]);
    const wrapper = mount(ElementModal, { attachTo: document.body });
    await wrapper.find('textarea').setValue('Saved through the tour');
    const step = productTourSteps.find(item => item.action === 'close-element');
    document.querySelector(step.actionSelector).click();
    expect(store.state.rows[0].columns[0].elements[0].content).toBe('Saved through the tour');
    expect(store.state.isElementModalOpen).toBe(false);
    wrapper.unmount();
  });
});
