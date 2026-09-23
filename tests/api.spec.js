import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuthSession, getAccessToken, getProfile, getRefreshToken, storeAuthSession } from '../src/services/api';

describe('sessão da API',()=>{
  beforeEach(()=>{localStorage.clear();sessionStorage.clear();vi.restoreAllMocks();});
  it('persiste access e refresh no armazenamento escolhido',()=>{storeAuthSession({accessToken:'access',refreshToken:'refresh',user:{id:'1'}},true);expect(getAccessToken()).toBe('access');expect(getRefreshToken()).toBe('refresh');clearAuthSession();expect(getAccessToken()).toBe('');});
  it('rotaciona o token e repete uma chamada que recebeu 401',async()=>{storeAuthSession({accessToken:'old',refreshToken:'refresh-old',user:{id:'1'}},false);global.fetch=vi.fn(async url=>{if(String(url).endsWith('/auth/refresh'))return new Response(JSON.stringify({accessToken:'new',refreshToken:'refresh-new',user:{id:'1'}}),{status:200,headers:{'content-type':'application/json'}});const authorization=global.fetch.mock.calls.at(-1)[1].headers.Authorization;if(authorization==='Bearer old')return new Response(JSON.stringify({message:'expirou'}),{status:401});return new Response(JSON.stringify({id:'1',name:'Teste'}),{status:200,headers:{'content-type':'application/json'}});});const profile=await getProfile();expect(profile.name).toBe('Teste');expect(getAccessToken()).toBe('new');expect(getRefreshToken()).toBe('refresh-new');expect(global.fetch).toHaveBeenCalledTimes(3);});
});

describe('renovação concorrente da sessão', () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.restoreAllMocks(); });
  it('renova apenas uma vez para várias leituras simultâneas com token expirado', async () => {
    storeAuthSession({ accessToken: 'old', refreshToken: 'refresh-old', user: { id: '1' } });
    let releaseRefresh;
    global.fetch = vi.fn(async (url, options) => {
      if (String(url).endsWith('/auth/refresh')) {
        await new Promise(resolve => { releaseRefresh = resolve; });
        return new Response(JSON.stringify({ accessToken: 'new', refreshToken: 'refresh-new', user: { id: '1' } }));
      }
      if (options.headers.Authorization === 'Bearer old') return new Response(JSON.stringify({ message: 'expirou' }), { status: 401 });
      return new Response(JSON.stringify({ id: '1' }));
    });
    const requests = Promise.all([getProfile(), getProfile(), getProfile()]);
    await vi.waitFor(() => expect(releaseRefresh).toBeTypeOf('function'));
    releaseRefresh();
    expect(await requests).toEqual([{ id: '1' }, { id: '1' }, { id: '1' }]);
    expect(global.fetch.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'))).toHaveLength(1);
    expect(getAccessToken()).toBe('new');
  });

  it('não restaura uma sessão encerrada enquanto a renovação estava em andamento', async () => {
    storeAuthSession({ accessToken: 'old', refreshToken: 'refresh-old', user: { id: '1' } });
    let releaseRefresh;
    global.fetch = vi.fn(async (url) => {
      if (String(url).endsWith('/auth/refresh')) {
        await new Promise(resolve => { releaseRefresh = resolve; });
        return new Response(JSON.stringify({ accessToken: 'new', refreshToken: 'refresh-new', user: { id: '1' } }));
      }
      return new Response(JSON.stringify({ message: 'expirou' }), { status: 401 });
    });
    const pending = getProfile();
    const rejected = expect(pending).rejects.toThrow('expirou');
    await vi.waitFor(() => expect(releaseRefresh).toBeTypeOf('function'));
    clearAuthSession();
    releaseRefresh();
    await rejected;
    expect(getAccessToken()).toBe('');
  });
});
