import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export enum TutorialStep {
  DASHBOARD = 0,
  START_ANALYSIS = 1,
  ANALYSIS = 2,
  DONE,
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  tutorialStep: TutorialStep;
  setTutorialStep: (tutorialStep: TutorialStep) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUser: (user: User) => void;
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
      user: null,
      tutorialStep: TutorialStep.DASHBOARD,
      setTutorialStep: (tutorialStep: TutorialStep) => set({ tutorialStep }),
      setAccessToken: (accessToken: string) => set({ accessToken }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
      setUser: (user: User) => set({ user }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
