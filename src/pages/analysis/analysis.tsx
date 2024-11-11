import { useEffect, useRef, useState } from 'react';
import { DrawShape } from 'chessground/draw';
import { useAnalysisStore } from '@/store/analysis.ts';
import { PlayerInfo } from '@/components/playerinfo/playerinfo.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  ChevronFirst,
  FlipVertical2,
  CircleHelp,
  Play,
  Pause,
} from 'lucide-react';
import { Evalbar } from '@/components/evalbar/evalbar.tsx';
import { AnalysisMove, AnalysisMoveClassification } from '@/types/analysis.ts';
import { Key } from 'chessground/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { findOpening } from '@/lib/opening.ts';
import { Opening } from '@/types/opening.ts';
import { AnalysisChessboard } from '@/components/chessboard/analysis-chessboard.tsx';
import { useHotkeys } from 'react-hotkeys-hook';

import brilliantRaw from '@/assets/icons/analysis/classification-brilliant.svg?raw';
import bestRaw from '@/assets/icons/analysis/classification-best.svg?raw';
import excellentRaw from '@/assets/icons/analysis/classification-excellent.svg?raw';
import goodRaw from '@/assets/icons/analysis/classification-good.svg?raw';
import inaccuracyRaw from '@/assets/icons/analysis/classification-inaccuracy.svg?raw';
import mistakeRaw from '@/assets/icons/analysis/classification-mistake.svg?raw';
import blunderRaw from '@/assets/icons/analysis/classification-blunder.svg?raw';

const classificationToGlyph = {
  [AnalysisMoveClassification.Brilliant]: brilliantRaw,
  [AnalysisMoveClassification.Best]: bestRaw,
  [AnalysisMoveClassification.Excellent]: excellentRaw,
  [AnalysisMoveClassification.Good]: goodRaw,
  [AnalysisMoveClassification.Inaccuracy]: inaccuracyRaw,
  [AnalysisMoveClassification.Mistake]: mistakeRaw,
  [AnalysisMoveClassification.Blunder]: blunderRaw,
};

const classificationToColor = {
  [AnalysisMoveClassification.Brilliant]: 'blue',
  [AnalysisMoveClassification.Best]: 'green',
  [AnalysisMoveClassification.Excellent]: 'green',
  [AnalysisMoveClassification.Good]: 'green',
  [AnalysisMoveClassification.Inaccuracy]: 'yellow',
  [AnalysisMoveClassification.Mistake]: 'orange',
  [AnalysisMoveClassification.Blunder]: 'red',
};

