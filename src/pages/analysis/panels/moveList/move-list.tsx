import { useAnalysisStore } from '@/store/analysis.ts';
import { Button } from '@/components/ui/button';
import { Chess } from 'chess.js';
import {
  classificationToTailwindColor,
  moveIsBad,
  shouldDisplayClassificationInMoveHistory,
} from '@/data/classifications.ts';
import { cn } from '@/lib/utils.ts';
import { useEffect, useState } from 'react';
import { Opening } from '@/types/opening.ts';
import { findOpening } from '@/lib/opening.ts';
import { useMoveListState } from '@/store/move-list.ts';
import { AnalysisMove } from '@/types/analysis.ts';
import { toPieceNotation } from '@/lib/format.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'chessground/types';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const MoveList = () => {
  const { analysis, chess, chessGround, currentMove, setCurrentMove } = useAnalysisStore();
  const { displayLine } = useMoveListState();
  const [opening, setOpening] = useState<Opening | undefined>(undefined);

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

  useEffect(() => {
    findOpening(chess.pgn())
      .then((opening) => setOpening(opening))
      .catch(console.error);
    /** When a custom svg (classification) is rendered twice at the same square on two different moves
     * it does not trigger a re-render and does not animate the second one, this fixes the issue */
    chessGround?.redrawAll();
  }, [currentMove]);

  return (
    <div className="p-6 flex h-full flex-col gap-2">
      <span className="text-xs h-6">{opening && opening.name}</span>
      <div className="flex h-full gap-1 flex-wrap overflow-y-scroll custom-scrollbar">
        {analysis?.moves.map((move, index) => (
          <React.Fragment key={index}>
            <Button
              className={cn(
                'flex gap-2 p-1 h-max',
                currentMove === index + 1 && 'underline font-bold bg-castled-accent/15',
              )}
              variant="ghost"
              onFocus={(e) => e.target.blur()}
              onClick={() => handleSkipToMove(index + 1)}
            >
              {index % 2 == 0 && <span>{Math.floor(index / 2) + 1}.</span>}
              <span
                className={cn(
                  'text-sm',
                  move.classification &&
                    shouldDisplayClassificationInMoveHistory[move.classification] &&
                    classificationToTailwindColor[move.classification],
                )}
              >
                {toPieceNotation(move.move.san, move.move.color)}
              </span>
            </Button>
            {move.classification && moveIsBad[move.classification] && displayLine && currentMove === index + 1 && (
              <EngineLine moveIndex={index} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

type EngineLineProps = {
  moveIndex: number;
};

const EngineLine = ({ moveIndex }: EngineLineProps) => {
  const { chess, analysis, chessGround } = useAnalysisStore();
  const { currentLineMove, setDisplayLine, setCurrentLineMove } = useMoveListState();
  const { t } = useTranslation('moveList');

  const getEngineLine = (move: AnalysisMove, chess: Chess) => {
    const c = new Chess(chess.fen());

    const uciPvLine = move.engineResults.sort((a, b) => (b.depth || 0) - (a.depth || 0))[0].pv;

    const movePvLine = uciPvLine.map((uci) => {
      c.move(uci);
      return c.history({ verbose: true }).slice(-1)[0];
    });

    for (let i = 0; i < uciPvLine.length; i++) {
      c.undo();
    }

    return [analysis!.moves[moveIndex].move, ...movePvLine];
  };

  const handleSkipToMove = (index: number) => {
    const c = new Chess(chess.fen());

    for (let i = 1; i < currentLineMove; i++) {
      c.undo();
    }

    let i = 1;
    for (; i < index; i++) {
      c.move(engineLine[i].san);
    }

    chessGround?.set({
      highlight: {
        custom: new Map<Key, string>([
          [engineLine[i - 1].from as Key, 'yellow'],
          [engineLine[i - 1].to as Key, 'yellow'],
        ]),
      },
      fen: c.fen(),
    });

    setCurrentLineMove(index);
    chessGround?.redrawAll();
  };

  const handleNextMove = () => {
    if (currentLineMove >= engineLine.length) return;

    const c = new Chess(chess.fen());

    let i = 1;
    for (; i <= currentLineMove; i++) {
      c.move(engineLine[i].san);
    }

    chessGround?.set({
      highlight: {
        custom: new Map<Key, string>([
          [engineLine[i - 1].from as Key, 'yellow'],
          [engineLine[i - 1].to as Key, 'yellow'],
        ]),
      },
      fen: c.fen(),
    });

    setCurrentLineMove(currentLineMove + 1);
  };

  const handlePrevMove = () => {
    if (currentLineMove <= 1) {
      setCurrentLineMove(1);
      setDisplayLine(false);
      return;
    }

    const c = new Chess(chess.fen());

    let i = 1;
    for (; i < currentLineMove - 1; i++) {
      c.move(engineLine[i].san);
    }

    chessGround?.set({
      highlight: {
        custom: new Map<Key, string>([
          [engineLine[i - 1].from as Key, 'yellow'],
          [engineLine[i - 1].to as Key, 'yellow'],
        ]),
      },
      fen: c.fen(),
    });

    setCurrentLineMove(currentLineMove - 1);
  };

  const handleSkipToBegin = () => {
    const c = new Chess(chess.fen());

    c.move(engineLine[1].san);
    c.undo();

    chessGround?.set({
      highlight: {
        custom: new Map<Key, string>([
          [engineLine[0].from as Key, 'yellow'],
          [engineLine[0].to as Key, 'yellow'],
        ]),
      },
      fen: chess.fen(),
    });

    setCurrentLineMove(1);
  };

  const handleSkipToEnd = () => {
    const c = new Chess(chess.fen());

    let i = 1;
    for (; i < engineLine.length; i++) {
      c.move(engineLine[i].san);
    }

    chessGround?.set({
      highlight: {
        custom: new Map<Key, string>([
          [engineLine[i - 1].from as Key, 'yellow'],
          [engineLine[i - 1].to as Key, 'yellow'],
        ]),
      },
      fen: c.fen(),
    });

    setCurrentLineMove(engineLine.length);
  };

  useHotkeys('right', handleNextMove);
  useHotkeys('left', handlePrevMove);
  useHotkeys('ctrl+left', handleSkipToBegin);
  useHotkeys('ctrl+right', handleSkipToEnd);

  const nextMove = analysis!.moves[moveIndex + 1];
  const engineLine = getEngineLine(nextMove, chess);

  return (
    <div className="text-xs text-gray-500 w-full flex gap-1 flex-col bg-secondary p-2 rounded-l-xl">
      <p>{t('engineLine')}</p>
      <div className="flex gap-1 flex-wrap">
        {engineLine.map((move, index) => {
          return (
            <Button
              key={index}
              className={cn(
                'flex gap-2 p-1 h-max',
                currentLineMove === index + 1 && 'underline font-bold bg-castled-accent/15',
              )}
              variant="ghost"
              onClick={() => handleSkipToMove(index + 1)}
            >
              {index % 2 == 0 && <span>{Math.floor(index / 2) + 1}.</span>}
              <span className="text-sm">{toPieceNotation(move.san, move.color)}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
