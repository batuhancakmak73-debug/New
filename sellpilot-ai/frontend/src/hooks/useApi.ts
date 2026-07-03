import axios from 'axios';

// In dev the Vite proxy forwards /api to localhost:3001. In production
// (e.g. frontend on Vercel, backend on Render) set VITE_API_URL to the
// backend origin, like https://sellpilot-backend.onrender.com
export const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const api = axios.create({ baseURL: `${API_ORIGIN}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/')) {
      localStorage.removeItem('sp_token');
      localStorage.removeItem('sp_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export function apiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || err.message;
  }
  return err instanceof Error ? err.message : 'Something went wrong';
}

export function useApi() {
  return api;
}
