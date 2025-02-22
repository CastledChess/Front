import { useAnalysisStore } from '@/store/analysis';
import { useRef } from 'react';
import { Key } from 'chessground/types';
import { MoveEffect } from '@/types/interpretation.ts';

type InterpretationCommentProps = {
  moveEffect: MoveEffect;
  highlight: string;
};

export const useInterpretationComment = ({ moveEffect: { square }, highlight }: InterpretationCommentProps) => {
  const chessGround = useAnalysisStore((state) => state.chessGround);
  const customHighlights = useRef(new Map<Key, string>(chessGround?.state.highlight.custom?.entries()));

  const handlePointerEnter = () => {
    const currentCustomHighlights = new Map<Key, string>(chessGround?.state.highlight.custom?.entries());
    customHighlights.current = new Map<Key, string>(chessGround?.state.highlight.custom?.entries());
    currentCustomHighlights.set(square as Key, highlight);

    chessGround?.set({
      highlight: { custom: currentCustomHighlights },
    });
  };

  const handlePointerLeave = () => {
    chessGround?.set({
      highlight: { custom: customHighlights.current },
    });
  };

  return {
    handlePointerEnter,
    handlePointerLeave,
  };
};
