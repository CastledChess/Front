import { Evalbar } from '@/components/evalbar/evalbar.tsx';
import { PlayerInfo } from '@/components/playerinfo/playerinfo.tsx';
import { AnalysisChessboard } from '@/components/chessboard/analysis-chessboard.tsx';
import { useAnalysisStore } from '@/store/analysis.ts';
import { useState } from 'react';
import './chessboard-panel.css';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'chessground/types';

export const ChessboardPanel = () => {
  const { currentMove, setCurrentMove, analysis, chess, chessGround } = useAnalysisStore();
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currMove = analysis!.moves[currentMove];

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
