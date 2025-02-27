import { useAnalysisStore } from '@/store/analysis.ts';
import { useEffect, useRef, useState } from 'react';
import { Chess, Piece, Square, SQUARES } from 'chess.js';
import { parseFen } from 'chessops/fen';
import { attacks, makeSquare, parseSquare } from 'chessops';
import { AnalysisMove } from '@/types/analysis.ts';
import { RoleType, PieceRoles, SquareWeights, PieceRolesRecord, AllPieceRoles, Reason } from '@/types/interpretation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button.tsx';
import { pieceColorToColorName, pieceSymbolToPieceName } from '@/lib/interpretation.ts';
import { DrawShape } from 'chessground/draw';
import { SquareHighlight } from '@/components/squareHighlight/square-highlight.tsx';

const pieceValues = {
  p: 5,
  n: 4,
  b: 4,
  r: 3,
  q: 2,
  k: 1,
};

export const Interpretation = () => {
  const { currentMove, analysis, chess, chessGround } = useAnalysisStore();
  const previousMove = analysis!.moves[currentMove - 1];
  const [pieceRoles, setPieceRoles] = useState<PieceRoles[]>([]);
  const customAutoShapes = useRef<DrawShape[]>(structuredClone(chessGround?.state.drawable.autoShapes) || []);

  const getPieceRoleSentence = (role: AllPieceRoles) => {
    switch (role.type) {
      case RoleType.SupportsPiece:
        return (
          <span className="flex gap-2 items-center flex-wrap">
            Supports the {pieceColorToColorName[role.toPiece.color]} {pieceSymbolToPieceName[role.toPiece.type]} on{' '}
            <SquareHighlight className="bg-castled-accent/10 rounded" square={role.toSquare}>
              {role.toSquare}
            </SquareHighlight>{' '}
            that is being {role.reason.type} by the {pieceColorToColorName[role.reason.piece.color]}{' '}
            {pieceSymbolToPieceName[role.reason.piece.type]} on
            <SquareHighlight square={role.reason.square}>{role.reason.square}</SquareHighlight>
          </span>
        );
      case RoleType.XRaysPiece:
        return (
          <span className="flex gap-2 items-center">
            X-Rays the {pieceColorToColorName[role.toPiece.color]} {pieceSymbolToPieceName[role.toPiece.type]} on{' '}
            <SquareHighlight square={role.toSquare}>{role.toSquare}</SquareHighlight>
          </span>
        );
      default:
        return null;
    }
  };

  const getRoles = (move: AnalysisMove) => {
    const c = new Chess(move.move.after);

    const pr: PieceRoles = {
      squareWeights: Array.from(SQUARES).reduce((acc, curr) => {
        acc[curr] = { attacked: 0, controlledWhite: 0, controlledBlack: 0, defended: 0 };
        return acc;
      }, {} as SquareWeights),
      roles: {} as PieceRolesRecord,
    };

    const splittedFen = c.fen().split(' ');

    const xRayedPieces = new Map<Square, { square: Square; piece: Piece }>();
    const attackedPieces = new Map<Square, { square: Square; piece: Piece }>();

    for (const color of ['w', 'b']) {
      splittedFen[1] = color;
      const position = parseFen(splittedFen.join(' ')).unwrap();

      for (const fromSquare of SQUARES) {
        const fromSquareIndex = parseSquare(fromSquare);
        const fromPiece = position.board.get(fromSquareIndex);

        if (!fromPiece) continue;

        const raysUnoccupied = attacks(fromPiece, fromSquareIndex, position.board.pawn);
        const raysOccupied = attacks(fromPiece, fromSquareIndex, position.board.occupied);
        const xRays = raysUnoccupied.diff(raysOccupied);

        if ((color === 'b' && fromPiece.color === 'white') || (color === 'w' && fromPiece.color === 'black')) {
          for (const toSquareIndex of xRays) {
            const toSquare = makeSquare(toSquareIndex);
            const toPiece = c.get(toSquare);
            const fromPiece = c.get(fromSquare);

            if (!toPiece) continue;

            if (toPiece.color === color) {
              xRayedPieces.set(toSquare, { square: fromSquare, piece: fromPiece });

              pr.roles[fromSquare] = [
                ...(pr.roles[fromSquare] || []),
                {
                  type: RoleType.XRaysPiece,
                  fromSquare,
                  toSquare,
                  fromPiece,
                  toPiece,
                },
              ];
            }
          }

          for (const toSquareIndex of raysOccupied) {
            const toSquare = makeSquare(toSquareIndex);
            const toPiece = c.get(toSquare);
            const fromPiece = c.get(fromSquare);

            if (!toPiece) continue;

            if (toPiece.color === color) {
              attackedPieces.set(toSquare, { square: fromSquare, piece: fromPiece });
            }
          }
        }
      }
    }

    for (const color of ['w', 'b']) {
      splittedFen[1] = color;
      const position = parseFen(splittedFen.join(' ')).unwrap();

      for (const fromSquare of SQUARES) {
        const fromSquareIndex = parseSquare(fromSquare);
        const fromPiece = position.board.get(fromSquareIndex);

        if (!fromPiece) continue;

        const raysOccupied = attacks(fromPiece, fromSquareIndex, position.board.occupied);

        if ((color === 'b' && fromPiece.color === 'white') || (color === 'w' && fromPiece.color === 'black')) continue;

        for (const toSquareIndex of raysOccupied) {
          const toSquare = makeSquare(toSquareIndex);
          const toPiece = c.get(toSquare);
          const fromPiece = c.get(fromSquare);

          if (!toPiece) pr.squareWeights[toSquare].controlledWhite += pieceValues[fromPiece.type];
          else {
            pr.squareWeights[toSquare][toPiece.color !== color ? 'attacked' : 'defended'] +=
              pieceValues[fromPiece.type];
          }

          const isXRayed = xRayedPieces.get(toSquare);
          const isAttacked = attackedPieces.get(toSquare);

          if (toPiece.color === color && toPiece.type !== 'k') {
            if (isXRayed) {
              pr.roles[fromSquare] = [
                ...(pr.roles[fromSquare] || []),
                {
                  type: RoleType.SupportsPiece,
                  fromSquare,
                  toSquare,
                  fromPiece,
                  toPiece,
                  reason: { type: Reason.XRayed, ...isXRayed },
                },
              ];
            }
            if (isAttacked) {
              pr.roles[fromSquare] = [
                ...(pr.roles[fromSquare] || []),
                {
                  type: RoleType.SupportsPiece,
                  fromSquare,
                  toSquare,
                  fromPiece,
                  toPiece,
                  reason: { type: Reason.Attacked, ...isAttacked },
                },
              ];
            }
          }
        }
      }
    }

    setPieceRoles((prev) => [...prev, pr]);
  };

  const getMovesRoles = () => {
    if (!analysis) return;

    setPieceRoles([]);
    analysis.moves.map(getRoles);
  };

  useEffect(() => {
    getMovesRoles();
  }, [analysis]);

  const handlePointerEnterRole = ({ fromSquare, toSquare }: AllPieceRoles) => {
    if (!chessGround) return;

    customAutoShapes.current = structuredClone(chessGround.state.drawable.autoShapes);
    const newCustomAutoShapes = structuredClone(chessGround.state.drawable.autoShapes);

    newCustomAutoShapes.push({
      orig: fromSquare,
      dest: toSquare,
      brush: 'blue',
    });

    chessGround.setAutoShapes(newCustomAutoShapes);
  };

  const handlePointerLeaveRole = () => chessGround?.setAutoShapes(customAutoShapes.current);

  return (
    <div className="flex flex-col h-full gap-6 p-6 bg-pressure-6">
      <span className="font-semibold">Interpretation</span>

      {previousMove && (
        <div className="flex flex-col gap-2 overflow-y-auto h-full custom-scrollbar">
          {pieceRoles[currentMove - 1]?.roles &&
            Object.entries(pieceRoles[currentMove - 1].roles).map(([square, roles]) => {
              const piece = chess.get(square as Square);

              if (!piece) return null;

              return (
                <Collapsible key={square}>
                  <CollapsibleTrigger asChild>
                    <Button variant="link" className="p-0" size="sm">
                      The {pieceColorToColorName[piece.color]} {pieceSymbolToPieceName[piece.type]} on {square}...
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="p-2 space-y-2 bg-castled-secondary border-l-4 border-foreground/10 rounded-l ml-2">
                    <ul>
                      {roles.map((role, index) => (
                        <li
                          key={role.toSquare + index}
                          onPointerLeave={handlePointerLeaveRole}
                          onPointerEnter={() => handlePointerEnterRole(role)}
                          className="hover:bg-castled-primary/50 text-sm cursor-default flex"
                        >
                          {getPieceRoleSentence(role)}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
        </div>
      )}
    </div>
  );
};
