import { useAnalysisStore } from '@/store/analysis';
import { useRef } from 'react';
import { Square } from 'chess.js';
import { cn } from '@/lib/utils.ts';

type SquareHighlightProps = React.HTMLProps<HTMLDivElement> & {
  square: Square;
};

export const SquareHighlight = ({ square, className, ...props }: SquareHighlightProps) => {
  const { chessGround } = useAnalysisStore();
  const customHighlights = useRef(chessGround?.state.highlight.custom);

  const handlePointerEnterRole = (square: Square) => {
    if (!chessGround) return;

    customHighlights.current = structuredClone(chessGround.state.highlight.custom);
    const newCustomHighlights = structuredClone(chessGround.state.highlight.custom) || new Map();

    newCustomHighlights.set(square, 'blue');

    chessGround?.set({ highlight: { custom: newCustomHighlights } });
  };

  const handlePointerLeaveRole = () => chessGround?.set({ highlight: { custom: customHighlights.current } });
  return (
    <div
      onMouseEnter={() => handlePointerEnterRole(square)}
      onMouseLeave={handlePointerLeaveRole}
      className={cn('bg-primary/10 p-1 rounded', className)}
      {...props}
    />
  );
};
