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

/**
 * Retrieves the cached engines.
 * @returns {Promise<Engine[]>} A promise that resolves to an array of cached engines.
 */
export const getCachedEngines = async () => {
  const cachedEngines: Engine[] = [];

  for (const engine of Engines) {
    const isCachedWasm = await isCached('engine-cache', engine.cache);

    if (isCachedWasm) cachedEngines.push(engine);
  }

  return cachedEngines;
};

/**
 * Analyzes the moves locally using the Stockfish engine.
 * @param {AnalyseMovesLocalParams} params - The parameters for analyzing moves.
 * @returns {Promise<AnalysisMove>[]} An array of promises that resolve to analysis moves.
 */
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

/**
 * Classifies the moves based on the analysis results.
 * @param {AnalysisMove[]} moves - The array of analysis moves.
 * @returns {AnalysisMove[]} The array of classified analysis moves.
 */
export const classifyMoves = (moves: AnalysisMove[]): AnalysisMove[] => {
  return moves.map(classifyRegular);
};

/**
 * Classifies a single move based on the analysis results.
 * @param {AnalysisMove} move - The analysis move to classify.
 * @param {number} index - The index of the move in the array.
 * @param {AnalysisMove[]} moves - The array of analysis moves.
 * @returns {AnalysisMove} The classified analysis move.
 */
export const classifyRegular = (move: AnalysisMove, index: number, moves: AnalysisMove[]) => {
  const next = moves[index + 1]?.engineResults.sort((a, b) => b.depth! - a.depth!)?.[0];
  const current = move?.engineResults.sort((a, b) => b.depth! - a.depth!)?.[0];

  if (!next || !current) return { ...move, classification: AnalysisMoveClassification.None };

  if (current.mate) return { ...move, classification: classifyWithMate(move.move, next, current) };
  else return { ...move, classification: classifyWithWinChance(move.move, next, current) };
};

/**
 * Classifies a move based on mate evaluation.
 * @param {Move} move - The move to classify.
 * @param {InfoResult} next - The next mate evaluation.
 * @param {InfoResult} current - The current mate evaluation.
 * @returns {AnalysisMoveClassification} The classification of the move.
 */
const classifyWithMate = (move: Move, next: InfoResult, current: InfoResult): AnalysisMoveClassification => {
  if (next.mate === null || current.mate === null) return AnalysisMoveClassification.None;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const mateDelta = (next.mate || current.mate) - current.mate - 1;

  const numMoves = new Chess(move.before).moves().length;
  let classification = AnalysisMoveClassification.None;

  if (numMoves <= 1) classification = AnalysisMoveClassification.Forced;
  if (move.from + move.to === current.move) classification = AnalysisMoveClassification.Best;
  else if (mateDelta <= 0) classification = AnalysisMoveClassification.Excellent;
  else if (mateDelta === 2) classification = AnalysisMoveClassification.Good;
  else if (mateDelta === 3) classification = AnalysisMoveClassification.Inaccuracy;
  else if (mateDelta === 4) classification = AnalysisMoveClassification.Mistake;
  else if (mateDelta >= 5) classification = AnalysisMoveClassification.Blunder;

  return classification;
};

/**
 * Classifies a move based on win chance evaluation.
 * @param {Move} move - The move to classify.
 * @param {number} next - The next win chance evaluation.
 * @param {number} current - The current win chance evaluation.
 * @returns {AnalysisMoveClassification} The classification of the move.
 */
const classifyWithWinChance = (move: Move, next: InfoResult, current: InfoResult): AnalysisMoveClassification => {
  if (!next.winChance || !current.winChance) return AnalysisMoveClassification.None;

  const winChanceDelta = Math.abs((current.winChance - next.winChance) / 100);

  const numMoves = new Chess(move.before).moves().length;
  let classification = AnalysisMoveClassification.None;

  if (numMoves <= 1) classification = AnalysisMoveClassification.Forced;
  if (move.from + move.to === current.move) classification = AnalysisMoveClassification.Best;
  else if (winChanceDelta > 0.0 && winChanceDelta <= 0.02) classification = AnalysisMoveClassification.Excellent;
  else if (winChanceDelta > 0.02 && winChanceDelta <= 0.05) classification = AnalysisMoveClassification.Good;
  else if (winChanceDelta > 0.05 && winChanceDelta <= 0.1) classification = AnalysisMoveClassification.Inaccuracy;
  else if (winChanceDelta > 0.1 && winChanceDelta <= 0.2) classification = AnalysisMoveClassification.Mistake;
  else if (winChanceDelta > 0.2 && winChanceDelta <= 1) classification = AnalysisMoveClassification.Blunder;

  return classification;
};
