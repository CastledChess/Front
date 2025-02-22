import { MoveEffect } from '@/types/interpretation.ts';
import { pieceSymbolToPieceName } from '@/lib/interpretation.ts';
import { useInterpretationComment } from '@/pages/analysis/panels/interpretation/comments/use-comment.ts';

export const AttackUndefendedPiece = (props: MoveEffect) => {
  const { handlePointerEnter, handlePointerLeave } = useInterpretationComment({
    moveEffect: props,
    highlight: 'red',
  });

  return (
    <p>
      Attacks an{' '}
      <span
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="bg-castled-accent/10 p-1 rounded cursor-pointer hover:bg-castled-accent/20"
      >
        undefended {pieceSymbolToPieceName[props.piece]} on {props.square}
      </span>
    </p>
  );
};
