const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api').replace(/\/$/, '');
const TOKEN_KEY = 'vbs_access_token';
const REFRESH_TOKEN_KEY = 'vbs_refresh_token';
const USER_KEY = 'vbs_current_user';
const LOGGED_KEY = 'vbs_logged_in';

function activeStorageValue(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || '';
}

export function getAccessToken() {
  return activeStorageValue(TOKEN_KEY);
}

export function getRefreshToken() { return activeStorageValue(REFRESH_TOKEN_KEY); }

export function hasAuthToken() {
  return Boolean(getAccessToken());
}

export function getStoredUser() {
  try { return JSON.parse(activeStorageValue(USER_KEY) || 'null'); }
  catch { return null; }
}

export function storeAuthSession({ accessToken, refreshToken, user }, remember = false) {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;
  storage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  storage.setItem(USER_KEY, JSON.stringify(user));
  storage.setItem(LOGGED_KEY, 'true');
  otherStorage.removeItem(TOKEN_KEY);
  otherStorage.removeItem(REFRESH_TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);
  otherStorage.removeItem(LOGGED_KEY);
}

export function clearAuthSession() {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(LOGGED_KEY);
  });
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, { method:'POST', headers:{ Accept:'application/json', 'Content-Type':'application/json' }, body:JSON.stringify({ refreshToken }) });
  if (!response.ok) return false;
  const session = await response.json();
  const remember = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
  storeAuthSession(session, remember);
  return true;
}

