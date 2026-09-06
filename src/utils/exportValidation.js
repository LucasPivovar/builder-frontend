export function validateExport(rows = [], settings = {}) {
  const warnings = [];
  const elements = rows.flatMap(row => (row.columns || []).flatMap(column => column.elements || []));
  if (!settings.pageTitle?.trim()) warnings.push('Adicione um título à página para melhorar SEO e a identificação na aba do navegador.');
  if (!settings.metaDesc?.trim()) warnings.push('Inclua uma meta descrição para melhorar o compartilhamento e SEO.');
  elements.forEach((element, index) => {
    if (element.type === 'smart-popup') {
      const hasFields = (Array.isArray(element.fields) && element.fields.length > 0) || (element.blocks || []).some(block => block.type === 'field');
      if (!hasFields) warnings.push('Popup inteligente: adicione ao menos um campo.');
    }
    const label = `Bloco ${index + 1}`;
    if (['button', 'pitch-button'].includes(element.type) && (!element.url || element.url === '#')) warnings.push(`${label}: o botão “${element.content || 'sem texto'}” está sem link de destino.`);
    if (element.type === 'image' && !(element.imageUrl || element.content)) warnings.push(`${label}: inclua uma URL de imagem.`);
    if (element.type === 'form' && !element.submitUrl) warnings.push(`${label}: o formulário ainda não possui URL de envio; ele funciona somente como demonstração até integrar o backend.`);
    if (element.type === 'countdown' && !element.targetDate) warnings.push(`${label}: defina a data final da contagem regressiva.`);
  });
  const lastQuizButton = [...elements].reverse().find(element => element.type === 'quiz-next');
  if (lastQuizButton && (!lastQuizButton.url || lastQuizButton.url === '#quiz-next')) warnings.push('Quiz: informe o redirecionamento no botão da última etapa para enviar o visitante ao resultado ou à oferta.');
  return warnings;
}
