import { Chessground } from 'chessground';
import { useContext, useLayoutEffect, useMemo } from 'react';
import { Square } from 'chess.js';
import { Key } from 'chessground/types';
import { Config } from 'chessground/config';
import { analysisContext } from '@/contexts/analysisContext.tsx';

import '@/components/chessboard/base.css';
import '@/components/chessboard/brown.css';
import '@/components/chessboard/cburnett.css';
import '@/components/chessboard/3d.css';

type ChessboardProps = {
  onAfterChange: () => void;
};

export const Chessboard = ({ onAfterChange }: ChessboardProps) => {
  const { chess, chessGround, chessGroundRef } = useContext(analysisContext);

  const onMove = (origin: string, destination: string) => {
    try {
      chess.current.move({
        from: origin,
        to: destination,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onSelect = (square: string) => {
    computeDestinations(square);
  };

  const computeDestinations = (square: string) => {
    const moves = chess.current.moves({
      square: square as Square,
      verbose: true,
    });

    if (moves.length === 0) return;

    const destinations = new Map<Key, Key[]>();

    moves.forEach((move) => {
      if (!destinations.has(move.from)) {
        destinations.set(move.from, []);
      }

      destinations.get(move.from)?.push(move.to);
    });

    chessGround.current?.set({
      movable: {
        free: false,
        dests: destinations,
      },
    });
  };

  const CHESSGROUND_CONFIG: Config = useMemo(
    () => ({
      fen: chess.current.fen(),
      movable: {
        free: false,
      },
      events: {
        change: onAfterChange,
        move: onMove,
        select: onSelect,
      },
    }),
    [chess],
  );

  useLayoutEffect(() => {
    if (!chessGroundRef.current) return;

    chessGround.current = Chessground(chessGroundRef.current, CHESSGROUND_CONFIG);
  }, [CHESSGROUND_CONFIG, chessGroundRef]);

  return <div ref={chessGroundRef} className="w-full h-full aspect-square" />;
};
