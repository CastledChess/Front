import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  pieceTheme: string;
  boardTheme: string;
  animationSpeed: string;
  setPieceTheme: (pieceTheme: string) => void;
  setBoardTheme: (boardTheme: string) => void;
  setAnimationSpeed: (animationSpeed: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      pieceTheme: 'cburnett',
      boardTheme: 'grey',
      animationSpeed: '250',
      setPieceTheme: (pieceTheme) => set({ pieceTheme }),
      setBoardTheme: (boardTheme) => set({ boardTheme }),
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
