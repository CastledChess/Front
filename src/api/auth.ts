import { api } from './index';
import { RegisterSchema, LoginResponseSchema, LoginSchema } from '@/schema/auth.ts';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.ts';

/**
 * Logs in a user by sending a POST request to the API.
 * @param {z.infer<typeof LoginSchema>} data - The login data to be sent to the API.
 * @returns {Promise<void>} A promise that resolves when the login process is complete.
 */
export const login = async (data: z.infer<typeof LoginSchema>) => {
  const loginCall = await api.post('/api/v1/auth/login', data);

  const { accessToken, refreshToken, user } = LoginResponseSchema.parse(loginCall.data);

  useAuthStore.getState().setAccessToken(accessToken);
  useAuthStore.getState().setRefreshToken(refreshToken);
  useAuthStore.getState().setUser(user);
};

/**
 * Registers a new user by sending a POST request to the API.
 * @param {z.infer<typeof RegisterSchema>} data - The registration data to be sent to the API.
 * @returns {Promise<void>} A promise that resolves when the registration process is complete.
 */
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

/**
 * Refreshes the authentication tokens by sending a POST request to the API.
 * @returns {Promise<any>} A promise that resolves to the response of the API call.
 */
export const refreshTokens = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    return Promise.reject('No refresh token available');
  }

  return api.post('/api/v1/auth/refresh', { refreshToken });
};
