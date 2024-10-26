import { Chessground } from 'chessground';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Config } from 'chessground/config';

import '@/components/chessboard/base.css';
import '@/components/chessboard/brown.css';
import '@/components/chessboard/cburnett.css';
import '@/components/chessboard/3d.css';
import { useAnalysisStore } from '@/store/analysis.ts';

type ChessboardProps = {
  onAfterChange?: () => void;
};

export const Chessboard = ({ onAfterChange }: ChessboardProps) => {
  const { chess, setChessGround } = useAnalysisStore();
  const ref = useRef<HTMLDivElement | null>(null);

  // const onMove = (origin: string, destination: string) => {
  //   try {
  //     chess.move({
  //       from: origin,
  //       to: destination,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  //
  // const onSelect = (square: string) => {
  //   computeDestinations(square);
  // };
  //
  // const computeDestinations = (square: string) => {
  //   const moves = chess.moves({
  //     square: square as Square,
  //     verbose: true,
  //   });
  //
  //   if (moves.length === 0) return;
  //
  //   const destinations = new Map<Key, Key[]>();
  //
  //   moves.forEach((move) => {
  //     if (!destinations.has(move.from)) {
  //       destinations.set(move.from, []);
  //     }
  //
  //     destinations.get(move.from)?.push(move.to);
  //   });
  //
  //   chessGround?.set({
  //     movable: {
  //       free: false,
  //       dests: destinations,
  //     },
  //   });
  // };

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
    <div className="w-full h-full aspect-square relative">
      <div className="chessboard-bg w-full h-full aspect-square absolute rounded-lg" />
      <div ref={ref} className="w-full h-full aspect-square" />
    </div>
  );
};
