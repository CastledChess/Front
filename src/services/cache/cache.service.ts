export const isCached = async (key: string, url: string): Promise<boolean> => {
  const cache = await caches.open(key);
  const cachedResponse = await cache.match(url);

  return cachedResponse !== undefined;
};
