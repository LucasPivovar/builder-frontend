import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuthSession, getAccessToken, getProfile, getRefreshToken, storeAuthSession } from '../src/services/api';

describe('sessão da API',()=>{
  beforeEach(()=>{localStorage.clear();sessionStorage.clear();vi.restoreAllMocks();});
  it('persiste access e refresh no armazenamento escolhido',()=>{storeAuthSession({accessToken:'access',refreshToken:'refresh',user:{id:'1'}},true);expect(getAccessToken()).toBe('access');expect(getRefreshToken()).toBe('refresh');clearAuthSession();expect(getAccessToken()).toBe('');});
  it('rotaciona o token e repete uma chamada que recebeu 401',async()=>{storeAuthSession({accessToken:'old',refreshToken:'refresh-old',user:{id:'1'}},false);global.fetch=vi.fn(async url=>{if(String(url).endsWith('/auth/refresh'))return new Response(JSON.stringify({accessToken:'new',refreshToken:'refresh-new',user:{id:'1'}}),{status:200,headers:{'content-type':'application/json'}});const authorization=global.fetch.mock.calls.at(-1)[1].headers.Authorization;if(authorization==='Bearer old')return new Response(JSON.stringify({message:'expirou'}),{status:401});return new Response(JSON.stringify({id:'1',name:'Teste'}),{status:200,headers:{'content-type':'application/json'}});});const profile=await getProfile();expect(profile.name).toBe('Teste');expect(getAccessToken()).toBe('new');expect(getRefreshToken()).toBe('refresh-new');expect(global.fetch).toHaveBeenCalledTimes(3);});
});
