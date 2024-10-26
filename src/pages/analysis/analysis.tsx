import { Chessboard } from '@/components/chessboard/chessboard.tsx';
import { useEffect, useState } from 'react';
import { DrawShape } from 'chessground/draw';
import { useAnalysisStore } from '@/store/analysis.ts';
import { useNavigate } from 'react-router-dom';
import { PlayerInfo } from '@/components/playerinfo/playerinfo.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
    if (current >= analysis!.moves.length) return;

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
    <div className="w-full h-full flex gap-6 justify-center p-4">
      <div className="h-full flex flex-col gap-4">
        {analysis && (
          <PlayerInfo
            player={{
              username: analysis.header.Black,
              rating: analysis.header.BlackElo,
            }}
          />
        )}
        <Chessboard />
        {analysis && (
          <PlayerInfo
            player={{
              username: analysis.header.White,
              rating: analysis.header.WhiteElo,
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-10 bg-primary/5 p-6 rounded-lg w-96">
        <div className="flex gap-6 justify-center mt-auto">
          <Button onClick={handlePrevMove} variant="ghost">
            <ArrowLeft />
          </Button>
          <Button onClick={handleNextMove} variant="ghost">
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
