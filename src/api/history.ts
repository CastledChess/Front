import { apiAuthenticated } from './index';

/**
 * Fetches the analysis history for the authenticated user.
 *
 * @returns {Promise<any[]>} - A promise that resolves to an array of analysis history items.
 * @throws {Promise<string>} - A promise that rejects with an error message if no access token is available.
 */
export const getHistory = async () => {
  const data = await apiAuthenticated.get('/api/v1/analysis');

  return data.data.items;
};

/**
 * Fetches a specific game analysis by its ID.
 *
 * @param {string} id - The ID of the game analysis to fetch.
 * @returns {Promise<any>} - A promise that resolves to the game analysis data.
 * @throws {Promise<string>} - A promise that rejects with an error message if no access token is available.
 */
export const getGame = async (id: string) => {
  const data = await apiAuthenticated.get(`/api/v1/analysis/${id}`);

  return data.data;
};

/**
 * Deletes a specific game analysis by its ID.
 *
 * @param {string} id - The ID of the game analysis to delete.
 * @returns {Promise<void>} - A promise that resolves when the game analysis is deleted.
 * @throws {Promise<string>} - A promise that rejects with an error message if no access token is available.
 */
export const deleteGame = async (id: string) => {
  await apiAuthenticated.delete(`/api/v1/analysis/${id}/delete`);
};
