import { create } from 'zustand';
import { Analysis } from '@/types/analysis.ts';

interface HistoryState {
  analyses: Analysis[];
  setAnalyses: (analyses: Analysis[] | ((analyses: Analysis[]) => Analysis[])) => void;
}

export const useHistoryState = create<HistoryState>((set) => ({
  analyses: [],
  setAnalyses: (analyses) =>
    set((state) => ({
      analyses: typeof analyses === 'function' ? analyses(state.analyses) : analyses,
    })),
}));
