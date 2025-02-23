import { useAnalysisStore } from '@/store/analysis.ts';
import { useEffect, useRef } from 'react';
import { Chess, SQUARES } from 'chess.js';
import { parseFen } from 'chessops/fen';
import { attacks, makeSquare, parseSquare } from 'chessops';
import { AnalysisMove } from '@/types/analysis.ts';
import { CommentType, MoveEffects, SquareWeights } from '@/types/interpretation';
import { AttackUndefendedPiece } from '@/pages/analysis/panels/interpretation/comments/attack-undefended-piece.tsx';
import { ReinforcesPiece } from '@/pages/analysis/panels/interpretation/comments/reinforce-piece.tsx';

export const Interpretation = () => {
  const { currentMove, analysis, chessGround } = useAnalysisStore();
  const previousMove = analysis!.moves[currentMove - 1];
  const moveEffects = useRef<MoveEffects[]>([]);

  const getSquareWeights = (move: AnalysisMove) => {
    const c = new Chess(move.move.after);
    const weights: SquareWeights = Array.from(SQUARES).reduce((acc, curr) => {
      acc[curr] = { attacked: 0, controlledWhite: 0, controlledBlack: 0, defended: 0 };
      return acc;
    }, {} as SquareWeights);

    const splittedFen = c.fen().split(' ');

    const pieceValues = {
      pawn: 5,
      knight: 4,
      bishop: 4,
      rook: 3,
      queen: 2,
      king: 1,
    };

    splittedFen[1] = 'w';
    const positionWhite = parseFen(splittedFen.join(' ')).unwrap();

    for (const currSquare of SQUARES) {
      const squareIndex = parseSquare(currSquare);
      const currPiece = positionWhite.board.get(squareIndex);

      if (!currPiece || currPiece.color === 'black') continue;

      const rays = attacks(currPiece, squareIndex, positionWhite.board.occupied);

      for (const sq of rays) {
        const square = makeSquare(sq);
        const piece = c.get(square);

        if (!piece) weights[square].controlledWhite += pieceValues[currPiece.role];
        else weights[square][piece.color === 'b' ? 'attacked' : 'defended'] += pieceValues[currPiece.role];
      }
    }

    splittedFen[1] = 'b';
    const positionBlack = parseFen(splittedFen.join(' ')).unwrap();

    for (const currSquare of SQUARES) {
      const squareIndex = parseSquare(currSquare);
      const currPiece = positionBlack.board.get(squareIndex);

      if (!currPiece || currPiece.color === 'white') continue;

      const rays = attacks(currPiece, squareIndex, positionBlack.board.occupied);

      for (const sq of rays) {
        const square = makeSquare(sq);
        const piece = c.get(square);

        if (!piece) weights[square].controlledBlack += pieceValues[currPiece.role];
        else weights[square][piece.color === 'w' ? 'attacked' : 'defended'] += pieceValues[currPiece.role];
      }
    }

    return weights;
  };

  const getMoveEffect = (move: AnalysisMove, index: number) => {
    const previousMe = moveEffects.current[index - 1];
    const sw = getSquareWeights(move);
    const me: MoveEffects = { squareWeights: sw, effects: [] };
    const c = new Chess(move.move.after);

    if (!previousMe) {
      moveEffects.current.push(me);
      return;
    }

    for (const square of SQUARES) {
      const previousSw = previousMe.squareWeights[square];
      const piece = c.get(square);

      if (!piece) continue;

      if (move.move.to === square || move.move.from === square) continue;

      const previousAttackedDefendedDelta = previousSw.attacked - previousSw.defended;
      const attackedDelta = sw[square].attacked - previousSw.attacked;
      const defendedDelta = sw[square].defended - previousSw.defended;

      if (
        sw[square].defended === 0 &&
        sw[square].attacked > 0 &&
        attackedDelta > 0 &&
        piece.color === c.turn() &&
        piece.type !== 'k'
      ) {
        me.effects.push({
          square,
          move: move.move,
          piece: piece.type,
          color: piece.color,
          type: CommentType.AttackUndefendedPiece,
        });
      }

      if (
        previousAttackedDefendedDelta > 0 &&
        defendedDelta > 0 &&
        move.move.to !== square &&
        move.move.from !== square &&
        piece.color !== c.turn()
      ) {
        me.effects.push({
          square,
          move: move.move,
          piece: piece.type,
          color: piece.color,
          type: CommentType.ReinforcesPiece,
        });
      }
    }

    moveEffects.current.push(me);
  };

  const getMoveEffects = () => {
    if (!analysis) return;

    moveEffects.current = [];
    analysis.moves.map(getMoveEffect);
    console.log(moveEffects.current);
  };

  useEffect(() => {
    getMoveEffects();
  }, [analysis]);

  useEffect(() => {
    const customHighlights = new Map(chessGround?.state.highlight.custom?.entries());

    for (const square of SQUARES) {
      const pressure =
        moveEffects.current[currentMove - 1]?.squareWeights[square].attacked -
        moveEffects.current[currentMove - 1]?.squareWeights[square].defended;

      if (pressure > 0) {
        customHighlights.set(square, `pressure-${pressure}`);
      }
    }

    chessGround?.set({
      highlight: { custom: customHighlights },
    });
  }, [currentMove]);

  return (
    <div className="flex flex-col h-full gap-6 p-6 bg-pressure-6">
      <span className="font-semibold">Interpretation</span>

      {previousMove && (
        <div className="flex flex-col gap-2">
          {moveEffects.current[currentMove - 1].effects.map((effect, index) => {
            switch (effect.type) {
              case CommentType.AttackUndefendedPiece:
                return <AttackUndefendedPiece key={index} {...effect} />;
              case CommentType.ReinforcesPiece:
                return <ReinforcesPiece key={index} {...effect} />;
              case CommentType.ControlsCenter:
                return <p key={index}>Controls center</p>;
            }
          })}
        </div>
      )}
    </div>
  );
};
