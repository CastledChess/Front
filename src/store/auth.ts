import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export enum TutorialStep {
  WELCOME = 'welcome',
  NAVIGATE_TO_NEW_ANALYSIS = 'navigateToNewAnalysis',
  IMPORT_PGN = 'importPgn',
  ANALYZE = 'startAnalysis',
  VIEW_ANALYSIS = 'viewAnalysis',
  VIEW_HISTORY = 'viewHistory',
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUser: (user: User) => void;
  hasSeenTutorial: boolean;
  tutorialStep: TutorialStep;
  setTutorialStep: (tutorialStep: TutorialStep) => void;
  setHasSeenTutorial: (hasSeenTutorial: boolean) => void;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  username: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      hasSeenTutorial: false,
      user: null,
      tutorialStep: TutorialStep.WELCOME,
      setAccessToken: (accessToken: string) => set({ accessToken }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
      setUser: (user: User) => set({ user }),
      setHasSeenTutorial: (hasSeenTutorial: boolean) => set({ hasSeenTutorial }),
      setTutorialStep: (tutorialStep: TutorialStep) => set({ tutorialStep }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          hasSeenTutorial: false,
          tutorialStep: TutorialStep.WELCOME,
        }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
