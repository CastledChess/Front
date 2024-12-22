import { Evalbar } from '@/components/evalbar/evalbar.tsx';
import { PlayerInfo } from '@/components/playerinfo/playerinfo.tsx';
import { AnalysisChessboard } from '@/components/chessboard/analysis-chessboard.tsx';
import { useAnalysisStore } from '@/store/analysis.ts';
import { useEffect, useRef, useState } from 'react';
import './chessboard-panel.css';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'chessground/types';
import { DrawShape } from 'chessground/draw';
import { AnalysisMoveClassification } from '@/types/analysis.ts';
import { classificationToColor, classificationToGlyph } from '@/pages/analysis/classifications.ts';

export const ChessboardPanel = () => {
  const { currentMove, setCurrentMove, analysis, chess, chessGround } = useAnalysisStore();
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
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

  return (
    <div className="flex h-full items-center justify-center p-6 relative chessboard-panel">
      <div className="h-full flex flex-col w-full">
        <div className="flex gap-6 items-center justify-center flex-grow relative chessboard-panel-inner">
          <div className="eval-bar-container">
            <Evalbar
              orientation={orientation}
              winChance={analysis!.moves[currentMove]?.engineResults?.[0]?.winChance ?? 50}
              evaluation={analysis!.moves[currentMove]?.engineResults?.[0]?.eval ?? 0}
              mate={analysis!.moves[currentMove]?.engineResults?.[0]?.mate}
            />
          </div>

          <div className="chessboard-container aspect-square relative">
            {analysis && (
              <div className="absolute top-0 -translate-y-[calc(100%+.5rem)]">
                <PlayerInfo
                  player={{
                    username: orientation === 'white' ? analysis.header.Black : analysis.header.White,
                    rating: orientation === 'white' ? analysis.header.BlackElo : analysis.header.WhiteElo,
                  }}
                />
              </div>
            )}
            <AnalysisChessboard />
            {analysis && (
              <div className="absolute top-[calc(100%+.5rem)]">
                <PlayerInfo
                  player={{
                    username: orientation === 'white' ? analysis.header.White : analysis.header.Black,
                    rating: orientation === 'white' ? analysis.header.WhiteElo : analysis.header.BlackElo,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
