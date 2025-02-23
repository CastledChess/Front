import { Move, PieceSymbol, Square } from 'chess.js';

export type SquareWeights = {
  [K in Square]: { attacked: number; controlledWhite: number; controlledBlack: number; defended: number };
};

export type MoveEffect = { piece: PieceSymbol; color: string; move: Move; square: Square; type: CommentType };

export type MoveEffects = {
  squareWeights: SquareWeights;
  effects: MoveEffect[];
};

export enum CommentType {
  AttackUndefendedPiece = 'AttackUndefendedPiece',
  ReinforcesPiece = 'ReinforcesPiece',
  ControlsCenter = 'ControlsCenter',
}
