import { Chessground } from 'chessground';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Config } from 'chessground/config';
import '@/components/chessboard/base.css';
import '@/components/chessboard/brown.css';
import { useAnalysisStore } from '@/store/analysis.ts';
import { useThemeStore } from '@/store/theme.ts';

type ChessboardProps = {
  onAfterChange?: () => void;
};

export const Chessboard = ({ onAfterChange }: ChessboardProps) => {
  const { chess, setChessGround } = useAnalysisStore();
  const { pieceTheme, boardTheme } = useThemeStore();
  const ref = useRef<HTMLDivElement | null>(null);

  const CHESSGROUND_CONFIG: Config = useMemo(
    () => ({
      fen: chess.fen(),
      movable: {
        free: false,
      },
      events: {
        change: onAfterChange,
        // move: onMove,
        // select: onSelect,
      },
    }),
    [chess],
  );

  useLayoutEffect(() => {
    if (!ref) return;

    setChessGround(Chessground(ref.current!, CHESSGROUND_CONFIG));
  }, [CHESSGROUND_CONFIG, ref]);

  return (
    <div className="w-full h-full relative">
      <div className={`w-full h-full aspect-square absolute rounded-lg chessboard-base ${boardTheme}`} />
      <div ref={ref} className={`w-full h-full aspect-square is2d ${pieceTheme}`} />
    </div>
  );
};
