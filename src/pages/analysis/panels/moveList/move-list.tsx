import { useAnalysisStore } from '@/store/analysis.ts';
import { Button } from '@/components/ui/button';
import { Color } from 'chess.js';
import {
  classificationToTailwindColor,
  shouldDisplayClassificationInMoveHistory,
} from '@/pages/analysis/classifications.ts';
import { cn } from '@/lib/utils.ts';

export const MoveList = () => {
  const { analysis, chess, chessGround, currentMove, setCurrentMove } = useAnalysisStore();

  const handleSkipToMove = (index: number) => {
    const moves = chess.history();

    for (let i = 0; i < moves.length; i++) {
      chess.undo();
    }

    for (let i = 0; i < index; i++) {
      chess.move(analysis!.moves[i].move);
    }

    chessGround?.set({
      fen: chess.fen(),
    });
    setCurrentMove(index);
    chessGround?.redrawAll();
  };

  const toPieceNotation = (move: string, color: Color): string => {
    if (color === 'w') {
      move = move.replace('N', '♞');
      move = move.replace('B', '♝');
      move = move.replace('R', '♜');
      move = move.replace('Q', '♛');
      move = move.replace('K', '♚');
      move = move.replace('P', '♟');

      return move;
    }

    move = move.replace('N', '♘');
    move = move.replace('B', '♗');
    move = move.replace('R', '♖');
    move = move.replace('Q', '♕');
    move = move.replace('K', '♔');
    move = move.replace('P', '♙');

    return move;
  };

  return (
    <div className="flex max-h-full gap-1 p-6 flex-wrap overflow-y-scroll custom-scrollbar">
      {analysis?.moves.map((move, index) => (
        <Button
          key={index}
          className={cn(
            'flex gap-2 p-1 h-max',
            currentMove === index + 1 && 'underline font-bold bg-castled-accent/15',
          )}
          variant="ghost"
          onClick={() => handleSkipToMove(index + 1)}
        >
          {index % 2 == 0 && <span>{Math.floor(index / 2) + 1}.</span>}
          <span
            className={cn(
              'text-sm',
              move.classification &&
                shouldDisplayClassificationInMoveHistory[move.classification] &&
                classificationToTailwindColor[move.classification],
            )}
          >
            {toPieceNotation(move.move.san, move.move.color)}
          </span>
        </Button>
      ))}
    </div>
  );
};
