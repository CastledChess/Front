import { Opening } from '@/types/opening.ts';

const worker = new Worker(new URL('../workers/opening.ts', import.meta.url), {
  type: 'module',
});

/**
 * Finds the opening based on the provided PGN string.
 * @param {string} pgn - The PGN (Portable Game Notation) string of the chess game.
 * @returns {Promise<Opening | undefined>} A promise that resolves to the opening or undefined if not found.
 */
export const findOpening = (pgn: string): Promise<Opening | undefined> =>
  new Promise<Opening | undefined>((resolve) => {
    worker.onmessage = (message: MessageEvent) => {
      if (message.data.error) resolve(undefined);
      resolve(message.data.result as Opening);
    };

    worker.postMessage({ pgn });
  });
