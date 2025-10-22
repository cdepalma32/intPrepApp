import axios from 'axios';
import { authBridge } from '@/context/authBridge';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // safe to keep on; helps if you move to cookie refresh
});

let isRefreshing = null;      // Promise<string|null> | null
let waiters = [];             // queued resolvers

function flushWaiters(token) {
  waiters.forEach((resolve) => resolve(token));
  waiters = [];
}

api.interceptors.request.use((config) => {
  const at = authBridge.getAccessToken();
  if (at) {
    config.headers.Authorization = `Bearer ${at}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error || {};
    const is401 = response?.status === 401;
    const alreadyRetried = config?._retried;
    const isRefreshCall = config?.url?.includes('/users/refresh');

    if (!is401 || alreadyRetried || isRefreshCall) {
      return Promise.reject(error);
    }

    // No refresh token → logout
    const rt = localStorage.getItem('refreshToken');
    if (!rt) {
      authBridge.clear();
      window.location.assign('/login');
      return Promise.reject(error);
    }

    // Single-flight refresh
    if (!isRefreshing) {
      isRefreshing = (async () => {
        try {
          const r = await axios.post(
            '/api/users/refresh',
            { refreshToken: rt },
            { withCredentials: true }
          );
          const { accessToken, refreshToken } = r.data || {};
          if (!accessToken) throw new Error('No access token returned');
          authBridge.setAccessToken(accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
          return accessToken;
        } catch {
          return null;
        } finally {
          // We resolve waiters after this promise settles
        }
      })();
    }

    const newToken = await new Promise((resolve) => {
      waiters.push(resolve);
      isRefreshing.finally(async () => {
        const token = await isRefreshing.catch(() => null);
        flushWaiters(token);
        isRefreshing = null;
      });
    });

    if (!newToken) {
      authBridge.clear();
      localStorage.removeItem('refreshToken');
      window.location.assign('/login'); 
      return Promise.reject(error);
    }

    // Retry once with fresh token
    config._retried = true;
    config.headers.Authorization = `Bearer ${newToken}`;
    return api.request(config);
  }
);

export default api;
