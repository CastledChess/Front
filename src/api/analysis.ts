import { api } from '.';
import { Analysis } from '@/types/analysis.ts';
import { useAuthStore } from '@/store/auth.ts';

export const createAnalysis = async (analysis: Analysis) => {
  const token = useAuthStore.getState().accessToken;

  return await api.post(`/api/v1/analysis`, analysis, { headers: { Authorization: `Bearer ${token}` } });
};

export const getAnalysisById = async (id: string) => {
  const token = useAuthStore.getState().accessToken;

  return await api.get(`/api/v1/analysis/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};
