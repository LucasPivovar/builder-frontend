import { describe, expect, it } from 'vitest';
import { generateFullHTML } from '../src/utils/htmlExporter';
describe('exportador HTML',()=>{it('gera formulário nativo e contexto seguro de página',()=>{const html=generateFullHTML({rows:[{id:'r1',columns:[{id:'c1',elements:[{id:'f1',type:'form',formTitle:'Contato',content:'Enviar',style:{}}]}]}],pageSettings:{trackingKey:'pagina-teste'}});expect(html).toContain('data-builder-native-form="1"');expect(html).toContain('/api/analytics/popup-submissions');expect(html).toContain('__builderAnalyticsSignature');});});
