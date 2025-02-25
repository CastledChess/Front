import { apiAuthenticated } from '@/api/index.ts';

export const queryPosition = async (fen: string) => {
  return await apiAuthenticated.get(`/api/v1/elitedb?fen=${fen}`);
};
