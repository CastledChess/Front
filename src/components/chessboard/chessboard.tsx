import { Chessground } from 'chessground';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Config } from 'chessground/config';
import '@/components/chessboard/base.css';
import '@/components/chessboard/brown.css';
import { useThemeStore } from '@/store/theme.ts';
import { Chess } from 'chess.js';
import { Api } from 'chessground/api';

type ChessboardProps = {
  chess: Chess;
  chessGround: Api | null;
  setChessGround: (chessGround: Api) => void;
  freeMovable?: boolean;
  draggable?: boolean;
  disableCoordinates?: boolean;
  onAfterChange?: () => void;
};

export const Chessboard = ({
  chess,
  setChessGround,
  onAfterChange,
  freeMovable = false,
  draggable = true,
  disableCoordinates = false,
}: ChessboardProps) => {
  const { pieceTheme, boardTheme, animationSpeed } = useThemeStore();
  const ref = useRef<HTMLDivElement | null>(null);

  const CHESSGROUND_CONFIG: Config = useMemo(
    () => ({
      fen: chess.fen(),
      coordinates: !disableCoordinates,
      movable: { free: freeMovable },
      draggable: { enabled: draggable },
      animation: {
        enabled: true,
        duration: parseInt(animationSpeed),
      },
      events: {
        change: onAfterChange,
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
      <div ref={ref} className={`w-full h-full aspect-square ${pieceTheme}`} />
    </div>
  );
};
