import { z } from 'zod';
import { AnalysisMove, AnalysisMoveClassification, SearchResults } from '@/types/analysis.ts';
import { StartAnalysisFormSchema } from '@/schema/analysis.ts';
import { Move } from 'chess.js';

export const analyseMove = (
  fen: string,
  move: Move,
  data: z.infer<typeof StartAnalysisFormSchema>,
  reportProgress: () => void,
): Promise<AnalysisMove> =>
  new Promise<AnalysisMove>((resolve) => {
    try {
      const socket = new WebSocket('wss://chess-api.com/v1');

      const variantResults: SearchResults[] = [];
      let timeout: NodeJS.Timeout;

      socket.addEventListener('open', () => {
        timeout = setTimeout(() => {
          socket.close();
          reportProgress();
          resolve({
            move,
            fen,
            engineResults: variantResults,
          });
        }, 1000);

        socket.send(
          JSON.stringify({
            variants: data.variants,
            maxThinkingTime: 100,
            depth: data.engineDepth,
            fen,
          }),
        );
      });

      socket.addEventListener('message', (event) => {
        const resultData = JSON.parse(event.data);

        if (['info', 'log'].includes(resultData.type)) return;
        if (resultData.depth < data.engineDepth) return;

        variantResults.push(resultData as SearchResults);

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          socket.close();
          reportProgress();
          resolve({
            move,
            fen,
            engineResults: variantResults,
          });
        }, 1000);
      });
    } catch (error) {
      console.error(error);

      resolve({
        move,
        fen,
        engineResults: [],
      });
    }
  });

export const classifyMoves = (moves: AnalysisMove[]): AnalysisMove[] => {
  return classifyRegular(moves);
};

export const classifyRegular = (moves: AnalysisMove[]) => {
  moves = moves.map((move: AnalysisMove, index: number) => {
    if (index == 0) return { ...move, classification: AnalysisMoveClassification.None };

    const previousWinChancePercent = moves[index - 1].engineResults?.[0]?.winChance;
    const currentWinChancePercent = move.engineResults?.[0]?.winChance;

    if (!previousWinChancePercent || !currentWinChancePercent)
      return { ...move, classification: AnalysisMoveClassification.None };

    const winChanceDelta = Math.round(currentWinChancePercent - previousWinChancePercent) / 100;

    let classification = AnalysisMoveClassification.None;

    if (winChanceDelta === 0.0) classification = AnalysisMoveClassification.Best;
    else if (winChanceDelta > 0.0 && winChanceDelta <= 0.02) classification = AnalysisMoveClassification.Excellent;
    else if (winChanceDelta > 0.02 && winChanceDelta <= 0.05) classification = AnalysisMoveClassification.Good;
    else if (winChanceDelta > 0.05 && winChanceDelta <= 0.1) classification = AnalysisMoveClassification.Inaccuracy;
    else if (winChanceDelta > 0.1 && winChanceDelta <= 0.2) classification = AnalysisMoveClassification.Mistake;
    else if (winChanceDelta > 0.2 && winChanceDelta <= 1) classification = AnalysisMoveClassification.Blunder;

    return { ...move, classification };
  });

  return moves;
};
