import { api } from './index';
import { useAuthStore } from '@/store/auth.ts';

export const getHistory = async () => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    return Promise.reject('No access token available');
  }

  const data = await api.get('/api/v1/analysis', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.data.items;
};
