export function formatPopupResponse(field) {
  const value = String(field.value ?? '');
  if (!value) return '—';
  const isPhone = field.inputType === 'tel' || /whats|telefone|celular|phone|\btel\b/i.test(field.label || '');
  if (!isPhone || !/^[+\d\s().-]+$/.test(value)) return value;
  const digits = value.replace(/\D/g, '');
  if (digits.length === 12 || digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, -4)}-${digits.slice(-4)}`;
  }
  if (digits.length === 10 || digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, -4)}-${digits.slice(-4)}`;
  }
  return value;
}