async function apiRequest(path, options = {}, retried = false) {
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
      if (response.status === 401 && token && !retried && await refreshAccessToken()) return apiRequest(path, options, true);
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

async function multipartRequest(path, formData) {
  const token = getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) clearAuthSession();
    const message = Array.isArray(payload.message) ? payload.message[0] : payload.message;
    const error = new Error(message || 'Não foi possível enviar o arquivo.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

export const login = (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials });
export const register = (account) => apiRequest('/auth/register', { method: 'POST', body: account });
export const requestPasswordReset = (email) => apiRequest('/auth/password-reset/request', { method: 'POST', body: { email } });
export const confirmPasswordReset = (token, password) => apiRequest('/auth/password-reset/confirm', { method: 'POST', body: { token, password } });
export const getProfile = () => apiRequest('/auth/me');
export const getSessions = () => apiRequest('/auth/sessions');
export const revokeSession = (id) => apiRequest(`/auth/sessions/${encodeURIComponent(id)}`, { method:'DELETE' });
export const revokeOtherSessions = () => apiRequest('/auth/sessions', { method:'DELETE' });
export const requestEmailVerification = email => apiRequest('/auth/email-verification/request',{method:'POST',body:{email}});
export const confirmEmailVerification = token => apiRequest('/auth/email-verification/confirm',{method:'POST',body:{token}});
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
export const getWorkspaceBackups = () => apiRequest('/workspace/backups');
export const getWorkspaceBackupDiff = (id) => apiRequest(`/workspace/backups/${encodeURIComponent(id)}/diff`);
export const restoreWorkspaceBackup = (id) => apiRequest(`/workspace/backups/${encodeURIComponent(id)}/restore`, { method:'POST', timeout:20000 });
export const publishPage = (publication) => apiRequest('/publications', { method: 'POST', body: publication, timeout: 30000 });
export const getPublications = () => apiRequest('/publications');
export const deletePublication = (id) => apiRequest(`/publications/${id}`, { method: 'DELETE' });
export const verifyPublicationDomain = (id) => apiRequest(`/publications/${id}/verify-domain`, { method: 'PATCH', timeout: 20000 });
export const getNotifications = () => apiRequest('/notifications');
export const clearNotifications = () => apiRequest('/notifications', { method: 'DELETE' });
export const markNotificationRead = (id) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
export const markAllNotificationsRead = () => apiRequest('/notifications/read-all', { method: 'PATCH' });
export const getPlatformTemplates = () => apiRequest('/workspace/platform-templates');
export const getAnalyticsSummary = (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.pageId) query.set('pageId', filters.pageId);
  if (filters.from) query.set('from', filters.from);
  if (filters.to) query.set('to', filters.to);
  return apiRequest(`/analytics/summary${query.toString() ? `?${query}` : ''}`);
};
export const getPopupSubmissions = (pageId, page = 1) => apiRequest(`/analytics/popup-submissions?pageId=${encodeURIComponent(pageId)}&page=${page}`);
export const exportPopupSubmissions = pageId => apiRequest(`/analytics/popup-submissions/export?pageId=${encodeURIComponent(pageId)}`, { timeout: 30000 });
export const getAdminOverview = () => apiRequest('/admin/overview');
export const getAdminUsers = () => apiRequest('/admin/users');
export const getAdminPages = () => apiRequest('/admin/pages');
export const getAdminHistory = () => apiRequest('/admin/history');
export const createAdminAlert = (alert) => apiRequest('/admin/alerts', { method: 'POST', body: alert });
export const getAdminUserWorkspace = (userId) => apiRequest(`/admin/users/${userId}/workspace`);
export const restoreAdminBackup = (userId, backupId) => apiRequest(`/admin/users/${userId}/backups/${backupId}/restore`, { method: 'POST' });
export const updateAdminUserAccess = (userId, update) => apiRequest(`/admin/users/${encodeURIComponent(userId)}/access`, { method: 'PATCH', body: update });
export const revokeAdminUserSession = (userId, sessionId) => apiRequest(`/admin/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
export const revokeAdminUserSessions = userId => apiRequest(`/admin/users/${encodeURIComponent(userId)}/sessions`, { method: 'DELETE' });
export const getHostedVideos = () => apiRequest('/videos');
export const getHostedVideoUsage = () => apiRequest('/videos/usage');
export const uploadHostedVideo = (file, onProgress) => {
  const form = new FormData();
  form.append('video', file);
  if (!onProgress) return multipartRequest('/videos', form);
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `${API_BASE_URL}/videos`);
    const token = getAccessToken();
    if (token) request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.upload.onprogress = event => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => {
      let payload = {};
      try { payload = JSON.parse(request.responseText || '{}'); } catch { /* resposta inválida */ }
      if (request.status >= 200 && request.status < 300) return resolve(payload);
      if (request.status === 401 && token) clearAuthSession();
      const message = Array.isArray(payload.message) ? payload.message[0] : payload.message;
      const error = new Error(message || 'Não foi possível enviar o arquivo.');
      error.status = request.status;
      reject(error);
    };
    request.onerror = () => reject(new Error('Backend indisponível durante o upload.'));
    request.send(form);
  });
};
export const deleteHostedVideo = (id) => apiRequest(`/videos/${encodeURIComponent(id)}`, { method: 'DELETE' });
export const uploadHostedAsset = (file) => { const form = new FormData(); form.append('asset', file); return multipartRequest('/assets', form); };
export const getHostedAssets = () => apiRequest('/assets');
export const deleteHostedAsset = (id) => apiRequest(`/assets/${encodeURIComponent(id)}`, { method:'DELETE' });
export const getSupportTickets = () => apiRequest('/support/tickets');
export const createSupportTicket = (ticket) => apiRequest('/support/tickets', { method: 'POST', body: ticket });
export const resolveSupportTicket = (id) => apiRequest(`/support/tickets/${encodeURIComponent(id)}/resolve`, { method: 'PATCH' });
export const addSupportTicketMessage = (id, message) => apiRequest(`/support/tickets/${encodeURIComponent(id)}/messages`, { method: 'POST', body: { message } });
export const uploadSupportAttachment = (id, file) => { const form = new FormData(); form.append('attachment', file); return multipartRequest(`/support/tickets/${encodeURIComponent(id)}/attachments`, form); };
export async function downloadSupportAttachment(ticketId, attachment) {
  const response = await fetch(`${API_BASE_URL}/support/tickets/${encodeURIComponent(ticketId)}/attachments/${encodeURIComponent(attachment.id)}`, { headers:{ Authorization:`Bearer ${getAccessToken()}` } });
  if (!response.ok) throw new Error('Não foi possível baixar o anexo.');
  const url = URL.createObjectURL(await response.blob()); const link = document.createElement('a'); link.href=url; link.download=attachment.name; link.click(); URL.revokeObjectURL(url);
}
export const getAdminSupportTickets = () => apiRequest('/admin/support/tickets');
export const updateAdminSupportTicket = (id, update) => apiRequest(`/admin/support/tickets/${encodeURIComponent(id)}`, { method: 'POST', body: update });
export const getPlans = () => apiRequest('/billing/plans');
export const getSubscription = () => apiRequest('/billing/subscription');
export const requestPlanChange = (plan) => apiRequest('/billing/checkout', { method: 'POST', body: { plan } });
export const getAdminBillingRequests = () => apiRequest('/admin/billing/requests');
export const decideAdminBillingRequest = (id, status) => apiRequest(`/admin/billing/requests/${encodeURIComponent(id)}`, { method: 'POST', body: { status } });
export const getEmailContacts = (page=1,query='',status='all') => apiRequest(`/email/contacts?page=${page}&query=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}`);
export const createEmailContact = contact => apiRequest('/email/contacts',{method:'POST',body:contact});
export const updateEmailContact = (id,update) => apiRequest(`/email/contacts/${encodeURIComponent(id)}`,{method:'PATCH',body:update});
export const deleteEmailContact = id => apiRequest(`/email/contacts/${encodeURIComponent(id)}`,{method:'DELETE'});
export const getEmailCampaigns = () => apiRequest('/email/campaigns');
export const createEmailCampaign = campaign => apiRequest('/email/campaigns',{method:'POST',body:campaign,timeout:20000});
export const sendEmailCampaign = id => apiRequest(`/email/campaigns/${encodeURIComponent(id)}/send`,{method:'POST',timeout:60000});
export const exportPersonalData = () => apiRequest('/privacy/export',{timeout:30000});
export const deleteOwnAccount = password => apiRequest('/privacy/account',{method:'DELETE',body:{password},timeout:30000});

export { API_BASE_URL };
