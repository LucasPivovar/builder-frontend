import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import VturbPlayerElement from '../src/components/elements/VturbPlayerElement.vue';
import LiveViewersElement from '../src/components/elements/LiveViewersElement.vue';
import QuizElement from '../src/components/elements/QuizElement.vue';
import { generateFullHTML } from '../src/utils/htmlExporter';
import { formatPopupFieldLabel } from '../src/utils/popupResponseDisplay';
import { stripSmartPopupPrefix } from '../src/utils/smartPopup';

function exported(elements, settings = {}) {
  const html = generateFullHTML({ rows: [{ id: 'row', columns: [{ id: 'col', elements }] }], pageSettings: settings });
  return new DOMParser().parseFromString(html, 'text/html');
}

describe('requested visual adjustments', () => {
  it('caps legacy and new video players at 320px in the editor and export', () => {
    const element = { id: 'video', type: 'vturb-player', hostedVideoUrl: '/media/test.mp4', style: { maxWidth: '900px', marginTop: 28, marginBottom: 12 } };
    const wrapper = mount(VturbPlayerElement, { props: { element } });
    const node = wrapper.element;
    const output = exported([element]).querySelector('.canvas-vturb-wrapper');
    expect(node.style.maxWidth).toBe('320px');
    expect(output.style.maxWidth).toBe('320px');
    expect(node.style.marginTop).toBe('28px');
    expect(output.style.marginTop).toBe('28px');
    expect(output.style.marginBottom).toBe('12px');
    wrapper.unmount();
  });

  it('renders default viewers without a background and with a white count', () => {
    const element = { id: 'viewers', type: 'live-viewers', content: 'assistindo', style: {} };
    const wrapper = mount(LiveViewersElement, { props: { element } });
    expect(wrapper.element.style.backgroundColor).toBe('transparent');
    expect(wrapper.find('strong').element.style.color).toBe('rgb(255, 255, 255)');
    const output = exported([element]).querySelector('.canvas-live-viewers-widget');
    expect(output.style.backgroundColor).toBe('transparent');
    expect(output.querySelector('strong').style.color).toBe('rgb(255, 255, 255)');
    wrapper.unmount();
  });

  it('keeps section spacing configurable in exported pages', () => {
    const output = exported([{ id: 'title', type: 'heading', content: 'QA', style: {} }], { sectionGap: 37 });
    expect(output.querySelector('.builder-row').style.marginBottom).toBe('37px');
  });

  it('applies edited plan content and typography in the quiz', async () => {
    const element = { type: 'quiz-price', content: 'Plano QA', description: 'Detalhes', price: 'R$ 49,90', style: { fontSize: '24px', paddingVertical: 18, maxWidth: '320px' } };
    const wrapper = mount(QuizElement, { props: { element } });
    expect(wrapper.text()).toContain('Plano QA');
    expect(wrapper.text()).toContain('R$ 49,90');
    expect(wrapper.find('.quiz-price strong').element.style.fontSize).toBe('24px');
    await wrapper.setProps({ element: { ...element, content: 'Plano alterado', price: 'R$ 99,90' } });
    expect(wrapper.text()).toContain('Plano alterado');
    expect(wrapper.text()).toContain('R$ 99,90');
    wrapper.unmount();
  });

  it('normalizes response labels and duplicated decorative prefixes', () => {
    expect(formatPopupFieldLabel('Seu Nome')).toBe('Nome');
    expect(formatPopupFieldLabel('Sua Empresa')).toBe('Empresa');
    expect(stripSmartPopupPrefix('\u{1F534} CONTEUDO', '', 'badge')).toBe('CONTEUDO');
    expect(stripSmartPopupPrefix('\u{1F6E1}\uFE0F Protegido', '', 'footer')).toBe('Protegido');
  });
});
