import { Chessground } from 'chessground';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Api } from 'chessground/api';
import { Chess, Square } from 'chess.js';
import { Key } from 'chessground/types';
import { Config } from 'chessground/config';

import './base.css';
import './brown.css';
import './cburnett.css';
import './3d.css';

export const Chessboard = () => {
  const chess = useRef(new Chess('r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19'));
  const chessGroundRef = useRef<HTMLDivElement | null>(null);
  const chessGround = useRef<Api>();

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
