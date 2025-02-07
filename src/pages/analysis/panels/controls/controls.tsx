import { useAnalysisStore } from '@/store/analysis.ts';
import { Button } from '@/components/ui/button.tsx';
import { useEffect, useRef, useState } from 'react';
import { Key } from 'chessground/types';
import { useHotkeys } from 'react-hotkeys-hook';
import { DrawShape } from 'chessground/draw';
import { AnalysisMoveClassification } from '@/types/analysis.ts';
import { classificationToColor, classificationToGlyph, classificationToGlyphUrl } from '@/data/classifications.ts';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pause, Play } from 'lucide-react';
import { Color, Move } from 'chess.js';
import { descriptions } from '@/pages/analysis/panels/engineInterpretation/classificationDescription.ts';

export const Controls = () => {
  const { currentMove, setCurrentMove, analysis, chess, chessGround, orientation, setOrientation } = useAnalysisStore();
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  const currMove = analysis!.moves[currentMove];
  const previousMove = analysis!.moves[currentMove - 1];
  const variants = previousMove?.engineResults
    ?.sort((a, b) => b.depth! - a.depth!)
    ?.filter((result, index, self) => self.findIndex((r) => r.move === result.move) === index)
    ?.slice(0, analysis?.variants ?? 1);

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
    setOrientation(orientation === 'white' ? 'black' : 'white');

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

  useHotkeys('right', handleNextMove);
  useHotkeys('left', handlePrevMove);
  useHotkeys('ctrl+left', handleSkipToBegin);
  useHotkeys('ctrl+right', handleSkipToEnd);
  useHotkeys('space', handleToggleAutoPlay);
  useHotkeys('f', handleFlipBoard);
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

  const toPieceNotation = (move: string, color: Color): string => {
    if (color === 'w') {
      move = move.replace('N', '♞');
      move = move.replace('B', '♝');
      move = move.replace('R', '♜');
      move = move.replace('Q', '♛');
      move = move.replace('K', '♚');
      move = move.replace('P', '♟');

      return move;
    }

    move = move.replace('N', '♘');
    move = move.replace('B', '♗');
    move = move.replace('R', '♖');
    move = move.replace('Q', '♕');
    move = move.replace('K', '♔');
    move = move.replace('P', '♙');

    return move;
  };

  const formatMoveDescription = (move: Move, optimalMove: string, classification: AnalysisMoveClassification) => {
    const notation = toPieceNotation(move.san, move.color);
    const sentence = descriptions[classification][Math.floor(Math.random() * descriptions[classification].length)];

    return sentence?.replace('{x}', notation)?.replace('{y}', optimalMove);
  };

  return (
    <div className="flex flex-col gap-1 p-4">
      <div className="flex w-full gap-1">
        <Button variant="secondary" className="w-full" onClick={handleSkipToBegin}>
          <ChevronsLeft />
        </Button>
        <Button variant="secondary" className="w-full" onClick={handlePrevMove}>
          <ChevronLeft />
        </Button>
        <Button variant="secondary" className="w-full" onClick={handleToggleAutoPlay}>
          {isAutoPlaying ? <Pause /> : <Play />}
        </Button>
        <Button variant="secondary" className="w-full" onClick={handleNextMove}>
          <ChevronRight />
        </Button>
        <Button variant="secondary" className="w-full" onClick={handleSkipToEnd}>
          <ChevronsRight />
        </Button>
      </div>

      <div className="bg-accent rounded-lg p-4 flex flex-col gap-2">
        {previousMove && (
          <div className="flex items-center gap-2">
            {previousMove.classification !== AnalysisMoveClassification.None && (
              <img
                className="h-6"
                src={classificationToGlyphUrl[previousMove.classification as AnalysisMoveClassification]}
                alt="classification"
              />
            )}
            <span className="font-bold">{toPieceNotation(previousMove.move.san, previousMove.move.color)}</span>
            {previousMove.classification !== AnalysisMoveClassification.None && (
              <span className="font-bold">{previousMove.classification}</span>
            )}
          </div>
        )}

        {previousMove && previousMove.classification !== AnalysisMoveClassification.None && variants.length > 0 && (
          <p>{formatMoveDescription(previousMove.move, variants[0].move!, previousMove.classification!)}</p>
        )}
      </div>
    </div>
  );
};
