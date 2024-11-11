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
import {
  classificationToColor,
  classificationToGlyph,
  classificationToGlyphUrl,
  shouldDisplayClassificationInMoveHistory,
} from '@/pages/analysis/classifications.ts';
import { EvalChart } from '@/components/evalchart/evalchart.tsx';
import { CategoricalChartState } from 'recharts/types/chart/types';

export const Analysis = () => {
  const { currentMove, setCurrentMove, analysis, chess, chessGround } = useAnalysisStore();
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [opening, setOpening] = useState<Opening | undefined>(undefined);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);
  const moveRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const currMove = analysis!.moves[currentMove]!;
  const previousMove = analysis!.moves[currentMove - 1]!;
  const variants = previousMove?.engineResults
    ?.sort((a, b) => b.depth! - a.depth!)
    ?.filter((result, index, self) => self.findIndex((r) => r.move === result.move) === index)
    ?.slice(0, analysis?.variants ?? 1);

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

  const handleSkipToMove = (index: number) => {
    const moves = chess.history();

    for (let i = 0; i < moves.length; i++) {
      chess.undo();
    }

    for (let i = 0; i < index; i++) {
      chess.move(analysis!.moves[i].move);
    }

    chessGround?.set({
      fen: chess.fen(),
    });
    setCurrentMove(index);
    chessGround?.redrawAll();
  };

  const handleClickEvalChart = (nextState: CategoricalChartState) => {
    if (nextState.activeTooltipIndex) handleSkipToMove(nextState.activeTooltipIndex);
  };

  useEffect(() => {
    findOpening(chess.pgn()).then((opening) => setOpening(opening));
    /** When a custom svg (classification) is rendered twice at the same square on two different moves
     * it does not trigger a re-render and does not animate the second one, this fixes the issue */
    chessGround?.redrawAll();
    moveRefs.current[currentMove - 1]?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, [currentMove]);

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
          html: classificationToGlyph[previousMove.classification],
        },
      });
    }

    chessGround?.set({
      highlight: {
        custom: new Map<Key, string>([
          [previousMove.move.from as Key, classificationToColor[previousMove.classification!]],
          [previousMove.move.to as Key, classificationToColor[previousMove.classification!]],
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
                <Button className="flex-1 rounded-none" variant="ghost">
                  <CircleHelp />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Other Button 3</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="p-6 flex flex-col gap-10">
          <span className="text-sm text-primary/80">{opening?.name}</span>

          <div className="custom-scrollbar flex flex-col gap-2 h-[30rem] overflow-y-scroll rounded">
            <table className="w-full">
              <tbody>
                {formatMoves(analysis!.moves).map((move, index) => (
                  <tr
                    key={index}
                    ref={(el) => {
                      moveRefs.current[index * 2] = el;
                      moveRefs.current[index * 2 + 1] = el;
                    }}
                    className="even:bg-foreground/[.02]"
                  >
                    <td className="p-3">{index}</td>
                    {move.whiteMove && (
                      <td>
                        <div className="flex p-1 items-center gap-2">
                          <label className="w-5 h-5" htmlFor={`move-${index * 2}`}>
                            {shouldDisplayClassificationInMoveHistory[move.whiteMove.classification!] && (
                              <img
                                src={classificationToGlyphUrl[move.whiteMove.classification!]}
                                alt={move.whiteMove.classification}
                              />
                            )}
                          </label>

                          <Button
                            id={`move-${index * 2}`}
                            onClick={() => handleSkipToMove(index * 2 + 1)}
                            variant="ghost"
                            className={`transition-none justify-start flex-1 gap-2 p-2 rounded items-center ${currentMove + 1 === (index + 1) * 2 ? 'bg-primary/10' : ''}`}
                          >
                            {move.whiteMove.move.san}
                          </Button>
                        </div>
                      </td>
                    )}
                    {move.blackMove && (
                      <td>
                        <div className="flex p-1 items-center gap-2">
                          <label className="w-5 h-5" htmlFor={`move-${index * 2 + 1}`}>
                            {shouldDisplayClassificationInMoveHistory[move.blackMove.classification!] && (
                              <img
                                src={classificationToGlyphUrl[move.blackMove.classification!]}
                                alt={move.blackMove.classification}
                              />
                            )}
                          </label>
                          <Button
                            id={`move-${index * 2 + 1}`}
                            onClick={() => handleSkipToMove((index + 1) * 2)}
                            variant="ghost"
                            className={`transition-none justify-start flex-1 gap-2 p-2 rounded items-center ${currentMove === (index + 1) * 2 ? 'bg-primary/10' : ''}`}
                          >
                            {move.blackMove?.move.san ?? ''}
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <EvalChart onClick={handleClickEvalChart} />
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
