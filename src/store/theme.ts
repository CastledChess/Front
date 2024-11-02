import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  pieceTheme: string;
  setPieceTheme: (pieceTheme: string) => void;
  boardTheme: string;
  setBoardTheme: (boardTheme: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      pieceTheme: 'cburnett',
      setPieceTheme: (pieceTheme) => set({ pieceTheme }),
      boardTheme: 'wood',
      setBoardTheme: (boardTheme) => set({ boardTheme }),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
