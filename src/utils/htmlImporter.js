/**
 * Utility to parse raw exported HTML back into Builder state rows & elements
 */
export function parseHTMLToBuilderState(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') {
    return { rows: [], pageSettings: {} };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Extract Page Settings
  const title = doc.querySelector('title')?.textContent || 'Página Importada';
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  // Extract body background color & font
  const bodyEl = doc.body;
  const vslContainer = doc.querySelector('.vsl-container');
  let bgColor = '#191919';
  if (vslContainer && vslContainer.style.backgroundColor) {
    bgColor = vslContainer.style.backgroundColor;
  } else if (bodyEl && bodyEl.style.backgroundColor) {
    bgColor = bodyEl.style.backgroundColor;
  }

  const rows = [];
  const rowElements = doc.querySelectorAll('.builder-row');

  if (rowElements.length > 0) {
    rowElements.forEach((rowNode, rIdx) => {
      const hasTopBanner = rowNode.classList.contains('has-top-banner');
      const cols = [];
      const colNodes = rowNode.querySelectorAll('.builder-col');

      colNodes.forEach((colNode, cIdx) => {
        const elements = [];
        const elemNodes = colNode.querySelectorAll('.canvas-element');

        elemNodes.forEach((elemNode, eIdx) => {
          const type = elemNode.getAttribute('data-element-type');

          if (type === 'top-banner' || elemNode.querySelector('.canvas-top-banner')) {
            const banner = elemNode.querySelector('.canvas-top-banner');
            const bg = banner?.style.background || banner?.style.backgroundColor || '#dc2626';
            const color = banner?.style.color || '#ffffff';
            const content = banner?.textContent?.trim() || 'ATENÇÃO: NÃO FECHE ESTA PÁGINA';

            elements.push({
              id: `elem-imp-${Date.now()}-${rIdx}-${cIdx}-${eIdx}`,
              type: 'top-banner',
              content,
              style: { bgColor: bg, textColor: color, fontSize: '15px', fontWeight: '800', align: 'center' }
            });
          } else if (type === 'heading' || elemNode.querySelector('.canvas-heading')) {
            const h = elemNode.querySelector('.canvas-heading') || elemNode.querySelector('h1, h2, h3');
            const color = h?.style.color || '#ffffff';
            const fontSize = h?.style.fontSize || '30px';
            const content = h?.innerHTML?.trim() || 'Título';

            elements.push({
              id: `elem-imp-${Date.now()}-${rIdx}-${cIdx}-${eIdx}`,
              type: 'heading',
              content: cleanHTMLTagsForEditor(content),
              style: { fontSize, fontWeight: '900', textColor: color, altColor: '#f1c232', align: 'center' }
            });
          } else if (type === 'paragraph' || elemNode.querySelector('.canvas-paragraph')) {
            const p = elemNode.querySelector('.canvas-paragraph') || elemNode.querySelector('p');
            const color = p?.style.color || '#cccccc';
            const fontSize = p?.style.fontSize || '15px';
            const content = p?.innerHTML?.trim() || '';

            elements.push({
              id: `elem-imp-${Date.now()}-${rIdx}-${cIdx}-${eIdx}`,
              type: 'paragraph',
              content: cleanHTMLTagsForEditor(content),
              style: { fontSize, fontWeight: '400', textColor: color, align: 'center' }
            });
          } else if (type === 'vturb-player' || elemNode.querySelector('.canvas-vturb-wrapper')) {
            const wrapper = elemNode.querySelector('.canvas-vturb-wrapper');
            const vturbBody = wrapper ? wrapper.innerHTML.trim() : elemNode.innerHTML.trim();

            elements.push({
              id: `elem-imp-${Date.now()}-${rIdx}-${cIdx}-${eIdx}`,
              type: 'vturb-player',
              content: '',
              vturbBody,
              style: { maxWidth: '300px', marginTop: 10, marginBottom: 10 }
            });
          } else if (type === 'pitch-button' || elemNode.querySelector('.canvas-pitch-btn')) {
            const btn = elemNode.querySelector('.canvas-pitch-btn') || elemNode.querySelector('a');
            const textSpan = btn?.querySelector('span')?.textContent || btn?.textContent || 'QUERO MEU ACESSO AGORA';
            const url = btn?.getAttribute('href') || '#';
            const bg = btn?.style.backgroundColor || '#ffffff';
            const color = btn?.style.color || '#000000';

            elements.push({
              id: `elem-imp-${Date.now()}-${rIdx}-${cIdx}-${eIdx}`,
              type: 'pitch-button',
              content: textSpan.trim(),
              url,
              openInNewTab: true,
              style: { bgColor: bg, textColor: color, fontSize: '20px', fontWeight: '800', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, align: 'center' }
            });
          } else if (type === 'live-viewers' || elemNode.querySelector('.canvas-live-viewers-widget')) {
            const widget = elemNode.querySelector('.canvas-live-viewers-widget');
            const minV = parseInt(widget?.getAttribute('data-min') || '500', 10);
            const maxV = parseInt(widget?.getAttribute('data-max') || '1000', 10);
            const content = 'espectadores estão vendo este conteúdo simultaneamente com você';

            const countNode = widget?.querySelector('.vsl-viewer-count');
            const extractedCountColor = countNode?.style?.color;
            const finalCountColor = (extractedCountColor && extractedCountColor !== '#38bdf8' && extractedCountColor !== 'rgb(56, 189, 248)')
              ? extractedCountColor
              : '#ffffff';

            elements.push({
              id: `elem-imp-${Date.now()}-${rIdx}-${cIdx}-${eIdx}`,
              type: 'live-viewers',
              content,
              minViewers: minV,
              maxViewers: maxV,
              style: { fontSize: '18px', textColor: '#ffffff', countColor: finalCountColor, align: 'center' }
            });
          }
        });

        cols.push({
          id: `col-imp-${Date.now()}-${rIdx}-${cIdx}`,
          flex: 1,
          elements
        });
      });

      rows.push({
        id: `row-imp-${Date.now()}-${rIdx}`,
        hasTopBanner,
        columns: cols
      });
    });
  } else {
    // Fallback row if structure is non-standard HTML
    rows.push({
      id: 'row-imp-fallback',
      columns: [
        {
          id: 'col-imp-fallback',
          flex: 1,
          elements: [
            {
              id: 'elem-imp-raw',
              type: 'paragraph',
              content: doc.body ? doc.body.innerHTML : htmlString,
              style: { fontSize: '16px', textColor: '#ffffff', align: 'center' }
            }
          ]
        }
      ]
    });
  }

  return {
    rows,
    pageSettings: {
      pageTitle: title,
      metaDesc,
      bgColor,
      fontFamily: 'Roboto'
    }
  };
}

function cleanHTMLTagsForEditor(htmlText) {
  if (!htmlText) return '';
  return htmlText
    .replace(/<span style="color:\s*([^"]+);">/gi, '>>')
    .replace(/<\/span>/gi, '<<')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<[^>]+>/g, '');
}
