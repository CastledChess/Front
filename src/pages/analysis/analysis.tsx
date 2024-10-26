import { Chessboard } from '@/components/chessboard/chessboard.tsx';
import { useEffect, useState } from 'react';
import { DrawShape } from 'chessground/draw';
import { useAnalysisStore } from '@/store/analysis.ts';
import { useNavigate } from 'react-router-dom';

export const Analysis = () => {
  const navigate = useNavigate();
  const { analysis, chess, chessGround } = useAnalysisStore();
  const [current, setCurrent] = useState(0);

  const handleNextMove = () => {
    if (current >= analysis!.moves.length) return;

    chess.move(analysis!.moves[current].move);
    chessGround?.set({
      fen: chess.fen(),
    });

    setCurrent(current + 1);
  };

  const handlePrevMove = () => {
    if (current <= 0) return;

    chess.undo();
    chessGround?.set({
      fen: chess.fen(),
    });

    setCurrent(current - 1);
  };

  useEffect(() => {
    if (!analysis) navigate('/start-analysis');

    const searchResults = analysis!.moves[current].engineResults;

    chessGround?.set({
      drawable: {
        autoShapes: [
          {
            orig: searchResults.from,
            dest: searchResults.to,
            brush: 'blue',
          },
        ] as DrawShape[],
      },
    });
  }, [current]);

  return (
    <div className="w-full h-full flex gap-20 justify-center">
      <div className="h-full flex flex-col gaNextp-4 p-4">
        {/*<PlayerInfo player={blackPlayer} />*/}
        <Chessboard />
        {/*<PlayerInfo player={whitePlayer} />*/}
      </div>

      <div className="flex flex-col gap-10">
        <button type="button" onClick={handlePrevMove}>
          Prev
        </button>
        <button type="button" onClick={handleNextMove}>
          Next
        </button>
      </div>
    </div>
  );
};
