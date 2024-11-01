import { api } from './index';

export const login = async (email: string, password: string) =>
  await api.post('/api/v1/auth/login', {
    email,
    password,
  });

export const register = async (email: string, username: string, password: string, confirmPassword: string) =>
  await api.post('/api/v1/auth/register', {
    email,
    username,
    password,
    confirmPassword,
  });
