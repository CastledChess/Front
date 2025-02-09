import { create } from 'zustand';

interface MoveListState {
  displayLine: boolean;
  currentLineMove: number;
  setCurrentLineMove: (currentLineMove: number) => void;
  setDisplayLine: (displayLine: boolean) => void;
}

export const useMoveListState = create<MoveListState>((set) => ({
  displayLine: false,
  currentLineMove: 0,
  setCurrentLineMove: (currentLineMove) => set({ currentLineMove }),
  setDisplayLine: (displayLine) => set({ displayLine }),
}));
