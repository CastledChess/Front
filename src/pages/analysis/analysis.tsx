import { Chessboard } from '@/components/chessboard/chessboard.tsx';
import { useEffect, useState } from 'react';
import { DrawShape } from 'chessground/draw';
import { useAnalysisStore } from '@/store/analysis.ts';
import { PlayerInfo } from '@/components/playerinfo/playerinfo.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Evalbar } from '@/components/evalbar/evalbar.tsx';

export const Analysis = () => {
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
    if (current >= analysis!.moves.length) return;

    const searchResults = analysis!.moves[current].engineResults;

    chessGround?.set({
      drawable: {
        autoShapes: searchResults.map((result, index) => ({
          orig: result.from,
          dest: result.to,
          brush: 'blue',
          modifiers: {
            lineWidth: 10 + (2.5 * index) / (searchResults.length - 1),
            opacity: 0.2 + (0.1 * index) / (searchResults.length - 1),
          },
        })) as DrawShape[],
      },
    });
  }, [current]);

  return (
    <div className="w-full h-full flex gap-6 justify-center p-4">
      <Evalbar
        winChance={analysis!.moves[current]?.engineResults?.[0]?.winChance ?? 50}
        evaluation={analysis!.moves[current]?.engineResults?.[0]?.eval ?? 0}
      />
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
