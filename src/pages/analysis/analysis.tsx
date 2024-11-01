import { Chessboard } from '@/components/chessboard/chessboard.tsx';
import { useEffect, useRef, useState } from 'react';
import { DrawShape } from 'chessground/draw';
import { useAnalysisStore } from '@/store/analysis.ts';
import { PlayerInfo } from '@/components/playerinfo/playerinfo.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft, ArrowRight, FlipVertical2, CircleHelp, Play, Pause } from 'lucide-react';
import { Evalbar } from '@/components/evalbar/evalbar.tsx';
import { AnalysisMoveClassification } from '@/types/analysis.ts';
import { Key } from 'chessground/types';
import { Keys, useHotkey } from '@/hooks/useHotkey.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';

import bestRaw from '@/assets/icons/analysis/classification-best.svg?raw';
import excellentRaw from '@/assets/icons/analysis/classification-excellent.svg?raw';
import goodRaw from '@/assets/icons/analysis/classification-good.svg?raw';
import inaccuracyRaw from '@/assets/icons/analysis/classification-inaccuracy.svg?raw';
import mistakeRaw from '@/assets/icons/analysis/classification-mistake.svg?raw';
import blunderRaw from '@/assets/icons/analysis/classification-blunder.svg?raw';
import { findOpening } from '@/lib/opening.ts';
import { Opening } from '@/types/opening.ts';

const classificationToGlyph = {
  [AnalysisMoveClassification.Best]: bestRaw,
  [AnalysisMoveClassification.Excellent]: excellentRaw,
  [AnalysisMoveClassification.Good]: goodRaw,
  [AnalysisMoveClassification.Inaccuracy]: inaccuracyRaw,
  [AnalysisMoveClassification.Mistake]: mistakeRaw,
  [AnalysisMoveClassification.Blunder]: blunderRaw,
};

export const Analysis = () => {
  const { analysis, chess, chessGround } = useAnalysisStore();
  const [current, setCurrent] = useState(0);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);
  const [opening, setOpening] = useState<Opening | undefined>(undefined);

  useEffect(() => {
    findOpening(chess.pgn()).then((opening) => setOpening(opening));
  }, [current]);

  const handleNextMove = () => {
    if (current >= analysis!.moves.length) return;

    chess.move(analysis!.moves[current].move);
    chessGround?.set({
      fen: chess.fen(),
    });

    setCurrent((current) => current + 1);
  };

  const handlePrevMove = () => {
    if (current <= 0) return;

    chess.undo();
    chessGround?.set({
      fen: chess.fen(),
    });

    setCurrent(current - 1);
  };

  const handleToggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleFlipBoard = () => {
    setOrientation((orientation) => (orientation === 'white' ? 'black' : 'white'));

    chessGround?.toggleOrientation();
  };

  useEffect(() => {
    if (current >= analysis!.moves.length) setIsAutoPlaying(false);
    if (!isAutoPlaying) clearInterval(autoPlayInterval.current!);
    else autoPlayInterval.current = setInterval(handleNextMove, 1000);

    return () => clearInterval(autoPlayInterval.current!);
  }, [isAutoPlaying, current]);

  useEffect(() => {
    if (current >= analysis!.moves.length) return;

    const previousMove = analysis!.moves[current - 1];

    if (!previousMove) return;

    const bestMoves = previousMove.engineResults
      .sort((a, b) => b.depth - a.depth)
      .filter((result, index, self) => self.findIndex((r) => r.move === result.move) === index)
      .slice(0, analysis?.variants ?? 1);

    const autoShapes: DrawShape[] = bestMoves.map((result) => ({
      orig: result.from,
      dest: result.to,
      brush: 'blue',
    })) as DrawShape[];

    if (previousMove.classification && previousMove.classification !== AnalysisMoveClassification.None) {
      autoShapes.push({
        orig: previousMove.move.to as Key,
        customSvg: {
          html: classificationToGlyph[previousMove.classification as keyof typeof classificationToGlyph],
        },
      });
    }

    chessGround?.set({
      highlight: {
        custom: new Map<Key, string>([
          [previousMove.move.from as Key, 'orange'],
          [previousMove.move.to as Key, 'orange'],
        ]),
      },
      drawable: { autoShapes: autoShapes },
    });
  }, [current]);

  useHotkey(Keys.RightArrow, 0, handleNextMove);
  useHotkey(Keys.LeftArrow, 0, handlePrevMove);
  useHotkey(Keys.Space, 0, handleToggleAutoPlay);
  useHotkey(Keys.F, 0, handleFlipBoard);

  return (
    <div className="w-full h-full flex gap-6 justify-center p-4">
      <Evalbar
        orientation={orientation}
        winChance={analysis!.moves[current]?.engineResults?.[0]?.winChance ?? 50}
        evaluation={analysis!.moves[current]?.engineResults?.[0]?.eval ?? 0}
      />
      <div className="h-full flex flex-col gap-4">
        {analysis && (
          <PlayerInfo
            player={{
              username: analysis.header.Black,
              rating: analysis.header.BlackElo,
            }}
          />
        )}
        <Chessboard />
        {analysis && (
          <PlayerInfo
            player={{
              username: analysis.header.White,
              rating: analysis.header.WhiteElo,
            }}
          />
        )}
      </div>

      <div className="flex flex-col bg-primary/5 rounded-lg w-96">
        <div className="w-full overflow-hidden flex rounded-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="flex-1 rounded-none" variant="ghost" onClick={handleFlipBoard}>
                  <FlipVertical2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Flip board</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="flex-1 rounded-none" variant="ghost" onClick={handleFlipBoard}>
                  <CircleHelp />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Other Button 1</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="flex-1 rounded-none" variant="ghost" onClick={handleFlipBoard}>
                  <CircleHelp />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Other Button 2</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="flex-1 rounded-none" variant="ghost" onClick={handleFlipBoard}>
                  <CircleHelp />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Other Button 3</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="p-6 flex flex-col gap-10">
          <span className="text-sm text-primary/80">{opening?.name}</span>
        </div>

        <div className="w-full overflow-hidden flex rounded-lg mt-auto">
          <Button onClick={handlePrevMove} className="flex-1 rounded-none" variant="ghost">
            <ArrowLeft />
          </Button>
          <Button className="flex-1 rounded-none" variant="ghost" onClick={handleToggleAutoPlay}>
            {isAutoPlaying ? <Pause /> : <Play />}
          </Button>
          <Button onClick={handleNextMove} className="flex-1 rounded-none" variant="ghost">
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
