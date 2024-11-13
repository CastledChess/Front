import { Move } from 'chess.js';

export type SearchResults = {
  captured: boolean;
  centipawns: string;
  color: string;
  continuation: Continuation[];
  continuationArr: string[];
  debug: string;
  depth: number;
  eval: number;
  fen: string;
  flags: string;
  from: string;
  fromNumeric: string;
  isCapture: boolean;
  isCastling: boolean;
  isPromotion: boolean;
  lan: string;
  mate: boolean;
  move: string;
  piece: string;
  promotion: false;
  san: string;
  taskId: string;
  text: string;
  to: string;
  toNumeric: string;
  turn: string;
  type: string;
  winChance: number;
};

export type Continuation = {
  from: string;
  to: string;
  fromNumeric: string;
  toNumeric: string;
};

export type Analysis = {
  pgn: string;
  variants: number;
  header: Record<string, string>;
  moves: AnalysisMove[];
};

export type AnalysisMove = {
  move: Move;
  fen: string;
  engineResults: InfoResult[];
  classification?: AnalysisMoveClassification;
};

export type InfoResult = {
  type: 'info';
  depth?: number;
  selDepth?: number;
  eval?: number;
  centiPawns?: number;
  winChance?: number;
  mate?: number;
  move?: string;
  from?: string;
  to?: string;
};

export enum AnalysisMoveClassification {
  Brilliant = 'Brilliant',
  Good = 'Good',
  Inaccuracy = 'Inaccuracy',
  Mistake = 'Mistake',
  Blunder = 'Blunder',
  None = 'None',
  Best = 'Best',
  Excellent = 'Excellent',
}
