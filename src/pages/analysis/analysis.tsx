import { Chessboard } from '@/components/chessboard/chessboard.tsx';
import { useEffect, useState } from 'react';
import { DrawShape } from 'chessground/draw';
import { useAnalysisStore } from '@/store/analysis.ts';
import { PlayerInfo } from '@/components/playerinfo/playerinfo.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Evalbar } from '@/components/evalbar/evalbar.tsx';
import { AnalysisMoveClassification } from '@/types/analysis.ts';

import bestRaw from '@/assets/icons/analysis/classification-best.svg?raw';
import excellentRaw from '@/assets/icons/analysis/classification-excellent.svg?raw';
import goodRaw from '@/assets/icons/analysis/classification-good.svg?raw';
import inaccuracyRaw from '@/assets/icons/analysis/classification-inaccuracy.svg?raw';
import mistakeRaw from '@/assets/icons/analysis/classification-mistake.svg?raw';
import blunderRaw from '@/assets/icons/analysis/classification-blunder.svg?raw';
import { Key } from 'chessground/types';
import { Keys, useHotkey } from '@/hooks/useHotkey.ts';

const classificationToGlyph = {
  [AnalysisMoveClassification.Best]: bestRaw,
  [AnalysisMoveClassification.Excellent]: excellentRaw,
  [AnalysisMoveClassification.Good]: goodRaw,
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

    const bestMoves = previousMove.engineResults
      .sort((a, b) => b.depth - a.depth)
      .filter((result, index, self) => self.findIndex((r) => r.move === result.move) === index)
      .slice(0, analysis?.variants ?? 1);

    const autoShapes: DrawShape[] = bestMoves.map((result) => ({
      orig: result.from,
      dest: result.to,
      brush: 'blue',
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

  useHotkey(Keys.RightArrow, 0, handleNextMove);
  useHotkey(Keys.LeftArrow, 0, handlePrevMove);

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
