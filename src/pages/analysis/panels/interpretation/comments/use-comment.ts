import { useAnalysisStore } from '@/store/analysis';
import { useRef } from 'react';
import { Key } from 'chessground/types';
import { MoveEffect } from '@/types/interpretation.ts';

type InterpretationCommentProps = {
  moveEffect: MoveEffect;
  color: string;
  type: 'shape' | 'highlight';
};

export const useInterpretationComment = ({ moveEffect: { square, move }, color, type }: InterpretationCommentProps) => {
  const chessGround = useAnalysisStore((state) => state.chessGround);
  const customHighlights = useRef(new Map<Key, string>(chessGround?.state.highlight.custom?.entries()));
  const autoShapes = useRef(chessGround?.state.drawable.autoShapes);

  const handlePointerEnter = () => {
    if (type === 'highlight') {
      const currentCustomHighlights = new Map<Key, string>(chessGround?.state.highlight.custom?.entries());
      customHighlights.current = new Map<Key, string>(chessGround?.state.highlight.custom?.entries());
      currentCustomHighlights.set(square as Key, color);

      chessGround?.set({
        highlight: { custom: currentCustomHighlights },
      });
    } else if (type === 'shape') {
      const currentAutoShapes = chessGround?.state.drawable.autoShapes || [];
      autoShapes.current = [...(chessGround?.state.drawable.autoShapes || [])];
      currentAutoShapes?.push({
        orig: move.to,
        dest: square,
        brush: color,
      });

      chessGround?.set({
        drawable: { autoShapes: currentAutoShapes },
      });
    }
  };

  const handlePointerLeave = () => {
    if (type === 'highlight') {
      chessGround?.set({
        highlight: { custom: customHighlights.current },
      });
    } else if (type === 'shape') {
      chessGround?.set({
        drawable: { autoShapes: autoShapes.current },
      });
    }
  };

  return {
    handlePointerEnter,
    handlePointerLeave,
  };
};
