import axios from 'axios';
import { useAuthStore } from '@/store/auth.ts';
import { refreshTokens } from '@/api/auth.ts';
// import { useAuthStore } from '@/store/auth.ts';
// import { refreshTokens } from '@/api/auth.ts';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (request) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) request.headers['Authorization'] = `Bearer ${accessToken}`;

    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await refreshTokens();
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        useAuthStore.getState().setAccessToken(accessToken as string);
        useAuthStore.getState().setRefreshToken(newRefreshToken as string);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        useAuthStore.getState().logout();

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
