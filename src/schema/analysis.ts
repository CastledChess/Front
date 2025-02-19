import { z } from 'zod';

export enum AnalysisMethod {
  TIME_PER_MOVE = 'TIME_PER_MOVE',
  DEPTH_PER_MOVE = 'DEPTH_PER_MOVE',
}

export const StartAnalysisFormSchema = z.object({
  pgn: z.string().min(1, 'PGN is required'),
  classifyMoves: z.boolean().optional(),
  analysisSettings: z.object({
    method: z.nativeEnum(AnalysisMethod),
    depth: z.number().min(8, 'Depth must be at least 8').max(20, 'Depth must be at most 20'),
    time: z.number().min(0.05, 'Time must be at least 0.05 seconds').max(1, 'Time must be at most 1 second'),
    hashSize: z
      .number()
      .min(1, 'Hash table size must be at least 1 MB')
      .max(1024, 'Hash table size must be at most 1024 MB'),
  }),
  engine: z.object({
    isMultiThreaded: z.boolean(),
    name: z.string(),
    value: z.string(),
    cache: z.string(),
  }),
  threads: z
    .number()
    .min(1, 'Threads must be at least 1')
    .max(navigator.hardwareConcurrency, `Threads must be at most ${navigator.hardwareConcurrency}`),
});
