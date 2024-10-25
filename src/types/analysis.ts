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