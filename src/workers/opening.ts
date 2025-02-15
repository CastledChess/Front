import { Chess } from 'chess.js';
import { Opening } from '@/types/opening.ts';
import openingsJson from '@/assets/data/openings/all.json';

const openings: Record<string, Opening> = openingsJson;

/**
 * Handles incoming messages and finds the opening name based on the provided PGN.
 * @param {MessageEvent} message - The message event containing the PGN data.
 */
self.onmessage = (message) => findOpeningName(message.data.pgn);

/**
 * Finds the name of the opening based on the provided PGN string.
 * @param {string} pgn - The PGN (Portable Game Notation) string of the chess game.
 */
const findOpeningName = (pgn: string) => {
  if (!pgn) return;

  const chessClone = new Chess();
  let opening: Opening | undefined;

  try {
    chessClone.loadPgn(pgn);

    // Traverse the moves backwards to find the opening
    while (!(opening = openings[chessClone.fen().split(' ')[0]])) {
      if (!chessClone.undo()) break;
    }

    self.postMessage({ result: opening });
  } catch (error) {
    self.postMessage({ error: error });
  }
};
