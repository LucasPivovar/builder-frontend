import { describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
vi.mock('../src/services/api',()=>({getPlans:vi.fn(async()=>[{id:'essential',name:'Essencial',price:0,maxPages:5,maxDomains:1,maxVideoBytes:1000000000,maxAssetBytes:100000000}]),getSubscription:vi.fn(async()=>({plan:'essential'})),requestPlanChange:vi.fn()}));
import PlansPanel from '../src/components/dashboard/PlansPanel.vue';
describe('PlansPanel',()=>{it('mostra assinatura e limites vindos da API',async()=>{const wrapper=mount(PlansPanel);await flushPromises();expect(wrapper.text()).toContain('Plano atual');expect(wrapper.text()).toContain('5 páginas');expect(wrapper.text()).toContain('1 GB para vídeos');});});
