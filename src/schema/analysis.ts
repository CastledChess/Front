import { z } from 'zod';

export const StartAnalysisFormSchema = z.object({
  pgn: z.string().min(1, 'PGN is required'),
  classifyMoves: z.boolean().optional(),
  variants: z.number().min(1).max(5).step(1),
  engineDepth: z.number().min(1, 'Depth must be at least 1').max(18, 'Depth must be at most 18'),
});
