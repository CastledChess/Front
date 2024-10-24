import { Chessground } from 'chessground';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Api } from 'chessground/api';
import { Chess } from 'chess.js';
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
      chessGround.current?.cancelMove();
      chessGround.current?.set({
        fen: chess.current.fen(),
      });
    }
  };

  const CHESSGROUND_CONFIG: Config = useMemo(
    () => ({
      fen: chess.current.fen(),
      events: {
        move: onMove,
      },
    }),
    [],
  );

  useLayoutEffect(() => {
    if (!chessGroundRef.current) return;

    chessGround.current = Chessground(chessGroundRef.current, CHESSGROUND_CONFIG);
  }, []);

  return <div ref={chessGroundRef} className="w-full h-full aspect-square" />;
};
