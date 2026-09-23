import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({
  getWorkspace: vi.fn(), saveWorkspace: vi.fn(), getStoredUser: vi.fn(),
  hasAuthToken: vi.fn(), getPlatformTemplates: vi.fn(), getSubscription: vi.fn()
}));
vi.mock('../src/services/api', () => api);

const data = (pages = []) => ({ pages, folders: [], templates: [], versions: [], metrics: [], settings: {} });
const page = (id) => ({ id, name: id, rows: [], folderId: null });
let store;
beforeEach(async () => {
  vi.resetModules(); vi.resetAllMocks();
  localStorage.clear(); sessionStorage.clear();
  api.getStoredUser.mockReturnValue({ id: 'user-a' });
  api.hasAuthToken.mockReturnValue(true);
  api.getPlatformTemplates.mockResolvedValue([]);
  api.getSubscription.mockResolvedValue({ limits: { maxPages: 5, name: 'Essencial' } });
  api.saveWorkspace.mockResolvedValue({ revision: 2 });
  store = (await import('../src/composables/useBuilderStore')).useBuilderStore();
});
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe('páginas pertencem à conta, não ao dispositivo', () => {
  it('carrega todas as páginas do servidor em um dispositivo sem cache, sem escrever', async () => {
    api.getWorkspace.mockResolvedValue({ initialized: true, revision: 8, data: data(Array.from({ length: 5 }, (_, i) => page(`page-${i}`))) });
    await store.hydrateWorkspaceFromBackend();
    expect(store.pagesRegistry).toHaveLength(5);
    expect(api.saveWorkspace).not.toHaveBeenCalled();
  });

  it('substitui cache desatualizado pelos dados da conta no servidor', async () => {
    store.pagesRegistry.push(page('old-device-page'));
    api.getWorkspace.mockResolvedValue({ initialized: true, revision: 8, data: data([page('server-page')]) });
    await store.hydrateWorkspaceFromBackend();
    expect(store.pagesRegistry.map(p => p.id)).toEqual(['server-page']);
    expect(api.saveWorkspace).not.toHaveBeenCalled();
  });

  it('não inicializa uma conta vazia só por abrir em outro dispositivo', async () => {
    api.getWorkspace.mockResolvedValue({ initialized: false, revision: 0, data: data() });
    await store.hydrateWorkspaceFromBackend();
    expect(api.saveWorkspace).not.toHaveBeenCalled();
  });

  it('bloqueia salvamento após erro de leitura e permite tentar carregar novamente', async () => {
    api.getWorkspace.mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ initialized: true, revision: 8, data: data([page('server-page')]) });
    await expect(store.hydrateWorkspaceFromBackend()).rejects.toThrow('offline');
    expect(store.workspaceStatus.error).toContain('Não foi possível carregar');
    expect(await store.flushWorkspaceToBackend()).toBe(false);
    expect(api.saveWorkspace).not.toHaveBeenCalled();
    await store.hydrateWorkspaceFromBackend();
    expect(store.workspaceStatus.error).toBe('');
    expect(store.pagesRegistry[0].id).toBe('server-page');
  });

  it('não importa páginas locais de outra conta', async () => {
    localStorage.setItem('vbs_workspace_owner', 'user-b');
    store.pagesRegistry.push(page('private-b'));
    api.getWorkspace.mockResolvedValue({ initialized: false, revision: 0, data: data() });
    await store.hydrateWorkspaceFromBackend();
    expect(store.pagesRegistry).toHaveLength(0);
    expect(api.saveWorkspace).not.toHaveBeenCalled();
  });

  it('ignora resposta atrasada depois de trocar de conta', async () => {
    let resolveOld;
    api.getWorkspace.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }))
      .mockResolvedValue({ initialized: true, revision: 9, data: data([page('private-b')]) });
    const oldRequest = store.hydrateWorkspaceFromBackend();
    api.getStoredUser.mockReturnValue({ id: 'user-b' });
    await store.hydrateWorkspaceFromBackend();
    resolveOld({ initialized: true, revision: 1, data: data([page('private-a')]) });
    expect(await oldRequest).toBe(false);
    expect(store.pagesRegistry.map(p => p.id)).toEqual(['private-b']);
  });

  it('compartilha carregamentos simultâneos da mesma conta', async () => {
    api.getWorkspace.mockResolvedValue({ initialized: true, revision: 8, data: data() });
    await Promise.all([store.hydrateWorkspaceFromBackend(), store.hydrateWorkspaceFromBackend()]);
    expect(api.getWorkspace).toHaveBeenCalledTimes(1);
  });

  it('mantém as páginas remotas ao resolver conflito durante o salvamento', async () => {
    api.getWorkspace.mockResolvedValueOnce({ initialized: true, revision: 1, data: data([page('original')]) })
      .mockResolvedValue({ initialized: true, revision: 2, data: data([page('original'), page('created-on-other-device')]) });
    await store.hydrateWorkspaceFromBackend();
    api.saveWorkspace.mockRejectedValueOnce(Object.assign(new Error('Conflito'), { status: 409, payload: { currentRevision: 2 } }));
    await expect(store.savePageToBackend('Meu rascunho', null)).rejects.toThrow();
    expect(store.pagesRegistry.map(p => p.id)).toEqual(['original', 'created-on-other-device']);
    await store.flushWorkspaceToBackend();
    expect(api.saveWorkspace.mock.calls.at(-1)[0].pages.map(p => p.id)).toEqual(['original', 'created-on-other-device']);
  });

  it('sincroniza mesmo quando o cache do navegador está cheio', async () => {
    vi.useFakeTimers();
    api.getWorkspace.mockResolvedValue({ initialized: true, revision: 8, data: data() });
    await store.hydrateWorkspaceFromBackend();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Quota exceeded'); });
    store.createFolder('Pasta no servidor');
    await vi.advanceTimersByTimeAsync(500);
    expect(api.saveWorkspace).toHaveBeenCalledWith(expect.objectContaining({ folders: [expect.objectContaining({ name: 'Pasta no servidor' })] }));
  });
});
