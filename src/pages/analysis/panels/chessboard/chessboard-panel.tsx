import { Evalbar } from '@/components/evalbar/evalbar.tsx';
import { PlayerInfo } from '@/components/playerinfo/playerinfo.tsx';
import { AnalysisChessboard } from '@/components/chessboard/analysis-chessboard.tsx';
import { useAnalysisStore } from '@/store/analysis.ts';
import { Controls } from '@/pages/analysis/panels/controls/controls.tsx';
import './chessboard-panel.css';

/**
 * ChessboardPanel component renders the main analysis panel for a chess game.
 * It includes the evaluation bar, chessboard, and player information.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage example
 * <ChessboardPanel />
 *
 * @remarks
 * This component uses the `useAnalysisStore` hook to retrieve the analysis data,
 * current move, and board orientation. It conditionally renders player information
 * based on the orientation and analysis data.
 *
 * @see Evalbar
 * @see PlayerInfo
 * @see AnalysisChessboard
 */
export const ChessboardPanel = () => {
  const { analysis, currentMove, orientation } = useAnalysisStore();

  return (
    <div className="flex h-full w-full items-center justify-center p-0 lg:p-6 relative">
      <div className="h-full flex flex-col w-full">
        <div className="flex gap-2 lg:gap-6 items-center justify-center flex-grow relative chessboard-panel-inner">
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
              <div className="mb-2">
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
              <div className="mt-2 relative">
                <PlayerInfo
                  player={{
                    username: orientation === 'white' ? analysis.header.White : analysis.header.Black,
                    rating: orientation === 'white' ? analysis.header.WhiteElo : analysis.header.BlackElo,
                  }}
                />
                <div className="lg:flex hidden absolute top-0 w-1/2 right-0">
                  <Controls />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
