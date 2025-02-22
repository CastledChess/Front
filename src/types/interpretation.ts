import { PieceSymbol, Square } from 'chess.js';

export type SquareWeights = {
  [K in Square]: { attacked: number; controlled: number; defended: number };
};

export type MoveEffect = { square: Square; piece: PieceSymbol; color: string; type: CommentType };

export type MoveEffects = {
  squareWeights: SquareWeights;
  effects: MoveEffect[];
};

export enum CommentType {
  AttackUndefendedPiece,
  ReinforcesPiece,
}
