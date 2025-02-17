import { AnalysisMoveClassification } from '@/types/analysis.ts';

export const descriptions: Record<AnalysisMoveClassification, string[]> = {
  [AnalysisMoveClassification.None]: [],
  [AnalysisMoveClassification.Blunder]: [
    '{x} is a blunder. The best move was {y}.',
    '{x} is a huge mistake. A better move was {y}.',
  ],
  [AnalysisMoveClassification.Mistake]: [
    '{x} is a mistake. The best move was {y}.',
    '{x} is a bad move. A better move was {y}.',
  ],
  [AnalysisMoveClassification.Inaccuracy]: [
    '{x} is an inaccuracy. The best move was {y}.',
    '{x} is a slight mistake. A better move was {y}.',
  ],
  [AnalysisMoveClassification.Good]: ['{x} is a decent but not the best move.'],
  [AnalysisMoveClassification.Excellent]: ['{x} is an excellent move.', '{x} is a great move.'],
  [AnalysisMoveClassification.Best]: ['{x} is the best move. Well done!', '{x} is the optimal move.'],
  [AnalysisMoveClassification.Brilliant]: [],
};
