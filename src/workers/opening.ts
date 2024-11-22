import { Chess } from 'chess.js';
import { Opening } from '@/types/opening.ts';
import openingsJson from '@/assets/data/openings/all.json';

const openings: Record<string, Opening> = openingsJson;

self.onmessage = (message) => findOpeningName(message.data.pgn);

const findOpeningName = (pgn: string) => {
  if (!pgn) return;

  const chessClone = new Chess();
  let opening: Opening | undefined;

  try {
    chessClone.loadPgn(pgn);

    while (!(opening = openings[chessClone.fen().split(' ')[0]])) {
      if (!chessClone.undo()) break;
    }

    self.postMessage({ result: opening });
  } catch (error) {
    self.postMessage({ error: error });
  }
};
