import { Color } from 'chess.js';

export const toPieceNotation = (move: string, color: Color): string => {
  if (color === 'w') {
    move = move.replace('N', '♞');
    move = move.replace('B', '♝');
    move = move.replace('R', '♜');
    move = move.replace('Q', '♛');
    move = move.replace('K', '♚');
    move = move.replace('P', '♟');

    return move;
  }

  move = move.replace('N', '♘');
  move = move.replace('B', '♗');
  move = move.replace('R', '♖');
  move = move.replace('Q', '♕');
  move = move.replace('K', '♔');
  move = move.replace('P', '♙');

  return move;
};
