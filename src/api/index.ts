import axios from 'axios';
import { useAuthStore } from '@/store/auth.ts';
import { refreshTokens } from '@/api/auth.ts';

export const apiAuthenticated = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiAuthenticated.interceptors.request.use(
  (request) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) request.headers['Authorization'] = `Bearer ${accessToken}`;

    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiAuthenticated.interceptors.response.use(
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

        apiAuthenticated.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        return apiAuthenticated(originalRequest);
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
