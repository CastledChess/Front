import { z } from 'zod';
import { AnalysisMove, AnalysisMoveClassification, InfoResult } from '@/types/analysis.ts';
import { StartAnalysisFormSchema } from '@/schema/analysis.ts';
import { Move } from 'chess.js';
import { StockfishService } from '@/services/stockfish/stockfish.service.ts';
import { UciParserService } from '@/services/stockfish/uci-parser.service.ts';

export const analyseMovesLocal = (moves: { move: Move; fen: string }[], reportProgress: () => void) => {
  const stockfish = new StockfishService();
  const parser = new UciParserService();

  return moves.map(
    async ({ move, fen }) =>
      await new Promise((resolve) => {
        const variantResults: InfoResult[] = [];

        stockfish.pushCommand({
          command: `position fen ${fen}`,
        });

        stockfish.pushCommand({
          command: `go movetime 100`,
          callback: (data) => {
            const result = parser.parse(data, move.color === 'w');

            if (!result) return;

            if (result.type === 'bestmove') {
              reportProgress();

              resolve({
                move,
                fen,
                engineResults: variantResults,
              });

              return;
            }

            if (result.type === 'info') variantResults.push(result as InfoResult);
          },
        });
      }),
  ) as Promise<AnalysisMove>[];
};

export const analyseMove = (
  fen: string,
  move: Move,
  data: z.infer<typeof StartAnalysisFormSchema>,
  reportProgress: () => void,
) => {
  return new Promise<AnalysisMove>((resolve) => {
    const socket = new WebSocket('wss://chess-api.com/v1');
    const variantResults: InfoResult[] = [];
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

      const resultData = data as InfoResult;

      variantResults.push(resultData);
    });
  });
};

export const classifyMoves = (moves: AnalysisMove[]): AnalysisMove[] => {
  return moves.map(classifyRegular);
};

export const classifyRegular = (move: AnalysisMove, index: number, moves: AnalysisMove[]) => {
  const previous = move.engineResults.sort((a, b) => b.depth! - a.depth!)?.[0];
  const current = moves[index + 1]?.engineResults.sort((a, b) => b.depth! - a.depth!)?.[0];

  if (!previous || !current) return { ...move, classification: AnalysisMoveClassification.None };

  console.log(move);

  if (current.mate) return { ...move, classification: classifyWithMate(previous.mate || current.mate, current.mate) };
  else return { ...move, classification: classifyWithWinChance(previous.winChance!, current.winChance!) };
};

const classifyWithMate = (prev: number, current: number): AnalysisMoveClassification => {
  if (prev === null || current === null) return AnalysisMoveClassification.None;

  const mateDelta = current - prev;

  let classification = AnalysisMoveClassification.None;

  if (mateDelta <= 0) classification = AnalysisMoveClassification.Best;
  else if (mateDelta === 1) classification = AnalysisMoveClassification.Excellent;
  else if (mateDelta === 2) classification = AnalysisMoveClassification.Good;
  else if (mateDelta === 3) classification = AnalysisMoveClassification.Inaccuracy;
  else if (mateDelta === 4) classification = AnalysisMoveClassification.Mistake;
  else if (mateDelta >= 5) classification = AnalysisMoveClassification.Blunder;

  return classification;
};

const classifyWithWinChance = (prev: number, current: number): AnalysisMoveClassification => {
  if (!prev || !current) return AnalysisMoveClassification.None;

  const winChanceDelta = Math.abs((current - prev) / 100);

  let classification = AnalysisMoveClassification.None;

  if (winChanceDelta <= 0.0) classification = AnalysisMoveClassification.Best;
  else if (winChanceDelta > 0.0 && winChanceDelta <= 0.02) classification = AnalysisMoveClassification.Excellent;
  else if (winChanceDelta > 0.02 && winChanceDelta <= 0.05) classification = AnalysisMoveClassification.Good;
  else if (winChanceDelta > 0.05 && winChanceDelta <= 0.1) classification = AnalysisMoveClassification.Inaccuracy;
  else if (winChanceDelta > 0.1 && winChanceDelta <= 0.2) classification = AnalysisMoveClassification.Mistake;
  else if (winChanceDelta > 0.2 && winChanceDelta <= 1) classification = AnalysisMoveClassification.Blunder;

  return classification;
};
