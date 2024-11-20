import { CurrentUser } from '../data/model.ts';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AuthStoreState = {
  access?: string;
  refresh?: string;
  user?: CurrentUser;
};

type AuthStoreActions = {
  login: (value: { user: CurrentUser; access: string; refresh: string }) => void;
  refreshToken: (access: string) => void;
  isAuthenticated: () => boolean;
};

type AuthStore = AuthStoreState & AuthStoreActions;

const useAuthStore = create(
  devtools(
    persist<AuthStore>(
      (set, get) => ({
        login: ({ user, access, refresh }) => set({ user, access, refresh }),
        refreshToken: (access) => set({ access }),
        isAuthenticated: () => !!get().access
      }),
      {
        name: 'auth'
      }
    )
  )
);

export default useAuthStore;
