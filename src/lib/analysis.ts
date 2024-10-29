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
  const classifiedMoves: AnalysisMove[] = [
    {
      ...moves[0],
      classification: AnalysisMoveClassification.Good,
    },
  ];

  for (let i = 1; i < moves.length; i++) {
    const currentResult = moves[i].engineResults[0];
    const previousResult = moves[i - 1].engineResults[0];

    if (!currentResult || !previousResult) {
      classifiedMoves.push({
        ...moves[i],
        classification: AnalysisMoveClassification.Good,
      });
      continue;
    }

    const winChanceDelta =
      currentResult.color === 'white'
        ? previousResult.winChance - currentResult.winChance
        : currentResult.winChance - previousResult.winChance;

    let classification: AnalysisMoveClassification;

    if (winChanceDelta < -15) classification = AnalysisMoveClassification.Blunder;
    else if (winChanceDelta < -10) classification = AnalysisMoveClassification.Mistake;
    else if (winChanceDelta < -5) classification = AnalysisMoveClassification.Inaccuracy;
    else if (winChanceDelta < 10) classification = AnalysisMoveClassification.None;
    else if (winChanceDelta > 10 && winChanceDelta < 40) classification = AnalysisMoveClassification.Good;
    else classification = AnalysisMoveClassification.Brilliant;

    classifiedMoves.push({
      ...moves[i],
      classification,
    });
  }

  return classifiedMoves;
};
