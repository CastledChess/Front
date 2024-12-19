import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Analysis } from '@/types/analysis.ts';
import { Api } from 'chessground/api';
import { Chess } from 'chess.js';

interface AnalysisState {
  analysis: Analysis | null;
  chess: Chess;
  currentMove: number;
  chessGround: Api | null;
  setCurrentMove: (currentMove: number) => void;
  setChessGround: (chessGround: Api) => void;
  setAnalysis: (analysis: Analysis | null) => void;
  clear: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      analysis: null,
      currentMove: 0,
      chess: new Chess(),
      chessGround: null,
      setAnalysis: (analysis) => set({ analysis }),
      setChessGround: (chessGround) => set({ chessGround }),
      setCurrentMove: (currentMove) => set({ currentMove }),
      clear: () =>
        set({
          analysis: null,
          currentMove: 0,
          chess: new Chess(),
          chessGround: null,
        }),
    }),
    {
      name: 'analysis',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ analysis: state.analysis }),
    },
  ),
);
