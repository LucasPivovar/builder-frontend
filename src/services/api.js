const API_BASE_URL = (process.env.VUE_APP_API_URL || 'http://127.0.0.1:3000/api').replace(/\/$/, '');
const TOKEN_KEY = 'vbs_access_token';
const USER_KEY = 'vbs_current_user';
const LOGGED_KEY = 'vbs_logged_in';

function activeStorageValue(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || '';
}

export function getAccessToken() {
  return activeStorageValue(TOKEN_KEY);
}

export function hasAuthToken() {
  return Boolean(getAccessToken());
}

export function getStoredUser() {
  try { return JSON.parse(activeStorageValue(USER_KEY) || 'null'); }
  catch { return null; }
}

export function storeAuthSession({ accessToken, user }, remember = false) {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;
  storage.setItem(TOKEN_KEY, accessToken);
  storage.setItem(USER_KEY, JSON.stringify(user));
  storage.setItem(LOGGED_KEY, 'true');
  otherStorage.removeItem(TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);
  otherStorage.removeItem(LOGGED_KEY);
}

export function clearAuthSession() {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(LOGGED_KEY);
  });
}

async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 12000);
  const token = getAccessToken();

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 && token) clearAuthSession();
      const message = Array.isArray(payload.message) ? payload.message[0] : payload.message;
      const error = new Error(message || 'Não foi possível concluir a operação.');
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('O servidor demorou para responder.');
    if (error instanceof TypeError) throw new Error('Backend indisponível. Inicie com npm run dev.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const login = (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials });
export const register = (account) => apiRequest('/auth/register', { method: 'POST', body: account });
export const getProfile = () => apiRequest('/auth/me');
export const prepareEmailTracking = body => apiRequest('/analytics/email/prepare', { method: 'POST', body });
export const saveAdminPage = (userId, pageId, body) => apiRequest(`/admin/users/${encodeURIComponent(userId)}/pages/${encodeURIComponent(pageId)}`, { method: 'POST', body });
export async function updateProfile(profile) {
  const user = await apiRequest('/auth/profile', { method: 'POST', body: profile });
  const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('profile-updated'));
  return user;
}
export const getWorkspace = () => apiRequest('/workspace');
export const saveWorkspace = (workspace) => apiRequest('/workspace', { method: 'PUT', body: workspace, timeout: 20000 });
export const publishPage = (publication) => apiRequest('/publications', { method: 'POST', body: publication, timeout: 30000 });
export const getPublications = () => apiRequest('/publications');
export const deletePublication = (id) => apiRequest(`/publications/${id}`, { method: 'DELETE' });
export const verifyPublicationDomain = (id) => apiRequest(`/publications/${id}/verify-domain`, { method: 'PATCH', timeout: 20000 });
export const getNotifications = () => apiRequest('/notifications');
export const clearNotifications = () => apiRequest('/notifications', { method: 'DELETE' });
export const markNotificationRead = (id) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
export const markAllNotificationsRead = () => apiRequest('/notifications/read-all', { method: 'PATCH' });
export const getPlatformTemplates = () => apiRequest('/workspace/platform-templates');
export const getAnalyticsSummary = () => apiRequest('/analytics/summary');
export const getPopupSubmissions = (pageId, page = 1) => apiRequest(`/analytics/popup-submissions?pageId=${encodeURIComponent(pageId)}&page=${page}`);
export const exportPopupSubmissions = pageId => apiRequest(`/analytics/popup-submissions/export?pageId=${encodeURIComponent(pageId)}`, { timeout: 30000 });
export const getAdminOverview = () => apiRequest('/admin/overview');
export const getAdminUsers = () => apiRequest('/admin/users');
export const getAdminPages = () => apiRequest('/admin/pages');
export const getAdminHistory = () => apiRequest('/admin/history');
export const createAdminAlert = (alert) => apiRequest('/admin/alerts', { method: 'POST', body: alert });
export const getAdminUserWorkspace = (userId) => apiRequest(`/admin/users/${userId}/workspace`);
export const restoreAdminBackup = (userId, backupId) => apiRequest(`/admin/users/${userId}/backups/${backupId}/restore`, { method: 'POST' });

export { API_BASE_URL };
