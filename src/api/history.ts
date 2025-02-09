import { apiAuthenticated } from './index';
import { useAuthStore } from '@/store/auth.ts';

export const getHistory = async () => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    return Promise.reject('No access token available');
  }

  const data = await apiAuthenticated.get('/api/v1/analysis', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.data.items;
};

export const getGame = async (id: string) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    return Promise.reject('No access token available');
  }

  const data = await apiAuthenticated.get(`/api/v1/analysis/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.data;
};

export const deleteGame = async (id: string) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    return Promise.reject('No access token available');
  }

  await apiAuthenticated.delete(`/api/v1/analysis/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
