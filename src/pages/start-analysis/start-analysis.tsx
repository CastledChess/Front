import { LoaderButton } from '@/components/ui/button.tsx';
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
import { Analysis } from '@/types/analysis.ts';
import { useAnalysisStore } from '@/store/analysis.ts';
import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { analyseMovesLocal, classifyMoves, Engine, Engines, getCachedEngines } from '@/lib/analysis.ts';
import { StartAnalysisFormSchema } from '@/schema/analysis.ts';
import { Move } from 'chess.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { useTranslation } from 'react-i18next';
import { ArrowBigDownDash, Check, DownloadCloud } from 'lucide-react';
import { ChesscomSelect } from '@/pages/start-analysis/chesscom-select.tsx';
import { LichessorgSelect } from '@/pages/start-analysis/lichessorg-select.tsx';

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

enum ImportMode {
  PGN = 'PGN',
  CHESS_COM = 'Chess.com',
  LICHESS_ORG = 'Lichess.org',
}

export const StartAnalysis = () => {
  const { setAnalysis, chess } = useAnalysisStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState({ value: 0, max: 0 });
  const [selectedEngine, setSelectedEngine] = useState<Engine>(Engines[0]);
  const [cachedEngines, setCachedEngines] = useState<Engine[]>([]);
  const [importMode, setImportMode] = useState<ImportMode>(ImportMode.PGN);

  const { t } = useTranslation('analysis', { keyPrefix: 'newAnalysis' });

  const form = useForm<z.infer<typeof StartAnalysisFormSchema>>({
    resolver: zodResolver(StartAnalysisFormSchema),
    defaultValues: {
      classifyMoves: true,
      engine: selectedEngine,
      threads: 1,
    },
  });

  const onSubmit = async (data: z.infer<typeof StartAnalysisFormSchema>) => {
    setIsLoading(true);

    const analysis = await analyseGame(data);

    setIsLoading(false);
    setAnalysis(analysis);

    toast.success('Analysis Ready!');
    navigate('/analysis');
  };

  const analyseGame = async (data: z.infer<typeof StartAnalysisFormSchema>) => {
    chess.loadPgn(data.pgn);

    const moveHistory = chess.history({ verbose: true });
    const moves: { move: Move; fen: string }[] = [];

    setProgress({ value: 0, max: moveHistory.length });

    while (chess.history().length > 0) {
      chess.undo();

      const fen = chess.fen();
      const move = moveHistory.pop();

      if (!move) break;

      moves.unshift({ move, fen });
    }

    const analyses = analyseMovesLocal({ moves, data, reportProgress });

    const analysis: Analysis = {
      pgn: data.pgn,
      variants: 1,
      header: chess.header(),
      moves: data.classifyMoves ? classifyMoves(await Promise.all(analyses)) : await Promise.all(analyses),
    };

    return analysis;
  };

  const reportProgress = () => {
    setProgress((prev) => ({ value: prev.value + 1, max: prev.max }));
  };

  const checkCachedEngines = async () => {
    const cachedEngines = await getCachedEngines();

    setCachedEngines(cachedEngines);
  };

  const isEngineCached = (engine: Engine) => cachedEngines.find((cachedEngine) => cachedEngine.name === engine.name);

  const downloadSelectedEngine = async () => {
    const engine = Engines.find((engine) => engine.name === selectedEngine.name);

    if (!engine) return;

    setIsDownloading(true);

    try {
      await fetch(engine.cache);
      await caches.open('engine-cache').then((cache) => cache.add(engine.cache));
      await checkCachedEngines();
    } catch (error) {
      console.error(error);
    }

    setIsDownloading(false);
  };

  useEffect(() => {
    checkCachedEngines();
  }, []);

  return (
    <div className="h-full flex justify-center p-16">
      <div className="flex flex-col items-center gap-6 lg:w-[35rem] self-center">
        <h1 className="text-3xl font-bold my-2">{t('title')}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <Select value={importMode} onValueChange={(v: string) => setImportMode(v as ImportMode)}>
              <SelectTrigger id="import">
                <SelectValue placeholder="PGN" />
              </SelectTrigger>

              <SelectContent>
                {Object.values(ImportMode).map((mode) => (
                  <SelectItem className="flex flex-row items-center gap-4" key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {importMode === ImportMode.CHESS_COM && <ChesscomSelect form={form} />}

            {importMode === ImportMode.LICHESS_ORG && <LichessorgSelect form={form} />}

            {importMode === ImportMode.PGN && (
              <FormField
                control={form.control}
                name="pgn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder={PGN_PLACEHOLDER}
                        spellCheck="false"
                        id="pgn"
                        className="h-56 resize-none custom-scrollbar"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('pgnDescription')}{' '}
                      <a className="text-primary" href="https://fr.wikipedia.org/wiki/Portable_Game_Notation">
                        PGN
                      </a>
                      ?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="classifyMoves"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{t('classifyMoves')}</FormLabel>
                    <FormDescription>{t('classifyMovesDescription')}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="engine"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-6">
                      <Select
                        value={field.value.value}
                        onValueChange={(e: string) => {
                          const engine = Engines.find((engine) => engine.value === e);

                          if (engine) setSelectedEngine(engine);
                          field.onChange(engine);
                        }}
                      >
                        <SelectTrigger id="engine">
                          {isEngineCached(selectedEngine) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <ArrowBigDownDash className="w-4 h-4" />
                          )}
                          <SelectValue placeholder="Engine" />
                        </SelectTrigger>

                        <SelectContent>
                          {Engines.map((engine) => (
                            <SelectItem
                              icon={
                                isEngineCached(engine) ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <ArrowBigDownDash className="w-4 h-4" />
                                )
                              }
                              className="flex flex-row items-center gap-4"
                              key={engine.value}
                              value={engine.value}
                            >
                              {engine.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {!isEngineCached(selectedEngine) && (
                        <LoaderButton isLoading={isDownloading} type="button" onClick={downloadSelectedEngine}>
                          <DownloadCloud />
                        </LoaderButton>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {Engines.find((engine) => engine.name === selectedEngine.name)?.isMultiThreaded && (
              <FormField
                control={form.control}
                name="threads"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      {t('threads')}
                      <span>{field.value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        step={1}
                        min={1}
                        max={navigator.hardwareConcurrency || 1}
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>{t('threadsDescription')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between gap-6 items-center">
              {isLoading && <Progress value={(progress.value / progress.max) * 100} />}
              <LoaderButton
                disabled={!isEngineCached(selectedEngine)}
                isLoading={isLoading}
                type="submit"
                className="ml-auto"
              >
                {t('startAnalysis')}
              </LoaderButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};