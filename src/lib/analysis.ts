import { z } from 'zod';
import { AnalysisMove, AnalysisMoveClassification, SearchResults } from '@/types/analysis.ts';
import { StartAnalysisFormSchema } from '@/schema/analysis.ts';
import { Move } from 'chess.js';

export const analyseMove = (
  fen: string,
  move: Move,
  data: z.infer<typeof StartAnalysisFormSchema>,
  reportProgress: () => void,
) => {
  return new Promise<AnalysisMove>((resolve) => {
    const socket = new WebSocket('wss://chess-api.com/v1');
    const variantResults: SearchResults[] = [];
    let timeout: NodeJS.Timeout;

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          variants: data.variants,
          maxThinkingTime: 100,
          depth: data.engineDepth,
          fen,
        }),
      );

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        socket.close();
        reportProgress();
        resolve({
          move,
          fen,
          engineResults: variantResults,
        });
      }, 2000);
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (['info', 'log'].includes(data.type)) return;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        socket.close();
        reportProgress();
        resolve({
          move,
          fen,
          engineResults: variantResults,
        });
      }, 2000);

      const resultData = data as SearchResults;

      variantResults.push(resultData);
    });
  });
};

export const classifyMoves = (moves: AnalysisMove[]): AnalysisMove[] => {
  return moves.map(classifyRegular);
};

export const classifyRegular = (move: AnalysisMove, index: number, moves: AnalysisMove[]) => {
  const previousWinChance = move.engineResults.sort((a, b) => b.depth - a.depth)?.[0]?.winChance;
  const currentWinChance = moves[index + 1]?.engineResults.sort((a, b) => b.depth - a.depth)?.[0]?.winChance;

  if (!previousWinChance || !currentWinChance) return { ...move, classification: AnalysisMoveClassification.None };

  const winChanceDelta = (currentWinChance - previousWinChance) / 100;

  let classification = AnalysisMoveClassification.None;

  if (winChanceDelta <= 0.0) classification = AnalysisMoveClassification.Best;
  else if (winChanceDelta > 0.0 && winChanceDelta <= 0.02) classification = AnalysisMoveClassification.Excellent;
  else if (winChanceDelta > 0.02 && winChanceDelta <= 0.05) classification = AnalysisMoveClassification.Good;
  else if (winChanceDelta > 0.05 && winChanceDelta <= 0.1) classification = AnalysisMoveClassification.Inaccuracy;
  else if (winChanceDelta > 0.1 && winChanceDelta <= 0.2) classification = AnalysisMoveClassification.Mistake;
  else if (winChanceDelta > 0.2 && winChanceDelta <= 1) classification = AnalysisMoveClassification.Blunder;

  return { ...move, classification };
};
