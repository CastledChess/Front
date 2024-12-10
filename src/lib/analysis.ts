import { z } from 'zod';
import { AnalysisMove, AnalysisMoveClassification, InfoResult } from '@/types/analysis.ts';
import { StartAnalysisFormSchema } from '@/schema/analysis.ts';
import { Chess, Move } from 'chess.js';
import { StockfishService } from '@/services/stockfish/stockfish.service.ts';
import { UciParserService } from '@/services/stockfish/uci-parser.service.ts';
import { isCached } from '@/services/cache/cache.service.ts';

export type AnalyseMovesLocalParams = {
  moves: { move: Move; fen: string }[];
  data: z.infer<typeof StartAnalysisFormSchema>;
  reportProgress: () => void;
};

export type Engine = {
  isMultiThreaded: boolean;
  name: string;
  value: string;
  cache: string;
};

export const Engines: Engine[] = [
  {
    isMultiThreaded: true,
    name: 'Stockfish 16.1 Large Multi-Threaded',
    value: 'stockfish-16.1.js',
    cache: 'stockfish-16.1.wasm',
  },
  {
    isMultiThreaded: false,
    name: 'Stockfish 16.1 Large Single-Threaded',
    value: 'stockfish-16.1-single.js',
    cache: 'stockfish-16.1-single.wasm',
  },
  {
    isMultiThreaded: true,
    name: 'Stockfish 16.1 Lite Multi-Threaded',
    value: 'stockfish-16.1-lite.js',
    cache: 'stockfish-16.1-lite.wasm',
  },
  {
    isMultiThreaded: false,
    name: 'Stockfish 16.1 Lite Single-Threaded',
    value: 'stockfish-16.1-lite-single.js',
    cache: 'stockfish-16.1-lite-single.wasm',
  },
];

export const getCachedEngines = async () => {
  const cachedEngines: Engine[] = [];

  for (const engine of Engines) {
    const isCachedWasm = await isCached('engine-cache', engine.cache);

    if (isCachedWasm) cachedEngines.push(engine);
  }

  return cachedEngines;
};

export const analyseMovesLocal = ({
  moves,
  data,
  reportProgress,
}: AnalyseMovesLocalParams): Promise<AnalysisMove>[] => {
  const stockfish = new StockfishService({ engine: data.engine, threads: data.threads });
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
  );
};

export const classifyMoves = (moves: AnalysisMove[]): AnalysisMove[] => {
  return moves.map(classifyRegular);
};

export const classifyRegular = (move: AnalysisMove, index: number, moves: AnalysisMove[]) => {
  const next = moves[index + 1]?.engineResults.sort((a, b) => b.depth! - a.depth!)?.[0];
  const current = move?.engineResults.sort((a, b) => b.depth! - a.depth!)?.[0];

  if (!next || !current) return { ...move, classification: AnalysisMoveClassification.None };

  if (current.mate)
    return {
      ...move,
      classification: classifyWithMate(move.move, current.move, next.mate || current.mate, current.mate),
    };
  else
    return {
      ...move,
      classification: classifyWithWinChance(move.move, current.move, next.winChance!, current.winChance!),
    };
};

const classifyWithMate = (
  move: Move,
  nextMove: string | undefined,
  next: number,
  current: number,
): AnalysisMoveClassification => {
  if (next === null || current === null) return AnalysisMoveClassification.None;

  const mateDelta = next - current - 1;

  let classification = AnalysisMoveClassification.None;

  const numMoves = new Chess(move.before).moves().length;

  if (numMoves <= 1) classification = AnalysisMoveClassification.Forced;
  else if (mateDelta <= 0 || move.from + move.to === nextMove) classification = AnalysisMoveClassification.Best;
  else if (mateDelta === 1) classification = AnalysisMoveClassification.Excellent;
  else if (mateDelta === 2) classification = AnalysisMoveClassification.Good;
  else if (mateDelta === 3) classification = AnalysisMoveClassification.Inaccuracy;
  else if (mateDelta === 4) classification = AnalysisMoveClassification.Mistake;
  else if (mateDelta >= 5) classification = AnalysisMoveClassification.Blunder;

  return classification;
};

const classifyWithWinChance = (
  move: Move,
  nextMove: string | undefined,
  next: number,
  current: number,
): AnalysisMoveClassification => {
  if (!next || !current) return AnalysisMoveClassification.None;

  const winChanceDelta = Math.abs((current - next) / 100);

  let classification = AnalysisMoveClassification.None;

  const numMoves = new Chess(move.before).moves().length;

  if (numMoves <= 1) classification = AnalysisMoveClassification.Forced;
  else if (winChanceDelta <= 0.0 || move.from + move.to === nextMove) classification = AnalysisMoveClassification.Best;
  else if (winChanceDelta > 0.0 && winChanceDelta <= 0.02) classification = AnalysisMoveClassification.Excellent;
  else if (winChanceDelta > 0.02 && winChanceDelta <= 0.05) classification = AnalysisMoveClassification.Good;
  else if (winChanceDelta > 0.05 && winChanceDelta <= 0.1) classification = AnalysisMoveClassification.Inaccuracy;
  else if (winChanceDelta > 0.1 && winChanceDelta <= 0.2) classification = AnalysisMoveClassification.Mistake;
  else if (winChanceDelta > 0.2 && winChanceDelta <= 1) classification = AnalysisMoveClassification.Blunder;

  return classification;
};
