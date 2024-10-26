import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Analysis } from '@/types/analysis.ts';
import { Api } from 'chessground/api';
import { Chess } from 'chess.js';

interface AnalysisState {
  analysis: Analysis | null;
  chess: Chess;
  chessGround: Api | null;
  setChessGround: (chessGround: Api) => void;
  setAnalysis: (analysis: Analysis | null) => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      analysis: null,
      chess: new Chess(),
      chessGround: null,
      setAnalysis: (analysis) => set({ analysis }),
      setChessGround: (chessGround) => set({ chessGround }),
    }),
    {
      name: 'analysis',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ analysis: state.analysis }),
    },
  ),
);
