import { Chessboard } from '@/components/chessboard/chessboard.tsx';
import { useEffect, useState } from 'react';
import { DrawShape } from 'chessground/draw';
import { useAnalysisStore } from '@/store/analysis.ts';
import { PlayerInfo } from '@/components/playerinfo/playerinfo.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Evalbar } from '@/components/evalbar/evalbar.tsx';
import { AnalysisMoveClassification } from '@/types/analysis.ts';

import brilliantRaw from '@/assets/icons/analysis/brilliant.svg?raw';
import goodRaw from '@/assets/icons/analysis/good.svg?raw';
import interestingRaw from '@/assets/icons/analysis/interesting.svg?raw';
import inaccuracyRaw from '@/assets/icons/analysis/inaccuracy.svg?raw';
import mistakeRaw from '@/assets/icons/analysis/mistake.svg?raw';
import blunderRaw from '@/assets/icons/analysis/blunder.svg?raw';
import { Key } from 'chessground/types';

const classificationToGlyph = {
  [AnalysisMoveClassification.Brilliant]: brilliantRaw,
  [AnalysisMoveClassification.Good]: goodRaw,
  [AnalysisMoveClassification.Interesting]: interestingRaw,
  [AnalysisMoveClassification.Inaccuracy]: inaccuracyRaw,
  [AnalysisMoveClassification.Mistake]: mistakeRaw,
  [AnalysisMoveClassification.Blunder]: blunderRaw,
};

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

    const previousMove = analysis!.moves[current - 1];
    const currentMove = analysis!.moves[current];

    if (!previousMove) return;

    const autoShapes: DrawShape[] = previousMove.engineResults.map((result, index) => ({
      orig: result.from,
      dest: result.to,
      brush: 'blue',
      modifiers: {
        lineWidth: 10 + (2.5 * index) / (previousMove.engineResults.length - 1),
        opacity: 0.2 + (0.1 * index) / (previousMove.engineResults.length - 1),
      },
    })) as DrawShape[];

    if (currentMove.classification && currentMove.classification !== AnalysisMoveClassification.None) {
      autoShapes.push({
        orig: previousMove.move.to as Key,
        customSvg: {
          html: classificationToGlyph[currentMove.classification as keyof typeof classificationToGlyph],
        },
      });
    }

    chessGround?.set({
      highlight: {
        custom: new Map<Key, string>([
          [previousMove.move.from as Key, 'orange'],
          [previousMove.move.to as Key, 'orange'],
        ]),
      },
      drawable: { autoShapes: autoShapes },
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
