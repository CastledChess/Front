import { z } from 'zod';

export const StartAnalysisFormSchema = z.object({
  pgn: z.string().min(1, 'PGN is required'),
  classifyMoves: z.boolean().optional(),
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
