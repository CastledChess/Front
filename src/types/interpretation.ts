import { Piece, Square } from 'chess.js';

export type SquareWeights = {
  [K in Square]: { attacked: number; controlledWhite: number; controlledBlack: number; defended: number };
};

export interface PieceRole {
  type: RoleType;
}

export interface SupportsPieceRole extends PieceRole {
  type: RoleType.SupportsPiece;
  fromPiece: Piece;
  toPiece: Piece;
  toSquare: Square;
  fromSquare: Square;
  reason: { type: Reason; square: Square; piece: Piece };
}

export interface XRaysPieceRole {
  type: RoleType.XRaysPiece;
  fromPiece: Piece;
  toPiece: Piece;
  toSquare: Square;
  fromSquare: Square;
}

export type AllPieceRoles = SupportsPieceRole | XRaysPieceRole;
export type PieceRolesRecord = Record<Square, AllPieceRoles[]>;

export type PieceRoles = {
  squareWeights: SquareWeights;
  roles: PieceRolesRecord;
};

export enum Reason {
  Attacked = 'Attacked',
  XRayed = 'XRayed',
}

export enum RoleType {
  SupportsPiece = 'SupportsPiece',
  XRaysPiece = 'XRaysPiece',
}
