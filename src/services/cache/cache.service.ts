/**
 * Checks if a given URL is cached under a specific cache key.
 *
 * @param {string} key - The cache key to open.
 * @param {string} url - The URL to check in the cache.
 * @returns {Promise<boolean>} - A promise that resolves to true if the URL is cached, otherwise false.
 */
export const isCached = async (key: string, url: string): Promise<boolean> => {
  const cache = await caches.open(key);
  const cachedResponse = await cache.match(url);

  return cachedResponse !== undefined;
};
