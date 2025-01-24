import { api } from '.';
import { Analysis } from '@/types/analysis.ts';
import { useAuthStore } from '@/store/auth.ts';

/**
 * Creates a new analysis by sending a POST request to the API.
 * @param {Analysis} analysis - The analysis data to be created.
 * @returns {Promise<any>} A promise that resolves to the response of the API call.
 */
export const createAnalysis = async (analysis: Analysis) => {
  const token = useAuthStore.getState().accessToken;

  return await api.post(`/api/v1/analysis`, analysis, { headers: { Authorization: `Bearer ${token}` } });
};

/**
 * Retrieves an analysis by its ID by sending a GET request to the API.
 * @param {string} id - The ID of the analysis to retrieve.
 * @returns {Promise<any>} A promise that resolves to the response of the API call.
 */
export const getAnalysisById = async (id: string) => {
  const token = useAuthStore.getState().accessToken;

  return await api.get(`/api/v1/analysis/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};
