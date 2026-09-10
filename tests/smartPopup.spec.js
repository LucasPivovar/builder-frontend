import { describe, expect, it } from 'vitest';
import { formatBrazilPhone, renderSmartPopup } from '../src/utils/smartPopup';

describe('smart popup', () => {
  it('formata WhatsApp no padrão brasileiro com +55', () => {
    expect(formatBrazilPhone('11987654321')).toBe('+55 (11) 98765-4321');
    expect(formatBrazilPhone('55987654321')).toBe('+55 (55) 98765-4321');
    expect(formatBrazilPhone('+55 (55) 98765-4321')).toBe('+55 (55) 98765-4321');
    expect(formatBrazilPhone('5532345678')).toBe('+55 (55) 3234-5678');
    expect(formatBrazilPhone('+55 (21) 91234-5678')).toBe('+55 (21) 91234-5678');
    expect(formatBrazilPhone('+41 94 1824 2198421941284')).toBe('+55 (41) 94182-4219');
  });

  it('usa exemplo genérico sem número pessoal no campo de telefone', () => {
    const html = renderSmartPopup({
      id: 'lead',
      fields: [{ id: 'whatsapp', inputType: 'tel', placeholder: 'WhatsApp', required: true }]
    });
    expect(html).toContain('+55 (11) 98765-4321');
    expect(html).not.toContain('98818-8085');
  });
});
