import { useAnalysisStore } from '@/store/analysis.ts';
import { HTMLProps, useMemo, useRef } from 'react';
import { queryPosition } from '@/api/database.ts';
import { DrawShape } from 'chessground/draw';
import { cn } from '@/lib/utils.ts';
import { useQuery } from '@tanstack/react-query';
import { isBrowser } from 'react-device-detect';

type DatabaseMove = {
  san: string;
  position: string;
  white: number;
  draw: number;
  black: number;
};

type RafinedDatabaseMove = DatabaseMove & {
  whitePercent: number;
  drawPercent: number;
  blackPercent: number;
  total: number;
};

/**
 * The `Database` component is responsible for displaying chess moves from a database
 * and their statistics. It fetches the moves based on the current position in the chess game
 * and displays them in a table format. Each move shows the total number of times it has been played
 * and the percentage of outcomes (white win, draw, black win).
 *
 * The component also highlights the move on the chessboard when the user hovers over a move in the table.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <Database />
 *
 * @remarks
 * This component uses the `useAnalysisStore` hook to access the chess game state and the chessboard.
 * It also uses the `queryPosition` function to fetch the moves from the database.
 *
 * @hook
 * - `useAnalysisStore` - Retrieves the current chess game state and chessboard instance.
 * - `useState` - Manages the state of the database moves.
 * - `useMemo` - Memoizes the list of moves based on the current position.
 * - `useEffect` - Fetches the moves from the database whenever the position changes.
 *
 * @function handleQueryPosition
 * Fetches the moves from the database based on the current position and updates the state.
 *
 * @function handleDisplayMoveArrow
 * Highlights the move on the chessboard when the user hovers over a move in the table.
 *
 * @function handleClearMoveArrow
 * Clears the highlighted move on the chessboard when the user stops hovering over a move in the table.
 */
export const Database = () => {
  const { chess, chessGround } = useAnalysisStore();
  const autoShapes = useRef<DrawShape | null>(null);

  const moves = useMemo(() => chess.moves({ verbose: true }), [chess.fen()]);

  const handleQueryPosition = async () =>
    new Promise<RafinedDatabaseMove[]>(async (resolve) => {
      try {
        const { data } = (await queryPosition(chess.fen())) as { data: DatabaseMove[] };

        if (!data) resolve([]);

        const moves = data
          .map((m: DatabaseMove) => {
            const total = m.white + m.draw + m.black;

            return {
              ...m,
              total,
              whitePercent: m.white / total,
              drawPercent: m.draw / total,
              blackPercent: m.black / total,
            } as RafinedDatabaseMove;
          })
          .sort((a, b) => (a.total < b.total ? 1 : -1));

        resolve(moves);
      } catch (err) {
        console.error(err);
        resolve([]);
      }
    });

  const { isPending, data: databaseMoves } = useQuery({
    queryKey: ['elitedb', chess.fen()],
    queryFn: handleQueryPosition,
  });

  const handleDisplayMoveArrow = (san: string) => {
    const move = moves.find((move) => move.san === san);

    if (!move) return;

    autoShapes.current = {
      orig: move.from,
      dest: move.to,
      brush: 'yellow',
    };

    chessGround?.setAutoShapes([
      ...chessGround.state.drawable.autoShapes.filter((shape) => shape.label?.text !== 'databaseMoveArrow'),
      autoShapes.current,
    ]);
  };

  const handleClearMoveArrow = () => {
    chessGround?.setAutoShapes(
      chessGround.state.drawable.autoShapes.filter(
        (shape) => shape.orig !== autoShapes.current?.orig && shape.dest !== autoShapes.current?.dest,
      ),
    );
  };

  return (
    <div className="flex h-full overflow-y-scroll custom-scrollbar flex-col w-full">
      <table className="w-full">
        <thead>
          <tr className="text-sm text-castled-gray">
            <th className="text-left p-1 lg:pl-6 whitespace-nowrap w-auto font-light">Move</th>
            <th className="text-left p-1 whitespace-nowrap w-auto font-light">Total</th>
            <th className="text-left p-1 pr-6 font-light">White/Draw/Black</th>
          </tr>
        </thead>
        <tbody>
          {databaseMoves?.length === 0 && !isPending && (
            <tr>
              <td className="p-1 lg:pl-6 text-accent-foreground whitespace-nowrap w-1 font-light text-castled-gray text-xs">
                No data available
              </td>
            </tr>
          )}
          {isPending
            ? new Array(10).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse h-[26px]">
                  <td className="p-1 lg:pl-6 w-1">
                    <div className=" h-4 bg-white/10 rounded-xl" />
                  </td>
                  <td className="p-1 w-1">
                    <div className="h-4 bg-white/10 rounded-xl" />
                  </td>
                  <td className="p-1 pr-6 w-full">
                    <div className="h-4 bg-white/10 rounded-xl" />
                  </td>
                </tr>
              ))
            : databaseMoves?.map((move) => (
                <tr
                  key={move.san}
                  className="animate-fade-in hover:bg-white/10 cursor-default"
                  onPointerEnter={() => isBrowser && handleDisplayMoveArrow(move.san)}
                  onClick={() => (handleClearMoveArrow(), handleDisplayMoveArrow(move.san))}
                  onPointerLeave={() => isBrowser && handleClearMoveArrow()}
                >
                  <td className="p-1 lg:pl-6 text-accent-foreground whitespace-nowrap w-1 font-light text-castled-gray text-xs">
                    {move.san}
                  </td>
                  <td className="p-1 text-accent-foreground whitespace-nowrap w-1 font-light text-castled-gray text-xs">
                    {new Intl.NumberFormat().format(move.total)}
                  </td>
                  <td className="p-1 lg:pr-6">
                    <div className="flex w-full overflow-hidden rounded-xl border">
                      <MoveRepartition amount={move.whitePercent} className="bg-white text-background" />
                      <MoveRepartition amount={move.drawPercent} className="bg-primary text-background" />
                      <MoveRepartition amount={move.blackPercent} className="bg-secondary text-foreground" />
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

const MoveRepartition = ({ amount, className = '', ...props }: { amount: number } & HTMLProps<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'bg-secondary h-4 justify-center flex overflow-hidden text-foreground text-xs items-center',
        className,
      )}
      {...props}
      style={{ width: `${amount * 100}%` }}
    >
      {Math.round(amount * 1000) / 10}%
    </span>
  );
};
