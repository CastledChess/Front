import { api } from './index';
import { RegisterSchema, LoginResponseSchema, LoginSchema } from '@/schema/auth.ts';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.ts';

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const loginCall = await api.post('/api/v1/auth/login', data);

  const { accessToken, refreshToken, user } = LoginResponseSchema.parse(loginCall.data);

  useAuthStore.getState().setAccessToken(accessToken);
  useAuthStore.getState().setRefreshToken(refreshToken);
  useAuthStore.getState().setUser(user);
};

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const registerCall = await api.post('/api/v1/auth/register', data);

  if (registerCall.status !== 201) {
    return console.error('Failed to register', registerCall);
  }

  const { accessToken, refreshToken, user } = LoginResponseSchema.parse(registerCall.data);

  useAuthStore.getState().setAccessToken(accessToken);
  useAuthStore.getState().setRefreshToken(refreshToken);
  useAuthStore.getState().setUser(user);
};

export const refreshTokens = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    return Promise.reject('No refresh token available');
  }

  return api.post('/api/v1/auth/refresh', { refreshToken });
};
