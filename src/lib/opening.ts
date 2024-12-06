import { Opening } from '@/types/opening.ts';

const worker = new Worker(new URL('../workers/opening.ts', import.meta.url), {
  type: 'module',
});

export const findOpening = (pgn: string): Promise<Opening | undefined> =>
  new Promise<Opening | undefined>((resolve) => {
    worker.onmessage = (message: MessageEvent) => {
      if (message.data.error) resolve(undefined);
      resolve(message.data.result as Opening);
    };

    worker.postMessage({ pgn });
  });