export const Analysis = () => {
  const { currentMove, setCurrentMove, analysis, chess, chessGround } = useAnalysisStore();
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [opening, setOpening] = useState<Opening | undefined>(undefined);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  const currMove = analysis!.moves[currentMove]!;
  const previousMove = analysis!.moves[currentMove - 1]!;
  const variants = previousMove?.engineResults
    ?.sort((a, b) => b.depth! - a.depth!)
    ?.filter((result, index, self) => self.findIndex((r) => r.move === result.move) === index)
    ?.slice(0, analysis?.variants ?? 1);

  useEffect(() => {
    findOpening(chess.pgn()).then((opening) => setOpening(opening));
    /** When a custom svg (classification) is rendered twice at the same square on two different moves
     * it does not trigger a re-render and does not animate the second one, this fixes the issue */
    chessGround?.redrawAll();
  }, [currentMove]);

  const formatMoves = (moves: AnalysisMove[]): { whiteMove: AnalysisMove; blackMove: AnalysisMove }[] => {
    const formattedMoves: { whiteMove: AnalysisMove; blackMove: AnalysisMove }[] = [];

    for (let i = 0; i < moves.length; i += 2) formattedMoves.push({ whiteMove: moves[i], blackMove: moves[i + 1] });

    return formattedMoves;
  };

  const handleNextMove = () => {
    if (currentMove >= analysis!.moves.length) return;

    chess.move(currMove.move);
    chessGround?.set({
      fen: chess.fen(),
    });

    setCurrentMove(currentMove + 1);
  };

  const handlePrevMove = () => {
    if (currentMove <= 0) return;

    chess.undo();
    chessGround?.set({
      fen: chess.fen(),
    });

    setCurrentMove(currentMove - 1);
  };

  const handleToggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleFlipBoard = () => {
    setOrientation((orientation) => (orientation === 'white' ? 'black' : 'white'));

    chessGround?.toggleOrientation();
  };

  const handleSkipToBegin = () => {
    const moves = chess.history();

    for (let i = 0; i < moves.length; i++) {
      chess.undo();
    }

    setCurrentMove(0);
    chessGround?.set({
      drawable: { autoShapes: [] },
      highlight: { custom: new Map<Key, string>() },
      fen: chess.fen(),
    });
  };

  const handleSkipToEnd = () => {
    const moves = analysis!.moves;

    for (let i = currentMove; i < moves.length; i++) {
      chess.move(moves[i].move);
    }

    setCurrentMove(moves.length);
    chessGround?.set({
      fen: chess.fen(),
    });
  };

  useEffect(() => {
    if (currentMove >= analysis!.moves.length) setIsAutoPlaying(false);
    if (!isAutoPlaying) clearInterval(autoPlayInterval.current!);
    else autoPlayInterval.current = setInterval(handleNextMove, 1000);

    return () => clearInterval(autoPlayInterval.current!);
  }, [isAutoPlaying, currentMove]);

  useEffect(() => {
    if (currentMove >= analysis!.moves.length) return;

    if (!previousMove) return;

    const autoShapes: DrawShape[] = variants.map((result) => ({
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
          [
            previousMove.move.from as Key,
            classificationToColor[previousMove.classification as keyof typeof classificationToColor],
          ],
          [
            previousMove.move.to as Key,
            classificationToColor[previousMove.classification as keyof typeof classificationToColor],
          ],
        ]),
      },
      drawable: { autoShapes: autoShapes },
    });
  }, [currentMove]);

  useHotkeys('right', handleNextMove);
  useHotkeys('left', handlePrevMove);
  useHotkeys('ctrl+left', handleSkipToBegin);
  useHotkeys('ctrl+right', handleSkipToEnd);
  useHotkeys('space', handleToggleAutoPlay);
  useHotkeys('f', handleFlipBoard);

  return (
    <div className="w-full h-full flex gap-6 justify-center p-4">
      <Evalbar
        orientation={orientation}
        winChance={analysis!.moves[currentMove]?.engineResults?.[0]?.winChance ?? 50}
        evaluation={analysis!.moves[currentMove]?.engineResults?.[0]?.eval ?? 0}
        mate={analysis!.moves[currentMove]?.engineResults?.[0]?.mate}
      />
      <div className="h-full flex flex-col gap-4">
        {analysis && (
          <PlayerInfo
            player={{
              username: orientation === 'white' ? analysis.header.Black : analysis.header.White,
              rating: orientation === 'white' ? analysis.header.BlackElo : analysis.header.WhiteElo,
            }}
          />
        )}
        <div className="h-[calc(100%-7rem)] aspect-square">
          <AnalysisChessboard />
        </div>
        {analysis && (
          <PlayerInfo
            player={{
              username: orientation === 'white' ? analysis.header.White : analysis.header.Black,
              rating: orientation === 'white' ? analysis.header.WhiteElo : analysis.header.BlackElo,
            }}
          />
        )}
      </div>

      <div className="flex flex-col bg-primary/5 h-full rounded-lg w-96">
        <div className="w-full overflow-hidden h-max flex rounded-lg">
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
                <Button className="flex-1 rounded-none" variant="ghost">
                  <CircleHelp />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Other Button 1</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="flex-1 rounded-none" variant="ghost">
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

        <div className="p-6 flex flex-col h-96 gap-10">
          <span className="text-sm text-primary/80">{opening?.name}</span>

          <div className="custom-scrollbar flex flex-col gap-2 overflow-y-scroll">
            <table className="w-full">
              <tbody>
                {formatMoves(analysis!.moves).map((move, index) => (
                  <tr key={index} className="even:bg-foreground/[.02]">
                    <td className="p-2">{index}</td>
                    <td>
                      <div className="flex gap-2 items-center p-2">
                        <img
                          src={classificationToGlyphUrl[move.whiteMove.classification!]}
                          alt={move.whiteMove.classification}
                          className="w-4 h-4"
                        />
                        {move.whiteMove.move.san}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2 items-center p-2">
                        <img
                          src={classificationToGlyphUrl[move.blackMove.classification!]}
                          alt={move.blackMove.classification}
                          className="w-4 h-4"
                        />
                        {move.blackMove?.move.san ?? ''}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full overflow-hidden flex rounded-lg mt-auto">
          <Button onClick={handleSkipToBegin} className="flex-1 rounded-none" variant="ghost">
            <ChevronFirst />
          </Button>
          <Button onClick={handlePrevMove} className="flex-1 rounded-none" variant="ghost">
            <ChevronLeft />
          </Button>
          <Button className="flex-1 rounded-none" variant="ghost" onClick={handleToggleAutoPlay}>
            {isAutoPlaying ? <Pause /> : <Play />}
          </Button>
          <Button onClick={handleNextMove} className="flex-1 rounded-none" variant="ghost">
            <ChevronRight />
          </Button>
          <Button onClick={handleSkipToEnd} className="flex-1 rounded-none" variant="ghost">
            <ChevronLast />
          </Button>
        </div>
      </div>
    </div>
  );
};
