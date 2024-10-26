import { LoaderButton } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch.tsx';
import { useNavigate } from 'react-router-dom';
import { Analysis, AnalysisMove, SearchResults } from '@/types/analysis.ts';
import { useAnalysisStore } from '@/store/analysis.ts';
import { useState } from 'react';

const PGN_PLACEHOLDER = `[Event "F/S Return Match"]
[Site "Belgrade, Serbia JUG"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3
O-O 9. h3 Nb8 10. d4 Nbd7 11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15.
Nb1 h6 16. Bh4 c5 17. dxe5 Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21.
Nc4 Nxc4 22. Bxc4 Nb6 23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7
27. Qe3 Qg5 28. Qxg5 hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33.
f3 Bc8 34. Kf2 Bf5 35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5
40. Rd6 Kc5 41. Ra6 Nf2 42. g4 Bd3 43. Re6 1/2-1/2`;

const FormSchema = z.object({
  pgn: z.string().min(1, 'PGN is required'),
  classifyMoves: z.boolean().optional(),
  engineDepth: z.number().min(1, 'Depth must be at least 1').max(18, 'Depth must be at most 18').optional(),
});

export const StartAnalysis = () => {
  const { setAnalysis, chess } = useAnalysisStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classifyMoves: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    const analysis = await analyseGame(data);

    setIsLoading(false);
    setAnalysis(analysis);

    toast.success('Analysis Ready!');
    navigate('/analysis');
  };

  const analyseGame = async (data: z.infer<typeof FormSchema>) => {
    chess.loadPgn(data.pgn);

    const moveHistory = chess.history();
    const moves: { move: string; fen: string }[] = [];

    while (chess.history().length > 0) {
      chess.undo();

      const fen = chess.fen();
      const move = moveHistory.pop();

      if (!move) break;

      moves.unshift({ move, fen });
    }

    const analysis: Analysis = {
      pgn: data.pgn,
      header: chess.header(),
      moves: await Promise.all(moves.map(async ({ move, fen }) => await analyseMove(fen, move))),
    };

    return analysis;
  };

  const analyseMove = (fen: string, move: string): Promise<AnalysisMove> =>
    new Promise<AnalysisMove>((resolve) => {
      const socket = new WebSocket('wss://chess-api.com/v1');

      socket.addEventListener('open', () => {
        socket.send(
          JSON.stringify({
            variants: 1,
            searchMoves: [move],
            fen,
          }),
        );
      });

      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (['info', 'log'].includes(data.type)) return;
        if (data.depth < 12) return;

        resolve({
          move,
          fen,
          engineResults: data as SearchResults,
        });
      });
    });

  return (
    <div className="flex justify-center p-20">
      <div className="flex flex-col items-center gap-6 lg:w-[35rem] self-center">
        <h1 className="text-3xl font-bold my-2">New Analysis</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="pgn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PGN</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={PGN_PLACEHOLDER}
                      id="pgn"
                      className="h-80 resize-none custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What is a{' '}
                    <a className="text-primary" href="https://fr.wikipedia.org/wiki/Portable_Game_Notation">
                      PGN
                    </a>
                    ?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classifyMoves"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Classify moves</FormLabel>
                    <FormDescription>Ask the engine to rate each move by classifying them.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <LoaderButton isLoading={isLoading} type="submit" className="ml-auto flex">
              Go!
            </LoaderButton>
          </form>
        </Form>
      </div>
    </div>
  );
};
