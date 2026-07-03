import axios from 'axios';

// Production backend: the SellPilot Supabase Edge Function. The anon key is
// Supabase's publishable client key (safe to embed); it only satisfies the
// platform gateway — app auth is our own JWT sent in x-sp-token.
const SUPABASE_FUNCTIONS_ORIGIN = 'https://vevwlaavvxftnuwmnbwz.supabase.co/functions/v1';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldndsYWF2dnhmdG51d21uYnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNDE1ODQsImV4cCI6MjA5ODYxNzU4NH0.zoD3UbLNQ8mMNgwa2ElhtMYOU-uAeg7vZElXCfjYFCY';

// Dev: empty origin -> Vite proxies /api to the local Express backend.
// Override either mode with VITE_API_URL.
export const API_ORIGIN = (
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? SUPABASE_FUNCTIONS_ORIGIN : '')
).replace(/\/$/, '');

const isSupabase = API_ORIGIN.includes('.supabase.co');

export const api = axios.create({ baseURL: `${API_ORIGIN}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_token');
  if (isSupabase) {
    config.headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
    if (token) config.headers['x-sp-token'] = token;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
