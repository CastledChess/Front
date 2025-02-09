import { Move } from 'chess.js';

export type Analysis = {
  id?: string;
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
  pv: string[];
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
