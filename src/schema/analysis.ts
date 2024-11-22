import { z } from 'zod';

export const StartAnalysisFormSchema = z.object({
  pgn: z.string().min(1, 'PGN is required'),
  classifyMoves: z.boolean().optional(),
  engine: z.string().min(1, 'Engine is required'),
  threads: z
    .number()
    .min(1, 'Threads must be at least 1')
    .max(navigator.hardwareConcurrency, `Threads must be at most ${navigator.hardwareConcurrency}`),
});
